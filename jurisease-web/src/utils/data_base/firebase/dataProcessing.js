import User from "./modals/user.ts";
import Service from "./modals/service.ts";
import Headline from "./modals/headline.ts";

export function createUserByData(data) {
  const createdAt = data.metadata.creationTime;
  const updatedAt = data.metadata.lastSignInTime || "";
  const lastLoginAt = data.metadata.lastLoginAt || "";
  const { uid, accessToken, email, password, phoneNumber, address, name, type, oab, acessAdmin } = data;
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
  if (!name) {
    missingFields.push('name');
  }
  if (!type) {
    missingFields.push('type');
  }
  if (!createdAt) {
    missingFields.push('createdAt');
  }

  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios não fornecidos: ${missingFields.join(', ')}`);
  }

  const user = new User(
    uid,
    accessToken,
    email,
    password,
    createdAt,
    updatedAt,
    lastLoginAt,
    phoneNumber || '',
    address || [],
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