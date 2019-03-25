const fs = require("fs");

module.exports = {
    generate: function (testFile, fct, name) {
        console.log(fct.indexOf("function"));

        let startFile = `
        let assert = require("assert");
        
        `;

        if (fct.indexOf("function") === 0) {
            startFile += `let fct = ${fct};`;
        } else {
            startFile += fct;
        }

        let contentFile = startFile + testFile;

        // calculer le name : si tmp1 => tmp2 etc...
        let nameFile = name + ".js";
        fs.writeFileSync(process.cwd() + "/tmp/" + nameFile, contentFile);
        return nameFile;
    },

    remove: function (fileName) {
        fs.unlinkSync(process.cwd() + "/tmp/" + fileName);
    }
};
