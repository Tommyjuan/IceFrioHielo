const URL_BASE_IMAGENES = "http://localhost:8080/uploads/";
    const productos = JSON.parse(localStorage.getItem("productos_actualizados")) || [];

    const tbody = document.getElementById("listaProductosBody");
    productos.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${p.nombre}</td>
        <td><img src="${URL_BASE_IMAGENES + p.imagen}" width="50" height="50" /></td>
        <td>${p.descripcion}</td>
        <td>$${p.precio}</td>
        <td>${p.cantidad}</td>
        <td>${p.categoria}</td>
      `;
      tbody.appendChild(tr);
    });