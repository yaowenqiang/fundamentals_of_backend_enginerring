const http = require('http');
const net = require('net');

/**
 * HTTP Request Smuggling 教育演示
 *
 * 目的: 帮助开发者理解 HTTP Request Smuggling 漏洞原理
 * 警告: 仅用于教育目的，不要用于未经授权的测试
 */

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║       HTTP Request Smuggling 教育演示                      ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// ==========================================
// 第一部分: HTTP 基础知识
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【第一部分】HTTP 请求边界基础');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('HTTP 请求边界确定方式:');
console.log('');
console.log('1. Content-Length 方式:');
console.log('   Content-Length: 13');
console.log('   Hello, World!  (精确 13 字节)');
console.log('');
console.log('2. Transfer-Encoding: chunked 方式:');
console.log('   Transfer-Encoding: chunked');
console.log('   5');
console.log('   Hello');
console.log('   6');
console.log('   , World');
console.log('   0');
console.log('   [空行 - 结束]');
console.log('');

// ==========================================
// 第二部分: Request Smuggling 原理
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【第二部分】Request Smuggling 攻击原理');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('漏洞原理: 前后端服务器对 HTTP 请求边界解析不一致');
console.log('');
console.log('正常情况:');
console.log('┌─────────────┐                    ┌─────────────┐');
console.log('│  前端服务器  │────────────────────>│  后端服务器  │');
console.log('│  解析方式 A  │                    │  解析方式 A  │');
console.log('└─────────────┘                    └─────────────┘');
console.log('结果: 双方理解一致 ✓');
console.log('');

console.log('Smuggling 攻击:');
console.log('┌─────────────┐                    ┌─────────────┐');
console.log('│  前端服务器  │────────────────────>│  后端服务器  │');
console.log('│  解析方式 A  │                    │  解析方式 B  │');
console.log('└─────────────┘                    └─────────────┘');
console.log('结果: 边界解析不一致 → 请求走私 ✗');
console.log('');

// ==========================================
// 第三部分: 常见攻击类型
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【第三部分】常见攻击类型');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// CL.TE 攻击
console.log('【CL.TE 攻击】');
console.log('前端: 使用 Content-Length');
console.log('后端: 使用 Transfer-Encoding');
console.log('');
console.log('攻击示例:');
console.log('POST / HTTP/1.1');
console.log('Host: example.com');
console.log('Content-Length: 4');
console.log('Transfer-Encoding: chunked');
console.log('');
console.log('50');  // 前端按 Content-Length 读取 4 字节: "50\\r\\n"');
console.log('      // 后端按 chunked 解析: chunk 大小为 50');
console.log('');
console.log('结果: 前端认为请求结束，后端等待更多数据 → 漏洞产生');
console.log('');

// TE.CL 攻击
console.log('【TE.CL 攻击】');
console.log('前端: 使用 Transfer-Encoding');
console.log('后端: 使用 Content-Length');
console.log('');
console.log('攻击示例:');
console.log('POST / HTTP/1.1');
console.log('Host: example.com');
console.log('Content-Length: 6');
console.log('Transfer-Encoding: chunked');
console.log('');
console.log('0');
console.log('SMUG');
console.log('');
console.log('结果: 解析不一致导致请求走私');
console.log('');

// ==========================================
// 第四部分: 实际影响
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【第四部分】攻击影响');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Request Smuggling 攻击可能导致:');
console.log('');
console.log('1. 会话劫持');
console.log('   - 攻击者获取受害者会话');
console.log('   - 未经授权访问用户账户');
console.log('');
console.log('2. 绕过安全控制');
console.log('   - 绕过 WAF 防护');
console.log('   - 绕过访问控制');
console.log('');
console.log('3. 数据泄露');
console.log('   - 窃取敏感信息');
console.log('   - 获取内部数据');
console.log('');
console.log('4. XSS 攻击');
console.log('   - 将恶意脚本注入其他用户请求');
console.log('   - 跨站脚本攻击');
console.log('');

// ==========================================
// 第五部分: 防御措施
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【第五部分】防御措施');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('✓ 推荐防御措施:');
console.log('');
console.log('1. 统一请求处理');
console.log('   - 确保前端和后端使用相同的 HTTP 解析器');
console.log('   - 避免不同服务器之间的解析差异');
console.log('');
console.log('2. 规范化请求头');
console.log('   - 明确拒绝有歧义的请求头组合');
console.log('   - 示例: 同时存在 Content-Length 和 Transfer-Encoding');
console.log('');
console.log('3. 使用安全的服务器配置');
console.log('   - 定期更新服务器软件');
console.log('   - 使用已知安全的 Web 服务器');
console.log('');
console.log('4. 实施请求验证');
console.log('   - 验证 Content-Length 的值');
console.log('   - 检查异常的 Transfer-Encoding 格式');
console.log('');
console.log('5. 监控和日志');
console.log('   - 监控异常请求模式');
console.log('   - 记录可疑的请求头组合');
console.log('');

