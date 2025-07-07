let productoEditando = null;

const productosBody = document.getElementById("productosBody");
const categoriasContainer = document.getElementById("categoriasContainer");
const productoForm = document.getElementById("productoForm");
const inputImagen = document.getElementById("imagen");

const URL_BASE_IMAGENES = "http://localhost:8080/uploads/";
const BACKEND_URL = "http://localhost:8080/api/productos";

// Evento para guardar o editar producto
productoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("nombre", document.getElementById("nombre").value);
  formData.append("descripcion", document.getElementById("descripcion").value);
  formData.append("precio", document.getElementById("precio").value);
  formData.append("cantidad", document.getElementById("cantidad").value);
  formData.append("categoria", document.getElementById("categoria").value);

  const imagenFile = inputImagen.files[0];
  if (imagenFile) {
    const newName = imagenFile.name.replace(/\s+/g, "_");
    const renamedFile = new File([imagenFile], newName, { type: imagenFile.type });
    formData.append("imagen", renamedFile);
  }

  try {
    if (productoEditando) {
      await fetch(`${BACKEND_URL}/${productoEditando.id}`, {
        method: "PUT",
        body: formData,
      });
      productoEditando = null;
    } else {
      await fetch(BACKEND_URL, {
        method: "POST",
        body: formData,
      });
    }

    productoForm.reset();
    await cargarProductos();
    await actualizarOtrasPaginas();
  } catch (err) {
    console.error("Error al guardar producto:", err);
  }
});

// Cargar todos los productos
async function cargarProductos() {
  try {
    const res = await fetch(BACKEND_URL);
    const productos = await res.json();

    renderizarTabla(productos);
    renderizarCategorias(productos);
  } catch (err) {
    console.error("Error al cargar productos:", err);
  }
}

// Renderiza tabla principal
function renderizarTabla(productos) {
  productosBody.innerHTML = "";

  productos.forEach((producto) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${producto.nombre}</td>
      <td><img src="${URL_BASE_IMAGENES + producto.imagen}" width="50" height="50" /></td>
      <td>${producto.descripcion}</td>
      <td>$${producto.precio}</td>
      <td>${producto.cantidad}</td>
      <td>${producto.categoria}</td>
      <td>
        <button class="btn-editar" data-id="${producto.id}">Editar</button>
        <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
      </td>
    `;

    productosBody.appendChild(tr);
  });

  document.querySelectorAll(".btn-editar").forEach((btn) =>
    btn.addEventListener("click", () => editarProducto(btn.dataset.id))
  );

  document.querySelectorAll(".btn-eliminar").forEach((btn) =>
    btn.addEventListener("click", () => eliminarProducto(btn.dataset.id))
  );
}

// Renderiza productos por categoría (solo 3)
function renderizarCategorias(productos) {
  categoriasContainer.innerHTML = "";

  const categorias = ["Granizadoras", "Insumos", "Dulces"];

  categorias.forEach((cat) => {
    const productosCat = productos.filter(p => p.categoria === cat);
    if (productosCat.length === 0) return;

    const div = document.createElement("div");
    div.innerHTML = `<h3>${cat}</h3><ul class="barra-productos"></ul>`;
    const ul = div.querySelector("ul");

    productosCat.forEach(p => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${p.nombre}</strong> - $${p.precio}<br>
        <img src="${URL_BASE_IMAGENES + p.imagen}" width="40" height="40" /><br>
        <small>${p.descripcion}</small>
      `;
      ul.appendChild(li);
    });

    categoriasContainer.appendChild(div);
  });
}

// Editar producto
async function editarProducto(id) {
  try {
    const res = await fetch(`${BACKEND_URL}/${id}`);
    const producto = await res.json();

    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("cantidad").value = producto.cantidad;
    document.getElementById("categoria").value = producto.categoria;

    productoEditando = producto;
  } catch (err) {
    console.error("Error al cargar producto:", err);
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  try {
    await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
    await cargarProductos();
    await actualizarOtrasPaginas();
  } catch (err) {
    console.error("Error al eliminar producto:", err);
  }
}

// Cierre de sesión
function cerrarSesion() {
  alert("Sesión cerrada");
  window.location.href = "/login";
}

// Actualizar otras páginas (guardando en localStorage)
async function actualizarOtrasPaginas() {
  try {
    const res = await fetch(BACKEND_URL);
    const productos = await res.json();
    localStorage.setItem("productos_actualizados", JSON.stringify(productos));
    localStorage.setItem("productos_evento", Date.now());
  } catch (err) {
    console.error("Error al actualizar otras páginas:", err);
  }
}

// Cargar productos al iniciar
window.addEventListener("DOMContentLoaded", cargarProductos);
