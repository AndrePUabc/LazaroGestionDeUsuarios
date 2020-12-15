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
    await userRef.set({
        newAlert: false
    }, { merge: true });
    let userRefData = await userRef.get();
    let userRefGroups = userRefData.data().grupos;
    for(var grupo in userRefGroups){

        console.log(userRefGroups[grupo]);
        let groupRef = firebase.firestore().collection("grupos").doc(userRefGroups[grupo]);
        let groupRefData = await groupRef.get();
        let groupRefTitle = groupRefData.data().nombre;
        generateGroupTitle(groupRefTitle);
        let groupRefDataAnuncios = groupRefData.data().anuncios;
        for(var anuncio in groupRefDataAnuncios){
            let anunciosRef = firebase.firestore().collection("anuncios").doc(groupRefDataAnuncios[anuncio]);
            let anuncioData = await anunciosRef.get();
            generateAnuncioCard(anuncioData.data());
        }
        generateGroupDivision();
    }
/*
    let groupRef = firebase.firestore().collection("grupos").doc(search_value);
    let groupRefData = await groupRef.get();
    let groupRefDataAnuncios = groupRefData.data().anuncios;
*/
}

function generateGroupDivision(){
    var container = document.getElementById('container-anuncio');
    var br = document.createElement('br');
    container.appendChild(br)    
}

function generateGroupTitle(title){
    var container = document.getElementById('container-anuncio');
    var group_title = document.createElement('h4');
    group_title.innerHTML = title;
    container.appendChild(group_title)
}


function generateAnuncioCard(data){
    var container = document.getElementById('container-anuncio');

    var card = document.createElement('div');
    card.setAttribute('class','card');
    card.setAttribute('style','width: 100%');

    var body = document.createElement('div');
    body.setAttribute('class','card-body');

    var title = document.createElement('h5');
    title.setAttribute('class','card-title');
    title.innerHTML = data.nombre;

    var fecha = document.createElement('h6');
    fecha.setAttribute('class','card-subtitle mb-2 text-muted')
    fecha.innerHTML = data.fecha;

    var desc  = document.createElement('p');
    desc.setAttribute('class','card-text');
    desc.innerHTML = data.descripcion;

    console.log("llego aqui");
    body.appendChild(title);
    body.appendChild(fecha);
    body.appendChild(desc);
    card.appendChild(body);
    console.log("llego aca");
    container.appendChild(card);
    console.log("que tal aqui?");
}