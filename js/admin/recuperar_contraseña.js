async function solicitarToken() {
        const correo = document.getElementById("email").value.trim();

        const res = await fetch("http://localhost:8000/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: correo }) // ✅ Email debe llamarse así
        });

        if (res.ok) {
            const data = await res.json();
            alert("Token generado: " + data.token);
        } else {
            const data = await res.json();
            alert("Error: " + (data.detail || "Correo no encontrado"));
        }
    }

    async function restablecerContrasena() {
        const token = document.getElementById("token").value.trim();
        const nueva = document.getElementById("nueva-contrasena").value.trim();

        const res = await fetch("http://localhost:8000/api/auth/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token: token,
                nueva_contrasena: nueva
            })
        });

        if (res.ok) {
            alert("Contraseña actualizada correctamente");
            window.location.href = "/"; // Puedes cambiar esta ruta si quieres
        } else {
            const data = await res.json();
            alert("Error: " + (data.detail || "Token inválido"));
        }
    }