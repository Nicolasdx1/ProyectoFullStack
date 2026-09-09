document.addEventListener("DOMContentLoaded", () => {
    // DENTRO DE CONTACTO_3.JS (Evento submit del form-login)
    const formLogin = document.getElementById("form-login");

    if (formLogin)
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();

            const email = document.getElementById("login-email").value.trim();
            const nombre = document.getElementById("login-name").value.trim();
            const mensaje = document.getElementById("login-message").value.trim();

            if (!email || !nombre || !mensaje) {
                mostrarNotificacion("Por favor completa todos los campos.", "error");
                return;
            }

            // --- CONEXIÓN CON EL PANEL ADMIN ---
            const nuevoMensaje = {
                nombre: nombre,
                email: email,
                mensaje: mensaje,
                fecha: new Date().toLocaleDateString("es-CL")
            };

            // Obtenemos los mensajes existentes o creamos una lista nueva
            const mensajesExistentes = JSON.parse(localStorage.getItem("mensajes_contacto")) || [];
            mensajesExistentes.push(nuevoMensaje);

            // Guardamos en el localStorage que lee admin.js
            localStorage.setItem("mensajes_contacto", JSON.stringify(mensajesExistentes));

            mostrarNotificacion("¡Mensaje enviado con éxito al administrador!", "exito");
            formLogin.reset();
        });

    // Función auxilar para validar correo electrónico mediante expresión regular
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Función auxiliar para mostrar alertas sin usar alert() nativo
    function mostrarNotificacion(mensaje, tipo) {
        // Remover alerta previa si existe
        const alertaPrevia = document.querySelector(".custom-alert");
        if (alertaPrevia) {
            alertaPrevia.remove();
        }

        // Crear elemento de alerta
        const alerta = document.createElement("div");
        alerta.className = `custom-alert ${tipo}`;
        alerta.textContent = mensaje;

        // Insertar la alerta antes del formulario
        const contactForm = document.getElementById("form-login");
        contactForm.parentNode.insertBefore(alerta, contactForm);

        // Eliminar la alerta automáticamente después de 4 segundos
        setTimeout(() => {
            alerta.remove();
        }, 4000);
    }
})