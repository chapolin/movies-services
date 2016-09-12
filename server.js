var express = require('express'), fs = require("fs"), path = require("path"),
app = express(), port = process.env.PORT || 3000, mongo = null,
mongodb = require('mongodb'), MongoClient = mongodb.MongoClient, 
methodOverride = require('method-override'), 
bodyParser = require('body-parser'),
Redis = require("./libs/RedisCache").RedisCache,
routesPath = path.join(__dirname, "routes"), 
develop = process.env.DEVELOP == true, 
STRING_CONNECTION = "mongodb://localhost/kotaki",
redisProperties = null;

if(develop) {
	STRING_CONNECTION = "mongodb://movies:moviespapass@ds029466.mlab.com:29466/heroku_s999z320";
}

// Connect to the DB
MongoClient.connect(STRING_CONNECTION, function(err, db) {
	if(!err) {
		global.mongo = db;
		global.mongodb = mongodb;
		
		console.log("We are connected in mongodb :)");
	}
});

// Connection to Redis
if(!develop) {
	redisProperties = {
		port: 7429,
		host: "ec2-54-163-233-146.compute-1.amazonaws.com",
		password: "pbgmpbp29sm94n3r9h8mk47vmg5"
	};
}

Redis(redisProperties);

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));

// Comming up routes
fs.readdirSync(routesPath).forEach(function(file) {
  require(__dirname + "/routes/" + file)(app);
	
	console.log("Comming up %s routes...", file);
});

var server = app.listen(port, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log("Server started!");
});
