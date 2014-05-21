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
	if(app.get('env') == 'development')
	{
		console.log('%s %s', request.method, request.url);
		console.log('connection from: ' + request.ip);
	}
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

var guest = 0;
var users = [];

//When socket connects.
io.sockets.on('connection', function(socket)
{
	//Set Guest for the session.
	socket.set('username', 'guest' + guest, function()
	{
		guest++;
		var current = 'guest' + guest;

		users.push('guest' + guest);

		//Send the users connected.
		io.sockets.emit('users', 
		{
			users: li(users)
		});

		//When a message from the browser is recieved.
		socket.on('Message_send', function(data)
		{

			//Escape all html tags.
			var username = escape_html(data['username']),
				message = escape_html(data['message']);

			//Rename the guest for the username.
			socket.set('username', username, function()
			{
				var index = users.indexOf(current);
				users[index] = username;

				guest --;

				//Emit the message.
				io.sockets.emit('Message_respond',
				{
					user: username,
					message: message
				});

				//Send the users connected.
				io.sockets.emit('users',
				{
					users: li(users)
				});
			});
		});
	});

	//On disconnect/timeout.
	socket.on('disconnect', function()
	{
		//Get the user disconnected.
		socket.get('username', function(error, data)
		{
			var index = users.indexOf(data);
			users.splice(index,1);

			io.sockets.emit('users',
			{
				users: li(users)
			});
		});
	});
});

//Transform all array to <li>tags.
function li(array)
{
	var length = array.length,
		result = '';

	for (var i = 0; i < length; i++)
	{
		result += '<li>' + array[i] + '</li>';
	}

	return result;
}