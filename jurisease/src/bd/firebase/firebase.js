import { getDatabase, ref, set, get, exists } from "firebase/database";
import { initializeApp } from "firebase/app";
import { generateCustomID } from '../../util/tools'

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
const db = getDatabase(app, 'https://juris-ease-default-rtdb.asia-southeast1.firebasedatabase.app');


export function addServiceToDatabase(serviceData) {

  const serviceID = generateCustomID("service");
  const serviceRef = ref(db, `services/${serviceID}`);

  set(serviceRef, serviceData)
    .then(() => {
      console.log('Serviço adicionado com sucesso.');
    })
    .catch((error) => {
      console.error('Erro ao adicionar serviço: ', error);
    });
}

export async function getServices() {
  console.log('getServices')
  const servicesRef = ref(db, 'services');

  try {
    const snapshot = await get(servicesRef);

    if (snapshot.exists()) {
      const servicesData = snapshot.val();
      console.log('encontrei')
      return servicesData;
    } else {
      console.log('Nenhum dado encontrado')
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return null;
  }
}

export function addHeadlineToDatabase(headlineData) {
  const headlineID = generateCustomID("headline");
  const headlineRef = ref(db, `headlines/${headlineID}`);

  set(headlineRef, headlineData)
    .then(() => {
      console.log('Manchete adicionada com sucesso.');
    })
    .catch((error) => {
      console.error('Erro ao adicionar manchete: ', error);
    });
}

export async function getHeadlines() {
  console.log('getHeadlines')
  const headlineRef = ref(db, 'headlines');

  try {
    const snapshot = await get(headlineRef);

    if (snapshot.exists()) {
      const HeadlineData = snapshot.val();
      console.log('encontrei')
      return HeadlineData;
    } else {
      console.log('Nenhum dado encontrado')
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar serviços:', error);
    return null;
  }
}
