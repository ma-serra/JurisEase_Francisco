import { set, remove, update, onValue } from 'firebase/database';

import { getCurrentFormattedDate, formatString } from '../../../tools/tools';
import { getRef } from '../firebaseConfig'
import { createTemplateByData } from '../dataProcessing';

export const addTemplate = async (templateData, type) => {
  
  const templateID = formatString(templateData.title);
  templateData.id = templateID
  templateData.createdAt = getCurrentFormattedDate();

  const template = createTemplateByData(templateData)
  const templateRef = await getRef(`templates/${type}/${templateID}`);

  try {
    await set(templateRef, template);

  } catch (error) {
    console.error('Erro ao adicionar template: ', error);
    throw error
  }
}

export const removeTemplate = async (templateId, type) => {
  const templateRef = await getRef(`templates/${type}/${templateId}`);
  remove(templateRef)
    .then(() => {
    })
    .catch((error) => {
      console.error('Erro ao remover template: ', error);
    });
}

export const getTemplates = async (callback, type) => {
const templatesRef = await getRef(`templates/${type}`);

  onValue(templatesRef, (snapshot) => {
    const templatesData = snapshot.val();
    if (templatesData) {
      callback(Object.values(templatesData));
    }
  });
}

export const getTemplate = async (id, type) => {
  const templatesRef = await getRef(`templates/${type}/${id}`);

  return new Promise((resolve, reject) => {
    onValue(templatesRef, (snapshot) => {
      const templateData = snapshot.val();

      if (templateData) {
        resolve(templateData);
      } else {
        reject('Template não encontrado');
      }

    });
  });
}

export const updateTemplate = async (templateData, type) => {
  templateData.updatedAt = getCurrentFormattedDate();
  const templatesRef = await getRef(`templates/${type}/${templateData.id}`);

  try {
    update(templatesRef, templateData);
    
  } catch (error) {
    console.error("Erro ao atualizar o template:", error);
  }
};