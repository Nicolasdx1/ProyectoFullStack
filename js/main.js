document.addEventListener("DOMContentLoaded", () => {
    // Carga dinámica de productos desde el Admin
    renderizarProductosEnTienda();

    // ... el resto de tus eventos (menú hamburguesa, login, etc.) ...
});

// 2. ELEMENTOS DEL DOM
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".admin-section");
const tituloSeccion = document.getElementById("titulo-seccion");

// Modal
const modalProducto = document.getElementById("modal-producto");
const btnAbrirModal = document.getElementById("btn-abrir-modal-prod");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const formProducto = document.getElementById("form-producto");

// Tablas
const tablaProductos = document.getElementById("tabla-productos-body");
const tablaMensajes = document.getElementById("tabla-mensajes-body");
const tablaPedidos = document.getElementById("tabla-pedidos-body");

// 3. NAVEGACIÓN ENTRE PESTAÑAS DEL DASHBOARD
navButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        // Cambiar clase activa en menú lateral
        navButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Ocultar todas las secciones y mostrar la elegida
        const targetSectionId = btn.getAttribute("data-section");
        sections.forEach((sec) => sec.classList.remove("active"));
        document.getElementById(targetSectionId).classList.add("active");

        // Actualizar título del header
        tituloSeccion.textContent = btn.textContent.trim();
    });
});

// 4. CONTROL DEL MODAL
btnAbrirModal.addEventListener("click", () => {
    formProducto.reset();
    document.getElementById("prod-id-original").value = "";
    document.getElementById("modal-titulo").textContent = "Nuevo Producto";
    modalProducto.classList.add("active");
});

btnCerrarModal.addEventListener("click", () => {
    modalProducto.classList.remove("active");
});

// Cerrar modal al hacer clic fuera del contenido
modalProducto.addEventListener("click", (e) => {
    if (e.target === modalProducto) {
        modalProducto.classList.remove("active");
    }
});

// 5. RENDERIZAR VISTAS INICIALES
renderizarProductos();
renderizarMensajes();
renderizarPedidos();

// 6. CREAR / EDITAR PRODUCTO
formProducto.addEventListener("submit", (e) => {
    e.preventDefault();

    const idOriginal = document.getElementById("prod-id-original").value;
    const nuevoProducto = {
        id: document.getElementById("prod-id").value.trim(),
        nombre: document.getElementById("prod-nombre").value.trim(),
        categoria: document.getElementById("prod-categoria").value,
        precio: parseInt(document.getElementById("prod-precio").value, 10),
        imagen: document.getElementById("prod-imagen").value.trim()
    };

    let productos = JSON.parse(localStorage.getItem("admin_productos")) || [];

    if (idOriginal) {
        // Modo Edición
        productos = productos.map((p) => (p.id === idOriginal ? nuevoProducto : p));
    } else {
        // Modo Creación: Verificar duplicado de ID
        if (productos.some((p) => p.id === nuevoProducto.id)) {
            alert("Error: El ID ingresado ya existe para otro producto.");
            return;
        }
        productos.push(nuevoProducto);
    }

    localStorage.setItem("admin_productos", JSON.stringify(productos));
    renderizarProductos();
    modalProducto.classList.remove("active");
    formProducto.reset();
});

// 7. FUNCIONES DE RENDERIZADO DE TABLAS

