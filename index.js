var http = require('http');
var url = require('url');

var server = http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url, true);  // Parse the URL of the request
    
    // Check if the requested path is '/cool'
    if (parsedUrl.pathname === '/cool') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var message = 'It yay!\n',
            version = 'NodeJS ' + process.versions.node + '\n',
            response = [message, version].join('\n');
        res.end(response);
    } else {
        // If the path is not '/cool', respond with a 404 error
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('404 Not Found');
    }
});

// Listen on port 80 for production
server.listen(80, function() {
    console.log('Server is listening on port 80');
});
