/*==================================================
OK MOBILE
Theme Manager
Loads theme colors from Firestore
==================================================*/

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/*=========================================
APPLY THEME
=========================================*/

function applyTheme(data) {

    if (!data) return;

    const root = document.documentElement;

    root.style.setProperty(
        "--primary",
        data.primaryColor || "#FF0000"
    );

    root.style.setProperty(
        "--secondary",
        data.secondaryColor || "#111111"
    );

    root.style.setProperty(
        "--accent",
        data.accentColor || "#FFA500"
    );

}

/*=========================================
LOAD THEME
=========================================*/

async function loadTheme() {

    try {

        const ref = doc(db, "settings", "main");

        const snap = await getDoc(ref);

        if (snap.exists()) {

            applyTheme(snap.data());

        }

    } catch (error) {

        console.error("Theme Error:", error);

    }

}

/*=========================================
REAL-TIME UPDATE
=========================================*/

const settingsRef = doc(db, "settings", "main");

onSnapshot(settingsRef, (snapshot) => {

    if (snapshot.exists()) {

        applyTheme(snapshot.data());

    }

});

/*=========================================
INITIALIZE
=========================================*/

loadTheme();