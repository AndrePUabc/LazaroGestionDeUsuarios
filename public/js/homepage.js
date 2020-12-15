var uid;

firebase.auth().onAuthStateChanged(function(user) {
    if (user != null){
		uid = user.uid;
		firebase.firestore().collection("users").doc(user.uid).get().then(function(doc) {
			if (doc.exists) {
				console.log("Document data:", doc.data());
				const form_fullname = document.getElementById('form_fullname');
				const form_matri = document.getElementById('form_matri');
				const form_email = document.getElementById('form_email');
				form_fullname.value = doc.data().name;
				form_matri.value = doc.data().matricula;
				form_email.value = doc.data().email;
				switch(doc.data().role){
					case "Administrador":
						showAdminUI();
						showProfesorUI();
						break;
					case "Profesor":
						showProfesorUI();
						break;
					
					case "Alumno":
						showAlumnoUI();
						break;
				}
				if(doc.data().newAlert){
					window.alert("Tienes nuevos anuncios por leer");
				}
				
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		}).catch(function(error) {
			console.log("Error getting document:", error);
		});
	}
});

function showAdminUI(){
	const accountsButton = document.getElementById('accountsButton');
	accountsButton.setAttribute('style', "display:block");
}

function showProfesorUI(){
	const accountsButton = document.getElementById('busqueda');
	accountsButton.setAttribute('style', "display:block");
}


function showAlumnoUI(){
	const accountsButton = document.getElementById('boletaButton');
	accountsButton.setAttribute('style', "display:block");
}


//Ver todas las cuentas
const accountsButton = document.getElementById('accountsButton');
accountsButton.addEventListener('click',sendtoAccounts);
function sendtoAccounts(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	window.location.href = "accounts.html";
}

//Ver todas las cuentas
const gruposButton = document.getElementById('gruposButton');
gruposButton.addEventListener('click',sendToGrupos);
function sendToGrupos(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	window.location.href = "misGrupos.html";
}


//Ver todas las cuentas
const anunciosButton = document.getElementById('anunciosButton');
anunciosButton.addEventListener('click',sendToAnuncios);
function sendToAnuncios(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	window.location.href = "misAnuncios.html";
}

//Ver todas las cuentas
const boletaButton = document.getElementById('boletaButton');
boletaButton.addEventListener('click',sendToBoleta);
function sendToBoleta(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	window.location.href = "boleta.html";
}


//Ver todas las cuentas
const updateInfo = document.getElementById('updateInfo');
updateInfo.addEventListener('click',updateUserInfo);
async function updateUserInfo(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	const newName = document.getElementById('form_fullname').value;
	await firebase.firestore().collection("users").doc(uid).set({
		name: newName
	}, { merge: true });
	window.location.reload();
}

//Ver todas las cuentas
const diButton = document.getElementById('diButton');
diButton.addEventListener('click',sendToDirecctorio);
function sendToDirecctorio(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	window.location.href = "directorio.html";
}
