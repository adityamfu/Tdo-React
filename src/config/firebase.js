import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB7SgNGB6kZ-eTf0cANGDinWMEJ3fj0tbU',
  authDomain: 'tdo-react.firebaseapp.com',
  projectId: 'tdo-react',
  storageBucket: 'tdo-react.appspot.com',
  messagingSenderId: '149815512278',
  appId: '1:149815512278:web:e7469c685a7772d1140d77',
  measurementId: 'G-0B2BFJSZE6',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
