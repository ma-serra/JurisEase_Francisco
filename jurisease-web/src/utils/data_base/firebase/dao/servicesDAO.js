import { set, remove, update, onValue } from 'firebase/database';

import { generateCustomID, getCurrentFormattedDate } from '../../../tools';
import { getRef } from '../firebaseConfig'
import { createServiceByData } from '../dataProcessing';

export const addService = async (serviceData) => {

    const serviceID = generateCustomID("service");
    serviceData.id = serviceID
    serviceData.createdAt
    = getCurrentFormattedDate();

    const service = createServiceByData(serviceData)
    const serviceRef = await getRef(`services/${serviceID}`);
  
    console.log('serviceData.createdAt: ', serviceData.createdAt)
    console.log('addService:', service)
  
    set(serviceRef, service)
      .then(() => {
        console.log('Serviço adicionado com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao adicionar serviço: ', error);
      });
  }
  
  export const removeService = async (serviceId) => {
    console.log('removeService:', serviceId)
  
    const serviceRef = await getRef(`services/${serviceId}`);
    remove(serviceRef)
      .then(() => {
        console.log('Serviço removido com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao remover serviço: ', error);
      });
  }
  
  export const getServices = async (callback) => {
    const servicesRef = await getRef('services');
  
    onValue(servicesRef, (snapshot) => {
      const servicesData = snapshot.val();
      if (servicesData) {
        callback(Object.values(servicesData));
      }
    });
  }

  export const getService = async (id) => {
    const usersRef = await getRef(`services/${id}`);
  
    return new Promise((resolve, reject) => {
      onValue(usersRef, (snapshot) => {
        const userData = snapshot.val();
  
        if (userData) {
          resolve(userData);
        } else {
          reject('Usuário não encontrado');
        }
  
      });
    });
  }
  
  export const updateService = async (serviceData) => {
    console.log('updateService')
    serviceData.updatedAt = getCurrentFormattedDate();
    console.log("service: ", serviceData)
  
    const serviceRef = await getRef(`services/${serviceData.id}`);
  
    try {
      update(serviceRef, serviceData);
      console.log("Serviço atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar o serviço:", error);
    }
  };