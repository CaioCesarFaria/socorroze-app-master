// src/firebaseConfig.js
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDINzemr7rGzfl_QCVGjr9y14MvBxZ-81c",
  authDomain: "socorrozeapp.firebaseapp.com",
  projectId: "socorrozeapp",
  storageBucket: "socorrozeapp.firebasestorage.app",
  messagingSenderId: "720655632417",
  appId: "1:720655632417:web:0f24a15488f1ae25f87b60",
  measurementId: "G-6HXR5W2LYZ"
};

// Inicializa o Firebase apenas se não estiver inicializado
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export default app;
