//recuperation de la langue
var url = $(location).attr('href');
var lang = url.split('/').reverse()[0]

//on supprime la classe active de base
$(".languages li").removeClass('active');

$(".languages li").each(function(language){
       if(this.id == lang)
            $(this).addClass('active')
    
})