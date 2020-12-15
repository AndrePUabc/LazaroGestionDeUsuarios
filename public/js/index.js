
//Verificar si hay una sesion existente
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.location.href = "homepage.html";
    }
});

//Inicio de sesion
var loginDiv = document.getElementById('login');
var forgotPassword = document.getElementById('forgotPassword');
var form = document.getElementById('logInForm');
var recover = document.getElementById('recoverForm');
var email = document.getElementById('inputEmail');
var recemail = document.getElementById('inputEmailRecover');
var password = document.getElementById('inputPass');
var subType = false;

form.addEventListener('submit',login);
function login(event){
    event.preventDefault();
    if(!subType){
        firebase.auth().signInWithEmailAndPassword(email.value, password.value).then(cred => {
            window.alert("Se ha iniciado sesion con exito!");
        }).catch(error => {
            var alertMessage = '';
            switch(error.code){
                case 'auth/invalid-email': alertMessage='Favor de ingresar un correo valido'; break;
                case 'auth/user-disabled': alertMessage='La cuenta a la que intento ingresar se encuentra deshabilitada'; break;
                case 'auth/user-not-found': 
                case 'auth/wrong-password': alertMessage='El usuario o contraseña esta incorrecto'; break;
            }
            window.alert(alertMessage);
        })
    }
}

recover.addEventListener('submit',sendEmail);
function sendEmail(event){
    event.preventDefault();
    if(subType){
        firebase.auth().sendPasswordResetEmail(recemail.value).then(function(){
            window.alert("Se envio el correo de recuperacion!");
            backLogin();
        }).catch(function(error){
            window.alert("Hubo un problema enviando el correo. Verifica que el correo sea correcto o intenta mas tarde.")
        });
    }
}

function forgotPass(){
    loginDiv.setAttribute('style','display: none;');
    forgotPassword.setAttribute('style','display: block;');
    subType = true;
}


function backLogin(){
    forgotPassword.setAttribute('style','display: none;');
    loginDiv.setAttribute('style','display: block;');   
    subType = false;
}