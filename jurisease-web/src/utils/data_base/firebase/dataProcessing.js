import Usuario from "./modals/user.ts";

export function createUserByData (data) {
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
  