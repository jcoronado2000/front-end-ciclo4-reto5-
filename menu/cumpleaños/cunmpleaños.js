/**
 * Validacion por perfil
 */
/**
 * Constantes y endpoints
 */
const endPointUserCumpleanos = "http://150.230.88.187:8080/api/user/birthday/";
//const endPointUserCumpleanos = "http://localhost:8080/api/user/birthday/";
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
        $(".admin").hide();
        $(".coordinador").hide();
        $(".tablaUsers").hide();
    } else if (userJs.type == "COOR") {
        $("#idUserCargo").html("Asesor Comercial");
        $("#idUserLogin").html(userJs.name);
        $(".admin").hide();
        $(".asesores").hide();
        $(".tablaUsers").hide();
    } else {
        $("#idUserCargo").html("Asesor Comercial");
        $("#idUserLogin").html(userJs.name);
        $(".asesores").hide();
        $(".coordinador").hide();
        $(".tablaUsers").hide();
    }
}
/**
 * Retornar datos personal por mes
 */
function empleadosCumpleaños() {
    let mesCumpleaños = $("#buscarPorMes").val();
    if (mesCumpleaños != "") {
        $.ajax({
            method: "GET",
            url: `${endPointUserCumpleanos}${mesCumpleaños}`,
            success: function (data) {
                if (data.length != 0) {
                    retornarDataUserCumpleanos(data);
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
                    $(".tablaUsers").hide();
                    swal.fire({
                        title: "No hay personas con el mes de cumpleaños indicado",
                        icon: "success",
                        showConfirmButton: true,
                        heightAuto: true,
                        width: 400,
                    });
                }
            }
        });
    } else {
        $(".tablaUsers").hide();
        swal.fire({
            title: "Error mes no seleccionado vacia",
            icon: "info",
            showConfirmButton: true,
            heightAuto: true,
            width: 400,
        });
    }
}
function retornarDataUserCumpleanos(respuesta) {
    let cadena = "";

    console.log(respuesta)

    respuesta.forEach(element => {
        let fecha = element.birthtDay.split("T");
        cadena += "<tr><td>" + fecha[0] + "</td><td>" + element.name + "</td><td>" + element.email + "</td><td>" + element.type + "</td><td>" + element.zone + "</td><td>";
    });

    $(".tablaUsers").show();
    $("#retornarTablaUserCumpleanos").html(cadena);
}
/**
 * Cerrar sesion
 */
$("#cerrarSesion").click(function () {
    sessionStorage.removeItem("user");
    window.location.href = "../../index.html";
})