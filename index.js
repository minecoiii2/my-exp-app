const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const pass = "BONJOUR"

var server = http.createServer(function (req, res) {
    var parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname.slice(1);
    const contentTypeHeader = req.headers["content-type"] || 'text/plain';
    const [contentType, contentExt] = contentTypeHeader.split("/")

    function respond(code, content) {
        res.writeHead(code, {'Content-Type': 'text/plain'})
        res.end(content || code.toString())
    }

    if (pathname === 'status') {
        respond(200, 'All good\n\nv3')

    } else if (pathname === "wwcopy") {
        if (req.headers["auth"] !== pass) {respond(400, 'p'); return}
        if (req.method !== 'POST') {respond(400); return}

        const base64encoded = req.headers["base64"] === contentType

        fs.writeFile(
            path.join(__dirname, "copy.json"),
            JSON.stringify({
                ext: contentExt,
                type: contentType,
                base64: base64encoded,
            }),
            (err) => {
                if (err) {
                    respond(500, err)
                }
            }
        );

        const fileStream = fs.createWriteStream(
            path.join(__dirname, "copy.any")
        );

        if (base64encoded) {
            let data = '';

            req.on('data', (chunk) => {
                data += chunk;
            });
            
            req.on('end', () => {
                fileStream.write(atob(data), () => {
                    fileStream.end();
                });
            });
    
            req.on('error', (err) => {
                respond(500, err);
            });
        } else {
            req.pipe(fileStream);
        }

        fileStream.on("finish", () => {
            respond(200)
        })

        fileStream.on("error", () => {
            respond(500)
        })
       
    } else if (pathname == "wwpaste") {
        if (req.headers["auth"] !== pass) {respond(400, 'p'); return}
        const specsFilePath = path.join(__dirname, "copy.json")
        if (!fs.existsSync(specsFilePath)) {respond(404); return}

        fs.readFile(specsFilePath, 'utf-8', (err, data) => {
            if (err) {
                respond(500, err);
                return;
            }

            try {
                const jsonData = JSON.parse(data)
                const filePath = path.join(__dirname, "copy.any")

                if (!fs.existsSync(filePath)) {respond(404, '2'); return}

                res.writeHead(200, {"Content-Type": jsonData["type"] + "/" + jsonData["ext"]})
                fs.createReadStream(filePath).pipe(res)

            } catch (err) {
                respond(500, 'json err ' + err)
                return;
            }
        })

    } else if (pathname === '6611111010610611111711451515064646464') {
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
                        respond(400, 'b')
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
                        respond(500, err)
                    });

                    // Send the body content
                    webhookReq.write(JSON.stringify({ content }));
                    webhookReq.end();
                } catch (err) {
                    console.error(err);
                    respond(400, err)
                }
            });
        } else {
            respond(405, 'leave this url alone')
        }
    } else {
        respond(404)
    }
});

server.listen(80, function () {
    console.log('Server is on port 80');
});
