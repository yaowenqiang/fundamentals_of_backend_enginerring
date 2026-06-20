/* client code(in browser console)
let sse = new EventSource('http://localhost:8080/stream');
sse.onmessage = console.log

*/

const app = require('express')();
app.get('/',(req,res) => res.send('Hello!'));

app.get('/stream', (req,res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  send(res);
})

const port = process.env.PORT || 8080;
let i = 0;
function send(res) {
  res.write(`data: ` + `Hello from server ---- [${i++}]\n\n`);
  setTimeout(() => {
    send(res)
  }, 1000);
}


app.listen(port);
console.log(`listen to ${port}`);
