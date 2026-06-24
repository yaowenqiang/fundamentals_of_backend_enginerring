const dgram = require('dgram');

const socket = dgram.createSocket('udp4');

socket.on('error', (err) => {
  console.error(`Server error:\n${err.stack}`);
  socket.close();
});

socket.on('message', (msg, info) => {
  console.log(`Server got: "${msg}" from ${info.address}:${info.port}`);
});

socket.on('listening', () => {
  const address = socket.address();
  console.log(`Server listening ${address.address}:${address.port}`);
});

socket.bind(5500, '127.0.0.1');
