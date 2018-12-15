const mongoose = require('mongoose');

// User Schema
let ExerciseSchema = mongoose.Schema({
	title: {
		type: String,
		index: true
	},
	slug:{
		type : String,
	},
	language: {
		type: String,
	},
	tags: {
		type: Array
	},
	author: {
		type: String,
	}
});

let Exercise = module.exports = mongoose.model('Exercise', ExerciseSchema);

module.exports.byLanguage = function(language, callback){
	let query = {language: language};
	Exercise.find(query, callback);
}

module.exports.getAllValuesOf = function(value, callback){
	Exercise.find().distinct(value, callback);
}

module.exports.getAll = function(callback){
	Exercise.find({}, callback);
}