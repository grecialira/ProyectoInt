$(document).ready(function () {
    leerMensajes() 
    document.getElementById('lbl23').innerHTML = sessionStorage.names;
    // Click para los botones de la clase .editar
    // Cuando los elementos son creados dinamicamente se utiliza la funcion on()
    $('#TablaCitas').on('click', '.editar', function () {
        var id = $(this).data('id');    // recupera el Id del alumno
        leerAlumno(id);   // Metodo ajax para recuperar un alumno por su Id
    });
    // Evento para el boton de la clase .eliminar
    $('#TablaCitas').on('click', '.eliminar', function () {
        var id = $(this).data('id');    // recupera el Id del alumno
        // Cuadro de dialogo para preguntar si se va a eliminar
        bootbox.confirm("¿Cancelar Cita?", function (res) {
            if (res == true)
                eliminarAlumno(id);
        });
    });
    $('#TablaMensajes').on('click', '.editar', function () {
        var id = $(this).data('id');    // recupera el Id del alumno
        leerMensaje(id);   // Metodo ajax para recuperar un alumno por su Id
    });
    // Evento para el boton de la clase .eliminar
    $('#TablaMensajes').on('click', '.eliminar', function () {
        var id = $(this).data('id');    // recupera el Id del alumno
        // Cuadro de dialogo para preguntar si se va a eliminar
        bootbox.confirm("¿Cancelar Cita?", function (res) {
            if (res == true)
                eliminarMensaje(id);
        });
    });
    $('#form2').validate({
        rules: {
            Nombre: { required: true },
            Correo: { required: true },
            Mensaje: { required: true }

        },
        messages: {
            Nombre: { required: "El Nombre es obligatorio." },
            Correo: { required: "El Correo es obligatorio." },

            Mensaje: { required: "Escribe un mensaje." },

        },
        submitHandler: function (form) {
            ResponderMensaje();
        }

    });

   
    $('#form1').validate({
        rules: {
            Nombre: { required: true },
            Fecha: { required: true },
            Hora: { required: true }
            
        },
        messages: {
            Nombre: { required: "El Nombre es obligatorio." },
            Fecha: { required: "La Fecha es obligatoria." },
            Hora: { required: "La Hora es obligatoria." },
            
        },
        submitHandler: function (form) {
            document.getElementById('Button').disabled = true;
            Comprobacion();
        }

    });
    document.getElementById('lbl1').innerHTML = sessionStorage.names;
 
    leerAlumnos(); // Lee los alumnos al terminar de cargar la pagina

    $('#ListadoCitas').DataTable();
});
function Comprobacion() {
    var alu = {
        Id: parseInt(document.getElementById("Id").value),
        Nombre: sessionStorage.names,
        Fecha: document.getElementById("Fecha").value,
        Hora: document.getElementById("Hora").value,
        IdUsuario: sessionStorage.IdU,
        IdCliente: "nulo"
    }
    Fechaa = alu.Fecha;
    var metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas_Services.asmx/GetAlumnosA";
    var p = sessionStorage.idCliente;
    var Comprobante = false;
    $.ajax({
        type: "POST",
        url: metodo,
        data: JSON.stringify({ IdCliente: 'dyD39PRD' }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert("error en la peticion");
        },
        success: function (data) {
            var alums = JSON.parse(data.d); // Conviernte la respuesta en arreglo javascript
            var lineas = "";    // variable para almacenar las lineas de la tabla
            for (i = 0; i < alums.length; i++) {    // Recorre el arreglo

                if (alums[i].Fecha == alu.Fecha && alums[i].Hora == alu.Hora) {
                    Comprobante = true;
                }

            }
            if (Comprobante == true)
            {
                document.getElementById('Button').disabled = false;
                bootbox.alert("Cita no disponible... Selecciona una Hora diferete");
            }   
            else
                AgregarCita();
        }

    });
    return
}
var id = 1; // Variable global para controlar el id del alumno
var Alumnos = []; // Arreglo para almacenar alumnos

