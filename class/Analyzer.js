module.exports = {
    analyseTeacher: function (testFileContent) {
        const regIt = new RegExp("(?<=(it\\(('|\"|`)))(.*)(?=('|\"|`))", "g");
        console.log(testFileContent.match(regIt));

        return testFileContent.match(regIt);
    }
};
