const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();


//Creates new user, assigns role and create user entry in the database
exports.createAccount = functions.https.onCall((data,context) =>{
    
    //check for authentification
    if(context.auth.token.admin !== true){
        return{
            error: 'Se requiere ser admin para realizar esta accion!'
        };
    }
    console.log(data.email + data.name + data.role + data.matricula);
    return admin.auth().createUser({
        email: data.email,
        password : "PASSWORD123"
    }).then(userRecord => {
        return createUserEntry(data.email, data.name, data.role, data.matricula, userRecord.uid).then(res =>{
            console.log("Se creo el entry correctamente");
            return grantRole(data.email, data.role).then(result =>{
                console.log("Se asigno el rol correctamente");
                return true;
            }).catch(error=>{});
        }).catch(error=>{});
    }).catch(error=>{});
})

//Create firestore entry
async function createUserEntry(email, name, role, matricula, uid) {
    console.log(email, name, role, matricula, uid);
    return admin.firestore().collection('users').doc(uid).set({
        email: email,
        name: name,
        matricula: matricula,
        role: role,
        grupos: [],
        newAlert: false
    });
}

//Grant role status
async function grantRole(email, role) {

    if(role.localeCompare("Alumno")){
        return grantStudentRole(email).then(() => {
            return {
                result: `Request fulfilled! ${email} is now an alumno!.`
            };
        }).catch(error =>{
            console.log(error.code);
        }); 
    }

    if(role.localeCompare("Profesor")){
        return grantProfessorRole(email).then(() => {
            return {
                result: `Request fulfilled! ${email} is now a profesor!.`
            };
        }).catch(error =>{
            console.log(error.code);
        }); 
    }

    if(role.localeCompare("Administrador")){
        return grantModeratorRole(email).then(() => {
            return {
                result: `Request fulfilled! ${email} is now an administrador!.`
            };
        }).catch(error =>{
            console.log(error.code);
        }); 
    }
}

async function grantModeratorRole(email) {
    const user = await admin.auth().getUserByEmail(email);
    return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
    }); 
}

async function grantStudentRole(email) {
    const user = await admin.auth().getUserByEmail(email);
    return admin.auth().setCustomUserClaims(user.uid, {
        alumno: true
    });  
}

async function grantProfessorRole(email) {
    const user = await admin.auth().getUserByEmail(email);
    return admin.auth().setCustomUserClaims(user.uid, {
        profesor: true
    }); 
}
/*
//auth trigger create
exports.newUserSignUp = functions.auth.user().onCreate(user => {
    return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email
    });
});
/*
//auth trigger delete
exports.userDeleted = functions.auth.user().onDelete(user => {
    const doc = admin.firestore().collection('users').doc(user.uid);
    return doc.delete();
})
*/


/*

//get users list
exports.getUsers = functions.https.onCall((data,context)=>{
    //check for authentification
    if(context.auth.token.admin !== true){
        return{
            error: 'Se requiere ser admin para realizar esta accion!'
        };
    }

    // List batch of users, 1000 at a time.
    var users = [];
    admin.auth().listUsers(1000, data.nextPageToken).then((listUsersResult) => {
        return listUsersResult;/*
        listUsersResult.users.forEach((userRecord) => {
          var userData = userRecord.email;
          users.push(userData);
          console.log(userData);
        }).then(()=>{
        })
        
    }).catch((error) => {
        console.log('Error listing users:', error);
    });
})
*/