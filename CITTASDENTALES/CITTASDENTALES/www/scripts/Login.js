$(document).ready(function () {
    if (sessionStorage.iduser != null && sessionStorage.iduser != "null") {
        document.location.href = "indexA.html";
    }

});
$('#form1').validate({
    rules: {
        User: { required: true },
        Pass: { required: true, minlength: 6 }
    },
    messages: {
        User: { required: "El usuario es obligatorio" },
        Pass: {
            required: "El usuario es obligatorio",
            minlength: "Longitud mínima de 6 caracteres"
        }
    },
    submitHandler: function (form) {
        iniciarSesion();
    }
});

function iniciarSesion() {
    // creamos un objeto de inicio de sesion
    var login = {
        UserName: document.getElementById("User").value,
        Password: document.getElementById("Pass").value
    }
    // Peticion de ajax

    $.ajax({
        type: 'POST',
        url: "http://ticutt.mx/mtic5c/clinicajoya/Citas_Services.asmx/Login",
        data: JSON.stringify(login),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            var user = JSON.parse(data.d)
            // validamos la cuenta a partir de la respuesta
            if (user.Estado == true) {
                // Guardamos el usuario en una variable de sesion del navegador
                sessionStorage.user = login.UserName;
                sessionStorage.iduser = login.Id;
                sessionStorage.IdU = user.IdUsuario;
                sessionStorage.names = user.Nombre;
                sessionStorage.mail = user.Correo;
                sessionStorage.idCliente = user.IdCliente;

             
             
                // Redirigimos a la pagina de menu.html
                if (user.IdUsuario == "2")
                {
                    document.location.href = "indexA.html";
                }
                else
                    document.location.href = "indexC.html";
                
                
                
            }
            else // Si no es valido envia un mensaje al usuario
            {
                bootbox.alert("Contraseña/Usuario Incorrecto");
            }
        }
    });


}

