/*
*	Database function for Node.js Chat.
*	Function usage:
*	@register(username, password, function(error, data)).
*	@findByName(username, function(error, data)).
*/

//Load mongodb driver module.
var mongoose = require('mongoose');

//User Schema
var userSchema = mongoose.Schema(
{
	username: String,
	password: String
});

//User model.
var UserModel = mongoose.model('User', userSchema);

//Create a function for registering.
function register(Username, Password, callback)
{	
	//find if username exists.
	UserModel.findOne({username: Username}, function(error, data)
	{
		//error handler.
		if(error)
			return callback(error);

		//if username exists, throw message.
		if(data)
		{
			return callback(null, 'User already exist');

			mongoose.connection.close();
		}

		//proceed to register if username doesn't exist.
		if(!data)
		{
			var user = new UserModel(
			{
				username: Username,
				password: Password
			});

			//save the user to database.
			user.save(function(error)
			{
				if(error)
					callback(error);

				callback(null, 'Success');
				mongoose.connection.close();
			});
		}
	});
}

//Create a function for finding a name record.
function findByName(Username, callback)
{
	//find the record
	UserModel.findOne({username: Username}, function(error, data)
	{
		if(error)
			return callback(error);

		//give data record if found.
		callback(null, data);
		mongoose.connection.close();
	});
}

//To public functions.
exports.register = register;
exports.findByName = findByName;