function renderizarProductos() {
    const productos = JSON.parse(localStorage.getItem("admin_productos")) || [];
    tablaProductos.innerHTML = "";

    if (productos.length === 0) {
        tablaProductos.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay productos registrados.</td></tr>`;
        return;
    }

    productos.forEach((prod) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td><img src="${prod.imagen}" alt="${prod.nombre}" class="img-thumb"></td>
                <td><strong>${prod.nombre}</strong></td>
                <td><span class="badge-admin">${prod.categoria}</span></td>
                <td>$${prod.precio.toLocaleString("es-CL")}</td>
                <td><code>${prod.id}</code></td>
                <td>
                    <button class="btn-action btn-edit" onclick="prepararEdicion('${prod.id}')" title="Editar">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button class="btn-action btn-delete" onclick="eliminarProducto('${prod.id}')" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
        tablaProductos.appendChild(tr);
    });
}

function renderizarMensajes() {
    const mensajes = JSON.parse(localStorage.getItem("mensajes_contacto")) || [];
    tablaMensajes.innerHTML = "";

    if (mensajes.length === 0) {
        tablaMensajes.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay mensajes recibidos.</td></tr>`;
        return;
    }

    mensajes.forEach((msg, idx) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td><strong>${msg.nombre}</strong></td>
                <td>${msg.email}</td>
                <td>${msg.mensaje}</td>
                <td>
                    <button class="btn-action btn-delete" onclick="eliminarMensaje(${idx})" title="Eliminar">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
        tablaMensajes.appendChild(tr);
    });
}

function renderizarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem("historial_pedidos")) || [];
    tablaPedidos.innerHTML = "";

    if (pedidos.length === 0) {
        tablaPedidos.innerHTML = `<tr><td colspan="4" style="text-align:center;">No hay compras registradas aún.</td></tr>`;
        return;
    }

    pedidos.forEach((p) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td><code>#${p.id}</code></td>
                <td>${p.fecha}</td>
                <td>${p.resumenItems}</td>
                <td><strong>$${p.total.toLocaleString("es-CL")}</strong></td>
            `;
        tablaPedidos.appendChild(tr);
    });
}

// 8. ACCIONES GLOBALES (ACCESIBLES DESDE EVENTOS ONCLICK EN TABLAS)
window.eliminarProducto = function (id) {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${id}"?`)) {
        let productos = JSON.parse(localStorage.getItem("admin_productos")) || [];
        productos = productos.filter((p) => p.id !== id);
        localStorage.setItem("admin_productos", JSON.stringify(productos));
        renderizarProductos();
    }
};

window.prepararEdicion = function (id) {
    const productos = JSON.parse(localStorage.getItem("admin_productos")) || [];
    const prod = productos.find((p) => p.id === id);

    if (prod) {
        document.getElementById("prod-id-original").value = prod.id;
        document.getElementById("prod-id").value = prod.id;
        document.getElementById("prod-nombre").value = prod.nombre;
        document.getElementById("prod-categoria").value = prod.categoria;
        document.getElementById("prod-precio").value = prod.precio;
        document.getElementById("prod-imagen").value = prod.imagen;

        document.getElementById("modal-titulo").textContent = "Editar Producto";
        modalProducto.classList.add("active");
    }
};

window.eliminarMensaje = function (index) {
    if (confirm("¿Deseas borrar este mensaje de la bandeja?")) {
        let mensajes = JSON.parse(localStorage.getItem("mensajes_contacto")) || [];
        mensajes.splice(index, 1);
        localStorage.setItem("mensajes_contacto", JSON.stringify(mensajes));
        renderizarMensajes();
    }
};

// 9. DATOS DE DEMOSTRACIÓN INICIALES
function inicializarDatosDemo() {
    if (!localStorage.getItem("admin_productos")) {
        const productosDemo = [
            {
                id: "tabla-maple-pro-825",
                nombre: "Tabla Maple Pro 8.25",
                categoria: "tablas",
                precio: 45000,
                imagen: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=200"
            },
            {
                id: "lija-premium-black",
                nombre: "Lija Premium Black",
                categoria: "lijas",
                precio: 8900,
                imagen: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=200"
            }
        ];
        localStorage.setItem("admin_productos", JSON.stringify(productosDemo));
    }
}


// Validación y Redirección Login
if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('login-email');
        const email = emailInput ? emailInput.value.trim() : "";

        if (!email) return;

        // Si el correo contiene "admin", entra al panel de administración
        if (email.includes('admin')) {
            window.location.href = 'admin_home.html';
        } else {
            // Cambia 'usuario.html' por el nombre real de tu página principal si es necesario
            window.location.href = 'index.html';
        }
    });
}



