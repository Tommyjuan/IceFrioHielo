// Carrusel funcional
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;
    let intervalId;

    function updateCarousel() {
      carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function startAutoSlide() {
      intervalId = setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
      }, 5000);
    }

    function resetAutoSlide() {
      clearInterval(intervalId);
      startAutoSlide();
    }

    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarousel();
      resetAutoSlide();
    });

    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + items.length) % items.length;
      updateCarousel();
      resetAutoSlide();
    });

    // Toggle de tema oscuro/claro
    const themeToggle = document.querySelector('.theme-toggle');
    themeToggle.addEventListener('click', () => {
      document.body.dataset.theme = 
        document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    // Iniciar carrusel automático
    startAutoSlide();
  

// Cargar cabecera y pie de página
    
window.addEventListener('DOMContentLoaded', () => {
    includeHTML('#cabecera', '../template/cabecera.html');
    includeHTML('#pie', '../template/pie.html');
});

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

