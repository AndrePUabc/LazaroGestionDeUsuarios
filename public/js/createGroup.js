var uid;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      uid = user.uid;
    }
});

//Crear cuenta
var form = document.getElementById('logInForm');
form.addEventListener('submit',createGroup);

async function createGroup(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();

	var sub_buttom = document.getElementById('form_submit');
	sub_buttom.disabled = true;
	sub_buttom.value = "Creando grupo...";

	//Obtener la informacion de cuenta
	var groupName = document.getElementById('inputGroupName').value;
	var groupDescription = document.getElementById('inputDescription').value;

    console.log(groupName + groupDescription);
    
    const newGroupCreated = await firebase.firestore().collection("grupos").add({
        alumnos: [],    
        anuncios: [],
        creador: uid,
        descripcion: groupDescription,
        nombre: groupName
    });
    
    let groupCreator = firebase.firestore().collection("users").doc(uid);
    await groupCreator.update({
        grupos: firebase.firestore.FieldValue.arrayUnion(newGroupCreated.id)
    });

    window.alert("Se creo el grupo con exito!");
	window.location.href = "misGrupos.html";
}
