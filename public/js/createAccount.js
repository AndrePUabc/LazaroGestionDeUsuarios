//Crear cuenta
var form = document.getElementById('logInForm');
form.addEventListener('submit',signup);

function signup(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();

	var sub_buttom = document.getElementById('form_submit');
	sub_buttom.disabled = true;
	sub_buttom.value = "Creando usuario...";

	//Obtener la informacion de cuenta
	var sub_email = document.getElementById('inputEmail').value;
	var sub_fullName = document.getElementById('form_fullname').value;
	var sub_matricula = document.getElementById('form_matricula').value;
	var sub_rol = document.getElementById('inputRol').value;

	const createAccount = firebase.functions().httpsCallable('createAccount');
	
	//create account
 	createAccount({
		email: sub_email,
		name: sub_fullName,
		matricula: sub_matricula,
		role: sub_rol
	}).then(result=>{
		window.alert("Se creo el usuario con exito!");
		window.location.href = "accounts.html";
	}).catch(function(error){
	});
	
}
