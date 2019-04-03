module.exports = {
    analyseTeacher: function (testFileContent, language) {
        let reg = null;
        if (language === "js") {
            reg = new RegExp("(?<=(it\\(('|\"|`)))(.*)(?=('|\"|`))", "g");
        } else {
            reg = new RegExp("(?<=(function\\stest))(.*)(?=(\\(\\)))", "g");
        }
        return testFileContent.match(reg);
    },
    analysePHPUnit: function (content) {
        const regTest = new RegExp(" .*", "g");
        let tests = content.match(regTest);
        tests.shift();
        let success = [];
        tests.map(test => {
            if (test.match("\\[x\\]", "g")) {
                success.push(test.split("]")[1].trim());
            }
        });
        return { success, total: tests.length };
    },
    analyseJS: function (stdout) {
        let success = [];
        JSON.parse(stdout).passes.forEach(passe => {
            success.push(passe.title);
        });

        return { success, total: JSON.parse(stdout).stats.tests };
    }
};