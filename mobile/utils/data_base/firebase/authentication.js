import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

import { getAuthentication } from './firebaseConfig'

const auth = await getAuthentication()

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
      throw error;
    }
  }
  
  export const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('authToken');
    } catch (error) {
      throw error;
    }
  }
  
  export const isUserAuthenticated = () => {
    const authToken = localStorage.getItem('authToken');
  
    return !!authToken;
  }