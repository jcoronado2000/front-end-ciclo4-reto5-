
/**
 * Ejecucion inicial
 */

/**
 * Inventario Productos
 */
/**
 * endPoint de inventario
 */
//const endPointProducto = "http://localhost:8080/api/supplements";
//const endPointUser = "http://localhost:8080/api/user";
//const endPointOrder = "http://localhost:8080/api/order";
const endPointProducto = "http://150.230.88.187:8080/api/supplements"; 
const endPointUser = "http://150.230.88.187:8080/api/user"; 
const endPointOrder = "http://150.230.88.187:8080/api/order"; 
let userJson = sessionStorage.getItem("user");
let userJs;
// carga de datos
let arrayObjetos = [];
// OrdenesAgregadas
let arrayOrdenesLista = [];
// CantidadesOrdenes
let cantidadOrdenesLista = [];
// OrdenRegistradas
let ordenesCargadasMongo = [];
// OrdenCargadaAmodal
let ordenCargadaModal = [];
let idReference;
let ventaTotal = 0;
/**
 * Validar Datos Vacion Para Registro
 */
function validarCamposVaciosPedidos() {

    let fecha = $("#fechaOrden").val();
    let producto = $("#retornarSelectProducto").val();
    let cantidad = $("#cantidadProducto").val();
    let productos = {};
    let quantities = {};

    if (fecha == "" || producto == "" || cantidad == "") {
        swal.fire("info", "Hay campos vacios", "warning");
    } else {
        for (let index = 0; index < arrayOrdenesLista.length; index++) {
            productos[arrayOrdenesLista[index].reference] = (arrayOrdenesLista[index]);
            quantities[arrayOrdenesLista[index].reference] = (cantidadOrdenesLista[index].amount);
        }
        functionGuardarRegistro(productos, quantities);
    }
}
/**
 * Registrar Producto
 */
function functionGuardarRegistro(productos, quantities) {

    $.ajax({
        method: "POST",
        url: endPointOrder + "/new",
        data: jsonOders(productos, quantities),
        dataType: "jsonOders",
        contentType: "application/json",
        complete: function (response) {
            let respustaJsonCreado = response.responseText;
            let idRespues = JSON.parse(respustaJsonCreado);
            if (response.status == 201) {
                swal.fire("Registro exitoso", "Numero de orden" + idRespues.id, "success")
                    .then((value) => {
                        window.location.reload();
                    });
            } else {
                swal.fire("Error", "Error al insertar datos " + response.status, "warning");
            }
        }

    })

}
function jsonOders(products, quantities) {

    let date = new Date($("#fechaOrden").val());
    let result = date.toISOString();
    dataProduct = {
        registerDay: result,
        status: "Pendiente",
        salesMan: userJs,
        products,
        quantities
    }
    console.log(JSON.stringify(dataProduct));
    return JSON.stringify(dataProduct);

}
/**
 * Retornar Data Table
 */

function retornarDataMongo() {
    $.ajax({
        method: "GET",
        url: endPointProducto + "/all",
        success: function (data) {
            retornarDataTable(data);
            arrayObjetos.push(data);
        }
    });
}
function retornarDataMongoOrder() {
    $.ajax({
        method: "GET",
        url: `${endPointOrder}/salesman/${userJs.id}`,
        success: function (data) {
            retornarDataTableOrder(data);
            ordenesCargadasMongo.push(data);
        }
    });
}
function retornarDataTable(respuesta) {
    let cadena = "";

    respuesta.forEach(element => {
        cadena += `<option value='${element.reference}'>${element.brand}</option>`;
    });

    $("#retornarSelectProducto").html(cadena);
}
function retornarDataTableOrder(respuesta) {

    let tablaListaOrdenes = "";

    respuesta.forEach(element => {
        let uperCase = element.salesMan.name;
        let fecha = element.registerDay.split("T");
        uperCase = uperCase.toLowerCase();
        tablaListaOrdenes += `<tr><th>${element.id}</th><th>${fecha[0]}</th><th>${element.status}</th><th>${uperCase}</th><th><button type="button" class="btn btn-outline-info" data-toggle="modal" data-target="#exampleModalVer" onclick="cargarOrdenPedidoModal(${element.id})">Ver</button></th></tr>`
    });

    $("#retornarTablaCliente").html(tablaListaOrdenes);

}
/**
 * 
 * Eliminar dataDeLaOrden
 */
