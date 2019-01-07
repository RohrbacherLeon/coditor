$(document).ready(function() {
    $('.createTag').select2({ width: '100%' });
});

$('.createTag').on('select2:select', function (e) {
    generateListTags(e)    
});

$('.createTag').on('select2:unselect', function (e) {
    generateListTags(e)
});

function generateListTags(e){
    let tagsList = [];
    $(e.target).select2('data').forEach(tag => {
        if(!tagsList.includes(tag.text)){
            tagsList.push(tag.text)
        }
    });

    $('[name="tags"]').val(tagsList.join(','))
}
