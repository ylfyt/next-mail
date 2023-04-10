import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyBv0c_eJybFyEZ6rRwYoAc8G6PaGkSUrAU',
	authDomain: 'next-email-df515.firebaseapp.com',
	projectId: 'next-email-df515',
	storageBucket: 'next-email-df515.appspot.com',
	messagingSenderId: '271624546688',
	appId: '1:271624546688:web:eb515212ca7023137eb965',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
