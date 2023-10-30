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

export const handleFirebaseError = async (error) => {
  switch (error) {
    case 'auth/weak-password':
      return 'A senha deve ser mais forte e segura. Tente incluir letras maiúsculas, minúsculas, números e caracteres especiais.';
    case 'auth/email-already-in-use':
      return 'Este e-mail já está sendo usado por outra conta. Por favor, escolha outro e-mail.';
    case 'auth/invalid-login-credentials':
      return 'Credenciais de login inválidas. Verifique seu e-mail e senha.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado. Por favor, verifique o e-mail inserido.';
    case 'auth/wrong-password':
      return 'Senha incorreta. Por favor, tente novamente.';
    case 'auth/invalid-email':
      return 'E-mail inválido. Certifique-se de inserir um e-mail válido.';
    default:
      return 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.';
  }
}