const homeInstrument = document.getElementById("homeInstrument");
const boxContainer = document.getElementById("box-container");
//funcion asincrona 
let carrito = JSON.parse(localStorage.getItem("guardarCompra")) || [];

const getProducts = async () => {
    const respuesta = await fetch("data.json");
    const data = await respuesta.json();

    data.forEach((producto) => {
    let content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
        <img src="${producto.img}">
        <h3>${producto.nombre}</h3>
        <p class="price">$${producto.precio}</p>
            `;
    homeInstrument.append(content);

    let comprar = document.createElement("button");
    comprar.innerText = "Agregar al carrito";
    comprar.className = "agregar-al-carrito";
    content.append(comprar);

    comprar.addEventListener("click", () => {
        agregarAlCarrito(producto);
        CarritoEnPagina();
    });
});
//carrito (para que no repita producto)
function agregarAlCarrito(producto) {
    const repeat = carrito.some ((repeatproducto) => repeatproducto.id === producto.id);
    if(repeat){
        carrito.map((product) => {
            if(product.id === producto.id){
                product.cantidad++;
            }
        });
    } else {
    carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        img: producto.img,
        cantidad: producto.cantidad,
    });
}
    saveLocal();
};
//carrito
function CarritoEnPagina() {
    boxContainer.style.display = "block"
    boxContainer.innerHTML = "";
    const boxHeader = document.createElement("div");
    boxHeader.className = "boxHeader";
    boxHeader.innerHTML = ` <h1 class="boxHeader-titulo">Tu Carrito</h1>`;
    boxContainer.append(boxHeader);

    carrito.forEach((producto) => {
        let carritoContainer = document.createElement("div");
        carritoContainer.className = "carrito-container";
        carritoContainer.innerHTML = `<img src="${producto.img}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio}</p>
            <span class="restar"> restar </span>
            <p>Cantidad: ${producto.cantidad}</p>
            <span class="sumar"> sumar </span>
            <p>Total: $${producto.cantidad * producto.precio}</p>`;
    
        
        let eliminarBtn = document.createElement("button");
        eliminarBtn.className = "eliminar-producto";
        eliminarBtn.innerText = "Eliminar producto";
        eliminarBtn.addEventListener("click", () => eliminarProducto(producto.id));
    
        carritoContainer.append(eliminarBtn);

        let pagarBtn = document.createElement("button");
        pagarBtn.className = "pagar";
        pagarBtn.innerText = "Pagar";
        pagarBtn.addEventListener("click", () => pagarCarrito());
        carritoContainer.append(pagarBtn);
    
        boxContainer.append(carritoContainer);
        let restar = carritoContainer.querySelector(".restar")
        restar.addEventListener("click", () => {
            if(producto.cantidad !== 1) {
                producto.cantidad--;
            }
            saveLocal();
            CarritoEnPagina();
        });
        let sumar = carritoContainer.querySelector(".sumar")
        sumar.addEventListener("click", () => {
            producto.cantidad++;
            saveLocal();
            CarritoEnPagina();
        });
    });

    const boxButton = document.createElement("h3");
    boxButton.innerText = "cerrar";
    boxButton.className = "boxHeader-Button";
    boxButton.addEventListener("click", () => {
        boxContainer.style.display = "none"
    })
    boxHeader.append(boxButton)
//calcular el total a pagar
    const total = carrito.reduce((acc, instrumentos) => acc + instrumentos.precio * instrumentos.cantidad, 0);
    const totalComprado = document.createElement("div");
    totalComprado.className = "total-compra";
    totalComprado.innerHTML = `total a pagar: $${total}`;
    boxContainer.append(totalComprado);
};
//filtrar productos por id
function eliminarProducto(id) {
    carrito = carrito.filter((producto) => producto.id !== id);
    CarritoEnPagina();
    saveLocal();
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger",
        },
        buttonsStyling: false
      });
      swalWithBootstrapButtons.fire({
        title: "Estas seguro?",
        text: "No puedes revertirlo despues",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, Eliminar producto",
        cancelButtonText: "No, cancelar",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Producto eliminado",
            text: "Tu producto se borro de la lista",
            icon: "success"
          });
        } else if (
          
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado",
            text: "Tu archivo esta seguro",
            icon: "error"
          });
        }
      });
}
function pagarCarrito() {
    Swal.fire("Felicitaciones, disfruta tu instrumento!");
    carrito = [];
    CarritoEnPagina();
}
const saveLocal = () => {
    localStorage.setItem("guardarCompra", JSON.stringify(carrito));
};
};
getProducts();






   
    