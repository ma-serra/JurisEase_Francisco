import html2pdf from 'html2pdf.js';
import { functions } from './functions';

const htmlDocx = require('html-docx-js/dist/html-docx');
const { Blob } = require('blob-polyfill');
const { format, isAfter } = require('date-fns');
const { ptBR } = require('date-fns/locale');

// wid  lef - rig - top      
// PDF  612 - 72 - 73 - 76
// Word 610 - 72 - 74 - 76
// App  612 - 73 - 74 - 77

export async function gerarDOC(htmlString) {
	return new Promise((resolve, reject) => {
		try {
			const html = htmlDocx.asBlob(generateCSSToDocument(htmlString));
			const blob = new Blob([html], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'saida.docx';
			document.body.appendChild(a);
			a.click();

			resolve('Documento gerado e baixado com sucesso');
		} catch (error) {
			reject(error);
		}
	});
}

export async function gerarPDF(htmlString) {
	// Adiciona CSS para evitar quebra de parágrafos
	const html = generateCSSToDocument(htmlString)

	const opt = {
		margin: [0.8, 0.6, 0.5, 0.6], // top, left, down, rigth
		filename: 'saida.pdf',
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
	};

	html2pdf().from(html).set(opt).toPdf().save('saida.pdf');
}

export function generateCSSToDocument(htmlString) {

	// Adiciona as classes de estilo ao texto HTML
	const novoHTML = `
	<meta charset="UTF-8">
    <style>
      .content * {
        text-align: left;
        color: black;
        margin: 0;
        margin-top: 0.5cm;
        margin-bottom: 0.5cm;
        font-size: 12pt;
        text-align: justify;
      }

	  .content p {
        text-align: justify;
        margin: 0;
        font-size: 12pt;
      }

      .content h1 {
		text-align: justify;
		font-size: 18pt;
      }

      .content h2 {
		text-align: justify;
		font-size: 18pt;
      }

      .content h3 {
		text-align: justify;
		font-size: 16pt;
      }

	  .content h4 {
		text-align: justify;
        font-size: 14pt;
      }

	  .content p, .content div {
		page-break-inside: avoid;
	  }
    </style>
      
    <div class="content">
      ${htmlString}
    </div>
  `;

	return novoHTML;
}

export function normalizeText(text) {
	if (text === undefined || text === null) {
		return '';
	}

	if (Array.isArray(text)) {
		// Mapeia cada elemento do array para seu equivalente normalizado
		const normalizedArray = text.map(element => normalizeElement(element));
		// Une os elementos normalizados em uma única string separada por espaços
		return normalizedArray.join(' ');
	}

	// Se não for um array, trata como uma única string e normaliza
	return normalizeElement(text);
}

function normalizeElement(element) {
	return element
		.toLowerCase() // Converter para minúsculas
		.normalize("NFD") // Normalizar caracteres (remover acentos)
		.replace(/[\u0300-\u036f]/g, ""); // Remover diacríticos
}

export function extractKeys(texto) {
	// Expressão regular para encontrar todas as chaves no formato {{chave}}
	const regex = /{{(.*?)}}/g;
	const chaves = [];
	let match;

	// Enquanto houver correspondências da expressão regular no texto, extraia as chaves
	while ((match = regex.exec(texto)) !== null) {
		// O grupo de captura match[1] contém o nome da chave sem os delimitadores {{ }}
		chaves.push(match[1]);
	}

	// Retornar um array com as chaves extraídas
	return chaves;
}

const extractParamValues = (id, param, updatedForm) => {
	const values = [];

	if (param.type === 'value') {
		values.push(param.value);

	} else if (param.type === 'key') {
		const value = updatedForm[param.value];
		if (value) {
			values.push(value);
		}

	} else if (param.type === 'contains') {
		const keys = Object.keys(updatedForm).filter(k => k.includes(param.value));
		keys.forEach(k => {
			if(id !== k) {
				const value = updatedForm[k]
				if (value) {
					values.push(value);
				}
			}
		});

	} else if (param.type === 'start with') {
		const keys = Object.keys(updatedForm).filter(k => k.startsWith(param.value));
		keys.forEach(k => {
			if(id !== k) {
				const value = updatedForm[k]
				if (value) {
					values.push(value);
				}
			}
		});

	} else if (param.type === 'end with') {
		const keys = Object.keys(updatedForm).filter(k => k.endsWith(param.value));
		keys.forEach(k => {
			if(id !== k) {
				const value = updatedForm[k]
				if (value) {
					values.push(value);
				}
			}
		});
	}

	return values;
};

export const verifyFuncs = (templates, updatedForm) => {
	templates.forEach(template => {
		const keysFuncs = template?.keys?.filter(key => key.type === 'function') || [];

		keysFuncs.forEach(key => {
			const { operation, params: paramList } = key.function;
			const params = [];

			paramList.forEach(param => {
				const paramValues = extractParamValues(key.id, param, updatedForm);
				params.push(...paramValues);
			});

			let result;
			try {
				result = functions[operation].execute(params);
			} catch (e) {
				result = '';
			}

			updatedForm[key.id] = result;
		});
	});
};

export function generateCustomID(prefix) {
	const timestamp = new Date().getTime();
	const randomString = Math.random().toString(36).substring(2, 12);
	const customID = `${prefix}_${timestamp}_${randomString}`;
	return customID;
}

export function formatString(inputString) {
	// Remove caracteres especiais usando uma expressão regular
	const stringWithoutSpecialChars = inputString.replace(/[^\w\s]/gi, '');

	// Substitui espaços por "_"
	const formattedString = stringWithoutSpecialChars.replace(/\s+/g, '_');

	return formattedString;
}

export function getCurrentFormattedDate() {
	const currentDate = new Date();

	const options = {
		weekday: 'short',
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short'
	};

	const formattedDate = currentDate.toLocaleString('pt-BR', options);

	return formattedDate;
}

export function getFormattedDate(date) {
	const currentDate = new Date(date);

	const options = {
		weekday: 'short',
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short'
	};

	const formattedDate = currentDate.toLocaleString('pt-BR', options);

	return formattedDate;
}

export function convertDateToPtBr(dateOrTimestamp) {

	try {
		let date;
		date = new Date(dateOrTimestamp);

		const ptBrDate = format(date, "dd/MM/yyyy HH:mm:ss", { locale: ptBR });
		return ptBrDate;

	} catch (e) {
		return dateOrTimestamp
	}

}

export function validarOAB(oab) {
    // Lista de estados válidos
    const estadosValidos = ["AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

    // Expressão regular para validar o formato
    const regex = /^([A-Z]{2})\s?(\d{1,6})$/i;

    // Verifica o formato
    const match = oab.match(regex);
    if (!match) {
        return "Formato inválido - ex: CE 1045";
    }

    // Extrai o estado e o número
    const estado = match[1].toUpperCase();
    const numero = match[2];

    // Verifica se o estado é válido
    if (!estadosValidos.includes(estado)) {
        return "Estado inválido - ex: CE 1045";
    }

    // Se passar todas as verificações
    return true;
}

const CryptoJS = require('crypto-js');
const secretKey = 'JurisEase@2018';

/**
 * Função para criar um hash de senha
 * @param {string} password - A senha a ser criptografada
 * @returns {string} - O hash criptografado da senha
 */
export async function encryptPassword(password) {
	const encryptedData = CryptoJS.AES.encrypt(password, secretKey);
	return encryptedData.toString();
}

export function removeObjetosVazios(lista) {
	return lista.filter(objeto => typeof objeto === 'object');
}

export function isEmptyObject(obj) {
	return Object.keys(obj).length === 0;
}

export function translateName(key) {
	const translationDict = {
		"lawyer": "Advogado",
		"client": "Cliente",
	};

	return translationDict[key] || "Translation not found";
}

export function checkBlocked(user) {
	const dateNow = new Date();
	const expirationDate = new Date(user.expirationDate);

	if (!expirationDate || isAfter(dateNow, expirationDate)) {
		user.state = "blocked";
	} else {
		user.state = "active";
	}
}

export function compareArrays(array1, array2) {
	// Verifica se os arrays têm o mesmo comprimento
	if (array1.length !== array2.length) {
		return false;
	}

	// Ordena os arrays para garantir a comparação correta
	const sortedArray1 = array1.slice().sort();
	const sortedArray2 = array2.slice().sort();

	// Verifica se cada elemento é o mesmo nos dois arrays
	for (let i = 0; i < sortedArray1.length; i++) {
		if (sortedArray1[i] !== sortedArray2[i]) {
			return false;
		}
	}

	// Se chegou até aqui, os arrays são iguais
	return true;
}

export const expireAccess = (inputDate) => {
	// Converte a data atual para um objeto Date e zera as horas, minutos, segundos e milissegundos
	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Converte a data de entrada para um objeto Date
	const dateToCheck = new Date(inputDate);

	// Compara as datas
	return dateToCheck < today;
};

// Função para obter um identificador único do dispositivo
function getDeviceId() {
    // Gere um identificador único do dispositivo, por exemplo, usando um UUID
    // Aqui, estou usando um UUID simples para demonstração
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
}

// Função para gerar um UUID (identificador único universal)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Verifica se o dispositivo atual é o mesmo que o último acessado
function checkDevice() {
    const storedDeviceId = localStorage.getItem('lastDeviceId');
    const currentDeviceId = getDeviceId();

    if (storedDeviceId && storedDeviceId !== currentDeviceId) {
        // Se o dispositivo atual for diferente do armazenado, faça logout
        // Aqui você pode implementar sua lógica de logout
        alert('Você está acessando de um dispositivo diferente. Você será desconectado.');
        // Implemente sua lógica de logout aqui, como redirecionar para a página de login ou limpar os cookies de autenticação.
    }

    // Armazena o ID do dispositivo atual para a próxima verificação
    localStorage.setItem('lastDeviceId', currentDeviceId);
}