const net = require('net');

// TCP 三次握手与四次挥手详细演示
// 展示完整的TCP状态转换过程

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║        TCP 三次握手与四次挥手详细演示                     ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// ==========================================
// 第一部分：三次握手演示
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【第一部分】TCP 三次握手 (Three-way Handshake)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('目的：建立可靠的 TCP 连接');
console.log('过程：');
console.log('  1. 客户端 → 服务器: SYN (同步序列号)');
console.log('  2. 服务器 → 客户端: SYN+ACK (同步+确认)');
console.log('  3. 客户端 → 服务器: ACK (确认)');
console.log('');

// 状态转换图
console.log('客户端状态转换:');
console.log('  CLOSED → SYN_SENT → ESTABLISHED');
console.log('');
console.log('服务器状态转换:');
console.log('  LISTEN → SYN_RECEIVED → ESTABLISHED');
console.log('');

// 三次握手详细演示
class HandshakeServer {
  constructor(port) {
    this.port = port;
    this.server = null;
    this.connections = 0;
  }

  start() {
    this.server = net.createServer((socket) => {
      this.connections++;
      const connNum = this.connections;
      const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;

      console.log(`【连接 #${connNum}】三次握手完成`);
      console.log(`├─ 服务器接受连接: ${clientInfo}`);
      console.log('├─ TCP 状态: ESTABLISHED (已建立连接)');
      console.log('└─ 可以开始数据传输\n');

      socket.on('data', (data) => {
        console.log(`【连接 #${connNum}】数据传输`);
        console.log(`├─ 收到: "${data.toString().trim()}"`);
        console.log('└─ 发送 ACK 确认\n');
        socket.write('ACK: ' + data);
      });

      socket.on('end', () => {
        console.log(`【连接 #${connNum}】四次挥手开始`);
        console.log('├─ 步骤 1: 客户端发送 FIN 包');
        console.log('├─ 步骤 2: 服务器发送 ACK 包');
        console.log('└─ 服务器状态: CLOSE_WAIT\n');
      });

      socket.on('close', () => {
        console.log(`【连接 #${connNum}】四次挥手完成`);
        console.log('├─ 步骤 3: 服务器发送 FIN 包');
        console.log('├─ 步骤 4: 客户端发送 ACK 包');
        console.log('└─ 连接状态: CLOSED\n');
      });
    });

    this.server.listen(this.port, '127.0.0.1', () => {
      console.log(`【服务器】启动成功，监听端口 ${this.port}`);
      console.log('└─ TCP 状态: LISTEN (等待连接)\n');
    });
  }

  close() {
    this.server.close();
  }
}

class HandshakeClient {
  constructor(id, port) {
    this.id = id;
    this.port = port;
    this.socket = null;
  }

  connect() {
    console.log(`【客户端 ${this.id}】开始连接...`);
    console.log('└─ 准备进行三次握手\n');

    this.socket = net.createConnection({
      host: '127.0.0.1',
      port: this.port
    }, () => {
      console.log(`【客户端 ${this.id}】三次握手完成`);
      console.log('├─ 步骤 1: 发送 SYN (SYN_SENT)');
      console.log('├─ 步骤 2: 接收 SYN+ACK (SYN_RECEIVED)');
      console.log('├─ 步骤 3: 发送 ACK (ESTABLISHED)');
      console.log('└─ 连接建立成功\n');
    });

    this.socket.on('data', (data) => {
      console.log(`【客户端 ${this.id}】收到响应`);
      console.log(`└─ "${data.toString().trim()}"\n`);
    });

    this.socket.on('end', () => {
      console.log(`【客户端 ${this.id}】收到服务器 FIN 包`);
      console.log('├─ 发送 ACK 确认');
      console.log('└─ 进入 TIME_WAIT 状态\n');
    });

    this.socket.on('close', () => {
      console.log(`【客户端 ${this.id}】连接关闭`);
      console.log('└─ TIME_WAIT 结束，连接完全关闭\n');
    });

    return this.socket;
  }

  send(message) {
    if (this.socket) {
      console.log(`【客户端 ${this.id}】发送数据`);
      console.log(`└─ "${message}"\n`);
      this.socket.write(message);
    }
  }

  disconnect() {
    if (this.socket) {
      console.log(`【客户端 ${this.id}】主动关闭连接`);
      console.log('└─ 发送 FIN 包，开始四次挥手\n');
      this.socket.end();
    }
  }
}

// ==========================================
// 运行演示
// ==========================================
async function runDetailedDemo() {
  const server = new HandshakeServer(9999);
  server.start();

  await sleep(1000);

  // 第一次握手演示
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【演示 1】基本的三次握手和四次挥手');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const client1 = new HandshakeClient('A', 9999);
  client1.connect();

  await sleep(1500);
  client1.send('Hello from Client A!');
  await sleep(1500);
  client1.disconnect();

  await sleep(2000);

  // 第二次握手演示
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【演示 2】多个客户端的三次握手');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const client2 = new HandshakeClient('B', 9999);
  const client3 = new HandshakeClient('C', 9999);

  client2.connect();
  await sleep(500);
  client3.connect();

  await sleep(1500);
  client2.send('Hello from Client B!');
  client3.send('Hello from Client C!');

  await sleep(1500);
  client2.disconnect();
  await sleep(500);
  client3.disconnect();

  await sleep(2000);

  // 总结
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【总结】TCP 连接生命周期');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  console.log('三次握手 (连接建立):');
  console.log('  1. SYN  → 2. SYN+ACK  → 3. ACK');
  console.log('  确保双方都准备好进行数据传输');
  console.log('');
  console.log('数据传输:');
  console.log('  双向数据流，保证可靠传输');
  console.log('');
  console.log('四次挥手 (连接断开):');
  console.log('  1. FIN  → 2. ACK  → 3. FIN  → 4. ACK');
  console.log('  确保双方都完成数据传输，完全关闭连接');
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  server.close();
  setTimeout(() => process.exit(0), 1000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 启动演示
runDetailedDemo();
