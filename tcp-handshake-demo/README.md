# TCP 三次握手与四次挥手演示

这个项目详细演示了 TCP 协议中的 **三次握手** 和 **四次挥手** 过程，帮助理解 TCP 连接的建立和断开机制。

## 项目简介

### 什么是三次握手？

三次握手是 TCP 协议建立连接的过程，确保通信双方都准备好进行数据传输。

**过程：**
1. 客户端发送 SYN 包（同步序列号）
2. 服务器回复 SYN+ACK 包（同步+确认）
3. 客户端发送 ACK 包（确认）

**目的：**
- 确认双方的接收和发送能力都正常
- 同步初始序列号
- 建立可靠的连接

### 什么是四次挥手？

四次挥手是 TCP 协议断开连接的过程，确保双方都完成数据传输后才完全关闭连接。

**过程：**
1. 主动关闭方发送 FIN 包（结束请求）
2. 被动关闭方发送 ACK 包（确认收到）
3. 被动关闭方发送 FIN 包（也准备结束）
4. 主动关闭方发送 ACK 包（确认结束）

**目的：**
- 确保双方都完成数据传输
- 防止数据丢失
- 正确释放连接资源

## 项目文件

### handshake-teardown.js
基本的三次握手和四次挥手演示，展示完整的连接生命周期。

### detailed-demo.js
详细的演示版本，包含多个客户端连接和完整的状态转换说明。

### state-machine.js
TCP 状态机可视化演示，跟踪并展示所有状态转换过程。

### interactive-demo.js
交互式演示，允许用户控制每一步，详细观察连接建立和断开过程。

## 使用方法

### 1. 基本演示
```bash
npm start
# 或
node handshake-teardown.js
```

### 2. 详细演示
```bash
npm run demo
# 或
node detailed-demo.js
```

### 3. 状态机演示
```bash
npm run state
# 或
node state-machine.js
```

### 4. 交互式演示 (推荐)
```bash
npm run interactive
# 或
node interactive-demo.js
```

## TCP 状态详解

### 连接建立 (三次握手)

| 客户端状态 | 服务器状态 | 说明 |
|------------|------------|------|
| CLOSED | LISTEN | 初始状态 |
| SYN_SENT | SYN_RECEIVED | 发送/接收 SYN |
| ESTABLISHED | ESTABLISHED | 连接建立 |

### 连接断开 (四次挥手)

| 主动方状态 | 被动方状态 | 说明 |
|------------|------------|------|
| ESTABLISHED | ESTABLISHED | 连接活跃 |
| FIN_WAIT_1 | CLOSE_WAIT | 发送 FIN，等待 ACK |
| FIN_WAIT_2 | LAST_ACK | 收到 ACK，等待 FIN |
| TIME_WAIT | CLOSED | 等待 2MSL 后关闭 |

### 常见状态说明

- **CLOSED**: 连接关闭
- **LISTEN**: 服务器等待连接
- **SYN_SENT**: 客户端已发送 SYN 包
- **SYN_RECEIVED**: 服务器已收到 SYN 包
- **ESTABLISHED**: 连接已建立，可以传输数据
- **FIN_WAIT_1**: 主动关闭方等待远程 ACK
- **FIN_WAIT_2**: 主动关闭方等待远程 FIN
- **CLOSE_WAIT**: 被动关闭方等待本地应用关闭
- **LAST_ACK**: 被动关闭方等待远程 ACK
- **TIME_WAIT**: 主动关闭方等待 2MSL (防止延迟包)
- **CLOSING**: 双方同时关闭

## 演示输出示例

### 三次握手输出
```
【三次握手完成】
├─ 步骤 1: 客户端发送 SYN 包 (SYN_SENT)
├─ 步骤 2: 服务器发送 SYN+ACK 包 (SYN_RECEIVED)
├─ 步骤 3: 客户端发送 ACK包 (ESTABLISHED)
└─ 连接建立成功！
```

### 四次挥手输出
```
【四次挥手完成 - 连接关闭】
├─ 步骤 1: 客户端发送 FIN 包 (CLOSE_WAIT)
├─ 步骤 2: 服务器发送 ACK 包 (接收关闭请求)
├─ 步骤 3: 服务器发送 FIN 包 (LAST_ACK)
├─ 步骤 4: 客户端发送 ACK 包 (TIME_WAIT)
├─ TCP 连接状态: CLOSED
└─ 连接完全关闭
```

## 技术细节

### 为什么需要三次握手？

1. **防止失效的连接请求**：避免旧连接请求突然到达服务器
2. **确认双方能力**：验证双方的收发功能都正常
3. **同步序列号**：协商初始序列号，确保数据顺序

### 为什么需要四次挥手？

1. **全双工特性**：TCP 是全双工协议，需要分别关闭两个方向
2. **数据完整性**：确保双方都完成数据传输
3. **资源释放**：正确释放连接资源

### 为什么 TIME_WAIT 状态？

1. **确保最后 ACK 到达**：防止 ACK 丢失导致重传
2. **处理延迟包**：让旧连接的包在网络中消失
3. **持续时间**：2MSL (最大段生存时间的两倍)

## Node.js 实现要点

### 服务器端
```javascript
const server = net.createServer((socket) => {
  socket.on('data', (data) => { /* 处理数据 */ });
  socket.on('end', () => { /* 连接结束 */ });
  socket.on('close', () => { /* 连接关闭 */ });
});
server.listen(port);
```

### 客户端
```javascript
const client = net.createConnection({ port, host }, () => {
  // 连接建立
});
client.on('data', (data) => { /* 接收数据 */ });
client.on('end', () => { /* 连接结束 */ });
client.end(); // 主动关闭
```

### 事件监听
- `'data'`: 接收数据
- `'end'`: 对方发送 FIN 包
- `'close'`: 连接完全关闭
- `'error'`: 连接错误

## 学习目标

通过这个演示，你将理解：

1. TCP 连接建立的过程和原因
2. TCP 连接断开的步骤和注意事项
3. 各种 TCP 状态的含义和转换条件
4. TCP 协议如何保证可靠传输
5. 全双工通信的特性
6. TIME_WAIT 状态的重要性

## 扩展实验

1. **并发连接**：测试多个客户端同时连接
2. **异常情况**：模拟网络中断、端口冲突等
3. **性能测试**：测试连接建立和断开的性能
4. **wireshark 抓包**：使用网络抓包工具观察实际数据包

## 相关资源

- [RFC 793 - TCP specification](https://tools.ietf.org/html/rfc793)
- [TCP/IP Illustrated, Volume 1](https://en.wikipedia.org/wiki/TCP/IP_Illustrated)
- [Node.js Net Module Documentation](https://nodejs.org/api/net.html)

## 故障排查

### 连接失败
- 检查端口是否被占用
- 确认防火墙设置
- 验证服务器是否正在运行

### 演示卡住
- 检查是否有网络连接
- 确认 Node.js 版本 (>=14.0.0)
- 查看错误日志信息

## 常见问题

**Q: 为什么三次握手不是两次？**
A: 两次握手无法确认双方的接收能力都正常，也无法有效防止失效的连接请求。

**Q: 为什么四次挥手不是三次？**
A: TCP 是全双工协议，需要分别关闭两个方向的数据流，被动方可能还有数据要传输。

**Q: TIME_WAIT 状态有什么作用？**
A: 确保最后的 ACK 包到达对方，并让旧连接的延迟包在网络中消失。

**Q: 如何处理 TIME_WAIT 过多的问题？**
A: 可以调整系统参数，但通常不需要，这是正常现象。

## 许可证

MIT License
