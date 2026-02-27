# GAMP 5 Validation Protocol — NOC Pharma QMS v1.0

**Document ID:** VAL-QMS-001  
**Version:** 1.0  
**Date:** 2026-02-09  
**Author:** QA Manager  
**Approved by:** QP (Sachkundige Person)  
**Classification:** GAMP 5 Category 5 (Custom Software)

---

## 1. Purpose

This document defines the validation protocol for the NOC Pharma QMS application, a GxP-regulated computerised system used for SOP document management, AI-assisted compliance scanning, and HITL decision support for cannabis pharmaceutical wholesale operations.

## 2. Scope

- User authentication and role-based access control
- SOP document management (230+ documents)
- AI compliance scanning engine
- AI document generation/update agent (Claude API)
- HITL decision workflow with digital signatures
- Audit trail system (10-year retention)
- ZIP upload with smart document matching

## 3. Risk Assessment

| Feature | GAMP Category | Risk | Justification |
|---------|--------------|------|---------------|
| Authentication | Cat 4 (Configured) | HIGH | GxP access control |
| SOP CRUD | Cat 4 | MEDIUM | Document integrity |
| AI Scan Engine | Cat 5 (Custom) | HIGH | Compliance decisions |
| AI Agent (Claude) | Cat 5 | HIGH | Generates regulatory content |
| HITL Decisions | Cat 5 | HIGH | Batch release, recalls |
| Audit Trail | Cat 4 | HIGH | Regulatory requirement |
| ZIP Upload | Cat 5 | MEDIUM | Data mapping |

## 4. Test Protocol

### 4.1 IQ — Installation Qualification

| Test ID | Description | Pass Criteria | Status |
|---------|-------------|---------------|--------|
| IQ-01 | Database schema deployed | All tables created | ☐ |
| IQ-02 | All roles defined | 8 roles in system | ☐ |
| IQ-03 | Environment configured | All env vars set | ☐ |
| IQ-04 | Dependencies installed | npm install succeeds | ☐ |
| IQ-05 | Seed data loaded | 8 users, 15 checklist items | ☐ |

### 4.2 OQ — Operational Qualification

| Test ID | Description | Pass Criteria | Status |
|---------|-------------|---------------|--------|
| OQ-01 | QP full access | All permissions granted | ☐ |
| OQ-02 | Auditor read-only | No write/sign/AI access | ☐ |
| OQ-03 | HITL override restricted | Only QP/RP can override | ☐ |
| OQ-04 | AI approval restricted | Only QP/RP can approve | ☐ |
| OQ-05 | Session timeout | Auto-logout after 30min | ☐ |
| OQ-06 | Login lockout | Lock after 5 failed attempts | ☐ |
| OQ-07 | Audit log immutable | No UPDATE/DELETE on audit table | ☐ |
| OQ-08 | ZIP smart match | 90%+ accuracy on test archive | ☐ |
| OQ-09 | AI agent responds | Claude API returns valid SOP text | ☐ |
| OQ-10 | HITL sign requires signature | Cannot submit without name+role | ☐ |

### 4.3 PQ — Performance Qualification

| Test ID | Description | Pass Criteria | Status |
|---------|-------------|---------------|--------|
| PQ-01 | 230 SOPs loaded | All docs accessible | ☐ |
| PQ-02 | Scan scores computed | 175 SOPs have scores | ☐ |
| PQ-03 | Updates identified | 79 SOPs flagged for update | ☐ |
| PQ-04 | Document hash verified | SHA-256 matches on upload | ☐ |
| PQ-05 | Audit export CSV | All fields present, correct format | ☐ |
| PQ-06 | AI draft workflow | generate→review→approve works | ☐ |
| PQ-07 | Concurrent users | 10 simultaneous sessions stable | ☐ |
| PQ-08 | Backup/restore | Full DB recoverable from backup | ☐ |

## 5. Automated Test Execution

```bash
# Run all validation tests
npm run test:compliance -- --verbose

# Expected output:
# IQ-01: System Installation          ✓ PASS
# OQ-01: Access Control               ✓ PASS  
# OQ-02: HITL Decision Authority      ✓ PASS
# OQ-03: AI Agent Access              ✓ PASS
# OQ-04: Audit Trail                  ✓ PASS
# PQ-01: Data Integrity               ✓ PASS
# PQ-02: Electronic Signature         ✓ PASS
# PQ-03: AI Governance                ✓ PASS
# PQ-04: Session Security             ✓ PASS
```

## 6. Revalidation Triggers

- Any code change to authentication logic
- Database schema migrations
- AI model version changes
- Role permission modifications
- Security patch updates
- Annual revalidation (minimum)

## 7. Approval

| Name | Role | Signature | Date |
|------|------|-----------|------|
| | QP | | |
| | RP | | |
| | QA Manager | | |
| | IT Admin | | |
