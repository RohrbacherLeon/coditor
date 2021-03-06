const mongoose = require("mongoose");

// Exercise Schema
let ExerciseSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    slug: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true,
        default: []
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    stats: {
        fails: {
            type: Number,
            default: 0
        },
        success: {
            type: Number,
            default: 0
        },
        hasSucceeded: []
    },
    awaited: {
        titles: {
            type: Array,
            default: []
        }
    },
    inSets: {
        type: Array,
        default: []
    }
});

ExerciseSchema.statics.createExercise = function (data, callback) {
    Exercise.create(data, callback);
};

ExerciseSchema.statics.getExo = function (data, callback) {
    let query = { slug: data.slug, language: data.language };
    Exercise.findOne(query, callback);
};

ExerciseSchema.statics.ByAuthor = function (author, callback) {
    let query = { author };
    Exercise.find(query, callback);
};

ExerciseSchema.statics.byLanguage = function (language, callback) {
    let query = {};

    if (language) {
        if (language === "all") {
            query = {};
        } else {
            query.language = language;
        }
    }

    Exercise.find(query, callback);
};

ExerciseSchema.statics.byTags = function (tagsString, lang, callback) {
    let obj = {
        tags: { $all: tagsString.split(",") }
    };

    if (lang && lang !== "all") {
        obj.language = lang;
    }

    Exercise.find(obj, callback);
};

ExerciseSchema.statics.getAllValuesOf = function (value, callback) {
    Exercise.find().distinct(value, callback);
};

ExerciseSchema.statics.getAll = function (callback) {
    Exercise.find({}, callback);
};

var Exercise = mongoose.model("Exercise", ExerciseSchema);
module.exports = Exercise;