// Renderiza las tarjetas leyendo desde localStorage
function renderizarProductosEnTienda(categoriaFiltro = "todo") {
    const contenedor = document.querySelector(".products-grid");
    if (!contenedor) return;

    const productosAdmin = JSON.parse(localStorage.getItem("admin_productos")) || [];

    if (productosAdmin.length === 0) {
        contenedor.innerHTML = `<p style="color: #fff; text-align: center; grid-column: 1/-1;">No hay productos disponibles.</p>`;
        return;
    }

    // Filtrar la lista según el botón seleccionado
    const productosFiltrados = productosAdmin.filter(prod => {
        if (categoriaFiltro === "todo") return true;
        // Compara ignorando mayúsculas/minúsculas y espacios
        return prod.categoria.toLowerCase().trim() === categoriaFiltro.toLowerCase().trim();
    });

    contenedor.innerHTML = "";

    if (productosFiltrados.length === 0) {
        contenedor.innerHTML = `<p style="color: #fff; text-align: center; grid-column: 1/-1;">No hay productos en esta categoría.</p>`;
        return;
    }

    productosFiltrados.forEach((prod) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.setAttribute("data-category", prod.categoria);
        card.setAttribute("data-id", prod.id);
        card.setAttribute("data-price", prod.precio);

        card.innerHTML = `
            <span class="product-badge">${prod.categoria}</span>
            <img src="${prod.imagen}" alt="${prod.nombre}" class="product-img">
            <div class="product-info">
                <p class="product-cat">${prod.categoria}</p>
                <h3 class="product-title">${prod.nombre}</h3>
                <p class="product-price">$${Number(prod.precio).toLocaleString("es-CL")}</p>
                <button class="btn-main btn-cart">
                    <i class="fa-solid fa-cart-shopping"></i> AGREGAR AL CARRITO
                </button>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// Escuchador de clics para los botones de filtrado
document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar todos los productos al inicio
    renderizarProductosEnTienda("todo");

    // 2. Control de clics en los botones de categoría (.cat-btn)
    const filterButtons = document.querySelectorAll(".cat-btn");
    
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Cambiar la clase activa visual
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            // Obtener el valor de data-category del botón
            const categoriaTarget = button.getAttribute("data-category");
            
            // Re-renderizar la lista filtrada
            renderizarProductosEnTienda(categoriaTarget);
        });
    });
});

/* ==========================================
   GESTIÓN DE SESIÓN Y MENÚ DESPLEGABLE NAV
   ========================================== */
(function verificarEstadoSesion() {
    const btnNavLogin = document.getElementById("btn-nav-login");
    const userDropdownMenu = document.getElementById("user-dropdown-menu");
    const userDisplayName = document.getElementById("user-display-name");
    const btnUserAvatar = document.getElementById("btn-user-avatar");
    const dropdownContent = document.getElementById("dropdown-content");
    const btnLogout = document.getElementById("btn-logout");

    // Leer la sesión activa
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuario_logueado"));

    if (usuarioLogueado) {
        // Muestra el avatar y oculta el botón Login
        if (btnNavLogin) btnNavLogin.classList.add("hidden");
        if (userDropdownMenu) userDropdownMenu.classList.remove("hidden");

        // Inserta el nombre del usuario
        if (userDisplayName) {
            const primerNombre = usuarioLogueado.nombre ? usuarioLogueado.nombre.split(" ")[0] : "Usuario";
            userDisplayName.textContent = primerNombre;
        }

        // Evento desplegable
        if (btnUserAvatar && dropdownContent) {
            btnUserAvatar.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdownContent.classList.toggle("hidden");
            });
        }

        // Clic fuera para cerrar el menú
        document.addEventListener("click", () => {
            if (dropdownContent) dropdownContent.classList.add("hidden");
        });

        // Cerrar Sesión
        if (btnLogout) {
            btnLogout.addEventListener("click", () => {
                localStorage.removeItem("usuario_logueado");
                window.location.href = "login.html";
            });
        }
    } else {
        if (btnNavLogin) btnNavLogin.classList.remove("hidden");
        if (userDropdownMenu) userDropdownMenu.classList.add("hidden");
    }
})();


