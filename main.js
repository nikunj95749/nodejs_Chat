/*
Chat application for @node.js
express version.
*/

//Load modules.
var express = require('express'),
	http = require('http'),
	socket = require('socket.io'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	swig = require('swig'),
	fs = require('fs'),
	database = require('./database');

//Load config.
console.log('Loading configuration.');
var config = fs.readFileSync('config.json');
var config = JSON.parse(config);
var port = config.port;
var Title = config.titl;
var views = config.views;
console.log('Configuration loaded.');

//Initiate express module in app.
var app = express();

app.use(bodyParser());
app.use(cookieParser());
app.use(session(
{
	secret: 'the user session',
	key: 'sid',
	cookie: 
	{
		maxAge: 60000,
		httpOnly: false
	}
}));


//Global vars
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
	if(app.get('env') == 'development')
	{
		console.log('GET OK');
	}

	var sess = request.session;

	if(sess.views)
		sess.views++;

	else
		sess.views = 1;

	console.log(sess);

	response.render('index',
	{
		'Title': Title,
		'result': result,
		'views': sess.views,
	});
});

app.post('/', function(request, response)
{
	if(app.get('env') == 'development')
	{
		console.log('POST OK');
	}
	mongoose.connect('mongodb://localhost');

	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback()
	{
		database.findByName(request.body.username.toLowerCase(), function(error, data)
		{
			if(error)
			{
				response.render('index',
				{
					'Title': Title,
					'result': 'Error, please try again later.'
				});
			}

			if(data)
			{
				if(!(request.body.username == data.username && request.body.password == data.password))
				{
					response.render('index',
					{
						'Title': Title,
						'result': 'username/password invalid.'
					});
				}

				else
				{
					response.render('index',
					{
						'Title': Title,
						'result': 'Log in success.'
					});
				}
			}

			response.render('index',
			{
				'Title': Title,
				'result': 'Not found'
			});
		});
	});	
});

app.post('/register', function(request, response)
{
	if(app.get('env') == 'development')
	{
		console.log('REGISTER OK');
	}	

	//set connection to mongodb.
	mongoose.connect('mongodb://localhost');

	var db = mongoose.connection;


	//Connect to mongodb.
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback()
	{
		database.register(request.body.username.toLowerCase(), request.body.password.toLowerCase(), function(error, result)
		{
			if(error)
			{
				response.render('register',
				{
					'Title': Title,
					'result': 'error registering, try again later.'
				});
			}

			response.render('register',
			{
				'Title': Title,
				'result': result
			});
		});

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

	var file = request.url.slice(1 + request.url.indexOf('/'));

	app.get(request.url, function(request, response)
	{
		response.render(file,
		{
			//Var to be named in the render : value;
			'Title': Title,
			'result': result
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

	if(app.get('env') == 'development')
	{
		console.log('Server runninng in development mode.');
	}
});