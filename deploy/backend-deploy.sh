#!/usr/bin/env bash
set -euo pipefail

# Backend deploy script using systemd (not PM2)
# Usage: run on backend server as the deploy user (or CI via sudo when needed)

REPO_DIR=${REPO_DIR:-/opt/snatchers}
BACKEND_DIR="$REPO_DIR/Snatchers_Backend/snatchers-backend-main"
SERVICE_NAME=${SERVICE_NAME:-snatchers-backend}

echo "Deploying backend from $REPO_DIR"

cd "$REPO_DIR"
if [ -d .git ]; then
  git fetch --all
  git reset --hard origin/master
else
  git clone https://github.com/SnatchersShop/Snatchers.git .
fi

cd "$BACKEND_DIR"
echo "Installing backend dependencies (production)..."
npm install --production

echo "Ensuring systemd unit is installed (if service file changed, copy manually to /etc/systemd/system/)"
# reload systemd in case service file changed; requires sudo
if [ "$(id -u)" -eq 0 ]; then
  systemctl daemon-reload || true
  echo "Enabling and restarting $SERVICE_NAME.service"
  systemctl enable --now "$SERVICE_NAME.service"
  systemctl restart "$SERVICE_NAME.service"
  systemctl status "$SERVICE_NAME.service" --no-pager
else
  echo "Not root - attempting to restart via sudo"
  sudo systemctl daemon-reload || true
  sudo systemctl enable --now "$SERVICE_NAME.service"
  sudo systemctl restart "$SERVICE_NAME.service"
  sudo systemctl status "$SERVICE_NAME.service" --no-pager
fi

echo "Backend deploy complete"
