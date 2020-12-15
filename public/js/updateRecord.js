var fullname = document.getElementById('form_fullname');
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

var id = window.location.hash.substring(1)

let usersRef = firebase.firestore().collection('personas').doc(id);
let getDoc = usersRef.get()
  .then(doc => {
    if (!doc.exists) {
      window.alert('Hubo un error consiguiendo el documento!');
      window.location.href = 'homepage.html';
    } else {
        console.log(doc.data().fullName);
      curp.value = doc.data().CURP;
      date.value = doc.data().birthday;
      sex.value = doc.data().sex;
      email.value = doc.data().email;
      house.value = doc.data().houseNumber;
      phone.value = doc.data().phoneNumber;
      address.value = doc.data().address;
      cp.value = doc.data().CP;
      emername.value = doc.data().accidentName;
      emerphone.value = doc.data().accidentNumber;
      fullname.value = doc.data().fullName;
    }
  })
  .catch(err => {
    console.log('Error getting document', err);
  });

  var form = document.getElementById('submitUser');
form.addEventListener('submit',login);

function login(event){
    event.preventDefault();


    let personRef = firebase.firestore().collection('personas');
    personRef.doc(id).set({
        CP: cp.value,
        CURP: curp.value,
        accidentName: emername.value,
        accidentNumber: emerphone.value,
        address: address.value,
        birthday: date.value,
        email: email.value,
        fullName: fullname.value,
        houseNumber: house.value,
        isWorker: false,
        phoneNumber: phone.value,
        sex: sex.value
    }).then(()=>{
        window.alert("Se ha actualizado el registro");
        window.location.href = "database.html";
    }).catch(error => {
        window.alert("Hubo un problema al actualizar el archivo.");
    })
}