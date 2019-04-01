function setDraggable() {
    $(".draggable").draggable({
        cursor: "move",
        revert: "invalid"
    });
}

$(document).ready(function() {
    $.get(`/api/tags/filter?lang=${current_language}`).then(function(data) {
        refreshExercises(getExercisesHtml(data));
        setDraggable();
    });

    // Drop script
    $("#drop_zone").droppable({
        accept: ".draggable",
        drop: function(event, ui) {
            $(this).removeClass("over");
            var dropped = ui.draggable;
            exercises_selected.push(dropped[0].id);
            $("#exercises_selected").val(exercises_selected);
            var droppedOn = $(this);
            $(dropped).detach().css({
                top: 0,
                left: 0
            }).appendTo(droppedOn).draggable( "disable" ).addClass("selected");
            // Remove/Add + button

            $(delete_arrow+arrow_right).appendTo(droppedOn);
            $('#plus_button').css("display","none");
            
        },
        over: function(event, elem) {
            $(this).addClass("over");
        },
        out: function(event, elem) {
            $(this).removeClass("over");
        }
    });

    $('#drop_zone').on('click', '.delete_arrow', function(e) {
        exercises_selected.splice($.inArray($(this).prev()[0].id, exercises_selected),1);
        $("#exercises_selected").val(exercises_selected);
        $(this).next().remove();
        $(this).prev().remove();
        $(this).remove();
        $.get(`/api/tags/filter?lang=${current_language}`).then(function(data) {
            refreshExercises(getExercisesHtml(data));
            setDraggable();
        });

        if(exercises_selected.length === 0){
            $('#plus_button').css("display","block");
        }
    });
});
