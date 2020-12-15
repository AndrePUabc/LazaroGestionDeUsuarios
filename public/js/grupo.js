var search_value = window.location.hash.substring(1);
//console.log(search_value);
var pageval = 0;
var inSearch = false;
var uid;
var inAnuncio = false;

firebase.auth().onAuthStateChanged(function(user) {
    if (user != null){
        uid = user.uid;
        firebase.firestore().collection("grupos").doc(search_value).get().then(function(doc){
            generateUI(doc.data());
        }).catch(function(error) {
            //console.log("Error getting document:", error);
        });  
	}
}); 


async function generateUI(groupData){
    let userRef = firebase.firestore().collection("users").doc(uid);
    let userRefData = await userRef.get();
    switch(userRefData.data().role){
        case "Administrador":
        case "Profesor":
            showCreateButtons();
            enrolledUI(groupData);

        case "Alumno":            
            mainInfoUI(groupData);
            anunciosUI(groupData);
        break;
    }
}

function showCreateButtons(){
    const accountsButton = document.getElementById('addAnuncio');
    accountsButton.setAttribute('style', "display:block");
    
    const alumnoList = document.getElementById('alumnoList');
	alumnoList.setAttribute('style', "display:block");
}

function mainInfoUI(groupData){
    var title = document.getElementById('group-title');
    title.innerHTML = groupData.nombre;
    var subtitle = document.getElementById('group-subtitle');
    subtitle.innerHTML = groupData.descripcion;

    firebase.firestore().collection("users").doc(groupData.creador).get().then(function(doc) {
        if (doc.exists) {
            //console.log("Document data:", doc.data());
            const form_fullname = document.getElementById('form_fullname');
            const form_matri = document.getElementById('form_matri');
            const form_email = document.getElementById('form_email');
            form_fullname.value = doc.data().name;
            form_matri.value = doc.data().matricula;
            form_email.value = doc.data().email;
            
        } else {
            // doc.data() will be undefined in this case
            //console.log("No such document!");
        }
    }).catch(function(error) {
        //console.log("Error getting document:", error);
    });
}

