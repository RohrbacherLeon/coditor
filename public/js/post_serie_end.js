// Get the button that post
let btn = document.getElementById("post_serie_end");
let baseUrl = "localhost:3000/"
if(btn){
    // When the user clicks on the button, open the popup 
    btn.onclick = function() {
        $.post( baseUrl + "sets/une-serie", { name: "John", time: "2pm" } );
    }
}