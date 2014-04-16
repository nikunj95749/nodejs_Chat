/*
Chat application for @node.js
express version.
*/

//Load modules.
var express = require('express'),
	socket = require('socket.io'),
	swig = require('swig'),
	fs = require('fs');

//Load config.
console.log('Loading configuration.');
var config = fs.readFileSync('config.json');
var config = JSON.parse(config);
var port = config.port;
var views = config.views;
console.log('Configuration loaded.');

//Initiate express module in app.
var app = express();

// app.get('/', function(request, response)
// {
// 	fs.readFile('./views/index.html', function(error, data)
// 	{
// 		if(error)
// 		{
// 			response.send('View cannot be rendered.');
// 		}

// 		response.type('html');
// 		response.send(data);
// 	});
// });

var test = "Hello";

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// app.set('view cache', false);
swig.setDefaults(
{
	cache: false
});

app.get('/', function(request, response)
{
	response.render('index', 
	{
		//Var to be named in the render : value;
		'test': test
	});
});


//Run the app.
app.listen(port);