async function anunciosUI(groupData){
    var anuncios = groupData.anuncios;
    
    if(anuncios != null){
        for(var anuncio in anuncios){
            var anunciosRef = firebase.firestore().collection("anuncios").doc(groupData.anuncios[anuncio]);
            var anunciosData = await anunciosRef.get();
            
            generateAnuncioCard(anunciosData.data());
            /*
            firebase.firestore().collection("anuncios").doc(element).get().then(function(doc){
                console.log(doc.data());
                generateAnuncioCard(doc.data());
                
            }).catch(function(error) {
            });  */
        }
    }else{
    }
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

function enrolledUI(groupData){
    var alumnos = groupData.alumnos;
    if(alumnos != null){
        alumnos.forEach(element => {
            firebase.firestore().collection("users").doc(element.al_nombre).get().then(function(doc){

                //console.log(doc.data(),element.calificacion,element.al_nombre);
                createAlumnoEntry(doc.data(),element.calificacion,element.al_nombre);
            }).catch(function(error) {
                //console.log("Error getting document:", error);
            });  
        });
    }else{
        //console.log("No hay alumnos..");
    }
}

function createAlumnoEntry(data, calificacion, id){
    //console.log(data);
    //console.log(id);
    //console.log(calificacion);

    var br = document.createElement('br');

    //element creation
    var div = document.createElement('div');
    div.setAttribute('class','row');

    var divname = document.createElement('div');
    divname.setAttribute('class','col-5');
    
    var divCalificacion = document.createElement('div');
    divCalificacion.setAttribute('class','col-1');

    var divmatricula = document.createElement('div');
    divmatricula.setAttribute('class','col-2');

    var divUpdate = document.createElement('div');
    divUpdate.setAttribute('class','col-2');

    var divDelete = document.createElement('div');
    divDelete.setAttribute('class','col-2');

    
    //attributes
    var btnUpdate = document.createElement('button');
    btnUpdate.innerHTML = 'Actualizar';
    btnUpdate.setAttribute('class','btn btn-warning btn-block');
    btnUpdate.setAttribute('onclick','updateInfo("'+id+'");');

    var btnDelete = document.createElement('button');
    btnDelete.innerHTML = 'Eliminar';
    btnDelete.setAttribute('class','btn btn-danger btn-block');
    btnDelete.setAttribute('onclick','removeUser("'+id+'");');

    var lbMatricula = document.createElement('input');
    lbMatricula.disabled = true;
    lbMatricula.setAttribute('type','text');
    lbMatricula.setAttribute('class','form-control');

    var lbName = document.createElement('input');
    lbName.disabled = true;
    lbName.setAttribute('type','text');
    lbName.setAttribute('class','form-control');

    var lbCalificacion = document.createElement('input');
    lbCalificacion.setAttribute('type','number');
    lbCalificacion.setAttribute('class','form-control');
    lbCalificacion.setAttribute('id',"cal-"+id);
   
    //values
    lbName.value = data.name;
    lbMatricula.value = data.matricula;
    lbCalificacion.value = calificacion;

    divname.appendChild(lbName);
    divCalificacion.appendChild(lbCalificacion);
    divmatricula.appendChild(lbMatricula);
    divUpdate.appendChild(btnUpdate);
    divDelete.appendChild(btnDelete);

    div.appendChild(divmatricula);
    div.appendChild(divname);
    div.appendChild(divCalificacion);
    div.appendChild(divUpdate);
    div.appendChild(divDelete);
    

    var container = document.getElementById('container-alumnos');
    container.appendChild(div);
    container.appendChild(br);
}


//Agregar alumno window
const addAlumno = document.getElementById('addAlumno');
addAlumno.addEventListener('click', addUserToGroup);
function addUserToGroup(event){
    if(inSearch) return;

	//Prevenir el refresh
	event.preventDefault();
    event.stopImmediatePropagation();
    
    //esconder boton de busqueda
    addAlumno.setAttribute('style','display:none');
    inSearch = true;
    //abrir ventana de agregar matricula
    //console.log("abrir ventana de agregar matricula.");
    var search_window = document.getElementById('container-search');
    search_window.setAttribute('style','display:block');

}


//cancel search
const cancelSearch = document.getElementById('search_cancel');
cancelSearch.addEventListener('click', searchCancel);
function searchCancel(event){
    if(!inSearch) return;

	//Prevenir el refresh
	event.preventDefault();
    event.stopImmediatePropagation();
    
    //esconder boton de busqueda
    addAlumno.setAttribute('style','display:block');
    inSearch = false;
    //abrir ventana de agregar matricula
    //console.log("cerrar ventana de agregar matricula.");
    var search_window = document.getElementById('container-search');
    search_window.setAttribute('style','display:none');
}


//search and add alumno
const submitSearch = document.getElementById('search_submit');
submitSearch.addEventListener('click', searchAlumno);

function searchAlumno(event){
    if(!inSearch) return;

	//Prevenir el refresh
	event.preventDefault();
    event.stopImmediatePropagation();
    
    var submitElement = document.getElementById('search_matri');
    var submitValue = submitElement.value;
    searchAlumnoInGroup(submitValue);
}


async function searchAlumnoInGroup(submitValue){
    var existsInGroup = false;
    //console.log("Iniciando busqueda.." + submitValue);
    
    //console.log("debug grupos ref");
    let alumnosref = firebase.firestore().collection("grupos").doc(search_value);
    //console.log("debug grupos get");
    let allAlumnos = await alumnosref.get();
    let alumnosData = allAlumnos.data();
    let alumnos = allAlumnos.data().alumnos;
    //console.log(alumnos);
    //console.log("Ver si existen alumnos...");
    if(alumnos != null){
        //console.log("before for each");
        for(var alumno in alumnos){
            //console.log(alumnosData.alumnos[alumno]);
            var docString = alumnosData.alumnos[alumno].al_nombre;
            let alumnoSearchRef = firebase.firestore().collection("users").doc(docString);
            let alumnoResults = await alumnoSearchRef.get();
            //console.log(alumnoResults.data());
            if(alumnoResults.data().matricula == submitValue){
                //console.log(alumnoResults.data().matricula + " " + submitValue);
                existsInGroup = true;
            }
        }
        //console.log("after for each"); 
    }
    if(!existsInGroup){
        //console.log("No existe este alumno en el grupo");
    }else{
        //console.log("Ya existe este alumno en el grupo");
        return;
    }

    //verificar que el alumno exista en la base de datos
    let allUsersRef = firebase.firestore().collection("users");
    let allUsers = await allUsersRef.get();
    var wasUserFound = false;
    var userFoundID;
    var userFoundRef;
    var userFoundData;
    for(var doc of allUsers.docs){
        //console.log(doc.id + "=>" + doc.data());
        let specificUserRef = firebase.firestore().collection("users").doc(doc.id);
        let specificUserData = await specificUserRef.get();
        //console.log(specificUserData.data().matricula);
        if(specificUserData.data().matricula == submitValue){
            wasUserFound = true;
            userFoundID = doc.id;
            userFoundRef = specificUserRef;
            userFoundData = specificUserData.data();
            break;
        }
    }

    if(wasUserFound){
        //Preguntar si ese es el usuario que se desea agregar
        if(window.confirm("Estas seguro que deseas agregar a este alumno? \n Nombre:" + userFoundData.name + "\n Email " + userFoundData.email + "?")){
            //console.log("Se encontro al usuario = "+ userFoundID);
            //console.log(userFoundRef);
            await userFoundRef.update({
                grupos: firebase.firestore.FieldValue.arrayUnion(search_value)
            });
            let groupRef = firebase.firestore().collection("grupos").doc(search_value);
            let groupRefData = await groupRef.get();
            let groupRefDataAlumnos = groupRefData.data().alumnos;
            groupRefDataAlumnos.push({
                al_nombre: userFoundID,
                calificacion: "0"
            });
            await groupRef.set({
                alumnos: groupRefDataAlumnos,
                anuncios: groupRefData.data().anuncios,
                creador: groupRefData.data().creador,
                descripcion: groupRefData.data().descripcion,
                nombre: groupRefData.data().nombre
            });
            location.reload();
        }else{
            console.log("limpiar informacion para busqueda.");
        }

    }else{
        window.alert("No existe ningun usuario con esa matricula en el sistema");
    }

}

async function updateInfo(userID){
    console.log("Updating user:" + userID + " in group:" + search_value);
    var updatedCal = document.getElementById("cal-"+userID).value;
    if(updatedCal < 0 || updatedCal > 10){
        window.alert("La calificacion debe estar entre 0 o 10");
        return;
    }

    let updatedGroupRef = firebase.firestore().collection("grupos").doc(search_value);
    let updatedGroupInfo = await updatedGroupRef.get();
    let updatedGroupData = updatedGroupInfo.data();
    let updatedGroupAlumnos = updatedGroupData.alumnos
    console.log(updatedGroupAlumnos);
    for(var alumno in updatedGroupAlumnos){
        
        if(updatedGroupAlumnos[alumno].al_nombre == userID){        
            updatedGroupAlumnos[alumno].calificacion = updatedCal;
        }
        console.log(updatedGroupAlumnos[alumno]);
    }

    await updatedGroupRef.set({
        alumnos: updatedGroupAlumnos,
        anuncios: updatedGroupData.anuncios,
        creador: updatedGroupData.creador,
        descripcion: updatedGroupData.descripcion,
        nombre: updatedGroupData.nombre
    });
    window.alert("Se actualizaron los datos correctamente!");
    location.reload();
}

async function removeUser(userID){
    console.log(userID);

    let updatedUserRef = firebase.firestore().collection("users").doc(userID);
    let updatedUserInfo = await updatedUserRef.get();
    let updatedUserData = updatedUserInfo.data();
    let updatedUserGroups = updatedUserData.grupos;
    console.log(updatedUserGroups);
    for(var grupo in updatedUserGroups){
        console.log(updatedUserGroups[grupo]);
        if(updatedUserGroups[grupo] == search_value){
            console.log("Se encontro el grupo");
            updatedUserGroups.splice(grupo,1);
        }
    }
    console.log(updatedUserGroups);

    await updatedUserRef.set({
        email: updatedUserData.email,
        grupos: updatedUserGroups,
        matricula: updatedUserData.matricula,
        name: updatedUserData.name,
        role: updatedUserData.role,
        newAlert : updatedUserData.newAlert
    }); 

    let updatedGroupRef = firebase.firestore().collection("grupos").doc(search_value);
    let updatedGroupInfo = await updatedGroupRef.get();
    let updatedGroupData = updatedGroupInfo.data();
    let updatedGroupAlumnos = updatedGroupData.alumnos
    console.log(updatedGroupAlumnos);
    for(var alumno in updatedGroupAlumnos){
        if(updatedGroupAlumnos[alumno].al_nombre == userID){        
            console.log("se elimino al alumno lol");
            updatedGroupAlumnos.splice(alumno,1);
        }
    }
    console.log(updatedGroupAlumnos);

    await updatedGroupRef.set({
        alumnos: updatedGroupAlumnos,
        anuncios: updatedGroupData.anuncios,
        creador: updatedGroupData.creador,
        descripcion: updatedGroupData.descripcion,
        nombre: updatedGroupData.nombre
    });

    window.alert("Se actualizaron los datos correctamente!");
    location.reload();
}


//Agregar alumno window
const anuncioButton = document.getElementById('addAnuncio');
anuncioButton.addEventListener('click', addAnuncioToGroup);
function addAnuncioToGroup(event){
    var crearAnuncioBlock = document.getElementById('container-addAnuncio');
    var crearAnuncioButton = document.getElementById('addAnuncio');
    crearAnuncioBlock.setAttribute('style','display:block');
    crearAnuncioButton.setAttribute('style','display:none');
}

//Agregar alumno window
const crearAnuncioCreation = document.getElementById('anuncio_crear');
crearAnuncioCreation.addEventListener('click', crearAnuncioInGroup);
async function crearAnuncioInGroup(event){
    if(inAnuncio) return;
    inAnuncio = true;
    var anuncioDesc = document.getElementById('anuncio_desc').value;
    var anuncioName = document.getElementById('anuncio_name').value;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    
    const newAnuncioCreated = await firebase.firestore().collection("anuncios").add({
        nombre: anuncioName,
        descripcion: anuncioDesc,
        fecha: dateTime
    });

    let groupRef = firebase.firestore().collection("grupos").doc(search_value);
    let groupRefData = await groupRef.get();
    let groupRefDataAnuncios = groupRefData.data().anuncios;
    groupRefDataAnuncios.push(newAnuncioCreated.id);
    await groupRef.set({
        alumnos: groupRefData.data().alumnos,
        anuncios: groupRefDataAnuncios,
        creador: groupRefData.data().creador,
        descripcion: groupRefData.data().descripcion,
        nombre: groupRefData.data().nombre
    });

    let groupRefDataAlumnos = groupRefData.data().alumnos;
    for(var alumno in groupRefDataAlumnos){
        console.log(groupRefDataAlumnos[alumno].al_nombre);
        let specificUserRef = firebase.firestore().collection("users").doc(groupRefDataAlumnos[alumno].al_nombre);
        await specificUserRef.set({
            newAlert: true
        }, { merge: true });
    }

    

    location.reload();
    
    //add anuncio to group
    inAnuncio = false;

}

//Agregar alumno window
const cancelAnuncioCreation = document.getElementById('anuncio_cancel');
cancelAnuncioCreation.addEventListener('click', cancelAddAnuncio);
function cancelAddAnuncio(event){
    var crearAnuncioBlock = document.getElementById('container-addAnuncio');
    var crearAnuncioButton = document.getElementById('addAnuncio');
    crearAnuncioBlock.setAttribute('style','display:none');
    crearAnuncioButton.setAttribute('style','display:block');
}