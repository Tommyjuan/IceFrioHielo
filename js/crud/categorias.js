const URL_BASE_IMAGENES = "http://localhost:8000/uploads/";
const BACKEND_URL = "http://localhost:8000/api/productos";

async function cargarPorCategorias() {
  try {
    const res = await fetch(BACKEND_URL);
    const productos = await res.json();

    const contenedor = document.getElementById("categoriasContainer");
    const categorias = ["Granizadoras", "Insumos", "Dulces", "Ofertas"];

    categorias.forEach(cat => {
      const filtrados = productos.filter(p => p.categoria === cat);
      if (filtrados.length === 0) return;

      const div = document.createElement("div");
      div.innerHTML = `<h3>${cat}</h3><ul class="barra-productos"></ul>`;
      const ul = div.querySelector("ul");

      filtrados.forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `
          <strong>${p.nombre}</strong> - $${p.precio}<br>
          <img src="${URL_BASE_IMAGENES + p.imagen}" width="40" height="40" /><br>
          <small>${p.descripcion}</small>
        `;
        ul.appendChild(li);
      });

      contenedor.appendChild(div);
    });
  } catch (err) {
    console.error("Error cargando productos por categoría:", err);
  }
}

window.addEventListener("DOMContentLoaded", cargarPorCategorias);
