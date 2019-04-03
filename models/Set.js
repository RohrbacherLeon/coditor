const mongoose = require("mongoose");

// Set Schema
let SetSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    slug: {
        type: String,
        required: true,
        index: true
    },
    exercises: {
        type: Array,
        required: true,
        default: []
    },
    hasSucceeded: {
        type: Array,
        required: true,
        default: []
    },
    author: {
        type: String,
        required: true
    }
});

SetSchema.statics.ByAuthor = function (author, callback) {
    let query = { author };
    Set.find(query, callback);
};

SetSchema.statics.getSetBySlug = function (slug, callback) {
    let query = { slug };
    Set.find(query, callback);
};

SetSchema.statics.getAll = function (callback) {
    Set.find({}, callback);
};

var Set = mongoose.model("Set", SetSchema);
module.exports = Set;