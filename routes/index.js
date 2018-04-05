var express = require('express');
var router = express.Router();
var book= require('../models/book');
var request = require('request');
var user = require('../models/user');
var books = require('google-books-search');


var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.redirect('/home');
	});
	
	

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register.jade',{message: req.flash('message')});
	});
	router.get('/login', function(req, res){
		res.render('index.jade',{message: req.flash('message')});
	});
	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	/*router.get('/home', isAuthenticated, function(req, res){
		
		//res.render('home.jade', { user: req.user, arr: JSON.stringify(names) });
		res.render('home.jade', { user: req.user });
	});*/
	

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	router.get('/tradebook', function(req, res) {
		console.log(req.query.name)
		
        book.findOne({ 'name' :  req.query.name }, 
                function(err, tbook) {
                	if (err) throw err;
                	
                	user.findOne({ 'username' :  tbook.user_submitted },
                		function (err,tuser){
                	if (err) throw err;
                	tuser.trade_requests_to_user.push(req.query.name);
                	tuser.save();
                })});
		user.findOne({ 'username' :  req.user.username }, 
                function(err, user) {
                	if (err) throw err;
                	user.trade_requests.push(req.query.name);
                	user.save();
                });
		res.redirect("/home")
		
	});
	
	
	router.post('/location_submit_', function(req, res) {
		console.log("idiots")
		console.log(req.user.username);
		
		user.findOne({ 'username' :  req.user.username }, 
                function(err, user) {
                	if (err) throw err;
                	user.city=req.body.user_city;
                	user.state=req.body.user_state;
                	user.save();
                });
		res.redirect('/');
	});
	
	router.get('/delete_request', function(req, res) {
		console.log("idiots")
		console.log(req.query.name);
		var temp_arr=req.user.trade_requests;
		var i = temp_arr.indexOf(req.query.name);
		if(i != -1) {
			temp_arr.splice(i, 1);
		}
		user.findOne({ 'username' :  req.user.username }, 
                function(err, user) {
                	if (err) throw err;
              
                	user.trade_requests=temp_arr;
                	user.save();
                });
		res.redirect('/home');
	});
	
	router.get('/appr_request', function(req, res) {
		console.log("idiots")
		console.log(req.query.name);
		var temp_arr=req.user.trade_requests_to_user;
		var i = temp_arr.indexOf(req.query.name);
		if(i != -1) {
			temp_arr.splice(i, 1);
		}
		user.findOne({ 'username' :  req.user.username }, 
                function(err, user) {
                	if (err) throw err;
              
                	user.trade_requests_to_user=temp_arr;
                	user.save();
                });
		book.findOne({'name':req.query.name},function (err, kittens1) {
			if (err) throw err;
			kittens1.remove({}, function(){});
		}
		)
		res.redirect('/home');
	});
	
	router.post('/book_submit_', function(req, res) {
		
		var bookname=req.body.user_book;
		//book.remove({}, function(){});
		book.find({},function (err, kittens1) {
			if (err){console.log(err)};
			console.log("books");
			//console.log(kittens1)
		})
		
		
		
		books.search(bookname, function(error, results) {
		    if ( ! error ) {
		        console.log(results[0].title);
		        var title=results[0].title;
		        console.log(results[0].thumbnail);
		        var newbook=new book;
		        var title = title.replace("\'", "");
				newbook.name=title;
				newbook.url=results[0].thumbnail;
				newbook.user_submitted=req.user.username;
				newbook.save();
		        //res.render('home_2.jade',{ names: JSON.stringify(results[0].title),images: JSON.stringify(results[0].thumbnail), user: req.user});
		    } else {
		        console.log(error);
		    }
		});
		
		/*book.find({},function (err, kittens1) {
			//book.remove({}, function(){});
			if (err){console.log(err)};
			console.log("books");
			//console.log(kittens1)
			var uu=JSON.stringify(kittens1);
			//uu = uu.replace(/'/g, "");
			var bb=JSON.parse(uu);
			console.log(bb)
			//console.log(uu)*/
			res.redirect('/home');
		//})
		
	});
	router.get('/home', function(req, res) { //, 
		
		book.find({},function (err, kittens1) {
			//book.remove({}, function(){});
			if (err){console.log(err)};
			console.log("books");
			//console.log(kittens1)
			var uu=JSON.stringify(kittens1);
			//uu = uu.replace(/'/g, "");
			var bb=JSON.parse(uu);
			//console.log(bb)
			//console.log(req.isAuthenticated)
			if (req.isAuthenticated())
			{
			res.render('home_2.jade', {user: req.user, books:JSON.stringify(bb)});
			}
			else
			{
			res.render('home_2_no_login.jade', {books:JSON.stringify(bb)});
			}
		})
		
	});
	return router;
}





