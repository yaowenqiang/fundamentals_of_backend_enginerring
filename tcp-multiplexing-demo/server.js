const net = require('net');

// TCP Demultiplexing Demo
// 展示服务器如何通过端口号将数据分发到不同的应用进程

// 服务 1: HTTP 服务 (端口 3000)
const httpServer = net.createServer((socket) => {
  console.log(`[HTTP] Client connected from ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('data', (data) => {
    console.log(`[HTTP] Received: ${data.toString()}`);
    socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nHello from HTTP Server!');
    socket.end();
  });

  socket.on('end', () => {
    console.log('[HTTP] Client disconnected');
  });
});

// 服务 2: Chat 服务 (端口 3001)
const chatServer = net.createServer((socket) => {
  console.log(`[CHAT] Client connected from ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('data', (data) => {
    const message = data.toString().trim();
    console.log(`[CHAT] Message: ${message}`);
    socket.write(`Echo: ${message}`);
  });

  socket.on('end', () => {
    console.log('[CHAT] Client disconnected');
  });
});

// 服务 3: Data Transfer 服务 (端口 3002)
const dataServer = net.createServer((socket) => {
  console.log(`[DATA] Client connected from ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('data', (data) => {
    console.log(`[DATA] Received ${data.length} bytes`);
    socket.write(`ACK: Received ${data.length} bytes`);
  });

  socket.on('end', () => {
    console.log('[DATA] Client disconnected');
  });
});

// 启动所有服务
console.log('=== TCP Demultiplexing Demo ===\n');
console.log('Starting multiple services on different ports...');
console.log('This demonstrates how TCP uses port numbers to demultiplex\n');

httpServer.listen(3000, '127.0.0.1', () => {
  console.log('✓ HTTP Server listening on port 3000');
});

chatServer.listen(3001, '127.0.0.1', () => {
  console.log('✓ Chat Server listening on port 3001');
});

dataServer.listen(3002, '127.0.0.1', () => {
  console.log('✓ Data Server listening on port 3002');
  console.log('\nAll servers ready! Run clients in separate terminals.');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n\nShutting down all servers...');
  httpServer.close();
  chatServer.close();
  dataServer.close();
  process.exit(0);
});
