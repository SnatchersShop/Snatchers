Backend deploy notes

- The `backend-deploy.sh` script in this folder now uses `systemctl` to enable and restart the `snatchers-backend` systemd service.
- Ensure you have copied `deploy/snatchers-backend.service` (or your customized unit) into `/etc/systemd/system/snatchers-backend.service` and created the environment file (example: `/etc/snatchers-backend.env` or update the unit to point to your `.env`) before running the deploy script.
- Run the script as root or via sudo: `sudo /opt/snatchers/deploy/backend-deploy.sh`.
