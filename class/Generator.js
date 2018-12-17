var fs = require('fs');
let counter = 1;
module.exports = {
    generate : function(testFile, fct){
        let startFile = `
        let assert = require('assert');
        let fct = ${fct};
        `;
        let contentFile = startFile + testFile;
        
        //calculer le name : si tmp1 => tmp2 etc...
        let nameFile = "tmp"+ counter++ + ".js";
        let a = fs.writeFileSync('/home/anthony/Bureau/coditor/tmp/' + nameFile, contentFile); 
        return nameFile;
    },

    remove : function(fileName){
        fs.unlinkSync('/home/anthony/Bureau/coditor/tmp/' + fileName);
    }
};