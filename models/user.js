var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
	id: String,
	username: String,
	password: String,
	city: String,
	state:String,
	trade_requests: [String],
	trade_requests_to_user:[String]
});