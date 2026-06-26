const net = require('net');
const readline = require('readline');

// TCP 三次握手与四次挥手交互式演示
// 允许用户控制每一步，详细观察过程

class InteractiveHandshakeDemo {
  constructor() {
    this.SERVER_PORT = 9999;
    this.SERVER_HOST = '127.0.0.1';
    this.server = null;
    this.client = null;
    this.step = 0;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  // 显示标题
  showTitle() {
    console.clear();
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║     TCP 三次握手与四次挥手交互式演示                      ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');
  }

  // 显示三次握手说明
  showHandshakeInfo() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('【TCP 三次握手】(建立连接)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('目的: 在不可靠的网络中建立可靠的连接');
    console.log('');
    console.log('步骤详解:');
    console.log('');
    console.log('  步骤 1: 客户端 → 服务器');
    console.log('          SYN=1, seq=x');
    console.log('          "我要建立连接，我的序列号是 x"');
    console.log('          客户端状态: SYN_SENT → SYN_SENT');
    console.log('');
    console.log('  步骤 2: 服务器 → 客户端');
    console.log('          SYN=1, ACK=1, seq=y, ack_num=x+1');
    console.log('          "收到你的请求，我也想建立连接，我的序列号是 y"');
    console.log('          "我确认收到你的序列号 x"');
    console.log('          服务器状态: LISTEN → SYN_RECEIVED → ESTABLISHED');
    console.log('');
    console.log('  步骤 3: 客户端 → 服务器');
    console.log('          ACK=1, seq=x+1, ack_num=y+1');
    console.log('          "收到你的确认，我也确认收到你的序列号 y"');
    console.log('          客户端状态: SYN_SENT → ESTABLISHED');
    console.log('');
    console.log('结果: 双方都知道对方已准备好，连接建立成功！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  // 显示四次挥手说明
  showTeardownInfo() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('【TCP 四次挥手】(断开连接)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('目的: 确保双方都完成数据传输后才完全关闭连接');
    console.log('');
    console.log('步骤详解:');
    console.log('');
    console.log('  步骤 1: 主动关闭方 → 被动关闭方');
    console.log('          FIN=1, seq=u');
    console.log('          "我没有数据要发送了，准备关闭连接"');
    console.log('          主动方状态: ESTABLISHED → FIN_WAIT_1');
    console.log('');
    console.log('  步骤 2: 被动关闭方 → 主动关闭方');
    console.log('          ACK=1, seq=v, ack_num=u+1');
    console.log('          "收到你的关闭请求"');
    console.log('          被动方状态: ESTABLISHED → CLOSE_WAIT');
    console.log('          主动方状态: FIN_WAIT_1 → FIN_WAIT_2');
    console.log('');
    console.log('  步骤 3: 被动关闭方 → 主动关闭方');
    console.log('          FIN=1, ACK=1, seq=w, ack_num=u+1');
    console.log('          "我也没有数据要发送了，也准备关闭连接"');
    console.log('          被动方状态: CLOSE_WAIT → LAST_ACK');
    console.log('');
    console.log('  步骤 4: 主动关闭方 → 被动关闭方');
    console.log('          ACK=1, seq=u+1, ack_num=w+1');
    console.log('          "收到你的关闭请求，再见！"');
    console.log('          被动方状态: LAST_ACK → CLOSED');
    console.log('          主动方状态: FIN_WAIT_2 → TIME_WAIT → CLOSED');
    console.log('');
    console.log('结果: 连接完全关闭，双方资源都释放！');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }

  // 启动服务器
  startServer() {
    this.server = net.createServer((socket) => {
      const clientInfo = `${socket.remoteAddress}:${socket.remotePort}`;
      console.log(`\n【服务器】接受连接: ${clientInfo}`);
      console.log('【服务器】状态: ESTABLISHED (连接已建立)\n');

      socket.on('data', (data) => {
        console.log(`【服务器】收到数据: "${data.toString().trim()}"`);
        socket.write('Server ACK: ' + data);
      });

      socket.on('end', () => {
        console.log('【服务器】收到客户端 FIN 包');
        console.log('【服务器】发送 ACK 包');
        console.log('【服务器】状态: CLOSE_WAIT\n');

        setTimeout(() => {
          console.log('【服务器】发送 FIN 包');
          console.log('【服务器】状态: LAST_ACK\n');
          socket.end();
        }, 1000);
      });

      socket.on('close', () => {
        console.log('【服务器】收到客户端 ACK 包');
        console.log('【服务器】状态: CLOSED\n');
      });

      socket.on('error', (err) => {
        console.error(`【服务器】错误: ${err.message}`);
      });
    });

    this.server.listen(this.SERVER_PORT, this.SERVER_HOST, () => {
      console.log(`【服务器】启动成功，监听 ${this.SERVER_HOST}:${this.SERVER_PORT}`);
      console.log('【服务器】状态: LISTEN (等待连接)\n');
    });

    this.server.on('error', (err) => {
      console.error(`【服务器】错误: ${err.message}`);
    });
  }

  // 创建客户端连接
  createClient() {
    console.log('【客户端】准备连接...\n');

    this.client = net.createConnection({
      host: this.SERVER_HOST,
      port: this.SERVER_PORT
    }, () => {
      console.log('【客户端】连接建立成功！');
      console.log('【客户端】状态: ESTABLISHED\n');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✓ 三次握手完成！连接已建立');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      this.promptNextAction();
    });

    this.client.on('data', (data) => {
      console.log(`【客户端】收到响应: "${data.toString().trim()}"\n`);
    });

    this.client.on('end', () => {
      console.log('【客户端】收到服务器 FIN 包');
      console.log('【客户端】发送 ACK 包');
      console.log('【客户端】状态: TIME_WAIT\n');

      setTimeout(() => {
        console.log('【客户端】TIME_WAIT 等待结束 (2MSL)');
        console.log('【客户端】状态: CLOSED');
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✓ 四次挥手完成！连接已关闭');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        this.cleanup();
      }, 1000);
    });

    this.client.on('close', () => {
      console.log('【客户端】连接已关闭\n');
    });

    this.client.on('error', (err) => {
      console.error(`【客户端】错误: ${err.message}`);
    });
  }

  // 提示下一步操作
  promptNextAction() {
    this.rl.question('按 Enter 键发送数据，或输入 "quit" 开始四次挥手: ', (answer) => {
      if (answer.toLowerCase() === 'quit') {
        this.startTeardown();
      } else {
        this.sendData();
      }
    });
  }

  // 发送数据
  sendData() {
    const message = 'Hello Server! This is test data.';
    console.log(`【客户端】发送数据: "${message}"\n`);
    this.client.write(message);
    this.promptNextAction();
  }

  // 开始四次挥手
  startTeardown() {
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('开始四次挥手过程...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('【客户端】主动关闭连接');
    console.log('【客户端】发送 FIN 包');
    console.log('【客户端】状态: FIN_WAIT_1\n');
    this.client.end();
  }

  // 清理资源
  cleanup() {
    this.rl.close();
    this.server.close();
    setTimeout(() => process.exit(0), 2000);
  }

  // 运行交互式演示
  async run() {
    this.showTitle();
    this.showHandshakeInfo();

    await this.question('按 Enter 键开始演示三次握手...');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('开始三次握手过程...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    this.startServer();
    await this.sleep(1000);

    this.createClient();
  }

  // 辅助函数：提问
  question(prompt) {
    return new Promise(resolve => {
      this.rl.question(prompt, () => resolve());
    });
  }

  // 辅助函数：等待
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 启动交互式演示
const demo = new InteractiveHandshakeDemo();
demo.run();
