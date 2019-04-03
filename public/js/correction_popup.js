// Get the popup
let popup = document.getElementById('popupCorrection');

// Get the button that opens the popup
let btn = document.getElementById("openCorrection");

// Get the <span> element that closes the popup
let span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the popup 
btn.onclick = function() {
    popup.style.display = "block";
    editorCorrection.refresh()
}

// When the user clicks on <span> (x), close the popup
span.onclick = function() {
    popup.style.display = "none";
}

// When the user clicks anywhere outside of the popup, close it
window.onclick = function(event) {
    if (event.target == popup) {
        popup.style.display = "none";
    }
}