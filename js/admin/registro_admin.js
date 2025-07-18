    document.getElementById('adminForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('nombre').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const token = document.getElementById('token').value;

      try {
        const res = await fetch('http://localhost:8000/api/auth/register-admin?token=' + token, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, password })
        });

        const data = await res.json();
        if (res.ok) {
          alert(data.message);
        } else {
          alert("Error: " + data.detail);
        }
      } catch (error) {
        alert("Error de conexión");
      }
    });
