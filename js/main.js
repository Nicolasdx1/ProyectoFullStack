// --- Esto es la logica del menu hamburguesa ---
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-item a").forEach(n => n.addEventListener("click", () => {
    navMenu.classList.remove("active");
}));
git