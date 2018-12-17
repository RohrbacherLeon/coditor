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
		type: Array,
		dafault: []
	},
	author: {
		type: String,
	}
});

let Exercise = module.exports = mongoose.model('Exercise', ExerciseSchema);

module.exports.createExercise = function(data, callback){
	Exercise.create(data)
}

module.exports.byLanguage = function(language, callback){
	let query = {language: language};
	Exercise.find(query, callback);
}

module.exports.byTags = function(tagsArray, lang, callback){
	Exercise.find( { tags: { $all: tagsArray.split(',') }, language : lang }, callback )
}

module.exports.getAllValuesOf = function(value, callback){
	Exercise.find().distinct(value, callback);
}

module.exports.getAll = function(callback){
	Exercise.find({}, callback);
}