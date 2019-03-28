$(document).ready(function() {
    $('.link-delete').click(function(event) {
        if (confirm("Etes vous sûr de vouloir supprimer cet exercice ?")) {
            $.ajax({
                url: `/exercises/${$(this).parent().attr('id')}`,
                method: "DELETE",
                success: (data) => {
                    $(this).parent().remove();
                }
            });
        }
    });
});