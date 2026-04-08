# NOC PHARMA QMS v2.5 — IMPLEMENTATION BLUEPRINT
## Agreed with Celso · March 6, 2026
## For next conversation — DO NOT CODE, BUILD FROM THIS SPEC

---

## CORE PRINCIPLE
**Every original document uploaded is the SOURCE OF TRUTH.**
The AI Agent reads it, extracts everything, compares with system data, 
shows warnings for conflicts, and spreads verified data across ALL stages + finance.

---

## 1. DATA FLOW MAP (Confirmed)

### When Packing List is uploaded to M0.5:
- → M1: gross weight, boxes count, route (EZE→FRA), Sensitech dataloggers
- → M1.5: expected net weight (for arrival weight verification)
- → M4: product description, bag types (EVOH/PBD LDPE 1kg + Doypacks 10g), unit counts
- → M4.5: total units (239), storage allocation planning
- → M5: unit breakdown for shipment planning (1kg vs 10g SKUs)
- → Finance: EXW value (€116,538.02) → product cost basis
- → Forecast: available inventory for sales projections

### When Invoice/Factura is uploaded:
- → M0.5: invoice reference, amounts
- → M5: billing reference for customer invoices
- → Finance: FULL line-item breakdown, VAT calculation, cost-per-kg
- → Forecast: cost projections for future imports

### When COA (Supplier) is uploaded:
- → M0.5: supplier COA data stored
- → M2: comparison baseline (supplier COA vs QSI lab results)
- → M4: THC% for label content, CBD%, terpene profile for marketing
- → Finance: product grade affects pricing

### When AWB is uploaded:
- → M1: flight details, dates, tracking number
- → M1.5: expected arrival date
- → Finance: freight reference

### When WAS Logistics Invoice is uploaded:
- → M1: transport cost breakdown
- → Finance: ALL line items (pickup, armed guard, airfreight, handling, customs, transport FRA→Murchin)
- → Finance: auto-calculate total logistics cost per kg

### When QSI Lab Report is uploaded:
- → M2: all 19 test parameters with pass/fail
- → M3: Safety Gate assessment (GREEN/RED)
- → M4: confirmed THC% for final label
- → Finance: lab testing costs
- → Expiry tracking: stability data → expiration date calculation

### When QP Release Certificate is uploaded:
- → M3: certificate number, date, conditions
- → M3.1: triggers quarantine release eligibility
- → M4: release confirmation for relabeling start
- → BtM: narcotics ledger entry

### When Label/Ficha Técnica is uploaded:
- → M4: packaging specifications verification
- → M4: bag type confirmation vs packing list
- → M5: label content for Wix product listings

### When Customer Order is uploaded:
- → M5: order details, quantities
- → Finance: revenue recognition
- → M4.5: pick/pack from storage
- → Wix: order sync
- → SendCloud: shipping label generation

---

## 2. CONFLICT HANDLING (Confirmed)
- AI extracts data from original document
- Compares EACH field with system data
- Displays side-by-side:
  - ✅ **Confirmed**: System says 140kg → Document says 140kg
  - ⚠️ **Warning**: System says 60kg → Document says 140kg → [Approve Change] [Keep System Value]
  - 🆕 **New**: System has no value → Document says €116,538.02 → [Accept]
- User must APPROVE changes before system updates
- Audit trail: "Value changed from X to Y based on document PL-00003-0000011, approved by Celso on 06.03.2026"

---

## 3. STAGE DEPENDENCIES & NEW SAMPLING STEP (Confirmed)

### Import Flow:
```
M0 Registration → M0.5 Pre-Arrival → M1 GDP Transport → M1.5 Vault Arrival
    → M2 SAMPLING (NEW!) → M2 Lab Testing → M3 QP Release 
    → M3.1 Quarantine Release → M3.5 Internal Transport
    → M4 Relabeling → M4.5 Storage → M5 Shipment → M6 Reconciliation
```

### NEW: M2 Sampling Sub-step
- After vault arrival (M1.5), product is in quarantine
- **Sampling Protocol:**
  - 140g per batch sent to QSI Bremen for testing
  - Sampling form signed by Torsten Cuny (RP) via DocuSign
  - Sample shipped GDP-compliant (insulated box + coolpack + datalogger)
  - BtM seal applied to sample package
  - Route: Murchin → QSI Bremen (~350km)
- **Product stays in quarantine vault until QSI results come back**
- When QSI results arrive → M2 Lab Testing completes → M3 QP Release

### Stage Gates (enforced):
- M1.5 Vault cannot complete until M1 Transport docs uploaded
- M2 Sampling cannot start until M1.5 Vault arrival confirmed
- M2 Lab cannot complete until QSI results uploaded
- M3 QP Release cannot happen until M2 all 19 parameters PASS
- M3.1 Quarantine Release requires M3 QP signature
- M4 Relabeling requires M3.1 release
- M5 Shipment requires M4.5 storage allocation
- M6 Reconciliation requires all previous stages complete

---

## 4. FINANCE INTEGRATION (Confirmed — Full Breakdown)