var Fechaa;
function AgregarCita() {
  
    var alu = {
        Id: parseInt(document.getElementById("Id").value),
        Nombre: sessionStorage.names,
        Fecha: document.getElementById("Fecha").value,
        Hora: document.getElementById("Hora").value,
        IdUsuario: sessionStorage.IdU,
        IdCliente: sessionStorage.idCliente,
        Correo: sessionStorage.mail


       
    }
    Fechaa = alu.Fecha;
    
    // Determina que operacion hacer Agregar/Actualizar
    var metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas/AgregarCita";       // Metodo por defecto Agregar
    if (alu.Id > 0)
        metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas/ActualizarAlumno";

    
       
    // Cuando se edita, el campo oculto es diferente de 0
    // Peticion de ajax
    $.ajax({
        type: 'POST',
        url: metodo,
        data: JSON.stringify({ alumno: alu }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert('Ocurrio un error en la petición');
        },
        success: function (data) {
            var res = parseInt(data.d);
            if (res == 1) {
                if (metodo == "http://ticutt.mx/mtic5c/clinicajoya/Citas/ActualizarAlumno") {
                    window.form1.reset(); // LImpia los campos del formulario
                    bootbox.alert('Cita  actualizada');
                    alu.Id = 0;
                    document.getElementById('Button').disabled = false;
                    metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas_Services.asmx/AgregarCita";
                    leerAlumnos();
                }
                else {
                    bootbox.alert('Cita no registrada');
                    document.getElementById('Button').disabled = false;
                    leerAlumnos();
                }
            }
            else
                if (metodo == "http://ticutt.mx/mtic5c/clinicajoya/Citas/ActualizarAlumno") {
                    bootbox.alert('Cita  no actualizada');
                    a = 0;
                    document.getElementById('Button').disabled = false;
                    metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas_Services.asmx/AgregarCita";
                    leerAlumnos();
                }
                else {

                    bootbox.alert('Cita registrada');
                    document.getElementById('Button').disabled = false;
                    leerAlumnos();
                }

            window.form1.reset(); // LImpia los campos del formulario
            leerAlumnos();
               
                

        }
    });

}

function leerAlumnos() {
    var date;
    var result;

    var dateH;
    var resultH;
    var metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas_Services.asmx/GetAlumnosC";
    var p = sessionStorage.idCliente;

    //if (sessionStorage.IdU == "2")
    //{
    //    metodo = ;
    //    p = sessionStorage.IdU;
    //}
    //else
    //    metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas/GetCitasCliente";

        

    $('#TablaCitas').html(''); // Limpia la tabla antes de leer datos
    $.ajax({
        type: "POST",
        url: metodo,
        data: JSON.stringify({ IdCliente : sessionStorage.idCliente }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            $('#TablaCitas').html('<tr><td colspan="7">Sin datos</td></tr>');
        },
        success: function (data) {
            var alums = JSON.parse(data.d); // Conviernte la respuesta en arreglo javascript
            var lineas = "";    // variable para almacenar las lineas de la tabla
            for (i = 0; i < alums.length; i++) {    // Recorre el arreglo
                // Crea un <tr> por cada alumno en el arreglo 
                date = alums[i].Fecha;
                var nowDate = new Date(parseInt(date.substr(6)));
                result = "";
                result += nowDate.format("dd/mm/yyyy");

                dateH = alums[i].Fecha;
                var nowDateH = new Date(parseInt(dateH.substr(6)));
                resultH = "";
                resultH += nowDateH.format("HH:MM:ss");


                $(function () {
                    $("#lbFecha").html(result);
                });
                lineas +=
                    '<tr>' +
                    '<td>' +
                    '<span class="btn btn-primary btn-xs editar" data-id="' + alums[i].Id + '">Editar</span>' +
                    '<span class="btn btn-danger btn-xs eliminar" data-id="' + alums[i].Id + '">Cancelar</span>' +
                    '</td>' +
                '<td>' + alums[i].Nombre + '</td>' +
                '<td>' + alums[i].Fecha + '</td>' +
                '<td>' + alums[i].Hora + '</td>' +
                    '</tr>'
            }

            $('#TablaCitas').html(lineas);    // Agrega las lineas creadas a la tabla de alumnos
        }
    });

}

