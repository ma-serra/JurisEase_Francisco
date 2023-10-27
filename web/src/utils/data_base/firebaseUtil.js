import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, set, remove, update, onValue } from 'firebase/database';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { generateCustomID, getCurrentFormattedDate } from '../tools';


const firebaseConfig = {
  apiKey: "AIzaSyDc7A5qpg8VAGX6UVRrwM4GJ-dX8LGcIVg",
  authDomain: "juris-ease.firebaseapp.com",
  projectId: "juris-ease",
  storageBucket: "juris-ease.appspot.com",
  messagingSenderId: "176940973307",
  appId: "1:176940973307:web:7757870eb1b05cdff9c45e",
  measurementId: "G-SKGK11TTQZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app, 'https://juris-ease-default-rtdb.asia-southeast1.firebasedatabase.app');

export function addService(serviceData) {

  const serviceID = generateCustomID("service");
  serviceData.id = serviceID
  serviceData.create = getCurrentFormattedDate();
  const serviceRef = ref(db, `services/${serviceID}`);

  console.log('addService:', serviceData)

  set(serviceRef, serviceData)
    .then(() => {
      console.log('Serviço adicionado com sucesso.');
    })
    .catch((error) => {
      console.error('Erro ao adicionar serviço: ', error);
    });
}

export function removeService(serviceId) {
  console.log('removeService:', serviceId)

  const serviceRef = ref(db, `services/${serviceId}`);
  remove(serviceRef)
    .then(() => {
      console.log('Serviço removido com sucesso.');
    })
    .catch((error) => {
      console.error('Erro ao remover serviço: ', error);
    });
}

export function getServices(callback) {
  const servicesRef = ref(db, 'services');

  onValue(servicesRef, (snapshot) => {
    const servicesData = snapshot.val();
    if (servicesData) {
      callback(Object.values(servicesData));
    }
  });
}

export const updateService = (serviceData) => {
  console.log('updateService')
  serviceData.update = getCurrentFormattedDate();
  console.log("id: " + serviceData.id)
  console.log('data:', serviceData)

  const serviceRef = ref(db, `services/${serviceData.id}`);

  try {
    update(serviceRef, serviceData);
    console.log("Serviço atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar o serviço:", error);
  }
};

export function addHeadline(headlineData) {

  const headlineID = generateCustomID("headline");
  headlineData.id = headlineID
  headlineData.create = getCurrentFormattedDate();
  const headlineRef = ref(db, `headlines/${headlineID}`);

  console.log('addHeadline:', headlineData)

  set(headlineRef, headlineData)
    .then(() => {
      console.log('Serviço adicionado com sucesso.');
    })
    .catch((error) => {
      console.error('Erro ao adicionar serviço: ', error);
    });
}

export function removeHeadline(headlineId) {
  console.log('removeHeadline:', headlineId)

  const headlineRef = ref(db, `headlines/${headlineId}`);
  remove(headlineRef)
    .then(() => {
      console.log('Serviço removido com sucesso.');
    })
    .catch((error) => {
      console.error('Erro ao remover serviço: ', error);
    });
}

export function getHeadlines(callback) {
  const headlinesRef = ref(db, 'headlines');

  onValue(headlinesRef, (snapshot) => {
    const headlinesData = snapshot.val();
    if (headlinesData) {
      callback(Object.values(headlinesData));
    }
  });
}

export const updateHeadline = (headlineData) => {
  console.log('updateHeadline')
  headlineData.update = getCurrentFormattedDate();
  console.log("id: " + headlineData.id)
  console.log('data:', headlineData)

  const headlineRef = ref(db, `headlines/${headlineData.id}`);

  try {
    update(headlineRef, headlineData);
    console.log("Serviço atualizado com sucesso.");
  } catch (error) {
    console.error("Erro ao atualizar o serviço:", error);
  }
};

export const register = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    localStorage.setItem('authToken', user.accessToken);
    return user;
  } catch (error) {
    throw error; // Lança a exceção para que seja tratada no código que chama a função
  }
}

export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    localStorage.setItem('authToken', user.accessToken);
    return user;
  } catch (error) {
    throw error; // Lança a exceção para que seja tratada no código que chama a função
  }
}

export const logout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem('authToken');
  } catch (error) {
    throw error; // Lança a exceção para que seja tratada no código que chama a função
  }
}

export const isUserAuthenticated = () => {
  const authToken = localStorage.getItem('authToken');

  return !!authToken;
}