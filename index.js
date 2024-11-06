const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

var server = http.createServer(function(req, res) {
    var parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname
    
    if (pathname === '/status') {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("all good brotha");
    } else if (pathname === '/coolazoid.sh') {

        fs.readFile('/home/minehzlk/coolazoid.sh', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
           
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('File Not Found')
    }
});

// Listen on port 80 for production
server.listen(80, function() {
    console.log('Server is listening on port 80');
});
