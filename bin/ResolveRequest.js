/*
*	This function needs data from the http.createServer(request, response, dir) to work.
*	#request is the request made from the client.
*	#response is the response sent from the server.
*	#dir is the main directory where the the file system is going to look for files.
*/

function resolveRequest(request, response, dir)
{
	if(request.url == '/')
	{
		request.url = request.url + 'index.html';
	}

	if(request.url.lastIndexOf('.') == -1)
	{
		request.url = request.url + '.html';
	}

	function resolveFile(file)
	{
		fs = require('fs');

		fs.readFile(dir + file, function(error, data)
		{
			if(error)
			{
				response.writeHead(404, {'Content-type': 'text/plain'});
				response.write("Sorry, Page couldn't load or wasn't found.");
				response.end();
			}

			else
			{
				if(file.indexOf('.css') != -1)
				{
					response.writeHead(200, {'Content-type': 'text/css'});
					response.write(data);
					response.end();
				}
				
				if(file.indexOf('.js') != -1)
				{
					response.writeHead(200, {'Content-Type': 'text/javascript'});
					response.write(data);
					response.end();
				}

				if(file.indexOf('.html') != -1)
				{
					response.writeHead(200, {'Content-type': 'text/html'});
					response.write(data);
					response.end();
				}
			}
		});
	}

	//console.log('ResolveRequest-debug: ' + dir + request.url);

	resolveFile(request.url);
}
exports.resolveRequest = resolveRequest;