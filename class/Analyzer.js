module.exports = {
	analyse: function (content) {
		let lets = this.getVariables(content, "let");
		let consts = this.getVariables(content, "const");
		let variables = lets.concat(consts);
		let functions = this.getFunctions(content);
		return {
			variables, functions
		};
	},
	getVariables: function (text, type) {
		var re = new RegExp(`(?<=${type}\\s)(.*)(?=;)`, "gm");

		let all = text.match(re);
		let formated = {};
		if (all) {
			all.forEach(item => {
				let split = item.split("=");
				formated[split[0].trim()] = split[1].trim().replace(/"/g, "");
			});
		}

		return formated;
	},
	getFunctions: function (text) {
		var re = new RegExp("(?<=function\\s)(.*)(?=\\()", "gm");
		return text.match(re);
	},

	analyseTeacher: function (content) {
		var regFunctions = new RegExp("(?<=(\\*\\_))(.*)(?=(\\_\\*))", "gm");
		var regVariables = new RegExp("(?<=`)(.*)(?=`)", "gm");

		let functions = content.match(regFunctions);
		let variables = content.match(regVariables);

		return {
			functions,
			variables
		};
	},
	functionHasGoodName (student, teacher) {
		student.functions.forEach(functionName => {
			if (teacher.functions.includes(functionName)) {
				return true;
			}
			return false;
		});
	},
	variablesHasGoodName (student, teacher) {
		student.variables
	}
};
