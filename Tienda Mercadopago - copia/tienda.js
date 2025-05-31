const productos = [
    { id: 1, nombre: "Remera Manga corta azul", precio: 500, imagen: "img/remera1.jpg", descripcion: "de algodón 100%" },
    { id: 2, nombre: "Remera manga corta azul oscuro", precio: 1500, imagen: "img/remera2.webp", descripcion: "algodón 75% licra 25%" },
    { id: 3, nombre: "Remera manga corta blanca", precio: 2000, imagen: "img/remera3.jpg", descripcion: "algodón 100% con estampado" },
    { id: 4, nombre: "Remera manga corta negra", precio: 2500, imagen: "img/remera4.jpg", descripcion: "algodón 75% licra 25%" },
    { id: 5, nombre: "Remera manga corta gris", precio: 3000, imagen: "img/remera5.webp", descripcion: "algodón 100%" }
];

let carrito = [];

// Mostrar productos en la página
function mostrarProductos() {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";
    productos.forEach(producto => {
        contenedor.innerHTML += `
            <div class="col-md-4">
                <div class="card mb-3">
                    <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    <div class="card-body">
                        <h5>${producto.nombre}</h5>
                        <p><strong>Precio:</strong> $${producto.precio}</p>
                        <p><strong>Descripción:</strong> ${producto.descripcion}</p>
                        <input type="number" id="cantidad-${producto.id}" class="form-control mb-2" value="1" min="1">
                        <button class="btn btn-success" onclick="agregarAlCarrito(${producto.id})">Agregar al carrito</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// Agregar producto al carrito con cantidad
function agregarAlCarrito(id) {
    const cantidad = parseInt(document.getElementById(`cantidad-${id}`).value);
    const producto = productos.find(p => p.id === id);

    if (producto) {
        const existeEnCarrito = carrito.find(item => item.id === id);
        if (existeEnCarrito) {
            existeEnCarrito.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        mostrarCarrito();
        Swal.fire("Agregado", `${producto.nombre} x${cantidad} agregado al carrito`, "success");
    }
}

// Mostrar los productos en el carrito con cantidad
function mostrarCarrito() {
    const lista = document.getElementById("carrito");
    lista.innerHTML = "";
    carrito.forEach((producto, index) => {
        lista.innerHTML += `<li class="list-group-item">${producto.nombre} x${producto.cantidad} - $${producto.precio * producto.cantidad} <button class="btn btn-danger btn-sm float-end" onclick="eliminarDelCarrito(${index})">X</button></li>`;
    });
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    mostrarCarrito();
}

// Pagar con Mercado Pago
async function pagar() {
    if (carrito.length === 0) {
        Swal.fire("Carrito vacío", "Agrega productos antes de pagar", "warning");
        return;
    }

    const items = carrito.map(producto => ({
        title: producto.nombre,
        quantity: producto.cantidad,
        unit_price: producto.precio,
        currency_id: "ARS"
    }));

    const total = carrito.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);

    // Configura el public_key de Mercado Pago
    const mp = new MercadoPago('#', {
        locale: 'es-AR'
    });

    // Crear la preferencia de pago
    const response = await fetch("#", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer APP_USR-7662969524140814-022018-66e03b6ad76524a1f0b34d6121a47817-254665851"
        },
        body: JSON.stringify({
            items: items,
            back_urls: {
                success: "https://tienda-keylor.netlify.app/success",
                failure: "https://tienda-keylor.netlify.app/failure",
                pending: "https://tienda-keylor.netlify.app/pending"
            },
            auto_return: "approved"
        })
    });

    const data = await response.json();
    console.log(data);  // Verifica la respuesta de la API

    if (data.init_point) {
        window.location.href = data.init_point;
    } else {
        Swal.fire("Error", "Hubo un problema al procesar el pago", "error");
    }
}

document.addEventListener("DOMContentLoaded", mostrarProductos);
