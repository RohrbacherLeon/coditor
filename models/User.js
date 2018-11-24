var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var schema = new mongoose.Schema({ 
	name: 'string', 
	email: 'string' 
});

module.exports = mongoose.model('Users', schema);