function eliminarAlumno(ida) {
    $.ajax({
        type: 'POST',
        url: 'http://ticutt.mx/mtic5c/clinicajoya/Citas/EliminarAlumnoC',
        data: JSON.stringify({ id: ida }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert('Ocurrio un error en la petición');
        },
        success: function (data) {
            var res = parseInt(data.d);
            if (res == 1) {
                bootbox.alert('No se cancelo la cita');
                leerAlumnos();
            }
            else
                bootbox.alert('Se Cancelo la cita');
            window.form1.reset(); // LImpia los campos del formulario
            leerAlumnos();
                

        }
    });
}


function leerAlumno(ida) {
    window.form1.reset(); // Limpia el formulario antes de leer datos
    $.ajax({
        type: "POST",
        url: "http://ticutt.mx/mtic5c/clinicajoya/Citas_Services.asmx/GetAlumno",
        data: JSON.stringify({ id: ida }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert("Alumno no encontrado");
        },
        success: function (data) {
            var alu = JSON.parse(data.d); // Conviernte la respuesta en arreglo javascript
            $('#Id').val(alu.Id);           // Pasamos los datos del alumno al formulario
            $('#Nombre').val(alu.Nombre);
            $('#Fecha').val(alu.Fecha);
            $('#Hora').val(alu.Hora);
            $('.nav-tabs a[href="#registro"]').tab('show'); // Muestra la pestaña de formulario
        }
    });
}
function LanzaEvento() {
    sessionStorage.iduser = null;
    alert("Debes iniciar sesión para acceder a esta pagina");
   
}
function myFunction() {
    var txt;
    
    var r = confirm("¿Seuro que quieres cerrar Siesión?","Atención!");
    if (r == true) {
        document.location.href = "index.html";
       
        sessionStorage.user = null;
        sessionStorage.iduser = null;
        sessionStorage.IdU = "";
        sessionStorage.names = "";
        sessionStorage.mail = "";
        sessionStorage.idCliente = "";
    } else {
        document.location.href = "indexA.html";
    }
 
}
function Registrate() {
    var txt;

    
        document.location.href = "RegistroUsuarios.html";
        sessionStorage.iduser = null;
   

}
var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};
function addZero(i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
}
function hoyFecha() {
    var hoy = new Date();
    var dd = hoy.getDate();
    var mm = hoy.getMonth() + 1;
    var yyyy = hoy.getFullYear();

    dd = addZero(dd);
    mm = addZero(mm);

    return dd + '/' + mm + '/' + yyyy;
}
function ResponderMensaje() {
    var fechita = hoyFecha();
    var alu = {
        Id: parseInt(document.getElementById("Id").value),
        Nombre: sessionStorage.names,
        Fecha: fechita,
        Mensaje: document.getElementById("Mensaje").value,
        Correo: sessionStorage.mail,
        IdCliente: sessionStorage.idCliente,
        IdUsuario: sessionStorage.IdU



    }
    Fechaa = alu.Fecha;

    // Determina que operacion hacer Agregar/Actualizar
    var metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas/AgregarCita";       // Metodo por defecto Agregar
    if (alu.Id > 0)
        metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas/ActualizarAlumno";
    // Cuando se edita, el campo oculto es diferente de 0
    // Peticion de ajax
    $.ajax({
        type: 'POST',
        url: "http://ticutt.mx/mtic5c/clinicajoya/Mensajes/EnviarMensajeC",
        data: JSON.stringify({  alumno: alu }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert('Ocurrio un error en la petición');
        },
        success: function (data) {
            var res = parseInt(data.d);
            if (res == 1) {
                window.form1.reset();
                bootbox.alert('Mensaje  no Enviado');
                leerAlumnos();
                document.getElementById('Button').disabled = false;

            }
            else
                window.form1.reset(); // LImpia los campos del formulario
            bootbox.alert('Cita  registrada');
            alu.Id = 0;
            leerAlumnos();
            document.getElementById('Button').disabled = false;


        }
    });

}
function leerMensajes() {
    var date;
    var result;

    var dateH;
    var resultH;
    var metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas_Services.asmx/GetMensajesA";
    var p = sessionStorage.idCliente;

    //if (sessionStorage.IdU == "2")
    //{
    //    metodo = ;
    //    p = sessionStorage.IdU;
    //}
    //else
    //    metodo = "http://ticutt.mx/mtic5c/clinicajoya/Citas/GetCitasCliente";



    $('#TablaMensajes').html(''); // Limpia la tabla antes de leer datos
    $.ajax({
        type: "POST",
        url: metodo,
        data: JSON.stringify({ IdCliente: 'dyD39PRD' }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            $('#TablaMensajes').html('<tr><td colspan="7">Sin datos</td></tr>');
        },
        success: function (data) {
            var alums = JSON.parse(data.d); // Conviernte la respuesta en arreglo javascript
            var lineas = "";    // variable para almacenar las lineas de la tabla
            for (i = 0; i < alums.length; i++) {    // Recorre el arreglo
                // Crea un <tr> por cada alumno en el arreglo 
                date = alums[i].Fecha;
                var nowDate = new Date(parseInt(date.substr(6)));
                result = "";
                result += nowDate.format("dd/mm/yyyy");

                dateH = alums[i].Fecha;
                var nowDateH = new Date(parseInt(dateH.substr(6)));
                resultH = "";
                resultH += nowDateH.format("HH:MM:ss");


                $(function () {
                    $("#lbFecha").html(result);
                });
                lineas +=
                    '<tr>' +
                    '<td>' +
                    '<span class="btn btn-primary btn-xs editar" data-id="' + alums[i].Id + '">Responder</span>' +
                    '<span class="btn btn-danger btn-xs eliminar" data-id="' + alums[i].Id + '">Cancelar</span>' +
                    '</td>' +
                    '<td>' + alums[i].Nombre + '</td>' +
                    '<td>' + alums[i].Mensaje + '</td>' +
                    '</tr>'
            }

            $('#TablaMensajes').html(lineas);    // Agrega las lineas creadas a la tabla de alumnos
        }
    });

}

