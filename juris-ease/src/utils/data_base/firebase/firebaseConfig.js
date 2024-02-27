import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDc7A5qpg8VAGX6UVRrwM4GJ-dX8LGcIVg",
  authDomain: "juris-ease.firebaseapp.com",
  databaseURL: "https://juris-ease-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "juris-ease",
  storageBucket: "juris-ease.appspot.com",
  messagingSenderId: "176940973307",
  appId: "1:176940973307:web:7757870eb1b05cdff9c45e",
  measurementId: "G-SKGK11TTQZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const storage = getStorage(app);

export const getAuthentication = async () => {
  return auth;
}

export const getRef = async (url) => {
  return ref(db, url);
}

export const addDocument = async (path, doc) => {
  try {
    // Verificar se o arquivo possui conteúdo
    if (!doc || !doc.file) {
      return { error: "O arquivo está vazio ou não contém conteúdo." };
    }

    // Enviar o conteúdo do arquivo para o Firebase Storage
    const uploadTaskSnapshot = await uploadBytesResumable(storageRef(storage, `${path}/${doc.name}`), doc.file);

    // Obter a URL de download após o upload
    const url = await getDownloadURL(uploadTaskSnapshot.ref);

    // Adicione o URL de download ao documento
    doc.link_download = url;

    return { url: url };
  } catch (error) {
    return { error: "Erro ao enviar o arquivo para o Firebase Storage: " + error };
  }
}

export const searchDocument = async (url) => {
  const fileRef = storage.refFromURL(url);

  // Baixa o URL do arquivo
  fileRef.getDownloadURL()
    .then((url) => {
      // Use o URL para fazer o que quiser, como abrir em uma nova janela ou fazer o download
      window.open(url);
    })
    .catch((error) => {
      console.error("Erro ao obter URL de download:", error);
    });
}
