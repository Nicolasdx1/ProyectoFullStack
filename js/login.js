document.addEventListener("DOMContentLoaded", () => {
    // 1. ELEMENTOS DE LAS PESTAÑAS Y FORMULARIOS
    const tabLogin = document.getElementById("tab-login");
    const tabRegister = document.getElementById("tab-register");
    const formLogin = document.getElementById("form-login");
    const formRegister = document.getElementById("form-register");

    // Elementos dinámicos del registro
    const regRegion = document.getElementById("reg-region");
    const regComuna = document.getElementById("reg-comuna");

    // Datos de Regiones y Comunas de Chile
    const regionesComunas = {
        "Región Metropolitana": ["Santiago", "Providencia", "Las Condes", "Maipú", "Puente Alto", "Melipilla"],
        "Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio"],
        "Biobío": ["Concepción", "Talcahuano", "Los Ángeles", "Chillán", "Coronel"]
    };

    // Cargar Regiones en el Select
    if (regRegion) {
        Object.keys(regionesComunas).forEach(region => {
            const option = document.createElement("option");
            option.value = region;
            option.textContent = region;
            regRegion.appendChild(option);
        });

        // Evento cambio de Región para cargar Comunas
        regRegion.addEventListener("change", (e) => {
            const regionSeleccionada = e.target.value;
            regComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';

            if (regionSeleccionada && regionesComunas[regionSeleccionada]) {
                regComuna.disabled = false;
                regionesComunas[regionSeleccionada].forEach(comuna => {
                    const option = document.createElement("option");
                    option.value = comuna;
                    option.textContent = comuna;
                    regComuna.appendChild(option);
                });
            } else {
                regComuna.disabled = true;
            }
        });
    }

    // 2. CAMBIO ENTRE PESTAÑAS (INICIAR SESIÓN / REGISTRARSE)
    if (tabLogin && tabRegister && formLogin && formRegister) {
        tabLogin.addEventListener("click", () => {
            tabLogin.classList.add("active");
            tabRegister.classList.remove("active");
            formLogin.classList.add("active");
            formRegister.classList.remove("active");
        });

        tabRegister.addEventListener("click", () => {
            tabRegister.classList.add("active");
            tabLogin.classList.remove("active");
            formRegister.classList.add("active");
            formLogin.classList.remove("active");
        });
    }

    // 3. REGISTRO DE NUEVOS USUARIOS
    if (formRegister) {
        formRegister.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = document.getElementById("reg-name").value.trim();
            const email = document.getElementById("reg-email").value.trim().toLowerCase();
            const telefono = document.getElementById("reg-phone").value.trim(); // Opcional
            const region = document.getElementById("reg-region").value;
            const comuna = document.getElementById("reg-comuna").value;
            const password = document.getElementById("reg-password").value;
            const confirmPassword = document.getElementById("reg-confirm-password").value;

            // Validar coincidencia de contraseñas
            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden. Por favor, verifícalas.");
                return;
            }

            // Obtener usuarios guardados o inicializar arreglo
            let usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];

            // Validar si el correo ya existe
            const existe = usuarios.some(u => u.email === email);
            if (existe) {
                alert("Este correo electrónico ya está registrado. Intenta iniciar sesión.");
                return;
            }

            // Guardar nuevo usuario
            usuarios.push({ nombre, email, telefono, region, comuna, password });
            localStorage.setItem("usuarios_registrados", JSON.stringify(usuarios));

            alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
            
            // Limpiar y cambiar a la pestaña de Iniciar Sesión
            formRegister.reset();
            if (regComuna) regComuna.disabled = true;
            tabLogin.click();
        });
    }

    // 4. INICIO DE SESIÓN
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const emailInput = document.getElementById("login-email").value.trim().toLowerCase();
            const passwordInput = document.getElementById("login-password").value;

            // Redirección especial para Administrador
            if (emailInput.includes("admin")) {
                alert("Bienvenido al Panel de Administración");
                window.location.href = "admin.html";
                return;
            }

            // Obtener lista de usuarios registrados
            const usuarios = JSON.parse(localStorage.getItem("usuarios_registrados")) || [];

            // Buscar coincidencia de usuario y contraseña
            const usuarioValido = usuarios.find(u => u.email === emailInput && u.password === passwordInput);

            if (usuarioValido) {
                localStorage.setItem("usuario_logueado", JSON.stringify(usuarioValido));
                alert(`¡Bienvenido de vuelta, ${usuarioValido.nombre}!`);
                window.location.href = "usuario.html";
            } else {
                alert("Correo o contraseña incorrectos. Verifica tus datos o regístrate.");
            }
        });
    }
});


/* ==========================================
   GESTIÓN DE SESIÓN Y MENÚ DESPLEGABLE NAV
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
    verificarEstadoSesion();
});

function verificarEstadoSesion() {
    const btnNavLogin = document.getElementById("btn-nav-login");
    const userDropdownMenu = document.getElementById("user-dropdown-menu");
    const userDisplayName = document.getElementById("user-display-name");
    const btnUserAvatar = document.getElementById("btn-user-avatar");
    const dropdownContent = document.getElementById("dropdown-content");
    const btnLogout = document.getElementById("btn-logout");

    // Leer la sesión activa desde LocalStorage
    const usuarioLogueado = JSON.parse(localStorage.getItem("usuario_logueado"));

    if (usuarioLogueado) {
        // Oculta el botón Login y muestra el menú
        btnNavLogin?.classList.add("hidden");
        userDropdownMenu?.classList.remove("hidden");

        // Nombre de usuario
        if (userDisplayName) {
            const primerNombre = usuarioLogueado.nombre ? usuarioLogueado.nombre.split(" ")[0] : "Usuario";
            userDisplayName.textContent = primerNombre;
        }

        // Toggle Menú desplegable
        if (btnUserAvatar && dropdownContent) {
            btnUserAvatar.addEventListener("click", (e) => {
                e.stopPropagation();
                dropdownContent.classList.toggle("hidden");
            });
        }

        // Cerrar al dar clic fuera
        document.addEventListener("click", () => {
            dropdownContent?.classList.add("hidden");
        });

        // Evento para Cerrar Sesión
        if (btnLogout) {
            btnLogout.addEventListener("click", () => {
                localStorage.removeItem("usuario_logueado");
                window.location.href = "usuario.html";
            });
        }
    } else {
        btnNavLogin?.classList.remove("hidden");
        userDropdownMenu?.classList.add("hidden");
    }
}