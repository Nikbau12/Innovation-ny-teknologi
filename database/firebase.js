import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, inMemoryPersistence } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCNH7z566XNodLzLffOnpIBVYjnwTItJ2o",
    authDomain: "innt-7578d.firebaseapp.com",
    projectId: "innt-7578d",
    storageBucket: "innt-7578d.firebasestorage.app",
    messagingSenderId: "1010812931807",
    appId: "1:1010812931807:web:beb207e95053880f2a236a",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const rtdb = getDatabase(
    firebaseApp,
    "https://innt-7578d-default-rtdb.europe-west1.firebasedatabase.app"
);

export const auth = initializeAuth(firebaseApp, {
    persistence: inMemoryPersistence,
});
