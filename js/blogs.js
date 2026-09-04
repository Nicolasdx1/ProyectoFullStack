// Arreglo de objetos con las noticias requeridas (Mínimo 2 según el caso de estudio)
const listaBlogs = [
    {
        id: 1,
        titulo: "Guía Definitiva: Cómo elegir tu primera tabla de skate (y no morir en el intento)",
        descripcionCorta: "Si estás pensando en armar tu primer setup pero te abruman los tecnicismos, esta guía es para ti",
        imagen: "img/Caso1.jpg" // Si posees una imagen en tu carpeta img/, escribe su ruta aquí (ej: 'img/noticia1.jpg')
    },
    {
        id: 2,
        titulo: "Ruedas blandas vs. Ruedas duras: ¿Cuáles necesitas para dominar la ciudad",
        descripcionCorta: "No todas las ruedas se comportan igual sobre el asfalto. Si tu objetivo es recorrer las calles de tu ciudad sin que tus pies terminen vibrando por el pavimento rugoso, necesitas conocer el durómetro de tus ruedas.",
        imagen: "img/Caso2.webp" 
    },
    {
        id: 3,
        titulo: "El Arte sobre la Madera: Los gráficos de skate más icónicos de la historia",
        descripcionCorta: "El skateboarding es tanto un deporte como una forma de expresión artística. Desde los míticos diseños de Powell-Peralta y Santa Cruz en los años 80 hasta las colaboraciones modernas de Supreme, repasamos las ilustraciones que definieron a generaciones enteras y que hoy en día son verdaderas piezas de colección.",
        imagen: "img/Caso3.jpg" 
    },
    {
        id: 4,
        titulo: "¿Necesitas renovar tu setup?",
        descripcionCorta: "En nuestra tienda online contamos con stock permanente de tablas, trucks, ruedas, rulemanes y accesorios de las marcas más respetadas de la escena.",
        imagen: "img/Caso4.webp" 
    }
];

// Función para inyectar dinámicamente los artículos en el documento HTML
function renderizarNoticias() {
    const contenedor = document.getElementById("blog-list");
    if (!contenedor) return;

    contenedor.innerHTML = ""; // Limpieza previa

    listaBlogs.forEach(blog => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("blog-card");

        // Evaluamos si el objeto cuenta con una imagen definida o utiliza el marcador estructural
        const clasePlaceholder = blog.imagen ? "" : "placeholder";
        const etiquetaImagen = blog.imagen ? `<img src="${blog.imagen}" alt="${blog.titulo}">` : "";

        tarjeta.innerHTML = `
            <div class="blog-content">
                <div>
                    <h3>${blog.titulo}</h3>
                    <p>${blog.descripcionCorta}</p>
                </div>
                <button class="btn-ver-caso" onclick="irAlDetalle(${blog.id})">VER CASO</button>
            </div>
            <div class="blog-image-wrapper ${clasePlaceholder}">
                ${etiquetaImagen}
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
}

// Redirección controlada hacia la vista específica del caso seleccionado
function irAlDetalle(id) {
    // Redirige al archivo de detalles llevando consigo el parámetro identificador
    window.location.href = `detalle_blog.html?id=${id}`;
}

// Inicialización de elementos al cargar el árbol DOM de la página
document.addEventListener("DOMContentLoaded", () => {
    renderizarNoticias();

    // Sincronización con el contador del carrito almacenado en LocalStorage
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const contadorCarrito = document.getElementById("cart-count");
    if (contadorCarrito) {
        contadorCarrito.textContent = carritoActual.length;
    }
});
