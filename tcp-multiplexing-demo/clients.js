const net = require('net');

// TCP Multiplexing Demo
// 展示多个客户端如何同时通过同一个网络接口发送数据到不同的服务器

class TCPClient {
  constructor(name, port, host = '127.0.0.1') {
    this.name = name;
    this.port = port;
    this.host = host;
    this.socket = null;
  }

  connect() {
    this.socket = net.createConnection(this.port, this.host, () => {
      console.log(`[${this.name}] Connected to ${this.host}:${this.port}`);
    });

    this.socket.on('data', (data) => {
      console.log(`[${this.name}] Response: ${data.toString()}`);
    });

    this.socket.on('end', () => {
      console.log(`[${this.name}] Connection ended`);
    });

    this.socket.on('error', (err) => {
      console.error(`[${this.name}] Error: ${err.message}`);
    });

    return this;
  }

  send(message) {
    if (this.socket) {
      console.log(`[${this.name}] Sending: ${message}`);
      this.socket.write(message);
    }
    return this;
  }

  disconnect() {
    if (this.socket) {
      this.socket.end();
      console.log(`[${this.name}] Disconnected`);
    }
    return this;
  }
}

// 演示：多个客户端同时连接到不同的服务
console.log('=== TCP Multiplexing Demo ===\n');
console.log('Multiple clients sending data through the same network interface...\n');

// 创建多个客户端
const httpClient = new TCPClient('HTTP-Client', 3000);
const chatClient = new TCPClient('Chat-Client', 3001);
const dataClient = new TCPClient('Data-Client', 3002);

// 连接所有客户端
httpClient.connect();
chatClient.connect();
dataClient.connect();

// 模拟并发发送数据
setTimeout(() => {
  console.log('\n--- Sending data concurrently ---\n');

  httpClient.send('GET / HTTP/1.1\r\n\r\n');
  chatClient.send('Hello everyone! This is multiplexing in action!');
  dataClient.send('Binary data payload: 0x12345678');

}, 1000);

// 在更晚的时间发送更多数据
setTimeout(() => {
  console.log('\n--- Sending more data ---\n');

  chatClient.send('Another message while other connections are active');
  dataClient.send('Additional data packet');

}, 2000);

// 断开连接
setTimeout(() => {
  console.log('\n--- Disconnecting clients ---\n');

  httpClient.disconnect();
  chatClient.disconnect();
  dataClient.disconnect();

  setTimeout(() => {
    console.log('\nDemo completed!');
    process.exit(0);
  }, 500);

}, 3000);
