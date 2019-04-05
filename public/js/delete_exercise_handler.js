$(document).ready(function() {
    $('.link-delete-exercise').click(function(event) {
        if (confirm("Etes vous sûr de vouloir supprimer cet exercice ?")) {
            $.ajax({
                url: `/exercises/${$(this).parent().attr('id')}`,
                method: "DELETE",
                success: (data) => {
                    location.reload();
                }
            });
        }
    });

    $('.link-delete-set').click(function(event) {
        if (confirm("Etes vous sûr de vouloir supprimer cette série ?")) {
            $.ajax({
                url: `/sets/${$(this).parent().attr('id')}`,
                method: "DELETE",
                success: (data) => { 
                    location.reload();
                }
            });
        }
    });
});