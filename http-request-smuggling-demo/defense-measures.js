/**
 * HTTP Request Smuggling 防御措施实现
 *
 * 提供实用的防护工具和最佳实践
 */

const http = require('http');
const url = require('url');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║       HTTP Request Smuggling 防御措施                    ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// ==========================================
// 安全请求处理器
// ==========================================
class SecureRequestHandler {
  constructor(options = {}) {
    this.options = {
      allowContentLengthAndTE: false,        // 是否允许同时存在 CL 和 TE
      normalizeChunkedEncoding: true,         // 规范化 chunked 编码
      validateContentLength: true,           // 验证 Content-Length 值
      maxContentLength: 10 * 1024 * 1024,   // 最大内容长度 10MB
      logSuspiciousRequests: true,            // 记录可疑请求
      blockSuspiciousRequests: false,        // 是否阻止可疑请求
      ...options
    };

    this.suspiciousRequests = [];
  }

  // 处理传入请求
  processRequest(req) {
    const issues = [];
    let shouldBlock = false;

    // 检查同时存在 Content-Length 和 Transfer-Encoding
    if (req.headers['content-length'] && req.headers['transfer-encoding']) {
      if (!this.options.allowContentLengthAndTE) {
        issues.push('同时存在 Content-Length 和 Transfer-Encoding');
        shouldBlock = this.options.blockSuspiciousRequests;

        // 根据策略，移除其中一个
        if (this.options.normalizeChunkedEncoding) {
          delete req.headers['transfer-encoding'];
        } else {
          delete req.headers['content-length'];
        }
      }
    }

    // 验证 Content-Length 值
    if (this.options.validateContentLength && req.headers['content-length']) {
      const contentLength = parseInt(req.headers['content-length']);
      if (isNaN(contentLength) || contentLength < 0) {
        issues.push('Content-Length 值无效');
        shouldBlock = true;
      } else if (contentLength > this.options.maxContentLength) {
        issues.push(`Content-Length 超过最大限制: ${contentLength} > ${this.options.maxContentLength}`);
        shouldBlock = true;
      }
    }

    // 规范化 Transfer-Encoding
    if (this.options.normalizeChunkedEncoding && req.headers['transfer-encoding']) {
      const te = req.headers['transfer-encoding'].toString().toLowerCase().trim();
      if (te !== 'chunked' || req.headers['transfer-encoding'].toString().includes(',')) {
        issues.push('Transfer-Encoding 格式异常');
        if (!shouldBlock) {
          shouldBlock = this.options.blockSuspiciousRequests;
          delete req.headers['transfer-encoding'];
        }
      }
    }

    // 记录可疑请求
    if (issues.length > 0 && this.options.logSuspiciousRequests) {
      this.suspiciousRequests.push({
        timestamp: new Date().toISOString(),
        ip: req.socket.remoteAddress,
        method: req.method,
        url: req.url,
        headers: req.headers,
        issues: issues
      });
    }

    return {
      safe: !shouldBlock,
      issues: issues,
      processedRequest: req
    };
  }

  // 获取可疑请求日志
  getSuspiciousRequests() {
    return this.suspiciousRequests;
  }

  // 生成安全报告
  generateSecurityReport() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('【安全报告】');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log(`配置选项:`);
    Object.entries(this.options).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
    console.log('');

    console.log(`可疑请求数量: ${this.suspiciousRequests.length}`);

