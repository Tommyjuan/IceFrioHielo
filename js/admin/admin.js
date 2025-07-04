document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const registerFormBtn = document.getElementById('register-btn');
    const loginFormBtn = document.getElementById('login-btn');
    const registerEmailInput = document.getElementById('register-email');
    const loginEmailInput = document.getElementById('login-email');
    const registerEmailError = document.getElementById('register-email-error');
    const loginEmailError = document.getElementById('login-email-error');
    const registerInputs = document.querySelectorAll('.sign-up input');
    const loginInputs = document.querySelectorAll('.sign-in input');

    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    // Validación y envío del formulario de registro
    registerFormBtn.addEventListener('click', async () => {
        const valid = validateForm(registerInputs, registerEmailInput, registerEmailError);
        if (!valid) return;

        // **Capturamos TODOS los campos que el backend necesita**
        const nombre = document.getElementById("register-nombre").value.trim();
        const correo = document.getElementById("register-email").value.trim();
        const contrasena = document.querySelector('.sign-up input[placeholder="Contraseña"]').value;

        // Validar que nombre no esté vacío
        if(nombre === "") {
            alert("El nombre es obligatorio");
            return;
        }

        try {
            const res = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // Aquí enviamos el JSON con todos los campos completos
                body: JSON.stringify({ nombre, correo, contrasena })
            });

            if (res.ok) {
                alert("Registro exitoso");
                window.location.href = "/login"; // Redirige donde quieras
            } else {
                const errorText = await res.text();
                alert("Error en el registro: " + errorText);
            }
        } catch (error) {
            alert("Error de conexión con el servidor");
            console.error(error);
        }
    });

    // Validación y envío del formulario de login
    loginFormBtn.addEventListener('click', async () => {
        const valid = validateForm(loginInputs, loginEmailInput, loginEmailError);
        if (!valid) return;

        const correo = document.getElementById("login-email").value.trim();
        const contrasena = document.querySelector('.sign-in input[placeholder="Contraseña"]').value;

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, contrasena })
            });

            const data = await response.text();

            if (response.ok) {
                alert("Inicio de sesión exitoso");
                window.location.href = "/crud"; // Redirige al CRUD real
            } else {
                alert("Error: " + data);
            }

        } catch (error) {
            alert("Error de conexión al servidor");
            console.error(error);
        }
    });

    // Funciones de validación (sin cambios)
    function validateForm(inputs, emailInput, emailError) {
        let allFilled = true;
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                input.classList.add('error');
                allFilled = false;
                showErrorMessage(input, 'Este campo es obligatorio');
            } else {
                input.classList.remove('error');
                hideErrorMessage(input);
            }
        });

        if (!validateEmail(emailInput, emailError)) {
            allFilled = false;
        }
        return allFilled;
    }

    function validateEmail(input, errorElement) {
        const email = input.value;
        if (!email.includes('@gmail.com')) {
            input.classList.add('error');
            errorElement.textContent = 'El correo debe ser @gmail.com';
            errorElement.style.display = 'block';
            return false;
        } else {
            input.classList.remove('error');
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            return true;
        }
    }

    function showErrorMessage(input, message) {
        let errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('small');
            errorElement.classList.add('error-message');
            input.parentNode.insertBefore(errorElement, input.nextSibling);
        }
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function hideErrorMessage(input) {
        let errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('error-message')) {
            errorElement.style.display = 'none';
        }
    }
});
