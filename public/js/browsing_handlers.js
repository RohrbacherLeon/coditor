let base_url = "http://localhost:3000/";
let slot = $('.exercises');
let current_language = "js";

switchLanguage = function(li_elem) {
    current_language = li_elem.attr('id').split('_', 2)[1];
    $.get(base_url + `api/exercises/${current_language}`).then(function(response) {
        refreshExercises(getExercisesHtml(response));
    });
    li_elem.siblings().removeClass('active');
    li_elem.attr('class', 'active');
}

getExercisesHtml = function(data) {
    let exercises = "";
    data.forEach(exercise => {
        exercises += `
        <a href="/exercises/${exercise.language}/${exercise.slug}" class="exercise ${exercise.language} draggable">
            <h4>${exercise.title}</h4>
            <p>${exercise.author}</p>
        </a>`;
    });
    return exercises;
}

function refreshTags(e) {
    let tags = [];
    $(e.target).select2('data').forEach(tag => {
        tags.push(tag.text);
    });
    $.get(`/api/tags/filter?lang=${current_language}&tags=${tags.join(',')}`).then(function(data) {
        refreshExercises(getExercisesHtml(data));
    });
}

function refreshExercises(exercises_html) {
    slot.empty();
    slot.append(exercises_html);
}

$(document).ready(function() {
    $('#searchByTag').select2({ width: '100%' });

    $('#lang_js').click(function() {
        switchLanguage($(this));
    });

    $('#lang_php').click(function() {
        switchLanguage($(this));
    });

    $('#searchByTag').on('select2:select', function(e) {
        refreshTags(e);
    });

    $('#searchByTag').on('select2:unselect', function(e) {
        refreshTags(e);
    });
});