function eliminarOrden(idReferenceEliminar) {
    for (let index = 0; index < cantidadOrdenesLista.length; index++) {
        if (cantidadOrdenesLista[index].reference == idReferenceEliminar) {
            cantidadOrdenesLista.splice(index, 1);
            visualizarPedido();
        }
        if (arrayOrdenesLista[index].reference == idReferenceEliminar) {
            arrayOrdenesLista.splice(index, 1);
        }
    }

}
$("#cerrarSesion").click(function () {
    sessionStorage.removeItem("user");
    window.location.href = "index.html";
})

$("#retornarSelectProducto").change(function () {
    let variableId = $("#retornarSelectProducto").val();
    for (let i = 0; i < arrayObjetos[0].length; i++) {
        if (arrayObjetos[0][i].reference == variableId) {
            let precioProduct = arrayObjetos[0][i].price;
            $("#precioProducto").val(precioProduct);
            if (ventaTotal == 0) {
                $("#TotalOrden").val(precioProduct);
            }
            break;
        }
    }
})
$("#agregarProduct").click(function () {
    let cantidad = parseInt($("#cantidadProducto").val());
    let precio = parseInt($("#precioProducto").val());
    if (ventaTotal == 0) {
        ventaTotal = cantidad * precio;
        idReference = $("#retornarSelectProducto").val();
        for (let i = 0; i < arrayObjetos[0].length; i++) {
            if (arrayObjetos[0][i].reference == idReference) {
                arrayOrdenesLista.push(arrayObjetos[0][i]);
                let producto = arrayObjetos[0][i].brand
                guardarDataJsonOrdenTabla(idReference, producto, cantidad, precio, ventaTotal);
                break;
            }
        }
    } else {
        ventaTotal = ventaTotal + (cantidad * precio);
        idReference = $("#retornarSelectProducto").val();
        for (let i = 0; i < arrayObjetos[0].length; i++) {
            if (arrayObjetos[0][i].reference == idReference) {
                let banderaAgregarProductoJson = false;
                for (let index = 0; index < arrayOrdenesLista.length; index++) {
                    if (arrayOrdenesLista[index].reference == idReference) {
                        let producto = arrayObjetos[0][index].brand
                        guardarDataJsonOrdenTabla(idReference, producto, cantidad, precio, (precio * cantidad));
                        banderaAgregarProductoJson = false;
                        break;
                    } else {
                        banderaAgregarProductoJson = true;
                    }
                }
                if (banderaAgregarProductoJson == true) {
                    arrayOrdenesLista.push(arrayObjetos[0][i]);
                    let producto = arrayObjetos[0][i].brand
                    guardarDataJsonOrdenTabla(idReference, producto, cantidad, precio, (precio * cantidad));
                    break;
                }
            }
        }
    }
    $("#TotalOrden").val(ventaTotal);
    //console.log(arrayOrdenesLista);
})
/**
 * Consultas Por fecha y id
 */
$("#consultarFechaId").click(function () {
    let fechaSolicitud = $("#fechaOrdenConsulta").val();
    $.ajax({
        method: "GET",
        url: `${endPointOrder}/date/${fechaSolicitud}/${userJs.id}`,
        success: function (data) {
            retornarDataTableOrder(data);
            swal.fire({
                title: "Consulta exitosa",
                icon: "success",
                position: 'bottom-start',
                showConfirmButton: false,
                heightAuto: false,
                width: 300,
                timer: 1000
            });
        }
    });
})
$("#consultarStatusId").click(function () {
    let statusSolicitado = $("#statusOrdenConsulta").val();
    $.ajax({
        method: "GET",
        url: `${endPointOrder}/state/${statusSolicitado}/${userJs.id}`,
        success: function (data) {
            retornarDataTableOrder(data);
            swal.fire({
                title: "Consulta exitosa",
                icon: "success",
                position: 'bottom-start',
                showConfirmButton: false,
                heightAuto: false,
                width: 300,
                timer: 1000
            });
        }
    });
})
/**
 * Retorna Data Pedido Realizado
 */