### Per Import (CA-03 example):
```
PRODUCT COST:
  EXW Value:           €116,538.02  (from Packing List)
  
LOGISTICS COST:        (from WAS Invoice #138688)
  Pickup Jujuy→EZE:    €3,656.13
  Armed Guard (AR):    €6,224.15
  Airfreight EZE→FRA:  €1,734.40
  Cargo Insurance:     €1,014.47
  FRA Handling:        €147.00
  Customs Clearance:   €245.00
  FRA→Murchin:         €3,155.00
  Armed Guard (DE):    €5,974.00
  ─────────────────────────────
  Total Logistics:     €49,355.52

LAB COSTS:             (from QSI invoice)
  QSI Testing:         €X,XXX.XX
  
TOTAL LANDED COST:     €116,538.02 + €49,355.52 + lab = ~€167,XXX
COST PER KG:           €167,XXX / 140kg = ~€1,195/kg
VAT (19%):             19% on CIF value at customs

REVENUE PROJECTION:
  239 units × avg selling price = projected revenue
  Gross margin = revenue - landed cost
```

### Auto-calculations triggered by document uploads:
- Packing List → sets EXW cost base
- WAS Invoice → adds logistics costs
- QSI Invoice → adds lab costs
- Customs docs → adds duties/VAT
- Wix orders → tracks revenue per unit sold
- System calculates: total landed cost, cost/kg, margins, ROI

---

## 5. ALL DOCUMENTS FOR CA-03 (User has all — needs proper upload flow)

### Upload sequence (recommended order):
1. **M0:** Import Permit (BfArM), INCB Authorization
2. **M0.5:** Supplier COA, Export Permit, Packing List ✅, Proforma Invoice, Apostille, Phytosanitary
3. **M1:** AWB, WAS Logistics Invoice, Insurance, Temperature Log
4. **M1.5:** Vault Arrival Protocol, Weight Check, Seal Verification
5. **M2:** Sampling Form (Torsten signs), QSI Lab Report (when received)
6. **M3:** QP Release Certificate (Dr. Schagon signs)
7. **M4:** Label Artwork, Ficha Técnica, PZN Verification, Relabeling Photos
8. **M5:** Customer Orders, Invoices, SendCloud Labels
9. **M6:** Batch Closure, BtM Reconciliation

---

## 6. DOCUSIGN EVERYWHERE (Confirmed)
Every document that requires a signature uses DocuSign:
- M2 Sampling Form → Torsten Cuny (RP) signs
- M3 QP Release → Dr. Olaf Schagon (QP) signs
- M3.1 Quarantine Release → QP + RP sign
- M3.5 Transport Auth → RP signs
- M4 Relabeling Release → RP + QP sign
- M4 CAPA → RP + QP sign
- M5 Dispatch Protocol → RP signs
- M6 Batch Closure → RP + QP sign

---

## 7. EXPIRATION DATE TRACKING (Confirmed — Critical)

### From documents, extract:
- Manufacturing date
- Expiry date (from COA, labels, product spec)
- Stability study data (ICH Q1A — 25°C/60% RH)

### System should:
- Track expiry per batch/unit
- Dashboard alert at: 12 months, 6 months, 3 months, 1 month before expiry
- Two actions available:
  1. **Extend expiry**: if stability data supports it → new expiry label → DocuSign by QP
  2. **Send to destruction**: if expired → destruction protocol → BtM deduction → DocuSign by RP + QP
- Expiry data feeds into:
  - M4: label expiry date
  - M4.5: storage priority (FEFO — First Expiry First Out)
  - M5: shipment urgency
  - Finance: write-off projections
  - Dashboard: alert system

---

## 8. AI AGENTS — LIVING COMPLIANCE ORGANISM

### Per-Stage AI Agent capabilities:
- **Reads** every uploaded original
- **Extracts** all data fields
- **Compares** with system values
- **Warns** on discrepancies (user approves)
- **Spreads** data to dependent stages
- **Calculates** financial impacts
- **Tracks** expiry dates
- **Enforces** stage gates
- **Generates** compliance documents (certificates, protocols)
- **Sends** via DocuSign for signature
- **Archives** everything with audit trail

### Agent should know:
- German pharmaceutical law (AMG §52a, §15, BtMG §3, §13)
- EU GDP Guidelines (2013/C 343/01)
- EU GMP Annex 16 (QP Release)
- ICH Q1A (Stability/Expiry)
- Ph. Eur. Cannabis flos monograph
- ALCOA+ principles (data integrity)
- 21 CFR Part 11 (electronic signatures)
- eIDAS Art. 25 (EU digital signatures)

---

## 9. WHAT TO BUILD IN NEXT SESSION

### Priority 1: Fix AI Document Reading
- Ensure Claude API properly reads PDFs (base64 → Sonnet)
- Test with real Packing List PDF
- Structured JSON extraction with all fields

### Priority 2: Approval Workflow
- Side-by-side comparison UI: System Value vs Document Value
- [Approve] [Reject] buttons per field
- Audit trail stored

### Priority 3: Data Spreading
- After approval, update BT_DATA and all dependent stages
- Finance auto-recalculates

### Priority 4: Sampling Step
- New sub-step in M2 with sampling form
- Torsten signs via DocuSign
- 140g per batch to QSI

### Priority 5: Expiry Tracking
- Extract dates from all documents
- Dashboard alerts
- Extension/Destruction workflows

### Priority 6: Stage Gates
- Enforce dependencies
- Visual progress indicator

---

## FILES TO BRING TO NEXT SESSION:
1. App.jsx (latest ~700KB)
2. This blueprint document
3. NOC_PHARMA_QMS_PROJECT_STATE.md
4. SESSION_HISTORY.md
5. All original documents for CA-03 (packing list, invoices, COAs, etc.)
