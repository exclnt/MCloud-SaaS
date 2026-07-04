/**
 * PM2 Ecosystem Configuration for MCloud SaaS (Production Environment - CommonJS version)
 * 
 * Usage:
 *   1. Start all services  : pm2 start ecosystem.config.cjs (or ecosystem.config.js)
 *   2. Save for autostart  : pm2 save && pm2 startup
 *   3. View live logs      : pm2 logs
 *   4. Monitor resource    : pm2 monit
 */

module.exports = {
  apps: [
    {
      name: 'mcloud-gateway',
      script: 'apps/api-gateway/src/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '350M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/gateway-error.log',
      out_file: './logs/gateway-out.log',
      merge_logs: true,
      time: true
    },
    {
      name: 'mcloud-auth',
      script: 'apps/auth-service/src/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '250M',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      error_file: './logs/auth-error.log',
      out_file: './logs/auth-out.log',
      merge_logs: true,
      time: true
    },
    {
      name: 'mcloud-payment',
      script: 'apps/payment-service/src/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      error_file: './logs/payment-error.log',
      out_file: './logs/payment-out.log',
      merge_logs: true,
      time: true
    },
    {
      name: 'mcloud-provisioning',
      script: 'apps/provisioning-service/src/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3003
      },
      error_file: './logs/provisioning-error.log',
      out_file: './logs/provisioning-out.log',
      merge_logs: true,
      time: true
    }
  ]
};
