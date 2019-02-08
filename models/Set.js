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


var Set = mongoose.model("Set", SetSchema);
module.exports = Set;
