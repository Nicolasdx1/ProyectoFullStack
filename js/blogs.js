const listaBlogs = [
    {
        id: 1,
        titulo: "Guía Definitiva: Cómo elegir tu primera tabla de skate (y no morir en el intento)",
        descripcionCorta: "Si estás pensando en armar tu primer setup pero te abruman los tecnicismos, esta guía es para ti",
        imagen: "img/Caso1.jpg"
    },
    {
        id: 2,
        titulo: "Ruedas blandas vs. Ruedas duras: ¿Cuáles necesitas para dominar la ciudad?",
        descripcionCorta: "No todas las ruedas se comportan igual sobre el asfalto. Si tu objetivo es recorrer las calles de tu ciudad sin que tus pies terminen vibrando por el pavimento rugoso, necesitas conocer el durómetro de tus ruedas.",
        imagen: "img/Caso2.webp" 
    },
    {
        id: 3,
        titulo: "El Arte sobre la Madera: Los gráficos de skate más icónicos de la historia",
        descripcionCorta: "El skateboarding es tanto un deporte como una forma de expresión artística. Desde los míticos diseños de Powell-Peralta y Santa Cruz en los años 80 hasta las colaboraciones modernas de Supreme, repasamos las ilustraciones que definieron a generaciones enteras.",
        imagen: "img/Caso3.jpg" 
    },
    {
        id: 4,
        titulo: "¿Necesitas renovar tu setup?",
        descripcionCorta: "En nuestra tienda online contamos con stock permanente de tablas, trucks, ruedas, rulemanes y accesorios de las marcas más respetadas de la escena.",
        imagen: "img/Caso4.webp" 
    }
];

function renderizarNoticias() {
    const contenedor = document.getElementById("blog-list");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    listaBlogs.forEach(blog => {
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("blog-card");

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

function irAlDetalle(id) {
    window.location.href = `detalle_blog.html?id=${id}`;
}

document.addEventListener("DOMContentLoaded", () => {
    renderizarNoticias();

    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const contadorCarrito = document.getElementById("contador-carrito");
    
    if (contadorCarrito) {
        const cantidadTotal = carritoActual.reduce((total, prod) => {
            const cant = Number(prod.cantidad);
            return total + (isNaN(cant) ? 0 : cant);
        }, 0);
        contadorCarrito.textContent = cantidadTotal;
    }
});