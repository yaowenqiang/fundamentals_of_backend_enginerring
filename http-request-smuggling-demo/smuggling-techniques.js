/**
 * HTTP Request Smuggling 攻击技术演示
 *
 * ⚠️ 教育目的: 此文件仅用于理解攻击原理，帮助实施防御
 */

const http = require('http');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║       HTTP Request Smuggling 攻击技术演示                ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// ==========================================
// HTTP 请求构建器
// ==========================================
class HTTPRequestBuilder {
  constructor() {
    this.method = 'GET';
    this.url = '/';
    this.headers = {};
    this.body = '';
  }

  setMethod(method) {
    this.method = method;
    return this;
  }

  setURL(url) {
    this.url = url;
    return this;
  }

  addHeader(name, value) {
    this.headers[name] = value;
    return this;
  }

  setBody(body) {
    this.body = body;
    return this;
  }

  build() {
    let request = `${this.method} ${this.url} HTTP/1.1\r\n`;

    // 添加头部
    for (const [name, value] of Object.entries(this.headers)) {
      request += `${name}: ${value}\r\n`;
    }

    // 添加空行分隔头部和主体
    request += '\r\n';

    // 添加主体
    request += this.body;

    return request;
  }
}

// ==========================================
// CL.TE 攻击演示
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【CL.TE 攻击技术】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('攻击原理:');
console.log('• 前端服务器使用 Content-Length 来确定请求边界');
console.log('• 后端服务器使用 Transfer-Encoding 来确定请求边界');
console.log('• 解析不一致导致请求走私');
console.log('');

// 构建 CL.TE 攻击请求示例
const clteRequest = new HTTPRequestBuilder()
  .setMethod('POST')
  .setURL('/admin')
  .addHeader('Host', 'example.com')
  .addHeader('Content-Length', '4')
  .addHeader('Transfer-Encoding', 'chunked')
  .setBody('50\r\nSMUGGLED\r\n0\r\n\r\n')
  .build();

