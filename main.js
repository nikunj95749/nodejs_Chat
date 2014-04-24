/*
Chat application for @node.js
express version.
*/

//Load modules.
var express = require('express'),
	http = require('http'),
	socket = require('socket.io'),
	bodyParser = require('body-parser'),
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

app.use(bodyParser());


//Global vars
var Title = "Node.js Chat";
var result = '';


app.engine('html', swig.renderFile);

//Set view engine.
app.set('view engine', 'html');

//Set the directory for views.
app.set('views', __dirname + '/views');

swig.setDefaults(
{
	cache: false
});

app.get('/', function(request, response)
{
	console.log('GET OK');
	response.render('index',
	{
		'Title': Title,
		'result': result,
	});
});

app.post('/', function(request, response)
{
	console.log('POST OK');
	console.log(request.body);

	response.render('index',
	{
		'Title': Title,
		'result': 'Post detected',
	});
});

//logger.
app.use(function(request, response, next)
{
	console.log('%s %s', request.method, request.url);

	var file = request.url.slice(1 + request.url.indexOf('/'));

	app.get(request.url, function(request, response)
	{
		response.render(file,
		{
			//Var to be named in the render : value;
			'Title': Title,
			'result': result,
		});
	});

	next();
});


//Set directory for static files (css, js, img)
app.use(express.static(__dirname + '/public'));

//Run the app.
http.createServer(app).listen(port, function()
{
	console.log('Server listening to ' + port);
});