

var express = require('express');
var app = express()
	, http = require('http')
	, server = http.createServer(app)
	, io = require('socket.io').listen(server)
	, mongoose = require('mongoose/')
	, database = mongoose.connect('mongodb://localhost/hackathon', function(err) { if(err) throw err; })
	;

// var WidgetSchema = new mongoose.Schema({
// 	name: String
// });
// var WidgetModel = mongoose.model('widgets', WidgetSchema);

// var myWidget = new WidgetModel({name: "My uber widget"});

// myWidget.save(function(err) { 
// 	if(err) throw err;
// 	console.log("Widget saved");
// });

// WidgetModel.find(null, function(err, data) {
// 	console.log(err);
// 	console.log("-->"+data);
// });

//Configures the application
require('./config.js')(app);

app.get('/', function(req, res) {

})

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

mongoose.connection.close();