const URL_BASE_IMAGENES = "http://localhost:8000/uploads/";
const BACKEND_URL = "http://localhost:8000/api/productos";

async function cargarListaProductos() {
  try {
    const res = await fetch(BACKEND_URL);
    const productos = await res.json();

    const tbody = document.getElementById("listaProductosBody");
    tbody.innerHTML = ""; // Limpiar tabla antes de cargar

    productos.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td><img src="${URL_BASE_IMAGENES + p.imagen}" width="50" height="50" /></td>
        <td>${p.descripcion}</td>
        <td>$${p.precio}</td>
        <td>${p.cantidad}</td>
        <td>${p.categoria}</td>
        <td>
          <button class="btn-editar" data-id="${p.id}">Editar</button>
          <button class="btn-eliminar" data-id="${p.id}">Eliminar</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Activar botones después de renderizar
    document.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const producto = productos.find(p => p.id == id); // Buscar el producto

        if (producto) {
          // Guardar producto en localStorage
          localStorage.setItem("producto_editar", JSON.stringify(producto));

          // Redireccionar al CRUD
          const rutaCRUD = "/pages/crud/crud.html";
          window.location.href = `${rutaCRUD}?editar=${id}`;
        }
      });
    });

    document.querySelectorAll(".btn-eliminar").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (confirm("¿Estás seguro de eliminar este producto?")) {
          try {
            await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
            alert("Producto eliminado correctamente");
            cargarListaProductos(); // Recargar la tabla
          } catch (err) {
            console.error("Error al eliminar:", err);
          }
        }
      });
    });

  } catch (err) {
    console.error("Error cargando lista de productos:", err);
  }
}

window.addEventListener("DOMContentLoaded", cargarListaProductos);
