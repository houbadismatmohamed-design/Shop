/*==================================================
 OK MOBILE
 Gallery Manager
==================================================*/

import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

/*==================================================
 GLOBALS
==================================================*/

const galleryGrid = document.getElementById("galleryGrid");

window.galleryImages = [];

/*==================================================
 LOAD GALLERY
==================================================*/

export async function loadGallery(){

    if(!galleryGrid) return;

    galleryGrid.innerHTML = "";

    try{

        const q = query(
            collection(db,"gallery"),
            orderBy("timestamp","desc")
        );

        const snapshot = await getDocs(q);

        window.galleryImages = [];

        snapshot.forEach(doc=>{

            window.galleryImages.push({

                id: doc.id,

                ...doc.data()

            });

        });

        renderGallery(window.galleryImages);

    }

    catch(error){

        console.error(error);

        galleryGrid.innerHTML = `
            <p class="text-center">
                Unable to load gallery.
            </p>
        `;

    }

}

/*==================================================
 RENDER GALLERY
==================================================*/

window.renderGallery = function(images){

    galleryGrid.innerHTML = "";

    if(images.length===0){

        galleryGrid.innerHTML = `
            <p class="text-center">
                No images available.
            </p>
        `;

        return;

    }

    images.forEach(image=>{

        const img = document.createElement("img");

        img.src = image.imageUrl;

        img.alt = "OK MOBILE";

        img.loading = "lazy";

        img.className = "gallery-image";
        img.addEventListener("click", () => {

            openGalleryImage(image.imageUrl);

        });

        galleryGrid.appendChild(img);

    });

};

/*==================================================
 OPEN IMAGE
==================================================*/

window.openGalleryImage = function(url){

    const overlay = document.createElement("div");

    overlay.className = "gallery-overlay";

    const image = document.createElement("img");

    image.src = url;

    image.className = "gallery-preview";

    overlay.appendChild(image);

    overlay.addEventListener("click",()=>{

        overlay.remove();

    });

    document.body.appendChild(overlay);

};

/*==================================================
 SEARCH GALLERY
==================================================*/

window.searchGallery = function(keyword){

    keyword = keyword.toLowerCase();

    const filtered = window.galleryImages.filter(image=>{

        return (

            image.imageUrl
                .toLowerCase()
                .includes(keyword)

        );

    });

    window.renderGallery(filtered);

};
/*==================================================
 FILTER GALLERY
==================================================*/

window.filterGallery = function(limit){

    if(limit >= window.galleryImages.length){

        window.renderGallery(window.galleryImages);

        return;

    }

    const images = window.galleryImages.slice(0, limit);

    window.renderGallery(images);

};

/*==================================================
 REFRESH GALLERY
==================================================*/

window.refreshGallery = function(){

    loadGallery();

};

/*==================================================
 GET IMAGE
==================================================*/

window.getGalleryImage = function(id){

    return window.galleryImages.find(image => image.id === id);

};

/*==================================================
 CLOSE GALLERY
==================================================*/

window.closeGallery = function(){

    const overlay = document.querySelector(".gallery-overlay");

    if(overlay){

        overlay.remove();

    }

};
/*==================================================
 PRELOAD IMAGES
==================================================*/

window.preloadGallery = function(){

    window.galleryImages.forEach(image => {

        const img = new Image();

        img.src = image.imageUrl;

    });

};

/*==================================================
 GALLERY COUNT
==================================================*/

window.galleryCount = function(){

    return window.galleryImages.length;

};

/*==================================================
 REMOVE BROKEN IMAGES
==================================================*/

window.removeBrokenImages = function(){

    const images = document.querySelectorAll(".gallery-image");

    images.forEach(img=>{

        img.onerror = function(){

            this.remove();

        };

    });

};

/*==================================================
 SCROLL TO GALLERY
==================================================*/

window.scrollGallery = function(){

    const section = document.getElementById("gallery");

    if(section){

        section.scrollIntoView({

            behavior:"smooth"

        });

    }

};
/*==================================================
 INITIALIZE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadGallery();

    setTimeout(() => {

        window.removeBrokenImages();

        window.preloadGallery();

    }, 500);

});

