const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
let UserSchema = mongoose.Schema({
	first_name: {
		type: String,
		required: true
	},
	last_name: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		index:true
	},
	type: {
		type: String,
		required: true,
		default : "student"
	}
});


UserSchema.statics.createUser = function(data, callback){
	
	let newUser = new this;

	newUser.first_name = data.first_name;
    newUser.last_name  = data.last_name;
	newUser.email      = data.email;
	newUser.password   = data.password;

	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

UserSchema.statics.getUserByEmail = function(email, callback){
	let query = {email: email};
	User.findOne(query, callback);
}

UserSchema.statics.getUserById = function(id, callback){
	User.findById(id, callback);
}

UserSchema.statics.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
var User = mongoose.model('User', UserSchema);

module.exports = User;