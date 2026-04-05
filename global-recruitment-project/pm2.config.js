# ============================================
# Jobsbor PM2 配置文件
# ============================================
# 
# 使用说明：
# 1. 给脚本添加执行权限：chmod +x pm2.config.js
# 2. 启动应用：pm2 start pm2.config.js
# 3. 保存配置：pm2 save
# 4. 设置开机自启：pm2 startup
#
# 【注意】此配置用于SSR模式，静态导出模式不需要PM2
# ============================================

module.exports = {
  apps: [{
    // 应用名称（显示在pm2 list中）
    name: 'jobsbor',
    
    // 启动命令 - 使用npm start
    script: 'npm',
    args: 'start',
    
    // 工作目录 - 【用户需要修改这里】
    cwd: '/var/www/jobsbor',
    
    // 实例数（静态导出不需要多实例，SSR可以开多个）
    // max 表示根据CPU核心数自动分配
    instances: 1,
    
    // 执行模式
    // fork: 简单模式，适合单实例
    // cluster: 集群模式，适合多实例
    exec_mode: 'fork',
    
    // 自动重启（崩溃后自动重启）
    autorestart: true,
    
    // 不监视文件变化（生产环境）
    watch: false,
    
    // 忽略的文件变化
    ignore_watch: [
      'node_modules',
      'logs',
      '.git',
      'dist',
      '*.log'
    ],
    
    // 内存超过1G自动重启（防止内存泄漏）
    max_memory_restart: '1G',
    
    // 环境变量
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // ============================================
    // 日志配置
    // ============================================
    
    // 日志日期格式
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // 错误日志文件路径
    error_file: './logs/err.log',
    
    // 输出日志文件路径
    out_file: './logs/out.log',
    
    // 合并日志（错误和输出写入同一个文件）
    merge_logs: true,
    
    // 日志类型
    log_type: 'json',
    
    // 禁用日志（调试用）
    // disable_logs: false,
    
    // ============================================
    // 进程管理
    // ============================================
    
    // 最小运行时间（小于此时间重启会被认为是崩溃）
    min_uptime: '10s',
    
    // 异常退出后重启延迟（毫秒）
    restart_delay: 3000,
    
    // 最大重启次数（超过后停止重启）
    max_restarts: 10,
    
    // 杀死进程超时时间（毫秒）
    kill_timeout: 5000,
    
    // 监听端口（PM2会等待此端口启动后才认为启动成功）
    listen_timeout: 10000,
    
    // ============================================
    // 高级配置
    // ============================================
    
    // 优雅关机（收到SIGINT信号后等待此时间再强制退出）
    kill_retry_time: 3000,
    
    // 源地图支持（用于错误追踪）
    source_map_support: true,
    
    // 实例变量（多实例时每个实例可以有不同的变量）
    instance_var: 'INSTANCE_ID'
  }]
}
