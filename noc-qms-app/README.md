# NOC Pharma QMS v1.0

**GxP Compliant Document Management System**  
21 CFR Part 11 | EU Annex 11 | EU AI Act 2026 | GAMP 5

Cannabis pharmaceutical wholesale — BfArM audit-ready.

## Features

- 📑 **230 SOP Management** — upload, view, search, filter
- 📦 **Smart ZIP Upload** — auto-matches files to SOP codes
- 🔬 **AI Compliance Scan** — PIC/S GMP + MedCanG/AMG analysis
- ⚠️ **Legal Update Tracker** — 12 update categories, 79 SOPs flagged
- 🤖 **AI Document Agent** — generates/updates SOPs via Claude API
- 👤 **HITL Decisions** — digital signatures, override logging
- ✅ **15-Item Audit Checklist** — BfArM-ready
- 📝 **Immutable Audit Trail** — 10yr retention, CSV export
- 🔐 **8 Roles** — QP, RP, QA, IT, Compliance, SCM, Auditor, Viewer

## Quick Start

```bash
cp .env.example .env          # Configure
docker compose up db -d       # Database
npx prisma db push            # Schema
npm run db:seed               # Test users
npm run dev                   # http://localhost:3000
npm run test:compliance       # GxP validation
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for full guide.
