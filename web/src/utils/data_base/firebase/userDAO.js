import { set, remove, update, onValue } from 'firebase/database';

import { getCurrentFormattedDate, createUserByData } from '../../tools';
import { getRef } from './firebaseConfig'

export const addUser = async (userData) => {

    const user = createUserByData(userData)
    const userRef = await getRef(`users/${userData.uid}`);
  
    console.log('addUser:', user)
  
    set(userRef, user)
      .then(() => {
        console.log('Usuario adicionado com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao adicionar usuario: ', error);
      });
  }
  
  export const removeUser = async (userId) => {
    console.log('removeUser:', userId)
  
    const userRef = await getRef(`users/${userId}`);
    remove(userRef)
      .then(() => {
        console.log('Serviço removido com sucesso.');
      })
      .catch((error) => {
        console.error('Erro ao remover serviço: ', error);
      });
  }
  
  export const getUsers = async (callback) => {
    const usersRef = await getRef('users');
  
    onValue(usersRef, (snapshot) => {
      const usersData = snapshot.val();
      if (usersData) {
        callback(Object.values(usersData));
      }
    });
  }
  
  export const updateUser = async (userData) => {
    console.log('updateUser')
    userData.update = getCurrentFormattedDate();
    console.log("id: " + userData.id)
    console.log('data:', userData)
  
    const userRef = await getRef(`users/${userData.id}`);
  
    try {
      update(userRef, userData);
      console.log("Serviço atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar o serviço:", error);
    }
  };