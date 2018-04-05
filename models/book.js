
var mongoose = require('mongoose');

module.exports = mongoose.model('book',{
	name: String,
	url: String,
	photo: String,
	user_submitted: String
});