import mammoth from 'mammoth';
import html2pdf from 'html2pdf.js';

export function generateCustomID(prefix) {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 12);
    const customID = `${prefix}_${timestamp}_${randomString}`;
    return customID;
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

/**
 * Função para verificar se a senha fornecida corresponde ao hash armazenado
 * @param {string} inputPassword - A senha inserida pelo usuário
 * @param {string} storedPassword - O hash de senha armazenado
 * @returns {boolean} - true se as senhas corresponderem, false caso contrário
 */
export async function comparePassword(inputPassword, storedPassword) {
  const decryptedBytes = CryptoJS.AES.decrypt(storedPassword, secretKey);
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);

  return inputPassword === decryptedData;
}

export function removeObjetosVazios(lista) {
  return lista.filter(objeto => typeof objeto === 'object');
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

export async function convertDocToPdf(docFile) {
  try {
    // Convert DOC to HTML using mammoth.js
    const { value } = await mammoth.extractRawText({ arrayBuffer: docFile });
    
    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;

    // Convert HTML to PDF using html2pdf.js
    const pdfBlob = await html2pdf(tempDiv);
    return pdfBlob;
  } catch (error) {
    console.error('Error converting DOC to PDF:', error);
    // Lança um erro ou retorna um valor indicando erro
    throw new Error('Erro durante a conversão do DOC para PDF');
  }
}

export async function convertDocxToPdf(docxFile) {
  try {
    // Convert DOCX to HTML using mammoth.js
    const { value } = await mammoth.extractRawText({ arrayBuffer: docxFile });

    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = value;

    // Convert HTML to PDF using html2pdf.js
    const pdfBlob = await html2pdf().from(tempDiv).outputPdf('blob');

    // Verifique se pdfBlob é um Blob válido
    if (!(pdfBlob instanceof Blob)) {
      throw new Error('O objeto pdfBlob não é um Blob válido.');
    }

    // Crie o objeto no formato especificado
    const pdfObject = {
      name: 'converted-document.pdf',
      type: 'application/pdf',
      size: pdfBlob.size,
      uri: URL.createObjectURL(pdfBlob),
    };

    // Retorne o objeto criado
    return pdfObject;
  } catch (error) {
    console.error('Error converting DOCX to PDF:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}
