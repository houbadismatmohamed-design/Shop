/*==================================================
OK MOBILE
Firebase Configuration
==================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

const firebaseConfig = {

    apiKey: "AIzaSyCs_dPHKTD8Sn5YnCJyCIo91jKuVb-iQzY",

    authDomain: "ok-mobile-13.firebaseapp.com",

    projectId: "ok-mobile-13",

    storageBucket: "ok-mobile-13.firebasestorage.app",

    messagingSenderId: "880242162214",

    appId: "1:880242162214:web:00d7aa24c7ebdc278e04e7"

};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);

const storage = getStorage(app);

export {

    app,

    db,

    auth,

    storage

};
