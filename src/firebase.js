
import { initializeApp } from "firebase/app";
import  { getAuth } from 'firebase/auth';
import { getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage';

// May need to hide these in production 
const firebaseConfig = {
    apiKey: "AIzaSyA1xk4xg-D7jvfMSB6eUu_YnBbHfzt8QCM",
    authDomain: "react-chat-app-7171d.firebaseapp.com",
    projectId: "react-chat-app-7171d",
    storageBucket: "react-chat-app-7171d.appspot.com",
    messagingSenderId: "246024372940",
    appId: "1:246024372940:web:1588e609575407d40cb869"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize authentication
  export const auth = getAuth(app);

  // Initialize firestore (database)
  export const db = getFirestore()

  // Initialize Storage
  export const storage = getStorage()
 