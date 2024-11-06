var http = require('http');
var server = http.createServer(function(req, res) {
    if (req.url.endsWith("cool")) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        var response = "yo whats good guys!!!";
        res.end(response);
    }
});
server.listen();