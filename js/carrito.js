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

    const productoExistente = carrito.find(
        item => item.id === producto.id
    );

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

    mostrarMensajeCarrito(
        `${producto.nombre} fue agregado al carrito.`
    );
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
   BOTONES "AGREGAR AL CARRITO"
   ========================================== */

const botonesCarrito = document.querySelectorAll(".btn-cart");

botonesCarrito.forEach(boton => {
    boton.addEventListener("click", () => {

        const productoCard = boton.closest(".product-card");

        if (!productoCard) return;

        const producto = {
            id: productoCard.dataset.id,
            precio: Number(productoCard.dataset.price),
            nombre: productoCard
                .querySelector(".product-title")
                .textContent
                .trim(),
            imagen: productoCard
                .querySelector(".product-img")
                .src
        };

        agregarAlCarrito(producto);
    });
});


/* ==========================================
   MOSTRAR CARRITO
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

                <a href="usuario.html#tienda">
                    Volver a la tienda
                </a>
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
            <img
                src="${producto.imagen}"
                alt="${producto.nombre}"
            >

            <div class="producto-carrito-info">

                <h3>${producto.nombre}</h3>

                <p>
                    Precio:
                    $${producto.precio.toLocaleString("es-CL")}
                </p>

                <div class="control-cantidad">

                    <button
                        class="btn-disminuir"
                        data-id="${producto.id}"
                        type="button">
                        -
                    </button>

                    <span>${producto.cantidad}</span>

                    <button
                        class="btn-aumentar"
                        data-id="${producto.id}"
                        type="button">
                        +
                    </button>

                </div>

                <p>
                    Subtotal:
                    $${(
                        producto.precio * producto.cantidad
                    ).toLocaleString("es-CL")}
                </p>

                <button
                    class="btn-eliminar"
                    data-id="${producto.id}"
                    type="button">
                    <i class="fas fa-trash"></i>
                    Eliminar
                </button>

            </div>
        `;

        contenedor.appendChild(productoHTML);
    });

    activarBotonesCarrito();
    actualizarResumen();
}


/* ==========================================
   BOTONES DEL CARRITO
   ========================================== */

function activarBotonesCarrito() {

    document.querySelectorAll(".btn-aumentar").forEach(boton => {

        boton.addEventListener("click", () => {

            const id = boton.dataset.id;

            carrito = obtenerCarrito();

            const producto = carrito.find(
                item => item.id === id
            );

            if (!producto) return;

            producto.cantidad++;

            guardarCarrito();
            mostrarCarrito();
            actualizarContadorCarrito();
        });
    });


    document.querySelectorAll(".btn-disminuir").forEach(boton => {

        boton.addEventListener("click", () => {

            const id = boton.dataset.id;

            carrito = obtenerCarrito();

            const producto = carrito.find(
                item => item.id === id
            );

            if (!producto) return;

            producto.cantidad--;

            if (producto.cantidad <= 0) {

                carrito = carrito.filter(
                    item => item.id !== id
                );
            }

            guardarCarrito();
            mostrarCarrito();
            actualizarContadorCarrito();
        });
    });


    document.querySelectorAll(".btn-eliminar").forEach(boton => {

        boton.addEventListener("click", () => {

            const id = boton.dataset.id;

            carrito = obtenerCarrito();

            const producto = carrito.find(
                item => item.id === id
            );

            if (!producto) return;

            const confirmar = confirm(
                `¿Quieres eliminar "${producto.nombre}" del carrito?`
            );

            if (!confirmar) return;

            carrito = carrito.filter(
                item => item.id !== id
            );

            guardarCarrito();
            mostrarCarrito();
            actualizarContadorCarrito();
        });
    });
}


/* ==========================================
   RESUMEN DE COMPRA
   ========================================== */

function actualizarResumen() {

    const cantidadElemento =
        document.getElementById("cantidad-productos");

    const totalElemento =
        document.getElementById("total-carrito");

    if (!cantidadElemento || !totalElemento) return;

    carrito = obtenerCarrito();

    const cantidadTotal = carrito.reduce(
        (total, producto) =>
            total + Number(producto.cantidad || 0),
        0
    );

    const precioTotal = carrito.reduce(
        (total, producto) =>
            total +
            Number(producto.precio) *
            Number(producto.cantidad),
        0
    );

    cantidadElemento.textContent = cantidadTotal;

    totalElemento.textContent =
        precioTotal.toLocaleString("es-CL");
}


/* ==========================================
   VACIAR CARRITO
   ========================================== */

const botonVaciar =
    document.getElementById("vaciar-carrito");

if (botonVaciar) {

    botonVaciar.addEventListener("click", () => {

        carrito = obtenerCarrito();

        if (carrito.length === 0) {

            alert("El carrito ya está vacío.");

            return;
        }

        const confirmar = confirm(
            "¿Estás seguro de que quieres vaciar todo el carrito?"
        );

        if (!confirmar) return;

        carrito = [];

        guardarCarrito();
        actualizarContadorCarrito();
        mostrarCarrito();
    });
}


/* ==========================================
   CONFIRMAR COMPRA
   ========================================== */

const botonConfirmar =
    document.getElementById("confirmar-compra");

if (botonConfirmar) {

    botonConfirmar.addEventListener("click", () => {

        carrito = obtenerCarrito();

        if (carrito.length === 0) {

            alert(
                "No puedes confirmar una compra con el carrito vacío."
            );

            return;
        }

        const total = carrito.reduce(
            (suma, producto) =>
                suma +
                Number(producto.precio) *
                Number(producto.cantidad),
            0
        );

        const pedido = {

            id: "PED-" + Date.now(),

            fecha: new Date().toLocaleString("es-CL"),

            productos: carrito.map(producto => ({
                ...producto
            })),

            total: total
        };

        const pedidos =
            JSON.parse(
                localStorage.getItem("pedidos")
            ) || [];

        pedidos.push(pedido);

        localStorage.setItem(
            "pedidos",
            JSON.stringify(pedidos)
        );

        alert(
            `¡Compra confirmada!

Número de pedido:
${pedido.id}

Total:
$${total.toLocaleString("es-CL")}`
        );

        carrito = [];

        guardarCarrito();
        actualizarContadorCarrito();
        mostrarCarrito();
    });
}


/* ==========================================
   INICIALIZACIÓN
   ========================================== */

actualizarContadorCarrito();
mostrarCarrito();


/* ==========================================
   ACTUALIZACIÓN ENTRE PÁGINAS
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