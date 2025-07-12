const URL_BASE_IMAGENES = "http://localhost:8080/uploads/";
    const productos = JSON.parse(localStorage.getItem("productos_actualizados")) || [];
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