// ==========================================
// 第六部分: 检测方法
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【第六部分】漏洞检测方法');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('检测技巧:');
console.log('');
console.log('1. 时间差异检测');
console.log('   - 发送特制的 HTTP 请求');
console.log('   - 观察响应时间的异常');
console.log('');
console.log('2. 响应内容检测');
console.log('   - 在走私请求中包含特定标记');
console.log('   - 检查后续响应中是否出现标记');
console.log('');
console.log('3. 反射检测');
console.log('   - 发送会反射的请求');
console.log('   - 检查响应中是否包含预期内容');
console.log('');

// ==========================================
// 总结
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【总结】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('HTTP Request Smuggling 是一个严重的 Web 安全漏洞，');
console.log('了解其原理和防御方法对 Web 开发者至关重要。');
console.log('');
console.log('关键要点:');
console.log('• 理解 HTTP 请求边界的重要性');
console.log('• 确保前后端请求处理的一致性');
console.log('• 实施适当的安全防护措施');
console.log('• 定期进行安全审计和测试');
console.log('');
console.log('⚠️  重要提醒:');
console.log('此知识仅用于合法的安全研究和防御目的，');
console.log('请不要在未经授权的系统上进行测试。');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 演示服务器类 (安全版本)
class SecureHTTPServer {
  constructor(port) {
    this.port = port;
    this.server = null;
  }

  start() {
    this.server = http.createServer((req, res) => {
      // 安全检查: 检测可疑的请求头组合
      this.checkRequestHeaders(req);

      // 处理请求
      req.on('data', (chunk) => {
        // 安全处理请求数据
      });

      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>HTTP Request Smuggling 教育演示</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 800px; margin: 0 auto; }
        .warning { background: #fff3cd; padding: 20px; border-radius: 5px; }
        .info { background: #d1ecf1; padding: 20px; border-radius: 5px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>HTTP Request Smuggling 教育演示服务器</h1>
        <div class="warning">
            <h3>⚠️ 安全提醒</h3>
            <p>此服务器仅用于教育目的，已实施防护措施。</p>
        </div>
        <div class="info">
            <h3>请求信息</h3>
            <p>方法: ${req.method}</p>
            <p>路径: ${req.url}</p>
            <p>用户代理: ${req.headers['user-agent'] || '未知'}</p>
        </div>
        <div class="info">
            <h3>安全措施</h3>
            <p>✓ 请求头验证</p>
            <p>✓ 边界解析检查</p>
            <p>✓ 异常行为监控</p>
        </div>
    </div>
</body>
</html>
        `);
      });
    });

    this.server.listen(this.port, () => {
      console.log(`✓ 安全服务器启动在端口 ${this.port}`);
      console.log(`✓ 访问 http://localhost:${this.port} 查看演示页面\n`);
    });
  }

  checkRequestHeaders(req) {
    const headers = req.headers;
    const warnings = [];

    // 检查是否有歧义的请求头组合
    if (headers['content-length'] && headers['transfer-encoding']) {
      warnings.push('同时存在 Content-Length 和 Transfer-Encoding');
    }

    // 检查 Transfer-Encoding 是否被混淆
    if (headers['transfer-encoding']) {
      const te = headers['transfer-encoding'].toString();
      if (te.includes('chunked') && te !== 'chunked') {
        warnings.push('Transfer-Encoding 头部格式异常');
      }
    }

    // 记录异常请求
    if (warnings.length > 0) {
      console.log('⚠️  检测到可疑请求:');
      warnings.forEach(warning => {
        console.log(`   - ${warning}`);
      });
      console.log('');
    }
  }

  stop() {
    if (this.server) {
      this.server.close();
      console.log('✓ 服务器已关闭');
    }
  }
}

// 如果要启动演示服务器
const shouldStartServer = process.argv.includes('--server');

if (shouldStartServer) {
  console.log('启动安全演示服务器...\n');
  const secureServer = new SecureHTTPServer(3000);
  secureServer.start();

  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    secureServer.stop();
    process.exit(0);
  });
} else {
  console.log('💡 提示: 使用 "node educational-demo.js --server" 启动演示服务器');
  console.log('');
}

console.log('📚 更多信息请参考 README.md 和其他演示文件\n');
