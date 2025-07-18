document.addEventListener('DOMContentLoaded', () => {
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

    // Cambiar a formulario de registro
    registerBtn.addEventListener('click', () => container.classList.add("active"));
    loginBtn.addEventListener('click', () => container.classList.remove("active"));

    // ✅ REGISTRO
    registerFormBtn.addEventListener('click', async () => {
        const valid = validateForm(registerInputs, registerEmailInput, registerEmailError);
        if (!valid) return;

        const nombre = document.getElementById("register-nombre").value.trim();
        const email = document.getElementById("register-email").value.trim();
        const password = document.querySelector('.sign-up input[placeholder="Contraseña"]').value;
        const rol = "cliente"; // 🔒 Se fuerza a cliente, no editable por el usuario

        try {
            const res = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, email, password, rol })
            });

            if (res.ok) {
                alert("Registro exitoso");
                container.classList.remove("active"); // Te lleva al login visualmente
            } else {
                const errorText = await res.text();
                alert("Error en el registro: " + errorText);
            }
        } catch (error) {
            alert("Error de conexión con el servidor");
        }
    });

    // ✅ LOGIN
    loginFormBtn.addEventListener('click', async () => {
        const valid = validateForm(loginInputs, loginEmailInput, loginEmailError);
        if (!valid) return;

        const email = document.getElementById("login-email").value.trim();
        const password = document.querySelector('.sign-in input[placeholder="Contraseña"]').value;

        try {
            const response = await fetch("http://localhost:8000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("Inicio de sesión exitoso");

                // 🔁 Redirección basada en el valor retornado por el backend
                if (data.message === "admin") {
                    window.location.href = "/pages/crud/crud.html";
                } else {
                    window.location.href = "/pages/ofertas/ofertas.html";
                }
            } else {
                alert("Error: " + (data.detail || "Datos inválidos"));
            }
        } catch (error) {
            alert("Error de conexión al servidor");
        }
    });

    // 🔍 VALIDACIONES
    function validateForm(inputs, emailInput, emailError) {
        let allFilled = true;
        inputs.forEach(input => {
            if (input.value.trim() === "") {
                input.classList.add('error');
                showErrorMessage(input, 'Este campo es obligatorio');
                allFilled = false;
            } else {
                input.classList.remove('error');
                hideErrorMessage(input);
            }
        });

        if (!validateEmail(emailInput, emailError)) allFilled = false;
        return allFilled;
    }

    function validateEmail(input, errorElement) {
        const email = input.value;
        if (!email.includes('@gmail.com','admin.com')) {
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
