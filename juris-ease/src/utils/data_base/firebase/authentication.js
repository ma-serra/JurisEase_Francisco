import { sendPasswordResetEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getAuthentication } from './firebaseConfig'
import { getFirebaseErrorMessage } from './firebaseException'

let auth = await getAuthentication();

export async function recoverPassword(email) {
	console.log("recovery pass:", email)
	await sendPasswordResetEmail(auth, email).then(() => {
		alert('Email enviado com sucesso');

	}).catch(error => {
		alert(error.message)
		console.log(error)
	});
}

export const register = async (email, password) => {
	let data = {};
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		localStorage.setItem('uid', user.uid);

		data.user = user;
		data.message = 'Sucesso ao cadastrar usuario';
		return data;

	} catch (error) {
		console.log(error.code)
		const errorMessage = await getFirebaseErrorMessage(error.code);
		data.error = errorMessage;
		return data;
	}
}

export const signIn = async (email, password) => {
	let data = {};
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		localStorage.setItem('uid', user.uid);
		data.user = user;
		data.message = 'Sucesso ao realisar login';
		return data;

	} catch (error) {
		console.log(error.code)
		const errorMessage = await getFirebaseErrorMessage(error.code);
		data.error = errorMessage;
		return data;
	}
}

export const logout = async () => {
	try {
		await signOut(auth);
		localStorage.removeItem('uid');
	} catch (error) {
		throw error;
	}
}

export const isUserAuthenticated = () => {
	const uid = localStorage.getItem('uid');

	return uid;
}