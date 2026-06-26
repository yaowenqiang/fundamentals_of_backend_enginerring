const net = require('net');

// TCP 三次握手与四次挥手演示
// 展示 TCP 连接建立和断开的完整过程

class TCPHandshakeDemo {
  constructor() {
    this.SERVER_PORT = 9999;
    this.SERVER_HOST = '127.0.0.1';
    this.server = null;
    this.client = null;
  }

  // 启动服务器
  startServer() {
    console.log('=== TCP 三次握手与四次挥手演示 ===\n');

    this.server = net.createServer((socket) => {
      const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;

      console.log('【三次握手完成 - 连接建立】');
      console.log(`├─ 服务器接受来自 ${clientAddress} 的连接`);
      console.log('├─ TCP 连接状态: ESTABLISHED');
      console.log('└─ 连接建立成功，可以开始数据传输\n');

      // 监听数据接收
      socket.on('data', (data) => {
        console.log('【数据传输】');
        console.log(`├─ 收到数据: "${data.toString().trim()}"`);
        console.log(`├─ 数据长度: ${data.length} 字节`);
        console.log('└─ 发送确认回执...\n');

        socket.write('Server received your message');
      });

      // 监听连接结束（四次挥手的第一步）
      socket.on('end', () => {
        console.log('【四次挥手开始】');
        console.log('├─ 步骤 1: 客户端发送 FIN 包 (CLOSE_WAIT)');
        console.log('├─ 步骤 2: 服务器发送 ACK 包 (接收关闭请求)');
        console.log('└─ 服务器进入 CLOSE_WAIT 状态\n');
      });

      // 监听连接完全关闭
      socket.on('close', (hadError) => {
        console.log('【四次挥手完成 - 连接关闭】');
        console.log('├─ 步骤 3: 服务器发送 FIN 包 (LAST_ACK)');
        console.log('├─ 步骤 4: 客户端发送 ACK 包 (TIME_WAIT)');
        console.log('├─ TCP 连接状态: CLOSED');
        console.log('└─ 连接完全关闭\n');
      });

      // 监听错误
      socket.on('error', (err) => {
        console.error('连接错误:', err.message);
      });
    });

    // 服务器开始监听
    this.server.listen(this.SERVER_PORT, this.SERVER_HOST, () => {
      console.log('【服务器启动】');
      console.log(`├─ 监听地址: ${this.SERVER_HOST}:${this.SERVER_PORT}`);
      console.log('├─ TCP 状态: LISTEN (等待连接请求)');
      console.log('└─ 服务器准备接受连接...\n');
    });

    // 服务器错误处理
    this.server.on('error', (err) => {
      console.error('服务器错误:', err.message);
    });
  }

  // 创建客户端连接
  createClient() {
    console.log('【客户端启动】');
    console.log('├─ 准备连接到服务器');
    console.log('└─ 开始三次握手过程...\n');

    this.client = net.createConnection({
      host: this.SERVER_HOST,
      port: this.SERVER_PORT
    }, () => {
      // 连接建立时的回调 - 三次握手完成
      console.log('【三次握手完成】');
      console.log('├─ 步骤 1: 客户端发送 SYN 包 (SYN_SENT)');
      console.log('├─ 步骤 2: 服务器发送 SYN+ACK 包 (SYN_RECEIVED)');
      console.log('├─ 步骤 3: 客户端发送 ACK包 (ESTABLISHED)');
      console.log('└─ 连接建立成功！\n');
    });

    // 监听连接数据
    this.client.on('data', (data) => {
      console.log('【客户端接收数据】');
      console.log(`├─ 收到服务器响应: "${data.toString().trim()}"`);
      console.log('└─ 数据传输完成\n');
    });

    // 监听连接结束
    this.client.on('end', () => {
      console.log('【客户端连接结束】');
      console.log('├─ 收到服务器的 FIN 包');
      console.log('├─ 客户端发送 ACK 包');
      console.log('└─ 客户端进入 TIME_WAIT 状态\n');
    });

    // 监听连接完全关闭
    this.client.on('close', () => {
      console.log('【客户端连接关闭】');
      console.log('├─ TIME_WAIT 等待结束 (2MSL)');
      console.log('└─ 客户端连接完全关闭\n');
    });

    // 监听错误
    this.client.on('error', (err) => {
      console.error('客户端错误:', err.message);
    });

    return this.client;
  }

  // 执行完整的演示流程
  async runDemo() {
    // 启动服务器
    this.startServer();

    // 等待服务器启动
    await this.sleep(1000);

    // 创建客户端连接（触发三次握手）
    const client = this.createClient();

    // 等待连接建立
    await this.sleep(2000);

    // 发送测试数据
    console.log('【开始数据传输】');
    client.write('Hello Server! This is a test message.');

    // 等待数据传输完成
    await this.sleep(2000);

    // 开始四次挥手（客户端主动关闭）
    console.log('【客户端发起关闭】');
    console.log('└─ 客户端准备关闭连接...\n');
    client.end();

    // 等待四次挥手完成
    await this.sleep(2000);

    // 清理资源
    console.log('【演示完成】');
    console.log('├─ 三次握手: 连接建立 ✓');
    console.log('├─ 数据传输: 消息交换 ✓');
    console.log('├─ 四次挥手: 连接关闭 ✓');
    console.log('└─ TCP 连接生命周期演示完成！\n');

    this.server.close();
    setTimeout(() => process.exit(0), 1000);
  }

  // 辅助函数：等待
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 运行演示
const demo = new TCPHandshakeDemo();
demo.runDemo();
