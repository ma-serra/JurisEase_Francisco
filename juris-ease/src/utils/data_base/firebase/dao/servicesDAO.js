import { set, remove, update, onValue } from 'firebase/database';

import { generateCustomID, getCurrentFormattedDate } from '../../../tools/tools';
import { getRef } from '../firebaseConfig'
import { createServiceByData } from '../dataProcessing';

export const addService = async (serviceData) => {

    const serviceID = generateCustomID("service");
    serviceData.id = serviceID
    serviceData.createdAt
    = getCurrentFormattedDate();

    const service = createServiceByData(serviceData)
    const serviceRef = await getRef(`services/${serviceID}`);
  
    set(serviceRef, service)
      .then()
      .catch((error) => {
        console.error('Erro ao adicionar serviço: ', error);
      });
  }
  
  export const removeService = async (serviceId) => {
  
    const serviceRef = await getRef(`services/${serviceId}`);
    remove(serviceRef)
      .then()
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
    const serviceRef = await getRef(`services/${id}`);
  
    return new Promise((resolve, reject) => {
      onValue(serviceRef, (snapshot) => {
        const serviceData = snapshot.val();
  
        if (serviceData) {
          resolve(serviceData);
        } else {
          reject('Serviço não encontrado');
        }
  
      });
    });
  }
  
  export const updateService = async (serviceData) => {
    serviceData.updatedAt = getCurrentFormattedDate();
    const serviceRef = await getRef(`services/${serviceData.id}`);
  
    try {
      update(serviceRef, serviceData);
    } catch (error) {
      console.error("Erro ao atualizar o serviço:", error);
    }
  };