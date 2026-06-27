# HTTP Request Smuggling 教育演示 - 快速开始

> ⚠️ **重要提醒**: 此项目仅用于网络安全教育和防御技术学习

## 立即开始

```bash
# 最简单的方式 - 基础教育演示
node educational-demo.js

# 或使用测试脚本
./test.sh

# 使用 npm 命令
npm start
```

## 快速导航

### 📚 教育演示 (推荐从这里开始)
```bash
node educational-demo.js        # 基础知识演示
node educational-demo.js --server # 带 Web 服务器演示
```

### 🔧 技术演示
```bash
node smuggling-techniques.js    # 攻击技术详解
node detection-tools.js         # 检测工具演示
node defense-measures.js        # 防御措施演示
```

### 🛡️ 安全测试
```bash
node defense-measures.js --server  # 启动安全防护服务器
```

## 学习路径

### 1. 基础知识 (5分钟)
```bash
node educational-demo.js
```
学习 HTTP Request Smuggling 的基本概念和原理。

### 2. 攻击技术 (10分钟)
```bash
node smuggling-techniques.js
```
了解不同的攻击技术类型和工作原理。

### 3. 检测方法 (10分钟)
```bash
node detection-tools.js
```
学习如何检测和识别潜在的漏洞。

### 4. 防御措施 (15分钟)
```bash
node defense-measures.js
```
实施有效的防护措施和最佳实践。

### 5. 实践测试 (20分钟)
```bash
node defense-measures.js --server
```
启动安全服务器，测试防护效果。

## 30秒理解核心概念

### 什么是 HTTP Request Smuggling?

HTTP Request Smuggling 是一种 Web 安全漏洞，攻击者通过发送格式畸形的 HTTP 请求来欺骗服务器。

### 工作原理

```
正常情况:
前端 ──────> 后端 (双方理解一致 ✓)

Smuggling 攻击:
前端 ──────> 后端 (双方理解不一致 ✗)
         前端: 认为请求 A 结束
         后端: 认为 A+B 是一个请求 → 漏洞产生
```

### 主要攻击类型

1. **CL.TE**: Content-Length vs Transfer-Encoding
2. **TE.CL**: Transfer-Encoding vs Content-Length
3. **TE.TE**: Transfer-Encoding 处理不一致

## 快速命令参考

```bash
# 查看所有命令
npm run

# 教育演示
npm start              # 基础演示
npm run demo           # 带 Web 服务器

# 技术演示
npm run techniques     # 攻击技术
npm run detect         # 检测工具
npm run defense        # 防御措施

# 测试和服务器
npm run test           # 运行检测演示
npm run defense-server # 启动安全服务器
```

## 项目结构

```
http-request-smuggling-demo/
├── educational-demo.js      # 基础教育演示 ⭐
├── smuggling-techniques.js  # 攻击技术演示
├── detection-tools.js      # 检测工具演示
├── defense-measures.js     # 防御措施演示
├── test.sh                # 交互式测试脚本
├── package.json           # 项目配置
├── README.md              # 详细文档
└── QUICKSTART.md          # 本文件
```

## 安全提醒

⚠️ **使用此项目前请务必了解**:

1. **教育目的**: 仅用于网络安全学习和防御技术
2. **合法使用**: 不要在未经授权的系统上测试
3. **道德规范**: 遵守当地法律法规
4. **责任自负**: 使用风险自负

## 防御建议

### 立即可实施的防护

1. **验证请求头**
```javascript
// 拒绝同时存在 Content-Length 和 Transfer-Encoding
if (req.headers['content-length'] && req.headers['transfer-encoding']) {
  return res.status(400).send('Invalid request headers');
}
```

2. **规范化处理**
```javascript
// 统一使用 Content-Length
delete req.headers['transfer-encoding'];
```

3. **限制大小**
```javascript
// 设置最大请求大小
app.use(express.json({ limit: '10mb' }));
```

## 下一步学习

- 📖 阅读 [README.md](README.md) 了解详细技术信息
- 🛡️ 运行 `node defense-measures.js` 学习防御实施
- 🔍 运行 `node detection-tools.js` 了解检测方法
- 🎯 运行 `./test.sh` 选择合适的演示模式

## 常见问题

**Q: 我可以在生产环境使用这些代码吗？**
A: 可以参考防御措施的代码，但需要进行适当的修改和测试。

**Q: 这些演示会攻击我的系统吗？**
A: 不会。这些演示在本地运行，不涉及实际的网络攻击。

**Q: 如何测试我自己的服务器是否安全？**
A: 使用 `node detection-tools.js` 中的方法进行安全审计。

**Q: 有哪些推荐的资源？**
A: 查看 README.md 中的学习资源部分。

## 技术支持

如有问题或建议，请：
1. 查看 README.md 详细文档
2. 检查代码中的注释
3. 参考官方安全指南

---

**开始学习**: `node educational-demo.js` 🚀

**记住**: 安全知识 = 防御能力，请负责任地使用！🔒
