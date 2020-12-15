//get usersList
var search_value = window.location.hash.substring(1).toLowerCase().replace(/%20/g," ");
console.log(search_value);
var wasUserFound = false;
searchUsers();



async function searchUsers(){
    if(search_value == ''){
        window.location.href = 'homepage.html';
        return;
    }else{
        window.alert("Espere un momento en lo que se realiza la busqueda...");
        let allUsersRef = firebase.firestore().collection("users");
        let allUsers = await allUsersRef.get();

        for(var doc of allUsers.docs){
            let specificUserRef = firebase.firestore().collection("users").doc(doc.id);
            let specificUserData = await specificUserRef.get();
            var userName = specificUserData.data().name;
            userName = userName.toLowerCase();
            console.log(userName + " == " + search_value);
            if(userName.includes(search_value)){
                wasUserFound = true;
                console.log(specificUserData.data());   
                createAlumnoEntry(specificUserData.data());  
            }
        }
    }
    if(wasUserFound){
        window.alert("Se mostraron todos los resultados!");
    }else{
        window.alert("No se encontro ningun usuario!");
    }
}


function createAlumnoEntry(data){
    var br = document.createElement('br');

    //element creation
    var div = document.createElement('div');
    div.setAttribute('class','row');

    var divname = document.createElement('div');
    divname.setAttribute('class','col-5');

    var divEmail  = document.createElement('div');
    divEmail.setAttribute('class','col-5');
    
    var divmatricula = document.createElement('div');
    divmatricula.setAttribute('class','col-2');

    //labels
    var lbMatricula = document.createElement('input');
    lbMatricula.disabled = true;
    lbMatricula.setAttribute('type','text');
    lbMatricula.setAttribute('class','form-control');

    var lbName = document.createElement('input');
    lbName.disabled = true;
    lbName.setAttribute('type','text');
    lbName.setAttribute('class','form-control');

    var lbEmail = document.createElement('input');
    lbEmail.disabled = true;
    lbEmail.setAttribute('type','text');
    lbEmail.setAttribute('class','form-control');

   
    //values
    lbName.value = data.name;
    lbMatricula.value = data.matricula;
    lbEmail.value = data.email;

    divname.appendChild(lbName);
    divEmail.appendChild(lbEmail);
    divmatricula.appendChild(lbMatricula);

    div.appendChild(divmatricula);
    div.appendChild(divname);
    div.appendChild(divEmail);
    
    var container = document.getElementById('user-container');
    container.appendChild(div);
    container.appendChild(br);
}

function viewuser(id){
    console.log(id);
    window.location.href = 'updateRecord.html' + '#' + id;
}