#!/bin/bash

# HTTP Request Smuggling 教育演示测试脚本

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     HTTP Request Smuggling 教育演示                       ║"
echo "║     仅用于教育和安全学习目的                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请安装 Node.js 14.0.0 或更高版本"
    exit 1
fi

echo "✅ Node.js 版本检查通过"
echo ""

# 显示菜单
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "请选择演示模式:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 教育演示:"
echo "  1. 基础教育演示 (推荐)"
echo "  2. 教育演示 + 安全服务器"
echo ""
echo "🔧 技术演示:"
echo "  3. 攻击技术详解"
echo "  4. 检测工具演示"
echo "  5. 防御措施演示"
echo ""
echo "🛡️  安全测试:"
echo "  6. 启动安全防护服务器"
echo ""
echo "🎯 完整演示:"
echo "  7. 运行所有演示 (推荐用于全面学习)"
echo ""
echo "ℹ️  信息:"
echo "  8. 查看项目信息"
echo "  9. 退出"
echo ""

read -p "请输入选择 (1-9): " choice

case $choice in
    1)
        echo ""
        echo "📚 启动基础教育演示..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node educational-demo.js
        ;;

    2)
        echo ""
        echo "📚 启动教育演示 + 安全服务器..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node educational-demo.js --server
        ;;

    3)
        echo ""
        echo "🔧 攻击技术演示..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node smuggling-techniques.js
        ;;

    4)
        echo ""
        echo "🔍 检测工具演示..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node detection-tools.js
        ;;

    5)
        echo ""
        echo "🛡️  防御措施演示..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node defense-measures.js
        ;;

    6)
        echo ""
        echo "🛡️  启动安全防护服务器..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node defense-measures.js --server
        ;;

    7)
        echo ""
        echo "🎯 运行完整演示套件..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        echo "【1/5】基础教育演示"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        node educational-demo.js
        echo ""

        read -p "按 Enter 键继续下一个演示..."

        echo ""
        echo "【2/5】攻击技术演示"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        node smuggling-techniques.js
        echo ""

        read -p "按 Enter 键继续下一个演示..."

        echo ""
        echo "【3/5】检测工具演示"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        node detection-tools.js
        echo ""

        read -p "按 Enter 键继续下一个演示..."

        echo ""
        echo "【4/5】防御措施演示"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        node defense-measures.js
        echo ""

        read -p "按 Enter 键继续下一个演示..."

        echo ""
        echo "【5/5】启动安全服务器演示"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        node defense-measures.js --server
        ;;

    8)
        echo ""
        echo "📊 项目信息"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "项目名称: HTTP Request Smuggling 教育演示"
        echo "版本: 1.0.0"
        echo "Node.js 版本: $(node --version)"
        echo "操作系统: $(uname -s)"
        echo ""
        echo "项目文件:"
        ls -1 *.js *.md *.json *.sh 2>/dev/null | nl
        echo ""
        echo "项目结构:"
        echo "  • educational-demo.js - 基础教育演示"
        echo "  • smuggling-techniques.js - 攻击技术详解"
        echo "  • detection-tools.js - 检测工具演示"
        echo "  • defense-measures.js - 防御措施实现"
        echo "  • README.md - 详细文档"
        echo ""
        echo "使用方法:"
        echo "  npm start          - 运行基础演示"
        echo "  npm run techniques - 攻击技术演示"
        echo "  npm run detect     - 检测工具演示"
        echo "  npm run defense    - 防御措施演示"
        echo ""
        ;;

    9)
        echo "👋 感谢使用 HTTP Request Smuggling 教育演示！"
        echo "📚 请记住这些知识仅用于教育和防御目的"
        exit 0
        ;;

    *)
        echo "❌ 无效选择，请重新运行脚本"
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "演示完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 提示:"
echo "  • 查看更多信息请阅读 README.md"
echo "  • 这仅用于教育目的，请勿用于未经授权的测试"
echo "  • 实施防御措施以保护您的应用"
echo ""
