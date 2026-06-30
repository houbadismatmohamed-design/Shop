/*==================================================
 OK MOBILE
 Authentication
==================================================*/

import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";

/*==================================================
 DOM
==================================================*/

const loginModal = document.getElementById("loginModal");

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("adminEmail");

const passwordInput = document.getElementById("adminPassword");

const adminButton = document.getElementById("adminToggle");

const closeButton = document.getElementById("closeLogin");

/*==================================================
 OPEN LOGIN
==================================================*/

window.openLogin = function(){

    if(loginModal){

        loginModal.style.display = "flex";

    }

};

/*==================================================
 CLOSE LOGIN
==================================================*/

window.closeLogin = function(){

    if(loginModal){

        loginModal.style.display = "none";

    }

};

if(closeButton){

    closeButton.addEventListener("click",window.closeLogin);

}

window.addEventListener("click",(event)=>{

    if(event.target===loginModal){

        window.closeLogin();

    }

});
/*==================================================
 LOGIN
==================================================*/

if(loginForm){

    loginForm.addEventListener("submit", async (e)=>{

        e.preventDefault();

        try{

            await signInWithEmailAndPassword(

                auth,

                emailInput.value.trim(),

                passwordInput.value

            );

            localStorage.setItem("okmobile-admin","true");

            window.closeLogin();

            if(window.showToast){

                showToast("Login successful");

            }

        }

        catch(error){

            alert(error.message);

        }

    });

}

/*==================================================
 LOGOUT
==================================================*/

window.logout = async function(){

    try{

        await signOut(auth);

        localStorage.removeItem("okmobile-admin");

        location.reload();

    }

    catch(error){

        console.error(error);

    }

};
/*==================================================
 AUTH STATE
==================================================*/

onAuthStateChanged(auth,(user)=>{

    if(user){

        localStorage.setItem("okmobile-admin","true");

        if(adminButton){

            adminButton.style.display = "inline-flex";

        }

    }else{

        localStorage.removeItem("okmobile-admin");

        if(adminButton){

            adminButton.style.display = "none";

        }

    }

});

/*==================================================
 ADMIN PANEL
==================================================*/

if(adminButton){

    adminButton.addEventListener("click",()=>{

        window.location.href = "admin.html";

    });

}

/*==================================================
 AUTO LOGIN
==================================================*/

const savedSession = localStorage.getItem("okmobile-admin");

if(savedSession && adminButton){

    adminButton.style.display = "inline-flex";

}
/*==================================================
 CHECK ADMIN SESSION
==================================================*/

window.isAdminLogged = function(){

    return auth.currentUser !== null;

};

/*==================================================
 REQUIRE LOGIN
==================================================*/

window.requireAdmin = function(){

    if(!auth.currentUser){

        window.location.href = "index.html";

    }

};

/*==================================================
 INITIALIZE
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    if(window.location.pathname.endsWith("admin.html")){

        window.requireAdmin();

    }

});

/*==================================================
 EXPORTS
==================================================*/

export {

    auth

};
