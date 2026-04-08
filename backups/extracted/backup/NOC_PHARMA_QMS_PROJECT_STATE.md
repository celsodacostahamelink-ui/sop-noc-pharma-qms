# NOC PHARMA QMS v2.5 — Complete Project State
## Generated: 2026-03-06

---

## COMPANY
- **Name:** NOC Pharma GmbH
- **Address:** An der Redoute 1, 17390 Murchin, Mecklenburg-Vorpommern, Germany
- **License:** §52a AMG Wholesale (WDE-2024-0847), BtMG §3 Narcotics
- **VAT:** DE281359597
- **Lab Partner:** QSI GmbH Bremen (§14 AMG)

## PERSONNEL & ROLES
| Name | Role | Email | Signs |
|------|------|-------|-------|
| Celso Hamelink | Review / Operations Manager | celso@noc-pharma.de | No signing authority |
| Torsten Cuny | RP — Responsible Person §52a AMG | torsten.cuny@nocpharma.de | DocuSign — all RP fields |
| Dr. Olaf Schagon | QP — Qualified Person §15 AMG | qp@nocpharma.de | DocuSign — all QP fields |

## SUPPLIERS
| Supplier | Country | Flag | Status | PIC/S |
|----------|---------|------|--------|-------|
| Cannabis Avatara S.E. (Cannava) | Argentina | 🇦🇷 | Qualified | ✅ ANMAT |
| Medcolcanna | Colombia | 🇨🇴 | Qualification | ❌ INVIMA not member |
| HYTN | Canada | 🇨🇦 | Planned | ✅ Health Canada |

## IMPORTS (CA = Cannava, CO = Medcolcanna, HY = HYTN)

### CA-01 (BI-01)
- **Product:** NOC SE 17 Cannabis flos
- **Quantity:** 59.5 kg
- **Units:** 72
- **Permit:** E-10891/2024
- **Import Date:** 22.03.2025
- **Status:** docs-pending (lifecycle empty, awaiting ZIP upload)
- **QP Cert:** CGZ-2024-0031

### CA-02 (BI-02)
- **Product:** NOC SE 19 Cannabis flos (T22/1)
- **Batch Ref:** BI-02-NOCB1.1-INF-F
- **Quantity:** 198.5 kg
- **Units:** 239 (139×1kg + 100×10g)
- **Permit:** E-12267/2025
- **Import Date:** 14.11.2025
- **Status:** docs-pending
- **QP Cert:** CGZ-2025-0047
- **CAPA:** DEV-1 (defective release) + DEV-2 (incorrect labeling) — BOTH COMPLETED

### CA-03 (BI-03) — ACTIVE IMPORT
- **Product:** NOC SE 17/20 Cannabis flos
- **Batch Ref:** BI-03-NOCB1.2-INF-F
- **Net Weight:** 140.00 kg
- **Gross Weight:** 198.50 kg
- **Units:** 239 (139×1kg EVOH/PBD LDPE bags + 100×10g Doypacks trilaminated zipper)
- **Boxes:** 3 (each 113.3×70×74 cm, 0.586 m³)
  - Box 1: 45× 1kg bags + 100× 10g Doypacks + 1× Sensitech (46kg net / 65.90kg gross)
  - Box 2: 47× 1kg bags + 1× Sensitech (47kg net / 66.30kg gross)
  - Box 3: 47× 1kg bags + 1× Sensitech (47kg net / 66.30kg gross)
- **Sensitech Dataloggers:** 3× Ultra Fit Model
- **EXW Value:** €116,538.02
- **Route:** EZE (Ezeiza) → FRA (Frankfurt) → Murchin (Aerial)
- **Exporter:** Cannabis Avatara S.E., La Caridad 320, San Salvador de Jujuy, Argentina
- **Consignee:** NOC Pharma GmbH, An der Redoute 1, D-17390 Murchin, Germany
- **Packing List:** PL-00003-0000011
- **Permit:** E-12267/2025
- **Import Date:** 28.01.2026
- **Status:** Active — M2 Lab Testing
- **Source Document:** 5_PACKING_LIST_NOC3_(4).pdf

### CA-04 (BI-04)
- **Product:** NOC SE 21 Cannabis flos
- **Quantity:** 250 kg (planned)
- **Status:** Planned

### CO-01 (Medcolcanna)
- **Status:** Planned, qualification pending (PIC/S blocker)

### HY-01 (HYTN)
- **Quantity:** 200 kg (planned Q3 2026)
- **Strains:** 7 total (Liquid Imagination, White Truffle, Lemon Pepper Punch, Mandarin Cookies, Chemzilla, Planet Purple, NASHA)
- **Capacity:** 550-700+ kg/month

## LIFECYCLE STAGES (M0 → M6)

