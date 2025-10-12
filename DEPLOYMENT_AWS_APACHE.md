# Deploying Snatchers to AWS EC2 (Apache friendly)

This guide shows how to host the React frontend with Apache (httpd) as a static site and run the Node.js backend as a systemd service on an Ubuntu EC2 instance. It assumes a single VM will host both frontend and backend and Apache will proxy API requests to the local Node process.

Quick overview:
- Apache serves the React `build/` files from `/var/www/snatchers`.
- Apache proxies requests starting with `/api` (and other backend routes) to the Node backend running on `http://127.0.0.1:5000`.
- The Node backend runs as a systemd service and reads configuration from an environment file.

Prerequisites
- An AWS EC2 instance (Ubuntu 22.04 / 20.04 recommended).
- Domain name pointing to the EC2 public IP (recommended for SSL).
- Security group allowing inbound 22 (SSH), 80 (HTTP), and 443 (HTTPS).

Files included in this repo (examples you can copy to EC2):
- `deploy/apache_vhost.conf` - example VirtualHost to place under `/etc/apache2/sites-available/snatchers.conf`.
- `deploy/snatchers-backend.service` - example systemd unit for the backend.
- `deploy/deploy.sh` - helper script (opinionated) to bootstrap an Ubuntu machine. Review and edit before running.

High level steps (summary)
1. SSH to the EC2 server.
2. Install Node.js, npm, git, Apache, Certbot (optional for SSL).
3. Clone this repo (or copy project files) to `/home/ubuntu/snatchers` (or a path you prefer).
4. Build the frontend and copy `build/` to `/var/www/snatchers`.
5. Install backend dependencies and create `/etc/snatchers-backend.env` with env vars.
6. Put `deploy/snatchers-backend.service` into `/etc/systemd/system/` and enable/start it.
7. Put `deploy/apache_vhost.conf` into `/etc/apache2/sites-available/snatchers.conf`, enable the site and reload Apache.
8. (Optional) Issue an SSL certificate with Certbot: `sudo certbot --apache -d yourdomain.com`

Detailed commands (run these on the EC2 instance). Edit values before running.

Replace these placeholders before running:
- REPO_URL: the git URL of your repository.
- APP_USER: the system user that should own files (e.g., `ubuntu`).
- DOMAIN: your domain (e.g., `snatchers.in`).

Example sequence (copy & edit as needed):

```bash
# update and install base packages
sudo apt update && sudo apt -y upgrade
sudo apt install -y git curl build-essential apache2

# Install Node.js 18 LTS (change if you want a different version)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# (optional) certbot for Let's Encrypt
sudo apt install -y snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Clone repo (example path)
cd /home/ubuntu
git clone REPO_URL snatchers
cd snatchers

# Build frontend
cd Snatchers_Frontend/snatchers.in-main
npm ci
npm run build

# Deploy frontend to Apache docroot
sudo mkdir -p /var/www/snatchers
sudo rm -rf /var/www/snatchers/*
sudo cp -r build/* /var/www/snatchers/
sudo chown -R www-data:www-data /var/www/snatchers

# Install backend deps
cd ../../Snatchers_Backend/snatchers-backend-main
npm ci

# Create environment file for backend (edit values)
sudo tee /etc/snatchers-backend.env > /dev/null <<'EOF'
# Example environment file for snatchers backend
PORT=5000
MONGO_URI=your_mongo_connection_string
SHIPROCKET_EMAIL=you@example.com
SHIPROCKET_PASSWORD=yourpassword
# Add other environment vars used in your server (COGNITO settings, CLOUDINARY, JWT secrets, etc.)
EOF
Suggested environment variables to add to `/etc/snatchers-backend.env`:

```bash
# Backend port
PORT=5000

# MongoDB connection
MONGO_URI=your_mongo_connection_string

# AWS Cognito
COGNITO_USER_POOL_ID=<YOUR_REGION>_XXXXXXXXX
COGNITO_USER_POOL_CLIENT_ID=<YOUR_CLIENT_ID>
COGNITO_REGION=<YOUR_REGION>

# Other secrets
# CLOUDINARY_URL=...
# JWT_SECRET=...
```

# Install systemd service and Apache vhost
sudo cp deploy/snatchers-backend.service /etc/systemd/system/snatchers-backend.service
sudo cp deploy/apache_vhost.conf /etc/apache2/sites-available/snatchers.conf
sudo a2enmod proxy proxy_http rewrite headers
sudo a2ensite snatchers
sudo systemctl daemon-reload
sudo systemctl enable --now snatchers-backend.service
sudo systemctl restart apache2

# (Optional) Obtain SSL cert via Certbot
# sudo certbot --apache -d DOMAIN -d www.DOMAIN
```

Notes & troubleshooting
- If your backend listens on a different port, update `deploy/apache_vhost.conf` ProxyPass target and `PORT` in `/etc/snatchers-backend.env`.
- If files are owned by a different user, adjust `chown` accordingly.
- Check backend logs with: `sudo journalctl -u snatchers-backend -f`.
- Check Apache config: `sudo apachectl configtest`.

Security
- Keep secrets out of git. Use `/etc/snatchers-backend.env` or a secret manager.
- Use a firewall/security group to only expose ports 22,80,443.

If you'd like, I can:
- create a systemd-runner script that automatically copies the correct paths from this repo after a `git pull`.
- generate a production-ready Nginx config instead (Nginx is more common for reverse proxy + static files, but Apache is fully supported).

End of guide.
