module.exports = {
  apps: [
    {
      name: 'jobsbor-realtime-monitor',
      script: './scripts/crawler/realtime-daemon.js',
      cwd: '/root/.openclaw/workspace/recruitment-site',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      log_file: './logs/realtime-monitor.log',
      out_file: './logs/realtime-monitor-out.log',
      error_file: './logs/realtime-monitor-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 5000
    },
    {
      name: 'jobsbor-company-crawler',
      script: './scripts/crawler/company-official-v6.js',
      cwd: '/root/.openclaw/workspace/recruitment-site',
      instances: 1,
      autorestart: true,
      cron_restart: '0 */2 * * *',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      },
      log_file: './logs/company-crawler.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
