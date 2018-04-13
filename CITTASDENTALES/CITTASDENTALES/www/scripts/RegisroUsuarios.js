$(document).ready(function () {
    
    
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
        bootbox.confirm("¿Eliminar alumno?", function (res) {
            if (res == true)
                eliminarAlumno(id);
        });
       

    })

   
    $('#form1').validate({
        rules: {
            Nombre: { required: true },
            UserName: { required: true },
            Password: { required: true },
            Telefono: { required: true },
            Correo: { required: true }


        },
        messages: {
            Nombre: { required: "El Nombre es obligatorio." },
            UserName: { required: "El usuario es obligatorio."  },
            Password: { required: "La contraseña es obligatorio." },
            Telefono: { required: "El telefono es obligatorio." },
            Correo: { required: "El correo es obligatorio." }

        },
        submitHandler: function (form) {

            AgregarCita();
        }

    });
    $('#form11').validate({
        rules: {
            Nombre: { required: true },
            UserName: { required: true },
            Password: { required: true, minlength: 6 },
            Telefono: { required: true },
            Correo: { required: true }


        },
        messages: {
            Nombre: { required: "El Nombre es obligatorio." },
            UserName: { required: "El usuario es obligatorio." },
            Password: {
                required: "La contraseña es obligatorio",
                minlength: "Longitud mínima de 6 caracteres"
            },
            Telefono: { required: "El telefono es obligatorio." },
            Correo: { required: "El correo es obligatorio." }

        },
        submitHandler: function (form) {
            AgregarCita();
        }

    });

   

   
});

var id = 1; // Variable global para controlar el id del alumno
var Alumnos = []; // Arreglo para almacenar alumnos
var ckeck = document.getElementById
var Fechaa;
var alu;
var redirect = "";
function generar() {
    var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789";
    var contraseña = "";
    for (i = 0; i < 8; i++) contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    return contraseña;
}

function AgregarCita() {
    var idusuarioo;
    var idClientee = generar();
    if (document.getElementById("myCech").checked) {
        idusuarioo = "1";
        alu = {
            Id: parseInt(document.getElementById("Id").value),
            Nombre: document.getElementById("Nombre").value,
            UserName: document.getElementById("UserName").value,
            Password: document.getElementById("Password").value,
            Estado: true,
            Telefono: document.getElementById("Telefono").value,
            Correo: document.getElementById("Correo").value,
            IdUsuario: idusuarioo,
            IdCliente: idClientee

        }
        redirect = "indexC.html";
    }
    else {
        idusuarioo = "2";
        alu = {
            Id: parseInt(document.getElementById("Id1").value),
            Nombre: document.getElementById("Nombre1").value,
            UserName: document.getElementById("UserName1").value,
            Password: document.getElementById("Password1").value,
            Estado: true,
            Telefono: document.getElementById("Telefono1").value,
            Correo: document.getElementById("Correo1").value,
            IdUsuario: idusuarioo,
            IdCliente: "nulo"
        }

        redirect = "indexA.html";



    }



    // Determina que operacion hacer Agregar/Actualizar
    var metodo = "http://clinicalajoya.somee.com/Citas_Services.asmx/AgregarCita";       // Metodo por defecto Agregar
    if (alu.Id > 0)
        metodo = "http://clinicalajoya.somee.com/RegistroCitas/EliminarAlumno";    // Cuando se edita, el campo oculto es diferente de 0
    // Peticion de ajax
    $.ajax({
        type: 'POST',
        url: 'http://ticutt.mx/mtic5c/clinicajoya/UsuariosModels/RegistrarUsuario',
        data: JSON.stringify({ alumno: alu }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert('Ocurrio un error en la petición');
        },
        success: function (data) {
            var res = parseInt(data.d);
            if (res == 1) {
                  bootbox.alert('No se realizo el registro');

            }
            else
            
            window.form1.reset(); // LImpia los campos del formulario
            sessionStorage.user = alu.UserName;
            sessionStorage.iduser = alu.Id;
            sessionStorage.IdU = alu.IdUsuario;
            sessionStorage.names = alu.Nombre;
            sessionStorage.idCliente = alu.IdCliente;
            sessionStorage.mail = alu.Correo;



            // Redirigimos a la pagina de menu.html
            document.location.href = redirect;

        }
    });
}


function leerAlumnos() {
    var date;
    var result;

    var dateH;
    var resultH;

    $('#TablaCitas').html(''); // Limpia la tabla antes de leer datos
    $.ajax({
        type: "POST",
        url: "http://clinicalajoya.somee.com/Citas_Services.asmx/GetAlumnos",
        data: JSON.stringify({ IdUsuario: '166A109018' }),
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
                    '<span class="btn btn-danger btn-xs eliminar" data-id="' + alums[i].Id + '">Eliminar</span>' +
                    '</td>' +
                    '<td>' + alums[i].Nombre + '</td>' +
                    '<td>' + result + '</td>' +
                    '<td>' + resultH + '</td>' +
                    '</tr>'
            }

            $('#TablaCitas').html(lineas);    // Agrega las lineas creadas a la tabla de alumnos
        }
    });

}

function eliminarAlumno(ida) {
    var mensaje = {

    }
    $.ajax({
        type: 'POST',
        url: 'http://clinicalajoya.somee.com/RegistroCitas/EliminarAlumno',
        data: JSON.stringify({ id: ida }),
        dataType: 'json',
        contentType: 'application/json',
        error: function (xhr) {
            bootbox.alert('Ocurrio un error en la petición');
        },
        success: function (data) {
            var res = parseInt(data.d);
            if (res == 1) {
                bootbox.alert('Cita No eliminada');
                window.form1.reset(); // LImpia los campos del formulario
                leerAlumnos();
            }
            else
                bootbox.alert('Se eliminó el registro');
            leerAlumnos();

        }
    });
}


function leerAlumno(ida) {
    window.form1.reset(); // Limpia el formulario antes de leer datos
    $.ajax({
        type: "POST",
        url: "http://clinicalajoya.somee.com/Citas_Services.asmx/GetAlumno",
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

    var r = confirm("¿Desea cerrar sesión?", "Atención!");
    if (r == true) {
        document.location.href = "index.html";
        sessionStorage.iduser = null;
    } else {
        document.location.href = "indexA.html";
    
    }
}
function check() {
    document.getElementById("myCech").checked = true;
}

function uncheck() {
    document.getElementById("myCech").checked = false;
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