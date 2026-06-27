const https = require('node:https');
const req = https.request('https://example.com', {'method':'GET'});

req.on('response', res => {
  console.log(res.headers);
  console.log(res.statusCode);

  res.setEncoding('utf-8');
  res.on('data', data => console.log('some data ' + data));
})

req.end();
let x = req.getHeaders();
console.log(x);
