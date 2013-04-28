

var express = require('express');
var app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server)
	, mongoose = require('mongoose/')
	, database = mongoose.connect('mongodb://localhost/hackathon', function(err) { if(err) throw err; })
    , socketAPI = require('./socketAPI');

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Sucessfully connected to base');

     var WidgetSchema = require('./schemas/widget')(mongoose);
     var WidgetModel = mongoose.model('widgets', WidgetSchema);

    // var myWidget = new WidgetModel({name: "My uber widget"});

    // myWidget.save(function(err) {
    // 	if(err) throw err;
    // 	console.log("Widget saved");
    // });

    // WidgetModel.find(null, function(err, data) {
    // 	console.log(err);
    // 	console.log("-->"+data);
    // });

    // Loads the custom modules
    require('./modules.js')(app);

    //Configures the application
    require('./config.js')(app);

    socketAPI(io);

    var events = require ('./events.js')(io, WidgetModel);
    console.log('will create test widget')
    var thisisatest = {
        width:100,
        height:100,
        x:100,
        y:100,
        cid:2,
        data:'GROSSES FESSES'
    }
    var test2 = {
        width:100,
        height:100,
        x:300,
        y:300,
        cid:5,
        data:'FUCKING TEST'
    }
    thisisatest.id = events.create(thisisatest);
    test2.id = events.create(test2);
    thisisatest.x=200;
    events.update(thisisatest);
    /*

    API calls :

    GET 	/widgets/get/all
    GET 	/widgets/get/:id
    POST 	/widgets/new/
    PUT 	/widgets/setPosition/:x/:y
    PUT 	/widgets/setAttribute/:attribute/:value
    DELETE 	/widgets/delete/:id
    */


    server.listen(app.get('port'), function() {
        console.log("server running and listening in on port "+app.get('port'));
    });




});
mongoose.connection.close();