let productoEditando = null;

const productosBody = document.getElementById("productosBody");
const categoriasContainer = document.getElementById("categoriasContainer");
const productoForm = document.getElementById("productoForm");
const inputImagen = document.getElementById("imagen");

// URLs
const URL_BASE_IMAGENES = "http://localhost:8000/uploads/";
const BACKEND_URL = "http://localhost:8000/api/productos";

// Detectar si viene con ?editar=ID
const urlParams = new URLSearchParams(window.location.search);
const idEditar = urlParams.get("editar");

// ✅ Cargar datos desde localStorage si existen
const productoLocal = localStorage.getItem("producto_editar");
if (idEditar && productoLocal) {
  const producto = JSON.parse(productoLocal);

  document.getElementById("nombre").value = producto.nombre;
  document.getElementById("descripcion").value = producto.descripcion;
  document.getElementById("precio").value = producto.precio;
  document.getElementById("cantidad").value = producto.cantidad;
  document.getElementById("categoria").value = producto.categoria;

  productoEditando = producto;

  document.querySelector("#productoForm button[type=submit]").textContent = "Editar Producto";
}

// Detectar si viene con ?editar=ID y cargar ese producto
window.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const editarId = urlParams.get("editar");

  await cargarProductos(); // Siempre carga productos para tabla y categorías

  if (editarId) {
    await cargarProductoEditar(editarId); // ✅ CORREGIDO nombre de función
    const boton = document.querySelector("#productoForm button[type=submit]");
    if (boton) boton.textContent = "Editar Producto";
  }
});

// Evento submit: agregar o editar
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
  } else if (productoEditando?.imagen) {
    formData.append("imagen_actual", productoEditando.imagen); // ✅ ENVÍA NOMBRE IMAGEN EXISTENTE
  }

  try {
    const url = productoEditando ? `${BACKEND_URL}/${productoEditando.id}` : BACKEND_URL;
    const method = productoEditando ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: formData,
    });

    productoEditando = null;
    productoForm.reset();
    await cargarProductos();
    await actualizarOtrasPaginas();

    // Limpiar localStorage si se estaba editando
    localStorage.removeItem("producto_editar");

    // Redirigir después de editar
    if (idEditar) {
      window.location.href = "/pages/crud/lista.html";
    }

    // Restaurar texto del botón
    document.querySelector("#productoForm button[type=submit]").textContent = "Agregar Producto";
  } catch (err) {
    console.error("Error al guardar producto:", err);
  }
});

// Cargar producto si estamos editando desde ?editar=ID
async function cargarProductoEditar(id) {
  try {
    const res = await fetch(`${BACKEND_URL}/${id}`);
    const producto = await res.json();

    document.getElementById("nombre").value = producto.nombre;
    document.getElementById("descripcion").value = producto.descripcion;
    document.getElementById("precio").value = producto.precio;
    document.getElementById("cantidad").value = producto.cantidad;
    document.getElementById("categoria").value = producto.categoria;
    
    productoEditando = producto;

    const imagenActual = document.getElementById("imagenActual");
    if (producto.imagen && imagenActual) {
      imagenActual.src = URL_BASE_IMAGENES + producto.imagen;
      imagenActual.style.display = "block";
    }

    document.querySelector("#productoForm button[type=submit]").textContent = "Editar Producto";
  } catch (err) {
    console.error("Error al cargar producto para edición:", err);
  }
}

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

function renderizarTabla(productos) {
  if (!productosBody) return;
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
    btn.addEventListener("click", () =>
      window.location.href = `/pages/crud/crud.html?editar=${btn.dataset.id}`
    )
  );
  document.querySelectorAll(".btn-eliminar").forEach((btn) =>
    btn.addEventListener("click", () => eliminarProducto(btn.dataset.id))
  );
}

function renderizarCategorias(productos) {
  if (!categoriasContainer) return;
  categoriasContainer.innerHTML = "";

  const categorias = ["Granizadoras", "Insumos", "Dulces", "Ofertas"];
  categorias.forEach((cat) => {
    const productosCat = productos.filter((p) => p.categoria === cat);
    if (productosCat.length === 0) return;

    const div = document.createElement("div");
    div.innerHTML = `<h3>${cat}</h3><ul class="barra-productos"></ul>`;
    const ul = div.querySelector("ul");

    productosCat.forEach((p) => {
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

async function eliminarProducto(id) {
  try {
    await fetch(`${BACKEND_URL}/${id}`, { method: "DELETE" });
    await cargarProductos();
    await actualizarOtrasPaginas();
  } catch (err) {
    console.error("Error al eliminar producto:", err);
  }
}

function cerrarSesion() {
  alert("Sesión cerrada");
  window.location.href = "/login";
}

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

window.addEventListener("DOMContentLoaded", cargarProductos);
