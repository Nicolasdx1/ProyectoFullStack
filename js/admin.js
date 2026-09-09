document.addEventListener("DOMContentLoaded", () => {
    // 1. INICIALIZAR DATOS BASE 
    inicializarDatosDemo();

    // 2. ELEMENTOS DEL DOM (NAVEGACIÓN Y PRODUCTOS)
    const navButtons = document.querySelectorAll(".nav-btn");
    const sections = document.querySelectorAll(".admin-section");
    const tituloSeccion = document.getElementById("titulo-seccion");

    // Modal para los Productos
    const modalProducto = document.getElementById("modal-producto");
    const btnAbrirModal = document.getElementById("btn-abrir-modal-prod");
    const btnCerrarModal = document.getElementById("btn-cerrar-modal");
    const formProducto = document.getElementById("form-producto");

    // Tablas  de los Productos, Mensajes y Pedidos
    const tablaProductos = document.getElementById("tabla-productos-body");
    const tablaMensajes = document.getElementById("tabla-mensajes-body");
    const tablaPedidos = document.getElementById("tabla-pedidos-body");

    // ELEMENTOS DOM - MÓDULO DE USUARIOS
    const tabClientes = document.getElementById("tab-clientes");
    const tabStaff = document.getElementById("tab-staff");
    const subSecTablaClientes = document.getElementById("sub-sec-tabla-clientes");
    const subSecTablaStaff = document.getElementById("sub-sec-tabla-staff");
    const subSecFormUsr = document.getElementById("sub-sec-form-usuario");

    const tablaClientes = document.getElementById("tabla-clientes-body");
    const tablaStaff = document.getElementById("tabla-staff-body");
    const formUsuario = document.getElementById("form-usuario");
    const selectRegion = document.getElementById("usr-region");
    const selectComuna = document.getElementById("usr-comuna");
    const btnNuevoUsuario = document.getElementById("btn-nuevo-usuario");
    const btnCancelarUsr = document.getElementById("btn-cancelar-usr");

    // DATA MOCK REGIONES Y COMUNAS
    const regionesYComunas = [
        { region: "Región Metropolitana de Santiago", comunas: ["Santiago", "Maipú", "Puente Alto", "Providencia", "Melipilla"] },
        { region: "Región de Valparaíso", comunas: ["Valparaíso", "Viña del Mar", "Quilpué"] },
        { region: "Región de la Araucanía", comunas: ["Temuco", "Padre Las Casas", "Villarrica"] }
    ];

    // 3. NAVEGACIÓN ENTRE PESTAÑAS DEL DASHBOARD
    navButtons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();

            navButtons.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            const targetSectionId = btn.getAttribute("data-section");
            sections.forEach((sec) => sec.classList.remove("active"));
            document.getElementById(targetSectionId).classList.add("active");

            tituloSeccion.textContent = btn.textContent.trim();
        });
    });

    // 4. CONTROL DEL MODAL PRODUCTOS
    btnAbrirModal.addEventListener("click", () => {
        formProducto.reset();
        document.getElementById("prod-id-original").value = "";
        document.getElementById("modal-titulo").textContent = "Nuevo Producto";
        modalProducto.classList.add("active");
    });

    btnCerrarModal.addEventListener("click", () => {
        modalProducto.classList.remove("active");
    });

    modalProducto.addEventListener("click", (e) => {
        if (e.target === modalProducto) {
            modalProducto.classList.remove("active");
        }
    });

    // 5. RENDERIZAR VISTAS INICIALES
    renderizarProductos();
    renderizarUsuarios();
    renderizarMensajes();
    renderizarPedidos();
    inicializarSelectRegiones();

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
            productos = productos.map((p) => (p.id === idOriginal ? nuevoProducto : p));
        } else {
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

    // 7. LÓGICA MÓDULO DE USUARIOS (PESTAÑAS, FORMULARIO Y VALIDACIÓN)
    function inicializarSelectRegiones() {
        regionesYComunas.forEach(reg => {
            const opt = document.createElement("option");
            opt.value = reg.region;
            opt.textContent = reg.region;
            selectRegion.appendChild(opt);
        });
    }

    selectRegion.addEventListener("change", () => {
        selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
        const regionSel = regionesYComunas.find(r => r.region === selectRegion.value);

        if (regionSel) {
            selectComuna.disabled = false;
            regionSel.comunas.forEach(com => {
                const opt = document.createElement("option");
                opt.value = com;
                opt.textContent = com;
                selectComuna.appendChild(opt);
            });
        } else {
            selectComuna.disabled = true;
        }
    });

    // Control de Sub-Pestañas Usuarios (Clientes vs Staff)
    tabClientes.addEventListener("click", () => mostrarTablaUsuarios("clientes"));
    tabStaff.addEventListener("click", () => mostrarTablaUsuarios("staff"));

    function mostrarTablaUsuarios(vista) {
        subSecFormUsr.classList.add("hidden");
        
        if (vista === "clientes") {
            tabClientes.classList.add("active");
            tabStaff.classList.remove("active");
            subSecTablaClientes.classList.remove("hidden");
            subSecTablaStaff.classList.add("hidden");
        } else {
            tabStaff.classList.add("active");
            tabClientes.classList.remove("active");
            subSecTablaStaff.classList.remove("hidden");
            subSecTablaClientes.classList.add("hidden");
        }
    }

    btnNuevoUsuario.addEventListener("click", () => {
        formUsuario.reset();
        document.getElementById("usr-index").value = "-1";
        document.getElementById("form-usr-titulo").textContent = "Nuevo Usuario";
        limpiarErroresUsuario();
        subSecTablaClientes.classList.add("hidden");
        subSecTablaStaff.classList.add("hidden");
        subSecFormUsr.classList.remove("hidden");
    });

    btnCancelarUsr.addEventListener("click", () => {
        if (tabClientes.classList.contains("active")) {
            mostrarTablaUsuarios("clientes");
        } else {
            mostrarTablaUsuarios("staff");
        }
    });

    formUsuario.addEventListener("submit", (e) => {
        e.preventDefault();
        limpiarErroresUsuario();
        let esValido = true;

        const run = document.getElementById("usr-run").value.trim().toUpperCase();
        const nombre = document.getElementById("usr-nombre").value.trim();
        const apellidos = document.getElementById("usr-apellidos").value.trim();
        const email = document.getElementById("usr-email").value.trim().toLowerCase();
        const rol = document.getElementById("usr-rol").value;
        const region = document.getElementById("usr-region").value;
        const comuna = document.getElementById("usr-comuna").value;
        const direccion = document.getElementById("usr-direccion").value.trim();
        const index = parseInt(document.getElementById("usr-index").value);

        const regexRun = /^[0-9]{7,8}[0-9K]$/;
        if (!regexRun.test(run)) {
            mostrarErrorUsuario("err-run", "RUN inválido. Sin puntos ni guión.");
            esValido = false;
        }

        if (!nombre || nombre.length > 50) {
            mostrarErrorUsuario("err-nombre", "Nombre obligatorio (máx 50 caracteres).");
            esValido = false;
        }

        if (!apellidos || apellidos.length > 100) {
            mostrarErrorUsuario("err-apellidos", "Apellidos obligatorios.");
            esValido = false;
        }

        const regexEmail = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;
        if (!regexEmail.test(email)) {
            mostrarErrorUsuario("err-email", "Correo inválido (@duoc.cl, @profesor.duoc.cl o @gmail.com).");
            esValido = false;
        }

        if (!rol) { mostrarErrorUsuario("err-rol", "Selecciona un rol."); esValido = false; }
        if (!region) { mostrarErrorUsuario("err-region", "Selecciona una región."); esValido = false; }
        if (!comuna) { mostrarErrorUsuario("err-comuna", "Selecciona una comuna."); esValido = false; }
        if (!direccion) { mostrarErrorUsuario("err-direccion", "Dirección requerida."); esValido = false; }

        if (!esValido) return;

        let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        
        let passwordFinal = "1234";
        if (rol === "Cliente" && index !== -1) {
            passwordFinal = usuarios[index].password || "cliente123";
        }

        const nuevoUsr = {
            run,
            nombre,
            apellidos,
            email,
            fechaNacimiento: document.getElementById("usr-fecha").value,
            rol,
            region,
            comuna,
            direccion,
            password: (rol === "Administrador" || rol === "Vendedor") ? "1234" : passwordFinal
        };

        if (index === -1) {
            usuarios.push(nuevoUsr);
            alert(`Usuario ${rol} registrado exitosamente.${rol !== 'Cliente' ? ' Contraseña predeterminada: 1234' : ''}`);
        } else {
            usuarios[index] = { ...usuarios[index], ...nuevoUsr };
            alert("Usuario actualizado exitosamente.");
        }

        localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
        renderizarUsuarios();

        if (rol === "Administrador" || rol === "Vendedor") {
            mostrarTablaUsuarios("staff");
        } else {
            mostrarTablaUsuarios("clientes");
        }
    });

    function mostrarErrorUsuario(id, msg) {
        document.getElementById(id).textContent = msg;
    }

    function limpiarErroresUsuario() {
        document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");
    }

    // 8. RENDERIZADO DE TABLAS (PRODUCTOS, CLIENTES, STAFF, MENSAJES, PEDIDOS)
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

    function renderizarUsuarios() {
        const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        tablaClientes.innerHTML = "";
        tablaStaff.innerHTML = "";

        const clientes = [];
        const staff = [];

        usuarios.forEach((usr, originalIndex) => {
            const usrConIndex = { ...usr, originalIndex };
            if (usr.rol === "Administrador" || usr.rol === "Vendedor") {
                staff.push(usrConIndex);
            } else {
                clientes.push(usrConIndex);
            }
        });

        if (clientes.length === 0) {
            tablaClientes.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay clientes registrados.</td></tr>`;
        } else {
            clientes.forEach((usr) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${usr.run || 'N/A'}</td>
                    <td>${usr.nombre} ${usr.apellidos || ''}</td>
                    <td>${usr.email}</td>
                    <td><span class="badge Cliente">Cliente</span></td>
                    <td>${usr.region || ''} / ${usr.comuna || ''}</td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editarUsuario(${usr.originalIndex})" title="Editar">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="eliminarUsuario(${usr.originalIndex})" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaClientes.appendChild(tr);
            });
        }

        if (staff.length === 0) {
            tablaStaff.innerHTML = `<tr><td colspan="6" style="text-align:center;">No hay usuarios administrativos ni empleados.</td></tr>`;
        } else {
            staff.forEach((usr) => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${usr.run || 'N/A'}</td>
                    <td>${usr.nombre} ${usr.apellidos || ''}</td>
                    <td>${usr.email}</td>
                    <td><span class="badge ${usr.rol}">${usr.rol}</span></td>
                    <td><span class="badge-pass">${usr.password || '1234'}</span></td>
                    <td>
                        <button class="btn-action btn-edit" onclick="editarUsuario(${usr.originalIndex})" title="Editar">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button class="btn-action btn-delete" onclick="eliminarUsuario(${usr.originalIndex})" title="Eliminar">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                `;
                tablaStaff.appendChild(tr);
            });
        }
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

    // 9. ACCIONES GLOBALES (ONCLICK EN TABLAS)
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

    window.editarUsuario = function(i) {
        const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
        const u = usuarios[i];

        document.getElementById("usr-index").value = i;
        document.getElementById("usr-run").value = u.run || "";
        document.getElementById("usr-nombre").value = u.nombre || "";
        document.getElementById("usr-apellidos").value = u.apellidos || "";
        document.getElementById("usr-email").value = u.email || "";
        document.getElementById("usr-fecha").value = u.fechaNacimiento || "";
        document.getElementById("usr-rol").value = u.rol || "";
        document.getElementById("usr-region").value = u.region || "";

        selectRegion.dispatchEvent(new Event("change"));
        document.getElementById("usr-comuna").value = u.comuna || "";
        document.getElementById("usr-direccion").value = u.direccion || "";

        document.getElementById("form-usr-titulo").textContent = "Editar Usuario";
        subSecTablaClientes.classList.add("hidden");
        subSecTablaStaff.classList.add("hidden");
        subSecFormUsr.classList.remove("hidden");
    };

    window.eliminarUsuario = function(i) {
        if (confirm("¿Estás seguro de eliminar este usuario?")) {
            let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];
            usuarios.splice(i, 1);
            localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));
            renderizarUsuarios();
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

    // 10. DATOS DE DEMOSTRACIÓN INICIALES
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
});

// FUNCIONES AUXILIARES PARA LA TIENDA Y PEDIDOS
function obtenerProductosParaTienda() {
    const productosGuardados = localStorage.getItem("admin_productos");
    return productosGuardados ? JSON.parse(productosGuardados) : [
        {
            id: "tabla-maple-pro-825",
            nombre: "Tabla Maple Pro 8.25",
            categoria: "tablas",
            precio: 45000,
            imagen: "https://images.unsplash.com/photo-1547447134-cd3f5c716030?q=80&w=200"
        }
    ];
}

function registrarPedidoSimulado(itemsCarrito, totalPagar) {
    const nuevoPedido = {
        id: Math.floor(100000 + Math.random() * 900000),
        fecha: new Date().toLocaleDateString("es-CL"),
        resumenItems: itemsCarrito.map(i => `${i.cantidad}x ${i.nombre}`).join(", "),
        total: totalPagar
    };

    const historial = JSON.parse(localStorage.getItem("historial_pedidos")) || [];
    historial.unshift(nuevoPedido);
    localStorage.setItem("historial_pedidos", JSON.stringify(historial));
}


