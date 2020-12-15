var misGrupos;

firebase.auth().onAuthStateChanged(function(user) {
    if (user != null){
        generateUI(user.uid);
        
	}
});

async function generateUI(uid){
    let userRef = firebase.firestore().collection("users").doc(uid);
    let userRefData = await userRef.get();
    switch(userRefData.data().role){
        case "Administrador":
        case "Profesor":
            showProfesorUI();
            break;
    }
    let userRefGroups = userRefData.data().grupos;
    for(var grupo in userRefGroups){
        let groupRef = firebase.firestore().collection("grupos").doc(userRefGroups[grupo]);
        let groupRefData = await groupRef.get();
        generateGroupCard(groupRefData.data(),userRefGroups[grupo]);
    }
}

function showProfesorUI(){
	const accountsButton = document.getElementById('createGroup');
	accountsButton.setAttribute('style', "display:block");
}

function generateGroupCard(data, groupid){
    console.log(data);
    console.log(groupid);

    var container = document.getElementById('group-container');

    var card = document.createElement('div');
    card.setAttribute('class','card');
    card.setAttribute('style','width: 100%');
    
    var body = document.createElement('div');
    body.setAttribute('class','card-body');

    var title = document.createElement('h5');
    title.setAttribute('class','card-title');
    title.innerHTML = data.nombre;

    var desc  = document.createElement('p');
    desc.setAttribute('class','card-text');
    desc.innerHTML = data.descripcion;

    var but = document.createElement("a");
    but.setAttribute('class','btn btn-primary');
    but.setAttribute('onclick','gotoGroup("'+groupid+'");');
    but.innerHTML ='Ir a Grupo';
//    but.setAttribute('onclick','console.log('+ groupid + ');'); 

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(but);
    card.appendChild(body);
    container.appendChild(card);
}

function gotoGroup(groupid){
    window.location.href = "grupo.html#"+groupid;
}


//Ver todas las cuentas
const createGroupButton = document.getElementById('createGroup');
createGroupButton.addEventListener('click',sendToCreateGroup);
function sendToCreateGroup(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	window.location.href = "createGroup.html";
}
