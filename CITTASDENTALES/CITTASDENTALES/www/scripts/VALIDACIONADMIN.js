$(document).ready(function () {
     if (sessionStorage.iduser == null || sessionStorage.iduser == "null")
            {
                document.location.href = "index.html";
     }
     else {
         var nombretl = sessionStorage.names;
         if (sessionStorage.IdU == "2"){
             document.getElementById('lbltipAddedComment').innerHTML = nombretl;
             

         }
         else if (sessionStorage.IdU == "1"){
             
             document.location.href = "indexC.html";
         }
     }
     

})