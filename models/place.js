
var mongoose = require('mongoose');

module.exports = mongoose.model('place',{
	name: String,
	location: String,
	photo: String,
	people_going: Number,
	names_going: [String]
});