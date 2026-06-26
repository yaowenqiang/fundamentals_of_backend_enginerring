const net = require('net');

// TCP Multiplexing & Demultiplexing 详细演示
// 展示传输层如何使用端口号来区分不同的应用进程

console.log('=== TCP Multiplexing & Demultiplexing 详细演示 ===\n');

// ============================================
// Multiplexing 端 (发送端)
// ============================================
console.log('【MULTIPLEXING - 发送端】');
console.log('多个应用进程的数据需要通过同一个网络接口发送\n');

// 创建多个客户端，模拟多个应用进程
const clients = [
  { name: 'Web Browser', port: 8080, color: '🔵' },
  { name: 'Email Client', port: 8081, color: '🟢' },
  { name: 'FTP Client', port: 8082, color: '🟡' },
  { name: 'SSH Client', port: 8083, color: '🔴' }
];

// Multiplexing: 将不同应用的数据汇聚到网络层
console.log('应用层数据流:');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│  Web Browser ──┐                                        │');
console.log('│  Email Client ──┼──→ Multiplexer ──→ Network Layer      │');
console.log('│  FTP Client  ──┤         (TCP)        (IP)              │');
console.log('│  SSH Client  ──┘                                        │');
console.log('└─────────────────────────────────────────────────────────┘\n');

// ============================================
// Demultiplexing 端 (接收端)
// ============================================
console.log('【DEMULTIPLEXING - 接收端】');
console.log('接收端需要将收到的数据分发到对应的应用进程\n');

// 服务器端处理函数
const createService = (port, serviceName) => {
  const server = net.createServer((socket) => {
    const clientAddr = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`${serviceName} 收到来自 ${clientAddr} 的连接`);

    socket.on('data', (data) => {
      console.log(`${serviceName} ← 收到数据: "${data.toString().trim()}"`);
      socket.write(`${serviceName} 已收到并处理数据`);
    });

    socket.on('end', () => {
      console.log(`${serviceName} 连接结束\n`);
    });
  });

  return server;
};

// 启动多个服务，每个监听不同端口
const services = [
  { port: 8080, name: 'HTTP Service', handler: createService(8080, 'HTTP Service') },
  { port: 8081, name: 'SMTP Service', handler: createService(8081, 'SMTP Service') },
  { port: 8082, name: 'FTP Service', handler: createService(8082, 'FTP Service') },
  { port: 8083, name: 'SSH Service', handler: createService(8083, 'SSH Service') }
];

console.log('Demultiplexing 工作流程:');
console.log('┌─────────────────────────────────────────────────────────┐');
console.log('│  Network Layer ──→ Demultiplexer ──→ 应用进程           │');
console.log('│       (IP)              (TCP)                            │');
console.log('│                                                           │');
console.log('│  根据端口号分发:                                         │');
console.log('│  Port 8080 → HTTP Service                               │');
console.log('│  Port 8081 → SMTP Service                               │');
console.log('│  Port 8082 → FTP Service                                │');
console.log('│  Port 8083 → SSH Service                                │');
console.log('└─────────────────────────────────────────────────────────┘\n');

// 启动所有服务
services.forEach(service => {
  service.handler.listen(service.port, '127.0.0.1', () => {
    console.log(`✓ ${service.name} 监听端口 ${service.port}`);
  });
});

console.log('\n所有服务已启动，开始演示...\n');

// ============================================
// 演示 Multiplexing: 多个客户端同时发送数据
// ============================================
setTimeout(() => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('开始 Multiplexing 演示：多个客户端同时发送数据');
  console.log('═══════════════════════════════════════════════════════\n');

  clients.forEach((client, index) => {
    setTimeout(() => {
      const socket = net.createConnection(client.port, '127.0.0.1', () => {
        console.log(`${client.color} ${client.name} 连接到端口 ${client.port}`);

        // 发送数据
        const message = `${client.name} test message`;
        socket.write(message);

        // 接收响应后断开
        socket.on('data', (data) => {
          console.log(`${client.color} ${client.name} 收到响应: "${data.toString().trim()}"`);
          setTimeout(() => socket.end(), 100);
        });

        socket.on('end', () => {
          console.log(`${client.color} ${client.name} 断开连接`);
        });
      });

      socket.on('error', (err) => {
        console.error(`${client.color} ${client.name} 错误: ${err.message}`);
      });
    }, index * 200); // 错开连接时间，便于观察
  });

}, 1000);

// ============================================
// 总结
// ============================================
setTimeout(() => {
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('演示总结:');
  console.log('═══════════════════════════════════════════════════════');
  console.log('1. Multiplexing: 多个应用通过不同端口发送数据');
  console.log('2. Demultiplexing: 服务器根据端口号分发数据到对应服务');
  console.log('3. 端口号是区分不同应用进程的关键标识符');
  console.log('═══════════════════════════════════════════════════════\n');

  // 关闭所有服务
  services.forEach(service => service.handler.close());
  process.exit(0);
}, 5000);
