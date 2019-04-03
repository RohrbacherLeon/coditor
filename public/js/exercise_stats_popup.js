// Get the popup
let popup = document.getElementById('popupExerciseStats');

// Get the <span> element that closes the popup
let span = document.getElementsByClassName("close")[0];

let btns = $(".openExerciseStats");
// When the user clicks on the button, open the popup
btns.each(function() {
    $( this ).on( 'click', function () { 
        let base_url = "http://localhost:3000/";
        $.get(base_url + `api/exercises?id=${this.parentElement.id}`).then(function(response) {
            let stats = `
            <div class="stats-content">
                <span class="close">&times;</span>
                <h2>Succès : ${response.stats.success } <i class="far fa-check-circle"></i></h2>
                <h2>Echecs : ${ response.stats.fails } <i class="far fa-times-circle"></i></h2>
                <h2>Elèves ayant réussi cet exercice :</h2>
                <ul>
             `;
            $.each(response.stats.hasSucceeded, function( index, email ) {
                stats += "<li>"+email+"</li>";
            });
            stats += "</ul></div>"
            popup.innerHTML = stats;
            let span = document.getElementsByClassName("close")[0];
            span.onclick = function() {
                popup.style.display = "none";
            }
            popup.style.display = "block";
        });
    });
});


// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}