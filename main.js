/*
Chat application for @node.js
*/

//Load modules.
var http = require('http'),
	fs = require('fs'),
	io = require('socket.io'),
	escape_html = require('escape-html'),
	resolve_request = require('./bin/ResolveRequest');

console.log('Loading configuration.');
var config = fs.readFileSync('./config.json');
var config = JSON.parse(config);
var port = config.port;
var dir = config.public_dir;
var resolveRequest = resolve_request.resolveRequest;
console.log('Configuration loaded');

var server = http.createServer(function(request, response)
{	
	if(request.url.lastIndexOf('.') == -1)
	{
		console.log('Requested: ' + request.url);
	}

	resolveRequest(request, response, dir);
});

server.listen(port);
var io = io.listen(server);
io.set('log', 0);

//Initiates the socket
var socket = io.sockets.on('connection', function(socket)
{
	//Send message whenever the server gets data
	socket.on('message_to_server', function(data)
	{
		//Escape html tags.
		var msg = escape_html(data['message']);

		io.sockets.emit('message_to_client',
		{
			message: msg
		});
	});

	//Send disconnection message whenever someone gets out.
	socket.on('disconnect', function()
	{
		io.sockets.emit('message_to_client',
		{
			message: 'user disconnected/timeout'
		});
	});
});

socket;

console.log('Server started.');

//Restart server whenever there's a change in the file.
fs.watchFile('main.js', function(current, previous)
{
	server.close();
	server.listen(port);
	console.log('Server listening to : ' + port);
});


//Restart server whenever there's a change in the config file.
fs.watchFile('config.json', function(current, previous)
{
	server.close();

	//Reload configuration file.
	config = fs.readFileSync('config.json');
	config = JSON.parse(config);
	port = config.port;
	dir = config.public_dir;

	server.listen(port);
	socket;
	console.log('Server listening to : ' + port);

});