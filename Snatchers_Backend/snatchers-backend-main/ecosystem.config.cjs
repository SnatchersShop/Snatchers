module.exports = {
  apps: [
    {
      name: "snatchers-backend",
      script: "npm",
      args: "start",
      cwd: __dirname,
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        // Replace the placeholders below with your real values before starting
        // Example: FRONTEND_URL: "https://3.110.223.244"
        FRONTEND_URL: "https://3.110.223.244",
        MONGO_URI: "mongodb+srv://snatchersshop:snatchersshop@snatchers.shwusoa.mongodb.net/?retryWrites=true&w=majority&appName=snatchers",
        SESSION_SECRET: "cbb80bfe18852212f473c52c4e96f36cd04acf689eecf80cbd4440f7907bae04",
        COGNITO_CLIENT_ID: "6d2t12ukv3eg46nokd8kecqv2c",
        COGNITO_SECRET: "lvkoast0qu05tj9nu7t5m9kc681sgom3a6hd7480o3oa6lr58fi",
        // Comma-separated list of allowed redirect URIs. MUST include FRONTEND_URL
        // Example: "http://3.110.223.244/auth/callback,http://3.110.223.244"
        COGNITO_REDIRECT_URI: "https://3.110.223.244/auth/callback,https://3.110.223.244"
      }
    }
  ]
};
