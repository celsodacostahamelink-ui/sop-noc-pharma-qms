# NOC Pharma QMS — Deployment Guide

## Quick Start (Development)

```bash
# 1. Clone and install
git clone <repo-url> noc-pharma-qms
cd noc-pharma-qms
npm install

# 2. Start database
docker compose up db -d

# 3. Configure environment
cp .env.example .env
# Edit .env: set ANTHROPIC_API_KEY, generate NEXTAUTH_SECRET

# 4. Setup database
npx prisma db push
npm run db:seed

# 5. Run
npm run dev
# → http://localhost:3000
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| QP (Sachkundige Person) | weber@noc-pharma.de | QP_Test_2026! |
| RP (§52a Verantwortliche) | schmidt@noc-pharma.de | RP_Test_2026! |
| QA Manager | mueller@noc-pharma.de | QA_Test_2026! |
| IT Admin | fischer@noc-pharma.de | IT_Test_2026! |
| Compliance/Legal | becker@noc-pharma.de | CL_Test_2026! |
| Supply Chain | wagner@noc-pharma.de | SC_Test_2026! |
| BfArM Auditor | auditor@bfarm.de | Audit_2026! |
| Staff (read-only) | staff@noc-pharma.de | View_2026! |

## Run Tests

```bash
# Unit tests
npm test

# GxP compliance validation (IQ/OQ/PQ)
npm run test:compliance

# End-to-end tests
npm run test:e2e

# All tests
npm run test:all
```

## Production Deployment

### Option A: Docker (Recommended)

```bash
# Build and run everything
docker compose up -d

# With pgAdmin for DB management
docker compose --profile dev up -d
```

### Option B: Vercel + Supabase

```bash
# 1. Create Supabase project → get DATABASE_URL
# 2. Deploy to Vercel
vercel deploy

# 3. Set environment variables in Vercel dashboard:
#    DATABASE_URL, NEXTAUTH_SECRET, ANTHROPIC_API_KEY

# 4. Run migrations
npx prisma db push
```

### Option C: Hetzner/Bare Metal (EU Data Residency)

For BfArM compliance, data must stay in EU. Hetzner (Falkenstein/Nuremberg) is ideal:

```bash
# On Hetzner Cloud server (Ubuntu 24.04)
apt update && apt install -y docker.io docker-compose-v2
git clone <repo> /opt/noc-qms
cd /opt/noc-qms
cp .env.example .env
# Edit .env with production values

docker compose up -d

# SSL with Caddy reverse proxy
apt install -y caddy
echo 'qms.noc-pharma.de {
  reverse_proxy localhost:3000
}' > /etc/caddy/Caddyfile
systemctl restart caddy
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Browser (React SPA)                                 │
│  ├── Login → NextAuth session                       │
│  ├── Dashboard → Role-gated views                   │
│  ├── ZIP Upload → JSZip → Smart Match → S3/local    │
│  └── AI Agent → API route → Claude Sonnet           │
├─────────────────────────────────────────────────────┤
│  Next.js API Routes                                  │
│  ├── /api/auth/[...nextauth]  Authentication        │
│  ├── /api/sops                CRUD + search         │
│  ├── /api/ai-agent            Claude API proxy      │
│  ├── /api/audit               Immutable log         │
│  └── /api/upload              File + hash (SHA-256) │
├─────────────────────────────────────────────────────┤
│  Prisma ORM → PostgreSQL                             │
│  ├── Users (bcrypt, roles, sessions)                │
│  ├── SOPs (230 docs, scan results, update flags)    │
│  ├── Documents (files, SHA-256 hash)                │
│  ├── AI Drafts (versioned, approval workflow)       │
│  ├── HITL Decisions (immutable, signed)             │
│  └── Audit Log (immutable, 10yr retention)          │
├─────────────────────────────────────────────────────┤
│  File Storage                                        │
│  ├── Dev: ./uploads/                                │
│  └── Prod: S3 (eu-central-1) or Hetzner Object     │
└─────────────────────────────────────────────────────┘
```

## Regulatory Compliance

| Regulation | Implementation |
|------------|---------------|
| 21 CFR Part 11 | E-signatures, audit trail, access control, password policy |
| EU Annex 11 §9 | Immutable audit log, timestamped, user-linked |
| EU Annex 11 §12 | Role-based access, session management |
| EU Annex 11 §14 | Electronic signatures linked to records |
| EU AI Act Art.12 | 10-year AI decision log retention |
| EU AI Act Art.14 | HITL with QP/RP override authority |
| GAMP 5 Cat.5 | IQ/OQ/PQ test protocol in /tests/compliance |
| ALCOA++ | Document hashing (SHA-256), immutable records |
| GDPR Art.15-22 | Data subject rights, consent tracking |
| MedCanG 2026 | Pharmacy verification, wholesale-only routing |

## Backup & Recovery

```bash
# Daily database backup (add to cron)
docker exec noc-pharma-db pg_dump -U noc_pharma noc_qms | gzip > /backup/qms_$(date +%Y%m%d).sql.gz

# Restore
gunzip -c /backup/qms_20260209.sql.gz | docker exec -i noc-pharma-db psql -U noc_pharma noc_qms
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Generate strong NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Enable HTTPS (Caddy auto-TLS or manual cert)
- [ ] Set SESSION_MAX_AGE=1800 (30min GxP requirement)
- [ ] Configure firewall: only 443 (HTTPS) open
- [ ] Enable PostgreSQL SSL
- [ ] Set up automated backups
- [ ] Enable audit log export to separate storage
- [ ] Configure ANTHROPIC_API_KEY with usage limits
- [ ] Review all test user accounts before production
