//search bar
const searchButton = document.getElementById('search_submit');
searchButton.addEventListener('click',sendtosearch);

function sendtosearch(event){
	event.preventDefault();
    event.stopImmediatePropagation();
    
    var text = document.getElementById('search_input');
    if(text.value == ""){
        window.alert("Debe existir un valor de busqueda");
        return;
    }
    window.location.href = 'database.html' + '#' + text.value;
}

window.onhashchange = function() {
    window.location.reload();
}