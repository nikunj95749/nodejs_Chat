// our socket.io code goes here
// console.log(document.URL);
var socketio = io.connect(window.location.hostname);

socketio.on('message_to_client', function(data)
{
	var chatlog = document.getElementById('chatlog');

	chatlog.innerHTML = chatlog.innerHTML + '<div><pre>' + data['message'] + '</pre></div>';

	chatlog.scrollTop = chatlog.scrollHeight;

	console.log(data);
});

window.onload = init;

function init()
{
	var chat = document.getElementById('chat_form');

	chat.onsubmit = send;
}

//Send the message to the socket.
function send()
{
	msg = document.getElementById('box_message').value;
	if(msg != '')
	{
		console.log(msg);
		socketio.emit('message_to_server', {message: msg});
	}

	document.getElementById('box_message').value = '';

	return false;
}
