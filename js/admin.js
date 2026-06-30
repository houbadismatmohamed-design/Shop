/*==================================================
 OK MOBILE
 Admin Dashboard
==================================================*/

import { db, storage } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

/*==================================================
DOM
==================================================*/

const productsTable =
document.getElementById("productsTable");

const saveProductBtn =
document.getElementById("saveProduct");

const galleryUpload =
document.getElementById("galleryUpload");

const galleryList =
document.getElementById("galleryAdminList");

let editingProduct = null;

/*==================================================
LOAD PRODUCTS
==================================================*/

async function loadProducts(){

productsTable.innerHTML="";

const snapshot = await getDocs(
collection(db,"products")
);

document.getElementById("productsCount").textContent =
snapshot.size;

snapshot.forEach(document=>{

const product = document.data();

productsTable.innerHTML += `

<tr>

<td>

<img
src="${product.imageUrl}"
width="70">

</td>

<td>${product.name}</td>

<td>${product.price} DA</td>

<td>${product.category}</td>

<td>

<button
class="edit-btn"
onclick="editProduct('${document.id}')">

Edit

</button>

<button
class="delete-btn"
onclick="deleteProduct('${document.id}')">

Delete

</button>

</td>

</tr>

`;

});

}
/*==================================================
 ADD / UPDATE PRODUCT
==================================================*/

saveProductBtn.addEventListener("click", async () => {

    const name =
    document.getElementById("productName").value.trim();

    const price = Number(
    document.getElementById("productPrice").value);

    const category =
    document.getElementById("productCategory").value;

    const imageUrl =
    document.getElementById("productImage").value.trim();

    if(
        !name ||
        !price ||
        !imageUrl
    ){
        alert("Please fill all fields.");
        return;
    }

    try{

        if(editingProduct){

            await updateDoc(
                doc(db,"products",editingProduct),
                {
                    name,
                    price,
                    category,
                    imageUrl
                }
            );

            editingProduct = null;

            saveProductBtn.textContent = "Save Product";

        }else{

            await addDoc(
                collection(db,"products"),
                {
                    name,
                    price,
                    category,
                    imageUrl,
                    createdAt:serverTimestamp()
                }
            );

        }

        document.getElementById("productName").value="";
        document.getElementById("productPrice").value="";
        document.getElementById("productImage").value="";

        loadProducts();

    }

    catch(error){

        console.error(error);

        alert("Unable to save product.");

    }

});

/*==================================================
 EDIT PRODUCT
==================================================*/

window.editProduct = async function(id){

    const snap = await getDoc(
        doc(db,"products",id)
    );

    if(!snap.exists()) return;

    const product = snap.data();

    document.getElementById("productName").value =
    product.name;

    document.getElementById("productPrice").value =
    product.price;

    document.getElementById("productCategory").value =
    product.category;

    document.getElementById("productImage").value =
    product.imageUrl;

    editingProduct = id;

    saveProductBtn.textContent = "Update Product";

};
/*==================================================
 DELETE PRODUCT
==================================================*/

window.deleteProduct = async function(id){

    const confirmDelete = confirm(
        "Delete this product?"
    );

    if(!confirmDelete) return;

    try{

        await deleteDoc(
            doc(db,"products",id)
        );

        loadProducts();

    }

    catch(error){

        console.error(error);

        alert("Unable to delete product.");

    }

};

/*==================================================
 LOAD GALLERY
==================================================*/

async function loadGallery(){

    galleryList.innerHTML = "";

    const snapshot = await getDocs(
        collection(db,"gallery")
    );

    document.getElementById("galleryCount").textContent =
    snapshot.size;

    snapshot.forEach(document=>{

        const image = document.data();

        galleryList.innerHTML += `

<div class="gallery-item">

    <img
    src="${image.imageUrl}"
    alt="Gallery">

    <button
    class="delete-btn"
    onclick="deleteGallery(
        '${document.id}',
        '${image.storagePath}'
    )">

    Delete

    </button>

</div>

`;

    });

}

/*==================================================
 UPLOAD GALLERY
==================================================*/

galleryUpload.addEventListener("change", async(e)=>{

    const files = e.target.files;

    if(!files.length) return;

    for(const file of files){

        const storageRef = ref(
            storage,
            "gallery/" + Date.now() + "-" + file.name
        );

        await uploadBytes(storageRef,file);

        const imageUrl =
        await getDownloadURL(storageRef);

        await addDoc(
            collection(db,"gallery"),
            {
                imageUrl,
                storagePath:storageRef.fullPath,
                timestamp:serverTimestamp()
            }
        );

    }

    loadGallery();

});
/*==================================================
 DELETE GALLERY IMAGE
==================================================*/

window.deleteGallery = async function(id, storagePath){

    if(!confirm("Delete this image?")) return;

    try{

        await deleteObject(
            ref(storage, storagePath)
        );

        await deleteDoc(
            doc(db, "gallery", id)
        );

        loadGallery();

    }

    catch(error){

        console.error(error);

        alert("Unable to delete image.");

    }

};

