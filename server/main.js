

var express = require('express');
var app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server)
	, mongoose = require('mongoose/')
	, database = mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/hackathon', function(err) { if(err) throw err; })
    , socketAPI = require('./socketAPI')
    , Modules = require('./modules');

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    
    // Loads the custom modules
    var modules = new Modules();
    
    modules.route(app);

    //Configures the application
    require('./config.js')(app);
    io.configure(function () { 
        io.set('log level', 1);
        io.set("transports", ["xhr-polling"]); 
        io.set("polling duration", 10); 
    });
    
    socketAPI(io, modules);


    server.listen(app.get('port'), function() {
        console.log("server running and listening in on port "+app.get('port'));
    });

});