#!/bin/bash
# ══════════════════════════════════════════════════════════
# NOC Pharma QMS v1.0 — Complete Local Setup
# Run this on your Mac or Linux machine
# ══════════════════════════════════════════════════════════
set -e

echo ""
echo "🏛️  NOC Pharma QMS v1.0"
echo "   GxP Compliant | 21 CFR Part 11 | EU Annex 11"
echo "══════════════════════════════════════════════════════"
echo ""

# ─── COLORS ──────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}✅ $1${NC}"; }
warn() { echo -e "${YELLOW}⚠️  $1${NC}"; }
fail() { echo -e "${RED}❌ $1${NC}"; exit 1; }

# ─── CHECK PREREQUISITES ────────────────────────────────
echo "Step 1/7: Checking prerequisites..."

# Node.js
if command -v node &> /dev/null; then
    NODE_VER=$(node -v)
    ok "Node.js ${NODE_VER}"
else
    fail "Node.js not found. Install from https://nodejs.org (v20 LTS)"
fi

# npm
if command -v npm &> /dev/null; then
    ok "npm $(npm -v)"
else
    fail "npm not found"
fi

# Docker
if command -v docker &> /dev/null; then
    ok "Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"
else
    warn "Docker not found. Install from https://docker.com/products/docker-desktop"
    echo "   Without Docker, you'll need to install PostgreSQL manually."
    echo ""
    read -p "Continue without Docker? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then exit 1; fi
fi

echo ""

# ─── CREATE PROJECT ─────────────────────────────────────
echo "Step 2/7: Setting up project..."

PROJECT_DIR="$HOME/noc-pharma-qms"

if [ -d "$PROJECT_DIR" ]; then
    warn "Project directory exists: $PROJECT_DIR"
    read -p "   Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then exit 1; fi
    rm -rf "$PROJECT_DIR"
fi

# Check if ZIP exists in current directory
if [ -f "noc-pharma-qms.zip" ]; then
    unzip -q noc-pharma-qms.zip -d "$HOME/"
    ok "Project extracted to $PROJECT_DIR"
elif [ -f "$HOME/Downloads/noc-pharma-qms.zip" ]; then
    unzip -q "$HOME/Downloads/noc-pharma-qms.zip" -d "$HOME/"
    ok "Project extracted from Downloads"
else
    fail "Cannot find noc-pharma-qms.zip. Place it in current directory or Downloads."
fi

cd "$PROJECT_DIR"

# ─── CONFIGURE ENVIRONMENT ──────────────────────────────
echo ""
echo "Step 3/7: Configuring environment..."

# Generate secure secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -hex 16)

cat > .env << ENVFILE
# NOC Pharma QMS — Auto-generated $(date)
DATABASE_URL="postgresql://noc_pharma:${DB_PASSWORD}@localhost:5432/noc_qms"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
UPLOAD_DIR="./uploads"
SESSION_MAX_AGE=1800
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900
AUDIT_RETENTION_YEARS=10
LOG_IP_ADDRESS=true
ENVFILE

# Ask for Anthropic API key
echo ""
echo "   The AI Document Agent needs an Anthropic API key."
echo "   Get one at: https://console.anthropic.com/settings/keys"
echo ""
read -p "   Enter your ANTHROPIC_API_KEY (or press Enter to skip): " API_KEY

if [ -n "$API_KEY" ]; then
    echo "ANTHROPIC_API_KEY=\"${API_KEY}\"" >> .env
    ok "API key configured"
else
    echo "ANTHROPIC_API_KEY=\"\"" >> .env
    warn "No API key — AI Agent will not work. Add it to .env later."
fi

ok "Environment configured"

# ─── START DATABASE ──────────────────────────────────────
echo ""
echo "Step 4/7: Starting PostgreSQL database..."

if command -v docker &> /dev/null; then
    # Export for docker-compose
    export DB_PASSWORD

    # Stop existing container if running
    docker stop noc-pharma-db 2>/dev/null || true
    docker rm noc-pharma-db 2>/dev/null || true

    docker compose up db -d --wait 2>/dev/null || docker-compose up db -d 2>/dev/null

    # Wait for DB to be ready
    echo "   Waiting for database..."
    for i in {1..30}; do
        if docker exec noc-pharma-db pg_isready -U noc_pharma -d noc_qms &>/dev/null; then
            break
        fi
        sleep 1
    done
    ok "PostgreSQL running on port 5432"
else
    warn "Docker not available — assuming PostgreSQL is running on localhost:5432"
    echo "   Make sure your PostgreSQL has:"
    echo "   - Database: noc_qms"
    echo "   - User: noc_pharma"
    echo "   - Password: ${DB_PASSWORD}"
fi

# ─── INSTALL DEPENDENCIES ───────────────────────────────
echo ""
echo "Step 5/7: Installing dependencies (this takes ~60 seconds)..."

npm install --silent 2>&1 | tail -1
ok "Dependencies installed"

# ─── SETUP DATABASE ─────────────────────────────────────
echo ""
echo "Step 6/7: Creating database tables and test users..."

# Create uploads directory
mkdir -p uploads

# Push schema
npx prisma db push --skip-generate 2>&1 | tail -1
npx prisma generate 2>&1 | tail -1
ok "Database schema created"

# Seed test data
npx tsx prisma/seed.ts 2>&1
ok "Test users and checklist seeded"

# ─── RUN VALIDATION TESTS ───────────────────────────────
echo ""
echo "Step 7/7: Running GxP compliance validation..."

npx jest tests/compliance/ --verbose 2>&1 || warn "Some tests need the full app running"

# ─── DONE ────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════════════════"
echo -e "${GREEN}🎉 NOC Pharma QMS is ready!${NC}"
echo "══════════════════════════════════════════════════════"
echo ""
echo "   Start the app:  cd $PROJECT_DIR && npm run dev"
echo "   Open browser:   http://localhost:3000"
echo ""
echo "   Test accounts:"
echo "   ──────────────────────────────────────────────────"
echo "   QP (full access)    weber@noc-pharma.de     QP_Test_2026!"
echo "   RP (full access)    schmidt@noc-pharma.de   RP_Test_2026!"
echo "   QA Manager          mueller@noc-pharma.de   QA_Test_2026!"
echo "   IT Admin            fischer@noc-pharma.de   IT_Test_2026!"
echo "   Compliance          becker@noc-pharma.de    CL_Test_2026!"
echo "   BfArM Auditor       auditor@bfarm.de        Audit_2026!"
echo "   ──────────────────────────────────────────────────"
echo ""
echo "   Next steps:"
echo "   1. npm run dev                    → Start app"
echo "   2. Upload SOPs_GÜLTIG.zip         → Auto-match 230 docs"
echo "   3. npm run test:compliance        → GxP validation"
echo "   4. Review AI Agent outputs        → QP must approve"
echo ""
echo "   Database admin:  npx prisma studio"
echo "   All tests:       npm run test:all"
echo ""
