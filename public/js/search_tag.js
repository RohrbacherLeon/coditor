$.get(`/api/tags/filter?lang=${window.location.href.split('/').reverse()[0]}`).then(function(data){
  let exercices = "";
  data.forEach(exercice => {
    exercices += `
    <a href="/exercises/${exercice.language}/${exercice.slug}" class="exercise">
        <h4>${exercice.title}</h4>
        <p>${exercice.author}</p>
    </a>
    `
  });

  $('.exercises').empty();
  $('.exercises').append(exercices);

})

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  var tags = [];
    
    /*execute a function when someone writes in the text field:*/

    $(inp).on("input", function(e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) return false;
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        $(a).attr("id", this.id + "autocomplete-list");
        $(a).addClass("autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        $(this).parent().append(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
          /*check if the item starts with the same letters as the text field value:*/
          if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
            /*create a DIV element for each matching element:*/
            b = document.createElement("DIV");
            /*make the matching letters bold:*/
            b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
            b.innerHTML += arr[i].substr(val.length);
            /*insert a input field that will hold the current array item's value:*/
            b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
            /*execute a function when someone clicks on the item value (DIV element):*/
            $(b).on("click", function(e) {
              generateTags($(b).text());
              closeAllLists();
            });
            $(a).append(b);
          }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    $(inp).on("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          
          if (currentFocus > -1) {
            generateTags($(x[currentFocus]).text())
            closeAllLists();
          }
        }
    });

    function deleteTag(){
      $('.tag i').click(function(e){
        var index = tags.indexOf($(e.target).data('delete'))
        if (index > -1) 
          tags.splice(index, 1);

        $(`#tag-${e.target.getAttribute('data-delete')}`).remove()

        if(tags.length == 0){
          $.get(`/api/tags/filter?lang=${window.location.href.split('/').reverse()[0]}`).then(function(data){
            var exercices = "";
  
            data.forEach(exercice => {
              exercices += `
              <a href="/exercises/${exercice.language}/${exercice.slug}" class="exercise">
                  <h4>${exercice.title}</h4>
                  <p>${exercice.author}</p>
              </a>
              `
            });
    
            $('.exercises').empty();
            $('.exercises').append(exercices);
    
          })
        }
        
      })
    }

    

    function generateTags(value){
      tags.push(value)

      var html = "";
      var listTags = "";
      tags.map(tag => {
        if(listTags != "")
          listTags+= ","
        listTags += tag;
        html += `<span id='tag-${tag}' class='tag'>${tag}<i class="fas fa-times" data-delete='${tag}'></i></span>`
      });
      $('[name="tags"]').val(listTags)
      $(".autocomplete-tags").empty()
      $(".autocomplete-tags").append(html)

      deleteTag()
      $(inp).val('');
      

      var tagsList = tags.join(',');
      var exercices = "";
      $.get(`/api/tags/filter?tags=${tagsList}&lang=${window.location.href.split('/').reverse()[0]}`).then(function(data){
        data.forEach(exercice => {
          exercices += `
          <a href="/exercises/${exercice.language}/${exercice.slug}" class="exercise">
              <h4>${exercice.title}</h4>
              <p>${exercice.author}</p>
          </a>
          `
        });

        $('.exercises').empty();
        $('.exercises').append(exercices);

      })

      
       
    }

    function addActive(x) {
      /*a function to classify an item as "active":*/
      if (!x) return false;
      /*start by removing the "active" class on all items:*/
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      /*add class "autocomplete-active":*/
      $(x[currentFocus]).addClass("autocomplete-active");
    }
    function removeActive(x) {
      /*a function to remove the "active" class from all autocomplete items:*/
      for (var i = 0; i < x.length; i++) {
        $(x[i]).removeClass("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    /*execute a function when someone clicks in the document:*/
    $(document).on("click", function (e) {
        closeAllLists(e.target);
    });
}


$.get('/api/tags').then((tags) => {
    autocomplete(document.getElementById("searchByTag"), tags);  
 }).catch((err) => {
    console.log('erreur api :' + error);
 });