console.log('【CL.TE 攻击请求示例】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(clteRequest);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('解析过程:');
console.log('');
console.log('前端服务器 (Content-Length):');
console.log('├─ 读取 Content-Length: 4');
console.log('├─ 读取 4 字节: "50\\r\\n"');
console.log('└─ 认为请求结束');
console.log('');
console.log('后端服务器 (Transfer-Encoding):');
console.log('├─ 看到 Transfer-Encoding: chunked');
console.log('├─ 解析 chunk 大小: 50 (十六进制 = 80 十进制)');
console.log('├─ 等待 80 字节数据');
console.log('└─ 认为请求未结束，等待更多数据 → SMUGGLING');
console.log('');

// ==========================================
// TE.CL 攻击演示
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【TE.CL 攻击技术】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('攻击原理:');
console.log('• 前端服务器使用 Transfer-Encoding 来确定请求边界');
console.log('• 后端服务器使用 Content-Length 来确定请求边界');
console.log('• 解析不一致导致请求走私');
console.log('');

// 构建 TE.CL 攻击请求示例
const teclRequest = new HTTPRequestBuilder()
  .setMethod('POST')
  .setURL('/login')
  .addHeader('Host', 'example.com')
  .addHeader('Content-Length', '6')
  .addHeader('Transfer-Encoding', 'chunked')
  .setBody('0\r\nSMUG\r\n')
  .build();

console.log('【TE.CL 攻击请求示例】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(teclRequest);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('解析过程:');
console.log('');
console.log('前端服务器 (Transfer-Encoding):');
console.log('├─ 看到 Transfer-Encoding: chunked');
console.log('├─ 解析第一个 chunk: 0 (表示结束)');
console.log('└─ 认为请求结束');
console.log('');
console.log('后端服务器 (Content-Length):');
console.log('├─ 读取 Content-Length: 6');
console.log('├─ 读取 6 字节: "0\\r\\nS"');
console.log('└─ 还有数据未读取，认为请求未完成 → SMUGGLING');
console.log('');

// ==========================================
// TE.TE 攻击演示
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【TE.TE 攻击技术】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('攻击原理:');
console.log('• 两端都使用 Transfer-Encoding');
console.log('• 但对模糊的 Transfer-Encoding 头部处理不同');
console.log('• 例如: "Transfer-Encoding: chunked, chunked" 或混淆大小写');
console.log('');

// 构建 TE.TE 攻击请求示例
const teteRequest = new HTTPRequestBuilder()
  .setMethod('POST')
  .setURL('/upload')
  .addHeader('Host', 'example.com')
  .addHeader('Transfer-Encoding', 'chunked, chunked')
  .setBody('0\r\n\r\nSMUGGLED_REQUEST')
  .build();

console.log('【TE.TE 攻击请求示例】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(teteRequest);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

console.log('解析过程:');
console.log('');
console.log('前端服务器:');
console.log('├─ 看到重复的 Transfer-Encoding');
console.log('├─ 可能拒绝请求或只处理第一个');
console.log('└─ 基于处理逻辑决定请求边界');
console.log('');
console.log('后端服务器:');
console.log('├─ 看到重复的 Transfer-Encoding');
console.log('├─ 可能接受所有头部或只处理最后一个');
console.log('└─ 不同的处理导致边界不一致 → SMUGGLING');
console.log('');

// ==========================================
// 高级技术: 头部混淆
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【高级技术: 头部混淆】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('攻击者可能使用各种技术来混淆服务器解析:');
console.log('');

// 头部名称混淆
console.log('1. 头部名称混淆:');
console.log('   Transfer-Encoding: chunked');
console.log('   Transfer-Encoding: Chunked');
console.log('   Transfer-Encoding: CHUNKED');
console.log('   transfer-encoding: chunked');
console.log('  TRANSFER-ENCODING: CHUNKED');
console.log('');

// 头部值混淆
console.log('2. 头部值混淆:');
console.log('   Transfer-Encoding: chunked');
console.log('   Transfer-Encoding: chunked , chunked');
console.log('   Transfer-Encoding: chunked,chunked');
console.log('   Transfer-Encoding:  chunked');
console.log('');

// 编码混淆
console.log('3. 编码混淆:');
console.log('   Transfer-Encoding: chu%E2%88%92ked');
console.log('   Transfer\\r\\n : chunked');
console.log('');

// ==========================================
// 检测技术
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【检测技术】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('自动化检测方法:');
console.log('');

class RequestSmugglingDetector {
  constructor() {
    this.vulnerabilities = [];
  }

  // 检测 CL.TE 漏洞
  detectCLTE(baseURL) {
    console.log('【检测 CL.TE 漏洞】');
    console.log(`目标: ${baseURL}`);

    // 检测步骤
    const steps = [
      '1. 发送包含 Content-Length 和 Transfer-Encoding 的请求',
      '2. Content-Length 设置为较小值',
      '3. Transfer-Encoding 设置为 chunked',
      '4. 观察响应是否异常',
      '5. 检查后续请求是否受到影响'
    ];

    steps.forEach(step => console.log(`   ${step}`));
    console.log('');

    // 示例检测请求
    console.log('检测请求示例:');
    const detectionRequest = `POST / HTTP/1.1\r\n` +
      `Host: ${baseURL}\r\n` +
      `Content-Length: 4\r\n` +
      `Transfer-Encoding: chunked\r\n` +
      `\r\n` +
      `50\r\nSMUGGLED\r\n0\r\n\r\n`;

    console.log(detectionRequest);
    console.log('');
  }

  // 检测 TE.CL 漏洞
  detectTECL(baseURL) {
    console.log('【检测 TE.CL 漏洞】');
    console.log(`目标: ${baseURL}`);

    const steps = [
      '1. 发送包含 Transfer-Encoding 和 Content-Length 的请求',
      '2. Transfer-Encoding 设置为 chunked',
      '3. Content-Length 设置为特定值',
      '4. 发送结束标记但内容长度不匹配',
      '5. 观察服务器响应'
    ];

    steps.forEach(step => console.log(`   ${step}`));
    console.log('');
  }

  // 通用检测方法
  generalDetection(baseURL) {
    console.log('【通用检测方法】');
    console.log(`目标: ${baseURL}`);

    const methods = [
      '时间差异分析',
      '响应内容检测',
      '请求反射测试',
      '状态码分析',
      '头部行为观察'
    ];

    methods.forEach(method => console.log(`• ${method}`));
    console.log('');
  }
}

// 创建检测器实例
const detector = new RequestSmugglingDetector();

// 运行检测演示
console.log('【检测演示】');
console.log('');

detector.detectCLTE('example.com');
detector.detectTECL('example.com');
detector.generalDetection('example.com');

// ==========================================
// 防御建议
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【防御建议】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('针对不同攻击类型的防御:');
console.log('');

console.log('CL.TE 防御:');
console.log('✓ 确保前端服务器忽略 Transfer-Encoding');
console.log('✓ 仅使用 Content-Length 处理请求边界');
console.log('✓ 或者统一使用 Transfer-Encoding');
console.log('');

console.log('TE.CL 防御:');
console.log('✓ 确保后端服务器忽略 Content-Length');
console.log('✓ 仅使用 Transfer-Encoding 处理请求边界');
console.log('✓ 规范化 chunked 编码处理');
console.log('');

console.log('TE.TE 防御:');
console.log('✓ 拒绝有歧义的 Transfer-Encoding 头部');
console.log('✓ 标准化头部处理逻辑');
console.log('✓ 拒绝重复或混淆的头部');
console.log('');

// ==========================================
// 总结
// ==========================================
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('【总结】');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');
console.log('HTTP Request Smuggling 攻击利用了前后端服务器对');
console.log('HTTP 请求边界解析的不一致性。');
console.log('');
console.log('关键要点:');
console.log('• 理解不同攻击类型的工作原理');
console.log('• 实施统一的请求处理逻辑');
console.log('• 定期进行安全测试和审计');
console.log('• 使用现代、安全的服务器配置');
console.log('');
console.log('⚠️  此信息仅用于教育和防御目的。');
console.log('请不要在未经授权的系统上进行测试。');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// 防御工具类
class RequestSmugglingDefense {
  constructor() {
    this.safeHeaders = true;
    this.unifiedParsing = true;
    this.monitoringEnabled = true;
  }

  // 验证请求头
  validateHeaders(headers) {
    const warnings = [];

    // 检查有歧义的头部组合
    if (headers['content-length'] && headers['transfer-encoding']) {
      warnings.push('同时存在 Content-Length 和 Transfer-Encoding');
    }

    // 检查 Transfer-Encoding 格式
    if (headers['transfer-encoding']) {
      const te = headers['transfer-encoding'].toString().toLowerCase().trim();
      if (te !== 'chunked' || headers['transfer-encoding'].toString().includes(',')) {
        warnings.push('Transfer-Encoding 头部格式异常');
      }
    }

    // 检查 Content-Length 值
    if (headers['content-length']) {
      const cl = parseInt(headers['content-length']);
      if (isNaN(cl) || cl < 0) {
        warnings.push('Content-Length 值无效');
      }
    }

    return warnings;
  }

  // 规范化请求
  normalizeRequest(req) {
    // 移除有歧义的头部
    if (req.headers['content-length'] && req.headers['transfer-encoding']) {
      // 根据策略选择保留哪个
      delete req.headers['transfer-encoding'];
    }

    // 规范化 Transfer-Encoding
    if (req.headers['transfer-encoding']) {
      const te = req.headers['transfer-encoding'].toString().toLowerCase().trim();
      if (te !== 'chunked') {
        delete req.headers['transfer-encoding'];
      }
    }

    return req;
  }
}

// 导出工具类
module.exports = {
  HTTPRequestBuilder,
  RequestSmugglingDetector,
  RequestSmugglingDefense
};

console.log('💡 提示: 此文件中的工具类可以用于其他脚本');
console.log('📚 更多信息请参考 README.md\n');
