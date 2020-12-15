
var form = document.getElementById('submitUser');
form.addEventListener('submit',login);

function login(event){
    event.preventDefault();
    var name = document.getElementById('form_name');
    var curp = document.getElementById('form_curp');
    var date = document.getElementById('form_date');
    var sex = document.getElementById('form_sex');
    var email = document.getElementById('form_email');
    var house = document.getElementById('form_house');
    var phone = document.getElementById('form_phone');
    var address = document.getElementById('form_address');
    var cp = document.getElementById('form_cp');
    var emername = document.getElementById('form_emername');
    var emerphone = document.getElementById('form_emerphone');
0
    let personRef = firebase.firestore().collection('personas');
    personRef.doc().set({
        CP: cp.value,
        CURP: curp.value,
        accidentName: emername.value,
        accidentNumber: emerphone.value,
        address: address.value,
        birthday: date.value,
        email: email.value,
        fullName: name.value,
        houseNumber: house.value,
        isWorker: false,
        phoneNumber: phone.value,
        sex: sex.value
    }).then(()=>{
        window.alert("Se ha creado el registro");
        window.location.href = "database.html";
    }).catch(error => {
        window.alert("Hubo un problema al subir el archivo.");
    })
}