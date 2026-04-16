const contenedorProductos = document.getElementById("contenedor-productos")
const cartHtml = document.getElementById("cart")

let carrito = []
const productos = []

// ================== LOCALSTORAGE ==================

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado !== null) {
        carrito = JSON.parse(carritoGuardado);
    }
}

// ================== FUNCIONES PRINCIPALES ==================

async function obtenerProductos() {
    const res = await fetch('./productos.json')
    const data = await res.json();

    productos.push(...data)
    
    data.forEach(producto => {
      const div = document.createElement("div")
      div.classList.add("producto");

      div.innerHTML = `
        <h2>${producto.nombre}</h2>
        <img src="${producto.img}" alt="${producto.nombre}">
        <p>$${producto.price}</p>
        <button class="btn-comprar">Comprar</button>
      `;

      div.querySelector(".btn-comprar").addEventListener("click", () => {
        agregarAlCarrito(producto.id)
      })

      contenedorProductos.appendChild(div)
    });
}

function agregarAlCarrito(id){
  const producto = productos.find(p => p.id === id)
  if (!producto) return;

  const productoEnCarrito = carrito.find(p => p.id === id)

  if (productoEnCarrito) {
    productoEnCarrito.cantidad += 1
  } else {
    carrito.push({ ...producto, cantidad: 1 })
  }

  guardarCarrito();     // ← Guardamos cambios
  mostrarCarrito()
}

function eliminarProducto(id){
  carrito = carrito.filter(p => p.id !== id)
  guardarCarrito();     // ← Guardamos cambios
  mostrarCarrito()
}

function sumarCantidad(id) {
  const producto = carrito.find(p => p.id === id)
  if (producto) {
    producto.cantidad += 1
    guardarCarrito();
    mostrarCarrito()
  }
}

function restarCantidad(id) {
  const producto = carrito.find(p => p.id === id)
  if (producto) {
    producto.cantidad -= 1
    
    if (producto.cantidad <= 0) {
      eliminarProducto(id)
    } else {
      guardarCarrito();
      mostrarCarrito()
    }
  }
}

function mostrarCarrito(){
  cartHtml.innerHTML = ""

  if (carrito.length === 0) {
    cartHtml.innerHTML = "<p>El carrito está vacío</p>"
    return
  }

  const ul = document.createElement("ul")

  carrito.forEach(producto => {
    const li = document.createElement("li")
    li.textContent = `${producto.nombre} - $${producto.price} `

    // Botones
    const btnRestar = document.createElement("button")
    btnRestar.textContent = "-"
    btnRestar.addEventListener("click", () => restarCantidad(producto.id))

    const btnSumar = document.createElement("button")
    btnSumar.textContent = "+"
    btnSumar.addEventListener("click", () => sumarCantidad(producto.id))

    const btnEliminar = document.createElement("button")
    btnEliminar.textContent = "Eliminar"
    btnEliminar.addEventListener("click", () => eliminarProducto(producto.id))

    li.appendChild(btnRestar)
    li.appendChild(document.createTextNode(` x${producto.cantidad} `))
    li.appendChild(btnSumar)
    li.appendChild(btnEliminar)

    ul.appendChild(li)
  })

  cartHtml.appendChild(ul)
}

// ================== INICIO ==================

cargarCarrito();      // ← Cargamos el carrito guardado
obtenerProductos()
mostrarCarrito()      // ← Mostramos lo que se cargó