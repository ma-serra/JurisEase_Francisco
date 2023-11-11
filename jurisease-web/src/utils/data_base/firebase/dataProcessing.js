import User from "./modals/user.ts";
import Service from "./modals/service.ts";
import Headline from "./modals/headline.ts";

export function createUserByData(data) {
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

  const user = new User(
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

export function createServiceByData(data) {
  const { id, createdAt, updatedAt, image, link, title, description } = data;
  const missingFields = [];

  if (!id) {
    missingFields.push('id');
  }
  if (!image) {
    missingFields.push('image');
  }
  if (!link) {
    missingFields.push('link');
  }
  if (!title) {
    missingFields.push('title');
  }
  if (!description) {
    missingFields.push('description');
  }

  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios não fornecidos: ${missingFields.join(', ')}`);
  }

  const service = new Service (
    id,
    createdAt,
    updatedAt || createdAt,
    image,
    link,
    title,
    description,
  )
    
  return service;
}

export function createHeadlineByData(data) {
  const { id, createdAt, updatedAt, image, link, title, description } = data;
  const missingFields = [];

  if (!id) {
    missingFields.push('id');
  }
  if (!image) {
    missingFields.push('image');
  }
  if (!link) {
    missingFields.push('link');
  }
  if (!title) {
    missingFields.push('title');
  }
  if (!description) {
    missingFields.push('description');
  }

  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios não fornecidos: ${missingFields.join(', ')}`);
  }

  const headline = new Headline (
    id,
    createdAt,
    updatedAt || createdAt,
    image,
    link,
    title,
    description,
  )
    
  return headline;
}