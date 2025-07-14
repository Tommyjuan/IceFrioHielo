function includeHTML() {
  document.querySelectorAll("[data-include]").forEach((el) => {
    const file = el.getAttribute("data-include");
    if (!file) return;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", file, true);
    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) el.innerHTML = this.responseText;
        else el.innerHTML = `<!-- Error al cargar ${file} -->`;
      }
    };
    xhr.send();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  includeHTML();

  // Carrusel automático
  const carruselInner = document.querySelector(".carrusel-inner");
  const carruselItems = document.querySelectorAll(".carrusel-item");
  let currentIndex = 0;

  if (carruselInner && carruselItems.length > 0) {
    function cambiarImagen() {
      currentIndex = (currentIndex + 1) % carruselItems.length;
      carruselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(cambiarImagen, 4000);
  }

  // botón tipo hamburguesa del header
  const toggleButton = document.querySelector(".navbar-toggler");
  const searchForm = document.querySelector(".search-form");

  if (toggleButton && searchForm) {
    toggleButton.addEventListener("click", function () {
      if (window.innerWidth < 992) {
        searchForm.classList.toggle("d-none");
      }
    });
  }
});


/* carga los productos a sus respetivas paguinas */
function cargarProductosPorCategoria(categoria, contenedorId) {
  const contenedor = document.getElementById(contenedorId);
  if (!contenedor) return;

  const productosStr = localStorage.getItem("productos_actualizados");
  if (!productosStr) return;

  const productos = JSON.parse(productosStr);
  const filtrados = productos.filter(p => p.categoria === categoria);

  contenedor.innerHTML = "";
  filtrados.forEach(producto => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
      <img src="http://localhost:8000/uploads/${producto.imagen}" alt="${producto.nombre}">
      <p>${producto.descripcion}</p>
      <p class="precio">$${producto.precio}</p>
      <button class="agregar-al-carrito" onclick="agregarAlCarrito('${producto.nombre}', '$${producto.precio}')">
        <span class="icono-carrito">&#128722;</span> Agregar al carrito
      </button>
    `;
    contenedor.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // Detectar la página actual y cargar según corresponda
  if (document.getElementById("productosDulces")) {
    cargarProductosPorCategoria("Dulces", "productosDulces");
  }

  if (document.getElementById("productosInsumos")) {
    cargarProductosPorCategoria("Insumos", "productosInsumos");
  }

  if (document.getElementById("productosGranizadoras")) {
    cargarProductosPorCategoria("Granizadoras", "productosGranizadoras");
  }

  if (document.getElementById("productosOfertas")) {
    cargarProductosPorCategoria("Ofertas", "productosOfertas");
  }
});

