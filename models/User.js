var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var schema = new mongoose.Schema({ 
	first_name : { type: String, required: true }, 
	last_name  : { type: String, required: true },
	email      : { type: String, required: true, unique: true },
	password   : { type: String, required: true }
});

schema.statics.createUser = function(data, callback){

	let newUser = new this;
	newUser.first_name = data.first_name;
	newUser.last_name = data.last_name;
	newUser.email = data.email;
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(data.password, salt, function(err, hash) {
			newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports = mongoose.model('Users', schema);