function cargarOrdenPedidoModal(id) {
    for (let index = 0; index < ordenesCargadasMongo[0].length; index++) {
        if (ordenesCargadasMongo[0][index].id == id) {
            ordenCargadaModal[0] = (ordenesCargadasMongo[0][index]);
            RetornarDataModal(ordenCargadaModal[0]);
            break;
        }
    }
}
function RetornarDataModal(dataMongo) {
    let cadenaDetalle;
    let ttt = dataMongo.products;
    let quantities = dataMongo.quantities;
    let dataT = Object.keys(ttt);


    for (let index = 0; index < dataT.length; index++) {
        console.log(ttt[dataT[index]]);

        let brand = ttt[dataT[index]].brand;
        let category = ttt[dataT[index]].category;
        let fecha = dataMongo.registerDay.split("T");
        brand = brand.toLowerCase();
        category = category.toLowerCase();

        cadenaDetalle += `<tr>
                <th>${ttt[dataT[index]].reference}</th>
                <th>${fecha[0]}</th>
                <th>${brand}</th>
                <th>${category}</th>
                <th>${ttt[dataT[index]].price}</th>
                <th>${quantities[dataT[index]]}</th>
                <th>${dataMongo.status}</th>
                </tr>`


    }

    $("#verDetallePedidoCargaMongo").html(cadenaDetalle);
}



function visualizarPedido() {

    let tablaVisualizar = "";
    let totalVentasConsumidas = 0;
    let fecha = new Date();


    cantidadOrdenesLista.forEach(element => {
        tablaVisualizar += `<tr><th>${element.reference}</th><th>${element.brand}</th><th>${element.amount}</th><th>${element.price}</th><th>${element.totalSale}</th><th><button type="button" onclick='eliminarOrden("${element.reference}")' class="btn btn-danger">x</button></th></tr>`;
        totalVentasConsumidas += element.totalSale
    });
    $("#fechaActual").text(`Fecha:  ${fecha.toLocaleDateString()}`);
    $("#totalDescriminado").text(`Total ${totalVentasConsumidas}`);
    $("#retornarDataAgregada").html(tablaVisualizar);
    $("#TotalOrden").val(totalVentasConsumidas);
    ventaTotal = totalVentasConsumidas;
    //console.log(cantidadOrdenesLista);
    //console.log(arrayOrdenesLista);
}
function guardarDataJsonOrdenTabla(idReference, producto, cantidad, precio, ventaTotal) {
    let banderaAgregacion = true;
    let dataJson = {
        reference: idReference,
        brand: producto,
        amount: cantidad,
        price: precio,
        totalSale: ventaTotal
    }
    if (cantidadOrdenesLista.length == 0) {
        cantidadOrdenesLista.push(dataJson);
    } else {
        for (let index = 0; index < cantidadOrdenesLista.length; index++) {
            if (cantidadOrdenesLista[index].reference == idReference) {
                banderaAgregacion = false;
                cantidadOrdenesLista[index].amount += cantidad;
                cantidadOrdenesLista[index].totalSale += ventaTotal;
                break;
            }
        }
        if (banderaAgregacion) {
            cantidadOrdenesLista.push(dataJson);
        }
    }
    //console.log(cantidadOrdenesLista.length);
    //console.log(cantidadOrdenesLista);
}

/**
 * Ejecucion Inicial
 */
if (userJson == null) {
    window.location.href = "../../index.html";
} else {
    userJs = JSON.parse(userJson);
    if (userJs.type == "ASE") {
        $("#idUserCargo").html("Asesor Comercial");
        $("#idUserLogin").html(userJs.name);
        retornarDataMongo();
        retornarDataMongoOrder();
        $('#tablax').DataTable({
            scrollY: 200,
        });
    }
}






