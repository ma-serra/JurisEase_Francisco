import { set, remove, update, onValue } from 'firebase/database';

import { getCurrentFormattedDate } from '../../../tools/tools';
import { createUserByData } from '../../../data_base/firebase/dataProcessing';
import { getRef } from '../firebaseConfig'
import { get, query, orderByKey } from 'firebase/database';

export const getUsers = async () => {
    const usersRef = await getRef('users');
    const usersQuery = query(usersRef, orderByKey());

    try {
        const snapshot = await get(usersQuery);
        const users = [];

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const userData = childSnapshot.val();
                users.push(userData);
            });
        }

        return users;
    } catch (error) {
        console.error('Erro ao obter todos os usuários:', error);
        return [];
    }
};

export const addUser = async (userData) => {
  const user = createUserByData(userData)
  const userRef = await getRef(`users/${userData.uid}`);

  set(userRef, user)
    .then()
    .catch((error) => {
      console.error('Erro ao adicionar usuario: ', error);
    });
}

export const removeUser = async (userUID) => {

  const userRef = await getRef(`users/${userUID}`);
  remove(userRef)
    .then()
    .catch((error) => {
      console.error('Erro ao remover serviço: ', error);
    });
}

export const getUser = async (uid) => {
  const usersRef = await getRef(`users/${uid}`);

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

export const updateUser = async (user) => {

  user.updatedAt = getCurrentFormattedDate();
  const userRef = await getRef(`users/${user.uid}`);

  try {
    update(userRef, user);

  } catch (error) {
    console.error("Erro ao atualizar o usuario:", error);
  }
};