/*==================================================
OK MOBILE
Utility Functions
==================================================*/

/*=========================================
TOAST NOTIFICATION
=========================================*/

export function showToast(message, duration = 3000) {

    const toast = document.getElementById("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, duration);

}

/*=========================================
SHOW LOADING
=========================================*/

export function showLoading() {

    const loading = document.getElementById("loadingScreen");

    if (loading) {

        loading.style.display = "flex";

    }

}

/*=========================================
HIDE LOADING
=========================================*/

export function hideLoading() {

    const loading = document.getElementById("loadingScreen");

    if (loading) {

        loading.style.display = "none";

    }

}

/*=========================================
FORMAT PRICE
=========================================*/

export function formatPrice(price) {

    if (isNaN(price)) return "0 DA";

    return Number(price).toLocaleString() + " DA";

}

/*=========================================
VALIDATE FACEBOOK IMAGE URL
=========================================*/

export function isFacebookImage(url) {

    if (!url) return false;

    return (
        url.includes("fbcdn.net") ||
        url.includes("facebook.com") ||
        url.includes("scontent")
    );

}

/*=========================================
VALIDATE URL
=========================================*/

export function isValidUrl(url) {

    try {

        new URL(url);

        return true;

    }

    catch {

        return false;

    }

}

/*=========================================
SMOOTH SCROLL
=========================================*/

export function scrollToSection(id) {

    const element = document.getElementById(id);

    if (!element) return;

    element.scrollIntoView({

        behavior: "smooth"

    });

}

/*=========================================
GENERATE RANDOM ID
=========================================*/

export function randomId(length = 12) {

    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let result = "";

    for (let i = 0; i < length; i++) {

        result += chars.charAt(

            Math.floor(Math.random() * chars.length)

        );

    }

    return result;

}

/*=========================================
IMAGE PREVIEW
=========================================*/

export function previewImage(fileInput, imageElement) {

    const file = fileInput.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        imageElement.src = e.target.result;

    };

    reader.readAsDataURL(file);

}

/*=========================================
COPY TO CLIPBOARD
=========================================*/

export async function copyText(text) {

    try {

        await navigator.clipboard.writeText(text);

        showToast("Copied to clipboard");

    }

    catch {

        console.error("Clipboard error");

    }

}

/*=========================================
DEBOUNCE
=========================================*/

export function debounce(func, delay = 300) {

    let timer;

    return (...args) => {

        clearTimeout(timer);

        timer = setTimeout(() => {

            func(...args);

        }, delay);

    };

}

console.log("utils.js loaded successfully");