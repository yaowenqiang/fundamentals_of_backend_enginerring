const https = require('node:https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('certificate.pem')
};

const server = https.createServer(options, (req, res) => {
  res.writeHead(200, {'Content-Type':'text/plain'});
  res.end('Hello, on HTTPS\n');
})

server.listen(8443, () => {
  console.log("HTTPS server is running on http://localhost:8443");
})
