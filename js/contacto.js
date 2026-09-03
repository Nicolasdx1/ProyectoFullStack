document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.getElementById("form-login");

    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();

            // Obtener los valores de los campos
            const emailInput = document.getElementById("login-email");
            const nameInput = document.getElementById("login-name");
            const messageInput = document.getElementById("login-message");

            const email = emailInput.value.trim();
            const name = nameInput.value.trim();
            const message = messageInput.value.trim();

            // Validar que no haya campos vacíos
            if (!email || !name || !message) {
                mostrarNotificacion("Por favor, completa todos los campos del formulario.", "error");
                return;
            }

            // Validar formato de correo electrónico
            if (!validarEmail(email)) {
                mostrarNotificacion("Ingresa un correo electrónico válido.", "error");
                emailInput.focus();
                return;
            }

            // Simulación de envío exitoso
            mostrarNotificacion(`¡Gracias ${name}! Tu mensaje ha sido enviado correctamente.`, "exito");

            // Limpiar los campos del formulario
            contactForm.reset();
        });
    }
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