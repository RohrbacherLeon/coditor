module.exports = {
	analyse: function (content) {
		let lets = this.getVariables(content, "let");
		let consts = this.getVariables(content, "const");
		console.log(lets);
		console.log(consts);
	},
	getVariables: function (text, type) {
		var re = new RegExp(`(?<=${type}\\s)(.*)(?=;)`, "gm");

		let all = text.match(re);
		let formated = {};

		all.forEach(item => {
			let split = item.split("=");
			formated[split[0].trim()] = split[1].trim().replace(/"/g, "");
		});

		return formated;
	}
};
