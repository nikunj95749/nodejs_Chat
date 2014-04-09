/*
Chat application for @node.js
*/

//Load modules.
var http = require('http'),
	fs = require('fs'),
	io = require('socket.io'),
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
io.sockets.on('connection', function(socket)
{
	//Send message whenever the server gets data
	socket.on('message_to_server', function(data)
	{
		io.sockets.emit('message_to_client', {message: data['message']});
	});

	//Send disconnection message whenever someone gets out.
	socket.on('disconnect', function()
	{
		io.sockets.emit('message_to_client', {message: 'user disconnected/timeout'});
	});
});

console.log('Server started.');