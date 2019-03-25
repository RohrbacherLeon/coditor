module.exports = {
	analyse: function (content) {
		let variables = this.getVariables(content);
		let functions = this.getFunctions(content);
		return {
			variables, functions
		};
	},
	getVariables: function (text, type) {
		let regexes = [new RegExp("(?<=let\\s)(.*)(?=;)", "gm"), new RegExp("(?<=const\\s)(.*)(?=;)", "gm")];
		let formated = {};

		regexes.forEach(re => {
			let all = text.match(re);
			if (all) {
				all.forEach(item => {
					let split = item.split("=");
					formated[split[0].trim()] = split[1].trim().replace(/"/g, "");
				});
			}
		});

		return formated;
	},
	getFunctions: function (text) {
		var re = new RegExp("(?<=function\\s)(.*)(?=\\()", "gm");
		if (text.match(re)) {
			return text.match(re);
		}
		return [];
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
		let errors = [];
		if (teacher.functions) {
			teacher.functions.forEach(functionName => {
				if (!student.functions.includes(functionName)) {
					errors.push(functionName);
				}
			});
		}
		return errors;
	},
	variablesHasGoodName (student, teacher) {
		let errors = [];
		if (teacher.variables) {
			teacher.variables.forEach(variable => {
				if (student.variables.includes(variable)) {
					errors.push(variable);
				}
			});
		}
		return errors;
	}
};
