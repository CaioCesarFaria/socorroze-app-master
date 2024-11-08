// src/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage';




const firebaseConfig = {
  apiKey: "AIzaSyDINzemr7rGzfl_QCVGjr9y14MvBxZ-81c",
  authDomain: "socorrozeapp.firebaseapp.com",
  projectId: "socorrozeapp",
  storageBucket: "socorrozeapp.firebasestorage.app",
  messagingSenderId: "720655632417",
  appId: "1:720655632417:web:0f24a15488f1ae25f87b60",
  measurementId: "G-6HXR5W2LYZ"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// perscistencia
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), 
});

// Inicializa o Firestore
const db = getFirestore(app); 

export { app, auth, db }; 
