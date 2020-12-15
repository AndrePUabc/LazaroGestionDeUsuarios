getDirectorioData();

async function getDirectorioData(){

    let allUsersRef = firebase.firestore().collection("directorio");
    let allUsers = await allUsersRef.get();

    for(var doc of allUsers.docs){
        let specificUserRef = firebase.firestore().collection("directorio").doc(doc.id);
        let specificUserData = await specificUserRef.get();
        console.log(specificUserData.data());
        createDirectorioEntry(specificUserData.data());

    }

}

function createDirectorioEntry(data){
    var br = document.createElement('br');

    //element creation
    var div = document.createElement('div');
    div.setAttribute('class','row');

    var divname = document.createElement('div');
    divname.setAttribute('class','col-4');
    
    var divPuesto = document.createElement('div');
    divPuesto.setAttribute('class','col-2');

    var divcorreo = document.createElement('div');
    divcorreo.setAttribute('class','col-4');

    
    var divmatricula = document.createElement('div');
    divmatricula.setAttribute('class','col-2');
    
    //attributes

    var lbName = document.createElement('input');
    lbName.disabled = true;
    lbName.setAttribute('type','text');
    lbName.setAttribute('class','form-control');

    var lbpuesto = document.createElement('input');
    lbpuesto.disabled = true;
    lbpuesto.setAttribute('type','text');
    lbpuesto.setAttribute('class','form-control');
    
    var lbcorreo = document.createElement('input');
    lbcorreo.disabled = true;
    lbcorreo.setAttribute('type','text');
    lbcorreo.setAttribute('class','form-control');

    var lbMatricula = document.createElement('input');
    lbMatricula.disabled = true;
    lbMatricula.setAttribute('type','number');
    lbMatricula.setAttribute('class','form-control');
    
    
    //values
    lbName.value = data.nombre;
    lbpuesto.value = data.puesto;
    lbMatricula.value = data.matricula;
    lbcorreo.value = data.correo;

    divPuesto.appendChild(lbpuesto);
    divname.appendChild(lbName);
    divcorreo.appendChild(lbcorreo);
    divmatricula.appendChild(lbMatricula);

    div.appendChild(divPuesto);
    div.appendChild(divname);
    div.appendChild(divcorreo);
    div.appendChild(divmatricula);
    

    var container = document.getElementById('container-anuncio');
    container.appendChild(div);
    container.appendChild(br);
}