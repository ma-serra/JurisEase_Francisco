import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';


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

export const getRef = async (url) => {
  return ref(db, url)
}

export const getAuthentication = async () => {
  return auth;
}