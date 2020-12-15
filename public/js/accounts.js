//get usersList
let usersRef = firebase.firestore().collection('users');
let pageSize = 10;
let pageval = 1;
let field = "name";
var lastVisible;
initialQuery();

function initialQuery(){
    usersRef.orderBy(field).limit(pageSize).get().then(snapshot =>{
            let request = [];
            snapshot.forEach(doc=>{
                request.push({...doc.data(), id: doc.id});
            });

            request.forEach( data =>{
                createUserEntry(data.email, data.name, data.id, data.role);
            });
            lastVisible = snapshot.docs[snapshot.docs.length - 1];
            console.log("last", lastVisible);
    })
}

function nextPage(){
    if(pageval == 0) return;
    if(lastVisible == null){
        var bottom = document.getElementById("bottom");
        var lastentry = document.getElementById("lastentry");
        bottom.setAttribute("style","display:none;");
        lastentry.setAttribute("style","display:block;");
        pageval = 0;
        return;
    }

    usersRef.orderBy(field).startAfter(lastVisible).limit(pageSize).get().then(snapshot =>{
        let request = [];
        snapshot.forEach(doc=>{
            request.push({...doc.data(), id: doc.id});
        });

        request.forEach( data =>{
            createUserEntry(data.email, data.name, data.id, data.role);
        });
        lastVisible = snapshot.docs[snapshot.docs.length - 1];
        console.log("last", lastVisible);
    })
}

function createUserEntry(email, name, id, role){

    var br = document.createElement('br');
    var div = document.createElement('div');
    div.setAttribute('class','row');
    var divname = document.createElement('div');
    divname.setAttribute('class','col-5');
    var divemail = document.createElement('div');
    divemail.setAttribute('class','col-4');

    var divbutton = document.createElement('div');
    divbutton.setAttribute('class','col-m2');
    
    var divNumber = document.createElement('div');
    divNumber.setAttribute('class','col-1');
    var divRole = document.createElement('div');
    divRole.setAttribute('class','col-2');


    var button = document.createElement('button');
    button.innerHTML = 'Actualizar Nombre';
    button.setAttribute('onclick','updateUser("'+id+'","'+email+'");');
    button.setAttribute('class','btn btn-secondary btn-block');
    
    var lbemail = document.createElement('input');
    lbemail.disabled = true;
    lbemail.setAttribute('type','text');
    lbemail.setAttribute('class','form-control');
    
    var lbrole = document.createElement('input');
    lbrole.disabled = true;
    lbrole.setAttribute('type','text');
    lbrole.setAttribute('class','form-control');

    var lbnumber = document.createElement('input');
    lbnumber.disabled = true;
    lbnumber.setAttribute('type','text');
    lbnumber.setAttribute('class','form-control');

    var lbname = document.createElement('input');
    lbname.setAttribute('type','text');
    lbname.setAttribute('id',email);
    lbname.setAttribute('class','form-control');
   
    lbemail.value = email;
    lbname.value = name;
    lbrole.value = role;
    lbnumber.value = pageval;
    pageval++;

    divname.appendChild(lbname);
    divemail.appendChild(lbemail);
    divbutton.appendChild(button);
    divRole.appendChild(lbrole);
    divNumber.appendChild(lbnumber);

    div.appendChild(divNumber);
    div.appendChild(divRole);
    div.appendChild(divname);
    div.appendChild(divemail);
    var container = document.getElementById('user-container');
    container.appendChild(div);
    container.appendChild(br);
}

function updateUser(id, email){
    var upname = document.getElementById(email);
    usersRef.doc(id).update({name: upname.value}).then(()=>{
        window.alert("Se ha modificado con exito");
    }).catch(error => {
        window.alert("Hubo un problema al actualizar el archivo");
	})

}

//Crear Cuenta
const createButton = document.getElementById('createButton');
createButton.addEventListener('click',sendToCreate);

function sendToCreate(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	
	window.location.href = "createAccount.html";
}
