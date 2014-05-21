window.onload = init;
var socketio = io.connect(window.location.hostname);

socketio.on('Message_respond', function(data)
{
	var message_box = document.getElementById('message-box');

	message_box.innerHTML = message_box.innerHTML + '<br>' + '<pre><b>' + data['user'] + ':</b> ' + '<p>' + data['message'] + '</p></pre>';

	message_box.scrollTop = message_box.scrollHeight;
});

socketio.on('users', function(data)
{
	var users = document.getElementById('connect');

	users.innerHTML = data['users'];
});

socketio.on('user', function(data)
{
	var users = document.getElementById('connect');

});

function init()
{
	var message = document.getElementById('message');

	message.onsubmit = message_form;
}

function message_form()
{
	var username = document.getElementById('username').value,
		message = document.getElementById('usermessage').value;

	if(username != '')
	{
		if(message != '')
		{
			socketio.emit('Message_send',
			{
				'username': username,
				'message': message
			});
		}
		document.getElementById('usermessage').value = '';
	}

	else
		alert('You must set an username.');

	return false;
}