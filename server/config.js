/*
    Configures the server
*/

var express = require('express');

module.exports = function(app){

    //Getting port from environment, defaults to 5000
    var port = process.env.PORT || 5000;
    app.set('port', port);
    
    //Setting log level for development
    app.configure('development', function(){
        app.use(express.logger('dev'));
    });

    //Express configuration
    app.configure(function(){
        
        app.use(express.bodyParser());
        app.use(express.cookieParser(process.env.COOKIE_SECRET || "omgwtfbbq"));
        app.use(express.cookieSession());
        app.use(app.router);
        app.use(express.static(__dirname + '/../www'));
        
        //This allows modules to link local files like images or templates
        app.use(express.static(__dirname + '/../modules')); 
        
    });
};
