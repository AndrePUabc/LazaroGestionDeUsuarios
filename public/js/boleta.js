var uid;

//allNewAlert();

firebase.auth().onAuthStateChanged(function(user) {
    if (user != null){
        console.log(user.uid);
        uid = user.uid;
        getAnuncioData();
	}
}); 

/*
async function allNewAlert(){
    let allUsersRef = firebase.firestore().collection("users");
    let allUsers = await allUsersRef.get();
    for(var doc of allUsers.docs){
        let specificUserRef = firebase.firestore().collection("users").doc(doc.id);

        await specificUserRef.set({
            newAlert: false
        }, { merge: true });
    }
}
*/

async function getAnuncioData(){

    //get user groups
    console.log("get anuncio data");
    let userRef = firebase.firestore().collection("users").doc(uid);
    let userRefData = await userRef.get();
    let userRefGroups = userRefData.data().grupos;
    for(var grupo in userRefGroups){

        console.log(userRefGroups[grupo]);
        let groupRef = firebase.firestore().collection("grupos").doc(userRefGroups[grupo]);
        let groupRefData = await groupRef.get();
        let groupRefDataAlumnos = groupRefData.data().alumnos;
        console.log(groupRefDataAlumnos);
        for(var alumnoInGroup in groupRefDataAlumnos){
            if(groupRefDataAlumnos[alumnoInGroup].al_nombre == uid){
                createCalificacionUI(groupRefData.data().nombre,groupRefDataAlumnos[alumnoInGroup].calificacion);
            }
        }
    }
/*
    let groupRef = firebase.firestore().collection("grupos").doc(search_value);
    let groupRefData = await groupRef.get();
    let groupRefDataAnuncios = groupRefData.data().anuncios;
*/
}

function createCalificacionUI(nombre, calificacion){
    var br = document.createElement('br');

    //element creation
    var div = document.createElement('div');
    div.setAttribute('class','row');

    var divname = document.createElement('div');
    divname.setAttribute('class','col-10');
    
    var divCalificacion = document.createElement('div');
    divCalificacion.setAttribute('class','col-2');

    
    //attributes

    var lbName = document.createElement('input');
    lbName.disabled = true;
    lbName.setAttribute('type','text');
    lbName.setAttribute('class','form-control');

    var lbCalificacion = document.createElement('input');
    lbCalificacion.disabled = true;
    lbCalificacion.setAttribute('type','number');
    lbCalificacion.setAttribute('class','form-control');
    
    //values
    lbName.value = nombre;
    lbCalificacion.value = calificacion;

    divname.appendChild(lbName);
    divCalificacion.appendChild(lbCalificacion);

    div.appendChild(divname);
    div.appendChild(divCalificacion);
    

    var container = document.getElementById('container-anuncio');
    container.appendChild(div);
    container.appendChild(br);
}