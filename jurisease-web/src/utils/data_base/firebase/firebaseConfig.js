import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

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

export const addDocument = async (path, file) => {
  console.log("addDocument:", file);

  // Verificar se o arquivo possui conteúdo
  if (!file || !file.uri) {
    console.error("O arquivo está vazio ou não contém conteúdo.");
    return;
  }

  try {
    // Enviar o conteúdo do arquivo para o Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef(storage, `${path}/${file.name}`), file);

    uploadTask.on('state_changed',
      (snapshot) => {
        // Monitorar o progresso do upload, se necessário
      },
      (error) => {
        console.error("Erro durante o upload:", error);
      },
      async () => {
        try {
          // Obter a URL de download após o upload
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("URL de download:", url);

        } catch (error) {
          console.error("Erro ao obter a URL de download:", error);
        }
      }
    );
  } catch (error) {
    console.error("Erro ao enviar o arquivo para o Firebase Storage:", error);
  }
};





