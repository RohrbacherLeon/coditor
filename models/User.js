const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
let UserSchema = mongoose.Schema({
	local: {
		first_name: String,
		last_name: String,
		password: String,
		email: {
			type: String,
			index:true
		}
	},
	google: {
		id: String,
		email: {
			type: String,
			index:true
		},
		first_name: String,
		last_name: String
	},
	github: {
		id: String,
		username: String,
		email: {
			type: String,
			index:true
		}
	},
	type: {
		type: String,
		required: true,
		default: "student"
	},
	urlImage: String
});


UserSchema.statics.createUser = function(data, callback){
	
	let newUser = new this;

	newUser.local.first_name = data.first_name;
    newUser.local.last_name  = data.last_name;
	newUser.local.email      = data.email;
	newUser.local.password   = data.password;
	newUser.urlImage		 = "../images/iconLocal.png";

	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.local.password, salt, function(err, hash) {
	        newUser.local.password = hash;
	        newUser.save(callback);
	    });
	});
}

UserSchema.statics.getUserByEmail = function(email, callback){
	let query = {"local.email": email};
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