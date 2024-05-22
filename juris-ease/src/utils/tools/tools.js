import html2pdf from 'html2pdf.js';

const htmlDocx = require('html-docx-js/dist/html-docx');
const { Blob } = require('blob-polyfill');
const { format, isAfter } = require('date-fns');
const { ptBR } = require('date-fns/locale');

export async function gerarDOC(htmlString) {
	return new Promise((resolve, reject) => {
		try {
			const docx = htmlDocx.asBlob(htmlString);
			const blob = new Blob([docx], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

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
	const novoHTML = `
    <style>
        .page-break {
            page-break-before: always;
        }
        .avoid-break {
            page-break-inside: avoid;
        }
        p {
            page-break-inside: avoid;
            margin-bottom: 15px; /* Ajuste o espaçamento conforme necessário */
        }
    </style>
    <div>
      ${htmlString}
    </div>
  `;

	const opt = {
		margin: [0.5, 0.5, 0.5, 0.5], // Ajuste as margens conforme necessário
		filename: 'saida.pdf',
		image: { type: 'jpeg', quality: 0.98 },
		html2canvas: { scale: 2, useCORS: true },
		jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
	};

	html2pdf().from(novoHTML).set(opt).toPdf().save('saida.pdf');
}

export function refactoreHTMLtoPDF(htmlString) {
	console.log(htmlString)
	htmlString = htmlString.replace("<p>", '<p class="avoid-break">')
	htmlString = htmlString.replace("<h1>", '<h1 class="avoid-break">')
	htmlString = htmlString.replace("<h2>", '<h2 class="avoid-break">')
	htmlString = htmlString.replace("<h3>", '<h3 class="avoid-break">')
	// Adiciona as classes de estilo ao texto HTML
	const novoHTML = `
	<meta charset="UTF-8">
    <style>
      .content * {
        text-align: left;
        color: black;
        font-size: 12pt; /* Tamanho da fonte */
        line-height: 0.5cm; /* Espaçamento entre linhas */
      }

	  .content p {
        text-align: justify;
      }

      .content h1 {
        font-size: 24pt; /* Tamanho da fonte para h1 */
      }

      .content h2 {
        font-size: 18pt; /* Tamanho da fonte para h2 */
      }

      .content h3 {
        font-size: 16pt; /* Tamanho da fonte para h3 */
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
		chaves.push(match[0]);
	}

	// Retornar um array com as chaves extraídas
	return chaves;
}

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

export const validarOAB = (numeroOAB) => {
	const oabPattern = /^[A-Z]{2}\d{4,5}$/;

	if (oabPattern.test(numeroOAB)) {
		return true;
	} else {
		return false;
	}
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
