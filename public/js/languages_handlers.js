let base_url = "http://localhost:3000/";
let slot = $('.exercises');

printExercisesForLanguage = function(lang){
    axios.get(base_url + `api/languages/${lang}`).then(function(response){
        let html = "";
        response.data.forEach(exercise => {
            html += `<div class="exercise">
                <h4>${exercise.title}</h4>
                <p>${exercise.description}</p>
            </div>`;
        });
        slot.empty();
        slot.append(html);
    }).catch(function(error){
        if(error)
            throw error;
    });
}

setActive = function(elem){
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