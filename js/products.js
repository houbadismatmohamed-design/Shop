/*==================================================
 OK MOBILE
 Products Manager
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

window.allProducts = [];

const productsGrid = document.getElementById("productsGrid");
const searchInput = document.getElementById("searchProduct");

/*==================================================
 LOAD PRODUCTS
==================================================*/

export async function loadProducts() {

    if (!productsGrid) return;

    productsGrid.innerHTML = "";

    try {

        const q = query(
            collection(db, "products"),
            orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);

        window.allProducts = [];

        snapshot.forEach(doc => {

            window.allProducts.push({
                id: doc.id,
                ...doc.data()
            });

        });

        renderProducts(window.allProducts);

    } catch (error) {

        console.error(error);

        productsGrid.innerHTML = `
            <p class="text-center">
                Failed to load products.
            </p>
        `;

    }

}

/*==================================================
 RENDER PRODUCTS
==================================================*/

window.renderProducts = function(products) {

    productsGrid.innerHTML = "";

    if (products.length === 0) {

        productsGrid.innerHTML = `
            <p class="text-center">
                No products found.
            </p>
        `;

        return;

    }

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `

        <img
            src="${product.imageUrl}"
            alt="${product.name}"
            loading="lazy">

        <div class="product-content">

            <span class="product-category">

                ${product.category}

            </span>

            <h3 class="product-name">

                ${product.name}

            </h3>

            <div class="product-price">

                ${Number(product.price).toLocaleString()} DA

            </div>

            <div class="product-actions">

                <button
                    class="buy-btn"
                    onclick="buyProduct('${product.name}','${product.price}')">

                    Buy Now

                </button>

                <button
                    class="details-btn"
                    onclick="showDetails('${product.id}')">

                    Details

                </button>

            </div>

        </div>

        `;

        productsGrid.appendChild(card);

    });

};
/*==================================================
 SEARCH
==================================================*/

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const keyword = searchInput.value
            .toLowerCase()
            .trim();

        const filtered = window.allProducts.filter(product => {

            return (

                product.name
                    .toLowerCase()
                    .includes(keyword)

                ||

                product.category
                    .toLowerCase()
                    .includes(keyword)

            );

        });

        window.renderProducts(filtered);

    });

}

/*==================================================
 CATEGORY FILTER
==================================================*/

const categoryCards = document.querySelectorAll(".category-card");

categoryCards.forEach(card => {

    card.addEventListener("click", () => {

        const category = card.textContent.trim();

        if (category === "All") {

            window.renderProducts(window.allProducts);

            return;

        }

        const filtered = window.allProducts.filter(product => {

            return product.category
                .toLowerCase()
                .includes(category.toLowerCase());

        });

        window.renderProducts(filtered);

    });

});
/*==================================================
 PRODUCT DETAILS
==================================================*/

window.showDetails = function(id) {

    const product = window.allProducts.find(item => item.id === id);

    if (!product) return;

    alert(

`${product.name}

Category: ${product.category}

Price: ${Number(product.price).toLocaleString()} DA`

    );

};

/*==================================================
 BUY PRODUCT
==================================================*/

window.buyProduct = function(name, price) {

    const phoneElement = document.getElementById("shopPhone");

    if (!phoneElement) {

        alert("Phone number not configured.");

        return;

    }

    const phone = phoneElement.textContent.replace(/\D/g, "");

    const message =
`Hello OK MOBILE,

I want to order:

${name}

Price: ${Number(price).toLocaleString()} DA`;

    window.open(

        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,

        "_blank"

    );

};
/*==================================================
 REFRESH PRODUCTS
==================================================*/

window.refreshProducts = function () {

    loadProducts();

};

/*==================================================
 GET PRODUCT BY ID
==================================================*/

window.getProductById = function(id){

    return window.allProducts.find(product => product.id === id);

};

/*==================================================
 GET PRODUCTS BY CATEGORY
==================================================*/

window.getProductsByCategory = function(category){

    if(category === "All"){

        return window.allProducts;

    }

    return window.allProducts.filter(product =>

        product.category
            .toLowerCase()
            .includes(category.toLowerCase())

    );

};
/*==================================================
 SORT PRODUCTS
==================================================*/

window.sortProducts = function(type){

    let products = [...window.allProducts];

    switch(type){

        case "price-low":

            products.sort((a,b)=>a.price-b.price);

            break;

        case "price-high":

            products.sort((a,b)=>b.price-a.price);

            break;

        case "name":

            products.sort((a,b)=>
                a.name.localeCompare(b.name)
            );

            break;

        default:

            break;

    }

    window.renderProducts(products);

};

/*==================================================
 CLEAR SEARCH
==================================================*/

window.clearSearch = function(){

    if(searchInput){

        searchInput.value = "";

    }

    window.renderProducts(window.allProducts);

};
/*==================================================
 INITIALIZE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadProducts();

});

/*==================================================
 EXPORTS
==================================================*/

export {

    loadProducts

};