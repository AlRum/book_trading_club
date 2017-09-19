var express = require('express');
var router = express.Router();
var Poll2= require('../models/poll2');
var place= require('../models/place');
var user_loc= require('../models/user_loc');
var request = require('request');


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
		res.render('index.jade', { message: req.flash('message') });
	});
	
	

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home_',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register.jade',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		console.log('idiots')
				//, {arr: JSON.stringify([{'idiot':'idiot'}, {'fool':'fool'}])})//{arr:JSON.stringify([{idiot:"idiot"}])});
				user_loc.find({"username":req.user.username},function (err, kittens) {
					if (err){}
					console.log(kittens.length)
					if (kittens.length==0){
					var testuser = new user_loc;
					testuser.username=req.user.username;
					testuser.save(function (err) {
						if (err) {
    						console.log(err);
						} else {
    						console.log('submitted');
						}
					});
					console.log(req.user.username)
					console.log("good")
					}
											
		//res.render('home.jade', { user: req.user, arr: JSON.stringify(names) });
		res.render('home.jade', { user: req.user });
	});
	})

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
	
	router.get('/displaypoll', function(req, res) {
		var pollname=req.query.name;
		/*Poll2.find({"pollname": ''}).remove(function(err,kittes){
			if (err) return console.error(err)	;
			console.log('deleted')})*/
		Poll2.findOne({"pollname":pollname},function (err, kittens) {
			if (err) return console.error(err);
				console.log(JSON.stringify(kittens.author))
				if (req.user) {
					if (req.user.username==kittens.author){
    				res.render('display_poll_logged_in.jade', {arr: JSON.stringify(kittens), name:req.query.name})// logged in
					} else
					{res.render('display_poll_logged_in_no_delete.jade', {arr: JSON.stringify(kittens), name:req.query.name})}
						} else {
					res.render('display_poll.jade', {arr: JSON.stringify(kittens), name:req.query.name})
    					// not logged in
						}
				
		//res.render('display_poll.jade', { name: pollname });
	})});
	
	
	router.get('/deletepoll', function(req, res) {
		var pollname=req.query.name;
		Poll2.find({"pollname": pollname}).remove(function(err,kittes){
			if (err) return console.error(err)	;
			console.log('deleted')
			console.log(req.user.username)
			res.redirect('/home')}
		//res.render('display_poll.jade', { name: pollname });
	)});
	
	
	router.post('/newpoll', function(req, res) {
		console.log(req.body.opt_number);
		res.render('newpoll.jade', { num: req.body.opt_number, name: req.body.pollname , author: req.body.author });
	});
	
	router.post('/update_poll', function(req, res) {
		console.log(req.body.opts);
		console.log(req.body);
		var pollname=req.query.name;
		Poll2.findOne({"pollname":req.body.pollname},function (err, kittens) {
			if (err) return console.error(err);
			/*for (var i=0;i<kittens.length;i++){
				if (kittens[i].name==req.body.opts){
					kittens[i].votes==kittens[i].votes+1
				}
			}*/
				//kittens.opts[1].votes=2;
				var u =kittens.opts;
				for (var i=0;i<u.length;i++){
					if (u[i].name==req.body.opts){
						u[i].votes=u[i].votes+1
				}}
				kittens.total_votes=kittens.total_votes+1;
				//kittens.opts=['idiots','idiots','idiots'];
				//kittens.pollname='@@@';
				console.log(u);
				//console.log(req.body.opts);
				//console.log(req.body.opts==u[1].name);
				kittens.opts=[];
				kittens.opts=u;
				console.log("opts")
				console.log("opts")
				console.log('/displaypoll?name='+req.body.pollname)
				kittens.save(function (err) {
        if(err) {
            console.error('ERROR!');
        }
		
		//res.render('newpoll.jade', { num: req.body.opt_number, name: req.pollname });
	})
	
	res.redirect('/displaypoll?name='+req.body.pollname)})
	})
	
	router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/home');
	});
	
	router.post('/location_submit_', function(req, res) {
		//ideal place to handle the request ?
		
		
		
		
		/*Poll2.remove({"pollname":"idiots"},function (err, kittens) {
			if (err) return console.error(err);
				
				//console.log(kittens);
											})*/
		var testpoll = new Poll2
		user_loc.findOne({"username":req.user.username},function (err, kittens) {
					if (err){}
					kittens.location=req.body.user_location;
		
					console.log(kittens)
					kittens.save(function (err) {
        if(err) {
            console.error('ERROR!');
        }
		
		//res.render('newpoll.jade', { num: req.body.opt_number, name: req.pollname });
	})}
	);
		var u=req.body.user_location;
		console.log(u)
		
		var options = {
			url: 'https://api.yelp.com/v3/businesses/search?location='+u+'&term=bars&limit=10',
			headers: {
			 'Authorization': 'Bearer b_r3MK0t7GU_ObYe3yZaEnBfEoU7eJF-W0jj8ovwwN1G1ddJrdMX6EeQQjhnCNNyBJ13bBuO2iiM71NXW0Ib38ooyXCG0EHlzvM-ZTsKm98zS1YikUnc_8-gWMs5WXYx'
			}
			};
			var names=[];
			var pictures=[];
			var idiots
			var k=0;
			request.get(options, function(err,httpResponse,body)
			{ if (err) {console.log('idiot')} 
			var obj=JSON.parse(httpResponse.body);
			for (var i=0;i<5;i++){
			//console.log(obj.businesses[i]);
			var pl = new place;
			pl.name=obj.businesses[i].name;
			pl.photo=obj.businesses[i].image_url;
			pl.people_going=0;
			pl.names_going=[];
			pl.location=u;
			names[i]=obj.businesses[i].name;
			pictures[i]=obj.businesses[i].image_url;
			pl.save(function (err) {
			if (err) {
    			console.log(err);
					} else {
    			console.log('submitted');
						}
					});
			k++;
			}
			
			idiots=obj;
			//res.render('home_2.jade', { names: JSON.stringify(names),images: JSON.stringify(pictures), user: req.user});
			res.redirect('/home_');
		
			})
		console.log(req.user);
		console.log('111');
		console.log(names);
		console.log(k);
		console.log('333');
		//res.redirect('/home');
		//res.render('home_2.jade', { names: JSON.stringify(names), user: req.user});
		
	
			
		
	});
	
	
	router.get('/location_submit', function(req, res) {
		//ideal place to handle the request ?
		
		
		
		
		/*Poll2.remove({"pollname":"idiots"},function (err, kittens) {
			if (err) return console.error(err);
				
				//console.log(kittens);
											})*/
		var testpoll = new Poll2
		
			user_loc.findOne({"username":req.user.username},function (err, kittens) {
					if (err){}
			var u=kittens.location;					
					var options = {
			url: 'https://api.yelp.com/v3/businesses/search?location='+u+'&term=bars&limit=10',
			headers: {
			 'Authorization': 'Bearer b_r3MK0t7GU_ObYe3yZaEnBfEoU7eJF-W0jj8ovwwN1G1ddJrdMX6EeQQjhnCNNyBJ13bBuO2iiM71NXW0Ib38ooyXCG0EHlzvM-ZTsKm98zS1YikUnc_8-gWMs5WXYx'
			}
			};
			var names=[];
			var pictures=[];
			var idiots
			var k=0;
			request.get(options, function(err,httpResponse,body)
			{ if (err) {console.log('idiot')} 
			var obj=JSON.parse(httpResponse.body);
			for (var i=0;i<5;i++){
			//console.log(obj.businesses[i]);
			names[i]=obj.businesses[i].name;
			pictures[i]=obj.businesses[i].image_url;
			k++;
			}
			
			idiots=obj;
			res.render('home_2.jade', { names: JSON.stringify(names),images: JSON.stringify(pictures), user: req.user});
		
			})
					
					}
	);
		
		
		
	
			
		
	});
	
	
	
	
	
	
	
	router.get('/home_', function(req, res) {
		//ideal place to handle the request ?
		
		
		
		
		/*Poll2.remove({"pollname":"idiots"},function (err, kittens) {
			if (err) return console.error(err);
				
				//console.log(kittens);
											})*/
		var testpoll = new Poll2
		
			user_loc.findOne({"username":req.user.username},function (err, kittens) {
					if (err){}
			var u=kittens.location;					
					var options = {
			url: 'https://api.yelp.com/v3/businesses/search?location='+u+'&term=bars&limit=10',
			headers: {
			 'Authorization': 'Bearer b_r3MK0t7GU_ObYe3yZaEnBfEoU7eJF-W0jj8ovwwN1G1ddJrdMX6EeQQjhnCNNyBJ13bBuO2iiM71NXW0Ib38ooyXCG0EHlzvM-ZTsKm98zS1YikUnc_8-gWMs5WXYx'
			}
			};
			var uname=req.user.username
			var names=[];
			var pictures=[];
			var going=[];
			var user_go=[];
			var idiots
			var k=0;
			
			//console.log(u);
			place.find({"location":u},function (err, kittens) {
					if (err){
					}
				//console.log(kittens);
				for (var i=0;i<5;i++){
			//console.log(obj.businesses[i]);
			names[i]=kittens[i].name;
			pictures[i]=kittens[i].photo;
			going[i]=kittens[i].people_going;
			
			
			if (kittens[i].names_going.indexOf(uname)==-1){ 	
				user_go[i]=0;
				}
				
			else user_go[i]=1
			
			
			
			}
			res.render('home_2.jade', { names: JSON.stringify(names),images: JSON.stringify(pictures),people:JSON.stringify(going), user: req.user, user_go: JSON.stringify(user_go)});
			});
			
			
			//idiots=obj;
			//res.render('home_2.jade', { names: JSON.stringify(names),images: JSON.stringify(pictures), user: req.user});
		
			
					
					}
	);
	
		
		
		
	
			
		
	});
	
	
	router.post('/update_go', function(req, res) {
		var uname=req.user.username
		console.log(req.body);
		console.log(req.user.username);
		var locname=req.body.go;
		place.findOne({"name":locname},function (err, kittens) {
			if (err) return console.error(err);
			
				if (kittens.names_going.indexOf(uname)==-1){ 	
				kittens.people_going=kittens.people_going+1;
				kittens.names_going.push(uname);
				}
				console.log(kittens);
				
				kittens.save(function (err) {
        if(err) {
            console.error('ERROR!');
        }})
		
	
	
	
	res.redirect('/home_')})})
	
	router.post('/dont_go', function(req, res) {
		var uname=req.user.username
		console.log(req.body);
		console.log(req.user.username);
		console.log('idiots');
		var locname=req.body.go;
		place.findOne({"name":locname},function (err, kittens) {
			if (err) return console.error(err);
			
				if (kittens.names_going.indexOf(uname)!=-1){ 	
				kittens.people_going=kittens.people_going-1;
				kittens.names_going.splice(kittens.names_going.indexOf(uname), 1);
				}
				console.log(kittens.people_going);
				console.log('idiots');
				kittens.save(function (err) {
        if(err) {
            console.error('ERROR!');
        }})
		
	
	
	
	res.redirect('/home_')})})
	

	return router;
}





