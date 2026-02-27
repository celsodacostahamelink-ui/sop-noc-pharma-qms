#!/bin/bash
# ══════════════════════════════════════════════════════════
# NOC Pharma QMS v1.0 — Hetzner Cloud Production Deploy
# 
# WHAT THIS DOES:
# 1. Creates a Hetzner Cloud server in Nuremberg (EU)
# 2. Installs Docker, PostgreSQL, the QMS app
# 3. Sets up HTTPS with auto-SSL (Caddy)
# 4. Configures daily backups
# 5. Creates firewall rules
#
# PREREQUISITES:
# - Hetzner Cloud account: https://console.hetzner.cloud
# - Hetzner API token (Project → Security → API Tokens → Generate)
# - A domain name pointed to Hetzner (optional, can use IP)
#
# COST: ~€7.50/month (CX22: 2 vCPU, 4GB RAM, 40GB SSD)
# ══════════════════════════════════════════════════════════
set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "🏛️  NOC Pharma QMS — Hetzner Production Deploy"
echo "   EU Data Residency | German Datacenter | BfArM-ready"
echo "══════════════════════════════════════════════════════"
echo ""

# ─── COLLECT INPUTS ──────────────────────────────────────
read -p "Hetzner API Token: " HETZNER_TOKEN
if [ -z "$HETZNER_TOKEN" ]; then
    echo "Get one at: Hetzner Console → Project → Security → API Tokens"
    exit 1
fi

read -p "Domain name (or press Enter to use IP only): " DOMAIN
read -p "Anthropic API Key: " ANTHROPIC_KEY
read -p "Server name [noc-pharma-qms]: " SERVER_NAME
SERVER_NAME=${SERVER_NAME:-noc-pharma-qms}

# Generate secrets
DB_PASS=$(openssl rand -hex 16)
AUTH_SECRET=$(openssl rand -base64 32)

echo ""
echo "Configuration:"
echo "  Server: ${SERVER_NAME} (CX22, Nuremberg)"
echo "  Domain: ${DOMAIN:-'IP only'}"
echo "  Cost:   ~€7.50/month"
echo ""
read -p "Proceed? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then exit 0; fi

# ─── CREATE SERVER ───────────────────────────────────────
echo ""
echo "Creating Hetzner server..."

# Cloud-init script that runs on first boot
CLOUD_INIT=$(cat << 'CLOUDINIT'
#!/bin/bash
set -e

# System update
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable docker

# Install Caddy (reverse proxy + auto-SSL)
apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update && apt install -y caddy

# Firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Create app directory
mkdir -p /opt/noc-qms/uploads
mkdir -p /backup

echo "Cloud-init complete" > /opt/noc-qms/.cloud-init-done
CLOUDINIT
)

# Create server via Hetzner API
RESPONSE=$(curl -s -X POST "https://api.hetzner.cloud/v1/servers" \
  -H "Authorization: Bearer ${HETZNER_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"${SERVER_NAME}\",
    \"server_type\": \"cx22\",
    \"image\": \"ubuntu-24.04\",
    \"location\": \"nbg1\",
    \"user_data\": $(echo "$CLOUD_INIT" | python3 -c 'import sys,json; print(json.dumps(sys.stdin.read()))'),
    \"labels\": {\"app\": \"noc-pharma-qms\", \"env\": \"production\"}
  }")

SERVER_IP=$(echo $RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin)['server']['public_net']['ipv4']['ip'])" 2>/dev/null)
SERVER_ID=$(echo $RESPONSE | python3 -c "import sys,json; print(json.load(sys.stdin)['server']['id'])" 2>/dev/null)

if [ -z "$SERVER_IP" ]; then
    echo -e "${RED}Failed to create server. Response:${NC}"
    echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
    exit 1
fi

echo -e "${GREEN}✅ Server created: ${SERVER_IP} (ID: ${SERVER_ID})${NC}"
echo ""
echo "⏳ Waiting for server to boot and run cloud-init (~90 seconds)..."
sleep 90

# ─── DEPLOY APPLICATION ──────────────────────────────────
echo "Deploying application..."

# Copy project files to server
scp -o StrictHostKeyChecking=no noc-pharma-qms.zip root@${SERVER_IP}:/opt/noc-qms/

# Run deployment on server
ssh -o StrictHostKeyChecking=no root@${SERVER_IP} << REMOTE
set -e
cd /opt/noc-qms

