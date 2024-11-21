const http = require('http');
const url = require('url');

var server = http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    if (pathname === '/status') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end("Everything is good");
    } else if (pathname === '/6611111010610611111711451515064646464') {
        if (req.method === 'POST') {
            let body = '';
            
            // Collect the request body data
            req.on('data', chunk => {
                body += chunk.toString();
            });

            req.on('end', () => {
                try {
                    // Parse the body as JSON
                    const parsedBody = JSON.parse(body);
                    const webhookUrl = parsedBody.url; // The URL parameter from the body
                    const content = parsedBody.content; // The content to send to the webhook

                    if (!webhookUrl || !content) {
                        res.writeHead(400, { 'Content-Type': 'text/plain' });
                        res.end('Bad Request: Missing URL or content in the body.');
                        return;
                    }

                    // Send POST request to the webhook
                    const webhookReq = require(webhookUrl.startsWith('https') ? 'https' : 'http').request(
                        webhookUrl,
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        },
                        webhookRes => {
                            let responseData = '';
                            webhookRes.on('data', chunk => {
                                responseData += chunk.toString();
                            });

                            webhookRes.on('end', () => {
                                res.writeHead(webhookRes.statusCode, { 'Content-Type': 'application/json' });
                                res.end(responseData);
                            });
                        }
                    );

                    webhookReq.on('error', err => {
                        console.error(err);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Failed to forward the request.');
                    });

                    // Send the body content
                    webhookReq.write(JSON.stringify({ content }));
                    webhookReq.end();
                } catch (err) {
                    console.error(err);
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Bad Request: Invalid JSON body.');
                }
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed: Only POST is supported.');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(pathname);
    }
});

server.listen(80, function () {
    console.log('Server is on port 80');
});
