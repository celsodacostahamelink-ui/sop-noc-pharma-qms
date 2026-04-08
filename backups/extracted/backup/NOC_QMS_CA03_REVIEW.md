# NOC PHARMA QMS — CA-03 Stage-by-Stage Review
## What We Have vs What We Need

---

## HOW IT SHOULD WORK:
1. User uploads original PDF to a document row (e.g., Packing List in M0.5)
2. AI Agent reads the PDF, extracts ALL data
3. AI compares extracted data with what's currently in the system
4. Shows: ✅ Confirmed / ⚠️ Discrepancy / 🆕 New data found
5. Data automatically flows to OTHER stages that need it
6. Finance module updates with any cost/invoice data found

---

## M0 — Registration & Permits
### Currently has (hardcoded):
- §52a AMG License: WDE-2024-0847
- BtMG §3 Narcotics License
- Import Permit: E-12267/2025
- INCB Authorization
- Supplier Qualification File: SQF-CANN-2025-001
- GMP Certificate (ANMAT)
- GACP Certificate
- Quality Technical Agreement

### What originals would tell us:
- Exact permit numbers, dates, validity
- Authorized quantities on the permit
- Permit conditions/restrictions

### AI Agent should:
- Extract permit numbers and cross-check
- Flag if permit is expired or quantity exceeded
- Push permit data to M0.5 (referenced in export docs)

---

## M0.5 — Pre-Arrival Docs
### Currently has (hardcoded for CA-03):
- Supplier COA (COA-CANN-xxxx)
- Export Permit (Exp-xxxx)  
- Apostille (APO-AR-xxxx)
- BtM Export Declaration
- Packing List: PL-00003-0000011 ← WE HAVE THE REAL PDF
- Proforma Invoice: PI-CANN-2025-0047
- Phytosanitary Certificate
- Certificate of Origin
- Product Specification
- Serial/QR Codes: SER-BI02-2025
- Transport & Logistics Costs: Invoice 138688

### What's WRONG in the system:
- Packing list data was manually entered — needs verification from original
- Some references show "xxxx" placeholders
- Product "NOC SE 17/20" but packing list says "Batch BI-02-NOCB1.1-INF-F"
- QR codes reference SER-BI02 but this is CA-03

### What AI Agent should do when Packing List PDF is uploaded:
- Extract: exporter, consignee, description, batch, box details, weights, units, EXW, route
- Compare each field with what M0.5 currently shows
- PUSH data to:
  → M1: gross weight (198.5kg), boxes (3), route (EZE→FRA), Sensitech dataloggers
  → M1.5: expected net weight (140kg) for weight verification on arrival
  → M4: product description, bag types (EVOH/PBD LDPE 1kg + Doypacks 10g), unit counts
  → M4.5: total units (239), storage allocation
  → Finance: EXW value (€116,538.02)

### What AI Agent should do when Invoice is uploaded:
- Extract: invoice number, amount, payment terms, bank details, currency
- Compare with proforma invoice data
- PUSH to:
  → M5: invoice for customer billing reference
  → Finance: product cost, VAT calculation base

### What AI Agent should do when COA is uploaded:
- Extract: all cannabinoid percentages, terpene profile, micro results
- PUSH to:
  → M2: lab comparison data (supplier COA vs QSI results)
  → M4: THC% for label content

---

## M1 — GDP Transport
### Currently has:
- Carrier: WAS-Logistics GmbH
- Invoice: 138688 (€49,355.52 detailed breakdown)
- Route: EZE → FRA → Murchin
- GDP temperature: 16.2–23.1°C ✅
- Gross weight: uses BT.gross (198.5 kg)
- Boxes: uses BT.boxes (3)
- Sensitech dataloggers mentioned

### What originals would tell us:
- AWB number (air waybill)
- Actual flight numbers/dates
- Customs MRN number
- Temperature log data (exact readings)
- Insurance policy details

### AI Agent should:
- Extract AWB number → update M1 display
- Extract actual departure/arrival times
- Extract temperature readings → compare with GDP spec (15-25°C)
- Push customs MRN to M1 and M6 (reconciliation)
- Push freight costs to Finance

---

## M1.5 — Vault Arrival
### Currently has:
- Mostly placeholder data

### What originals would tell us:
- Actual arrival date/time
- Weight check results (compare with packing list 140kg)
- Seal verification (intact/broken)
- Visual inspection results
- Who received (Dominik Delacher)

