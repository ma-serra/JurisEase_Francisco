import { set, remove, update, onValue } from 'firebase/database';

import { generateCustomID, getCurrentFormattedDate } from '../../tools';
import { getRef } from './firebaseConfig'


export const  addHeadline = async (headlineData) => {

    const headlineID = generateCustomID("headline");
    headlineData.id = headlineID
    headlineData.create = getCurrentFormattedDate();
    const headlineRef = await getRef(`headlines/${headlineID}`);
  
    console.log('addHeadline:', headlineData)
  
    set(headlineRef, headlineData)
      .then(() => {
        console.log('Serviço adicionado com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao adicionar serviço: ', error);
      });
  }
  
  export const removeHeadline = async (headlineId) => {
    console.log('removeHeadline:', headlineId)
  
    const headlineRef = await getRef(`headlines/${headlineId}`);
    remove(headlineRef)
      .then(() => {
        console.log('Serviço removido com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao remover serviço: ', error);
      });
  }
  
  export const getHeadlines = async (callback) => {
    const headlinesRef = await getRef('headlines');
  
    onValue(headlinesRef, (snapshot) => {
      const headlinesData = snapshot.val();
      if (headlinesData) {
        callback(Object.values(headlinesData));
      }
    });
  }
  
  export const updateHeadline = async (headlineData) => {
    console.log('updateHeadline')
    headlineData.update = getCurrentFormattedDate();
    console.log("id: " + headlineData.id)
    console.log('data:', headlineData)
  
    const headlineRef = await getRef(`headlines/${headlineData.id}`);
  
    try {
      update(headlineRef, headlineData);
      console.log("Serviço atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar o serviço:", error);
    }
  };
  