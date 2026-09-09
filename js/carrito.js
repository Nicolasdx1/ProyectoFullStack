let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function obtenerCarrito() {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("contador-carrito");
    if (!contador) return;

    const carritoActual = obtenerCarrito();
    const cantidadTotal = carritoActual.reduce(
        (total, producto) => total + Number(producto.cantidad || 0),
        0
    );

    contador.textContent = cantidadTotal;
}

function agregarAlCarrito(producto) {
    carrito = obtenerCarrito();

    const productoExistente = carrito.find(item => item.id === producto.id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarContadorCarrito();
    mostrarMensajeCarrito(`${producto.nombre} fue agregado al carrito.`);
}

function mostrarMensajeCarrito(mensaje) {
    let mensajeElemento = document.getElementById("mensaje-carrito");

    if (!mensajeElemento) {
        mensajeElemento = document.createElement("div");
        mensajeElemento.id = "mensaje-carrito";
        document.body.appendChild(mensajeElemento);
    }

    mensajeElemento.textContent = mensaje;
    mensajeElemento.classList.add("mostrar");

    setTimeout(() => {
        mensajeElemento.classList.remove("mostrar");
    }, 2000);
}

/* ==========================================
   MOSTRAR Y GESTIONAR CARRITO
   ========================================== */

function mostrarCarrito() {
    const contenedor = document.getElementById("carrito-container");
    if (!contenedor) return;

    carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="carrito-vacio">
                <i class="fas fa-shopping-cart"></i>
                <h2>Tu carrito está vacío</h2>
                <p>Agrega algunos productos desde nuestra tienda.</p>
                <a href="usuario.html#tienda">Volver a la tienda</a>
            </div>
        `;
        actualizarResumen();
        return;
    }

    contenedor.innerHTML = "";

    carrito.forEach(producto => {
        const productoHTML = document.createElement("div");
        productoHTML.classList.add("producto-carrito");

        productoHTML.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <div class="producto-carrito-info">
                <h3>${producto.nombre}</h3>
                <p>Precio: $${Number(producto.precio).toLocaleString("es-CL")}</p>
                <div class="control-cantidad">
                    <button class="btn-disminuir" data-id="${producto.id}" type="button">-</button>
                    <span>${producto.cantidad}</span>
                    <button class="btn-aumentar" data-id="${producto.id}" type="button">+</button>
                </div>
                <p>Subtotal: $${(producto.precio * producto.cantidad).toLocaleString("es-CL")}</p>
                <button class="btn-eliminar" data-id="${producto.id}" type="button">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        `;

        contenedor.appendChild(productoHTML);
    });

    actualizarResumen();
}

/* ==========================================
   EVENTOS DELEGADOS DEL CARRITO
   ========================================== */

