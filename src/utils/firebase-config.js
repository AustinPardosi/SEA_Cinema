// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCYio3-KSaDDofaAXH0DovVdREq693eVWM",
  authDomain: "netflix-clone-project-fb972.firebaseapp.com",
  projectId: "netflix-clone-project-fb972",
  storageBucket: "netflix-clone-project-fb972.appspot.com",
  messagingSenderId: "571879099257",
  appId: "1:571879099257:web:3cae0e8a771c509f2bfda8",
  measurementId: "G-G2N6K5SJ8W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const firebaseAuth = getAuth(app)