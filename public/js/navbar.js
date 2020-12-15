firebase.auth().onAuthStateChanged(function(user) {
    if (user == null){
        window.location.href = 'index.html';
    }else{
		var nav_id = document.getElementById('navbar_id');
		nav_id.innerHTML = user.email;
		currentUser = user;
		console.log(user.uid);
	}
});


//Cerrar sesion
const logout = document.getElementById('logoutButton');
logout.addEventListener('click',logoutUser);

function logoutUser(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	
	firebase.auth().signOut().then(()=>{
		console.log("El usuario ha cerrado sesion");
	})
}


//Ir a inicio
const goHome = document.getElementById('navbar_id');
goHome.addEventListener('click',sendtoHome);

function sendtoHome(event){
	//Prevenir el refresh
	event.preventDefault();
	event.stopImmediatePropagation();
	
	window.location.href = 'homepage.html';
}