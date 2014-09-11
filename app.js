var config = require("./config/config.js")
    , express = require('express')
	, app = express()
	, cons = require('consolidate')
	, MongoClient = require('mongodb').MongoClient
	, routes = require('./routes');

MongoClient.connect(config.dbUrl, function (err, db) {
	"use strict";
	if (err) throw err;

	//Register our template engine
	app.engine('html', cons.swig);
	app.set('view engine', 'html');
	app.set('views', __dirname + '/views');
	
	// Express middleware to populate 'req.cookies' so we can access cookies
	app.use(express.cookieParser());

	// Express middleware to populate 'req.body' so we can access POST variables
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
	// Application routes
	routes(app, db);

	app.listen(config.webPort, function () {
		console.log('Express server listening on port 8082');
	});
	
})