function eliminarMensaje(ida) {
    $.ajax({
        type: 'POST',
        url: 'http://ticutt.mx/mtic5c/clinicajoya/Mensajes/EliminarAlumno',
        data: JSON.stringify({ id: ida }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert('Ocurrio un error en la petición');
        },
        success: function (data) {
            var res = parseInt(data.d);
            if (res == 1) {
                bootbox.alert('No se Elimino el Mensaje');
                leerAlumnos();
            }
            else
                bootbox.alert('Se Elimino el mensaje');
            window.form1.reset(); // LImpia los campos del formulario
            leerAlumnos();

        }
    });
}


function leerMensaje(ida) {
    window.form1.reset(); // Limpia el formulario antes de leer datos
    $.ajax({
        type: "POST",
        url: "http://ticutt.mx/mtic5c/clinicajoya/Citas_Services.asmx/GetMensaje",
        data: JSON.stringify({ id: ida }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert("Mensaje no encontrado");
        },
        success: function (data) {
            var alu = JSON.parse(data.d); // Conviernte la respuesta en arreglo javascript
            $('#Id').val(alu.Id);           // Pasamos los datos del alumno al formulario
            $('#Nombre').val(alu.Nombre);
            $('#Correo').val(alu.Correo);
            $('.nav-tabs a[href="#registro"]').tab('show'); // Muestra la pestaña de formulario
            document.getElementById("IdCliente").value = alu.IdCliente;

        }
    });
}