# Extract project
apt install -y unzip
unzip -q noc-pharma-qms.zip
mv noc-pharma-qms/* .
rm -rf noc-pharma-qms noc-pharma-qms.zip

# Create .env
cat > .env << EOF
DATABASE_URL="postgresql://noc_pharma:${DB_PASS}@db:5432/noc_qms"
NEXTAUTH_URL="${DOMAIN:+https://${DOMAIN}}${DOMAIN:-http://${SERVER_IP}:3000}"
NEXTAUTH_SECRET="${AUTH_SECRET}"
ANTHROPIC_API_KEY="${ANTHROPIC_KEY}"
UPLOAD_DIR="/app/uploads"
SESSION_MAX_AGE=1800
MAX_LOGIN_ATTEMPTS=5
AUDIT_RETENTION_YEARS=10
DB_PASSWORD="${DB_PASS}"
EOF

# Export for docker-compose
export DB_PASSWORD="${DB_PASS}"

# Start everything
docker compose up -d --build

# Wait for app to be ready
echo "Waiting for app to start..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        break
    fi
    sleep 2
done

# Run database setup inside the container
docker exec noc-pharma-app npx prisma db push 2>&1 || true
docker exec noc-pharma-app npx tsx prisma/seed.ts 2>&1 || true

echo "App deployed!"
REMOTE

echo -e "${GREEN}✅ Application deployed${NC}"

# ─── SETUP SSL / DOMAIN ─────────────────────────────────
if [ -n "$DOMAIN" ]; then
    echo ""
    echo "Setting up HTTPS for ${DOMAIN}..."
    echo ""
    echo -e "${YELLOW}⚠️  Make sure your DNS points ${DOMAIN} → ${SERVER_IP}${NC}"
    echo "   (A record: ${DOMAIN} → ${SERVER_IP})"
    echo ""
    read -p "DNS configured? (y/n) " -n 1 -r
    echo

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        ssh root@${SERVER_IP} << SSLREMOTE
cat > /etc/caddy/Caddyfile << 'CADDY'
${DOMAIN} {
    reverse_proxy localhost:3000
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
    log {
        output file /var/log/caddy/access.log
    }
}
CADDY
systemctl restart caddy
SSLREMOTE
        echo -e "${GREEN}✅ HTTPS configured: https://${DOMAIN}${NC}"
    fi
fi

# ─── SETUP DAILY BACKUPS ────────────────────────────────
echo ""
echo "Setting up daily backups..."

ssh root@${SERVER_IP} << 'BACKUP'
cat > /etc/cron.daily/noc-backup << 'CRON'
#!/bin/bash
# NOC Pharma QMS — Daily Backup
BACKUP_DIR=/backup
DATE=$(date +%Y%m%d_%H%M)

# Database backup
docker exec noc-pharma-db pg_dump -U noc_pharma noc_qms | gzip > ${BACKUP_DIR}/db_${DATE}.sql.gz

# Keep last 30 days
find ${BACKUP_DIR} -name "db_*.sql.gz" -mtime +30 -delete

echo "$(date): Backup completed - db_${DATE}.sql.gz" >> ${BACKUP_DIR}/backup.log
CRON
chmod +x /etc/cron.daily/noc-backup
BACKUP

echo -e "${GREEN}✅ Daily backups configured (/backup/)${NC}"

# ─── DONE ────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════"
echo -e "${GREEN}🎉 NOC Pharma QMS is LIVE!${NC}"
echo "══════════════════════════════════════════════════════"
echo ""
if [ -n "$DOMAIN" ]; then
    echo "   🌐 URL:        https://${DOMAIN}"
else
    echo "   🌐 URL:        http://${SERVER_IP}:3000"
fi
echo "   🖥️  Server IP:  ${SERVER_IP}"
echo "   🆔 Server ID:  ${SERVER_ID}"
echo "   💰 Cost:       ~€7.50/month"
echo "   🇩🇪 Location:   Nuremberg, Germany (EU)"
echo ""
echo "   Login:"
echo "   QP:      weber@noc-pharma.de     / QP_Test_2026!"
echo "   RP:      schmidt@noc-pharma.de   / RP_Test_2026!"
echo "   Auditor: auditor@bfarm.de        / Audit_2026!"
echo ""
echo "   SSH:     ssh root@${SERVER_IP}"
echo "   Logs:    ssh root@${SERVER_IP} docker logs noc-pharma-app"
echo "   Backup:  /backup/ (daily, 30-day retention)"
echo ""
echo "   ⚠️  IMPORTANT: Change all test passwords before real use!"
echo ""

# Save deployment info
cat > deployment-info.txt << INFO
NOC Pharma QMS — Deployment Info
Generated: $(date)
Server IP: ${SERVER_IP}
Server ID: ${SERVER_ID}
Domain: ${DOMAIN:-none}
Location: Nuremberg (nbg1), Germany
Provider: Hetzner Cloud
Server Type: CX22 (2 vCPU, 4GB RAM, 40GB SSD)
Database: PostgreSQL 16
INFO

echo "Saved to deployment-info.txt"
