import Usuario from "./modals/user.ts";

export function generateCustomID(prefix) {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 12);
    const customID = `${prefix}_${timestamp}_${randomString}`;
    return customID;
}

export function getCurrentFormattedDate() {
    const currentDate = new Date();
  
    const formattedDate = currentDate.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  
    return formattedDate;
}

export function createUserByData(data) {
  console.log('createUserByData:')
  console.log(data)

  const { uid, accessToken, email, password, metadata, phoneNumber, address, name, type, oab, acessAdmin } = data;
  const missingFields = [];

  if (!uid) {
    missingFields.push('uid');
  }
  if (!accessToken) {
    missingFields.push('accessToken');
  }
  if (!email) {
    missingFields.push('email');
  }
  if (!password) {
    missingFields.push('password');
  }
  if (!metadata) {
    missingFields.push('metadata');
  }
  if (!name) {
    missingFields.push('name');
  }
  if (!type) {
    missingFields.push('type');
  }
  

  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios não fornecidos: ${missingFields.join(', ')}`);
  }

  const user = new Usuario(
    uid,
    accessToken,
    email,
    password, // Lembre-se de armazenar senhas com segurança
    metadata || {
      creationTime: 'timestamp1',
      lastSignInTime: 'timestamp2',
    },
    phoneNumber || '', // Valor padrão vazio se phoneNumber não for fornecido
    address || '', // Valor padrão vazio se address não for fornecido
    name,
    type,
    oab,
    acessAdmin || false,
  );

  return user;
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

  // Verifique se a senha descriptografada corresponde à senha inserida
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return inputPassword === decryptedData;
}