document.addEventListener("DOMContentLoaded", () => {
    // Event listener único para agregar al carrito desde tarjetas de producto
    document.addEventListener("click", (e) => {
        const botonAgregar = e.target.closest(".btn-cart");
        if (botonAgregar) {
            const productoCard = botonAgregar.closest(".product-card");
            if (!productoCard) return;

            const producto = {
                id: productoCard.dataset.id,
                precio: Number(productoCard.dataset.price),
                nombre: productoCard.querySelector(".product-title") ? productoCard.querySelector(".product-title").textContent.trim() : "Producto",
                imagen: productoCard.querySelector(".product-img") ? productoCard.querySelector(".product-img").src : ""
            };

            agregarAlCarrito(producto);
        }
    });

    // Delegación de eventos en el contenedor del carrito (Aumentar, Disminuir, Eliminar)
    const contenedorCarrito = document.getElementById("carrito-container");
    if (contenedorCarrito) {
        contenedorCarrito.addEventListener("click", (e) => {
            const btnAumentar = e.target.closest(".btn-aumentar");
            const btnDisminuir = e.target.closest(".btn-disminuir");
            const btnEliminar = e.target.closest(".btn-eliminar");

            if (btnAumentar) {
                const id = btnAumentar.dataset.id;
                carrito = obtenerCarrito();
                const prod = carrito.find(item => item.id === id);
                if (prod) {
                    prod.cantidad++;
                    guardarCarrito();
                    mostrarCarrito();
                    actualizarContadorCarrito();
                }
            }

            if (btnDisminuir) {
                const id = btnDisminuir.dataset.id;
                carrito = obtenerCarrito();
                const prod = carrito.find(item => item.id === id);
                if (prod) {
                    prod.cantidad--;
                    if (prod.cantidad <= 0) {
                        carrito = carrito.filter(item => item.id !== id);
                    }
                    guardarCarrito();
                    mostrarCarrito();
                    actualizarContadorCarrito();
                }
            }

            if (btnEliminar) {
                const id = btnEliminar.dataset.id;
                carrito = obtenerCarrito();
                const prod = carrito.find(item => item.id === id);
                if (prod && confirm(`¿Quieres eliminar "${prod.nombre}" del carrito?`)) {
                    carrito = carrito.filter(item => item.id !== id);
                    guardarCarrito();
                    mostrarCarrito();
                    actualizarContadorCarrito();
                }
            }
        });
    }

    // Vaciar Carrito
    const botonVaciar = document.getElementById("vaciar-carrito");
    if (botonVaciar) {
        botonVaciar.addEventListener("click", () => {
            carrito = obtenerCarrito();
            if (carrito.length === 0) {
                alert("El carrito ya está vacío.");
                return;
            }
            if (confirm("¿Estás seguro de que quieres vaciar todo el carrito?")) {
                carrito = [];
                guardarCarrito();
                actualizarContadorCarrito();
                mostrarCarrito();
            }
        });
    }

    // Confirmar Compra
    const botonConfirmar = document.getElementById("confirmar-compra");
    if (botonConfirmar) {
        botonConfirmar.addEventListener("click", () => {
            carrito = obtenerCarrito();
            if (carrito.length === 0) {
                alert("No puedes confirmar una compra con el carrito vacío.");
                return;
            }

            const total = carrito.reduce(
                (suma, producto) => suma + Number(producto.precio) * Number(producto.cantidad),
                0
            );
            // Resumen compacto de ítems comprados
            const resumen = carrito
                .map(item => `${item.cantidad}x ${item.nombre}`)
                .join(", ");

            // Objeto con el formato que lee admin.js
            const nuevoPedido = {
                id: Math.floor(100000 + Math.random() * 900000),
                fecha: new Date().toLocaleDateString("es-CL"),
                resumenItems: resumen,
                total: total
            };

            // Guardar en la clave oficial del admin
            const historial = JSON.parse(localStorage.getItem("historial_pedidos")) || [];
            historial.unshift(nuevoPedido);
            localStorage.setItem("historial_pedidos", JSON.stringify(historial));

            alert(`¡Compra confirmada!\n\nNúmero de pedido: #${nuevoPedido.id}\nTotal: $${total.toLocaleString("es-CL")}`);

            carrito = [];
            guardarCarrito();
            actualizarContadorCarrito();
            mostrarCarrito();
        });
    }
    // Inicialización al cargar la página
    actualizarContadorCarrito();
    mostrarCarrito();
});

/* ==========================================
   SINCRONIZACIÓN ENTRE PÁGINAS Y PESTAÑAS
   ========================================== */

window.addEventListener("pageshow", () => {
    carrito = obtenerCarrito();
    actualizarContadorCarrito();
    mostrarCarrito();
});

window.addEventListener("storage", evento => {
    if (evento.key === "carrito") {
        carrito = JSON.parse(evento.newValue) || [];
        actualizarContadorCarrito();
        mostrarCarrito();
    }
});

function actualizarResumen() {
    const cantidadElemento = document.getElementById("cantidad-productos");
    const totalElemento = document.getElementById("total-carrito");

    if (!cantidadElemento || !totalElemento) return;

    carrito = obtenerCarrito();

    const cantidadTotal = carrito.reduce(
        (total, producto) => total + Number(producto.cantidad || 0),
        0
    );

    const precioTotal = carrito.reduce(
        (total, producto) => total + Number(producto.precio) * Number(producto.cantidad),
        0
    );

    cantidadElemento.textContent = cantidadTotal;
    totalElemento.textContent = precioTotal.toLocaleString("es-CL");
}



//Quedo pendiente que el pedido realizado por el usuario se visualice en el panel de admin  
//Y que el admin los productos que agrega el admin se visualicen en la tienda del usuario.

//Quedo listo el receptor de mensajes de usario a admin por correo 
//Y quedo listo el agregar y eliminar productos en el panel de admin  




