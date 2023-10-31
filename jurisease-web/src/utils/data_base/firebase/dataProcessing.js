import Usuario from "./modals/user.ts";

export function createUserByData (data) {
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
  } else if (!metadata.creationTime) {
    missingFields.push('metadata.createdAt');
  } else if (!metadata.lastSignInTime) {
    missingFields.push('metadata.lastLoginAt');
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
    password, 
    metadata.creationTime,
    metadata.lastSignInTime,
    phoneNumber || '', 
    address || '', 
    name,
    type,
    oab,
    acessAdmin || false,
  );
  
  return user;  
  }
  