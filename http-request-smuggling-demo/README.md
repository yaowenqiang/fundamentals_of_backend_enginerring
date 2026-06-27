# HTTP Request Smuggling 教育演示

> ⚠️ **教育目的**: 此项目仅用于网络安全教育和防御技术学习，帮助开发者理解和防护 HTTP Request Smuggling 攻击。

## 项目简介

HTTP Request Smuggling 是一种 Web 安全漏洞，攻击者通过发送格式畸形的 HTTP 请求来欺骗前端服务器和后端服务器，使它们对请求边界的处理不一致。

## 学习目标

通过本项目，你将学习：

1. HTTP Request Smuggling 的攻击原理
2. 不同类型的 Smuggling 技术
3. 如何检测此类漏洞
4. 如何实施有效的防御措施

## 常见攻击类型

### 1. CL.TE (Content-Length vs Transfer-Encoding)
前端使用 Content-Length，后端使用 Transfer-Encoding

### 2. TE.CL (Transfer-Encoding vs Content-Length)  
前端使用 Transfer-Encoding，后端使用 Content-Length

### 3. TE.TE (Transfer-Encoding vs Transfer-Encoding)
两端都使用 Transfer-Encoding，但处理方式不同

## 攻击原理

```
正常情况:
前端: 解析请求边界 → 转发 → 后端: 解析请求边界

Smuggling 攻击:
前端: 按一种方式解析边界
后端: 按另一种方式解析边界
结果: 请求边界不一致 → 请求走私
```

## 项目文件

- `vulnerable-server.js` - 演示漏洞的服务器
- `smuggling-techniques.js` - 不同攻击技术的演示
- `detection-tools.js` - 漏洞检测工具
- `defense-measures.js` - 防御措施实现
- `educational-demo.js` - 教育性演示

## 使用方法

### 基本演示
```bash
node educational-demo.js
```

### 演示具体技术
```bash
node smuggling-techniques.js
```

### 运行检测工具
```bash
node detection-tools.js
```

### 防御措施演示
```bash
node defense-measures.js
```

## 防御建议

1. **统一请求处理**: 确保前端和后端服务器对 HTTP 请求的处理一致
2. **规范化请求头**: 明确拒绝有歧义的请求头
3. **使用现代框架**: 使用已知的防护框架和服务器
4. **定期安全审计**: 定期进行安全测试和代码审计
5. **监控异常行为**: 监控异常的请求模式和响应

## 技术细节

### Content-Length vs Transfer-Encoding

**Content-Length**:
```
POST / HTTP/1.1
Host: example.com
Content-Length: 10

1234567890
```

**Transfer-Encoding: chunked**:
```
POST / HTTP/1.1
Host: example.com
Transfer-Encoding: chunked

A
1234567890
0

```

### Smuggling 示例

**CL.TE 示例**:
```
POST / HTTP/1.1
Host: example.com
Content-Length: 10
Transfer-Encoding: chunked

0
SMUGGLED
```

## 安全警告

⚠️ **重要提醒**:
- 此项目仅用于教育和学习目的
- 不要在生产环境或未经授权的系统上测试
- 不要用于恶意目的
- 遵守当地法律法规

## 学习资源

- [PortSwigger HTTP Request Smuggling](https://portswigger.net/web-security/request-smuggling)
- [OWASP HTTP Request Smuggling](https://owasp.org/www-community/attacks/HTTP_Request_Smuggling)
- [RFC 7230 - HTTP/1.1 Message Syntax](https://tools.ietf.org/html/rfc7230)

## 许可证

MIT License - 教育用途