    if (this.suspiciousRequests.length > 0) {
      console.log('\n最近的可疑请求:');
      const recent = this.suspiciousRequests.slice(-5);
      recent.forEach((req, index) => {
        console.log(`${index + 1}. ${req.timestamp}`);
        console.log(`   IP: ${req.ip}`);
        console.log(`   ${req.method} ${req.url}`);
        console.log(`   问题: ${req.issues.join(', ')}`);
        console.log('');
      });
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

// ==========================================
// 安全 HTTP 服务器
// ==========================================
class SecureHTTPServer {
  constructor(port, options = {}) {
    this.port = port;
    this.requestHandler = new SecureRequestHandler(options);
    this.server = null;
  }

  start() {
    this.server = http.createServer((req, res) => {
      // 处理请求安全性
      const result = this.requestHandler.processRequest(req);

      if (!result.safe) {
        console.log('⚠️  阻止可疑请求:', req.url, result.issues);
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('错误: 请求格式异常');
        return;
      }

      // 正常处理请求
      req.on('data', (chunk) => {
        // 安全处理数据
      });

      req.on('end', () => {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(this.getSuccessPage(req));
      });
    });

    this.server.listen(this.port, () => {
      console.log(`✓ 安全服务器启动在端口 ${this.port}`);
      console.log(`✓ 访问 http://localhost:${this.port} 测试防护措施\n`);
    });
  }

  getSuccessPage(req) {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>HTTP Request Smuggling 防护演示</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
        h1 { color: #2c3e50; }
        .status { background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .info { background: #d1ecf1; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .success { background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; }
        code { background: #f8f9fa; padding: 2px 5px; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ HTTP Request Smuggling 防护演示</h1>

        <div class="success">
            <h3>✓ 安全请求处理</h3>
            <p>您的请求已通过安全检查，这是一个受保护的系统。</p>
        </div>

        <div class="info">
            <h3>📊 请求信息</h3>
            <p><strong>方法:</strong> ${req.method}</p>
            <p><strong>路径:</strong> ${req.url}</p>
            <p><strong>用户代理:</strong> ${req.headers['user-agent'] || '未知'}</p>
        </div>

        <div class="status">
            <h3>🔒 启用的防护措施</h3>
            <ul>
                <li>HTTP 头部验证和规范化</li>
                <li>Content-Length 和 Transfer-Encoding 检查</li>
                <li>请求大小限制</li>
                <li>可疑请求监控和日志记录</li>
                <li>异常请求自动阻止</li>
            </ul>
        </div>

        <div class="warning">
            <h3>⚠️ 安全提醒</h3>
            <p>此服务器实施了针对 HTTP Request Smuggling 的防护措施。</p>
            <p>所有请求都会经过严格的安全检查和验证。</p>
        </div>

        <div class="info">
            <h3>💡 测试建议</h3>
            <p>您可以尝试发送包含以下特征的请求来测试防护效果：</p>
            <ul>
                <li>同时包含 Content-Length 和 Transfer-Encoding</li>
                <li>异常的 Transfer-Encoding 值</li>
                <li>无效的 Content-Length 值</li>
                <li>超过大小限制的请求</li>
            </ul>
        </div>
    </div>
</body>
</html>
    `;
  }

  stop() {
    if (this.server) {
      this.server.close();
      console.log('✓ 服务器已关闭');
    }
  }

  // 获取安全统计
  getSecurityStats() {
    return {
      suspiciousRequests: this.requestHandler.getSuspiciousRequests().length,
      options: this.requestHandler.options
    };
  }

  // 生成安全报告
  generateSecurityReport() {
    this.requestHandler.generateSecurityReport();
  }
}

// ==========================================
// 请求验证中间件
// ==========================================
class SecurityMiddleware {
  constructor(options = {}) {
    this.handler = new SecureRequestHandler(options);
  }

  // Express 中间件
  expressMiddleware() {
    return (req, res, next) => {
      const result = this.handler.processRequest(req);

      if (!result.safe) {
        console.log('⚠️  阻止可疑请求:', req.url, result.issues);
        return res.status(400).json({
          error: '请求格式异常',
          issues: result.issues
        });
      }

      next();
    };
  }

  // Node.js http 中间件
  httpMiddleware(callback) {
    return (req, res) => {
      const result = this.handler.processRequest(req);

      if (!result.safe) {
        console.log('⚠️  阻止可疑请求:', req.url, result.issues);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: '请求格式异常',
          issues: result.issues
        }));
        return;
      }

      callback(req, res);
    };
  }
}

// ==========================================
// 最佳实践指南
// ==========================================
function displayBestPractices() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【HTTP Request Smuggling 防御最佳实践】');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('1. 架构层面');
  console.log('   • 统一前后端请求处理逻辑');
  console.log('   • 使用相同的 HTTP 解析器');
  console.log('   • 避免不同服务器之间的解析差异');
  console.log('   • 实施统一的代理配置');
  console.log('');

  console.log('2. 请求验证');
  console.log('   • 验证所有请求头部');
  console.log('   • 拒绝有歧义的请求头组合');
  console.log('   • 验证 Content-Length 值');
  console.log('   • 规范化 Transfer-Encoding 处理');
  console.log('');

  console.log('3. 安全配置');
  console.log('   • 启用请求大小限制');
  console.log('   • 配置超时设置');
  console.log('   • 启用安全头部');
  console.log('   • 实施速率限制');
  console.log('');

  console.log('4. 监控和日志');
  console.log('   • 记录可疑请求');
  console.log('   • 监控异常模式');
  console.log('   • 设置告警机制');
  console.log('   • 定期审查日志');
  console.log('');

  console.log('5. 维护和更新');
  console.log('   • 定期更新服务器软件');
  console.log('   • 关注安全公告');
  console.log('   • 进行安全审计');
  console.log('   • 渗透测试');
  console.log('');

  console.log('6. 开发实践');
  console.log('   • 使用安全的编码实践');
  console.log('   • 实施输入验证');
  console.log('   • 最小权限原则');
  console.log('   • 安全代码审查');
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// ==========================================
// 防御配置示例
// ==========================================
function displayConfigurationExamples() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【防御配置示例】');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('Node.js Express 配置:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const expressExample = `
const express = require('express');
const { SecurityMiddleware } = require('./defense-measures');

const app = express();

// 创建安全中间件
const security = new SecurityMiddleware({
  allowContentLengthAndTE: false,
  normalizeChunkedEncoding: true,
  validateContentLength: true,
  maxContentLength: 10 * 1024 * 1024,
  logSuspiciousRequests: true,
  blockSuspiciousRequests: true
});

// 应用安全中间件
app.use(security.expressMiddleware());

// 正常路由
app.post('/api/data', (req, res) => {
  res.json({ message: '请求安全处理' });
});

app.listen(3000);
  `;
  console.log(expressExample);
  console.log('');

  console.log('Nginx 配置:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const nginxExample = `
server {
    listen 80;
    server_name example.com;

    # 防御 HTTP Request Smuggling
    client_body_buffer_size 10m;
    client_max_body_size 10m;
    client_body_timeout 12s;
    client_header_buffer_size 1k;

    # 确保头部标准化
    more_clear_headers 'Transfer-Encoding';

    # 限制请求大小
    client_header_timeout 12s;
    large_client_header_buffers 4 8k;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # 代理配置
        proxy_request_buffering off;
        proxy_buffering off;
    }
}
  `;
  console.log(nginxExample);
  console.log('');

  console.log('Apache 配置:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const apacheExample = `
<VirtualHost *:80>
    ServerName example.com

    # 限制请求大小
    LimitRequestBody 10485760
    LimitRequestFields 100
    LimitRequestFieldSize 8190
    LimitRequestLine 8190

    # 超时设置
    RequestReadTimeout header=12,body=12

    # 代理配置
    ProxyPreserveHost On
    ProxyPass / http://backend/
    ProxyPassReverse / http://backend/

    # 确保头部标准化
    RequestHeader unset Transfer-Encoding
</VirtualHost>
  `;
  console.log(apacheExample);
  console.log('');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

// ==========================================
// 运行演示
// ==========================================
async function runDemo() {
  console.log('【防御措施演示】\n');

  // 显示最佳实践
  displayBestPractices();

  // 显示配置示例
  displayConfigurationExamples();

  // 创建安全服务器实例
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('【创建安全服务器实例】');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const secureServer = new SecureHTTPServer(3000, {
    allowContentLengthAndTE: false,
    normalizeChunkedEncoding: true,
    validateContentLength: true,
    maxContentLength: 10 * 1024 * 1024,
    logSuspiciousRequests: true,
    blockSuspiciousRequests: true
  });

  console.log('✓ 安全服务器配置完成');
  console.log('✓ 可以使用以下命令启动服务器:');
  console.log('  node defense-measures.js --server');
  console.log('');
}

// 如果直接运行此文件
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--server')) {
    console.log('启动安全演示服务器...\n');
    const server = new SecureHTTPServer(3000, {
      allowContentLengthAndTE: false,
      normalizeChunkedEncoding: true,
      validateContentLength: true,
      maxContentLength: 10 * 1024 * 1024,
      logSuspiciousRequests: true,
      blockSuspiciousRequests: true
    });

    server.start();

    // 优雅关闭
    process.on('SIGINT', () => {
      console.log('\n正在关闭服务器...');
      server.generateSecurityReport();
      server.stop();
      process.exit(0);
    });

  } else {
    runDemo().then(() => {
      console.log('💡 提示: 使用 "node defense-measures.js --server" 启动安全服务器');
      console.log('📚 更多信息请参考 README.md\n');
    });
  }
}

// 导出工具类
module.exports = {
  SecureRequestHandler,
  SecureHTTPServer,
  SecurityMiddleware,
  displayBestPractices,
  displayConfigurationExamples
};
