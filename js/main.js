// --- Esto es la logica del menu hamburguesa ---
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-item a").forEach(n => n.addEventListener("click", () => {
    navMenu.classList.remove("active");
}));



// --- Esta es la logica para el filtrado de productos de la tienda ---
const filterButtons = document.querySelectorAll(".cat-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        // 1. Cambiar la clase 'active' al botón presionado
        document.querySelector(".cat-btn.active").classList.remove("active");
        button.classList.add("active");

        // 2. Obtener la categoría del botón
        const targetCategory = button.getAttribute("data-category");

        // 3. Mostrar u ocultar los productos correspondientes
        productCards.forEach(card => {
            const cardCategory = card.getAttribute("data-category");

            if (targetCategory === "todo" || targetCategory === cardCategory) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        });
    });
});

// --- Esto sirve para el efecto de desvanecido del navbar ---
window.addEventListener("scroll", () => {
    const header = document.querySelector("header");

    // Si el scroll baja más de 50 píxeles, añade la clase 'scrolled'
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});