### AI Agent should:
- Extract arrival weight → compare with M0.5 packing list (140kg)
- Flag any weight discrepancy
- Extract seal numbers → verify
- Push arrival confirmation to M3 (QP needs to know goods received)

---

## M2 — Lab Testing
### Currently has:
- QSI Bremen lab results (19 parameters)
- Safety Gate: GREEN
- Full cannabinoid comparison (supplier vs QSI)

### What originals would tell us:
- Actual lab report numbers
- Exact test results for each parameter
- Pass/fail per specification
- Any out-of-spec findings

### AI Agent should:
- Extract all test results
- Compare QSI results with supplier COA (from M0.5)
- Flag any out-of-spec results
- Push THC% to M4 (for label)
- Push pass/fail to M3 (QP needs for release decision)

---

## M3 — QP Release
### Currently has:
- QP Release Certificate: uses BT.cert
- Batch record reference
- Safety Gate assessment
- DocuSign signature workflow

### What originals would tell us:
- Actual certificate number and date
- QP's specific comments/conditions
- Release conditions (if any)

### AI Agent should:
- Extract certificate number → update BT_DATA
- Confirm Safety Gate assessment matches M2 results
- Push release status to M3.1 (triggers quarantine release)

---

## M3.1 — Quarantine Release
### Currently has:
- Zone transfer form (Q → Commercial)
- Transport request TR-NOC-2025-0089
- BtM inventory change

### Depends on:
- M3 QP release (must be completed first)
- M1.5 arrival confirmation

---

## M3.5 — GDP Transport (Internal)
### Currently has:
- Transport order
- Temperature log
- Handover protocol

### Depends on:
- M3.1 quarantine release

---

## M4 — Relabeling
### Currently has:
- Products: 139×1kg + 100×10g (from BT)
- PZN numbers
- CAPA section (DEV-1 + DEV-2)
- CAPA correctly shows Batch BI-02-NOCB1.1-INF-F, NOC SE 17/20

### What originals would tell us:
- Actual label designs/artwork
- PZN verification results from IFA
- Photos of before/after labels
- Ficha técnica (packaging specs from Cannava)

### AI Agent should:
- Extract ficha técnica specs → compare with actual packaging
- Verify bag types match packing list (EVOH/PBD LDPE)
- Push unit counts to M4.5 storage

---

## M4.5 — Storage
### Currently has:
- Box assignment system
- QR code scanning
- Temperature monitoring
- Uses BT.units/BT.bags1kg/BT.doy10g

### Depends on:
- M4 relabeling completion
- M0.5 packing list (unit counts)

---

## M5 — Shipment
### Currently has:
- SendCloud integration
- Wix orders

### What originals would tell us:
- Customer order details
- Shipping labels
- Delivery confirmations

---

## M6 — Reconciliation
### Currently has:
- Imported quantity: uses BT.kg
- Yield calculation
- BtM reconciliation

### Depends on:
- ALL previous stages completed
- Finance data for cost per unit

---

## FINANCE
### What should update from originals:
- Packing List → EXW value (€116,538.02) → product cost
- WAS Invoice → transport costs (€49,355.52) → logistics cost
- Proforma Invoice → total invoice value → cost of goods
- Customs docs → customs duties → import costs
- VAT calculations → from CIF value

### Current issues:
- Some costs are hardcoded
- Should recalculate when originals provide actual numbers

---

## SUMMARY OF NEEDED IMPROVEMENTS:

### 1. AI Agent Quality
- Current: basic PDF byte reading (doesn't work well)
- Needed: Claude API reads PDF properly, returns structured JSON
- Status: Claude API call is wired but needs testing with real docs

### 2. Data Flow Between Stages
- Current: each stage is independent, hardcoded
- Needed: when original uploaded in M0.5, data flows to M1, M1.5, M4, Finance
- Solution: after AI extraction, system updates BT_DATA and stage displays

### 3. Verification Display
- Current: shows extracted badges but no comparison
- Needed: side-by-side "System says X / Document says Y" with ✅/⚠️
- Solution: AI returns discrepancies array

### 4. Finance Integration  
- Current: hardcoded financial data
- Needed: costs update from actual invoice uploads
- Solution: AI finance extraction feeds Finance module

### 5. Cross-Stage Intelligence
- Example: Packing list says 140kg → M1.5 vault arrival weight check should expect 140kg
- Example: COA says THC 19.5% → M4 label should show 19.5%
- Example: Invoice says €116,538 → Finance should use this number
