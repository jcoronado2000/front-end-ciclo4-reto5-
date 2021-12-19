/**
 * Constantes y endpoints
 */
const endPointSupplements = "http://localhost:8080/api/supplements";
let userJson = sessionStorage.getItem("user");
let userJs;

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
        $(".tablaProductos").hide();
        $('#tablax').DataTable({
            scrollY: 200,
        });
    }
}
/**
 * Consulta Por Descripcion
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
 * Consulta Por Precio
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
                    $(".tablaProductos").hide();
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
        $(".tablaProductos").hide();
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
 * Consultar todos los productos de la compañia
 */
function consultaAllProducts(){
    $.ajax({
        method: "GET",
        url: `${endPointSupplements}/all`,
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
                    title: "No hay productos que mostrar",
                    icon: "success",
                    showConfirmButton: true,
                    heightAuto: true,
                    width: 400,
                });
            }
        }
    });
}
/**
 * Cerrar Sesion
 */
$("#cerrarSesion").click(function () {
    sessionStorage.removeItem("user");
    window.location.href = "index.html";
})
/**
 * Retornar datos tabla
 */
function retornarDataTable(data) {
    let cadena = "";

    data.forEach(element => {
        cadena += "<tr><th>" + element.reference + "</th><td>" + element.brand + "</td><td>" + element.category + "</td><td>" + element.objetivo + "</td><td>" + element.description + "</td><td>" + element.price + "</td><td><button  class='btn btn-outline my-2 my-sm-0' data-toggle='modal' data-target='#verFoto' onclick=\"retornaImageb(\'" + element.photography + "')\">Foto</button></td><td>";
    });

    $(".tablaProductos").show();
    $("#retornarTablaProductos").html(cadena);
}

function retornaImageb(url) {
    $("#imagenModal").attr("src", url);
}