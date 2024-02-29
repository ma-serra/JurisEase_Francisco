import html2pdf from 'html2pdf.js';

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

export async function gerarPDF(htmlString) {
  return new Promise((resolve, reject) => {
    var opt = {
      margin:       0.5,
      filename:     'saida.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 1},
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf()
      .from(htmlString)
      .set(opt)
      .toPdf()
      .save('saida.pdf')
  });
}

export function refactoreHTMLtoPDF(htmlString) {
  // Adiciona as classes de estilo ao texto HTML
  const novoHTML = `
    <style>
      .content * {
        text-align: left;
        color: black;
        font-size: 12pt; /* Tamanho da fonte */
        line-height: 0.5cm; /* Espaçamento entre linhas */
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

  const formattedDate = currentDate.toLocaleString('en-US', options);

  return formattedDate;
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
