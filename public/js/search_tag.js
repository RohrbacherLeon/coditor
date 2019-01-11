$(document).ready(function() {
  $('#searchByTag').select2({ width: '100%' });
});

$.get(`/api/exercises`).then(function(data){  
  generateExercises(data);
})

$('#searchByTag').on('select2:select', function (e) {
   let tags = [];

   $(e.target).select2('data').forEach(tag => {
     tags.push(tag.text);
   });

  $.get(`/api/exercises?lang=${window.location.href.split('/').reverse()[0]}&tags=${tags.join(',')}`).then(function(data){
    console.log(data);
    generateExercises(data)
  })
});

$('#searchByTag').on('select2:unselect', function (e) {
  let tags = [];
  $(e.target).select2('data').forEach(tag => {     
    tags.push(tag.text);
  });  

  $.get(`/api/tags/filter?lang=${window.location.href.split('/').reverse()[0]}&tags=${tags.join(',')}`).then(function(data){    
    generateExercises(data)
  })
});

function generateExercises(data){
  let exercices = "";
   data.forEach(exercice => {
     exercices += `
     <a href="/exercises/${exercice.language}/${exercice.slug}" class="exercise ${exercice.language} draggable">
         <h4>${exercice.title}</h4>
         <p>${exercice.author}</p>
     </a>
     `
   });
   $('.exercises').empty();
   $('.exercises').append(exercices);
}