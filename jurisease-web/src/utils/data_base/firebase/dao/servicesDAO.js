import { set, remove, update, onValue } from 'firebase/database';

import { generateCustomID, getCurrentFormattedDate } from '../../../tools';
import { getRef } from '../firebaseConfig'

export const addService = async (serviceData) => {

    const serviceID = generateCustomID("service");
    serviceData.id = serviceID
    serviceData.create = getCurrentFormattedDate();
    const serviceRef = await getRef(`services/${serviceID}`);
  
    console.log('addService:', serviceData)
  
    set(serviceRef, serviceData)
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
    serviceData.updateAt = getCurrentFormattedDate();
    console.log("id: " + serviceData.id)
    console.log('data:', serviceData)
  
    const serviceRef = await getRef(`services/${serviceData.id}`);
  
    try {
      update(serviceRef, serviceData);
      console.log("Serviço atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar o serviço:", error);
    }
  };