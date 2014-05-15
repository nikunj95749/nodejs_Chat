/*
Chat application for @node.js
express version.
*/

//Load modules.
var express = require('express'),
	server = require('http'),
	io = require('socket.io'),
	swig = require('swig'),
	escape_html = require('escape-html'),
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


//Global vars
var Title = "Node.js Chat";

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

swig.setDefaults(
{
	cache: false
});

app.get('/', function(request, response)
{
	response.render('index',
	{
		'Title': Title
	});
});

//logger.
app.use(function(request, response, next)
{
	console.log('%s %s', request.method, request.url);

	console.log('connection from: ' + request.ip);

	var file = request.url.slice(1 + request.url.indexOf('/'));

	next();
});

//Set directory for static files (css, js, img)
app.use(express.static(__dirname + '/public'));

//Run the app.
var server = server.createServer(app).listen(port);
server;

//Run the socket.
var io = io.listen(server);
io.set('log', 0);

io.sockets.on('connection', function(socket)
{
	socket.on('Message_send', function(data)
	{
		var username = escape_html(data['username']),
			message = escape_html(data['message']);

		io.sockets.emit('Message_respond',
		{
			user: username,
			message: message
		});
	});
});