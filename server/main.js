

var express = require('express');
var app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server);
    

//Configures the application
require('./config.js')(app);

server.listen(app.get('port'), function() {
	console.log("server running and listening in on port "+app.get('port'));
});