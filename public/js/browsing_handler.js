let base_url = "http://localhost:3000/";
let slot = $('.exercises');
let current_language = "all";
let arrow_right = "<img src='/images/arrow_right.png' class='arrow_right'>";
let delete_arrow = "<img src='/images/delete_arrow.png' class='delete_arrow'>";
let exercises_selected = [];


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
        if ($.inArray(exercise._id, exercises_selected) == -1) {
            exercises += `
            <div class="exercise-container" draggable>
                <a href="/exercises/${exercise.language}/${exercise.slug}" id="${exercise._id}" class="exercise ${exercise.language}">
                    <h4>${exercise.title}</h4>
                    <p>${exercise.author}</p>
                </a>
            </div>`;
        }
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
    $.get(`/api/tags/filter?lang=${current_language}`).then(function(data) {
        refreshExercises(getExercisesHtml(data));
    });


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