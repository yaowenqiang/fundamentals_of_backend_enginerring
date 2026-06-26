#!/bin/bash

# TCP Multiplexing Demo 测试脚本

echo "==================================="
echo "TCP Multiplexing & Demultiplexing Demo"
echo "==================================="
echo ""

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装"
    exit 1
fi

echo "选择演示模式:"
echo "1. 完整演示 (推荐)"
echo "2. 手动演示 (需要两个终端)"
echo "3. 仅服务器"
echo "4. 仅客户端"
echo ""

read -p "请输入选择 (1-4): " choice

case $choice in
    1)
        echo "启动完整演示..."
        node detailed-demo.js
        ;;
    2)
        echo "==================================="
        echo "手动演示模式"
        echo "==================================="
        echo ""
        echo "请在终端 1 运行: node server.js"
        echo "请在终端 2 运行: node clients.js"
        echo ""
        echo "按 Ctrl+C 停止服务器"
        ;;
    3)
        echo "启动服务器..."
        node server.js
        ;;
    4)
        echo "启动客户端 (确保服务器已运行)..."
        node clients.js
        ;;
    *)
        echo "无效选择"
        exit 1
        ;;
esac
