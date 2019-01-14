let base_url = "http://localhost:3000/";
let slot = $('.exercises');
let current_language = "all";

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

$.get(`/api/tags/filter?lang=${current_language}`).then(function(data) {
    refreshExercises(getExercisesHtml(data));
    $(".draggable").draggable({
        cursor: "move",
        revert: "invalid"
    });
});



$("#drop_zone").droppable({
    accept: ".draggable",
    drop: function(event, ui) {
        console.log("drop");
        $(this).removeClass("over");
        var dropped = ui.draggable;
        var droppedOn = $(this);
        $(dropped).detach().css({
        top: 0,
        left: 0
        }).appendTo(droppedOn);
    },
    over: function(event, elem) {
        $(this).addClass("over");
        console.log("over");
    },
    out: function(event, elem) {
        $(this).removeClass("over");
    }
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
