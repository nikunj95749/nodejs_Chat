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

//Create User schema.
var userSchema = mongoose.Schema(
{
	username: String,
	password: String
});

//User model.
var UserModel = mongoose.model('User', userSchema);

app.post('/', function(request, response)
{
	console.log('POST OK');
	// console.log(request.body);
	mongoose.connect('mongodb://localhost');

	var db = mongoose.connection;

	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback()
	{
		console.log('connection succeed.');
	});

	
	
});

app.post('/register', function(request, response)
{
	console.log('REGISTER OK');

	//set connection to mongodb.
	mongoose.connect('mongodb://localhost');

	var db = mongoose.connection;


	//Connect to mongodb.
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function callback()
	{

		UserModel.findOne({username: request.body.username}, function(error, data)
		{
			if(error)
				console.log(error);

			if(data)
			{
				response.render('register',
				{
					'Title': Title,
					'result': 'user found'
				});

				mongoose.connection.close();
			}

			if(!data)
			{
				var user = new UserModel(
				{
					username: request.body.username,
					password: request.body.password
				});

				
				user.save(function(error, data)
				{
					if(error)
					{
						console.log(error);
						response.render('register',
						{
							Title: Title,
							'result': 'Error registering.'
						});
					}

					response.render('register',
					{
						Title: Title,
						'result': request.body.username + ' registered successfully.'
					});
					mongoose.connection.close();
				});

			}
		});	

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