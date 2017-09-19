
var mongoose = require('mongoose');

module.exports = mongoose.model('User_loc',{
	id: String,
	username: String,
	password: String,
	location: String
});