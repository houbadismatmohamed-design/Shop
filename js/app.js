/*==================================================
 OK MOBILE
 Main Application
==================================================*/

import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import { loadProducts } from "./products.js";
import { loadGallery } from "./gallery.js";

/*==================================================
DOM
==================================================*/

const hero = document.querySelector(".hero");

const heroTitle = document.getElementById("heroTitle");

const heroSubtitle = document.getElementById("heroSubtitle");

const facebookLink = document.getElementById("facebookLink");

const instagramLink = document.getElementById("instagramLink");

const tiktokLink = document.getElementById("tiktokLink");

const whatsappLink = document.getElementById("whatsappLink");

const whatsappFloat = document.getElementById("whatsappFloat");

const shopPhone = document.getElementById("shopPhone");

const shopEmail = document.getElementById("shopEmail");

const shopAddress = document.getElementById("shopAddress");

const googleMap = document.getElementById("googleMap");

const loadingScreen = document.getElementById("loadingScreen");

const backToTop = document.getElementById("backToTop");

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.querySelector(".nav-links");

/*==================================================
LOAD SETTINGS
==================================================*/

export async function loadSettings(){

    try{

        const ref = doc(db,"settings","main");

        const snap = await getDoc(ref);

        if(!snap.exists()) return;

        applySettings(snap.data());

    }

    catch(error){

        console.error(error);

    }

}
/*==================================================
 APPLY SETTINGS
==================================================*/

function applySettings(data){

    heroTitle.textContent =
        data.heroTitle || "OK MOBILE";

    heroSubtitle.textContent =
        data.heroSubtitle || "Smartphones • Repairs • Accessories";

    if(data.heroImageUrl){

        hero.style.backgroundImage =
            `url('${data.heroImageUrl}')`;

    }

    document.documentElement.style.setProperty(
        "--primary",
        data.primaryColor || "#FF0000"
    );

    document.documentElement.style.setProperty(
        "--secondary",
        data.secondaryColor || "#111111"
    );

    document.documentElement.style.setProperty(
        "--accent",
        data.accentColor || "#FFA500"
    );

    facebookLink.href = data.facebook || "#";

    instagramLink.href = data.instagram || "#";

    tiktokLink.href = data.tiktok || "#";

    whatsappLink.href = data.whatsapp || "#";

    whatsappFloat.href = data.whatsapp || "#";

    shopPhone.textContent = data.phone || "";

    shopEmail.textContent = data.email || "";

    shopAddress.textContent = data.address || "";

    googleMap.src = data.map || "";

}

/*==================================================
 REALTIME SETTINGS
==================================================*/

const settingsRef = doc(db,"settings","main");

onSnapshot(settingsRef,(snapshot)=>{

    if(snapshot.exists()){

        applySettings(snapshot.data());

    }

});
/*==================================================
 MOBILE MENU
==================================================*/

if(menuBtn){

    menuBtn.addEventListener("click",()=>{

        navLinks.classList.toggle("active");

    });

}

/*==================================================
 BACK TO TOP
==================================================*/

window.addEventListener("scroll",()=>{

    if(window.scrollY>400){

        backToTop.style.display="block";

    }else{

        backToTop.style.display="none";

    }

});

backToTop.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/*==================================================
 LOADING SCREEN
==================================================*/

window.addEventListener("load",()=>{

    setTimeout(()=>{

        loadingScreen.style.display="none";

    },800);

});
/*==================================================
 TOAST
==================================================*/

window.showToast = function(message){

    const toast = document.getElementById("toast");

    if(!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3000);

};

/*==================================================
 SCROLL LINKS
==================================================*/

document.querySelectorAll('a[href^="#"]').forEach(link=>{

    link.addEventListener("click",function(e){

        const target = document.querySelector(this.getAttribute("href"));

        if(!target) return;

        e.preventDefault();

        target.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

        if(navLinks){

            navLinks.classList.remove("active");

        }

    });

});

/*==================================================
 NETWORK STATUS
==================================================*/

window.addEventListener("online",()=>{

    showToast("Connection restored");

});

window.addEventListener("offline",()=>{

    showToast("No Internet Connection");

});
/*==================================================
 REFRESH APPLICATION
==================================================*/

window.refreshApp = async function(){

    try{

        await loadSettings();

        await loadProducts();

        await loadGallery();

        showToast("Application Updated");

    }

    catch(error){

        console.error(error);

        showToast("Update Failed");

    }

};

/*==================================================
 PAGE VISIBILITY
==================================================*/

document.addEventListener("visibilitychange",()=>{

    if(document.visibilityState==="visible"){

        loadSettings();

    }

});

/*==================================================
 WINDOW RESIZE
==================================================*/

window.addEventListener("resize",()=>{

    if(window.innerWidth>768){

        navLinks.classList.remove("active");

    }

});
/*==================================================
 INITIALIZE
==================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    await loadSettings();

    await loadProducts();

    await loadGallery();

    console.log("OK MOBILE Loaded");

});

