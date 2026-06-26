const net = require('net');

// TCP 状态机可视化演示
// 展示 TCP 连接的完整状态转换过程

class TCPStateMachine {
  constructor() {
    this.currentState = 'CLOSED';
    this.events = [];
  }

  // 状态转换
  transition(newState, reason) {
    const oldState = this.currentState;
    this.currentState = newState;
    this.events.push({
      timestamp: Date.now(),
      from: oldState,
      to: newState,
      reason: reason
    });

    this.logTransition(oldState, newState, reason);
  }

  logTransition(from, to, reason) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${from} → ${to}`);
    console.log(`       原因: ${reason}\n`);
  }

  getState() {
    return this.currentState;
  }

  getHistory() {
    return this.events;
  }

  printHistory() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('【状态转换历史】');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    this.events.forEach((event, index) => {
      const timestamp = new Date(event.timestamp).toLocaleTimeString();
      console.log(`${index + 1}. [${timestamp}] ${event.from} → ${event.to}`);
      console.log(`   原因: ${event.reason}\n`);
    });
  }
}

// 服务器端状态机
class ServerStateMachine extends TCPStateMachine {
  constructor(port) {
    super();
    this.port = port;
    this.server = null;
    this.connectionSocket = null;
    this.transition('CLOSED', '服务器初始化');
  }

  start() {
    console.log('【服务器】启动中...\n');

    this.server = net.createServer((socket) => {
      this.connectionSocket = socket;
      const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;

      // 三次握手完成
      this.transition('ESTABLISHED', `接受来自 ${clientInfo} 的连接，三次握手完成`);

      socket.on('data', (data) => {
        console.log(`【服务器】收到数据: "${data.toString().trim()}"`);
        console.log(`       状态: ${this.getState()} - 数据传输中\n`);
        socket.write('ACK: ' + data);
      });

      socket.on('end', () => {
        // 客户端发送 FIN
        this.transition('CLOSE_WAIT', '收到客户端 FIN 包，发送 ACK');

        // 服务器也准备关闭
        setTimeout(() => {
          this.transition('LAST_ACK', '发送服务器 FIN 包');
          socket.end();
        }, 500);
      });

      socket.on('close', () => {
        this.transition('CLOSED', '四次挥手完成，连接关闭');
      });

      socket.on('error', (err) => {
        console.error(`【服务器】错误: ${err.message}`);
        this.transition('CLOSED', '连接错误');
      });
    });

    this.server.listen(this.port, '127.0.0.1', () => {
      this.transition('LISTEN', `服务器监听端口 ${this.port}`);
    });

    this.server.on('error', (err) => {
      console.error(`【服务器】错误: ${err.message}`);
      this.transition('CLOSED', '服务器错误');
    });
  }

  close() {
    if (this.server) {
      this.server.close();
      this.transition('CLOSED', '服务器主动关闭');
    }
  }
}

// 客户端状态机
class ClientStateMachine extends TCPStateMachine {
  constructor(id, port) {
    super();
    this.id = id;
    this.port = port;
    this.socket = null;
    this.transition('CLOSED', '客户端初始化');
  }

  connect() {
    console.log(`【客户端 ${this.id}】开始连接...\n`);

    this.transition('SYN_SENT', '发送 SYN 包，请求建立连接');

    this.socket = net.createConnection({
      host: '127.0.0.1',
      port: this.port
    }, () => {
      this.transition('ESTABLISHED', '收到 SYN+ACK，发送 ACK，三次握手完成');
    });

    this.socket.on('data', (data) => {
      console.log(`【客户端 ${this.id}】收到响应: "${data.toString().trim()}"`);
      console.log(`                状态: ${this.getState()} - 数据传输中\n`);
    });

    this.socket.on('end', () => {
      this.transition('TIME_WAIT', '收到服务器 FIN 包，发送 ACK');
      setTimeout(() => {
        this.transition('CLOSED', 'TIME_WAIT 结束 (2MSL)，连接关闭');
      }, 1000);
    });

    this.socket.on('close', () => {
      if (this.getState() !== 'CLOSED') {
        this.transition('CLOSED', '连接关闭');
      }
    });

    this.socket.on('error', (err) => {
      console.error(`【客户端 ${this.id}】错误: ${err.message}`);
      this.transition('CLOSED', '连接错误');
    });

    return this.socket;
  }

  send(message) {
    if (this.socket) {
      console.log(`【客户端 ${this.id}】发送数据: "${message}"`);
      console.log(`                状态: ${this.getState()}\n`);
      this.socket.write(message);
    }
  }

  disconnect() {
    if (this.socket) {
      this.transition('FIN_WAIT_1', '主动关闭，发送 FIN 包');
      this.socket.end();
    }
  }
}

// ==========================================
// 状态机演示
// ==========================================
async function runStateMachineDemo() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║           TCP 状态机可视化演示                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('TCP 状态机主要状态:');
  console.log('  CLOSED       - 连接关闭');
  console.log('  LISTEN       - 服务器等待连接');
  console.log('  SYN_SENT     - 客户端发送连接请求');
  console.log('  SYN_RECEIVED - 服务器收到连接请求');
  console.log('  ESTABLISHED  - 连接已建立');
  console.log('  FIN_WAIT_1   - 主动关闭方等待远程 ACK');
  console.log('  CLOSE_WAIT   - 被动关闭方等待本地关闭');
  console.log('  LAST_ACK     - 被动关闭方等待远程 ACK');
  console.log('  TIME_WAIT    - 主动关闭方等待远程 FIN');
  console.log('  CLOSING      - 双方同时关闭\n');

  // 启动服务器
  const server = new ServerStateMachine(9999);
  server.start();

  await sleep(1500);

  // 客户端连接
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const client = new ClientStateMachine('Alpha', 9999);
  client.connect();

  await sleep(1500);

  // 数据传输
  client.send('Hello Server!');

  await sleep(1500);

  // 四次挥手
  client.disconnect();

  await sleep(2000);

  // 打印状态历史
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【服务器端状态转换历史】');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  server.printHistory();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【客户端状态转换历史】');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  client.printHistory();

  server.close();
  setTimeout(() => process.exit(0), 1000);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 启动状态机演示
runStateMachineDemo();
