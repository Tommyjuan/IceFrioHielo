document.addEventListener("DOMContentLoaded", () => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const tbody = document.querySelector("#tabla-carrito tbody");
  const totalSpan = document.getElementById("total");

  function renderCarrito() {
    tbody.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
      const subtotal = producto.precio * producto.cantidad;
      total += subtotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="http://localhost:8000/uploads/${producto.imagen}" width="50"></td>
        <td>${producto.nombre}</td>
        <td>${producto.cantidad}</td>
        <td>$${producto.precio}</td>
        <td>$${subtotal}</td>
        <td>
          <button class="btn-disminuir" data-index="${index}">➖</button>
          <button class="btn-aumentar" data-index="${index}">➕</button>
          <button class="btn-quitar" data-index="${index}">❌</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    totalSpan.textContent = `$${total}`;

    agregarEventos();
  }

  function agregarEventos() {
    document.querySelectorAll(".btn-quitar").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        carrito.splice(index, 1);
        guardarYRender();
      });
    });

    document.querySelectorAll(".btn-aumentar").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        carrito[index].cantidad += 1;
        guardarYRender();
      });
    });

    document.querySelectorAll(".btn-disminuir").forEach(btn => {
      btn.addEventListener("click", () => {
        const index = btn.dataset.index;
        if (carrito[index].cantidad > 1) {
          carrito[index].cantidad -= 1;
        } else {
          carrito.splice(index, 1); // Si llega a 0, quitar el producto
        }
        guardarYRender();
      });
    });
  }

  function guardarYRender() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  }

  renderCarrito();
});
