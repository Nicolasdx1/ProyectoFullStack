// Alternar entre pestañas de Login y Registro
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    formLogin.classList.add('active');
    formRegister.classList.remove('active');
});

tabRegister.addEventListener('click', () => {
    tabRegister.classList.add('active');
    tabLogin.classList.remove('active');
    formRegister.classList.add('active');
    formLogin.classList.remove('active');
});

// Validación de inicio de sesión (Redirección a Administrador vs Cliente)
formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;

    // Simulación de navegación del diagrama de flujo
    if (email.includes('admin')) {
        window.location.href = 'admin_home.html'; // Redirige al panel Admin
    } else {
        window.location.href = 'usuario.html'; // Redirige a la tienda
    }
});