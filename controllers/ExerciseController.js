const Exercise = require('../models/Exercise')

exports.getExoByLang = (req, res) => {
    Exercise.getAllValuesOf('language',function(err, languages){
        let locale = req.params.lang;
        res.render('BrowsingView', {languages, locale});
    })
}

exports.postExo = (req, res) => {

    




    //temporaire car mocha garde en cache les fichiers chargés
 mocha = new Mocha({});
 //Fonction etudiant dans le textarea (fausse ici pour tester les test (testception))
 let fct = 'function(a, b){ return a+b;}';
     
 //Lecture du fichier du prof pour vérifier la fonction de l'etudiant
 fs.readFile('/home/anthony/Bureau/coditor/tests/test.js', "utf-8", function(err, data){
     //Génére un fichier nameFile de test (ajoute la fonction étudiante dans le fichier test du prof)
     let nameFile = Generator.generate(data, fct);
     if(nameFile){
         //si nameFile, c'est que le fichier bien généré
         //lancer mocha sur docker avec le namefile
         //exec(mocha ....../tmp/nameFile) sur le docker
         //ici c'est pour tester l'execution de mocha sans docker
         mocha.addFile('/home/anthony/Bureau/coditor/tmp/' + nameFile);
         let results = {
             fails   : [],
             success : []
         }

         mocha.run(function(failures){
             Generator.remove(nameFile);
         }).on('pass', function(test) {
             results.success.push({
                 title : test.title,
                 speed : test.speed
             })
         }).on('fail', function(test, err) {
             results.fails.push({
                 title : test.title,
                 error : {
                     actual   : test.err.actual, 
                     expected : test.err.expected,
                     operator : test.err.operator
                 }
             })
         }).on('end', function() {
             console.log(results);
         });

         

     }
 });
}



 