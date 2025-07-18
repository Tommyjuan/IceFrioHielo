document.addEventListener("DOMContentLoaded", () => {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const tbody = document.querySelector("#tabla-carrito tbody");
  const totalSpan = document.getElementById("total");

  const BACKEND_URL = "http://localhost:8000/api/productos";

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
    btn.addEventListener("click", async () => {
      const index = btn.dataset.index;
      const producto = carrito[index];

      await devolverCantidadAStock(producto.id, producto.cantidad);

      carrito.splice(index, 1);
      guardarYRender();
    });
  });

  document.querySelectorAll(".btn-aumentar").forEach(btn => {
    btn.addEventListener("click", async () => {
      const index = btn.dataset.index;
      carrito[index].cantidad += 1;

      await actualizarCantidadEnBD(carrito[index].id, carrito[index].cantidad);
      guardarYRender();
    });
  });

  document.querySelectorAll(".btn-disminuir").forEach(btn => {
    btn.addEventListener("click", async () => {
      const index = btn.dataset.index;
      if (carrito[index].cantidad > 1) {
        carrito[index].cantidad -= 1;
        await actualizarCantidadEnBD(carrito[index].id, carrito[index].cantidad);
      } else {
        await actualizarCantidadEnBD(carrito[index].id, 0);
        carrito.splice(index, 1);
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


  async function devolverCantidadAStock(id, cantidadDevuelta) {
  try {
    const res = await fetch(`http://localhost:8000/api/productos/${id}`);
    const producto = await res.json();

    const nuevaCantidad = producto.cantidad + cantidadDevuelta;

    await fetch(`http://localhost:8000/api/productos/${id}/actualizar-cantidad?nueva_cantidad=${nuevaCantidad}`, {
      method: "PATCH"
    });
  } catch (err) {
    console.error("Error devolviendo stock:", err);
  }
}


async function actualizarCantidadEnBD(id, nuevaCantidad) {
  try {
    const response = await fetch(`${BACKEND_URL}/${id}/actualizar-cantidad?nueva_cantidad=${nuevaCantidad}`, {
      method: "PATCH"
    });
    if (!response.ok) throw new Error("Error actualizando cantidad en la base de datos");
  } catch (error) {
    console.error("Error al actualizar la cantidad:", error);
    alert("Error al actualizar la cantidad en la base de datos");
  }
}



});