| Stage | Name (DE) | Name (EN) | Docs |
|-------|-----------|-----------|------|
| M0 | Registrierung & Genehmigungen | Registration & Permits | §52a license, BtMG §3, BfArM import permit, INCB, SQF, GMP cert, GACP, QTA |
| M0.5 | Vorlauf-Dokumente | Pre-Arrival Docs | Supplier COA, export permit, apostille, BtM export decl, packing list, proforma, phyto cert, origin cert, product spec |
| M1 | GDP Transport | GDP Transport | AWB, temp log, insurance, transport costs, customs/MRN, BtM transport permit, DG declaration |
| M1.5 | Tresor-Eingang | Vault Arrival | Goods receipt, visual inspection, seal verification, weight check, BtM receipt, quarantine storage |
| M2 | Laborprüfung | Lab Testing | QSI COA (cannabinoids, potency, micro, metals, mycotoxins, terpenes, solvents, moisture, pesticides) |
| M3 | QP-Freigabe | QP Release | QP release certificate, batch record, Safety Gate, conformity declaration |
| M3.1 | Quarantäne-Freigabe | Quarantine Release | Quarantine release form, zone transfer Q→K, BtM inventory change |
| M3.5 | GDP Transport (intern) | GDP Transport (internal) | Transport order, temp log, handover protocol |
| M4 | Umetikettierung | Relabeling | Label design/artwork, PZN verification, relabeling protocol, QR codes, photos, ficha técnica |
| M4.5 | Lagerung | Storage | Storage allocation, temp/humidity log, box assignment, BtM inventory |
| M5 | Versand | Shipment | Customer order, invoice, delivery note, SendCloud label, GDP dispatch protocol |
| M6 | Abstimmung | Reconciliation | Batch closure, yield calculation, BtM reconciliation, archiving, retention samples |

## DEVIATION & CAPA (CA-01 + CA-02)
- **DEV-1:** Defective Release — product released as "medicinal product" instead of "active ingredient" → Template corrected + locked system-wide
- **DEV-2:** Incorrect Labeling — container markings criticized → Label layout adjusted + entire CA-01 + CA-02 stock relabeled
- **Status:** ✅ CAPA Completed, reported to Dr. Schagon

## KEY FEATURES BUILT
1. **Bilingual DE/EN** — full app toggle
2. **DocuSign signatures** — all sign buttons branded, RP (T. Cuny) + QP (Dr. Schagon) on every approval
3. **Warehouse Monitoring** — X-Sense STH51 × 3 sensors, daily report, monthly MKT (ICH Q1A), SOP GDP-003, CSV import
4. **ZIP Upload** — subfolder detection (M0/, M1/, M2/ etc.), auto-classification with 220+ keywords (DE/EN/ES)
5. **Per-stage Upload** — green "📤 Upload → M2" button on each stage
6. **AI Document Agent** — Claude API (Sonnet) reads uploaded PDFs, extracts all data, compares with declared values, flags discrepancies, spreads to related stages, identifies financial data
7. **Classification** — Spanish (Cannava) + German + English document names
8. **SOP Forms** — SOP-109 A5-01, A4-01, SOP-110 A4-01 (complaint/recall forms)
9. **HYTN Harvest Calendar** — 7 strains, March-August 2026
10. **Finance** — per-supplier cost breakdown, Wix orders, investor projections, AI CFO
11. **Print** — all documents print bilingual DE/EN with correct signatures

## TRANSPORT COSTS (WAS-Logistics Invoice #138688)
- Pick up Jujuy → EZE: $4,200 → €3,656.13
- Armed Guard Escort (AR): $7,150 → €6,224.15
- Airfreight EZE → FRA: $1,992.40 → €1,734.40
- Cargo Insurance: $1,165.38 → €1,014.47
- FRA Airport Handling: €147.00
- Customs Clearance: €245.00
- Transport FRA → Murchin: €3,155.00 (temp controlled)
- Armed Guard Escort (DE): €5,974.00
- **TOTAL: €49,355.52**

## CURRENT TASK (WHERE WE LEFT OFF)
The Upload Original button now calls Claude Sonnet API to read PDFs. Need to:
1. Ensure AI properly reads and extracts ALL data from each document
2. Compare extracted data with declared values and flag discrepancies
3. Spread extracted info to ALL relevant lifecycle stages
4. Feed financial data to Finance module
5. Update BT_DATA dynamically when originals confirm/correct values
6. Every import tab should reflect actual document data

## FILE
- **App.jsx:** ~700KB single React component
- **Location:** ~/noc-pharma-qms/noc-qms-app/src/App.jsx
- **Run:** `cd ~/noc-pharma-qms/noc-qms-app && npm run dev` (Vite, port 5174)

## CONVERSATION HISTORY
28 development sessions spanning Feb 24 — Mar 6, 2026 (transcripts available)
