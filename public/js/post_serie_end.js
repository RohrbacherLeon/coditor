// Get the button that post
let btnEndSerie = document.getElementById("post_serie_end");
let baseUrl = "http://localhost:3000/"
if(btnEndSerie){
    // When the user clicks on the button, open the popup 
    btnEndSerie.onclick = function() {
        let setsSlug = this.firstElementChild.id;
        $.post( baseUrl + "sets/" + setsSlug, function() {
            window.location.href = baseUrl + "sets/" + setsSlug;
        }).fail(function(error) {
            console.log(error);
        });   
    }
}