/*
Chat application for @node.js
express version.
*/

//Load modules.
var express = require('express'),
	socket = require('socket.io'),
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

app.get('/', function(request, response)
{
	fs.readFile('./views/index.html', function(error, data)
	{
		if(error)
		{
			response.send('View cannot be rendered.');
		}

		response.type('html');
		response.send(data);
	});
});

//Run the app.
app.listen(port);