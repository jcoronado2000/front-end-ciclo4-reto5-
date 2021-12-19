/**
 * Constantes y variables
 */
//const endPointSupplements = "http://localhost:8080/api/supplements";
const endPointSupplements = "http://150.230.88.187:8080/api/supplements";
/**
 * Consulta total productos
 */
function getSupplementsAll() {
    $.ajax({
        method: "GET",
        url: `${endPointSupplements}/all`,
        success: function (data) {
            if (data.length != 0) {
                retornarDataTable(data);
            }
        }
    });
}
/**
 * Retornar datos Card
 */
function retornarDataTable(data) {
    let cadena = "";

    data.forEach(element => {
        cadena += `<div class="card col-md-3" style="width: 18rem; margin-left: 70px;margin-top: 30px;">
        <img class="card-img-top" src="${element.photography}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${element.reference}       ${element.brand}</h5>
            <p class="card-text">${element.category}</p>
            <p class="card-text">${element.description}</p>
            <p class="card-text">${element.price}</p>
            <a href="#" class="btn btn-primary">Comprar</a>
        </div>
        </div>`
    });
    $("#cardsProductos").html(cadena);
}
/**
 * Consulta por descripcion
 */
function dataPorDescripcion() {
    let descripcion = $("#buscarPorDescripcion").val();
    if (descripcion != "") {
        $.ajax({
            method: "GET",
            url: `${endPointSupplements}/description/${descripcion}`,
            success: function (data) {
                if (data.length != 0) {
                    retornarDataTable(data);
                    swal.fire({
                        title: "Consulta exitosa",
                        icon: "success",
                        position: 'bottom-start',
                        showConfirmButton: false,
                        heightAuto: true,
                        width: 400,
                        timer: 1000
                    });
                } else {
                    $(".tablaProductos").hide();
                    swal.fire({
                        title: "No hay productos con esa descripción",
                        icon: "success",
                        showConfirmButton: true,
                        heightAuto: true,
                        width: 400,
                    });
                }
            }
        });
    } else {
        $(".tablaProductos").hide();
        swal.fire({
            title: "Error descripción vacia",
            icon: "info",
            showConfirmButton: true,
            heightAuto: true,
            width: 400,
        });
    }

}
/**
 * Consulta por precio
 */
function dataPooPrecio() {

    let precio = $("#buscarPorPrecio").val();
    if (precio != "") {
        $.ajax({
            method: "GET",
            url: `${endPointSupplements}/price/${precio}`,
            success: function (data) {
                if (data.length != 0) {
                    retornarDataTable(data);
                    swal.fire({
                        title: "Consulta exitosa",
                        icon: "success",
                        position: 'bottom-start',
                        showConfirmButton: false,
                        heightAuto: true,
                        width: 400,
                        timer: 1000
                    });
                } else {
                    retornarDataTable(data);
                    swal.fire({
                        title: "No hay productos con ese precio o menos",
                        icon: "success",
                        showConfirmButton: true,
                        heightAuto: true,
                        width: 400,
                    });
                }
            }
        });
    } else {
        swal.fire({
            title: "Error precio vacio",
            icon: "info",
            showConfirmButton: true,
            heightAuto: true,
            width: 400,
        });
    }

}
/**
 * Ejecucion de funciones 
 */
getSupplementsAll();