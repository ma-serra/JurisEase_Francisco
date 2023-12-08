import { set, remove, update, onValue } from 'firebase/database';

import { generateCustomID, getCurrentFormattedDate } from '../../../tools/tools';
import { addDocument, getRef } from '../firebaseConfig'
import { createTemplateByData } from '../dataProcessing';

export const addTemplate = async (templateData) => {

  const templateID = generateCustomID("template");
  templateData.id = templateID
  templateData.createdAt = getCurrentFormattedDate();

  const template = createTemplateByData(templateData)
  const templateRef = await getRef(`templates/${templateID}`);

  console.log('templateData.createdAt: ', templateData.createdAt)
  console.log('addtemplate:', template)

  await addDocument("templates", templateData.doc)

  set(templateRef, template)
    .then(() => {
      console.log('Template adicionado com sucesso.');

      
    })
    .catch((error) => {
      console.error('Erro ao adicionar template: ', error);
    });
}

export const removeTemplate = async (templateId) => {
  console.log('removeTemplate:', templateId)

  const templateRef = await getRef(`templates/${templateId}`);
  remove(templateRef)
    .then(() => {
      console.log('Template removido com sucesso.');
    })
    .catch((error) => {
      console.error('Erro ao remover template: ', error);
    });
}

export const getTemplates = async (callback) => {
  const templatesRef = await getRef('templates');

  onValue(templatesRef, (snapshot) => {
    const templatesData = snapshot.val();
    if (templatesData) {
      callback(Object.values(templatesData));
    }
  });
}

export const getTemplate = async (id) => {
  const templatesRef = await getRef(`templates/${id}`);

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

export const updateTemplate = async (templateData) => {
  console.log('updateTemplate')
  templateData.updatedAt = getCurrentFormattedDate();
  console.log("template: ", templateData)

  const templatesRef = await getRef(`templates/${templateData.id}`);

  try {
    update(templatesRef, templateData);
    console.log("Template atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar o template:", error);
  }
};