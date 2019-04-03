$(document).ready(function() {
    $(".button--delete").click(function(event) {
        if (confirm("Etes vous sûr de vouloir supprimer cet exercice ?")) {
            $.ajax({
                url: `/exercises/${$(event.target).data("exerciseId")}`,
                method: "DELETE",
                success: (data) => {
                    window.location.href = "/exercises";
                }
            });
        }
    });
});