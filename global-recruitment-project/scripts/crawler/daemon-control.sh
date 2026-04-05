#!/bin/bash
# 启动实时爬虫守护进程
# 在后台持续运行，检测新职位并自动部署

CRAWLER_DIR="/root/.openclaw/workspace/recruitment-site/scripts/crawler"
LOG_FILE="/var/log/crawler-daemon.log"
PID_FILE="/var/run/crawler-daemon.pid"

case "$1" in
  start)
    echo "🚀 启动实时爬虫守护进程..."
    
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "⚠️ 守护进程已在运行 (PID: $(cat $PID_FILE))"
      exit 1
    fi
    
    nohup node "$CRAWLER_DIR/realtime-daemon.js" >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "✅ 守护进程已启动 (PID: $(cat $PID_FILE))"
    echo "📋 日志: tail -f $LOG_FILE"
    ;;
    
  stop)
    if [ -f "$PID_FILE" ]; then
      PID=$(cat "$PID_FILE")
      if kill -0 "$PID" 2>/dev/null; then
        kill "$PID"
        rm -f "$PID_FILE"
        echo "🛑 守护进程已停止"
      else
        echo "⚠️ 进程不存在"
        rm -f "$PID_FILE"
      fi
    else
      echo "⚠️ 未找到PID文件"
    fi
    ;;
    
  restart)
    $0 stop
    sleep 2
    $0 start
    ;;
    
  status)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "🟢 守护进程运行中 (PID: $(cat $PID_FILE))"
      echo "📊 最近日志:"
      tail -10 "$LOG_FILE" 2>/dev/null || echo "暂无日志"
    else
      echo "🔴 守护进程未运行"
    fi
    ;;
    
  log)
    tail -f "$LOG_FILE"
    ;;
    
  *)
    echo "用法: $0 {start|stop|restart|status|log}"
    echo ""
    echo "命令:"
    echo "  start   - 启动守护进程"
    echo "  stop    - 停止守护进程"
    echo "  restart - 重启守护进程"
    echo "  status  - 查看状态"
    echo "  log     - 查看实时日志"
    exit 1
    ;;
esac
