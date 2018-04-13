$(document).ready(function () {

    // Click para los botones de la clase .editar
    // Cuando los elementos son creados dinamicamente se utiliza la funcion on()
    $('#TablaCita').on('click', '.editar', function () {
        var id = $(this).data('id');    // recupera el Id del alumno
        leerAlumno(id);   // Metodo ajax para recuperar un alumno por su Id
    });
    // Evento para el boton de la clase .eliminar
    $('#TablaCita').on('click', '.eliminar', function () {
        var id = $(this).data('id');    // recupera el Id del alumno
        // Cuadro de dialogo para preguntar si se va a eliminar
        bootbox.confirm("¿Eliminar alumno?", function (res) {
            if (res == true)
                eliminarAlumno(id);
        });
    });


    $('#form1').validate({
        rules: {
            Nombre: { required: true },
            Fecha: { required: true },
            Hora: { required: true }

        },
        messages: {
            Nombre: { required: "El código es obligatorio." },
            Fecha: { required: "El nombre es obligatorio." },
            Hora: { required: "La fecha de nacimiento es obligatoria." },

        },
        submitHandler: function (form) {
            AgregarCita();
        }

    });

    leerAlumnos(); // Lee los alumnos al terminar de cargar la pagina

    $('#ListadoAlumnos').DataTable();
});

var id = 1; // Variable global para controlar el id del alumno
var Alumnos = []; // Arreglo para almacenar alumnos

function AgregarCita() {
    var alu = {
        Id: parseInt(document.getElementById("Id").value),
        Nombre: document.getElementById("Nombre").value,
        Fecha: document.getElementById("Fecha").value,
        Hora: document.getElementById("Hora").value,

    }
    // Determina que operacion hacer Agregar/Actualizar
    var metodo = "AgregarAlumno";       // Metodo por defecto Agregar
    if (alu.Id > 0)
        metodo = "ActualizarAlumno";    // Cuando se edita, el campo oculto es diferente de 0
    // Peticion de ajax
    $.ajax({
        type: 'POST',
        url: 'http://clinicalajoya.somee.com/Citas_Services.asmx/AgregarCita',
        data: JSON.stringify({ var: alu }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert('Ocurrio un error en la petición');
        },
        success: function (data) {
            var res = parseInt(data.d);
            if (res == 1) {
                bootbox.alert('Cita registrado');
                window.form1.reset(); // LImpia los campos del formulario

            }
            else
                bootbox.alert('No se realizo el registro');

        }
    });

}

function leerAlumnos() {
    $('#TablaAlumnos').html(''); // Limpia la tabla antes de leer datos
    $.ajax({
        type: "POST",
        url: "http://ticutt.mx/dap/ws_dapiii.asmx/GetAlumnos",
        data: JSON.stringify({ IdUsuario: '166A109036' }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            $('#TablaAlumnos').html('<tr><td colspan="7">Sin datos</td></tr>');
        },
        success: function (data) {
            var alums = JSON.parse(data.d); // Conviernte la respuesta en arreglo javascript
            var lineas = "";    // variable para almacenar las lineas de la tabla
            for (i = 0; i < alums.length; i++) {    // Recorre el arreglo
                // Crea un <tr> por cada alumno en el arreglo de alumnos
                lineas +=
                    '<tr>' +
                    '<td>' +
                    '<span class="btn btn-primary btn-xs editar" data-id="' + alums[i].Id + '">Editar</span>' +
                    '<span class="btn btn-danger btn-xs eliminar" data-id="' + alums[i].Id + '">Eliminar</span>' +
                    '</td>' +
                    '<td>' + alums[i].Codigo + '</td>' +
                    '<td>' + alums[i].Nombre + '</td>' +
                    '<td>' + alums[i].FechaNac + '</td>' +
                    '<td>' + alums[i].Edad + '</td>' +
                    '<td>' + alums[i].Domicilio + '</td>' +
                    '<td>' + alums[i].Telefono + '</td>' +
                    '</tr>'
            }

            $('#TablaAlumnos').html(lineas);    // Agrega las lineas creadas a la tabla de alumnos
        }
    });
}

function eliminarAlumno(ida) {
    $.ajax({
        type: 'POST',
        url: 'http://ticutt.mx/dap/ws_dapiii.asmx/EliminarAlumno',
        data: JSON.stringify({ id: ida }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert('Ocurrio un error en la petición');
        },
        success: function (data) {
            var res = parseInt(data.d);
            if (res == 1) {
                bootbox.alert('Alumno eliminado');
                window.form1.reset(); // LImpia los campos del formulario
                leerAlumnos();
            }
            else
                bootbox.alert('No se eliminó el registro');

        }
    });

}

function leerAlumno(ida) {
    window.form1.reset(); // Limpia el formulario antes de leer datos
    $.ajax({
        type: "POST",
        url: "http://ticutt.mx/dap/ws_dapiii.asmx/GetAlumno",
        data: JSON.stringify({ id: ida }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert("Alumno no encontrado");
        },
        success: function (data) {
            var alu = JSON.parse(data.d); // Conviernte la respuesta en arreglo javascript
            $('#Id').val(alu.Id);           // Pasamos los datos del alumno al formulario
            $('#Codigo').val(alu.Codigo);
            $('#Nombre').val(alu.Nombre);
            $('#FechaNac').val(alu.FechaNac);
            $('#Edad').val(alu.Edad);
            $('#Domicilio').val(alu.Domicilio);
            $('#Telefono').val(alu.Telefono);
            $('.nav-tabs a[href="#registro"]').tab('show'); // Muestra la pestaña de formulario
        }
    });
}