/*==================================================
 HERO SETTINGS
==================================================*/

const saveHeroBtn =
document.getElementById("saveHero");

saveHeroBtn.addEventListener("click", async()=>{

    try{

        await updateDoc(

            doc(db,"settings","main"),

            {

                heroTitle:
                document.getElementById("heroTitleInput").value,

                heroSubtitle:
                document.getElementById("heroSubtitleInput").value,

                heroImageUrl:
                document.getElementById("heroImageInput").value

            }

        );

        alert("Hero updated.");

    }

    catch(error){

        console.error(error);

    }

});
/*==================================================
 THEME SETTINGS
==================================================*/

const saveThemeBtn =
document.getElementById("saveTheme");

saveThemeBtn.addEventListener("click", async()=>{

    try{

        await updateDoc(

            doc(db,"settings","main"),

            {

                primaryColor:
                document.getElementById("primaryColor").value,

                secondaryColor:
                document.getElementById("secondaryColor").value,

                accentColor:
                document.getElementById("accentColor").value

            }

        );

        alert("Theme updated.");

    }

    catch(error){

        console.error(error);

    }

});

/*==================================================
 SOCIAL SETTINGS
==================================================*/

const saveSocialBtn =
document.getElementById("saveSocial");

saveSocialBtn.addEventListener("click", async()=>{

    try{

        await updateDoc(

            doc(db,"settings","main"),

            {

                facebook:
                document.getElementById("facebookInput").value,

                instagram:
                document.getElementById("instagramInput").value,

                whatsapp:
                document.getElementById("whatsappInput").value,

                tiktok:
                document.getElementById("tiktokInput").value,

                phone:
                document.getElementById("phoneInput").value,

                email:
                document.getElementById("emailInput").value,

                address:
                document.getElementById("addressInput").value,

                map:
                document.getElementById("mapInput").value

            }

        );

        alert("Settings updated.");

    }

    catch(error){

        console.error(error);

    }

});
/*==================================================
 LOAD SETTINGS
==================================================*/

async function loadSettings(){

    try{

        const snap = await getDoc(
            doc(db,"settings","main")
        );

        if(!snap.exists()) return;

        const data = snap.data();

        document.getElementById("heroTitleInput").value =
        data.heroTitle || "";

        document.getElementById("heroSubtitleInput").value =
        data.heroSubtitle || "";

        document.getElementById("heroImageInput").value =
        data.heroImageUrl || "";

        document.getElementById("primaryColor").value =
        data.primaryColor || "#FF0000";

        document.getElementById("secondaryColor").value =
        data.secondaryColor || "#111111";

        document.getElementById("accentColor").value =
        data.accentColor || "#FFA500";

        document.getElementById("facebookInput").value =
        data.facebook || "";

        document.getElementById("instagramInput").value =
        data.instagram || "";

        document.getElementById("whatsappInput").value =
        data.whatsapp || "";

        document.getElementById("tiktokInput").value =
        data.tiktok || "";

        document.getElementById("phoneInput").value =
        data.phone || "";

        document.getElementById("emailInput").value =
        data.email || "";

        document.getElementById("addressInput").value =
        data.address || "";

        document.getElementById("mapInput").value =
        data.map || "";

    }

    catch(error){

        console.error(error);

    }

}
/*==================================================
 RESET PRODUCT FORM
==================================================*/

function resetProductForm(){

    document.getElementById("productName").value = "";

    document.getElementById("productPrice").value = "";

    document.getElementById("productCategory").selectedIndex = 0;

    document.getElementById("productImage").value = "";

    editingProduct = null;

    saveProductBtn.textContent = "Save Product";

}

/*==================================================
 DASHBOARD
==================================================*/

async function loadDashboard(){

    const productsSnapshot = await getDocs(
        collection(db,"products")
    );

    const gallerySnapshot = await getDocs(
        collection(db,"gallery")
    );

    document.getElementById("productsCount").textContent =
        productsSnapshot.size;

    document.getElementById("galleryCount").textContent =
        gallerySnapshot.size;

}

/*==================================================
 REFRESH
==================================================*/

window.refreshAdmin = async function(){

    await loadProducts();

    await loadGallery();

    await loadSettings();

    await loadDashboard();

};

/*==================================================
 CLEAR FORM BUTTON
==================================================*/

const clearButton =
document.getElementById("clearProduct");

if(clearButton){

    clearButton.addEventListener("click",()=>{

        resetProductForm();

    });

}
/*==================================================
 INITIALIZE
==================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    try{

        await loadProducts();

        await loadGallery();

        await loadSettings();

        await loadDashboard();

        console.log("OK MOBILE Admin Ready");

    }

    catch(error){

        console.error(error);

    }

});
