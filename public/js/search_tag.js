$.get(`/api/exercises`).then(function(data) {
    generateExercises(data);
})

$('#searchByTag').on('select2:select', function(e) {
    let tags = [];

    $(e.target).select2('data').forEach(tag => {
        tags.push(tag.text);
    });

    $.get(`/api/exercises?lang=${window.location.href.split('/').reverse()[0]}&tags=${tags.join(',')}`).then(function(data) {
        console.log(data);
        generateExercises(data)
    })
});

$('#searchByTag').on('select2:unselect', function(e) {
    let tags = [];
    $(e.target).select2('data').forEach(tag => {
        tags.push(tag.text);
    });

    $.get(`/api/tags/filter?lang=${window.location.href.split('/').reverse()[0]}&tags=${tags.join(',')}`).then(function(data) {
        generateExercises(data)
    })
});