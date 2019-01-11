let base_url = "http://localhost:3000/";
let slot = $('.exercises');

printExercisesForLanguage = function(lang) {
    let html = "";
    axios.get(base_url + `api/languages/${lang}`).then(function(response) {
        response.data.forEach(exercise => {
            html += `<div class="exercise">
                <h4>${exercise.title}</h4>
                <p>${exercise.description}</p>
            </div>`;
        });
    }).catch(function(error) {
        if (error)
            html = `<div class="alert alert-danger">Une erreur est survenue.</div>`;
    }).then(function() {
        slot.empty();
        slot.append(html);
    });
}

setActive = function(elem) {
    elem.siblings().removeClass('active');
    elem.attr('class', 'active');
}

$('#lang_js').click(function() {
    printExercisesForLanguage('js');
    setActive($(this));
});

$('#lang_php').click(function() {
    printExercisesForLanguage('php');
    setActive($(this));
});