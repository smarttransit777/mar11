import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAtEBPCdClOfCewMbylWd_Us9Ps4Svf9LI",
    authDomain: "smart-transit-67924.firebaseapp.com",
    projectId: "smart-transit-67924",
    storageBucket: "smart-transit-67924.firebasestorage.app",
    messagingSenderId: "213557277357",
    appId: "1:213557277357:web:94671d9c11bc3fccc54c24"
  };
  

 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);
 
 
 export { auth, app , db};
