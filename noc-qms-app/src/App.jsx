import React, { useState, useCallback, useRef, Fragment } from "react";

const T={de:{dashboard:"Dashboard",lifecycle:"Lebenszyklus",batches:"Chargen",suppliers:"Lieferanten",lab:"Labor",deviations:"Abweichungen",sops:"SOPs",btm:"BtM",docs:"Dokumente",users:"Benutzer",overview:"Übersicht",operations:"Betrieb",quality:"Qualität",admin:"Verwaltung",agent:"KI-Agent",alerts:"Warnungen",preArr:"Vorbereitung",registration:"Registrierung",custVat:"Zoll & MwSt",vault:"Tresor",labTest:"Labor",qpRel:"QP-Freigabe",relabel:"Etikettierung",storage:"Lagerung",shipment:"Versand",recon:"Abstimmung",logistics:"GDP-Transport",quarRel:"Quarantäne-Freigabe",supDocs:"Lieferantendossier",uploaded:"Hochgeladen",required:"Erforderlich",optional:"Optional",validUntil:"Gültig bis",refNo:"Ref-Nr.",issuedBy:"Ausgestellt von",issuedOn:"Ausgestellt am",expiresIn:"Läuft ab in",days:"Tagen",warning:"Warnung",critical:"Kritisch",viewDoc:"Ansehen",sendReminder:"Erinnern",scheduleRenewal:"Erneuern",licenseMonitor:"Lizenz-Monitor",pass:"✓ Konform",gate:"Sicherheitstor",allPass:"ALLE BESTANDEN",spec:"Spezifikation",result:"Ergebnis",param:"Parameter",assess:"Bewertung",certNo:"Zert-Nr.",testResults:"Prüfergebnisse",date:"Datum",labels:"Etiketten",photos:"Fotos",completed:"Abgeschlossen",location:"Standort",carrier:"Spediteur",departed:"Abfahrt",arrived:"Ankunft",temp:"Temperatur",gps:"GPS",barcodes:"Barcodes",discrepancy:"Abweichung",vat:"MwSt 19%",status:"Status",batch:"Charge",active:"Aktiv",name:"Name",email:"E-Mail",role:"Rolle",cgz:"Chargenfreigabe",coa:"COA",importDoc:"Importdossier",btmDoc:"BtM",transferDoc:"Transfer",relabelDoc:"Umetikettierung",supplierCoa:"Lieferanten-COA",qsiResults:"QSI-Ergebnisse",comparison:"Vergleich",declared:"Deklariert",confirmed:"Bestätigt",variance:"Abweichung",withinSpec:"Innerhalb Spez.",outsideSpec:"Außerhalb Spez.",terpeneProfile:"Terpenprofil",totalTerpenes:"Gesamt-Terpene"},
en:{dashboard:"Dashboard",lifecycle:"Lifecycle",batches:"Batches",suppliers:"Suppliers",lab:"Lab Results",deviations:"Deviations",sops:"SOPs",btm:"BtM",docs:"Documents",users:"Users",overview:"Overview",operations:"Operations",quality:"Quality",admin:"Admin",agent:"AI Agent",alerts:"Alerts",preArr:"Pre-Arrival Docs",registration:"Registration & Permits",custVat:"Customs & VAT",vault:"Vault Arrival",labTest:"Lab Testing",qpRel:"QP Release",relabel:"Relabeling",storage:"Storage",shipment:"Shipment",recon:"Reconciliation",logistics:"GDP Transport",quarRel:"Quarantine Release",supDocs:"Supplier Dossier",uploaded:"Uploaded",required:"Required",optional:"Optional",validUntil:"Valid until",refNo:"Ref No.",issuedBy:"Issued by",issuedOn:"Issued on",expiresIn:"Expires in",days:"days",warning:"Warning",critical:"Critical",viewDoc:"View",sendReminder:"Remind",scheduleRenewal:"Renew",licenseMonitor:"License Monitor",pass:"✓ Compliant",gate:"Safety Gate",allPass:"ALL PASS",spec:"Specification",result:"Result",param:"Parameter",assess:"Assessment",certNo:"Cert No.",testResults:"Test Results",date:"Date",labels:"Labels",photos:"Photos",completed:"Completed",location:"Location",carrier:"Carrier",departed:"Departed",arrived:"Arrived",temp:"Temperature",gps:"GPS",barcodes:"Barcodes",discrepancy:"Discrepancy",vat:"VAT 19%",status:"Status",batch:"Batch",active:"Active",name:"Name",email:"Email",role:"Role",cgz:"Batch Release",coa:"COA",importDoc:"Import Dossier",btmDoc:"BtM Record",transferDoc:"Transfer",relabelDoc:"Relabeling",supplierCoa:"Supplier COA",qsiResults:"QSI Results",comparison:"Comparison",declared:"Declared",confirmed:"Confirmed",variance:"Variance",withinSpec:"Within Spec",outsideSpec:"Outside Spec",terpeneProfile:"Terpene Profile",totalTerpenes:"Total Terpenes"}};


const BT={id:"BI-02-NOCB1.1-INF-F",p:"NOC SE 19",exp:"29.08.2026",lab:"QSI Bremen",aNo:"210-1624923",per:"26.11–04.12.2025",coa:"12.12.2025",qp:"Dr. Olaf Schagon",cert:"NOC-CGZ-2025-003"};

// Supplier QP Contacts — for document renewal requests
const SUP_QP={
cannava:{qp:"Lic. María Fernanda Ruiz",email:"mfruiz@cannava.gob.ar",title:"QP / Directora Técnica",company:"Cannabis Avatara S.E.",authority:"ANMAT",country:"Argentina",
  renew:[{doc:"GMP Certificate",ref:"ANMAT-GMP-2024-4821",exp:"15.03.2028"},{doc:"QTA",ref:"QTA-NOC-CANN-2024-01",exp:"15.03.2026",urgent:true},{doc:"Export Permit",ref:"SEDRONAR",exp:"18.08.2026"},{doc:"Supplier Audit",ref:"Next audit",exp:"12.02.2026",urgent:true}]},
mccn:{qp:"Dr. Carlos Andrés Moreno",email:"camoreno@medcolcanna.com",title:"QP / Director Técnico",company:"MEDCOLCANNA S.A.S.",authority:"INVIMA",country:"Colombia",
  renew:[{doc:"Written Confirmation",ref:"Art. 46b",exp:"MISSING",urgent:true},{doc:"FNE Export Permit",ref:"FNE",exp:"30.06.2026",urgent:true},{doc:"GACP Audit",ref:"INVIMA",exp:"15.09.2026"},{doc:"GMP Certificate",ref:"INVIMA",exp:"Ausstehend"}]},
hytn:{qp:"Dr. James Mitchell",email:"jmitchell@hytncannabis.com",title:"QP / Quality Director",company:"HYTN Cannabis Inc.",authority:"Health Canada",country:"Canada",
  renew:[{doc:"Health Canada GMP",ref:"HC-DEL",exp:"Ausstehend"},{doc:"Cannabis Export Permit",ref:"HC",exp:"Ausstehend"},{doc:"QTA Draft",ref:"QTA-NOC-HYTN",exp:"Ausstehend"}]},
noc:{qp:"Dr. Olaf Schagon",email:"schagon@noc-pharma.de",title:"QP §15 AMG",company:"NOC Pharma GmbH",authority:"BfArM",country:"Germany",
  renew:[{doc:"BfArM Import Permit",ref:"E-12267/2025",exp:"28.02.2026",urgent:true},{doc:"INCB Authorization 2026",ref:"INCB-IMP-DE-2026",exp:"Ausstehend",urgent:true},{doc:"§52a License",ref:"WDE-2024-0847",exp:"Active"}]}
};

// FULL Ph. Eur. Cannabis flos parameters with supplier COA vs QSI comparison
const LAB=[
{de:"THC (Dronabinol)",en:"THC (Dronabinol)",sup:"20,1%",qsi:"19,7%",spec:"19% ±10%",lim:[17.1,20.9],unit:"%",m:"HPLC-DAD",cat:"potency",var:-2.0},
{de:"CBD",en:"CBD",sup:"0,3%",qsi:"0,28%",spec:"≤1,0%",lim:[0,1.0],unit:"%",m:"HPLC-DAD",cat:"potency",var:-6.7},
{de:"CBN",en:"CBN",sup:"<0,1%",qsi:"<0,05%",spec:"≤0,5%",lim:[0,0.5],unit:"%",m:"HPLC-DAD",cat:"potency",var:null},
{de:"Trocknungsverlust",en:"Loss on drying",sup:"8,2%",qsi:"8,6%",spec:"≤12%",lim:[0,12],unit:"%",m:"Ph.Eur. 2.2.32",cat:"physical",var:4.9},
{de:"Feuchtigkeit (Karl Fischer)",en:"Moisture (Karl Fischer)",sup:"7,8%",qsi:"8,1%",spec:"≤10%",lim:[0,10],unit:"%",m:"Ph.Eur. 2.5.12",cat:"physical",var:3.8},
{de:"Blei (Pb)",en:"Lead (Pb)",sup:"<0,5",qsi:"0,3",spec:"≤0,5 ppm",lim:[0,0.5],unit:"ppm",m:"ICP-MS Ph.Eur. 2.4.27",cat:"metals",var:null},
{de:"Cadmium (Cd)",en:"Cadmium (Cd)",sup:"n.n.",qsi:"n.n.",spec:"≤0,3 ppm",lim:[0,0.3],unit:"ppm",m:"ICP-MS Ph.Eur. 2.4.27",cat:"metals",var:null},
{de:"Quecksilber (Hg)",en:"Mercury (Hg)",sup:"n.n.",qsi:"n.n.",spec:"≤0,1 ppm",lim:[0,0.1],unit:"ppm",m:"ICP-MS Ph.Eur. 2.4.27",cat:"metals",var:null},
{de:"Arsen (As)",en:"Arsenic (As)",sup:"n.n.",qsi:"n.n.",spec:"≤0,2 ppm",lim:[0,0.2],unit:"ppm",m:"ICP-MS Ph.Eur. 2.4.27",cat:"metals",var:null},
{de:"TAMC",en:"TAMC (Total Aerobic)",sup:"8.500 KBE/g",qsi:"10.000 KBE/g",spec:"≤500.000 KBE/g",lim:[0,500000],unit:"CFU/g",m:"Ph.Eur. 5.1.4 (2.6.12)",cat:"micro",var:17.6},
{de:"TYMC",en:"TYMC (Yeasts & Moulds)",sup:"850 KBE/g",qsi:"1.200 KBE/g",spec:"≤10.000 KBE/g",lim:[0,10000],unit:"CFU/g",m:"Ph.Eur. 5.1.4 (2.6.12)",cat:"micro",var:41.2},
{de:"Gallentol. Gram-neg.",en:"Bile-tolerant Gram-neg.",sup:"<100",qsi:"<100",spec:"≤50.000 KBE/g",lim:[0,50000],unit:"CFU/g",m:"Ph.Eur. 5.1.4 (2.6.13)",cat:"micro",var:null},
{de:"E. coli",en:"E. coli",sup:"n.n.",qsi:"n.n.",spec:"n.n. in 1g",lim:null,unit:"",m:"Ph.Eur. 2.6.13",cat:"micro",var:null},
{de:"Salmonella",en:"Salmonella",sup:"n.n.",qsi:"n.n.",spec:"n.n. in 25g",lim:null,unit:"",m:"Ph.Eur. 2.6.13",cat:"micro",var:null},
{de:"Pestizide",en:"Pesticides",sup:"konform",qsi:"n.n. < BG",spec:"Ph.Eur. 2.8.13",lim:null,unit:"",m:"GC-MS/MS + LC-MS/MS",cat:"contam",var:null},
{de:"Aflatoxin B1",en:"Aflatoxin B1",sup:"<1 ppb",qsi:"<1 ppb",spec:"≤2 ppb",lim:[0,2],unit:"ppb",m:"Ph.Eur. 2.8.18",cat:"myco",var:null},
{de:"Aflatoxine gesamt",en:"Aflatoxins total (B1+B2+G1+G2)",sup:"<1 ppb",qsi:"<1 ppb",spec:"≤4 ppb",lim:[0,4],unit:"ppb",m:"Ph.Eur. 2.8.18",cat:"myco",var:null},
{de:"Ochratoxin A",en:"Ochratoxin A",sup:"<1 ppb",qsi:"<1 ppb",spec:"≤2 ppb",lim:[0,2],unit:"ppb",m:"Ph.Eur. 2.8.22",cat:"myco",var:null},
{de:"Terpene gesamt",en:"Total Terpenes",sup:"2,8%",qsi:"2,6%",spec:"Informativ",lim:null,unit:"%",m:"GC-FID/MS",cat:"terpene",var:-7.1},
];

const TERPENES=[
{n:"Myrcene",sup:0.85,qsi:0.79},{n:"β-Caryophyllene",sup:0.62,qsi:0.58},{n:"Limonene",sup:0.44,qsi:0.41},
{n:"Linalool",sup:0.31,qsi:0.29},{n:"α-Pinene",sup:0.22,qsi:0.20},{n:"Humulene",sup:0.18,qsi:0.17},
{n:"β-Pinene",sup:0.10,qsi:0.09},{n:"Terpinolene",sup:0.08,qsi:0.07}
];

// Supplier-specific microbiology limits per QTA
const MICRO_LIMITS={
cannava:{name:"Cannava (Argentina)",tamc:500000,tymc:10000,gram:50000},
hytn:{name:"HYTN (Canada)",tamc:500000,tymc:500000,gram:50000},
mccn:{name:"MCCN (Colombia)",tamc:500000,tymc:10000,gram:50000}
};

const SG=[{id:"M0",n:"registration",ic:"📝",c:"#b45309"},{id:"M0.5",n:"preArr",ic:"📋",c:"#7c3aed"},{id:"M1",n:"logistics",ic:"🚛",c:"#0891b2"},{id:"M1.5",n:"vault",ic:"📦",c:"#059669"},{id:"M2",n:"labTest",ic:"🔬",c:"#d97706"},{id:"M3",n:"qpRel",ic:"✅",c:"#16a34a"},{id:"M3.1",n:"quarRel",ic:"🔓",c:"#0369a1"},{id:"M3.5",n:"logistics",ic:"🚛",c:"#0d9488"},{id:"M4",n:"relabel",ic:"🏷️",c:"#9333ea"},{id:"M4.5",n:"storage",ic:"📦",c:"#ea580c"},{id:"M5",n:"shipment",ic:"📤",c:"#dc2626"},{id:"M6",n:"recon",ic:"📊",c:"#6366f1"}];

// M0 Documents — now with Phytosanitary + fixed INCB expiry
const M0D=[
{k:"sq",ic:"🏭",up:1,req:1,st:"ok",de:"Lieferantenqualifizierung",en:"Supplier Qualification File",ref:"SQF-CANN-2025-001",by:"ANMAT",on:"15.03.2025",vu:"15.03.2028",dl:1114,det:[["GMP Cert","ANMAT-GMP-2024-4821 → 15.03.2028"],["QTA","QTA-NOC-CANN-2024-01 → 15.03.2026 ⚠️"],["PIC/S","Accepted (Argentina — ANMAT)"],["Last Audit","12.02.2025 (Jujuy, on-site)"],["Next Audit","12.02.2026 ⚠️ OVERDUE"],["Mfg License","ANMAT Disp. 2025/1847"],["GDP Status","ANMAT GDP certified"],["Stability","ICH Q1A 25°C/60% RH — 24mo"]]},
{k:"qr",ic:"📱",up:1,req:1,st:"ok",de:"Serien-/QR-Codes (NOC)",en:"Serial/QR Codes (NOC generated)",ref:"SER-BI02-2025",by:"NOC Pharma QMS",on:"01.10.2025",vu:"—",dl:null,det:[["Total Erstellt","239 unique codes"],["Format","BI-02-NOCB1.1-INF-F-{SIZE}-{SEQ}"],["1kg bags","0001–0139 (139 units)"],["10g doypacks","0001–0100 (100 units)"],["Sent to Supplier","05.10.2025 (encrypted)"],["Applied & Confirmed","20.10.2025"],["Verification","SHA-256 hash per unit"]]},
{k:"pi",ic:"💰",up:1,req:1,st:"ok",de:"Proforma-Rechnung",en:"Proforma Invoice",ref:"PI-CANN-2025-0047",by:"Cannabis Avatara S.E.",on:"15.09.2025",vu:"—",dl:null,det:[["Invoice Value","€198,500.00"],["Incoterms","CIF Frankfurt (Incoterms 2020)"],["Currency","EUR"],["Payment","Net 30 after customs release"],["Bank","Banco Nación Argentina"],["VAT Rate","19% Einfuhrumsatzsteuer on CIF value"],["VAT Amount","€37,715.00 (19% × €198,500)"],["VAT Payment","Due upon customs clearance at Frankfurt Zollamt"],["VAT Refund","Reclaimable via Vorsteuervergütung (§15 UStG)"],["Refund Timeline","3–6 months processing by Bundeszentralamt für Steuern"],["Refund Status","⏳ Filed 20.11.2025 — pending BZSt confirmation"]]},
{k:"tc",ic:"🚚",up:1,req:1,st:"ok",de:"Transport & Logistikkosten (WAS Logistics)",en:"Transport & Logistics Costs (WAS Logistics)",ref:"138688",by:"WAS-Logistics GmbH, Wörth",on:"06.11.2025",vu:"—",dl:null,det:[["Invoice No.","138688 (Rechnung Original)"],["U/Ref.","2511.6/26092/0"],["KD-Nr.","10508"],["Sachb.","Rafael Rey — r.rey@was-logistics.com"],["Service Date","15.11.2025"],["Sender","Cannabis Avatara S.E., AR-4600 San Salvador de Jujuy"],["Receiver","NOC Pharma GmbH, DE-07751 Golmsdorf"],["Contents","3 Paletten — Medical Cannabis"],["Gross Weight","198.5 kg"],["Chargeable Weight","293.0 kg (Taxgewicht)"],["Pick up Jujuy → EZE","4,200 USD → €3,656.13"],["Armed Guard Escort","7,150.00 USD → €6,224.15"],["Origin Fixed Charges","525.00 USD → €457.02"],["Origin Variable Charges","300.00 USD → €261.15"],["Airfreight EZE → FRA","1,992.40 USD → €1,734.40"],["Cargo Insurance","1,165.38 USD → €1,014.47"],["Taxes (Calculated) 19%","€24,678.21"],["Subtotal (MwSt frei)","€38,025.53"],["FRA Airport Handling","€147.00"],["Customs Clearance","€245.00"],["Transport FRA → Murchin","€3,155.00 (temp. controlled 15–25°C)"],["Armed Guard Escort (DE)","€5,974.00"],["Subtotal (MwSt pflichtig)","€9,521.00"],["MwSt (19%)","€1,808.99"],["TOTAL EUR","€49,355.52"],["FX Rate","1 USD = 0.87051 EUR"],["Payment","Zahlbar sofort (due immediately)"]]},
{k:"pl",ic:"📦",up:1,req:1,st:"ok",de:"Packstückliste",en:"Packing List",ref:"PL-00003-0000011",by:"Cannabis Avatara S.E.",on:"25.10.2025",vu:"—",dl:null,det:[["Item 1","139 × 1kg LDPE bags — Cannabis flos API"],["Item 2","100 × 10g Doypacks — Commercial"],["Item 3","3 × Sensitech TempTale Ultra"],["Net Weight","140.0 kg"],["Gross Weight","198.5 kg (incl. packaging)"],["Pallets","3 (ISPM 15 treated)"],["Boxes","7"],["Total Barcodes","239 (verified vs SER list)"]]},
{k:"ip",ic:"🔐",up:1,req:1,st:"critical",de:"Einfuhrgenehmigung (BfArM §3 BtMG)",en:"Import Permit (BfArM §3 BtMG)",ref:"E-12267/2025",by:"BfArM (Bundesinstitut für Arzneimittel)",on:"01.09.2025",vu:"28.02.2026",dl:4,det:[["Legal Basis","§3 Abs. 1 BtMG + §11 BtMG"],["Substance","Cannabis flos (Dronabinol)"],["Schedule","Anlage III BtMG"],["Max Quantity","250 kg"],["Used This Permit","198.5 kg (79.4%)"],["Verbleibend","51.5 kg"],["Gueltig bis","28.02.2026 — 4 DAYS"],["BfArM Contact","BtM-Referat +49 228 99307-3623"],["Return Obligation","§11 Abs. 1 BtMG — Original must be returned to BfArM within 1 month after import"],["Return Status","✅ RETURNED — Sent 20.11.2025"],["Sent via","Deutsche Post — Einschreiben mit Rückschein (Registered mail)"],["Tracking No.","RR 1234 5678 9DE"],["Sent Date","20.11.2025 (6 days after goods arrival)"],["Return Receipt","✅ Received by BfArM — confirmed 24.11.2025"],["Annotated","Permit annotated: actual qty 198.5 kg, import date 14.11.2025, customs ref"]],ret:true},

{k:"ep",ic:"📤",up:1,req:1,st:"ok",de:"Ausfuhrgenehmigung (ANMAT)",en:"Export Permit (ANMAT)",ref:"Exp-2025-NOC-003",by:"ANMAT Argentina",on:"20.08.2025",vu:"20.08.2026",dl:177,det:[["Exporter","Cannabis Avatara S.E., Jujuy"],["Importer","NOC Pharma GmbH, Germany"],["Max Quantity","300 kg"],["Used","198.5 kg (66.2%)"],["INCB Notification","✅ Completed (cross-ref INCB auth)"]]},
{k:"ap",ic:"📜",up:1,req:1,st:"ok",de:"Apostille (Haager Übereinkommen)",en:"Apostille (Hague Convention)",ref:"APO-AR-2025-7821",by:"Argentine Ministry of Foreign Affairs",on:"25.08.2025",vu:"—",dl:null,det:[["Convention","Hague Apostille Convention 1961"],["Covers","GMP Certificate, Export Permit, Supplier COA"],["Authentication","✅ Verified by German Embassy Buenos Aires"]]},
{k:"bt",ic:"⚖️",up:1,req:1,st:"ok",de:"BtM-Ausfuhrerklärung",en:"BtM Export Declaration",ref:"BtM-EXP-AR-2025-0047",by:"SEDRONAR Argentina",on:"18.08.2025",vu:"18.08.2026",dl:175,det:[["Authority","SEDRONAR (Secretaría de Políticas Integrales sobre Drogas)"],["Substance","Cannabis sativa L. (flos, dried)"],["1961 Convention","Schedule IV"],["Cross-ref INCB","INCB-IMP-DE-2025-0891"]]},
{k:"ic",ic:"🌐",up:1,req:1,st:"warning",de:"INCB-Genehmigung",en:"INCB Authorization",ref:"INCB-IMP-DE-2025-0891",by:"INCB Vienna",on:"05.09.2025",vu:"31.12.2025",dl:-55,det:[["EXPIRED","⚠️ 31.12.2025 — 55 days ago!"],["Status","Covered — shipment arrived 14.11.2025 (before expiry)"],["Import Country","Germany (DE annual estimate)"],["Export Country","Argentina"],["2025 Annual Estimate","500 kg cannabis flos"],["Used YTD","198.5 kg (39.7%)"],["2026 Estimate","Filed 01.10.2025 — pending INCB confirmation"],["Note","New auth needed for any 2026 imports"]]},
{k:"sc",ic:"🔬",up:1,req:1,st:"ok",de:"Lieferanten-COA (Cannava)",en:"Supplier COA (Cannava Lab)",ref:"COA-CANN-2025-BI02",by:"Laboratorio Cannava, Jujuy",on:"20.10.2025",vu:"—",dl:null,det:[["Labor","In-house (Cannava, ISO 17025 scope)"],["THC","20.1% (declared)"],["CBD","0.3%"],["Moisture","8.2% (gravimetric)"],["TAMC","8,500 CFU/g"],["TYMC","850 CFU/g"],["Pesticides","Konform"],["Aflatoxins","<1 ppb"],["NOTE","⚠️ Supplier COA is REFERENCE ONLY"],["Regulatory","QSI Bremen independent retest MANDATORY per §14 AMG"]]},
{k:"aw",ic:"✈️",up:1,req:1,st:"ok",de:"Luftfrachtbrief (AWB)",en:"Air Waybill (AWB)",ref:"020-12345678",by:"LATAM Cargo",on:"10.11.2025",vu:"—",dl:null,det:[["MAWB","020-12345678"],["HAWB","NOC-FWD-2025-047"],["Carrier","LATAM Cargo LA8170"],["Origin","EZE (Buenos Aires Ezeiza)"],["Destination","FRA (Frankfurt am Main)"],["Abfahrt","12.11.2025 23:45 ART"],["Arrival","14.11.2025 18:30 CET"],["Pieces","3 pallets / 7 boxes"],["Gross Weight","198.5 kg"],["Freight Forwarder","K+N Pharma Logistics"]]},
{k:"fi",ic:"🛡️",up:1,req:1,st:"ok",de:"Frachtversicherung",en:"Freight Insurance Certificate",ref:"INS-NOC-2025-TR-047",by:"Allianz Trade",on:"08.11.2025",vu:"08.02.2026",dl:null,det:[["Policy","INS-NOC-2025-TR-047"],["Insurer","Allianz Trade (EU)"],["Coverage","All-risk marine + air + warehouse"],["Value Insured","€250,000 (125% of invoice)"],["Route","Buenos Aires → Frankfurt → Anklam"],["Deductible","€500"]]},
{k:"dl",ic:"🌡️",up:1,req:1,st:"ok",de:"Datenlogger (Sensitech)",en:"Datalogger (Sensitech)",ref:"SEN-2025-DL-003",by:"Sensitech Inc.",on:"10.11.2025",vu:"—",dl:null,det:[["Devices","SEN-003-A (pallet 1), -B (pallet 2), -C (pallet 3)"],["Type","Sensitech TempTale Ultra"],["Range","-30°C to +70°C / 0–100% RH"],["Interval","Every 5 minutes"],["GDP Limits","15–25°C (EU GDP 2013/C 343/01)"],["Result: Min Temp","16.2°C ✅"],["Result: Max Temp","23.1°C ✅"],["Result: Avg Temp","19.4°C"],["Result: Humidity","38–52% RH ✅"],["MKT","19.8°C (Mean Kinetic Temp)"],["Calibration Valid","→ 10.05.2026"]]},
{k:"ph",ic:"🌿",up:1,req:1,st:"ok",de:"Phytosanitäres Zeugnis",en:"Phytosanitary Certificate",ref:"PHYTO-AR-2025-28471",by:"SENASA Argentina",on:"08.11.2025",vu:"—",dl:null,det:[["Authority","SENASA (Servicio Nacional de Sanidad)"],["ISPM 15","Pallet treatment confirmed (HT 56°C/30min)"],["Pest-free","Certified pest-free declaration"],["IPPC Standard","ISPM No. 12 (Phytosanitary Certificates)"],["EU Regulation","Reg. (EU) 2016/2031 Plant Health"],["Inspection","Buenos Aires port, 08.11.2025"],["Stamp","✅ SENASA official seal + inspector signature"]]}
];

const ALERTS=[
{lv:"critical",ic:"🔴",de:"BfArM Einfuhrgenehmigung E-12267/2025 — 4 Tage! Erneuerungsantrag sofort stellen! Bearbeitungszeit 6–8 Wochen.",en:"BfArM Import Permit E-12267/2025 — 4 days! File renewal NOW! Processing takes 6–8 weeks.",dk:"ip"},
{lv:"critical",ic:"🔴",de:"INCB-Genehmigung 2025 abgelaufen (31.12.2025). 2026-Schätzung eingereicht — Bestätigung ausstehend. Kein Import bis Genehmigung!",en:"INCB Authorization 2025 expired (31.12.2025). 2026 estimate filed — confirmation pending. NO imports until approved!",dk:"ic"},
{lv:"warning",ic:"🟠",de:"QTA mit Cannava läuft 15.03.2026 ab — Erneuerung 3 Monate vorher einleiten.",en:"QTA with Cannava expires 15.03.2026 — initiate renewal 3 months ahead.",dk:"sq"},
{lv:"warning",ic:"🟠",de:"Lieferantenaudit Cannava ÜBERFÄLLIG (fällig 12.02.2026). Sofort Termin bestätigen.",en:"Cannava supplier audit OVERDUE (due 12.02.2026). Confirm scheduling immediately.",dk:"sq"},
{lv:"warning",ic:"🟠",de:"MCCN FNE-Exportgenehmigung läuft 30.06.2026 ab — Written Confirmation (INVIMA) vor erstem Import!",en:"MCCN FNE export permit expires 30.06.2026 — Written Confirmation (INVIMA) needed BEFORE first import!",dk:null},
{lv:"warning",ic:"🟠",de:"§52a AMG Großhandelserlaubnis: Nächste Inspektion durch Landesbehörde prüfen.",en:"§52a AMG wholesale license: Check next inspection due date with state authority.",dk:null},
{lv:"info",ic:"🟡",de:"INCB Jahresschätzung 2026: 500 kg eingereicht. Davon 0 kg verbraucht.",en:"INCB annual estimate 2026: 500 kg filed. 0 kg used so far.",dk:"ic"},
{lv:"info",ic:"🟡",de:"Sensitech Kalibrierung gültig bis 10.05.2026 — Nachkalibrierung in 75 Tagen planen.",en:"Sensitech calibration valid until 10.05.2026 — schedule recalibration in 75 days.",dk:"dl"},
{lv:"info",ic:"🟡",de:"Lieferanten-COA vs. QSI: THC-Abweichung -2,0% (innerhalb 10% Toleranz). TAMC +17,6% (innerhalb Spez.).",en:"Supplier COA vs QSI: THC variance -2.0% (within 10% tolerance). TAMC +17.6% (within spec).",dk:null}
];

const AGENTS={
master:{fl:"🏛️",name:"NOC Pharma Master Compliance Agent",sub:{de:"🇩🇪 BfArM & PIC/S Compliance Overseer — Alle Lieferanten, SOPs, Audit-Readiness, Behördenanfragen",en:"🇩🇪 BfArM & PIC/S Compliance Overseer — All suppliers, SOPs, Audit Readiness, Authority Inquiries"},grad:["#1e1b4b","#4338ca"],
alerts:[
{lv:"critical",ic:"🔴",de:"BfArM Einfuhrgenehmigung E-12267/2025 — 4 Tage! CANNAVA betroffen.",en:"BfArM Import Permit E-12267/2025 — 4 days! CANNAVA affected.",dk:"ip"},
{lv:"critical",ic:"🔴",de:"INCB 2025 abgelaufen — Kein Import bis 2026 bestätigt.",en:"INCB 2025 expired — No imports until 2026 confirmed.",dk:"ic"},
{lv:"critical",ic:"🔴",de:"🇨🇴 MCCN: Written Confirmation INVIMA FEHLT — Art. 46b Blocker.",en:"🇨🇴 MCCN: Written Confirmation INVIMA MISSING — Art. 46b blocker.",dk:null},
{lv:"warning",ic:"🟠",de:"QTA Cannava läuft 15.03.2026 ab. QTA MCCN noch im Entwurf.",en:"QTA Cannava expires 15.03.2026. QTA MCCN still in draft.",dk:null},
{lv:"warning",ic:"🟠",de:"305 SOPs geladen — 297 Updates ausstehend (QMS v1.0).",en:"305 SOPs loaded — 297 updates pending (QMS v1.0).",dk:null},
{lv:"warning",ic:"🟠",de:"Audit-Readiness: 0/15 Audit • 0/15 Cyber • 0/15 Pflicht.",en:"Audit Readiness: 0/15 Audit • 0/15 Cyber • 0/15 Mandatory.",dk:null},
{lv:"warning",ic:"🟠",de:"🇨🇦 HYTN: Erstqualifizierung nicht begonnen.",en:"🇨🇦 HYTN: Initial qualification not started.",dk:null},
{lv:"info",ic:"🟡",de:"3 Lieferanten: 🇦🇷 Aktiv, 🇨🇴 Qualifizierung, 🇨🇦 Geplant.",en:"3 Suppliers: 🇦🇷 Active, 🇨🇴 Qualification, 🇨🇦 Planned.",dk:null},
{lv:"info",ic:"🟡",de:"PIC/S Status: 🇦🇷 ANMAT ✅ | 🇨🇴 INVIMA ❌ | 🇨🇦 HC ✅.",en:"PIC/S Status: 🇦🇷 ANMAT ✅ | 🇨🇴 INVIMA ❌ | 🇨🇦 HC ✅.",dk:null}
],quick:["Compliance overview","Authority audit prep","SOP status","All supplier status","PIC/S compliance","BfArM readiness","INCB status","Master file"],
chat:(x)=>{const l=x.toLowerCase();
if(l.includes("compliance")||l.includes("overview")||l.includes("status"))return "🏛️ NOC PHARMA COMPLIANCE OVERVIEW\n\n🇦🇷 CANNAVA — ACTIVE\n• PIC/S: ✅ ANMAT member\n• BfArM Permit: 🔴 4 days! E-12267/2025\n• INCB: 🔴 2025 expired, 2026 pending\n• Batches: BI-01 (closed), BI-02 (M4.5), BI-03 (M2), BI-04 (planned)\n\n🇨🇴 MEDCOLCANNA — QUALIFICATION\n• PIC/S: ❌ INVIMA NOT member\n• Written Confirmation: 🔴 MISSING (Art. 46b)\n• BfArM Permit: ⏳ Blocked by WC\n• PZN: ✅ 6 products registered (IFA Nr. 1000658281)\n\n🇨🇦 HYTN — PLANNED\n• PIC/S: ✅ Health Canada member\n• EU-Canada MRA: ✅ Simplified pathway\n• Qualification: ⏳ Not started\n\n📋 QMS: 305 SOPs | 297 updates pending";
if(l.includes("audit")||l.includes("authority")||l.includes("bfarm")||l.includes("readiness"))return "📋 AUTHORITY AUDIT READINESS\n\n🏛️ BfArM / Landesbehörde:\n• §52a AMG License: ✅ WDE-2024-0847\n• Site Master File: v2 (Kahla)\n• QP: Torsten Cuny (§15 AMG)\n• RP: Celso Hamelink\n• BtM License: ✅ Active\n\n📊 Audit Scores:\n• Audit: 0/15 ⚠️\n• Cyber: 0/15 ⚠️\n• Mandatory: 0/15 ⚠️\n\n📂 Key SOPs Ready:\n• SOP-QMS-001 Pharma QS: v1 (38%)\n• SOP-BTM-001 BtM-Verkehr: v1 (38%)\n• SOP-MFG-006 Einfuhr: 38%\n• SOP-604 Wareneingang: 25%\n\n→ PRIORITY: Complete audit prep!";
if(l.includes("sop")||l.includes("document"))return "📋 SOP STATUS (QMS v1.0)\n\n305 SOPs loaded\n297 updates pending\n0 files uploaded\n\nKey SOP Categories:\n• QMS-001–012: Quality System\n• PER-001–006: Personnel\n• MFG-001–010: Manufacturing\n• DOC-001–005: Documentation\n• GDP-001–005: Distribution\n• BTM-001–008: BtM/Cannabis\n• CS-001–009: Computer Systems\n• QC-001–006: Quality Control\n• EQ-001–005: Equipment\n• AI-01–11: AI Governance\n\nSite Master File: SMF-V2 (Kahla)";
if(l.includes("pics")||l.includes("pic/s"))return "🏛️ PIC/S COMPLIANCE MATRIX\n\n🇦🇷 Argentina (ANMAT):\n• PIC/S Member: ✅ Since 2017\n• GMP Accepted: ✅ Direct recognition\n• Written Confirmation: NOT needed\n\n🇨🇴 Colombia (INVIMA):\n• PIC/S Member: ❌ NOT member\n• GMP Accepted: ❌ NOT on EU list\n• Written Confirmation: 🔴 MANDATORY (Art. 46b)\n• Status: MISSING — IMPORT BLOCKER\n\n🇨🇦 Canada (Health Canada):\n• PIC/S Member: ✅ Founding member\n• EU-Canada MRA: ✅ Active\n• Written Confirmation: NOT needed\n\n→ MCCN is the only supplier requiring Art. 46b WC";
if(l.includes("incb"))return "🌐 INCB STATUS\n\n🇩🇪 Germany Annual Estimate 2026: 500 kg filed\n\n🇦🇷 Cannava:\n• 2025: EXPIRED (31.12.2025)\n• Shipment arrived before expiry ✅\n• 2026: Ausstehend INCB confirmation\n• SEDRONAR export quota: confirmed\n\n🇨🇴 Medcolcanna:\n• DNE Colombia: ⏳ Not yet allocated\n• Requires BfArM permit first\n\n🇨🇦 HYTN:\n• Health Canada: ⏳ Not yet allocated\n• Requires BfArM permit first\n\n→ NO imports possible until 2026 INCB confirmed";
if(l.includes("master file")||l.includes("smf"))return "📄 SITE MASTER FILE\n\nSMF-V2: Kahla Im Camisch 14\n\nKey Sections:\n• Company: NOC Pharma GmbH\n• License: §52a AMG WDE-2024-0847\n• QP: Torsten Cuny\n• RP: Celso Hamelink\n• Activities: Import, QC, Storage, Distribution\n• BtM: Anlage III (Cannabis flos)\n• Suppliers: Cannava (AR), MCCN (CO), HYTN (CA)\n• Storage: Kahla Zone A/B/C (15-25°C)\n• Lab: QSI Bremen (§14 AMG)\n• IT: QMS v1.0 + AI Agents";
return "🏛️ NOC PHARMA MASTER AGENT\n\n3 Suppliers | 305 SOPs | 6 Batches\n🔴 2 Critical: BfArM permit + INCB\n🟠 4 Warnings: QTA + Audit + MCCN WC + HYTN\n\n→ Ask about: compliance, audit prep, SOPs, PIC/S, INCB, master file";}
},
cannava:{fl:"🇦🇷",name:"ANMAT × BfArM Compliance Specialist",sub:{de:"🇦🇷 ANMAT-Spezialist (GMP, GACP, Disposiciones) + 🇩🇪 BfArM-Auditor (BtMG §3/§11, AMG §15, Anlage III)",en:"🇦🇷 ANMAT Specialist (GMP, GACP, Disposiciones) + 🇩🇪 BfArM Auditor (BtMG §3/§11, AMG §15, Anlage III)"},grad:["#065f46","#047857"],
alerts:[
{lv:"critical",ic:"🔴",de:"BfArM Einfuhrgenehmigung E-12267/2025 — 4 Tage! Sofort erneuern!",en:"BfArM Import Permit E-12267/2025 — 4 days! File renewal NOW!",dk:"ip"},
{lv:"critical",ic:"🔴",de:"INCB-Genehmigung 2025 abgelaufen. 2026 ausstehend. Kein Import!",en:"INCB Authorization 2025 expired. 2026 pending. NO imports!",dk:"ic"},
{lv:"warning",ic:"🟠",de:"QTA Cannava läuft 15.03.2026 ab — Erneuerung einleiten.",en:"QTA Cannava expires 15.03.2026 — initiate renewal.",dk:"sq"},
{lv:"warning",ic:"🟠",de:"Lieferantenaudit Cannava ÜBERFÄLLIG (12.02.2026).",en:"Cannava supplier audit OVERDUE (12.02.2026).",dk:"sq"},
{lv:"warning",ic:"🟠",de:"§52a AMG: Nächste Inspektion prüfen.",en:"§52a AMG: Check next inspection date.",dk:null},
{lv:"info",ic:"🟡",de:"INCB 2026: 500 kg eingereicht. 0 kg verbraucht.",en:"INCB 2026: 500 kg filed. 0 kg used.",dk:"ic"},
{lv:"info",ic:"🟡",de:"Sensitech Kalibrierung bis 10.05.2026.",en:"Sensitech calibration until 10.05.2026.",dk:"dl"},
{lv:"info",ic:"🟡",de:"COA vs QSI: THC -2,0% OK. TAMC +17,6% OK.",en:"COA vs QSI: THC -2.0% OK. TAMC +17.6% OK.",dk:null}
],quick:["Import permit?","COA comparison?","INCB status?","Audit schedule?","ANMAT GMP?","Batch summary"],
chat:(x)=>{const l=x.toLowerCase();if(l.includes("import")||l.includes("permit"))return "🔴 BfArM Import Permit E-12267/2025\nExpires: 28.02.2026 (4 days!)\nUsed: 198.5/250 kg\n→ File renewal IMMEDIATELY\n→ Contact: +49 228 99307-3623";if(l.includes("coa")||l.includes("qsi"))return "🔬 COA vs QSI Bremen:\n• THC: 20.1% → 19.7% (Δ -2.0%) ✅\n• TAMC: 8,500 → 10,000 (+17.6%) ✅\n• TYMC: 850 → 1,200 (+41.2%) ✅\nAll within spec. QSI = official result (§14 AMG).";if(l.includes("incb"))return "🌐 INCB:\n2025: EXPIRED (shipment arrived before)\n2026: 500 kg filed — PENDING\nNo imports until confirmed!";if(l.includes("audit")||l.includes("anmat"))return "🇦🇷 Cannava Audit:\nLast: 12.02.2025 (Jujuy)\nNext: 12.02.2026 ⚠️ OVERDUE!\nPIC/S: ANMAT = accepted\n→ Confirm date THIS WEEK";return "Batch BI-02: ✅ 15/15 docs • 19/19 params PASS\n🔴 Import permit 4d! • INCB expired\n→ Priority: BfArM renewal TODAY";}},
mccn:{fl:"🇨🇴",name:"INVIMA × BfArM Compliance Specialist",sub:{de:"🇨🇴 INVIMA/FNE-Spezialist (Written Confirmation Art. 46b, GACP, Estupefacientes) + 🇩🇪 BfArM-Auditor (BtMG, AMG, EU-GMP Äquivalenz)",en:"🇨🇴 INVIMA/FNE Specialist (Written Confirmation Art. 46b, GACP, Estupefacientes) + 🇩🇪 BfArM Auditor (BtMG, AMG, EU-GMP Equivalence)"},grad:["#92400e","#b45309"],
alerts:[
{lv:"critical",ic:"🔴",de:"Written Confirmation (INVIMA) FEHLT — Pflicht vor Import!",en:"Written Confirmation (INVIMA) MISSING — mandatory before import!",dk:null},
{lv:"critical",ic:"🔴",de:"Kolumbien NICHT auf EU-GMP-Äquivalenzliste.",en:"Colombia NOT on EU GMP equivalence list.",dk:null},
{lv:"warning",ic:"🟠",de:"FNE-Export läuft 30.06.2026 ab.",en:"FNE export expires 30.06.2026.",dk:null},
{lv:"warning",ic:"🟠",de:"GACP-Audit geplant 15.09.2026.",en:"GACP audit planned 15.09.2026.",dk:null},
{lv:"info",ic:"🟡",de:"Varietäten: Mango Bliss, Sky Walker, Purple Mountain.",en:"Varieties: Mango Bliss, Sky Walker, Purple Mountain.",dk:null}
],quick:["INVIMA status?","Written Confirmation?","FNE permit?","GACP audit?","Import checklist","BfArM permit?"],
chat:(x)=>{const l=x.toLowerCase();if(l.includes("invima")||l.includes("written"))return "🔴 INVIMA Written Confirmation:\nStatus: NOT OBTAINED\nLegal: Art. 46b Dir. 2001/83/EC\nColombia NOT on EU GMP list\n→ Contact INVIMA Bogotá BEFORE logistics";if(l.includes("fne"))return "🇨🇴 FNE Export Permit:\nExpires: 30.06.2026\nLead time: ~6 months\n→ Also need BfArM separate permit + INCB allocation";if(l.includes("checklist")||l.includes("import"))return "📝 MCCN Pre-Import Checklist:\n1. 🔴 Written Confirmation (INVIMA) — MISSING\n2. 🔴 FNE Export Permit\n3. 🟠 GACP Audit (15.09.2026)\n4. 🟠 BfArM Import Permit\n5. 🟠 INCB Colombia allocation\n→ Items 1-2 are BLOCKERS";return "🇨🇴 Medcolcanna: QUALIFICATION PHASE\nWritten Confirmation: 🔴 MISSING\nFNE: expires 30.06.2026\n→ Priority: Obtain INVIMA WC";}},
hytn:{fl:"🇨🇦",name:"Health Canada × BfArM Compliance Specialist",sub:{de:"🇨🇦 Health Canada-Spezialist (Cannabis Act, Cannabis Regulations Div. 4, DEL) + 🇩🇪 BfArM-Auditor (BtMG, PIC/S Mutual Recognition, Ph.Eur.)",en:"🇨🇦 Health Canada Specialist (Cannabis Act, Cannabis Regulations Div. 4, DEL) + 🇩🇪 BfArM Auditor (BtMG, PIC/S Mutual Recognition, Ph.Eur.)"},grad:["#1e3a5f","#1e40af"],
alerts:[
{lv:"warning",ic:"🟠",de:"Erstqualifizierung HYTN nicht begonnen.",en:"Initial qualification not started.",dk:null},
{lv:"warning",ic:"🟠",de:"BfArM: Separate Einfuhrgenehmigung erforderlich.",en:"BfArM: Separate import permit required.",dk:null},
{lv:"info",ic:"🟡",de:"Health Canada = PIC/S — vereinfachte Anerkennung.",en:"Health Canada = PIC/S — simplified recognition.",dk:null},
{lv:"info",ic:"🟡",de:"TYMC Kanada 500.000 vs Ph.Eur. 10.000 — Ph.Eur. gilt.",en:"TYMC Canada 500,000 vs Ph.Eur. 10,000 — Ph.Eur. applies.",dk:null}
],quick:["Health Canada GMP?","PIC/S recognition?","Cannabis Act?","TYMC limits?","Import checklist","BfArM permit?"],
chat:(x)=>{const l=x.toLowerCase();if(l.includes("health canada")||l.includes("gmp"))return "🇨🇦 Health Canada GMP:\nPIC/S MEMBER ✓\n→ Simplified recognition (no Written Confirmation needed)\n→ Request HC Drug Establishment Licence (DEL)\n→ Cannabis Act Division 4 governs exports";if(l.includes("tymc")||l.includes("limit"))return "⚠️ TYMC Difference:\nHealth Canada: 500,000 CFU/g\nPh.Eur.: 10,000 CFU/g\n→ Ph.Eur. applies in Germany\n→ HYTN product must meet 10,000 limit";if(l.includes("checklist"))return "📝 HYTN Checklist:\n1. 🟠 HC DEL + GMP cert\n2. 🟠 Supplier Qualification + QTA\n3. 🟠 Initial audit\n4. 🟠 BfArM import permit\n5. 🟠 INCB Canada allocation\nPIC/S simplifies steps 1-3";return "🇨🇦 HYTN: PLANNED\nPIC/S member → simplified GMP\nTYMC: must meet Ph.Eur. 10,000\n→ Next: Request HC DEL + GMP cert";}}
};

const USERS=[{n:"Dr. Olaf Schagon",e:"schagon@noc-pharma.de",r:"qp"},{n:"Torsten Cuny",e:"cuny@noc-pharma.de",r:"vp"},{n:"Celso Hamelink",e:"hamelink@noc-pharma.de",r:"admin"},{n:"QA Manager",e:"qa@noc-pharma.de",r:"leitung_qs"},{n:"Logistics",e:"logistics@noc-pharma.de",r:"logistics"},{n:"Warehouse",e:"warehouse@noc-pharma.de",r:"warehouse"},{n:"Lab Tech",e:"lab@noc-pharma.de",r:"lab_tech"}];
const RC={admin:"#7c3aed",leitung_qs:"#2563eb",qp:"#059669",vp:"#d97706",logistics:"#0891b2",warehouse:"#ea580c",lab_tech:"#dc2626"};
const RN={de:{admin:"Admin",leitung_qs:"Leitung QS",qp:"QP",vp:"VP",logistics:"Logistik",warehouse:"Lager",lab_tech:"Labor"},en:{admin:"Admin",leitung_qs:"Head QA",qp:"QP",vp:"VP",logistics:"Logistics",warehouse:"Warehouse",lab_tech:"Lab Tech"}};

const Bd=({children,c="#6b7280",b="#f3f4f6"})=><span style={{display:"inline-flex",padding:"2px 7px",borderRadius:11,fontSize:14,fontWeight:600,background:b,color:c,whiteSpace:"nowrap"}}>{children}</span>;
const Dot=({s})=>{const c=s==="ok"?"#059669":s==="warning"?"#d97706":s==="critical"?"#dc2626":"#9ca3af";return <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0,boxShadow:s==="critical"||s==="warning"?"0 0 0 3px "+c+"30":undefined}}/>};

const Cd=({t:ti,badge,children})=><div style={{background:"#fff",borderRadius:9,border:"1px solid #e5e7eb",boxShadow:"0 1px 2px rgba(0,0,0,.05)",marginBottom:10}}>{ti&&<div style={{padding:"10px 14px",borderBottom:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center"}}><strong style={{fontSize:15}}>{ti}</strong>{badge}</div>}<div style={{padding:"10px 14px"}}>{children}</div></div>;
const CatLabel={potency:["Potency","#7c3aed","#f3e8ff"],physical:["Physical","#0891b2","#ecfeff"],metals:["Heavy Metals","#dc2626","#fee2e2"],micro:["Microbiology","#d97706","#fef3c7"],contam:["Contaminants","#6366f1","#eef2ff"],myco:["Mycotoxins","#ea580c","#fff7ed"],terpene:["Terpenes","#059669","#ecfdf5"]};

export default function App(){
const[auth,setAuth]=useState(null);
const[loginForm,setLoginForm]=useState({user:"",pass:"",remember:false,loading:false,error:""});
const[lang,setLang]=useState("en");const[pg,setPg]=useState("lifecycle");const[lcs,setLcs]=useState(0);const[exDoc,setExDoc]=useState(null);const[agO,setAgO]=useState(false);const[agT,setAgT]=useState("alerts");const[agMode,setAgMode]=useState("supplier");const[ci,setCi]=useState("");const[cm,setCm]=useState([]);const[labTab,setLabTab]=useState("compare");const[sup,setSup]=useState("cannava");const[thcProto,setThcProto]=useState({open:false,newThc:"",reason:"",piaNotified:false,pznRequested:false});const[docPreview,setDocPreview]=useState(null);const[uploads,setUploads]=useState([]);const fileRef=useRef(null);const[trSrc,setTrSrc]=useState("");const[trOut,setTrOut]=useState("");const[trLang,setTrLang]=useState("de");const[trLoading,setTrLoading]=useState(false);const t=T[lang];const sn=9;
const triggerUpload=()=>{if(fileRef.current)fileRef.current.click()};
const handleFileUpload=async(e)=>{const files=Array.from(e.target.files||[]);if(!files.length)return;const supName=sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN";const batch=selBatch||"BI-03";
const stageRules=[
{stage:"M0",keys:["canmed","registration","gmp_cert","gmp-cert","gmp certificate","gmp conform","gacp","quality_technical","qta","pzn","ifa","bfarm","import_permit","import-permit","incb","supplier_qual","sqf","qualification","dqs","anmat"]},
{stage:"M0.5",keys:["coa","certificate_of_analysis","supplier_coa","export_permit","export-permit","sedronar","phyto","sanitary","packing","pack_list","btm_export","btm-export","invoice","factura","origin","senasa","proforma"]},
{stage:"M1",keys:["awb","airway","waybill","cmr","transport","gdp","temp_log","temperature","datalog","sensitech","customs","mrn","zoll","insurance","iata","dg_declaration","freight","cargo"]},
{stage:"M1.5",keys:["vault","arrival","receipt","btm_receipt","visual","inspection","seal","quarantine","weight","tresor"]},
{stage:"M2",keys:["qsi","lab","potency","hplc","micro","tamc","tymc","metal","heavy","mycotox","aflatox","terpene","moisture","testing","analysis","residual"]},
{stage:"M3",keys:["release","qp_release","qp-release","cgz","batch_release","freigabe","declaration"]},
{stage:"M3.1",keys:["quarantine_release","quar_release","zone_transfer"]},
{stage:"M3.5",keys:["gdp_out","outbound","transfer_transport"]},
{stage:"M4",keys:["label","relabel","etikett","artwork","pzn_verify","barcode","print"]},
{stage:"M4.5",keys:["storage","lager","allocation","inventory","monitoring"]},
{stage:"M5",keys:["shipping","ship","delivery","dispatch","customer","order"]},
{stage:"M6",keys:["reconcil","recon","yield","final","archive","close"]}
];
// Content-based classification keywords (for PDF text content)
const contentRules=[
{stage:"M0",keys:["gacp conform","gc-mark","gmp certificate","manufacturing license","good agricultural","collection practice","quality technical agreement","supplier qualification","pics member","herstellungserlaubnis"]},
{stage:"M0.5",keys:["certificate of analysis","analytic report","export permit","phytosanitary","packing list","btm export","commercial invoice","certificate of origin"]},
{stage:"M1",keys:["air waybill","cmr consignment","transport order","temperature log","customs declaration","insurance policy","dangerous goods"]},
{stage:"M1.5",keys:["vault arrival","btm receipt","visual inspection","seal verification","quarantine zone"]},
{stage:"M2",keys:["laboratory report","potency analysis","hplc","microbiology","heavy metals","mycotoxin","terpene profile","moisture content"]},
{stage:"M3",keys:["release certificate","batch release","qualified person","qp release","sachkundige person","freigabezertifikat"]},
{stage:"M4",keys:["label approval","relabeling protocol","pzn verification","artwork"]},
{stage:"M6",keys:["reconciliation","yield calculation","final batch","archive"]}
];
const assignStage=(fname,content)=>{
const fn=fname.toLowerCase().replace(/[_\-\.]/g," ");
// First try filename
for(const rule of stageRules){for(const kw of rule.keys){if(fn.includes(kw))return rule.stage}}
// Then try content if available
if(content){const ct=content.toLowerCase();for(const rule of contentRules){for(const kw of rule.keys){if(ct.includes(kw))return rule.stage}}}
return SG[lcs]?.id||"M0"
};
// Read file content for classification + create preview URL
const processFile=async(file,blob)=>{
const url=URL.createObjectURL(blob||file);
const ext=(file.name||"").split(".").pop().toLowerCase();
let textContent="";
// Extract text from PDF for content classification
if(ext==="pdf"&&blob){
try{
const arr=await (blob||file).arrayBuffer();
const bytes=new Uint8Array(arr);
let txt="";
// Simple PDF text extraction (looks for text between parentheses in PDF stream)
for(let i=0;i<bytes.length-1;i++){
if(bytes[i]===0x28){let s="";let depth=1;i++;while(i<bytes.length&&depth>0){if(bytes[i]===0x28)depth++;else if(bytes[i]===0x29)depth--;else if(depth>0)s+=String.fromCharCode(bytes[i]);i++}if(s.length>2)txt+=s+" "}}
textContent=txt.slice(0,2000);
}catch(ex){}
}
return {textContent,url,ext};
};
const createEntry=(name,size,ext,date,stage,batchId,supplier,url,content,fromZip)=>({
name,size,type:ext,date,stage,batch:batchId,sup:supplier,
url,content:content.slice(0,500),fromZip:fromZip||null
});
// Check for ZIP
const zipFile=files.find(f=>f.name.toLowerCase().endsWith(".zip"));
if(zipFile){
try{
if(!window.JSZip){const s2=document.createElement("script");s2.src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js";document.head.appendChild(s2);await new Promise(r=>s2.onload=r)}
const zip=await window.JSZip.loadAsync(zipFile);
const entries=Object.keys(zip.files).filter(nm=>!zip.files[nm].dir&&!nm.startsWith("__MACOSX")&&!nm.startsWith("."));
const extracted=[];
for(const nm of entries){
const blob=await zip.files[nm].async("blob");
const shortName=nm.includes("/")?nm.split("/").pop():nm;
const {textContent,url,ext}=await processFile({name:shortName},blob);
const stage=assignStage(shortName,textContent);
extracted.push(createEntry(shortName,(blob.size/1024).toFixed(1)+"KB",ext,new Date().toLocaleString("de-DE"),stage,batch,supName,url,textContent,zipFile.name));
}
setUploads(p=>[...extracted,...p]);
const sc={};extracted.forEach(f=>{sc[f.stage]=(sc[f.stage]||0)+1});
alert("✅ "+extracted.length+" "+(lang==="de"?"Dateien extrahiert und klassifiziert":"files extracted & classified")+":\n\n"+Object.entries(sc).map(([s,c])=>s+": "+c+" "+(lang==="de"?"Datei(en)":"file(s)")).join("\n")+"\n\n"+(lang==="de"?"Alle Dateien sind jetzt unter den Lifecycle-Stages verfuegbar fuer Vorschau und Druck.":"All files are now available under lifecycle stages for preview and print."));
}catch(err){alert("Error: "+err.message+"\n\n"+(lang==="de"?"Bitte erneut versuchen.":"Please try again."))}
}else{
// Regular files
const processed=[];
for(const f of files){
const {textContent,url,ext}=await processFile(f,f);
const stage=assignStage(f.name,textContent);
processed.push(createEntry(f.name,(f.size/1024).toFixed(1)+"KB",ext,new Date().toLocaleString("de-DE"),stage,batch,supName,url,textContent,null));
}
setUploads(p=>[...processed,...p]);
alert("✅ "+processed.length+" "+(lang==="de"?"Datei(en) klassifiziert":"file(s) classified")+":\n\n"+processed.map(f=>"• "+f.name+" → "+f.stage).join("\n")+"\n\n"+(lang==="de"?"Verfuegbar fuer Vorschau und Druck unter Lifecycle.":"Available for preview and print under Lifecycle."));
}
e.target.value="";
};

const users=[
{id:"celso",name:"Celso Hamelink",role:"Responsible Person §52a AMG / Operations Manager",email:"celso@noc-pharma.de",level:"admin",initials:"CH"},
{id:"schagon",name:"Dr. Olaf Schagon",role:"Qualified Person §15 AMG",email:"dr.schagon@noc-pharma.de",level:"qp",initials:"OS"},
{id:"torsten",name:"Torsten Cuny",role:"Responsible Person §52a AMG",email:"torsten@noc-pharma.de",level:"rp",initials:"TC"},
{id:"dominik",name:"Dominik Delacher",role:"Storage Manager / Warehouse",email:"dominik@noc-pharma.de",level:"warehouse",initials:"DD"},
{id:"auditor",name:"BfArM Auditor",role:"Federal Institute Inspector",email:"audit@bfarm.de",level:"auditor",initials:"BA"}
];

const handleLogin=(e)=>{
if(e)e.preventDefault();
setLoginForm(p=>({...p,loading:true,error:""}));
setTimeout(()=>{
const u=users.find(x=>x.id===loginForm.user.toLowerCase()||x.email===loginForm.user.toLowerCase()||x.name.toLowerCase()===loginForm.user.toLowerCase());
if(u){setAuth(u);setLoginForm(p=>({...p,loading:false}))}
else if(loginForm.user.trim()){
const guest={id:"guest",name:loginForm.user,role:"Authorized User",email:loginForm.user+"@noc-pharma.de",level:"viewer",initials:loginForm.user.substring(0,2).toUpperCase()};
setAuth(guest);setLoginForm(p=>({...p,loading:false}));
}else{setLoginForm(p=>({...p,loading:false,error:lang==="de"?"Benutzername erforderlich":"Username required"}))}
},1200);
};

const SUPS=[{k:"cannava",fl:"🇦🇷",n:"Cannava",co:"Argentina",st:lang==="de"?"Aktiv":"Active",c:"#059669"},{k:"mccn",fl:"🇨🇴",n:"Medcolcanna",co:"Colombia",st:lang==="de"?"Qualifizierung":"Qualifizierung",c:"#d97706"},{k:"hytn",fl:"🇨🇦",n:"HYTN",co:"Canada",st:lang==="de"?"Geplant":"Planned",c:"#2563eb"}];const curSup=SUPS.find(s=>s.k===sup)||SUPS[0];

const BATCHES={
cannava:[
{id:"BI-01",n:1,ref:"BI-01-NOCB1.0-INF-F",product:"NOC SE 19 Cannabis flos (T22/1)",kg:"150.0",units:180,permit:"E-10891/2024",import:"22.03.2025",stage:12,status:"closed",stageLabel:"M6 Closed",qp:"CGZ-2024-0031",color:"#6b7280"},
{id:"BI-02",n:2,ref:"BI-02-NOCB1.1-INF-F",product:"NOC SE 19 Cannabis flos (T22/1)",kg:"198.5",units:239,permit:"E-12267/2025",import:"14.11.2025",stage:10,status:"active",stageLabel:"M4.5 Storage",qp:"CGZ-2025-0047",color:"#059669"},
{id:"BI-03",n:3,ref:"BI-03-NOCB1.2-INF-F",product:"NOC SE 19 Cannabis flos (T22/1)",kg:"200.0",units:240,permit:"E-12267/2025",import:"28.01.2026",stage:5,status:"active",stageLabel:"M2 Lab Testing",qp:null,color:"#d97706"},
{id:"BI-04",n:4,ref:"BI-04-NOCB1.3-INF-F",product:"NOC SE 19 Cannabis flos (T22/1)",kg:"250.0",units:0,permit:"Ausstehend",import:"~Apr 2026",stage:0,status:"planned",stageLabel:"M0 Planned",qp:null,color:"#9ca3af"}
],
hytn:[
{id:"HY-01",n:1,ref:"HY-01-NOC-CAN-F",product:"HYTN Premium Cannabis flos",kg:"0",units:0,permit:"Ausstehend",import:"~Q3 2026",stage:0,status:"planned",stageLabel:"M0 Planned",qp:null,color:"#9ca3af"}
],
mccn:[
{id:"MC-01",n:1,ref:"MC-01-NOC-COL-F",product:"Medcolcanna Cannabis flos",kg:"0",units:0,permit:"Ausstehend",import:"~Q4 2026",stage:0,status:"planned",stageLabel:"M0 Planned",qp:null,color:"#9ca3af"}
]
};
const[selBatch,setSelBatch]=useState("BI-02");
const[batchExpanded,setBatchExpanded]=useState(true);
const supBatches=BATCHES[sup]||[];
const curBatch=supBatches.find(b=>b.id===selBatch)||supBatches[0]||null;
const ordinal=(n)=>lang==="de"?n+". Import":n===1?"1st Import":n===2?"2nd Import":n===3?"3rd Import":n+"th Import";

// Google Drive folder structure: base/supplier/batch/stage/document
// Google Drive Configuration
// HOW TO SET UP: Create this folder structure in your Google Drive, then replace IDs below
// To get a folder ID: open folder in Drive → copy the long ID from the URL after /folders/
// Structure: NOC Pharma QMS / [Supplier] / [Batch] / [Stage] / documents
const GD_BASE="https://drive.google.com/drive/folders/";
const GD_ROOT="https://drive.google.com/drive/my-drive";
// Replace these with your actual Google Drive folder IDs when ready
// For now, all buttons will open Google Drive root
const GD_IDS={
  root:"",  // Your NOC Pharma QMS root folder ID
  cannava:"", bi01:"", bi02:"", bi03:"", bi04:"",
  mccn:"", mc01:"",
  hytn:"", hy01:"",
  pzn:"", ifa:"", sops:"", protocols:""
};
const gdLink=(docKey)=>{
  // Check if we have a real folder ID for this key
  const k=docKey?.replace(/[.\-\/\s]/g,"").toLowerCase()||"";
  if(GD_IDS[k]&&GD_IDS[k].length>5)return GD_BASE+GD_IDS[k];
  // Check supplier root
  const supId=GD_IDS[sup]||GD_IDS[sup?.toLowerCase()];
  if(supId&&supId.length>5)return GD_BASE+supId;
  // Check main root
  if(GD_IDS.root&&GD_IDS.root.length>5)return GD_BASE+GD_IDS.root;
  // Fallback: open Google Drive search with context
  const searchQ="NOC Pharma "+(sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN")+" "+(selBatch||"")+" "+(docKey||"");
  return "https://drive.google.com/drive/search?q="+encodeURIComponent(searchQ.trim());
};
const gmailLink=(subject,body)=>"https://mail.google.com/mail/?view=cm&fs=1&su="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body);

const DocActions=({doc,stage})=>{
const hasDoc=doc.up||doc.st==="ok"||doc.st==="done";
const docName=doc[lang]||doc.en||doc.de||"Document";
const ref=doc.ref||"";const by=doc.by||"";const on=doc.on||"";const vu=doc.vu||"";
const folderUrl=gdLink(doc.k||stage||"");
const supName=sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN";
const qpData=SUP_QP[sup]||SUP_QP.cannava;const nocQp=SUP_QP.noc;
// Build document as structured email body (the email IS the document)
const docBody=()=>{const sep="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";const ld=lang==="de";const rows=[[ld?"Dokument":"Document",docName],[ld?"Referenz":"Reference",ref],[ld?"Ausgestellt von":"Issued by",by],[ld?"Ausstellungsdatum":"Issue date",on],[ld?"Gueltig bis":"Valid until",vu],[ld?"Charge":"Batch",selBatch||"—"],[ld?"Lieferant":"Supplier",supName],[ld?"Stufe":"Stage",stage],[ld?"Status":"Status",hasDoc?(ld?"✅ Konform":"✅ Compliant"):(ld?"⏳ Ausstehend":"⏳ Pending")]];if(doc.det)doc.det.forEach(d=>rows.push(d));let body="NOC PHARMA GmbH\nPharmaceutical Quality Management System v2.5\n§52a AMG · EU GMP · BtMG\n"+sep+"\n\n";rows.forEach(r=>{body+=r[0]+": "+r[1]+"\n"});body+="\n"+sep+"\n\nRP: C. Hamelink · QP: T. Cuny\nNOC Pharma GmbH · Im Camisch 14 · 07768 Kahla · MV\n"+(ld?"Erstellt: ":"Generated: ")+new Date().toISOString()+"\nQMS v2.5";return body};
// Print PDF function
const printPdf=()=>{const ld=lang==="de";const w=window.open("","_blank","width=800,height=600");w.document.write('<html><head><title>'+docName+' — NOC Pharma</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1f2937}h1{font-size:18px;border-bottom:2px solid #1e40af;padding-bottom:8px;color:#1e40af}h2{font-size:14px;color:#374151;margin-top:20px}table{width:100%;border-collapse:collapse;margin:16px 0}td{padding:6px 10px;border:1px solid #d1d5db;font-size:13px}td:first-child{font-weight:700;background:#f9fafb;width:35%}.ft{margin-top:30px;padding-top:10px;border-top:1px solid #d1d5db;font-size:10px;color:#9ca3af;text-align:center}.banner{background:#1e40af;color:#fff;padding:16px 40px;margin:-40px -40px 20px;font-size:12px;display:flex;justify-content:space-between;align-items:center}@media print{body{padding:20px}.banner{margin:-20px -20px 20px}}</style></head><body>');w.document.write('<div class="banner"><div><strong style="font-size:16px">NOC Pharma GmbH</strong><br/>QMS v2.5</div><div style="text-align:right">'+new Date().toLocaleDateString('de-DE')+'<br/>§52a AMG</div></div>');w.document.write('<h1>'+docName+'</h1><h2>Deutsch</h2><table>');[["Referenz",ref],["Ausgestellt von",by],["Ausstellungsdatum",on],["Gueltig bis",vu],["Charge",selBatch||"—"],["Lieferant",supName],["Stufe",stage],["Status",hasDoc?"✅ Konform":"⏳ Ausstehend"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+(r[1]||"—")+'</td></tr>')});if(doc.det)doc.det.forEach(function(d){w.document.write('<tr><td>'+d[0]+'</td><td>'+d[1]+'</td></tr>')});w.document.write('</table><h2>English</h2><table>');[["Reference",ref],["Issued by",by],["Issue date",on],["Valid until",vu],["Batch",selBatch||"—"],["Supplier",supName],["Stage",stage],["Status",hasDoc?"✅ Compliant":"⏳ Pending"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+(r[1]||"—")+'</td></tr>')});if(doc.det)doc.det.forEach(function(d){w.document.write('<tr><td>'+d[0]+'</td><td>'+d[1]+'</td></tr>')});w.document.write('</table><div class="ft">NOC Pharma GmbH · Im Camisch 14, 07768 Kahla · §52a AMG · QMS v2.5<br/>RP: C. Hamelink · QP: T. Cuny · Generated: '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)};
// Send = email body IS the document (one click)
const sendDoc=()=>{const subj="NOC Pharma — "+docName+" ["+ref+"] — "+supName+" — Batch "+(selBatch||"");window.open(gmailLink(subj,docBody())+"&to="+encodeURIComponent(qpData.email)+"&cc="+encodeURIComponent(nocQp.email),"_blank")};
return <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
{hasDoc?<>
<button onClick={()=>setDocPreview({name:docName,ref,by,on,vu,stage,hasDoc:true,det:doc.det||[],sup:supName,batch:selBatch||"—"})} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:600,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#fff" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/></svg>{lang==="de"?"Ansehen":"View"}</button>
<button onClick={printPdf} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="#374151" strokeWidth="1.5"/></svg>PDF</button>
<button onClick={sendDoc} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg>{lang==="de"?"Senden":"Send"}</button>
<button onClick={()=>window.open(folderUrl,"_blank")} title="Google Drive" style={{padding:"4px 6px",borderRadius:4,fontSize:14,border:"1px solid #bae6fd",background:"#eff6ff",color:"#1a73e8",cursor:"pointer"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="#1a73e8"/></svg></button>
</>:<>
<button onClick={()=>fileRef.current&&fileRef.current.click()} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:700,border:"2px dashed #d97706",background:"#fffbeb",color:"#92400e",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#92400e" strokeWidth="2"/></svg>{lang==="de"?"Hochladen":"Upload"}</button>
<button onClick={()=>{const subj="Request: "+docName+" ["+ref+"] — "+supName;const body="Sehr geehrte/r "+qpData.qp+",\n\nWir bitten hoeflich um folgendes Dokument:\n\nDokument: "+docName+"\nRef.: "+ref+"\nLieferant: "+supName+"\nCharge: "+(selBatch||"")+"\n\nBitte in unser Google Drive hochladen oder per Antwort-Mail zusenden.\n\nMit freundlichen Gruessen,\nCelso Hamelink\nNOC Pharma GmbH · QMS v2.5";window.open(gmailLink(subj,body)+"&to="+encodeURIComponent(qpData.email)+"&cc="+encodeURIComponent(nocQp.email),"_blank")}} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#374151" strokeWidth="1.5"/><path d="M22 6l-10 7L2 6" stroke="#374151" strokeWidth="1.5"/></svg>{lang==="de"?"Anfordern":"Request"}</button>
</>}
</div>};


const ag=agMode==="master"?AGENTS.master:(AGENTS[sup]||AGENTS.cannava);const ALERTS=ag.alerts;
const ask=useCallback((q)=>{const x=q||ci;if(!x.trim())return;
const r=ag.chat(x);
setCm(p=>[...p,{r:"u",t:x},{r:"a",t:r}]);setCi("")},[ci,sup]);

const nav=[{s:t.overview,i:[{k:"dashboard",ic:"📊",l:t.dashboard},{k:"lifecycle",ic:"🔄",l:t.lifecycle}]},{s:t.operations,i:[{k:"batches",ic:"📦",l:t.batches},{k:"suppliers",ic:"🏭",l:t.suppliers},{k:"supDocs",ic:"📂",l:t.supDocs},{k:"lab",ic:"🔬",l:t.lab}]},{s:t.quality,i:[{k:"deviations",ic:"⚠️",l:t.deviations},{k:"sops",ic:"📑",l:t.sops},{k:"btm",ic:"⚖️",l:t.btm}]},{s:lang==="de"?"Finanzen":"Finance",i:[{k:"finance",ic:"💰",l:lang==="de"?"Finanzen":"Finance"}]},{s:t.docs,i:[{k:"docs",ic:"📜",l:t.docs}]},{s:t.admin,i:[{k:"users",ic:"👥",l:t.users}]}];

// M0 Interactive Document Panel
const[qrGen,setQrGen]=useState(false);
const[qrDone,setQrDone]=useState(false);
const[qrAnim,setQrAnim]=useState("");
const[ipAction,setIpAction]=useState(null); // null=pending, "done"=no renewal, "renew"=filed
const[prUpload,setPrUpload]=useState(null); // null=not uploaded, object=uploaded file info
const qrGenerate=()=>{setQrGen(true);setQrAnim("Generating 139 × 1kg codes...");
setTimeout(()=>setQrAnim("Generating 100 × 10g codes..."),1200);
setTimeout(()=>setQrAnim("Computing SHA-256 hashes..."),2200);
setTimeout(()=>setQrAnim("Compiling QR code package..."),3000);
setTimeout(()=>{setQrGen(false);setQrDone(true);setQrAnim("")},3800)};

const M0=()=>{if(sup==="hytn"||sup==="mccn")return <OnboardWS/>;
if(curBatch&&curBatch.status==="planned")return <Cd t={"📋 M0 "+curBatch.id+" — "+(lang==="de"?"Vorab-Dokumente":"Pre-Arrival Docs")} badge={<Bd c="#9ca3af" b="#f3f4f6">{lang==="de"?"Geplant":"Planned"}</Bd>}><div style={{textAlign:"center",padding:24,color:"#9ca3af"}}><div style={{fontSize:32,marginBottom:8}}>📋</div><div style={{fontSize:15,fontWeight:600,marginBottom:4}}>{lang==="de"?"Wartet auf Dokumentation":"Awaiting documentation"}</div><div style={{fontSize:15,maxWidth:400,margin:"0 auto"}}>{lang==="de"?"Die gleiche Dokumentationsstruktur wie bei BI-01/BI-02 wird verwendet. Dokumente werden hier hochgeladen sobald verfügbar.":"The same documentation structure as BI-01/BI-02 will be used. Documents will be uploaded here once available."}</div><div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,maxWidth:400,margin:"16px auto 0"}}>{["Supplier Qualification","Import Permit (BfArM)","Export Permit","Packing List","Air Waybill","COA","Datenlogger","Phytosanitary Cert."].map((d,j)=><div key={j} style={{padding:"6px 10px",borderRadius:6,border:"1.5px dashed #d1d5db",fontSize:14,color:"#9ca3af",display:"flex",alignItems:"center",gap:4}}><span style={{color:"#d1d5db"}}>○</span>{d}</div>)}</div></div></Cd>;
const up=M0D.filter(d=>d.up).length;const tot=M0D.filter(d=>d.req).length;const crit=M0D.filter(d=>d.st==="critical").length;const warn=M0D.filter(d=>d.st==="warning").length;
return <div><div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}><Bd c="#059669" b="#d1fae5">✅ {up}/{tot} {t.uploaded}</Bd>{crit>0&&<Bd c="#dc2626" b="#fee2e2">🔴 {crit} {t.critical}</Bd>}{warn>0&&<Bd c="#d97706" b="#fef3c7">🟠 {warn} {t.warning}</Bd>}</div>
{M0D.map(doc=>{const ex=exDoc===doc.k;return <div key={doc.k} style={{marginBottom:3}}>
<div onClick={()=>setExDoc(ex?null:doc.k)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:ex?"7px 7px 0 0":7,border:"1.5px solid "+(doc.st==="critical"?"#dc2626":doc.st==="warning"?"#d97706":doc.up?"#059669":"#d1d5db"),background:doc.up?"rgba(5,150,105,.03)":"#fff",cursor:"pointer"}}>
<Dot s={doc.st}/><span style={{fontSize:15}}>{doc.ic}</span>
<div style={{flex:1,minWidth:0}}><div style={{fontSize:16,fontWeight:600}}>{doc[lang]}</div><div style={{fontSize:14,color:"#6b7280"}}>{doc.ref}</div></div>
{doc.st==="critical"&&<Bd c="#dc2626" b="#fee2e2">⚠️ {doc.dl}d</Bd>}
{doc.st==="warning"&&<Bd c="#d97706" b="#fef3c7">⚠️</Bd>}
{doc.dl>0&&doc.dl<=90&&doc.st==="ok"&&<Bd c="#d97706" b="#fef3c7">{doc.dl}d</Bd>}
{doc.up?<Bd c="#059669" b="#d1fae5">✓</Bd>:doc.req?<Bd c="#d97706" b="#fef3c7">{t.required}</Bd>:<Bd>{t.optional}</Bd>}
<span style={{fontSize:16,color:"#9ca3af",transform:ex?"rotate(180deg)":"",transition:"transform .2s"}}>▾</span>
</div>
{ex&&<div style={{border:"1.5px solid #e5e7eb",borderTop:"none",borderRadius:"0 0 7px 7px",background:"#fff",padding:14}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
{[[t.refNo,doc.ref],[t.issuedBy,doc.by],[t.issuedOn,doc.on],[t.validUntil,doc.vu],doc.dl!==null?[t.expiresIn,doc.dl+" "+t.days]:null].filter(Boolean).map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontSize:16,fontWeight:600,color:typeof doc.dl==="number"&&doc.dl<=30?"#dc2626":"#1f2937"}}>{v}</div></div>)}
</div>
<div style={{background:"#f9fafb",borderRadius:6,padding:10,marginBottom:10}}>
{doc.det.map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:j<doc.det.length-1?"1px solid #e5e7eb":"none",fontSize:15}}><span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600,textAlign:"right",maxWidth:"65%"}}>{v}</span></div>)}
</div>
<div style={{display:"flex",gap:5}}>
<DocActions doc={doc} stage="M0"/>
{doc.st==="critical"&&<button style={{padding:"5px 10px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>🔄 {t.scheduleRenewal}</button>}
{doc.st==="warning"&&<button style={{padding:"5px 10px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:"#d97706",color:"#fff",cursor:"pointer"}}>📧 {t.sendReminder}</button>}
</div>

{doc.k==="qr"&&<div style={{marginTop:12,borderTop:"2px solid #e5e7eb",paddingTop:12}}>
{!qrDone&&!qrGen&&<div style={{border:"2px dashed #7c3aed",borderRadius:10,padding:20,textAlign:"center",background:"#faf5ff"}}>
<div style={{fontSize:36,marginBottom:8}}>📱</div>
<div style={{fontSize:16,fontWeight:700,marginBottom:4,color:"#5b21b6"}}>{lang==="de"?"QR-Codes generieren":"Generate QR Codes"}</div>
<div style={{fontSize:15,color:"#6b7280",marginBottom:6,maxWidth:400,margin:"0 auto 12px"}}>{lang==="de"
?"Nach Upload der Packstückliste: Generiert einzigartige QR-Codes für jede Einheit mit SHA-256-Verifizierung. Codes werden für Lieferantendruck verschlüsselt übermittelt."
:"After packing list upload: Generates unique QR codes for each unit with SHA-256 verification. Codes are sent encrypted for supplier printing."}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14,maxWidth:320,margin:"0 auto 14px"}}>
<div style={{background:"#fff",borderRadius:6,padding:8,border:"1px solid #e9d5ff",textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:"#7c3aed"}}>139</div><div style={{fontSize:13,color:"#6b7280"}}>1kg API bags</div></div>
<div style={{background:"#fff",borderRadius:6,padding:8,border:"1px solid #e9d5ff",textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:"#7c3aed"}}>100</div><div style={{fontSize:13,color:"#6b7280"}}>10g Doypacks</div></div>
</div>
<button onClick={qrGenerate} style={{padding:"12px 28px",borderRadius:8,fontSize:15,fontWeight:700,border:"none",background:"linear-gradient(135deg,#7c3aed,#6d28d9)",color:"#fff",cursor:"pointer",boxShadow:"0 4px 12px rgba(124,58,237,.3)"}}>📱 {lang==="de"?"239 QR-Codes generieren":"Generate 239 QR Codes"}</button>
</div>}

{qrGen&&<div style={{border:"2px solid #7c3aed",borderRadius:10,padding:20,textAlign:"center",background:"linear-gradient(135deg,#faf5ff,#f5f3ff)"}}>
<div style={{fontSize:36,marginBottom:8}}>📱</div>
<div style={{fontSize:15,fontWeight:700,color:"#5b21b6",marginBottom:8}}>{lang==="de"?"QR-Codes werden generiert...":"Generating QR codes..."}</div>
<div style={{width:"80%",margin:"0 auto",height:6,background:"#e9d5ff",borderRadius:3,overflow:"hidden",marginBottom:8}}>
<div style={{width:"65%",height:"100%",background:"linear-gradient(90deg,#7c3aed,#6d28d9)",borderRadius:3}}/>
</div>
<div style={{fontSize:15,color:"#7c3aed",fontStyle:"italic"}}>{qrAnim}</div>
</div>}

{qrDone&&<div>
<div style={{background:"#f0fdf4",borderRadius:8,padding:12,marginBottom:10,border:"1px solid #a7f3d0",textAlign:"center"}}>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>✅ {lang==="de"?"239 QR-Codes erfolgreich generiert":"239 QR Codes successfully generated"}</div>
<div style={{fontSize:14,color:"#065f46",marginTop:4}}>{lang==="de"?"Format":"Format"}: BI-02-NOCB1.1-INF-F-{"{SIZE}"}-{"{SEQ}"} • SHA-256 {lang==="de"?"pro Einheit":"per unit"}</div>
</div>

<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>{lang==="de"?"QR-Code Vorschau (erste 6 von 239)":"QR Code Preview (first 6 of 239)"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:10}}>
{[["1KG-0001","139 x 1kg","#7c3aed"],["1KG-0002","","#7c3aed"],["1KG-0003","","#7c3aed"],["10G-0001","100 x 10g","#d97706"],["10G-0002","","#d97706"],["10G-0003","","#d97706"]].map(([seq,note,c],j)=>{const fullCode="BI-02-NOCB1.1-INF-F-"+seq;return <div key={j} style={{background:"#fff",borderRadius:6,padding:8,border:"1px solid #e5e7eb",textAlign:"center"}}>
<canvas ref={el=>{if(el){const ctx=el.getContext("2d");ctx.clearRect(0,0,80,80);const d=fullCode;let bits=[];for(let i=0;i<d.length;i++)bits.push(d.charCodeAt(i)%2);const s=4;const m=Math.ceil(Math.sqrt(bits.length*2));ctx.fillStyle="#fff";ctx.fillRect(0,0,80,80);ctx.fillStyle="#000";for(let y=0;y<m;y++)for(let x=0;x<m;x++){const idx=(y*m+x)%d.length;if((d.charCodeAt(idx)+x*y)%3!==0)ctx.fillRect(x*s+4,y*s+4,s-1,s-1)}ctx.fillStyle="#000";ctx.fillRect(4,4,21,21);ctx.fillStyle="#fff";ctx.fillRect(7,7,15,15);ctx.fillStyle="#000";ctx.fillRect(10,10,9,9);const r=m*s;ctx.fillStyle="#000";ctx.fillRect(r-17,4,21,21);ctx.fillStyle="#fff";ctx.fillRect(r-14,7,15,15);ctx.fillStyle="#000";ctx.fillRect(r-11,10,9,9);ctx.fillStyle="#000";ctx.fillRect(4,r-17,21,21);ctx.fillStyle="#fff";ctx.fillRect(7,r-14,15,15);ctx.fillStyle="#000";ctx.fillRect(10,r-11,9,9)}}} width={80} height={80} style={{margin:"0 auto 4px",display:"block"}}/>
<div style={{fontSize:11,fontWeight:700,color:c,wordBreak:"break-all",lineHeight:1.2}}>{fullCode}</div>
{note&&<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{note}</div>}
</div>})}
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
<button onClick={()=>{const w=window.open("","_blank","width=900,height=700");w.document.write('<html><head><title>QR Codes — NOC Pharma — All 239</title><script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script><style>body{font-family:Arial,sans-serif;padding:20px;font-size:11px}h1{font-size:16px;color:#1e40af}.tools{background:#f1f5f9;padding:10px;border-radius:6px;margin:10px 0;display:flex;gap:8px;align-items:center}.tools button{padding:6px 14px;border-radius:4px;font-size:11px;font-weight:700;border:none;cursor:pointer;color:#fff}.btn-csv{background:#059669}.btn-print{background:#1e40af}table{width:100%;border-collapse:collapse;margin:10px 0}td,th{padding:6px 8px;border:1px solid #d1d5db;font-size:10px;vertical-align:middle}th{background:#f1f5f9}.qr-cell{text-align:center}.code-text{font-size:7px;font-weight:700;color:#1e40af;word-break:break-all;margin-top:2px}@media print{.tools{display:none}body{padding:5px}td,th{padding:3px 4px;font-size:8px}}</style></head><body>');w.document.write('<h1>NOC Pharma GmbH — Complete QR Code Export (239 units)</h1><p>Batch: BI-02-NOCB1.1-INF-F | SHA-256 per unit | '+new Date().toLocaleDateString("de-DE")+'</p>');w.document.write('<div class="tools"><button class="btn-csv" onclick="downloadCSV()">Download CSV (239 codes + hashes)</button><button class="btn-print" onclick="window.print()">Print All QR Codes</button><span style="font-size:10px;color:#6b7280">All 239 QR codes with full identifiers below each code</span></div>');w.document.write('<table><tr><th>#</th><th>QR Code</th><th>Full Code</th><th>Size</th><th>SHA-256</th></tr>');var allCodes=[];for(var i=1;i<=139;i++)allCodes.push(["1KG",i,"1kg"]);for(var i2=1;i2<=100;i2++)allCodes.push(["10G",i2,"10g"]);var csvRows=["No,Code,Size,SHA256"];allCodes.forEach(function(c2,idx){var code="BI-02-NOCB1.1-INF-F-"+c2[0]+"-"+String(c2[1]).padStart(4,"0");var hash="";for(var h=0;h<64;h++)hash+="0123456789abcdef"[Math.floor(Math.random()*16)];csvRows.push((idx+1)+","+code+","+c2[2]+","+hash);w.document.write('<tr><td>'+(idx+1)+'</td><td class="qr-cell"><div id="qr'+idx+'"></div><div class="code-text">'+code+'</div></td><td style="font-size:9px;font-weight:600">'+code+'</td><td>'+c2[2]+'</td><td style="font-family:monospace;font-size:8px">'+hash.substr(0,32)+'...</td></tr>')});w.document.write('</table>');w.document.write('<script>var csvData="'+csvRows.join("\\n")+'";function downloadCSV(){var blob=new Blob([csvData],{type:"text/csv"});var a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="NOC-Pharma-QR-Codes-BI02-239units.csv";a.click()}var allC=[];for(var j=1;j<=139;j++)allC.push("BI-02-NOCB1.1-INF-F-1KG-"+String(j).padStart(4,"0"));for(var j2=1;j2<=100;j2++)allC.push("BI-02-NOCB1.1-INF-F-10G-"+String(j2).padStart(4,"0"));var idx2=0;function renderBatch(){var end=Math.min(idx2+20,allC.length);for(var i=idx2;i<end;i++){var el=document.getElementById("qr"+i);if(el){try{new QRCode(el,{text:allC[i],width:56,height:56,colorDark:"#1e40af",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M})}catch(e){}}}idx2=end;if(idx2<allC.length)setTimeout(renderBatch,100)}renderBatch();<\/script>');w.document.write('<p style="font-size:9px;color:#999;margin-top:10px">NOC Pharma GmbH · QMS v2.5 · SOP-710-01 · '+new Date().toISOString()+'</p></body></html>');w.document.close()}} style={{padding:"10px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#7c3aed",color:"#fff",cursor:"pointer",textAlign:"center"}}>📥 {lang==="de"?"QR-Codes herunterladen":"Download QR Codes"}<div style={{fontSize:12,fontWeight:400,marginTop:2}}>{lang==="de"?"Alle 239 + CSV":"All 239 + CSV"}</div></button>
<button onClick={()=>{var supN=sup==="cannava"?"Cannava S.E.":sup==="mccn"?"Medcolcanna":"HYTN";var supEmail=sup==="cannava"?"ruiz@cannava.gob.ar":sup==="mccn"?"qp@medcolcanna.com":"qp@hytn.ca";var body="NOC PHARMA GmbH\nQR Code Package — Batch BI-02-NOCB1.1-INF-F\n========================================\n\nDear "+supN+" Team,\n\nPlease find attached the QR code package for labeling:\n\n- 139x 1kg units (codes: 1KG-0001 to 1KG-0139)\n- 100x 10g units (codes: 10G-0001 to 10G-0100)\n- Total: 239 unique QR codes\n- Format: BI-02-NOCB1.1-INF-F-{SIZE}-{SEQ}\n- Verification: SHA-256 hash per unit\n\nPlease apply QR codes according to SOP-710-01.\nEncrypted ZIP password will be sent separately.\n\n========================================\nNOC Pharma GmbH · QMS v2.5\nRP: C. Hamelink";window.open(gmailLink("NOC Pharma — QR Code Package — BI-02 — "+supN,body)+"&to="+encodeURIComponent(supEmail)+"&cc="+encodeURIComponent("celso@noc-pharma.de"),"_blank")}} style={{padding:"10px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer",textAlign:"center"}}>📧 {lang==="de"?"Per E-Mail senden":"Send by Email"}<div style={{fontSize:12,fontWeight:400,marginTop:2}}>{lang==="de"?"Verschlüsselt an Lieferant":"Encrypted to supplier"}</div></button>
<button onClick={()=>{var w=window.open("","_blank","width=800,height=900");w.document.write('<html><head><title>QR Label Template A4 — All 239</title><script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script><style>@page{size:A4;margin:8mm}body{font-family:Arial,sans-serif;margin:0;padding:8mm}.header{margin-bottom:6px}.header h1{font-size:13px;color:#1e40af;margin:0}.header p{font-size:8px;color:#666;margin:2px 0}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}.label{border:1px solid #bbb;border-radius:3px;padding:4px;text-align:center;page-break-inside:avoid}.label .qr-wrap{margin:0 auto 2px}.label .code{font-size:6.5px;font-weight:700;color:#1e40af;word-break:break-all;line-height:1.1;margin-top:2px}.label .info{font-size:6px;color:#666}@media print{.no-print{display:none}body{padding:5mm}}</style></head><body>');w.document.write('<div class="no-print" style="background:#f1f5f9;padding:8px;border-radius:6px;margin-bottom:8px;display:flex;gap:8px;align-items:center"><button onclick="window.print()" style="padding:6px 14px;border-radius:4px;font-size:11px;font-weight:700;border:none;background:#1e40af;color:#fff;cursor:pointer">Print All 239 Labels (A4)</button><span style="font-size:10px;color:#6b7280">All labels with scannable QR codes + full code identifier</span></div>');w.document.write('<div class="header"><h1>NOC Pharma GmbH — QR Labels (239 units)</h1><p>Batch: BI-02-NOCB1.1-INF-F | '+new Date().toLocaleDateString("de-DE")+' | SOP-710-01</p></div><div class="grid">');var allCodes=[];for(var i=1;i<=139;i++)allCodes.push(["1KG",i,"1kg"]);for(var i2=1;i2<=100;i2++)allCodes.push(["10G",i2,"10g"]);allCodes.forEach(function(c2,idx){var code="BI-02-NOCB1.1-INF-F-"+c2[0]+"-"+String(c2[1]).padStart(4,"0");w.document.write('<div class="label"><div class="qr-wrap" id="lbl'+idx+'"></div><div class="code">'+code+'</div><div class="info">NOC SE 19 | '+c2[2]+'</div></div>')});w.document.write('</div><p style="margin-top:6px;font-size:7px;color:#999">NOC Pharma GmbH · Im Camisch 14, 07768 Kahla · QMS v2.5 · SOP-710-01</p>');w.document.write('<script>var allC=[];for(var j=1;j<=139;j++)allC.push("BI-02-NOCB1.1-INF-F-1KG-"+String(j).padStart(4,"0"));for(var j2=1;j2<=100;j2++)allC.push("BI-02-NOCB1.1-INF-F-10G-"+String(j2).padStart(4,"0"));var idx2=0;function renderBatch(){var end=Math.min(idx2+20,allC.length);for(var i=idx2;i<end;i++){var el=document.getElementById("lbl"+i);if(el){try{new QRCode(el,{text:allC[i],width:48,height:48,colorDark:"#1e40af",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M})}catch(e){}}}idx2=end;if(idx2<allC.length)setTimeout(renderBatch,100)}renderBatch();<\/script></body></html>');w.document.close()}} style={{padding:"10px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer",textAlign:"center"}}>🖨️ {lang==="de"?"Druckvorlage":"Print Template"}<div style={{fontSize:12,fontWeight:400,marginTop:2}}>{lang==="de"?"Alle 239 Labels (A4)":"All 239 Labels (A4)"}</div></button>
</div>
</div>}
</div>}

{doc.k==="ip"&&<div style={{marginTop:12,borderTop:"2px solid #e5e7eb",paddingTop:12}}>

<div style={{fontSize:15,fontWeight:700,marginBottom:10}}>{lang==="de"?"Genehmigungsstatus — Aktion erforderlich":"Permit Status — Action Required"}</div>
<div style={{background:"#fffbeb",borderRadius:8,padding:12,marginBottom:12,border:"1px solid #fde68a"}}>
<div style={{fontSize:15,color:"#92400e",lineHeight:1.5}}>{lang==="de"
?"Diese Einfuhrgenehmigung läuft am 28.02.2026 ab. Die Sendung ist bereits eingegangen (14.11.2025) und die Genehmigung wurde an das BfArM zurückgesendet. Bitte wählen Sie eine Aktion:"
:"This import permit expires 28.02.2026. The shipment has already arrived (14.11.2025) and the permit has been returned to BfArM. Please select an action:"}</div>
</div>

{!ipAction&&<div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
<div>
<button onClick={()=>setIpAction("done")} style={{padding:"14px",borderRadius:8,fontSize:16,fontWeight:700,border:"2px solid #059669",background:"#f0fdf4",color:"#065f46",cursor:"pointer",textAlign:"center",width:"100%"}}>
<div style={{fontSize:24,marginBottom:4}}>✅</div>
<div>{lang==="de"?"Keine Erneuerung":"No Renewal Needed"}</div>
<div style={{fontSize:13,fontWeight:400,color:"#6b7280",marginTop:4}}>{lang==="de"?"Sendung abgeschlossen, Genehmigung archiviert.":"Shipment completed, permit archived."}</div>
</button>
</div>
<button onClick={()=>setIpAction("renew")} style={{padding:"14px",borderRadius:8,fontSize:16,fontWeight:700,border:"2px solid #2563eb",background:"#eff6ff",color:"#1e40af",cursor:"pointer",textAlign:"center"}}>
<div style={{fontSize:24,marginBottom:4}}>🔄</div>
<div>{lang==="de"?"Neue Genehmigung beantragen":"File New Permit Application"}</div>
<div style={{fontSize:13,fontWeight:400,color:"#6b7280",marginTop:4}}>{lang==="de"?"Neuen Antrag beim BfArM. 6–8 Wochen.":"File new application with BfArM. Processing: 6–8 weeks."}</div>
</button>
</div>

<div style={{borderTop:"2px solid #e5e7eb",paddingTop:14}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:10}}>📨 {lang==="de"?"Rücksendenachweis hochladen":"Upload Return Proof"}</div>

{!prUpload&&<div>
<div style={{background:"#fef3c7",borderRadius:8,padding:10,marginBottom:10,border:"2px solid #f59e0b",textAlign:"center"}}>
<div style={{fontSize:22,marginBottom:2}}>⚠️</div>
<div style={{fontSize:16,fontWeight:700,color:"#92400e"}}>{lang==="de"?"Nachweis erforderlich":"Proof Required"}</div>
<div style={{fontSize:14,color:"#92400e",marginTop:3}}>{lang==="de"?"Laden Sie den Versandbeleg ODER die BfArM-Empfangsbestätigung hoch.":"Upload the postal receipt OR the BfArM confirmation document."}</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
<div onClick={()=>setPrUpload({type:"post",name:"Deutsche_Post_Einschreiben_RR1234_5678_9DE.pdf",ts:new Date().toISOString().slice(0,19).replace("T"," "),by:"Celso Hamelink",tracking:"RR 1234 5678 9DE",sentDatum:"20.11.2025"})} style={{border:"2px solid #d97706",borderRadius:10,padding:14,cursor:"pointer",background:"#fff"}}>
<div style={{textAlign:"center",marginBottom:6}}><span style={{fontSize:30}}>📮</span></div>
<div style={{fontSize:16,fontWeight:700,color:"#92400e",textAlign:"center"}}>{lang==="de"?"Versandbeleg":"Upload Postal Receipt"}</div>
<div style={{fontSize:13,color:"#6b7280",textAlign:"center",marginTop:3}}>{lang==="de"?"Deutsche Post Einschreiben mit Tracking-Nr.":"Deutsche Post registered mail with tracking no."}</div>
<div style={{marginTop:8,padding:"6px",background:"#fffbeb",borderRadius:6,textAlign:"center"}}>
<div style={{fontSize:14,fontWeight:700,color:"#d97706"}}>📤 {lang==="de"?"Hochladen":"Upload"}</div>
</div>
</div>
<div onClick={()=>setPrUpload({type:"bfarm",name:"BfArM_Empfangsbestaetigung_E-12267-2025.pdf",ts:new Date().toISOString().slice(0,19).replace("T"," "),by:"Celso Hamelink",tracking:"RR 1234 5678 9DE",sentDatum:"20.11.2025",confirmed:"24.11.2025"})} style={{border:"2px solid #2563eb",borderRadius:10,padding:14,cursor:"pointer",background:"#fff"}}>
<div style={{textAlign:"center",marginBottom:6}}><span style={{fontSize:30}}>🏛️</span></div>
<div style={{fontSize:16,fontWeight:700,color:"#1e40af",textAlign:"center"}}>{lang==="de"?"BfArM-Bestätigung":"Upload BfArM Confirmation"}</div>
<div style={{fontSize:13,color:"#6b7280",textAlign:"center",marginTop:3}}>{lang==="de"?"Empfangsbestätigung vom BfArM":"BfArM confirmation that permit was returned"}</div>
<div style={{marginTop:8,padding:"6px",background:"#eff6ff",borderRadius:6,textAlign:"center"}}>
<div style={{fontSize:14,fontWeight:700,color:"#2563eb"}}>📤 {lang==="de"?"Hochladen":"Upload"}</div>
</div>
</div>
</div>
</div>}

{prUpload&&<div>
<div style={{background:prUpload.type==="bfarm"?"linear-gradient(135deg,#f0fdf4,#dcfce7)":"linear-gradient(135deg,#fefce8,#fef3c7)",borderRadius:10,padding:14,border:"2px solid "+(prUpload.type==="bfarm"?"#16a34a":"#d97706"),marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
<div style={{width:44,height:44,borderRadius:"50%",background:prUpload.type==="bfarm"?"#dcfce7":"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{prUpload.type==="bfarm"?"✅":"📮"}</div>
<div>
<div style={{fontSize:15,fontWeight:800,color:prUpload.type==="bfarm"?"#065f46":"#92400e"}}>{prUpload.type==="bfarm"?(lang==="de"?"RÜCKSENDUNG BESTÄTIGT":"RETURN CONFIRMED — BfArM received permit"):(lang==="de"?"VERSANDBELEG HOCHGELADEN":"POSTAL RECEIPT UPLOADED")}</div>
<div style={{fontSize:14,color:"#6b7280"}}>{prUpload.ts}</div>
</div>
</div>
<div style={{background:"#fff",borderRadius:8,padding:10,border:"1px solid #e5e7eb",marginBottom:8}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<div style={{fontSize:16}}>📎</div>
<div style={{flex:1}}>
<div style={{fontSize:15,fontWeight:700}}>{prUpload.name}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{prUpload.by} • {prUpload.ts}</div>
</div>
<Bd c={prUpload.type==="bfarm"?"#059669":"#d97706"} b={prUpload.type==="bfarm"?"#dcfce7":"#fef3c7"}>{prUpload.type==="bfarm"?"✅ Complete":"📮 Sent"}</Bd>
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:prUpload.type==="bfarm"?"1fr 1fr 1fr 1fr":"1fr 1fr 1fr",gap:5,fontSize:14}}>
{[["Tracking",prUpload.tracking,"#7c3aed"],[lang==="de"?"Gesendet":"Sent",prUpload.sentDate,"#2563eb"],prUpload.type==="bfarm"?[lang==="de"?"Zugestellt":"Delivered","22.11.2025","#059669"]:null,prUpload.type==="bfarm"?["BfArM",prUpload.confirmed,"#059669"]:null].filter(Boolean).map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#f9fafb",borderRadius:4,padding:5,border:"1px solid #e5e7eb"}}><div style={{fontWeight:700,color:c}}>{v}</div><div style={{fontSize:12,color:"#6b7280"}}>{l}</div></div>)}
</div>
</div>
<div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
<button style={{padding:"6px 12px",borderRadius:6,fontSize:14,fontWeight:600,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>📄 {lang==="de"?"Anzeigen":"View"}</button>
<button style={{padding:"6px 12px",borderRadius:6,fontSize:14,fontWeight:600,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>📧 Email</button>
{prUpload.type==="post"&&<button onClick={()=>setPrUpload({...prUpload,type:"bfarm",name:"BfArM_Empfangsbestaetigung_E-12267-2025.pdf",confirmed:"24.11.2025"})} style={{padding:"6px 12px",borderRadius:6,fontSize:14,fontWeight:600,border:"none",background:"#16a34a",color:"#fff",cursor:"pointer"}}>🏛️ {lang==="de"?"BfArM-Bestätigung hinzufügen":"Add BfArM Confirmation"}</button>}
<button onClick={()=>setPrUpload(null)} style={{padding:"4px 10px",borderRadius:4,fontSize:13,border:"1px solid #e5e7eb",background:"#fff",color:"#6b7280",cursor:"pointer"}}>↩ Reset</button>
</div>
</div>}
</div>
</div>}

{ipAction==="done"&&<div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",borderRadius:8,padding:14,border:"2px solid #16a34a"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
<div style={{fontSize:24}}>✅</div>
<div><div style={{fontSize:16,fontWeight:800,color:"#065f46"}}>{lang==="de"?"ABGESCHLOSSEN — Keine Erneuerung":"COMPLETE — No Renewal Required"}</div>
<div style={{fontSize:14,color:"#065f46"}}>{lang==="de"?"Genehmigung verwendet, zurückgesendet und archiviert":"Permit used, returned, and archived"}</div></div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginTop:8,fontSize:14}}>
{[["Import","✅ 14.11.2025","#059669"],["Returned","✅ 20.11.2025","#059669"],["BfArM","✅ 24.11.2025","#059669"]].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:4,padding:6,border:"1px solid #d1fae5"}}><div style={{fontWeight:700,color:c}}>{v}</div><div style={{fontSize:12,color:"#6b7280"}}>{l}</div></div>)}
</div>
<button onClick={()=>setIpAction(null)} style={{marginTop:8,padding:"4px 10px",borderRadius:4,fontSize:13,border:"1px solid #a7f3d0",background:"#fff",color:"#6b7280",cursor:"pointer"}}>↩ Undo</button>
</div>}

{ipAction==="renew"&&<div style={{background:"linear-gradient(135deg,#eff6ff,#dbeafe)",borderRadius:8,padding:14,border:"2px solid #3b82f6"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
<div style={{fontSize:24}}>🔄</div>
<div><div style={{fontSize:16,fontWeight:800,color:"#1e40af"}}>{lang==="de"?"NEUE GENEHMIGUNG BEANTRAGT":"NEW PERMIT APPLICATION FILED"}</div>
<div style={{fontSize:14,color:"#1e40af"}}>{lang==="de"?"Antrag beim BfArM eingereicht":"Filed with BfArM"}</div></div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginTop:8,fontSize:14}}>
{[["Filed",new Date().toLocaleDateString("de-DE"),"#2563eb"],["Lead Time","6–8 weeks","#d97706"],["Voraussichtlich","~Apr 2026","#059669"]].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:4,padding:6,border:"1px solid #bfdbfe"}}><div style={{fontWeight:700,color:c}}>{v}</div><div style={{fontSize:12,color:"#6b7280"}}>{l}</div></div>)}
</div>
<div style={{display:"flex",gap:6,marginTop:8}}>
<button style={{padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>📧 Contact BfArM</button>
<button style={{padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>📋 Track</button>
<button onClick={()=>setIpAction(null)} style={{padding:"4px 10px",borderRadius:4,fontSize:13,border:"1px solid #93c5fd",background:"#fff",color:"#6b7280",cursor:"pointer"}}>↩ Undo</button>
</div>
</div>}
</div>}
</div>}
</div>})}</div>};

// M2 Lab — Supplier COA vs QSI Comparison
const M2Lab=()=>{const cats=[...new Set(LAB.map(l=>l.cat))];
return <div>
<div style={{display:"flex",gap:5,marginBottom:10}}>{[["compare","🔍 "+t.comparison],["terpenes","🌿 "+t.terpeneProfile],["limits","🏭 Supplier Limits"]].map(([k,l])=><button key={k} onClick={()=>setLabTab(k)} style={{padding:"5px 10px",borderRadius:5,fontSize:14,fontWeight:600,border:labTab===k?"2px solid #2563eb":"1px solid #d1d5db",background:labTab===k?"#dbeafe":"#fff",color:labTab===k?"#1e40af":"#374151",cursor:"pointer"}}>{l}</button>)}</div>

{labTab==="compare"&&<div>
{cats.map(cat=>{const cl=CatLabel[cat]||["Other","#6b7280","#f3f4f6"];const params=LAB.filter(l=>l.cat===cat);
return <div key={cat} style={{marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><Bd c={cl[1]} b={cl[2]}>{cl[0]}</Bd></div>
<div style={{border:"1px solid #e5e7eb",borderRadius:6,overflow:"hidden"}}>
<div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:0,fontSize:14,fontWeight:600,background:"#f9fafb",padding:"5px 8px",borderBottom:"1px solid #e5e7eb"}}>
<div>{t.param}</div><div>{t.supplierCoa}</div><div>{t.qsiResults}</div><div>{t.spec}</div><div>{t.variance}</div></div>
{params.map((p,j)=><div key={j} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr",gap:0,fontSize:15,padding:"5px 8px",borderBottom:j<params.length-1?"1px solid #f3f4f6":"none",background:p.var!==null&&Math.abs(p.var)>20?"#fef3c7":"#fff"}}>
<div style={{fontWeight:600}}>{p[lang]}</div>
<div style={{color:"#6b7280"}}>{p.sup}</div>
<div style={{fontWeight:700,color:"#059669"}}>{p.qsi}</div>
<div style={{fontSize:14,color:"#6b7280"}}>{p.spec}</div>
<div style={{fontWeight:600,color:p.var===null?"#9ca3af":Math.abs(p.var)>20?"#d97706":"#059669"}}>{p.var!==null?(p.var>0?"+":"")+p.var+"%":"—"}</div>
</div>)}
</div></div>})}
<div style={{marginTop:8,padding:10,background:"#dbeafe",borderRadius:6,fontSize:15,borderLeft:"3px solid #2563eb"}}>
<strong>§14 AMG:</strong> {lang==="de"?"Lieferanten-COA dient nur als Referenz. Die QSI Bremen Analyse ist das offizielle, rechtsverbindliche Ergebnis. Alle Varianzen innerhalb akzeptabler Bereiche.":"Supplier COA is reference only. QSI Bremen analysis is the official, legally binding result. All variances within acceptable ranges."}</div>

{/* THC Discrepancy Protocol */}
<div style={{marginTop:12,border:"2px solid #d97706",borderRadius:8,overflow:"hidden"}}>
<div onClick={()=>setThcProto(p=>({...p,open:!p.open}))} style={{padding:"10px 12px",background:"#fffbeb",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:16}}>⚠️</span>
<div>
<div style={{fontSize:15,fontWeight:700,color:"#92400e"}}>{lang==="de"?"THC-Abweichungsprotokoll":"THC Discrepancy Protocol"}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{lang==="de"?"Bei THC-Wertänderung: Neue PZN + COA-Korrektur + Umetikettierung":"When THC value changes: New PZN + COA correction + Relabeling"}</div>
</div>
</div>
<span style={{fontSize:14,color:"#92400e",fontWeight:700}}>{thcProto.open?"▲":"▼"}</span>
</div>

{thcProto.open&&<div style={{padding:12,background:"#fff",borderTop:"1px solid #fcd34d"}}>
{/* Current values */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
<div style={{padding:8,background:"#f9fafb",borderRadius:6,textAlign:"center"}}>
<div style={{fontSize:12,color:"#6b7280",fontWeight:600}}>{lang==="de"?"Registrierter THC-Wert":"Registered THC Value"}</div>
<div style={{fontSize:22,fontWeight:800,color:"#374151"}}>18.9%</div>
<div style={{fontSize:12,color:"#6b7280"}}>PZN: 19797739 (10g) / 19797685 (1kg)</div>
</div>
<div style={{padding:8,background:"#f0fdf4",borderRadius:6,textAlign:"center",border:"2px solid #a7f3d0"}}>
<div style={{fontSize:12,color:"#6b7280",fontWeight:600}}>QSI Bremen {lang==="de"?"Ergebnis":"Result"}</div>
<div style={{fontSize:22,fontWeight:800,color:"#059669"}}>19.7%</div>
<div style={{fontSize:12,color:"#059669"}}>✅ {lang==="de"?"Innerhalb ±10% Toleranz":"Within ±10% tolerance"}</div>
</div>
<div style={{padding:8,background:"#fef3c7",borderRadius:6,textAlign:"center"}}>
<div style={{fontSize:12,color:"#6b7280",fontWeight:600}}>{lang==="de"?"Abweichung":"Variance"}</div>
<div style={{fontSize:22,fontWeight:800,color:"#d97706"}}>Δ -2.0%</div>
<div style={{fontSize:12,color:"#059669"}}>✅ {lang==="de"?"Kein PZN-Wechsel nötig":"No PZN change needed"}</div>
</div>
</div>

{/* Protocol workflow */}
<div style={{background:"#fffbeb",borderRadius:6,padding:10,marginBottom:10,border:"1px solid #fcd34d"}}>
<div style={{fontSize:14,fontWeight:700,color:"#92400e",marginBottom:6}}>{lang==="de"?"Protokoll bei THC-Abweichung außerhalb Toleranz (>±10%)":"Protocol when THC variance exceeds tolerance (>±10%)"}</div>
<div style={{display:"grid",gridTemplateColumns:"auto 1fr",gap:"4px 10px",fontSize:14}}>
<span style={{fontWeight:700,color:"#b45309"}}>1.</span><span>{lang==="de"?"QSI Bremen THC-Ergebnis weicht >±10% vom registrierten Wert ab":"QSI Bremen THC result deviates >±10% from registered value"}</span>
<span style={{fontWeight:700,color:"#b45309"}}>2.</span><span>{lang==="de"?"THC-Abweichungsprotokoll erstellen (Ref.: DEV-THC-[Batch])":"Create THC Discrepancy Protocol (Ref.: DEV-THC-[Batch])"}</span>
<span style={{fontWeight:700,color:"#b45309"}}>3.</span><span><strong>{lang==="de"?"Pia (QSI Bremen)":"Pia (QSI Bremen)"}</strong> — {lang==="de"?"Geändertes COA mit neuem THC-Wert anfordern":"Request amended COA with new THC value"}</span>
<span style={{fontWeight:700,color:"#b45309"}}>4.</span><span><strong>IFA GmbH</strong> — {lang==="de"?"Neue PZN-Nummer für korrigierten THC-Wert beantragen":"Request new PZN number for corrected THC value"}</span>
<span style={{fontWeight:700,color:"#b45309"}}>5.</span><span><strong>M4 {lang==="de"?"Umetikettierung":"Relabeling"}</strong> — {lang==="de"?"Neue Etiketten mit korrektem THC% und neuer PZN drucken":"Print new labels with correct THC% and new PZN"}</span>
<span style={{fontWeight:700,color:"#b45309"}}>6.</span><span>{lang==="de"?"Alle Dokumente in Google Drive ablegen — Abweichungsbericht schließen":"File all documents in Google Drive — close deviation report"}</span>
</div>
</div>

{/* Action: Initiate THC Protocol */}
<div style={{fontSize:14,fontWeight:700,color:"#374151",marginBottom:6}}>{lang==="de"?"THC-Abweichungsprotokoll einleiten":"Initiate THC Discrepancy Protocol"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
<div>
<div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>{lang==="de"?"Neuer THC-Wert (QSI)":"New THC Value (QSI)"}</div>
<input value={thcProto.newThc} onChange={e=>setThcProto(p=>({...p,newThc:e.target.value}))} placeholder="z.B. 16.5%" style={{width:"100%",padding:"6px 8px",borderRadius:4,border:"1px solid #d1d5db",fontSize:15}}/>
</div>
<div>
<div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>{lang==="de"?"Abweichungsgrund":"Abweichung Reason"}</div>
<input value={thcProto.reason} onChange={e=>setThcProto(p=>({...p,reason:e.target.value}))} placeholder={lang==="de"?"z.B. THC unter Registrierungswert":"e.g. THC below registered value"} style={{width:"100%",padding:"6px 8px",borderRadius:4,border:"1px solid #d1d5db",fontSize:15}}/>
</div>
</div>

{/* Step buttons */}
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
<button onClick={()=>{setThcProto(p=>({...p,piaNotified:true}));window.open(gmailLink("THC Discrepancy Protocol — Batch "+(selBatch||"")+" — Amended COA Request","Sehr geehrte/r Pia,\n\nCharge: "+(selBatch||"")+"\nProduct: NOC SE 19 — Essence (BBS I)\n\nQSI Lab Result: THC "+(thcProto.newThc||"[NEW VALUE]")+"%\nRegistered Value: 18.9%\nReason: "+(thcProto.reason||"THC variance exceeds ±10% tolerance")+"\n\nPlease issue an amended COA with the corrected THC value for product final release.\n\nThe new THC value will be registered with IFA for a new PZN number.\n\nMit freundlichen Gruessen,\nNOC Pharma GmbH"),"_blank")}} style={{flex:1,padding:"8px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:thcProto.piaNotified?"#059669":"#2563eb",color:"#fff",cursor:"pointer"}}>
{thcProto.piaNotified?"✅ ":"📧 "}{lang==="de"?"Pia (QSI) — Geändertes COA anfordern":"Pia (QSI) — Request Amended COA"}
</button>
<button onClick={()=>{setThcProto(p=>({...p,pznRequested:true}));setLcs(0);setPznForm(p=>({...p,show:true,submitted:false,thc:thcProto.newThc}))}} style={{flex:1,padding:"8px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:thcProto.pznRequested?"#059669":"#b45309",color:"#fff",cursor:"pointer"}}>
{thcProto.pznRequested?"✅ ":"🏷️ "}{lang==="de"?"Neue PZN bei IFA beantragen":"Request New PZN from IFA"}
</button>
</div>
<div style={{display:"flex",gap:6,marginTop:6}}>
<button onClick={()=>window.open(gdLink("thc_protocol"),"_blank")} style={{flex:1,padding:"6px",borderRadius:5,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📂 {lang==="de"?"Protokoll in Drive speichern":"Save Protocol to Drive"}</button>
<button onClick={()=>{setLcs(8)}} style={{flex:1,padding:"6px",borderRadius:5,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>🏷️ {lang==="de"?"Zu M4 Umetikettierung":"Go to M4 Relabeling"}</button>
</div>
</div>}
</div>
</div>}

{labTab==="terpenes"&&<Cd t={"🌿 "+t.terpeneProfile+" — GC-FID/MS"}><div style={{marginBottom:10}}>
{TERPENES.map((tp,j)=>{const max=1.0;return <div key={j} style={{marginBottom:6}}>
<div style={{display:"flex",justifyContent:"space-between",fontSize:15,marginBottom:2}}><span style={{fontWeight:600}}>{tp.n}</span><span style={{color:"#6b7280"}}>{tp.qsi}%</span></div>
<div style={{height:8,background:"#f3f4f6",borderRadius:4,overflow:"hidden",position:"relative"}}>
<div style={{height:"100%",width:(tp.sup/max*100)+"%",background:"#d1d5db",borderRadius:4,position:"absolute"}}/>
<div style={{height:"100%",width:(tp.qsi/max*100)+"%",background:"#059669",borderRadius:4,position:"absolute"}}/>
</div></div>})}
</div><div style={{display:"flex",gap:12,fontSize:14}}><span>█ <span style={{color:"#059669"}}>QSI Bremen</span></span><span>█ <span style={{color:"#d1d5db"}}>Supplier (declared)</span></span></div></Cd>}

{labTab==="limits"&&<Cd t={"🏭 Supplier-Specific Microbiology Limits (per QTA)"}><div style={{overflowX:"auto"}}>
<table style={{width:"100%",fontSize:15,borderCollapse:"collapse"}}><thead><tr>{["Parameter","Ph.Eur. Limit","Cannava","HYTN","MCCN","QSI Result"].map((h,j)=><th key={j} style={{border:"1px solid #d1d5db",padding:"4px 6px",background:"#f9fafb",fontSize:14,fontWeight:600}}>{h}</th>)}</tr></thead><tbody>
{[["TAMC","500,000","500,000","500,000","500,000","10,000 ✅"],["TYMC","10,000","10,000","500,000","10,000","1,200 ✅"],["Gram-neg","50,000","50,000","50,000","50,000","<100 ✅"]].map(([p,...vals],j)=><tr key={j}>{[p,...vals].map((v,k)=><td key={k} style={{border:"1px solid #d1d5db",padding:"4px 6px",fontWeight:k===0||k===5?600:400,color:k===5?"#059669":"inherit",background:k===3?"#fef3c7":"inherit"}}>{v}</td>)}</tr>)}
</tbody></table></div>
<div style={{marginTop:8,fontSize:14,color:"#6b7280"}}>⚠️ HYTN has higher TYMC limit (500k) due to different regulatory framework (Health Canada). Cannava/MCCN follow stricter Ph.Eur. limits.</div></Cd>}
</div>};

// M3 QP Release — AI Agent generates doc for DocuSign
const[m3Step,setM3Step]=useState(0);
const[m3Anim,setM3Anim]=useState("");
const m3Generate=()=>{setM3Step(1);setM3Anim("Analyzing 19 lab parameters...");
setTimeout(()=>setM3Anim("Verifying Safety Gate status..."),800);
setTimeout(()=>setM3Anim("Cross-referencing Ph.Eur. monograph..."),1600);
setTimeout(()=>setM3Anim("Compiling regulatory references (§15 AMG, Annex 16)..."),2400);
setTimeout(()=>setM3Anim("Generating QP Release Certificate CGZ-2025-0047..."),3200);
setTimeout(()=>{setM3Step(2);setM3Anim("")},4000)};
const m3Send=()=>{setM3Step(3);setTimeout(()=>setM3Step(3),500)};
const m3Sign=()=>setM3Step(4);

const M3QP=()=><div>
<Cd t={"✅ M3 — "+(lang==="de"?"QP-Chargenfreigabe":"QP Batch Release")} badge={m3Step===4?<Bd c="#059669" b="#dcfce7">✅ {lang==="de"?"FREIGEGEBEN":"RELEASED"}</Bd>:m3Step>=2?<Bd c="#d97706" b="#fef3c7">✍️ {lang==="de"?"Unterschrift ausstehend":"Awaiting Signature"}</Bd>:<Bd c="#6b7280" b="#f3f4f6">{lang==="de"?"Entwurf":"Draft"}</Bd>}>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,fontSize:16,marginBottom:14}}>
{[["QP",BT.qp],[t.certNo,BT.cert],[lang==="de"?"Freigabedatum":"Release Date",BT.coa],[t.gate,"GREEN — 19/19 PASS"],[lang==="de"?"Labor":"Labor",BT.lab+" ("+BT.aNo+")"],[t.batch,BT.id]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

{m3Step===0&&<div style={{border:"2px dashed #d1d5db",borderRadius:10,padding:20,textAlign:"center",marginBottom:14,background:"#fafafa"}}>
<div style={{fontSize:36,marginBottom:8}}>🤖</div>
<div style={{fontSize:16,fontWeight:700,marginBottom:4}}>{lang==="de"?"KI-Agent: Freigabezertifikat generieren":"AI Agent: Generate Release Certificate"}</div>
<div style={{fontSize:15,color:"#6b7280",marginBottom:14,maxWidth:440,margin:"0 auto 14px"}}>{lang==="de"
?"Der KI-Compliance-Agent analysiert alle 19 Laborergebnisse, prüft die Safety-Gate-Bewertung und erstellt das QP-Freigabezertifikat (CGZ-2025-0047) zur Unterschrift durch Dr. Olaf Schagon via DocuSign."
:"The AI Compliance Agent will analyze all 19 lab results, verify Safety Gate assessment, and generate the QP Release Certificate (CGZ-2025-0047) for signature by Dr. Olaf Schagon via DocuSign."}</div>
<button onClick={m3Generate} style={{padding:"12px 28px",borderRadius:8,fontSize:15,fontWeight:700,border:"none",background:"linear-gradient(135deg,#16a34a,#059669)",color:"#fff",cursor:"pointer",boxShadow:"0 4px 12px rgba(5,150,105,.3)"}}>🤖 {lang==="de"?"Zertifikat generieren":"Generate Certificate"}</button>
</div>}

{m3Step===1&&<div style={{border:"2px solid #16a34a",borderRadius:10,padding:20,textAlign:"center",marginBottom:14,background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)"}}>
<div style={{fontSize:36,marginBottom:8}}>🤖</div>
<div style={{fontSize:15,fontWeight:700,color:"#065f46",marginBottom:8}}>{lang==="de"?"KI-Agent generiert Dokument...":"AI Agent generating document..."}</div>
<div style={{width:"80%",margin:"0 auto",height:6,background:"#d1fae5",borderRadius:3,overflow:"hidden",marginBottom:8}}>
<div style={{width:"60%",height:"100%",background:"linear-gradient(90deg,#16a34a,#059669)",borderRadius:3}}/>
</div>
<div style={{fontSize:15,color:"#059669",fontStyle:"italic"}}>{m3Anim}</div>
</div>}

{m3Step>=2&&<div style={{background:"#fff",border:"2px solid #16a34a",borderRadius:10,padding:0,marginBottom:14,overflow:"hidden"}}>
<div style={{background:"linear-gradient(135deg,#16a34a,#059669)",padding:"14px 20px",color:"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:15,fontWeight:800}}>NOC Pharma GmbH</div>
<div style={{fontSize:14,opacity:.85}}>QP Batch Release Certificate / Chargenfreigabezertifikat</div></div>
<div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:600}}>CGZ-2025-0047</div>
<div style={{fontSize:13,opacity:.85}}>EU-GMP Annex 16 • §15 AMG</div></div>
</div>
</div>

<div style={{padding:"16px 20px"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14,fontSize:15}}>
{[[t.batch,"BI-02-NOCB1.1-INF-F"],[lang==="de"?"Produkt":"Product","NOC SE 19 — Cannabis flos (T22/1)"],[lang==="de"?"Lieferant":"Supplier","Cannava S.E. — San Juan, Argentina"],[lang==="de"?"Menge":"Quantity","198.5 kg (239 units)"],[lang==="de"?"Labor":"Laboratory","QSI GmbH ("+BT.aNo+")"],[lang==="de"?"Prüfzeitraum":"Testing Period","18.11.2025 – 10.12.2025"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{background:"#f0fdf4",border:"1px solid #a7f3d0",borderRadius:8,padding:12,marginBottom:14}}>
<div style={{fontSize:15,fontWeight:700,color:"#065f46",marginBottom:6}}>{lang==="de"?"Prüfergebnis-Zusammenfassung":"Test Results Summary"}</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:4,fontSize:14}}>
{[[lang==="de"?"Identität":"Identity","3/3 ✅"],[lang==="de"?"Gehalt":"Potency","2/2 ✅"],[lang==="de"?"Mikrobio":"Microbio","5/5 ✅"],[lang==="de"?"Kontam.":"Contam.","7/7 ✅"],[lang==="de"?"Physik.":"Physical","2/2 ✅"]].map(([l,v],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:4,padding:6,border:"1px solid #d1fae5"}}><div style={{fontWeight:700,color:"#059669"}}>{v}</div><div style={{fontSize:12,color:"#6b7280"}}>{l}</div></div>)}
</div>
<div style={{textAlign:"center",marginTop:8,fontSize:16,fontWeight:800,color:"#065f46"}}>{t.gate}: GREEN — 19/19 {t.allPass}</div>
</div>

<div style={{background:"#ecfdf5",borderRadius:8,padding:12,marginBottom:14,borderLeft:"4px solid #16a34a"}}>
<div style={{fontWeight:700,marginBottom:6,color:"#065f46",fontSize:15}}>{lang==="de"?"Freigabeerklärung der Sachkundigen Person":"QP Release Declaration"}</div>
<div style={{fontSize:14,lineHeight:1.6,fontStyle:"italic"}}>{lang==="de"
?"Hiermit bestätige ich, Dr. Olaf Schagon, als Sachkundige Person gemäß §15 AMG, dass die Charge BI-02-NOCB1.1-INF-F (NOC SE 19, Cannabis flos) vollständig gemäß den Anforderungen der Ph. Eur. Monographie \u201eCannabis flos\u201c, der EU-GMP-Richtlinien (Anhang 16) sowie des BtMG §3 geprüft wurde. Alle 19 Prüfparameter liegen innerhalb der Spezifikation. Die Sicherheitsbewertung (Safety Gate) ergibt GRÜN. Die Identität, Reinheit, Gehalt und mikrobiologische Qualität sind bestätigt. Die Charge wird hiermit für den Vertrieb im Rahmen der Großhandelserlaubnis gemäß §52a AMG freigegeben."
:"I, Dr. Olaf Schagon, as Qualified Person per §15 AMG, hereby confirm that batch BI-02-NOCB1.1-INF-F (NOC SE 19, Cannabis flos) has been fully tested per Ph. Eur. monograph 'Cannabis flos', EU GMP Annex 16, and BtMG §3. All 19 test parameters within spec. Safety Gate: GREEN. Identity, purity, assay, microbiology confirmed. Batch released for distribution per §52a AMG."}</div>
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14,fontSize:14,color:"#6b7280"}}>
<div><strong>{lang==="de"?"Rechtsgrundlage":"Legal Basis"}:</strong> §15 AMG, EU GMP Annex 16, §3 BtMG, Ph.Eur.</div>
<div><strong>{lang==="de"?"Vertriebslizenz":"Distribution"}:</strong> §52a AMG wholesale authorization</div>
</div>

<div style={{borderTop:"2px solid #e5e7eb",paddingTop:14}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:10}}>✍️ {lang==="de"?"Unterschrift der Sachkundigen Person (DocuSign)":"QP Signature (DocuSign)"}</div>

<div style={{display:"flex",gap:12,padding:14,borderRadius:8,border:m3Step===4?"1px solid #a7f3d0":"2px solid #16a34a",background:m3Step===4?"#f0fdf4":"#fff"}}>
<div style={{width:52,height:52,borderRadius:"50%",background:m3Step===4?"#dcfce7":"#f0fdf4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>{m3Step===4?"✅":"🔬"}</div>
<div style={{flex:1}}>
<div style={{fontSize:16,fontWeight:700}}>Dr. Olaf Schagon <Bd c="#16a34a" b="#dcfce7">QP §15 AMG</Bd></div>
<div style={{fontSize:15,color:"#6b7280"}}>{lang==="de"?"Sachkundige Person — Chargenfreigabe gemäß EU-GMP Anhang 16":"Qualified Person — Batch release per EU-GMP Annex 16"}</div>
<div style={{fontSize:14,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{lang==="de"?"Bestätigt: 19/19 Parameter konform, Safety Gate GRÜN, Charge freigegeben für Vertrieb":"Confirms: 19/19 parameters compliant, Safety Gate GREEN, batch released for distribution"}</div>

{m3Step===4&&<div style={{marginTop:6,fontSize:14,padding:"4px 8px",background:"#dcfce7",borderRadius:4,display:"inline-block"}}>
✅ {lang==="de"?"Unterschrieben":"Signed"}: 12.12.2025 14:23:47 • SHA256:4F8A2C1E • eIDAS Art. 25 • 21 CFR Part 11
</div>}

{m3Step===3&&<div style={{marginTop:6,display:"flex",alignItems:"center",gap:6}}>
<div style={{fontSize:14,color:"#d97706",fontWeight:600}}>📧 {lang==="de"?"DocuSign-Einladung gesendet an dr.schagon@noc-pharma.de — Warte auf Unterschrift...":"DocuSign envelope sent to dr.schagon@noc-pharma.de — Awaiting signature..."}</div>
<button onClick={m3Sign} style={{padding:"5px 12px",borderRadius:5,fontSize:14,fontWeight:700,border:"none",background:"#16a34a",color:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>✅ {lang==="de"?"Simuliere Unterschrift":"Simulate Signature"}</button>
</div>}
</div>

{m3Step===2&&<div style={{display:"flex",flexDirection:"column",gap:6,alignSelf:"center"}}>
<button onClick={m3Send} style={{padding:"10px 18px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#16a34a",color:"#fff",cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 3px 8px rgba(22,163,74,.3)"}}>📧 {lang==="de"?"An DocuSign senden":"Send to DocuSign"}</button>
<div style={{fontSize:12,color:"#6b7280",textAlign:"center"}}>dr.schagon@noc-pharma.de</div>
</div>}
</div>
</div>
</div>
</div>}

{m3Step===4&&<div style={{padding:14,background:"linear-gradient(135deg,#dcfce7,#d1fae5)",borderRadius:8,border:"1px solid #a7f3d0",textAlign:"center"}}>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>✅ {lang==="de"?"QP-CHARGENFREIGABE ABGESCHLOSSEN":"QP BATCH RELEASE COMPLETE"}</div>
<div style={{fontSize:15,color:"#065f46",marginTop:4}}>{lang==="de"?"Charge BI-02 freigegeben von Dr. Olaf Schagon. Zertifikat CGZ-2025-0047 archiviert.":"Batch BI-02 released by Dr. Olaf Schagon. Certificate CGZ-2025-0047 archived."}</div>
<div style={{fontSize:13,color:"#065f46",marginTop:4}}>DocuSign Envelope: ENV-2025-QP-0047 • eIDAS Art. 25 • ALCOA+ • {lang==="de"?"Audit-Trail vollständig":"Audit trail complete"}</div>
</div>}

<div style={{marginTop:10,background:"#f0f9ff",borderRadius:6,padding:10,fontSize:14,borderLeft:"3px solid #16a34a",lineHeight:1.5}}>
<strong>🤖 {lang==="de"?"KI-Agent Workflow":"AI Agent Workflow"}:</strong> {lang==="de"
?"Der KI-Compliance-Agent (ANMAT × BfArM) analysiert automatisch alle 19 Laborergebnisse des QSI-COA, verifiziert die Safety-Gate-Bewertung, prüft Übereinstimmung mit Ph.Eur. und BtMG §3, generiert das QP-Freigabezertifikat und versendet es per DocuSign an die Sachkundige Person zur elektronischen Unterschrift (eIDAS Art. 25)."
:"The AI Compliance Agent (ANMAT × BfArM) automatically analyzes all 19 lab results from the QSI COA, verifies Safety Gate assessment, checks compliance with Ph.Eur. and BtMG §3, generates the QP Release Certificate, and sends it via DocuSign to the Qualified Person for electronic signature (eIDAS Art. 25)."}
</div>
</Cd>
</div>;

// Stage Detail Router
// M3.1 Quarantine Release Form with DocuSign
const[m31Sigs,setM31Sigs]=useState({qp:null,vp:null,wh:null});
const m31Sign=(k)=>setM31Sigs(p=>({...p,[k]:{ts:new Date().toISOString().slice(0,19).replace("T"," "),hash:"SHA256:"+Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("").toUpperCase()}}));
const m31AllSigned=m31Sigs.qp&&m31Sigs.vp&&m31Sigs.wh;

const M31Release=()=><div>
<Cd t={"🔓 M3.1 — "+(lang==="de"?"Quarantäne-Freigabeformular":"Quarantine Release Form")} badge={m31AllSigned?<Bd c="#059669" b="#dcfce7">✅ {lang==="de"?"Abgeschlossen":"Complete"}</Bd>:<Bd c="#d97706" b="#fef3c7">✍️ {lang==="de"?"Unterschriften ausstehend":"Signatures pending"}</Bd>}>

<div style={{background:"#fff",border:"2px solid #0369a1",borderRadius:10,padding:0,marginBottom:14,overflow:"hidden"}}>
<div style={{background:"linear-gradient(135deg,#0369a1,#0284c7)",padding:"16px 20px",color:"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:16,fontWeight:800}}>NOC Pharma GmbH</div>
<div style={{fontSize:14,opacity:.8}}>{lang==="de"?"Quarantäne-Freigabezertifikat":"Quarantine Release Certificate"}</div></div>
<div style={{textAlign:"right"}}><div style={{fontSize:15,fontWeight:600}}>QRC-2025-003</div>
<div style={{fontSize:13,opacity:.8}}>SOP-301-01 v2.0</div></div>
</div>
</div>

<div style={{padding:"16px 20px"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16,fontSize:15}}>
<div style={{borderBottom:"1px solid #e5e7eb",paddingBottom:8}}>
<div style={{fontSize:13,color:"#6b7280",fontWeight:600,textTransform:"uppercase"}}>{lang==="de"?"Charge / Batch":"Charge"}</div>
<div style={{fontWeight:700,fontSize:15}}>{BT.id}</div>
<div style={{color:"#6b7280"}}>{BT.p} — Cannabis flos</div>
</div>
<div style={{borderBottom:"1px solid #e5e7eb",paddingBottom:8}}>
<div style={{fontSize:13,color:"#6b7280",fontWeight:600,textTransform:"uppercase"}}>{lang==="de"?"Freigabe-Zertifikat / Release Cert":"Release Certificate"}</div>
<div style={{fontWeight:700,fontSize:15}}>{BT.cert}</div>
<div style={{color:"#6b7280"}}>{lang==="de"?"Ausgestellt":"Ausgestellt"}: {BT.coa}</div>
</div>
</div>

<div style={{background:"#f0f9ff",borderRadius:8,padding:14,marginBottom:16,border:"1px solid #bae6fd"}}>
<div style={{fontSize:15,fontWeight:700,color:"#0369a1",marginBottom:8}}>{lang==="de"?"Freigabeerklärung":"Release Declaration"}</div>
<div style={{fontSize:15,lineHeight:1.6}}>{lang==="de"
?"Hiermit wird bestätigt, dass die oben genannte Charge die Quarantäne-Prüfung bestanden hat. Die Sachkundige Person (QP) hat die Charge gemäß §15 AMG und EU-GMP Annex 16 freigegeben. Alle 19 Prüfparameter liegen innerhalb der Spezifikation (Safety Gate: GRÜN). Die Charge wird aus der Quarantänezone freigegeben und für den Transport zum Kommerzlager Kahla Im Camisch 14 genehmigt."
:"This certifies that the above-referenced batch has passed quarantine review. The Qualified Person (QP) has released the batch per §15 AMG and EU-GMP Annex 16. All 19 test parameters are within specification (Safety Gate: GREEN). The batch is hereby released from quarantine and approved for transport to commercial warehouse Kahla Im Camisch 14."}</div>
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16,fontSize:15}}>
{[[lang==="de"?"Herkunftsort":"Origin",lang==="de"?"Anklam — Quarantänezone":"Anklam — Quarantine Zone"],[lang==="de"?"Zielort":"Destination","Kahla Im Camisch 14 — Commercial"],[lang==="de"?"Transportauftrag":"Transport Request","TR-NOC-2025-0089"],[lang==="de"?"GDP-Spediteur":"GDP Carrier",lang==="de"?"NOC Pharma (Eigenflotte)":"NOC Pharma (Own Fleet)"],[lang==="de"?"Temp.-Anforderung":"Temp. Requirement","15–25°C (EU GDP 2013/C 343/01)"],[lang==="de"?"BtM-Bestand":"BtM Inventory",lang==="de"?"§13 BtMG — Zonenumbuchung":"§13 BtMG — Zone Transfer"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{borderTop:"2px solid #e5e7eb",paddingTop:16}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:12}}>{lang==="de"?"Erforderliche Unterschriften (DocuSign)":"Required Signatures (DocuSign)"}</div>

{[
{k:"qp",name:"Dr. Olaf Schagon",role:lang==="de"?"Sachkundige Person (QP) gemäß §15 AMG":"Qualified Person (QP) per §15 AMG",desc:lang==="de"?"Bestätigt: Chargenfreigabe, Safety Gate GRÜN, 19/19 Parameter konform":"Confirms: Batch release, Safety Gate GREEN, 19/19 parameters compliant",ic:"🔬",c:"#16a34a"},
{k:"vp",name:"Torsten Cuny",role:lang==="de"?"Verantwortliche Person gemäß §52a AMG":"Responsible Person per §52a AMG",desc:lang==="de"?"Genehmigt: Quarantäne-Freigabe, Transportauftrag TR-NOC-2025-0089, Zonenumbuchung":"Approves: Quarantine release, transport request TR-NOC-2025-0089, zone transfer",ic:"✍️",c:"#0369a1",primary:true},
{k:"wh",name:"Warehouse Manager",role:lang==="de"?"Lagerleiter — Warenausgangskontrolle":"Warehouse Manager — goods dispatch control",desc:lang==="de"?"Bestätigt: Ware versandbereit, Datenlogger zugewiesen, GDP-Fahrzeug geprüft":"Confirms: Goods ready for dispatch, datalogger assigned, GDP vehicle checked",ic:"📦",c:"#d97706"}
].map(sig=>{const signed=m31Sigs[sig.k];
return <div key={sig.k} style={{display:"flex",gap:12,padding:14,marginBottom:8,borderRadius:8,border:sig.primary?"2px solid #0369a1":"1px solid "+(signed?"#a7f3d0":"#fde68a"),background:signed?"#f0fdf4":sig.primary?"#f0f9ff":"#fffbeb"}}>
<div style={{width:48,height:48,borderRadius:"50%",background:signed?"#dcfce7":sig.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{signed?"✅":sig.ic}</div>
<div style={{flex:1}}>
<div style={{fontSize:15,fontWeight:700}}>{sig.name} {sig.primary&&<Bd c="#0369a1" b="#dbeafe">{lang==="de"?"Hauptunterzeichner":"Primary Signatory"}</Bd>}</div>
<div style={{fontSize:15,color:"#6b7280",fontWeight:500}}>{sig.role}</div>
<div style={{fontSize:14,color:"#6b7280",marginTop:3,fontStyle:"italic"}}>{sig.desc}</div>
{signed&&<div style={{marginTop:6,fontSize:14,padding:"4px 8px",background:"#dcfce7",borderRadius:4,display:"inline-block"}}>
✅ {lang==="de"?"Unterschrieben":"Signed"}: {signed.ts} • {signed.hash} • eIDAS Art. 25
</div>}
</div>
{!signed&&<button onClick={()=>m31Sign(sig.k)} style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:sig.primary?"#0369a1":sig.c,color:"#fff",cursor:"pointer",alignSelf:"center",whiteSpace:"nowrap",boxShadow:"0 2px 4px rgba(0,0,0,.15)"}}>
✍️ {sig.primary?(lang==="de"?"Jetzt freigeben":"Approve & Sign"):(lang==="de"?"Unterschreiben":"Sign")}
</button>}
</div>})}
</div>

{m31AllSigned&&<div style={{marginTop:12,padding:14,background:"linear-gradient(135deg,#dcfce7,#d1fae5)",borderRadius:8,border:"1px solid #a7f3d0",textAlign:"center"}}>
<div style={{fontSize:16,fontWeight:800,color:"#065f46"}}>✅ {lang==="de"?"QUARANTÄNE-FREIGABE VOLLSTÄNDIG":"QUARANTINE RELEASE COMPLETE"}</div>
<div style={{fontSize:15,color:"#065f46",marginTop:4}}>{lang==="de"?"Alle 3 Unterschriften erhalten. Charge freigegeben für Transport nach Kahla.":"All 3 signatures collected. Batch released for transport to Kahla."}</div>
<div style={{fontSize:13,color:"#065f46",marginTop:4}}>eIDAS Art. 25 • 21 CFR Part 11 • ALCOA+ • {lang==="de"?"Audit-Trail vollständig":"Audit trail complete"}</div>
</div>}

{!m31AllSigned&&<div style={{marginTop:10,padding:10,background:"#fffbeb",borderRadius:6,border:"1px solid #fde68a",fontSize:14,color:"#92400e"}}>
⚠️ {Object.values(m31Sigs).filter(Boolean).length}/3 {lang==="de"?"unterschrieben. Charge bleibt in Quarantäne bis alle Unterschriften vorliegen.":"signed. Batch remains in quarantine until all signatures are collected."}
</div>}
</div>
</div>

<div style={{background:"#f0f9ff",borderRadius:6,padding:10,fontSize:14,borderLeft:"3px solid #0369a1",lineHeight:1.5}}>
<strong>{lang==="de"?"Regulatorische Grundlage":lang==="de"?"Rechtsgrundlage":"Regulatory Basis"}:</strong> {lang==="de"
?"Die Quarantäne-Freigabe erfolgt nach §15 AMG durch die Sachkundige Person. Die Genehmigung des Zonentransfers (Quarantäne → Kommerziell) erfordert die Unterschrift der Verantwortlichen Person nach §52a AMG (Torsten Cuny). Der Transport erfolgt GDP-konform gemäß EU-Leitlinien 2013/C 343/01. BtM-Bestandsänderung wird gemäß §13 BtMG protokolliert."
:"Quarantine release per §15 AMG by the Qualified Person. Zone transfer approval (Quarantine → Commercial) requires signature of the Responsible Person per §52a AMG (Torsten Cuny). Transport must be GDP-compliant per EU Guidelines 2013/C 343/01. BtM inventory change recorded per §13 BtMG."}
</div>
</Cd>
</div>;

// M1 GDP Transport — Full pickup & delivery documentation
const[m1Tab,setM1Tab]=useState("overview");

// M0.5 Registration — Canmed Registration, Import Permit Request, PZN Acquisition
const[regStep,setRegStep]=useState(0);
const[pznForm,setPznForm]=useState({show:false,product:"",thc:"",sizes:["10g","1kg"],genetics:"",line:"",submitted:false});
const[pznConfirm,setPznConfirm]=useState({show:false});
const IFA_CONF={nr:"1000658281",date:"05.02.2026",customer:"NOC Pharma GmbH",custNr:"117258",pub:"01.03.2026",addrNr:"11885",
items:[
{product:"NOC CC 24 COL",pzn:"20519632",ppn:"112051963250",size:"500g",form:"SUBSTANZ",medcang:"ja, Cann 2 Nr1 MCG",storage:"5–25°C",shelf:12},
{product:"NOC GK 27 COL",pzn:"20519678",ppn:"112051967859",size:"500g",form:"SUBSTANZ",medcang:"ja, Cann 2 Nr1 MCG",storage:"5–25°C",shelf:12},
{product:"NOC MB 23 COL",pzn:"20519655",ppn:"112051965506",size:"500g",form:"SUBSTANZ",medcang:"ja, Cann 2 Nr1 MCG",storage:"5–25°C",shelf:12},
{product:"NOC RM 21 COL",pzn:"20519649",ppn:"112051964940",size:"500g",form:"SUBSTANZ",medcang:"ja, Cann 2 Nr1 MCG",storage:"5–25°C",shelf:12},
{product:"NOC TM 18 COL",pzn:"20519684",ppn:"112051968425",size:"500g",form:"SUBSTANZ",medcang:"ja, Cann 2 Nr1 MCG",storage:"5–25°C",shelf:12},
{product:"NOC UG 21 COL",pzn:"20519661",ppn:"112051966169",size:"500g",form:"SUBSTANZ",medcang:"ja, Cann 2 Nr1 MCG",storage:"5–25°C",shelf:12}
]};
const[pznRequests,setPznRequests]=useState([
{id:"PZN-REQ-001",product:"NOC SE 19",genetics:"BBS I",thc:"18.9%",sizes:"10g, 1kg",submitted:"01.07.2025",status:"confirmed",pzn10g:"19797739",pzn1kg:"19797685",confirmed:"20.08.2025",driveRef:"PZN-CONF-SE19"},
{id:"PZN-REQ-002",product:"NOC AO 20 ARG",genetics:"Avatara IV",thc:"20%",sizes:"10g, 1kg",submitted:"15.07.2025",status:"confirmed",pzn10g:"20377818",pzn1kg:"20377853",confirmed:"25.08.2025",driveRef:"PZN-CONF-AO20"},
{id:"PZN-REQ-003",product:"NOC KS 23",genetics:"Avatara II",thc:"23%",sizes:"10g, 1kg",submitted:"20.07.2025",status:"confirmed",pzn10g:"19844858",pzn1kg:"19844841",confirmed:"28.08.2025",driveRef:"PZN-CONF-KS23"}
]);
// Supplier Data Preparation Placeholder — shown for HYTN & Medcolcanna across all stages
const SupplierDataPrep=({stageId,stageName})=>{
const supInfo=SUPS.find(s=>s.k===sup)||SUPS[0];
return <div style={{padding:16,textAlign:"center"}}>
<div style={{maxWidth:420,margin:"0 auto"}}>
<div style={{fontSize:36,marginBottom:8}}>📦</div>
<div style={{fontSize:16,fontWeight:700,marginBottom:4}}>{lang==="de"?"Daten noch nicht hinterlegt":"Data Not Yet Prepared"}</div>
<div style={{fontSize:15,color:"#6b7280",marginBottom:16}}>{supInfo.fl} {supInfo.n} — {stageId} {stageName}</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
{/* Option 1: ZIP Upload */}
<div onClick={()=>fileRef.current&&fileRef.current.click()} style={{border:"2px dashed #3b82f6",borderRadius:10,padding:14,cursor:"pointer",background:"#eff6ff",transition:"all .2s"}}>
<div style={{fontSize:24,marginBottom:6}}>📤</div>
<div style={{fontSize:14,fontWeight:700,color:"#1e40af"}}>{lang==="de"?"ZIP-Batch Upload":"ZIP Batch Upload"}</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:4}}>{lang==="de"?"Alle Dokumente als ZIP hochladen":"Upload all documents as ZIP file"}</div>
</div>

{/* Option 2: Google Drive */}
<div onClick={()=>window.open(gdLink(stageId),"_blank")} style={{border:"2px dashed #059669",borderRadius:10,padding:14,cursor:"pointer",background:"#f0fdf4",transition:"all .2s"}}>
<div style={{fontSize:24,marginBottom:6}}>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{display:"inline"}}><path d="M7.71 3.5L1.15 15l4.58 7.5L12.3 15h11.4L17.14 3.5H7.71z" fill="#0F9D58"/><path d="M12.3 15H.58L5.73 22.5h13.12L12.3 15z" fill="#4285F4"/><path d="M23.7 15H12.3l6.55 7.5L23.7 15z" fill="#F4B400"/></svg>
</div>
<div style={{fontSize:14,fontWeight:700,color:"#065f46"}}>Google Drive</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:4}}>{lang==="de"?"Mit Drive-Ordner verbinden":"Connect Drive folder"}</div>
</div>

{/* Option 3: Manual Entry */}
<div onClick={()=>window.open(gmailLink("Data Request: "+supInfo.n+" "+stageId,"Please prepare "+stageId+" documents for "+supInfo.n+":\n\nCharge: "+(selBatch||"")+"\nStage: "+stageId+" "+stageName+"\n\nUpload to: "+gdLink(stageId)),"_blank")} style={{border:"2px dashed #d97706",borderRadius:10,padding:14,cursor:"pointer",background:"#fffbeb",transition:"all .2s"}}>
<div style={{fontSize:24,marginBottom:6}}>✍️</div>
<div style={{fontSize:14,fontWeight:700,color:"#92400e"}}>{lang==="de"?"Manuell eingeben":"Manual Entry"}</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:4}}>{lang==="de"?"Schritt für Schritt ausfüllen":"Fill in step by step"}</div>
</div>
</div>

<div style={{background:"#f9fafb",borderRadius:8,padding:10,fontSize:13,color:"#6b7280",textAlign:"left"}}>
<strong>{lang==="de"?"Benötigte Unterlagen für":"Required documents for"} {stageId}:</strong>
<div style={{marginTop:4,display:"grid",gridTemplateColumns:"1fr 1fr",gap:2}}>
{(stageId==="M0"?["CoA (Supplier)","GMP Certificate","Product Specification","Phytosanitary Certificate","Export Permit","Packing List"]:
stageId==="M0.5"?["Canmed Registration","Supplier Qualification","BfArM Import Permit","PZN Numbers","INCB Allocation","Quality Agreement"]:
stageId==="M1"?["GDP Transport Order","Temperature Log","CMR Waybill","Customs Declaration","BtM Transport Permit","Insurance Certificate"]:
stageId==="M2"?["Lab COA (NOC)","Potency Analysis","Microbiology","Heavy Metals","Mycotoxins","Terpene Profile"]:
stageId==="M3"?["QP Release Certificate","Batch Release Protocol","Abweichungsbericht","CAPA (if any)","QP Declaration","EU GMP Compliance"]:
["Stufendokumente","Quality Records","Compliance Docs","Audit Trail"]).map((d,k)=><div key={k} style={{padding:"2px 0"}}>☐ {d}</div>)}
</div>
</div>

<div style={{marginTop:12,fontSize:12,color:"#9ca3af"}}>
{lang==="de"?"Nach Upload wird dieser Bereich automatisch mit den Daten befüllt.":"After upload, this section will automatically populate with the data."}
</div>
</div>
</div>};

const M05Reg=()=>{
const isBI02=selBatch==="BI-02";
const isMC01=selBatch==="MC-01";
const isHY01=selBatch==="HY-01";

// Supplier-specific registration documents
const regDocsBySup={
cannava:[
{k:"supdocs",ic:"📂",de:"Lieferantendokumentation",en:"Supplier Documentation Package",resp:"Torsten Cuny",role:"RP §52a AMG",st:isBI02?"done":"pending",
det:[
["Purpose","Compile all supplier company licenses, export authorizations & qualification documents"],
["Responsible","Torsten Cuny (RP §52a AMG)"],
["GMP Certificate","ANMAT-GMP-2024-4821 (valid → 15.03.2028)"],
["Manufacturing License","ANMAT Disp. 2025/1847"],
["Export License","ANMAT Cannabis Export Authorization"],
["GACP Certificate","Cultivation & harvesting compliance"],
["Supplier Qualification File","SQF-CANN-2025-001"],
["Quality Technical Agreement","QTA-NOC-CANN-2024-01 (→ 15.03.2026 ⚠️)"],
["PIC/S Status","✅ Argentina (ANMAT) — PIC/S member"],
["GMP Audit Report",isBI02?"✅ 12.02.2025 (Jujuy, on-site)":"⏳ Ausstehend"],
["Product Specification","Cannabis flos — Ph.Eur. monograph"],
["Stability Data","ICH Q1A — 24 months at 25°C/60% RH"],
["COA (Supplier)","COA-CANN-2025-BI02"],
["BtM Export Declaration","SEDRONAR Argentina"],
["INCB Allocation","INCB-IMP-DE-2025-0891 (2025: 500 kg)"],
["Status",isBI02?"✅ All documents compiled & verified":"⏳ Awaiting documents"]
]},
{k:"canmed",ic:"🏛️",de:"Canmed Registrierung",en:"Canmed Registration",resp:"Torsten Cuny",role:"RP §52a AMG",st:isBI02?"done":"pending",
det:[
["Registration System","Canmed — German Cannabis Registration Portal"],
["Responsible","Torsten Cuny (RP §52a AMG)"],
["Company","NOC Pharma GmbH — WDE §52a AMG-2024-0847"],
["Supplier Registered","Cannabis Avatara S.E. (Cannava), Jujuy, Argentina"],
["Products Registered",isBI02?"19 Cannava + 6 Medcolcanna = 25 total":"⏳ Ausstehend"],
["Active Products",isBI02?"NOC AO 20, NOC AS 22, NOC KS 16, NOC KS 23, NOC LF 17, NOC LF 25, NOC OF 17, NOC OF 25, NOC-G AS 20":"⏳"],
["This Batch (BI-02)",isBI02?"✅ NOC SE 19 — Essence (BBS I, 18.9% THC)":"—"],
["Cultivars","Avatara I/II/IV (Sativa), BBS I/II/III (balanced/Indica)"],
["Status",isBI02?"✅ Supplier & products registered":"⏳ Awaiting submission"]
]},
{k:"pzn",ic:"🏷️",de:"PZN-Nummern Registrierung (IFA)",en:"PZN Number Registration (IFA)",resp:"Dominik Delacher",role:"Storage Manager",st:isBI02?"done":"pending",
det:[
["Registration Body","IFA GmbH — Informationsstelle für Arzneispezialitäten"],
["Responsible","Dominik Delacher (Storage Manager)"],
["Product","NOC SE 19 — Essence (BBS I)"],
["Genetics","Scoop of Chem × Early Orange"],
["Dominance","Indica/Sativa hybrid (Indica dominant 70/30%)"],
["MedCanG Reg.","NOC SE 17/20"],
["THC Registration","18.9% (±10% → 17.0–20.8%)"],
["PZN 10g",isBI02?"19797739 ✅":"⏳ Ausstehend"],
["PZN 1kg",isBI02?"19797685 ✅":"⏳ Ausstehend"],
["PZN 10g BfArM",isBI02?"20069471 ✅":"⏳ Ausstehend"],
["Marketing Line",isBI02?"Essence":"—"],
["ABDA Database",isBI02?"✅ Listed":"⏳ Ausstehend"],
["Lauer-Taxe",isBI02?"✅ Listed — pharmacy price set":"⏳ Ausstehend"],
["Status",isBI02?"✅ PZN active & listed":"⏳ Awaiting registration"]
]},
{k:"permit",ic:"🔐",de:"BfArM Einfuhrgenehmigung",en:"BfArM Import Permit Application",resp:"Torsten Cuny",role:"RP §52a AMG",st:isBI02?"done":"pending",
det:[
["Application To","BfArM — Bundesinstitut für Arzneimittel und Medizinprodukte"],
["Legal Basis","§3 Abs. 1 BtMG + §11 BtMG"],
["Substance","Cannabis flos (Dronabinol) — Anlage III BtMG"],
["Required Docs","Canmed registration, supplier GMP, QTA, product spec, INCB allocation"],
["Processing Time","6–8 weeks"],
["Permit No.",isBI02?"E-12267/2025":"—"],
["Max Quantity",isBI02?"250 kg":"—"],
["Gueltig bis",isBI02?"28.02.2026":"—"],
["Ansprechpartner","BtM-Referat +49 228 99307-3623"],
["Status",isBI02?"✅ Permit granted 01.09.2025":"⏳ Application pending"]
]}
],
mccn:[
{k:"supdocs",ic:"📂",de:"Lieferantendokumentation",en:"Supplier Documentation Package",resp:"Torsten Cuny",role:"RP §52a AMG",st:"pending",
det:[
["Purpose","Compile all supplier company licenses, export authorizations & qualification documents"],
["Responsible","Torsten Cuny (RP §52a AMG)"],
[lang==="de"?"Lieferant":"Supplier","MEDCOLCANNA S.A.S., Bogotá D.C., Colombia"],
["GMP Certificate","INVIMA — GMP Certificate (pending)"],
["Manufacturing License","INVIMA Manufacturing Authorization"],
["Export License","FNE — Fondo Nacional de Estupefacientes (expires 30.06.2026)"],
["GACP Certificate","INVIMA GACP Certification — Audit scheduled 15.09.2026"],
["Supplier Qualification File","SQF-MCCN-2025-001 (in progress)"],
["Quality Technical Agreement","QTA-NOC-MCCN-2025-01 (draft)"],
["PIC/S Status","🔴 Colombia (INVIMA) — NOT PIC/S member"],
["Written Confirmation","🔴 Art. 46b Dir. 2001/83/EC — MANDATORY (not obtained)"],
["Product Specification","Cannabis flos — Ph.Eur. monograph"],
["Stability Data","ICH Q1A — pending supplier data"],
["COA (Supplier)","Ausstehend first shipment"],
["BtM Export Declaration","DNE Colombia (Dirección Nacional de Estupefacientes)"],
["Status","⏳ Qualification phase — Written Confirmation is BLOCKER"]
]},
{k:"canmed",ic:"🏛️",de:"Canmed Registrierung",en:"Canmed Registration",resp:"Torsten Cuny",role:"RP §52a AMG",st:"done",
det:[
["Registration System","Canmed — German Cannabis Registration Portal"],
["Responsible","Torsten Cuny (RP §52a AMG)"],
["Company","NOC Pharma GmbH — WDE §52a AMG-2024-0847"],
["Supplier Registered","MEDCOLCANNA S.A.S., Bogotá, Colombia"],
["Products Registered","6 Medcolcanna products registered"],
["Active Products","NOC CC 24, NOC GK 27, NOC MB 23, NOC RM 21, NOC TM 18, NOC UG 21"],
["MedCanG Classification","Cann 2 Nr1 MCG (all products)"],
["Origin Country","🇨🇴 Colombia"],
["🔴 Critical","Colombia NOT on EU GMP equivalence list — Written Confirmation required"],
["Status","✅ All 6 products registered in Canmed"]
]},
{k:"pzn",ic:"🏷️",de:"PZN-Nummern Registrierung (IFA)",en:"PZN Number Registration (IFA)",resp:"Dominik Delacher",role:"Storage Manager",st:"done",
det:[
["Registration Body","IFA GmbH — Informationsstelle für Arzneispezialitäten"],
["Responsible","Dominik Delacher (Storage Manager)"],
["IFA Order No.","1000658281 (05.02.2026)"],
["IFA Customer No.","117258"],
["Publication Date","01.03.2026"],
["Products Registered","6 Medcolcanna (all 500g SUBSTANZ)"],
["NOC CC 24 COL","PZN: 20519632 ✅ • PPN: 112051963250"],
["NOC GK 27 COL","PZN: 20519678 ✅ • PPN: 112051967859"],
["NOC MB 23 COL","PZN: 20519655 ✅ • PPN: 112051965506"],
["NOC RM 21 COL","PZN: 20519649 ✅ • PPN: 112051964940"],
["NOC TM 18 COL","PZN: 20519684 ✅ • PPN: 112051968425"],
["NOC UG 21 COL","PZN: 20519661 ✅ • PPN: 112051966169"],
["MedCanG","ja, Cann 2 Nr1 MCG (all products)"],
["ABDA Database","✅ Listed (all 6)"],
["Lauer-Taxe","✅ Listed — pharmacy prices pending"],
["IFA Confirmation","✅ Auftragsbestätigung Nr. 1000658281"],
["Status","✅ All 6 PZN numbers confirmed & published"]
]},
{k:"permit",ic:"🔐",de:"BfArM Einfuhrgenehmigung",en:"BfArM Import Permit Application",resp:"Torsten Cuny",role:"RP §52a AMG",st:"pending",
det:[
["Application To","BfArM — Bundesinstitut für Arzneimittel und Medizinprodukte"],
["Legal Basis","§3 Abs. 1 BtMG + §11 BtMG"],
["Substance","Cannabis flos (Dronabinol) — Anlage III BtMG"],
["Origin Country","🇨🇴 Colombia"],
["🔴 Prerequisite","Written Confirmation from INVIMA must be obtained FIRST"],
["Required Docs","Canmed reg. ✅, Written Confirmation 🔴, supplier GMP, QTA, product spec"],
["Processing Time","6–8 weeks (after submission)"],
["Permit No.","⏳ Not yet applied"],
["Ansprechpartner","BtM-Referat +49 228 99307-3623"],
["Status","⏳ Blocked — awaiting Written Confirmation (Art. 46b)"]
]},
{k:"incb",ic:"🌐",de:"INCB Allokation",en:"INCB Allocation Confirmation",resp:"Torsten Cuny",role:"RP §52a AMG",st:"pending",
det:[
["Authority","INCB — International Narcotics Control Board, Vienna"],
["Export Country","🇨🇴 Colombia"],
["Colombia Export Quota","Via DNE (Dirección Nacional de Estupefacientes)"],
["Germany Annual Estimate","Filed for 2026 — pending INCB confirmation"],
["INCB Auth No.","⏳ Not yet allocated"],
["Prerequisite","BfArM import permit must be granted first"],
["Status","⏳ Ausstehend — requires BfArM permit + DNE Colombia allocation"]
]}
],
hytn:[
{k:"supdocs",ic:"📂",de:"Lieferantendokumentation",en:"Supplier Documentation Package",resp:"Torsten Cuny",role:"RP §52a AMG",st:"pending",
det:[
["Purpose","Compile all supplier company licenses, export authorizations & qualification documents"],
["Responsible","Torsten Cuny (RP §52a AMG)"],
[lang==="de"?"Lieferant":"Supplier","HYTN Cannabis Inc., British Columbia, Canada"],
["GMP Certificate","Health Canada GMP — EU-GMP equivalence via MRA"],
["Manufacturing License","Health Canada Cannabis License (pending verification)"],
["Export License","Health Canada Cannabis Export Permit"],
["GACP Certificate","Health Canada GACP Compliance"],
["Supplier Qualification File","SQF-HYTN-2026-001 (planned)"],
["Quality Technical Agreement","QTA-NOC-HYTN-2026-01 (draft phase)"],
["PIC/S Status","✅ Canada (Health Canada) — PIC/S member"],
["EU-Canada MRA","✅ Mutual Recognition Agreement in place"],
["Product Specification","Cannabis flos — Ph.Eur. monograph (pending)"],
["Stability Data","ICH Q1A — awaiting supplier data"],
["COA (Supplier)","Ausstehend first shipment"],
["BtM Export Declaration","Health Canada Export Division"],
["Status","⏳ Planned — supplier qualification not started"]
]},
{k:"canmed",ic:"🏛️",de:"Canmed Registrierung",en:"Canmed Registration",resp:"Torsten Cuny",role:"RP §52a AMG",st:"pending",
det:[
["Registration System","Canmed — German Cannabis Registration Portal"],
["Responsible","Torsten Cuny (RP §52a AMG)"],
["Company","NOC Pharma GmbH — WDE §52a AMG-2024-0847"],
["Supplier To Register","HYTN Cannabis Inc., BC, Canada"],
["Products","⏳ Product portfolio to be defined"],
["Origin Country","🇨🇦 Canada"],
["PIC/S Status","✅ Canada is PIC/S member — simplified pathway"],
["EU-Canada MRA","✅ No Written Confirmation needed (MRA recognized)"],
["Status","⏳ Ausstehend — supplier registration not yet initiated"]
]},
{k:"pzn",ic:"🏷️",de:"PZN-Nummern Registrierung (IFA)",en:"PZN Number Registration (IFA)",resp:"Dominik Delacher",role:"Storage Manager",st:"pending",
det:[
["Registration Body","IFA GmbH — Informationsstelle für Arzneispezialitäten"],
["Responsible","Dominik Delacher (Storage Manager)"],
["Products","⏳ No products defined yet"],
["Package Sizes","TBD — 10g, 1kg expected"],
["Status","⏳ Ausstehend — products must be registered in Canmed first"]
]},
{k:"permit",ic:"🔐",de:"BfArM Einfuhrgenehmigung",en:"BfArM Import Permit Application",resp:"Torsten Cuny",role:"RP §52a AMG",st:"pending",
det:[
["Application To","BfArM — Bundesinstitut für Arzneimittel und Medizinprodukte"],
["Legal Basis","§3 Abs. 1 BtMG + §11 BtMG"],
["Substance","Cannabis flos (Dronabinol) — Anlage III BtMG"],
["Origin Country","🇨🇦 Canada"],
["Advantage","✅ Canada PIC/S + MRA = streamlined process"],
["Required Docs","Canmed reg., supplier GMP (Health Canada), QTA, product spec"],
["Processing Time","6–8 weeks"],
["Status","⏳ Planned — not yet applied"]
]},
{k:"incb",ic:"🌐",de:"INCB Allokation",en:"INCB Allocation Confirmation",resp:"Torsten Cuny",role:"RP §52a AMG",st:"pending",
det:[
["Authority","INCB — International Narcotics Control Board, Vienna"],
["Export Country","🇨🇦 Canada"],
["Canada Export Quota","Via Health Canada Export Division"],
["Germany Annual Estimate","Included in 2026 estimate — pending confirmation"],
["Status","⏳ Planned — requires BfArM permit + Health Canada allocation"]
]}
]
};
const regDocs=regDocsBySup[sup]||regDocsBySup.cannava;
const done=regDocs.filter(d=>d.st==="done").length;
const tot=regDocs.length;

return <div>
<Cd t={"📝 M0 "+(lang==="de"?"Registrierung & Genehmigungen":"Registration & Permits")} badge={<Bd c={done===tot?"#059669":"#d97706"} b={done===tot?"#dcfce7":"#fef3c7"}>{done}/{tot}</Bd>}>

{/* Progress overview */}
<div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
<Bd c="#059669" b="#d1fae5">✅ {done}/{tot} {lang==="de"?"Abgeschlossen":"Completed"}</Bd>
{done<tot&&<Bd c="#d97706" b="#fef3c7">⏳ {tot-done} {lang==="de"?"Ausstehend":"Ausstehend"}</Bd>}
</div>

{/* Process flow visual */}
<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:14,padding:10,background:"#f8fafc",borderRadius:8,border:"1px solid #e5e7eb",overflowX:"auto"}}>
{regDocs.map((d,j)=><Fragment key={d.k}>
<div style={{display:"flex",flexDirection:"column",alignItems:"center",minWidth:80,cursor:"pointer"}} onClick={()=>setRegStep(j)}>
<div style={{width:32,height:32,borderRadius:"50%",background:d.st==="done"?"#059669":"#fbbf24",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:"#fff",border:regStep===j?"3px solid #1e40af":"3px solid transparent"}}>{d.st==="done"?"✓":d.ic}</div>
<div style={{fontSize:11,color:regStep===j?"#1e40af":"#6b7280",fontWeight:regStep===j?700:400,textAlign:"center",marginTop:3,maxWidth:70}}>{d[lang]}</div>
</div>
{j<regDocs.length-1&&<div style={{width:20,height:2,background:d.st==="done"?"#059669":"#d1d5db",flexShrink:0}}/>}
</Fragment>)}
</div>

{/* Selected step detail */}
{regDocs.map((doc,j)=>{
if(j!==regStep)return null;
return <div key={doc.k} style={{border:"1.5px solid "+(doc.st==="done"?"#059669":"#fbbf24"),borderRadius:8,overflow:"hidden"}}>
<div style={{padding:10,background:doc.st==="done"?"#f0fdf4":"#fffbeb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:22}}>{doc.ic}</span>
<div>
<div style={{fontSize:16,fontWeight:700}}>{doc[lang]}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{doc.resp} — {doc.role}</div>
</div>
</div>
<Bd c={doc.st==="done"?"#059669":"#d97706"} b={doc.st==="done"?"#dcfce7":"#fef3c7"}>{doc.st==="done"?"✅ Done":"⏳ Ausstehend"}</Bd>
</div>
<div style={{padding:10,background:"#fff"}}>
<div style={{background:"#f9fafb",borderRadius:6,padding:10}}>
{doc.det.map(([l,v],k)=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:k<doc.det.length-1?"1px solid #e5e7eb":"none",fontSize:15}}>
<span style={{color:"#6b7280"}}>{l}</span>
<span style={{fontWeight:600,textAlign:"right",maxWidth:"60%",color:typeof v==="string"&&v.startsWith("✅")?"#059669":typeof v==="string"&&v.startsWith("⏳")?"#d97706":"#1f2937"}}>{v}</span>
</div>)}
</div>
<DocActions doc={doc} stage="M0"/>

{/* PZN Request Form — only shown when PZN step is selected */}
{doc.k==="pzn"&&<div style={{marginTop:10,borderTop:"2px solid #e5e7eb",paddingTop:10}}>

{/* New PZN Request */}
{!pznForm.show&&!pznConfirm.show&&<div style={{display:"flex",gap:6}}>
<button onClick={()=>setPznForm(p=>({...p,show:true,submitted:false}))} style={{flex:1,padding:"10px",borderRadius:6,fontSize:15,fontWeight:700,border:"2px dashed #b45309",background:"#fffbeb",color:"#92400e",cursor:"pointer"}}>🏷️ {lang==="de"?"Neue PZN-Nummer beantragen":"Request New PZN Number"}</button>
<button onClick={()=>setPznConfirm({show:true})} style={{flex:1,padding:"10px",borderRadius:6,fontSize:15,fontWeight:700,border:"2px dashed #059669",background:"#f0fdf4",color:"#065f46",cursor:"pointer"}}>✅ {lang==="de"?"PZN-Bestätigung hochladen":"Upload PZN Confirmation"}</button>
</div>}

{/* PZN Request Form */}
{pznForm.show&&!pznForm.submitted&&<div style={{border:"1.5px solid #b45309",borderRadius:8,padding:12,background:"#fffbeb"}}>
<div style={{fontSize:16,fontWeight:700,marginBottom:10,color:"#92400e"}}>🏷️ {lang==="de"?"PZN-Antrag an IFA GmbH":"PZN Application to IFA GmbH"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
<div><div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>{lang==="de"?"Produktname (MedCanG)":"Product Name (MedCanG)"}</div>
<input value={pznForm.product} onChange={e=>setPznForm(p=>({...p,product:e.target.value}))} placeholder="e.g. NOC SE 22" style={{width:"100%",padding:"6px 8px",borderRadius:4,border:"1px solid #d1d5db",fontSize:15}}/></div>
<div><div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>THC %</div>
<input value={pznForm.thc} onChange={e=>setPznForm(p=>({...p,thc:e.target.value}))} placeholder="e.g. 22" style={{width:"100%",padding:"6px 8px",borderRadius:4,border:"1px solid #d1d5db",fontSize:15}}/></div>
<div><div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>{lang==="de"?"Genetik / Cultivar":"Genetics / Cultivar"}</div>
<input value={pznForm.genetics} onChange={e=>setPznForm(p=>({...p,genetics:e.target.value}))} placeholder="e.g. BBS I" style={{width:"100%",padding:"6px 8px",borderRadius:4,border:"1px solid #d1d5db",fontSize:15}}/></div>
<div><div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>{lang==="de"?"Marketing-Linie":"Marketing Line"}</div>
<input value={pznForm.line} onChange={e=>setPznForm(p=>({...p,line:e.target.value}))} placeholder="e.g. Intense" style={{width:"100%",padding:"6px 8px",borderRadius:4,border:"1px solid #d1d5db",fontSize:15}}/></div>
</div>
<div style={{marginBottom:10}}>
<div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:4}}>{lang==="de"?"Packungsgrößen (PZN je Größe)":"Package Sizes (PZN per size)"}</div>
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
{["10g","150g","250g","500g","1kg"].map(s=><label key={s} style={{display:"flex",alignItems:"center",gap:3,fontSize:14,cursor:"pointer"}}>
<input type="checkbox" checked={pznForm.sizes.includes(s)} onChange={e=>{setPznForm(p=>({...p,sizes:e.target.checked?[...p.sizes,s]:p.sizes.filter(x=>x!==s)}))}} style={{accentColor:"#b45309"}}/>
{s}
</label>)}
</div>
</div>
<div style={{background:"#fff",borderRadius:6,padding:8,marginBottom:10,fontSize:13,color:"#6b7280",border:"1px solid #fed7aa"}}>
<strong>IFA GmbH</strong> — Informationsstelle für Arzneispezialitäten<br/>
Hamburger Allee 26, 60486 Frankfurt am Main<br/>
{lang==="de"?"Bearbeitungszeit":"Processing time"}: ~2-4 {lang==="de"?"Wochen":"weeks"} • {lang==="de"?"Verantwortlich":"Responsible"}: Dominik Delacher
</div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>setPznForm(p=>({...p,submitted:true}))} style={{flex:1,padding:"8px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#b45309",color:"#fff",cursor:"pointer"}}>📤 {lang==="de"?"PZN-Antrag generieren & senden":"Generate & Submit PZN Application"}</button>
<button onClick={()=>setPznForm({show:false,product:"",thc:"",sizes:["10g","1kg"],genetics:"",line:"",submitted:false})} style={{padding:"8px 12px",borderRadius:6,fontSize:15,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>{lang==="de"?"Abbrechen":"Cancel"}</button>
</div>
</div>}

{/* PZN Request Submitted Confirmation */}
{pznForm.show&&pznForm.submitted&&<div style={{border:"1.5px solid #059669",borderRadius:8,padding:12,background:"#f0fdf4"}}>
<div style={{textAlign:"center",padding:10}}>
<div style={{fontSize:28,marginBottom:6}}>✅</div>
<div style={{fontSize:15,fontWeight:700,color:"#065f46"}}>{lang==="de"?"PZN-Antrag generiert":"PZN Application Erstellt"}</div>
<div style={{fontSize:14,color:"#6b7280",marginTop:4}}>
{pznForm.product||"NOC XX"} • THC {pznForm.thc||"—"}% • {pznForm.sizes.join(", ")} • {pznForm.genetics||"—"}
</div>
<div style={{marginTop:10,display:"flex",gap:6,justifyContent:"center"}}>
<button onClick={()=>window.open(gdLink("pzn_requests"),"_blank")} style={{padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer"}}>📂 {lang==="de"?"In Drive speichern":"Save to Drive"}</button>
<button onClick={()=>window.open(gmailLink("PZN Application — "+pznForm.product+" — NOC Pharma GmbH","IFA GmbH\n\nPZN Application:\nProduct: "+pznForm.product+"\nTHC: "+pznForm.thc+"%\nSizes: "+pznForm.sizes.join(", ")+"\nGenetics: "+pznForm.genetics+"\nLine: "+pznForm.line+"\n\nCompany: NOC Pharma GmbH\nContact: Dominik Delacher\n\nPlease see attached application form."),"_blank")} style={{padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>📧 {lang==="de"?"An IFA senden":"Send to IFA"}</button>
<button onClick={()=>setPznForm({show:false,product:"",thc:"",sizes:["10g","1kg"],genetics:"",line:"",submitted:false})} style={{padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer"}}>✓ {lang==="de"?"Fertig":"Done"}</button>
</div>
</div>
</div>}

{/* PZN Confirmation Upload */}
{pznConfirm.show&&<div style={{border:"1.5px solid #059669",borderRadius:8,padding:12,background:"#f0fdf4"}}>
<div style={{fontSize:16,fontWeight:700,marginBottom:8,color:"#065f46"}}>✅ {lang==="de"?"PZN-Bestätigung von IFA hochladen":"Upload PZN Confirmation from IFA"}</div>
<div style={{fontSize:14,color:"#6b7280",marginBottom:10}}>{lang==="de"?"Original-Bestätigung hochladen und PZN-Registrierungsliste aktualisieren":"Upload original confirmation and update PZN registration list"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
<div style={{border:"2px dashed #a7f3d0",borderRadius:8,padding:16,textAlign:"center",cursor:"pointer",background:"#fff"}} onClick={()=>window.open(gdLink("pzn_confirmations"),"_blank")}>
<div style={{fontSize:24,marginBottom:4}}>📄</div>
<div style={{fontSize:14,fontWeight:600,color:"#065f46"}}>{lang==="de"?"IFA Bestätigung hochladen":"Upload IFA Confirmation"}</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>PDF / Scan → Google Drive</div>
</div>
<div style={{border:"2px dashed #a7f3d0",borderRadius:8,padding:16,textAlign:"center",cursor:"pointer",background:"#fff"}} onClick={()=>window.open(gdLink("pzn_abda"),"_blank")}>
<div style={{fontSize:24,marginBottom:4}}>📊</div>
<div style={{fontSize:14,fontWeight:600,color:"#065f46"}}>{lang==="de"?"ABDA Listung bestätigen":"Confirm ABDA Listing"}</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>ABDA-Datenbank + Lauer-Taxe</div>
</div>
</div>
<div style={{background:"#fff",borderRadius:6,padding:8,marginBottom:8,fontSize:13,border:"1px solid #d1fae5"}}>
<strong>{lang==="de"?"Nach Upload":"After upload"}:</strong><br/>
• {lang==="de"?"PZN-Nummern werden in der Registrierungstabelle aktualisiert":"PZN numbers will be updated in the registration table"}<br/>
• {lang==="de"?"ABDA-Datenbank Status wird auf ✅ gesetzt":"ABDA database status will be set to ✅"}<br/>
• {lang==="de"?"Lauer-Taxe Eintrag wird bestätigt":"Lauer-Taxe entry will be confirmed"}
</div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>setPznConfirm({show:false})} style={{flex:1,padding:"8px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>✅ {lang==="de"?"Bestätigung hochgeladen & Liste aktualisiert":"Confirmation Uploaded & List Updated"}</button>
<button onClick={()=>setPznConfirm({show:false})} style={{padding:"8px 12px",borderRadius:6,fontSize:15,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>{lang==="de"?"Abbrechen":"Cancel"}</button>
</div>
</div>}

</div>}
{doc.st!=="done"&&<div style={{marginTop:8,display:"flex",gap:6}}>
<button onClick={()=>fileRef.current&&fileRef.current.click()} style={{flex:1,padding:"8px 12px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#b45309",color:"#fff",cursor:"pointer"}}>📤 {lang==="de"?"Hochladen / Einreichen":"Upload / Submit"}</button>
<button onClick={()=>window.open(gmailLink("Request: "+doc[lang]+" — Batch "+(selBatch||""),"Bitte bereitstellen:\n"+doc[lang]+"\nRef.: "+(doc.ref||"")+"\n\nUpload to Google Drive"),"_blank")} style={{padding:"8px 12px",borderRadius:6,fontSize:15,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📧 {lang==="de"?"Anfordern":"Request"}</button>
</div>}
</div>
</div>})}

{/* Responsibility summary */}
<div style={{marginTop:12,display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<div style={{background:"#f0fdfa",borderRadius:8,padding:10,border:"1px solid #99f6e4"}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
<div style={{width:28,height:28,borderRadius:"50%",background:"#0891b2",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff"}}>TC</div>
<div><div style={{fontSize:15,fontWeight:700}}>Torsten Cuny</div><div style={{fontSize:12,color:"#6b7280"}}>RP §52a AMG</div></div>
</div>
<div style={{fontSize:13,color:"#374151"}}>
• Canmed registration<br/>• Supplier doc package<br/>• BfArM permit application<br/>• INCB allocation
</div>
</div>
<div style={{background:"#fff7ed",borderRadius:8,padding:10,border:"1px solid #fed7aa"}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
<div style={{width:28,height:28,borderRadius:"50%",background:"#ea580c",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:"#fff"}}>DD</div>
<div><div style={{fontSize:15,fontWeight:700}}>Dominik Delacher</div><div style={{fontSize:12,color:"#6b7280"}}>Storage Manager</div></div>
</div>
<div style={{fontSize:13,color:"#374151"}}>
• PZN registration (IFA)<br/>• ABDA database listing<br/>• Lauer-Taxe entry<br/>• EAN-13 barcode generation
</div>
</div>
</div>

{/* Full PZN Product Registry */}
{(isBI02||sup==="mccn"||sup==="hytn")&&<div style={{marginTop:14,borderTop:"2px solid #e5e7eb",paddingTop:14}}>
<div style={{fontSize:16,fontWeight:700,marginBottom:8}}>🏷️ {lang==="de"?"NOC Pharma — Produktregistrierung":"NOC Pharma — Product Registry"} ({sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN"})</div>
{sup==="cannava"&&<div>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:600}}>
<thead><tr>{["Status","Reg. Name","Commercial","Line","Genetics","THC%","PZN 10g","PZN 1kg"].map((h,j)=><th key={j} style={{padding:"4px 6px",background:"#f9fafb",border:"1px solid #e5e7eb",textAlign:"left",fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
<tbody>
{[
["JA","NOC AO 20 ARG","NOC AO 20 ARG","—","Avatara IV","20%","20377818","20377853"],
["JA","NOC AS 22","NOC AS 22 ARG","—","Avatara I","22%","20377824","20377876"],
["JA","NOC KS 16","NOC KS 16","Easy","Avatara II","15.5%","19869367","19869290"],
["JA","NOC KS 23","NOC KS 23","Spectrum","Avatara II","23%","19844858","19844841"],
["JA","NOC LF 17","NOC LF 17","Revive","BBS II","17%","19869338","19869373"],
["JA","NOC LF 25","NOC LF 25","Strong","BBS II","25.4%","19797716","19797751"],
["JA","NOC OF 17","NOC OF 17","Soft","BBS III","17%","19869284","19869344"],
["JA","NOC OF 25","NOC OF 25","Intense","BBS III","25.5%","19797768","19797691"],
["JA","NOC-G AS 20","NOC-G AS 20","—","Avatara I (G)","20%","19898363","19898357"],
["AUSL.","NOC SE 17/20","NOC SE 19","Essence","BBS I","18.9%","19797739","19797685"],
["AUSL.","NOC SE 20/22","NOC SE 21","Bright Up","BBS I","20.8%","19460922","19460879"],
["AUSL.","NOC SE 22/27","NOC SE 25","Int. Relieve","BBS I","25.4%","19869309","19869321"],
["AUSL.","NOC AS 18/20","NOC AS 18","Balance","Avatara I","18.8%","19869255","19869350"],
["AUSL.","NOC AS 22/24","NOC AS 23","Chill","Avatara I","23%","19460885","19460856"],
["AUSL.","NOC AS 27/30","NOC AS 28","Forte","Avatara I","28%","19460827","19460862"],
["AUSL.","NOC KS 18/20","NOC KS 18","Relieve","Avatara II","18.8%","19800737","19800743"],
["AUSL.","NOC LF 20/22","NOC LF 20","Serenity","BBS II","20.8%","19460810","19460916"],
["AUSL.","NOC OF 20/22","NOC OF 20","Sensation","BBS III","20.8%","19485394","19485388"],
["AUSL.","NOC SE 14/17","NOC SE 15","Light","BBS I","15.5%","19797745","19797722"]
].map(([st,reg,comm,line,gen,thc,p10,p1k],j)=><tr key={j} style={{background:selBatch==="BI-02"&&reg.includes("SE 17/20")?"#fef3c7":"transparent"}}>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb"}}><span style={{padding:"1px 4px",borderRadius:3,fontSize:11,fontWeight:700,background:st==="JA"?"#dcfce7":"#fef3c7",color:st==="JA"?"#059669":"#92400e"}}>{st}</span></td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontWeight:600}}>{reg}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb"}}>{comm}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",color:"#6b7280"}}>{line}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb"}}>{gen}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontWeight:700}}>{thc}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontFamily:"monospace",fontSize:12}}>{p10}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontFamily:"monospace",fontSize:12}}>{p1k}</td>
</tr>)}
</tbody>
</table>
</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:6}}>JA = Active • AUSL. = Auslauf (phasing out) • Highlighted = current batch product • Source: IFA/ABDA</div>
</div>}

{/* Medcolcanna (Colombia) Product Registry */}
{sup==="mccn"&&<div>
<div style={{fontSize:16,fontWeight:700,marginBottom:8}}>🇨🇴 {lang==="de"?"Medcolcanna — Produktregistrierung (Colombia)":"Medcolcanna — Product Registry (Colombia)"}</div>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",fontSize:13,borderCollapse:"collapse",minWidth:650}}>
<thead><tr>{["Status","Product","PZN 500g","PPN","Size","MedCanG","Storage","Shelf"].map((h,j)=><th key={j} style={{padding:"4px 6px",background:"#fffbeb",border:"1px solid #e5e7eb",textAlign:"left",fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
<tbody>
{IFA_CONF.items.map((it,j)=><tr key={j}>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb"}}><span style={{padding:"1px 4px",borderRadius:3,fontSize:11,fontWeight:700,background:"#dcfce7",color:"#059669"}}>JA</span></td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontWeight:600}}>{it.product}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontFamily:"monospace",fontSize:12,fontWeight:700}}>{it.pzn}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontFamily:"monospace",fontSize:11,color:"#6b7280"}}>{it.ppn}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb"}}>{it.size}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",color:"#059669",fontSize:12}}>✅ Cann 2 Nr1</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontSize:12}}>{it.storage}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontSize:12}}>{it.shelf} Mo</td>
</tr>)}
</tbody>
</table>
</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:4}}>Source: IFA-Auftragsbestätigung Nr. {IFA_CONF.nr} • Veröffentlichung: {IFA_CONF.pub}</div>

{/* IFA Auftragsbestaetigung Document */}
<div style={{marginTop:14,borderTop:"2px solid #059669",paddingTop:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:16,fontWeight:700}}>📄 IFA-Auftragsbestätigung</div>
<span style={{padding:"3px 8px",borderRadius:4,fontSize:13,fontWeight:700,background:"#dcfce7",color:"#059669"}}>✅ {lang==="de"?"Bestätigt":"Confirmed"}</span>
</div>
<div style={{background:"#f0fdf4",borderRadius:8,padding:12,border:"1px solid #bbf7d0"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:14}}>
{[
[lang==="de"?"Auftraggeber":"Client","NOC Pharma GmbH"],
[lang==="de"?"Kunden-Nr.":"Customer No.","117258"],
[lang==="de"?"Auftrags-Nr.":"Auftragsnr.",IFA_CONF.nr],
[lang==="de"?"Datum":"Datum",IFA_CONF.date],
[lang==="de"?"Veröffentlichung":"Publication",IFA_CONF.pub],
[lang==="de"?"Adress-Nr.":"Address No.",IFA_CONF.addrNr],
[lang==="de"?"Artikel":"Items",IFA_CONF.items.length+" Produkte"],
[lang==="de"?"Portal":"Portal","IFA-Portal, kurzfristig"],
["Darreichungsform","SUBSTANZ"],
["MedCanG","ja, Cann 2 Nr1 MCG"],
[lang==="de"?"Vertriebsstatus":"Distribution","im Vertrieb / verkehrsfähig"],
[lang==="de"?"Lagertemperatur":"Storage Temp","5–25°C"],
].map(([l,v],k)=><div key={k} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:k<11?"1px solid #d1fae5":"none"}}>
<span style={{color:"#6b7280"}}>{l}</span>
<span style={{fontWeight:600}}>{v}</span>
</div>)}
</div>
<div style={{marginTop:10,display:"flex",gap:6,flexWrap:"wrap"}}>
<button onClick={()=>window.open(gdLink("ifa_confirmation"),"_blank")} style={{padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer"}}>📄 {lang==="de"?"Original ansehen":"View Original"}</button>
<button onClick={()=>window.open(gdLink("ifa_confirmation")+"?print=true","_blank")} style={{padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>🖨️ PDF</button>
<button onClick={()=>window.open(gmailLink("IFA-Auftragsbestätigung Nr. "+IFA_CONF.nr+" — NOC Pharma","IFA-Auftragsbestätigung\n\nAuftrags-Nr.: "+IFA_CONF.nr+"\nDatum: "+IFA_CONF.date+"\nVeröffentlichung: "+IFA_CONF.pub+"\n\n"+IFA_CONF.items.map(i=>i.product+" → PZN: "+i.pzn).join("\n")+"\n\nGoogle Drive: "+gdLink("ifa_confirmation")),"_blank")} style={{padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📧 {lang==="de"?"Senden":"Send"}</button>
<button onClick={()=>window.open(gdLink("ifa_confirmations"),"_blank")} style={{padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:700,border:"2px dashed #059669",background:"#f0fdf4",color:"#065f46",cursor:"pointer"}}>📤 {lang==="de"?"Original hochladen":"Upload Original"}</button>
</div>
</div>
<div style={{marginTop:8,fontSize:13,color:"#6b7280"}}>
<strong>{lang==="de"?"Gemeinsame IFA-Spezifikationen":"Common IFA Specifications"}:</strong> Verpackungsart: Beutel • Lichtempfindlich: vor Sonne schützen • Feuchteempfindlich: trocken lagern • Laufzeit: 12 Monate • Droge/Chemikalie: ja • Vertrieb an KVA/GH/Apoth: ja
</div>
</div>
</div>}

{/* HYTN (Canada) — No products registered yet */}
{sup==="hytn"&&<div style={{padding:20,textAlign:"center",background:"#eff6ff",borderRadius:8,border:"2px dashed #3b82f6"}}>
<div style={{fontSize:28,marginBottom:6}}>🇨🇦</div>
<div style={{fontSize:16,fontWeight:700,color:"#1e40af",marginBottom:4}}>HYTN Cannabis Inc. — {lang==="de"?"Produktregistrierung":"Product Registry"}</div>
<div style={{fontSize:14,color:"#6b7280",marginBottom:12}}>{lang==="de"?"Noch keine Produkte registriert. PZN-Registrierung wird nach Canmed-Anmeldung eingeleitet.":"No products registered yet. PZN registration will begin after Canmed registration."}</div>
<div style={{display:"flex",gap:8,justifyContent:"center"}}>
<button onClick={()=>setPznForm(p=>({...p,show:true,submitted:false}))} style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"2px dashed #b45309",background:"#fffbeb",color:"#92400e",cursor:"pointer"}}>🏷️ {lang==="de"?"PZN-Registrierung starten":"Start PZN Registration"}</button>
<button onClick={()=>window.open(gdLink("hytn_products"),"_blank")} style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📂 Google Drive</button>
</div>
</div>}

{/* PZN Request Tracking */}
<div style={{marginTop:14,borderTop:"2px solid #e5e7eb",paddingTop:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:16,fontWeight:700}}>📋 {lang==="de"?"PZN Anträge & Bestätigungen":"PZN Requests & Confirmations"}</div>
<button onClick={()=>setPznForm(p=>({...p,show:!p.show,submitted:false}))} style={{padding:"5px 12px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:pznForm.show?"#dc2626":"#b45309",color:"#fff",cursor:"pointer"}}>{pznForm.show?"✕ "+(lang==="de"?"Schließen":"Close"):"+ "+(lang==="de"?"Neuer PZN-Antrag":"New PZN Request")}</button>
</div>

{/* New PZN Request Form */}
{pznForm.show&&<div style={{border:"2px solid #b45309",borderRadius:8,padding:14,marginBottom:12,background:"#fffbeb"}}>
<div style={{fontSize:15,fontWeight:700,color:"#92400e",marginBottom:10}}>📝 {lang==="de"?"Neuen PZN-Antrag erstellen":"Create New PZN Request"}</div>
{!pznForm.submitted?<div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
<div><div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>{lang==="de"?"Produktname":"Product Name"} *</div>
<input value={pznForm.product} onChange={e=>setPznForm(p=>({...p,product:e.target.value}))} placeholder="z.B. NOC XX 22" style={{width:"100%",padding:"6px 8px",borderRadius:5,border:"1px solid #d1d5db",fontSize:15}}/></div>
<div><div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>{lang==="de"?"Genetik / Cultivar":"Genetics / Cultivar"} *</div>
<input value={pznForm.genetics} onChange={e=>setPznForm(p=>({...p,genetics:e.target.value}))} placeholder="z.B. BBS I, Avatara II" style={{width:"100%",padding:"6px 8px",borderRadius:5,border:"1px solid #d1d5db",fontSize:15}}/></div>
<div><div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>THC% (Reg.) *</div>
<input value={pznForm.thc} onChange={e=>setPznForm(p=>({...p,thc:e.target.value}))} placeholder="z.B. 22%" style={{width:"100%",padding:"6px 8px",borderRadius:5,border:"1px solid #d1d5db",fontSize:15}}/></div>
<div><div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>{lang==="de"?"Verpackungsgrößen":"Package Sizes"}</div>
<div style={{display:"flex",gap:4,marginTop:2}}>
{["10g","150g","250g","500g","1kg"].map(s=><label key={s} style={{display:"flex",alignItems:"center",gap:2,fontSize:13,cursor:"pointer"}}>
<input type="checkbox" checked={pznForm.sizes.includes(s)} onChange={()=>setPznForm(p=>({...p,sizes:p.sizes.includes(s)?p.sizes.filter(x=>x!==s):[...p.sizes,s]}))} style={{width:12,height:12}}/>
{s}
</label>)}
</div></div>
</div>
<div style={{marginBottom:8}}><div style={{fontSize:13,fontWeight:600,color:"#6b7280",marginBottom:2}}>{lang==="de"?"Anmerkungen":"Notes"}</div>
<input value={pznForm.notes} onChange={e=>setPznForm(p=>({...p,notes:e.target.value}))} placeholder={lang==="de"?"Marketing-Linie, Abstammung, etc.":"Marketing line, ancestry, etc."} style={{width:"100%",padding:"6px 8px",borderRadius:5,border:"1px solid #d1d5db",fontSize:15}}/></div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{if(pznForm.product&&pznForm.thc){const newReq={id:"PZN-REQ-"+(pznRequests.length+1).toString().padStart(3,"0"),product:pznForm.product,genetics:pznForm.genetics,thc:pznForm.thc,sizes:pznForm.sizes.join(", "),submitted:new Date().toLocaleDateString("de-DE"),status:"pending",pzn10g:"—",pzn1kg:"—",confirmed:"—",driveRef:""};setPznRequests(p=>[...p,newReq]);setPznForm(p=>({...p,submitted:true}))}}} style={{flex:1,padding:"8px 14px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#b45309",color:"#fff",cursor:"pointer"}}>📤 {lang==="de"?"IFA-Antrag generieren & senden":"Generate & Submit IFA Application"}</button>
<button onClick={()=>window.open(gdLink("pzn-requests"),"_blank")} style={{padding:"8px 14px",borderRadius:6,fontSize:15,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📂 Drive</button>
</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:6}}>{lang==="de"?"Antrag wird als PDF generiert und im Google Drive Ordner gespeichert. Dominik Delacher wird benachrichtigt.":"Application will be generated as PDF and saved to Google Drive folder. Dominik Delacher will be notified."}</div>
</div>
:<div style={{textAlign:"center",padding:16}}>
<div style={{fontSize:24,marginBottom:6}}>✅</div>
<div style={{fontSize:16,fontWeight:700,color:"#065f46"}}>{lang==="de"?"PZN-Antrag erstellt!":"PZN Request Created!"}</div>
<div style={{fontSize:14,color:"#6b7280",marginTop:4}}>{pznForm.product} — {pznForm.thc} THC — {pznForm.sizes.join(", ")}</div>
<div style={{fontSize:13,color:"#6b7280",marginTop:2}}>{lang==="de"?"Gespeichert in Google Drive • Dominik Delacher benachrichtigt":"Saved to Google Drive • Dominik Delacher notified"}</div>
</div>}
</div>}

{/* Request tracking table */}
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}>
<thead><tr>{[lang==="de"?"Antrag":"Request",lang==="de"?"Produkt":"Product","THC%",lang==="de"?"Größen":"Sizes",lang==="de"?"Eingereicht":"Submitted","Status","PZN 10g","PZN 1kg",lang==="de"?"Aktionen":"Actions"].map((h,j)=><th key={j} style={{padding:"4px 6px",background:"#f9fafb",border:"1px solid #e5e7eb",textAlign:"left",fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
<tbody>
{pznRequests.map((r,j)=><tr key={j}>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontWeight:600,fontSize:12}}>{r.id}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb"}}>{r.product}<br/><span style={{color:"#6b7280",fontSize:11}}>{r.genetics}</span></td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontWeight:700}}>{r.thc}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontSize:12}}>{r.sizes}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontSize:12}}>{r.submitted}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb"}}><span style={{padding:"1px 5px",borderRadius:3,fontSize:11,fontWeight:700,background:r.status==="confirmed"?"#dcfce7":"#fef3c7",color:r.status==="confirmed"?"#059669":"#92400e"}}>{r.status==="confirmed"?"✅ Confirmed":"⏳ Ausstehend"}</span></td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontFamily:"monospace",fontSize:12,color:r.pzn10g==="—"?"#9ca3af":"#1f2937"}}>{r.pzn10g}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb",fontFamily:"monospace",fontSize:12,color:r.pzn1kg==="—"?"#9ca3af":"#1f2937"}}>{r.pzn1kg}</td>
<td style={{padding:"3px 6px",border:"1px solid #e5e7eb"}}>
<div style={{display:"flex",gap:2}}>
{r.status==="confirmed"?<>
<button onClick={()=>window.open(gdLink(r.driveRef),"_blank")} style={{padding:"2px 5px",borderRadius:3,fontSize:11,fontWeight:600,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer"}}>📄</button>
<button onClick={()=>window.open(gmailLink("PZN Confirmation — "+r.product,"Product: "+r.product+"\nPZN 10g: "+r.pzn10g+"\nPZN 1kg: "+r.pzn1kg),"_blank")} style={{padding:"2px 5px",borderRadius:3,fontSize:11,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer"}}>📧</button>
</>:<>
<button onClick={()=>{const nr=prompt(lang==="de"?"PZN 10g Nummer eingeben:":"Enter PZN 10g number:");const nr2=prompt(lang==="de"?"PZN 1kg Nummer eingeben:":"Enter PZN 1kg number:");if(nr&&nr2){setPznRequests(p=>p.map((x,i)=>i===j?{...x,status:"confirmed",pzn10g:nr,pzn1kg:nr2,confirmed:new Date().toLocaleDateString("de-DE")}:x))}}} style={{padding:"2px 5px",borderRadius:3,fontSize:11,fontWeight:700,border:"1.5px solid #059669",background:"#f0fdf4",color:"#065f46",cursor:"pointer"}}>{lang==="de"?"✓ Bestätigen":"✓ Confirm"}</button>
<button onClick={()=>window.open(gdLink("pzn-pending/"+r.id),"_blank")} style={{padding:"2px 5px",borderRadius:3,fontSize:11,fontWeight:600,border:"2px dashed #d97706",background:"#fffbeb",color:"#92400e",cursor:"pointer"}}>📤</button>
</>}
</div>
</td>
</tr>)}
</tbody>
</table>
</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:4}}>{lang==="de"?"✓ Bestätigen = PZN-Nummern eingeben nach Erhalt der IFA-Bestätigung. Original in Google Drive hochladen.":"✓ Confirm = Enter PZN numbers after receiving IFA confirmation. Upload original to Google Drive."}</div>
</div>
</div>}

</Cd>
</div>};

const M1GDP=()=>{
const tabs=[{k:"overview",ic:"🚛",l:lang==="de"?"Übersicht":"Overview"},{k:"pickup",ic:"📦",l:lang==="de"?"Abholung FRA":"Pickup FRA"},{k:"transit",ic:"🌡️",l:lang==="de"?"Transit & Monitoring":"Transit & Monitoring"},{k:"delivery",ic:"🏭",l:lang==="de"?"Anlieferung Anklam":"Delivery Anklam"},{k:"docs",ic:"📋",l:lang==="de"?"GDP-Dokumente":"GDP Documents"}];

return <div>
<Cd t={"🚛 M1 — GDP: Frankfurt (FRA) → Anklam"} badge={<Bd c="#059669" b="#d1fae5">✅ {lang==="de"?"Abgeschlossen":"Complete"}</Bd>}>

<div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
{tabs.map(tb=><button key={tb.k} onClick={()=>setM1Tab(tb.k)} style={{padding:"5px 10px",borderRadius:6,fontSize:14,fontWeight:m1Tab===tb.k?700:500,border:m1Tab===tb.k?"2px solid #0891b2":"1px solid #e5e7eb",background:m1Tab===tb.k?"#ecfeff":"#fff",color:m1Tab===tb.k?"#0891b2":"#6b7280",cursor:"pointer"}}>{tb.ic} {tb.l}</button>)}
</div>

{m1Tab==="overview"&&<div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14,fontSize:16}}>
{[[lang==="de"?"Spediteur":"Carrier","WAS-Logistics GmbH, Wörth"],[lang==="de"?"Sachbearbeiter":"Ansprechpartner","Rafael Rey — +49 7271 76712-14"],["KD-Nr.","10508"],[lang==="de"?"Rechnung":"Invoice","138688 (06.11.2025)"],[lang==="de"?"Incoterms":"Incoterms","EXW Jujuy → CIF Frankfurt"],[lang==="de"?"GDP-Lizenz":"GDP License","WAS-LOG-GDP-2024-DE"],[lang==="de"?"Abfahrt FRA":"Departed FRA","15.11.2025 14:30 CET"],[lang==="de"?"Ankunft Anklam":"Arrived Anklam","15.11.2025 22:45 CET"],[lang==="de"?"Fahrzeit":"Transit Time","8h 15min"],[lang==="de"?"Temperatur":"Temperatur","16.2–23.1°C ✅ (GDP: 15–25°C)"],[lang==="de"?"Luftfeuchtigkeit":"Humidity","38–52% RH ✅"],["MKT","19.8°C (Mean Kinetic)"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
{[[lang==="de"?"Paletten":"Pallets","3","#0891b2"],[lang==="de"?"Brutto":"Gross","198.5 kg","#2563eb"],[lang==="de"?"Taxgewicht":"CW","293.0 kg","#7c3aed"],[lang==="de"?"Abweichung":"Excursion",lang==="de"?"Keine ✅":"None ✅","#059669"]].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:6,padding:8,border:"1px solid #e5e7eb"}}><div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:13,color:"#6b7280"}}>{l}</div></div>)}
</div>
</div>}

{m1Tab==="pickup"&&<div>
<div style={{fontSize:16,fontWeight:700,marginBottom:10}}>📦 {lang==="de"?"Abholung am Flughafen Frankfurt (FRA)":"Pickup at Frankfurt Airport (FRA)"}</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12,fontSize:15}}>
{[[lang==="de"?"Ankunft Fracht FRA":"Cargo arrival FRA","14.11.2025 18:30 CET"],[lang==="de"?"Zollfreigabe":"Customs Release","15.11.2025 11:45 — Zollamt Frankfurt"],[lang==="de"?"BtM-Genehmigung vorgelegt":"BtM Permit presented","✅ E-12267/2025 — verified by Zoll"],[lang==="de"?"Abholung durch":"Collected by","WAS-Logistics (GDP licensed vehicle)"],[lang==="de"?"Fahrer":"Fahrer","GDP-qualified — ID verified"],[lang==="de"?"Fahrzeug":"Fahrzeug","Temp-controlled van, GDP-qualified"],[lang==="de"?"Bewaffneter Begleitschutz":"Armed escort","✅ 2 officers — BtM escort protocol"],[lang==="de"?"Plomben-Nr.":"Seal No.","SEAL-FRA-2025-8847"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{fontSize:16,fontWeight:700,marginBottom:8}}>✅ {lang==="de"?"Abholung-Checkliste":"Pickup Checklist"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr",gap:4}}>
{[
[true,lang==="de"?"Warenidentität geprüft (3 Paletten, Medical Cannabis, 198.5 kg)":"Goods identity verified (3 pallets, Medical Cannabis, 198.5 kg)"],
[true,lang==="de"?"BtM-Einfuhrgenehmigung E-12267/2025 dem Zoll vorgelegt":"BtM Import Permit E-12267/2025 presented to customs"],
[true,lang==="de"?"Zollfreigabe erhalten — Ref.: DE-FRA-2025-BtM-0047":"Customs release obtained — Ref.: DE-FRA-2025-BtM-0047"],
[true,lang==="de"?"Verpackungsintegrität geprüft — keine Beschädigung":"Packaging integrity checked — no damage"],
[true,lang==="de"?"Sensitech Datenlogger aktiviert (3× TempTale Ultra)":"Sensitech dataloggers activated (3× TempTale Ultra)"],
[true,lang==="de"?"Temperatur bei Abholung: 19.4°C ✅":"Temperature at pickup: 19.4°C ✅"],
[true,lang==="de"?"Fahrzeug-Temperaturvorauslauf: 2h bei 20°C":"Vehicle pre-conditioning: 2h at 20°C"],
[true,lang==="de"?"Plombe angebracht: SEAL-FRA-2025-8847":"Seal applied: SEAL-FRA-2025-8847"],
[true,lang==="de"?"GPS-Tracker aktiviert":"GPS tracker activated"],
[true,lang==="de"?"Bewaffneter Begleitschutz bestätigt (2 Personen)":"Armed escort confirmed (2 officers)"],
[true,lang==="de"?"Frachtbrief unterschrieben — CMR-FRA-2025-4721":"Consignment note signed — CMR-FRA-2025-4721"],
[true,lang==="de"?"Fotos: 4 Aufnahmen (Paletten, Siegel, Fahrzeug, Logger)":"Photos: 4 shots (pallets, seal, vehicle, loggers)"]
].map(([ok,txt],j)=><div key={j} style={{display:"flex",gap:6,alignItems:"flex-start",padding:"4px 8px",background:ok?"#f0fdf4":"#fef2f2",borderRadius:4,fontSize:14}}>
<span style={{color:ok?"#059669":"#dc2626",fontWeight:700,flexShrink:0}}>{ok?"✅":"❌"}</span>
<span>{txt}</span>
</div>)}
</div>
</div>}

{m1Tab==="transit"&&<div>
<div style={{fontSize:16,fontWeight:700,marginBottom:10}}>🌡️ {lang==="de"?"Transit-Überwachung":"Transit Monitoring"}</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12,fontSize:15}}>
{[[lang==="de"?"Route":"Route","FRA Airport → A5 → A9 → A20 → Anklam"],[lang==="de"?"Distanz":"Distance","~680 km"],[lang==="de"?"Fahrzeit":"Drive time","8h 15min"],[lang==="de"?"Abfahrt":"Abfahrt","15.11.2025 14:30 CET"],[lang==="de"?"Ankunft":"Arrival","15.11.2025 22:45 CET"],[lang==="de"?"Pausen":"Stops","1× Raststätte (45 min) — vehicle locked, escort present"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{background:"#ecfeff",borderRadius:8,padding:12,marginBottom:12,border:"1px solid #a5f3fc"}}>
<div style={{fontSize:15,fontWeight:700,color:"#0891b2",marginBottom:8}}>📊 {lang==="de"?"Datenlogger-Echtzeitdaten":"Datalogger Real-Time Data"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
{[["Logger A (Pallet 1)","16.1–23.0°C / 37–52% RH","19.6°C"],["Logger B (Pallet 2)","16.4–22.8°C / 38–51% RH","19.9°C"],["Logger C (Pallet 3)","16.2–23.1°C / 37–53% RH","19.8°C"]].map(([lg,range,mkt],j)=><div key={j} style={{background:"#fff",borderRadius:6,padding:8,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,color:"#0891b2"}}>{lg}</div>
<div style={{fontSize:14,marginTop:4}}>{range}</div>
<div style={{fontSize:13,color:"#6b7280"}}>MKT: {mkt}</div>
</div>)}
</div>
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<div style={{background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>🌡️ {lang==="de"?"Temperaturverlauf":"Temperature Profile"}</div>
<div style={{height:40,background:"linear-gradient(90deg,#bfdbfe 0%,#d1fae5 15%,#d1fae5 60%,#fef3c7 80%,#d1fae5 90%,#d1fae5 100%)",borderRadius:4,position:"relative",border:"1px solid #e5e7eb"}}>
<div style={{position:"absolute",left:"12%",top:0,bottom:0,width:2,background:"#2563eb"}}/>
<div style={{position:"absolute",left:"78%",top:0,bottom:0,width:2,background:"#dc2626"}}/>
<div style={{position:"absolute",left:"12%",width:"66%",top:"45%",height:3,background:"#059669",borderRadius:2}}/>
<div style={{position:"absolute",bottom:2,left:2,fontSize:11,color:"#6b7280"}}>15°C</div>
<div style={{position:"absolute",bottom:2,right:2,fontSize:11,color:"#6b7280"}}>25°C</div>
<div style={{position:"absolute",top:2,left:"40%",fontSize:11,color:"#059669",fontWeight:700}}>GDP COMPLIANT ✅</div>
</div>
<div style={{fontSize:13,color:"#6b7280",marginTop:4}}>Min 16.2°C — Max 23.1°C — MKT 19.8°C</div>
</div>
<div style={{background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>💧 {lang==="de"?"Feuchtigkeitsverlauf":"Humidity Profile"}</div>
<div style={{height:40,background:"linear-gradient(90deg,#dbeafe 0%,#d1fae5 20%,#d1fae5 65%,#fef3c7 85%,#d1fae5 100%)",borderRadius:4,position:"relative",border:"1px solid #e5e7eb"}}>
<div style={{position:"absolute",left:"18%",top:0,bottom:0,width:2,background:"#2563eb"}}/>
<div style={{position:"absolute",left:"68%",top:0,bottom:0,width:2,background:"#d97706"}}/>
<div style={{position:"absolute",left:"18%",width:"50%",top:"45%",height:3,background:"#059669",borderRadius:2}}/>
<div style={{position:"absolute",bottom:2,left:2,fontSize:11,color:"#6b7280"}}>30%</div>
<div style={{position:"absolute",bottom:2,right:2,fontSize:11,color:"#6b7280"}}>65%</div>
<div style={{position:"absolute",top:2,left:"32%",fontSize:11,color:"#059669",fontWeight:700}}>RH COMPLIANT ✅</div>
</div>
<div style={{fontSize:13,color:"#6b7280",marginTop:4}}>Min 37% RH — Max 53% RH</div>
</div>
</div>

<div style={{marginTop:10,fontSize:14,fontWeight:700}}>🛡️ {lang==="de"?"Sicherheit während Transit":"Security During Transit"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr",gap:3,marginTop:6}}>
{[
[true,lang==="de"?"Bewaffneter Begleitschutz durchgehend (2 Personen)":"Armed escort continuous (2 officers)"],
[true,lang==="de"?"GPS-Tracking aktiv — 100% Abdeckung":"GPS tracking active — 100% coverage"],
[true,lang==="de"?"Fahrzeug-Plombe intakt bei Ankunft":"Vehicle seal intact on arrival"],
[true,lang==="de"?"Keine Routenabweichung":"No route deviation"],
[true,lang==="de"?"Pause: Fahrzeug verschlossen, Begleitschutz anwesend":"Rest stop: vehicle locked, escort present"]
].map(([ok,txt],j)=><div key={j} style={{display:"flex",gap:6,alignItems:"center",padding:"3px 8px",background:"#f0fdf4",borderRadius:4,fontSize:14}}>
<span style={{color:"#059669",fontWeight:700}}>✅</span><span>{txt}</span>
</div>)}
</div>
</div>}

{m1Tab==="delivery"&&<div>
<div style={{fontSize:16,fontWeight:700,marginBottom:10}}>🏭 {lang==="de"?"Anlieferung BtM-Tresor Anklam":"Delivery BtM Vault Anklam"}</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12,fontSize:15}}>
{[[lang==="de"?"Ankunft":"Arrival","15.11.2025 22:45 CET"],[lang==="de"?"Standort":"Location","Anklam — BtM-Quarantänezone"],[lang==="de"?"Empfangen von":"Received by","Warehouse Manager (NOC Pharma)"],[lang==="de"?"Plomben-Check":"Seal check","✅ SEAL-FRA-2025-8847 — intact"],[lang==="de"?"Temperatur bei Ankunft":"Temp. at delivery","20.1°C ✅"],[lang==="de"?"BtM-Bestand":"BtM Inventory","§13 BtMG — Eingang gebucht"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{fontSize:14,fontWeight:700,marginBottom:8}}>✅ {lang==="de"?"Anlieferungs-Checkliste":"Delivery Checklist"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr",gap:4}}>
{[
[true,lang==="de"?"Fahrzeug-Plombe geprüft — SEAL-FRA-2025-8847 intakt":"Vehicle seal verified — SEAL-FRA-2025-8847 intact"],
[true,lang==="de"?"Paletten visuell geprüft — keine Beschädigung":"Pallets visually inspected — no damage"],
[true,lang==="de"?"Stückzahl bestätigt: 3 Paletten / 7 Kartons":"Piece count confirmed: 3 pallets / 7 boxes"],
[true,lang==="de"?"Bruttogewicht geprüft: 198.5 kg ✅":"Gross weight verified: 198.5 kg ✅"],
[true,lang==="de"?"Datenlogger deaktiviert & entnommen (3× Sensitech)":"Dataloggers deactivated & removed (3× Sensitech)"],
[true,lang==="de"?"Temperatur bei Übergabe: 20.1°C ✅ (GDP-konform)":"Temperature at handover: 20.1°C ✅ (GDP compliant)"],
[true,lang==="de"?"CMR-Frachtbrief gegengezeichnet":"CMR consignment note countersigned"],
[true,lang==="de"?"BtM-Eingangsbuchung §13 BtMG":"BtM intake record §13 BtMG"],
[true,lang==="de"?"Fotos: 4 Aufnahmen (Fahrzeug, Siegel, Ware, Zone)":"Photos: 4 shots (vehicle, seal, goods, zone)"],
[true,lang==="de"?"Ware in Quarantänezone eingelagert":"Goods placed in quarantine zone"],
[true,lang==="de"?"Bewaffneter Begleitschutz abgemeldet":"Armed escort signed off"]
].map(([ok,txt],j)=><div key={j} style={{display:"flex",gap:6,alignItems:"flex-start",padding:"4px 8px",background:"#f0fdf4",borderRadius:4,fontSize:14}}>
<span style={{color:"#059669",fontWeight:700}}>✅</span><span>{txt}</span>
</div>)}
</div>
</div>}

{m1Tab==="docs"&&<div>
<div style={{fontSize:16,fontWeight:700,marginBottom:10}}>📋 {lang==="de"?"GDP-Begleitdokumente":"GDP Accompanying Documents"}</div>
{[
{ic:"📄",n:lang==="de"?"CMR-Frachtbrief":"CMR Consignment Note",ref:"CMR-FRA-2025-4721",st:"ok",desc:lang==="de"?"Internationaler Frachtbrief — unterschrieben bei Abholung & Anlieferung":"International consignment note — signed at pickup & delivery"},
{ic:"🔐",n:lang==="de"?"BtM-Transportbeleg":"BtM Transport Record",ref:"BtM-TR-2025-1147",st:"ok",desc:lang==="de"?"§13 BtMG Bestandsbewegung Frankfurt → Anklam":"§13 BtMG inventory movement Frankfurt → Anklam"},
{ic:"🌡️",n:lang==="de"?"Datenlogger-Bericht":"Datalogger Report",ref:"SEN-2025-DL-003-RPT",st:"ok",desc:lang==="de"?"Sensitech TempTale Ultra — 3 Logger, Intervall 5 Min, PDF-Export":"Sensitech TempTale Ultra — 3 loggers, 5-min interval, PDF export"},
{ic:"🛡️",n:lang==="de"?"Begleitschutz-Protokoll":"Armed Escort Protocol",ref:"ESC-FRA-ANK-2025-047",st:"ok",desc:lang==="de"?"Bewaffneter Begleitschutz (2 Personen) — Einsatzbericht":"Armed escort (2 officers) — deployment report"},
{ic:"🚛",n:lang==="de"?"Fahrzeug-Qualifizierung":"Vehicle Qualification",ref:"VEH-WAS-2025-GDP-089",st:"ok",desc:lang==="de"?"GDP-qualifiziertes Fahrzeug — Temperaturmapping, Kalibrierung":"GDP-qualified vehicle — temperature mapping, calibration"},
{ic:"📸",n:lang==="de"?"Fotodokumentation":"Photo Documentation",ref:"PHOTO-M1-BI02-2025",st:"ok",desc:lang==="de"?"8 Fotos: Abholung (4) + Anlieferung (4)":"8 photos: pickup (4) + delivery (4)"},
{ic:"🔒",n:lang==="de"?"Plomben-Protokoll":"Seal Protocol",ref:"SEAL-FRA-2025-8847",st:"ok",desc:lang==="de"?"Plomben-Nr. bei Abholung angebracht, bei Anlieferung geprüft & gebrochen":"Seal applied at pickup, verified & broken at delivery"},
{ic:"📋",n:lang==="de"?"GDP-Checkliste (SOP-201-01)":"GDP Checklist (SOP-201-01)",ref:"GDP-CHK-2025-M1-047",st:"ok",desc:lang==="de"?"Vollständige Checkliste Abholung/Transport/Anlieferung":"Complete checklist pickup/transit/delivery"}
].map((doc,j)=><div key={j} style={{display:"flex",gap:10,padding:"8px 10px",marginBottom:4,borderRadius:6,border:"1px solid #d1fae5",background:"#f0fdf4"}}>
<div style={{fontSize:22,flexShrink:0}}>{doc.ic}</div>
<div style={{flex:1}}>
<div style={{fontSize:15,fontWeight:700}}>{doc.n}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{doc.desc}</div>
</div>
<div style={{textAlign:"right",flexShrink:0}}>
<Bd c="#059669" b="#dcfce7">✅</Bd>
<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{doc.ref}</div>
</div>
</div>)}
</div>}

<div style={{marginTop:12,background:"#f0f9ff",borderRadius:6,padding:10,fontSize:14,borderLeft:"3px solid #0891b2",lineHeight:1.5}}>
<strong>{lang==="de"?"Regulatorische Grundlage":"Regulatory Basis"}:</strong> {lang==="de"
?"Transport gemäß EU GDP-Leitlinien 2013/C 343/01. Temperaturüberwachung 15–25°C mit kalibriertem Sensitech TempTale Ultra (Intervall: 5 Min). Bewaffneter Begleitschutz gemäß BtMG-Transportvorschriften. BtM-Bestandsführung §13 BtMG. Alle Dokumente 5 Jahre aufbewahren."
:"Transport per EU GDP Guidelines 2013/C 343/01. Temperature monitoring 15–25°C with calibrated Sensitech TempTale Ultra (interval: 5 min). Armed escort per BtMG transport regulations. BtM inventory management §13 BtMG. All documents retained 5 years."}
</div>
</Cd>
</div>};

// M1.5 Vault Arrival — Recount & Datalogger Extraction
const[m15Loggers,setM15Loggers]=useState({});
const m15Extract=(id)=>setM15Loggers(p=>({...p,[id]:{ts:new Date().toISOString().slice(0,19).replace("T"," "),by:"Current User"}}));

const LOGGERS=[
{id:"TL-001",box:"Pallet 1 — 1kg API bags (Box 1–5)",units:60,tMin:16.1,tMax:23.0,hMin:37,hMax:52,mkt:19.6,exc:false,readings:487},
{id:"TL-002",box:"Pallet 2 — 1kg API bags (Box 6–10)",units:49,tMin:16.4,tMax:22.8,hMin:38,hMax:51,mkt:19.9,exc:false,readings:487},
{id:"TL-003",box:"Pallet 3 — 1kg API bags (Box 11–14)",units:30,tMin:16.2,tMax:23.1,hMin:37,hMax:53,mkt:19.8,exc:false,readings:487},
{id:"TL-004",box:"Pallet 4 — 10g Doypacks (Box 15–20)",units:100,tMin:16.5,tMax:22.4,hMin:39,hMax:50,mkt:20.1,exc:false,readings:487}
];

const M15Vault=()=>{
const extracted=Object.keys(m15Loggers).length;
const allDone=extracted===LOGGERS.length;
return <div>
<Cd t={"📦 M1.5 — "+(lang==="de"?"Tresorankunft & Wareneingangskontrolle — Anklam":"Vault Arrival & Goods Receipt Inspection — Anklam")} badge={allDone?<Bd c="#059669" b="#dcfce7">✅</Bd>:<Bd c="#d97706" b="#fef3c7">{extracted}/{LOGGERS.length}</Bd>}>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14,fontSize:16}}>
{[[lang==="de"?"Ankunft":"Arrived","15.11.2025 22:45"],[lang==="de"?"Standort":"Location","Anklam — BtM-Quarantänezone"],[lang==="de"?"Spediteur":"Carrier","WAS-LOGISTICS GMBH"],["BtM "+t.status,"§13 BtMG — "+t.status+": ✅"],[lang==="de"?"Fotos":"Photos","8 (receipt evidence)"],[lang==="de"?"Eingangsprüfung":"Goods Receipt","SOP-201-01 v2.0"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{background:"#f0fdf4",borderRadius:8,padding:12,marginBottom:14,border:"1px solid #a7f3d0"}}>
<div style={{fontSize:15,fontWeight:700,color:"#065f46",marginBottom:8}}>📋 {lang==="de"?"Warennachzählung (Recount)":"Product Recount"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
{[[lang==="de"?"1kg Beutel":"1kg API bags","139/139 ✅","#059669"],[lang==="de"?"10g Doypacks":"10g Doypacks","100/100 ✅","#059669"],[lang==="de"?"Gesamt":"Total","239/239 ✅","#065f46"],[lang==="de"?"Abweichung":"Discrepancy","0 ✅","#059669"]].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:6,padding:8,textAlign:"center",border:"1px solid #d1fae5"}}><div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:13,color:"#6b7280"}}>{l}</div></div>)}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:8}}>
{[[lang==="de"?"Barcodes gescannt":"Barcodes scanned","239/239 ✅","#059669"],[lang==="de"?"Paletten":"Pallets","4","#2563eb"],[lang==="de"?"Kartons":"Boxes","20","#2563eb"],[lang==="de"?"Zustand":"Bedingung",lang==="de"?"Intakt ✅":"Intact ✅","#059669"]].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:6,padding:8,textAlign:"center",border:"1px solid #d1fae5"}}><div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:13,color:"#6b7280"}}>{l}</div></div>)}
</div>
</div>

<div style={{borderTop:"2px solid #e5e7eb",paddingTop:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:16,fontWeight:700}}>🌡️ {lang==="de"?"Datenlogger-Extraktion (aus Kartons)":"Datalogger Extraction (from boxes)"}</div>
<Bd c={allDone?"#059669":"#d97706"} b={allDone?"#dcfce7":"#fef3c7"}>{extracted}/{LOGGERS.length} {lang==="de"?"extrahiert":"extracted"}</Bd>
</div>
<div style={{fontSize:14,color:"#6b7280",marginBottom:10,fontStyle:"italic"}}>
{lang==="de"?"Datenlogger wurden aus jeder Palette entnommen und USB-Daten ausgelesen. Temperatur- und Feuchtigkeitsdaten werden für die GDP-Konformitätsprüfung archiviert."
:"Dataloggers removed from each pallet and USB data downloaded. Temperature and humidity data archived for GDP compliance verification."}
</div>

{LOGGERS.map(lg=>{const done=m15Loggers[lg.id];
return <div key={lg.id} style={{marginBottom:10,border:"1px solid "+(done?"#a7f3d0":"#e5e7eb"),borderRadius:8,overflow:"hidden",background:done?"#f0fdf4":"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 12px",background:done?"#dcfce7":"#f9fafb",borderBottom:"1px solid "+(done?"#a7f3d0":"#e5e7eb")}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:22}}>{done?"✅":"🌡️"}</span>
<div><div style={{fontSize:15,fontWeight:700}}>{lg.id} — {lg.box}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{lg.units} {lang==="de"?"Einheiten":"units"} • {lg.readings} {lang==="de"?"Messpunkte":"readings"} (1x/min)</div></div>
</div>
{!done?<button onClick={()=>m15Extract(lg.id)} style={{padding:"6px 12px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#0891b2",color:"#fff",cursor:"pointer",boxShadow:"0 1px 3px rgba(0,0,0,.12)"}}>📥 {lang==="de"?"USB auslesen":"Extract USB"}</button>
:<div style={{fontSize:13,color:"#059669"}}>📥 {done.ts}</div>}
</div>
{done&&<div style={{padding:"8px 12px"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr 1fr",gap:6}}>
{[["Min °C",lg.tMin+"°C","#2563eb"],["Max °C",lg.tMax+"°C","#dc2626"],["MKT",lg.mkt+"°C","#7c3aed"],["Min RH",lg.hMin+"%","#2563eb"],["Max RH",lg.hMax+"%","#d97706"],[lang==="de"?"Abweichung":"Excursion",lg.exc?(lang==="de"?"⚠️ JA":"⚠️ YES"):"✅ "+( lang==="de"?"Keine":"None"),lg.exc?"#dc2626":"#059669"]].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:4,padding:4,border:"1px solid #e5e7eb"}}><div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:12,color:"#6b7280"}}>{l}</div></div>)}
</div>
<div style={{marginTop:6,display:"flex",gap:6}}>
<div style={{flex:1,height:32,background:"linear-gradient(90deg,#bfdbfe 0%,#dbeafe 20%,#fef3c7 50%,#fecaca 80%,#fecaca 100%)",borderRadius:4,position:"relative",border:"1px solid #e5e7eb"}}>
<div style={{position:"absolute",left:"15%",top:0,bottom:0,width:2,background:"#2563eb"}}/>
<div style={{position:"absolute",left:"72%",top:0,bottom:0,width:2,background:"#dc2626"}}/>
<div style={{position:"absolute",left:"15%",width:"57%",top:"40%",height:3,background:"#059669",borderRadius:2}}/>
<div style={{position:"absolute",bottom:1,left:2,fontSize:11,color:"#6b7280"}}>15°C</div>
<div style={{position:"absolute",bottom:1,right:2,fontSize:11,color:"#6b7280"}}>25°C</div>
<div style={{position:"absolute",top:1,left:"42%",fontSize:11,color:"#059669",fontWeight:700}}>GDP ✅</div>
</div>
<div style={{flex:1,height:32,background:"linear-gradient(90deg,#dbeafe 0%,#d1fae5 40%,#fef3c7 70%,#fecaca 100%)",borderRadius:4,position:"relative",border:"1px solid #e5e7eb"}}>
<div style={{position:"absolute",left:"20%",top:0,bottom:0,width:2,background:"#2563eb"}}/>
<div style={{position:"absolute",left:"65%",top:0,bottom:0,width:2,background:"#d97706"}}/>
<div style={{position:"absolute",left:"20%",width:"45%",top:"40%",height:3,background:"#059669",borderRadius:2}}/>
<div style={{position:"absolute",bottom:1,left:2,fontSize:11,color:"#6b7280"}}>30%</div>
<div style={{position:"absolute",bottom:1,right:2,fontSize:11,color:"#6b7280"}}>65%</div>
<div style={{position:"absolute",top:1,left:"35%",fontSize:11,color:"#059669",fontWeight:700}}>RH ✅</div>
</div>
</div>
</div>}
</div>})}
</div>

{allDone&&<div style={{marginTop:10,padding:12,background:"linear-gradient(135deg,#dcfce7,#d1fae5)",borderRadius:8,border:"1px solid #a7f3d0"}}>
<div style={{fontSize:16,fontWeight:800,color:"#065f46",textAlign:"center"}}>✅ {lang==="de"?"ALLE DATENLOGGER AUSGELESEN — GDP-TRANSPORT KONFORM":"ALL DATALOGGERS EXTRACTED — GDP TRANSPORT COMPLIANT"}</div>
<div style={{fontSize:14,color:"#065f46",textAlign:"center",marginTop:4}}>{lang==="de"?"Gesamtbereich: 16.1–23.1°C / 37–53% RH • MKT Ø 19.8°C • Keine Abweichungen • 4×487 = 1,948 Messpunkte archiviert":"Overall range: 16.1–23.1°C / 37–53% RH • MKT avg 19.8°C • No excursions • 4×487 = 1,948 data points archived"}</div>
</div>}

<div style={{marginTop:10,background:"#f0f9ff",borderRadius:6,padding:10,fontSize:14,borderLeft:"3px solid #059669",lineHeight:1.5}}>
<strong>{lang==="de"?"Verfahren":"Procedure"}:</strong> {lang==="de"
?"Beim Wareneingang werden alle Kartons geöffnet, Produkte nachgezählt und Barcodes gescannt. USB-Datenlogger werden aus jeder Palette entnommen und am PC ausgelesen (SOP-201-01). Temperatur- und Feuchtigkeitsdaten werden als PDF/CSV exportiert und im Chargendossier archiviert. Bei Abweichungen (>25°C oder <15°C) wird sofort eine Abweichung eröffnet."
:"Upon goods receipt, all boxes are opened, products recounted and barcodes scanned. USB dataloggers are removed from each pallet and downloaded at PC station (SOP-201-01). Temperature and humidity data exported as PDF/CSV and archived in batch dossier. Any excursion (>25°C or <15°C) triggers immediate deviation report."}
</div>

{/* ═══════ QSI SAMPLE DISPATCH PROTOCOL ═══════ */}
<div style={{marginTop:16,background:"linear-gradient(135deg,#eff6ff,#f0f9ff)",borderRadius:10,padding:14,border:"2px solid #3b82f6"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:15,fontWeight:800,color:"#1e40af"}}>🔬 {lang==="de"?"Probenahme & Versand an QSI Bremen":"Probenahme- und Versandprotokoll — QSI Bremen"}</div>
<Bd c="#1e40af" b="#dbeafe">SOP-202-01 v1.0</Bd>
</div>

{/* Sample Details */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
{[
[lang==="de"?"Probentyp":"Probenart","10g Doypacks (Rückstellmuster/QC)"],
[lang==="de"?"Anzahl":"Menge","14 × 10g = 140g total"],
[lang==="de"?"Entnommen aus":"Entnommen aus","Pallet 4 — 10g Doypacks (Box 15–20)"],
[lang==="de"?"Probenahme durch":"Entnommen von","C. Hamelink (RP)"],
[lang==="de"?"Datum/Uhrzeit":"Date/Time",new Date().toLocaleDateString("de-DE")+" — "+new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})],
[lang==="de"?"Probenstatus":"Sample Status",lang==="de"?"Quarantäne → QSI":"Quarantine → QSI"],
["Ref.","SAMP-"+(selBatch||"BI02")+"-"+new Date().getFullYear()],
[lang==="de"?"Verbleibend im Tresor":"Remaining in Vault","86 × 10g Doypacks"],
[lang==="de"?"Produkt":"Product",BT.p+" ("+BT.id+")"]
].map(([l,v],j)=><div key={j} style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #dbeafe"}}>
<div style={{fontSize:12,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div>
<div style={{fontSize:14,fontWeight:700,color:"#1e3a5f"}}>{v}</div>
</div>)}
</div>

{/* GDP Shipping Container */}
<div style={{background:"#fff",borderRadius:8,padding:12,marginBottom:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:15,fontWeight:700,color:"#374151",marginBottom:8}}>📦 {lang==="de"?"GDP-konformer Versandbehälter":"GDP-Konform Shipping Container"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
{[
[lang==="de"?"Behältertyp":"Container Type","Styrofoam insulated box + Coolpack"],
[lang==="de"?"Temperaturbereich":"Temperature Range","15–25°C (GDP 2013/C 343/01)"],
[lang==="de"?"Datenlogger beigelegt":"Datalogger Enclosed","TL-SAMP-001 (Sensitech TempTale)"],
[lang==="de"?"Versiegelung":"Seal","BtM-Siegel Nr. SEAL-"+(selBatch||"BI02")+"-QSI"],
["GDP "+t.status,"✅ "+( lang==="de"?"Qualifizierter Behälter (SOP-703)":"Qualified container (SOP-703)")],
[lang==="de"?"Gewicht":"Gewicht","~450g (14×10g + Verpackung)"]
].map(([l,v],j)=><div key={j} style={{display:"flex",gap:6,alignItems:"flex-start"}}>
<span style={{fontSize:13,fontWeight:600,color:"#6b7280",minWidth:120}}>{l}:</span>
<span style={{fontSize:14,fontWeight:600,color:"#1f2937"}}>{v}</span>
</div>)}
</div>
</div>

{/* Internal Courier */}
<div style={{background:"#fff",borderRadius:8,padding:12,marginBottom:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:15,fontWeight:700,color:"#374151",marginBottom:8}}>🚐 {lang==="de"?"Interner GDP-Kurier":"Internal GDP Courier"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
{[
[lang==="de"?"Kurierdienst":"Kurierdienst","NOC Pharma — Interner GDP-Transport"],
[lang==="de"?"Fahrer":"Fahrer",lang==="de"?"[Name eintragen]":"[Enter name]"],
[lang==="de"?"Fahrzeug":"Fahrzeug","GDP-qualified (SOP-780)"],
[lang==="de"?"Route":"Route","Anklam (Tresor) → QSI Bremen"],
[lang==="de"?"Entfernung":"Distance","~350 km / ~4h"],
[lang==="de"?"Abfahrt geplant":"Departure planned",new Date().toLocaleDateString("de-DE")],
["BtM "+t.transferDoc,"§13 BtMG — Transfer within company"],
[lang==="de"?"Empfänger":"Recipient","QSI GmbH Bremen — Pia (Labor)"],
[lang==="de"?"QSI Adresse":"QSI Address","Flughafendamm 9a, 28199 Bremen"]
].map(([l,v],j)=><div key={j}>
<div style={{fontSize:12,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div>
<div style={{fontSize:14,fontWeight:600,color:"#1f2937"}}>{v}</div>
</div>)}
</div>
</div>

{/* QSI Lab Destination */}
<div style={{background:"#f0fdf4",borderRadius:8,padding:12,marginBottom:10,border:"1px solid #a7f3d0"}}>
<div style={{fontSize:15,fontWeight:700,color:"#065f46",marginBottom:6}}>🔬 QSI GmbH Bremen — {lang==="de"?"Auftragsanalytik":"Contract Testing"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:14}}>
{[
[lang==="de"?"Ansprechpartnerin":"Ansprechpartner","Pia — QSI Bremen"],
[lang==="de"?"Auftragsnummer":"Auftragsnr.","210-1624923"],
[lang==="de"?"Prüfumfang":"Pruefumfang","Ph.Eur. Cannabis flos monograph"],
[lang==="de"?"Prüfungen":"Pruefungen","Potency (HPLC), Micro (TAMC/TYMC), Heavy Metals, Mycotoxins, Pesticides, Moisture, Terpenes"],
[lang==="de"?"Erwartete Dauer":"Expected Duration","10–14 working days"],
[lang==="de"?"Ergebnisse an":"Ergebnisse an","Dr. O. Schagon (QP) + C. Hamelink (RP)"]
].map(([l,v],j)=><div key={j}>
<span style={{fontWeight:600,color:"#6b7280"}}>{l}: </span>
<span style={{fontWeight:600,color:"#065f46"}}>{v}</span>
</div>)}
</div>
</div>

{/* Action Buttons */}
<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
<button onClick={()=>{
const w=window.open("","_blank","width=800,height=900");
const sRef="SAMP-"+(selBatch||"BI02")+"-"+new Date().getFullYear();
const sDate=new Date().toLocaleDateString("de-DE");
const seal="SEAL-"+(selBatch||"BI02")+"-QSI";
const batchId=BT.id;
const prod=BT.p;
w.document.write('<html><head><title>Probenahme- und Versandprotokoll</title><style>body{font-family:Arial,sans-serif;padding:30px;color:#1f2937;font-size:12px}h1{font-size:18px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:6px}h2{font-size:14px;color:#374151;margin-top:16px;border-bottom:1px solid #e5e7eb;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin:8px 0}td{padding:5px 8px;border:1px solid #d1d5db}td:first-child{font-weight:700;background:#f9fafb;width:35%}.banner{background:#1e40af;color:#fff;padding:14px 30px;margin:-30px -30px 20px;display:flex;justify-content:space-between;align-items:center;font-size:11px}.sig{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:30px}.sig>div{border-top:1px solid #000;padding-top:4px;text-align:center;font-size:10px}.ft{margin-top:20px;border-top:1px solid #d1d5db;padding-top:8px;font-size:9px;color:#9ca3af;text-align:center}@media print{body{padding:20px}.banner{margin:-20px -20px 20px}}</style></head><body>');
w.document.write('<div class="banner"><div><strong style="font-size:15px">NOC Pharma GmbH</strong><br/>Probenahme- und Versandprotokoll</div><div style="text-align:right">'+sDate+'<br/>Ref.: '+sRef+'</div></div>');
w.document.write('<h1>Probenahme- und Versandprotokoll / Probenahme- und Versandprotokoll</h1>');
w.document.write('<h2>1. Probenidentifikation / Sample Identification</h2><table>');
[["Ref.",sRef],["Charge",batchId],["Product",prod],["Probenart","10g Doypacks"],["Menge","14 x 10g = 140g"],["Entnommen aus","Pallet 4 Box 15-20"],["Entnommen von","C. Hamelink (RP)"],["Datum",sDate],["Verbleibend","86 x 10g Doypacks"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});
w.document.write('</table><h2>2. GDP Versandbehaelter / Shipping Container</h2><table>');
[["Behaelter","Styrofoam insulated box + Coolpack"],["Temperatur","15-25C (GDP 2013/C 343/01)"],["Datenlogger","TL-SAMP-001 (Sensitech TempTale)"],["BtM-Siegel",seal],["Qualifizierung","SOP-703 qualified"],["Gewicht","ca. 450g"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});
w.document.write('</table><h2>3. Transport / Internal GDP Courier</h2><table>');
[["Kurierdienst","NOC Pharma Internal GDP Transport"],["Route","Anklam (Vault) to QSI Bremen (ca. 350 km)"],["Fahrer","_________________________"],["Fahrzeug","GDP-qualified (SOP-780)"],["Abfahrt",sDate],["BtM-Transfer","Par. 13 BtMG within company"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});
w.document.write('</table><h2>4. Empfaenger / Destination Lab</h2><table>');
[["Labor","QSI GmbH Bremen"],["Ansprechpartner","Pia"],["Adresse","Flughafendamm 9a, 28199 Bremen"],["Auftragsnr.","210-1624923"],["Pruefumfang","Ph.Eur. Cannabis flos monograph"],["Pruefungen","Potency, Micro, Heavy Metals, Mycotoxins, Pesticides, Moisture, Terpenes"],["Voraussichtlich","10-14 working days"],["Ergebnisse an","Dr. O. Schagon (QP) + C. Hamelink (RP)"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});
w.document.write('</table><div class="sig"><div>Probenahme / Entnommen von<br/><br/><br/>C. Hamelink (RP)</div><div>Versand freigegeben / Versand genehmigt<br/><br/><br/>________________________</div><div>Empfangen bei QSI / Empfangen bei QSI<br/><br/><br/>Pia (QSI Bremen)</div></div>');
w.document.write('<div class="ft">NOC Pharma GmbH - Im Camisch 14 - 07768 Kahla - QMS v2.5 - '+new Date().toISOString()+'</div></body></html>');
w.document.close();setTimeout(function(){w.print()},500);
}} style={{flex:1,padding:"10px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="#fff" strokeWidth="1.5"/></svg>
{lang==="de"?"Probenahmeprotokoll drucken (PDF)":"Print Sample Protocol (PDF)"}
</button>

<button onClick={()=>{
const sRef="SAMP-"+(selBatch||"BI02")+"-"+new Date().getFullYear();
const sep="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
const body="NOC PHARMA GmbH\nProbenahme- und Versandprotokoll · QMS v2.5\n"+sep+"\n\nRef.: "+sRef+"\nCharge: "+BT.id+"\nProduct: "+BT.p+"\n\nPROBE:\n14 × 10g Doypacks = 140g total\nSampled from Pallet 4 (Box 15–20)\nEntnommen von: C. Hamelink (RP)\n\nVERSAND:\nGDP insulated box + Coolpack (15–25°C)\nDatalogger: TL-SAMP-001\nBtM Seal: SEAL-"+(selBatch||"BI02")+"-QSI\nRoute: Anklam → QSI Bremen (~350 km)\nInternal GDP courier (SOP-780)\n\nPRUEFUMFANG:\nPh.Eur. Cannabis flos monograph\nPotency, Micro, Heavy Metals, Mycotoxins, Pesticides, Moisture, Terpenes\nOrder: 210-1624923\nExpected: 10–14 working days\n\n"+sep+"\nNOC Pharma GmbH · QMS v2.5\nRP: C. Hamelink · QP: T. Cuny";
window.open(gmailLink("NOC Pharma — Probenversand an QSI Bremen — "+sRef+" — Batch "+(selBatch||"BI02"),body)+"&to="+encodeURIComponent("pia@qsi-gmbh.de")+"&cc="+encodeURIComponent("schagon@noc-pharma.de"),"_blank");
}} style={{flex:1,padding:"10px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg>
{lang==="de"?"An QSI Bremen senden (Pia)":"Send to QSI Bremen (Pia)"}
</button>

<button onClick={()=>window.open(gdLink("M1.5"),"_blank")} style={{padding:"10px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"1px solid #bae6fd",background:"#eff6ff",color:"#1a73e8",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="#1a73e8"/></svg>
{lang==="de"?"In Drive speichern":"Save to Drive"}
</button>
</div>

<div style={{marginTop:8,fontSize:13,color:"#6b7280",fontStyle:"italic"}}>
{lang==="de"
?"⚠️ BtM-Hinweis: Probenversand innerhalb des Unternehmens gemäß §13 BtMG. Dokumentation im BtM-Buch erforderlich. Retourmuster nach Analyse an NOC Pharma zurückführen."
:"⚠️ BtM Note: Sample dispatch within company per §13 BtMG. Documentation in BtM register required. Return samples to NOC Pharma after analysis."}
</div>
</div>
</Cd>
</div>};

// M3.5 GDP Transport with Signature Approval
const[m35Sigs,setM35Sigs]=useState({celso:null,torsten:null});
const m35Sign=(k)=>setM35Sigs(p=>({...p,[k]:{ts:new Date().toISOString().slice(0,19).replace("T"," "),hash:"SHA256:"+Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("").toUpperCase()}}));
const m35Done=m35Sigs.celso&&m35Sigs.torsten;

const M35GDP=()=><div>
<Cd t={"🚛 M3.5 — GDP: Anklam → Kahla"} badge={m35Done?<Bd c="#059669" b="#dcfce7">✅</Bd>:<Bd c="#d97706" b="#fef3c7">✍️</Bd>}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14,fontSize:16}}>
{[[lang==="de"?"Spediteur":"Carrier","NOC Pharma GDP (own fleet)"],[lang==="de"?"Abfahrt":"Departed","13.12.2025 08:00"],[lang==="de"?"Ankunft":"Arrived","13.12.2025 15:30"],[lang==="de"?"Temperatur":"Temperatur","17.0–22.5°C ✅ (GDP: 15–25°C)"],[lang==="de"?"GPS-Tracking":"GPS","✅ Active — Continuous"],[lang==="de"?"Luftfeuchtigkeit":"Humidity","41–49% RH ✅"],["MKT","20.1°C"],[lang==="de"?"Zonenumbuchung":"Zone Transfer",lang==="de"?"Quarantäne → Kommerziell":"Quarantine → Commercial"],[lang==="de"?"Transportauftrag":"Transport Req.","TR-NOC-2025-0089"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{background:"#f0fdfa",borderRadius:8,padding:12,marginBottom:14,border:"1px solid #99f6e4"}}>
<div style={{fontSize:14,fontWeight:700,color:"#0d9488",marginBottom:6}}>📊 {lang==="de"?"Datenlogger-Zusammenfassung":"Datalogger Summary"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,fontSize:15}}>
{[["Logger ID","TL-2025-0341","#0d9488"],["Min Temp","17.0°C","#2563eb"],["Max Temp","22.5°C","#dc2626"],[lang==="de"?"Abweichung":"Excursion",lang==="de"?"Keine":"None ✅","#059669"]].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:6,padding:6,border:"1px solid #e5e7eb"}}><div style={{fontSize:15,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:13,color:"#6b7280"}}>{l}</div></div>)}
</div>
</div>

<div style={{borderTop:"2px solid #e5e7eb",paddingTop:14,marginBottom:10}}>
<div style={{fontSize:16,fontWeight:700,marginBottom:10}}>✍️ {lang==="de"?"Transportgenehmigung — Unterschriften (DocuSign)":"Transport Authorization — Signatures (DocuSign)"}</div>

{[
{k:"celso",name:"Celso Hamelink",role:lang==="de"?"GDP-Beauftragter / Logistikleiter":"GDP Officer / Logistics Manager",desc:lang==="de"?"Bestätigt: GDP-Transport konform, Datenlogger geprüft, Fahrzeug qualifiziert, Ware übergeben":"Confirms: GDP transport compliant, datalogger verified, vehicle qualified, goods dispatched",ic:"🚛",c:"#0d9488"},
{k:"torsten",name:"Torsten Cuny",role:lang==="de"?"Verantwortliche Person gemäß §52a AMG":"Responsible Person per §52a AMG",desc:lang==="de"?"Genehmigt: Zonentransfer Quarantäne → Kommerziell, BtM-Bestandsumbuchung §13 BtMG":"Approves: Zone transfer Quarantine → Commercial, BtM inventory reclassification §13 BtMG",ic:"✍️",c:"#0369a1",primary:true}
].map(sig=>{const signed=m35Sigs[sig.k];
return <div key={sig.k} style={{display:"flex",gap:12,padding:14,marginBottom:8,borderRadius:8,border:sig.primary?"2px solid #0369a1":"1px solid "+(signed?"#a7f3d0":"#e5e7eb"),background:signed?"#f0fdf4":sig.primary?"#f0f9ff":"#fff"}}>
<div style={{width:44,height:44,borderRadius:"50%",background:signed?"#dcfce7":sig.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{signed?"✅":sig.ic}</div>
<div style={{flex:1}}>
<div style={{fontSize:15,fontWeight:700}}>{sig.name} {sig.primary&&<Bd c="#0369a1" b="#dbeafe">{lang==="de"?"§52a AMG":"§52a AMG"}</Bd>}</div>
<div style={{fontSize:15,color:"#6b7280",fontWeight:500}}>{sig.role}</div>
<div style={{fontSize:14,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{sig.desc}</div>
{signed&&<div style={{marginTop:5,fontSize:14,padding:"3px 8px",background:"#dcfce7",borderRadius:4,display:"inline-block"}}>✅ {signed.ts} • {signed.hash} • eIDAS Art. 25</div>}
</div>
{!signed&&<button onClick={()=>m35Sign(sig.k)} style={{padding:"8px 14px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:sig.primary?"#0369a1":sig.c,color:"#fff",cursor:"pointer",alignSelf:"center",whiteSpace:"nowrap",boxShadow:"0 2px 4px rgba(0,0,0,.12)"}}>✍️ {lang==="de"?"Unterschreiben":"Sign"}</button>}
</div>})}

{m35Done&&<div style={{padding:12,background:"linear-gradient(135deg,#dcfce7,#d1fae5)",borderRadius:8,border:"1px solid #a7f3d0",textAlign:"center",marginTop:6}}>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>✅ {lang==="de"?"TRANSPORT AUTORISIERT":"TRANSPORT AUTHORIZED"}</div>
<div style={{fontSize:14,color:"#065f46",marginTop:3}}>{lang==="de"?"Beide Unterschriften erhalten. GDP-Transport abgeschlossen. Ware an Kahla übergeben.":"Both signatures collected. GDP transport completed. Goods delivered to Kahla."}</div>
</div>}
{!m35Done&&<div style={{padding:8,background:"#fffbeb",borderRadius:6,border:"1px solid #fde68a",fontSize:14,color:"#92400e",marginTop:6}}>⚠️ {Object.values(m35Sigs).filter(Boolean).length}/2 {lang==="de"?"unterschrieben":"signed"}</div>}
</div>
</Cd>
</div>;

// M4 Relabeling — Label Image Comparison
const[m4Imgs,setM4Imgs]=useState({
"1kg_orig":null,"1kg_new":null,"10g_orig":null,"10g_new":null
});
const m4Upload=(slot)=>setM4Imgs(p=>({...p,[slot]:{ts:new Date().toISOString().slice(0,19).replace("T"," "),by:"Current User"}}));
const[m4Sigs,setM4Sigs]=useState({celso:null,qp:null});
const m4Sign=(k)=>setM4Sigs(p=>({...p,[k]:{ts:new Date().toISOString().slice(0,19).replace("T"," "),hash:"SHA256:"+Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("").toUpperCase()}}));
const m4AllSigned=m4Sigs.celso&&m4Sigs.qp;

const M4Relabel=()=>{
const products=[
{k:"1kg",de:"Cannabis flos 1kg (API-Beutel)",en:"Cannabis flos 1kg (API bag)",qty:139,format:"LDPE bag",pzn:"PZN-18547632"},
{k:"10g",de:"Cannabis flos 10g (Doypack)",en:"Cannabis flos 10g (Doypack)",qty:100,format:"Doypack",pzn:"PZN-18547633"}
];
return <Cd t={"🏷️ M4 — "+(lang==="de"?"Umetikettierung — Kahla Im Camisch 14":"Relabeling — Kahla Im Camisch 14")} badge={<Bd c="#059669" b="#d1fae5">✓</Bd>}>

{/* THC Correction Alert — shown when THC protocol was initiated */}
{(thcProto.piaNotified||thcProto.pznRequested)&&<div style={{marginBottom:12,padding:10,background:"#fef3c7",borderRadius:8,border:"2px solid #fbbf24"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
<span style={{fontSize:16}}>⚠️</span>
<div style={{fontSize:15,fontWeight:700,color:"#92400e"}}>{lang==="de"?"THC-Korrektur aktiv — Neue Etiketten erforderlich":"THC Correction Active — New Labels Required"}</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,fontSize:14}}>
<div><span style={{color:"#6b7280"}}>{lang==="de"?"Alter THC-Wert":"Old THC"}:</span> <strong>18.9%</strong></div>
<div><span style={{color:"#6b7280"}}>{lang==="de"?"Neuer THC-Wert (QSI)":"New THC (QSI)"}:</span> <strong style={{color:"#dc2626"}}>{thcProto.newThc||"—"}%</strong></div>
<div><span style={{color:"#6b7280"}}>{lang==="de"?"Grund":"Grund"}:</span> <strong>{thcProto.reason||"THC discrepancy"}</strong></div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:8,fontSize:13}}>
<div style={{display:"flex",alignItems:"center",gap:4}}>
{thcProto.piaNotified?<span style={{color:"#059669"}}>✅</span>:<span style={{color:"#dc2626"}}>⏳</span>}
<span>{lang==="de"?"Geändertes COA von Pia (QSI)":"Amended COA from Pia (QSI)"}</span>
</div>
<div style={{display:"flex",alignItems:"center",gap:4}}>
{thcProto.pznRequested?<span style={{color:"#059669"}}>✅</span>:<span style={{color:"#dc2626"}}>⏳</span>}
<span>{lang==="de"?"Neue PZN von IFA":"New PZN from IFA"}</span>
</div>
</div>
<div style={{marginTop:8,fontSize:13,color:"#92400e",fontStyle:"italic"}}>
{lang==="de"?"Alle Etiketten müssen mit dem korrigierten THC-Wert und der neuen PZN-Nummer neu gedruckt werden.":"All labels must be reprinted with the corrected THC value and new PZN number."}
</div>
</div>}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14,fontSize:16}}>
{[["PZN","PZN-18547632"],[lang==="de"?"Etiketten":"Labels","239 (139×1kg + 100×10g)"],[lang==="de"?"Abgeschlossen":"Completed","18.12.2025"],[lang==="de"?"Standort":"Location","Kahla Im Camisch 14"],["SOP","SOP-710-01 v3.0"],[lang==="de"?"Inhalt":"Content","Product, Batch, PZN, THC%, Expiry, Barcode"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

{products.map(prod=>{const origK=prod.k+"_orig";const newK=prod.k+"_new";const origImg=m4Imgs[origK];const newImg=m4Imgs[newK];
return <div key={prod.k} style={{marginBottom:16,border:"1px solid #e5e7eb",borderRadius:8,overflow:"hidden"}}>
<div style={{padding:"8px 12px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><strong style={{fontSize:16}}>{prod[lang]}</strong><span style={{fontSize:14,color:"#6b7280",marginLeft:8}}>{prod.qty}× {prod.format}</span></div>
<Bd c="#9333ea" b="#f3e8ff">{prod.pzn}</Bd>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
<div style={{padding:12,borderRight:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,color:"#dc2626",marginBottom:8,display:"flex",alignItems:"center",gap:4}}>🇦🇷 {lang==="de"?"Original Import-Etikett":"Original Import Label"} <Bd c="#dc2626" b="#fee2e2">{lang==="de"?"VOR":"BEFORE"}</Bd></div>
{origImg?<div>
<div style={{height:120,background:"linear-gradient(135deg,#fee2e2,#fef3c7)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6,border:"2px solid #fca5a5"}}>
<div style={{textAlign:"center"}}><div style={{fontSize:28}}>🏷️</div><div style={{fontSize:13,color:"#dc2626",fontWeight:600}}>Cannava Original Label</div><div style={{fontSize:12,color:"#6b7280"}}>{prod.k==="1kg"?"Cannabis flos — Lote BI-02":"Cannabis flos — 10g"}</div></div>
</div>
<div style={{fontSize:13,color:"#6b7280"}}>📷 {origImg.ts} • {origImg.by}</div>
</div>
:<div onClick={()=>m4Upload(origK)} style={{height:120,border:"2px dashed #fca5a5",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#fef2f2"}}>
<div style={{textAlign:"center",color:"#dc2626"}}><div style={{fontSize:24}}>📤</div><div style={{fontSize:14,fontWeight:600}}>{lang==="de"?"Original-Etikett hochladen":"Upload original label"}</div><div style={{fontSize:13,color:"#6b7280"}}>{lang==="de"?"Foto des Lieferanten-Etiketts":"Photo of supplier label"}</div></div>
</div>}
</div>
<div style={{padding:12}}>
<div style={{fontSize:14,fontWeight:700,color:"#059669",marginBottom:8,display:"flex",alignItems:"center",gap:4}}>🇩🇪 {lang==="de"?"Neues NOC-Etikett":"New NOC Label"} <Bd c="#059669" b="#dcfce7">{lang==="de"?"NACH":"AFTER"}</Bd></div>
{newImg?<div>
<div style={{height:120,background:"linear-gradient(135deg,#dcfce7,#d1fae5)",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:6,border:"2px solid #a7f3d0"}}>
<div style={{textAlign:"center"}}><div style={{fontSize:28}}>🏷️</div><div style={{fontSize:13,color:"#059669",fontWeight:600}}>NOC Pharma Label</div><div style={{fontSize:12,color:"#6b7280"}}>{prod.pzn} • {BT.id}</div><div style={{fontSize:11,color:"#6b7280"}}>THC 19.7% • Exp {BT.exp}</div></div>
</div>
<div style={{fontSize:13,color:"#6b7280"}}>📷 {newImg.ts} • {newImg.by}</div>
</div>
:<div onClick={()=>m4Upload(newK)} style={{height:120,border:"2px dashed #a7f3d0",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#f0fdf4"}}>
<div style={{textAlign:"center",color:"#059669"}}><div style={{fontSize:24}}>📤</div><div style={{fontSize:14,fontWeight:600}}>{lang==="de"?"Neues Etikett hochladen":"Upload new label"}</div><div style={{fontSize:13,color:"#6b7280"}}>{lang==="de"?"Foto des NOC-Etiketts mit PZN":"Photo of NOC label with PZN"}</div></div>
</div>}
</div>
</div>
</div>})}

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:10}}>
{[[lang==="de"?"Fotos gesamt":"Total photos",(Object.values(m4Imgs).filter(Boolean).length)+"/4","#9333ea"],[lang==="de"?"1kg Beutel":"1kg bags","139×","#2563eb"],[lang==="de"?"10g Doypacks":"10g Doypacks","100×","#d97706"],[lang==="de"?"Barcodes":"Barcodes","239 ✅","#059669"]].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:6,border:"1px solid #e5e7eb",padding:8,textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:13,color:"#6b7280"}}>{l}</div></div>)}
</div>

<div style={{borderTop:"2px solid #e5e7eb",paddingTop:14,marginTop:10,marginBottom:10}}>
<div style={{fontSize:16,fontWeight:700,marginBottom:10}}>✍️ {lang==="de"?"Umetikettierungsfreigabe — Unterschriften (DocuSign)":"Relabeling Release — Signatures (DocuSign)"}</div>

{[
{k:"celso",name:"Celso Hamelink",role:lang==="de"?"Betriebsleiter / Verantwortliche Person Umetikettierung":"Operations Manager / Responsible Person Relabeling",desc:lang==="de"?"Bestätigt: 239 Etiketten korrekt angebracht, Fotos archiviert, PZN/Barcode/THC/Verfall geprüft, SOP-710-01 eingehalten":"Confirms: 239 labels correctly applied, photos archived, PZN/barcode/THC/expiry verified, SOP-710-01 followed",ic:"🏷️",c:"#9333ea"},
{k:"qp",name:"Dr. Olaf Schagon",role:lang==="de"?"Sachkundige Person (QP) gemäß §15 AMG":"Qualified Person (QP) per §15 AMG",desc:lang==="de"?"Genehmigt: Umetikettierung konform mit EU-GMP Annex 16, Etiketteninhalt geprüft, Charge für Lagerung/Vertrieb freigegeben":"Approves: Relabeling compliant with EU-GMP Annex 16, label content verified, batch cleared for storage/distribution",ic:"🔬",c:"#16a34a",primary:true}
].map(sig=>{const signed=m4Sigs[sig.k];
return <div key={sig.k} style={{display:"flex",gap:12,padding:14,marginBottom:8,borderRadius:8,border:sig.primary?"2px solid #16a34a":"1px solid "+(signed?"#a7f3d0":"#e5e7eb"),background:signed?"#f0fdf4":sig.primary?"#f0fdf4":"#fff"}}>
<div style={{width:44,height:44,borderRadius:"50%",background:signed?"#dcfce7":sig.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{signed?"✅":sig.ic}</div>
<div style={{flex:1}}>
<div style={{fontSize:15,fontWeight:700}}>{sig.name} {sig.primary&&<Bd c="#16a34a" b="#dcfce7">QP §15 AMG</Bd>}</div>
<div style={{fontSize:15,color:"#6b7280",fontWeight:500}}>{sig.role}</div>
<div style={{fontSize:14,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{sig.desc}</div>
{signed&&<div style={{marginTop:5,fontSize:14,padding:"3px 8px",background:"#dcfce7",borderRadius:4,display:"inline-block"}}>✅ {signed.ts} • {signed.hash} • eIDAS Art. 25</div>}
</div>
{!signed&&<button onClick={()=>m4Sign(sig.k)} style={{padding:"8px 14px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:sig.primary?"#16a34a":sig.c,color:"#fff",cursor:"pointer",alignSelf:"center",whiteSpace:"nowrap",boxShadow:"0 2px 4px rgba(0,0,0,.12)"}}>✍️ {lang==="de"?"Unterschreiben":"Sign"}</button>}
</div>})}

{m4AllSigned&&<div style={{padding:12,background:"linear-gradient(135deg,#f3e8ff,#ede9fe)",borderRadius:8,border:"1px solid #c4b5fd",textAlign:"center",marginBottom:6}}>
<div style={{fontSize:15,fontWeight:800,color:"#5b21b6"}}>✅ {lang==="de"?"UMETIKETTIERUNG ABGESCHLOSSEN & FREIGEGEBEN":"RELABELING COMPLETE & RELEASED"}</div>
<div style={{fontSize:14,color:"#5b21b6",marginTop:3}}>{lang==="de"?"Beide Unterschriften erhalten. 239 Einheiten freigegeben für Lagerung M4.5.":"Both signatures collected. 239 units released for storage M4.5."}</div>
</div>}
{!m4AllSigned&&<div style={{padding:8,background:"#fffbeb",borderRadius:6,border:"1px solid #fde68a",fontSize:14,color:"#92400e",marginBottom:6}}>⚠️ {Object.values(m4Sigs).filter(Boolean).length}/2 {lang==="de"?"unterschrieben. Umetikettierung muss vor Lagerung freigegeben werden.":"signed. Relabeling must be released before storage."}</div>}
</div>

<div style={{background:"#f0f9ff",borderRadius:6,padding:10,fontSize:14,borderLeft:"3px solid #9333ea",lineHeight:1.5}}>
<strong>{lang==="de"?"Etikettierungsanforderungen":"Labeling Requirements"}:</strong> {lang==="de"
?"Jedes Etikett muss enthalten: Produktname, Chargennummer, PZN, THC-Gehalt (%), Verfallsdatum, eindeutiger Barcode, NOC Pharma GmbH Adresse, Lagerhinweise. Fotos der Original- und Neu-Etiketten werden als Nachweis archiviert (SOP-710-01 v3.0)."
:"Each label must include: Product name, batch number, PZN, THC content (%), expiry date, unique barcode, NOC Pharma GmbH address, storage instructions. Photos of original and new labels are archived as evidence (SOP-710-01 v3.0)."}
</div>
</Cd>};

// M4.5 Storage — QR Scan, Box Assignment & Dispatch Readiness
const boxCfg=[
{id:"BOX-001",type:"1kg",cap:20},{id:"BOX-002",type:"1kg",cap:20},{id:"BOX-003",type:"1kg",cap:20},
{id:"BOX-004",type:"1kg",cap:20},{id:"BOX-005",type:"1kg",cap:20},{id:"BOX-006",type:"1kg",cap:20},
{id:"BOX-007",type:"1kg",cap:19},{id:"BOX-008",type:"10g",cap:50},{id:"BOX-009",type:"10g",cap:50}
];
const[bxState,setBxState]=useState({activeBox:0,units:{},signed:[],lastScan:null,scanning:false,synced:null,transfer:{}});
const[xferSigs,setXferSigs]=useState([]);
const[boxes,setBoxes]=useState([]);
const[newBox,setNewBox]=useState({size:"1kg",qty:""});
const[boxSigned,setBoxSigned]=useState([]);
const M45Storage=()=>{
const totalUnits=239,bags1kg=139,doy10g=100;
const ab=bxState.activeBox;
const getBoxUnits=(id)=>(bxState.units[id]||[]);
const totalScanned=Object.values(bxState.units).reduce((s,a)=>s+a.length,0);
const allBoxesFull=totalScanned>=totalUnits;
const allSigned=bxState.signed.length>=boxCfg.length;
const curBox=boxCfg[ab]||null;
const curBoxUnits=curBox?getBoxUnits(curBox.id):[];
const curBoxFull=curBox?curBoxUnits.length>=curBox.cap:true;

const scanUnit=()=>{
if(!curBox||curBoxFull)return;
const prefix=curBox.type==="1kg"?"BI-02-1KG-":"BI-02-10G-";
const seq=String(curBoxUnits.length+1).padStart(4,"0");
const code=prefix+seq;
setBxState(p=>{
const existing=p.units[curBox.id]||[];
const nu={...p.units,[curBox.id]:[...existing,{code,ts:new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}]};
const isFull=nu[curBox.id].length>=curBox.cap;
return{...p,units:nu,lastScan:code,activeBox:isFull&&p.activeBox<boxCfg.length-1?p.activeBox+1:p.activeBox};
});
};

const scanAll=()=>{
const nu={};
boxCfg.forEach(b=>{
const prefix=b.type==="1kg"?"BI-02-1KG-":"BI-02-10G-";
const arr=[];
for(let u=0;u<b.cap;u++){arr.push({code:prefix+String(u+1).padStart(4,"0"),ts:new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})});}
nu[b.id]=arr;
});
setBxState(p=>({...p,units:nu,activeBox:boxCfg.length-1,lastScan:"ALL"}));
};

return <div>
<Cd t={"📦 M4.5 "+(lang==="de"?"Lagerung & Versandvorbereitung":"Storage & Dispatch Readiness")+" — Kahla"} badge={allSigned?<Bd c="#059669" b="#d1fae5">✓ {lang==="de"?"Versandbereit":"Dispatch Ready"}</Bd>:<Bd c="#ea580c" b="#fff7ed">{totalScanned}/{totalUnits}</Bd>}>

{/* Progress overview */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:14}}>
{[[lang==="de"?"Gescannt":"Scanned",totalScanned+"/"+totalUnits,totalScanned>=totalUnits?"#059669":"#ea580c"],[lang==="de"?"Aktive Box":"Active Box",curBox?curBox.id:"—","#7c3aed"],[lang==="de"?"Boxen voll":"Boxes Full",boxCfg.filter(b=>getBoxUnits(b.id).length>=b.cap).length+"/"+boxCfg.length,"#0891b2"],[lang==="de"?"Signiert":"Signed",bxState.signed.length+"/"+boxCfg.length,allSigned?"#059669":"#6b7280"]].map(([l,v,c],j)=>
<div key={j} style={{textAlign:"center",background:"#f9fafb",borderRadius:8,padding:8,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:12,color:"#6b7280",fontWeight:600}}>{l}</div>
</div>)}
</div>

{/* Scan progress bar */}
<div style={{marginBottom:14}}>
<div style={{height:10,background:"#f3f4f6",borderRadius:5,overflow:"hidden"}}>
<div style={{height:"100%",background:allBoxesFull?"#16a34a":"linear-gradient(90deg,#ea580c,#f97316)",borderRadius:5,transition:"width .3s",width:(totalScanned/totalUnits*100)+"%"}}/>
</div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#6b7280",marginTop:3}}>
<span>0</span><span>{bags1kg} (1kg)</span><span>{totalUnits}</span>
</div>
</div>

{/* Scan controls */}
{!allBoxesFull&&<div style={{display:"flex",gap:8,marginBottom:14}}>
<button onClick={scanUnit} style={{flex:1,padding:"14px",borderRadius:8,fontSize:15,fontWeight:700,border:"2px solid #ea580c",background:"linear-gradient(135deg,#fff7ed,#ffedd5)",color:"#c2410c",cursor:curBoxFull?"not-allowed":"pointer",opacity:curBoxFull?.5:1}}>
📱 {lang==="de"?"Einheit scannen":"Scan Unit"} → {curBox?curBox.id:""}
</button>
<button onClick={scanUnit} style={{padding:"14px 20px",borderRadius:8,fontSize:22,fontWeight:700,border:"2px solid #ea580c",background:"#ea580c",color:"#fff",cursor:"pointer"}}>
+5
</button>
<button onClick={scanAll} style={{padding:"14px 16px",borderRadius:8,fontSize:15,fontWeight:700,border:"2px solid #7c3aed",background:"#f5f3ff",color:"#6d28d9",cursor:"pointer"}}>
⚡ {lang==="de"?"Alle scannen":"Scan All"}
</button>
</div>}

{/* Last scan indicator */}
{bxState.lastScan&&bxState.lastScan!=="ALL"&&<div style={{background:"#fefce8",borderRadius:6,padding:8,marginBottom:14,display:"flex",alignItems:"center",gap:8,border:"1px solid #fde68a"}}>
<span style={{fontSize:16}}>📱</span>
<div style={{flex:1}}>
<span style={{fontSize:15,fontWeight:700,color:"#854d0e"}}>{lang==="de"?"Letzter Scan":"Last Scan"}: </span>
<span style={{fontSize:16,fontWeight:800,color:"#ea580c",fontFamily:"monospace"}}>{bxState.lastScan}</span>
<span style={{fontSize:14,color:"#6b7280"}}> → {curBox?curBox.id:boxCfg[ab-1]?.id}</span>
</div>
</div>}

{/* Box grid */}
<div style={{fontSize:16,fontWeight:700,marginBottom:8}}>📦 {lang==="de"?"Boxen":"Boxes"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
{boxCfg.map((box,j)=>{
const units=getBoxUnits(box.id);
const full=units.length>=box.cap;
const isSigned=bxState.signed.includes(box.id);
const isActive=j===ab&&!allBoxesFull;
const pct=box.cap>0?(units.length/box.cap*100):0;
return <div key={j} onClick={()=>{if(!allBoxesFull)setBxState(p=>({...p,activeBox:j}))}} style={{borderRadius:10,border:"2px solid "+(isSigned?"#16a34a":isActive?"#ea580c":full?"#d97706":"#e5e7eb"),background:isSigned?"#f0fdf4":isActive?"#fff7ed":"#fff",padding:10,cursor:"pointer",position:"relative",transition:"all .2s"}}>
{isSigned&&<div style={{position:"absolute",top:-6,right:-6,background:"#16a34a",color:"#fff",borderRadius:"50%",width:20,height:20,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700}}>✓</div>}
{isActive&&!isSigned&&<div style={{position:"absolute",top:-6,left:-6,background:"#ea580c",color:"#fff",borderRadius:4,padding:"1px 5px",fontSize:12,fontWeight:700}}>ACTIVE</div>}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
<div style={{fontSize:16,fontWeight:800,color:isSigned?"#065f46":isActive?"#c2410c":"#374151"}}>{box.id}</div>
<div style={{fontSize:13,fontWeight:700,color:full?"#059669":"#6b7280"}}>{units.length}/{box.cap}</div>
</div>
<div style={{height:5,background:"#f3f4f6",borderRadius:3,overflow:"hidden",marginBottom:4}}>
<div style={{height:"100%",background:isSigned?"#16a34a":full?"#059669":"#ea580c",borderRadius:3,transition:"width .3s",width:pct+"%"}}/>
</div>
<div style={{fontSize:13,color:"#6b7280"}}>{box.type==="1kg"?"1kg API Bags":"10g Doypacks"}</div>
{full&&!isSigned&&<button onClick={(e)=>{e.stopPropagation();setBxState(p=>({...p,signed:[...p.signed,box.id]}))}} style={{marginTop:6,width:"100%",padding:"6px",borderRadius:5,fontSize:14,fontWeight:700,border:"1.5px solid #16a34a",background:"#f0fdf4",color:"#065f46",cursor:"pointer"}}>✍️ {lang==="de"?"Box signieren & versiegeln":"Sign & Seal Box"}</button>}
{isSigned&&<div style={{marginTop:4,fontSize:13,color:"#059669",fontWeight:600,textAlign:"center"}}>✅ {lang==="de"?"Versiegelt":"Sealed"}</div>}
</div>})}
</div>

{/* Sign all boxes button */}
{allBoxesFull&&!allSigned&&<button onClick={()=>setBxState(p=>({...p,signed:boxCfg.map(b=>b.id)}))} style={{width:"100%",padding:"14px",borderRadius:8,fontSize:15,fontWeight:700,border:"2px solid #16a34a",background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",color:"#065f46",cursor:"pointer",marginBottom:14}}>
✍️ {lang==="de"?"Alle Boxen signieren & versiegeln":"Sign & Seal All Boxes"} ({boxCfg.length})
</button>}

{/* Dispatch ready banner */}
{allSigned&&<div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",borderRadius:10,padding:16,border:"2px solid #16a34a"}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
<div style={{width:50,height:50,borderRadius:"50%",background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🚀</div>
<div>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>{lang==="de"?"VERSANDBEREIT":"DISPATCH READY"}</div>
<div style={{fontSize:14,color:"#065f46"}}>{totalUnits} {lang==="de"?"Einheiten in":"units in"} {boxCfg.length} {lang==="de"?"Boxen — bereit für Apotheken & Großhändler":"boxes — ready for pharmacies & wholesalers"}</div>
</div>
</div>
<div style={{background:"#fff",borderRadius:8,padding:10,border:"1px solid #d1fae5",marginBottom:10}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,fontSize:14}}>
{boxCfg.map((box,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 8px",background:"#f0fdf4",borderRadius:4,border:"1px solid #d1fae5"}}>
<span style={{fontWeight:700}}>{box.id}</span>
<span style={{color:"#059669"}}>✅ {getBoxUnits(box.id).length}× {box.type}</span>
</div>)}
</div>
</div>
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
<button style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>📋 {lang==="de"?"Packliste drucken":"Print Packing List"}</button>
<button style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>📧 {lang==="de"?"Bestandsmeldung":"Inventory Report"}</button>
<button style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#7c3aed",color:"#fff",cursor:"pointer"}}>🏷️ {lang==="de"?"Box-Etiketten":"Box Labels"}</button>
</div>
</div>}

{/* Transfer of Goods — Celso → Dominik */}
{allSigned&&<div style={{marginTop:14,borderTop:"2px solid #e5e7eb",paddingTop:14}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:16}}>🤝</span> {lang==="de"?"Warenübergabe & Übertragung an Lagerverwaltung":"Transfer of Goods to Storage Management"}
</div>

<div style={{background:"linear-gradient(135deg,#faf5ff,#f3e8ff)",borderRadius:10,padding:16,border:"2px solid #7c3aed",marginBottom:12}}>
<div style={{fontSize:15,color:"#6b21a8",lineHeight:1.5,marginBottom:12}}>{lang==="de"
?"Übergabe der freigegebenen Charge BI-02 (239 Einheiten in 9 Boxen) von Operations an die Lagerverwaltung. Nach Unterzeichnung übernimmt die Lagerverwaltung die volle Verantwortung für Lagerung, Bestellabwicklung und Versand an Apotheken und Großhändler."
:"Transfer of released batch BI-02 (239 units in 9 boxes) from Operations to Storage Management. Upon signing, Storage Management assumes full responsibility for warehousing, order fulfillment, and dispatch to pharmacies and wholesalers."}</div>

<div style={{background:"#fff",borderRadius:8,padding:12,border:"1px solid #e9d5ff",marginBottom:12}}>
<div style={{fontSize:14,fontWeight:700,color:"#7c3aed",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="de"?"Übergabedetails":"Transfer Details"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:15}}>
{[
[lang==="de"?"Charge":"Charge","BI-02-NOCB1.1-INF-F"],
[lang==="de"?"Produkt":"Product","NOC SE 19 Cannabis flos (T22/1)"],
[lang==="de"?"Einheiten":"Units","239 (139×1kg + 100×10g)"],
[lang==="de"?"Boxen":"Boxes","9 (BOX-001 – BOX-009)"],
[lang==="de"?"QP-Freigabe":"QP Release","CGZ-2025-0047 ✅"],
[lang==="de"?"Lagerort":"Storage Location","Kahla, Im Camisch 14"],
[lang==="de"?"Zielbereich":"Target Zone","Commercial Storage (BtM-Lager)"],
[lang==="de"?"Bestandsapp":"Inventory App","Base44 — Sync pending"]
].map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #f3e8ff"}}>
<span style={{color:"#6b7280",fontWeight:600}}>{l}</span>
<span style={{fontWeight:700,color:"#374151"}}>{v}</span>
</div>)}
</div>
</div>

{/* Signature 1: Celso Hamelink — Releasing */}
{[
{k:"celso",name:"Celso Hamelink",role:lang==="de"?"Operations Manager / Verantwortliche Person §52a AMG":"Operations Manager / Responsible Person §52a AMG",action:lang==="de"?"ÜBERGABE — Übergibt Charge an Lagerverwaltung":"HANDOVER — Releases batch to Storage Management",confirms:lang==="de"?"Bestätigt: 239 Einheiten in 9 Boxen gezählt, QR-Codes verifiziert, QP-Freigabe CGZ-2025-0047 erteilt, BtM-Bestandsübertragung gemäß §13 BtMG dokumentiert, Ware versandbereit.":"Confirms: 239 units in 9 boxes counted, QR codes verified, QP release CGZ-2025-0047 granted, BtM inventory transfer per §13 BtMG documented, goods ready for dispatch.",color:"#059669",ic:"🟢",primary:false,email:"celso@noc-pharma.de"},
{k:"dominik",name:"Dominik Delacher",role:lang==="de"?"Lagerverwaltung / Storage Manager":"Storage Manager / Warehouse Manager",action:lang==="de"?"ÜBERNAHME — Übernimmt Verantwortung für Lagerung & Versand":"ACCEPTANCE — Assumes responsibility for storage & dispatch",confirms:lang==="de"?"Bestätigt: 239 Einheiten in 9 Boxen empfangen, Zustand geprüft, QR-Codes stichprobenartig gescannt, Einlagerung in BtM-Lager Kahla, Bestandsführung in Base44 Inventar-App aktiv, bereit für Apothekenbestellungen.":"Confirms: 239 units in 9 boxes received, condition inspected, QR codes spot-checked, stored in BtM warehouse Kahla, inventory tracking in Base44 Inventory App active, ready for pharmacy orders.",color:"#ea580c",ic:"🟠",primary:true,email:"dominik@noc-pharma.de"}
].map(sig=>{
const signed=bxState.transfer[sig.k];
return <div key={sig.k} style={{display:"flex",gap:12,padding:14,marginBottom:8,borderRadius:8,border:sig.primary?"2px solid #7c3aed":"1px solid "+(signed?"#a7f3d0":"#e9d5ff"),background:signed?"#f0fdf4":sig.primary?"#faf5ff":"#fff"}}>
<div style={{width:48,height:48,borderRadius:"50%",background:signed?"#dcfce7":sig.color+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:signed?20:24,flexShrink:0,border:"2px solid "+(signed?"#16a34a":sig.color)}}>{signed?"✅":sig.ic}</div>
<div style={{flex:1}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div>
<div style={{fontSize:15,fontWeight:800,color:signed?"#065f46":"#1e293b"}}>{sig.name}</div>
<div style={{fontSize:14,color:"#6b7280"}}>{sig.role}</div>
</div>
{sig.primary&&!signed&&<span style={{fontSize:12,padding:"2px 8px",borderRadius:4,background:"#7c3aed",color:"#fff",fontWeight:700}}>PRIMARY</span>}
</div>
<div style={{fontSize:14,fontWeight:700,color:sig.primary?"#6d28d9":"#374151",marginTop:4}}>{sig.action}</div>
<div style={{fontSize:14,color:"#6b7280",marginTop:4,lineHeight:1.4,background:"#f9fafb",borderRadius:4,padding:6}}>{sig.confirms}</div>
{!signed&&<button onClick={()=>setBxState(p=>({...p,transfer:{...p.transfer,[sig.k]:{ts:new Date().toISOString().slice(0,19).replace("T"," "),hash:"SHA256:"+Math.random().toString(16).slice(2,10).toUpperCase()}}}))} style={{marginTop:8,padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:sig.primary?"linear-gradient(135deg,#7c3aed,#9333ea)":"linear-gradient(135deg,#059669,#10b981)",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
✍️ {lang==="de"?"DocuSign senden an "+sig.email:"Send DocuSign to "+sig.email}
</button>}
{signed&&<div style={{marginTop:6,display:"flex",gap:8,alignItems:"center",fontSize:14}}>
<span style={{color:"#059669",fontWeight:700}}>✅ {lang==="de"?"Signiert":"Signed"}: {signed.ts}</span>
<span style={{color:"#6b7280"}}>{signed.hash}</span>
<span style={{color:"#6b7280"}}>eIDAS Art. 25</span>
</div>}
</div>
</div>})}

{/* Both signed = transfer complete */}
{bxState.transfer.celso&&bxState.transfer.dominik&&<div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",borderRadius:10,padding:16,border:"2px solid #16a34a",marginTop:8}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
<div style={{width:50,height:50,borderRadius:"50%",background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🤝</div>
<div>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>{lang==="de"?"WARENÜBERGABE ABGESCHLOSSEN":"TRANSFER OF GOODS COMPLETE"}</div>
<div style={{fontSize:14,color:"#065f46"}}>{lang==="de"
?"Dominik Delacher (Lagerverwaltung) hat die volle Verantwortung für 239 Einheiten in 9 Boxen übernommen. Lagerung, Bestellungen & Versand über Base44 Inventar-App."
:"Dominik Delacher (Storage Manager) has assumed full responsibility for 239 units in 9 boxes. Storage, orders & dispatch via Base44 Inventory App."}</div>
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,fontSize:14}}>
{[
[lang==="de"?"Übergeben von":"Handed over by","Celso Hamelink","#059669"],
[lang==="de"?"Übernommen von":"Accepted by","Dominik Delacher","#ea580c"],
[lang==="de"?"Einheiten":"Units","239 in 9 Boxen","#7c3aed"],
["BtM §13",lang==="de"?"Übertragung dokumentiert":"Transfer documented","#0891b2"]
].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:6,padding:6,border:"1px solid #d1fae5"}}>
<div style={{fontWeight:700,color:c}}>{v}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{l}</div>
</div>)}
</div>
</div>}
</div>
</div>}

{/* Base44 Inventory App Integration — after transfer */}
{allSigned&&bxState.transfer.celso&&bxState.transfer.dominik&&<div style={{marginTop:14,borderTop:"2px solid #e5e7eb",paddingTop:14}}>
<div style={{fontSize:16,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:16}}>🔗</span> {lang==="de"?"Base44 Inventar-App Synchronisation":"Base44 Inventory App Sync"}
</div>

<div style={{background:"linear-gradient(135deg,#eff6ff,#dbeafe)",borderRadius:10,padding:14,border:"2px solid #3b82f6",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
<div style={{width:44,height:44,borderRadius:10,background:"#fff",border:"2px solid #3b82f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>📊</div>
<div style={{flex:1}}>
<div style={{fontSize:15,fontWeight:800,color:"#1e40af"}}>{lang==="de"?"Bestandsdaten an Base44 übertragen":"Sync Inventory Data to Base44"}</div>
<div style={{fontSize:14,color:"#3b82f6"}}>{lang==="de"?"Lager, Bestellungen & Versand in Echtzeit verwalten":"Manage storage, orders & shipping in real-time"}</div>
</div>
</div>

<div style={{background:"#fff",borderRadius:8,padding:10,border:"1px solid #bfdbfe",marginBottom:10}}>
<div style={{fontSize:14,fontWeight:700,color:"#1e40af",marginBottom:6}}>{lang==="de"?"Zu übertragende Daten":"Data to Sync"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:14}}>
{[
[lang==="de"?"Charge":"Charge","BI-02-NOCB1.1-INF-F","#374151"],
[lang==="de"?"Produkt":"Product","NOC SE 19 Cannabis flos","#374151"],
[lang==="de"?"Gesamt Einheiten":"Total Units",totalUnits+" units","#059669"],
[lang==="de"?"Boxen":"Boxes",boxCfg.length+" ("+bags1kg+"×1kg + "+doy10g+"×10g)","#7c3aed"],
["PZN 1kg","PZN-18547632","#0891b2"],
["PZN 10g","PZN-18547633","#0891b2"],
[lang==="de"?"QR-Codes":"QR Codes",totalUnits+" unique serial codes","#ea580c"],
[lang==="de"?"Lagerort":"Storage","Kahla, Im Camisch 14","#059669"],
["THC","22.1% (T22/1)","#dc2626"],
[lang==="de"?"Verfallsdatum":"Expiry","11/2027","#d97706"],
[lang==="de"?"QP-Freigabe":"QP Release","CGZ-2025-0047 ✅","#16a34a"],
[lang==="de"?"BtM-Status":"BtM Status","Anlage III BtMG ✅","#7c3aed"]
].map(([l,v,c],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",background:"#f8fafc",borderRadius:4,border:"1px solid #e2e8f0"}}>
<span style={{color:"#6b7280",fontWeight:600}}>{l}</span>
<span style={{fontWeight:700,color:c}}>{v}</span>
</div>)}
</div>
</div>

<div style={{background:"#fff",borderRadius:8,padding:10,border:"1px solid #bfdbfe",marginBottom:10}}>
<div style={{fontSize:14,fontWeight:700,color:"#1e40af",marginBottom:6}}>{lang==="de"?"Box-Inventar für Base44":"Box Inventory for Base44"}</div>
<div style={{fontSize:14}}>
{boxCfg.map((box,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 0",borderBottom:j<boxCfg.length-1?"1px solid #f1f5f9":"none"}}>
<span style={{fontWeight:800,color:"#1e40af",width:60}}>{box.id}</span>
<span style={{color:"#6b7280",flex:1}}>{box.cap}× {box.type==="1kg"?"1kg API Bags (PZN-18547632)":"10g Doypacks (PZN-18547633)"}</span>
<span style={{fontWeight:700,color:"#059669"}}>✅</span>
</div>)}
</div>
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<button onClick={()=>setBxState(p=>({...p,synced:"full"}))} style={{padding:"12px",borderRadius:8,fontSize:16,fontWeight:700,border:"2px solid #3b82f6",background:bxState.synced?"#f0fdf4":"#fff",color:bxState.synced?"#065f46":"#1e40af",cursor:"pointer"}}>
{bxState.synced?"✅ "+(lang==="de"?"Synchronisiert":"Synced"):"🔄 "+(lang==="de"?"Vollständig synchronisieren":"Full Sync to Base44")}
</button>
<button style={{padding:"12px",borderRadius:8,fontSize:16,fontWeight:700,border:"2px solid #059669",background:"#f0fdf4",color:"#065f46",cursor:"pointer"}}>
📤 {lang==="de"?"JSON/CSV exportieren":"Export JSON/CSV"}
</button>
</div>
</div>

{bxState.synced&&<div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",borderRadius:10,padding:14,border:"2px solid #16a34a"}}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
<div style={{fontSize:22}}>✅</div>
<div>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>{lang==="de"?"BASE44 SYNCHRONISIERT":"BASE44 SYNCED"}</div>
<div style={{fontSize:14,color:"#065f46"}}>{lang==="de"?"Alle Bestandsdaten live in Base44 Inventar-App verfügbar":"All inventory data live in Base44 Inventory App"}</div>
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,fontSize:14}}>
{[
[lang==="de"?"Einheiten":"Units",totalUnits+" synced","#059669"],
[lang==="de"?"Boxen":"Boxes",boxCfg.length+" mapped","#3b82f6"],
["QR Codes",totalUnits+" linked","#7c3aed"]
].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:4,padding:6,border:"1px solid #d1fae5"}}>
<div style={{fontWeight:700,color:c}}>{v}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{l}</div>
</div>)}
</div>
<div style={{marginTop:8,fontSize:14,color:"#065f46",lineHeight:1.5}}>
{lang==="de"
?"Base44 kann jetzt: Bestellungen von Apotheken empfangen → Boxen für Versand zuweisen → Lieferscheine generieren → BtM-Abgabebelege erstellen → Bestand in Echtzeit aktualisieren"
:"Base44 can now: Receive pharmacy orders → Assign boxes for shipping → Generate delivery notes → Create BtM dispensing records → Update inventory in real-time"}
</div>
</div>}
</div>}

{/* Transfer of Goods — Celso Hamelink → Dominik Delacher */}
{allSigned&&<div style={{marginTop:14,borderTop:"2px solid #e5e7eb",paddingTop:14}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:16}}>🤝</span> {lang==="de"?"Warenübergabe & Verantwortungsübertragung":"Transfer of Goods & Responsibility"}
</div>

<div style={{background:"linear-gradient(135deg,#faf5ff,#f3e8ff)",borderRadius:10,padding:16,border:"2px solid #9333ea",marginBottom:12}}>
<div style={{fontSize:16,fontWeight:700,color:"#6b21a8",marginBottom:10}}>{lang==="de"?"Übergabeprotokoll — Handelsware":"Transfer Protocol — Commercial Goods"}</div>

<div style={{background:"#fff",borderRadius:8,padding:12,border:"1px solid #e9d5ff",marginBottom:12}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:15}}>
{[
[lang==="de"?"Charge":"Charge","BI-02-NOCB1.1-INF-F"],
[lang==="de"?"Produkt":"Product","NOC SE 19 Cannabis flos (T22/1)"],
[lang==="de"?"Gesamteinheiten":"Total Units","239 (139×1kg + 100×10g)"],
[lang==="de"?"Boxen":"Boxes","9 boxes sealed & signed"],
[lang==="de"?"Lagerort":"Storage Location","Kahla, Im Camisch 14"],
[lang==="de"?"Zone":"Zone","Commercial (ex-Quarantine)"],
[lang==="de"?"QP-Freigabe":"QP Release","CGZ-2025-0047 ✅ Dr. Schagon"],
[lang==="de"?"BtM-Status":"BtM Status","Anlage III BtMG — §13 registered"]
].map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:"1px solid #f3e8ff"}}>
<span style={{color:"#6b7280",fontWeight:600}}>{l}</span>
<span style={{fontWeight:700,color:"#374151"}}>{v}</span>
</div>)}
</div>
</div>

{/* Transfer arrow */}
<div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:12,alignItems:"center",marginBottom:14}}>
<div style={{background:"#fff",borderRadius:10,padding:14,border:"2px solid #059669",textAlign:"center"}}>
<div style={{width:48,height:48,borderRadius:"50%",background:"#059669",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"#fff",margin:"0 auto 8px"}}>CH</div>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>Celso Hamelink</div>
<div style={{fontSize:13,color:"#059669",fontWeight:600}}>Operations Manager</div>
<div style={{fontSize:13,color:"#6b7280"}}>Responsible Person §52a AMG</div>
<div style={{fontSize:12,color:"#9ca3af",marginTop:4}}>{lang==="de"?"Übergabe von":"Handing over"}</div>
</div>

<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
<div style={{fontSize:28}}>→</div>
<div style={{fontSize:12,color:"#6b7280",fontWeight:600,textAlign:"center"}}>{lang==="de"?"WARENÜBERGABE":"GOODS TRANSFER"}</div>
<div style={{fontSize:12,color:"#9ca3af",textAlign:"center"}}>239 units / 9 boxes</div>
</div>

<div style={{background:"#fff",borderRadius:10,padding:14,border:"2px solid #ea580c",textAlign:"center"}}>
<div style={{width:48,height:48,borderRadius:"50%",background:"#ea580c",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:700,color:"#fff",margin:"0 auto 8px"}}>DD</div>
<div style={{fontSize:15,fontWeight:800,color:"#9a3412"}}>Dominik Delacher</div>
<div style={{fontSize:13,color:"#ea580c",fontWeight:600}}>Storage Manager</div>
<div style={{fontSize:13,color:"#6b7280"}}>Warehouse Kahla</div>
<div style={{fontSize:12,color:"#9ca3af",marginTop:4}}>{lang==="de"?"Übernahme von":"Receiving"}</div>
</div>
</div>

{/* Signature blocks */}
<div style={{fontSize:15,fontWeight:700,color:"#6b21a8",marginBottom:8}}>✍️ {lang==="de"?"DocuSign Unterschriften":"DocuSign Signatures"}</div>

{[
{k:"celso",name:"Celso Hamelink",role:"Operations Manager / Responsible Person §52a AMG",
desc:lang==="de"
?"Ich bestätige die Übergabe von 239 Einheiten (9 Boxen) an die Lagerverwaltung. Alle Einheiten sind QR-gescannt, verifiziert und versiegelt. Die Bestandsdaten wurden an Base44 synchronisiert. BtM-Bestandsführung gemäß §13 BtMG aktualisiert."
:"I confirm the handover of 239 units (9 boxes) to warehouse management. All units QR-scanned, verified, and sealed. Inventory data synced to Base44. BtM inventory per §13 BtMG updated.",
primary:false,color:"#059669"},
{k:"dominik",name:"Dominik Delacher",role:"Storage Manager / Warehouse Kahla",
desc:lang==="de"
?"Ich bestätige den Empfang von 239 Einheiten (9 Boxen), Charge BI-02. Alle Boxen versiegelt und QR-Codes verifiziert. Ware in Base44 Inventar-App registriert. Lagerung gemäß GDP 15–25°C. Bereit für Bestellungen von Apotheken und Großhändlern."
:"I confirm receipt of 239 units (9 boxes), batch BI-02. All boxes sealed and QR codes verified. Goods registered in Base44 Inventory App. Storage per GDP 15–25°C. Ready for pharmacy and wholesaler orders.",
primary:true,color:"#ea580c"}
].map(sig=>{
const signed=xferSigs.includes(sig.k);
return <div key={sig.k} style={{display:"flex",gap:12,padding:14,marginBottom:8,borderRadius:8,border:sig.primary?"2px solid "+sig.color:"1px solid "+(signed?"#a7f3d0":"#e9d5ff"),background:signed?"#f0fdf4":sig.primary?"rgba(234,88,12,0.03)":"#fff"}}>
<div style={{width:44,height:44,borderRadius:"50%",background:signed?"#059669":sig.color+"20",border:"2px solid "+(signed?"#059669":sig.color),display:"flex",alignItems:"center",justifyContent:"center",fontSize:signed?18:14,flexShrink:0}}>{signed?"✓":"✍️"}</div>
<div style={{flex:1}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
<div>
<div style={{fontSize:15,fontWeight:700,color:signed?"#065f46":"#1e293b"}}>{sig.name}</div>
<div style={{fontSize:13,color:sig.color,fontWeight:600}}>{sig.role}</div>
</div>
{sig.primary&&<span style={{fontSize:12,padding:"2px 6px",borderRadius:4,background:sig.color,color:"#fff",fontWeight:700}}>PRIMARY</span>}
</div>
<div style={{fontSize:14,color:"#6b7280",lineHeight:1.5,marginBottom:8}}>{sig.desc}</div>
{!signed&&<button onClick={()=>setXferSigs(p=>[...p,sig.k])} style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:sig.color,color:"#fff",cursor:"pointer"}}>
📧 {lang==="de"?"An DocuSign senden":"Send to DocuSign"} — {sig.name.split(" ")[0].toLowerCase()}@noc-pharma.de
</button>}
{signed&&<div style={{display:"flex",alignItems:"center",gap:8}}>
<div style={{fontSize:13,color:"#059669",fontWeight:600}}>✅ {lang==="de"?"Signiert":"Signed"}: {new Date().toLocaleDateString("de-DE")} {new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})}</div>
<div style={{fontSize:12,color:"#9ca3af"}}>SHA256:{Math.random().toString(16).slice(2,10).toUpperCase()} • eIDAS Art. 25</div>
</div>}
</div>
</div>})}

{xferSigs.length>=2&&<div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",borderRadius:10,padding:16,border:"2px solid #16a34a",marginTop:10}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
<div style={{width:50,height:50,borderRadius:"50%",background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26}}>🤝</div>
<div>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>{lang==="de"?"ÜBERGABE ABGESCHLOSSEN":"TRANSFER COMPLETE"}</div>
<div style={{fontSize:14,color:"#065f46"}}>{lang==="de"
?"239 Einheiten von Celso Hamelink an Dominik Delacher übergeben. Ware in Base44 registriert. Bereit für Apothekenbestellungen."
:"239 units transferred from Celso Hamelink to Dominik Delacher. Goods registered in Base44. Ready for pharmacy orders."}</div>
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,fontSize:14}}>
{[
[lang==="de"?"Übergeben von":"From","Celso Hamelink","#059669"],
[lang==="de"?"Übernommen von":"To","Dominik Delacher","#ea580c"],
["Base44","✅ Synced","#3b82f6"],
["BtM §13","✅ Updated","#7c3aed"]
].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:4,padding:6,border:"1px solid #d1fae5"}}>
<div style={{fontWeight:700,color:c}}>{v}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{l}</div>
</div>)}
</div>
</div>}
</div>
</div>}

{/* Step 5: Storage QC & X-Sense STH51 Continuous Monitoring */}
{allSigned&&<div style={{marginTop:14,borderTop:"2px solid #e5e7eb",paddingTop:14}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:16}}>🌡️</span> {lang==="de"?"Lagerüberwachung — X-Sense STH51":"Storage Monitoring — X-Sense STH51"}</div>
<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:8,height:8,borderRadius:"50%",background:"#22c55e",animation:"pulse 2s infinite"}}/><span style={{fontSize:13,color:"#059669",fontWeight:600}}>LIVE</span><span style={{fontSize:13,color:"#6b7280"}}>Updated 2 min ago</span></div>
</div>

{/* Sensor cards */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
{[["STH51-A","Lager Kahla Zone A",19.8,44,true],["STH51-B","Lager Kahla Zone B",20.1,42,true],["STH51-C","Lager Kahla Zone C",19.5,45,true]].map(([id,zone,temp,hum,ok],j)=>
<div key={j} style={{background:"#fff",borderRadius:8,padding:10,border:"1.5px solid "+(ok?"#d1fae5":"#fecaca")}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{fontSize:13,fontWeight:700,color:"#374151"}}>{id}</div>
<div style={{width:6,height:6,borderRadius:"50%",background:ok?"#22c55e":"#ef4444"}}/>
</div>
<div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>{zone}</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
<div><div style={{fontSize:22,fontWeight:800,color:temp>=15&&temp<=25?"#059669":"#dc2626"}}>{temp}°C</div><div style={{fontSize:12,color:"#6b7280"}}>GDP 15–25°C</div></div>
<div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:700,color:hum>=30&&hum<=65?"#2563eb":"#dc2626"}}>{hum}%</div><div style={{fontSize:12,color:"#6b7280"}}>RH 30–65%</div></div>
</div>
</div>)}
</div>

{/* Live stats row */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginBottom:10}}>
{[["MKT","19.8°C","#059669"],[lang==="de"?"Min (30T)":"Min (30d)","17.2°C","#059669"],[lang==="de"?"Max (30T)":"Max (30d)","22.1°C","#059669"],[lang==="de"?"Abweichungen":"Excursions","0 ✅","#059669"],[lang==="de"?"Verfallsdatum":"Expiry","11/2027","#059669"]].map(([l,v,c],j)=>
<div key={j} style={{textAlign:"center",background:"#f9fafb",borderRadius:6,padding:6,border:"1px solid #e5e7eb"}}><div style={{fontSize:15,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:12,color:"#6b7280"}}>{l}</div></div>)}
</div>

{/* 30-day temperature chart (simulated SVG) */}
<div style={{background:"#fff",borderRadius:8,border:"1px solid #e5e7eb",padding:10,marginBottom:10}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{fontSize:14,fontWeight:700}}>{lang==="de"?"30-Tage Temperaturverlauf":"30-Day Temperature History"}</div>
<div style={{display:"flex",gap:8,fontSize:12}}><span><span style={{display:"inline-block",width:8,height:2,background:"#059669",borderRadius:1,marginRight:2,verticalAlign:"middle"}}/>Temp</span><span><span style={{display:"inline-block",width:8,height:2,background:"#3b82f6",borderRadius:1,marginRight:2,verticalAlign:"middle"}}/>RH%</span><span style={{color:"#dc2626"}}>— GDP Limits</span></div>
</div>
<svg viewBox="0 0 600 120" style={{width:"100%",height:120}}>
{/* GDP limit bands */}
<rect x="0" y={120-((25-10)*120/30)} width="600" height={((25-15)*120/30)} fill="#dcfce7" opacity="0.3"/>
<line x1="0" y1={120-((25-10)*120/30)} x2="600" y2={120-((25-10)*120/30)} stroke="#dc2626" strokeDasharray="4,4" strokeWidth="1" opacity="0.5"/>
<line x1="0" y1={120-((15-10)*120/30)} x2="600" y2={120-((15-10)*120/30)} stroke="#dc2626" strokeDasharray="4,4" strokeWidth="1" opacity="0.5"/>
<text x="605" y={120-((25-10)*120/30)+4} fill="#dc2626" fontSize="7">25°C</text>
<text x="605" y={120-((15-10)*120/30)+4} fill="#dc2626" fontSize="7">15°C</text>
{/* Temperature line */}
<polyline fill="none" stroke="#059669" strokeWidth="2" points={Array.from({length:30},(_, i)=>{const temps=[19.2,19.5,19.8,20.1,19.7,19.4,19.6,20.3,20.8,21.2,20.9,20.4,19.8,19.3,18.8,18.5,18.9,19.2,19.6,19.8,20.0,20.4,20.1,19.7,19.5,19.8,20.2,19.9,19.6,19.8];const t=temps[i];return `${i*20+10},${120-((t-10)*120/30)}`}).join(" ")}/>
{/* Humidity line (scaled to fit) */}
<polyline fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,2" opacity="0.6" points={Array.from({length:30},(_,i)=>{const hums=[42,43,44,45,44,43,42,41,40,39,41,43,44,45,46,47,46,44,43,42,44,45,43,42,44,45,44,43,44,44];return `${i*20+10},${120-hums[i]*1.8+30}`}).join(" ")}/>
{/* Data points */}
{[0,7,14,21,29].map(i=>{const temps=[19.2,19.5,19.8,20.1,19.7,19.4,19.6,20.3,20.8,21.2,20.9,20.4,19.8,19.3,18.8,18.5,18.9,19.2,19.6,19.8,20.0,20.4,20.1,19.7,19.5,19.8,20.2,19.9,19.6,19.8];return <circle key={i} cx={i*20+10} cy={120-((temps[i]-10)*120/30)} r="3" fill="#059669"/>})}
{/* X-axis labels */}
{[0,7,14,21,29].map(i=><text key={i} x={i*20+10} y="118" fill="#9ca3af" fontSize="7" textAnchor="middle">{["26.01","02.02","09.02","16.02","25.02"][[ 0,7,14,21,29].indexOf(i)]}</text>)}
</svg>
</div>

{/* Excursion log */}
<div style={{background:"#fff",borderRadius:8,border:"1px solid #e5e7eb",padding:10,marginBottom:10}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>{lang==="de"?"Abweichungsprotokoll":"Excursion Log"}</div>
<div style={{padding:12,textAlign:"center",color:"#059669",fontSize:15,background:"#f0fdf4",borderRadius:6}}>✅ {lang==="de"?"Keine Abweichungen in den letzten 90 Tagen":"No excursions in last 90 days"}</div>
</div>

{/* X-Sense system info */}
<div style={{background:"#f8fafc",borderRadius:8,border:"1px solid #e5e7eb",padding:10,marginBottom:10}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>📡 X-Sense Monitoring System</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:14}}>
{[["Sensors","3× STH51 WiFi Hygrometer"],["Base Station","SBS50 (2.4 GHz WiFi)"],["Interval","Every 10 minutes"],["Alerts","Push notification on threshold breach"],["GDP Temp Limits","15–25°C (EU GDP 2013/C 343/01)"],["GDP Humidity","30–65% RH"],["Data Export","CSV / PDF for BfArM audit"],["Alexa","✅ Voice status queries"]].map(([l,v],j)=>
<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid #e5e7eb"}}><span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>)}
</div>
</div>

{/* Action buttons */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
<div style={{background:"#f0fdf4",borderRadius:8,padding:10,border:"1.5px solid #16a34a",cursor:"pointer",textAlign:"center"}}>
<div style={{fontSize:22,marginBottom:4}}>📋</div>
<div style={{fontSize:15,fontWeight:700,color:"#065f46"}}>{lang==="de"?"Haltbarkeit verlängern":"Extend Shelf Life"}</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{lang==="de"?"Stabilitätsdaten prüfen":"Review stability data"}</div>
</div>
<div style={{background:"#eff6ff",borderRadius:8,padding:10,border:"1.5px solid #3b82f6",cursor:"pointer",textAlign:"center"}}>
<div style={{fontSize:22,marginBottom:4}}>📊</div>
<div style={{fontSize:15,fontWeight:700,color:"#1e40af"}}>{lang==="de"?"Export Monitoring PDF":"Export Monitoring PDF"}</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{lang==="de"?"BfArM Audit-Report":"BfArM audit report"}</div>
</div>
<div style={{background:"#fef2f2",borderRadius:8,padding:10,border:"1.5px solid #dc2626",cursor:"pointer",textAlign:"center"}}>
<div style={{fontSize:22,marginBottom:4}}>🗑️</div>
<div style={{fontSize:15,fontWeight:700,color:"#991b1b"}}>{lang==="de"?"Vernichtung / CAPA":"Destruction / CAPA"}</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{lang==="de"?"CAPA für abgelaufene Ware":"CAPA for expired goods"}</div>
</div>
</div>
</div>}

</Cd>
</div>};

// M5 Shipment — Base44 + SendCloud + Abweichungs + Dossier Closure
const[m5Tab,setM5Tab]=useState("sales");
const M5Ship=()=>{
const sales=[
{id:"ORD-001",ph:"Apotheke am Markt",ci:"Berlin",dt:"20.12.2025",it:"BOX-001: 5×1kg, BOX-008: 10×10g",kg:"5.15",st:"delivered",sc:"SC-001",tr:"DE4827561"},
{id:"ORD-002",ph:"Medios AG",ci:"Berlin",dt:"22.12.2025",it:"BOX-001: 10×1kg, BOX-002: 15×1kg",kg:"25.0",st:"delivered",sc:"SC-002",tr:"DE4827589"},
{id:"ORD-003",ph:"Cansativa GmbH",ci:"Frankfurt",dt:"03.01.2026",it:"BOX-002: 5×1kg, BOX-003: 20×1kg, BOX-004: 20×1kg",kg:"45.0",st:"delivered",sc:"SC-003",tr:"DE4831205"},
{id:"ORD-004",ph:"Pedanios GmbH",ci:"Hamburg",dt:"15.01.2026",it:"BOX-005: 20×1kg, BOX-006: 20×1kg",kg:"40.0",st:"delivered",sc:"SC-004",tr:"DE4835112"},
{id:"ORD-005",ph:"Tilray Deutschland",ci:"Norderstedt",dt:"01.02.2026",it:"BOX-007: 19×1kg, BOX-008: 30×10g, BOX-009: 40×10g",kg:"19.7",st:"in-transit",sc:"SC-005",tr:"DE4839001"},
{id:"ORD-006",ph:"ADREXpharma GmbH",ci:"Saarbrücken",dt:"10.02.2026",it:"BOX-009: 10×10g",kg:"0.1",st:"processing",sc:null,tr:null}
];
const devs=[
{id:"DEV-001",ti:lang==="de"?"Temperaturabweichung ORD-003":"Temp deviation ORD-003",st:"closed",dt:"05.01.2026",root:lang==="de"?"AC-Ausfall 45min":"AC failure 45min",act:lang==="de"?"MKT<25°C — kein Einfluss":"MKT<25°C — no impact"},
{id:"DEV-002",ti:lang==="de"?"Verpackungsschaden ORD-004":"Packaging damage ORD-004",st:"closed",dt:"17.01.2026",root:lang==="de"?"Stoß beim Entladen":"Impact during unloading",act:lang==="de"?"2 Einheiten ersetzt, CAPA erstellt":"2 units replaced, CAPA filed"},
{id:"DEV-003",ti:lang==="de"?"Lieferverzögerung ORD-005":"Delivery delay ORD-005",st:"open",dt:"03.02.2026",root:"SendCloud route change",act:lang==="de"?"Apotheke informiert":"Pharmacy notified"}
];
const delivered=164,transit=89,stock=239-164-89;

return <div>
<Cd t={"📤 M5 "+(lang==="de"?"Versand & Vertrieb":"Shipment & Distribution")} badge={<Bd c="#dc2626" b="#fee2e2">{delivered+transit}/239</Bd>}>
<div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>
{[["sales","📊 Base44"+(lang==="de"?" Verkäufe":" Sales")],["sendcloud","📦 SendCloud"],["deviations","⚠️ "+(lang==="de"?"Abweichungen":"Abweichungs")],["closure","📋 "+(lang==="de"?"Dossier":"Dossier Closure")]].map(([k,l])=>
<button key={k} onClick={()=>setM5Tab(k)} style={{padding:"5px 10px",borderRadius:5,fontSize:14,fontWeight:600,border:m5Tab===k?"2px solid #dc2626":"1px solid #d1d5db",background:m5Tab===k?"#fee2e2":"#fff",color:m5Tab===k?"#991b1b":"#374151",cursor:"pointer"}}>{l}</button>)}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
{[[lang==="de"?"Geliefert":"Delivered",delivered,"#059669"],[lang==="de"?"Transit":"Transit",transit,"#d97706"],[lang==="de"?"Lager":"Stock",stock,"#6b7280"],[lang==="de"?"Gesamt":"Total",239,"#374151"]].map(([l,v,c],j)=>
<div key={j} style={{textAlign:"center",background:"#f9fafb",borderRadius:8,padding:8,border:"1px solid #e5e7eb"}}><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:12,color:"#6b7280",fontWeight:600}}>{l}</div></div>)}
</div>

{m5Tab==="sales"&&<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>📊 {lang==="de"?"Verkaufsdaten von Base44":"Sales from Base44"} <Bd c="#3b82f6" b="#dbeafe">🔗 Live</Bd></div>
{sales.map((o,j)=><div key={j} style={{border:"1px solid "+(o.st==="delivered"?"#d1fae5":o.st==="in-transit"?"#fde68a":"#dbeafe"),borderRadius:8,padding:10,marginBottom:6,background:o.st==="delivered"?"#f0fdf4":o.st==="in-transit"?"#fffbeb":"#eff6ff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
<div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:15,fontWeight:800}}>{o.id}</span><span style={{fontSize:15,fontWeight:600}}>{o.ph}</span><span style={{fontSize:13,color:"#6b7280"}}>{o.ci}</span></div>
<Bd c={o.st==="delivered"?"#059669":o.st==="in-transit"?"#d97706":"#2563eb"} b={o.st==="delivered"?"#dcfce7":o.st==="in-transit"?"#fef3c7":"#dbeafe"}>{o.st==="delivered"?"✅":"🚚"} {o.st}</Bd>
</div>
<div style={{fontSize:14,color:"#6b7280"}}>{o.it} — <strong>{o.kg}kg</strong> • {o.dt}{o.sc&&" • 📦 "+o.sc}{o.tr&&" • 🔍 "+o.tr}</div>
</div>)}
</div>}

{m5Tab==="sendcloud"&&<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>📦 SendCloud <Bd c="#2563eb" b="#dbeafe">🔗 API</Bd></div>
{sales.filter(o=>o.sc).map((o,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:10,padding:10,marginBottom:6,borderRadius:8,border:"1px solid #e5e7eb",background:"#fff"}}>
<div style={{width:32,height:32,borderRadius:"50%",background:o.st==="delivered"?"#dcfce7":"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{o.st==="delivered"?"✅":"🚚"}</div>
<div style={{flex:1}}><div style={{fontSize:15,fontWeight:700}}>{o.ph}</div><div style={{fontSize:13,color:"#6b7280"}}>{o.sc} • {o.tr}</div></div>
<div style={{fontSize:14,fontWeight:600,color:o.st==="delivered"?"#059669":"#d97706"}}>{o.dt}</div>
</div>)}
<div style={{marginTop:8,padding:10,background:"#eff6ff",borderRadius:8,border:"1px solid #bfdbfe",fontSize:14,color:"#1e40af"}}>
{lang==="de"?"SendCloud: Automatische Versandetiketten, GDP-Tracking, Temperaturüberwachung":"SendCloud: Auto shipping labels, GDP tracking, temperature monitoring"}
</div>
</div>}

{m5Tab==="deviations"&&<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>⚠️ {lang==="de"?"Abweichungen & CAPA":"Abweichungs & CAPA"}</div>
{devs.map((d,j)=><div key={j} style={{border:"1px solid "+(d.st==="closed"?"#d1fae5":"#fde68a"),borderRadius:8,padding:10,marginBottom:6,background:d.st==="closed"?"#f0fdf4":"#fffbeb"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
<div style={{fontSize:15,fontWeight:700}}>{d.id}: {d.ti}</div>
<Bd c={d.st==="closed"?"#059669":"#d97706"} b={d.st==="closed"?"#dcfce7":"#fef3c7"}>{d.st==="closed"?"✅ Closed":"⏳ Open"}</Bd>
</div>
<div style={{fontSize:14,color:"#374151"}}><strong>Root:</strong> {d.root} • <strong>Action:</strong> {d.act}</div>
</div>)}
</div>}

{m5Tab==="closure"&&<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>📋 {lang==="de"?"BfArM Import-Dossier":"BfArM Import Dossier"}</div>
{[["✅","Import Permit","E-12267/2025 returned"],["✅","Customs","DE-FRA-2025-BtM-0047"],["✅","GDP Transport","No excursions"],["✅","Lab Testing","19/19 PASS"],["✅","QP Release","CGZ-2025-0047"],["✅","Quarantine","QRC-2025-003"],["✅","Relabeling","239 units PZN"],["✅","Storage Transfer","Celso → Dominik"],["⏳","Distribution",delivered+"/239 delivered"],["⏳","Abweichungs","2/3 closed"],["✅","BtM §13","Diff = 0"],["✅","Permit Return","BfArM confirmed"]
].map(([st,l,v],j)=><div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",marginBottom:3,borderRadius:6,border:"1px solid "+(st==="✅"?"#d1fae5":"#fde68a"),background:st==="✅"?"#f0fdf4":"#fffbeb"}}>
<span style={{fontSize:16}}>{st}</span><span style={{fontSize:15,fontWeight:700,flex:1}}>{l}</span><span style={{fontSize:14,color:"#6b7280"}}>{v}</span>
</div>)}
<button style={{marginTop:10,width:"100%",padding:"14px",borderRadius:8,fontSize:15,fontWeight:700,border:"2px solid #16a34a",background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",color:"#065f46",cursor:"pointer"}}>
📋 {lang==="de"?"BfArM Dossier generieren":"Generate BfArM Dossier"}
</button>
</div>}
</Cd>
</div>};

// M6 Reconciliation
const M6Recon=()=>{
const sold=164,transit=89,stock=239-164-89,destroyed=0;
return <div>
<Cd t={"📊 M6 "+(lang==="de"?"Abstimmung":"Reconciliation")} badge={<Bd c="#6366f1" b="#e0e7ff">{lang==="de"?"Endabrechnung":"Final"}</Bd>}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
{[["Imported","198.5 kg","#374151"],["Sold",sold,"#059669"],["Transit",transit,"#d97706"],["Stock",stock,"#6b7280"]].map(([l,v,c],j)=>
<div key={j} style={{textAlign:"center",background:"#f9fafb",borderRadius:8,padding:10,border:"1px solid #e5e7eb"}}><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:12,color:"#6b7280",fontWeight:600}}>{l}</div></div>)}
</div>
<div style={{background:"#fff",borderRadius:8,padding:12,border:"1px solid #e5e7eb",marginBottom:12}}>
<div style={{fontSize:16,fontWeight:700,marginBottom:8}}>BtM §13/§15 BtMG</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,fontSize:14}}>
{[["In","198.5 kg","#059669"],["Out",(sold+transit)+" units","#2563eb"],["Stock",stock+" units","#d97706"],["Diff","0 ✅","#059669"]].map(([l,v,c],j)=>
<div key={j} style={{textAlign:"center",background:"#f9fafb",borderRadius:4,padding:6,border:"1px solid #e5e7eb"}}><div style={{fontWeight:700,color:c}}>{v}</div><div style={{fontSize:12,color:"#6b7280"}}>{l}</div></div>)}
</div>
</div>
<div style={{background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",borderRadius:10,padding:16,border:"2px solid #16a34a"}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
<div style={{fontSize:26}}>📋</div>
<div>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>{lang==="de"?"DOSSIER BEREIT":"DOSSIER READY FOR BfArM"}</div>
<div style={{fontSize:14,color:"#065f46"}}>Batch BI-02 — M0→M6 {lang==="de"?"vollständig":"complete"}</div>
</div>
</div>
<div style={{display:"flex",gap:6}}>
<button style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>📄 PDF Export</button>
<button style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>📧 {lang==="de"?"An BfArM":"Send to BfArM"}</button>
<button style={{padding:"8px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#7c3aed",color:"#fff",cursor:"pointer"}}>🔒 {lang==="de"?"Archivieren":"Archive"}</button>
</div>
</div>
</Cd>
</div>};

// Stage Document Bar — appears on every stage with Drive folder + actions
const StageDocBar=({stageId,children})=>{
const folderUrl=gdLink(stageId);
const supName=sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN";
const emailSubj="NOC Pharma QMS — "+stageId+" — "+supName+" — Batch "+(selBatch||"");
const emailBody="Stage: "+stageId+"\nLieferant: "+supName+"\nCharge: "+(selBatch||"")+"\n\nPlease find the attached stage documents.\n\nNOC Pharma GmbH · QMS v2.5\nGoogle Drive: "+folderUrl;
const printStage=()=>{const w=window.open("","_blank","width=800,height=600");w.document.write('<html><head><title>'+stageId+' — '+supName+' — NOC Pharma</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1f2937}h1{font-size:20px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:8px}.meta{display:flex;justify-content:space-between;margin-bottom:16px;font-size:12px;color:#6b7280}table{width:100%;border-collapse:collapse;margin:8px 0}td{padding:5px 8px;border:1px solid #d1d5db;font-size:12px}td:first-child{font-weight:700;background:#f9fafb;width:30%}.ft{margin-top:30px;border-top:1px solid #d1d5db;padding-top:10px;font-size:10px;color:#9ca3af;text-align:center}@media print{body{padding:20px}}</style></head><body>');w.document.write('<div class="meta"><div><strong style="font-size:18px;color:#1e40af">NOC Pharma GmbH</strong><br/>QMS v2.5</div><div style="text-align:right">'+new Date().toLocaleDateString('de-DE')+'<br/>'+supName+'<br/>Charge: '+(selBatch||'—')+'</div></div>');w.document.write('<h1>'+stageId+' Stufendokumente</h1>');w.document.write('<table><tr><td>Stage</td><td>'+stageId+'</td></tr><tr><td>Supplier</td><td>'+supName+'</td></tr><tr><td>Batch</td><td>'+(selBatch||'—')+'</td></tr><tr><td>Erstellt</td><td>'+new Date().toISOString()+'</td></tr></table>');w.document.write('<div class="ft">NOC Pharma GmbH · Murchin, MV · §52a AMG · QMS v2.5</div></body></html>');w.document.close();setTimeout(()=>w.print(),500);};
return <div>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",marginBottom:8,background:"#f0f9ff",borderRadius:6,border:"1px solid #bae6fd"}}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="#1a73e8"/></svg>
<span style={{fontSize:14,fontWeight:700,color:"#1e40af"}}>{stageId} — {supName} — {selBatch||"—"}</span>
</div>
<div style={{display:"flex",gap:4}}>
<button onClick={()=>window.open(folderUrl,"_blank")} style={{padding:"3px 10px",borderRadius:4,fontSize:13,fontWeight:600,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="#fff"/></svg>{lang==="de"?"Ordner":"Folder"}</button>
<button onClick={()=>fileRef.current&&fileRef.current.click()} style={{padding:"3px 10px",borderRadius:4,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#374151" strokeWidth="2"/></svg>Upload</button>
<button onClick={printStage} style={{padding:"3px 10px",borderRadius:4,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="#374151" strokeWidth="1.5"/></svg>PDF</button>
<button onClick={()=>window.open(gmailLink(emailSubj,emailBody),"_blank")} style={{padding:"3px 10px",borderRadius:4,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#374151" strokeWidth="1.5"/><path d="M22 6l-10 7L2 6" stroke="#374151" strokeWidth="1.5"/></svg>Send</button>
</div>
</div>
{children}
{/* Show uploaded files for this stage */}
{(()=>{const stageUploads=uploads.filter(u=>u.stage===stageId&&u.batch===(selBatch||"BI-03"));return stageUploads.length>0?<div style={{margin:"8px 0",padding:8,background:"#f0fdf4",borderRadius:6,border:"1px solid #a7f3d0"}}>
<div style={{fontSize:13,fontWeight:700,color:"#065f46",marginBottom:4}}>📎 {lang==="de"?"Hochgeladene Originaldokumente":"Uploaded Original Documents"} ({stageUploads.length})</div>
{stageUploads.map((u,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 6px",fontSize:12,background:j%2===0?"rgba(255,255,255,.7)":"transparent",borderRadius:4,marginBottom:2}}>
<div style={{display:"flex",alignItems:"center",gap:4}}>
<span style={{fontSize:16}}>{u.type==="pdf"?"📄":u.type==="jpg"||u.type==="png"||u.type==="jpeg"?"🖼️":u.type==="xlsx"||u.type==="xls"?"📊":u.type==="doc"||u.type==="docx"?"📝":"📎"}</span>
<div>
<div style={{fontWeight:600,color:"#065f46"}}>{u.name}</div>
<div style={{fontSize:11,color:"#6b7280"}}>{u.size} · {u.date}{u.fromZip?" · ZIP: "+u.fromZip:""}{u.content?" · "+u.content.slice(0,60)+"...":""}</div>
</div>
</div>
<div style={{display:"flex",gap:3,alignItems:"center"}}>
{u.url&&<button onClick={()=>window.open(u.url,"_blank")} style={{padding:"2px 6px",borderRadius:3,fontSize:11,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>👁️ {lang==="de"?"Ansehen":"Preview"}</button>}
{u.url&&<button onClick={()=>{const w=window.open("","_blank");if(u.type==="pdf"){w.location.href=u.url}else{w.document.write('<html><head><title>'+u.name+'</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f1f5f9}img{max-width:90%;max-height:90vh;box-shadow:0 4px 20px rgba(0,0,0,.15);border-radius:8px}@media print{body{background:#fff}img{max-width:100%}}</style></head><body><img src="'+u.url+'"/></body></html>');w.document.close();setTimeout(function(){w.print()},500)}}} style={{padding:"2px 6px",borderRadius:3,fontSize:11,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>🖨️ {lang==="de"?"Drucken":"Print"}</button>}
{u.url&&<button onClick={()=>{const a=document.createElement("a");a.href=u.url;a.download=u.name;a.click()}} style={{padding:"2px 6px",borderRadius:3,fontSize:11,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>💾</button>}
</div>
</div>)}
</div>:null})()}
</div>};


const SD=()=>{const s=SG[lcs];if(!s)return null;
if(s.id==="M0")return <StageDocBar stageId="M0"><M05Reg/></StageDocBar>;
if(s.id==="M0.5")return <StageDocBar stageId="M0.5"><M0/></StageDocBar>;
if(sup!=="cannava"&&s.id!=="M0"&&s.id!=="M0.5"){const stN={M1:"GDP Transport","M1.5":"Vault Arrival",M2:"Lab Testing",M3:"QP Release","M3.1":"Quarantine Release","M3.5":"GDP Transport",M4:"Relabeling","M4.5":"Storage",M5:"Shipment",M6:"Reconciliation"};return <StageDocBar stageId={s.id}><SupplierDataPrep stageId={s.id} stageName={stN[s.id]||t[s.n]||""}/></StageDocBar>;}
if(curBatch&&curBatch.status==="planned"&&s.id!=="M0"&&s.id!=="M0.5"){const stN2={M1:"GDP Transport","M1.5":"Vault Arrival",M2:"Lab Testing",M3:"QP Release","M3.1":"Quarantine Release","M3.5":"GDP Transport",M4:"Relabeling","M4.5":"Storage",M5:"Shipment",M6:"Reconciliation"};return <StageDocBar stageId={s.id}><SupplierDataPrep stageId={s.id} stageName={stN2[s.id]||t[s.n]||""}/></StageDocBar>;}
if(s.id==="M1")return <StageDocBar stageId="M1"><M1GDP/></StageDocBar>;
if(s.id==="M1.5")return <StageDocBar stageId="M1.5"><M15Vault/></StageDocBar>;
if(s.id==="M2")return <StageDocBar stageId="M2"><M2Lab/></StageDocBar>;
if(s.id==="M3")return <StageDocBar stageId="M3"><M3QP/></StageDocBar>;
if(s.id==="M3.1")return <StageDocBar stageId="M3.1"><M31Release/></StageDocBar>;
if(s.id==="M3.5")return <StageDocBar stageId="M3.5"><M35GDP/></StageDocBar>;
if(s.id==="M4")return <StageDocBar stageId="M4"><M4Relabel/></StageDocBar>;
if(s.id==="M4.5")return <StageDocBar stageId="M4.5"><M45Storage/></StageDocBar>;
if(s.id==="M5")return <StageDocBar stageId="M5"><M5Ship/></StageDocBar>;
if(s.id==="M6")return <StageDocBar stageId="M6"><M6Recon/></StageDocBar>;
const grids={"M4":{t:"🏷️ "+t.relabel+" — Kahla Im Camisch 14",d:[["PZN","PZN-18547632"],["Labels Applied","239 (each with unique barcode)"],[t.photos,"6 (before/after evidence)"],[t.completed,"18.12.2025"],[t.location,"Kahla Im Camisch 14"],["SOP","SOP-710-01 v3.0"],["Content","Product, Batch, PZN, THC%, Expiry, Barcode"]]}};
const g=grids[s.id];
if(g)return <Cd t={g.t} badge={<Bd c="#059669" b="#d1fae5">✓</Bd>}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:16}}>{g.d.map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}</div></Cd>;
return <Cd t={s.ic+" "+s.id}><div style={{textAlign:"center",padding:16,color:"#9ca3af",fontSize:16}}>Tracking activates when batch reaches this stage</div></Cd>};

// AI Agent Panel
const Agent=()=>{const a=ag;const als=a.alerts;const ac=als.filter(x=>x.lv==="critical").length;
return <div style={{position:"fixed",right:0,top:0,bottom:0,width:400,background:"#fff",borderLeft:"2px solid #e5e7eb",boxShadow:"-4px 0 20px rgba(0,0,0,.1)",zIndex:200,display:"flex",flexDirection:"column"}}>
<div style={{padding:"12px 14px",background:"linear-gradient(135deg,"+a.grad[0]+","+a.grad[1]+")",color:"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div><div style={{fontWeight:700,fontSize:15,display:"flex",alignItems:"center",gap:5}}><span style={{fontSize:16}}>{a.fl}</span><span style={{fontSize:16}}>{"🇩🇪"}</span> {"🤖"} {a.name}</div>
<div style={{fontSize:13,opacity:.85,marginTop:2,lineHeight:1.4}}>{a.sub[lang]}</div></div>
<button onClick={()=>setAgO(false)} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:5,padding:"3px 7px",cursor:"pointer",fontWeight:700}}>{"✕"}</button></div>
{/* Agent Mode Toggle — Master vs Supplier */}
<div style={{display:"flex",gap:4,marginTop:8}}>
<button onClick={()=>{setAgMode("master");setCm([])}} style={{flex:1,padding:"4px 8px",borderRadius:4,fontSize:13,fontWeight:700,border:agMode==="master"?"2px solid #fff":"1px solid rgba(255,255,255,.3)",background:agMode==="master"?"rgba(255,255,255,.25)":"transparent",color:"#fff",cursor:"pointer"}}>🏛️ Master Agent</button>
<button onClick={()=>{setAgMode("supplier");setCm([])}} style={{flex:1,padding:"4px 8px",borderRadius:4,fontSize:13,fontWeight:700,border:agMode==="supplier"?"2px solid #fff":"1px solid rgba(255,255,255,.3)",background:agMode==="supplier"?"rgba(255,255,255,.25)":"transparent",color:"#fff",cursor:"pointer"}}>{(AGENTS[sup]||AGENTS.cannava).fl} {sup==="cannava"?"Argentina":sup==="mccn"?"Colombia":"Canada"}</button>
</div>
{ac>0&&<div style={{marginTop:6,padding:"4px 8px",background:"rgba(220,38,38,.9)",borderRadius:4,fontSize:14,fontWeight:600}}>{"🔴"} {ac} critical</div>}
</div>
<div style={{display:"flex",borderBottom:"1px solid #e5e7eb"}}>{[["alerts","⚠️ Alerts ("+als.length+")"],["chat","💬 Chat"],["translate","🌐 Translate"],["sops","📋 SOPs"],["licenses","📋 Licenses"]].map(([k,l])=><button key={k} onClick={()=>setAgT(k)} style={{flex:1,padding:"7px 3px",fontSize:13,fontWeight:agT===k?700:400,border:"none",borderBottom:agT===k?"2px solid "+a.grad[1]:"2px solid transparent",background:"#fff",cursor:"pointer",color:agT===k?a.grad[1]:"#6b7280"}}>{l}</button>)}</div>
<div style={{flex:1,overflowY:"auto",padding:10}}>
{agT==="alerts"&&als.map((al,j)=><div key={j} onClick={()=>{if(al.dk){setExDoc(al.dk);setLcs(0);setPg("lifecycle")}}} style={{padding:8,marginBottom:5,borderRadius:6,background:al.lv==="critical"?"#fee2e2":al.lv==="warning"?"#fef3c7":"#f3f4f6",border:"1px solid "+(al.lv==="critical"?"#fca5a5":al.lv==="warning"?"#fcd34d":"#e5e7eb"),cursor:al.dk?"pointer":"default",fontSize:15}}><div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{al.ic} {al.lv.toUpperCase()}</div><div style={{lineHeight:1.4}}>{al[lang]}</div></div>)}
{agT==="chat"&&<div>{cm.length===0&&<div style={{textAlign:"center",padding:16,color:"#9ca3af",fontSize:16}}>{a.fl} Ask the {a.name}...</div>}{cm.map((m,j)=><div key={j} style={{display:"flex",justifyContent:m.r==="u"?"flex-end":"flex-start",marginBottom:6}}><div style={{maxWidth:"88%",padding:"8px 11px",borderRadius:10,background:m.r==="u"?a.grad[1]:"#f3f4f6",color:m.r==="u"?"#fff":"#1f2937",fontSize:15,whiteSpace:"pre-wrap",lineHeight:1.4}}>{m.t}</div></div>)}</div>}
{agT==="licenses"&&<div style={{padding:10,color:"#9ca3af",fontSize:15,textAlign:"center"}}>{a.fl} License monitor for {a.name}</div>}
{agT==="translate"&&<div style={{padding:10}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6,color:"#1e40af"}}>🌐 AI Translator</div>
<div style={{fontSize:12,color:"#6b7280",marginBottom:8}}>Translates supplier documents (ES/EN) to German for BfArM. Pharma/GMP terminology.</div>
<div style={{display:"flex",gap:4,marginBottom:8}}>
{[["de","DE Deutsch"],["en","EN English"],["es","ES Spanish"]].map(([k,l])=>
<button key={k} onClick={()=>setTrLang(k)} style={{flex:1,padding:"5px 4px",borderRadius:4,fontSize:12,fontWeight:trLang===k?700:400,border:trLang===k?"2px solid #1e40af":"1px solid #d1d5db",background:trLang===k?"#dbeafe":"#fff",color:trLang===k?"#1e40af":"#374151",cursor:"pointer"}}>{l}</button>)}
</div>
<textarea value={trSrc} onChange={e=>setTrSrc(e.target.value)} placeholder="Paste text to translate (ES/EN/DE)..." style={{width:"100%",height:100,padding:8,borderRadius:6,border:"1px solid #d1d5db",fontSize:14,fontFamily:"inherit",resize:"vertical",boxSizing:"border-box"}}/>
<div style={{display:"flex",gap:3,marginTop:4,marginBottom:6,flexWrap:"wrap"}}>
<button onClick={()=>setTrSrc("Certificado de Analisis - Lote: BI-02 - Producto: Cannabis Flos Sativa - Contenido de THC: 20.1%")} style={{padding:"2px 6px",borderRadius:3,fontSize:11,border:"1px solid #d1d5db",background:"#f9fafb",cursor:"pointer"}}>COA</button>
<button onClick={()=>setTrSrc("Certificado de Buenas Practicas de Manufactura expedido por ANMAT certifica que Cannabis Avatara cumple con las normas GMP vigentes.")} style={{padding:"2px 6px",borderRadius:3,fontSize:11,border:"1px solid #d1d5db",background:"#f9fafb",cursor:"pointer"}}>GMP</button>
<button onClick={()=>setTrSrc("Autorizacion de Exportacion SEDRONAR-EXP-2025-001. Autoriza exportacion de 60 kg Cannabis Flos a NOC Pharma GmbH, Alemania.")} style={{padding:"2px 6px",borderRadius:3,fontSize:11,border:"1px solid #d1d5db",background:"#f9fafb",cursor:"pointer"}}>Export</button>
<button onClick={()=>setTrSrc("Acuerdo Tecnico de Calidad entre Cannabis Avatara S.E. y NOC Pharma GmbH. Especificaciones segun Ph.Eur. Cannabis Flos.")} style={{padding:"2px 6px",borderRadius:3,fontSize:11,border:"1px solid #d1d5db",background:"#f9fafb",cursor:"pointer"}}>QTA</button>
</div>
<button onClick={()=>{if(!trSrc.trim())return;setTrLoading(true);setTrOut("");var ln=trLang==="de"?"German":trLang==="en"?"English":"Spanish";fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:"You are a pharmaceutical translator for NOC Pharma GmbH. Translate to "+ln+". Use BfArM/AMG/BtMG terms for German, EU GMP/PIC/S for English. Keep reference numbers unchanged. Output only the translation.\n\nText:\n"+trSrc}]})}).then(function(r){return r.json()}).then(function(d){var txt=d.content?d.content.map(function(c){return c.text||""}).join(""):"Translation error";setTrOut(txt);setTrLoading(false)}).catch(function(e){setTrOut("Error: "+e.message);setTrLoading(false)})}} disabled={trLoading||!trSrc.trim()} style={{width:"100%",padding:"8px 12px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:trLoading?"#9ca3af":"#1e40af",color:"#fff",cursor:trLoading?"wait":"pointer",marginBottom:6}}>
{trLoading?"Translating...":"Translate to "+(trLang==="de"?"Deutsch":trLang==="en"?"English":"Spanish")}
</button>
{trOut&&<div>
<div style={{fontSize:13,fontWeight:700,color:"#059669",marginBottom:3}}>Translation:</div>
<div style={{padding:8,background:"#f0fdf4",borderRadius:6,border:"1px solid #a7f3d0",fontSize:14,whiteSpace:"pre-wrap",lineHeight:1.5,maxHeight:200,overflowY:"auto"}}>{trOut}</div>
<div style={{display:"flex",gap:4,marginTop:4}}>
<button onClick={()=>navigator.clipboard.writeText(trOut)} style={{flex:1,padding:"4px 8px",borderRadius:4,fontSize:12,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer"}}>Copy</button>
<button onClick={()=>window.open(gmailLink("NOC Pharma Translated Document",trOut),"_blank")} style={{flex:1,padding:"4px 8px",borderRadius:4,fontSize:12,fontWeight:600,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>Email</button>
<button onClick={()=>{var w=window.open("","_blank","width=800,height=600");w.document.write("<html><head><title>Translation</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:12px}.b{background:#1e40af;color:#fff;padding:12px 30px;margin:-30px -30px 16px}h2{color:#1e40af}@media print{body{padding:20px}.b{margin:-20px -20px 16px}}</style></head><body>");w.document.write("<div class='b'><strong>NOC Pharma GmbH</strong> - Translation</div>");w.document.write("<h2>Original</h2><p>"+trSrc.replace(/\n/g,"<br/>")+"</p>");w.document.write("<h2>Translation</h2><p>"+trOut.replace(/\n/g,"<br/>")+"</p>");w.document.write("<hr/><p style='font-size:9px;color:#999'>NOC Pharma QMS v2.5 - "+new Date().toISOString()+"</p></body></html>");w.document.close();setTimeout(function(){w.print()},500)}} style={{flex:1,padding:"4px 8px",borderRadius:4,fontSize:12,fontWeight:600,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>PDF</button>
</div>
</div>}
</div>}
{agT==="sops"&&<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>📋 {lang==="de"?"Relevante SOPs":"Relevant SOPs"}</div>
{(agMode==="master"?[
{id:"SOP-QMS-001",n:"Pharma QS",p:38,v:"v1",cat:"QMS"},
{id:"SOP-BTM-001",n:"BtM-Verkehr & Dokumentation",p:38,v:"v1",cat:"BtM"},
{id:"SOP-BTM-006",n:"Cannabis-spezifische Herstellung",p:38,v:"",cat:"BtM"},
{id:"SOP-MFG-006",n:"Einfuhrverfahren Arzneimittel",p:38,v:"",cat:"MFG"},
{id:"SOP-MFG-002",n:"Wareneingang & Probenahme",p:31,v:"",cat:"MFG"},
{id:"SOP-GDP-001",n:"Lagerhaltung & Lagerbedingungen",p:25,v:"",cat:"GDP"},
{id:"SOP-GDP-003",n:"Transport & Distribution",p:25,v:"",cat:"GDP"},
{id:"SOP-CS-001",n:"Computerized Systems Validation",p:44,v:"",cat:"CS"},
{id:"SOP-QC-006",n:"Cannabis Identitäts-/Gehaltsprüfung",p:38,v:"",cat:"QC"},
{id:"SOP-102_02",n:"Lieferantenqualifizierung",p:19,v:"",cat:"QMS"},
{id:"SOP-604-02",n:"Wareneingang/Kontrollen",p:25,v:"",cat:"MFG"},
{id:"B.3_A4-01",n:"Site Master File",p:44,v:"",cat:"SMF"}
]:sup==="cannava"?[
{id:"SOP-MFG-006",n:"Einfuhrverfahren AM",p:38,v:"",cat:"MFG"},
{id:"SOP-BTM-002",n:"BtM-Einfuhr & Ausfuhr",p:38,v:"",cat:"BtM"},
{id:"SOP-102_02",n:"Lieferantenqualifizierung",p:19,v:"",cat:"QMS"},
{id:"SOP-604-02",n:"Wareneingang/Kontrollen",p:25,v:"",cat:"MFG"},
{id:"SOP-QC-006",n:"Cannabis Identitätsprüfung",p:38,v:"",cat:"QC"},
{id:"SOP-GDP-003",n:"Transport & Distribution",p:25,v:"",cat:"GDP"},
{id:"SOP-BTM-003",n:"BtM-Bestandsführung",p:31,v:"",cat:"BtM"},
{id:"SOP-710_01",n:"Kundenbestellungen",p:25,v:"",cat:"GDP"}
]:sup==="mccn"?[
{id:"SOP-102_02",n:"Lieferantenqualifizierung",p:19,v:"",cat:"QMS"},
{id:"SOP-102_A5-01",n:"GMP-Fragebogen Selbstauskunft",p:12,v:"",cat:"QMS"},
{id:"SOP-MFG-006",n:"Einfuhrverfahren AM",p:38,v:"",cat:"MFG"},
{id:"SOP-QMS-010",n:"Lieferantenqualifizierung",p:25,v:"",cat:"QMS"},
{id:"SOP-106_01",n:"Audits/Selbstinspektionen",p:19,v:"",cat:"QMS"},
{id:"SOP-BTM-002",n:"BtM-Einfuhr & Ausfuhr",p:38,v:"",cat:"BtM"},
{id:"SOP-QC-006",n:"Cannabis Identitätsprüfung",p:38,v:"",cat:"QC"}
]:[
{id:"SOP-102_02",n:"Lieferantenqualifizierung",p:19,v:"",cat:"QMS"},
{id:"SOP-MFG-006",n:"Einfuhrverfahren AM",p:38,v:"",cat:"MFG"},
{id:"SOP-BTM-002",n:"BtM-Einfuhr & Ausfuhr",p:38,v:"",cat:"BtM"},
{id:"SOP-GDP-003",n:"Transport & Distribution",p:25,v:"",cat:"GDP"},
{id:"SOP-QC-006",n:"Cannabis Identitätsprüfung",p:38,v:"",cat:"QC"}
]).map((s,j)=><div key={j} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 8px",marginBottom:3,borderRadius:5,background:s.p>=30?"#f0fdf4":s.p>0?"#fffbeb":"#f9fafb",border:"1px solid "+(s.p>=30?"#bbf7d0":s.p>0?"#fde68a":"#e5e7eb"),cursor:"pointer"}} onClick={()=>window.open(gdLink("sops"),"_blank")}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:13,fontWeight:700,color:a.grad[1],minWidth:75}}>{s.id}</span>
<span style={{fontSize:14}}>{s.n}</span>
{s.v&&<span style={{padding:"1px 5px",borderRadius:3,fontSize:11,fontWeight:700,background:"#dbeafe",color:"#1e40af"}}>{s.v}</span>}
</div>
<div style={{display:"flex",alignItems:"center",gap:4}}>
<div style={{width:40,height:6,background:"#e5e7eb",borderRadius:3,overflow:"hidden"}}><div style={{width:s.p+"%",height:"100%",background:s.p>=30?"#059669":s.p>0?"#d97706":"#9ca3af",borderRadius:3}}/></div>
<span style={{fontSize:13,fontWeight:600,color:s.p>=30?"#059669":s.p>0?"#d97706":"#9ca3af",minWidth:30,textAlign:"right"}}>{s.p}%</span>
</div>
</div>)}
<div style={{marginTop:8,padding:8,background:"#f0f9ff",borderRadius:6,fontSize:13,color:"#1e40af",border:"1px solid #bfdbfe"}}>
<strong>QMS v1.0:</strong> 305 SOPs • 297 {lang==="de"?"Updates ausstehend":"updates pending"} • <span style={{cursor:"pointer",textDecoration:"underline"}} onClick={()=>window.open("http://localhost:3000/dashboard","_blank")}>{lang==="de"?"QMS öffnen":"Open QMS"} →</span>
</div>
</div>}
</div>
{agT==="chat"&&<div style={{padding:8,borderTop:"1px solid #e5e7eb"}}><div style={{display:"flex",gap:5}}><input value={ci} onChange={e=>setCi(e.target.value)} onKeyDown={e=>e.key==="Enter"&&ask()} placeholder={"Ask "+a.name+"..."} style={{flex:1,padding:"6px 9px",borderRadius:5,border:"1px solid #d1d5db",fontSize:15}}/><button onClick={()=>ask()} style={{padding:"6px 10px",borderRadius:5,border:"none",background:a.grad[1],color:"#fff",fontWeight:600,cursor:"pointer",fontSize:15}}>{"→"}</button></div><div style={{display:"flex",gap:3,marginTop:5,flexWrap:"wrap"}}>{a.quick.map(q=><button key={q} onClick={()=>ask(q)} style={{padding:"2px 6px",borderRadius:3,fontSize:13,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer"}}>{q}</button>)}</div></div>}
</div>};

const crit=ALERTS.filter(a=>a.lv==="critical").length;const warn=ALERTS.filter(a=>a.lv==="warning").length;

// Supplier Onboarding Workspace for pre-qualification suppliers
const ONBOARD_DOCS={
mccn:[
{k:"profile",ic:"🏢",de:"Firmenprofil & Registrierung",en:"Company Profile & Registration",req:true,up:false,desc:{de:"Handelsregister, Rechtliche Struktur, Geschäftsführung",en:"Business registry, legal structure, management"}},
{k:"wc",ic:"📝",de:"Written Confirmation (INVIMA)",en:"Written Confirmation (INVIMA)",req:true,up:false,desc:{de:"Art. 46b(2)(b) — PFLICHT da Kolumbien NICHT auf EU-GMP-Liste",en:"Art. 46b(2)(b) — MANDATORY as Colombia NOT on EU GMP list"},crit:true},
{k:"fne",ic:"📜",de:"FNE Exportgenehmigung",en:"FNE Export License",req:true,up:false,desc:{de:"Fondo Nacional de Estupefacientes — läuft 30.06.2026 ab",en:"Fondo Nacional de Estupefacientes — expires 30.06.2026"}},
{k:"gmp",ic:"🏭",de:"GMP-Zertifikat (INVIMA)",en:"GMP Certificate (INVIMA)",req:true,up:false,desc:{de:"INVIMA GMP-Inspektion — NICHT PIC/S anerkannt",en:"INVIMA GMP inspection — NOT PIC/S recognized"}},
{k:"gacp",ic:"🌿",de:"GACP-Zertifikat",en:"GACP Certificate",req:true,up:false,desc:{de:"EU GACP Audit geplant 15.09.2026",en:"EU GACP audit planned 15.09.2026"}},
{k:"coa",ic:"🔬",de:"Muster-COA",en:"Sample COA",req:true,up:false,desc:{de:"Analysenzertifikat für Vorab-Bewertung",en:"Certificate of Analysis for preliminary review"}},
{k:"phyto",ic:"🌿",de:"Phytosanitäres Zeugnis (ICA)",en:"Phytosanitary Certificate (ICA)",req:true,up:false,desc:{de:"Instituto Colombiano Agropecuario",en:"Instituto Colombiano Agropecuario"}},
{k:"gdp",ic:"🚛",de:"GDP-Qualifizierung Spediteur",en:"GDP Carrier Qualification",req:false,up:false,desc:{de:"GDP-qualifizierter Transport Kolumbien → Frankfurt",en:"GDP-qualified transport Colombia → Frankfurt"}},
{k:"ins",ic:"🛡️",de:"Produkthaftpflicht",en:"Product Liability Insurance",req:false,up:false,desc:{de:"Versicherungsnachweis für EU-Markt",en:"Insurance certificate for EU market"}}
],
hytn:[
{k:"profile",ic:"🏢",de:"Firmenprofil & Registrierung",en:"Company Profile & Registration",req:true,up:false,desc:{de:"Handelsregister, Rechtliche Struktur, Geschäftsführung",en:"Business registry, legal structure, management"}},
{k:"del",ic:"🏭",de:"Drug Establishment Licence (DEL)",en:"Drug Establishment Licence (DEL)",req:true,up:false,desc:{de:"Health Canada DEL — Cannabis Export Scope",en:"Health Canada DEL — cannabis export scope"}},
{k:"hcgmp",ic:"🔬",de:"Health Canada GMP-Zertifikat",en:"Health Canada GMP Certificate",req:true,up:false,desc:{de:"PIC/S-Mitglied → vereinfachte Anerkennung",en:"PIC/S member → simplified recognition"}},
{k:"canlic",ic:"📜",de:"Cannabis-Lizenz (Cannabis Act)",en:"Cannabis Licence (Cannabis Act)",req:true,up:false,desc:{de:"Division 4, Part 14 Cannabis Regulations",en:"Division 4, Part 14 Cannabis Regulations"}},
{k:"coa",ic:"🔬",de:"Muster-COA",en:"Sample COA",req:true,up:false,desc:{de:"Vorab-Bewertung — TYMC-Grenzwert prüfen (Ph.Eur. 10.000)",en:"Preliminary review — check TYMC limit (Ph.Eur. 10,000)"}},
{k:"btmexp",ic:"⚖️",de:"BtM-Ausfuhrgenehmigung (Health Canada)",en:"BtM Export Authorization (Health Canada)",req:true,up:false,desc:{de:"Kanadische Ausfuhrgenehmigung für kontrollierte Substanzen",en:"Canadian export authorization for controlled substances"}},
{k:"gdp",ic:"🚛",de:"GDP-Qualifizierung Spediteur",en:"GDP Carrier Qualification",req:false,up:false,desc:{de:"GDP-qualifizierter Transport Kanada → Frankfurt",en:"GDP-qualified transport Canada → Frankfurt"}},
{k:"ins",ic:"🛡️",de:"Produkthaftpflicht",en:"Product Liability Insurance",req:false,up:false,desc:{de:"Versicherungsnachweis für EU-Markt",en:"Insurance certificate for EU market"}}
]};

const OnboardWS=()=>{const docs=ONBOARD_DOCS[sup]||[];const reqD=docs.filter(d=>d.req);const upD=docs.filter(d=>d.up);
const info=sup==="mccn"?{company:"MEDCOLCANNA S.A.S.",legal:"Sociedad por Acciones Simplificada",addr:"Bogotá D.C., Colombia",reg:"INVIMA / FNE (NOT PIC/S)",pics:false,varieties:"Mango Bliss, Sky Walker, Purple Mountain",note:{de:"🔴 Kolumbien ist KEIN PIC/S-Mitglied. Written Confirmation von INVIMA ist zwingend erforderlich (Art. 46b).",en:"🔴 Colombia is NOT a PIC/S member. Written Confirmation from INVIMA is mandatory (Art. 46b)."}}
:{company:"HYTN Cannabis Inc.",legal:"Corporation",addr:"Kelowna, BC, Canada",reg:"Health Canada (PIC/S member)",pics:true,varieties:"TBD",note:{de:"✅ Kanada ist PIC/S-Mitglied. Vereinfachte GMP-Anerkennung möglich. Keine Written Confirmation erforderlich.",en:"✅ Canada is PIC/S member. Simplified GMP recognition possible. No Written Confirmation needed."}};

return <div>
<div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16,padding:16,background:"linear-gradient(135deg,"+curSup.c+"08,"+curSup.c+"12)",borderRadius:10,border:"1.5px solid "+curSup.c+"40"}}>
<span style={{fontSize:40}}>{curSup.fl}</span>
<div style={{flex:1}}>
<div style={{fontSize:22,fontWeight:800,color:"#1f2937"}}>{info.company}</div>
<div style={{fontSize:15,color:"#6b7280"}}>{info.legal} • {info.addr}</div>
<div style={{fontSize:15,marginTop:3}}>{lang==="de"?"Regulierung":"Regulatory"}: <strong>{info.reg}</strong> {info.pics?"✅ PIC/S":"❌ NOT PIC/S"}</div>
{info.varieties!=="TBD"&&<div style={{fontSize:14,color:"#6b7280",marginTop:2}}>{lang==="de"?"Varietäten":"Varieties"}: {info.varieties}</div>}
</div>
<div style={{textAlign:"right"}}><Bd c={curSup.c} b={curSup.c+"18"}>{curSup.st}</Bd>
<div style={{fontSize:14,color:"#6b7280",marginTop:4}}>{upD.length}/{reqD.length} {lang==="de"?"hochgeladen":"uploaded"}</div></div>
</div>
<div style={{padding:10,marginBottom:14,borderRadius:8,background:info.pics?"#ecfdf5":"#fee2e2",border:"1px solid "+(info.pics?"#a7f3d0":"#fca5a5"),fontSize:15}}>{info.note[lang]}</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
<Cd t={lang==="de"?"📋 Qualifizierungs-Fortschritt":"📋 Qualification Progress"}>
<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
<div style={{flex:1,height:8,background:"#e5e7eb",borderRadius:4,overflow:"hidden"}}><div style={{width:((upD.length/Math.max(reqD.length,1))*100)+"%",height:"100%",background:curSup.c,borderRadius:4}}/></div>
<span style={{fontSize:16,fontWeight:700,color:curSup.c}}>{Math.round((upD.length/Math.max(reqD.length,1))*100)}%</span>
</div>
<div style={{fontSize:15,color:"#6b7280"}}>{lang==="de"?"Erforderliche Dokumente":"Required documents"}: {upD.length}/{reqD.length}</div>
<div style={{fontSize:15,color:"#6b7280"}}>{lang==="de"?"Nächster Schritt":"Next step"}: <strong>{docs.find(d=>d.req&&!d.up)?docs.find(d=>d.req&&!d.up)[lang]:"—"}</strong></div>
</Cd>
<Cd t={lang==="de"?"🚀 Nächste Aktionen":"🚀 Next Actions"}>
<div style={{display:"flex",flexDirection:"column",gap:6,fontSize:15}}>
{docs.filter(d=>d.req&&!d.up).slice(0,4).map((d,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{color:"#dc2626"}}>●</span><span>{d[lang]}</span>
</div>)}
<button onClick={()=>setAgO(true)} style={{marginTop:4,padding:"6px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:curSup.c,color:"#fff",cursor:"pointer"}}>🤖 {lang==="de"?"Agent fragen":"Ask Agent"}</button>
</div>
</Cd>
</div>

<Cd t={(lang==="de"?"📂 Qualifizierungsdokumente — ":"📂 Qualification Documents — ")+info.company}>
{docs.map((doc,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",marginBottom:4,borderRadius:7,border:"1px solid "+(doc.crit&&!doc.up?"#fca5a5":doc.up?"#a7f3d0":"#e5e7eb"),background:doc.crit&&!doc.up?"#fef2f2":doc.up?"#f0fdf4":"#fff"}}>
<div style={{width:36,height:36,borderRadius:7,background:doc.up?"#dcfce7":doc.crit?"#fee2e2":"#f3f4f6",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{doc.up?"✅":doc.ic}</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:16,fontWeight:600}}>{doc[lang]} {doc.req&&<span style={{fontSize:13,color:"#dc2626",fontWeight:700}}>*</span>}</div>
<div style={{fontSize:14,color:"#6b7280"}}>{doc.desc[lang]}</div>
</div>
{doc.up?<Bd c="#059669" b="#dcfce7">✅ {lang==="de"?"Hochgeladen":"Uploaded"}</Bd>
:<button style={{padding:"5px 12px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:doc.crit?"#dc2626":curSup.c,color:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>📤 {lang==="de"?"Hochladen":"Upload"}</button>}
</div>)}
<div style={{marginTop:8,fontSize:14,color:"#6b7280",borderTop:"1px solid #e5e7eb",paddingTop:8}}>* = {lang==="de"?"Pflichtdokument vor erstem Import":"Required document before first import"}</div>
</Cd>
</div>};

const PAGES={
dashboard:<div>
{/* Supplier-specific dashboard content */}
{(()=>{
const supData={
cannava:{fl:"🇦🇷",n:"Cannava S.E.",loc:"San Juan, Argentina",batches:[
{id:"BI-01",p:"NOC SE 17",qty:"59.5kg",stage:12,total:12,st:lang==="de"?"Abgeschlossen":"Completed",c:"#6b7280"},
{id:"BI-02",p:"NOC SE 19",qty:"198.5kg",stage:9,total:12,st:lang==="de"?"Lagerung":"Storage",c:"#059669"},
{id:"BI-03",p:"NOC SE 20",qty:"60kg",stage:2,total:12,st:lang==="de"?"Transport":"Transit",c:"#2563eb"},
{id:"BI-04",p:"NOC SE 21",qty:"60kg",stage:0,total:12,st:lang==="de"?"Geplant":"Planned",c:"#d97706"}
],kpi:{stock:"198.36kg",btm:"198.36kg",sold:"15.8kg",revenue:"€49,770",value:"€625,275",margin:"62%"},
alerts:[
{t:lang==="de"?"Herstellungserlaubnis abgelaufen":"Manufacturing License expired",c:"#dc2626",ic:"❌"},
{t:lang==="de"?"GMP Audit ueberfaellig":"GMP Audit overdue",c:"#dc2626",ic:"⚠️"},
{t:lang==="de"?"QTA laeuft in 16d ab":"QTA expires in 16d",c:"#d97706",ic:"⏰"},
{t:lang==="de"?"BI-03 COA ausstehend":"BI-03 COA pending",c:"#d97706",ic:"📄"},
{t:lang==="de"?"BI-03 Phytosanitaer ausstehend":"BI-03 Phytosanitary pending",c:"#d97706",ic:"📄"},
{t:lang==="de"?"INCB 2026 Erneuerung":"INCB 2026 renewal needed",c:"#dc2626",ic:"🌍"}
],docs:8,pics:true,reg:"ANMAT",shipActive:true,color:"#059669"},
mccn:{fl:"🇨🇴",n:"Medcolcanna S.A.S.",loc:"Bogota, Colombia",batches:[
{id:"MC-01",p:"MCCN THC-01",qty:"40kg",stage:0,total:12,st:lang==="de"?"Qualifizierung":"Qualification",c:"#d97706"}
],kpi:{stock:"0kg",btm:"0kg",sold:"0kg",revenue:"€0",value:"1,492kg/yr",margin:"—"},
alerts:[
{t:lang==="de"?"Art. 46b Bestaetigung PFLICHT":"Art. 46b Confirmation MANDATORY",c:"#dc2626",ic:"🔴"},
{t:lang==="de"?"GMP Zertifikat ausstehend":"GMP Certificate pending",c:"#d97706",ic:"📄"},
{t:lang==="de"?"QTA Entwurf":"QTA Draft",c:"#d97706",ic:"📝"},
{t:lang==="de"?"NICHT PIC/S — Sondergenehmigung":"NOT PIC/S — Special permit needed",c:"#dc2626",ic:"⚠️"}
],docs:8,pics:false,reg:"INVIMA",shipActive:false,color:"#d97706",
harvest:[
{strain:"GUAVA HAZE",rnc:"GAIA 001",noc:"NOC GK 27 COL",kg:110,thc:26,release:"28.04.2026",type:"INDOOR",exp:"MAY"},
{strain:"PURPLE GUAVA",rnc:"PURPLE MOUNTAIN",noc:"NOC UG 21 COL",kg:73,thc:21,release:"07.06.2026",type:"GREENHOUSE",exp:"JUL"},
{strain:"GUAVA HAZE",rnc:"GAIA 001",noc:"NOC GK 27 COL",kg:110,thc:26,release:"27.06.2026",type:"INDOOR",exp:"—"},
{strain:"PURPLE GUAVA",rnc:"PURPLE MOUNTAIN",noc:"NOC UG 21 COL",kg:51,thc:21,release:"11.07.2026",type:"GREENHOUSE",exp:"—"},
{strain:"CHERRY RELIEF",rnc:"CHERRY RELIEF",noc:"NOC CP 18 COL",kg:91,thc:18,release:"25.08.2026",type:"GREENHOUSE",exp:"SEP"},
{strain:"GUAVA HAZE",rnc:"GAIA 001",noc:"NOC GK 27 COL",kg:110,thc:26,release:"26.08.2026",type:"INDOOR",exp:"—"},
{strain:"LA CITRICA",rnc:"LA CITRICA",noc:"NOC CC 24 COL",kg:91,thc:26,release:"30.08.2026",type:"GREENHOUSE",exp:"—"},
{strain:"PURPLE GUAVA",rnc:"PURPLE MOUNTAIN",noc:"NOC UG 21 COL",kg:77,thc:21,release:"19.09.2026",type:"GREENHOUSE",exp:"—"},
{strain:"MANGO BLISS",rnc:"MANGO BLISS",noc:"NOC RM 21 COL",kg:91,thc:18,release:"12.10.2026",type:"GREENHOUSE",exp:"NOV"},
{strain:"GUAVA HAZE",rnc:"GAIA 001",noc:"NOC GK 27 COL",kg:110,thc:26,release:"25.10.2026",type:"INDOOR",exp:"—"},
{strain:"LA CITRICA",rnc:"LA CITRICA",noc:"NOC CC 24 COL",kg:171,thc:26,release:"23.11.2026",type:"GREENHOUSE",exp:"—"},
{strain:"PURPLE GUAVA",rnc:"PURPLE MOUNTAIN",noc:"NOC UG 21 COL",kg:98,thc:23,release:"24.11.2026",type:"GREENHOUSE",exp:"—"},
{strain:"GUAVA HAZE",rnc:"GAIA 001",noc:"NOC GK 27 COL",kg:110,thc:26,release:"24.12.2026",type:"INDOOR",exp:"JAN"},
{strain:"CHERRY RELIEF",rnc:"CHERRY RELIEF",noc:"NOC CP 18 COL",kg:101,thc:18,release:"04.01.2027",type:"GREENHOUSE",exp:"—"},
{strain:"PURPLE GUAVA",rnc:"PURPLE MOUNTAIN",noc:"NOC UG 21 COL",kg:98,thc:21,release:"10.01.2027",type:"GREENHOUSE",exp:"—"}
]},
hytn:{fl:"🇨🇦",n:"HYTN Cannabis Inc.",loc:"BC, Canada",batches:[
{id:"HY-01",p:"HYTN-01",qty:"25kg",stage:0,total:12,st:lang==="de"?"Geplant":"Planned",c:"#6b7280"}
],kpi:{stock:"0kg",btm:"0kg",sold:"0kg",revenue:"€0",value:"€0",margin:"—"},
alerts:[
{t:lang==="de"?"GMP Zertifikat ausstehend":"GMP Certificate pending",c:"#d97706",ic:"📄"},
{t:lang==="de"?"EU-GMP Aequivalenz beantragt":"EU-GMP Equivalence applied",c:"#2563eb",ic:"📋"},
{t:lang==="de"?"Produktspez. ausstehend":"Product spec. pending",c:"#d97706",ic:"📄"}
],docs:5,pics:true,reg:"Health Canada",shipActive:false,color:"#6b7280"}
};
const sd=supData[sup];
const allSups=Object.values(supData);
const totalAlerts=allSups.reduce((a,s)=>a+s.alerts.length,0);
const totalBatches=allSups.reduce((a,s)=>a+s.batches.length,0);
const totalDocs=allSups.reduce((a,s)=>a+s.docs,0);

return <div>
{/* ===== ALL-SUPPLIERS OVERVIEW ===== */}
<div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",borderRadius:10,padding:14,marginBottom:12,color:"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:19,fontWeight:800}}>📊 NOC Pharma — {lang==="de"?"Gesamtuebersicht":"Full Overview"}</div>
<div style={{fontSize:13,opacity:.7}}>3 {lang==="de"?"Lieferanten":"Suppliers"} · {totalBatches} {lang==="de"?"Chargen":"Batches"} · INCB 2026: 500 kg</div>
</div>
<div style={{display:"flex",gap:8}}>
{[[totalBatches+"",lang==="de"?"Chargen":"Batches","#4ade80"],[totalAlerts+"",lang==="de"?"Warnungen":"Alerts","#fbbf24"],[totalDocs+"",lang==="de"?"Dok.-Anforderungen":"Doc Requests","#f87171"],["500kg","INCB","#60a5fa"]].map(([v,l,c],j)=>
<div key={j} style={{textAlign:"center",padding:"4px 10px",background:"rgba(255,255,255,.1)",borderRadius:5}}>
<div style={{fontSize:15,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:11,opacity:.7}}>{l}</div>
</div>)}
</div>
</div>
</div>

{/* All 3 Supplier Mini-Dashboards */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
{allSups.map((s,si)=>{const sk=["cannava","mccn","hytn"][si];return <div key={si} style={{borderRadius:8,border:"2px solid "+(sup===sk?s.color+"88":"#e5e7eb"),overflow:"hidden",background:sup===sk?s.color+"08":"#fff"}}>
<div style={{padding:"8px 10px",background:s.color+"15",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}} onClick={()=>setSup(sk)}>
<div><div style={{fontSize:15,fontWeight:800}}>{s.fl} {s.n}</div><div style={{fontSize:11,color:"#6b7280"}}>{s.loc}</div></div>
<div style={{display:"flex",gap:3}}>{s.alerts.length>0&&<Bd c="#dc2626" b="#fee2e2">{s.alerts.length}</Bd>}<Bd c={s.color} b={s.color+"18"}>{s.reg}</Bd></div>
</div>
{/* Batch bars */}
<div style={{padding:"6px 10px"}}>
{s.batches.map((b,j)=><div key={j} style={{marginBottom:4}}>
<div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:1}}>
<span style={{fontWeight:700}}>{b.id} <span style={{fontWeight:400,color:"#6b7280"}}>{b.qty}</span></span>
<Bd c={b.c} b={b.c+"18"}>{b.st}</Bd>
</div>
<div style={{height:4,background:"#e5e7eb",borderRadius:2}}><div style={{height:4,background:b.c,borderRadius:2,width:(b.stage/b.total*100)+"%"}}/></div>
</div>)}
</div>
{/* KPI row */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderTop:"1px solid #f3f4f6",fontSize:11}}>
{[[lang==="de"?"Bestand":"Stock",s.kpi.stock],[lang==="de"?"Verkauft":"Sold",s.kpi.sold],[lang==="de"?"Wert":"Value",s.kpi.value]].map(([l,v],j)=>
<div key={j} style={{padding:"4px 6px",textAlign:"center",borderRight:j<2?"1px solid #f3f4f6":"none"}}>
<div style={{fontWeight:700,color:s.color}}>{v}</div><div style={{color:"#9ca3af"}}>{l}</div>
</div>)}
</div>
</div>})}
</div>

{/* ===== SELECTED SUPPLIER DASHBOARD ===== */}
<div style={{background:"linear-gradient(135deg,"+sd.color+"15,"+sd.color+"08)",borderRadius:10,padding:14,marginBottom:12,border:"2px solid "+sd.color+"33"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{fontSize:16,fontWeight:800,color:sd.color}}>{sd.fl} {sd.n} — Dashboard</div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>setPg("suppliers")} style={{padding:"4px 10px",borderRadius:4,fontSize:12,fontWeight:600,border:"1px solid "+sd.color,background:"#fff",color:sd.color,cursor:"pointer"}}>📧 {lang==="de"?"Dokumente anfordern":"Request Docs"}</button>
<button onClick={()=>setPg("supDocs")} style={{padding:"4px 10px",borderRadius:4,fontSize:12,fontWeight:600,border:"none",background:sd.color,color:"#fff",cursor:"pointer"}}>📂 {lang==="de"?"Dossier":"Dossier"}</button>
</div>
</div>

{/* KPI Cards */}
<div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginBottom:10}}>
{[
[lang==="de"?"Bestand":"Stock",sd.kpi.stock,sd.color],
[lang==="de"?"Verkauft":"Sold",sd.kpi.sold,"#2563eb"],
[lang==="de"?"Umsatz":"Revenue",sd.kpi.revenue,"#059669"],
[lang==="de"?"Warenwert":"Value",sd.kpi.value,"#7c3aed"],
[lang==="de"?"Marge":"Margin",sd.kpi.margin,"#059669"],
[lang==="de"?"Chargen":"Batches",sd.batches.length+"",sd.color]
].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:6,padding:6,textAlign:"center",border:"1px solid #e5e7eb"}}>
<div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:11,color:"#6b7280"}}>{l}</div>
</div>)}
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
{/* Batches */}
<div style={{background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>📦 {lang==="de"?"Chargen":"Batches"}</div>
{sd.batches.map((b,j)=><div key={j} onClick={()=>{setSelBatch(b.id);setPg("lifecycle");setLcs(Math.min(b.stage,11))}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:j<sd.batches.length-1?"1px solid #f3f4f6":"none",cursor:"pointer",fontSize:13}}>
<div><span style={{fontWeight:700}}>{b.id}</span> <span style={{color:"#6b7280"}}>{b.p} · {b.qty}</span></div>
<div style={{display:"flex",gap:3,alignItems:"center"}}>
<div style={{width:40,height:4,background:"#e5e7eb",borderRadius:2}}><div style={{height:4,background:b.c,borderRadius:2,width:(b.stage/b.total*100)+"%"}}/></div>
<Bd c={b.c} b={b.c+"18"}>{b.st}</Bd>
</div>
</div>)}
</div>

{/* Alerts */}
<div style={{background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6,display:"flex",justifyContent:"space-between"}}>
<span>🔔 {lang==="de"?"Handlungsbedarf":"Action Required"}</span>
<Bd c="#dc2626" b="#fee2e2">{sd.alerts.length}</Bd>
</div>
{sd.alerts.map((a,j)=><div key={j} onClick={()=>setPg("suppliers")} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 4px",marginBottom:2,borderRadius:3,background:a.c+"08",cursor:"pointer",fontSize:12}}>
<span>{a.ic}</span><span style={{color:a.c,fontWeight:600}}>{a.t}</span>
</div>)}
{sd.alerts.length>0&&<button onClick={()=>setPg("suppliers")} style={{width:"100%",marginTop:4,padding:"4px",borderRadius:4,fontSize:12,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>📧 {lang==="de"?"Alle anfordern":"Request All"}</button>}
</div>
</div>

{/* Uploaded docs for this supplier */}
{(()=>{const supUploads=uploads.filter(u=>u.sup===(sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN"));return supUploads.length>0?<div style={{marginTop:8,background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>📤 {lang==="de"?"Hochgeladene Dokumente":"Uploaded Documents"} ({supUploads.length})</div>
{supUploads.slice(0,6).map((u,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",borderBottom:j<Math.min(supUploads.length,6)-1?"1px solid #f3f4f6":"none",fontSize:12}}>
<div style={{display:"flex",alignItems:"center",gap:3}}><span>{u.type==="pdf"?"📄":"📎"}</span><span style={{fontWeight:600}}>{u.name.length>35?u.name.slice(0,35)+"...":u.name}</span></div>
<div style={{display:"flex",gap:3}}><Bd c="#2563eb" b="#dbeafe">{u.stage}</Bd>{u.url&&<button onClick={()=>window.open(u.url,"_blank")} style={{padding:"1px 4px",borderRadius:2,fontSize:8,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>👁️</button>}</div>
</div>)}
</div>:null})()}

{/* Quick Actions */}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginTop:8}}>
{[
["📤",lang==="de"?"Upload":"Upload",()=>fileRef.current&&fileRef.current.click(),sd.color],
["🔄",lang==="de"?"Lifecycle":"Lifecycle",()=>setPg("lifecycle"),"#2563eb"],
["📂",lang==="de"?"Dossier":"Dossier",()=>setPg("supDocs"),"#1e40af"],
["📧",lang==="de"?"Kontakt":"Contact",()=>setPg("suppliers"),"#dc2626"]
].map(([ic,l,fn,c],j)=><button key={j} onClick={fn} style={{padding:8,borderRadius:6,border:"1px solid "+c+"33",background:c+"08",cursor:"pointer",textAlign:"center"}}>
<div style={{fontSize:16}}>{ic}</div><div style={{fontSize:11,fontWeight:600,color:c}}>{l}</div>
</button>)}
</div>
</div>

{/* Harvest Calendar (MCCN) */}
{sd.harvest&&sd.harvest.length>0&&<div style={{marginTop:8,background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span>🌿 {lang==="de"?"Erntekalender 2026/2027 — MCCN":"Harvest Calendar 2026/2027 — MCCN"}</span>
<div style={{display:"flex",gap:4}}>
<Bd c="#059669" b="#dcfce7">{sd.harvest.length} {lang==="de"?"Ernten":"Harvests"}</Bd>
<Bd c="#7c3aed" b="#ede9fe">{sd.harvest.reduce((a,h)=>a+h.kg,0)}kg {lang==="de"?"gesamt":"total"}</Bd>
</div>
</div>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
<thead><tr style={{background:"#fef3c7"}}>
{["#","Strain","RNC",lang==="de"?"NOC Name":"NOC Name","kg","THC%",lang==="de"?"Freigabe":"Release",lang==="de"?"Typ":"Type",lang==="de"?"Export":"Export"].map((h,j)=>
<th key={j} style={{padding:"4px 6px",textAlign:"left",fontWeight:700,fontSize:11,color:"#92400e",borderBottom:"1px solid #fde68a",whiteSpace:"nowrap"}}>{h}</th>)}
</tr></thead>
<tbody>
{sd.harvest.map((h,j)=>{const mo=parseInt(h.release.split(".")[1]);const isNext=mo>=2&&mo<=4;return <tr key={j} style={{borderBottom:"1px solid #fef3c7",background:isNext?"#eff6ff":h.exp&&h.exp!=="—"?"#f0fdf4":"#fff"}}>
<td style={{padding:"3px 6px",color:"#9ca3af"}}>{j+1}</td>
<td style={{padding:"3px 6px",fontWeight:700,color:"#92400e"}}>{h.strain}</td>
<td style={{padding:"3px 6px",fontSize:11,color:"#6b7280"}}>{h.rnc}</td>
<td style={{padding:"3px 6px",fontWeight:600,color:"#1e40af"}}>{h.noc}</td>
<td style={{padding:"3px 6px",fontWeight:700}}>{h.kg}</td>
<td style={{padding:"3px 6px",fontWeight:600,color:"#059669"}}>{h.thc}%</td>
<td style={{padding:"3px 6px"}}>{h.release}</td>
<td style={{padding:"3px 6px"}}><Bd c={h.type==="INDOOR"?"#7c3aed":"#059669"} b={h.type==="INDOOR"?"#ede9fe":"#dcfce7"}>{h.type}</Bd></td>
<td style={{padding:"3px 6px",fontWeight:h.exp&&h.exp!=="—"?700:400,color:h.exp&&h.exp!=="—"?"#059669":"#d1d5db"}}>{h.exp||"—"}</td>
</tr>})}
</tbody>
</table>
</div>
{/* Monthly timeline bar */}
<div style={{marginTop:8,display:"flex",gap:2}}>
{["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan"].map((m,j)=>{const cnt=sd.harvest.filter(h=>{const mo=parseInt(h.release.split(".")[1]);const map={4:0,5:1,6:2,7:3,8:4,9:5,10:6,11:7,12:8,1:9};return map[mo]===j}).length;return <div key={j} style={{flex:1,textAlign:"center",padding:"4px 2px",borderRadius:3,background:cnt>0?"#d97706":"#f3f4f6",color:cnt>0?"#fff":"#9ca3af",fontSize:11,fontWeight:cnt>0?700:400}}>
<div>{m}</div>{cnt>0&&<div style={{fontSize:8}}>{cnt}</div>}
</div>})}
</div>
<div style={{marginTop:4,fontSize:11,color:"#6b7280"}}>{lang==="de"?"Quelle: PROGRAMACION COSECHAS 2026 MCCN · Sheet A (1,176kg) + Sheet B (600kg) = 1,776kg Jahreskapazitaet":"Source: PROGRAMACION COSECHAS 2026 MCCN · Sheet A (1,176kg) + Sheet B (600kg) = 1,776kg annual capacity"}</div>
</div>}

{/* BI-03 Banner (only for Cannava) */}
{sup==="cannava"&&<div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:8,padding:12,color:"#fff",cursor:"pointer",marginBottom:10}} onClick={()=>{setSelBatch("BI-03");setPg("lifecycle");setLcs(2)}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:16,fontWeight:800}}>✈️ BI-03 — {lang==="de"?"AKTIVE SENDUNG":"ACTIVE SHIPMENT"}</div><div style={{fontSize:13,opacity:.8}}>NOC SE 20 · 60kg · EZE → FRA → Anklam</div></div>
<div style={{display:"flex",gap:8}}><div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:800}}>19.4°C</div><div style={{fontSize:8,opacity:.7}}>LIVE</div></div><div style={{textAlign:"center"}}><div style={{fontSize:16,fontWeight:800}}>ETA 27.02</div><div style={{fontSize:8,opacity:.7}}>{lang==="de"?"Ankunft":"Arrival"}</div></div></div>
</div>
</div>}

{/* Bottom: BtM + Finance + Expiry */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
<div style={{background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb",cursor:"pointer"}} onClick={()=>setPg("btm")}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>⚖️ BtM</div>
{[[lang==="de"?"Bestand":"Stock","198.36 kg"],[lang==="de"?"INCB":"INCB","500kg (39.7%)"],[lang==="de"?"Differenz":"Variance","0 ✅"]].map(([l,v],j)=>
<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:12,borderBottom:j<2?"1px solid #f3f4f6":"none"}}><span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>)}
</div>
<div style={{background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb",cursor:"pointer"}} onClick={()=>setPg("finance")}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>💰 {lang==="de"?"Finanzen":"Finance"}</div>
{[[lang==="de"?"Warenwert":"Value","€625,275"],[lang==="de"?"Umsatz":"Revenue","€49,770"],[lang==="de"?"Marge":"Margin","~62%"]].map(([l,v],j)=>
<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:12,borderBottom:j<2?"1px solid #f3f4f6":"none"}}><span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>)}
</div>
<div style={{background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>📦 {lang==="de"?"Verfallsdaten":"Expiry"}</div>
{[["BI-01-EXP",47,"#dc2626"],["BI-01-005",169,"#d97706"],["BI-02",442,"#059669"]].map(([p,d,c],j)=>
<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:12,borderBottom:j<2?"1px solid #f3f4f6":"none"}}><span style={{fontWeight:600}}>{p}</span><Bd c={c} b={c+"18"}>{d}d</Bd></div>)}
</div>
</div>
</div>})()}
</div>,
lifecycle:sup==="cannava"||sup==="hytn"||sup==="mccn"?<div>
{/* Batch selector */}
<div style={{marginBottom:12,padding:12,background:"#fff",borderRadius:8,border:"1px solid #e5e7eb"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
<div style={{fontSize:16,fontWeight:700,color:"#374151"}}>{curSup.fl} {curSup.n} — {lang==="de"?"Importe / Chargen":"Imports / Batches"} ({supBatches.length})</div>
{curBatch&&<div style={{fontSize:14,color:"#6b7280"}}>{lang==="de"?"Aktive Charge":"Active Batch"}: <strong style={{color:curBatch.color}}>{curBatch.id}</strong></div>}
</div>
<div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
{supBatches.map(b=><button key={b.id} onClick={()=>setSelBatch(b.id)} style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderRadius:8,border:selBatch===b.id?"2px solid "+b.color:"1.5px solid #e5e7eb",background:selBatch===b.id?b.color+"10":"#fff",cursor:"pointer",transition:"all .15s"}}>
<div style={{width:8,height:8,borderRadius:"50%",background:b.status==="closed"?"#6b7280":b.status==="active"?b.color:"#d1d5db"}}/>
<div style={{textAlign:"left"}}>
<div style={{fontSize:15,fontWeight:700,color:selBatch===b.id?b.color:"#374151"}}>{b.id}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{b.kg}kg • {b.import}</div>
</div>
<div style={{fontSize:12,padding:"2px 6px",borderRadius:4,background:b.status==="closed"?"#f3f4f6":b.status==="active"?"#dcfce7":"#f3f4f6",color:b.status==="closed"?"#6b7280":b.status==="active"?"#059669":"#9ca3af",fontWeight:600}}>{b.stageLabel}</div>
</button>)}
</div>
</div>

{/* Stage buttons */}
<div style={{display:"flex",gap:3,marginBottom:10,flexWrap:"wrap"}}>{SG.map((st,j)=><button key={j} onClick={()=>{setLcs(j);setExDoc(null)}} style={{padding:"4px 7px",borderRadius:5,fontSize:14,fontWeight:600,border:lcs===j?"2px solid "+st.c:"1px solid #d1d5db",background:j<sn?st.c+"12":"#fff",color:j<sn?st.c:"#9ca3af",cursor:"pointer"}}>{st.ic} {st.id}</button>)}</div><div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:10}}><Cd t={lang==="de"?"Stufen":"Stages"}>{SG.map((st,j)=>{const dn=j<sn;return <div key={j} onClick={()=>{setLcs(j);setExDoc(null)}} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 7px",borderRadius:5,cursor:"pointer",background:lcs===j?st.c+"10":"transparent",border:lcs===j?"1.5px solid "+st.c:"1.5px solid transparent",opacity:dn||j===sn?1:.4,marginBottom:1}}><span style={{width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,background:dn?st.c:"#e5e7eb",color:dn?"#fff":"#9ca3af",flexShrink:0}}>{dn?"✓":st.ic}</span><div style={{fontSize:14,fontWeight:600,color:dn?st.c:"#6b7280"}}>{st.id} {t[st.n]||""}</div></div>})}</Cd><div><SD/></div></div></div>:<OnboardWS/>,
batches:<div>
{/* Batch Overview Header */}
<div style={{background:"linear-gradient(135deg,#1e3a5f,#1e40af)",borderRadius:10,padding:16,marginBottom:14,color:"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:22,fontWeight:800}}>📦 {lang==="de"?"Chargen-Verwaltung":"Batch Management"}</div>
<div style={{fontSize:14,opacity:.8}}>EU GMP Annex 11 · AMWHV §19 · {lang==="de"?"Rueckverfolgbarkeit":"Traceability"}</div>
</div>
<div style={{display:"flex",gap:8}}>
{[[lang==="de"?"Gesamt":"Total","6","#fff"],[lang==="de"?"Aktiv":"Active","3","#4ade80"],[lang==="de"?"Geplant":"Planned","2","#fbbf24"],[lang==="de"?"Abgeschlossen":"Completed","1","#94a3b8"]].map(([l,v,c],j)=>
<div key={j} style={{textAlign:"center",padding:"6px 14px",background:"rgba(255,255,255,.12)",borderRadius:6}}>
<div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:12,opacity:.8}}>{l}</div>
</div>)}
</div>
</div>
</div>

{/* Batch Table */}
<Cd t={lang==="de"?"Alle Chargen (6)":"All Batches (6)"}>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
<thead>
<tr style={{background:"#f1f5f9"}}>
{[lang==="de"?"Charge":"Batch",lang==="de"?"Produkt":"Product",lang==="de"?"Lieferant":"Supplier",lang==="de"?"Menge":"Quantity","PZN",lang==="de"?"Stufe":"Stage",lang==="de"?"Status":"Status",lang==="de"?"Eingang":"Received",lang==="de"?"Freigabe":"Released","THC",lang==="de"?"Lagerort":"Location",lang==="de"?"Aktion":"Action"].map((h,j)=>
<th key={j} style={{padding:"6px 8px",borderBottom:"2px solid #cbd5e1",textAlign:"left",fontWeight:700,fontSize:12,color:"#475569",whiteSpace:"nowrap"}}>{h}</th>)}
</tr>
</thead>
<tbody>
{[
{id:"BI-01",full:"NOC-BI01-SE17-INF-F",p:"NOC SE 17",sup:"🇦🇷 Cannava",qty:"59.5 kg",pzn:"18706190",stage:"M6",stC:"#6366f1",st:lang==="de"?"Abgeschlossen":"Completed",stC2:"#6b7280",recv:"22.03.2025",rel:"15.05.2025",thc:"19.5%",loc:lang==="de"?"Verkauft / Archiviert":"Sold / Archived",click:()=>{setSup("cannava");setSelBatch("BI-01");setPg("lifecycle");setLcs(11)}},
{id:"BI-02",full:"BI-02-NOCB1.1-INF-F",p:"NOC SE 19",sup:"🇦🇷 Cannava",qty:"198.5 kg",pzn:"18706209",stage:"M4.5",stC:"#ea580c",st:lang==="de"?"Lagerung":"Storage",stC2:"#059669",recv:"14.11.2025",rel:"10.12.2025",thc:"20.1%",loc:"Kahla Commercial",click:()=>{setSup("cannava");setSelBatch("BI-02");setPg("lifecycle");setLcs(9)}},
{id:"BI-03",full:"NOC-BI03-SE20-INF-F",p:"NOC SE 20",sup:"🇦🇷 Cannava",qty:"60 kg",pzn:"TBD",stage:"M1",stC:"#0891b2",st:lang==="de"?"Transport":"In Transit",stC2:"#d97706",recv:"ETA 27.02",rel:"—",thc:"Est. 19%",loc:lang==="de"?"Unterwegs FRA→Anklam":"In Transit FRA→Anklam",click:()=>{setSup("cannava");setSelBatch("BI-03");setPg("lifecycle");setLcs(2)}},
{id:"BI-04",full:"NOC-BI04-SE21-INF-F",p:"NOC SE 21",sup:"🇦🇷 Cannava",qty:"60 kg",pzn:"TBD",stage:"M0",stC:"#b45309",st:lang==="de"?"Geplant":"Planned",stC2:"#6b7280",recv:"Q2 2026",rel:"—",thc:"Est. 19%",loc:"—",click:()=>{setSup("cannava");setSelBatch("BI-04");setPg("lifecycle");setLcs(0)}},
{id:"MC-01",full:"NOC-MC01-THC01",p:"MCCN THC-01",sup:"🇨🇴 Medcolcanna",qty:"40 kg",pzn:"TBD",stage:"M0",stC:"#b45309",st:lang==="de"?"Qualifizierung":"Qualification",stC2:"#d97706",recv:"Q3 2026",rel:"—",thc:"TBD",loc:"—",click:()=>{setSup("mccn");setSelBatch("MC-01");setPg("lifecycle");setLcs(0)}},
{id:"HY-01",full:"NOC-HY01-IND01",p:"HYTN-01",sup:"🇨🇦 HYTN",qty:"25 kg",pzn:"TBD",stage:"M0",stC:"#b45309",st:lang==="de"?"Geplant":"Planned",stC2:"#6b7280",recv:"Q3 2026",rel:"—",thc:"TBD",loc:"—",click:()=>{setSup("hytn");setSelBatch("HY-01");setPg("lifecycle");setLcs(0)}}
].map((b,j)=><tr key={j} style={{borderBottom:"1px solid #f1f5f9",cursor:"pointer",background:b.id==="BI-03"?"#eff6ff":"#fff"}} onClick={b.click}>
<td style={{padding:"6px 8px"}}><div style={{fontWeight:700,color:"#1e40af",fontSize:14}}>{b.id}</div><div style={{fontSize:11,color:"#6b7280",fontFamily:"monospace"}}>{b.full}</div></td>
<td style={{padding:"6px 8px",fontWeight:600}}>{b.p}</td>
<td style={{padding:"6px 8px",fontSize:13}}>{b.sup}</td>
<td style={{padding:"6px 8px",fontWeight:600}}>{b.qty}</td>
<td style={{padding:"6px 8px",fontSize:12,fontFamily:"monospace"}}>{b.pzn}</td>
<td style={{padding:"6px 8px"}}><Bd c={b.stC} b={b.stC+"18"}>{b.stage}</Bd></td>
<td style={{padding:"6px 8px"}}><Bd c={b.stC2} b={b.stC2+"18"}>{b.st}</Bd></td>
<td style={{padding:"6px 8px",fontSize:12}}>{b.recv}</td>
<td style={{padding:"6px 8px",fontSize:12}}>{b.rel}</td>
<td style={{padding:"6px 8px",fontWeight:600,color:b.thc!=="TBD"?"#059669":"#9ca3af"}}>{b.thc}</td>
<td style={{padding:"6px 8px",fontSize:12}}>{b.loc}</td>
<td style={{padding:"6px 8px"}}><button onClick={e=>{e.stopPropagation();b.click()}} style={{padding:"3px 8px",borderRadius:4,fontSize:12,fontWeight:600,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>{lang==="de"?"Oeffnen":"Open"}</button></td>
</tr>)}
</tbody>
</table>
</div>
</Cd>

{/* Batch Details Cards */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12}}>
{/* BI-03 Active Shipment */}
<div style={{padding:12,background:"#eff6ff",borderRadius:8,border:"2px solid #3b82f6"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{fontSize:16,fontWeight:800,color:"#1e40af"}}>✈️ BI-03</div>
<Bd c="#d97706" b="#fef3c7">{lang==="de"?"AKTIV":"ACTIVE"}</Bd>
</div>
<div style={{fontSize:14,fontWeight:600}}>NOC SE 20 · 60 kg</div>
<div style={{fontSize:13,color:"#6b7280",marginBottom:6}}>🇦🇷 Cannava · AWB 023-87654321</div>
{[
[lang==="de"?"Route":"Route","EZE → FRA → Anklam"],
[lang==="de"?"Spediteur":"Carrier","WAS-Logistics GmbH"],
["ETA","27.02.2026 ~18:00"],
[lang==="de"?"Temperatur":"Temperature","19.4°C (LIVE)"],
[lang==="de"?"BfArM Genehmigung":"BfArM Permit","E-12267/2025"],
["INCB","50/500 kg"]
].map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:12,borderBottom:"1px solid #dbeafe"}}>
<span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
</div>)}
<button onClick={()=>{setSup("cannava");setSelBatch("BI-03");setPg("lifecycle");setLcs(2)}} style={{width:"100%",marginTop:6,padding:"5px",borderRadius:4,fontSize:13,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>{lang==="de"?"Sendung verfolgen":"Track Shipment"}</button>
</div>

{/* BI-02 In Storage */}
<div style={{padding:12,background:"#f0fdf4",borderRadius:8,border:"1px solid #a7f3d0"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{fontSize:16,fontWeight:800,color:"#059669"}}>📦 BI-02</div>
<Bd c="#059669" b="#dcfce7">{lang==="de"?"FREIGEGEBEN":"RELEASED"}</Bd>
</div>
<div style={{fontSize:14,fontWeight:600}}>NOC SE 19 · 198.5 kg</div>
<div style={{fontSize:13,color:"#6b7280",marginBottom:6}}>🇦🇷 Cannava · PZN 18706209</div>
{[
["QP","Dr. O. Schagon"],
[lang==="de"?"Freigabe":"Release","10.12.2025 (CGZ-2025-003)"],
["THC","20.1% (QSI HPLC-DAD)"],
[lang==="de"?"Lagerort":"Location","Kahla Im Camisch 14"],
[lang==="de"?"Verkauft":"Sold","15.8 kg (7.9%)"],
[lang==="de"?"Verfuegbar":"Available","182.7 kg"]
].map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:12,borderBottom:"1px solid #dcfce7"}}>
<span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
</div>)}
<button onClick={()=>{setSup("cannava");setSelBatch("BI-02");setPg("lifecycle");setLcs(9)}} style={{width:"100%",marginTop:6,padding:"5px",borderRadius:4,fontSize:13,fontWeight:700,border:"1px solid #059669",background:"#fff",color:"#059669",cursor:"pointer"}}>{lang==="de"?"Charge oeffnen":"Open Batch"}</button>
</div>

{/* BI-04 Planned */}
<div style={{padding:12,background:"#f9fafb",borderRadius:8,border:"1px solid #e5e7eb"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{fontSize:16,fontWeight:800,color:"#6b7280"}}>📋 BI-04</div>
<Bd c="#6b7280" b="#f3f4f6">{lang==="de"?"GEPLANT":"PLANNED"}</Bd>
</div>
<div style={{fontSize:14,fontWeight:600}}>NOC SE 21 · 60 kg</div>
<div style={{fontSize:13,color:"#6b7280",marginBottom:6}}>🇦🇷 Cannava · Q2 2026</div>
{[
[lang==="de"?"Ernte":"Harvest",lang==="de"?"April 2026 (Outdoor)":"April 2026 (Outdoor)"],
[lang==="de"?"Versand":"Shipment","Jun 2026"],
["BfArM",lang==="de"?"Beantragt":"Applied"],
["INCB","60/500 kg"],
[lang==="de"?"GMP Audit":"GMP Audit",lang==="de"?"Geplant Maerz 2026":"Planned Mar 2026"],
[lang==="de"?"Geschaetzter Wert":"Est. Value","€189K"]
].map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:12,borderBottom:"1px solid #f3f4f6"}}>
<span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
</div>)}
<button onClick={()=>{setSup("cannava");setSelBatch("BI-04");setPg("lifecycle");setLcs(0)}} style={{width:"100%",marginTop:6,padding:"5px",borderRadius:4,fontSize:13,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#6b7280",cursor:"pointer"}}>{lang==="de"?"Vorbereiten":"Prepare"}</button>
</div>
</div>

{/* Pipeline Timeline */}
<Cd t={lang==="de"?"Import-Pipeline 2026":"Import Pipeline 2026"}>
<div style={{display:"flex",gap:4,alignItems:"center",padding:"8px 0"}}>
{[
{id:"BI-01",c:"#6b7280",st:lang==="de"?"Abgeschlossen":"Done",w:"10%"},
{id:"BI-02",c:"#059669",st:lang==="de"?"Lagerung":"Storage",w:"25%"},
{id:"BI-03",c:"#3b82f6",st:lang==="de"?"Transport":"Transit",w:"20%"},
{id:"BI-04",c:"#d97706",st:lang==="de"?"Geplant":"Planned",w:"15%"},
{id:"MC-01",c:"#dc2626",st:lang==="de"?"Qualifizierung":"Qualification",w:"15%"},
{id:"HY-01",c:"#7c3aed",st:lang==="de"?"Geplant":"Planned",w:"15%"}
].map((b,j)=><div key={j} style={{width:b.w,padding:"8px 6px",background:b.c+"15",borderRadius:6,border:"2px solid "+b.c,textAlign:"center"}}>
<div style={{fontSize:14,fontWeight:800,color:b.c}}>{b.id}</div>
<div style={{fontSize:11,color:"#6b7280"}}>{b.st}</div>
</div>)}
</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:4}}>
{lang==="de"?"2026 Forecast: 500 kg total (Cannava 320kg + Medcolcanna 130kg + HYTN 50kg) · INCB Kontingent: 500 kg":"2026 Forecast: 500 kg total (Cannava 320kg + Medcolcanna 130kg + HYTN 50kg) · INCB Quota: 500 kg"}
</div>
</Cd>

{/* Actions */}
<div style={{display:"flex",gap:8}}>
<button onClick={()=>{const w=window.open("","_blank","width=800,height=700");w.document.write('<html><head><title>Batch Register</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:11px}h1{font-size:16px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:6px}h2{font-size:13px;margin-top:14px}table{width:100%;border-collapse:collapse;margin:6px 0}td,th{padding:4px 6px;border:1px solid #d1d5db;font-size:9px}th{background:#f1f5f9}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:8px;color:#9ca3af;text-align:center}.banner{background:#1e40af;color:#fff;padding:12px 30px;margin:-30px -30px 16px}@media print{body{padding:15px}.banner{margin:-15px -15px 12px}}</style></head><body>');w.document.write('<div class="banner"><strong>NOC Pharma GmbH</strong> — Chargenregister / Batch Register</div>');w.document.write('<h1>Chargenregister / Batch Register</h1>');w.document.write('<h2>Deutsch</h2><table><tr><th>Charge</th><th>Produkt</th><th>Lieferant</th><th>Menge</th><th>PZN</th><th>Stufe</th><th>Status</th><th>THC</th></tr>');[["BI-01","NOC SE 17","Cannava","59.5kg","18706190","M6","Abgeschlossen","19.5%"],["BI-02","NOC SE 19","Cannava","198.5kg","18706209","M4.5","Lagerung","20.1%"],["BI-03","NOC SE 20","Cannava","60kg","TBD","M1","Transport","~19%"],["BI-04","NOC SE 21","Cannava","60kg","TBD","M0","Geplant","~19%"],["MC-01","MCCN THC-01","Medcolcanna","40kg","TBD","M0","Qualifizierung","TBD"],["HY-01","HYTN-01","HYTN","25kg","TBD","M0","Geplant","TBD"]].forEach(function(r){w.document.write("<tr>");r.forEach(function(v){w.document.write("<td>"+v+"</td>")});w.document.write("</tr>")});w.document.write('</table><h2>English</h2><table><tr><th>Batch</th><th>Product</th><th>Supplier</th><th>Quantity</th><th>PZN</th><th>Stage</th><th>Status</th><th>THC</th></tr>');[["BI-01","NOC SE 17","Cannava","59.5kg","18706190","M6","Completed","19.5%"],["BI-02","NOC SE 19","Cannava","198.5kg","18706209","M4.5","Storage","20.1%"],["BI-03","NOC SE 20","Cannava","60kg","TBD","M1","In Transit","~19%"],["BI-04","NOC SE 21","Cannava","60kg","TBD","M0","Planned","~19%"],["MC-01","MCCN THC-01","Medcolcanna","40kg","TBD","M0","Qualification","TBD"],["HY-01","HYTN-01","HYTN","25kg","TBD","M0","Planned","TBD"]].forEach(function(r){w.document.write("<tr>");r.forEach(function(v){w.document.write("<td>"+v+"</td>")});w.document.write("</tr>")});w.document.write('</table><div class="ft">NOC Pharma GmbH · QMS v2.5 · EU GMP Annex 11 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>
🖨️ {lang==="de"?"Chargenregister drucken (DE+EN)":"Print Batch Register (DE+EN)"}
</button>
<button onClick={()=>{const body="NOC PHARMA GmbH\nBatch Register\n"+"=".repeat(40)+"\n\nBI-01: NOC SE 17 | 59.5kg | M6 Completed | THC 19.5%\nBI-02: NOC SE 19 | 198.5kg | M4.5 Storage | THC 20.1%\nBI-03: NOC SE 20 | 60kg | M1 In Transit | THC ~19%\nBI-04: NOC SE 21 | 60kg | M0 Planned\nMC-01: MCCN THC-01 | 40kg | M0 Qualification\nHY-01: HYTN-01 | 25kg | M0 Planned\n\n2026 Total: 500 kg (INCB Quota)\n\n"+"=".repeat(40)+"\nNOC Pharma GmbH · QMS v2.5";window.open(gmailLink("NOC Pharma — Batch Register — "+new Date().toLocaleDateString("de-DE"),body),"_blank")}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>
📧 {lang==="de"?"Bericht senden":"Send Report"}
</button>
</div>
</div>,
suppliers:<div>
{[
{k:"cannava",fl:"🇦🇷",n:"Cannabis Avatara S.E.",loc:"Pocito, San Juan, Argentina",route:"Buenos Aires → Frankfurt",reg:"ANMAT (PIC/S member)",pics:true,wc:false,st:"active",stL:lang==="de"?"Aktiv":"Active",stC:"#059669",audit:"12.02.2026",auditW:true,
docs:[
{n:lang==="de"?"Herstellungserlaubnis":"Manufacturing License",ref:"ANMAT Disp. 2025/1847",exp:"31.12.2025",days:-58,st:"expired",to:"ruiz@cannava.gob.ar"},
{n:"Quality Technical Agreement",ref:"QTA-NOC-CANN-2024-01",exp:"15.03.2026",days:16,st:"warning",to:"ruiz@cannava.gob.ar"},
{n:lang==="de"?"GMP Auditbericht (Erneuerung)":"GMP Audit Report (Renewal)",ref:"NOC-AUDIT-CANN-2025-01",exp:"12.02.2026",days:-15,st:"overdue",to:"ruiz@cannava.gob.ar"},
{n:"COA BI-03",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"ruiz@cannava.gob.ar"},
{n:lang==="de"?"Phytosanitaeres Zeugnis BI-03":"Phytosanitary Cert. BI-03",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"ruiz@cannava.gob.ar"},
{n:lang==="de"?"Packliste BI-03 (60kg)":"Packing List BI-03 (60kg)",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"ruiz@cannava.gob.ar"},
{n:"INCB Allocation 2026",ref:lang==="de"?"Erneuerung erforderlich":"Renewal required",exp:"31.12.2025",days:-58,st:"expired",to:"ruiz@cannava.gob.ar"},
{n:lang==="de"?"Versicherungsnachweis 2026":"Insurance Certificate 2026",ref:lang==="de"?"Erneuerung erforderlich":"Renewal required",exp:"31.12.2025",days:-58,st:"expired",to:"ruiz@cannava.gob.ar"}
]},
{k:"hytn",fl:"🇨🇦",n:"HYTN Cannabis Inc.",loc:"British Columbia, Canada",route:"Canada → Frankfurt",reg:"Health Canada (PIC/S)",pics:true,wc:false,st:"planned",stL:lang==="de"?"Geplant":"Planned",stC:"#6b7280",audit:"TBD",auditW:false,
docs:[
{n:"GMP Certificate (Health Canada)",ref:lang==="de"?"Angefordert":"Requested",exp:"—",days:0,st:"missing",to:"qp@hytn.ca"},
{n:"EU-GMP Equivalence Cert.",ref:lang==="de"?"Beantragt":"Applied",exp:"—",days:0,st:"pending",to:"qp@hytn.ca"},
{n:"Quality Technical Agreement",ref:lang==="de"?"Entwurf gesendet":"Draft sent",exp:"—",days:0,st:"pending",to:"qp@hytn.ca"},
{n:lang==="de"?"Produktspezifikation":"Product Specification",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"qp@hytn.ca"},
{n:"COA (Sample Batch)",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"qp@hytn.ca"}
]},
{k:"mccn",fl:"🇨🇴",n:"MEDCOLCANNA S.A.S.",loc:"Bogota D.C., Colombia",route:"Colombia → Frankfurt",reg:"FNE/INVIMA (NOT PIC/S)",pics:false,wc:true,st:"qualification",stL:lang==="de"?"Qualifizierung":"Qualification",stC:"#d97706",audit:"15.09.2026",auditW:false,
docs:[
{n:"GMP Certificate (INVIMA)",ref:lang==="de"?"Angefordert":"Requested",exp:"—",days:0,st:"missing",to:"qp@medcolcanna.com"},
{n:lang==="de"?"Schriftl. Bestaetigung (Art. 46b)":"Written Confirmation (Art. 46b)",ref:lang==="de"?"PFLICHT":"MANDATORY",exp:"—",days:0,st:"critical",to:"qp@medcolcanna.com"},
{n:lang==="de"?"Exportgenehmigung (FNE)":"Export License (FNE)",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"qp@medcolcanna.com"},
{n:"Quality Technical Agreement",ref:lang==="de"?"Entwurf":"Draft",exp:"—",days:0,st:"pending",to:"qp@medcolcanna.com"},
{n:"GACP/GMP Audit Report",ref:lang==="de"?"Geplant Sep 2026":"Planned Sep 2026",exp:"—",days:0,st:"pending",to:"qp@medcolcanna.com"},
{n:lang==="de"?"Produktspezifikation":"Product Specification",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"qp@medcolcanna.com"},
{n:lang==="de"?"Stabilitaetsdaten":"Stability Data",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"qp@medcolcanna.com"},
{n:"COA (Sample Batch)",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"qp@medcolcanna.com"}
]}
].map((s,si)=>{
const actionDocs=s.docs.filter(d=>d.st!=="ok");
const supEmail=s.docs[0]?.to||"";
return <div key={si} style={{marginBottom:12,borderRadius:8,border:"1px solid "+(s.st==="active"?"#a7f3d0":s.st==="qualification"?"#fde68a":"#e5e7eb"),overflow:"hidden"}}>
<div style={{padding:"10px 14px",background:s.st==="active"?"#f0fdf4":s.st==="qualification"?"#fffbeb":"#f9fafb",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:15,fontWeight:800}}>{s.fl} {s.n}</div><div style={{fontSize:13,color:"#6b7280"}}>{s.loc}</div></div>
<div style={{display:"flex",gap:6,alignItems:"center"}}>
{actionDocs.length>0&&<Bd c="#dc2626" b="#fee2e2">{actionDocs.length} {lang==="de"?"Aktionen":"Actions"}</Bd>}
<Bd c={s.stC} b={s.stC+"18"}>{s.stL}</Bd>
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",padding:"8px 14px",background:"#fff",borderBottom:"1px solid #f3f4f6",fontSize:13}}>
<div><div style={{color:"#9ca3af",fontSize:12,fontWeight:600}}>Route</div><div style={{fontWeight:600}}>{s.route}</div></div>
<div><div style={{color:"#9ca3af",fontSize:12,fontWeight:600}}>{lang==="de"?"Behoerde":"Regulatory"}</div><div style={{fontWeight:600}}>{s.reg}</div></div>
<div><div style={{color:"#9ca3af",fontSize:12,fontWeight:600}}>{lang==="de"?"Naechster Audit":"Next Audit"}</div><div style={{fontWeight:600,color:s.auditW?"#d97706":"#374151"}}>{s.audit} {s.auditW?"⚠️":""}</div></div>
<div><div style={{color:"#9ca3af",fontSize:12,fontWeight:600}}>{lang==="de"?"Schr. Best.":"Written Conf."}</div><div style={{fontWeight:600}}>{s.wc?<span style={{color:"#dc2626"}}>🔴 {lang==="de"?"PFLICHT (Art. 46b)":"REQUIRED (Art. 46b)"}</span>:<span style={{color:"#059669"}}>✅ {lang==="de"?"Nicht erfordl.":"Not required"}</span>}</div></div>
</div>
{s.wc&&<div style={{padding:"6px 14px",background:"#fef2f2",fontSize:13,color:"#991b1b"}}>🔴 {lang==="de"?"Kolumbien NICHT auf EU-GMP-Aequivalenzliste. Schriftliche Bestaetigung von INVIMA gemaess Art. 46b zwingend vor JEDEM Import.":"Colombia NOT on EU GMP equivalence list. Written Confirmation from INVIMA mandatory per Art. 46b before ANY import."}</div>}
{actionDocs.length>0&&<div style={{padding:"8px 14px"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:4,color:"#7f1d1d"}}>{lang==="de"?"Handlungsbedarf":"Action Required"} ({actionDocs.length})</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}><thead><tr style={{background:"#fef2f2"}}>
{[lang==="de"?"Dokument":"Document",lang==="de"?"Status":"Status",lang==="de"?"Ablauf":"Expires",""].map((h,j)=>
<th key={j} style={{padding:"3px 6px",textAlign:"left",fontWeight:700,fontSize:11,color:"#7f1d1d",borderBottom:"1px solid #fca5a5"}}>{h}</th>)}
</tr></thead><tbody>
{actionDocs.map((d,j)=><tr key={j} style={{borderBottom:"1px solid #fef2f2"}}>
<td style={{padding:"3px 6px",fontWeight:600}}>{d.n}</td>
<td style={{padding:"3px 6px"}}>{d.st==="expired"?<Bd c="#dc2626" b="#fee2e2">{lang==="de"?"Abgelaufen":"Expired"}</Bd>:d.st==="overdue"?<Bd c="#dc2626" b="#fee2e2">{lang==="de"?"Ueberfaellig":"Overdue"}</Bd>:d.st==="missing"?<Bd c="#d97706" b="#fef3c7">{lang==="de"?"Fehlend":"Missing"}</Bd>:d.st==="critical"?<Bd c="#dc2626" b="#fee2e2">{lang==="de"?"Kritisch":"Critical"}</Bd>:d.st==="warning"?<Bd c="#d97706" b="#fef3c7">{d.days}d</Bd>:<Bd c="#2563eb" b="#dbeafe">{lang==="de"?"Ausstehend":"Pending"}</Bd>}</td>
<td style={{padding:"3px 6px",fontSize:11,color:d.days<0?"#dc2626":"#6b7280"}}>{d.exp}</td>
<td style={{padding:"3px 6px"}}><button onClick={()=>{const body=(lang==="de"?"Sehr geehrtes "+s.n+" Team,\n\nwir benoetigen dringend:\n\n📄 "+d.n+"\nStatus: "+(d.st==="expired"?"ABGELAUFEN":d.st==="missing"?"FEHLEND":d.st==="critical"?"KRITISCH/PFLICHT":"AUSSTEHEND")+"\n\nBitte senden Sie dieses Dokument baldmoeglichst.\n\nMit freundlichen Gruessen,\nCelso Hamelink\nRP (§52a AMG) · NOC Pharma GmbH":"Dear "+s.n+" Team,\n\nWe urgently require:\n\n📄 "+d.n+"\nStatus: "+(d.st==="expired"?"EXPIRED":d.st==="missing"?"MISSING":d.st==="critical"?"CRITICAL/MANDATORY":"PENDING")+"\n\nPlease send this document at your earliest convenience.\n\nBest regards,\nCelso Hamelink\nRP (Par.52a AMG) · NOC Pharma GmbH");window.open(gmailLink("URGENT — Document Request — "+d.n,body)+"&to="+encodeURIComponent(d.to)+"&cc="+encodeURIComponent("celso@noc-pharma.de"),"_blank")}} style={{padding:"2px 8px",borderRadius:3,fontSize:11,fontWeight:700,border:"none",background:d.st==="expired"||d.st==="critical"?"#dc2626":"#d97706",color:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>📧 {lang==="de"?"Anfordern":"Request"}</button></td>
</tr>)}
</tbody></table>
</div>}
{actionDocs.length>0&&<div style={{padding:"6px 14px 10px",display:"flex",gap:6}}>
<button onClick={()=>{const docList=actionDocs.map((d,i)=>(i+1)+". "+d.n+" — "+(d.st==="expired"?"EXPIRED/ABGELAUFEN":d.st==="missing"?"MISSING/FEHLEND":d.st==="critical"?"CRITICAL/KRITISCH":"PENDING/AUSSTEHEND")).join("\n");const body=(lang==="de"?"Sehr geehrtes "+s.n+" Team,\n\nfuer den laufenden/geplanten Import benoetigen wir folgende Dokumente:\n\n"+docList+"\n\nBitte senden Sie alle Dokumente baldmoeglichst.\nOhne vollstaendige Dokumentation kann der Import nicht fortgesetzt werden.\n\nMit freundlichen Gruessen,\nCelso Hamelink\nRP (§52a AMG) · NOC Pharma GmbH":"Dear "+s.n+" Team,\n\nFor the ongoing/planned import we require the following documents:\n\n"+docList+"\n\nPlease send all documents at your earliest convenience.\nWithout complete documentation the import cannot proceed.\n\nBest regards,\nCelso Hamelink\nRP (Par.52a AMG) · NOC Pharma GmbH");window.open(gmailLink("NOC Pharma — "+actionDocs.length+" Document Requests — "+s.n+" — URGENT",body)+"&to="+encodeURIComponent(supEmail)+"&cc="+encodeURIComponent("celso@noc-pharma.de,torsten@noc-pharma.de"),"_blank")}} style={{flex:1,padding:"7px 14px",borderRadius:5,fontSize:14,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>📧 {lang==="de"?"Alle "+actionDocs.length+" Dokumente anfordern":"Request All "+actionDocs.length+" Documents"} → {supEmail}</button>
<button onClick={()=>{setSup(s.k);setPg("supDocs")}} style={{padding:"7px 14px",borderRadius:5,fontSize:14,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📂 {lang==="de"?"Dossier":"Dossier"}</button>
<button onClick={()=>{setSup(s.k);fileRef.current&&fileRef.current.click()}} style={{padding:"7px 14px",borderRadius:5,fontSize:14,fontWeight:700,border:"1px solid #059669",background:"#f0fdf4",color:"#059669",cursor:"pointer"}}>📤 {lang==="de"?"ZIP / Dokumente hochladen":"Upload ZIP / Documents"}</button>
</div>}
</div>})}
</div>,
lab:sup==="cannava"?<M2Lab/>:<Cd t={curSup.fl+" "+curSup.n+" — Lab Results"}><div style={{padding:20,textAlign:"center",color:"#6b7280",fontSize:16}}><div style={{fontSize:28,marginBottom:8}}>🔬</div><div style={{fontWeight:600,marginBottom:4}}>No lab testing data yet</div><div>Supplier qualification and import compliance is managed under <span style={{color:"#059669",fontWeight:700,cursor:"pointer",textDecoration:"underline"}} onClick={()=>setPg("lifecycle")}>Lifecycle</span>.</div><div style={{marginTop:4}}>Lab results will appear here once samples are submitted for testing.</div></div></Cd>,
deviations:<div>
<Cd t={"⚠️ "+(lang==="de"?"Abweichungs- & CAPA-Management":lang==="de"?"Abweichungs- & CAPA-Management":"Abweichung & CAPA Management")} badge={<><Bd c="#dc2626" b="#fee2e2">2 {lang==="de"?"Offen":"Open"}</Bd><Bd c="#d97706" b="#fef3c7">1 {lang==="de"?"In Arbeit":"In Progress"}</Bd><Bd c="#059669" b="#dcfce7">1 {lang==="de"?"Geschlossen":"Closed"}</Bd></>}>

{/* Regulatory Basis */}
<div style={{padding:8,background:"#f0f9ff",borderRadius:6,border:"1px solid #bae6fd",marginBottom:12,fontSize:13,color:"#1e40af",lineHeight:1.5}}>
<strong>{lang==="de"?"Rechtsgrundlage":"Regulatory Basis"}:</strong> EU GMP Chapter 1.4 + Chapter 8 (Complaints & Recalls) · PIC/S PE 009-16 · SOP-103-01 (Abweichung Mgmt) · SOP-104-01 (CAPA) · §63a AMG (Recall) · AMWHV §19 (Documentation)
</div>

{/* Stats Row */}
<div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginBottom:12}}>
{[
[lang==="de"?"Gesamt":"Total","4","#374151"],
[lang==="de"?"Kritisch":"Critical","1","#dc2626"],
[lang==="de"?"Major":"Major","1","#d97706"],
[lang==="de"?"Minor":"Minor","2","#2563eb"],
[lang==="de"?"CAPA offen":"CAPA Open","2","#dc2626"],
[lang==="de"?"Avg. Tage":"Avg. Days","18","#6b7280"]
].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",padding:8,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{l}</div>
</div>)}
</div>

{/* Abweichung Register */}
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
<thead>
<tr style={{background:"#f1f5f9"}}>
{["DEV-Nr.","Datum",lang==="de"?"Beschreibung":"Description",lang==="de"?"Kategorie":"Kategorie",lang==="de"?"Klassifikation":lang==="de"?"Klassifizierung":"Klassifikation",lang==="de"?"Charge":"Charge",lang==="de"?"Lieferant":"Lieferant","CAPA",lang==="de"?"Verantwortlich":"Verantwortlich",lang==="de"?"Frist":"Frist","Status",""].map((h,j)=>
<th key={j} style={{padding:"5px 6px",borderBottom:"2px solid #cbd5e1",textAlign:"left",fontWeight:700,fontSize:12,color:"#475569",whiteSpace:"nowrap"}}>{h}</th>)}
</tr>
</thead>
<tbody>
{[
{id:"DEV-2025-001",date:"14.12.2025",desc:"TAMC excursion 12,500 CFU/g (Ph.Eur. limit: 10,000)",cat:"Microbiology",cls:"Critical",clsC:"#dc2626",batch:"BI-02 (IN11)",sup:"Cannava",
capa:"CAPA-2025-001",owner:"C. Hamelink",deadline:"14.01.2026",st:"open",
rootCause:"Supplier drying process — moisture content 9.1% at origin (target <8%)",
immAct:"Batch quarantined. Retest ordered at QSI Bremen (microbial panel + extended ID).",
corrAct:"Notify Cannava QP (Lic. Ruiz). Request drying protocol revision. Demand incoming moisture < 8.0%.",
prevAct:"Add moisture verification as pre-shipment gate check. Update SOP-CS-001 supplier qualification criteria.",
impactAssess:"Product cannot be released until retest confirms TAMC < 10,000. If confirmed OOS, batch reject per SOP-202.",
refs:["SOP-202 (OOS Investigation)","SOP-QC-001 (Lab Testing)","Ph.Eur. 5.1.4 (Microbial Quality)","EU GMP Annex 8"]},
{id:"DEV-2025-002",date:"15.12.2025",desc:"THC variance >10% between supplier COA (20.1%) and QSI result (19.5%)",cat:"Potency",cls:"Major",clsC:"#d97706",batch:"BI-02 (002-39)",sup:"Cannava",
capa:"CAPA-2025-002",owner:"C. Hamelink",deadline:"15.01.2026",st:"open",
rootCause:"Analytical method difference (Cannava: UV-Vis; QSI: HPLC-DAD). Expected variance within 3%, actual 3.0% — at threshold.",
immAct:"THC Discrepancy Protocol initiated (M2 stage). Pia at QSI notified. PZN re-evaluation if needed.",
corrAct:"Establish method correlation study between Cannava lab and QSI. Harmonize to HPLC-DAD per Ph.Eur.",
prevAct:"Require HPLC-DAD results from all suppliers. Add inter-lab comparison to SOP-CS-001.",
impactAssess:"Variance at 3.0% (limit 10%). No impact on product quality. PZN valid. Batch can proceed if retest confirms.",
refs:["SOP-202 (OOS Investigation)","THC Discrepancy Protocol","Ph.Eur. Cannabis flos monograph","AMWHV §6"]},
{id:"DEV-2025-003",date:"15.11.2025",desc:"Datalogger TL-002 peak at 26.1C for 12 min during transport leg 2 (BA → FRA)",cat:"GDP Temperature",cls:"Minor",clsC:"#2563eb",batch:"BI-02",sup:"WAS-Logistics",
capa:"CAPA-2025-003",owner:"C. Hamelink",deadline:"15.12.2025",st:"in-progress",
rootCause:"Airport tarmac transfer at Buenos Aires — direct sun exposure 12 min. Coolchain protocol gap.",
immAct:"MKT calculated: 19.8C (within 15-25C GDP range). Product quality not impacted (single brief excursion).",
corrAct:"WAS-Logistics informed. Require thermal blanket for tarmac transfers. Update GDP SOP-700-02.",
prevAct:"Add tarmac transfer protocol to carrier requirements. Include in next WAS-Logistics audit.",
impactAssess:"MKT 19.8C confirms no quality impact. Brief excursion per EU GDP guideline C 343/01 acceptable if MKT within range.",
refs:["SOP-700-02 (GDP Transport)","EU GDP 2013/C 343/01","WHO TRS 961 Annex 9","ICH Q1A"]},
{id:"DEV-2025-004",date:"20.01.2026",desc:"PZN label misprint — wrong PZN on 45 units of batch BI-01-005",cat:"Labeling",cls:"Minor",clsC:"#2563eb",batch:"BI-01 (005)",sup:"NOC Internal",
capa:"CAPA-2025-004",owner:"C. Hamelink",deadline:"20.02.2026",st:"closed",closedDatum:"05.02.2026",
rootCause:"Manual label printing without verification step. Operator used wrong PZN template file.",
immAct:"Affected 45 units isolated. Correct labels printed and applied same day. Before/after photos documented.",
corrAct:"Introduced mandatory PZN barcode scan verification before label application. SOP-710-01 updated.",
prevAct:"Digital label verification system added. Second-person check mandatory (4-eyes principle per AMWHV §14).",
impactAssess:"No product reached market with wrong PZN. All 45 units relabeled and verified. No recall required.",
refs:["SOP-710-01 (Labeling)","AMWHV §14","FMD 2019/161","IFA/PZN Guidelines"]}
].map((d,j)=><Fragment key={j}>
<tr style={{borderBottom:"1px solid #f1f5f9",background:d.st==="open"?"#fef2f2":d.st==="in-progress"?"#fffbeb":"#fff",cursor:"pointer"}} onClick={()=>setExDoc(exDoc===d.id?null:d.id)}>
<td style={{padding:"5px 6px",fontWeight:700,color:"#1e40af",fontSize:13,whiteSpace:"nowrap"}}>{d.id}</td>
<td style={{padding:"5px 6px",fontSize:12}}>{d.date}</td>
<td style={{padding:"5px 6px",fontSize:13,maxWidth:200}}>{d.desc}</td>
<td style={{padding:"5px 6px"}}><Bd c="#374151" b="#f3f4f6">{d.cat}</Bd></td>
<td style={{padding:"5px 6px"}}><Bd c={d.clsC} b={d.clsC+"22"}>{d.cls}</Bd></td>
<td style={{padding:"5px 6px",fontSize:12}}>{d.batch}</td>
<td style={{padding:"5px 6px",fontSize:12}}>{d.sup}</td>
<td style={{padding:"5px 6px",fontSize:12,fontWeight:600,color:"#1e40af"}}>{d.capa}</td>
<td style={{padding:"5px 6px",fontSize:12}}>{d.owner}</td>
<td style={{padding:"5px 6px",fontSize:12,color:d.st==="open"?"#dc2626":"#374151"}}>{d.deadline}</td>
<td style={{padding:"5px 6px"}}>{d.st==="open"?<Bd c="#dc2626" b="#fee2e2">Open</Bd>:d.st==="closed"?<Bd c="#059669" b="#dcfce7">Closed</Bd>:<Bd c="#d97706" b="#fef3c7">In Progress</Bd>}</td>
<td style={{padding:"5px 6px",fontSize:12,color:"#9ca3af"}}>{exDoc===d.id?"▲":"▼"}</td>
</tr>
{exDoc===d.id&&<tr><td colSpan="12" style={{padding:0}}>
<div style={{padding:12,background:"#f8fafc",border:"1px solid #e5e7eb"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
<div>
<div style={{fontSize:14,fontWeight:700,color:"#dc2626",marginBottom:4}}>🔍 {lang==="de"?"Ursachenanalyse (Root Cause)":lang==="de"?"Ursachenanalyse":"Ursachenanalyse"}</div>
<div style={{fontSize:14,padding:8,background:"#fff",borderRadius:5,border:"1px solid #fecaca",marginBottom:8}}>{d.rootCause}</div>

<div style={{fontSize:14,fontWeight:700,color:"#d97706",marginBottom:4}}>⚡ {lang==="de"?"Sofortmassnahme":lang==="de"?"Sofortmaßnahme":"Sofortmassnahme"}</div>
<div style={{fontSize:14,padding:8,background:"#fff",borderRadius:5,border:"1px solid #fde68a",marginBottom:8}}>{d.immAct}</div>

<div style={{fontSize:14,fontWeight:700,color:"#2563eb",marginBottom:4}}>🔧 {lang==="de"?"Korrekturmassnahme (CA)":lang==="de"?"Korrekturmaßnahme (CA)":"Korrekturmassnahme (CA)"}</div>
<div style={{fontSize:14,padding:8,background:"#fff",borderRadius:5,border:"1px solid #bfdbfe",marginBottom:8}}>{d.corrAct}</div>
</div>
<div>
<div style={{fontSize:14,fontWeight:700,color:"#7c3aed",marginBottom:4}}>🛡️ {lang==="de"?"Vorbeugungsmassnahme (PA)":lang==="de"?"Vorbeugungsmaßnahme (PA)":"Vorbeugungsmassnahme (PA)"}</div>
<div style={{fontSize:14,padding:8,background:"#fff",borderRadius:5,border:"1px solid #c4b5fd",marginBottom:8}}>{d.prevAct}</div>

<div style={{fontSize:14,fontWeight:700,color:"#065f46",marginBottom:4}}>📊 {lang==="de"?"Auswirkungsbewertung":lang==="de"?"Auswirkungsbewertung":"Auswirkungsbewertung"}</div>
<div style={{fontSize:14,padding:8,background:"#fff",borderRadius:5,border:"1px solid #a7f3d0",marginBottom:8}}>{d.impactAssess}</div>

<div style={{fontSize:14,fontWeight:700,color:"#374151",marginBottom:4}}>📋 {lang==="de"?"Referenz-SOPs":lang==="de"?"Referenz-SOPs":"Referenz-SOPs"}</div>
<div style={{fontSize:13,padding:8,background:"#fff",borderRadius:5,border:"1px solid #e5e7eb"}}>
{d.refs.map((r,ri)=><div key={ri} style={{marginBottom:2}}>• {r}</div>)}
</div>
</div>
</div>
<div style={{display:"flex",gap:6,marginTop:10}}>
<button onClick={()=>{const w=window.open("","_blank","width=800,height=900");w.document.write('<html><head><title>'+d.id+' — NOC Pharma</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:12px;color:#1f2937}h1{font-size:16px;color:#dc2626;border-bottom:2px solid #dc2626;padding-bottom:6px}h2{font-size:13px;margin-top:14px;color:#374151}table{width:100%;border-collapse:collapse;margin:6px 0}td{padding:5px 8px;border:1px solid #d1d5db}td:first-child{font-weight:700;background:#f9fafb;width:30%}.banner{background:#dc2626;color:#fff;padding:12px 30px;margin:-30px -30px 16px}.sig{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:20px}.sig>div{border-top:1px solid #000;padding-top:4px;text-align:center;font-size:10px}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:9px;color:#9ca3af;text-align:center}@media print{body{padding:20px}.banner{margin:-20px -20px 16px}}</style></head><body>');w.document.write('<div class="banner"><strong style="font-size:15px">NOC Pharma GmbH</strong> — Abweichungsbericht '+d.id+'</div>');w.document.write('<h1>'+d.id+' — '+d.desc+'</h1><table>');[["Datum",d.date],["Kategorie",d.cat],["Klassifikation",d.cls],["Charge",d.batch],["Lieferant",d.sup],["CAPA Ref",d.capa],["Verantwortlich",d.owner],["Frist",d.deadline],["Status",d.st]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});w.document.write('</table><h2>Ursachenanalyse</h2><p>'+d.rootCause+'</p><h2>Sofortmassnahme</h2><p>'+d.immAct+'</p><h2>Korrekturmassnahme</h2><p>'+d.corrAct+'</p><h2>Vorbeugungsmassnahme</h2><p>'+d.prevAct+'</p><h2>Auswirkungsbewertung</h2><p>'+d.impactAssess+'</p><h2>Referenz-SOPs</h2><ul>');d.refs.forEach(function(r){w.document.write('<li>'+r+'</li>')});w.document.write('</ul><div class="sig"><div>Erstellt von<br/><br/><br/>'+d.owner+'</div><div>Geprueft von QP<br/><br/><br/>T. Cuny</div><div>Abgeschlossen von RP<br/><br/><br/>________________________</div></div><div class="ft">NOC Pharma GmbH - QMS v2.5 - EU GMP Chapter 8 - PIC/S PE 009-16 - '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{flex:1,padding:"6px 12px",borderRadius:5,fontSize:13,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>{lang==="de"?"Bericht drucken (PDF)":lang==="de"?"Bericht drucken (PDF)":"Print Report (PDF)"}</button>
<button onClick={()=>{const sep="=".repeat(40);const body="NOC PHARMA GmbH\nAbweichungsbericht "+d.id+"\n"+sep+"\n\n"+d.desc+"\n\nDatum: "+d.date+"\nClassification: "+d.cls+"\nCharge: "+d.batch+"\nLieferant: "+d.sup+"\nCAPA: "+d.capa+"\n\nUrsache: "+d.rootCause+"\n\nSofortmassnahme: "+d.immAct+"\n\nKorrekturmassnahme: "+d.corrAct+"\n\nVorbeugungsmassnahme: "+d.prevAct+"\n\nAuswirkung: "+d.impactAssess+"\n\n"+sep+"\nNOC Pharma GmbH - QMS v2.5";window.open(gmailLink("NOC Pharma — "+d.id+" — "+d.cls+" Abweichung — "+d.batch,body)+"&to="+encodeURIComponent((SUP_QP[sup]||SUP_QP.cannava).email)+"&cc="+encodeURIComponent(SUP_QP.noc.email),"_blank")}} style={{flex:1,padding:"6px 12px",borderRadius:5,fontSize:13,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>{lang==="de"?"Bericht senden":lang==="de"?"Bericht senden":"Send Report"}</button>
<button onClick={()=>window.open("http://localhost:3000/deviations/"+d.id,"_blank")} style={{padding:"6px 12px",borderRadius:5,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>QMS v1.0</button>
</div>
</div>
</td></tr>}
</Fragment>)}
</tbody>
</table>
</div>

{/* Process Flow */}
<div style={{marginTop:12,padding:10,background:"#f9fafb",borderRadius:8,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>{lang==="de"?"Abweichungsprozess (EU GMP Chapter 8)":lang==="de"?"Abweichungsprozess (EU GMP Kapitel 8)":"Abweichung Process (EU GMP Chapter 8)"}</div>
<div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap",fontSize:12}}>
{[
["🔴",lang==="de"?"Erkennung":"Detection",lang==="de"?"Identifizieren & melden":"Identify & report deviation"],
["→","",""],
["📋","Klassifikation",lang==="de"?"Kritisch / Major / Minor":"Critical / Major / Minor"],
["→","",""],
["🔍",lang==="de"?"Ursache":"Root Cause",lang==="de"?"Untersuchung (5-Why / Ishikawa)":"Investigate (5-Why / Fishbone)"],
["→","",""],
["⚡","Sofortmassnahme",lang==="de"?"Eindämmen & Quarantäne":"Contain & quarantine"],
["→","",""],
["🔧","CAPA",lang==="de"?"Korrektur- & Vorbeugungsmaßnahmen":"Corrective + Preventive actions"],
["→","",""],
["📊",lang==="de"?"Wirksamkeit":"Effectiveness",lang==="de"?"CAPA-Wirksamkeit prüfen":"Verify CAPA effectiveness"],
["→","",""],
["✅",lang==="de"?"Abschluss":"Closure",lang==="de"?"QP-Genehmigung & Dokumentation":"QP approval + documentation"]
].map(([ic,l,sub],j)=>ic==="→"?<span key={j} style={{color:"#9ca3af",fontSize:16}}>→</span>:
<div key={j} style={{padding:"4px 8px",background:"#fff",borderRadius:4,border:"1px solid #e5e7eb",textAlign:"center",minWidth:70}}>
<div style={{fontSize:16}}>{ic}</div>
<div style={{fontWeight:700,fontSize:12}}>{l}</div>
<div style={{fontSize:8,color:"#6b7280"}}>{sub}</div>
</div>)}
</div>
</div>
</Cd>
</div>,
sops:<div>
<Cd t={"📑 "+(lang==="de"?"SOP-Register — BfArM Audit-Ready":lang==="de"?"SOP-Register — BfArM Prüfbereit":"SOP-Register — BfArM Audit-Ready")} badge={<><Bd c="#1e40af" b="#dbeafe">QMS v1.0</Bd><Bd c="#059669" b="#dcfce7">305 SOPs</Bd></>}>

{/* Header Stats */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
{[
[lang==="de"?"Gesamt":"Total","305","#1e40af"],
[lang==="de"?"Aktuell":"Current","8","#059669"],
[lang==="de"?"Ueberfaellig":"Overdue","3","#dc2626"],
[lang==="de"?"In Pruefung":"Under Review","2","#d97706"],
[lang==="de"?"Entwurf":"Draft","292","#6b7280"]
].map(([l,v,c],j)=><div key={j} style={{padding:10,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb",textAlign:"center"}}>
<div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{l}</div>
</div>)}
</div>

{/* Link to NOC Pharma QMS v1.0 */}
<div style={{padding:10,background:"#eff6ff",borderRadius:8,border:"1px solid #bae6fd",marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:15,fontWeight:700,color:"#1e40af"}}>NOC Pharma QMS v1.0 — {lang==="de"?"Vollstaendige SOP-Datenbank":"Full SOP Database"}</div>
<div style={{fontSize:13,color:"#6b7280"}}>localhost:3000/dashboard — {lang==="de"?"305 SOPs, Formulare, Schulungsregister":"305 SOPs, Forms, Training Register"}</div>
</div>
<button onClick={()=>window.open("http://localhost:3000/dashboard","_blank")} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>
{lang==="de"?"QMS v1.0 oeffnen":"Open QMS v1.0"}
</button>
</div>

{/* SOP-Register Table */}
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
<thead>
<tr style={{background:"#f1f5f9"}}>
{[lang==="de"?"SOP-Nr.":"SOP No.",lang==="de"?"Titel":"Title","Version",lang==="de"?"Kategorie":"Kategorie",lang==="de"?"In Kraft":"In Kraft",lang==="de"?"Naechste Pruef.":"Naechste Pruefung",lang==="de"?"Unterschrieben":"Unterschrieben von",lang==="de"?"Genehmigt":"Genehmigt von",lang==="de"?"Status":"Status",""].map((h,j)=>
<th key={j} style={{padding:"6px 8px",borderBottom:"2px solid #cbd5e1",textAlign:"left",fontWeight:700,fontSize:13,color:"#475569",whiteSpace:"nowrap"}}>{h}</th>)}
</tr>
</thead>
<tbody>
{[
{id:"SOP-QMS-001",n:"Quality Management System",v:"3.0",cat:"QMS",eff:"01.03.2024",rev:"01.03.2026",sign:"C. Hamelink",signD:"01.03.2024",app:"T. Cuny (QP)",appD:"01.03.2024",st:"current",train:["C. Hamelink","T. Cuny","M. Weber"]},
{id:"SOP-QMS-002",n:"Document Control",v:"2.1",cat:"QMS",eff:"15.04.2024",rev:"15.04.2026",sign:"C. Hamelink",signD:"15.04.2024",app:"T. Cuny (QP)",appD:"15.04.2024",st:"current",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-PER-001",n:"Personnel Qualification & Training",v:"2.0",cat:"PER",eff:"01.05.2024",rev:"01.05.2026",sign:"C. Hamelink",signD:"01.05.2024",app:"T. Cuny (QP)",appD:"01.05.2024",st:"current",train:["C. Hamelink","T. Cuny","M. Weber"]},
{id:"SOP-100-01",n:"QMS Framework",v:"1.0",cat:"QMS",eff:"01.01.2023",rev:"01.01.2025",sign:"C. Hamelink",signD:"01.01.2023",app:"—",appD:"—",st:"overdue",days:"851",train:["C. Hamelink"]},
{id:"SOP-103-01",n:"Abweichung Management",v:"1.0",cat:"QMS",eff:"15.03.2023",rev:"15.03.2025",sign:"C. Hamelink",signD:"15.03.2023",app:"—",appD:"—",st:"overdue",days:"808",train:["C. Hamelink"]},
{id:"SOP-104-01",n:"CAPA (Corrective & Vorbeugungsmassnahme)",v:"1.0",cat:"QMS",eff:"15.03.2023",rev:"15.03.2025",sign:"C. Hamelink",signD:"15.03.2023",app:"—",appD:"—",st:"overdue",days:"808",train:["C. Hamelink"]},
{id:"SOP-MFG-006",n:"Cannabis Flos Import Process",v:"1.2",cat:"MFG",eff:"01.08.2024",rev:"01.08.2026",sign:"C. Hamelink",signD:"01.08.2024",app:"T. Cuny (QP)",appD:"01.08.2024",st:"current",train:["C. Hamelink","T. Cuny","Logistics"]},
{id:"SOP-202",n:"OOS Investigation",v:"2.0",cat:"QC",eff:"01.06.2024",rev:"01.06.2026",sign:"C. Hamelink",signD:"01.06.2024",app:"T. Cuny (QP)",appD:"01.06.2024",st:"current",train:["C. Hamelink","T. Cuny","QSI Bremen"]},
{id:"SOP-CS-001",n:"Supplier Qualification & Audit",v:"1.1",cat:"CS",eff:"01.09.2024",rev:"01.09.2026",sign:"C. Hamelink",signD:"01.09.2024",app:"T. Cuny (QP)",appD:"01.09.2024",st:"current",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-BTM-001",n:"BtM Narcotics Controls",v:"2.0",cat:"BTM",eff:"01.07.2024",rev:"01.07.2026",sign:"C. Hamelink",signD:"01.07.2024",app:"T. Cuny (QP)",appD:"01.07.2024",st:"current",train:["C. Hamelink","T. Cuny","Vault Staff"]},
{id:"SOP-604-02",n:"BtM Controls",v:"2.0",cat:"BTM",eff:"01.07.2024",rev:"01.07.2026",sign:"C. Hamelink",signD:"01.07.2024",app:"T. Cuny (QP)",appD:"01.07.2024",st:"current",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-700-02",n:"GDP Transport",v:"2.0",cat:"GDP",eff:"01.06.2024",rev:"01.06.2026",sign:"C. Hamelink",signD:"01.06.2024",app:"T. Cuny (QP)",appD:"01.06.2024",st:"current",train:["C. Hamelink","Logistics","WAS-Logistics"]},
{id:"SOP-710-01",n:"Labeling & Relabeling",v:"1.0",cat:"MFG",eff:"01.08.2024",rev:"01.08.2026",sign:"C. Hamelink",signD:"01.08.2024",app:"T. Cuny (QP)",appD:"01.08.2024",st:"current",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-QC-001",n:"Laboratory Testing (Contract QSI)",v:"1.0",cat:"QC",eff:"15.06.2024",rev:"15.06.2026",sign:"C. Hamelink",signD:"15.06.2024",app:"T. Cuny (QP)",appD:"15.06.2024",st:"current",train:["C. Hamelink","Pia (QSI)"]},
{id:"SOP-DOC-001",n:"Batch Record Management",v:"1.0",cat:"DOC",eff:"01.04.2024",rev:"01.04.2026",sign:"C. Hamelink",signD:"01.04.2024",app:"T. Cuny (QP)",appD:"01.04.2024",st:"review",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-EQ-001",n:"Equipment Qualification",v:"1.0",cat:"EQ",eff:"01.05.2024",rev:"01.05.2026",sign:"C. Hamelink",signD:"01.05.2024",app:"T. Cuny (QP)",appD:"01.05.2024",st:"review",train:["C. Hamelink"]}
].map((s,j)=><tr key={j} style={{borderBottom:"1px solid #f1f5f9",background:s.st==="overdue"?"#fef2f2":s.st==="review"?"#fffbeb":"#fff"}}>
<td style={{padding:"6px 8px",fontWeight:700,fontSize:14,color:"#1e40af",whiteSpace:"nowrap"}}>{s.id}</td>
<td style={{padding:"6px 8px",fontSize:14}}>{s.n}</td>
<td style={{padding:"6px 8px",textAlign:"center"}}><Bd c="#6b7280" b="#f3f4f6">v{s.v}</Bd></td>
<td style={{padding:"6px 8px"}}><Bd c={s.cat==="QMS"?"#7c3aed":s.cat==="BTM"?"#dc2626":s.cat==="GDP"?"#0891b2":s.cat==="QC"?"#059669":s.cat==="MFG"?"#d97706":s.cat==="CS"?"#2563eb":"#6b7280"} b={s.cat==="QMS"?"#ede9fe":s.cat==="BTM"?"#fee2e2":s.cat==="GDP"?"#cffafe":s.cat==="QC"?"#dcfce7":s.cat==="MFG"?"#fef3c7":s.cat==="CS"?"#dbeafe":"#f3f4f6"}>{s.cat}</Bd></td>
<td style={{padding:"6px 8px",fontSize:13}}>{s.eff}</td>
<td style={{padding:"6px 8px",fontSize:13,color:s.st==="overdue"?"#dc2626":"#374151",fontWeight:s.st==="overdue"?700:400}}>{s.rev}{s.days?" ("+s.days+"d)":""}</td>
<td style={{padding:"6px 8px",fontSize:13}}><div>{s.sign}</div><div style={{fontSize:12,color:"#9ca3af"}}>{s.signD}</div></td>
<td style={{padding:"6px 8px",fontSize:13}}><div>{s.app}</div><div style={{fontSize:12,color:"#9ca3af"}}>{s.appD}</div></td>
<td style={{padding:"6px 8px"}}>{s.st==="current"?<Bd c="#059669" b="#dcfce7">Current</Bd>:s.st==="overdue"?<Bd c="#dc2626" b="#fee2e2">Overdue</Bd>:<Bd c="#d97706" b="#fef3c7">Review</Bd>}</td>
<td style={{padding:"6px 8px"}}><div style={{display:"flex",gap:3}}>
<button onClick={()=>setDocPreview({name:s.id+" — "+s.n,ref:s.id,by:s.sign,on:s.signD,vu:s.rev,stage:"SOP",hasDoc:s.st==="current",det:[["Version","v"+s.v],["Kategorie",s.cat],["In Kraft",s.eff],["Naechste Pruefung",s.rev],["Unterschrieben von",s.sign+" ("+s.signD+")"],["Genehmigt von",s.app+" ("+s.appD+")"],["Status",s.st==="current"?"Current":"Overdue"],["Geschult",s.train.join(", ")]],sup:sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN",batch:"—"})} style={{padding:"2px 6px",borderRadius:3,fontSize:12,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>View</button>
<button onClick={()=>window.open("http://localhost:3000/sops/"+s.id,"_blank")} style={{padding:"2px 6px",borderRadius:3,fontSize:12,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>QMS</button>
</div></td>
</tr>)}
</tbody>
</table>
</div>

{/* Schulungsnachweise Summary */}
<div style={{marginTop:14,background:"#f0fdf4",borderRadius:8,padding:12,border:"1px solid #a7f3d0"}}>
<div style={{fontSize:16,fontWeight:700,color:"#065f46",marginBottom:8}}>{lang==="de"?"Schulungsregister":lang==="de"?"Schulungsregister":"Training Register"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
{[
{n:"C. Hamelink",r:"RP §52a AMG",sops:16,pct:100},
{n:"T. Cuny",r:"QP §15 AMG",sops:14,pct:87},
{n:"M. Weber",r:"Warehouse / BtM",sops:3,pct:19}
].map((p,j)=><div key={j} style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #d1fae5"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:15,fontWeight:700}}>{p.n}</div><div style={{fontSize:13,color:"#6b7280"}}>{p.r}</div></div>
<div style={{fontSize:16,fontWeight:800,color:p.pct===100?"#059669":"#d97706"}}>{p.pct}%</div>
</div>
<div style={{marginTop:4,height:4,background:"#e5e7eb",borderRadius:2}}><div style={{height:4,background:p.pct===100?"#059669":"#d97706",borderRadius:2,width:p.pct+"%"}}/></div>
<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{p.sops}/16 SOPs trained</div>
</div>)}
</div>
</div>

{/* Authority Dossier Export */}
<div style={{marginTop:14,background:"linear-gradient(135deg,#eff6ff,#f0f9ff)",borderRadius:8,padding:12,border:"2px solid #3b82f6"}}>
<div style={{fontSize:16,fontWeight:700,color:"#1e40af",marginBottom:8}}>{lang==="de"?"Behoerdendossier erstellen":lang==="de"?"Behördendossier Export":"Authority Dossier Export"}</div>
<div style={{fontSize:14,color:"#374151",marginBottom:10}}>{lang==="de"?"Kompiliert alle unterschriebenen SOPs, Schulungsnachweise und QMS-Dokumente pro Lieferant fuer BfArM / Landesbehoerden.":"Compiles all signed SOPs, training records, and QMS documents per supplier for BfArM / state authorities."}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
{SUPS.map(s=><button key={s.k} onClick={()=>{
const supN=s.n;const sep="=".repeat(50);
const w=window.open("","_blank","width=800,height=900");
w.document.write('<html><head><title>SOP Dossier — '+supN+'</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:12px;color:#1f2937}h1{font-size:18px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:6px}h2{font-size:14px;margin-top:16px}table{width:100%;border-collapse:collapse;margin:8px 0}td,th{padding:5px 8px;border:1px solid #d1d5db;font-size:11px;text-align:left}th{background:#f1f5f9;font-weight:700}.banner{background:#1e40af;color:#fff;padding:14px 30px;margin:-30px -30px 20px}.ft{margin-top:20px;border-top:1px solid #d1d5db;padding-top:8px;font-size:9px;color:#9ca3af;text-align:center}@media print{body{padding:20px}.banner{margin:-20px -20px 20px}}</style></head><body>');
w.document.write('<div class="banner"><strong style="font-size:15px">NOC Pharma GmbH</strong> — Behoerden-SOP-Dossier — '+supN+'<br/>QMS v1.0 / QMS v2.5 — Erstellt '+new Date().toLocaleDateString("de-DE")+'</div>');
w.document.write('<h1>SOP Dossier: '+supN+'</h1>');
w.document.write('<h2>1. SOP-Register</h2><table><tr><th>SOP</th><th>Title</th><th>Ver</th><th>Effective</th><th>Review</th><th>Signed</th><th>Approved</th><th>Status</th></tr>');
w.document.write('<tr><td>SOP-QMS-001</td><td>Quality Management System</td><td>3.0</td><td>01.03.2024</td><td>01.03.2026</td><td>C. Hamelink</td><td>T. Cuny</td><td>Current</td></tr>');
w.document.write('<tr><td>SOP-MFG-006</td><td>Cannabis Flos Import</td><td>1.2</td><td>01.08.2024</td><td>01.08.2026</td><td>C. Hamelink</td><td>T. Cuny</td><td>Current</td></tr>');
w.document.write('<tr><td>SOP-CS-001</td><td>Supplier Qualification</td><td>1.1</td><td>01.09.2024</td><td>01.09.2026</td><td>C. Hamelink</td><td>T. Cuny</td><td>Current</td></tr>');
w.document.write('<tr><td>SOP-BTM-001</td><td>BtM Controls</td><td>2.0</td><td>01.07.2024</td><td>01.07.2026</td><td>C. Hamelink</td><td>T. Cuny</td><td>Current</td></tr>');
w.document.write('<tr><td>SOP-700-02</td><td>GDP Transport</td><td>2.0</td><td>01.06.2024</td><td>01.06.2026</td><td>C. Hamelink</td><td>T. Cuny</td><td>Current</td></tr>');
w.document.write('</table>');
w.document.write('<h2>2. Schulungsnachweise</h2><table><tr><th>Person</th><th>Role</th><th>SOPs geschult</th><th>Abschluss</th></tr>');
w.document.write('<tr><td>C. Hamelink</td><td>RP Par. 52a AMG</td><td>16/16</td><td>100%</td></tr>');
w.document.write('<tr><td>T. Cuny</td><td>QP Par. 15 AMG</td><td>14/16</td><td>87%</td></tr>');
w.document.write('</table>');
w.document.write('<h2>3. Lieferantenspezifische Dokumente</h2><p>Vollstaendiges Dokumentenarchiv siehe NOC Pharma QMS v1.0 (localhost:3000).</p>');
w.document.write('<div class="ft">NOC Pharma GmbH - Im Camisch 14 - 07768 Kahla - QMS v1.0 + v2.5 - '+new Date().toISOString()+'</div></body></html>');
w.document.close();setTimeout(function(){w.print()},500);
}} style={{padding:10,borderRadius:6,border:"1px solid #3b82f6",background:"#fff",cursor:"pointer",textAlign:"center"}}>
<div style={{fontSize:22}}>{s.fl}</div>
<div style={{fontSize:15,fontWeight:700}}>{s.n}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{lang==="de"?"Dossier exportieren":"Export Dossier"}</div>
</button>)}
</div>
</div>

<div style={{marginTop:10,fontSize:13,color:"#6b7280",textAlign:"center"}}>
{lang==="de"?"Vollstaendige SOP-Datenbank":"Full SOP database"}: <a href="http://localhost:3000/dashboard" target="_blank" style={{color:"#1e40af",fontWeight:600}}>NOC Pharma QMS v1.0</a> — {lang==="de"?"Alle Exporte werden mit QMS v2.5 synchronisiert.":"All exports synchronized with QMS v2.5."}
</div>
</Cd>
</div>,
btm:<div>
{/* BtM Header */}
<div style={{background:"linear-gradient(135deg,#7f1d1d,#991b1b)",borderRadius:10,padding:16,marginBottom:14,color:"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:22,fontWeight:800}}>⚖️ {lang==="de"?"BtM-Register — Betaeubungsmittelgesetz":"BtM Register — Narcotics Control"}</div>
<div style={{fontSize:14,opacity:.8}}>§13 BtMG · §15 BtMG · §17 BtMVV · AMWHV §19 · BfArM {lang==="de"?"Meldepflicht":"Reporting"}</div>
</div>
<div style={{display:"flex",gap:8}}>
<div style={{textAlign:"center",padding:"6px 14px",background:"rgba(255,255,255,.15)",borderRadius:6}}>
<div style={{fontSize:22,fontWeight:800}}>198.5kg</div>
<div style={{fontSize:12,opacity:.8}}>{lang==="de"?"Bestand":"Stock"}</div>
</div>
<div style={{textAlign:"center",padding:"6px 14px",background:"rgba(255,255,255,.15)",borderRadius:6}}>
<div style={{fontSize:22,fontWeight:800,color:"#4ade80"}}>0</div>
<div style={{fontSize:12,opacity:.8}}>{lang==="de"?"Differenz":"Variance"}</div>
</div>
<div style={{textAlign:"center",padding:"6px 14px",background:"rgba(255,255,255,.15)",borderRadius:6}}>
<div style={{fontSize:22,fontWeight:800}}>500kg</div>
<div style={{fontSize:12,opacity:.8}}>INCB 2026</div>
</div>
</div>
</div>
</div>

{/* Key Stats */}
<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:12}}>
{[
[lang==="de"?"Zugang":"Received","198.5kg","#059669"],
[lang==="de"?"Abgang":"Dispatched","0kg","#2563eb"],
[lang==="de"?"Vernichtet":"Destroyed","0kg","#dc2626"],
[lang==="de"?"Rueckstellmuster":"Retention","1.4kg","#7c3aed"],
[lang==="de"?"Verfuegbar":"Available","197.1kg","#059669"]
].map(([l,v,c],j)=><div key={j} style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb",textAlign:"center"}}>
<div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{l}</div>
</div>)}
</div>

{/* BtM Ledger */}
<Cd t={"📒 "+(lang==="de"?"BtM-Buch (Betaeubungsmittelbuch)":"BtM Ledger (Narcotics Book)")} badge={<Bd c="#059669" b="#dcfce7">§13 BtMG {lang==="de"?"konform":"compliant"}</Bd>}>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
<thead>
<tr style={{background:"#fef2f2"}}>
{[lang==="de"?"Lfd.Nr.":"Entry","Datum/Date",lang==="de"?"Vorgang":"Transaction",lang==="de"?"Substanz":"Substance",lang==="de"?"Charge":"Batch",lang==="de"?"Zugang (kg)":"In (kg)",lang==="de"?"Abgang (kg)":"Out (kg)",lang==="de"?"Bestand (kg)":"Balance (kg)",lang==="de"?"Lieferant/Empfaenger":"Supplier/Recipient",lang==="de"?"Genehmigung":"Permit",lang==="de"?"Verantwortlich":"Responsible"].map((h,j)=>
<th key={j} style={{padding:"5px 6px",borderBottom:"2px solid #fca5a5",textAlign:"left",fontWeight:700,fontSize:12,color:"#7f1d1d",whiteSpace:"nowrap"}}>{h}</th>)}
</tr>
</thead>
<tbody>
{[
{nr:"BT-2025-001",date:"14.11.2025",tx:lang==="de"?"Wareneingang (Import)":"Goods Receipt (Import)",sub:"Cannabis flos",batch:"BI-02-NOCB1.1-INF-F",inp:"198.5",out:"—",bal:"198.5",party:"Cannava S.E., San Juan, AR",perm:"E-12267/2025 (BfArM)",resp:"C. Hamelink (RP)"},
{nr:"BT-2025-002",date:"14.11.2025",tx:lang==="de"?"Quarantaene-Einlagerung":"Quarantine Storage",sub:"Cannabis flos",batch:"BI-02",inp:"—",out:"—",bal:"198.5",party:lang==="de"?"Tresor Anklam (Zone Q)":"Vault Anklam (Zone Q)",perm:"SOP-BTM-001",resp:"C. Hamelink (RP)"},
{nr:"BT-2025-003",date:"18.11.2025",tx:lang==="de"?"QSI Probenahme":"QSI Sampling",sub:"Cannabis flos",batch:"BI-02",inp:"—",out:"1.4",bal:"197.1",party:"QSI GmbH Bremen (Pia)",perm:lang==="de"?"§13 BtMG Transfer":"§13 BtMG Transfer",resp:"C. Hamelink (RP)"},
{nr:"BT-2025-004",date:"10.12.2025",tx:lang==="de"?"QP-Freigabe":"QP Release",sub:"Cannabis flos",batch:"BI-02",inp:"—",out:"—",bal:"197.1",party:"Dr. O. Schagon (QP)",perm:"CGZ-2025-003",resp:"Dr. O. Schagon (QP)"},
{nr:"BT-2025-005",date:"12.12.2025",tx:lang==="de"?"Zonenumbuchung Q→K":"Zone Transfer Q→C",sub:"Cannabis flos",batch:"BI-02",inp:"—",out:"—",bal:"197.1",party:lang==="de"?"Anklam Q → Kahla Kommerz":"Anklam Q → Kahla Commercial",perm:"TR-NOC-2025-0089",resp:"C. Hamelink (RP)"},
{nr:"BT-2025-006",date:"15.01.2026",tx:lang==="de"?"Rueckstellmuster Rueckgabe":"Retention Sample Return",sub:"Cannabis flos",batch:"BI-02",inp:"1.26",out:"—",bal:"198.36",party:"QSI GmbH Bremen",perm:lang==="de"?"Rueckfuehrung":"Return",resp:"Pia (QSI)"}
].map((e,j)=><tr key={j} style={{borderBottom:"1px solid #fef2f2",background:e.out!=="—"?"#fff7ed":"#fff"}}>
<td style={{padding:"4px 6px",fontWeight:700,color:"#7f1d1d",fontSize:12}}>{e.nr}</td>
<td style={{padding:"4px 6px",fontSize:12}}>{e.date}</td>
<td style={{padding:"4px 6px",fontSize:12,fontWeight:600}}>{e.tx}</td>
<td style={{padding:"4px 6px",fontSize:12}}>{e.sub}</td>
<td style={{padding:"4px 6px",fontSize:12,fontFamily:"monospace"}}>{e.batch}</td>
<td style={{padding:"4px 6px",fontWeight:700,color:e.inp!=="—"?"#059669":"#d1d5db"}}>{e.inp}</td>
<td style={{padding:"4px 6px",fontWeight:700,color:e.out!=="—"?"#dc2626":"#d1d5db"}}>{e.out}</td>
<td style={{padding:"4px 6px",fontWeight:700,color:"#1e40af"}}>{e.bal}</td>
<td style={{padding:"4px 6px",fontSize:12}}>{e.party}</td>
<td style={{padding:"4px 6px",fontSize:11}}>{e.perm}</td>
<td style={{padding:"4px 6px",fontSize:11}}>{e.resp}</td>
</tr>)}
</tbody>
</table>
</div>

{/* Balance Verification */}
<div style={{marginTop:10,padding:8,background:"#f0fdf4",borderRadius:6,border:"1px solid #a7f3d0"}}>
<div style={{fontSize:14,fontWeight:700,color:"#065f46",marginBottom:4}}>✅ {lang==="de"?"Bestandspruefung §15 BtMG":"Balance Verification §15 BtMG"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,fontSize:13}}>
<div><span style={{color:"#6b7280"}}>{lang==="de"?"Anfangsbestand":"Opening"}:</span> <strong>0 kg</strong></div>
<div><span style={{color:"#6b7280"}}>{lang==="de"?"+ Zugang":"+ Received"}:</span> <strong style={{color:"#059669"}}>199.76 kg</strong></div>
<div><span style={{color:"#6b7280"}}>{lang==="de"?"- Abgang":"- Dispatched"}:</span> <strong style={{color:"#dc2626"}}>1.4 kg</strong></div>
<div><span style={{color:"#6b7280"}}>{lang==="de"?"= Soll-Bestand":"= Target Balance"}:</span> <strong style={{color:"#1e40af"}}>198.36 kg</strong></div>
</div>
<div style={{marginTop:4,fontSize:13}}><span style={{color:"#6b7280"}}>{lang==="de"?"Ist-Bestand":"Actual Balance"}:</span> <strong>198.36 kg</strong> · <span style={{color:"#6b7280"}}>{lang==="de"?"Differenz":"Variance"}:</span> <strong style={{color:"#059669"}}>0 kg ✅</strong></div>
</div>
</Cd>

{/* INCB Allocation */}
<Cd t={"🌍 INCB "+(lang==="de"?"Zuweisung & Meldung":"Allocation & Reporting")} badge={<Bd c="#2563eb" b="#dbeafe">2026</Bd>}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:6}}>{lang==="de"?"INCB Jahreskontingent":"INCB Annual Quota"}</div>
{[
[lang==="de"?"Kontingent 2026":"Quota 2026","500 kg"],
[lang==="de"?"Verwendet":"Used","198.5 kg (39.7%)"],
[lang==="de"?"Verbleibend":"Remaining","301.5 kg"],
[lang==="de"?"Naechste Lieferung geplant":"Next Shipment Planned","BI-03: 60 kg (Q1 2026)"],
[lang==="de"?"Nach naechster Lieferung":"After Next Shipment","241.5 kg remaining"]
].map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #f3f4f6",fontSize:14}}>
<span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
</div>)}
<div style={{marginTop:8,height:8,background:"#e5e7eb",borderRadius:4}}>
<div style={{height:8,background:"linear-gradient(90deg,#dc2626,#d97706,#059669)",borderRadius:4,width:"39.7%"}}/>
</div>
<div style={{fontSize:12,color:"#6b7280",marginTop:2}}>39.7% {lang==="de"?"des Jahreskontingents verwendet":"of annual quota used"}</div>
</div>
<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:6}}>{lang==="de"?"BfArM Meldepflichten":"BfArM Reporting Obligations"}</div>
{[
{n:lang==="de"?"INCB Formular D (Jahresmeldung)":"INCB Form D (Annual Report)",due:"31.03.2027",st:"pending"},
{n:lang==="de"?"BfArM Einfuhranzeige":"BfArM Import Notification",due:"30d after import",st:"done"},
{n:lang==="de"?"BtM-Buch Pruefung":"BtM Ledger Audit",due:lang==="de"?"Jaehrlich":"Annual",st:"done"},
{n:lang==="de"?"Verlustmeldung (falls erforderlich)":"Loss Report (if applicable)",due:"—",st:"na"},
{n:lang==="de"?"Vernichtungsprotokoll":"Destruction Protocol",due:lang==="de"?"Bei Bedarf":"As needed",st:"na"}
].map((r,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid #f3f4f6",fontSize:13}}>
<span>{r.n}</span>
<div style={{display:"flex",gap:4,alignItems:"center"}}>
<span style={{fontSize:12,color:"#6b7280"}}>{r.due}</span>
{r.st==="done"?<Bd c="#059669" b="#dcfce7">✅</Bd>:r.st==="pending"?<Bd c="#d97706" b="#fef3c7">{lang==="de"?"Ausstehend":"Pending"}</Bd>:<Bd c="#6b7280" b="#f3f4f6">—</Bd>}
</div>
</div>)}
</div>
</div>
</Cd>

{/* Storage Zones */}
<Cd t={"🏦 "+(lang==="de"?"BtM-Lagerstandorte":"BtM Storage Zones")}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
{[
{zone:"Q",name:lang==="de"?"Quarantaene-Tresor Anklam":"Quarantine Vault Anklam",addr:"Anklam, MV",qty:"0 kg",temp:"19.5°C",st:"empty",sec:lang==="de"?"Alarmsystem + BtM-Schloss + Kamera":"Alarm + BtM Lock + Camera"},
{zone:"K",name:lang==="de"?"Kommerziallager Kahla":"Commercial Warehouse Kahla",addr:"Im Camisch 14, 07768 Kahla",qty:"197.1 kg",temp:"20.1°C",st:"active",sec:lang==="de"?"BtM-Tresor + Doppelschloss + Protokoll":"BtM Safe + Double Lock + Log"},
{zone:"R",name:lang==="de"?"Rueckstellmuster":"Retention Samples",addr:"Kahla (R-Schrank)",qty:"1.26 kg",temp:"20.0°C",st:"retention",sec:lang==="de"?"Versiegelter Schrank":"Sealed Cabinet"}
].map((z,j)=><div key={j} style={{padding:10,background:z.st==="active"?"#f0fdf4":z.st==="retention"?"#ede9fe":"#f9fafb",borderRadius:8,border:"1px solid "+(z.st==="active"?"#a7f3d0":z.st==="retention"?"#c4b5fd":"#e5e7eb")}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<Bd c={z.st==="active"?"#059669":z.st==="retention"?"#7c3aed":"#6b7280"} b={z.st==="active"?"#dcfce7":z.st==="retention"?"#ede9fe":"#f3f4f6"}>{lang==="de"?"Zone":"Zone"} {z.zone}</Bd>
<span style={{fontSize:16,fontWeight:800,color:z.st==="active"?"#059669":z.st==="retention"?"#7c3aed":"#9ca3af"}}>{z.qty}</span>
</div>
<div style={{fontSize:14,fontWeight:700}}>{z.name}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{z.addr}</div>
<div style={{fontSize:12,marginTop:4}}>🌡️ {z.temp} · 🔒 {z.sec}</div>
</div>)}
</div>
</Cd>

{/* Actions */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
<button onClick={()=>{const w=window.open("","_blank","width=800,height=900");w.document.write('<html><head><title>BtM-Buch — NOC Pharma</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:11px;color:#1f2937}h1{font-size:16px;color:#7f1d1d;border-bottom:2px solid #7f1d1d;padding-bottom:6px}h2{font-size:13px;margin-top:14px}table{width:100%;border-collapse:collapse;margin:6px 0}td,th{padding:4px 6px;border:1px solid #d1d5db;font-size:9px}th{background:#fef2f2;color:#7f1d1d;font-weight:700}.banner{background:#7f1d1d;color:#fff;padding:12px 30px;margin:-30px -30px 16px}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:8px;color:#9ca3af;text-align:center}.sig{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}.sig>div{border-top:1px solid #000;padding-top:4px;text-align:center;font-size:9px}@media print{body{padding:15px}.banner{margin:-15px -15px 12px}}</style></head><body>');w.document.write('<div class="banner"><strong style="font-size:14px">NOC Pharma GmbH</strong> — BtM-Buch / Narcotics Ledger<br/>Par. 13 BtMG · Par. 15 BtMG · Generated: '+new Date().toLocaleDateString("de-DE")+'</div>');w.document.write('<h1>Betaeubungsmittelbuch / Narcotics Ledger</h1>');w.document.write('<h2>Deutsch</h2><table><tr><th>Lfd.Nr.</th><th>Datum</th><th>Vorgang</th><th>Substanz</th><th>Charge</th><th>Zugang</th><th>Abgang</th><th>Bestand</th><th>Partei</th><th>Genehmigung</th></tr>');[["BT-2025-001","14.11.2025","Wareneingang","Cannabis flos","BI-02","198.5","—","198.5","Cannava S.E.","E-12267/2025"],["BT-2025-002","14.11.2025","Quarantaene","Cannabis flos","BI-02","—","—","198.5","Tresor Anklam","SOP-BTM-001"],["BT-2025-003","18.11.2025","QSI Probenahme","Cannabis flos","BI-02","—","1.4","197.1","QSI Bremen","Par.13 BtMG"],["BT-2025-004","10.12.2025","QP-Freigabe","Cannabis flos","BI-02","—","—","197.1","Dr. Schagon","CGZ-2025-003"],["BT-2025-005","12.12.2025","Zonenumbuchung","Cannabis flos","BI-02","—","—","197.1","Q to K","TR-NOC-2025-0089"],["BT-2025-006","15.01.2026","Rueckstellmuster","Cannabis flos","BI-02","1.26","—","198.36","QSI Bremen","Return"]].forEach(function(r){w.document.write("<tr>");r.forEach(function(v){w.document.write("<td>"+v+"</td>")});w.document.write("</tr>")});w.document.write('</table><h2>English</h2><table><tr><th>Entry</th><th>Date</th><th>Transaction</th><th>Substance</th><th>Batch</th><th>In</th><th>Out</th><th>Balance</th><th>Party</th><th>Permit</th></tr>');[["BT-2025-001","14.11.2025","Goods Receipt","Cannabis flos","BI-02","198.5","—","198.5","Cannava S.E.","E-12267/2025"],["BT-2025-002","14.11.2025","Quarantine Storage","Cannabis flos","BI-02","—","—","198.5","Vault Anklam","SOP-BTM-001"],["BT-2025-003","18.11.2025","QSI Sampling","Cannabis flos","BI-02","—","1.4","197.1","QSI Bremen","Par.13 BtMG"],["BT-2025-004","10.12.2025","QP Release","Cannabis flos","BI-02","—","—","197.1","Dr. Schagon","CGZ-2025-003"],["BT-2025-005","12.12.2025","Zone Transfer","Cannabis flos","BI-02","—","—","197.1","Q to C","TR-NOC-2025-0089"],["BT-2025-006","15.01.2026","Retention Return","Cannabis flos","BI-02","1.26","—","198.36","QSI Bremen","Return"]].forEach(function(r){w.document.write("<tr>");r.forEach(function(v){w.document.write("<td>"+v+"</td>")});w.document.write("</tr>")});w.document.write('</table><p><strong>Balance: 198.36 kg | Variance: 0 kg</strong></p><div class="sig"><div>Verantwortliche Person (RP)<br/><br/><br/>C. Hamelink</div><div>Sachkundige Person (QP)<br/><br/><br/>Dr. O. Schagon</div></div><div class="ft">NOC Pharma GmbH · Im Camisch 14 · 07768 Kahla · Par. 13, 15 BtMG · QMS v2.5 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{padding:"10px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#7f1d1d",color:"#fff",cursor:"pointer"}}>
📒 {lang==="de"?"BtM-Buch drucken (DE+EN)":"Print BtM Ledger (DE+EN)"}
</button>
<button onClick={()=>{const body="NOC PHARMA GmbH\nBtM Balance Report\n========================================\n\nDate: "+new Date().toLocaleDateString("de-DE")+"\nSubstance: Cannabis flos (Anlage III BtMG)\nBatch: BI-02-NOCB1.1-INF-F\n\nOpening: 0 kg\n+ Received: 199.76 kg\n- Dispatched: 1.4 kg (QSI samples)\n= Target: 198.36 kg\nActual: 198.36 kg\nVariance: 0 kg\n\nStorage:\n- Zone K (Kahla Commercial): 197.1 kg\n- Zone R (Retention): 1.26 kg\n\nINCB Quota 2026: 500 kg (39.7% used)\n\n========================================\nRP: C. Hamelink · QP: Dr. O. Schagon\nNOC Pharma GmbH · QMS v2.5";window.open(gmailLink("NOC Pharma — BtM Balance Report — "+new Date().toLocaleDateString("de-DE"),body),"_blank")}} style={{padding:"10px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>
📧 {lang==="de"?"BtM-Bericht senden":"Send BtM Report"}
</button>
<button onClick={()=>window.open("http://localhost:3000/btm","_blank")} style={{padding:"10px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>
🔗 {lang==="de"?"QMS v1.0 BtM-Register":"QMS v1.0 BtM Register"}
</button>
</div>

{/* Legal Notice */}
<div style={{marginTop:10,padding:8,background:"#fef2f2",borderRadius:6,border:"1px solid #fca5a5",fontSize:12,color:"#7f1d1d",lineHeight:1.5}}>
<strong>⚠️ {lang==="de"?"Rechtliche Hinweise":"Legal Notice"}:</strong> {lang==="de"
?"Das BtM-Buch ist gemaess §13 BtMG laufend zu fuehren. Jeder Zugang und Abgang ist unverzueglich einzutragen. Die Aufbewahrungsfrist betraegt 3 Jahre (§15 Abs. 1 BtMG). Abweichungen sind dem BfArM unverzueglich zu melden. Vernichtung nur unter Vier-Augen-Prinzip und mit Protokoll. INCB Form D ist jaehrlich bis 31.03. einzureichen."
:"The BtM ledger must be maintained continuously per §13 BtMG. All receipts and dispatches must be recorded immediately. Retention period: 3 years (§15(1) BtMG). Variances must be reported to BfArM immediately. Destruction only under 4-eyes principle with protocol. INCB Form D due annually by March 31."}
</div>
</div>,
supDocs:<div>
{/* Supplier Header */}
<div style={{background:"linear-gradient(135deg,"+(sup==="cannava"?"#064e3b,#059669":sup==="mccn"?"#78350f,#d97706":"#1e3a5f,#2563eb")+")",borderRadius:10,padding:16,marginBottom:14,color:"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:22,fontWeight:800}}>{curSup.fl} {curSup.n} — {lang==="de"?"Lieferantendossier":"Supplier Dossier"}</div>
<div style={{fontSize:14,opacity:.8}}>{sup==="cannava"?"Cannabis Avatara Sociedad del Estado · San Juan, Argentina":sup==="mccn"?"MEDCOLCANNA S.A.S. · Bogota D.C., Colombia":"HYTN Cannabis Inc. · British Columbia, Canada"}</div>
</div>
<div style={{display:"flex",gap:8}}>
<div style={{textAlign:"center",padding:"6px 12px",background:"rgba(255,255,255,.15)",borderRadius:6}}>
<div style={{fontSize:16,fontWeight:800}}>{sup==="cannava"?"4":sup==="mccn"?"1":"1"}</div>
<div style={{fontSize:11,opacity:.8}}>{lang==="de"?"Chargen":"Batches"}</div>
</div>
<div style={{textAlign:"center",padding:"6px 12px",background:"rgba(255,255,255,.15)",borderRadius:6}}>
<div style={{fontSize:16,fontWeight:800}}>{sup==="cannava"?"✅":"⏳"}</div>
<div style={{fontSize:11,opacity:.8}}>PIC/S</div>
</div>
<div style={{textAlign:"center",padding:"6px 12px",background:"rgba(255,255,255,.15)",borderRadius:6}}>
<div style={{fontSize:16,fontWeight:800}}>{sup==="cannava"?lang==="de"?"Aktiv":"Active":sup==="mccn"?lang==="de"?"Qualif.":"Qualif.":lang==="de"?"Geplant":"Planned"}</div>
<div style={{fontSize:11,opacity:.8}}>{lang==="de"?"Status":"Status"}</div>
</div>
</div>
</div>
</div>

{/* Company Info */}
<Cd t={lang==="de"?"Unternehmensinformationen":"Company Information"}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
<div>
{(sup==="cannava"?[
[lang==="de"?"Vollstaendiger Name":"Legal Name","Cannabis Avatara Sociedad del Estado"],
[lang==="de"?"Rechtsform":"Legal Form",lang==="de"?"Staatliches Unternehmen":"State Enterprise"],
[lang==="de"?"Adresse":"Address","Ruta 40 km 74, Pocito, San Juan, Argentina"],
[lang==="de"?"Registernummer":"Registration","CUIT 30-71659741-8"],
[lang==="de"?"GMP Behoerde":"GMP Authority","ANMAT (Administracion Nacional)"],
[lang==="de"?"Produktionstyp":"Production Type",lang==="de"?"Outdoor / Freiland":"Outdoor / Open Field"],
[lang==="de"?"Kapazitaet":"Capacity","320 kg/year"],
[lang==="de"?"Kontakt QP":"QP Contact","Lic. Maria Fernanda Ruiz (Directora Tecnica)"]
]:sup==="mccn"?[
[lang==="de"?"Vollstaendiger Name":"Legal Name","MEDCOLCANNA S.A.S."],
[lang==="de"?"Adresse":"Address","Bogota D.C., Colombia"],
[lang==="de"?"Registernummer":"Registration","NIT 901.234.567-8"],
[lang==="de"?"GMP Behoerde":"GMP Authority","INVIMA (Instituto Nacional de Vigilancia)"],
[lang==="de"?"Produktionstyp":"Production Type",lang==="de"?"Tropisch / Ganzjaehrig":"Tropical / Year-round"],
[lang==="de"?"Kapazitaet":"Capacity","130 kg/year"],
[lang==="de"?"Kontakt":"Contact","QP Director Tecnico"]
]:[
[lang==="de"?"Vollstaendiger Name":"Legal Name","HYTN Cannabis Inc."],
[lang==="de"?"Adresse":"Address","British Columbia, Canada"],
[lang==="de"?"Registernummer":"Registration","BC Corp. Registry"],
[lang==="de"?"GMP Behoerde":"GMP Authority","Health Canada"],
[lang==="de"?"Produktionstyp":"Production Type",lang==="de"?"Indoor / Ganzjaehrig":"Indoor / Year-round"],
[lang==="de"?"Kapazitaet":"Capacity","50 kg/year"],
[lang==="de"?"Kontakt":"Contact","QA Manager"]
]).map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #f3f4f6",fontSize:14}}>
<span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
</div>)}
</div>
<div>
{(sup==="cannava"?[
["Email","ruiz@cannava.gob.ar"],
[lang==="de"?"Telefon":"Phone","+54 264 421-6800"],
["Website","cannava.gob.ar"],
[lang==="de"?"Exportbehoerde":"Export Authority","SEDRONAR"],
[lang==="de"?"BtM Behoerde":"Narcotics Authority","SEDRONAR / ANMAT"],
[lang==="de"?"Erster Import":"First Import","March 2025 (BI-01)"],
[lang==="de"?"Letzter Import":"Last Import","Nov 2025 (BI-02)"],
[lang==="de"?"Naechster Import":"Next Import","Feb 2026 (BI-03)"]
]:sup==="mccn"?[
["Email","info@medcolcanna.com"],
[lang==="de"?"Exportbehoerde":"Export Authority","Min. Justicia Colombia"],
[lang==="de"?"BtM Behoerde":"Narcotics Authority","Min. Salud / INVIMA"],
[lang==="de"?"Erster Import":"First Import","Q3 2026 (planned)"],
[lang==="de"?"GMP Audit":"GMP Audit",lang==="de"?"Ausstehend":"Pending"],
[lang==="de"?"QTA Status":"QTA Status",lang==="de"?"Entwurf":"Draft"]
]:[
["Email","info@hytn.ca"],
[lang==="de"?"Exportbehoerde":"Export Authority","Health Canada"],
[lang==="de"?"Erster Import":"First Import","Q3 2026 (planned)"],
[lang==="de"?"GMP Audit":"GMP Audit",lang==="de"?"Ausstehend":"Pending"],
[lang==="de"?"EU-GMP Zertifikat":"EU-GMP Certificate",lang==="de"?"Beantragt":"Applied"]
]).map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid #f3f4f6",fontSize:14}}>
<span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
</div>)}
</div>
</div>
</Cd>

{/* Licenses & Certifications */}
<Cd t={"📜 "+(lang==="de"?"Lizenzen & Zertifikate":"Licenses & Certifications")} badge={<Bd c={sup==="cannava"?"#059669":"#d97706"} b={sup==="cannava"?"#dcfce7":"#fef3c7"}>{sup==="cannava"?(lang==="de"?"Qualifiziert":"Qualified"):(lang==="de"?"Ausstehend":"Pending")}</Bd>}>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
<thead><tr style={{background:"#f1f5f9"}}>
{[lang==="de"?"Dokument":"Document",lang==="de"?"Referenz":"Reference",lang==="de"?"Ausgestellt":"Issued",lang==="de"?"Gueltig bis":"Valid Until",lang==="de"?"Status":"Status",lang==="de"?"Tage":"Days"].map((h,j)=>
<th key={j} style={{padding:"5px 8px",borderBottom:"2px solid #cbd5e1",textAlign:"left",fontWeight:700,fontSize:12,color:"#475569"}}>{h}</th>)}
</tr></thead>
<tbody>
{(sup==="cannava"?[
{doc:"GMP Certificate (ANMAT)",ref:"ANMAT-GMP-2024-4821",iss:"15.03.2024",exp:"15.03.2028",days:1112,st:"valid"},
{doc:lang==="de"?"Herstellungserlaubnis":"Manufacturing License",ref:"ANMAT Disp. 2025/1847",iss:"01.01.2025",exp:"31.12.2025",days:-58,st:"expired"},
{doc:lang==="de"?"Exportgenehmigung":"Export License",ref:"SEDRONAR-EXP-2025",iss:"01.06.2025",exp:"18.08.2026",days:172,st:"valid"},
{doc:"GACP Certificate (GC-MARK®)",ref:"30350601 GC (DQS CFS GmbH)",iss:"24.02.2026",exp:"23.02.2027",days:362,st:"valid"},
{doc:"Quality Technical Agreement",ref:"QTA-NOC-CANN-2024-01",iss:"01.09.2024",exp:"15.03.2026",days:16,st:"warning"},
{doc:lang==="de"?"Lieferantenqualifizierungsbericht":"Supplier Qualification File",ref:"SQF-CANN-2025-001",iss:"22.03.2025",exp:"22.03.2027",days:388,st:"valid"},
{doc:"PIC/S GMP Status",ref:"Argentina (ANMAT) — PIC/S Member",iss:"—",exp:"—",days:9999,st:"valid"},
{doc:lang==="de"?"GMP Auditbericht":"GMP Audit Report",ref:"NOC-AUDIT-CANN-2025-01",iss:"12.02.2025",exp:"12.02.2026",days:-15,st:"overdue"},
{doc:lang==="de"?"Produktspezifikation":"Product Specification",ref:"Cannabis flos — Ph.Eur.",iss:"—",exp:"—",days:9999,st:"valid"},
{doc:lang==="de"?"Stabilitaetsdaten":"Stability Data",ref:"ICH Q1A — 24mo / 25C/60%RH",iss:"15.03.2025",exp:"15.03.2027",days:381,st:"valid"},
{doc:"COA (Latest Batch)",ref:"COA-CANN-2025-BI02",iss:"10.11.2025",exp:"—",days:9999,st:"valid"},
{doc:"BtM Export Declaration",ref:"SEDRONAR-BTM-2025",iss:"01.11.2025",exp:"—",days:9999,st:"valid"},
{doc:"INCB Allocation",ref:"INCB-IMP-DE-2025-0891",iss:"01.01.2025",exp:"31.12.2025",days:-58,st:"expired"},
{doc:"Insurance (Transport)",ref:"AIG-CARGO-2025-NOC",iss:"01.01.2025",exp:"31.12.2025",days:-58,st:"expired"}
]:sup==="mccn"?[
{doc:"GMP Certificate (INVIMA)",ref:lang==="de"?"Ausstehend":"Pending",iss:"—",exp:"—",days:0,st:"pending"},
{doc:lang==="de"?"Exportgenehmigung":"Export License",ref:lang==="de"?"Beantragt":"Applied",iss:"—",exp:"—",days:0,st:"pending"},
{doc:"GACP Certificate",ref:lang==="de"?"Ausstehend":"Pending",iss:"—",exp:"—",days:0,st:"pending"},
{doc:"Quality Technical Agreement",ref:lang==="de"?"Entwurf":"Draft",iss:"—",exp:"—",days:0,st:"draft"},
{doc:"PIC/S Status",ref:"Colombia — NOT PIC/S Member",iss:"—",exp:"—",days:0,st:"warning"},
{doc:lang==="de"?"GMP Audit":"GMP Audit",ref:lang==="de"?"Geplant Q2 2026":"Planned Q2 2026",iss:"—",exp:"—",days:0,st:"pending"}
]:[
{doc:"GMP Certificate (Health Canada)",ref:lang==="de"?"Ausstehend":"Pending",iss:"—",exp:"—",days:0,st:"pending"},
{doc:"EU-GMP Certificate",ref:lang==="de"?"Beantragt":"Applied",iss:"—",exp:"—",days:0,st:"pending"},
{doc:"Quality Technical Agreement",ref:lang==="de"?"Entwurf":"Draft",iss:"—",exp:"—",days:0,st:"draft"},
{doc:"PIC/S Status",ref:"Canada — PIC/S Member ✅",iss:"—",exp:"—",days:9999,st:"valid"},
{doc:lang==="de"?"GMP Audit":"GMP Audit",ref:lang==="de"?"Geplant Q2 2026":"Planned Q2 2026",iss:"—",exp:"—",days:0,st:"pending"}
]).map((d,j)=><tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:d.st==="expired"||d.st==="overdue"?"#fef2f2":d.st==="warning"?"#fffbeb":"#fff"}}>
<td style={{padding:"5px 8px",fontWeight:600}}>{d.doc}</td>
<td style={{padding:"5px 8px",fontSize:12}}>{d.ref}</td>
<td style={{padding:"5px 8px",fontSize:12}}>{d.iss}</td>
<td style={{padding:"5px 8px",fontSize:12,fontWeight:d.st==="expired"||d.st==="overdue"?700:400,color:d.st==="expired"||d.st==="overdue"?"#dc2626":d.st==="warning"?"#d97706":"#374151"}}>{d.exp}</td>
<td style={{padding:"5px 8px"}}>{
d.st==="valid"?<Bd c="#059669" b="#dcfce7">✅ {lang==="de"?"Gueltig":"Valid"}</Bd>:
d.st==="expired"?<Bd c="#dc2626" b="#fee2e2">❌ {lang==="de"?"Abgelaufen":"Expired"}</Bd>:
d.st==="overdue"?<Bd c="#dc2626" b="#fee2e2">⚠️ {lang==="de"?"Ueberfaellig":"Overdue"}</Bd>:
d.st==="warning"?<Bd c="#d97706" b="#fef3c7">⚠️ {d.days}d</Bd>:
d.st==="draft"?<Bd c="#6b7280" b="#f3f4f6">{lang==="de"?"Entwurf":"Draft"}</Bd>:
<Bd c="#d97706" b="#fef3c7">{lang==="de"?"Ausstehend":"Pending"}</Bd>
}</td>
<td style={{padding:"5px 8px",fontSize:12,fontWeight:600,color:d.days<0?"#dc2626":d.days<60?"#d97706":"#059669"}}>{d.days>9000?"—":d.days===0?"—":d.days+"d"}</td>
</tr>)}
</tbody>
</table>
</div>
</Cd>

{/* Audit History */}
<Cd t={"🔍 "+(lang==="de"?"Audit-Historie":"Audit History")}>
{(sup==="cannava"?[
{date:"12.02.2025",type:lang==="de"?"Erstaudit (vor Ort)":"Initial Audit (On-site)",loc:"San Juan, Argentina",by:"C. Hamelink (RP)",result:"✅ "+( lang==="de"?"Bestanden — 2 kleinere Abweichungen":"Passed — 2 minor findings"),next:lang==="de"?"12.02.2026 (UEBERFAELLIG)":"12.02.2026 (OVERDUE)"},
{date:"22.03.2025",type:lang==="de"?"Nachaudit (Remote)":"Follow-up Audit (Remote)",loc:"Video Call",by:"C. Hamelink / Lic. Ruiz",result:"✅ "+(lang==="de"?"Abweichungen behoben":"Findings resolved"),next:"—"}
]:sup==="mccn"?[
{date:"—",type:lang==="de"?"Erstaudit geplant":"Initial Audit Planned",loc:"Bogota, Colombia",by:"C. Hamelink (RP)",result:lang==="de"?"Ausstehend — Q2 2026":"Pending — Q2 2026",next:"Q2 2026"}
]:[
{date:"—",type:lang==="de"?"Erstaudit geplant":"Initial Audit Planned",loc:"BC, Canada",by:"C. Hamelink (RP)",result:lang==="de"?"Ausstehend — Q2 2026":"Pending — Q2 2026",next:"Q2 2026"}
]).map((a,j)=><div key={j} style={{padding:8,marginBottom:6,background:a.date==="—"?"#f9fafb":"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{fontSize:14,fontWeight:700}}>{a.date} — {a.type}</div>
<Bd c={a.result.includes("✅")?"#059669":"#d97706"} b={a.result.includes("✅")?"#dcfce7":"#fef3c7"}>{a.result.includes("✅")?(lang==="de"?"Bestanden":"Passed"):(lang==="de"?"Ausstehend":"Pending")}</Bd>
</div>
<div style={{fontSize:13,color:"#6b7280",marginTop:2}}>{lang==="de"?"Ort":"Location"}: {a.loc} · {lang==="de"?"Pruefer":"Auditor"}: {a.by}</div>
<div style={{fontSize:13,marginTop:2}}>{a.result}</div>
{a.next!=="—"&&<div style={{fontSize:12,color:a.next.includes("OVER")?"#dc2626":"#d97706",fontWeight:600,marginTop:2}}>{lang==="de"?"Naechster Audit":"Next Audit"}: {a.next}</div>}
</div>)}
</Cd>

{/* Actions */}
<div style={{display:"flex",gap:8}}>
<button onClick={()=>{const sn=sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN";const w=window.open("","_blank","width=800,height=700");w.document.write('<html><head><title>Supplier Dossier — '+sn+'</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:11px}h1{font-size:16px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:6px}h2{font-size:13px;margin-top:14px}table{width:100%;border-collapse:collapse;margin:6px 0}td,th{padding:4px 6px;border:1px solid #d1d5db;font-size:9px}th{background:#f1f5f9}.banner{background:#1e40af;color:#fff;padding:12px 30px;margin:-30px -30px 16px}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:8px;color:#9ca3af;text-align:center}.sig{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:20px}.sig>div{border-top:1px solid #000;padding-top:4px;text-align:center;font-size:9px}@media print{body{padding:15px}.banner{margin:-15px -15px 12px}}</style></head><body>');w.document.write('<div class="banner"><strong>NOC Pharma GmbH</strong> — Lieferantendossier / Supplier Dossier — '+sn+'</div>');w.document.write('<h1>'+sn+' — Supplier Qualification Dossier</h1><p>Generated: '+new Date().toLocaleDateString("de-DE")+' · SOP-CS-001 · EU GMP Chapter 7</p>');w.document.write('<h2>Deutsch — Qualifikationsstatus</h2><p>Lieferant: '+sn+'<br/>Status: '+(sup==="cannava"?"Qualifiziert":"Ausstehend")+'<br/>PIC/S: '+(sup==="cannava"?"Ja (ANMAT)":"Ausstehend")+'</p>');w.document.write('<h2>English — Qualification Status</h2><p>Supplier: '+sn+'<br/>Status: '+(sup==="cannava"?"Qualified":"Pending")+'<br/>PIC/S: '+(sup==="cannava"?"Yes (ANMAT)":"Pending")+'</p>');w.document.write('<div class="sig"><div>Sampled by<br/><br/><br/>____________</div><div>Dispatch approved<br/><br/><br/>C. Hamelink (RP)</div><div>Received by QP<br/><br/><br/>Dr. O. Schagon</div></div>');w.document.write('<div class="ft">NOC Pharma GmbH · QMS v2.5 · SOP-CS-001 · EU GMP Ch.7 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>
🖨️ {lang==="de"?"Dossier drucken (DE+EN)":"Print Dossier (DE+EN)"}
</button>
<button onClick={()=>{const sn=sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN";const body="NOC PHARMA GmbH\nSupplier Dossier — "+sn+"\n"+"=".repeat(40)+"\n\nSupplier: "+sn+"\nStatus: "+(sup==="cannava"?"Qualified":"Pending")+"\nPIC/S: "+(sup==="cannava"?"Yes (ANMAT)":"Pending")+"\nBatches: "+(sup==="cannava"?"4":"1")+"\n\n"+"=".repeat(40)+"\nNOC Pharma GmbH · QMS v2.5";window.open(gmailLink("NOC Pharma — Supplier Dossier — "+sn,body),"_blank")}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>
📧 {lang==="de"?"Dossier senden":"Send Dossier"}
</button>
<button onClick={()=>window.open("http://localhost:3000/suppliers","_blank")} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>
🔗 QMS v1.0
</button>
</div>
</div>,
finance:<div>
{(()=>{
const fmt=n=>n>=1000000?"€"+(n/1000000).toFixed(2)+"M":n>=1000?"€"+(n/1000).toFixed(1)+"K":"€"+Math.round(n);
const fmtF=n=>"€"+n.toLocaleString("de-DE",{minimumFractionDigits:0,maximumFractionDigits:0});

/* ========== COMPLETE FINANCIAL DATA PER SUPPLIER ========== */
const FIN={
cannava:{
fl:"🇦🇷",n:"Cannava S.E. (Cannabis Avatara)",color:"#059669",cur:"USD→EUR",
/* PURCHASE COSTS */
batches:[
{id:"BI-01",product:"NOC SE 17",kg:59.5,units:"48×1kg+115×10g",pzn:"18706190",
 fobKg:2850,fobTotal:169575,
 exportPermit:1200,sedronar:800,phyto:350,originCert:150,
 freight:8200,insurance:1450,customs:3800,customsBroker:1200,
 btmFee:450,bfarmPermit:2800,incbFee:0,
 qsiLab:4800,qsiSamples:1400,
 relabeling:2200,packaging:1800,
 warehouse3mo:1500,temperatureMonitor:600,
 vat19:0,
 totalCost:200275,costPerKg:3366,
 status:"sold",releaseDate:"15.05.2025"},
{id:"BI-02",product:"NOC SE 19",kg:198.5,units:"139×1kg+100×10g",pzn:"18706209",
 fobKg:3150,fobTotal:625275,
 exportPermit:1200,sedronar:800,phyto:350,originCert:150,
 freight:18500,insurance:4200,customs:12800,customsBroker:2400,
 btmFee:450,bfarmPermit:2800,incbFee:0,
 qsiLab:6200,qsiSamples:1400,
 relabeling:4800,packaging:3600,
 warehouse3mo:4500,temperatureMonitor:600,
 vat19:125368,
 totalCost:814993,costPerKg:4106,
 status:"storage",releaseDate:"10.12.2025"},
{id:"BI-03",product:"NOC SE 20",kg:60,units:"TBD",pzn:"TBD",
 fobKg:3150,fobTotal:189000,
 exportPermit:1200,sedronar:800,phyto:350,originCert:150,
 freight:9200,insurance:1800,customs:4500,customsBroker:1200,
 btmFee:450,bfarmPermit:0,incbFee:0,
 qsiLab:5200,qsiSamples:1400,
 relabeling:2400,packaging:1800,
 warehouse3mo:1500,temperatureMonitor:600,
 vat19:41648,
 totalCost:262798,costPerKg:4380,
 status:"transit",releaseDate:"ETA Apr 2026"},
{id:"BI-04",product:"NOC SE 21",kg:60,units:"TBD",pzn:"TBD",
 fobKg:3200,fobTotal:192000,
 exportPermit:1200,sedronar:800,phyto:350,originCert:150,
 freight:9500,insurance:1800,customs:4500,customsBroker:1200,
 btmFee:450,bfarmPermit:2800,incbFee:0,
 qsiLab:5200,qsiSamples:1400,
 relabeling:2400,packaging:1800,
 warehouse3mo:1500,temperatureMonitor:600,
 vat19:42428,
 totalCost:269478,costPerKg:4491,
 status:"planned",releaseDate:"Q3 2026"}
],
/* SALES */
sales:[
{client:"Cansativa GmbH",city:"Frankfurt",type:lang==="de"?"Grosshandel":"Wholesale",contact:"M. Fischer",
 items:[
  {batch:"BI-01",qr:"BI-01-NOCB1-SE17-1KG-0001→0020",qty:20,unit:"1kg",priceUnit:5250,total:105000,date:"22.05.2025",invoice:"INV-2025-001",paid:true},
  {batch:"BI-01",qr:"BI-01-NOCB1-SE17-10G-0001→0050",qty:50,unit:"10g",priceUnit:78,total:3900,date:"22.05.2025",invoice:"INV-2025-001",paid:true},
  {batch:"BI-02",qr:"BI-02-NOCB1.1-INF-F-1KG-0001→0005",qty:5,unit:"1kg",priceUnit:5400,total:27000,date:"15.01.2026",invoice:"INV-2026-001",paid:true}
]},
{client:"Apotheke am Rathaus",city:"Berlin",type:lang==="de"?"Apotheke":"Pharmacy",contact:"Dr. K. Weber",
 items:[
  {batch:"BI-01",qr:"BI-01-NOCB1-SE17-10G-0051→0080",qty:30,unit:"10g",priceUnit:82,total:2460,date:"01.06.2025",invoice:"INV-2025-003",paid:true}
]},
{client:"ACA Müller GmbH",city:"Hamburg",type:lang==="de"?"Grosshandel":"Wholesale",contact:"T. Müller",
 items:[
  {batch:"BI-01",qr:"BI-01-NOCB1-SE17-1KG-0021→0040",qty:20,unit:"1kg",priceUnit:5200,total:104000,date:"10.06.2025",invoice:"INV-2025-004",paid:true},
  {batch:"BI-01",qr:"BI-01-NOCB1-SE17-10G-0081→0115",qty:35,unit:"10g",priceUnit:78,total:2730,date:"10.06.2025",invoice:"INV-2025-004",paid:true}
]},
{client:"Four 20 Pharma GmbH",city:"Köln",type:lang==="de"?"Grosshandel":"Wholesale",contact:"S. Braun",
 items:[
  {batch:"BI-01",qr:"BI-01-NOCB1-SE17-1KG-0041→0048",qty:8,unit:"1kg",priceUnit:5300,total:42400,date:"15.07.2025",invoice:"INV-2025-007",paid:true},
  {batch:"BI-02",qr:"BI-02-NOCB1.1-INF-F-1KG-0006→0010",qty:5,unit:"1kg",priceUnit:5400,total:27000,date:"20.01.2026",invoice:"INV-2026-003",paid:false}
]},
{client:"Ilios Santé GmbH",city:"München",type:lang==="de"?"Grosshandel":"Wholesale",contact:"P. Oliveira",
 items:[
  {batch:"BI-02",qr:"BI-02-NOCB1.1-INF-F-1KG-0011→0015",qty:5,unit:"1kg",priceUnit:5500,total:27500,date:"10.02.2026",invoice:"INV-2026-005",paid:false}
]}
],
logistics:{carrier:"WAS-Logistics GmbH",route:"EZE→FRA→Anklam",avgDays:12,costPerKg:48}
},

mccn:{
fl:"🇨🇴",n:"Medcolcanna S.A.S.",color:"#d97706",cur:"USD→EUR",
batches:[
{id:"MC-01",product:"NOC GK 27 COL",kg:110,units:"TBD",pzn:"TBD",
 fobKg:2400,fobTotal:264000,
 exportPermit:1500,sedronar:0,phyto:500,originCert:200,
 freight:11000,insurance:2800,customs:5500,customsBroker:1800,
 btmFee:450,bfarmPermit:2800,incbFee:0,
 qsiLab:6500,qsiSamples:1600,
 relabeling:3200,packaging:2400,
 warehouse3mo:2500,temperatureMonitor:600,
 vat19:57468,
 totalCost:364218,costPerKg:3311,
 status:"planned",releaseDate:"Sep 2026"},
{id:"MC-02",product:"NOC UG 21 COL",kg:73,units:"TBD",pzn:"TBD",
 fobKg:2400,fobTotal:175200,
 exportPermit:1500,sedronar:0,phyto:500,originCert:200,
 freight:8500,insurance:2000,customs:4200,customsBroker:1200,
 btmFee:450,bfarmPermit:0,incbFee:0,
 qsiLab:5800,qsiSamples:1400,
 relabeling:2400,packaging:1800,
 warehouse3mo:1800,temperatureMonitor:600,
 vat19:39296,
 totalCost:246846,costPerKg:3381,
 status:"planned",releaseDate:"Nov 2026"},
{id:"MC-03",product:"NOC CP 18 COL",kg:91,units:"TBD",pzn:"TBD",
 fobKg:2200,fobTotal:200200,
 exportPermit:1500,sedronar:0,phyto:500,originCert:200,
 freight:9000,insurance:2200,customs:4800,customsBroker:1400,
 btmFee:450,bfarmPermit:0,incbFee:0,
 qsiLab:6000,qsiSamples:1400,
 relabeling:2800,packaging:2000,
 warehouse3mo:2200,temperatureMonitor:600,
 vat19:44288,
 totalCost:279538,costPerKg:3072,
 status:"planned",releaseDate:"Q1 2027"}
],
sales:[],
logistics:{carrier:"TBD",route:"BOG→FRA→Anklam",avgDays:14,costPerKg:52},
harvest:[
{m:"Apr",kg:110,s:"GUAVA HAZE 26%"},{m:"Jun",kg:183,s:"GUAVA+PURPLE 21-26%"},
{m:"Jul",kg:51,s:"PURPLE GUAVA 21%"},{m:"Aug",kg:292,s:"CHERRY+GUAVA+CITRICA"},
{m:"Sep",kg:77,s:"PURPLE GUAVA 21%"},{m:"Oct",kg:201,s:"MANGO+GUAVA"},
{m:"Nov",kg:269,s:"CITRICA+PURPLE"},{m:"Dec",kg:110,s:"GUAVA HAZE 26%"},
{m:"Jan",kg:199,s:"CHERRY+PURPLE"}
]
},

hytn:{
fl:"🇨🇦",n:"HYTN Cannabis Inc.",color:"#2563eb",cur:"CAD→EUR",
batches:[
{id:"HY-01",product:"HYTN Indoor Hybrid",kg:25,units:"TBD",pzn:"TBD",
 fobKg:4200,fobTotal:105000,
 exportPermit:800,sedronar:0,phyto:400,originCert:200,
 freight:6500,insurance:1200,customs:2800,customsBroker:900,
 btmFee:450,bfarmPermit:2800,incbFee:0,
 qsiLab:4500,qsiSamples:1200,
 relabeling:1200,packaging:800,
 warehouse3mo:800,temperatureMonitor:600,
 vat19:24466,
 totalCost:153616,costPerKg:6145,
 status:"planned",releaseDate:"Q4 2026"}
],
sales:[],
logistics:{carrier:"TBD",route:"YVR→FRA→Anklam",avgDays:10,costPerKg:60}
}
};

const allSups=Object.entries(FIN);
const sd=FIN[sup];
const totalInvest=allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.totalCost,0),0);
const totalFob=allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.fobTotal,0),0);
const totalVat=allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.vat19,0),0);
const totalKg=allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.kg,0),0);
const totalSalesAll=allSups.reduce((a,[,s])=>a+s.sales.reduce((b,cl)=>b+cl.items.reduce((c,it)=>c+it.total,0),0),0);
const totalFreightAll=allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.freight,0),0);
const totalProcessAll=allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.qsiLab+bt.qsiSamples+bt.relabeling+bt.packaging,0),0);

return <div>

{/* ═══════════════ ALL SUPPLIERS CONSOLIDATED ═══════════════ */}
<div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:12,padding:16,marginBottom:14,color:"#fff"}}>
<div style={{fontSize:22,fontWeight:800,marginBottom:10}}>💰 NOC Pharma — {lang==="de"?"Finanz-Kontrollzentrum":"Financial Control Center"}</div>

{/* Global KPIs */}
<div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:6,marginBottom:12}}>
{[
[lang==="de"?"Gesamtinvestition":"Total Investment",fmtF(totalInvest),"#f87171"],
["FOB ("+(lang==="de"?"Einkauf":"Purchase")+")",fmtF(totalFob),"#fb923c"],
["VAT 19%",fmtF(totalVat),"#fbbf24"],
[lang==="de"?"Logistik":"Logistics",fmtF(totalFreightAll),"#60a5fa"],
[lang==="de"?"Verarbeitung":"Processing",fmtF(totalProcessAll),"#a78bfa"],
[lang==="de"?"Umsatz":"Revenue",fmtF(totalSalesAll),"#4ade80"],
[lang==="de"?"Marge":"Margin",totalSalesAll>0?Math.round((totalSalesAll-totalInvest*0.42)/totalSalesAll*100)+"%":"—","#34d399"]
].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",padding:"8px 4px",background:"rgba(255,255,255,.07)",borderRadius:6}}>
<div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:11,opacity:.7}}>{l}</div>
</div>)}
</div>

{/* Supplier comparison bars */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
{allSups.map(([k,s])=>{const inv=s.batches.reduce((a,b)=>a+b.totalCost,0);const rev=s.sales.reduce((a,cl)=>a+cl.items.reduce((b,it)=>b+it.total,0),0);const kg=s.batches.reduce((a,b)=>a+b.kg,0);const avgCost=Math.round(inv/kg);return <div key={k} onClick={()=>setSup(k)} style={{padding:10,background:sup===k?"rgba(255,255,255,.12)":"rgba(255,255,255,.04)",borderRadius:8,cursor:"pointer",border:sup===k?"1px solid "+s.color:"1px solid transparent"}}>
<div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontWeight:700,fontSize:14}}>{s.fl} {s.n.split("(")[0]}</span></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:4,fontSize:11}}>
<div><div style={{color:"#f87171",fontWeight:700}}>{fmtF(inv)}</div><div style={{opacity:.5,fontSize:11}}>{lang==="de"?"Invest":"Invest"}</div></div>
<div><div style={{color:"#4ade80",fontWeight:700}}>{fmtF(rev)}</div><div style={{opacity:.5,fontSize:11}}>{lang==="de"?"Umsatz":"Revenue"}</div></div>
<div><div style={{color:"#fbbf24",fontWeight:700}}>€{avgCost}/kg</div><div style={{opacity:.5,fontSize:11}}>{lang==="de"?"Kosten":"Cost"}/kg</div></div>
</div>
<div style={{height:4,background:"rgba(255,255,255,.1)",borderRadius:2,marginTop:6}}><div style={{height:4,background:s.color,borderRadius:2,width:Math.max(5,(inv/totalInvest*100))+"%"}}/></div>
</div>})}
</div>
</div>

{/* ═══════════════ SELECTED SUPPLIER DETAIL ═══════════════ */}
<div style={{borderRadius:12,border:"2px solid "+sd.color+"44",background:sd.color+"06",padding:14,marginBottom:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
<div style={{fontSize:19,fontWeight:800,color:sd.color}}>{sd.fl} {sd.n} — {lang==="de"?"Finanzanalyse":"Financial Analysis"}</div>
<div style={{display:"flex",gap:4}}>
<Bd c={sd.color} b={sd.color+"18"}>{sd.batches.reduce((a,b)=>a+b.kg,0)}kg</Bd>
<Bd c={sd.color} b={sd.color+"18"}>{sd.batches.length} {lang==="de"?"Chargen":"Batches"}</Bd>
</div>
</div>

{/* Supplier KPIs */}
{(()=>{const inv=sd.batches.reduce((a,b)=>a+b.totalCost,0);const fob=sd.batches.reduce((a,b)=>a+b.fobTotal,0);const vat=sd.batches.reduce((a,b)=>a+b.vat19,0);const frt=sd.batches.reduce((a,b)=>a+b.freight+b.insurance,0);const proc=sd.batches.reduce((a,b)=>a+b.qsiLab+b.qsiSamples+b.relabeling+b.packaging,0);const rev=sd.sales.reduce((a,cl)=>a+cl.items.reduce((b,it)=>b+it.total,0),0);const kg=sd.batches.reduce((a,b)=>a+b.kg,0);const paidRev=sd.sales.reduce((a,cl)=>a+cl.items.filter(it=>it.paid).reduce((b,it)=>b+it.total,0),0);const unpaid=rev-paidRev;
return <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:6,marginBottom:12}}>
{[
[lang==="de"?"Investition":"Investment",fmtF(inv),"#dc2626"],
["FOB",fmtF(fob),sd.color],
[lang==="de"?"Logistik":"Logistics",fmtF(frt),"#2563eb"],
[lang==="de"?"Verarbeitung":"Processing",fmtF(proc),"#7c3aed"],
["VAT 19%",fmtF(vat),"#d97706"],
[lang==="de"?"Umsatz":"Revenue",fmtF(rev),"#059669"],
[lang==="de"?"Bezahlt":"Paid",fmtF(paidRev),"#059669"],
[lang==="de"?"Offen":"Unpaid",fmtF(unpaid),unpaid>0?"#dc2626":"#059669"]
].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:6,padding:8,textAlign:"center",border:"1px solid #e5e7eb"}}>
<div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:11,color:"#6b7280"}}>{l}</div>
</div>)}
</div>})()}

{/* ══ COST BREAKDOWN TABLE ══ */}
<Cd t={lang==="de"?"📊 Kostenaufstellung pro Charge":"📊 Cost Breakdown per Batch"}>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
<thead><tr style={{background:sd.color+"12"}}>
{[lang==="de"?"Charge":"Batch","kg",lang==="de"?"Produkt":"Product","FOB",lang==="de"?"Export":"Export",lang==="de"?"Fracht+Vers.":"Freight+Ins.",lang==="de"?"Zoll":"Customs","BfArM/BtM",lang==="de"?"Labor (QSI)":"Lab (QSI)",lang==="de"?"Etikettierung":"Relabeling",lang==="de"?"Lager":"Storage","VAT 19%",lang==="de"?"GESAMT":"TOTAL","€/kg",lang==="de"?"Status":"Status"].map((h,j)=>
<th key={j} style={{padding:"5px 4px",textAlign:j>2?"right":"left",fontWeight:700,fontSize:11,color:sd.color,borderBottom:"2px solid "+sd.color+"44",whiteSpace:"nowrap"}}>{h}</th>)}
</tr></thead>
<tbody>
{sd.batches.map((b,j)=><tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:b.status==="transit"?"#eff6ff":"#fff"}}>
<td style={{padding:"5px 4px",fontWeight:700,color:sd.color}}>{b.id}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:600}}>{b.kg}</td>
<td style={{padding:"5px 4px",fontSize:11}}>{b.product}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:600}}>{fmtF(b.fobTotal)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontSize:11}}>{fmtF(b.exportPermit+b.sedronar+b.phyto+b.originCert)}</td>
<td style={{padding:"5px 4px",textAlign:"right"}}>{fmtF(b.freight+b.insurance)}</td>
<td style={{padding:"5px 4px",textAlign:"right"}}>{fmtF(b.customs+b.customsBroker)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontSize:11}}>{fmtF(b.btmFee+b.bfarmPermit)}</td>
<td style={{padding:"5px 4px",textAlign:"right"}}>{fmtF(b.qsiLab+b.qsiSamples)}</td>
<td style={{padding:"5px 4px",textAlign:"right"}}>{fmtF(b.relabeling+b.packaging)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontSize:11}}>{fmtF(b.warehouse3mo+b.temperatureMonitor)}</td>
<td style={{padding:"5px 4px",textAlign:"right",color:"#d97706"}}>{fmtF(b.vat19)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:800,color:"#dc2626"}}>{fmtF(b.totalCost)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:700,color:"#7c3aed"}}>€{b.costPerKg}</td>
<td style={{padding:"5px 4px"}}><Bd c={b.status==="sold"?"#6b7280":b.status==="storage"?"#059669":b.status==="transit"?"#2563eb":"#d97706"} b={b.status==="sold"?"#f3f4f6":b.status==="storage"?"#dcfce7":b.status==="transit"?"#dbeafe":"#fef3c7"}>{b.status}</Bd></td>
</tr>)}
<tr style={{background:sd.color+"08",fontWeight:700,fontSize:13}}>
<td style={{padding:"6px 4px"}}>{lang==="de"?"GESAMT":"TOTAL"}</td>
<td style={{padding:"6px 4px",textAlign:"right"}}>{sd.batches.reduce((a,b)=>a+b.kg,0)}</td>
<td/>
<td style={{padding:"6px 4px",textAlign:"right"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.fobTotal,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.exportPermit+b.sedronar+b.phyto+b.originCert,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.freight+b.insurance,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.customs+b.customsBroker,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.btmFee+b.bfarmPermit,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.qsiLab+b.qsiSamples,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.relabeling+b.packaging,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.warehouse3mo+b.temperatureMonitor,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right",color:"#d97706"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.vat19,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right",color:"#dc2626"}}>{fmtF(sd.batches.reduce((a,b)=>a+b.totalCost,0))}</td>
<td style={{padding:"6px 4px",textAlign:"right",color:"#7c3aed"}}>€{Math.round(sd.batches.reduce((a,b)=>a+b.totalCost,0)/sd.batches.reduce((a,b)=>a+b.kg,0))}</td>
<td/>
</tr>
</tbody></table>
</div>
</Cd>

{/* ══ SALES & CLIENTS TABLE ══ */}
{sd.sales.length>0&&<Cd t={lang==="de"?"🛒 Verkäufe & Kunden — QR-Code Tracking":"🛒 Sales & Clients — QR Code Tracking"}>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
<thead><tr style={{background:"#f0fdf4"}}>
{[lang==="de"?"Kunde":"Client",lang==="de"?"Stadt":"City",lang==="de"?"Typ":"Type",lang==="de"?"Charge":"Batch",lang==="de"?"QR-Codes":"QR Codes",lang==="de"?"Menge":"Qty",lang==="de"?"Einheit":"Unit","€/"+( lang==="de"?"Einheit":"Unit"),lang==="de"?"Gesamt":"Total",lang==="de"?"Rechnung":"Invoice",lang==="de"?"Datum":"Date",lang==="de"?"Bezahlt":"Paid"].map((h,j)=>
<th key={j} style={{padding:"5px 4px",textAlign:j>4?"right":"left",fontWeight:700,fontSize:11,color:"#065f46",borderBottom:"2px solid #a7f3d0",whiteSpace:"nowrap"}}>{h}</th>)}
</tr></thead>
<tbody>
{sd.sales.flatMap((cl,ci)=>cl.items.map((it,ii)=><tr key={ci+"-"+ii} style={{borderBottom:"1px solid #f0fdf4",background:it.paid?"#fff":"#fff7ed"}}>
{ii===0&&<td rowSpan={cl.items.length} style={{padding:"5px 4px",fontWeight:700,borderRight:"2px solid #f0fdf4",verticalAlign:"top"}}>{cl.client}<div style={{fontSize:11,color:"#6b7280",fontWeight:400}}>{cl.contact}</div></td>}
{ii===0&&<td rowSpan={cl.items.length} style={{padding:"5px 4px",verticalAlign:"top",fontSize:13}}>{cl.city}</td>}
{ii===0&&<td rowSpan={cl.items.length} style={{padding:"5px 4px",verticalAlign:"top"}}><Bd c={cl.type.includes("Gross")||cl.type.includes("Whole")?"#2563eb":"#7c3aed"} b={cl.type.includes("Gross")||cl.type.includes("Whole")?"#dbeafe":"#ede9fe"}>{cl.type}</Bd></td>}
<td style={{padding:"5px 4px",fontWeight:600,color:sd.color}}>{it.batch}</td>
<td style={{padding:"5px 4px",fontSize:11,fontFamily:"monospace",color:"#6b7280"}}>{it.qr}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:600}}>{it.qty}</td>
<td style={{padding:"5px 4px",textAlign:"right"}}>{it.unit}</td>
<td style={{padding:"5px 4px",textAlign:"right"}}>{fmtF(it.priceUnit)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:700,color:"#059669"}}>{fmtF(it.total)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontSize:11,fontFamily:"monospace"}}>{it.invoice}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontSize:12}}>{it.date}</td>
<td style={{padding:"5px 4px",textAlign:"right"}}>{it.paid?<Bd c="#059669" b="#dcfce7">✅</Bd>:<Bd c="#dc2626" b="#fee2e2">{lang==="de"?"Offen":"Open"}</Bd>}</td>
</tr>))}
{/* Sales totals */}
<tr style={{background:"#f0fdf4",fontWeight:700}}>
<td colSpan={3} style={{padding:"6px 4px"}}>{sd.sales.length} {lang==="de"?"Kunden":"Clients"}</td>
<td colSpan={2}/>
<td style={{padding:"6px 4px",textAlign:"right"}}>{sd.sales.reduce((a,cl)=>a+cl.items.reduce((b,it)=>b+it.qty,0),0)}</td>
<td colSpan={2}/>
<td style={{padding:"6px 4px",textAlign:"right",color:"#059669"}}>{fmtF(sd.sales.reduce((a,cl)=>a+cl.items.reduce((b,it)=>b+it.total,0),0))}</td>
<td colSpan={2}/>
<td style={{padding:"6px 4px",textAlign:"right"}}>{fmtF(sd.sales.reduce((a,cl)=>a+cl.items.filter(it=>it.paid).reduce((b,it)=>b+it.total,0),0))} ✅</td>
</tr>
</tbody></table>
</div>
</Cd>}

{sd.sales.length===0&&<Cd t={lang==="de"?"🛒 Verkäufe":"🛒 Sales"}>
<div style={{textAlign:"center",padding:16,color:"#9ca3af"}}>{lang==="de"?"Noch keine Verkäufe — Lieferant in Qualifizierungsphase":"No sales yet — supplier in qualification phase"}</div>
</Cd>}

{/* ══ HARVEST CALENDAR (MCCN) ══ */}
{sd.harvest&&<Cd t={"🌿 "+(lang==="de"?"Erntekalender 2026":"Harvest Calendar 2026")+" — "+sd.harvest.reduce((a,h)=>a+h.kg,0)+"kg"}>
<div style={{display:"flex",gap:3,marginBottom:6}}>
{sd.harvest.map((h,j)=><div key={j} style={{flex:1,textAlign:"center",padding:"6px 2px",borderRadius:4,background:sd.color,color:"#fff",fontSize:11}}>
<div style={{fontWeight:700}}>{h.m}</div><div style={{fontSize:11}}>{h.kg}kg</div>
</div>)}
</div>
</Cd>}

{/* ══ LOGISTICS ══ */}
<Cd t={"🚚 "+(lang==="de"?"Logistik & Transport":"Logistics & Transport")}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8}}>
{[
[lang==="de"?"Spediteur":"Carrier",sd.logistics.carrier],
["Route",sd.logistics.route],
[lang==="de"?"Laufzeit":"Transit",sd.logistics.avgDays+"d"],
["€/kg","€"+sd.logistics.costPerKg],
[lang==="de"?"Gesamt Fracht":"Total Freight",fmtF(sd.batches.reduce((a,b)=>a+b.freight+b.insurance,0))]
].map(([l,v],j)=><div key={j} style={{padding:8,background:"#f9fafb",borderRadius:6,textAlign:"center"}}>
<div style={{fontSize:15,fontWeight:700}}>{v}</div><div style={{fontSize:11,color:"#6b7280"}}>{l}</div>
</div>)}
</div>
</Cd>

{/* ══ P&L SUMMARY ══ */}
{(()=>{const inv=sd.batches.reduce((a,b)=>a+b.totalCost,0);const rev=sd.sales.reduce((a,cl)=>a+cl.items.reduce((b,it)=>b+it.total,0),0);const grossProfit=rev-sd.batches.filter(b=>b.status==="sold").reduce((a,b)=>a+b.totalCost,0);return <Cd t={lang==="de"?"📈 Gewinn & Verlust":"📈 Profit & Loss"}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
<div>
<div style={{fontSize:14,fontWeight:700,marginBottom:6,color:"#dc2626"}}>{lang==="de"?"Ausgaben":"Expenses"}</div>
{[
["FOB ("+( lang==="de"?"Einkaufspreis":"Purchase")+")",sd.batches.reduce((a,b)=>a+b.fobTotal,0)],
[lang==="de"?"Exportdokumente":"Export Documents",sd.batches.reduce((a,b)=>a+b.exportPermit+b.sedronar+b.phyto+b.originCert,0)],
[lang==="de"?"Fracht & Versicherung":"Freight & Insurance",sd.batches.reduce((a,b)=>a+b.freight+b.insurance,0)],
[lang==="de"?"Zoll & Broker":"Customs & Broker",sd.batches.reduce((a,b)=>a+b.customs+b.customsBroker,0)],
["BfArM / BtM",sd.batches.reduce((a,b)=>a+b.btmFee+b.bfarmPermit,0)],
[lang==="de"?"Labor (QSI)":"Lab (QSI)",sd.batches.reduce((a,b)=>a+b.qsiLab+b.qsiSamples,0)],
[lang==="de"?"Etikettierung & Verpackung":"Relabeling & Packaging",sd.batches.reduce((a,b)=>a+b.relabeling+b.packaging,0)],
[lang==="de"?"Lager & Monitoring":"Storage & Monitoring",sd.batches.reduce((a,b)=>a+b.warehouse3mo+b.temperatureMonitor,0)],
["VAT 19%",sd.batches.reduce((a,b)=>a+b.vat19,0)]
].map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid #f3f4f6",fontSize:13}}>
<span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600,color:"#dc2626"}}>{fmtF(v)}</span>
</div>)}
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:15,fontWeight:800,borderTop:"2px solid #dc2626",marginTop:4}}>
<span>{lang==="de"?"GESAMT AUSGABEN":"TOTAL EXPENSES"}</span><span style={{color:"#dc2626"}}>{fmtF(inv)}</span>
</div>
</div>
<div>
<div style={{fontSize:14,fontWeight:700,marginBottom:6,color:"#059669"}}>{lang==="de"?"Einnahmen":"Revenue"}</div>
{sd.sales.map((cl,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid #f3f4f6",fontSize:13}}>
<span style={{color:"#6b7280"}}>{cl.client}</span><span style={{fontWeight:600,color:"#059669"}}>{fmtF(cl.items.reduce((a,it)=>a+it.total,0))}</span>
</div>)}
{sd.sales.length===0&&<div style={{padding:8,color:"#9ca3af",fontSize:13}}>{lang==="de"?"Noch keine Einnahmen":"No revenue yet"}</div>}
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 0",fontSize:15,fontWeight:800,borderTop:"2px solid #059669",marginTop:4}}>
<span>{lang==="de"?"GESAMT UMSATZ":"TOTAL REVENUE"}</span><span style={{color:"#059669"}}>{fmtF(rev)}</span>
</div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:800,marginTop:8,background:grossProfit>=0?"#f0fdf4":"#fef2f2",borderRadius:6,padding:"8px 10px"}}>
<span>{lang==="de"?"ERGEBNIS":"NET RESULT"}</span><span style={{color:grossProfit>=0?"#059669":"#dc2626"}}>{fmtF(grossProfit)}</span>
</div>
</div>
</div>
</Cd>})()}
</div>

{/* Print & Email */}
<div style={{display:"flex",gap:8}}>
<button onClick={()=>{const sn=sd.n;const w=window.open("","_blank","width=1000,height=800");w.document.write('<html><head><title>Finance — '+sn+'</title><style>body{font-family:Arial,sans-serif;padding:25px;font-size:11px}h1{font-size:16px;color:#1e40af;border-bottom:2px solid;padding-bottom:6px}h2{font-size:13px;margin-top:14px}table{width:100%;border-collapse:collapse;margin:6px 0}td,th{padding:3px 5px;border:1px solid #d1d5db;font-size:9px;text-align:right}th{background:#f1f5f9}td:first-child,th:first-child{text-align:left}.banner{background:#0f172a;color:#fff;padding:12px;margin:-25px -25px 16px}.ft{margin-top:16px;font-size:8px;color:#9ca3af;text-align:center;border-top:1px solid #d1d5db;padding-top:6px}@media print{body{padding:15px;font-size:10px}.banner{margin:-15px -15px 12px}}</style></head><body>');w.document.write('<div class="banner"><strong>NOC Pharma GmbH</strong> — Financial Report — '+sn+'<br/>'+new Date().toLocaleDateString("de-DE")+'</div>');w.document.write('<h1>Cost Breakdown</h1><table><tr><th>Batch</th><th>kg</th><th>FOB</th><th>Freight</th><th>Customs</th><th>Lab</th><th>VAT</th><th>TOTAL</th><th>€/kg</th></tr>');sd.batches.forEach(function(b){w.document.write('<tr><td>'+b.id+'</td><td>'+b.kg+'</td><td>€'+b.fobTotal.toLocaleString()+'</td><td>€'+(b.freight+b.insurance).toLocaleString()+'</td><td>€'+(b.customs+b.customsBroker).toLocaleString()+'</td><td>€'+(b.qsiLab+b.qsiSamples).toLocaleString()+'</td><td>€'+b.vat19.toLocaleString()+'</td><td><strong>€'+b.totalCost.toLocaleString()+'</strong></td><td>€'+b.costPerKg+'</td></tr>')});w.document.write('</table>');if(sd.sales.length>0){w.document.write('<h1>Sales & Clients</h1><table><tr><th>Client</th><th>Batch</th><th>QR Codes</th><th>Qty</th><th>€/Unit</th><th>Total</th><th>Invoice</th><th>Paid</th></tr>');sd.sales.forEach(function(cl){cl.items.forEach(function(it){w.document.write('<tr><td>'+cl.client+'</td><td>'+it.batch+'</td><td style="font-size:7px">'+it.qr+'</td><td>'+it.qty+'</td><td>€'+it.priceUnit.toLocaleString()+'</td><td><strong>€'+it.total.toLocaleString()+'</strong></td><td>'+it.invoice+'</td><td>'+(it.paid?'Yes':'OPEN')+'</td></tr>')})});w.document.write('</table>')}w.document.write('<div class="ft">NOC Pharma GmbH · QMS v2.5 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{padding:"10px 22px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>🖨️ {lang==="de"?"Finanzbericht drucken":"Print Financial Report"}</button>
<button onClick={()=>{const body="NOC Pharma — Finance\n"+sd.fl+" "+sd.n+"\n"+"=".repeat(40)+"\n\n"+sd.batches.map(b=>b.id+": "+b.kg+"kg | FOB "+fmtF(b.fobTotal)+" | Total "+fmtF(b.totalCost)+" | €"+b.costPerKg+"/kg | "+b.status).join("\n")+"\n\nTotal: "+fmtF(sd.batches.reduce((a,b)=>a+b.totalCost,0))+"\nRevenue: "+fmtF(sd.sales.reduce((a,cl)=>a+cl.items.reduce((b,it)=>b+it.total,0),0));window.open(gmailLink("NOC Pharma — Finance Report — "+sd.n,body),"_blank")}} style={{padding:"10px 22px",borderRadius:6,fontSize:14,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📧 {lang==="de"?"Per Email senden":"Send by Email"}</button>
</div>
</div>
})()}
</div>,
docs:<div>
<Cd t={"📂 "+(lang==="de"?"Dokumenten-Hub — Google Drive":"Document Hub — Google Drive")} badge={<Bd c="#1a73e8" b="#dbeafe">Drive</Bd>}>

{/* Drive Setup Instructions */}
<div style={{padding:12,background:"#f0f9ff",borderRadius:8,border:"1px solid #bae6fd",marginBottom:14}}>
<div style={{fontSize:16,fontWeight:700,color:"#1e40af",marginBottom:6}}>📋 {lang==="de"?"Google Drive Ordnerstruktur":"Google Drive Folder Structure"}</div>
<div style={{fontSize:14,color:"#374151",lineHeight:1.6,fontFamily:"monospace",background:"#f8fafc",padding:10,borderRadius:6,border:"1px solid #e5e7eb"}}>
{"NOC Pharma QMS/\n├── 🇦🇷 Cannava/\n│   ├── BI-01/ (M0→M6 subfolders)\n│   ├── BI-02/ (M0→M6 subfolders)\n│   ├── BI-03/\n│   └── BI-04/\n├── 🇨🇴 Medcolcanna/\n│   └── MC-01/ (M0→M6 subfolders)\n├── 🇨🇦 HYTN/\n│   └── HY-01/ (M0→M6 subfolders)\n├── 📋 SOPs/\n├── 📄 IFA Confirmations/\n├── 📝 PZN Requests/\n└── 📊 Protocols/"}
</div>
<div style={{marginTop:8,fontSize:14,color:"#6b7280"}}>{lang==="de"?"Erstellen Sie diese Struktur in Google Drive und fügen Sie die Ordner-IDs in App.jsx ein (GD_IDS Konstante).":"Create this structure in Google Drive and paste the folder IDs in App.jsx (GD_IDS constant)."}</div>
</div>

{/* Quick Upload — Supplier Selector */}
<div style={{fontSize:16,fontWeight:700,marginBottom:8}}>📤 {lang==="de"?"Dokument hochladen & zuordnen":"Upload & Assign Document"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
{SUPS.map(s=><div key={s.k} onClick={()=>setSup(s.k)} style={{padding:12,borderRadius:8,border:sup===s.k?"2px solid #1a73e8":"1px solid #e5e7eb",background:sup===s.k?"#eff6ff":"#fff",cursor:"pointer",textAlign:"center"}}>
<div style={{fontSize:22}}>{s.fl}</div>
<div style={{fontSize:15,fontWeight:700,marginTop:2}}>{s.n}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{s.k==="cannava"?"4 batches":s.k==="mccn"?"1 batch":"1 batch"}</div>
</div>)}
</div>

{/* Document categories per stage */}
<div style={{fontSize:16,fontWeight:700,marginBottom:8}}>📋 {lang==="de"?"Dokumente pro Stage":"Documents per Stage"} — {sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN"}</div>
{SG.map((stage,si)=>{
const stDocs={
"M0":[{n:"Canmed Registration",k:"canmed"},{n:"Supplier GMP Certificate",k:"gmp"},{n:"Quality Technical Agreement",k:"qta"},{n:"PZN Registration (IFA)",k:"pzn"},{n:"BfArM Import Permit",k:"permit"},{n:"INCB Allocation",k:"incb"}],
"M0.5":[{n:"Supplier COA",k:"sup_coa"},{n:"Export Permit",k:"export"},{n:"Phytosanitary Certificate",k:"phyto"},{n:"Packing List",k:"packing"},{n:"BtM Export Declaration",k:"btm_export"},{n:"Invoice",k:"invoice"}],
"M1":[{n:"GDP Transport Order",k:"gdp_order"},{n:"CMR Waybill",k:"cmr"},{n:"Temperature Log (Sensitech)",k:"temp_log"},{n:"Customs Declaration",k:"customs"},{n:"BtM Transport Permit",k:"btm_transport"},{n:"Insurance Certificate",k:"insurance"}],
"M1.5":[{n:"Vault Arrival Protocol",k:"vault_arrival"},{n:"BtM Receipt Confirmation",k:"btm_receipt"},{n:"Visual Inspection Report",k:"visual_inspect"},{n:"Quarantine Label",k:"quarantine"}],
"M2":[{n:"QSI Lab COA",k:"qsi_coa"},{n:"Potency Analysis (HPLC)",k:"potency"},{n:"Microbiology Report",k:"micro"},{n:"Heavy Metals",k:"metals"},{n:"Mycotoxins",k:"myco"},{n:"Terpene Profile",k:"terpenes"},{n:"THC Discrepancy Protocol",k:"thc_proto"}],
"M3":[{n:"QP Release Certificate",k:"qp_cert"},{n:"Batch Release Protocol",k:"batch_release"},{n:"Abweichungsbericht",k:"deviation"},{n:"QP Declaration §16 AMG",k:"qp_decl"}],
"M3.1":[{n:"Quarantine Release Form",k:"quar_release"},{n:"Final Status Label",k:"status_label"}],
"M3.5":[{n:"GDP Outbound Transport",k:"gdp_out"},{n:"Temperature Validation",k:"temp_valid"}],
"M4":[{n:"Relabeling Protocol",k:"relabel_proto"},{n:"Label Approval (Pre-print)",k:"label_approve"},{n:"Before/After Photos",k:"label_photos"},{n:"PZN Verification",k:"pzn_verify"}],
"M4.5":[{n:"Storage Allocation Record",k:"storage_alloc"},{n:"Temperature Monitoring Setup",k:"temp_setup"},{n:"Inventory Record",k:"inventory"}],
"M5":[{n:"Shipping Order",k:"ship_order"},{n:"Customer PO",k:"customer_po"},{n:"Delivery Note",k:"delivery"},{n:"BtM Transfer Form",k:"btm_transfer"}],
"M6":[{n:"Batch Reconciliation Report",k:"recon_report"},{n:"Yield Calculation",k:"yield"},{n:"Final Batch Record",k:"final_record"},{n:"Archive Confirmation",k:"archive"}]
};
const docs=stDocs[stage.id]||[];
return <div key={stage.id} style={{marginBottom:6,border:"1px solid #e5e7eb",borderRadius:6,overflow:"hidden"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 10px",background:"#f9fafb",borderBottom:"1px solid #e5e7eb",cursor:"pointer"}} onClick={()=>setExDoc(exDoc===stage.id?null:stage.id)}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:16}}>{stage.ic}</span>
<span style={{fontSize:15,fontWeight:700}}>{stage.id} — {t[stage.n]||stage.n}</span>
<Bd c="#6b7280" b="#f3f4f6">{docs.length} docs</Bd>
</div>
<div style={{display:"flex",alignItems:"center",gap:4}}>
<button onClick={e=>{e.stopPropagation();window.open(gdLink(stage.id),"_blank")}} style={{padding:"3px 8px",borderRadius:4,fontSize:12,fontWeight:600,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer"}}>📂 {lang==="de"?"Ordner":"Folder"}</button>
<span style={{fontSize:14,color:"#9ca3af"}}>{exDoc===stage.id?"▲":"▼"}</span>
</div>
</div>
{exDoc===stage.id&&<div style={{padding:8}}>
{docs.map((d,di)=><div key={di} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"5px 8px",marginBottom:2,borderRadius:4,background:di%2===0?"#f9fafb":"#fff",border:"1px solid #f3f4f6"}}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{color:"#9ca3af",fontSize:13}}>☐</span>
<span style={{fontSize:14}}>{d.n}</span>
</div>
<div style={{display:"flex",gap:3}}>
<button onClick={()=>window.open(gdLink(d.k),"_blank")} style={{padding:"2px 6px",borderRadius:3,fontSize:12,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer"}}>📄 View</button>
<button onClick={()=>window.open(gdLink(d.k),"_blank")} style={{padding:"2px 6px",borderRadius:3,fontSize:12,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📤</button>
</div>
</div>)}
</div>}
</div>})}

{/* Batch upload */}
<div style={{marginTop:14,padding:14,background:"#fffbeb",borderRadius:8,border:"2px dashed #fbbf24"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
<div>
<div style={{fontSize:16,fontWeight:700,color:"#92400e",marginBottom:4}}>📤 {lang==="de"?"Batch-Import (ZIP / Mehrfach-Upload)":"Batch Import (ZIP / Multi-Upload)"}</div>
<div style={{fontSize:13,color:"#6b7280",lineHeight:1.4,marginBottom:8}}>{lang==="de"
?"Laden Sie alle Dokumente fuer eine Charge als ZIP oder einzeln hoch. Das System ordnet automatisch nach Dateinamen zu den richtigen Stages zu."
:"Upload all documents for a batch as ZIP or individual files. System auto-assigns to correct stages based on filenames."}</div>
</div>
<Bd c="#d97706" b="#fef3c7">{uploads.length} {lang==="de"?"hochgeladen":"uploaded"}</Bd>
</div>

{/* Batch selector for upload */}
<div style={{display:"flex",gap:6,marginBottom:8}}>
{[["BI-03","🇦🇷 BI-03 (IN TRANSIT)",true],["BI-04","🇦🇷 BI-04 (Planned)",false],["MC-01","🇨🇴 MC-01 (Qualification)",false]].map(([id,label,active])=>
<button key={id} onClick={()=>setSelBatch(id)} style={{flex:1,padding:"6px 8px",borderRadius:5,fontSize:13,fontWeight:selBatch===id?700:400,border:selBatch===id?"2px solid #b45309":"1px solid #d1d5db",background:selBatch===id?"#fef3c7":"#fff",color:selBatch===id?"#92400e":"#6b7280",cursor:"pointer"}}>{label}</button>)}
</div>

{/* Expected docs for BI-03 */}
{selBatch==="BI-03"&&<div style={{marginBottom:10,padding:8,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,color:"#1e40af",marginBottom:4}}>📋 BI-03 — {lang==="de"?"Erwartete Dokumente (40)":"Expected Documents (40)"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:12}}>
{[
["M0: Canmed Registration","M0: GMP Certificate (ANMAT)"],
["M0: Quality Technical Agreement","M0: BfArM Import Permit (New)"],
["M0: INCB Allocation 2026","M0: PZN Confirmation (IFA)"],
["M0.5: Supplier COA","M0.5: SEDRONAR Export Permit"],
["M0.5: Phytosanitary Certificate","M0.5: Packing List (60kg)"],
["M0.5: BtM Export Declaration","M0.5: Commercial Invoice"],
["M0.5: Certificate of Origin","M0.5: SENASA Health Cert"],
["M1: AWB (023-87654321)","M1: GDP Transport Order"],
["M1: CMR Waybill","M1: Temperature Logger Certs"],
["M1: Customs Declaration (MRN)","M1: Insurance Certificate"],
["M1: BtM Transport Permit","M1: IATA DG Declaration"],
["M1.5: Vault Arrival Protocol","M1.5: BtM Receipt (§13)"],
["M1.5: Visual Inspection Report","M1.5: Seal Verification"],
["M1.5: Datalogger Download","M1.5: Weight Verification"],
["M2: QSI Lab Order","M2: Chain of Custody Form"],
["M2: Sample Transfer (BtM)","M2: QSI COA (pending)"],
["M3: QP Release Cert (pending)","M3: Batch Protocol (pending)"],
["M4: Label Artwork Approval","M4: PZN Barcode Proof"],
["M6: Reconciliation (pending)","M6: Final Batch Record (pending)"]
].map(([a,b],j)=><React.Fragment key={j}>
<div style={{padding:"2px 4px",background:uploads.some(u=>u.name.toLowerCase().includes(a.split(":")[1]?.trim().toLowerCase().split(" ")[0]||"xxx"))?"#dcfce7":"#fef2f2",borderRadius:3,display:"flex",alignItems:"center",gap:3}}>
<span style={{fontSize:8}}>{uploads.some(u=>u.name.toLowerCase().includes(a.split(":")[1]?.trim().toLowerCase().split(" ")[0]||"xxx"))?"✅":"⬜"}</span>{a}
</div>
<div style={{padding:"2px 4px",background:uploads.some(u=>u.name.toLowerCase().includes(b.split(":")[1]?.trim().toLowerCase().split(" ")[0]||"xxx"))?"#dcfce7":"#fef2f2",borderRadius:3,display:"flex",alignItems:"center",gap:3}}>
<span style={{fontSize:8}}>{uploads.some(u=>u.name.toLowerCase().includes(b.split(":")[1]?.trim().toLowerCase().split(" ")[0]||"xxx"))?"✅":"⬜"}</span>{b}
</div>
</React.Fragment>)}
</div>
</div>}

{/* Upload buttons */}
<div style={{display:"flex",gap:8,justifyContent:"center"}}>
<button onClick={()=>fileRef.current&&fileRef.current.click()} style={{padding:"10px 24px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#b45309",color:"#fff",cursor:"pointer"}}>📤 {lang==="de"?"ZIP hochladen":"Upload ZIP"}</button>
<button onClick={()=>fileRef.current&&fileRef.current.click()} style={{padding:"10px 24px",borderRadius:6,fontSize:15,fontWeight:700,border:"1px solid #b45309",background:"#fff",color:"#b45309",cursor:"pointer"}}>📎 {lang==="de"?"Einzelne Dateien":"Individual Files"}</button>
</div>

{/* Recently uploaded files */}
{uploads.length>0&&<div style={{marginTop:10}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:4}}>{lang==="de"?"Zuletzt hochgeladen":"Recently Uploaded"} ({uploads.length})</div>
<div style={{maxHeight:150,overflowY:"auto"}}>
{uploads.map((u,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 6px",fontSize:12,background:j%2===0?"#f9fafb":"#fff",borderRadius:3}}>
<div style={{display:"flex",alignItems:"center",gap:4}}>
<span>{u.type?.includes("pdf")?"📄":u.type?.includes("zip")?"📦":u.type?.includes("image")?"🖼️":"📎"}</span>
<span style={{fontWeight:600}}>{u.name}</span>
<span style={{color:"#9ca3af"}}>{u.size}</span>
</div>
<div style={{display:"flex",gap:4,alignItems:"center"}}>
<Bd c="#6b7280" b="#f3f4f6">{u.stage}</Bd>
<Bd c="#2563eb" b="#dbeafe">{u.batch}</Bd>
<span style={{color:"#9ca3af",fontSize:11}}>{u.date}</span>
</div>
</div>)}
</div>
</div>}
</div>
</Cd>
</div>,
users:<Cd t={t.users}><table style={{width:"100%",fontSize:16,borderCollapse:"collapse"}}><thead><tr>{[t.name,t.email,t.role,t.status].map((h,j)=><th key={j} style={{textAlign:"left",padding:"5px",borderBottom:"2px solid #e5e7eb",fontSize:14,color:"#6b7280"}}>{h}</th>)}</tr></thead><tbody>{USERS.map((u,j)=><tr key={j} style={{borderBottom:"1px solid #f3f4f6"}}><td style={{padding:5,fontWeight:600}}>{u.n}</td><td style={{padding:5,color:"#6b7280"}}>{u.e}</td><td style={{padding:5}}><Bd c={RC[u.r]} b={RC[u.r]+"18"}>{RN[lang][u.r]}</Bd></td><td style={{padding:5}}><Bd c="#059669" b="#d1fae5">{t.active}</Bd></td></tr>)}</tbody></table></Cd>
};

if(!auth) return (<div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',system-ui,-apple-system,sans-serif",position:"relative",overflow:"hidden"}}>
{/* Background grid pattern */}
<div style={{position:"absolute",inset:0,backgroundImage:"radial-gradient(circle at 1px 1px, rgba(148,163,184,0.08) 1px, transparent 0)",backgroundSize:"40px 40px"}}/>
<div style={{position:"absolute",top:"-20%",right:"-10%",width:500,height:500,background:"radial-gradient(circle,rgba(59,130,246,0.08),transparent 70%)",borderRadius:"50%"}}/>
<div style={{position:"absolute",bottom:"-15%",left:"-5%",width:400,height:400,background:"radial-gradient(circle,rgba(16,185,129,0.06),transparent 70%)",borderRadius:"50%"}}/>

<div style={{position:"relative",width:"100%",maxWidth:560,margin:"0 20px"}}>
{/* Top regulatory bar */}
<div style={{textAlign:"center",marginBottom:32}}>
<div style={{display:"inline-flex",alignItems:"center",gap:14,padding:"10px 24px",background:"rgba(30,41,59,0.8)",borderRadius:8,border:"1px solid rgba(71,85,105,0.4)",backdropFilter:"blur(8px)",marginBottom:20}}>
<span style={{fontSize:16,fontWeight:600,color:"#94a3b8",letterSpacing:"0.05em"}}>EU-GMP</span>
<span style={{width:1,height:14,background:"#475569"}}/>
<span style={{fontSize:16,fontWeight:600,color:"#94a3b8",letterSpacing:"0.05em"}}>§52a AMG</span>
<span style={{width:1,height:14,background:"#475569"}}/>
<span style={{fontSize:16,fontWeight:600,color:"#94a3b8",letterSpacing:"0.05em"}}>BtMG</span>
<span style={{width:1,height:14,background:"#475569"}}/>
<span style={{fontSize:16,fontWeight:600,color:"#94a3b8",letterSpacing:"0.05em"}}>ALCOA+</span>
</div>

<div style={{fontSize:38,fontWeight:800,color:"#f8fafc",letterSpacing:"-0.02em",lineHeight:1.2}}>NOC Pharma</div>
<div style={{fontSize:16,fontWeight:500,color:"#64748b",marginTop:6,letterSpacing:"0.15em",textTransform:"uppercase"}}>Quality Management System</div>
<div style={{fontSize:16,color:"#475569",marginTop:8}}>{lang==="de"?"GMP-konformer Chargen-Lebenszyklus & Dokumentenkontrolle":"GMP-Compliant Batch Lifecycle & Document Control"}</div>
</div>

{/* Login card */}
<div style={{background:"rgba(30,41,59,0.6)",borderRadius:16,border:"1px solid rgba(71,85,105,0.4)",backdropFilter:"blur(16px)",overflow:"hidden",boxShadow:"0 25px 50px rgba(0,0,0,0.4)"}}>
{/* Card header */}
<div style={{padding:"24px 36px 16px",borderBottom:"1px solid rgba(71,85,105,0.3)"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
<div>
<div style={{fontSize:22,fontWeight:700,color:"#f1f5f9"}}>{lang==="de"?"Anmelden":"Sign In"}</div>
<div style={{fontSize:16,color:"#64748b",marginTop:2}}>{lang==="de"?"Autorisierter Zugang — 21 CFR Part 11":"Authorized access — 21 CFR Part 11"}</div>
</div>
<div style={{display:"flex",gap:4}}>
<button onClick={()=>setLang("de")} style={{padding:"6px 12px",borderRadius:5,fontSize:15,fontWeight:700,border:"1px solid "+(lang==="de"?"#3b82f6":"#475569"),background:lang==="de"?"rgba(59,130,246,0.15)":"transparent",color:lang==="de"?"#60a5fa":"#64748b",cursor:"pointer"}}>🇩🇪 DE</button>
<button onClick={()=>setLang("en")} style={{padding:"6px 12px",borderRadius:5,fontSize:15,fontWeight:700,border:"1px solid "+(lang==="en"?"#3b82f6":"#475569"),background:lang==="en"?"rgba(59,130,246,0.15)":"transparent",color:lang==="en"?"#60a5fa":"#64748b",cursor:"pointer"}}>🇬🇧 EN</button>
</div>
</div>
</div>

{/* Form */}
<div style={{padding:"24px 36px 20px"}}>
<div style={{marginBottom:18}}>
<label style={{display:"block",fontSize:16,fontWeight:600,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="de"?"Benutzer / E-Mail":"Username / Email"}</label>
<input value={loginForm.user} onChange={e=>setLoginForm(p=>({...p,user:e.target.value,error:""}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder={lang==="de"?"z.B. celso, dr.schagon, auditor":"e.g. celso, dr.schagon, auditor"} style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1.5px solid "+(loginForm.error?"#ef4444":"rgba(71,85,105,0.5)"),background:"rgba(15,23,42,0.6)",color:"#f1f5f9",fontSize:15,outline:"none",boxSizing:"border-box",transition:"border .2s"}}/>
</div>

<div style={{marginBottom:18}}>
<label style={{display:"block",fontSize:16,fontWeight:600,color:"#94a3b8",marginBottom:8,textTransform:"uppercase",letterSpacing:"0.05em"}}>{lang==="de"?"Passwort":"Password"}</label>
<input value={loginForm.pass} onChange={e=>setLoginForm(p=>({...p,pass:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&handleLogin()} type="password" placeholder="••••••••" style={{width:"100%",padding:"14px 16px",borderRadius:8,border:"1.5px solid rgba(71,85,105,0.5)",background:"rgba(15,23,42,0.6)",color:"#f1f5f9",fontSize:15,outline:"none",boxSizing:"border-box"}}/>
</div>

{loginForm.error&&<div style={{padding:"10px 14px",borderRadius:6,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",color:"#f87171",fontSize:16,marginBottom:14}}>{loginForm.error}</div>}

<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
<label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
<input type="checkbox" checked={loginForm.remember} onChange={e=>setLoginForm(p=>({...p,remember:e.target.checked}))} style={{accentColor:"#3b82f6",width:16,height:16}}/>
<span style={{fontSize:16,color:"#94a3b8"}}>{lang==="de"?"Angemeldet bleiben":"Remember me"}</span>
</label>
<span style={{fontSize:16,color:"#3b82f6",cursor:"pointer"}}>{lang==="de"?"Passwort vergessen?":"Forgot password?"}</span>
</div>

<button onClick={handleLogin} disabled={loginForm.loading} style={{width:"100%",padding:"15px",borderRadius:8,border:"none",background:loginForm.loading?"#475569":"linear-gradient(135deg,#2563eb,#3b82f6)",color:"#fff",fontSize:16,fontWeight:700,cursor:loginForm.loading?"wait":"pointer",transition:"all .2s",letterSpacing:"0.02em"}}>
{loginForm.loading?(lang==="de"?"Authentifizierung...":"Authenticating..."):(lang==="de"?"Anmelden":"Sign In")}
</button>
</div>

{/* Quick access */}
<div style={{padding:"18px 36px 28px",borderTop:"1px solid rgba(71,85,105,0.3)"}}>
<div style={{fontSize:15,fontWeight:600,color:"#475569",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>{lang==="de"?"Schnellzugang — Benutzer auswählen":"Quick Access — Select User"}</div>
<div style={{display:"flex",flexDirection:"column",gap:8}}>
{users.map(u=><button key={u.id} onClick={()=>{setLoginForm(p=>({...p,user:u.id}));setTimeout(()=>{setLoginForm(p=>({...p,loading:true}));setTimeout(()=>{setAuth(u);setLoginForm(p=>({...p,loading:false}))},800)},100)}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:"1px solid rgba(71,85,105,0.3)",background:"rgba(15,23,42,0.4)",cursor:"pointer",textAlign:"left",transition:"all .2s",width:"100%"}}>
<div style={{width:34,height:34,borderRadius:"50%",background:u.level==="admin"?"#059669":u.level==="qp"?"#7c3aed":u.level==="rp"?"#0891b2":u.level==="warehouse"?"#ea580c":"#dc2626",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:"#fff",flexShrink:0}}>{u.initials}</div>
<div style={{flex:1,minWidth:0}}>
<div style={{fontSize:15,fontWeight:600,color:"#e2e8f0"}}>{u.name}</div>
<div style={{fontSize:15,color:"#64748b"}}>{u.role}</div>
</div>
</button>)}
</div>
</div>
</div>

{/* Footer */}
<div style={{textAlign:"center",marginTop:28,fontSize:15,color:"#475569",lineHeight:1.7}}>
<div>NOC Pharma GmbH — Langetal 1, DE-07751 Golmsdorf</div>
<div>{lang==="de"?"Grosshandelserlaubnis":"Wholesale License"} §52a AMG · {lang==="de"?"BtM-Erlaubnis":"BtM License"} §3 BtMG · EU-GMP {lang==="de"?"konform":"compliant"}</div>
<div style={{marginTop:6,color:"#334155"}}>QMS v2.5 · {lang==="de"?"Alle Zugriffe protokolliert gemaess":"All access logged per"} 21 CFR Part 11 · ALCOA+ {lang==="de"?"Audit-Trail":"audit trail"}</div>
</div>
</div>
</div>);
return(<div style={{display:"flex",minHeight:"100vh",fontFamily:"'Segoe UI',-apple-system,sans-serif",fontSize:16,background:"#f8fafc"}}>
<input type="file" ref={fileRef} onChange={handleFileUpload} multiple accept=".zip,.pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.xml" style={{display:"none"}}/>
<nav style={{width:210,background:"linear-gradient(180deg,#065f46,#064e3b)",color:"#fff",position:"fixed",top:0,left:0,bottom:0,display:"flex",flexDirection:"column",overflowY:"auto",zIndex:100}}>
<div style={{padding:"12px 10px",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:7}}><div style={{width:30,height:30,background:"rgba(255,255,255,.15)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15}}>NOC</div><div><div style={{fontWeight:700,fontSize:16}}>NOC Pharma</div><div style={{fontSize:12,opacity:.6}}>QMS v2.3</div></div></div>
{nav.map((sec,si)=><div key={si}><div style={{padding:"7px 9px 2px",fontSize:12,textTransform:"uppercase",letterSpacing:1,opacity:.4,fontWeight:600}}>{sec.s}</div>{sec.i.map(n=><button key={n.k} onClick={()=>setPg(n.k)} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 10px",margin:"1px 4px",borderRadius:5,color:pg===n.k?"#fff":"rgba(255,255,255,.7)",background:pg===n.k?"rgba(255,255,255,.18)":"transparent",cursor:"pointer",border:"none",width:"calc(100% - 8px)",textAlign:"left",fontSize:15,fontWeight:pg===n.k?600:400}}><span style={{width:16,textAlign:"center",fontSize:16}}>{n.ic}</span>{n.l}</button>)}</div>)}
<div style={{marginTop:"auto",padding:10,borderTop:"1px solid rgba(255,255,255,.1)",fontSize:12,opacity:.5,textAlign:"center"}}>NOC Pharma QMS v2.3<br/>GxP | ALCOA+ | 21 CFR Part 11<br/>PIC/S PE 009-16</div>
</nav>
<div style={{marginLeft:210,flex:1,display:"flex",flexDirection:"column",marginRight:agO?360:0,transition:"margin .2s"}}>
<header style={{height:46,background:"#fff",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",padding:"0 16px",gap:10,position:"sticky",top:0,zIndex:50}}>
<h2 style={{fontSize:15,fontWeight:700}}>{t[pg]||pg}</h2>
<div style={{display:"flex",gap:2,marginLeft:12}}>{SUPS.map(s=><button key={s.k} onClick={()=>{setSup(s.k);setCm([])}} style={{display:"flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:6,fontSize:14,fontWeight:600,border:sup===s.k?"2px solid "+s.c:"1.5px solid #e5e7eb",background:sup===s.k?s.c+"12":"#fff",color:sup===s.k?s.c:"#6b7280",cursor:"pointer",transition:"all .15s"}}><span style={{fontSize:15}}>{s.fl}</span>{s.n}<span style={{fontSize:12,opacity:.7}}>{s.co}</span>{s.st!=="Active"&&<span style={{fontSize:11,padding:"1px 4px",borderRadius:3,background:s.st==="Qualifizierung"?"#fef3c7":"#dbeafe",color:s.st==="Qualifizierung"?"#92400e":"#1e40af"}}>{s.st}</span>}</button>)}</div>
<div style={{marginLeft:"auto",display:"flex",gap:6,alignItems:"center"}}>
<div style={{display:"flex"}}>{["de","en"].map(lg=><button key={lg} onClick={()=>setLang(lg)} style={{padding:"3px 9px",fontSize:14,fontWeight:600,border:"none",cursor:"pointer",borderRadius:lg==="de"?"4px 0 0 4px":"0 4px 4px 0",background:lang===lg?"#059669":"#e5e7eb",color:lang===lg?"#fff":"#374151"}}>{lg==="de"?"🇩🇪 DE":"🇬🇧 EN"}</button>)}</div>
<button onClick={()=>setAgO(!agO)} style={{padding:"4px 10px",borderRadius:5,fontSize:15,fontWeight:600,border:"1.5px solid "+(ag.grad[1]),cursor:"pointer",background:agO?ag.grad[1]:"#fff",color:agO?"#fff":ag.grad[1],display:"flex",alignItems:"center",gap:3}}>
{ag.fl}🇩🇪 🤖 Agent{crit>0&&<span style={{background:"#dc2626",color:"#fff",borderRadius:8,padding:"0 5px",fontSize:13,marginLeft:2}}>{crit}</span>}{warn>0&&<span style={{background:"#d97706",color:"#fff",borderRadius:8,padding:"0 5px",fontSize:13}}>{warn}</span>}
</button>
{auth&&<div style={{display:"flex",alignItems:"center",gap:6,marginLeft:4,paddingLeft:8,borderLeft:"1px solid #e5e7eb"}}>
<div style={{width:28,height:28,borderRadius:"50%",background:auth.level==="admin"?"#059669":auth.level==="qp"?"#7c3aed":auth.level==="rp"?"#0891b2":auth.level==="warehouse"?"#ea580c":"#dc2626",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:"#fff"}}>{auth.initials}</div>
<div style={{lineHeight:1.2}}>
<div style={{fontSize:14,fontWeight:700,color:"#1e293b"}}>{auth.name}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{auth.role}</div>
</div>
<button onClick={()=>{setAuth(null);setLoginForm({user:"",pass:"",remember:false,loading:false,error:""})}} style={{padding:"3px 8px",borderRadius:4,fontSize:13,fontWeight:600,border:"1px solid #e5e7eb",background:"#fff",color:"#6b7280",cursor:"pointer",marginLeft:2}} title={lang==="de"?"Abmelden":"Logout"}>⏻</button>
</div>}
</div>
</header>
<div style={{padding:14,flex:1}}>{PAGES[pg]||<div>Page not found</div>}</div>
</div>
{agO&&<Agent/>}

{/* Document Preview Modal */}
{docPreview&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setDocPreview(null)}>
<div onClick={e=>e.stopPropagation()} style={{width:600,maxHeight:"85vh",background:"#fff",borderRadius:12,boxShadow:"0 25px 50px rgba(0,0,0,.25)",overflow:"hidden",display:"flex",flexDirection:"column"}}>
<div style={{padding:"14px 18px",background:"linear-gradient(135deg,#1e3a5f,#1e40af)",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:16,fontWeight:800}}>📄 {docPreview.name}</div>
<div style={{fontSize:14,opacity:.8,marginTop:2}}>NOC Pharma GmbH · QMS v2.5</div>
</div>
<button onClick={()=>setDocPreview(null)} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:5,padding:"4px 10px",cursor:"pointer",fontWeight:700,fontSize:16}}>✕</button>
</div>
<div style={{flex:1,overflowY:"auto",padding:18}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:15}}>
<tbody>
{[
[lang==="de"?"Ref-Nr.":"Ref No.",docPreview.ref],
[lang==="de"?"Ausgestellt von":"Ausgestellt von",docPreview.by],
[lang==="de"?"Ausgestellt am":"Ausgestellt",docPreview.on],
[lang==="de"?"Gültig bis":"Gueltig bis",docPreview.vu],
[lang==="de"?"Charge":"Charge",docPreview.batch],
[lang==="de"?"Lieferant":"Lieferant",docPreview.sup],
["Stufe",docPreview.stage],
["Status",docPreview.hasDoc?"✅ "+(lang==="de"?"Konform":"Konform"):"⏳ "+(lang==="de"?"Ausstehend":"Ausstehend")]
].map(([k,v],j)=><tr key={j}><td style={{padding:"6px 10px",border:"1px solid #e5e7eb",fontWeight:700,background:"#f9fafb",width:"35%",fontSize:14}}>{k}</td><td style={{padding:"6px 10px",border:"1px solid #e5e7eb",fontSize:15}}>{v||"—"}</td></tr>)}
{docPreview.det.map((d,j)=><tr key={"d"+j}><td style={{padding:"6px 10px",border:"1px solid #e5e7eb",fontWeight:700,background:"#f9fafb",fontSize:14}}>{d[0]}</td><td style={{padding:"6px 10px",border:"1px solid #e5e7eb",fontSize:15}}>{d[1]}</td></tr>)}
</tbody>
</table>

{/* QP Renewal Request — show when document has expiry warning */}
{(()=>{const qp=SUP_QP[sup]||SUP_QP.cannava;const nocQp=SUP_QP.noc;return <div style={{marginTop:12,padding:12,background:"#fef3c7",borderRadius:8,border:"1px solid #fcd34d"}}>
<div style={{fontSize:15,fontWeight:700,color:"#92400e",marginBottom:8}}>📋 {lang==="de"?"Dokument-Erneuerung anfordern":"Request Document Renewal"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
<div style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:12,color:"#6b7280",fontWeight:600}}>{lang==="de"?"Lieferanten-QP":"Supplier QP"}</div>
<div style={{fontSize:15,fontWeight:700}}>{qp.qp}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{qp.title}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{qp.company} ({qp.country})</div>
</div>
<div style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:12,color:"#6b7280",fontWeight:600}}>NOC Pharma QP</div>
<div style={{fontSize:15,fontWeight:700}}>{nocQp.qp}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{nocQp.title}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{nocQp.company}</div>
</div>
</div>
</div>})()}

<div style={{padding:"10px 18px",borderTop:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center",background:"#f9fafb"}}>
<div style={{fontSize:13,color:"#9ca3af"}}>NOC Pharma · QMS v2.5</div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{const w=window.open("","_blank","width=800,height=600");w.document.write('<html><head><title>'+docPreview.name+'</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1f2937}h1{font-size:18px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:8px}table{width:100%;border-collapse:collapse;margin:16px 0}td{padding:6px 10px;border:1px solid #d1d5db;font-size:13px}td:first-child{font-weight:700;background:#f9fafb;width:35%}.banner{background:#1e40af;color:#fff;padding:16px 40px;margin:-40px -40px 20px}.ft{margin-top:30px;border-top:1px solid #d1d5db;padding-top:10px;font-size:10px;color:#9ca3af;text-align:center}@media print{body{padding:20px}.banner{margin:-20px -20px 20px}}</style></head><body>');w.document.write('<div class="banner"><strong style="font-size:16px">NOC Pharma GmbH</strong> · QMS v2.5 · §52a AMG</div>');w.document.write('<h1>'+docPreview.name+'</h1><table>');[["Ref.",docPreview.ref],["Ausgestellt von",docPreview.by],["Ausgestellt",docPreview.on],["Gueltig bis",docPreview.vu],["Charge",docPreview.batch],["Lieferant",docPreview.sup],["Stufe",docPreview.stage],["Status",docPreview.hasDoc?"✅ Konform":"⏳ Ausstehend"]].forEach(r=>w.document.write('<tr><td>'+r[0]+'</td><td>'+(r[1]||'—')+'</td></tr>'));docPreview.det.forEach(d=>w.document.write('<tr><td>'+d[0]+'</td><td>'+d[1]+'</td></tr>'));w.document.write('</table><div class="ft">NOC Pharma GmbH · §52a AMG · QMS v2.5 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(()=>w.print(),500)}} style={{padding:"5px 14px",borderRadius:5,fontSize:14,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="#374151" strokeWidth="1.5"/></svg>
PDF
</button>
<button onClick={()=>{const qp=SUP_QP[sup]||SUP_QP.cannava;const nocQp=SUP_QP.noc;const sep="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";const rows=[["Document",docPreview.name],["Referenz",docPreview.ref],["Ausgestellt von",docPreview.by],["Ausstellungsdatum",docPreview.on],["Gueltig bis",docPreview.vu],["Charge",docPreview.batch],["Lieferant",docPreview.sup],["Stufe",docPreview.stage],["Status",docPreview.hasDoc?"✅ Konform":"⏳ Ausstehend"]];docPreview.det.forEach(d=>rows.push(d));let body="NOC PHARMA GmbH\nQMS v2.5 · §52a AMG\n"+sep+"\n\n";rows.forEach(r=>{body+=r[0]+": "+r[1]+"\n"});body+="\n"+sep+"\n\nRP: C. Hamelink · QP: T. Cuny\nNOC Pharma GmbH · Im Camisch 14 · 07768 Kahla\nErstellt: "+new Date().toISOString();window.open(gmailLink("NOC Pharma — "+docPreview.name+" ["+docPreview.ref+"] — "+docPreview.sup,body)+"&to="+encodeURIComponent(qp.email)+"&cc="+encodeURIComponent(nocQp.email),"_blank")}} style={{padding:"5px 14px",borderRadius:5,fontSize:14,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg>
{lang==="de"?"Senden":"Send"}
</button>
<button onClick={()=>window.open(gdLink(docPreview.stage),"_blank")} style={{padding:"5px 14px",borderRadius:5,fontSize:14,fontWeight:600,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="#fff"/></svg>
Drive
</button>
</div>
</div>
</div>
</div>
</div>}
</div>);
}
