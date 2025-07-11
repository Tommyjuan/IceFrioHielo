// Función para incluir HTML (cabecera y pie)
function includeHTML(id, file) {
  const element = document.querySelector(id);
  if (!element) return;
  const xhr = new XMLHttpRequest();
  xhr.open('GET', file, true);
  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        element.innerHTML = this.responseText;
      } else {
        element.innerHTML = '<!-- No se pudo cargar ' + file + ' -->';
      }
    }
  };
  xhr.send();
}

// Ejecutar todo cuando cargue el DOM
window.addEventListener('DOMContentLoaded', () => {
  // Cargar cabecera y pie
  includeHTML('#cabecera', '../template/cabecera.html');
  includeHTML('#pie', '../template/pie.html');

  // Carrusel automático
  const carruselInner = document.querySelector('.carrusel-inner');
  const carruselItems = document.querySelectorAll('.carrusel-item');
  let currentIndex = 0;

  if (carruselInner && carruselItems.length > 0) {
    function cambiarImagen() {
      currentIndex = (currentIndex + 1) % carruselItems.length;
      carruselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    setInterval(cambiarImagen, 4000); 
  }
});

// botón tipo hamburguesa del header
 document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector('.navbar-toggler');
    const searchForm = document.querySelector('.search-form');

    toggleButton.addEventListener('click', function () {
      // Solo se aplica en pantallas pequeñas
      if (window.innerWidth < 992) {
        searchForm.classList.toggle('d-none');
      }
    });
  });