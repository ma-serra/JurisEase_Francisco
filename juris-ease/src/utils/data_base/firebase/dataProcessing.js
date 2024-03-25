import User from "./modals/user.js";
import Service from "./modals/service.js";
import Headline from "./modals/headline.js";
import Template from "./modals/template.js";

export function createUserByData(data) {
  const createdAt = data.metadata.creationTime;
  const updatedAt = data.metadata.lastSignInTime || "";
  const lastLoginAt = data.metadata.lastLoginAt || "";
  const { uid, accessToken, email, phoneNumber, address, name, type, oab, acessAdmin, permissions, state } = data;
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
    createdAt,
    updatedAt,
    lastLoginAt,
    phoneNumber || '',
    address || [],
    name,
    type,
    oab,
    acessAdmin || false,
    permissions || {services: true, headlines: true, templates: false, document_generation: false, manege_users: false},
    state || 'Bloqueado'
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

export function createTemplateByData(data) {
  const { id, createdAt, updatedAt, title, rout, content, keys } = data;
  const missingFields = [];

  if (!id) {
    missingFields.push('id');
  }
  
  if (!title) {
    missingFields.push('title');
  }

  if (!content) {
    missingFields.push('content');
  }

  if (!rout) {
    missingFields.push('rout');
  }

  if (missingFields.length > 0) {
    throw new Error(`Campos obrigatórios não fornecidos: ${missingFields.join(', ')}`);
  }

  const template = new Template (
    id,
    createdAt,
    updatedAt || createdAt,
    title,
    content,
    rout,
    keys
  )
    
  return template;
}