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
        // Example: FRONTEND_URL: "http://3.110.223.244"
        FRONTEND_URL: "",
        MONGO_URI: "",
        SESSION_SECRET: "",
        COGNITO_CLIENT_ID: "",
        COGNITO_SECRET: "",
        // Comma-separated list of allowed redirect URIs. MUST include FRONTEND_URL
        // Example: "http://3.110.223.244/auth/callback,http://3.110.223.244"
        COGNITO_REDIRECT_URI: ""
      }
    }
  ]
};
