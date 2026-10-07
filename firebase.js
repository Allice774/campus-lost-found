import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCVwI4iLoaF7Hw4URdqI91m6DyQlUcD328",
    authDomain: "campusfind-e6887.firebaseapp.com",
    projectId: "campusfind-e6887",
    storageBucket: "campusfind-e6887.firebasestorage.app",
    messagingSenderId: "1043213455950",
    appId: "1:1043213455950:web:aa001738753c23d088291f"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { app, db };