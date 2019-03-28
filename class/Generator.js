const fs = require("fs");

module.exports = {
    generatePHP: function (testFile, fct, name) {
        let startFile = `
                ${fct}
        `;

        let contentFile = testFile + startFile;

        let nameFile = name + ".php";
        fs.writeFileSync(process.cwd() + "/tmp/" + nameFile, contentFile);
        return nameFile;
    },
    generateJS: function (testFile, fct, name) {
        let startFile = `
            let assert = require('chai').assert;
        ${fct}
        `;

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