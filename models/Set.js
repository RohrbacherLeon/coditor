const mongoose = require("mongoose");

// Set Schema
let SetSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        index: true
    },
    
    exercises: {
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
var Set = mongoose.model("Set", SetSchema);
module.exports = Set;
