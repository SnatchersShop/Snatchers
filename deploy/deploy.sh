#!/bin/bash
set -euo pipefail

# Simple deploy helper for Ubuntu (edit variables below before running)
REPO_URL="REPO_URL"
APP_USER="ubuntu"
DOMAIN="example.com"

echo "This script will perform an opinionated deploy. Edit variables in the file before running."

if [ "$EUID" -ne 0 ]; then
  echo "Run with sudo: sudo $0";
  exit 1;
fi

apt update && apt -y upgrade
apt install -y git curl build-essential apache2

# Node 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# snap/certbot (optional)
apt install -y snapd
snap install core; snap refresh core
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot || true

mkdir -p /home/${APP_USER}
chown ${APP_USER}:${APP_USER} /home/${APP_USER}

sudo -u ${APP_USER} bash -lc "cd /home/${APP_USER} && git clone ${REPO_URL} snatchers || (cd snatchers && git pull)"

# Build frontend
cd /home/${APP_USER}/snatchers/Snatchers_Frontend/snatchers.in-main
sudo -u ${APP_USER} npm ci
sudo -u ${APP_USER} npm run build

mkdir -p /var/www/snatchers
rm -rf /var/www/snatchers/*
cp -r build/* /var/www/snatchers/
chown -R www-data:www-data /var/www/snatchers

# Install backend
cd /home/${APP_USER}/snatchers/Snatchers_Backend/snatchers-backend-main
sudo -u ${APP_USER} npm ci

echo "Create /etc/snatchers-backend.env with your environment variables (MONGO_URI, etc.)"

cp deploy/snatchers-backend.service /etc/systemd/system/snatchers-backend.service
cp deploy/apache_vhost.conf /etc/apache2/sites-available/snatchers.conf
a2enmod proxy proxy_http rewrite headers
a2ensite snatchers
systemctl daemon-reload
systemctl enable --now snatchers-backend.service
systemctl restart apache2

echo "Deploy completed. Please edit /etc/snatchers-backend.env and run 'systemctl restart snatchers-backend' if needed."
