const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
let UserSchema = mongoose.Schema({
	first_name: {
		type: String,
	},
	last_name: {
		type: String,
	},
	password: {
		type: String
	},
	email: {
		type: String,
		index:true
	},
	name: {
		type: String
	}
});

let User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(data, callback){
	
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

module.exports.getUserByEmail = function(email, callback){
	let query = {email: email};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}