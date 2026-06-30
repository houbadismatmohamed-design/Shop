/*==================================================
OK MOBILE
Product Filter
==================================================*/

document.querySelectorAll(".category-card").forEach(card => {

    card.addEventListener("click", () => {

        const category = card.textContent.trim();

        if (!window.allProducts) return;

        if (
            category === "All" ||
            category === "Browse Categories"
        ) {

            window.renderProducts(window.allProducts);

            return;

        }

        const filtered = window.allProducts.filter(product =>

            product.category
                .toLowerCase()
                .includes(category.toLowerCase())

        );

        window.renderProducts(filtered);

    });

});