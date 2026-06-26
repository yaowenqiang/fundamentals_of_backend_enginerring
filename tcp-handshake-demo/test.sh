#!/bin/bash

# TCP 三次握手与四次挥手演示测试脚本

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     TCP 三次握手与四次挥手演示                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装"
    echo "请安装 Node.js 14.0.0 或更高版本"
    exit 1
fi

echo "请选择演示模式:"
echo ""
echo "1. 基本演示 - 简单的三次握手和四次挥手"
echo "2. 详细演示 - 多连接和完整说明"
echo "3. 状态机演示 - 可视化状态转换过程"
echo "4. 交互式演示 - 用户控制每一步 (推荐)"
echo "5. 全部演示 - 依次运行所有演示"
echo ""

read -p "请输入选择 (1-5): " choice

case $choice in
    1)
        echo ""
        echo "启动基本演示..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node handshake-teardown.js
        ;;
    2)
        echo ""
        echo "启动详细演示..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node detailed-demo.js
        ;;
    3)
        echo ""
        echo "启动状态机演示..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node state-machine.js
        ;;
    4)
        echo ""
        echo "启动交互式演示..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        node interactive-demo.js
        ;;
    5)
        echo ""
        echo "运行所有演示..."
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""

        echo "【1/4】基本演示"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        node handshake-teardown.js
        echo ""

        read -p "按 Enter 键继续下一个演示..."

        echo ""
        echo "【2/4】详细演示"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        node detailed-demo.js
        echo ""

        read -p "按 Enter 键继续下一个演示..."

        echo ""
        echo "【3/4】状态机演示"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        node state-machine.js
        echo ""

        read -p "按 Enter 键继续下一个演示..."

        echo ""
        echo "【4/4】交互式演示"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        node interactive-demo.js
        ;;
    *)
        echo "无效选择，请重新运行脚本"
        exit 1
        ;;
esac

echo ""
echo "演示完成！"
echo "如需重新演示，请重新运行此脚本"
