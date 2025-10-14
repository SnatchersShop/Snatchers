module.exports = {
  apps: [
    {
      name: "snatchers-backend",
      script: "server.js",
      cwd: "/var/www/snatchers/Snatchers_Backend/snatchers-backend-main",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 5000,
        MONGO_URI: "mongodb://username:password@host:27017/dbname",
        FRONTEND_URL: "http://3.110.223.244",
        COGNITO_REDIRECT_URI: "http://3.110.223.244/auth/callback",
        COGNITO_CLIENT_ID: "<your-cognito-client-id>",
        COGNITO_SECRET: "<your-cognito-secret-if-used>"
      }
    }
  ]
};
