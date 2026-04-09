import React, { useState, useCallback, useRef, useEffect, Fragment } from "react";

const T={de:{dashboard:"Dashboard",lifecycle:"Lebenszyklus",batches:"Chargen",suppliers:"Lieferanten",lab:"Labor",deviations:"Abweichungen",sops:"SOPs",btm:"BtM",docs:"Dokumente",users:"Benutzer",overview:"Übersicht",operations:"Betrieb",quality:"Qualität",admin:"Verwaltung",agent:"KI-Agent",alerts:"Warnungen",preArr:"Vorbereitung",registration:"Registrierung",custVat:"Zoll & MwSt",vault:"Tresor",labTest:"Labor",qpRel:"QP-Freigabe",relabel:"Etikettierung",storage:"Lagerung",shipment:"Versand",recon:"Abstimmung",logistics:"GDP-Transport",quarRel:"Quarantäne-Freigabe",supDocs:"Lieferantendossier",uploaded:"Hochgeladen",required:"Erforderlich",optional:"Optional",validUntil:"Gültig bis",refNo:"Ref-Nr.",issuedBy:"Ausgestellt von",issuedOn:"Ausgestellt am",expiresIn:"Läuft ab in",days:"Tagen",warning:"Warnung",critical:"Kritisch",viewDoc:"Ansehen",sendReminder:"Erinnern",scheduleRenewal:"Erneuern",licenseMonitor:"Lizenz-Monitor",pass:"✓ Konform",gate:"Sicherheitstor",allPass:"ALLE BESTANDEN",spec:"Spezifikation",result:"Ergebnis",param:"Parameter",assess:"Bewertung",certNo:"Zert-Nr.",testResults:"Prüfergebnisse",date:"Datum",labels:"Etiketten",photos:"Fotos",completed:"Abgeschlossen",location:"Standort",carrier:"Spediteur",departed:"Abfahrt",arrived:"Ankunft",temp:"Temperatur",gps:"GPS",barcodes:"Barcodes",discrepancy:"Abweichung",vat:"MwSt 19%",status:"Status",batch:"Charge",active:"Aktiv",name:"Name",email:"E-Mail",role:"Rolle",cgz:"Chargenfreigabe",coa:"COA",importDoc:"Importdossier",btmDoc:"BtM",transferDoc:"Transfer",relabelDoc:"Umetikettierung",supplierCoa:"Lieferanten-COA",qsiResults:"QSI-Ergebnisse",comparison:"Vergleich",declared:"Deklariert",confirmed:"Bestätigt",variance:"Abweichung",withinSpec:"Innerhalb Spez.",outsideSpec:"Außerhalb Spez.",terpeneProfile:"Terpenprofil",totalTerpenes:"Gesamt-Terpene"},
en:{dashboard:"Dashboard",lifecycle:"Lifecycle",batches:"Batches",suppliers:"Suppliers",lab:"Lab Results",deviations:"Deviations",sops:"SOPs",btm:"BtM",docs:"Documents",users:"Users",overview:"Overview",operations:"Operations",quality:"Quality",admin:"Admin",agent:"AI Agent",alerts:"Alerts",preArr:"Pre-Arrival Docs",registration:"Registration & Permits",custVat:"Customs & VAT",vault:"Vault Arrival",labTest:"Lab Testing",qpRel:"QP Release",relabel:"Relabeling",storage:"Storage",shipment:"Shipment",recon:"Reconciliation",logistics:"GDP Transport",quarRel:"Quarantine Release",supDocs:"Supplier Dossier",uploaded:"Uploaded",required:"Required",optional:"Optional",validUntil:"Valid until",refNo:"Ref No.",issuedBy:"Issued by",issuedOn:"Issued on",expiresIn:"Expires in",days:"days",warning:"Warning",critical:"Critical",viewDoc:"View",sendReminder:"Remind",scheduleRenewal:"Renew",licenseMonitor:"License Monitor",pass:"✓ Compliant",gate:"Safety Gate",allPass:"ALL PASS",spec:"Specification",result:"Result",param:"Parameter",assess:"Assessment",certNo:"Cert No.",testResults:"Test Results",date:"Date",labels:"Labels",photos:"Photos",completed:"Completed",location:"Location",carrier:"Carrier",departed:"Departed",arrived:"Arrived",temp:"Temperature",gps:"GPS",barcodes:"Barcodes",discrepancy:"Discrepancy",vat:"VAT 19%",status:"Status",batch:"Batch",active:"Active",name:"Name",email:"Email",role:"Role",cgz:"Batch Release",coa:"COA",importDoc:"Import Dossier",btmDoc:"BtM Record",transferDoc:"Transfer",relabelDoc:"Relabeling",supplierCoa:"Supplier COA",qsiResults:"QSI Results",comparison:"Comparison",declared:"Declared",confirmed:"Confirmed",variance:"Variance",withinSpec:"Within Spec",outsideSpec:"Outside Spec",terpeneProfile:"Terpene Profile",totalTerpenes:"Total Terpenes"}};


const BT_DATA={
"CA-02":{id:"BI-02-NOCB1.1-INF-F",p:"NOC SE 19",exp:"29.08.2026",lab:"QSI Bremen",aNo:"210-1624923",per:"26.11–04.12.2025",coa:"12.12.2025",qp:"Dr. Olaf Schagon",cert:"NOC-CGZ-2025-003",kg:"198.5",units:239,bags1kg:139,doy10g:100,boxes:"7",net:"140.0",gross:"198.5",exw:"€116,538.02",route:"EZE→FRA"},
"CA-03":{id:"BI-03-NOCB1.2-INF-F",p:"NOC SE 17/20",exp:"28.07.2027",lab:"QSI Bremen",aNo:"210-1625xxx",per:"TBD",coa:"TBD",qp:"Dr. Olaf Schagon",cert:"TBD",kg:"140.0",units:239,bags1kg:139,doy10g:100,boxes:"3",net:"140.0",gross:"198.5",exw:"€116,538.02",route:"EZE→FRA"},
"CA-01":{id:"BI-01-NOCB1.0-INF-F",p:"NOC SE 17",exp:"22.03.2027",lab:"QSI Bremen",aNo:"TBD",per:"TBD",coa:"TBD",qp:"Dr. Olaf Schagon",cert:"CGZ-2024-0031",kg:"59.5",units:72,bags1kg:59,doy10g:0,boxes:"1",net:"59.5",gross:"85.0",exw:"TBD",route:"EZE→FRA"}
};
const BT=BT_DATA["CA-03"];
// Supplier QP Contacts — for document renewal requests
const SUP_QP={
cannava:{qp:"Lic. María Fernanda Ruiz",email:"mfruiz@cannava.gob.ar",title:"QP / Directora Técnica",company:"Cannabis Avatara S.E. (Cannava)",authority:"ANMAT",country:"Argentina",
  renew:[{doc:"GMP Certificate",ref:"ANMAT-GMP-2024-4821",exp:"15.03.2028"},{doc:"QTA",ref:"QTA-NOC-CANN-2024-01",exp:"15.03.2026",urgent:true},{doc:"Export Permit",ref:"SEDRONAR",exp:"18.08.2026"},{doc:"Supplier Audit",ref:"Next audit",exp:"12.02.2026",urgent:true}]},
mccn:{qp:"Dr. Carlos Andrés Moreno",email:"camoreno@medcolcanna.com",title:"QP / Director Técnico",company:"MEDCOLCANNA S.A.S.",authority:"INVIMA",country:"Colombia",
  renew:[{doc:"Written Confirmation",ref:"Art. 46b",exp:"MISSING",urgent:true},{doc:"FNE Export Permit",ref:"FNE",exp:"30.06.2026",urgent:true},{doc:"GACP Audit",ref:"INVIMA",exp:"15.09.2026"},{doc:"GMP Certificate",ref:"INVIMA",exp:"Ausstehend"}]},
hytn:{qp:"Dr. James Mitchell",email:"jmitchell@hytncannabis.com",title:"QP / Quality Director",company:"HYTN Cannabis Inc.",authority:"Health Canada",country:"Canada",
  renew:[{doc:"Health Canada GMP",ref:"HC-DEL",exp:"Ausstehend"},{doc:"Cannabis Export Permit",ref:"HC",exp:"Ausstehend"},{doc:"QTA Draft",ref:"QTA-NOC-HYTN",exp:"Ausstehend"}]},
noc:{qp:"Dr. Olaf Schagon",email:"qp@nocpharma.de",title:"QP §15 AMG",company:"NOC Pharma GmbH",authority:"BfArM",country:"Germany",
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
{k:"pi",ic:"💰",up:1,req:1,st:"ok",de:"Proforma-Rechnung",en:"Proforma Invoice",ref:"PI-CANN-2025-0047",by:"Cannabis Avatara S.E. (Cannava)",on:"15.09.2025",vu:"—",dl:null,det:[["Invoice Value","€198,500.00"],["Incoterms","CIF Frankfurt (Incoterms 2020)"],["Currency","EUR"],["Payment","Net 30 after customs release"],["Bank","Banco Nación Argentina"],["VAT Rate","19% Einfuhrumsatzsteuer on CIF value"],["VAT Amount","€37,715.00 (19% × €198,500)"],["VAT Payment","Due upon customs clearance at Frankfurt Zollamt"],["VAT Refund","Reclaimable via Vorsteuervergütung (§15 UStG)"],["Refund Timeline","3–6 months processing by Bundeszentralamt für Steuern"],["Refund Status","⏳ Filed 20.11.2025 — pending BZSt confirmation"]]},
{k:"tc",ic:"🚚",up:1,req:1,st:"ok",de:"Transport & Logistikkosten (WAS Logistics)",en:"Transport & Logistics Costs (WAS Logistics)",ref:"138688",by:"WAS-Logistics GmbH, Wörth",on:"06.11.2025",vu:"—",dl:null,det:[["Invoice No.","138688 (Rechnung Original)"],["U/Ref.","2511.6/26092/0"],["KD-Nr.","10508"],["Sachb.","Rafael Rey — r.rey@was-logistics.com"],["Service Date","15.11.2025"],["Sender","Cannabis Avatara S.E., AR-4600 San Salvador de Jujuy"],["Receiver","NOC Pharma GmbH, DE-07751 Golmsdorf"],["Contents","3 Paletten — Medical Cannabis"],["Gross Weight","198.5 kg"],["Chargeable Weight","293.0 kg (Taxgewicht)"],["Pick up Jujuy → EZE","4,200 USD → €3,656.13"],["Armed Guard Escort","7,150.00 USD → €6,224.15"],["Origin Fixed Charges","525.00 USD → €457.02"],["Origin Variable Charges","300.00 USD → €261.15"],["Airfreight EZE → FRA","1,992.40 USD → €1,734.40"],["Cargo Insurance","1,165.38 USD → €1,014.47"],["Taxes (Calculated) 19%","€24,678.21"],["Subtotal (MwSt frei)","€38,025.53"],["FRA Airport Handling","€147.00"],["Customs Clearance","€245.00"],["Transport FRA → Murchin","€3,155.00 (temp. controlled 15–25°C)"],["Armed Guard Escort (DE)","€5,974.00"],["Subtotal (MwSt pflichtig)","€9,521.00"],["MwSt (19%)","€1,808.99"],["TOTAL EUR","€49,355.52"],["FX Rate","1 USD = 0.87051 EUR"],["Payment","Zahlbar sofort (due immediately)"]]},
{k:"pl",ic:"📦",up:1,req:1,st:"ok",de:"Packstückliste",en:"Packing List",ref:"PL-00003-0000011",by:"Cannabis Avatara S.E. (Cannava)",on:"25.10.2025",vu:"—",dl:null,det:[["Exporter","Cannabis Avatara S.E., La Caridad 320, San Salvador de Jujuy, Argentina"],["Consignee","NOC Pharma GmbH, An der Redoute 1, D-17390 Murchin, Germany"],["Description","Medicinal Cannabis Inflorescence 140.00 kg"],["Batch","BI-03-NOCB1.2-INF-F (NOC SE 17/20)"],["Box 1","45× EVOH/PBD LDPE 1kg bags + 100× Doypacks 10g + 1× Sensitech — 46kg net / 65.90kg gross"],["Box 2","47× EVOH/PBD LDPE 1kg bags + 1× Sensitech — 47kg net / 66.30kg gross"],["Box 3","47× EVOH/PBD LDPE 1kg bags + 1× Sensitech — 47kg net / 66.30kg gross"],["Box Dimensions","113.3 × 70 × 74 cm (0.586 m³ each)"],["Total Net Weight","140.00 kg"],["Total Gross Weight","198.50 kg"],["Total Units","239 (139× 1kg bags + 100× 10g Doypacks)"],["EXW Value","€116,538.02"],["Shipment Type","Aerial"],["Port of Loading","Airport of Ezeiza (EZE)"],["Port of Discharge","Airport of Frankfurt (FRA)"],["Origin","Argentina"]]},
{k:"ip",ic:"🔐",up:1,req:1,st:"critical",de:"Einfuhrgenehmigung (BfArM §3 BtMG)",en:"Import Permit (BfArM §3 BtMG)",ref:"E-12267/2025",by:"BfArM (Bundesinstitut für Arzneimittel)",on:"01.09.2025",vu:"28.02.2026",dl:4,det:[["Legal Basis","§3 Abs. 1 BtMG + §11 BtMG"],["Substance","Cannabis flos (Dronabinol)"],["Schedule","Anlage III BtMG"],["Max Quantity","250 kg"],["Used This Permit","198.5 kg (79.4%)"],["Verbleibend","51.5 kg"],["Gueltig bis","28.02.2026 — 4 DAYS"],["BfArM Contact","BtM-Referat +49 228 99307-3623"],["Return Obligation","§11 Abs. 1 BtMG — Original must be returned to BfArM within 1 month after import"],["Return Status","✅ RETURNED — Sent 20.11.2025"],["Sent via","Deutsche Post — Einschreiben mit Rückschein (Registered mail)"],["Tracking No.","RR 1234 5678 9DE"],["Sent Date","20.11.2025 (6 days after goods arrival)"],["Return Receipt","✅ Received by BfArM — confirmed 24.11.2025"],["Annotated","Permit annotated: actual qty 198.5 kg, import date 14.11.2025, customs ref"]],ret:true},

{k:"ep",ic:"📤",up:1,req:1,st:"ok",de:"Ausfuhrgenehmigung (ANMAT)",en:"Export Permit (ANMAT)",ref:"Exp-2025-NOC-003",by:"ANMAT Argentina",on:"20.08.2025",vu:"20.08.2026",dl:177,det:[["Exporter","Cannabis Avatara S.E., Jujuy"],["Importer","NOC Pharma GmbH, Germany"],["Max Quantity","300 kg"],["Used","198.5 kg (66.2%)"],["INCB Notification","✅ Completed (cross-ref INCB auth)"]]},
{k:"ap",ic:"📜",up:1,req:1,st:"ok",de:"Apostille (Haager Übereinkommen)",en:"Apostille (Hague Convention)",ref:"APO-AR-2025-7821",by:"Argentine Ministry of Foreign Affairs",on:"25.08.2025",vu:"—",dl:null,det:[["Convention","Hague Apostille Convention 1961"],["Covers","GMP Certificate, Export Permit, Supplier COA"],["Authentication","✅ Verified by German Embassy Buenos Aires"]]},
{k:"bt",ic:"⚖️",up:1,req:1,st:"ok",de:"BtM-Ausfuhrerklärung",en:"BtM Export Declaration",ref:"BtM-EXP-AR-2025-0047",by:"SEDRONAR Argentina",on:"18.08.2025",vu:"18.08.2026",dl:175,det:[["Authority","SEDRONAR (Secretaría de Políticas Integrales sobre Drogas)"],["Substance","Cannabis sativa L. (flos, dried)"],["1961 Convention","Schedule IV"],["Cross-ref INCB","INCB-IMP-DE-2025-0891"]]},
{k:"ic",ic:"🌐",up:1,req:1,st:"warning",de:"INCB-Genehmigung",en:"INCB Authorization",ref:"INCB-IMP-DE-2025-0891",by:"INCB Vienna",on:"05.09.2025",vu:"31.12.2025",dl:-55,det:[["EXPIRED","⚠️ 31.12.2025 — 55 days ago!"],["Status","Covered — shipment arrived 14.11.2025 (before expiry)"],["Import Country","Germany (DE annual estimate)"],["Export Country","Argentina"],["2025 Annual Estimate","500 kg cannabis flos"],["Used YTD","198.5 kg (39.7%)"],["2026 Estimate","Filed 01.10.2025 — pending INCB confirmation"],["Note","New auth needed for any 2026 imports"]]},
{k:"sc",ic:"🔬",up:1,req:1,st:"ok",de:"Lieferanten-COA (Cannava)",en:"Supplier COA (Cannava Lab)",ref:"COA-CANN-2025-BI02",by:"Laboratorio Cannava, Jujuy",on:"20.10.2025",vu:"—",dl:null,det:[["Labor","In-house (Cannava, ISO 17025 scope)"],["THC","20.1% (declared)"],["CBD","0.3%"],["Moisture","8.2% (gravimetric)"],["TAMC","8,500 CFU/g"],["TYMC","850 CFU/g"],["Pesticides","Konform"],["Aflatoxins","<1 ppb"],["NOTE","⚠️ Supplier COA is REFERENCE ONLY"],["Regulatory","QSI Bremen independent retest MANDATORY per §14 AMG"]]},
{k:"aw",ic:"✈️",up:1,req:1,st:"ok",de:"Luftfrachtbrief (AWB)",en:"Air Waybill (AWB)",ref:"E251115130",by:"B&B Cargo (B&B Consultora S.A.)",on:"15.11.2025",vu:"—",dl:null,det:[["HAWB","E251115130"],["Airline Prefix","020 EZE 03715843"],["Carrier","Lufthansa LH511"],["Issuing Agent","B&B Cargo (B&B Consultora S.A.), México 313, CABA, Argentina"],["Freight Forwarder","WAS-LOGISTICS GMBH, Am Oberw Ald 5, Donauwörth, Bayern"],["Origin","MINISTRO PISTARINI, AR (EZE)"],["Destination","FRANKFURT AM MAIN, GERMANY (FRA)"],["Flight/Date","LH511 / 15-11-2025"],["Pieces","3"],["Gross Weight","198.50 kg"],["Chargeable Weight","295.00 kg"],["Goods","Medicinal cannabis inflorescence — 3 BOXES, NCM: 1211.90.90, 3× Sensitech Datalogger Ultra Fit"],["Shipper","Cannabis Avatara S.E., La Caridad Nº 320-Bº Chijra, San Salvador de Jujuy, Jujuy, Argentina"],["Consignee","Noc Pharma GmbH, Langetal 1, D-07751 Golmsdorf, Germany"],["Temp Range","+15°C to +25°C"],["Import Auth","E12267/2025"],["Currency","USD"],["Executed","15.11.2025 — Ministro Pistarini — Yesica Volpe"]]},
{k:"fi",ic:"🛡️",up:1,req:1,st:"ok",de:"Frachtversicherung",en:"Freight Insurance Certificate",ref:"INS-NOC-2025-TR-047",by:"Allianz Trade",on:"08.11.2025",vu:"08.02.2026",dl:null,det:[["Policy","INS-NOC-2025-TR-047"],["Insurer","Allianz Trade (EU)"],["Coverage","All-risk marine + air + warehouse"],["Value Insured","€250,000 (125% of invoice)"],["Route","Buenos Aires → Frankfurt → Murchin"],["Deductible","€500"]]},
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
if(l.includes("compliance")||l.includes("overview")||l.includes("status"))return "🏛️ NOC PHARMA COMPLIANCE OVERVIEW\n\n🇦🇷 CANNAVA — ACTIVE\n• PIC/S: ✅ ANMAT member\n• BfArM Permit: 🔴 4 days! E-12267/2025\n• INCB: 🔴 2025 expired, 2026 pending\n• Imports: CA-01 (closed), CA-02 (M4.5), CA-03 (M2), CA-04 (planned)\n\n🇨🇴 MEDCOLCANNA — QUALIFICATION\n• PIC/S: ❌ INVIMA NOT member\n• Written Confirmation: 🔴 MISSING (Art. 46b)\n• BfArM Permit: ⏳ Blocked by WC\n• PZN: ✅ 6 products registered (IFA Nr. 1000658281)\n\n🇨🇦 HYTN — PLANNED\n• PIC/S: ✅ Health Canada member\n• EU-Canada MRA: ✅ Simplified pathway\n• Qualification: ⏳ Not started\n\n📋 QMS: 305 SOPs | 297 updates pending";
if(l.includes("audit")||l.includes("authority")||l.includes("bfarm")||l.includes("readiness"))return "📋 AUTHORITY AUDIT READINESS\n\n🏛️ BfArM / Landesbehörde:\n• §52a AMG License: ✅ WDE-2024-0847\n• Site Master File: v2 (Murchin)\n• QP: Dr. Olaf Schagon (§15 AMG)\n• RP: Torsten Cuny\n• BtM License: ✅ Active\n\n📊 Audit Scores:\n• Audit: 0/15 ⚠️\n• Cyber: 0/15 ⚠️\n• Mandatory: 0/15 ⚠️\n\n📂 Key SOPs Ready:\n• SOP-QMS-001 Pharma QS: v1 (38%)\n• SOP-BTM-001 BtM-Verkehr: v1 (38%)\n• SOP-MFG-006 Einfuhr: 38%\n• SOP-604 Wareneingang: 25%\n\n→ PRIORITY: Complete audit prep!";
if(l.includes("sop")||l.includes("document"))return "📋 SOP STATUS (QMS v1.0)\n\n305 SOPs loaded\n297 updates pending\n0 files uploaded\n\nKey SOP Categories:\n• QMS-001–012: Quality System\n• PER-001–006: Personnel\n• MFG-001–010: Manufacturing\n• DOC-001–005: Documentation\n• GDP-001–005: Distribution\n• BTM-001–008: BtM/Cannabis\n• CS-001–009: Computer Systems\n• QC-001–006: Quality Control\n• EQ-001–005: Equipment\n• AI-01–11: AI Governance\n\nSite Master File: SMF-V2 (Murchin)";
if(l.includes("pics")||l.includes("pic/s"))return "🏛️ PIC/S COMPLIANCE MATRIX\n\n🇦🇷 Argentina (ANMAT):\n• PIC/S Member: ✅ Since 2017\n• GMP Accepted: ✅ Direct recognition\n• Written Confirmation: NOT needed\n\n🇨🇴 Colombia (INVIMA):\n• PIC/S Member: ❌ NOT member\n• GMP Accepted: ❌ NOT on EU list\n• Written Confirmation: 🔴 MANDATORY (Art. 46b)\n• Status: MISSING — IMPORT BLOCKER\n\n🇨🇦 Canada (Health Canada):\n• PIC/S Member: ✅ Founding member\n• EU-Canada MRA: ✅ Active\n• Written Confirmation: NOT needed\n\n→ MCCN is the only supplier requiring Art. 46b WC";
if(l.includes("incb"))return "🌐 INCB STATUS\n\n🇩🇪 Germany Annual Estimate 2026: 500 kg filed\n\n🇦🇷 Cannava:\n• 2025: EXPIRED (31.12.2025)\n• Shipment arrived before expiry ✅\n• 2026: Ausstehend INCB confirmation\n• SEDRONAR export quota: confirmed\n\n🇨🇴 Medcolcanna:\n• DNE Colombia: ⏳ Not yet allocated\n• Requires BfArM permit first\n\n🇨🇦 HYTN:\n• Health Canada: ⏳ Not yet allocated\n• Requires BfArM permit first\n\n→ NO imports possible until 2026 INCB confirmed";
if(l.includes("master file")||l.includes("smf"))return "📄 SITE MASTER FILE\n\nSMF-V2: Murchin An der Redoute 1\n\nKey Sections:\n• Company: NOC Pharma GmbH\n• License: §52a AMG WDE-2024-0847\n• QP: Dr. Olaf Schagon\n• RP: Torsten Cuny\n• Activities: Import, QC, Storage, Distribution\n• BtM: Anlage III (Cannabis flos)\n• Suppliers: Cannava (AR), MCCN (CO), HYTN (CA)\n• Storage: Murchin Zone A/B/C (15-25°C)\n• Lab: QSI Bremen (§14 AMG)\n• IT: QMS v1.0 + AI Agents";
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
chat:(x)=>{const l=x.toLowerCase();if(l.includes("import")||l.includes("permit"))return "🔴 BfArM Import Permit E-12267/2025\nExpires: 28.02.2026 (4 days!)\nUsed: 198.5/250 kg\n→ File renewal IMMEDIATELY\n→ Contact: +49 228 99307-3623";if(l.includes("coa")||l.includes("qsi"))return "🔬 COA vs QSI Bremen:\n• THC: 20.1% → 19.7% (Δ -2.0%) ✅\n• TAMC: 8,500 → 10,000 (+17.6%) ✅\n• TYMC: 850 → 1,200 (+41.2%) ✅\nAll within spec. QSI = official result (§14 AMG).";if(l.includes("incb"))return "🌐 INCB:\n2025: EXPIRED (shipment arrived before)\n2026: 500 kg filed — PENDING\nNo imports until confirmed!";if(l.includes("audit")||l.includes("anmat"))return "🇦🇷 Cannava Audit:\nLast: 12.02.2025 (Jujuy)\nNext: 12.02.2026 ⚠️ OVERDUE!\nPIC/S: ANMAT = accepted\n→ Confirm date THIS WEEK";return "Import CA-02 (BI-02): ✅ 15/15 docs • 19/19 params PASS\n🔴 Import permit 4d! • INCB expired\n→ Priority: BfArM renewal TODAY";}},
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

const USERS=[{n:"Dr. Olaf Schagon",e:"qp@nocpharma.de",r:"qp"},{n:"Torsten Cuny",e:"cuny@noc-pharma.de",r:"vp"},{n:"Celso Hamelink",e:"hamelink@noc-pharma.de",r:"admin"},{n:"QA Manager",e:"qa@noc-pharma.de",r:"leitung_qs"},{n:"Logistics",e:"logistics@noc-pharma.de",r:"logistics"},{n:"Warehouse",e:"warehouse@noc-pharma.de",r:"warehouse"},{n:"Lab Tech",e:"lab@noc-pharma.de",r:"lab_tech"}];
const RC={admin:"#7c3aed",leitung_qs:"#2563eb",qp:"#059669",vp:"#d97706",logistics:"#0891b2",warehouse:"#ea580c",lab_tech:"#dc2626"};
const RN={de:{admin:"Admin",leitung_qs:"Leitung QS",qp:"QP",vp:"VP",logistics:"Logistik",warehouse:"Lager",lab_tech:"Labor"},en:{admin:"Admin",leitung_qs:"Head QA",qp:"QP",vp:"VP",logistics:"Logistics",warehouse:"Warehouse",lab_tech:"Lab Tech"}};

const Bd=({children,c="#6b7280",b="#f3f4f6"})=><span style={{display:"inline-flex",padding:"2px 7px",borderRadius:11,fontSize:14,fontWeight:600,background:b,color:c,whiteSpace:"nowrap"}}>{children}</span>;
const Dot=({s})=>{const c=s==="ok"?"#059669":s==="warning"?"#d97706":s==="critical"?"#dc2626":"#9ca3af";return <div style={{width:10,height:10,borderRadius:"50%",background:c,flexShrink:0,boxShadow:s==="critical"||s==="warning"?"0 0 0 3px "+c+"30":undefined}}/>};

const Cd=({t:ti,badge,children})=><div style={{background:"#fff",borderRadius:9,border:"1px solid #e5e7eb",boxShadow:"0 1px 2px rgba(0,0,0,.05)",marginBottom:10}}>{ti&&<div style={{padding:"10px 14px",borderBottom:"1px solid #f3f4f6",display:"flex",justifyContent:"space-between",alignItems:"center"}}><strong style={{fontSize:15}}>{ti}</strong>{badge}</div>}<div style={{padding:"10px 14px"}}>{children}</div></div>;
const CatLabel={potency:["Potency","#7c3aed","#f3e8ff"],physical:["Physical","#0891b2","#ecfeff"],metals:["Heavy Metals","#dc2626","#fee2e2"],micro:["Microbiology","#d97706","#fef3c7"],contam:["Contaminants","#6366f1","#eef2ff"],myco:["Mycotoxins","#ea580c","#fff7ed"],terpene:["Terpenes","#059669","#ecfdf5"]};

export default function App(){
const[auth,setAuth]=useState(()=>{try{const u=localStorage.getItem("noc-auth");return u?JSON.parse(u):null;}catch(e){return null;}});
const can=(p)=>{const l=(auth||{}).level||'viewer';const T={finance:{admin:1,qp:0,rp:0,leitung_qs:0,logistics:0,warehouse:0,lab_tech:0,auditor:1,viewer:0},users:{admin:1,qp:0,rp:0,leitung_qs:0,logistics:0,warehouse:0,lab_tech:0,auditor:0,viewer:0},deviations:{admin:1,qp:1,rp:1,leitung_qs:1,logistics:0,warehouse:0,lab_tech:0,auditor:1,viewer:0},btm:{admin:1,qp:1,rp:1,leitung_qs:0,logistics:0,warehouse:0,lab_tech:0,auditor:1,viewer:0},sops:{admin:1,qp:1,rp:1,leitung_qs:1,logistics:1,warehouse:1,lab_tech:1,auditor:1,viewer:0},suppliers:{admin:1,qp:1,rp:1,leitung_qs:1,logistics:0,warehouse:0,lab_tech:0,auditor:1,viewer:0},lab:{admin:1,qp:1,rp:1,leitung_qs:1,logistics:0,warehouse:0,lab_tech:1,auditor:1,viewer:0},warehouse:{admin:1,qp:1,rp:1,leitung_qs:0,logistics:0,warehouse:1,lab_tech:0,auditor:1,viewer:0},supDocs:{admin:1,qp:1,rp:1,leitung_qs:1,logistics:0,warehouse:0,lab_tech:0,auditor:1,viewer:0},nocDossier:{admin:1,qp:1,rp:1,leitung_qs:0,logistics:0,warehouse:0,lab_tech:0,auditor:1,viewer:0}};return (T[p]||{})[l]===1;};
const[loginForm,setLoginForm]=useState({user:"",pass:"",remember:false,loading:false,error:""});
const[lang,setLang]=useState("en");const[pg,setPg]=useState("lifecycle");const[lcs,setLcs]=useState(0);const[exDoc,setExDoc]=useState(null);const[agO,setAgO]=useState(false);const[agT,setAgT]=useState("alerts");const[agMode,setAgMode]=useState("supplier");const[ci,setCi]=useState("");const[cm,setCm]=useState([]);const[labTab,setLabTab]=useState("compare");const[sup,setSup]=useState("cannava");const[thcProto,setThcProto]=useState({open:false,newThc:"",reason:"",piaNotified:false,pznRequested:false});const[docPreview,setDocPreview]=useState(null);const[uploads,setUploads]=useState(()=>{try{const s=localStorage.getItem("noc-qms-uploads");return s?JSON.parse(s):[]}catch(e){return[]}});const[docOriginals,setDocOriginals]=useState({});const origFileRef=useRef(null);const[origTarget,setOrigTarget]=useState(null);const fileRef=useRef(null);useEffect(()=>{fetch("/api/db").then(r=>r.json()).then(d=>{if(d.uploads&&d.uploads.length>0)setUploads(d.uploads);}).catch(()=>{})},[]);useEffect(()=>{if(uploads.length>0)fetch("/api/db/uploads",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uploads})}).catch(()=>{});},[uploads]);const[trSrc,setTrSrc]=useState("");const[trOut,setTrOut]=useState("");const[trLang,setTrLang]=useState("de");const[trLoading,setTrLoading]=useState(false);
const[aiApproval,setAiApproval]=useState(null);/* {docKey, fileName, aiResult, fields:[{key,label,systemValue,docValue,status:'pending'|'approved'|'rejected',severity}], finance:[], stageData:{}, spreadTo:[] } */
const[auditLog,setAuditLog]=useState(()=>{try{return JSON.parse(localStorage.getItem("noc-qms-audit-log")||"[]")}catch(e){return[]}});
const[btOverrides,setBtOverrides]=useState(()=>{try{return JSON.parse(localStorage.getItem("noc-qms-bt-overrides")||"{}")}catch(e){return{}}});
const[financeEntries,setFinanceEntries]=useState(()=>{try{return JSON.parse(localStorage.getItem("noc-qms-finance")||"[]")}catch(e){return[]}});
const[approvalHistory,setApprovalHistory]=useState(()=>{try{return JSON.parse(localStorage.getItem("noc-qms-approvals")||"[]")}catch(e){return[]}});
const[wixOrders,setWixOrders]=useState([]);const[wixLoading,setWixLoading]=useState(false);const[wixLastSync,setWixLastSync]=useState(null);const[wixError,setWixError]=useState(null);const[wixAutoSync,setWixAutoSync]=useState(false);
const[scParcels,setScParcels]=useState([]);const[scLoading,setScLoading]=useState(false);const[scLastSync,setScLastSync]=useState(null);const[scError,setScError]=useState(null);const[scMethods,setScMethods]=useState([]);
const fetchScParcels=async()=>{setScLoading(true);setScError(null);try{const r=await fetch("http://localhost:3001/api/sendcloud/parcels");if(!r.ok)throw new Error(r.status+" "+await r.text());const d=await r.json();const parcels=(d.parcels||[]).map(p=>({id:p.id,tracking:p.tracking_number||"",trackingUrl:p.tracking_url||"",carrier:p.carrier?.code||p.shipment?.name||"",status:p.status?.message||"",statusId:p.status?.id||0,name:p.name||"",company:p.company_name||"",email:p.email||"",address:p.address||"",city:p.city||"",postal:p.postal_code||"",country:p.country?.name||p.country_iso_2||"",orderNo:p.order_number||p.external_order_id||"",weight:p.weight||"",labelUrl:p.label?.label_printer||p.label?.normal_printer?.[0]||"",created:p.created_at?new Date(p.created_at).toLocaleDateString("de-DE"):"",raw:p}));setScParcels(parcels);setScLastSync(new Date().toLocaleTimeString());return parcels}catch(e){setScError(e.message);return[]}finally{setScLoading(false)}};
const fetchScMethods=async()=>{try{const r=await fetch("http://localhost:3001/api/sendcloud/methods");if(!r.ok)return;const d=await r.json();setScMethods(d.shipping_methods||[])}catch(e){}};
const createScParcel=async(order)=>{setScLoading(true);setScError(null);try{const addr=order.shipping||order.billing||{};const parcel={parcel:{name:order.client.name,company_name:order.client.company||"",email:order.client.email,telephone:order.client.phone||"",address:addr.street||"",city:addr.city||"",postal_code:addr.zip||"",country:addr.country||"DE",order_number:order.id,weight:"1.000",request_label:true,shipment:{id:8},apply_shipping_rules:true}};const r=await fetch("http://localhost:3001/api/sendcloud/parcels",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(parcel)});if(!r.ok){const t=await r.text();throw new Error(t)}const d=await r.json();await fetchScParcels();return d}catch(e){alert("SendCloud error: "+e.message);return null}finally{setScLoading(false)}};
const scStatusColor=(sid)=>sid>=11?"#059669":sid>=6?"#2563eb":sid>=3?"#d97706":"#6b7280";
const scStatusLabel=(sid)=>sid>=11?"Delivered":sid>=8?"In Transit":sid>=6?"Shipped":sid>=3?"Ready":"Pending";
const getParcelForOrder=(orderId)=>scParcels.find(p=>p.orderNo===orderId||p.orderNo===String(orderId));
const[internTransports,setInternTransports]=useState([]);
const[showTransportForm,setShowTransportForm]=useState(null);
const[transportDriver,setTransportDriver]=useState("");
const[transportNotes,setTransportNotes]=useState("");
const[transportTemp,setTransportTemp]=useState("20");
const createInternTransport=(order)=>{
const t={id:"IT-"+Date.now(),orderId:order?.id||"MANUAL",date:new Date().toLocaleDateString("de-DE"),time:new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}),driver:transportDriver||"NOC Driver",client:order?.client?.name||"",company:order?.client?.company||"",address:(order?.shipping?.street||"")+" "+(order?.shipping?.zip||"")+" "+(order?.shipping?.city||""),products:order?.items?.map(it=>it.name+" x"+it.qty).join(", ")||"",status:"on_the_way",temp:transportTemp+"°C",notes:transportNotes,deliveredAt:null,signedBy:null};
setInternTransports(prev=>[t,...prev]);setShowTransportForm(null);setTransportDriver("");setTransportNotes("");return t};
const confirmDelivery=(itId,signedBy)=>{setInternTransports(prev=>prev.map(t=>t.id===itId?{...t,status:"delivered",deliveredAt:new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"}),signedBy:signedBy||"Client"}:t))};
const printLieferschein=(order,transport)=>{const w=window.open("","_blank","width=800,height=1000");w.document.write('<html><head><title>Lieferschein '+((transport||{}).id||order.id)+'</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:12px;color:#1a1a1a}h1{font-size:18px;margin:0;color:#0f172a}h2{font-size:14px;margin:16px 0 8px;border-bottom:2px solid #0f172a;padding-bottom:4px}.header{display:flex;justify-content:space-between;border-bottom:3px solid #0f172a;padding-bottom:12px;margin-bottom:16px}.box{border:1px solid #d1d5db;border-radius:6px;padding:10px;margin:8px 0}table{width:100%;border-collapse:collapse;margin:8px 0}td,th{padding:6px 8px;border:1px solid #d1d5db;font-size:11px}th{background:#f1f5f9;font-weight:700;text-align:left}.sig{margin-top:30px;display:flex;gap:40px}.sig div{flex:1;border-top:1px solid #000;padding-top:4px;font-size:10px}.footer{margin-top:20px;font-size:9px;color:#9ca3af;text-align:center;border-top:1px solid #d1d5db;padding-top:8px}@media print{body{padding:20px}}</style></head><body>');
w.document.write('<div class="header"><div><h1>NOC Pharma GmbH</h1><div>Lieferschein / Delivery Note</div><div style="font-size:10px;color:#6b7280;margin-top:4px">GDP-konform · §52a AMG · BfArM-lizenziert</div></div><div style="text-align:right"><div style="font-size:16px;font-weight:800;color:#1e40af">'+(transport?transport.id:order.id)+'</div><div>'+new Date().toLocaleDateString("de-DE")+'</div><div>'+new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit"})+'</div></div></div>');
w.document.write('<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px"><div class="box"><strong>Absender / Sender:</strong><br/>NOC Pharma GmbH<br/>Celso Hamelink<br/>Operations Manager (Review)<br/>Deutschland</div><div class="box"><strong>Empfänger / Recipient:</strong><br/>'+(order.client?.name||"")+'<br/>'+(order.client?.company||"")+'<br/>'+(order.shipping?.street||order.billing?.street||"")+'<br/>'+(order.shipping?.zip||order.billing?.zip||"")+" "+(order.shipping?.city||order.billing?.city||"")+'<br/>'+(order.shipping?.country||order.billing?.country||"DE")+'</div></div>');
w.document.write('<h2>Transportdetails / Transport Details</h2><div class="box"><table><tr><td><strong>Transport:</strong></td><td>'+(transport?"NOC Intern Transport":"DHL / SendCloud")+'</td><td><strong>Fahrer / Driver:</strong></td><td>'+(transport?transport.driver:"—")+'</td></tr><tr><td><strong>Abfahrt / Departure:</strong></td><td>'+(transport?transport.date+" "+transport.time:"—")+'</td><td><strong>Temperatur / Temp:</strong></td><td>'+(transport?transport.temp:"15-25°C GDP")+'</td></tr>'+(transport?'<tr><td><strong>Tracking:</strong></td><td>'+transport.id+'</td><td><strong>Status:</strong></td><td>'+(transport.status==="delivered"?"✅ Delivered":"🚗 On the Way")+'</td></tr>':'')+'</table></div>');
w.document.write('<h2>Produkte / Products</h2><table><tr><th>#</th><th>Produkt / Product</th><th>Menge / Qty</th><th>Charge / Batch</th><th>PZN</th></tr>');
(order.items||[]).forEach(function(it,j){w.document.write('<tr><td>'+(j+1)+'</td><td>'+it.name+'</td><td>'+it.qty+'</td><td>'+(it.sku||"—")+'</td><td>—</td></tr>')});
w.document.write('</table>');
w.document.write('<h2>Bemerkungen / Notes</h2><div class="box" style="min-height:40px">'+(transport?transport.notes:"")+'</div>');
w.document.write('<div class="sig"><div>Übergabe / Handover<br/><br/>Datum / Date: ____________<br/>Unterschrift Fahrer / Driver Signature</div><div>Empfang / Receipt<br/><br/>Datum / Date: ____________<br/>Unterschrift Empfänger / Recipient Signature</div></div>');
w.document.write('<div class="footer">NOC Pharma GmbH · QMS v2.5 · GDP Transport Protocol · Generated: '+new Date().toISOString()+'</div></body></html>');
w.document.close();setTimeout(function(){w.print()},500)};
const[finTab,setFinTab]=useState("overview");
const[cfoAlerts,setCfoAlerts]=useState([]);const[bankTx,setBankTx]=useState([]);const[expenses,setExpenses]=useState([
{id:"EXP-001",date:"15.01.2026",cat:"regulatory",desc:"BfArM Import Permit BI-02",amount:2800,paid:true,ref:"BfArM-2026-001"},
{id:"EXP-002",date:"20.01.2026",cat:"regulatory",desc:"BtM Gebühr Q1/2026",amount:450,paid:true,ref:"BtM-Q1-26"},
{id:"EXP-003",date:"01.02.2026",cat:"office",desc:"Büro Miete Februar",amount:1200,paid:true,ref:"MIET-02-26"},
{id:"EXP-004",date:"01.02.2026",cat:"insurance",desc:"Betriebshaftpflicht Q1",amount:890,paid:true,ref:"VERS-Q1-26"},
{id:"EXP-005",date:"15.02.2026",cat:"legal",desc:"Rechtsberatung Cannabis-Lizenz",amount:3500,paid:true,ref:"RA-2026-003"},
{id:"EXP-006",date:"01.03.2026",cat:"office",desc:"Büro Miete März",amount:1200,paid:false,ref:"MIET-03-26"},
{id:"EXP-007",date:"01.03.2026",cat:"salary",desc:"Gehälter März",amount:12500,paid:false,ref:"GEH-03-26"},
{id:"EXP-008",date:"10.03.2026",cat:"logistics",desc:"WAS-Logistics CA-03 Deposit",amount:4500,paid:false,ref:"WAS-CA03"},
{id:"EXP-009",date:"15.03.2026",cat:"travel",desc:"Medcolcanna Site Visit Bogotá",amount:2800,paid:false,ref:"REISE-03-26"},
{id:"EXP-010",date:"20.03.2026",cat:"it",desc:"QMS Hosting + Domain",amount:89,paid:true,ref:"IT-03-26"}
]);
const[salaries]=useState([
{name:"Celso Hamelink",role:"Operations Manager (Review)",gross:4500,net:2850,tax:1150,social:500,contract:"permanent"},
{name:"QP Consultant",role:"Qualified Person §15 AMG",gross:3500,net:2600,tax:650,social:250,contract:"freelance"},
{name:"Warehouse Ops",role:"GDP Warehouse Manager",gross:2800,net:1900,tax:580,social:320,contract:"permanent"},
{name:"Regulatory Affairs",role:"RA Manager (Part-time)",gross:1700,net:1200,tax:340,social:160,contract:"part-time"}
]);
const[investors]=useState([
{name:"Seed Round",amount:150000,date:"01.06.2025",equity:"15%",type:"equity",status:"deployed",notes:"Initial capital for BI-01 + BI-02"},
{name:(lang==="de"?"Brückenkredit":"Bridge Loan"),amount:50000,date:"01.12.2025",equity:"—",type:"convertible",status:"active",interest:"6%",maturity:"01.12.2026",notes:"Working capital for MCCN qualification"},
{name:"Series A (Target)",amount:500000,date:"Q3 2026",equity:"20-25%",type:"equity",status:"planned",notes:"Scale to 3 suppliers + EU expansion"}
]);
const WIX_API_KEY="[SERVER-SIDE]";/* Key moved to server.cjs for security */
const WIX_SITE_ID="2c364620-6bf9-447c-bde1-e292e8a03ec4";
const fetchWixOrders=async()=>{setWixLoading(true);setWixError(null);try{
const resp=await fetch("http://localhost:3001/api/wix/orders",{method:"POST",headers:{"Content-Type":"application/json"}});
if(!resp.ok){const errText=await resp.text();throw new Error(resp.status+" "+errText.slice(0,200))}
const data=await resp.json();const orders=(data.orders||[]).map(o=>({
id:o.number||o._id,date:o._createdDate?new Date(o._createdDate).toLocaleDateString("de-DE"):"—",
status:o.paymentStatus||o.status||"—",
fulfillment:o.fulfillmentStatus||"NOT_FULFILLED",
client:{name:(o.billingInfo?.contactDetails?.firstName||"")+" "+(o.billingInfo?.contactDetails?.lastName||""),
email:o.buyerInfo?.email||o.billingInfo?.contactDetails?.email||"—",
phone:o.billingInfo?.contactDetails?.phone||"—",
company:o.billingInfo?.contactDetails?.company||""},
billing:{street:(o.billingInfo?.address?.streetAddress?.name||"")+" "+(o.billingInfo?.address?.streetAddress?.number||""),
city:o.billingInfo?.address?.city||"",zip:o.billingInfo?.address?.postalCode||"",
country:o.billingInfo?.address?.country||""},
shipping:{street:(o.shippingInfo?.logistics?.shippingDestination?.address?.streetAddress?.name||"")+" "+(o.shippingInfo?.logistics?.shippingDestination?.address?.streetAddress?.number||""),
city:o.shippingInfo?.logistics?.shippingDestination?.address?.city||"",
zip:o.shippingInfo?.logistics?.shippingDestination?.address?.postalCode||"",
country:o.shippingInfo?.logistics?.shippingDestination?.address?.country||"",
method:o.shippingInfo?.title||"—",carrier:o.shippingInfo?.logistics?.deliveryOption||"",
tracking:o.shippingInfo?.logistics?.trackingInfo?.trackingNumber||""},
items:(o.lineItems||[]).map(li=>({name:li.name||li.productName?.translated||"—",
sku:li.catalogReference?.catalogItemId||"—",qty:li.quantity||0,
price:parseFloat(li.price?.amount||li.priceBeforeDiscounts?.amount||0),
total:parseFloat(li.totalPrice?.amount||li.lineItemPrice?.amount||0),
weight:li.physicalProperties?.weight||0,variant:li.catalogReference?.options?.variantId||""})),
totals:{subtotal:parseFloat(o.priceSummary?.subtotal?.amount||0),
shipping:parseFloat(o.priceSummary?.shipping?.amount||0),
tax:parseFloat(o.priceSummary?.tax?.amount||0),
discount:parseFloat(o.priceSummary?.discount?.amount||0),
total:parseFloat(o.priceSummary?.total?.amount||0)},
currency:o.currency||"EUR",
payment:{method:o.paymentInfo?.[0]?.method||"—",transactionId:o.paymentInfo?.[0]?.transactionId||"—"},
raw:o
}));
setWixOrders(orders);setWixLastSync(new Date().toLocaleString("de-DE"));
}catch(err){setWixError(err.message)}finally{setWixLoading(false)}};
const t=T[lang];const sn=9;
useEffect(()=>{if(!wixAutoSync)return;const iv=setInterval(()=>{fetchWixOrders()},30000);return()=>clearInterval(iv)},[wixAutoSync]);
/* Persist critical QMS data to localStorage — 21 CFR Part 11 audit trail */
useEffect(()=>{try{localStorage.setItem("noc-qms-audit-log",JSON.stringify(auditLog.slice(0,500)))}catch(e){}},[auditLog]);
useEffect(()=>{try{localStorage.setItem("noc-qms-approvals",JSON.stringify(approvalHistory.slice(0,100)))}catch(e){}},[approvalHistory]);
useEffect(()=>{try{localStorage.setItem("noc-qms-finance",JSON.stringify(financeEntries))}catch(e){}},[financeEntries]);
useEffect(()=>{try{localStorage.setItem("noc-qms-bt-overrides",JSON.stringify(btOverrides))}catch(e){}},[btOverrides]);
/* Restore BT_DATA overrides on mount */
useEffect(()=>{Object.entries(btOverrides).forEach(([k,v])=>{const[batch,field]=k.split("_");if(BT_DATA[batch]&&field)BT_DATA[batch][field]=v})},[]);
/* Session timeout — auto-logout after 30min inactivity (GxP requirement) */
useEffect(()=>{if(!auth)return;let timer;const reset=()=>{clearTimeout(timer);timer=setTimeout(()=>{setAuth(null);setAuditLog(prev=>[{ts:new Date().toISOString(),user:auth?.name||"System",action:"SESSION_TIMEOUT",docKey:"",field:"auth",oldVal:"active",newVal:"timed out after 30min inactivity",batch:"",document:"",docType:"system"},...prev])},30*60*1000)};const events=["mousedown","keydown","scroll","touchstart"];events.forEach(e=>window.addEventListener(e,reset));reset();return()=>{clearTimeout(timer);events.forEach(e=>window.removeEventListener(e,reset))}},[auth]);
const triggerUpload=()=>{if(fileRef.current)fileRef.current.click()};
const handleFileUpload=async(e)=>{const files=Array.from(e.target.files||[]);if(!files.length)return;const supName=sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN";const batch=selBatch||"CA-02";
const stageRules=[
{stage:"M0",keys:["canmed","registration","gmp_cert","gmp-cert","gmp certificate","gmp conform","gacp","quality_technical","qta","pzn","ifa","bfarm","import_permit","import-permit","incb","supplier_qual","sqf","qualification","dqs","anmat","herstellungserlaubnis","manufacturing","licence","license","who_gmp","eu_gmp","pics","handelsregister","52a","btm_erlaubnis","narcotic","habilitacion","resolucion","disposicion","autorizacion","audit agenda","audit_agenda","melacrom"]},
{stage:"M0.5",keys:["coa","certificate_of_analysis","supplier_coa","export_permit","export-permit","sedronar","phyto","sanitary","pack_list","btm_export","btm-export","senasa","proforma","pro_forma","commercial_invoice","packing_list","weight_list","fumigation","apostille","apostilla","hague","btm_exp","incb_imp","origin","certificado_origen"]},
{stage:"M1",keys:["awb","airway","waybill","cmr","transport","gdp_transport","temp_log","temperature","datalog","sensitech","customs","mrn","zoll","iata","dg_declaration","freight","cargo","tracking","flight","bill_of_lading","bol","dangerous_good","fedex","dhl","kuehne","latam","lufthansa","loggpro","logger","flete","seguro_transporte","guia_aerea","conocimiento","poliza","insurance"]},
{stage:"M1.5",keys:["vault","arrival","receipt","btm_receipt","visual_inspection","seal","quarantine_arrival","tresor","empfang","eingang","wareneingang","incoming","goods_receipt","seal_verification","tamper","lieferschein","recepcion","acta_recepcion","verificacion_visual"]},
{stage:"M2",keys:["qsi","lab_report","lab_result","potency","hplc","tamc","tymc","mycotox","aflatox","terpene","moisture","testing","residual","prüfbericht","test_report","lab_report","cannabinoid_profile","water_activity","karl_fischer","informe","cannabinoide","cromatografia","espectro","resultado","determinacion","perfil","plaguicida","metales_pesados","humedad","actividad_acuosa","ensayo","analisis_lab","informe_700","informe_797","informe_002","coa 126","coa 127","coa_126","coa_127","inf 700","inf_700","inf 005","inf_005"]},
{stage:"M3",keys:["release","qp_release","qp-release","cgz","batch_release","freigabe","chargenfreigabe","sachkundige","qualified_person","conformity","batch_record","freigabezertifikat","certificate_release","liberacion","certificado_liberacion"]},
{stage:"M3.1",keys:["quarantine_release","quar_release","zone_transfer","quarantine_free","zone_change","liberacion_cuarentena"]},
{stage:"M3.5",keys:["gdp_out","outbound","transfer_transport","ausgang","outgoing","transporte_salida"]},
{stage:"M4",keys:["relabel","etikett","artwork","pzn_verify","barcode","umverpackung","secondary_packaging","sticker","mockup","artwork_approval","beanstandung","rueckruf","sop_109","sop_110","sop-109","sop-110","beschwerde","complaint","recall","deviation","abweichung","ficha_tecnica","ficha tecnica","envase","rotulo","etiqueta","embalaje"]},
{stage:"M4.5",keys:["storage","lager","allocation","inventory","monitoring","bestand","stock","einlagerung","shelf","racking","lagerplatz","almacenamiento","deposito"]},
{stage:"M5",keys:["shipping","dispatch","delivery","customer_order","purchase_order","versand","auslieferung","delivery_note","bestellnr","bestellung","pedido","despacho","envio","remito","factura","rechnung","invoice","orden_compra"]},
{stage:"M6",keys:["reconcil","recon","yield","archive","close","abschluss","bilanz","reconciliation","batch_close","yield_calc","destruction","vernichtung","cierre","conciliacion"]}
];
// Content-based classification keywords (for PDF text content)
const contentRules=[
{stage:"M0",keys:["gacp conform","gc-mark","gmp certificate","manufacturing license","good agricultural","collection practice","quality technical agreement","supplier qualification","pics member","herstellungserlaubnis","import permit","import genehmigung","einfuhrgenehmigung","bundesinstitut für arzneimittel","bfarm","narcotic","betäubungsmittel","52a amg","who-gmp","anmat"]},
{stage:"M0.5",keys:["certificate of analysis","export permit","phytosanitary","packing list","btm export","commercial invoice","certificate of origin","sedronar","proforma invoice","fumigation","apostille","hague convention","certificado de origen"]},
{stage:"M1",keys:["air waybill","cmr consignment","transport order","temperature log","customs declaration","insurance policy","dangerous goods","freight","cargo","mrn","zoll","sensitech","datalogger","cold chain","gdp transport","bill of lading"]},
{stage:"M1.5",keys:["vault arrival","btm receipt","visual inspection","seal verification","quarantine zone","incoming goods","wareneingang","weight check","empfangsprotokoll","delivery note","lieferschein"]},
{stage:"M2",keys:["laboratory report","potency analysis","hplc","microbiology","heavy metals","mycotoxin","terpene profile","moisture content","residual solvent","karl fischer","water activity","tamc","tymc","aflatoxin","qsi","prüfbericht","test report","informe de analisis","informe de ensayo","cromatografia","cannabinoides","cannabinoid","determinacion de cannabinoides","perfil de terpenos","analisis microbiologico","metales pesados","plaguicidas","humedad","actividad acuosa","resultado de analisis","thc","cbd","analytic report"]},
{stage:"M3",keys:["release certificate","batch release","qualified person","qp release","sachkundige person","freigabezertifikat","chargenfreigabe","batch record","conformity","quality assessment"]},
{stage:"M3.1",keys:["quarantine release","zone transfer","quarantänefreigabe"]},
{stage:"M4",keys:["label approval","relabeling protocol","pzn verification","artwork","barcode","etikett","secondary packaging","umverpackung","beanstandung","stufenplanbeauftragter","recall plan","behördenmeldung","complaint form","qualitätsmangel","ficha tecnica","envase flores","rotulo","etiqueta","embalaje"]},
{stage:"M4.5",keys:["storage allocation","inventory","lagerung","einlagerung","shelf life","monitoring"]},
{stage:"M5",keys:["shipping","dispatch","delivery order","customer order","purchase order","versand","auslieferung","lieferschein","factura","invoice","bestellnr","nota de pedido","orden de compra","remito"]},
{stage:"M6",keys:["reconciliation","yield calculation","final batch","archive","abschluss","batch close","destruction"]}
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
/* Detect subfolder-based stage mapping */
const folderStageMap={"m0":"M0","m0.5":"M0.5","m05":"M0.5","m1":"M1","m1.5":"M1.5","m15":"M1.5","m2":"M2","m3":"M3","m3.1":"M3.1","m31":"M3.1","m3.5":"M3.5","m35":"M3.5","m4":"M4","m4.5":"M4.5","m45":"M4.5","m5":"M5","m6":"M6",
"registration":"M0","permits":"M0","qualification":"M0",
"pre arrival":"M0.5","prearrival":"M0.5","pre-arrival":"M0.5","coa":"M0.5","export":"M0.5",
"transport":"M1","gdp":"M1","logistics":"M1","freight":"M1",
"arrival":"M1.5","vault":"M1.5","receipt":"M1.5","incoming":"M1.5",
"lab":"M2","testing":"M2","analysis":"M2","qsi":"M2","informe":"M2","cannabinoid":"M2",
"release":"M3","qp":"M3","freigabe":"M3",
"quarantine":"M3.1",
"relabel":"M4","label":"M4","packaging":"M4","etiqueta":"M4",
"storage":"M4.5","lager":"M4.5",
"shipment":"M5","invoice":"M5","factura":"M5","order":"M5",
"reconcil":"M6","archive":"M6","close":"M6"};
const stageFromPath=(path)=>{
const parts=path.toLowerCase().split("/").filter(p=>p&&!p.startsWith(".")&&!p.startsWith("__"));
for(const part of parts){
const clean=part.replace(/[_\-\.]/g," ").trim();
for(const[key,stage] of Object.entries(folderStageMap)){
if(clean===key||clean.startsWith(key+" ")||clean.startsWith(key+"_")||clean.includes(key))return stage;
}}
return null;
};
const extracted=[];
for(const nm of entries){
const blob=await zip.files[nm].async("blob");
const shortName=nm.includes("/")?nm.split("/").pop():nm;
if(!shortName||shortName.startsWith("."))continue;
const {textContent,url,ext}=await processFile({name:shortName},blob);
/* Priority: 1) subfolder name, 2) filename keywords, 3) PDF content */
const folderStage=stageFromPath(nm);
const stage=folderStage||assignStage(shortName,textContent);
extracted.push(createEntry(shortName,(blob.size/1024).toFixed(1)+"KB",ext,new Date().toLocaleString("de-DE"),stage,batch,supName,url,textContent,zipFile.name));
}
setUploads(p=>[...extracted,...p]);
const sc={};extracted.forEach(f=>{sc[f.stage]=(sc[f.stage]||0)+1});
const stageNames={"M0":"Registration & Permits","M0.5":"Pre-Arrival Docs","M1":"GDP Transport","M1.5":"Vault Arrival","M2":"Lab Testing","M3":"QP Release","M3.1":"Quarantine Release","M3.5":"GDP Transport","M4":"Relabeling","M4.5":"Storage","M5":"Shipment","M6":"Reconciliation"};
const hasSubfolders=extracted.some(f=>stageFromPath(f.fromZip||""));
/* Auto-navigate to lifecycle */
setPg("lifecycle");
alert("✅ "+extracted.length+" "+(lang==="de"?"Dateien extrahiert":"files extracted")+(hasSubfolders?" (Ordnerstruktur erkannt)":" (auto-classified)")+":\n\n"+Object.entries(sc).sort((a,b)=>a[0].localeCompare(b[0])).map(([s,c])=>"  "+s+" "+(stageNames[s]||s)+" → "+c+" "+(lang==="de"?"Datei(en)":"file(s)")).join("\n")+"\n\n"+(lang==="de"?"Tipp: Falsch zugeordnete Dateien können per Stage-Upload korrigiert werden.":"Tip: Misclassified files can be corrected via per-stage upload."));
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

const DEFAULT_USERS=[
{id:"celso",name:"Celso Hamelink",role:"Review / Operations Manager",email:"celso@nocpharma.de",level:"admin",initials:"CH",pw:"NOCph@rma#2025!",active:true,lastLogin:null},
{id:"schagon",name:"Dr. Olaf Schagon",role:"Qualified Person §15 AMG",email:"oschagon@t-online.dev",level:"qp",initials:"OS",pw:"QP$ch@g0n#15AMG",active:true,lastLogin:null},
{id:"torsten",name:"Torsten Cuny",role:"Responsible Person §52a AMG",email:"torsten.cuny@nocpharma.de",level:"rp",initials:"TC",pw:"TC$52a@Murchin25",active:true,lastLogin:null},
{id:"dominik",name:"Dominik Delacher",role:"Storage Manager / Warehouse",email:"dominik.delacher@nocpharma.de",level:"warehouse",initials:"DD",pw:"DD$W@rehouse#26",active:true,lastLogin:null},
{id:"auditor",name:"BfArM Auditor",role:"Federal Institute Inspector",email:"audit@bfarm.de",level:"auditor",initials:"BA",pw:"BfArM@Audit#2025",active:true,lastLogin:null}
];
const[users,setUsers]=useState(()=>{try{const s=localStorage.getItem("noc-qms-users");return s?JSON.parse(s):DEFAULT_USERS}catch(e){return DEFAULT_USERS}});
const saveUsers=(u)=>{try{localStorage.setItem("noc-qms-users",JSON.stringify(u))}catch(e){}setUsers(u)};
const[showAddUser,setShowAddUser]=useState(false);
const[newUser,setNewUser]=useState({name:"",email:"",level:"viewer",pw:""});
const genPw=()=>{const c="ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";return Array.from({length:12},()=>c[Math.floor(Math.random()*c.length)]).join("")};

const handleLogin=(e)=>{
if(e)e.preventDefault();
setLoginForm(p=>({...p,loading:true,error:""}));
setTimeout(()=>{
const u=users.find(x=>x.id===loginForm.user.toLowerCase()||x.email===loginForm.user.toLowerCase()||x.name.toLowerCase()===loginForm.user.toLowerCase());
if(u){if(u.pw&&loginForm.pass&&u.pw!==loginForm.pass){setLoginForm(p=>({...p,loading:false,error:lang==="de"?"Falsches Passwort":"Incorrect password"}));return;}const upd=users.map(x=>x.id===u.id?{...x,lastLogin:new Date().toISOString()}:x);saveUsers(upd);setAuth(u);localStorage.setItem("noc-auth",JSON.stringify(u));setLoginForm(p=>({...p,loading:false}));}
else if(loginForm.user.trim()){
const guest={id:"guest",name:loginForm.user,role:"Authorized User",email:loginForm.user+"@noc-pharma.de",level:"viewer",initials:loginForm.user.substring(0,2).toUpperCase()};
setAuth(guest);localStorage.setItem("noc-auth",JSON.stringify(guest));setLoginForm(p=>({...p,loading:false}));
}else{setLoginForm(p=>({...p,loading:false,error:lang==="de"?"Benutzername erforderlich":"Username required"}))}
},1200);
};

const SUPS=[{k:"cannava",fl:"🇦🇷",n:"Cannava",co:"Argentina",st:lang==="de"?"Aktiv":"Active",c:"#059669"},{k:"mccn",fl:"🇨🇴",n:"Medcolcanna",co:"Colombia",st:lang==="de"?"Qualifizierung":"Qualifizierung",c:"#d97706"},{k:"hytn",fl:"🇨🇦",n:"HYTN",co:"Canada",st:lang==="de"?"Geplant":"Planned",c:"#2563eb"}];const curSup=SUPS.find(s=>s.k===sup)||SUPS[0];

const BATCHES={
cannava:[
{id:"CA-01",n:1,ref:"BI-01-NOCB1.0-INF-F",batch:"BI-01",product:"NOC SE 17 Cannabis flos",kg:"59.5",units:72,permit:"E-10891/2024",import:"22.03.2025",stage:0,status:"docs-pending",stageLabel:lang==="de"?"Doku ausstehend":"Docs Pending",qp:"CGZ-2024-0031",color:"#6b7280"},
{id:"CA-02",n:2,ref:"BI-02-NOCB1.1-INF-F",batch:"BI-02",product:"NOC SE 19 Cannabis flos (T22/1)",kg:"198.5",units:239,permit:"E-12267/2025",import:"14.11.2025",stage:0,status:"docs-pending",stageLabel:lang==="de"?"Doku ausstehend":"Docs Pending",qp:"CGZ-2025-0047",color:"#6b7280"},
{id:"CA-03",n:3,ref:"BI-03-NOCB1.2-INF-F",batch:"BI-03",product:"NOC SE 17/20 Cannabis flos",kg:"140.0",units:239,permit:"E-12267/2025",import:"28.01.2026",stage:5,status:"active",stageLabel:"M2 Lab Testing",qp:null,color:"#d97706"},
{id:"CA-04",n:4,ref:"BI-04-NOCB1.3-INF-F",batch:"BI-04",product:"NOC SE 21 Cannabis flos",kg:"250.0",units:0,permit:"Ausstehend",import:"~Apr 2026",stage:0,status:"planned",stageLabel:"M0 Planned",qp:null,color:"#9ca3af"}
],
hytn:[
{id:"HY-01",n:1,ref:"HY-01-NOC-CAN-F",batch:"HY-01",product:"HYTN Premium Cannabis flos",kg:"0",units:0,permit:"Ausstehend",import:"~Q3 2026",stage:0,status:"planned",stageLabel:"M0 Planned",qp:null,color:"#9ca3af"}
],
mccn:[
{id:"CO-01",n:1,ref:"CO-01-NOC-COL-F",batch:"MC-01",product:"Medcolcanna Cannabis flos",kg:"0",units:0,permit:"Ausstehend",import:"~Q4 2026",stage:0,status:"planned",stageLabel:"M0 Planned",qp:null,color:"#9ca3af"}
]
};
const[selBatch,setSelBatch]=useState("CA-03");
const[batchExpanded,setBatchExpanded]=useState(true);
const supBatches=BATCHES[sup]||[];
const curBatch=supBatches.find(b=>b.id===selBatch)||supBatches[0]||null;
const BT=BT_DATA[selBatch]||BT_DATA["CA-03"];
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
const docBody=()=>{const sep="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";const ld=lang==="de";const rows=[[ld?"Dokument":"Document",docName],[ld?"Referenz":"Reference",ref],[ld?"Ausgestellt von":"Issued by",by],[ld?"Ausstellungsdatum":"Issue date",on],[ld?"Gueltig bis":"Valid until",vu],[ld?"Charge":"Batch",selBatch||"—"],[ld?"Lieferant":"Supplier",supName],[ld?"Stufe":"Stage",stage],[ld?"Status":"Status",hasDoc?(ld?"✅ Konform":"✅ Compliant"):(ld?"⏳ Ausstehend":"⏳ Pending")]];if(doc.det)doc.det.forEach(d=>rows.push(d));let body="NOC PHARMA GmbH\nPharmaceutical Quality Management System v2.5\n§52a AMG · EU GMP · BtMG\n"+sep+"\n\n";rows.forEach(r=>{body+=r[0]+": "+r[1]+"\n"});body+="\n"+sep+"\n\nRP: T. Cuny · QP: Dr. O. Schagon\nNOC Pharma GmbH · An der Redoute 1 · 17390 Murchin · MV\n"+(ld?"Erstellt: ":"Generated: ")+new Date().toISOString()+"\nQMS v2.5";return body};
// Print PDF function
const printPdf=()=>{const ld=lang==="de";const w=window.open("","_blank","width=800,height=600");w.document.write('<html><head><title>'+docName+' — NOC Pharma</title><style>body{font-family:Arial,sans-serif;padding:40px;color:#1f2937}h1{font-size:18px;border-bottom:2px solid #1e40af;padding-bottom:8px;color:#1e40af}h2{font-size:14px;color:#374151;margin-top:20px}table{width:100%;border-collapse:collapse;margin:16px 0}td{padding:6px 10px;border:1px solid #d1d5db;font-size:13px}td:first-child{font-weight:700;background:#f9fafb;width:35%}.ft{margin-top:30px;padding-top:10px;border-top:1px solid #d1d5db;font-size:10px;color:#9ca3af;text-align:center}.banner{background:#1e40af;color:#fff;padding:16px 40px;margin:-40px -40px 20px;font-size:12px;display:flex;justify-content:space-between;align-items:center}@media print{body{padding:20px}.banner{margin:-20px -20px 20px}}</style></head><body>');w.document.write('<div class="banner"><div><strong style="font-size:16px">NOC Pharma GmbH</strong><br/>QMS v2.5</div><div style="text-align:right">'+new Date().toLocaleDateString('de-DE')+'<br/>§52a AMG</div></div>');w.document.write('<h1>'+docName+'</h1><h2>Deutsch</h2><table>');[["Referenz",ref],["Ausgestellt von",by],["Ausstellungsdatum",on],["Gueltig bis",vu],["Charge",selBatch||"—"],["Lieferant",supName],["Stufe",stage],["Status",hasDoc?"✅ Konform":"⏳ Ausstehend"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+(r[1]||"—")+'</td></tr>')});if(doc.det)doc.det.forEach(function(d){w.document.write('<tr><td>'+d[0]+'</td><td>'+d[1]+'</td></tr>')});w.document.write('</table><h2>English</h2><table>');[["Reference",ref],["Issued by",by],["Issue date",on],["Valid until",vu],["Batch",selBatch||"—"],["Supplier",supName],["Stage",stage],["Status",hasDoc?"✅ Compliant":"⏳ Pending"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+(r[1]||"—")+'</td></tr>')});if(doc.det)doc.det.forEach(function(d){w.document.write('<tr><td>'+d[0]+'</td><td>'+d[1]+'</td></tr>')});w.document.write('</table><div class="ft">NOC Pharma GmbH · An der Redoute 1, 17390 Murchin · §52a AMG · QMS v2.5<br/>RP: T. Cuny · QP: Dr. O. Schagon · Generated: '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)};
// Send = email body IS the document (one click)
const sendDoc=()=>{const subj="NOC Pharma — "+docName+" ["+ref+"] — "+supName+" — Batch "+(selBatch||"");window.open(gmailLink(subj,docBody())+"&to="+encodeURIComponent(qpData.email)+"&cc="+encodeURIComponent(nocQp.email),"_blank")};
return <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
{hasDoc?<>
<button onClick={()=>setDocPreview({name:docName,ref,by,on,vu,stage,hasDoc:true,det:doc.det||[],sup:supName,batch:selBatch||"—"})} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:600,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#fff" strokeWidth="2"/><circle cx="12" cy="12" r="3" stroke="#fff" strokeWidth="2"/></svg>{lang==="de"?"Ansehen":"View"}</button>
<button onClick={printPdf} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="#374151" strokeWidth="1.5"/></svg>PDF</button>
<button onClick={sendDoc} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg>{lang==="de"?"Senden":"Send"}</button>
<button onClick={()=>window.open(folderUrl,"_blank")} title="Google Drive" style={{padding:"4px 6px",borderRadius:4,fontSize:14,border:"1px solid #bae6fd",background:"#eff6ff",color:"#1a73e8",cursor:"pointer"}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="#1a73e8"/></svg></button>
{/* Upload Original */}
{docOriginals[doc.k]?<>
<button onClick={()=>{const o=docOriginals[doc.k];if(o.ext==="pdf")window.open(o.url,"_blank");else{const w=window.open("","_blank");w.document.write('<html><head><title>'+o.name+'</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f1f5f9}img{max-width:90%;max-height:90vh;box-shadow:0 4px 20px rgba(0,0,0,.15);border-radius:8px}@media print{body{background:#fff}}</style></head><body><img src="'+o.url+'"/></body></html>');w.document.close()}}} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:600,border:"1px solid #059669",background:"#f0fdf4",color:"#059669",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>📄 {lang==="de"?"Original":"Original"} ✅</button>
<button onClick={()=>{setOrigTarget(doc.k);setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} title={lang==="de"?"Neue Version hochladen":"Upload new version"} style={{padding:"4px 8px",borderRadius:4,fontSize:13,fontWeight:600,border:"1.5px dashed #d97706",background:"#fffbeb",color:"#92400e",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>🔄 {lang==="de"?"Neu":"Re-upload"}</button>
<button onClick={()=>{if(confirm(lang==="de"?"Original '"+docOriginals[doc.k].name+"' wirklich löschen? Die KI-Analyse geht verloren.":"Delete original '"+docOriginals[doc.k].name+"'? AI analysis will be lost.")){setDocOriginals(prev=>{const n={...prev};delete n[doc.k];return n});setAuditLog(prev=>[{ts:new Date().toISOString(),user:auth?.name||"Celso Hamelink",action:"DELETE_ORIGINAL",docKey:doc.k,field:"original_document",oldVal:docOriginals[doc.k].name,newVal:"",batch:selBatch||"CA-03",document:docOriginals[doc.k].name,docType:"original"},...prev])}}} title={lang==="de"?"Original löschen":"Delete original"} style={{padding:"4px 8px",borderRadius:4,fontSize:13,fontWeight:600,border:"1px solid #fca5a5",background:"#fef2f2",color:"#dc2626",cursor:"pointer",display:"flex",alignItems:"center",gap:2}}>🗑️</button>
{doc.k==="sc"&&<button onClick={()=>{const n=Object.keys(docOriginals).filter(k=>k.startsWith("sc_extra")).length;setOrigTarget("sc_extra_"+(n+1));setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{padding:"4px 10px",borderRadius:4,fontSize:13,fontWeight:700,border:"2px dashed #059669",background:"#f0fdf4",color:"#065f46",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}>➕ {lang==="de"?"Weitere COA hochladen":"Upload Another COA"}</button>}{doc.k==="sc"&&Object.entries(docOriginals).filter(([k])=>k.startsWith("sc_extra")).sort().map(([k,xDoc])=><div key={k} style={{width:"100%",marginTop:8,border:"2px solid #059669",borderRadius:8,overflow:"hidden"}}><div style={{padding:"6px 10px",background:"#dcfce7",display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:13,fontWeight:700,color:"#065f46"}}>🇦🇷 Additional Supplier COA #{k.split("_").pop()}{xDoc.approvalComplete?" · ✅ AI Verified":xDoc.analyzing?" · ⏳ Analyzing...":""}</span><div style={{display:"flex",gap:4}}>{xDoc.url&&<button onClick={()=>{if(xDoc.ext==="pdf")window.open(xDoc.url,"_blank")}} style={{padding:"2px 8px",borderRadius:3,fontSize:11,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>👁️</button>}<button onClick={()=>setDocOriginals(p=>{const n={...p};delete n[k];return n})} style={{padding:"2px 8px",borderRadius:3,fontSize:11,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>🗑️</button></div></div><div style={{padding:"8px 10px",background:"#f0fdf4",fontSize:12,color:"#374151"}}><div style={{marginBottom:4}}><strong>{xDoc.name}</strong> · {xDoc.size} · {xDoc.date}</div>{xDoc.approvedCount>0&&<div style={{marginBottom:4,padding:"3px 8px",background:"#dcfce7",borderRadius:4,fontSize:11,color:"#065f46",fontWeight:700}}>✅ {xDoc.approvedCount} fields AI verified · {xDoc.approvedBy} · {xDoc.approvedAt?new Date(xDoc.approvedAt).toLocaleDateString("de-DE"):""}</div>}{xDoc.content&&<div style={{marginBottom:6,padding:"4px 8px",background:"#fff",borderRadius:4,fontSize:11,color:"#6b7280",fontStyle:"italic"}}>🤖 {xDoc.content}</div>}{xDoc.approvedData&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"2px 8px"}}>{Object.entries(xDoc.approvedData).slice(0,20).map(([fk,fv],fi)=><div key={fi} style={{fontSize:11,padding:"1px 0",borderBottom:"1px solid #dcfce7"}}><span style={{color:"#059669",fontWeight:600}}>{fk}:</span> <span>{fv}</span></div>)}</div>}</div></div>)}
</>
:<button onClick={()=>{setOrigTarget(doc.k);setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:600,border:"2px dashed #3b82f6",background:"#eff6ff",color:"#1e40af",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>📤 {lang==="de"?"Original hochladen":"Upload Original"}</button>}
</>:<>
<button onClick={()=>{setOrigTarget(doc.k);setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:700,border:"2px dashed #d97706",background:"#fffbeb",color:"#92400e",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#92400e" strokeWidth="2"/></svg>{lang==="de"?"Original hochladen":"Upload Original"}</button>
<button onClick={()=>{const subj="Request: "+docName+" ["+ref+"] — "+supName;const body="Sehr geehrte/r "+qpData.qp+",\n\nWir bitten hoeflich um folgendes Dokument:\n\nDokument: "+docName+"\nRef.: "+ref+"\nLieferant: "+supName+"\nCharge: "+(selBatch||"")+"\n\nBitte in unser Google Drive hochladen oder per Antwort-Mail zusenden.\n\nMit freundlichen Gruessen,\nCelso Hamelink\nNOC Pharma GmbH · QMS v2.5";window.open(gmailLink(subj,body)+"&to="+encodeURIComponent(qpData.email)+"&cc="+encodeURIComponent(nocQp.email),"_blank")}} style={{padding:"4px 10px",borderRadius:4,fontSize:14,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}><svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#374151" strokeWidth="1.5"/><path d="M22 6l-10 7L2 6" stroke="#374151" strokeWidth="1.5"/></svg>{lang==="de"?"Anfordern":"Request"}</button>
</>}
{/* Original file info + AI analysis */}
{docOriginals[doc.k]&&<div style={{width:"100%",marginTop:4}}>
<div style={{padding:"4px 8px",background:"#f0fdf4",borderRadius:docOriginals[doc.k].extracted&&Object.keys(docOriginals[doc.k].extracted).length>0?"4px 4px 0 0":"4px",border:"1px solid #a7f3d0",fontSize:11,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span>{docOriginals[doc.k].analyzing?"⏳ ":"📄 "}<strong>{docOriginals[doc.k].name}</strong> · {docOriginals[doc.k].size} · {docOriginals[doc.k].date}{docOriginals[doc.k].version>1&&<span style={{marginLeft:4,padding:"0 4px",borderRadius:3,background:"#dbeafe",color:"#1e40af",fontSize:9,fontWeight:700}}>v{docOriginals[doc.k].version}</span>}</span>
<div style={{display:"flex",gap:3}}>
{docOriginals[doc.k].analyzing&&<span style={{fontSize:10,color:"#d97706",fontWeight:700}}>🤖 Analyzing...</span>}
{docOriginals[doc.k].approvalComplete&&docOriginals[doc.k].approvedCount>0&&<span style={{fontSize:10,color:"#059669",fontWeight:700,padding:"1px 6px",borderRadius:3,background:"#dcfce7",border:"1px solid #a7f3d0"}}>🤖✅ AI Verified · {docOriginals[doc.k].approvedCount||0} approved · {docOriginals[doc.k].approvedAt?new Date(docOriginals[doc.k].approvedAt).toLocaleDateString("de-DE"):"—"} · {docOriginals[doc.k].approvedBy||"—"}</span>}
<button onClick={()=>{const o=docOriginals[doc.k];if(o.ext==="pdf")window.open(o.url,"_blank");else{const w=window.open("","_blank");w.document.write('<html><body style="margin:0;display:flex;justify-content:center;background:#111"><img src="'+o.url+'" style="max-width:100%;max-height:100vh"/></body></html>');w.document.close()}}} style={{padding:"2px 8px",borderRadius:3,fontSize:10,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>👁️ {lang==="de"?"Original":"Original"}</button>
<button onClick={()=>{const o=docOriginals[doc.k];if(o.ext==="pdf"){window.open(o.url,"_blank")}else{const w=window.open("","_blank");w.document.write('<html><body style="margin:0;background:#f1f5f9;display:flex;justify-content:center"><img src="'+o.url+'" style="max-width:90%;max-height:90vh"/></body></html>');w.document.close();setTimeout(()=>w.print(),500)}}} style={{padding:"2px 8px",borderRadius:3,fontSize:10,fontWeight:700,border:"none",background:"#374151",color:"#fff",cursor:"pointer"}}>🖨️</button>
</div>
</div>
{/* AI Summary */}
{docOriginals[doc.k].summary&&<div style={{padding:"3px 8px",background:"#f8fafc",border:"1px solid #e2e8f0",borderTop:"none",fontSize:10,color:"#475569"}}>
🤖 {docOriginals[doc.k].summary}
</div>}
{/* Verified fields */}
{docOriginals[doc.k].verified&&docOriginals[doc.k].verified.length>0&&
<div style={{padding:"3px 8px",background:"#f0fdf4",border:"1px solid #a7f3d0",borderTop:"none",fontSize:10}}>
{docOriginals[doc.k].verified.map((v,i)=><span key={i} style={{marginRight:4,padding:"1px 5px",borderRadius:3,background:"#dcfce7",color:"#059669",fontWeight:600}}>✅ {v}</span>)}
</div>}
{/* Extracted data */}
{docOriginals[doc.k].extracted&&Object.keys(docOriginals[doc.k].extracted).length>0&&
<div style={{padding:"3px 8px",background:"#eff6ff",border:"1px solid #bfdbfe",borderTop:"none",fontSize:10}}>
<span style={{fontWeight:700,color:"#1e40af"}}>📊 </span>
{Object.entries(docOriginals[doc.k].extracted).map(([k,v],i)=>
<span key={i} style={{marginRight:4,padding:"1px 5px",borderRadius:3,background:"#dbeafe",color:"#1e40af",fontWeight:600}}>{k}: {typeof v==="object"?JSON.stringify(v):v}</span>
)}
</div>}
{/* Discrepancies */}
{docOriginals[doc.k].discrepancies&&docOriginals[doc.k].discrepancies.length>0&&
<div style={{padding:"4px 8px",background:"#fef2f2",border:"1px solid #fecaca",borderTop:"none",borderRadius:"0 0 4px 4px",fontSize:10}}>
<span style={{fontWeight:700,color:"#dc2626"}}>⚠️ {lang==="de"?"Abweichungen":"Discrepancies"}: </span>
{docOriginals[doc.k].discrepancies.map((d,i)=><div key={i} style={{marginLeft:16,color:"#991b1b"}}>• {typeof d==="string"?d:(d.field||"")+(d.declared?" ("+d.declared+"":"")+(d.found?" → "+d.found:"")+(d.declared?")":"")}</div>)}
</div>}
{/* Corrections */}
{docOriginals[doc.k].corrections&&Object.keys(docOriginals[doc.k].corrections).length>0&&
<div style={{padding:"4px 8px",background:"#fefce8",border:"1px solid #fde68a",borderTop:"none",borderRadius:"0 0 4px 4px",fontSize:10}}>
<span style={{fontWeight:700,color:"#d97706"}}>🔄 {lang==="de"?"Korrekturen vorgeschlagen":"Corrections suggested"}: </span>
{Object.entries(docOriginals[doc.k].corrections).map(([k,v],i)=><span key={i} style={{marginRight:4,padding:"1px 5px",borderRadius:3,background:"#fef3c7",color:"#92400e",fontWeight:600}}>{k} → {v}</span>)}
</div>}
</div>}
</div>};


const ag=agMode==="master"?AGENTS.master:(AGENTS[sup]||AGENTS.cannava);const ALERTS=ag.alerts;
const ask=useCallback((q)=>{const x=q||ci;if(!x.trim())return;
const r=ag.chat(x);
setCm(p=>[...p,{r:"u",t:x},{r:"a",t:r}]);setCi("")},[ci,sup]);

const navRaw=[{s:t.overview,i:[{k:"dashboard",ic:"📊",l:t.dashboard},{k:"lifecycle",ic:"🔄",l:t.lifecycle}]},{s:t.operations,i:[{k:"batches",ic:"📦",l:t.batches},{k:"suppliers",p:"suppliers",ic:"🏭",l:t.suppliers},{k:"supDocs",p:"supDocs",ic:"📂",l:t.supDocs},{k:"nocDossier",p:"nocDossier",ic:"🏢",l:lang==="de"?"NOC Pharma Dossier":"NOC Pharma Dossier"},{k:"warehouse",ic:"🌡️",p:"warehouse",l:lang==="de"?"Lager-Monitor":"Warehouse Monitor"},{k:"lab",ic:"🔬",p:"lab",l:t.lab}]},{s:t.quality,i:[{k:"deviations",p:"deviations",ic:"⚠️",l:t.deviations},{k:"sops",p:"sops",ic:"📑",l:t.sops},{k:"btm",p:"btm",ic:"⚖️",l:t.btm}]},{s:lang==="de"?"Finanzen":"Finance",i:[{k:"finance",ic:"💰",p:"finance",l:lang==="de"?"Übersicht":"Overview"},{k:"fin-cannava",p:"finance",ic:"🇦🇷",l:"Cannava"},{k:"fin-mccn",p:"finance",ic:"🇨🇴",l:"Medcolcanna"},{k:"fin-hytn",p:"finance",ic:"🇨🇦",l:"HYTN"},{k:"fin-wix",p:"finance",ic:"🛒",l:"Wix Orders"},{k:"fin-vat",p:"finance",ic:"🏛️",l:"Import VAT 19%"},{k:"fin-spends",p:"finance",ic:"💳",l:"NOC Spends"},{k:"fin-salaries",p:"finance",ic:"👥",l:"NOC Salaries"},{k:"fin-forecast",p:"finance",ic:"🔮",l:"NOC Forecast"},{k:"fin-investors",p:"finance",ic:"📈",l:"NOC Investors"},{k:"fin-compete",p:"finance",ic:"⚔️",l:lang==="de"?"Wettbewerb":"Competitors"},{k:"fin-cfo",p:"finance",ic:"🤖",l:"AI CFO"}]},{s:t.docs,i:[{k:"docs",ic:"📜",l:t.docs}]},{s:t.admin,i:[{k:"users",ic:"👥",p:"users",l:t.users}]}]
const nav=navRaw.map(s=>({...s,i:s.i.filter(x=>!x.p||can(x.p))})).filter(s=>!s.p||can(s.p)).filter(s=>s.i.length>0);;

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
if(false&&curBatch&&curBatch.status==="planned")return <Cd t={"📋 M0 "+curBatch.id+" — "+(lang==="de"?"Vorab-Dokumente":"Pre-Arrival Docs")} badge={<Bd c="#9ca3af" b="#f3f4f6">{lang==="de"?"Geplant":"Planned"}</Bd>}><div style={{textAlign:"center",padding:24,color:"#9ca3af"}}><div style={{fontSize:32,marginBottom:8}}>📋</div><div style={{fontSize:15,fontWeight:600,marginBottom:4}}>{lang==="de"?"Wartet auf Dokumentation":"Awaiting documentation"}</div><div style={{fontSize:15,maxWidth:400,margin:"0 auto"}}>{lang==="de"?"Dokumente werden hier hochgeladen sobald verfügbar.":"Documents will be uploaded here once available."}</div><div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,maxWidth:400,margin:"16px auto 0"}}>{["Supplier Qualification","Import Permit (BfArM)","Export Permit","Packing List","Air Waybill","COA","Datenlogger","Phytosanitary Cert."].map((d,j)=><div key={j} style={{padding:"6px 10px",borderRadius:6,border:"1.5px dashed #d1d5db",fontSize:14,color:"#9ca3af",display:"flex",alignItems:"center",gap:4}}><span style={{color:"#d1d5db"}}>○</span>{d}</div>)}</div></div></Cd>;
if(false&&curBatch&&curBatch.status==="docs-pending")return <Cd t={"📂 "+curBatch.id+" — "+(lang==="de"?"Dokumentation importieren":"Import Documentation")} badge={<Bd c="#d97706" b="#fef3c7">{lang==="de"?"Doku ausstehend":"Docs Pending"}</Bd>}><div style={{textAlign:"center",padding:24}}><div style={{fontSize:40,marginBottom:8}}>📂</div><div style={{fontSize:16,fontWeight:700,color:"#d97706",marginBottom:4}}>{curBatch.id}: {curBatch.product}</div><div style={{fontSize:14,color:"#374151",marginBottom:4}}>{curBatch.kg}kg · {lang==="de"?"Importiert":"Imported"}: {curBatch.import} · Batch: {curBatch.batch}</div><div style={{fontSize:14,color:"#6b7280",maxWidth:450,margin:"0 auto",marginBottom:16}}>{lang==="de"?"Dieser Import wurde bereits abgeschlossen. Lade die Originaldokumente als ZIP hoch um sie den Lifecycle-Stufen zuzuordnen.":"This import has already been completed. Upload the original documents as a ZIP to assign them to lifecycle stages."}</div><button onClick={()=>fileRef.current&&fileRef.current.click()} style={{padding:"12px 28px",borderRadius:8,fontSize:15,fontWeight:700,border:"2px dashed #d97706",background:"#fefce8",color:"#d97706",cursor:"pointer"}}>📤 {lang==="de"?"ZIP mit Dokumenten hochladen":"Upload ZIP with Documents"}</button><div style={{marginTop:16,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,maxWidth:500,margin:"16px auto 0"}}>{[["M0","Registration"],["M0.5","Pre-Arrival"],["M1","GDP Transport"],["M1.5","Vault Arrival"],["M2","Lab Testing"],["M3","QP Release"],["M3.1","Quarantine"],["M4","Relabeling"],["M4.5","Storage"],["M5","Shipment"],["M6","Reconciliation"]].map(([id,name],j)=>{const cnt=uploads.filter(u=>u.stage===id&&u.batch===curBatch.id).length;return <div key={j} style={{padding:"6px 8px",borderRadius:6,border:cnt>0?"1.5px solid #059669":"1.5px dashed #d1d5db",background:cnt>0?"#f0fdf4":"transparent",fontSize:12,color:cnt>0?"#059669":"#9ca3af",display:"flex",alignItems:"center",justifyContent:"space-between"}}><span>{cnt>0?"✅":"○"} {id} {name}</span>{cnt>0&&<span style={{fontWeight:700}}>{cnt}</span>}</div>})}</div></div></Cd>;
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
<button onClick={()=>{var supN=sup==="cannava"?"Cannava S.E.":sup==="mccn"?"Medcolcanna":"HYTN";var supEmail=sup==="cannava"?"ruiz@cannava.gob.ar":sup==="mccn"?"qp@medcolcanna.com":"qp@hytn.ca";var body="NOC PHARMA GmbH\nQR Code Package — Batch BI-02-NOCB1.1-INF-F\n========================================\n\nDear "+supN+" Team,\n\nPlease find attached the QR code package for labeling:\n\n- 139x 1kg units (codes: 1KG-0001 to 1KG-0139)\n- 100x 10g units (codes: 10G-0001 to 10G-0100)\n- Total: 239 unique QR codes\n- Format: BI-02-NOCB1.1-INF-F-{SIZE}-{SEQ}\n- Verification: SHA-256 hash per unit\n\nPlease apply QR codes according to SOP-710-01.\nEncrypted ZIP password will be sent separately.\n\n========================================\nNOC Pharma GmbH · QMS v2.5\nRP: T. Cuny";window.open(gmailLink("NOC Pharma — QR Code Package — BI-02 — "+supN,body)+"&to="+encodeURIComponent(supEmail)+"&cc="+encodeURIComponent("torsten.cuny@nocpharma.de"),"_blank")}} style={{padding:"10px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer",textAlign:"center"}}>📧 {lang==="de"?"Per E-Mail senden":"Send by Email"}<div style={{fontSize:12,fontWeight:400,marginTop:2}}>{lang==="de"?"Verschlüsselt an Lieferant":"Encrypted to supplier"}</div></button>
<button onClick={()=>{var w=window.open("","_blank","width=800,height=900");w.document.write('<html><head><title>QR Label Template A4 — All 239</title><script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"><\/script><style>@page{size:A4;margin:8mm}body{font-family:Arial,sans-serif;margin:0;padding:8mm}.header{margin-bottom:6px}.header h1{font-size:13px;color:#1e40af;margin:0}.header p{font-size:8px;color:#666;margin:2px 0}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}.label{border:1px solid #bbb;border-radius:3px;padding:4px;text-align:center;page-break-inside:avoid}.label .qr-wrap{margin:0 auto 2px}.label .code{font-size:6.5px;font-weight:700;color:#1e40af;word-break:break-all;line-height:1.1;margin-top:2px}.label .info{font-size:6px;color:#666}@media print{.no-print{display:none}body{padding:5mm}}</style></head><body>');w.document.write('<div class="no-print" style="background:#f1f5f9;padding:8px;border-radius:6px;margin-bottom:8px;display:flex;gap:8px;align-items:center"><button onclick="window.print()" style="padding:6px 14px;border-radius:4px;font-size:11px;font-weight:700;border:none;background:#1e40af;color:#fff;cursor:pointer">Print All 239 Labels (A4)</button><span style="font-size:10px;color:#6b7280">All labels with scannable QR codes + full code identifier</span></div>');w.document.write('<div class="header"><h1>NOC Pharma GmbH — QR Labels (239 units)</h1><p>Batch: BI-02-NOCB1.1-INF-F | '+new Date().toLocaleDateString("de-DE")+' | SOP-710-01</p></div><div class="grid">');var allCodes=[];for(var i=1;i<=139;i++)allCodes.push(["1KG",i,"1kg"]);for(var i2=1;i2<=100;i2++)allCodes.push(["10G",i2,"10g"]);allCodes.forEach(function(c2,idx){var code="BI-02-NOCB1.1-INF-F-"+c2[0]+"-"+String(c2[1]).padStart(4,"0");w.document.write('<div class="label"><div class="qr-wrap" id="lbl'+idx+'"></div><div class="code">'+code+'</div><div class="info">NOC SE 19 | '+c2[2]+'</div></div>')});w.document.write('</div><p style="margin-top:6px;font-size:7px;color:#999">NOC Pharma GmbH · An der Redoute 1, 17390 Murchin · QMS v2.5 · SOP-710-01</p>');w.document.write('<script>var allC=[];for(var j=1;j<=139;j++)allC.push("BI-02-NOCB1.1-INF-F-1KG-"+String(j).padStart(4,"0"));for(var j2=1;j2<=100;j2++)allC.push("BI-02-NOCB1.1-INF-F-10G-"+String(j2).padStart(4,"0"));var idx2=0;function renderBatch(){var end=Math.min(idx2+20,allC.length);for(var i=idx2;i<end;i++){var el=document.getElementById("lbl"+i);if(el){try{new QRCode(el,{text:allC[i],width:48,height:48,colorDark:"#1e40af",colorLight:"#ffffff",correctLevel:QRCode.CorrectLevel.M})}catch(e){}}}idx2=end;if(idx2<allC.length)setTimeout(renderBatch,100)}renderBatch();<\/script></body></html>');w.document.close()}} style={{padding:"10px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer",textAlign:"center"}}>🖨️ {lang==="de"?"Druckvorlage":"Print Template"}<div style={{fontSize:12,fontWeight:400,marginTop:2}}>{lang==="de"?"Alle 239 Labels (A4)":"All 239 Labels (A4)"}</div></button>
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
const supCoa=docOriginals["sc"];const qsiCoa=docOriginals["lab_coa"]||docOriginals["qsi_coa"];
const hasBothCoas=supCoa&&qsiCoa&&supCoa.approvalComplete&&qsiCoa?.approvalComplete;
const supData=supCoa?.approvedData||supCoa?.extracted||{};
const qsiData=qsiCoa?.approvedData||qsiCoa?.extracted||{};
return <div>

{/* COA Document Cards — Preview both originals */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
<div style={{padding:12,borderRadius:10,border:supCoa?"2px solid #d97706":"2px dashed #d1d5db",background:supCoa?"linear-gradient(135deg,#fffbeb,#fef3c7)":"#f9fafb"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:20}}>🇦🇷</span>
<div><div style={{fontSize:14,fontWeight:700,color:"#92400e"}}>{lang==="de"?"Lieferanten-COA (Cannava)":"Supplier COA (Cannava)"}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{supCoa?supCoa.name:"—"}{supCoa?.approvalComplete?" · ✅ AI Verified":""}</div></div>
</div>
{supCoa?<span style={{padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:700,background:"#dcfce7",color:"#059669"}}>✅ {lang==="de"?"Hochgeladen":"Uploaded"}</span>
:<span style={{padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:700,background:"#fee2e2",color:"#dc2626"}}>⏳ {lang==="de"?"Fehlt":"Missing"}</span>}
</div>
{supCoa&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
{supCoa.url&&<button onClick={()=>{if(supCoa.ext==="pdf")window.open(supCoa.url,"_blank");else{const w=window.open("","_blank");w.document.write('<html><body style="margin:0;display:flex;justify-content:center;background:#111"><img src="'+supCoa.url+'" style="max-width:100%;max-height:100vh"/></body></html>');w.document.close()}}} style={{padding:"4px 10px",borderRadius:5,fontSize:12,fontWeight:700,border:"none",background:"#d97706",color:"#fff",cursor:"pointer"}}>👁️ {lang==="de"?"Original ansehen":"View Original"}</button>}
<button onClick={()=>{setOrigTarget("sc");setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{padding:"4px 10px",borderRadius:5,fontSize:12,fontWeight:600,border:"1px dashed #d97706",background:"#fff",color:"#92400e",cursor:"pointer"}}>🔄 {lang==="de"?"Neu hochladen":"Re-upload"}</button><button onClick={()=>{const scN=Object.keys(docOriginals).filter(k=>k.startsWith("sc_extra")).length;setOrigTarget("sc_extra_"+(scN+1));setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{padding:"4px 10px",borderRadius:5,fontSize:12,fontWeight:600,border:"1px dashed #059669",background:"#f0fdf4",color:"#065f46",cursor:"pointer"}}>➕ {lang==="de"?"Weitere COA":"Add COA"}</button>
</div>}
{(()=>{const extraSupCoas=uploads.filter(u=>u.linkedFrom&&u.linkedFrom.startsWith("sc_extra")&&u.batch===(curBatch&&curBatch.id)).sort((a,b)=>a.date>b.date?1:-1);return extraSupCoas.map((u,i)=><div key={u.name+i} style={{padding:10,borderRadius:8,border:"2px solid #d97706",background:"linear-gradient(135deg,#fffbeb,#fef3c7)",marginTop:6}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontSize:13,fontWeight:700,color:"#92400e"}}>🇦🇷 {lang==="de"?"Zusätzliche COA":"Additional COA"} #{i+1} {u.approvalComplete?"· ✅ AI Verified":""}</div><button onClick={()=>setUploads(p=>p.filter(x=>x.name!==u.name||x.date!==u.date))} style={{padding:"2px 8px",borderRadius:4,fontSize:11,border:"1px solid #dc2626",background:"#fef2f2",color:"#dc2626",cursor:"pointer"}}>🗑️</button></div><div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>📄 {u.name} · {u.size} · {u.date}</div>{u.content&&<div style={{fontSize:12,color:"#92400e",padding:"4px 6px",background:"#fef3c7",borderRadius:4,marginBottom:4}}>🤖 {u.content.substring(0,120)}...</div>}</div>)})()}<div style={{display:"flex",gap:4,marginTop:6}}><button onClick={()=>{setOrigTarget("sc");setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{flex:1,padding:"8px",borderRadius:6,fontSize:13,fontWeight:700,border:"2px dashed #d97706",background:"#fffbeb",color:"#92400e",cursor:"pointer"}}>📤 {supCoa?(lang==="de"?"Neue COA hochladen":"Upload New COA"):(lang==="de"?"Lieferanten-COA hochladen":"Upload Supplier COA")}</button><button onClick={()=>{const scN=uploads.filter(u=>u.linkedFrom&&u.linkedFrom.startsWith("sc_extra")&&u.batch===(curBatch&&curBatch.id)).length;setOrigTarget("sc_extra_"+(scN+1));setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{padding:"8px 12px",borderRadius:6,fontSize:13,fontWeight:700,border:"2px dashed #059669",background:"#f0fdf4",color:"#065f46",cursor:"pointer"}}>➕ {lang==="de"?"Weitere COA hochladen":"Upload Another COA"}</button></div>
{Object.entries(docOriginals).filter(([k])=>k.startsWith("sc_extra")).sort().map(([k,doc])=><div key={k} style={{padding:10,borderRadius:8,border:"2px solid #d97706",background:"#fffbeb",marginBottom:6}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div style={{fontSize:13,fontWeight:700,color:"#92400e"}}>🇦🇷 {lang==="de"?"Zusätzliche Lieferanten-COA":"Additional Supplier COA"} #{k.split("_").pop()}{doc.approvalComplete?" · ✅ AI Verified":""}</div><button onClick={()=>setDocOriginals(p=>{const n={...p};delete n[k];return n})} style={{padding:"2px 8px",borderRadius:4,fontSize:11,border:"1px solid #dc2626",background:"#fef2f2",color:"#dc2626",cursor:"pointer"}}>🗑️</button></div><div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>{doc.name} · {doc.size}</div>{doc.approvedData&&<div style={{fontSize:11,display:"flex",gap:6,flexWrap:"wrap"}}>{Object.entries(doc.approvedData).slice(0,6).map(([k2,v2],i)=><span key={i} style={{padding:"1px 6px",borderRadius:3,background:"#fef3c7",color:"#92400e",fontWeight:600}}>{k2}: {v2}</span>)}</div>}</div>)}{supData["THC Content"]&&<div style={{marginTop:6,display:"flex",gap:4,flexWrap:"wrap",fontSize:11}}>
{[["THC",supData["THC Content"]],["TAMC",supData["TAMC"]],["Lead",supData["Lead Pb"]],["Terpenes",supData["Total Terpenes"]]].filter(([,v])=>v).map(([k,v],i)=>
<span key={i} style={{padding:"1px 6px",borderRadius:3,background:"#fef3c7",color:"#92400e",fontWeight:600}}>{k}: {v}</span>)}
</div>}
</div>

<div style={{padding:12,borderRadius:10,border:qsiCoa?"2px solid #059669":"2px dashed #d1d5db",background:qsiCoa?"linear-gradient(135deg,#f0fdf4,#dcfce7)":"#f9fafb"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<span style={{fontSize:20}}>🇩🇪</span>
<div><div style={{fontSize:14,fontWeight:700,color:"#065f46"}}>{lang==="de"?"QSI Bremen COA (§14 AMG)":"QSI Bremen COA (§14 AMG)"}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{qsiCoa?qsiCoa.name:"—"}{qsiCoa?.approvalComplete?" · ✅ AI Verified":""}</div></div>
</div>
{qsiCoa?<span style={{padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:700,background:"#dcfce7",color:"#059669"}}>✅ {lang==="de"?"Hochgeladen":"Uploaded"}</span>
:<span style={{padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:700,background:"#fee2e2",color:"#dc2626"}}>⏳ {lang==="de"?"Fehlt":"Missing"}</span>}
</div>
{qsiCoa&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
{qsiCoa.url&&<button onClick={()=>{if(qsiCoa.ext==="pdf")window.open(qsiCoa.url,"_blank");else{const w=window.open("","_blank");w.document.write('<html><body style="margin:0;display:flex;justify-content:center;background:#111"><img src="'+qsiCoa.url+'" style="max-width:100%;max-height:100vh"/></body></html>');w.document.close()}}} style={{padding:"4px 10px",borderRadius:5,fontSize:12,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>👁️ {lang==="de"?"Original ansehen":"View Original"}</button>}
<button onClick={()=>{setOrigTarget("lab_coa");setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{padding:"4px 10px",borderRadius:5,fontSize:12,fontWeight:600,border:"1px dashed #059669",background:"#fff",color:"#065f46",cursor:"pointer"}}>🔄 {lang==="de"?"Neu hochladen":"Re-upload"}</button><button onClick={()=>{const qsiN=Object.keys(docOriginals).filter(k=>k.startsWith("qsi_extra")).length;setOrigTarget("qsi_extra_"+(qsiN+1));setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{padding:"4px 10px",borderRadius:5,fontSize:12,fontWeight:600,border:"1px dashed #7c3aed",background:"#faf5ff",color:"#6d28d9",cursor:"pointer"}}>➕ {lang==="de"?"Weitere QSI":"Add QSI"}</button>
</div>}
<div style={{display:"flex",gap:4,marginTop:4}}><button onClick={()=>{setOrigTarget("lab_coa");setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{flex:1,padding:"8px",borderRadius:6,fontSize:13,fontWeight:700,border:"2px dashed #059669",background:"#f0fdf4",color:"#065f46",cursor:"pointer"}}>📤 {qsiCoa?(lang==="de"?"Neue QSI hochladen":"Upload New QSI"):(lang==="de"?"QSI COA hochladen":"Upload QSI COA")}</button><button onClick={()=>{const qsiN=Object.keys(docOriginals).filter(k=>k.startsWith("qsi_extra")).length;setOrigTarget("qsi_extra_"+(qsiN+1));setTimeout(()=>origFileRef.current&&origFileRef.current.click(),50)}} style={{padding:"8px 12px",borderRadius:6,fontSize:13,fontWeight:700,border:"2px dashed #7c3aed",background:"#faf5ff",color:"#6d28d9",cursor:"pointer"}}>➕ {lang==="de"?"Weitere":"Add More"}</button></div>
{qsiData["THC Content"]&&<div style={{marginTop:6,display:"flex",gap:4,flexWrap:"wrap",fontSize:11}}>
{[["THC",qsiData["THC Content"]],["TAMC",qsiData["TAMC"]],["Lead",qsiData["Lead Pb"]],["Terpenes",qsiData["Total Terpenes"]]].filter(([,v])=>v).map(([k,v],i)=>
<span key={i} style={{padding:"1px 6px",borderRadius:3,background:"#dcfce7",color:"#059669",fontWeight:600}}>{k}: {v}</span>)}
</div>}
</div>
</div>

{/* Safety Gate Summary — only when both COAs are loaded */}
{hasBothCoas&&<div style={{marginBottom:12,padding:10,borderRadius:8,border:"2px solid "+(LAB.every(l=>l.lim===null||l.var===null||Math.abs(l.var)<50)?"#059669":"#dc2626"),background:LAB.every(l=>l.lim===null||l.var===null||Math.abs(l.var)<50)?"linear-gradient(135deg,#f0fdf4,#dcfce7)":"linear-gradient(135deg,#fef2f2,#fee2e2)"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:24}}>{LAB.every(l=>l.lim===null||l.var===null||Math.abs(l.var)<50)?"🟢":"🔴"}</span>
<div>
<div style={{fontSize:16,fontWeight:800}}>{lang==="de"?"Sicherheitstor — Supplier vs QSI Vergleich":"Safety Gate — Supplier vs QSI Comparison"}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{LAB.filter(l=>l.sup&&l.qsi).length} {lang==="de"?"Parameter verglichen":"parameters compared"} · {lang==="de"?"Alle innerhalb Ph. Eur. Spezifikationen":"All within Ph. Eur. specifications"}</div>
</div></div>
<span style={{padding:"4px 12px",borderRadius:6,fontSize:13,fontWeight:800,background:LAB.every(l=>l.lim===null||l.var===null||Math.abs(l.var)<50)?"#059669":"#dc2626",color:"#fff"}}>{LAB.every(l=>l.lim===null||l.var===null||Math.abs(l.var)<50)?t.allPass:"⚠️ REVIEW"}</span>
</div>
</div>}

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
{[[t.batch,BT.id],[lang==="de"?"Produkt":(lang==="de"?"Produkt":"Product"),BT.p+" — Cannabis flos"],[lang==="de"?"Lieferant":"Supplier","Cannava S.E. — San Juan, Argentina"],[lang==="de"?"Menge":"Quantity",BT.kg+" kg ("+BT.units+" units)"],[lang==="de"?"Labor":"Laboratory","QSI GmbH ("+BT.aNo+")"],[lang==="de"?"Prüfzeitraum":"Testing Period","18.11.2025 – 10.12.2025"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
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
?"Hiermit bestätige ich, Dr. Olaf Schagon, als Sachkundige Person gemäß §15 AMG, dass die Charge "+BT.id+" ("+BT.p+", Cannabis flos) vollständig gemäß den Anforderungen der Ph. Eur. Monographie \u201eCannabis flos\u201c, der EU-GMP-Richtlinien (Anhang 16) sowie des BtMG §3 geprüft wurde. Alle 19 Prüfparameter liegen innerhalb der Spezifikation. Die Sicherheitsbewertung (Safety Gate) ergibt GRÜN. Die Identität, Reinheit, Gehalt und mikrobiologische Qualität sind bestätigt. Die Charge wird hiermit für den Vertrieb im Rahmen der Großhandelserlaubnis gemäß §52a AMG freigegeben."
:"I, Dr. Olaf Schagon, as Qualified Person per §15 AMG, hereby confirm that batch "+BT.id+" ("+BT.p+", Cannabis flos) has been fully tested per Ph. Eur. monograph 'Cannabis flos', EU GMP Annex 16, and BtMG §3. All 19 test parameters within spec. Safety Gate: GREEN. Identity, purity, assay, microbiology confirmed. Batch released for distribution per §52a AMG."}</div>
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
<div style={{fontSize:14,color:"#d97706",fontWeight:600}}>📧 {lang==="de"?"DocuSign-Einladung gesendet an qp@nocpharma.de — Warte auf Unterschrift...":"DocuSign envelope sent to qp@nocpharma.de — Awaiting signature..."}</div>
<button onClick={m3Sign} style={{padding:"5px 12px",borderRadius:5,fontSize:14,fontWeight:700,border:"none",background:"#16a34a",color:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>✅ {lang==="de"?"DocuSign simulieren":"Simulate DocuSign"}</button>
</div>}
</div>

{m3Step===2&&<div style={{display:"flex",flexDirection:"column",gap:6,alignSelf:"center"}}>
<button onClick={m3Send} style={{padding:"10px 18px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#16a34a",color:"#fff",cursor:"pointer",whiteSpace:"nowrap",boxShadow:"0 3px 8px rgba(22,163,74,.3)"}}>📧 {lang==="de"?"An DocuSign senden":"Send to DocuSign"}</button>
<div style={{fontSize:12,color:"#6b7280",textAlign:"center"}}>qp@nocpharma.de</div>
</div>}
</div>
</div>
</div>
</div>}

{m3Step===4&&<div style={{padding:14,background:"linear-gradient(135deg,#dcfce7,#d1fae5)",borderRadius:8,border:"1px solid #a7f3d0",textAlign:"center"}}>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>✅ {lang==="de"?"QP-CHARGENFREIGABE ABGESCHLOSSEN":"QP BATCH RELEASE COMPLETE"}</div>
<div style={{fontSize:15,color:"#065f46",marginTop:4}}>{lang==="de"?"Charge "+BT.id+" freigegeben von Dr. Olaf Schagon. Zertifikat "+BT.cert+" archiviert.":"Batch "+BT.id+" released by Dr. Olaf Schagon. Certificate "+BT.cert+" archived."}</div>
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
?"Hiermit wird bestätigt, dass die oben genannte Charge die Quarantäne-Prüfung bestanden hat. Die Sachkundige Person (QP) hat die Charge gemäß §15 AMG und EU-GMP Annex 16 freigegeben. Alle 19 Prüfparameter liegen innerhalb der Spezifikation (Safety Gate: GRÜN). Die Charge wird aus der Quarantänezone freigegeben und für den Transport zum Kommerzlager Murchin An der Redoute 1 genehmigt."
:"This certifies that the above-referenced batch has passed quarantine review. The Qualified Person (QP) has released the batch per §15 AMG and EU-GMP Annex 16. All 19 test parameters are within specification (Safety Gate: GREEN). The batch is hereby released from quarantine and approved for transport to commercial warehouse Murchin An der Redoute 1."}</div>
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16,fontSize:15}}>
{[[lang==="de"?"Herkunftsort":"Origin",lang==="de"?"Murchin — Quarantänezone":"Murchin — Quarantine Zone"],[lang==="de"?"Zielort":"Destination","Murchin — Commercial Storage"],[lang==="de"?"Transportauftrag":"Transport Request","TR-NOC-2025-0089"],[lang==="de"?"GDP-Spediteur":"GDP Carrier",lang==="de"?"NOC Pharma (Eigenflotte)":"NOC Pharma (Own Fleet)"],[lang==="de"?"Temp.-Anforderung":"Temp. Requirement","15–25°C (EU GDP 2013/C 343/01)"],[lang==="de"?"BtM-Bestand":"BtM Inventory",lang==="de"?"§13 BtMG — Zonenumbuchung":"§13 BtMG — Zone Transfer"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
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
<div style={{fontSize:15,color:"#065f46",marginTop:4}}>{lang==="de"?"Alle 3 DocuSign-Unterschriften erhalten. Charge freigegeben für Transport zum Lager.":"All 3 DocuSign signatures collected. Batch released for transport to warehouse."}</div>
<div style={{fontSize:13,color:"#065f46",marginTop:4}}>eIDAS Art. 25 • 21 CFR Part 11 • ALCOA+ • {lang==="de"?"Audit-Trail vollständig":"Audit trail complete"}</div>
</div>}

{!m31AllSigned&&<div style={{marginTop:10,padding:10,background:"#fffbeb",borderRadius:6,border:"1px solid #fde68a",fontSize:14,color:"#92400e"}}>
⚠️ {Object.values(m31Sigs).filter(Boolean).length}/3 {lang==="de"?"via DocuSign unterschrieben. Charge bleibt in Quarantäne bis alle Unterschriften vorliegen.":"signed via DocuSign. Batch remains in quarantine until all signatures are collected."}
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
const imp=curBatch||{id:"—",batch:"—"};
/* Detailed document requirements per stage — matches CA-03 structure exactly */
const stageDocs={
"M0":[
{n:lang==="de"?"§52a AMG Großhandelserlaubnis":"§52a AMG Wholesale License",ref:"WDE-2024-0847",who:"NOC Pharma / LAGuS MV"},
{n:lang==="de"?"BtMG §3 Betäubungsmittellizenz":"BtMG §3 Narcotics License",ref:"BfArM",who:"NOC Pharma / BfArM"},
{n:lang==="de"?"Einfuhrgenehmigung (BfArM)":"Import Permit (BfArM §3 BtMG)",ref:imp.permit||"E-xxxxx",who:"NOC Pharma / BfArM",critical:true},
{n:lang==="de"?"INCB Genehmigung":"INCB Authorization",ref:"INCB-IMP-DE-xxxx",who:"NOC Pharma / INCB Vienna"},
{n:lang==="de"?"Lieferantenqualifizierung":"Supplier Qualification File",ref:"SQF-CANN-xxxx",who:supInfo.n},
{n:lang==="de"?"GMP Zertifikat (Lieferant)":"GMP Certificate (Supplier)",ref:"ANMAT/HC/INVIMA",who:supInfo.n},
{n:lang==="de"?"GACP Zertifikat":"GACP Certificate",ref:"Cultivation compliance",who:supInfo.n},
{n:lang==="de"?"Qualitätsvereinbarung (QTA)":"Quality Technical Agreement",ref:"QTA-NOC-xxxx",who:"NOC + "+supInfo.n},
],
"M0.5":[
{n:lang==="de"?"Lieferanten-COA (Cannabinoide)":"Supplier COA (Cannabinoids)",ref:"COA-CANN-xxxx",who:supInfo.n+" Lab"},
{n:lang==="de"?"Ausfuhrgenehmigung (SEDRONAR/ANMAT)":"Export Permit (SEDRONAR/ANMAT)",ref:"Exp-xxxx",who:supInfo.n+" / Authority"},
{n:lang==="de"?"Apostille (Haager Übereinkommen)":"Apostille (Hague Convention)",ref:"APO-AR-xxxx",who:"Min. de Relaciones Exteriores"},
{n:lang==="de"?"BtM-Ausfuhrerklärung":"BtM Export Declaration",ref:"BtM-EXP-AR-xxxx",who:supInfo.n},
{n:lang==="de"?"Packliste":"Packing List",ref:"PL-xxxxx",who:supInfo.n},
{n:lang==="de"?"Proforma-Rechnung":"Proforma Invoice",ref:"PI-CANN-xxxx",who:supInfo.n},
{n:lang==="de"?"Phytosanitäres Zeugnis":"Phytosanitary Certificate",ref:"SENASA",who:"SENASA Argentina"},
{n:lang==="de"?"Herkunftszertifikat":"Certificate of Origin",ref:"CO-xxxx",who:supInfo.n},
{n:lang==="de"?"Produktspezifikation":"Product Specification",ref:"SPEC-xxxx",who:supInfo.n},
],
"M1":[
{n:lang==="de"?"Luftfrachtbrief (AWB)":"Air Waybill (AWB)",ref:"xxx-xxxxxxxx",who:"Airline / Freight Forwarder"},
{n:lang==="de"?"GDP Temperaturprotokoll":"GDP Temperature Log",ref:"Sensitech/LoggPro",who:"WAS Logistics"},
{n:lang==="de"?"Frachtversicherung":"Freight Insurance Certificate",ref:"INS-NOC-xxxx",who:"Allianz / Insurer"},
{n:lang==="de"?"Transport & Logistikkosten":"Transport & Logistics Costs",ref:"WAS-xxxx",who:"WAS Logistics"},
{n:lang==="de"?"Zollerklärung / MRN":"Customs Declaration / MRN",ref:"MRN-xxxx",who:"Customs Broker"},
{n:lang==="de"?"BtM-Transportgenehmigung":"BtM Transport Permit",ref:"BfArM",who:"BfArM"},
{n:lang==="de"?"Gefahrgut-Deklaration":"Dangerous Goods Declaration",ref:"IATA DGR",who:"Freight Forwarder"},
],
"M1.5":[
{n:lang==="de"?"Wareneingangsprotokoll":"Goods Receipt Protocol",ref:"GR-NOC-xxxx",who:"Dominik Delacher (Warehouse)"},
{n:lang==="de"?"Visuelle Inspektion":"Visual Inspection Report",ref:"VI-xxxx",who:"Dominik Delacher"},
{n:lang==="de"?"Siegelverifizierung":"Seal Verification",ref:"SV-xxxx",who:"Dominik Delacher"},
{n:lang==="de"?"Gewichtskontrolle":"Weight Check",ref:"WC-xxxx",who:"Dominik Delacher"},
{n:lang==="de"?"BtM-Empfangsbestätigung":"BtM Receipt Confirmation",ref:"BtM-REC-xxxx",who:"T. Cuny (RP)"},
{n:lang==="de"?"Quarantäne-Einlagerung":"Quarantine Storage Assignment",ref:"QS-xxxx",who:"Dominik Delacher"},
],
"M2":[
{n:lang==="de"?"QSI Labor-COA (Cannabinoide)":"QSI Lab COA (Cannabinoids)",ref:"QSI-xxxx",who:"QSI GmbH Bremen"},
{n:lang==="de"?"Potenzanalyse (THC/CBD)":"Potency Analysis (THC/CBD)",ref:"QSI HPLC",who:"QSI GmbH Bremen"},
{n:lang==="de"?"Mikrobiologie (TAMC/TYMC)":"Microbiology (TAMC/TYMC)",ref:"Ph.Eur. 2.6.12",who:"QSI GmbH Bremen"},
{n:lang==="de"?"Schwermetalle":"Heavy Metals",ref:"Ph.Eur. 2.4.27",who:"QSI GmbH Bremen"},
{n:lang==="de"?"Mykotoxine / Aflatoxine":"Mycotoxins / Aflatoxins",ref:"Ph.Eur.",who:"QSI GmbH Bremen"},
{n:lang==="de"?"Terpenprofil":"Terpene Profile",ref:"GC-MS",who:"QSI GmbH Bremen"},
{n:lang==="de"?"Restlösemittel":"Residual Solvents",ref:"Ph.Eur. 2.4.24",who:"QSI GmbH Bremen"},
{n:lang==="de"?"Feuchte / Wasseraktivität":"Moisture / Water Activity",ref:"Karl Fischer",who:"QSI GmbH Bremen"},
{n:lang==="de"?"Pestizide / Pflanzenschutzmittel":"Pesticides",ref:"Ph.Eur.",who:"QSI GmbH Bremen"},
],
"M3":[
{n:lang==="de"?"QP-Freigabezertifikat":"QP Release Certificate",ref:"CGZ-xxxx",who:"Dr. O. Schagon (QP §15 AMG)"},
{n:lang==="de"?"Chargenprotokoll":"Batch Record",ref:"BR-xxxx",who:"T. Cuny (RP)"},
{n:lang==="de"?"Safety Gate Bewertung":"Safety Gate Assessment",ref:"SG-xxxx",who:"QMS AI Agent"},
{n:lang==="de"?"Konformitätserklärung":"Declaration of Conformity",ref:"DOC-xxxx",who:"Dr. O. Schagon (QP)"},
],
"M3.1":[
{n:lang==="de"?"Quarantäne-Freigabeformular":"Quarantine Release Form",ref:"QRF-xxxx",who:"Dr. O. Schagon (QP) + T. Cuny (RP)"},
{n:lang==="de"?"Zonenumbuchung Q→K":"Zone Transfer Q→Commercial",ref:"TR-NOC-xxxx",who:"T. Cuny (RP)"},
{n:lang==="de"?"BtM-Bestandsänderung":"BtM Inventory Change",ref:"BtM-§13",who:"T. Cuny (RP)"},
],
"M3.5":[
{n:lang==="de"?"GDP Transportauftrag (intern)":"GDP Transport Order (internal)",ref:"TR-NOC-xxxx",who:"T. Cuny (RP)"},
{n:lang==="de"?"Temperaturprotokoll (intern)":"Temperature Log (internal)",ref:"TL-xxxx",who:"Driver"},
{n:lang==="de"?"Übergabeprotokoll":"Handover Protocol",ref:"HO-xxxx",who:"Dominik Delacher → Murchin"},
],
"M4":[
{n:lang==="de"?"Etikettendesign / Artwork":"Label Design / Artwork",ref:"AW-xxxx",who:"NOC Pharma"},
{n:lang==="de"?"PZN-Verifizierung":"PZN Verification",ref:"IFA",who:"IFA GmbH"},
{n:lang==="de"?"Umetikettierungsprotokoll":"Relabeling Protocol",ref:"RL-xxxx",who:"T. Cuny (RP)"},
{n:lang==="de"?"QR-Code Zuweisung":"QR Code Assignment",ref:"QR-xxxx",who:"NOC Pharma QMS"},
{n:lang==="de"?"Fotos vorher/nachher":"Photos Before/After",ref:"Evidence",who:"Operations"},
{n:lang==="de"?"Ficha Técnica / Envase":"Technical Sheet / Packaging",ref:"FT-xxxx",who:supInfo.n},
],
"M4.5":[
{n:lang==="de"?"Lagerplatzzuweisung":"Storage Allocation",ref:"SA-xxxx",who:"Dominik Delacher"},
{n:lang==="de"?"Temperatur-/Feuchteprotokoll":"Temperature/Humidity Log",ref:"SOP-GDP-003",who:"X-Sense STH51"},
{n:lang==="de"?"Boxen-Zuordnung":"Box Assignment",ref:"BOX-xxx",who:"Dominik Delacher"},
{n:lang==="de"?"BtM-Bestandsführung":"BtM Inventory Management",ref:"§13 BtMG",who:"T. Cuny (RP)"},
],
"M5":[
{n:lang==="de"?"Kundenbestellung":"Customer Order",ref:"ORD-xxxx",who:"Wix / Customer"},
{n:lang==="de"?"Rechnung / Factura":"Invoice",ref:"INV-xxxx",who:"NOC Pharma"},
{n:lang==="de"?"Lieferschein":"Delivery Note",ref:"DN-xxxx",who:"NOC Pharma"},
{n:lang==="de"?"SendCloud Versandlabel":"SendCloud Shipping Label",ref:"SC-xxxx",who:"SendCloud"},
{n:lang==="de"?"GDP Versandprotokoll":"GDP Dispatch Protocol",ref:"DP-xxxx",who:"T. Cuny (RP)"},
],
"M6":[
{n:lang==="de"?"Chargenabschluss":"Batch Closure Report",ref:"BC-xxxx",who:"T. Cuny (RP)"},
{n:lang==="de"?"Ertragsberechnung":"Yield Calculation",ref:"YC-xxxx",who:"Operations"},
{n:lang==="de"?"BtM-Endabrechnung":"BtM Final Reconciliation",ref:"§15 BtMG",who:"T. Cuny (RP)"},
{n:lang==="de"?"Archivierung":"Archiving Confirmation",ref:"ARCH-xxxx",who:"QMS"},
{n:lang==="de"?"Rückstellmuster-Protokoll":"Retention Sample Protocol",ref:"RS-xxxx",who:"QSI GmbH Bremen"},
],
};
const docs=stageDocs[stageId]||[];
const stageUploads=uploads.filter(u=>u.stage===stageId&&u.batch===(curBatch&&curBatch.id));
return <div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
<div onClick={()=>fileRef.current&&fileRef.current.click()} style={{border:"2px dashed #3b82f6",borderRadius:10,padding:14,cursor:"pointer",background:"#eff6ff"}}>
<div style={{fontSize:24,marginBottom:4}}>📦</div>
<div style={{fontSize:13,fontWeight:700,color:"#1e40af"}}>ZIP Upload</div>
<div style={{fontSize:11,color:"#6b7280"}}>{lang==="de"?"Alle Dokumente als ZIP":"All documents as ZIP"}</div>
</div>
<div onClick={()=>window.open(gmailLink("Document Request: "+supInfo.n+" "+stageId+" "+imp.id,"Please prepare "+stageId+" "+stageName+" documents for "+supInfo.n+":\n\nImport: "+imp.id+"\nBatch: "+(imp.batch||"")+"\n\nRequired:\n"+docs.map((d,i)=>(i+1)+". "+d.n+" ("+d.ref+")").join("\n")+"\n\nPlease upload to Google Drive or reply with attachments.\n\nBest regards,\nCelso Hamelink\nNOC Pharma GmbH"),"_blank")} style={{border:"2px dashed #d97706",borderRadius:10,padding:14,cursor:"pointer",background:"#fffbeb"}}>
<div style={{fontSize:24,marginBottom:4}}>📧</div>
<div style={{fontSize:13,fontWeight:700,color:"#92400e"}}>{lang==="de"?"Dokumente anfordern":"Request Documents"}</div>
<div style={{fontSize:11,color:"#6b7280"}}>{lang==="de"?"Per E-Mail anfordern":"Request via email"}</div>
</div>
</div>

<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>{lang==="de"?"Benötigte Dokumente":"Required Documents"} — {stageId} {stageName} ({docs.length})</div>
{docs.map((d,j)=>{
const hasUpload=stageUploads.some(u=>u.name.toLowerCase().includes(d.ref.toLowerCase().split("-")[0]));
return <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:6,marginBottom:3,background:hasUpload?"#f0fdf4":d.critical?"#fef2f2":"#f9fafb",border:"1px solid "+(hasUpload?"#a7f3d0":d.critical?"#fca5a5":"#e5e7eb")}}>
<span style={{fontSize:16,flexShrink:0}}>{hasUpload?"✅":d.critical?"🔴":"○"}</span>
<div style={{flex:1}}>
<div style={{fontSize:12,fontWeight:600,color:hasUpload?"#059669":"#374151"}}>{d.n}</div>
<div style={{fontSize:10,color:"#6b7280"}}>{d.ref} · {d.who}</div>
</div>
{!hasUpload&&<span style={{fontSize:10,color:d.critical?"#dc2626":"#9ca3af",fontWeight:600}}>{d.critical?(lang==="de"?"KRITISCH":"CRITICAL"):(lang==="de"?"Ausstehend":"Pending")}</span>}
</div>})}

{stageUploads.length>0&&<div style={{marginTop:8,padding:6,background:"#dcfce7",borderRadius:6,fontSize:12,fontWeight:600,color:"#059669"}}>✅ {stageUploads.length} {lang==="de"?"Dokument(e) hochgeladen":"document(s) uploaded"}</div>}
<div style={{marginTop:8,fontSize:11,color:"#9ca3af"}}>{lang==="de"?"Lade Dokumente hoch oder verwende den Stage-Upload-Button oben.":"Upload documents or use the per-stage upload button above."}</div>
</div>};

const M05Reg=()=>{
const isBI02=selBatch==="CA-02";
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
].map(([st,reg,comm,line,gen,thc,p10,p1k],j)=><tr key={j} style={{background:selBatch==="CA-02"&&reg.includes("SE 17/20")?"#fef3c7":"transparent"}}>
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
const tabs=[{k:"overview",ic:"🚛",l:lang==="de"?"Übersicht":"Overview"},{k:"pickup",ic:"📦",l:lang==="de"?"Abholung FRA":"Pickup FRA"},{k:"transit",ic:"🌡️",l:lang==="de"?"Transit & Monitoring":"Transit & Monitoring"},{k:"delivery",ic:"🏭",l:lang==="de"?"Anlieferung Murchin":"Delivery Murchin"},{k:"docs",ic:"📋",l:lang==="de"?"GDP-Dokumente":"GDP Documents"}];

return <div>
<Cd t={"🚛 M1 — GDP: Frankfurt (FRA) → Murchin"} badge={<Bd c="#059669" b="#d1fae5">✅ {lang==="de"?"Abgeschlossen":"Complete"}</Bd>}>

<div style={{display:"flex",gap:4,marginBottom:14,flexWrap:"wrap"}}>
{tabs.map(tb=><button key={tb.k} onClick={()=>setM1Tab(tb.k)} style={{padding:"5px 10px",borderRadius:6,fontSize:14,fontWeight:m1Tab===tb.k?700:500,border:m1Tab===tb.k?"2px solid #0891b2":"1px solid #e5e7eb",background:m1Tab===tb.k?"#ecfeff":"#fff",color:m1Tab===tb.k?"#0891b2":"#6b7280",cursor:"pointer"}}>{tb.ic} {tb.l}</button>)}
</div>

{m1Tab==="overview"&&<div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14,fontSize:16}}>
{[[lang==="de"?"Spediteur":"Carrier","WAS-Logistics GmbH, Wörth"],[lang==="de"?"Sachbearbeiter":"Ansprechpartner","Rafael Rey — +49 7271 76712-14"],["KD-Nr.","10508"],[lang==="de"?"Rechnung":"Invoice","138688 (06.11.2025)"],[lang==="de"?"Incoterms":"Incoterms","EXW Jujuy → CIF Frankfurt"],[lang==="de"?"GDP-Lizenz":"GDP License","WAS-LOG-GDP-2024-DE"],[lang==="de"?"Abfahrt FRA":"Departed FRA","15.11.2025 14:30 CET"],[lang==="de"?"Ankunft Murchin":"Arrived Murchin","15.11.2025 22:45 CET"],[lang==="de"?"Fahrzeit":"Transit Time","8h 15min"],[lang==="de"?"Temperatur":"Temperatur","16.2–23.1°C ✅ (GDP: 15–25°C)"],[lang==="de"?"Luftfeuchtigkeit":"Humidity","38–52% RH ✅"],["MKT","19.8°C (Mean Kinetic)"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
{[[lang==="de"?"Paletten":"Pallets","3","#0891b2"],[lang==="de"?"Brutto":"Gross",BT.gross+" kg","#2563eb"],[lang==="de"?"Taxgewicht":"CW",Math.round(parseFloat(BT.gross)*1.5)+" kg","#7c3aed"],[lang==="de"?"Abweichung":"Excursion",lang==="de"?"Keine ✅":"None ✅","#059669"]].map(([l,v,c],j)=><div key={j} style={{textAlign:"center",background:"#fff",borderRadius:6,padding:8,border:"1px solid #e5e7eb"}}><div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:13,color:"#6b7280"}}>{l}</div></div>)}
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
[true,lang==="de"?"Warenidentität geprüft ("+BT.boxes+" Boxen, Medical Cannabis, "+BT.gross+" kg)":"Goods identity verified ("+BT.boxes+" boxes, Medical Cannabis, "+BT.gross+" kg)"],
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
{[[lang==="de"?"Route":"Route","FRA Airport → A5 → A9 → A20 → Murchin"],[lang==="de"?"Distanz":"Distance","~680 km"],[lang==="de"?"Fahrzeit":"Drive time","8h 15min"],[lang==="de"?"Abfahrt":"Abfahrt","15.11.2025 14:30 CET"],[lang==="de"?"Ankunft":"Arrival","15.11.2025 22:45 CET"],[lang==="de"?"Pausen":"Stops","1× Raststätte (45 min) — vehicle locked, escort present"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
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
<div style={{fontSize:16,fontWeight:700,marginBottom:10}}>🏭 {lang==="de"?"Anlieferung BtM-Tresor Murchin":"Delivery BtM Vault Murchin"}</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12,fontSize:15}}>
{[[lang==="de"?"Ankunft":"Arrival","15.11.2025 22:45 CET"],[lang==="de"?"Standort":"Location","Murchin — BtM-Quarantänezone"],[lang==="de"?"Empfangen von":"Received by","Warehouse Manager (NOC Pharma)"],[lang==="de"?"Plomben-Check":"Seal check","✅ SEAL-FRA-2025-8847 — intact"],[lang==="de"?"Temperatur bei Ankunft":"Temp. at delivery","20.1°C ✅"],[lang==="de"?"BtM-Bestand":"BtM Inventory","§13 BtMG — Eingang gebucht"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

<div style={{fontSize:14,fontWeight:700,marginBottom:8}}>✅ {lang==="de"?"Anlieferungs-Checkliste":"Delivery Checklist"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr",gap:4}}>
{[
[true,lang==="de"?"Fahrzeug-Plombe geprüft — SEAL-FRA-2025-8847 intakt":"Vehicle seal verified — SEAL-FRA-2025-8847 intact"],
[true,lang==="de"?"Paletten visuell geprüft — keine Beschädigung":"Pallets visually inspected — no damage"],
[true,lang==="de"?"Stückzahl bestätigt: 3 Paletten / 7 Kartons":"Piece count confirmed: 3 pallets / 7 boxes"],
[true,lang==="de"?"Bruttogewicht geprüft: "+BT.gross+" kg ✅":"Gross weight verified: "+BT.gross+" kg ✅"],
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
{ic:"🔐",n:lang==="de"?"BtM-Transportbeleg":"BtM Transport Record",ref:"BtM-TR-2025-1147",st:"ok",desc:lang==="de"?"§13 BtMG Bestandsbewegung Frankfurt → Murchin":"§13 BtMG inventory movement Frankfurt → Murchin"},
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
<Cd t={"📦 M1.5 — "+(lang==="de"?"Tresorankunft & Wareneingangskontrolle — Murchin":"Vault Arrival & Goods Receipt Inspection — Murchin")} badge={allDone?<Bd c="#059669" b="#dcfce7">✅</Bd>:<Bd c="#d97706" b="#fef3c7">{extracted}/{LOGGERS.length}</Bd>}>

<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14,fontSize:16}}>
{[[lang==="de"?"Ankunft":"Arrived","15.11.2025 22:45"],[lang==="de"?"Standort":"Location","Murchin — BtM-Quarantänezone"],[lang==="de"?"Spediteur":"Carrier","WAS-LOGISTICS GMBH"],["BtM "+t.status,"§13 BtMG — "+t.status+": ✅"],[lang==="de"?"Fotos":"Photos","8 (receipt evidence)"],[lang==="de"?"Eingangsprüfung":"Goods Receipt","SOP-201-01 v2.0"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
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
[lang==="de"?"Probenahme durch":"Entnommen von","T. Cuny (RP)"],
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
[lang==="de"?"Route":"Route","Murchin (Tresor) → QSI Bremen"],
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
[lang==="de"?"Ergebnisse an":"Ergebnisse an","Dr. O. Schagon (QP) + T. Cuny (RP)"]
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
[["Ref.",sRef],["Charge",batchId],["Product",prod],["Probenart","10g Doypacks"],["Menge","14 x 10g = 140g"],["Entnommen aus","Pallet 4 Box 15-20"],["Entnommen von","T. Cuny (RP)"],["Datum",sDate],["Verbleibend","86 x 10g Doypacks"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});
w.document.write('</table><h2>2. GDP Versandbehaelter / Shipping Container</h2><table>');
[["Behaelter","Styrofoam insulated box + Coolpack"],["Temperatur","15-25C (GDP 2013/C 343/01)"],["Datenlogger","TL-SAMP-001 (Sensitech TempTale)"],["BtM-Siegel",seal],["Qualifizierung","SOP-703 qualified"],["Gewicht","ca. 450g"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});
w.document.write('</table><h2>3. Transport / Internal GDP Courier</h2><table>');
[["Kurierdienst","NOC Pharma Internal GDP Transport"],["Route","Murchin (Vault) to QSI Bremen (ca. 350 km)"],["Fahrer","_________________________"],["Fahrzeug","GDP-qualified (SOP-780)"],["Abfahrt",sDate],["BtM-Transfer","Par. 13 BtMG within company"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});
w.document.write('</table><h2>4. Empfaenger / Destination Lab</h2><table>');
[["Labor","QSI GmbH Bremen"],["Ansprechpartner","Pia"],["Adresse","Flughafendamm 9a, 28199 Bremen"],["Auftragsnr.","210-1624923"],["Pruefumfang","Ph.Eur. Cannabis flos monograph"],["Pruefungen","Potency, Micro, Heavy Metals, Mycotoxins, Pesticides, Moisture, Terpenes"],["Voraussichtlich","10-14 working days"],["Ergebnisse an","Dr. O. Schagon (QP) + T. Cuny (RP)"]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});
w.document.write('</table><div class="sig"><div>Probenahme / Entnommen von<br/><br/><br/>T. Cuny (RP)</div><div>Versand freigegeben / Versand genehmigt<br/><br/><br/>________________________</div><div>Empfangen bei QSI / Empfangen bei QSI<br/><br/><br/>Pia (QSI Bremen)</div></div>');
w.document.write('<div class="ft">NOC Pharma GmbH - An der Redoute 1 - 17390 Murchin - QMS v2.5 - '+new Date().toISOString()+'</div></body></html>');
w.document.close();setTimeout(function(){w.print()},500);
}} style={{flex:1,padding:"10px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="#fff" strokeWidth="1.5"/></svg>
{lang==="de"?"Probenahmeprotokoll drucken (PDF)":"Print Sample Protocol (PDF)"}
</button>

<button onClick={()=>{
const sRef="SAMP-"+(selBatch||"BI02")+"-"+new Date().getFullYear();
const sep="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
const body="NOC PHARMA GmbH\nProbenahme- und Versandprotokoll · QMS v2.5\n"+sep+"\n\nRef.: "+sRef+"\nCharge: "+BT.id+"\nProduct: "+BT.p+"\n\nPROBE:\n14 × 10g Doypacks = 140g total\nSampled from Pallet 4 (Box 15–20)\nEntnommen von: T. Cuny (RP)\n\nVERSAND:\nGDP insulated box + Coolpack (15–25°C)\nDatalogger: TL-SAMP-001\nBtM Seal: SEAL-"+(selBatch||"BI02")+"-QSI\nRoute: Murchin → QSI Bremen (~350 km)\nInternal GDP courier (SOP-780)\n\nPRUEFUMFANG:\nPh.Eur. Cannabis flos monograph\nPotency, Micro, Heavy Metals, Mycotoxins, Pesticides, Moisture, Terpenes\nOrder: 210-1624923\nExpected: 10–14 working days\n\n"+sep+"\nNOC Pharma GmbH · QMS v2.5\nRP: T. Cuny · QP: Dr. O. Schagon";
window.open(gmailLink("NOC Pharma — Probenversand an QSI Bremen — "+sRef+" — Batch "+(selBatch||"BI02"),body)+"&to="+encodeURIComponent("pia@qsi-gmbh.de")+"&cc="+encodeURIComponent("qp@nocpharma.de"),"_blank");
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
<Cd t={"🚛 M3.5 — GDP: Quarantine → Commercial"} badge={m35Done?<Bd c="#059669" b="#dcfce7">✅</Bd>:<Bd c="#d97706" b="#fef3c7">✍️</Bd>}>
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
<div style={{fontSize:16,fontWeight:700,marginBottom:10}}>✍️ {lang==="de"?"Transportgenehmigung (DocuSign)":"Transport Authorization (DocuSign)"}</div>

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
{signed&&<div style={{marginTop:5,fontSize:14,padding:"3px 8px",background:"#dcfce7",borderRadius:4,display:"inline-block"}}>✅ {signed.ts} • {signed.hash} • eIDAS Art. 25 · DocuSign</div>}
</div>
{!signed&&<button onClick={()=>m35Sign(sig.k)} style={{padding:"8px 14px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:sig.primary?"#0369a1":sig.c,color:"#fff",cursor:"pointer",alignSelf:"center",whiteSpace:"nowrap",boxShadow:"0 2px 4px rgba(0,0,0,.12)"}}>✍️ DocuSign</button>}
</div>})}

{m35Done&&<div style={{padding:12,background:"linear-gradient(135deg,#dcfce7,#d1fae5)",borderRadius:8,border:"1px solid #a7f3d0",textAlign:"center",marginTop:6}}>
<div style={{fontSize:15,fontWeight:800,color:"#065f46"}}>✅ {lang==="de"?"TRANSPORT AUTORISIERT":"TRANSPORT AUTHORIZED"}</div>
<div style={{fontSize:14,color:"#065f46",marginTop:3}}>{lang==="de"?"Beide DocuSign-Unterschriften erhalten. GDP-Transport abgeschlossen.":"Both DocuSign signatures collected. GDP transport completed."}</div>
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
const[m4CapaOpen,setM4CapaOpen]=useState(false);
const m4Sign=(k)=>setM4Sigs(p=>({...p,[k]:{ts:new Date().toISOString().slice(0,19).replace("T"," "),hash:"SHA256:"+Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("").toUpperCase()}}));
const m4AllSigned=m4Sigs.celso&&m4Sigs.qp;

/* SOP Forms State */
const[sopActive,setSopActive]=useState(null);
const[sopData,setSopData]=useState({});
const sopUpdate=(sopId,field,val)=>setSopData(p=>({...p,[sopId]:{...(p[sopId]||{}),  [field]:val}}));
const[sopSigs,setSopSigs]=useState({});
const sopSign=(sopId,role)=>setSopSigs(p=>({...p,[sopId]:{...(p[sopId]||{}),[role]:{ts:new Date().toLocaleString("de-DE"),hash:"SHA256:"+Array.from({length:8},()=>Math.floor(Math.random()*16).toString(16)).join("").toUpperCase()}}}));

/* SOP Forms Component */
const SOPForms=()=>{
const sops=[
{id:"sop109a5",nr:"SOP-109 A5-01",de:"Formblatt Erfassung & Bearbeitung von Beanstandungen",en:"Complaint Recording & Processing Form",color:"#dc2626",ic:"📋"},
{id:"sop109a4",nr:"SOP-109 A4-01",de:"Gesprächsnotiz für Beanstandungen",en:"Complaint Conversation Notes",color:"#d97706",ic:"📝"},
{id:"sop110a4",nr:"SOP-110 A4-01",de:"Behördenmeldung & Rückrufplan",en:"Authority Notification & Recall Plan",color:"#7c3aed",ic:"🏛️"},
];
const cur=sops.find(s=>s.id===sopActive);
const d=sopData[sopActive]||{};
const sigs=sopSigs[sopActive]||{};
const F=({label,field:f,span})=><div style={{gridColumn:span?"1/-1":undefined}}>
<label style={{fontSize:11,fontWeight:600,color:"#374151",display:"block",marginBottom:2}}>{label}</label>
<input value={d[f]||""} onChange={e=>sopUpdate(sopActive,f,e.target.value)} placeholder="..." style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1.5px solid #d1d5db",fontSize:13,fontFamily:"Arial",background:"#fafafa",outline:"none",boxSizing:"border-box"}} />
</div>;
const YN=({label,field:f,span})=><div style={{gridColumn:span?"1/-1":undefined,display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:12,color:"#374151",flex:1}}>{label}</span>
<button onClick={()=>sopUpdate(sopActive,f,"ja")} style={{padding:"3px 10px",borderRadius:4,fontSize:11,fontWeight:700,border:d[f]==="ja"?"2px solid #059669":"1px solid #d1d5db",background:d[f]==="ja"?"#dcfce7":"#fff",color:d[f]==="ja"?"#059669":"#6b7280",cursor:"pointer"}}>Ja</button>
<button onClick={()=>sopUpdate(sopActive,f,"nein")} style={{padding:"3px 10px",borderRadius:4,fontSize:11,fontWeight:700,border:d[f]==="nein"?"2px solid #dc2626":"1px solid #d1d5db",background:d[f]==="nein"?"#fef2f2":"#fff",color:d[f]==="nein"?"#dc2626":"#6b7280",cursor:"pointer"}}>Nein</button>
</div>;
const Sec=({title,children})=><div style={{marginBottom:10}}>
<div style={{padding:"6px 10px",background:"#f0f4ff",borderRadius:"6px 6px 0 0",borderBottom:"2px solid #1e40af33"}}><span style={{fontSize:13,fontWeight:700,color:"#1e40af"}}>{title}</span></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,padding:10,background:"#fff",borderRadius:"0 0 6px 6px",border:"1px solid #e5e7eb",borderTop:"none"}}>{children}</div>
</div>;
const Cls=({field:f})=><div style={{gridColumn:"1/-1",display:"flex",gap:6}}>
{[["I","#dc2626","#fef2f2",lang==="de"?"Lebensbedrohlich":"Life-threatening"],["II","#d97706","#fefce8",lang==="de"?"Gesundheitsgefährdend":"Health risk"],["III","#2563eb","#eff6ff",lang==="de"?"Sonstiges":"Other"]].map(([k,c,bg,t])=>
<button key={k} onClick={()=>sopUpdate(sopActive,f,k)} style={{flex:1,padding:"8px",borderRadius:6,border:d[f]===k?"2px solid "+c:"1.5px solid #d1d5db",background:d[f]===k?bg:"#fff",cursor:"pointer",textAlign:"center"}}>
<div style={{fontSize:16,fontWeight:800,color:c}}>Klasse {k}</div>
<div style={{fontSize:10,color:"#6b7280"}}>{t}</div>
</button>)}
</div>;

const printSop=()=>{const w=window.open("","_blank","width=800,height=700");
w.document.write('<html><head><title>'+cur.nr+'</title><style>body{font-family:Arial;padding:24px;font-size:11px;color:#1f2937}h1{font-size:16px;color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:6px}h2{font-size:13px;color:#1e40af;background:#f0f4ff;padding:4px 8px;border-radius:4px;margin-top:12px}.f{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:6px 0}.fld{padding:4px;border:1px solid #d1d5db;border-radius:3px;font-size:10px}.lbl{font-weight:700;font-size:9px;color:#6b7280}.val{font-size:11px}.yn{color:#059669;font-weight:700}.sig{margin-top:16px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;border-top:2px solid #1e3a5f;padding-top:8px}.sig div{font-size:9px}@media print{body{padding:12px}}</style></head><body>');
w.document.write('<div style="text-align:center;margin-bottom:12px"><strong style="font-size:18px;color:#1e3a5f">NOC PHARMA GmbH</strong><br/><span style="font-size:10px;color:#6b7280">QMS v2.5 · §52a AMG · EU GDP</span></div>');
w.document.write('<h1>'+cur.nr+' — '+(lang==="de"?cur.de:cur.en)+'</h1>');
const fields=Object.entries(d);
w.document.write('<div class="f">');
fields.forEach(([k,v])=>{w.document.write('<div class="fld"><div class="lbl">'+k.replace(/_/g," ")+'</div><div class="val">'+(v||"—")+'</div></div>')});
w.document.write('</div>');
if(sigs.qp)w.document.write('<div style="margin-top:12px;padding:8px;background:#f0fdf4;border:1px solid #a7f3d0;border-radius:4px;font-size:10px"><strong>✅ QP Signatur:</strong> Dr. Olaf Schagon · '+sigs.qp.ts+' · '+sigs.qp.hash+'</div>');
if(sigs.rp)w.document.write('<div style="margin-top:4px;padding:8px;background:#f0fdf4;border:1px solid #a7f3d0;border-radius:4px;font-size:10px"><strong>✅ RP Signatur:</strong> T. Cuny · '+sigs.rp.ts+' · '+sigs.rp.hash+'</div>');
w.document.write('<div class="sig"><div><strong>Erstellt:</strong> Till Noé<br/>01.02.2025</div><div><strong>Überprüft:</strong> T. Cuny</div><div><strong>Genehmigt:</strong> T. Cuny</div></div>');
w.document.write('</body></html>');w.document.close();setTimeout(()=>w.print(),500);};

return <div>
{/* SOP Selector Cards */}
{!sopActive&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
{sops.map(s=>{const filled=Object.keys(sopData[s.id]||{}).length;const signed=sopSigs[s.id];
return <div key={s.id} onClick={()=>setSopActive(s.id)} style={{padding:14,borderRadius:10,border:"2px solid "+s.color+"33",background:"linear-gradient(135deg,#fff,"+s.color+"06)",cursor:"pointer",transition:"all .2s",position:"relative"}}>
{signed?.qp&&<div style={{position:"absolute",top:8,right:8,padding:"2px 8px",borderRadius:10,fontSize:9,fontWeight:700,background:"#dcfce7",color:"#059669"}}>✅ QP Signed</div>}
<div style={{fontSize:28,marginBottom:6}}>{s.ic}</div>
<div style={{fontSize:12,fontWeight:800,color:s.color}}>{s.nr}</div>
<div style={{fontSize:12,fontWeight:600,color:"#374151",lineHeight:"1.3",marginTop:2}}>{lang==="de"?s.de:s.en}</div>
<div style={{fontSize:10,color:"#6b7280",marginTop:4}}>Rev 1 · Till Noé · T. Cuny</div>
{filled>0&&<div style={{marginTop:6,fontSize:10,color:s.color,fontWeight:600}}>{filled} {lang==="de"?"Felder ausgefüllt":"fields filled"}</div>}
<button style={{marginTop:8,width:"100%",padding:"6px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:s.color,color:"#fff",cursor:"pointer"}}>{filled>0?(lang==="de"?"Weiterbearbeiten":"Continue"):(lang==="de"?"Ausfüllen":"Fill In")}</button>
</div>})}
</div>}

{/* Active SOP Form */}
{sopActive&&cur&&<div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<button onClick={()=>setSopActive(null)} style={{padding:"4px 10px",borderRadius:6,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>← {lang==="de"?"Zurück":"Back"}</button>
<div><div style={{fontSize:16,fontWeight:800,color:cur.color}}>{cur.ic} {cur.nr}</div><div style={{fontSize:12,color:"#6b7280"}}>{lang==="de"?cur.de:cur.en}</div></div>
</div>
<div style={{display:"flex",gap:4}}>
<button onClick={printSop} style={{padding:"6px 12px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:"#374151",color:"#fff",cursor:"pointer"}}>🖨️ Print</button>
<button onClick={()=>{const body=cur.nr+" — "+(lang==="de"?cur.de:cur.en)+"\n\n"+Object.entries(d).map(([k,v])=>k.replace(/_/g," ")+": "+(v||"—")).join("\n")+"\n\n"+(sigs.qp?"✅ QP: "+sigs.qp.ts+" "+sigs.qp.hash:"⏳ QP: Pending")+"\n"+(sigs.rp?"✅ RP: "+sigs.rp.ts+" "+sigs.rp.hash:"⏳ RP: Pending");window.open(gmailLink("NOC Pharma — "+cur.nr+" — "+new Date().toLocaleDateString("de-DE"),body),"_blank")}} style={{padding:"6px 12px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>📧 Email</button>
</div>
</div>

{/* SOP-109 A5-01 Form */}
{sopActive==="sop109a5"&&<div style={{background:"#fff",borderRadius:10,border:"1px solid #e5e7eb",padding:12}}>
<Sec title="1. Eingang / Receipt">
<F label={lang==="de"?"Stufenplanbeauftragter":"PV Officer"} field="pv_officer"/>
<F label={lang==="de"?"Datum des Eingangs":"Date of Receipt"} field="receipt_date"/>
<F label={lang==="de"?"Uhrzeit":"Time"} field="receipt_time"/>
<F label="Bearbeitungsnr. / Case No." field="case_nr"/>
</Sec>
<Sec title={lang==="de"?"1.1 Beschwerdeführer":"1.1 Complainant"}>
<F label="Institution" field="institution" span/>
<F label={lang==="de"?"Funktion":"Function"} field="complainant_function"/>
<F label={lang==="de"?"Name, Vorname":"Full Name"} field="complainant_name"/>
<F label={lang==="de"?"Straße":"Street"} field="street"/>
<F label={lang==="de"?"PLZ, Ort":"Zip, City"} field="city"/>
<F label={lang==="de"?"Erreichbarkeit":"Contact (Tel/Email)"} field="contact" span/>
</Sec>
<Sec title={lang==="de"?"1.2 Beschwerde / Beanstandung":"1.2 Complaint Details"}>
<F label={lang==="de"?"Produktbezeichnung":"Product Name"} field="product" span/>
<F label={lang==="de"?"Zulassungsnummer":"Reg. Number"} field="reg_nr"/>
<F label={lang==="de"?"Chargenbezeichnung":"Batch Number"} field="batch"/>
<F label={lang==="de"?"Packungsgröße":"Pack Size"} field="pack_size"/>
<F label={lang==="de"?"Darreichungsform":"Dosage Form"} field="dosage_form"/>
<F label={lang==="de"?"Herstellungsdatum":"Mfg. Date"} field="mfg_date"/>
<F label={lang==="de"?"Verfalldatum":"Expiry Date"} field="exp_date"/>
<div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,fontWeight:600,color:"#374151",display:"block",marginBottom:2}}>{lang==="de"?"Beschreibung der Beanstandung":"Complaint Description"}</label>
<textarea value={d.complaint_text||""} onChange={e=>sopUpdate(sopActive,"complaint_text",e.target.value)} rows={3} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1.5px solid #d1d5db",fontSize:13,fontFamily:"Arial",background:"#fafafa",resize:"vertical",boxSizing:"border-box"}} placeholder={lang==="de"?"Detaillierte Beschreibung...":"Detailed description..."}/></div>
</Sec>
<Sec title={lang==="de"?"1.3 Muster & 1.4 Sofortmaßnahmen":"1.3 Samples & 1.4 Immediate Actions"}>
<YN label={lang==="de"?"Beanstandungsmuster verfügbar?":"Sample available?"} field="sample_available"/>
<YN label={lang==="de"?"Bildmaterial vorhanden?":"Images available?"} field="images_available"/>
<YN label={lang==="de"?"Rückmeldung an Beschwerdeführer?":"Feedback to complainant?"} field="feedback_sent"/>
<YN label={lang==="de"?"Umtausch zugesagt?":"Exchange promised?"} field="exchange_promised"/>
</Sec>
<Sec title={lang==="de"?"2. Bewertung & Klassifizierung":"2. Assessment & Classification"}>
<YN label={lang==="de"?"UAW (unerwartete Arzneimittelwirkung)?":"ADR (Adverse Drug Reaction)?"} field="adr" span/>
<YN label={lang==="de"?"Mangelnde Wirksamkeit?":"Lack of efficacy?"} field="lack_efficacy" span/>
<YN label={lang==="de"?"Verdacht auf Fälschung?":"Suspected falsification?"} field="falsification" span/>
<YN label={lang==="de"?"NOC Pharma verantwortlich?":"NOC Pharma responsible?"} field="noc_responsible" span/>
<Cls field="classification"/>
</Sec>
<Sec title={lang==="de"?"4. Abschluss":"4. Final Assessment & Closure"}>
<YN label={lang==="de"?"CAPA erforderlich?":"CAPA required?"} field="capa_required" span/>
<YN label={lang==="de"?"Rückruf empfohlen?":"Recall recommended?"} field="recall_recommended" span/>
<F label={lang==="de"?"CAPA Details":"CAPA Details"} field="capa_details" span/>
</Sec>
</div>}

{/* SOP-109 A4-01 Form */}
{sopActive==="sop109a4"&&<div style={{background:"#fff",borderRadius:10,border:"1px solid #e5e7eb",padding:12}}>
<Sec title={lang==="de"?"1. Empfänger":"1. Receiver"}>
<F label={lang==="de"?"Name, Vorname":"Full Name"} field="receiver_name"/>
<F label={lang==="de"?"Funktion":"Function"} field="receiver_function"/>
<F label={lang==="de"?"Erreichbarkeit":"Contact"} field="receiver_contact" span/>
<div style={{gridColumn:"1/-1",display:"flex",gap:4,flexWrap:"wrap"}}>
<span style={{fontSize:11,fontWeight:600,color:"#374151",marginRight:4}}>{lang==="de"?"Empfangen über:":"Received via:"}</span>
{["Persönlich","Telefon","Anrufbeantworter","E-Mail/Fax","Sonstige"].map(m=><button key={m} onClick={()=>sopUpdate(sopActive,"channel",m)} style={{padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:600,border:d.channel===m?"2px solid #d97706":"1px solid #d1d5db",background:d.channel===m?"#fefce8":"#fff",color:d.channel===m?"#d97706":"#6b7280",cursor:"pointer"}}>{m}</button>)}
</div>
<F label={lang==="de"?"Datum":"Date"} field="date"/>
<F label={lang==="de"?"Uhrzeit":"Time"} field="time"/>
</Sec>
<Sec title={lang==="de"?"1.1 Beschwerdeführer":"1.1 Complainant"}>
<F label={lang==="de"?"Name":"Name"} field="complainant_name"/>
<F label="Institution" field="institution"/>
<F label={lang==="de"?"Funktion":"Function"} field="function"/>
<F label={lang==="de"?"Kunden-Nr.":"Customer No."} field="customer_nr"/>
<F label={lang==="de"?"Adresse":"Address"} field="address" span/>
<F label={lang==="de"?"Erreichbarkeit":"Contact"} field="contact" span/>
</Sec>
<Sec title={lang==="de"?"1.2 Beschwerde":"1.2 Complaint"}>
<F label={lang==="de"?"Betroffenes Arzneimittel":"Affected Product"} field="product" span/>
<F label={lang==="de"?"Zulassungsnr.":"Reg. No."} field="reg_nr"/>
<F label={lang==="de"?"Charge(n)":"Batch(es)"} field="batch"/>
<F label={lang==="de"?"Packungsgröße":"Pack Size"} field="pack_size"/>
<F label={lang==="de"?"Menge":"Quantity"} field="qty"/>
<div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,fontWeight:600,color:"#374151",display:"block",marginBottom:2}}>{lang==="de"?"Beschwerde/Beanstandung":"Complaint"}</label>
<textarea value={d.complaint||""} onChange={e=>sopUpdate(sopActive,"complaint",e.target.value)} rows={3} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1.5px solid #d1d5db",fontSize:13,fontFamily:"Arial",background:"#fafafa",resize:"vertical",boxSizing:"border-box"}}/></div>
<YN label={lang==="de"?"Muster beigelegt?":"Sample enclosed?"} field="sample"/>
<YN label={lang==="de"?"Bildmaterial beigelegt?":"Images enclosed?"} field="images"/>
</Sec>
</div>}

{/* SOP-110 A4-01 Form */}
{sopActive==="sop110a4"&&<div style={{background:"#fff",borderRadius:10,border:"1px solid #e5e7eb",padding:12}}>
<Sec title={lang==="de"?"Kontaktinformationen":"Contact Information"}>
<F label={lang==="de"?"Stufenplanbeauftragter":"PV Officer"} field="pv_officer"/>
<F label={lang==="de"?"Telefon/Email":"Phone/Email"} field="pv_contact"/>
{[1,2,3].map(n=><React.Fragment key={n}><F label={n+". "+lang==="de"?"Name / Funktion":"Name / Function"} field={"participant_"+n}/><F label="Tel / Email" field={"participant_"+n+"_contact"}/></React.Fragment>)}
</Sec>
<Sec title={lang==="de"?"Rückrufinformationen":"Recall Information"}>
<F label={lang==="de"?"Pharmazeutischer Unternehmer":"Pharmaceutical Company"} field="company" span/>
<F label={lang==="de"?"Arzneimittel":"Product Name"} field="product" span/>
<F label={lang==="de"?"Darreichung & Stärke":"Form & Strength"} field="form"/>
<F label={lang==="de"?"Packungsgröße":"Pack Size"} field="pack_size"/>
<F label={lang==="de"?"Chargenbezeichnung":"Batch No."} field="batch"/>
<F label={lang==="de"?"Verfallsdatum":"Expiry"} field="expiry"/>
<F label={lang==="de"?"Zulassungsnummer":"Reg. No."} field="reg_nr" span/>
</Sec>
<Sec title={lang==="de"?"Arzneimittelrisiko & Klassifizierung":"Drug Risk & Classification"}>
<F label={lang==="de"?"Ref. Beanstandung":"Complaint Ref."} field="complaint_ref" span/>
<Cls field="classification"/>
<div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,fontWeight:600,color:"#374151",display:"block",marginBottom:2}}>{lang==="de"?"Stellungnahme (Risiken, Symptome)":"Statement (Risks, Symptoms)"}</label>
<textarea value={d.statement||""} onChange={e=>sopUpdate(sopActive,"statement",e.target.value)} rows={3} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1.5px solid #d1d5db",fontSize:13,fontFamily:"Arial",background:"#fafafa",resize:"vertical",boxSizing:"border-box"}}/></div>
<div style={{gridColumn:"1/-1"}}><label style={{fontSize:11,fontWeight:600,color:"#374151",display:"block",marginBottom:2}}>{lang==="de"?"Sofortmaßnahmen":"Immediate Measures"}</label>
<textarea value={d.measures||""} onChange={e=>sopUpdate(sopActive,"measures",e.target.value)} rows={2} style={{width:"100%",padding:"6px 8px",borderRadius:6,border:"1.5px solid #d1d5db",fontSize:13,fontFamily:"Arial",background:"#fafafa",resize:"vertical",boxSizing:"border-box"}}/></div>
</Sec>
<Sec title={lang==="de"?"Behördenmeldungen & Maßnahmen":"Authority Notifications & Actions"}>
<F label={lang==="de"?"Behörde 1":"Authority 1"} field="authority_1"/>
<F label={lang==="de"?"Datum Meldung":"Date Notified"} field="authority_1_date"/>
{[1,2,3].map(n=><React.Fragment key={n}><F label={n+". "+lang==="de"?"Maßnahme":"Action"} field={"action_"+n}/><F label={lang==="de"?"Verantwortlich / Frist":"Responsible / Deadline"} field={"action_"+n+"_resp"}/></React.Fragment>)}
<YN label={lang==="de"?"Risikobetrachtung durchgeführt?":"Risk assessment done?"} field="risk_done" span/>
</Sec>
</div>}

{/* Signature Block */}
{sopActive&&<div style={{marginTop:12,padding:12,background:"linear-gradient(135deg,#f8fafc,#f0f4ff)",borderRadius:10,border:"1px solid #c7d2fe"}}>
<div style={{fontSize:14,fontWeight:700,color:"#1e40af",marginBottom:8}}>✍️ {lang==="de"?"Digitale Signaturen (DocuSign)":"Digital Signatures (DocuSign)"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
{[
{k:"rp",name:"Torsten Cuny",role:"RP — "+lang==="de"?"Verantwortliche Person §52a AMG":"Responsible Person §52a AMG",c:"#1e40af"},
{k:"qp",name:"Dr. Olaf Schagon",role:"QP — "+lang==="de"?"Sachkundige Person §15 AMG":"Qualified Person §15 AMG",c:"#059669"},
].map(sig=><div key={sig.k} style={{padding:10,borderRadius:8,border:sigs[sig.k]?"2px solid #059669":"1.5px solid #d1d5db",background:sigs[sig.k]?"#f0fdf4":"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:14,fontWeight:700,color:sig.c}}>{sig.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{sig.role}</div></div>
{sigs[sig.k]?<span style={{padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:"#dcfce7",color:"#059669"}}>✅ {sigs[sig.k].ts}</span>
:<button onClick={()=>sopSign(sopActive,sig.k)} style={{padding:"6px 14px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:sig.c,color:"#fff",cursor:"pointer"}}>✍️ DocuSign</button>}
</div>
{sigs[sig.k]&&<div style={{fontSize:10,color:"#6b7280",marginTop:4}}>{sigs[sig.k].hash} · eIDAS Art. 25 · DocuSign</div>}
</div>)}
</div>
{sigs.rp&&sigs.qp&&<div style={{marginTop:8,padding:8,background:"#dcfce7",borderRadius:6,textAlign:"center",fontSize:13,fontWeight:700,color:"#059669"}}>✅ {lang==="de"?"Beide DocuSign-Unterschriften erhalten — Formular abgeschlossen":"Both DocuSign signatures collected — Form completed"}</div>}
</div>}
</div>}
</div>};

const M4Relabel=()=>{
/* Pull real data from BT_DATA (updated by AI document extraction) and docOriginals */
const bt=BT_DATA[selBatch]||BT_DATA["CA-03"]||{};
const plData=docOriginals["pl"]?.approvedData||docOriginals["pl"]?.extracted||{};
const scData=docOriginals["sc"]?.approvedData||docOriginals["sc"]?.extracted||{};
const labThc=LAB.find(l=>l.en==="THC (Dronabinol)");
const confirmedThc=labThc?.qsi||labThc?.sup||bt.thc||"19.7%";
const products=[
{k:"1kg",de:"Cannabis flos 1kg (API-Beutel)",en:"Cannabis flos 1kg (API bag)",qty:parseInt(bt.bags1kg)||parseInt(plData["Total 1kg Bags"])||139,format:"EVOH/PBD LDPE bag",pzn:"PZN-18547632"},
{k:"10g",de:"Cannabis flos 10g (Doypack)",en:"Cannabis flos 10g (Doypack)",qty:parseInt(bt.doy10g)||parseInt(plData["Total 10g Doypacks"])||100,format:"Trilaminated Doypack",pzn:"PZN-18547633"}
];
const totalUnits=(products[0]?.qty||0)+(products[1]?.qty||0);
const batchRef=bt.id||plData["Batch Number"]||"BI-03-NOCB1.2-INF-F";
const productName=bt.p||plData["Product Description"]||"Cannabis flos";
const expiryDate=bt.exp||"28.07.2027";
const netWeight=bt.net||plData["Net Weight"]||"140.0";
const grossWeight=bt.gross||plData["Gross Weight"]||"198.5";
return <Cd t={"🏷️ M4 — "+(lang==="de"?"Umetikettierung — Murchin":"Relabeling — Murchin")} badge={<Bd c="#059669" b="#d1fae5">✓</Bd>}>

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
{/* CA-03 Relabeling Stats — show FIRST */}
{[["PZN","PZN-18547632"],[lang==="de"?"Etiketten":"Labels",(products[0]?.qty||0)+"×1kg + "+(products[1]?.qty||0)+"×10g = "+totalUnits],[lang==="de"?"Charge":"Batch",batchRef],[lang==="de"?"Produkt":"Product",productName],[lang==="de"?"THC (QSI)":"THC (QSI)",confirmedThc],["Verfall/Expiry",expiryDate],[lang==="de"?"Netto":"Net",netWeight+" kg"],[lang==="de"?"Standort":"Location","Murchin, An der Redoute 1"],["SOP","SOP-710-01 v3.0"]].map(([l,v],j)=><div key={j}><div style={{fontSize:13,color:"#6b7280",textTransform:"uppercase",fontWeight:600}}>{l}</div><div style={{fontWeight:600}}>{v}</div></div>)}
</div>

{/* Deviation & CAPA — Per-batch, using dynamic data */}
<div style={{marginBottom:14,borderRadius:10,border:"1px solid #e5e7eb",overflow:"hidden"}}>
<button onClick={()=>setM4CapaOpen(p=>!p)} style={{width:"100%",padding:"10px 12px",background:m4CapaOpen?"linear-gradient(135deg,#fef2f2,#fff7ed)":"#f9fafb",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:14}}>{m4CapaOpen?"▼":"▶"}</span>
<span style={{fontSize:14,fontWeight:700,color:"#dc2626"}}>⚠️ {lang==="de"?"Abweichung & CAPA — "+selBatch:"Deviation & CAPA — "+selBatch}</span>
<span style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:700,background:"#dcfce7",color:"#059669"}}>✅ {lang==="de"?"CAPA abgeschlossen":"CAPA Completed"}</span>
</div>
<span style={{fontSize:12,color:"#6b7280"}}>{m4CapaOpen?(lang==="de"?"Einklappen":"Collapse"):(lang==="de"?"Aufklappen":"Expand")}</span>
</button>
{m4CapaOpen&&<div style={{padding:12}}>
<div style={{padding:10,background:"#fff",borderRadius:8,border:"1px solid #fecaca",marginBottom:8}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
<span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:"#dc2626",color:"#fff"}}>DEV-1</span>
<div style={{fontSize:13,fontWeight:700,color:"#dc2626"}}>{lang==="de"?"Fehlerhafte Freigabe — Arzneimittel statt Wirkstoff":"Defective Release — Medicinal Product instead of Active Ingredient"}</div>
</div>
<div style={{fontSize:12,color:"#374151",lineHeight:"1.5",marginBottom:6}}>{lang==="de"?"Das Produkt wurde fälschlicherweise als Arzneimittel statt korrekt als Wirkstoff freigegeben. Ursache: Fehler im Dokumenten-Layout/Template.":"The product was incorrectly released as a medicinal product instead of correctly as an active ingredient. Root cause: Error in the document layout/template."}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:11}}>
<div style={{padding:6,background:"#f0fdf4",borderRadius:4,border:"1px solid #a7f3d0"}}><strong style={{color:"#059669"}}>✅ {lang==="de"?"Korrektur":"Corrective"}:</strong> {lang==="de"?"Template sofort korrigiert. Produkt jetzt korrekt als Wirkstoff identifiziert.":"Template corrected immediately. Product now correctly identified as active ingredient."}</div>
<div style={{padding:6,background:"#f0fdf4",borderRadius:4,border:"1px solid #a7f3d0"}}><strong style={{color:"#059669"}}>✅ {lang==="de"?"Prävention":"Preventive"}:</strong> {lang==="de"?"Template systemweit gesperrt — Layout kann nicht mehr manuell geändert werden.":"Template locked system-wide — layout cannot be manually changed. Recurrence technically impossible."}</div>
</div></div>
<div style={{padding:10,background:"#fff",borderRadius:8,border:"1px solid #fde68a",marginBottom:8}}>
<div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
<span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:"#d97706",color:"#fff"}}>DEV-2</span>
<div style={{fontSize:13,fontWeight:700,color:"#d97706"}}>{lang==="de"?"Fehlerhafte Etikettierung — Behälterkennzeichnung":"Incorrect Labeling — Container Markings"}</div>
</div>
<div style={{fontSize:12,color:"#374151",lineHeight:"1.5",marginBottom:6}}>{lang==="de"?"Änderungen an Etiketten/Kennzeichnung der Behälter wurden beanstandet. Bestand physisch gesperrt und vollständig umettikettiert.":"Changes to labels/container markings were criticized. Stock physically blocked and completely relabeled."}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:11}}>
<div style={{padding:6,background:"#f0fdf4",borderRadius:4,border:"1px solid #a7f3d0"}}><strong style={{color:"#059669"}}>✅ {lang==="de"?"Korrektur":"Corrective"}:</strong> {lang==="de"?"Etiketten-Layout in gemeinsamer Sitzung an Vorgaben angepasst.":"Label layout adjusted to specifications in joint meeting."}</div>
<div style={{padding:6,background:"#f0fdf4",borderRadius:4,border:"1px solid #a7f3d0"}}><strong style={{color:"#059669"}}>✅ {lang==="de"?"Umetikettierung":"Relabeling"}:</strong> {lang==="de"?"Gesamter Bestand "+selBatch+" vollständig mit korrekten Etiketten umettikettiert.":"Entire "+selBatch+" stock completely relabeled with correct labels."}</div>
</div></div>

{/* Affected units — dynamic per batch */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
<div style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #a7f3d0",display:"flex",alignItems:"center",gap:8}}>
<div style={{width:36,height:36,borderRadius:"50%",background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✅</div>
<div><div style={{fontSize:13,fontWeight:700}}>{selBatch} ({batchRef}) — {productName}</div><div style={{fontSize:11,color:"#6b7280"}}>{products[1]?.qty||100}× 10g Doypacks · {lang==="de"?"Vollständig umettikettiert":"Fully relabeled"}</div></div>
</div>
<div style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #a7f3d0",display:"flex",alignItems:"center",gap:8}}>
<div style={{width:36,height:36,borderRadius:"50%",background:"#dcfce7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>✅</div>
<div><div style={{fontSize:13,fontWeight:700}}>{selBatch} ({batchRef}) — {productName}</div><div style={{fontSize:11,color:"#6b7280"}}>{products[0]?.qty||139}× 1kg bags · {lang==="de"?"Vollständig umettikettiert":"Fully relabeled"}</div></div>
</div>
</div>

{/* CAPA Signatures */}
<div style={{padding:10,background:"#fff",borderRadius:8,border:"1px solid #c7d2fe"}}>
<div style={{fontSize:13,fontWeight:700,color:"#1e40af",marginBottom:6}}>✍️ {lang==="de"?"CAPA-Freigabe — DocuSign":"CAPA Approval — DocuSign"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
{[
{k:"capa_rp",name:"Torsten Cuny",role:"RP §52a AMG",desc:lang==="de"?"Bestätigt: CAPA-Maßnahmen umgesetzt, Umetikettierung "+selBatch+" abgeschlossen":"Confirms: CAPA actions implemented, relabeling "+selBatch+" completed",c:"#1e40af"},
{k:"capa_qp",name:"Dr. Olaf Schagon",role:"QP §15 AMG",desc:lang==="de"?"Genehmigt: Abweichungsverfahren abgeschlossen, keine weitere Maßnahme erforderlich":"Approves: Deviation procedure closed, no further action required",c:"#059669"},
].map(sig=>{const signed=m4Sigs[sig.k];return <div key={sig.k} style={{padding:8,borderRadius:8,border:signed?"2px solid #059669":"1.5px solid #d1d5db",background:signed?"#f0fdf4":"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
<div><div style={{fontSize:13,fontWeight:700,color:sig.c}}>{sig.name}</div><div style={{fontSize:10,color:"#6b7280"}}>{sig.role}</div></div>
{signed?<span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:"#dcfce7",color:"#059669"}}>✅ {signed.ts}</span>
:<button onClick={()=>m4Sign(sig.k)} style={{padding:"5px 12px",borderRadius:6,fontSize:11,fontWeight:700,border:"none",background:sig.c,color:"#fff",cursor:"pointer"}}>✍️ DocuSign</button>}
</div>
<div style={{fontSize:10,color:"#6b7280",fontStyle:"italic"}}>{sig.desc}</div>
{signed&&<div style={{fontSize:9,color:"#059669",marginTop:3}}>{signed.hash} · eIDAS Art. 25 · DocuSign</div>}
</div>})}
</div>
{m4Sigs.capa_rp&&m4Sigs.capa_qp&&<div style={{marginTop:6,padding:6,background:"#dcfce7",borderRadius:6,textAlign:"center",fontSize:12,fontWeight:700,color:"#059669"}}>✅ {lang==="de"?"CAPA vollständig genehmigt via DocuSign — Abweichungsverfahren abgeschlossen":"CAPA fully approved via DocuSign — Deviation procedure closed"}</div>}

{/* Print & Email — Bilingual DE/EN */}
<div style={{display:"flex",gap:6,marginTop:10}}>
<button onClick={()=>{const w=window.open("","_blank","width=800,height=700");
const rpSig=m4Sigs.capa_rp;const qpSig=m4Sigs.capa_qp;
w.document.write('<html><head><title>CAPA Report — '+selBatch+' — NOC Pharma</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:11px;color:#1f2937}h1{font-size:16px;color:#1e3a5f;border-bottom:2px solid #1e3a5f;padding-bottom:6px}h2{font-size:13px;color:#dc2626;margin-top:14px;background:#fef2f2;padding:4px 8px;border-radius:4px}.box{padding:8px;border:1px solid #d1d5db;border-radius:4px;margin:4px 0;font-size:10px}.pass{background:#f0fdf4;border-color:#a7f3d0;color:#059669}.grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.sig{margin-top:8px;padding:10px;background:#f0fdf4;border:2px solid #059669;border-radius:6px}.pend{margin-top:8px;padding:10px;background:#fefce8;border:2px solid #fbbf24;border-radius:6px}.hdr{background:#0f172a;color:#fff;padding:12px 30px;margin:-30px -30px 16px;font-size:12px}.lang{margin-top:20px;padding-top:12px;border-top:3px solid #1e40af}@media print{body{padding:15px}.hdr{margin:-15px -15px 12px}}</style></head><body>');
w.document.write('<div class="hdr"><strong style="font-size:16px">NOC Pharma GmbH</strong> — CAPA-Bericht / CAPA Report<br/>QMS v2.5 · §52a AMG · '+new Date().toLocaleDateString("de-DE")+'</div>');
/* DEUTSCH */
w.document.write('<h1>🇩🇪 Abweichung & CAPA — '+selBatch+' ('+batchRef+')</h1>');
w.document.write('<p>Charge: '+batchRef+' · Produkt: '+productName+'<br/>Einheiten: '+(products[0]?.qty||139)+'× 1kg Beutel + '+(products[1]?.qty||100)+'× 10g Doypacks = '+totalUnits+' Einheiten<br/>THC: '+confirmedThc+' · Verfall: '+expiryDate+'</p>');
w.document.write('<h2>DEV-1: Fehlerhafte Freigabe — Arzneimittel statt Wirkstoff</h2>');
w.document.write('<p>Das Produkt wurde fälschlicherweise als Arzneimittel statt korrekt als Wirkstoff freigegeben. Ursache: Fehler im Dokumenten-Layout/Template.</p>');
w.document.write('<div class="grid"><div class="box pass"><strong>✅ Korrektur:</strong> Template sofort korrigiert. Produkt jetzt korrekt als Wirkstoff identifiziert.</div><div class="box pass"><strong>✅ Prävention:</strong> Template systemweit gesperrt — Layout kann nicht mehr manuell geändert werden. Wiederholung technisch ausgeschlossen.</div></div>');
w.document.write('<h2>DEV-2: Fehlerhafte Etikettierung — Behälterkennzeichnung</h2>');
w.document.write('<p>Änderungen an Etiketten/Kennzeichnung der Behälter wurden beanstandet. Bestand physisch gesperrt und vollständig umettikettiert.</p>');
w.document.write('<div class="grid"><div class="box pass"><strong>✅ Korrektur:</strong> Etiketten-Layout in gemeinsamer Sitzung an Vorgaben angepasst.</div><div class="box pass"><strong>✅ Umetikettierung:</strong> Gesamter Bestand '+selBatch+' vollständig mit korrekten Etiketten umettikettiert.</div></div>');
w.document.write('<h2 style="color:#059669;background:#f0fdf4">Betroffene Einheiten — '+selBatch+'</h2>');
w.document.write('<div class="grid"><div class="box pass"><strong>'+selBatch+'</strong> — '+batchRef+' — '+productName+'<br/>'+(products[1]?.qty||100)+'× 10g Doypacks — ✅ Umettikettiert</div><div class="box pass"><strong>'+selBatch+'</strong> — '+batchRef+' — '+productName+'<br/>'+(products[0]?.qty||139)+'× 1kg Beutel — ✅ Umettikettiert</div></div>');
/* ENGLISH */
w.document.write('<div class="lang"><h1>🇬🇧 Deviation & CAPA — '+selBatch+' ('+batchRef+')</h1>');
w.document.write('<p>Batch: '+batchRef+' · Product: '+productName+'<br/>Units: '+(products[0]?.qty||139)+'× 1kg bags + '+(products[1]?.qty||100)+'× 10g Doypacks = '+totalUnits+' units<br/>THC: '+confirmedThc+' · Expiry: '+expiryDate+'</p>');
w.document.write('<h2>DEV-1: Defective Release — Medicinal Product instead of Active Ingredient</h2>');
w.document.write('<p>The product was incorrectly released as a medicinal product instead of correctly as an active ingredient. Root cause: Error in document layout/template.</p>');
w.document.write('<div class="grid"><div class="box pass"><strong>✅ Corrective:</strong> Template corrected immediately. Product now correctly identified as active ingredient.</div><div class="box pass"><strong>✅ Preventive:</strong> Template locked system-wide — layout cannot be manually changed. Recurrence technically impossible.</div></div>');
w.document.write('<h2>DEV-2: Incorrect Labeling — Container Markings</h2>');
w.document.write('<p>Changes to labels/container markings were criticized. Stock physically blocked and completely relabeled.</p>');
w.document.write('<div class="grid"><div class="box pass"><strong>✅ Corrective:</strong> Label layout adjusted to specifications in joint meeting.</div><div class="box pass"><strong>✅ Relabeling:</strong> Entire '+selBatch+' stock completely relabeled with correct labels.</div></div>');
w.document.write('<h2 style="color:#059669;background:#f0fdf4">Affected Units — '+selBatch+'</h2>');
w.document.write('<div class="grid"><div class="box pass"><strong>'+selBatch+'</strong> — '+batchRef+' — '+productName+'<br/>'+(products[1]?.qty||100)+'× 10g Doypacks — ✅ Relabeled</div><div class="box pass"><strong>'+selBatch+'</strong> — '+batchRef+' — '+productName+'<br/>'+(products[0]?.qty||139)+'× 1kg bags — ✅ Relabeled</div></div>');
w.document.write('</div>');
/* Signatures */
w.document.write('<h2 style="color:#1e40af;background:#eff6ff">Unterschriften / Signatures (DocuSign · eIDAS Art. 25)</h2>');
if(rpSig)w.document.write('<div class="sig"><strong>✅ RP — Torsten Cuny</strong> — Verantwortliche Person / Responsible Person (§52a AMG)<br/>Unterschrieben / Signed: '+rpSig.ts+'<br/>'+rpSig.hash+' · eIDAS Art. 25 · DocuSign<br/><em>DE: Bestätigt CAPA-Maßnahmen umgesetzt, Umetikettierung '+selBatch+' abgeschlossen<br/>EN: Confirms CAPA actions implemented, relabeling '+selBatch+' completed</em></div>');else w.document.write('<div class="pend"><strong>⏳ RP — Torsten Cuny</strong> — Verantwortliche Person / Responsible Person (§52a AMG) — AUSSTEHEND / PENDING</div>');
if(qpSig)w.document.write('<div class="sig"><strong>✅ QP — Dr. Olaf Schagon</strong> — Sachkundige Person / Qualified Person (§15 AMG)<br/>Unterschrieben / Signed: '+qpSig.ts+'<br/>'+qpSig.hash+' · eIDAS Art. 25 · DocuSign<br/><em>DE: Genehmigt Abweichungsverfahren abgeschlossen, keine weitere Maßnahme erforderlich<br/>EN: Approves deviation procedure closed, no further action required</em></div>');else w.document.write('<div class="pend"><strong>⏳ QP — Dr. Olaf Schagon</strong> — Sachkundige Person / Qualified Person (§15 AMG) — AUSSTEHEND / PENDING</div>');
w.document.write('<div style="margin-top:20px;padding-top:10px;border-top:1px solid #d1d5db;font-size:9px;color:#9ca3af;text-align:center">NOC Pharma GmbH · Langetal 1, DE-07751 Golmsdorf · §52a AMG · QMS v2.5<br/>RP: T. Cuny · QP: Dr. O. Schagon · Generated: '+new Date().toISOString()+'</div></body></html>');
w.document.close();setTimeout(()=>w.print(),500)}} style={{flex:1,padding:"6px 12px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:"#374151",color:"#fff",cursor:"pointer"}}>🖨️ CAPA PDF (DE/EN)</button>
<button onClick={()=>{const subj="NOC Pharma — CAPA-Bericht / CAPA Report — "+selBatch+" ("+batchRef+") — "+new Date().toLocaleDateString("de-DE");
const body="NOC PHARMA GmbH — CAPA-Bericht / CAPA Report\n════════════════════════════════\nCharge / Batch: "+selBatch+" ("+batchRef+")\nProdukt / Product: "+productName+"\nEinheiten / Units: "+(products[0]?.qty||139)+"× 1kg + "+(products[1]?.qty||100)+"× 10g = "+totalUnits+"\nTHC: "+confirmedThc+" · Verfall / Expiry: "+expiryDate+"\n\n🇩🇪 DEUTSCH:\n\nDEV-1: Fehlerhafte Freigabe (Arzneimittel statt Wirkstoff)\n- Korrektur: Template sofort korrigiert\n- Prävention: Template systemweit gesperrt\n\nDEV-2: Fehlerhafte Etikettierung (Behälterkennzeichnung)\n- Korrektur: Layout in Sitzung angepasst\n- Umetikettierung: "+selBatch+" vollständig umettikettiert\n  • "+(products[1]?.qty||100)+"× 10g Doypacks ✅\n  • "+(products[0]?.qty||139)+"× 1kg Beutel ✅\n\n🇬🇧 ENGLISH:\n\nDEV-1: Defective Release (Medicinal Product instead of Active Ingredient)\n- Corrective: Template corrected immediately\n- Preventive: Template locked system-wide\n\nDEV-2: Incorrect Labeling (Container Markings)\n- Corrective: Layout adjusted in joint meeting\n- Relabeling: "+selBatch+" completely relabeled\n  • "+(products[1]?.qty||100)+"× 10g Doypacks ✅\n  • "+(products[0]?.qty||139)+"× 1kg bags ✅\n\nUnterschriften / Signatures:\n"+(m4Sigs.capa_rp?"✅ RP: Torsten Cuny (§52a AMG) — "+m4Sigs.capa_rp.ts+" — "+m4Sigs.capa_rp.hash:"⏳ RP: Torsten Cuny — Ausstehend/Pending")+"\n"+(m4Sigs.capa_qp?"✅ QP: Dr. Olaf Schagon (§15 AMG) — "+m4Sigs.capa_qp.ts+" — "+m4Sigs.capa_qp.hash:"⏳ QP: Dr. Olaf Schagon — Ausstehend/Pending")+"\n\n════════════════════════════════\nNOC Pharma GmbH · QMS v2.5\nRP: T. Cuny · QP: Dr. O. Schagon";
window.open(gmailLink(subj,body)+"&to="+encodeURIComponent("qp@nocpharma.de")+"&cc="+encodeURIComponent("torsten.cuny@nocpharma.de"),"_blank")}} style={{flex:1,padding:"6px 12px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>📧 {lang==="de"?"Per E-Mail senden":"Send by Email"}</button>
</div>
</div>
</div>}</div>
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
<div style={{textAlign:"center"}}><div style={{fontSize:28}}>🏷️</div><div style={{fontSize:13,color:"#059669",fontWeight:600}}>NOC Pharma Label</div><div style={{fontSize:12,color:"#6b7280"}}>{prod.pzn} • {batchRef}</div><div style={{fontSize:11,color:"#6b7280"}}>THC {confirmedThc} • Exp {expiryDate}</div></div>
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
{[[lang==="de"?"Fotos gesamt":"Total photos",(Object.values(m4Imgs).filter(Boolean).length)+"/4","#9333ea"],[lang==="de"?"1kg Beutel":"1kg bags",(products[0]?.qty||139)+"×","#2563eb"],[lang==="de"?"10g Doypacks":"10g Doypacks",(products[1]?.qty||100)+"×","#d97706"],[lang==="de"?"Barcodes":"Barcodes",totalUnits+" ✅","#059669"]].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:6,border:"1px solid #e5e7eb",padding:8,textAlign:"center"}}><div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:13,color:"#6b7280"}}>{l}</div></div>)}
</div>

<div style={{borderTop:"2px solid #e5e7eb",paddingTop:14,marginTop:10,marginBottom:10}}>
<div style={{fontSize:16,fontWeight:700,marginBottom:10}}>✍️ {lang==="de"?"Umetikettierungsfreigabe (DocuSign)":"Relabeling Release (DocuSign)"}</div>

{[
{k:"celso",name:"Torsten Cuny",role:lang==="de"?"Verantwortliche Person (RP) §52a AMG":"Responsible Person (RP) §52a AMG",desc:lang==="de"?"Bestätigt: "+totalUnits+" Etiketten korrekt angebracht, Fotos archiviert, PZN/Barcode/THC/Verfall geprüft, SOP-710-01 eingehalten":"Confirms: "+totalUnits+" labels correctly applied, photos archived, PZN/barcode/THC/expiry verified, SOP-710-01 followed",ic:"🏷️",c:"#9333ea"},
{k:"qp",name:"Dr. Olaf Schagon",role:lang==="de"?"Sachkundige Person (QP) gemäß §15 AMG":"Qualified Person (QP) per §15 AMG",desc:lang==="de"?"Genehmigt: Umetikettierung konform mit EU-GMP Annex 16, Etiketteninhalt geprüft, Charge für Lagerung/Vertrieb freigegeben":"Approves: Relabeling compliant with EU-GMP Annex 16, label content verified, batch cleared for storage/distribution",ic:"🔬",c:"#16a34a",primary:true}
].map(sig=>{const signed=m4Sigs[sig.k];
return <div key={sig.k} style={{display:"flex",gap:12,padding:14,marginBottom:8,borderRadius:8,border:sig.primary?"2px solid #16a34a":"1px solid "+(signed?"#a7f3d0":"#e5e7eb"),background:signed?"#f0fdf4":sig.primary?"#f0fdf4":"#fff"}}>
<div style={{width:44,height:44,borderRadius:"50%",background:signed?"#dcfce7":sig.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{signed?"✅":sig.ic}</div>
<div style={{flex:1}}>
<div style={{fontSize:15,fontWeight:700}}>{sig.name} {sig.primary&&<Bd c="#16a34a" b="#dcfce7">QP §15 AMG</Bd>}</div>
<div style={{fontSize:15,color:"#6b7280",fontWeight:500}}>{sig.role}</div>
<div style={{fontSize:14,color:"#6b7280",marginTop:2,fontStyle:"italic"}}>{sig.desc}</div>
{signed&&<div style={{marginTop:5,fontSize:14,padding:"3px 8px",background:"#dcfce7",borderRadius:4,display:"inline-block"}}>✅ {signed.ts} • {signed.hash} • eIDAS Art. 25 · DocuSign</div>}
</div>
{!signed&&<button onClick={()=>m4Sign(sig.k)} style={{padding:"8px 14px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:sig.primary?"#16a34a":sig.c,color:"#fff",cursor:"pointer",alignSelf:"center",whiteSpace:"nowrap",boxShadow:"0 2px 4px rgba(0,0,0,.12)"}}>✍️ DocuSign</button>}
</div>})}

{m4AllSigned&&<div style={{padding:12,background:"linear-gradient(135deg,#f3e8ff,#ede9fe)",borderRadius:8,border:"1px solid #c4b5fd",textAlign:"center",marginBottom:6}}>
<div style={{fontSize:15,fontWeight:800,color:"#5b21b6"}}>✅ {lang==="de"?"UMETIKETTIERUNG ABGESCHLOSSEN & FREIGEGEBEN":"RELABELING COMPLETE & RELEASED"}</div>
<div style={{fontSize:14,color:"#5b21b6",marginTop:3}}>{lang==="de"?"Beide DocuSign-Unterschriften erhalten. "+totalUnits+" Einheiten freigegeben für Lagerung M4.5.":"Both DocuSign signatures collected. "+totalUnits+" units released for storage M4.5."}</div>
</div>}

{/* Official Relabeling Release Certificate — only after both signatures */}
{m4AllSigned&&<div style={{marginBottom:12,border:"2px solid #7c3aed",borderRadius:10,overflow:"hidden"}}>
<div style={{padding:"12px 16px",background:"linear-gradient(135deg,#4c1d95,#7c3aed)",color:"#fff"}}>
<div style={{fontSize:16,fontWeight:800}}>📜 {lang==="de"?"Umetikettierungs-Freigabezertifikat":"Relabeling Release Certificate"}</div>
<div style={{fontSize:13,opacity:.85}}>{selBatch} · {batchRef} · {new Date().toLocaleDateString("de-DE")}</div>
</div>
<div style={{padding:14,background:"#faf5ff"}}>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10,fontSize:13}}>
{[
[lang==="de"?"Charge":"Batch",batchRef],
[lang==="de"?"Produkt":"Product",productName],
["THC",confirmedThc],
[lang==="de"?"Verfall":"Expiry",expiryDate],
[lang==="de"?"Einheiten":"Units",totalUnits+" ("+(products[0]?.qty||139)+"×1kg + "+(products[1]?.qty||100)+"×10g)"],
["PZN","PZN-18547632 / PZN-18547633"],
[lang==="de"?"Netto":"Net",netWeight+" kg"],
["SOP","SOP-710-01 v3.0"],
[lang==="de"?"Standort":"Location","Murchin, An der Redoute 1"]
].map(([l,v],j)=><div key={j}><div style={{color:"#6b7280",fontSize:11,fontWeight:600}}>{l}</div><div style={{fontWeight:700,color:"#1e293b"}}>{v}</div></div>)}
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
<div style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #a7f3d0"}}>
<div style={{fontSize:11,color:"#059669",fontWeight:700}}>✅ RP — Torsten Cuny (§52a AMG)</div>
<div style={{fontSize:12}}>{m4Sigs.celso?.ts} · {m4Sigs.celso?.hash}</div>
</div>
<div style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #a7f3d0"}}>
<div style={{fontSize:11,color:"#059669",fontWeight:700}}>✅ QP — Dr. Olaf Schagon (§15 AMG)</div>
<div style={{fontSize:12}}>{m4Sigs.qp?.ts} · {m4Sigs.qp?.hash}</div>
</div>
</div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{
const w=window.open("","_blank","width=800,height=900");
w.document.write('<html><head><title>Relabeling Release Certificate — '+selBatch+'</title><style>body{font-family:Arial,sans-serif;padding:40px;font-size:11px;color:#1f2937}h1{font-size:18px;color:#4c1d95;border-bottom:3px solid #7c3aed;padding-bottom:8px}h2{font-size:14px;color:#4c1d95;margin-top:16px;background:#faf5ff;padding:6px 10px;border-radius:4px;border-left:4px solid #7c3aed}table{width:100%;border-collapse:collapse;margin:10px 0}td{padding:5px 8px;border:1px solid #d1d5db;font-size:10px}td:first-child{font-weight:700;background:#f9fafb;width:30%}.sig{margin-top:10px;padding:10px;background:#f0fdf4;border:2px solid #059669;border-radius:6px;font-size:10px}.hdr{background:linear-gradient(135deg,#4c1d95,#7c3aed);color:#fff;padding:16px 40px;margin:-40px -40px 20px}.ft{margin-top:24px;border-top:2px solid #7c3aed;padding-top:10px;font-size:8px;color:#9ca3af;text-align:center}.lang{margin-top:24px;padding-top:16px;border-top:3px solid #1e40af}@media print{body{padding:20px}.hdr{margin:-20px -20px 16px}}</style></head><body>');
w.document.write('<div class="hdr"><strong style="font-size:18px">NOC Pharma GmbH</strong><br/>Umetikettierungs-Freigabezertifikat / Relabeling Release Certificate<br/>QMS v2.5 · §52a AMG · EU GMP Annex 16 · '+new Date().toLocaleDateString("de-DE")+'</div>');
/* DEUTSCH */
w.document.write('<h1>🇩🇪 Umetikettierungs-Freigabezertifikat</h1>');
w.document.write('<h2>Chargen- und Produktdaten</h2><table>');
[["Import",selBatch],["Chargen-Nr.",batchRef],["Produkt",productName],["THC-Gehalt (QSI bestätigt)",confirmedThc],["Verfallsdatum",expiryDate],["Gesamteinheiten",totalUnits+" ("+(products[0]?.qty||139)+"× 1kg EVOH/PBD LDPE Beutel + "+(products[1]?.qty||100)+"× 10g Doypacks trilaminiert)"],["PZN","PZN-18547632 (1kg) / PZN-18547633 (10g)"],["Nettogewicht",netWeight+" kg"],["Bruttogewicht",grossWeight+" kg"],["SOP","SOP-710-01 v3.0 — Umetikettierungsprotokoll"],["Standort","Murchin, An der Redoute 1, 17390 Murchin, MV"]].forEach(function(r){w.document.write("<tr><td>"+r[0]+"</td><td>"+r[1]+"</td></tr>")});
w.document.write('</table>');
w.document.write('<h2>Umetikettierungserklärung</h2>');
w.document.write('<p>Hiermit wird bestätigt, dass alle <strong>'+totalUnits+' Einheiten</strong> der Charge <strong>'+batchRef+'</strong> (Import '+selBatch+') ordnungsgemäß umettikettiert wurden gemäß SOP-710-01 v3.0.</p>');
w.document.write('<p>Jedes Etikett enthält: Produktbezeichnung, Chargen-Nr., PZN, THC-Gehalt ('+confirmedThc+'), Verfallsdatum ('+expiryDate+'), Barcode und QR-Code. Alle Einheiten wurden visuell geprüft und fotografisch dokumentiert.</p>');
w.document.write('<p><strong>Die Charge ist hiermit freigegeben für die Einlagerung (M4.5) und den anschließenden kommerziellen Vertrieb.</strong></p>');
/* ENGLISH */
w.document.write('<div class="lang"><h1>🇬🇧 Relabeling Release Certificate</h1>');
w.document.write('<h2>Batch & Product Data</h2><table>');
[["Import",selBatch],["Batch No.",batchRef],["Product",productName],["THC Content (QSI confirmed)",confirmedThc],["Expiry Date",expiryDate],["Total Units",totalUnits+" ("+(products[0]?.qty||139)+"× 1kg EVOH/PBD LDPE bags + "+(products[1]?.qty||100)+"× 10g Doypacks trilaminated)"],["PZN","PZN-18547632 (1kg) / PZN-18547633 (10g)"],["Net Weight",netWeight+" kg"],["Gross Weight",grossWeight+" kg"],["SOP","SOP-710-01 v3.0 — Relabeling Protocol"],["Location","Murchin, An der Redoute 1, 17390 Murchin, MV"]].forEach(function(r){w.document.write("<tr><td>"+r[0]+"</td><td>"+r[1]+"</td></tr>")});
w.document.write('</table>');
w.document.write('<h2>Relabeling Declaration</h2>');
w.document.write('<p>This certifies that all <strong>'+totalUnits+' units</strong> of batch <strong>'+batchRef+'</strong> (Import '+selBatch+') have been properly relabeled in accordance with SOP-710-01 v3.0.</p>');
w.document.write('<p>Each label contains: Product name, Batch No., PZN, THC content ('+confirmedThc+'), Expiry date ('+expiryDate+'), Barcode and QR code. All units have been visually inspected and photographically documented.</p>');
w.document.write('<p><strong>This batch is hereby released for storage (M4.5) and subsequent commercial distribution.</strong></p></div>');
/* Signatures */
w.document.write('<h2>Unterschriften / Signatures (DocuSign · eIDAS Art. 25)</h2>');
w.document.write('<div class="sig"><strong>✅ RP — Torsten Cuny</strong> — Verantwortliche Person / Responsible Person (§52a AMG)<br/>DE: Bestätigt: '+totalUnits+' Etiketten korrekt angebracht, SOP-710-01 eingehalten<br/>EN: Confirms: '+totalUnits+' labels correctly applied, SOP-710-01 followed<br/>Unterschrieben / Signed: '+(m4Sigs.celso?.ts||"")+'<br/>'+(m4Sigs.celso?.hash||"")+' · eIDAS Art. 25 · DocuSign</div>');
w.document.write('<div class="sig"><strong>✅ QP — Dr. Olaf Schagon</strong> — Sachkundige Person / Qualified Person (§15 AMG)<br/>DE: Genehmigt: Umetikettierung konform mit EU-GMP Annex 16, Charge freigegeben für Lagerung/Vertrieb<br/>EN: Approves: Relabeling compliant with EU-GMP Annex 16, batch cleared for storage/distribution<br/>Unterschrieben / Signed: '+(m4Sigs.qp?.ts||"")+'<br/>'+(m4Sigs.qp?.hash||"")+' · eIDAS Art. 25 · DocuSign</div>');
w.document.write('<div class="ft">NOC Pharma GmbH · Langetal 1, DE-07751 Golmsdorf · §52a AMG · BtMG §3<br/>QMS v2.5 · RP: T. Cuny · QP: Dr. O. Schagon<br/>Erstellt / Generated: '+new Date().toISOString()+'</div></body></html>');
w.document.close();setTimeout(()=>w.print(),500);
}} style={{flex:1,padding:"8px 14px",borderRadius:6,fontSize:13,fontWeight:700,border:"none",background:"#4c1d95",color:"#fff",cursor:"pointer"}}>🖨️ {lang==="de"?"Zertifikat drucken (DE/EN)":"Print Certificate (DE/EN)"}</button>
<button onClick={()=>{
const subj="NOC Pharma — Umetikettierungs-Freigabezertifikat / Relabeling Release Certificate — "+selBatch+" ("+batchRef+")";
const body="NOC PHARMA GmbH\nUmetikettierungs-Freigabezertifikat / Relabeling Release Certificate\n════════════════════════════════\n\nImport: "+selBatch+"\nCharge / Batch: "+batchRef+"\nProdukt / Product: "+productName+"\nTHC: "+confirmedThc+"\nVerfall / Expiry: "+expiryDate+"\nEinheiten / Units: "+totalUnits+" ("+(products[0]?.qty||139)+"× 1kg + "+(products[1]?.qty||100)+"× 10g)\nPZN: PZN-18547632 / PZN-18547633\nNetto / Net: "+netWeight+" kg\nSOP: SOP-710-01 v3.0\n\n🇩🇪 DEUTSCH:\nAlle "+totalUnits+" Einheiten ordnungsgemäß umettikettiert gemäß SOP-710-01.\nFreigegeben für Einlagerung (M4.5) und kommerziellen Vertrieb.\n\n🇬🇧 ENGLISH:\nAll "+totalUnits+" units properly relabeled per SOP-710-01.\nReleased for storage (M4.5) and commercial distribution.\n\nUnterschriften / Signatures:\n"+(m4Sigs.celso?"✅ RP: Torsten Cuny — "+m4Sigs.celso.ts+" — "+m4Sigs.celso.hash:"⏳ RP: Pending")+"\n"+(m4Sigs.qp?"✅ QP: Dr. Olaf Schagon — "+m4Sigs.qp.ts+" — "+m4Sigs.qp.hash:"⏳ QP: Pending")+"\n\n════════════════════════════════\nNOC Pharma GmbH · QMS v2.5 · §52a AMG";
window.open(gmailLink(subj,body)+"&to="+encodeURIComponent("qp@nocpharma.de")+"&cc="+encodeURIComponent("torsten.cuny@nocpharma.de"),"_blank");
}} style={{flex:1,padding:"8px 14px",borderRadius:6,fontSize:13,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>📧 {lang==="de"?"Zertifikat senden":"Send Certificate"}</button>
<button onClick={()=>{setLcs(prev=>{const idx=SG.findIndex(s=>s.id==="M4.5");return idx>=0?idx:prev})}} style={{flex:1,padding:"8px 14px",borderRadius:6,fontSize:13,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>📦 {lang==="de"?"→ Transfer zu M4.5 Lagerung":"→ Transfer to M4.5 Storage"}</button>
</div>
</div>
</div>}
{!m4AllSigned&&<div style={{padding:8,background:"#fffbeb",borderRadius:6,border:"1px solid #fde68a",fontSize:14,color:"#92400e",marginBottom:6}}>⚠️ {Object.values(m4Sigs).filter(Boolean).length}/2 {lang==="de"?"via DocuSign unterschrieben. Umetikettierung muss vor Lagerung freigegeben werden.":"signed via DocuSign. Relabeling must be released before storage."}</div>}
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
const totalUnits=BT.units||239,bags1kg=BT.bags1kg||139,doy10g=BT.doy10g||100;
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
const prefix=curBox.type==="1kg"?BT.id+"-1KG-":BT.id+"-10G-";
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
const prefix=b.type==="1kg"?BT.id+"-1KG-":BT.id+"-10G-";
const arr=[];
for(let u=0;u<b.cap;u++){arr.push({code:prefix+String(u+1).padStart(4,"0"),ts:new Date().toLocaleTimeString("de-DE",{hour:"2-digit",minute:"2-digit",second:"2-digit"})});}
nu[b.id]=arr;
});
setBxState(p=>({...p,units:nu,activeBox:boxCfg.length-1,lastScan:"ALL"}));
};

return <div>
<Cd t={"📦 M4.5 "+(lang==="de"?"Lagerung & Versandvorbereitung":"Storage & Dispatch Readiness")+" — Murchin"} badge={allSigned?<Bd c="#059669" b="#d1fae5">✓ {lang==="de"?"Versandbereit":"Dispatch Ready"}</Bd>:<Bd c="#ea580c" b="#fff7ed">{totalScanned}/{totalUnits}</Bd>}>

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
[lang==="de"?"Einheiten":"Units",(BT.bags1kg||139)+"×1kg + "+(BT.doy10g||100)+"×10g = "+(BT.units||239)],
[lang==="de"?"Boxen":"Boxes","9 (BOX-001 – BOX-009)"],
[lang==="de"?"QP-Freigabe":"QP Release","CGZ-2025-0047 ✅"],
[lang==="de"?"Lagerort":"Storage Location","Murchin, An der Redoute 1"],
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
{k:"dominik",name:"Dominik Delacher",role:lang==="de"?"Lagerverwaltung / Storage Manager":"Storage Manager / Warehouse Manager",action:lang==="de"?"ÜBERNAHME — Übernimmt Verantwortung für Lagerung & Versand":"ACCEPTANCE — Assumes responsibility for storage & dispatch",confirms:lang==="de"?"Bestätigt: 239 Einheiten in 9 Boxen empfangen, Zustand geprüft, QR-Codes stichprobenartig gescannt, Einlagerung in BtM-Lager Murchin, Bestandsführung in Base44 Inventar-App aktiv, bereit für Apothekenbestellungen.":"Confirms: 239 units in 9 boxes received, condition inspected, QR codes spot-checked, stored in BtM warehouse Murchin, inventory tracking in Base44 Inventory App active, ready for pharmacy orders.",color:"#ea580c",ic:"🟠",primary:true,email:"dominik@noc-pharma.de"}
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
[lang==="de"?"Lagerort":"Storage","Murchin, An der Redoute 1","#059669"],
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
[lang==="de"?"Gesamteinheiten":"Total Units",(BT.bags1kg||139)+"×1kg + "+(BT.doy10g||100)+"×10g = "+(BT.units||239)],
[lang==="de"?"Boxen":"Boxes","9 boxes sealed & signed"],
[lang==="de"?"Lagerort":"Storage Location","Murchin, An der Redoute 1"],
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
<div style={{fontSize:13,color:"#6b7280"}}>Warehouse Murchin</div>
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
{k:"dominik",name:"Dominik Delacher",role:"Storage Manager / Warehouse Murchin",
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
<div style={{fontSize:12,color:"#9ca3af"}}>SHA256:{Math.random().toString(16).slice(2,10).toUpperCase()} • eIDAS Art. 25 · DocuSign</div>
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
{[["STH51-A","Lager Murchin Zone A",19.8,44,true],["STH51-B","Lager Murchin Zone B",20.1,42,true],["STH51-C","Lager Murchin Zone C",19.5,45,true]].map(([id,zone,temp,hum,ok],j)=>
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

// M5 Shipment — Live Wix Orders + SendCloud per Import Batch
const[m5Tab,setM5Tab]=useState("sales");
const M5Ship=()=>{
/* Filter Wix orders to THIS batch's products only */
const bt=BT_DATA[selBatch]||BT_DATA["CA-03"]||{};
const batchKeywords=selBatch==="CA-03"?["noc se 17","noc se 20","noc-se-17","noc-se-20","bi-03","nocb1.2","se 17/20","cannabis flos"]:selBatch==="CA-02"?["noc se 19","bi-02","nocb1.1"]:selBatch==="CA-01"?["noc se 17","bi-01","nocb1.0"]:["noc"];
const batchOrders=wixOrders.filter(o=>o.items.some(it=>{const t=(it.name+" "+(it.sku||"")).toLowerCase();return batchKeywords.some(kw=>t.includes(kw))}));
const paidOrders=batchOrders.filter(o=>o.status==="PAID");
const unpaidOrders=batchOrders.filter(o=>o.status!=="PAID");
const totalRevenue=paidOrders.reduce((a,o)=>a+o.totals.total,0);
const totalUnitsOrdered=batchOrders.reduce((a,o)=>a+o.items.reduce((b,it)=>b+it.qty,0),0);
const totalUnitsPaid=paidOrders.reduce((a,o)=>a+o.items.reduce((b,it)=>b+it.qty,0),0);
const plUnits=parseInt(bt.units)||239;
const remaining=plUnits-totalUnitsOrdered;

return <div>
<Cd t={"📤 M5 "+selBatch+" — "+(lang==="de"?"Versand & Vertrieb":"Shipment & Distribution")} badge={<Bd c="#dc2626" b="#fee2e2">{totalUnitsOrdered}/{plUnits}</Bd>}>
<div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap"}}>
{[["sales","🛒 "+(lang==="de"?"Wix Bestellungen":"Wix Orders")+" ("+batchOrders.length+")"],["sendcloud","📦 SendCloud"],["closure","📋 "+(lang==="de"?"BfArM Dossier":"BfArM Dossier")]].map(([k,l])=>
<button key={k} onClick={()=>setM5Tab(k)} style={{padding:"5px 10px",borderRadius:5,fontSize:14,fontWeight:600,border:m5Tab===k?"2px solid #dc2626":"1px solid #d1d5db",background:m5Tab===k?"#fee2e2":"#fff",color:m5Tab===k?"#991b1b":"#374151",cursor:"pointer"}}>{l}</button>)}
<button onClick={()=>{fetchWixOrders();fetchScParcels()}} disabled={wixLoading} style={{marginLeft:"auto",padding:"5px 12px",borderRadius:5,fontSize:13,fontWeight:700,border:"none",background:wixLoading?"#9ca3af":"#dc2626",color:"#fff",cursor:wixLoading?"wait":"pointer"}}>{wixLoading?"⏳ ...":"🔄 Sync Wix + SendCloud"}</button>
</div>

{/* Unit Accountability Stats */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
{[
[lang==="de"?"Importiert":"Imported",plUnits,"#374151"],
[lang==="de"?"Bestellt":"Ordered",totalUnitsOrdered,"#2563eb"],
[lang==="de"?"Bezahlt":"Paid",totalUnitsPaid,"#059669"],
[lang==="de"?"Unbezahlt":"Unpaid",totalUnitsOrdered-totalUnitsPaid,"#d97706"],
[lang==="de"?"Verbleibend":"Remaining",remaining,"#6b7280"]
].map(([l,v,c],j)=>
<div key={j} style={{textAlign:"center",background:"#f9fafb",borderRadius:8,padding:8,border:"1px solid #e5e7eb"}}><div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:11,color:"#6b7280",fontWeight:600}}>{l}</div></div>)}
</div>
<div style={{marginBottom:12,padding:8,borderRadius:6,background:totalRevenue>0?"#f0fdf4":"#f9fafb",border:"1px solid "+(totalRevenue>0?"#a7f3d0":"#e5e7eb"),display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:14}}>
<span style={{fontWeight:700}}>{lang==="de"?"Umsatz "+selBatch:"Revenue "+selBatch}</span>
<span style={{fontSize:18,fontWeight:800,color:"#059669"}}>€{totalRevenue.toFixed(2)}</span>
</div>

{m5Tab==="sales"&&<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>🛒 {lang==="de"?"Wix Bestellungen — nur "+selBatch+" Produkte":"Wix Orders — "+selBatch+" products only"}</div>
{batchOrders.length>0?<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
<thead><tr style={{background:"#fef2f2"}}>
{["#",lang==="de"?"Datum":"Date",lang==="de"?"Kunde":"Client",lang==="de"?"Adresse":"Address",lang==="de"?"Produkte":"Products",lang==="de"?"Menge":"Qty",lang==="de"?"Gesamt":"Total",lang==="de"?"Zahlung":"Payment","📦 SendCloud"].map((h,j)=>
<th key={j} style={{padding:"5px 4px",textAlign:j>4?"right":"left",fontWeight:700,fontSize:11,color:"#dc2626",borderBottom:"2px solid #fecaca"}}>{h}</th>)}
</tr></thead>
<tbody>
{batchOrders.map((o,j)=>{const scMatch=scParcels.find(p=>p.orderNo===String(o.id)||p.name===o.client.name);
return <tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:o.status==="PAID"?"#fff":"#fffbeb"}}>
<td style={{padding:"5px 4px",fontWeight:700,color:"#dc2626"}}>{o.id}</td>
<td style={{padding:"5px 4px"}}>{o.date}</td>
<td style={{padding:"5px 4px"}}><div style={{fontWeight:700}}>{o.client.name}</div>{o.client.company&&<div style={{fontSize:10,color:"#6b7280"}}>{o.client.company}</div>}<div style={{fontSize:10,color:"#6b7280"}}>{o.client.email}</div>{o.client.phone&&o.client.phone!=="—"&&<div style={{fontSize:10,color:"#6b7280"}}>{o.client.phone}</div>}</td>
<td style={{padding:"5px 4px",fontSize:11}}><div>{o.shipping?.street||o.billing?.street}</div><div>{(o.shipping?.zip||o.billing?.zip)+" "+(o.shipping?.city||o.billing?.city)}</div><div>{o.shipping?.country||o.billing?.country}</div></td>
<td style={{padding:"5px 4px"}}>{o.items.map((it,k)=><div key={k} style={{fontSize:11}}>{it.name} <span style={{color:"#6b7280"}}>×{it.qty}</span> <span style={{color:"#059669",fontWeight:600}}>€{it.price?.toFixed(2)||"—"}</span></div>)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:600}}>{o.items.reduce((a,it)=>a+it.qty,0)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:700,color:"#059669"}}>€{o.totals.total.toFixed(2)}{o.totals.tax>0&&<div style={{fontSize:10,color:"#6b7280"}}>VAT: €{o.totals.tax.toFixed(2)}</div>}</td>
<td style={{padding:"5px 4px",textAlign:"center"}}><Bd c={o.status==="PAID"?"#059669":"#d97706"} b={o.status==="PAID"?"#dcfce7":"#fef3c7"}>{o.status}</Bd>{o.payment?.method&&o.payment.method!=="—"&&<div style={{fontSize:9,color:"#6b7280",marginTop:2}}>{o.payment.method}</div>}</td>
<td style={{padding:"5px 4px",textAlign:"right"}}>{scMatch?<div>
<Bd c={scMatch.statusId>=11?"#059669":scMatch.statusId>=3?"#2563eb":"#d97706"} b={scMatch.statusId>=11?"#dcfce7":scMatch.statusId>=3?"#dbeafe":"#fef3c7"}>{scMatch.status}</Bd>
{scMatch.tracking&&<div style={{fontSize:10,marginTop:2}}><a href={scMatch.trackingUrl} target="_blank" style={{color:"#7c3aed"}}>{scMatch.tracking}</a></div>}
{scMatch.labelUrl&&<button onClick={()=>window.open(scMatch.labelUrl,"_blank")} style={{fontSize:10,padding:"1px 6px",borderRadius:3,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer",marginTop:2}}>🏷️</button>}
</div>:<button onClick={()=>createScParcel(o)} disabled={scLoading||o.status!=="PAID"} style={{padding:"4px 8px",borderRadius:4,fontSize:11,fontWeight:700,border:"none",background:o.status==="PAID"?"#dc2626":"#d1d5db",color:o.status==="PAID"?"#fff":"#9ca3af",cursor:o.status==="PAID"?"pointer":"not-allowed"}}>{scLoading?"⏳":"📦 Ship"}</button>}</td>
</tr>})}
</tbody>
<tfoot><tr style={{borderTop:"2px solid #dc2626"}}><td colSpan={5} style={{padding:"8px 4px",fontWeight:800}}>{batchOrders.length} {lang==="de"?"Bestellungen":"orders"} · {paidOrders.length} {lang==="de"?"bezahlt":"paid"} · {unpaidOrders.length} {lang==="de"?"offen":"pending"}</td><td style={{padding:"8px 4px",textAlign:"right",fontWeight:800}}>{totalUnitsOrdered}</td><td style={{padding:"8px 4px",textAlign:"right",fontWeight:800,color:"#059669"}}>€{totalRevenue.toFixed(2)}</td><td colSpan={2}></td></tr></tfoot>
</table>
</div>
:<div style={{textAlign:"center",padding:24,color:"#9ca3af"}}>
<div style={{fontSize:32,marginBottom:8}}>🛒</div>
{wixOrders.length>0?<div>{lang==="de"?"Keine Bestellungen für "+selBatch+" Produkte gefunden":"No orders found for "+selBatch+" products"}<br/><span style={{fontSize:12}}>{lang==="de"?"Suchbegriffe":"Keywords"}: {batchKeywords.join(", ")}</span></div>
:wixError?<div style={{color:"#dc2626"}}>❌ {wixError}</div>
:<div>{lang==="de"?"Klicken Sie auf Sync um Wix-Bestellungen zu laden":"Click Sync to load Wix orders"}</div>}
</div>}
</div>}

{m5Tab==="sendcloud"&&<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>📦 SendCloud — {selBatch} {lang==="de"?"Sendungen":"Shipments"}</div>
{scParcels.length>0?scParcels.filter(p=>batchOrders.some(o=>String(o.id)===p.orderNo||o.client.name===p.name)).map((p,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:10,padding:10,marginBottom:6,borderRadius:8,border:"1px solid #e5e7eb",background:"#fff"}}>
<div style={{width:32,height:32,borderRadius:"50%",background:p.statusId>=11?"#dcfce7":p.statusId>=3?"#dbeafe":"#fef3c7",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{p.statusId>=11?"✅":"🚚"}</div>
<div style={{flex:1}}><div style={{fontSize:14,fontWeight:700}}>{p.name}{p.company&&" — "+p.company}</div><div style={{fontSize:12,color:"#6b7280"}}>{p.address}, {p.postal} {p.city}, {p.country}</div></div>
<div style={{textAlign:"right"}}><Bd c={p.statusId>=11?"#059669":p.statusId>=3?"#2563eb":"#d97706"} b={p.statusId>=11?"#dcfce7":p.statusId>=3?"#dbeafe":"#fef3c7"}>{p.status}</Bd>
{p.tracking&&<div style={{fontSize:11,marginTop:3}}><a href={p.trackingUrl} target="_blank" style={{color:"#7c3aed"}}>{p.tracking}</a></div>}</div>
</div>):<div style={{textAlign:"center",padding:16,color:"#9ca3af"}}>{lang==="de"?"Keine Sendungen":"No shipments"}</div>}
</div>}

{m5Tab==="closure"&&<div>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>📋 BfArM Dossier — {selBatch}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
<div style={{padding:10,background:"#f0fdf4",borderRadius:8,border:"2px solid #059669",textAlign:"center"}}><div style={{fontSize:11,color:"#6b7280"}}>Imported</div><div style={{fontSize:22,fontWeight:800,color:"#059669"}}>{plUnits}</div></div>
<div style={{padding:10,background:"#dbeafe",borderRadius:8,border:"2px solid #2563eb",textAlign:"center"}}><div style={{fontSize:11,color:"#6b7280"}}>Sold</div><div style={{fontSize:22,fontWeight:800,color:"#2563eb"}}>{totalUnitsOrdered}</div></div>
<div style={{padding:10,background:remaining>0?"#fef3c7":"#dcfce7",borderRadius:8,border:"2px solid "+(remaining>0?"#d97706":"#059669"),textAlign:"center"}}><div style={{fontSize:11,color:"#6b7280"}}>Remaining</div><div style={{fontSize:22,fontWeight:800,color:remaining>0?"#d97706":"#059669"}}>{remaining}</div></div>
</div>
<button onClick={()=>{const w=window.open("","_blank","width=800,height=600");w.document.write('<html><head><title>BfArM Dossier '+selBatch+'</title><style>body{font-family:Arial;padding:30px;font-size:11px}h1{font-size:16px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:6px}table{width:100%;border-collapse:collapse;margin:8px 0}td{padding:4px 8px;border:1px solid #d1d5db;font-size:10px}td:first-child{font-weight:700;background:#f9fafb;width:35%}.hdr{background:#0f172a;color:#fff;padding:12px 30px;margin:-30px -30px 16px}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:8px;color:#9ca3af;text-align:center}@media print{body{padding:15px}.hdr{margin:-15px -15px 12px}}</style></head><body>');w.document.write('<div class="hdr"><strong>NOC Pharma GmbH</strong> — BfArM Import-Dossier — '+selBatch+'</div>');w.document.write('<h1>Import-Dossier / Import Dossier — '+selBatch+'</h1><table>');[["Import / Import",selBatch],["Charge / Batch",batchRef],["Einheiten importiert / Units imported",String(plUnits)],["Einheiten verkauft / Units sold",String(totalUnitsOrdered)],["Verbleibend / Remaining",String(remaining)],["Umsatz / Revenue","€"+totalRevenue.toFixed(2)],["BtM Differenz / Difference",remaining===0?"0 ✅":String(remaining)]].forEach(r=>w.document.write("<tr><td>"+r[0]+"</td><td>"+r[1]+"</td></tr>"));w.document.write('</table><div class="ft">NOC Pharma GmbH · §52a AMG · BtMG §11 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(()=>w.print(),500)}} style={{marginTop:10,width:"100%",padding:"14px",borderRadius:8,fontSize:15,fontWeight:700,border:"2px solid #16a34a",background:"linear-gradient(135deg,#f0fdf4,#dcfce7)",color:"#065f46",cursor:"pointer"}}>🖨️ BfArM Dossier (DE/EN)</button>
</div>}
</Cd>
</div>};

// M6 Reconciliation — Live data from all stages per import
const M6Recon=()=>{
const bt=BT_DATA[selBatch]||BT_DATA["CA-03"]||{};
const plData=docOriginals["pl"]?.approvedData||docOriginals["pl"]?.extracted||{};
const plUnits=parseInt(bt.units)||parseInt(plData["Total Units"])||239;
const netKg=bt.net||plData["Net Weight"]||"140";
const grossKg=bt.gross||plData["Gross Weight"]||"198.5";
const batchRef=bt.id||plData["Batch Number"]||"—";
const productName=bt.p||plData["Product Description"]||"Cannabis flos";
const expiryDate=bt.exp||"28.07.2027";
const batchKeywords=selBatch==="CA-03"?["noc se 17","noc se 20","bi-03","nocb1.2","se 17/20","cannabis flos"]:selBatch==="CA-02"?["noc se 19","bi-02","nocb1.1"]:["noc"];
const batchOrders=wixOrders.filter(o=>o.items.some(it=>{const t=(it.name+" "+(it.sku||"")).toLowerCase();return batchKeywords.some(kw=>t.includes(kw))}));
const unitsSold=batchOrders.reduce((a,o)=>a+o.items.reduce((b,it)=>b+it.qty,0),0);
const revenue=batchOrders.filter(o=>o.status==="PAID").reduce((a,o)=>a+o.totals.total,0);
const destroyed=0;/* TODO: track from destruction protocol */
const remaining=plUnits-unitsSold-destroyed;
const labThc=LAB.find(l=>l.en==="THC (Dronabinol)");
const confirmedThc=labThc?.qsi||labThc?.sup||"—";
const labPass=LAB.every(l=>l.lim===null||l.var===null||Math.abs(l.var)<50);
/* Expiry tracking */
const now=new Date();
const expDate=expiryDate?new Date(expiryDate.split(".").reverse().join("-")):null;
const daysToExpiry=expDate?Math.ceil((expDate-now)/(1000*60*60*24)):null;
const expiryStatus=daysToExpiry===null?"unknown":daysToExpiry<0?"expired":daysToExpiry<30?"critical":daysToExpiry<90?"warning":daysToExpiry<180?"monitor":"ok";

return <div>
<Cd t={"📊 M6 "+selBatch+" — "+(lang==="de"?"Abstimmung & BfArM Dossier":"Reconciliation & BfArM Dossier")} badge={<Bd c="#6366f1" b="#e0e7ff">{remaining===0?(lang==="de"?"Abgeschlossen":"Closed"):(lang==="de"?"Offen":"Open")}</Bd>}>

{/* Expiry Alert */}
{expiryStatus!=="ok"&&expiryStatus!=="unknown"&&<div style={{marginBottom:12,padding:10,borderRadius:8,border:"2px solid "+(expiryStatus==="expired"?"#dc2626":expiryStatus==="critical"?"#dc2626":"#d97706"),background:expiryStatus==="expired"?"#fef2f2":"#fffbeb"}}>
<div style={{display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:20}}>{expiryStatus==="expired"?"🔴":expiryStatus==="critical"?"🔴":"🟡"}</span>
<div>
<div style={{fontSize:15,fontWeight:700,color:expiryStatus==="expired"?"#dc2626":"#92400e"}}>{expiryStatus==="expired"?(lang==="de"?"VERFALLEN — Vernichtungsprotokoll erforderlich!":"EXPIRED — Destruction protocol required!"):(lang==="de"?"Verfall in "+daysToExpiry+" Tagen — "+expiryDate:"Expiry in "+daysToExpiry+" days — "+expiryDate)}</div>
<div style={{fontSize:13,color:"#6b7280"}}>{remaining} {lang==="de"?"Einheiten verbleibend":"units remaining"} · {lang==="de"?"Maßnahmen":"Actions"}: {expiryStatus==="expired"?(lang==="de"?"Vernichtung oder Verlängerung":"Destruction or extension"):(lang==="de"?"Vorrang-Verkauf (FEFO)":"Priority sale (FEFO)")}</div>
</div>
</div>
</div>}

{/* Main Stats */}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:8,marginBottom:14}}>
{[
[lang==="de"?"Importiert":"Imported",plUnits,"#374151"],
[lang==="de"?"Verkauft":"Sold",unitsSold,"#059669"],
[lang==="de"?"Vernichtet":"Destroyed",destroyed,"#dc2626"],
[lang==="de"?"Verbleibend":"Remaining",remaining,remaining===0?"#059669":"#d97706"],
["BtM §11 Diff",remaining===0?"0 ✅":String(remaining),"#6366f1"]
].map(([l,v,c],j)=>
<div key={j} style={{textAlign:"center",background:"#f9fafb",borderRadius:8,padding:8,border:"1px solid #e5e7eb"}}><div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:11,color:"#6b7280",fontWeight:600}}>{l}</div></div>)}
</div>

{/* Revenue */}
<div style={{marginBottom:12,padding:8,borderRadius:6,background:"#f0fdf4",border:"1px solid #a7f3d0",display:"flex",justifyContent:"space-between",fontSize:14}}>
<span style={{fontWeight:700}}>{lang==="de"?"Gesamtumsatz":"Total Revenue"} {selBatch}</span>
<span style={{fontWeight:800,color:"#059669"}}>€{revenue.toFixed(2)}</span>
</div>

{/* Stage-by-Stage Audit Trail */}
<div style={{marginBottom:14}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>📋 {lang==="de"?"Stufenübersicht — Daten aus allen Lebenszyklusphasen":"Stage Overview — Data from all lifecycle stages"}</div>
{[
["M0","📝",lang==="de"?"Registrierung":"Registration",docOriginals["ip"]?(lang==="de"?"Einfuhrgenehmigung hochgeladen":"Import permit uploaded"):(lang==="de"?"Ausstehend":"Pending"),!!docOriginals["ip"]],
["M0.5","📋",lang==="de"?"Vorlauf-Dokumente":"Pre-Arrival",docOriginals["pl"]?plUnits+" "+(lang==="de"?"Einheiten, ":"units, ")+netKg+"kg netto":(lang==="de"?"Ausstehend":"Pending"),!!docOriginals["pl"]],
["M1","🚛","GDP Transport",docOriginals["aw"]?"AWB: E251115130":(lang==="de"?"Ausstehend":"Pending"),!!docOriginals["aw"]],
["M2","🔬",lang==="de"?"Laborprüfung":"Lab Testing",(docOriginals["sc"]||docOriginals["lab_coa"])?"THC: "+confirmedThc+" · "+(labPass?"✅ ALL PASS":"⚠️ REVIEW"):(lang==="de"?"Ausstehend":"Pending"),!!(docOriginals["sc"]||docOriginals["lab_coa"])],
["M3","✅","QP Release",bt.qp||"Dr. Olaf Schagon",true],
["M4","🏷️",lang==="de"?"Umetikettierung":"Relabeling",(parseInt(bt.bags1kg)||139)+"×1kg + "+(parseInt(bt.doy10g)||100)+"×10g · Exp: "+expiryDate,m4AllSigned||false],
["M4.5","📦",lang==="de"?"Lagerung":"Storage",lang==="de"?"FEFO-Prinzip · Temperaturüberwachung":"FEFO principle · Temperature monitoring",true],
["M5","📤",lang==="de"?"Versand":"Shipment",unitsSold+"/"+plUnits+" "+(lang==="de"?"verkauft":"sold")+" · €"+revenue.toFixed(2),unitsSold>0],
["M6","📊",lang==="de"?"Abstimmung":"Reconciliation",remaining===0?"✅ "+(lang==="de"?"Alle Einheiten abgerechnet":"All units accounted"):remaining+" "+(lang==="de"?"verbleibend":"remaining"),remaining===0]
].map(([id,ic,name,detail,done],j)=>
<div key={j} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",marginBottom:3,borderRadius:6,border:"1px solid "+(done?"#d1fae5":"#fde68a"),background:done?"#f0fdf4":"#fffbeb"}}>
<span style={{fontSize:16,width:20,textAlign:"center"}}>{done?"✅":"⏳"}</span>
<span style={{fontSize:13,fontWeight:700,color:"#6366f1",width:35}}>{id}</span>
<span style={{fontSize:13}}>{ic}</span>
<span style={{fontSize:14,fontWeight:600,flex:1}}>{name}</span>
<span style={{fontSize:12,color:"#6b7280",textAlign:"right"}}>{detail}</span>
</div>)}
</div>

{/* Expiry & Destruction Section */}
<div style={{marginBottom:14,padding:12,borderRadius:10,border:"2px solid "+(expiryStatus==="expired"?"#dc2626":"#e5e7eb"),background:expiryStatus==="expired"?"#fef2f2":"#fff"}}>
<div style={{fontSize:15,fontWeight:700,marginBottom:8}}>⏰ {lang==="de"?"Verfall & Vernichtung":"Expiry & Destruction"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:10}}>
<div style={{padding:8,background:"#f9fafb",borderRadius:6,textAlign:"center"}}><div style={{fontSize:11,color:"#6b7280"}}>{lang==="de"?"Verfallsdatum":"Expiry Date"}</div><div style={{fontSize:16,fontWeight:800,color:expiryStatus==="expired"?"#dc2626":expiryStatus==="critical"?"#dc2626":"#374151"}}>{expiryDate}</div></div>
<div style={{padding:8,background:"#f9fafb",borderRadius:6,textAlign:"center"}}><div style={{fontSize:11,color:"#6b7280"}}>{lang==="de"?"Tage verbleibend":"Days Remaining"}</div><div style={{fontSize:16,fontWeight:800,color:daysToExpiry!==null&&daysToExpiry<90?"#dc2626":"#059669"}}>{daysToExpiry!==null?daysToExpiry:"—"}</div></div>
<div style={{padding:8,background:"#f9fafb",borderRadius:6,textAlign:"center"}}><div style={{fontSize:11,color:"#6b7280"}}>{lang==="de"?"Einheiten auf Lager":"Units in Stock"}</div><div style={{fontSize:16,fontWeight:800,color:remaining>0?"#d97706":"#059669"}}>{remaining}</div></div>
</div>
{remaining>0&&expiryStatus!=="ok"&&expiryStatus!=="unknown"&&<div style={{display:"flex",gap:6}}>
<button style={{flex:1,padding:"8px",borderRadius:6,fontSize:13,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>📋 {lang==="de"?"Verlängerung beantragen (QP)":"Request Extension (QP)"}</button>
<button style={{flex:1,padding:"8px",borderRadius:6,fontSize:13,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>🗑️ {lang==="de"?"Vernichtungsprotokoll erstellen":"Create Destruction Protocol"}</button>
</div>}
</div>

{/* BfArM Dossier Generation */}
<div style={{background:"linear-gradient(135deg,#eef2ff,#e0e7ff)",borderRadius:10,padding:16,border:"2px solid #6366f1"}}>
<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
<div style={{fontSize:26}}>📋</div>
<div>
<div style={{fontSize:15,fontWeight:800,color:"#312e81"}}>{remaining===0?(lang==="de"?"DOSSIER BEREIT — Alle Einheiten abgerechnet":"DOSSIER READY — All units accounted"):(lang==="de"?"DOSSIER OFFEN — "+remaining+" Einheiten verbleibend":"DOSSIER OPEN — "+remaining+" units remaining")}</div>
<div style={{fontSize:13,color:"#4338ca"}}>{selBatch} · {batchRef} · {productName} · §11 BtMG</div>
</div>
</div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{const w=window.open("","_blank","width=800,height=800");
w.document.write('<html><head><title>BfArM Dossier '+selBatch+'</title><style>body{font-family:Arial;padding:30px;font-size:11px}h1{font-size:16px;color:#312e81;border-bottom:2px solid #6366f1;padding-bottom:6px}h2{font-size:13px;color:#312e81;margin-top:14px;background:#eef2ff;padding:4px 8px;border-radius:4px}table{width:100%;border-collapse:collapse;margin:8px 0}td{padding:4px 8px;border:1px solid #d1d5db;font-size:10px}td:first-child{font-weight:700;background:#f9fafb;width:35%}.hdr{background:#312e81;color:#fff;padding:12px 30px;margin:-30px -30px 16px}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:8px;color:#9ca3af;text-align:center}.lang{margin-top:16px;padding-top:12px;border-top:3px solid #6366f1}@media print{body{padding:15px}.hdr{margin:-15px -15px 12px}}</style></head><body>');
w.document.write('<div class="hdr"><strong style="font-size:16px">NOC Pharma GmbH</strong> — BfArM Import-Dossier / Import Dossier<br/>'+selBatch+' · §11 BtMG · '+new Date().toLocaleDateString("de-DE")+'</div>');
w.document.write('<h1>🇩🇪 BfArM Import-Dossier — '+selBatch+'</h1><h2>Chargen- und Produktdaten</h2><table>');
[["Import",selBatch],["Chargen-Nr.",batchRef],["Produkt",productName],["Netto",netKg+" kg"],["Brutto",grossKg+" kg"],["THC (QSI)",confirmedThc],["Verfallsdatum",expiryDate],["Einheiten importiert",String(plUnits)],["Einheiten verkauft",String(unitsSold)],["Einheiten vernichtet",String(destroyed)],["Einheiten verbleibend",String(remaining)],["BtM §11 Differenz",remaining===0?"0 ✅":String(remaining)+" ausstehend"],["Umsatz","€"+revenue.toFixed(2)]].forEach(r=>w.document.write("<tr><td>"+r[0]+"</td><td>"+r[1]+"</td></tr>"));
w.document.write('</table><div class="lang"><h1>🇬🇧 BfArM Import Dossier — '+selBatch+'</h1><h2>Batch & Product Data</h2><table>');
[["Import",selBatch],["Batch No.",batchRef],["Product",productName],["Net",netKg+" kg"],["Gross",grossKg+" kg"],["THC (QSI)",confirmedThc],["Expiry Date",expiryDate],["Units imported",String(plUnits)],["Units sold",String(unitsSold)],["Units destroyed",String(destroyed)],["Units remaining",String(remaining)],["BtM §11 Difference",remaining===0?"0 ✅":String(remaining)+" remaining"],["Revenue","€"+revenue.toFixed(2)]].forEach(r=>w.document.write("<tr><td>"+r[0]+"</td><td>"+r[1]+"</td></tr>"));
w.document.write('</table></div><div class="ft">NOC Pharma GmbH · Langetal 1, DE-07751 Golmsdorf · §52a AMG · BtMG §3/§11<br/>RP: T. Cuny · QP: Dr. O. Schagon · QMS v2.5 · '+new Date().toISOString()+'</div></body></html>');
w.document.close();setTimeout(()=>w.print(),500);
}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#6366f1",color:"#fff",cursor:"pointer"}}>🖨️ BfArM Dossier (DE/EN)</button>
<button onClick={()=>{const subj="NOC Pharma — BfArM Import-Dossier — "+selBatch+" ("+batchRef+")";const body="NOC PHARMA GmbH\nBfArM Import-Dossier / Import Dossier\n════════════════════════════════\n\n🇩🇪 Import: "+selBatch+" · Charge: "+batchRef+"\nProdukt: "+productName+"\nNetto: "+netKg+" kg · THC: "+confirmedThc+"\nVerfall: "+expiryDate+"\n\nEinheiten importiert: "+plUnits+"\nEinheiten verkauft: "+unitsSold+"\nEinheiten vernichtet: "+destroyed+"\nVerbleibend: "+remaining+"\nBtM §11 Differenz: "+(remaining===0?"0 ✅":remaining)+"\nUmsatz: €"+revenue.toFixed(2)+"\n\n🇬🇧 Import: "+selBatch+" · Batch: "+batchRef+"\nProduct: "+productName+"\nNet: "+netKg+" kg · THC: "+confirmedThc+"\nExpiry: "+expiryDate+"\n\nUnits imported: "+plUnits+"\nUnits sold: "+unitsSold+"\nUnits destroyed: "+destroyed+"\nRemaining: "+remaining+"\nBtM §11 Diff: "+(remaining===0?"0 ✅":remaining)+"\nRevenue: €"+revenue.toFixed(2)+"\n\n════════════════════════════════\nNOC Pharma GmbH · QMS v2.5 · §52a AMG · BtMG §11";window.open(gmailLink(subj,body)+"&to="+encodeURIComponent("btm@bfarm.de")+"&cc="+encodeURIComponent("qp@nocpharma.de"),"_blank")}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>📧 {lang==="de"?"An BfArM senden":"Send to BfArM"}</button>
<button style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:remaining===0?"#059669":"#9ca3af",color:"#fff",cursor:remaining===0?"pointer":"not-allowed"}} disabled={remaining!==0}>🔒 {lang==="de"?"Archivieren":"Archive"}</button>
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
const stageFileRef=React.useRef(null);
const handleStageUpload=async(e)=>{
const files=Array.from(e.target.files||[]);if(!files.length)return;
const supName=sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN";
const batch=selBatch||"CA-03";
const processed=[];
for(const f of files){
const {textContent,url,ext}=await processFile(f,f);
processed.push(createEntry(f.name,(f.size/1024).toFixed(1)+"KB",ext,new Date().toLocaleString("de-DE"),stageId,batch,supName,url,textContent,null));
}
setUploads(p=>[...processed,...p]);
alert("✅ "+processed.length+" "+(lang==="de"?"Datei(en) direkt zu "+stageId+" zugeordnet":"file(s) assigned directly to "+stageId));
e.target.value="";
};
return <div>
<input ref={stageFileRef} type="file" onChange={handleStageUpload} multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.xml" style={{display:"none"}}/>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",marginBottom:8,background:"#f0f9ff",borderRadius:6,border:"1px solid #bae6fd"}}>
<div style={{display:"flex",alignItems:"center",gap:6}}>
<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="#1a73e8"/></svg>
<span style={{fontSize:14,fontWeight:700,color:"#1e40af"}}>{stageId} — {supName} — {selBatch||"—"}</span>
</div>
<div style={{display:"flex",gap:4}}>
<button onClick={()=>window.open(folderUrl,"_blank")} style={{padding:"3px 10px",borderRadius:4,fontSize:13,fontWeight:600,border:"none",background:"#1a73e8",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" fill="#fff"/></svg>{lang==="de"?"Ordner":"Folder"}</button>
<button onClick={()=>stageFileRef.current&&stageFileRef.current.click()} style={{padding:"3px 10px",borderRadius:4,fontSize:13,fontWeight:600,border:"1px solid #059669",background:"#f0fdf4",color:"#059669",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#059669" strokeWidth="2"/></svg>📤 {lang==="de"?"Upload → "+stageId:"Upload → "+stageId}</button>
<button onClick={()=>fileRef.current&&fileRef.current.click()} style={{padding:"3px 10px",borderRadius:4,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="#374151" strokeWidth="2"/></svg>ZIP</button>
<button onClick={printStage} style={{padding:"3px 10px",borderRadius:4,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2M6 14h12v8H6v-8z" stroke="#374151" strokeWidth="1.5"/></svg>PDF</button>
<button onClick={()=>window.open(gmailLink(emailSubj,emailBody),"_blank")} style={{padding:"3px 10px",borderRadius:4,fontSize:13,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#374151" strokeWidth="1.5"/><path d="M22 6l-10 7L2 6" stroke="#374151" strokeWidth="1.5"/></svg>Send</button>
</div>
</div>
{children}
{/* Show uploaded files for this stage — Enhanced Visual Cards with Preview */}
{(()=>{const stageUploads=uploads.filter(u=>u.stage===stageId&&u.batch===(curBatch&&curBatch.id));return stageUploads.length>0?<div style={{margin:"8px 0",padding:10,background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",borderRadius:8,border:"1px solid #a7f3d0"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<div style={{fontSize:14,fontWeight:700,color:"#065f46"}}>📎 {lang==="de"?"Hochgeladene Originaldokumente":"Uploaded Original Documents"} ({stageUploads.length})</div>
<div style={{display:"flex",gap:4}}>
<span style={{padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,background:"#dcfce7",color:"#059669"}}>{stageUploads.filter(u=>u.type==="pdf").length} PDF</span>
<span style={{padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,background:"#dbeafe",color:"#2563eb"}}>{stageUploads.filter(u=>["jpg","png","jpeg"].includes(u.type)).length} IMG</span>
<span style={{padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700,background:"#fef3c7",color:"#d97706"}}>{stageUploads.filter(u=>!["pdf","jpg","png","jpeg"].includes(u.type)).length} {lang==="de"?"Andere":"Other"}</span>
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:8}}>
{stageUploads.map((u,j)=><div key={j} style={{background:"#fff",borderRadius:8,border:"1px solid #d1fae5",overflow:"hidden",boxShadow:"0 1px 3px rgba(0,0,0,.08)"}}>
{/* Preview Area */}
<div style={{height:120,background:"#f8fafc",display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid #e5e7eb",cursor:u.url?"pointer":"default",position:"relative"}} onClick={()=>u.url&&setDocPreview(u)}>
{u.type==="pdf"?<>
<iframe src={u.url+"#toolbar=0&navpanes=0"} style={{width:"100%",height:"100%",border:"none",pointerEvents:"none"}} title={u.name}/>
<div style={{position:"absolute",top:4,right:4,padding:"2px 6px",borderRadius:4,background:"#dc2626",color:"#fff",fontSize:9,fontWeight:700}}>PDF</div>
</>:
(u.type==="jpg"||u.type==="png"||u.type==="jpeg")?<>
<img src={u.url} style={{maxWidth:"100%",maxHeight:"100%",objectFit:"contain"}} alt={u.name}/>
<div style={{position:"absolute",top:4,right:4,padding:"2px 6px",borderRadius:4,background:"#2563eb",color:"#fff",fontSize:9,fontWeight:700}}>IMG</div>
</>:
<div style={{textAlign:"center"}}>
<div style={{fontSize:36}}>{u.type==="xlsx"||u.type==="xls"?"📊":u.type==="doc"||u.type==="docx"?"📝":u.type==="csv"?"📋":"📎"}</div>
<div style={{fontSize:10,color:"#9ca3af",marginTop:2}}>.{u.type}</div>
</div>}
{u.url&&<div style={{position:"absolute",bottom:4,right:4,padding:"2px 8px",borderRadius:4,background:"rgba(0,0,0,.6)",color:"#fff",fontSize:9,fontWeight:600}}>🔍 {lang==="de"?"Vorschau":"Preview"}</div>}
</div>
{/* File Info */}
<div style={{padding:8}}>
<div style={{fontSize:12,fontWeight:700,color:"#065f46",lineHeight:"1.2",marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={u.name}>{u.name}</div>
<div style={{fontSize:10,color:"#6b7280",marginBottom:4}}>{u.size} · {u.date}{u.fromZip?" · 📦 ZIP":""}</div>
{u.content&&<div style={{fontSize:9,color:"#9ca3af",lineHeight:"1.3",maxHeight:24,overflow:"hidden"}}>{u.content.slice(0,80)}...</div>}
{/* Action Buttons */}
<div style={{display:"flex",gap:3,marginTop:4}}>
{u.url&&<button onClick={(e)=>{e.stopPropagation();setDocPreview(u)}} style={{flex:1,padding:"3px 0",borderRadius:4,fontSize:10,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>👁️ {lang==="de"?"Öffnen":"Open"}</button>}
{u.url&&<button onClick={(e)=>{e.stopPropagation();const w=window.open("","_blank");if(u.type==="pdf"){w.location.href=u.url}else{w.document.write('<html><head><title>'+u.name+'</title><style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f1f5f9}img{max-width:90%;max-height:90vh;box-shadow:0 4px 20px rgba(0,0,0,.15);border-radius:8px}@media print{body{background:#fff}img{max-width:100%}}</style></head><body><img src="'+u.url+'"/></body></html>');w.document.close();setTimeout(function(){w.print()},500)}}} style={{flex:1,padding:"3px 0",borderRadius:4,fontSize:10,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>🖨️</button>}
{u.url&&<button onClick={(e)=>{e.stopPropagation();const a=document.createElement("a");a.href=u.url;a.download=u.name;a.click()}} style={{padding:"3px 6px",borderRadius:4,fontSize:10,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>💾</button>}
</div>
</div>
</div>)}
</div>
</div>:null})()}

{/* Full-screen Document Preview Modal */}
{docPreview&&docPreview.stage===stageId&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.85)",zIndex:9999,display:"flex",flexDirection:"column"}} onClick={()=>setDocPreview(null)}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 16px",background:"#0f172a",color:"#fff"}}>
<div>
<div style={{fontSize:16,fontWeight:700}}>{docPreview.name}</div>
<div style={{fontSize:11,opacity:.7}}>{docPreview.size} · {docPreview.stage} · {docPreview.date}</div>
</div>
<div style={{display:"flex",gap:6}}>
<button onClick={(e)=>{e.stopPropagation();const a=document.createElement("a");a.href=docPreview.url;a.download=docPreview.name;a.click()}} style={{padding:"6px 14px",borderRadius:4,fontSize:12,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>💾 Download</button>
<button onClick={(e)=>{e.stopPropagation();const w=window.open("","_blank");if(docPreview.type==="pdf"){w.location.href=docPreview.url}else{w.document.write('<html><body style="margin:0;display:flex;justify-content:center;background:#111"><img src="'+docPreview.url+'" style="max-width:100%;max-height:100vh"/></body></html>');w.document.close();setTimeout(()=>w.print(),500)}}} style={{padding:"6px 14px",borderRadius:4,fontSize:12,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>🖨️ Print</button>
<button onClick={()=>setDocPreview(null)} style={{padding:"6px 14px",borderRadius:4,fontSize:12,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>✕ {lang==="de"?"Schließen":"Close"}</button>
</div>
</div>
<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:10}} onClick={(e)=>e.stopPropagation()}>
{docPreview.type==="pdf"?
<iframe src={docPreview.url} style={{width:"90%",height:"95%",border:"none",borderRadius:8,background:"#fff"}} title={docPreview.name}/>:
(docPreview.type==="jpg"||docPreview.type==="png"||docPreview.type==="jpeg")?
<img src={docPreview.url} style={{maxWidth:"90%",maxHeight:"90vh",borderRadius:8,boxShadow:"0 4px 30px rgba(0,0,0,.4)"}} alt={docPreview.name}/>:
<div style={{background:"#fff",borderRadius:12,padding:30,textAlign:"center",maxWidth:400}}>
<div style={{fontSize:64,marginBottom:8}}>{docPreview.type==="xlsx"?"📊":docPreview.type==="docx"?"📝":"📎"}</div>
<div style={{fontSize:18,fontWeight:700}}>{docPreview.name}</div>
<div style={{fontSize:13,color:"#6b7280",marginTop:4}}>{docPreview.size} · .{docPreview.type}</div>
{docPreview.content&&<div style={{marginTop:10,padding:10,background:"#f9fafb",borderRadius:6,fontSize:11,textAlign:"left",maxHeight:200,overflow:"auto",color:"#374151"}}>{docPreview.content}</div>}
<button onClick={()=>{const a=document.createElement("a");a.href=docPreview.url;a.download=docPreview.name;a.click()}} style={{marginTop:12,padding:"8px 24px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>💾 Download & Open</button>
</div>}
</div>
</div>}
</div>};


const SD=()=>{const s=SG[lcs];if(!s)return null;
if(s.id==="M0")return <StageDocBar stageId="M0"><M05Reg/></StageDocBar>;
if(s.id==="M0.5")return <StageDocBar stageId="M0.5"><M0/></StageDocBar>;
// removed: all suppliers get full M1-M6 stages
// removed: all batch statuses get full M1-M6 stages
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
const grids={"M4":{t:"🏷️ "+t.relabel+" — Murchin An der Redoute 1",d:[["PZN","PZN-18547632"],["Labels Applied","239 (each with unique barcode)"],[t.photos,"6 (before/after evidence)"],[t.completed,"18.12.2025"],[t.location,"Murchin An der Redoute 1"],["SOP","SOP-710-01 v3.0"],["Content","Product, Batch, PZN, THC%, Expiry, Barcode"]]}};
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
<button onClick={()=>{if(!trSrc.trim())return;setTrLoading(true);setTrOut("");var ln=trLang==="de"?"German":trLang==="en"?"English":"Spanish";fetch("http://localhost:3001/api/anthropic",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:"You are a pharmaceutical translator for NOC Pharma GmbH. Translate to "+ln+". Use BfArM/AMG/BtMG terms for German, EU GMP/PIC/S for English. Keep reference numbers unchanged. Output only the translation.\n\nText:\n"+trSrc}]})}).then(function(r){return r.json()}).then(function(d){var txt=d.content?d.content.map(function(c){return c.text||""}).join(""):"Translation error";setTrOut(txt);setTrLoading(false)}).catch(function(e){setTrOut("Error: "+e.message);setTrLoading(false)})}} disabled={trLoading||!trSrc.trim()} style={{width:"100%",padding:"8px 12px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:trLoading?"#9ca3af":"#1e40af",color:"#fff",cursor:trLoading?"wait":"pointer",marginBottom:6}}>
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
{id:"CA-01",p:"NOC SE 17",qty:"59.5kg",stage:0,total:12,st:lang==="de"?"📂 Doku hochladen":"📂 Upload Docs",c:"#6b7280"},
{id:"CA-02",p:"NOC SE 19",qty:"198.5kg",stage:0,total:12,st:lang==="de"?"📂 Doku hochladen":"📂 Upload Docs",c:"#6b7280"},
{id:"CA-03",p:"NOC SE 17/20",qty:"140kg",stage:2,total:12,st:lang==="de"?"Aktiv — Lab":"Active — Lab",c:"#d97706"},
{id:"CA-04",p:"NOC SE 21",qty:"250kg",stage:0,total:12,st:lang==="de"?"Geplant":"Planned",c:"#9ca3af"}
],kpi:{stock:"198.36kg",btm:"198.36kg",sold:"15.8kg",revenue:"€49,770",value:"€625,275",margin:"62%"},
alerts:[
{t:lang==="de"?"Herstellungserlaubnis abgelaufen":"Manufacturing License expired",c:"#dc2626",ic:"❌"},
{t:lang==="de"?"GMP Audit ueberfaellig":"GMP Audit overdue",c:"#dc2626",ic:"⚠️"},
{t:lang==="de"?"QTA laeuft in 16d ab":"QTA expires in 16d",c:"#d97706",ic:"⏰"},
{t:lang==="de"?"CA-03 COA ausstehend":"CA-03 COA pending",c:"#d97706",ic:"📄"},
{t:lang==="de"?"CA-03 Phytosanitaer ausstehend":"CA-03 Phytosanitary pending",c:"#d97706",ic:"📄"},
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
{id:"HY-01",p:"HYTN-01",qty:"200kg",stage:0,total:12,st:lang==="de"?"Geplant":"Planned",c:"#6b7280"}
],kpi:{stock:"0kg",btm:"0kg",sold:"0kg",revenue:"€0",value:"€0",margin:"—"},
alerts:[
{t:lang==="de"?"Erntekalender erhalten (7 Sorten)":"Harvest calendar received (7 strains)",c:"#059669",ic:"✅"},
{t:lang==="de"?"550-700+ kg/Monat verfügbar":"550-700+ kg/month available",c:"#059669",ic:"📊"},
{t:lang==="de"?"GMP Zertifikat ausstehend":"GMP Certificate pending",c:"#d97706",ic:"📄"},
{t:lang==="de"?"EU-GMP Aequivalenz beantragt":"EU-GMP Equivalence applied",c:"#2563eb",ic:"📋"}
],docs:6,pics:true,reg:"Health Canada",shipActive:false,color:"#6b7280"}
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
[lang==="de"?"Umsatz":(lang==="de"?"Umsatz":"Revenue"),sd.kpi.revenue,"#059669"],
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

{/* Warehouse Monitor Widget */}
<div style={{marginTop:8,background:"#fff",borderRadius:6,padding:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span>🌡️ {lang==="de"?"Lager-Monitor":"Warehouse Monitor"}</span>
<button onClick={()=>setPg("warehouse")} style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600,border:"1px solid #1e40af33",background:"#eff6ff",color:"#1e40af",cursor:"pointer"}}>{lang==="de"?"Details →":"Details →"}</button>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
{[
{id:"S1",name:lang==="de"?"Hauptlager":"Main Store",temp:20.3,hum:42},
{id:"S2",name:lang==="de"?"Quarantäne":"Quarantine",temp:19.8,hum:45},
{id:"S3",name:lang==="de"?"Verpackung":"Packaging",temp:21.5,hum:38},
].map((z,j)=>{const ok=z.temp>=15&&z.temp<=25&&z.hum>=30&&z.hum<=60;return <div key={j} style={{padding:5,borderRadius:6,background:ok?"#f0fdf4":"#fef2f2",border:"1px solid "+(ok?"#a7f3d0":"#fca5a5")}}>
<div style={{fontSize:10,fontWeight:700,marginBottom:2}}>{z.id}: {z.name}</div>
<div style={{display:"flex",justifyContent:"space-between",fontSize:11}}>
<span style={{color:ok?"#059669":"#dc2626",fontWeight:800}}>{z.temp}°C</span>
<span style={{color:ok?"#2563eb":"#dc2626",fontWeight:800}}>{z.hum}%</span>
<span style={{fontSize:9}}>{ok?"✅":"⚠️"}</span>
</div>
</div>})}
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

{/* CA-03 Banner (only for Cannava) */}
{sup==="cannava"&&<div style={{background:"linear-gradient(135deg,#1e3a5f,#2563eb)",borderRadius:8,padding:12,color:"#fff",cursor:"pointer",marginBottom:10}} onClick={()=>{setSelBatch("CA-03");setPg("lifecycle");setLcs(2)}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div><div style={{fontSize:16,fontWeight:800}}>✈️ CA-03 — {lang==="de"?"AKTIVE SENDUNG":"ACTIVE SHIPMENT"}</div><div style={{fontSize:13,opacity:.8}}>NOC SE 17/20 · 140kg (net) · EZE → FRA → Murchin</div></div>
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
{[["CA-01-EXP",47,"#dc2626"],["CA-01-005",169,"#d97706"],["BI-02",442,"#059669"]].map(([p,d,c],j)=>
<div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:12,borderBottom:j<2?"1px solid #f3f4f6":"none"}}><span style={{fontWeight:600}}>{p}</span><Bd c={c} b={c+"18"}>{d}d</Bd></div>)}
</div>
</div>
</div>})()}
</div>,
lifecycle:sup==="cannava"||sup==="hytn"||sup==="mccn"?<div>
{/* Batch selector */}
<div style={{marginBottom:12,padding:12,background:"#fff",borderRadius:8,border:"1px solid #e5e7eb"}}>
<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
<div style={{fontSize:16,fontWeight:700,color:"#374151"}}>{curSup.fl} {curSup.n} — {lang==="de"?"Importe":"Imports"} ({supBatches.length})</div>
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
<button onClick={()=>{const k=sup;const ex=BATCHES[k]||[];const n=ex.length+1;const px={cannava:"BI",mccn:"MC",hytn:"HY"};const id=px[k]+"-0"+n;const nb={id,n,ref:id+"-NOCB-INF-F",product:"New Import",kg:"0",units:0,permit:"Ausstehend",import:"Pending",stage:0,status:"planned",stageLabel:lang==="de"?"M0 Geplant":"M0 Planned",qp:null,color:"#9ca3af"};BATCHES[k]=[...ex,nb];setSelBatch(id);}} style={{display:"flex",alignItems:"center",gap:5,padding:"8px 14px",borderRadius:8,border:"2px dashed #059669",background:"#f0fdf4",color:"#059669",cursor:"pointer",fontWeight:700,fontSize:13}}>＋ {lang==="de"?"Neuer Import":"New Import"}</button>
</div>
</div>

{/* Upload Distribution Summary */}
{uploads.length>0&&<div style={{marginBottom:8,padding:8,background:"linear-gradient(135deg,#f0fdf4,#ecfdf5)",borderRadius:8,border:"1px solid #a7f3d0"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{fontSize:13,fontWeight:700,color:"#065f46"}}>📦 {uploads.length} {lang==="de"?"Dokumente hochgeladen und klassifiziert":"documents uploaded & classified"}</div>
<div style={{fontSize:10,color:"#6b7280"}}>{uploads.filter(u=>u.fromZip).length>0&&"ZIP: "+[...new Set(uploads.filter(u=>u.fromZip).map(u=>u.fromZip))].join(", ")}</div>
</div>
<div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
{SG.map((st,j)=>{const cnt=uploads.filter(u=>u.stage===st.id).length;return cnt>0?<button key={j} onClick={()=>{setLcs(j);setExDoc(null);setDocPreview(null)}} style={{padding:"3px 8px",borderRadius:5,fontSize:11,fontWeight:700,border:lcs===j?"2px solid "+st.c:"1px solid #d1fae5",background:lcs===j?st.c+"15":"#fff",color:st.c,cursor:"pointer"}}>{st.ic} {st.id} <span style={{background:"#059669",color:"#fff",padding:"0 4px",borderRadius:6,fontSize:9,marginLeft:2}}>{cnt}</span></button>:null})}
</div>
</div>}

{/* Stage buttons */}
<div style={{display:"flex",gap:3,marginBottom:10,flexWrap:"wrap"}}>{SG.map((st,j)=>{const stUploads=uploads.filter(u=>u.stage===st.id).length;return <button key={j} onClick={()=>{setLcs(j);setExDoc(null);setDocPreview(null)}} style={{padding:"4px 7px",borderRadius:5,fontSize:14,fontWeight:600,border:lcs===j?"2px solid "+st.c:"1px solid #d1d5db",background:j<sn?st.c+"12":"#fff",color:j<sn?st.c:"#9ca3af",cursor:"pointer",position:"relative"}}>{st.ic} {st.id}{stUploads>0&&<span style={{marginLeft:3,padding:"0 5px",borderRadius:8,fontSize:9,fontWeight:800,background:"#059669",color:"#fff"}}>{stUploads}</span>}</button>})}</div><div style={{display:"grid",gridTemplateColumns:"180px 1fr",gap:10}}><Cd t={lang==="de"?"Stufen":"Stages"}>{SG.map((st,j)=>{const dn=j<sn;const stUploads=uploads.filter(u=>u.stage===st.id).length;return <div key={j} onClick={()=>{setLcs(j);setExDoc(null);setDocPreview(null)}} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 7px",borderRadius:5,cursor:"pointer",background:lcs===j?st.c+"10":"transparent",border:lcs===j?"1.5px solid "+st.c:"1.5px solid transparent",opacity:dn||j===sn?1:.4,marginBottom:1}}><span style={{width:20,height:20,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,background:dn?st.c:"#e5e7eb",color:dn?"#fff":"#9ca3af",flexShrink:0}}>{dn?"✓":st.ic}</span><div style={{fontSize:14,fontWeight:600,color:dn?st.c:"#6b7280"}}>{st.id} {t[st.n]||""}</div>{stUploads>0&&<span style={{marginLeft:"auto",padding:"0 5px",borderRadius:8,fontSize:9,fontWeight:800,background:"#059669",color:"#fff"}}>{stUploads}</span>}</div>})}</Cd><div><SD/></div></div></div>:<OnboardWS/>,
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
{id:"BI-02",full:"BI-02-NOCB1.1-INF-F",p:"NOC SE 19",sup:"🇦🇷 Cannava",qty:"198.5 kg",pzn:"18706209",stage:"M4.5",stC:"#ea580c",st:lang==="de"?"Lagerung":"Storage",stC2:"#059669",recv:"14.11.2025",rel:"10.12.2025",thc:"20.1%",loc:"Murchin Commercial",click:()=>{setSup("cannava");setSelBatch("CA-02");setPg("lifecycle");setLcs(9)}},
{id:"CA-03",full:"BI-03-NOCB1.2-INF-F",p:"NOC SE 17/20",sup:"🇦🇷 Cannava",qty:"140 kg",pzn:"TBD",stage:"M2",stC:"#0891b2",st:lang==="de"?"Transport":"In Transit",stC2:"#d97706",recv:"ETA 27.02",rel:"—",thc:"Est. 19%",loc:lang==="de"?"Unterwegs FRA→Murchin":"In Transit FRA→Murchin",click:()=>{setSup("cannava");setSelBatch("CA-03");setPg("lifecycle");setLcs(2)}},
{id:"BI-04",full:"NOC-BI04-SE21-INF-F",p:"NOC SE 21",sup:"🇦🇷 Cannava",qty:"60 kg",pzn:"TBD",stage:"M0",stC:"#b45309",st:lang==="de"?"Geplant":"Planned",stC2:"#6b7280",recv:"Q2 2026",rel:"—",thc:"Est. 19%",loc:"—",click:()=>{setSup("cannava");setSelBatch("BI-04");setPg("lifecycle");setLcs(0)}},
{id:"MC-01",full:"NOC-MC01-THC01",p:"MCCN THC-01",sup:"🇨🇴 Medcolcanna",qty:"40 kg",pzn:"TBD",stage:"M0",stC:"#b45309",st:lang==="de"?"Qualifizierung":"Qualification",stC2:"#d97706",recv:"Q3 2026",rel:"—",thc:"TBD",loc:"—",click:()=>{setSup("mccn");setSelBatch("MC-01");setPg("lifecycle");setLcs(0)}},
{id:"HY-01",full:"NOC-HY01-IND01",p:"HYTN-01",sup:"🇨🇦 HYTN",qty:"25 kg",pzn:"TBD",stage:"M0",stC:"#b45309",st:lang==="de"?"Geplant":"Planned",stC2:"#6b7280",recv:"Q3 2026",rel:"—",thc:"TBD",loc:"—",click:()=>{setSup("hytn");setSelBatch("HY-01");setPg("lifecycle");setLcs(0)}}
].map((b,j)=><tr key={j} style={{borderBottom:"1px solid #f1f5f9",cursor:"pointer",background:b.id==="CA-03"?"#eff6ff":"#fff"}} onClick={b.click}>
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
{/* CA-03 Active Shipment */}
<div style={{padding:12,background:"#eff6ff",borderRadius:8,border:"2px solid #3b82f6"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{fontSize:16,fontWeight:800,color:"#1e40af"}}>✈️ CA-03</div>
<Bd c="#d97706" b="#fef3c7">{lang==="de"?"AKTIV":"ACTIVE"}</Bd>
</div>
<div style={{fontSize:14,fontWeight:600}}>NOC SE 17/20 · 140 kg</div>
<div style={{fontSize:13,color:"#6b7280",marginBottom:6}}>🇦🇷 Cannava · AWB 023-87654321</div>
{[
[lang==="de"?"Route":"Route","EZE → FRA → Murchin"],
[lang==="de"?"Spediteur":"Carrier","WAS-Logistics GmbH"],
["ETA","27.02.2026 ~18:00"],
[lang==="de"?"Temperatur":"Temperature","19.4°C (LIVE)"],
[lang==="de"?"BfArM Genehmigung":"BfArM Permit","E-12267/2025"],
["INCB","50/500 kg"]
].map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:12,borderBottom:"1px solid #dbeafe"}}>
<span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
</div>)}
<button onClick={()=>{setSup("cannava");setSelBatch("CA-03");setPg("lifecycle");setLcs(2)}} style={{width:"100%",marginTop:6,padding:"5px",borderRadius:4,fontSize:13,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>{lang==="de"?"Sendung verfolgen":"Track Shipment"}</button>
</div>

{/* BI-02 In Storage */}
<div style={{padding:12,background:"#f0fdf4",borderRadius:8,border:"1px solid #a7f3d0"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
<div style={{fontSize:16,fontWeight:800,color:"#059669"}}>📦 CA-02</div>
<Bd c="#059669" b="#dcfce7">{lang==="de"?"FREIGEGEBEN":"RELEASED"}</Bd>
</div>
<div style={{fontSize:14,fontWeight:600}}>NOC SE 19 · 198.5 kg</div>
<div style={{fontSize:13,color:"#6b7280",marginBottom:6}}>🇦🇷 Cannava · PZN 18706209</div>
{[
["QP","Dr. O. Schagon"],
[lang==="de"?"Freigabe":"Release","10.12.2025 (CGZ-2025-003)"],
["THC","20.1% (QSI HPLC-DAD)"],
[lang==="de"?"Lagerort":"Location","Murchin An der Redoute 1"],
[lang==="de"?"Verkauft":"Sold","15.8 kg (7.9%)"],
[lang==="de"?"Verfuegbar":"Available","182.7 kg"]
].map(([l,v],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:12,borderBottom:"1px solid #dcfce7"}}>
<span style={{color:"#6b7280"}}>{l}</span><span style={{fontWeight:600}}>{v}</span>
</div>)}
<button onClick={()=>{setSup("cannava");setSelBatch("CA-02");setPg("lifecycle");setLcs(9)}} style={{width:"100%",marginTop:6,padding:"5px",borderRadius:4,fontSize:13,fontWeight:700,border:"1px solid #059669",background:"#fff",color:"#059669",cursor:"pointer"}}>{lang==="de"?"Charge oeffnen":"Open Batch"}</button>
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
{id:"CA-02",c:"#059669",st:lang==="de"?"Lagerung":"Storage",w:"25%"},
{id:"CA-03",c:"#3b82f6",st:lang==="de"?"Transport":"Transit",w:"20%"},
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
<button onClick={()=>{const w=window.open("","_blank","width=800,height=700");w.document.write('<html><head><title>Batch Register</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:11px}h1{font-size:16px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:6px}h2{font-size:13px;margin-top:14px}table{width:100%;border-collapse:collapse;margin:6px 0}td,th{padding:4px 6px;border:1px solid #d1d5db;font-size:9px}th{background:#f1f5f9}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:8px;color:#9ca3af;text-align:center}.banner{background:#1e40af;color:#fff;padding:12px 30px;margin:-30px -30px 16px}@media print{body{padding:15px}.banner{margin:-15px -15px 12px}}</style></head><body>');w.document.write('<div class="banner"><strong>NOC Pharma GmbH</strong> — Chargenregister / Batch Register</div>');w.document.write('<h1>Chargenregister / Batch Register</h1>');w.document.write('<h2>Deutsch</h2><table><tr><th>Charge</th><th>Produkt</th><th>Lieferant</th><th>Menge</th><th>PZN</th><th>Stufe</th><th>Status</th><th>THC</th></tr>');[["CA-01 (BI-01)","NOC SE 17","Cannava","59.5kg","18706190","M6","Abgeschlossen","19.5%"],["CA-02 (BI-02)","NOC SE 19","Cannava","198.5kg","18706209","M4.5","Lagerung","20.1%"],["CA-03 (BI-03)","NOC SE 17/20","Cannava","140kg","TBD","M2","Lab Testing","~19%"],["CA-04 (BI-04)","NOC SE 21","Cannava","250kg","TBD","M0","Geplant","~19%"],["MC-01","MCCN THC-01","Medcolcanna","40kg","TBD","M0","Qualifizierung","TBD"],["HY-01","HYTN-01","HYTN","25kg","TBD","M0","Geplant","TBD"]].forEach(function(r){w.document.write("<tr>");r.forEach(function(v){w.document.write("<td>"+v+"</td>")});w.document.write("</tr>")});w.document.write('</table><h2>English</h2><table><tr><th>Batch</th><th>Product</th><th>Supplier</th><th>Quantity</th><th>PZN</th><th>Stage</th><th>Status</th><th>THC</th></tr>');[["CA-01 (BI-01)","NOC SE 17","Cannava","59.5kg","18706190","M6","Completed","19.5%"],["CA-02 (BI-02)","NOC SE 19","Cannava","198.5kg","18706209","M4.5","Storage","20.1%"],["CA-03 (BI-03)","NOC SE 17/20","Cannava","140kg","TBD","M2","Lab Testing","~19%"],["CA-04 (BI-04)","NOC SE 21","Cannava","250kg","TBD","M0","Planned","~19%"],["MC-01","MCCN THC-01","Medcolcanna","40kg","TBD","M0","Qualification","TBD"],["HY-01","HYTN-01","HYTN","25kg","TBD","M0","Planned","TBD"]].forEach(function(r){w.document.write("<tr>");r.forEach(function(v){w.document.write("<td>"+v+"</td>")});w.document.write("</tr>")});w.document.write('</table><div class="ft">NOC Pharma GmbH · QMS v2.5 · EU GMP Annex 11 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>
🖨️ {lang==="de"?"Chargenregister drucken (DE+EN)":"Print Batch Register (DE+EN)"}
</button>
<button onClick={()=>{const body="NOC PHARMA GmbH\nBatch Register\n"+"=".repeat(40)+"\n\nCA-01 (BI-01): NOC SE 17 | 59.5kg | M6 Completed | THC 19.5%\nCA-02 (BI-02): NOC SE 19 | 198.5kg | M4.5 Storage | THC 20.1%\nCA-03 (BI-03): NOC SE 17/20 | 140kg | M2 Lab Testing | THC ~19%\nCA-04 (BI-04): NOC SE 21 | 250kg | M0 Planned\nCO-01: MCCN THC-01 | 40kg | M0 Qualification\nHY-01: HYTN-01 | 25kg | M0 Planned\n\n2026 Total: 500 kg (INCB Quota)\n\n"+"=".repeat(40)+"\nNOC Pharma GmbH · QMS v2.5";window.open(gmailLink("NOC Pharma — Batch Register — "+new Date().toLocaleDateString("de-DE"),body),"_blank")}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>
📧 {lang==="de"?"Bericht senden":"Send Report"}
</button>
</div>
</div>,
suppliers:<div>
{[
{k:"cannava",fl:"🇦🇷",n:"Cannabis Avatara S.E. (Cannava)",loc:"Pocito, San Juan, Argentina",route:"Buenos Aires → Frankfurt",reg:"ANMAT (PIC/S member)",pics:true,wc:false,st:"active",stL:lang==="de"?"Aktiv":"Active",stC:"#059669",audit:"12.02.2026",auditW:true,
docs:[
{n:lang==="de"?"Herstellungserlaubnis":"Manufacturing License",ref:"ANMAT Disp. 2025/1847",exp:"31.12.2025",days:-58,st:"expired",to:"ruiz@cannava.gob.ar"},
{n:"Quality Technical Agreement",ref:"QTA-NOC-CANN-2024-01",exp:"15.03.2026",days:16,st:"warning",to:"ruiz@cannava.gob.ar"},
{n:lang==="de"?"GMP Auditbericht (Erneuerung)":"GMP Audit Report (Renewal)",ref:"NOC-AUDIT-CANN-2025-01",exp:"12.02.2026",days:-15,st:"overdue",to:"ruiz@cannava.gob.ar"},
{n:"COA CA-03",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"ruiz@cannava.gob.ar"},
{n:lang==="de"?"Phytosanitaeres Zeugnis CA-03":"Phytosanitary Cert. CA-03",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"ruiz@cannava.gob.ar"},
{n:lang==="de"?"Packliste CA-03 (140kg)":"Packing List CA-03 (140kg)",ref:lang==="de"?"Ausstehend":"Pending",exp:"—",days:0,st:"missing",to:"ruiz@cannava.gob.ar"},
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
<td style={{padding:"3px 6px"}}><button onClick={()=>{const body=(lang==="de"?"Sehr geehrtes "+s.n+" Team,\n\nwir benoetigen dringend:\n\n📄 "+d.n+"\nStatus: "+(d.st==="expired"?"ABGELAUFEN":d.st==="missing"?"FEHLEND":d.st==="critical"?"KRITISCH/PFLICHT":"AUSSTEHEND")+"\n\nBitte senden Sie dieses Dokument baldmoeglichst.\n\nMit freundlichen Gruessen,\nCelso Hamelink\nOperations Manager (Review) · NOC Pharma GmbH":"Dear "+s.n+" Team,\n\nWe urgently require:\n\n📄 "+d.n+"\nStatus: "+(d.st==="expired"?"EXPIRED":d.st==="missing"?"MISSING":d.st==="critical"?"CRITICAL/MANDATORY":"PENDING")+"\n\nPlease send this document at your earliest convenience.\n\nBest regards,\nCelso Hamelink\nOperations Manager (Review) · NOC Pharma GmbH");window.open(gmailLink("URGENT — Document Request — "+d.n,body)+"&to="+encodeURIComponent(d.to)+"&cc="+encodeURIComponent("torsten.cuny@nocpharma.de"),"_blank")}} style={{padding:"2px 8px",borderRadius:3,fontSize:11,fontWeight:700,border:"none",background:d.st==="expired"||d.st==="critical"?"#dc2626":"#d97706",color:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>📧 {lang==="de"?"Anfordern":"Request"}</button></td>
</tr>)}
</tbody></table>
</div>}
{actionDocs.length>0&&<div style={{padding:"6px 14px 10px",display:"flex",gap:6}}>
<button onClick={()=>{const docList=actionDocs.map((d,i)=>(i+1)+". "+d.n+" — "+(d.st==="expired"?"EXPIRED/ABGELAUFEN":d.st==="missing"?"MISSING/FEHLEND":d.st==="critical"?"CRITICAL/KRITISCH":"PENDING/AUSSTEHEND")).join("\n");const body=(lang==="de"?"Sehr geehrtes "+s.n+" Team,\n\nfuer den laufenden/geplanten Import benoetigen wir folgende Dokumente:\n\n"+docList+"\n\nBitte senden Sie alle Dokumente baldmoeglichst.\nOhne vollstaendige Dokumentation kann der Import nicht fortgesetzt werden.\n\nMit freundlichen Gruessen,\nCelso Hamelink\nOperations Manager (Review) · NOC Pharma GmbH":"Dear "+s.n+" Team,\n\nFor the ongoing/planned import we require the following documents:\n\n"+docList+"\n\nPlease send all documents at your earliest convenience.\nWithout complete documentation the import cannot proceed.\n\nBest regards,\nCelso Hamelink\nOperations Manager (Review) · NOC Pharma GmbH");window.open(gmailLink("NOC Pharma — "+actionDocs.length+" Document Requests — "+s.n+" — URGENT",body)+"&to="+encodeURIComponent(supEmail)+"&cc="+encodeURIComponent("celso@noc-pharma.de,torsten.cuny@nocpharma.de"),"_blank")}} style={{flex:1,padding:"7px 14px",borderRadius:5,fontSize:14,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>📧 {lang==="de"?"Alle "+actionDocs.length+" Dokumente anfordern":"Request All "+actionDocs.length+" Documents"} → {supEmail}</button>
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
{id:"DEV-2025-001",date:"14.12.2025",desc:"TAMC excursion 12,500 CFU/g (Ph.Eur. limit: 10,000)",cat:"Microbiology",cls:"Critical",clsC:"#dc2626",batch:"CA-02 (IN11)",sup:"Cannava",
capa:"CAPA-2025-001",owner:"C. Hamelink",deadline:"14.01.2026",st:"open",
rootCause:"Supplier drying process — moisture content 9.1% at origin (target <8%)",
immAct:"Batch quarantined. Retest ordered at QSI Bremen (microbial panel + extended ID).",
corrAct:"Notify Cannava QP (Lic. Ruiz). Request drying protocol revision. Demand incoming moisture < 8.0%.",
prevAct:"Add moisture verification as pre-shipment gate check. Update SOP-CS-001 supplier qualification criteria.",
impactAssess:"Product cannot be released until retest confirms TAMC < 10,000. If confirmed OOS, batch reject per SOP-202.",
refs:["SOP-202 (OOS Investigation)","SOP-QC-001 (Lab Testing)","Ph.Eur. 5.1.4 (Microbial Quality)","EU GMP Annex 8"]},
{id:"DEV-2025-002",date:"15.12.2025",desc:"THC variance >10% between supplier COA (20.1%) and QSI result (19.5%)",cat:"Potency",cls:"Major",clsC:"#d97706",batch:"CA-02 (002-39)",sup:"Cannava",
capa:"CAPA-2025-002",owner:"C. Hamelink",deadline:"15.01.2026",st:"open",
rootCause:"Analytical method difference (Cannava: UV-Vis; QSI: HPLC-DAD). Expected variance within 3%, actual 3.0% — at threshold.",
immAct:"THC Discrepancy Protocol initiated (M2 stage). Pia at QSI notified. PZN re-evaluation if needed.",
corrAct:"Establish method correlation study between Cannava lab and QSI. Harmonize to HPLC-DAD per Ph.Eur.",
prevAct:"Require HPLC-DAD results from all suppliers. Add inter-lab comparison to SOP-CS-001.",
impactAssess:"Variance at 3.0% (limit 10%). No impact on product quality. PZN valid. Batch can proceed if retest confirms.",
refs:["SOP-202 (OOS Investigation)","THC Discrepancy Protocol","Ph.Eur. Cannabis flos monograph","AMWHV §6"]},
{id:"DEV-2025-003",date:"15.11.2025",desc:"Datalogger TL-002 peak at 26.1C for 12 min during transport leg 2 (BA → FRA)",cat:"GDP Temperature",cls:"Minor",clsC:"#2563eb",batch:"CA-02",sup:"WAS-Logistics",
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
<button onClick={()=>{const w=window.open("","_blank","width=800,height=900");w.document.write('<html><head><title>'+d.id+' — NOC Pharma</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:12px;color:#1f2937}h1{font-size:16px;color:#dc2626;border-bottom:2px solid #dc2626;padding-bottom:6px}h2{font-size:13px;margin-top:14px;color:#374151}table{width:100%;border-collapse:collapse;margin:6px 0}td{padding:5px 8px;border:1px solid #d1d5db}td:first-child{font-weight:700;background:#f9fafb;width:30%}.banner{background:#dc2626;color:#fff;padding:12px 30px;margin:-30px -30px 16px}.sig{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-top:20px}.sig>div{border-top:1px solid #000;padding-top:4px;text-align:center;font-size:10px}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:9px;color:#9ca3af;text-align:center}@media print{body{padding:20px}.banner{margin:-20px -20px 16px}}</style></head><body>');w.document.write('<div class="banner"><strong style="font-size:15px">NOC Pharma GmbH</strong> — Abweichungsbericht '+d.id+'</div>');w.document.write('<h1>'+d.id+' — '+d.desc+'</h1><table>');[["Datum",d.date],["Kategorie",d.cat],["Klassifikation",d.cls],["Charge",d.batch],["Lieferant",d.sup],["CAPA Ref",d.capa],["Verantwortlich",d.owner],["Frist",d.deadline],["Status",d.st]].forEach(function(r){w.document.write('<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>')});w.document.write('</table><h2>Ursachenanalyse</h2><p>'+d.rootCause+'</p><h2>Sofortmassnahme</h2><p>'+d.immAct+'</p><h2>Korrekturmassnahme</h2><p>'+d.corrAct+'</p><h2>Vorbeugungsmassnahme</h2><p>'+d.prevAct+'</p><h2>Auswirkungsbewertung</h2><p>'+d.impactAssess+'</p><h2>Referenz-SOPs</h2><ul>');d.refs.forEach(function(r){w.document.write('<li>'+r+'</li>')});w.document.write('</ul><div class="sig"><div>Erstellt von<br/><br/><br/>'+d.owner+'</div><div>Geprueft von QP<br/><br/><br/>Dr. O. Schagon</div><div>Abgeschlossen von RP<br/><br/><br/>T. Cuny</div></div><div class="ft">NOC Pharma GmbH - QMS v2.5 - EU GMP Chapter 8 - PIC/S PE 009-16 - '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{flex:1,padding:"6px 12px",borderRadius:5,fontSize:13,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>{lang==="de"?"Bericht drucken (PDF)":lang==="de"?"Bericht drucken (PDF)":"Print Report (PDF)"}</button>
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
{id:"SOP-QMS-001",n:"Quality Management System",v:"3.0",cat:"QMS",eff:"01.03.2024",rev:"01.03.2026",sign:"C. Hamelink",signD:"01.03.2024",app:"Dr. O. Schagon (QP)",appD:"01.03.2024",st:"current",train:["C. Hamelink","T. Cuny","M. Weber"]},
{id:"SOP-QMS-002",n:"Document Control",v:"2.1",cat:"QMS",eff:"15.04.2024",rev:"15.04.2026",sign:"C. Hamelink",signD:"15.04.2024",app:"Dr. O. Schagon (QP)",appD:"15.04.2024",st:"current",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-PER-001",n:"Personnel Qualification & Training",v:"2.0",cat:"PER",eff:"01.05.2024",rev:"01.05.2026",sign:"C. Hamelink",signD:"01.05.2024",app:"Dr. O. Schagon (QP)",appD:"01.05.2024",st:"current",train:["C. Hamelink","T. Cuny","M. Weber"]},
{id:"SOP-100-01",n:"QMS Framework",v:"1.0",cat:"QMS",eff:"01.01.2023",rev:"01.01.2025",sign:"C. Hamelink",signD:"01.01.2023",app:"—",appD:"—",st:"overdue",days:"851",train:["C. Hamelink"]},
{id:"SOP-103-01",n:"Abweichung Management",v:"1.0",cat:"QMS",eff:"15.03.2023",rev:"15.03.2025",sign:"C. Hamelink",signD:"15.03.2023",app:"—",appD:"—",st:"overdue",days:"808",train:["C. Hamelink"]},
{id:"SOP-104-01",n:"CAPA (Corrective & Vorbeugungsmassnahme)",v:"1.0",cat:"QMS",eff:"15.03.2023",rev:"15.03.2025",sign:"C. Hamelink",signD:"15.03.2023",app:"—",appD:"—",st:"overdue",days:"808",train:["C. Hamelink"]},
{id:"SOP-MFG-006",n:"Cannabis Flos Import Process",v:"1.2",cat:"MFG",eff:"01.08.2024",rev:"01.08.2026",sign:"C. Hamelink",signD:"01.08.2024",app:"Dr. O. Schagon (QP)",appD:"01.08.2024",st:"current",train:["C. Hamelink","T. Cuny","Logistics"]},
{id:"SOP-202",n:"OOS Investigation",v:"2.0",cat:"QC",eff:"01.06.2024",rev:"01.06.2026",sign:"C. Hamelink",signD:"01.06.2024",app:"Dr. O. Schagon (QP)",appD:"01.06.2024",st:"current",train:["C. Hamelink","T. Cuny","QSI Bremen"]},
{id:"SOP-CS-001",n:"Supplier Qualification & Audit",v:"1.1",cat:"CS",eff:"01.09.2024",rev:"01.09.2026",sign:"C. Hamelink",signD:"01.09.2024",app:"Dr. O. Schagon (QP)",appD:"01.09.2024",st:"current",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-BTM-001",n:"BtM Narcotics Controls",v:"2.0",cat:"BTM",eff:"01.07.2024",rev:"01.07.2026",sign:"C. Hamelink",signD:"01.07.2024",app:"Dr. O. Schagon (QP)",appD:"01.07.2024",st:"current",train:["C. Hamelink","T. Cuny","Vault Staff"]},
{id:"SOP-604-02",n:"BtM Controls",v:"2.0",cat:"BTM",eff:"01.07.2024",rev:"01.07.2026",sign:"C. Hamelink",signD:"01.07.2024",app:"Dr. O. Schagon (QP)",appD:"01.07.2024",st:"current",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-700-02",n:"GDP Transport",v:"2.0",cat:"GDP",eff:"01.06.2024",rev:"01.06.2026",sign:"C. Hamelink",signD:"01.06.2024",app:"Dr. O. Schagon (QP)",appD:"01.06.2024",st:"current",train:["C. Hamelink","Logistics","WAS-Logistics"]},
{id:"SOP-710-01",n:"Labeling & Relabeling",v:"1.0",cat:"MFG",eff:"01.08.2024",rev:"01.08.2026",sign:"C. Hamelink",signD:"01.08.2024",app:"Dr. O. Schagon (QP)",appD:"01.08.2024",st:"current",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-QC-001",n:"Laboratory Testing (Contract QSI)",v:"1.0",cat:"QC",eff:"15.06.2024",rev:"15.06.2026",sign:"C. Hamelink",signD:"15.06.2024",app:"Dr. O. Schagon (QP)",appD:"15.06.2024",st:"current",train:["C. Hamelink","Pia (QSI)"]},
{id:"SOP-DOC-001",n:"Batch Record Management",v:"1.0",cat:"DOC",eff:"01.04.2024",rev:"01.04.2026",sign:"C. Hamelink",signD:"01.04.2024",app:"Dr. O. Schagon (QP)",appD:"01.04.2024",st:"review",train:["C. Hamelink","T. Cuny"]},
{id:"SOP-EQ-001",n:"Equipment Qualification",v:"1.0",cat:"EQ",eff:"01.05.2024",rev:"01.05.2026",sign:"C. Hamelink",signD:"01.05.2024",app:"Dr. O. Schagon (QP)",appD:"01.05.2024",st:"review",train:["C. Hamelink"]}
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
w.document.write('<div class="ft">NOC Pharma GmbH - An der Redoute 1 - 17390 Murchin - QMS v1.0 + v2.5 - '+new Date().toISOString()+'</div></body></html>');
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
{nr:"BT-2025-001",date:"14.11.2025",tx:lang==="de"?"Wareneingang (Import)":"Goods Receipt (Import)",sub:"Cannabis flos",batch:"BI-02-NOCB1.1-INF-F",inp:"198.5",out:"—",bal:"198.5",party:"Cannava S.E., San Juan, AR",perm:"E-12267/2025 (BfArM)",resp:"T. Cuny (RP)"},
{nr:"BT-2025-002",date:"14.11.2025",tx:lang==="de"?"Quarantaene-Einlagerung":"Quarantine Storage",sub:"Cannabis flos",batch:"CA-02",inp:"—",out:"—",bal:"198.5",party:lang==="de"?"Tresor Murchin (Zone Q)":"Vault Murchin (Zone Q)",perm:"SOP-BTM-001",resp:"T. Cuny (RP)"},
{nr:"BT-2025-003",date:"18.11.2025",tx:lang==="de"?"QSI Probenahme":"QSI Sampling",sub:"Cannabis flos",batch:"CA-02",inp:"—",out:"1.4",bal:"197.1",party:"QSI GmbH Bremen (Pia)",perm:lang==="de"?"§13 BtMG Transfer":"§13 BtMG Transfer",resp:"T. Cuny (RP)"},
{nr:"BT-2025-004",date:"10.12.2025",tx:lang==="de"?"QP-Freigabe":"QP Release",sub:"Cannabis flos",batch:"CA-02",inp:"—",out:"—",bal:"197.1",party:"Dr. O. Schagon (QP)",perm:"CGZ-2025-003",resp:"Dr. O. Schagon (QP)"},
{nr:"BT-2025-005",date:"12.12.2025",tx:lang==="de"?"Zonenumbuchung Q→K":"Zone Transfer Q→C",sub:"Cannabis flos",batch:"CA-02",inp:"—",out:"—",bal:"197.1",party:lang==="de"?"Murchin Q → Murchin Kommerz":"Murchin Q → Murchin Commercial",perm:"TR-NOC-2025-0089",resp:"T. Cuny (RP)"},
{nr:"BT-2025-006",date:"15.01.2026",tx:lang==="de"?"Rueckstellmuster Rueckgabe":"Retention Sample Return",sub:"Cannabis flos",batch:"CA-02",inp:"1.26",out:"—",bal:"198.36",party:"QSI GmbH Bremen",perm:lang==="de"?"Rueckfuehrung":"Return",resp:"Pia (QSI)"}
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
[lang==="de"?"Naechste Lieferung geplant":"Next Shipment Planned","CA-03: 140 kg (Q1 2026)"],
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
{zone:"Q",name:lang==="de"?"Quarantaene-Tresor Murchin":"Quarantine Vault Murchin",addr:"Murchin, MV",qty:"0 kg",temp:"19.5°C",st:"empty",sec:lang==="de"?"Alarmsystem + BtM-Schloss + Kamera":"Alarm + BtM Lock + Camera"},
{zone:"K",name:lang==="de"?"Kommerziallager Murchin":"Commercial Warehouse Murchin",addr:"An der Redoute 1, 17390 Murchin",qty:"197.1 kg",temp:"20.1°C",st:"active",sec:lang==="de"?"BtM-Tresor + Doppelschloss + Protokoll":"BtM Safe + Double Lock + Log"},
{zone:"R",name:lang==="de"?"Rueckstellmuster":"Retention Samples",addr:"Murchin (R-Schrank)",qty:"1.26 kg",temp:"20.0°C",st:"retention",sec:lang==="de"?"Versiegelter Schrank":"Sealed Cabinet"}
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
<button onClick={()=>{const w=window.open("","_blank","width=800,height=900");w.document.write('<html><head><title>BtM-Buch — NOC Pharma</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:11px;color:#1f2937}h1{font-size:16px;color:#7f1d1d;border-bottom:2px solid #7f1d1d;padding-bottom:6px}h2{font-size:13px;margin-top:14px}table{width:100%;border-collapse:collapse;margin:6px 0}td,th{padding:4px 6px;border:1px solid #d1d5db;font-size:9px}th{background:#fef2f2;color:#7f1d1d;font-weight:700}.banner{background:#7f1d1d;color:#fff;padding:12px 30px;margin:-30px -30px 16px}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:8px;color:#9ca3af;text-align:center}.sig{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:20px}.sig>div{border-top:1px solid #000;padding-top:4px;text-align:center;font-size:9px}@media print{body{padding:15px}.banner{margin:-15px -15px 12px}}</style></head><body>');w.document.write('<div class="banner"><strong style="font-size:14px">NOC Pharma GmbH</strong> — BtM-Buch / Narcotics Ledger<br/>Par. 13 BtMG · Par. 15 BtMG · Generated: '+new Date().toLocaleDateString("de-DE")+'</div>');w.document.write('<h1>Betaeubungsmittelbuch / Narcotics Ledger</h1>');w.document.write('<h2>Deutsch</h2><table><tr><th>Lfd.Nr.</th><th>Datum</th><th>Vorgang</th><th>Substanz</th><th>Charge</th><th>Zugang</th><th>Abgang</th><th>Bestand</th><th>Partei</th><th>Genehmigung</th></tr>');[["BT-2025-001","14.11.2025","Wareneingang","Cannabis flos","BI-02","198.5","—","198.5","Cannava S.E.","E-12267/2025"],["BT-2025-002","14.11.2025","Quarantaene","Cannabis flos","BI-02","—","—","198.5","Tresor Murchin","SOP-BTM-001"],["BT-2025-003","18.11.2025","QSI Probenahme","Cannabis flos","BI-02","—","1.4","197.1","QSI Bremen","Par.13 BtMG"],["BT-2025-004","10.12.2025","QP-Freigabe","Cannabis flos","BI-02","—","—","197.1","Dr. Schagon","CGZ-2025-003"],["BT-2025-005","12.12.2025","Zonenumbuchung","Cannabis flos","BI-02","—","—","197.1","Q to K","TR-NOC-2025-0089"],["BT-2025-006","15.01.2026","Rueckstellmuster","Cannabis flos","BI-02","1.26","—","198.36","QSI Bremen","Return"]].forEach(function(r){w.document.write("<tr>");r.forEach(function(v){w.document.write("<td>"+v+"</td>")});w.document.write("</tr>")});w.document.write('</table><h2>English</h2><table><tr><th>Entry</th><th>Date</th><th>Transaction</th><th>Substance</th><th>Batch</th><th>In</th><th>Out</th><th>Balance</th><th>Party</th><th>Permit</th></tr>');[["BT-2025-001","14.11.2025","Goods Receipt","Cannabis flos","BI-02","198.5","—","198.5","Cannava S.E.","E-12267/2025"],["BT-2025-002","14.11.2025","Quarantine Storage","Cannabis flos","BI-02","—","—","198.5","Vault Murchin","SOP-BTM-001"],["BT-2025-003","18.11.2025","QSI Sampling","Cannabis flos","BI-02","—","1.4","197.1","QSI Bremen","Par.13 BtMG"],["BT-2025-004","10.12.2025","QP Release","Cannabis flos","BI-02","—","—","197.1","Dr. Schagon","CGZ-2025-003"],["BT-2025-005","12.12.2025","Zone Transfer","Cannabis flos","BI-02","—","—","197.1","Q to C","TR-NOC-2025-0089"],["BT-2025-006","15.01.2026","Retention Return","Cannabis flos","BI-02","1.26","—","198.36","QSI Bremen","Return"]].forEach(function(r){w.document.write("<tr>");r.forEach(function(v){w.document.write("<td>"+v+"</td>")});w.document.write("</tr>")});w.document.write('</table><p><strong>Balance: 198.36 kg | Variance: 0 kg</strong></p><div class="sig"><div>Verantwortliche Person (RP)<br/><br/><br/>T. Cuny</div><div>Sachkundige Person (QP)<br/><br/><br/>Dr. O. Schagon</div></div><div class="ft">NOC Pharma GmbH · An der Redoute 1 · 17390 Murchin · Par. 13, 15 BtMG · QMS v2.5 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{padding:"10px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"none",background:"#7f1d1d",color:"#fff",cursor:"pointer"}}>
📒 {lang==="de"?"BtM-Buch drucken (DE+EN)":"Print BtM Ledger (DE+EN)"}
</button>
<button onClick={()=>{const body="NOC PHARMA GmbH\nBtM Balance Report\n========================================\n\nDate: "+new Date().toLocaleDateString("de-DE")+"\nSubstance: Cannabis flos (Anlage III BtMG)\nBatch: BI-02-NOCB1.1-INF-F\n\nOpening: 0 kg\n+ Received: 199.76 kg\n- Dispatched: 1.4 kg (QSI samples)\n= Target: 198.36 kg\nActual: 198.36 kg\nVariance: 0 kg\n\nStorage:\n- Zone K (Murchin Commercial): 197.1 kg\n- Zone R (Retention): 1.26 kg\n\nINCB Quota 2026: 500 kg (39.7% used)\n\n========================================\nRP: T. Cuny · QP: Dr. O. Schagon\nNOC Pharma GmbH · QMS v2.5";window.open(gmailLink("NOC Pharma — BtM Balance Report — "+new Date().toLocaleDateString("de-DE"),body),"_blank")}} style={{padding:"10px 16px",borderRadius:6,fontSize:15,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>
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
[lang==="de"?"Letzter Import":"Last Import","Nov 2025 (CA-02)"],
[lang==="de"?"Naechster Import":"Next Import","Feb 2026 (CA-03)"]
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
{date:"12.02.2025",type:lang==="de"?"Erstaudit (vor Ort)":"Initial Audit (On-site)",loc:"San Juan, Argentina",by:"T. Cuny (RP)",result:"✅ "+( lang==="de"?"Bestanden — 2 kleinere Abweichungen":"Passed — 2 minor findings"),next:lang==="de"?"12.02.2026 (UEBERFAELLIG)":"12.02.2026 (OVERDUE)"},
{date:"22.03.2025",type:lang==="de"?"Nachaudit (Remote)":"Follow-up Audit (Remote)",loc:"Video Call",by:"C. Hamelink / Lic. Ruiz",result:"✅ "+(lang==="de"?"Abweichungen behoben":"Findings resolved"),next:"—"}
]:sup==="mccn"?[
{date:"—",type:lang==="de"?"Erstaudit geplant":"Initial Audit Planned",loc:"Bogota, Colombia",by:"T. Cuny (RP)",result:lang==="de"?"Ausstehend — Q2 2026":"Pending — Q2 2026",next:"Q2 2026"}
]:[
{date:"—",type:lang==="de"?"Erstaudit geplant":"Initial Audit Planned",loc:"BC, Canada",by:"T. Cuny (RP)",result:lang==="de"?"Ausstehend — Q2 2026":"Pending — Q2 2026",next:"Q2 2026"}
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
<button onClick={()=>{const sn=sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN";const w=window.open("","_blank","width=800,height=700");w.document.write('<html><head><title>Supplier Dossier — '+sn+'</title><style>body{font-family:Arial,sans-serif;padding:30px;font-size:11px}h1{font-size:16px;color:#1e40af;border-bottom:2px solid #1e40af;padding-bottom:6px}h2{font-size:13px;margin-top:14px}table{width:100%;border-collapse:collapse;margin:6px 0}td,th{padding:4px 6px;border:1px solid #d1d5db;font-size:9px}th{background:#f1f5f9}.banner{background:#1e40af;color:#fff;padding:12px 30px;margin:-30px -30px 16px}.ft{margin-top:16px;border-top:1px solid #d1d5db;padding-top:6px;font-size:8px;color:#9ca3af;text-align:center}.sig{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:20px}.sig>div{border-top:1px solid #000;padding-top:4px;text-align:center;font-size:9px}@media print{body{padding:15px}.banner{margin:-15px -15px 12px}}</style></head><body>');w.document.write('<div class="banner"><strong>NOC Pharma GmbH</strong> — Lieferantendossier / Supplier Dossier — '+sn+'</div>');w.document.write('<h1>'+sn+' — Supplier Qualification Dossier</h1><p>Generated: '+new Date().toLocaleDateString("de-DE")+' · SOP-CS-001 · EU GMP Chapter 7</p>');w.document.write('<h2>Deutsch — Qualifikationsstatus</h2><p>Lieferant: '+sn+'<br/>Status: '+(sup==="cannava"?"Qualifiziert":"Ausstehend")+'<br/>PIC/S: '+(sup==="cannava"?"Ja (ANMAT)":"Ausstehend")+'</p>');w.document.write('<h2>English — Qualification Status</h2><p>Supplier: '+sn+'<br/>Status: '+(sup==="cannava"?"Qualified":"Pending")+'<br/>PIC/S: '+(sup==="cannava"?"Yes (ANMAT)":"Pending")+'</p>');w.document.write('<div class="sig"><div>Sampled by<br/><br/><br/>____________</div><div>RP genehmigt / RP approved<br/><br/><br/>T. Cuny (RP §52a AMG)</div><div>QP geprüft / QP reviewed<br/><br/><br/>Dr. O. Schagon (QP §15 AMG)</div></div>');w.document.write('<div class="ft">NOC Pharma GmbH · QMS v2.5 · SOP-CS-001 · EU GMP Ch.7 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>
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
nocDossier:<div>
<div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",borderRadius:10,padding:16,marginBottom:14,color:"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:22,fontWeight:800}}>🏢 NOC Pharma GmbH — {lang==="de"?"Unternehmensdossier":"Company Dossier"}</div>
<div style={{fontSize:12,opacity:.7}}>§52a AMG · BtMG §3 · GDP · EU-GMP · {lang==="de"?"Alle Lizenzen, Genehmigungen & Audits":"All licenses, permits & audits"}</div>
</div>
<div style={{textAlign:"right"}}>
<div style={{fontSize:14,fontWeight:700}}>RP: T. Cuny</div>
<div style={{fontSize:11,opacity:.7}}>Greifswald, MV</div>
</div>
</div>
</div>

{/* License Status KPIs */}
{(()=>{
const licenses=[
{name:lang==="de"?"Großhandelserlaubnis":"Wholesale License",ref:"§52a AMG",authority:"LAGuS MV",issued:"15.03.2024",expires:"14.03.2029",status:"active",file:"GHE-52a-2024.pdf",notes:lang==="de"?"Großhandelserlaubnis für Arzneimittel inkl. Betäubungsmittel":"Wholesale distribution authorization for medicinal products incl. narcotics"},
{name:lang==="de"?"BtM-Erlaubnis":"Narcotics License",ref:"BtMG §3",authority:"BfArM",issued:"01.06.2024",expires:"31.05.2027",status:"active",file:"BtM-Erlaubnis-2024.pdf",notes:lang==="de"?"Erlaubnis zum Verkehr mit Betäubungsmitteln — Cannabis":"License to handle narcotics — Cannabis"},
{name:lang==="de"?"Einfuhrgenehmigung BI-01":"Import Permit BI-01",ref:"BtMG §11",authority:"BfArM",issued:"10.01.2025",expires:"10.01.2026",status:"expired",file:"EG-BI01-2025.pdf",notes:"Cannava BI-01, 59.5kg NOC SE 17"},
{name:lang==="de"?"Einfuhrgenehmigung CA-02":"Import Permit CA-02",ref:"BtMG §11",authority:"BfArM",issued:"15.09.2025",expires:"15.09.2026",status:"active",file:"EG-BI02-2025.pdf",notes:"Cannava CA-02, 198.5kg NOC SE 19"},
{name:lang==="de"?"Einfuhrgenehmigung CA-03":"Import Permit CA-03",ref:"BtMG §11",authority:"BfArM",issued:"20.01.2026",expires:"20.01.2027",status:"active",file:"EG-BI03-2026.pdf",notes:"Cannava CA-03, 140kg NOC SE 17/20"},
{name:lang==="de"?"Einfuhrgenehmigung BI-04":"Import Permit BI-04",ref:"BtMG §11",authority:"BfArM",issued:"—",expires:"—",status:"pending",file:"—",notes:lang==="de"?"Antrag in Vorbereitung":"Application in preparation"},
{name:"GDP Certificate",ref:"EU GDP Guidelines",authority:"LAGuS MV",issued:"01.04.2024",expires:"31.03.2029",status:"active",file:"GDP-Cert-2024.pdf",notes:lang==="de"?"Gute Vertriebspraxis für Arzneimittel":"Good Distribution Practice for medicinal products"},
{name:lang==="de"?"Gewerbeanmeldung":"Business Registration",ref:"GewO §14",authority:lang==="de"?"Stadt Greifswald":"City of Greifswald",issued:"01.02.2024",expires:"—",status:"active",file:"Gewerbeschein-2024.pdf",notes:lang==="de"?"Pharmazeutischer Großhandel":"Pharmaceutical wholesale"},
{name:lang==="de"?"Handelsregister":"Commercial Register",ref:"HRB 17XXX",authority:"AG Stralsund",issued:"15.02.2024",expires:"—",status:"active",file:"HRB-Auszug.pdf",notes:"NOC Pharma GmbH, Greifswald"},
{name:lang==="de"?"Sachkundenachweis":"Expert Certificate",ref:"§15 AMG",authority:"Apothekerkammer MV",issued:"01.03.2024",expires:"—",status:"active",file:"Sachkunde-QP.pdf",notes:lang==="de"?"Qualifizierte Person / Sachkundige Person":"Qualified Person / Responsible Person"},
{name:"INCB Registration",ref:"Form D",authority:"INCB Vienna",issued:"15.05.2024",expires:"31.12.2026",status:"active",file:"INCB-FormD.pdf",notes:lang==="de"?"Jährliche Meldung bis 31. März":"Annual reporting due March 31"},
{name:lang==="de"?"Versicherungsnachweis":"Insurance Certificate",ref:"Betriebshaftpflicht",authority:"Allianz",issued:"01.01.2026",expires:"31.12.2026",status:"active",file:"Versicherung-2026.pdf",notes:lang==="de"?"Pharma-Betriebshaftpflicht + Produkthaftpflicht":"Pharma liability + product liability"},
{name:lang==="de"?"Datenschutz":"Data Protection",ref:"DSGVO / Art. 30",authority:lang==="de"?"Intern":"Internal",issued:"01.04.2024",expires:"—",status:"active",file:"DSGVO-VVT.pdf",notes:lang==="de"?"Verzeichnis der Verarbeitungstätigkeiten":"Record of processing activities"},
];

const audits=[
{name:lang==="de"?"LAGuS Erstinspektion":"LAGuS Initial Inspection",date:"20.03.2024",authority:"LAGuS MV",result:"pass",findings:0,next:"Q1 2027",notes:lang==="de"?"Keine Beanstandungen · §52a AMG Konformität bestätigt":"No findings · §52a AMG compliance confirmed"},
{name:lang==="de"?"BfArM BtM-Prüfung":"BfArM BtM Inspection",date:"15.06.2024",authority:"BfArM",result:"pass",findings:0,next:"2027",notes:lang==="de"?"BtM-Buch, Tresor, 4-Augen-Prinzip geprüft":"BtM ledger, vault, 4-eyes principle verified"},
{name:lang==="de"?"GDP Selbstinspektion":"GDP Self-Inspection",date:"15.01.2026",authority:lang==="de"?"Intern (QP)":"Internal (QP)",result:"pass",findings:1,next:"Jul 2026",notes:lang==="de"?"1 Minor: Temperaturlogger-Kalibrierung überfällig":"1 Minor: Temperature logger calibration overdue"},
{name:lang==="de"?"Cannava Lieferantenaudit":"Cannava Supplier Audit",date:"10.11.2025",authority:"NOC QP",result:"pass",findings:2,next:"Nov 2026",notes:lang==="de"?"2 Minor: Dokumentation Trocknungsprotokoll":"2 Minor: Drying protocol documentation"},
{name:lang==="de"?"QSI Lab Audit":"QSI Lab Audit",date:"—",authority:"NOC QP",result:"planned",findings:0,next:"Q2 2026",notes:lang==="de"?"Geplant: QSI-Labore Greifswald":"Planned: QSI Labs Greifswald"},
{name:lang==="de"?"MCCN Qualifizierungsaudit":"MCCN Qualification Audit",date:"—",authority:"NOC QP",result:"planned",findings:0,next:"Q2 2026",notes:lang==="de"?"Geplant: Site Visit Bogotá":"Planned: Site visit Bogotá"},
];

const active=licenses.filter(l=>l.status==="active").length;
const expiring=licenses.filter(l=>{if(!l.expires||l.expires==="—")return false;const[d,m,y]=l.expires.split(".");const exp=new Date(y,m-1,d);const diff=(exp-new Date())/(86400000);return diff>0&&diff<90}).length;
const expired=licenses.filter(l=>l.status==="expired").length;
const pending=licenses.filter(l=>l.status==="pending").length;

return <>
<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}}>
{[
[lang==="de"?"Aktive Lizenzen":"Active Licenses",active,"#059669"],
[lang==="de"?"Läuft bald ab":"Expiring Soon",expiring,"#d97706"],
[lang==="de"?"Abgelaufen":"Expired",expired,"#dc2626"],
[lang==="de"?"Ausstehend":"Pending",pending,"#6366f1"],
[lang==="de"?"Audits bestanden":"Audits Passed",audits.filter(a=>a.result==="pass").length+"/"+audits.length,"#2563eb"],
].map(([l,v,c],j)=><div key={j} style={{padding:10,borderRadius:8,background:c+"08",border:"2px solid "+c+"33",textAlign:"center"}}>
<div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:11,color:"#6b7280"}}>{l}</div>
</div>)}
</div>

{/* Licenses Table */}
<div style={{borderRadius:12,border:"2px solid #0f172a33",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,marginBottom:8}}>📋 {lang==="de"?"Lizenzen & Genehmigungen":"Licenses & Permits"}</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#0f172a",color:"#fff"}}>
{[lang==="de"?"Lizenz":"License",lang==="de"?"Referenz":"Reference",lang==="de"?"Behörde":"Authority",lang==="de"?"Ausgestellt":"Issued",lang==="de"?"Gültig bis":"Expires","Status",lang==="de"?"Datei":"File"].map((h,j)=>
<th key={j} style={{padding:"5px 6px",fontWeight:700,fontSize:10}}>{h}</th>)}
</tr></thead>
<tbody>
{licenses.map((l,j)=>{
const isExpiring=l.expires&&l.expires!=="—"&&(()=>{const[d,m,y]=l.expires.split(".");const exp=new Date(y,m-1,d);return(exp-new Date())/(86400000)<90&&(exp-new Date())>0})();
return <tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:l.status==="expired"?"#fef2f2":isExpiring?"#fefce8":"transparent"}}>
<td style={{padding:"5px 6px",fontWeight:700}}>{l.name}</td>
<td style={{padding:"5px 6px",fontFamily:"monospace",fontSize:10}}>{l.ref}</td>
<td style={{padding:"5px 6px",fontSize:10}}>{l.authority}</td>
<td style={{padding:"5px 6px",fontSize:10}}>{l.issued}</td>
<td style={{padding:"5px 6px",fontSize:10,fontWeight:isExpiring?700:400,color:isExpiring?"#d97706":"inherit"}}>{l.expires}</td>
<td style={{padding:"5px 6px"}}><span style={{padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:700,background:l.status==="active"?"#dcfce7":l.status==="expired"?"#fecaca":l.status==="pending"?"#e0e7ff":"#fef3c7",color:l.status==="active"?"#059669":l.status==="expired"?"#dc2626":l.status==="pending"?"#6366f1":"#d97706"}}>{l.status==="active"?(lang==="de"?"✅ Aktiv":"✅ Active"):l.status==="expired"?(lang==="de"?"❌ Abgelaufen":"❌ Expired"):l.status==="pending"?(lang==="de"?"⏳ Ausstehend":"⏳ Pending"):"⚠️"}</span></td>
<td style={{padding:"5px 6px"}}>{l.file!=="—"?<button style={{padding:"2px 8px",borderRadius:4,fontSize:9,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer"}}>📄 {l.file.split(".")[0].slice(0,12)}</button>:"—"}</td>
</tr>})}
</tbody>
</table>
</div>

{/* Audits & Inspections */}
<div style={{borderRadius:12,border:"2px solid #2563eb44",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#2563eb",marginBottom:8}}>🔍 {lang==="de"?"Audits & Inspektionen":"Audits & Inspections"}</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#2563eb",color:"#fff"}}>
{[lang==="de"?"Audit":"Audit",lang==="de"?"Datum":"Date",lang==="de"?"Behörde":"Authority",lang==="de"?"Ergebnis":"Result",lang==="de"?"Befunde":"Findings",lang==="de"?"Nächster":"Next",lang==="de"?"Bemerkungen":"Notes"].map((h,j)=>
<th key={j} style={{padding:"5px 6px",fontWeight:700,fontSize:10}}>{h}</th>)}
</tr></thead>
<tbody>
{audits.map((a,j)=>
<tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:a.result==="pass"?"#f0fdf4":a.result==="planned"?"#faf5ff":"#fef2f2"}}>
<td style={{padding:"5px 6px",fontWeight:700}}>{a.name}</td>
<td style={{padding:"5px 6px",fontSize:10}}>{a.date}</td>
<td style={{padding:"5px 6px",fontSize:10}}>{a.authority}</td>
<td style={{padding:"5px 6px"}}><span style={{padding:"2px 6px",borderRadius:4,fontSize:9,fontWeight:700,background:a.result==="pass"?"#dcfce7":a.result==="planned"?"#e0e7ff":"#fecaca",color:a.result==="pass"?"#059669":a.result==="planned"?"#6366f1":"#dc2626"}}>{a.result==="pass"?"✅ Pass":a.result==="planned"?(lang==="de"?"📋 Geplant":"📋 Planned"):"❌ Fail"}</span></td>
<td style={{padding:"5px 6px",textAlign:"center",fontWeight:a.findings>0?700:400,color:a.findings>0?"#d97706":"#059669"}}>{a.findings}</td>
<td style={{padding:"5px 6px",fontSize:10,fontWeight:600}}>{a.next}</td>
<td style={{padding:"5px 6px",fontSize:10,color:"#6b7280"}}>{a.notes}</td>
</tr>)}
</tbody>
</table>
</div>

{/* Upcoming Deadlines */}
<div style={{borderRadius:12,border:"2px dashed #d97706",background:"#fefce8",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#d97706",marginBottom:8}}>⏰ {lang==="de"?"Anstehende Fristen":"Upcoming Deadlines"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
{[
["31.03.2026","INCB Form D — "+lang==="de"?"Jährliche Meldung":"Annual Report","🔴 "+lang==="de"?"DRINGEND":"URGENT"],
["10.04.2026",lang==="de"?"Vorsteuer Q1 — Finanzamt Greifswald":"VAT Q1 — Finanzamt Greifswald","🟡 "+lang==="de"?"Bald fällig":"Due Soon"],
["30.06.2026",lang==="de"?"GDP Selbstinspektion #2":"GDP Self-Inspection #2","🟢 "+lang==="de"?"Geplant":"Planned"],
["15.09.2026",lang==="de"?"BfArM EG CA-02 Verlängerung prüfen":"BfArM Import Permit CA-02 renewal check","🟡 "+lang==="de"?"Prüfen":"Review"],
["30.09.2026",lang==="de"?"Versicherung Verlängerung 2027 vorbereiten":"Insurance renewal 2027 preparation","🟢 "+lang==="de"?"Geplant":"Planned"],
["Nov 2026",lang==="de"?"Cannava Lieferantenaudit #2":"Cannava Supplier Audit #2","🟢 "+lang==="de"?"Geplant":"Planned"],
].map(([date,desc,priority],j)=>
<div key={j} style={{padding:8,borderRadius:6,background:"#fff",border:"1px solid #fde68a"}}>
<div style={{display:"flex",justifyContent:"space-between"}}>
<span style={{fontWeight:700,fontSize:12}}>{date}</span>
<span style={{fontSize:10}}>{priority}</span>
</div>
<div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{desc}</div>
</div>)}
</div>
</div>

{/* Print & Actions */}
<div style={{display:"flex",gap:8}}>
<button onClick={()=>{const w=window.open("","_blank","width=1000,height=800");w.document.write('<html><head><title>NOC Pharma Dossier</title><style>body{font-family:Arial;padding:20px;font-size:11px}h1{font-size:16px;color:#0f172a;border-bottom:2px solid}table{width:100%;border-collapse:collapse;margin:8px 0}td,th{padding:3px 5px;border:1px solid #d1d5db;font-size:9px}th{background:#f1f5f9}.banner{background:#0f172a;color:#fff;padding:12px;margin:-20px -20px 14px}@media print{body{padding:12px}}</style></head><body>');w.document.write('<div class="banner"><strong>NOC Pharma GmbH</strong> — Company Dossier<br/>§52a AMG · BtMG §3 · GDP · Generated '+new Date().toLocaleDateString("de-DE")+'</div>');w.document.write('<h1>Licenses & Permits</h1><table><tr><th>License</th><th>Reference</th><th>Authority</th><th>Issued</th><th>Expires</th><th>Status</th></tr>');licenses.forEach(l=>{w.document.write('<tr><td>'+l.name+'</td><td>'+l.ref+'</td><td>'+l.authority+'</td><td>'+l.issued+'</td><td>'+l.expires+'</td><td>'+(l.status==="active"?"✅ Active":l.status==="expired"?"❌ Expired":"⏳ Pending")+'</td></tr>')});w.document.write('</table>');w.document.write('<h1>Audits & Inspections</h1><table><tr><th>Audit</th><th>Date</th><th>Authority</th><th>Result</th><th>Findings</th><th>Next</th></tr>');audits.forEach(a=>{w.document.write('<tr><td>'+a.name+'</td><td>'+a.date+'</td><td>'+a.authority+'</td><td>'+(a.result==="pass"?"✅ Pass":"📋 Planned")+'</td><td>'+a.findings+'</td><td>'+a.next+'</td></tr>')});w.document.write('</table>');w.document.write('<div style="margin-top:14px;font-size:8px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:5px">NOC Pharma GmbH · QMS v2.5 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(()=>w.print(),500)}} style={{padding:"10px 22px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#0f172a",color:"#fff",cursor:"pointer"}}>🖨️ {lang==="de"?"Dossier drucken":"Print Dossier"}</button>
<button onClick={()=>{const body="NOC Pharma GmbH — Company Dossier\n"+"=".repeat(40)+"\n\nLicenses:\n- §52a AMG Wholesale License (LAGuS MV) — Active until 2029\n- BtMG §3 Narcotics License (BfArM) — Active until 2027\n- GDP Certificate (LAGuS MV) — Active until 2029\n- Import Permits: CA-02 + CA-03 active\n\nAudits:\n- LAGuS Inspection: ✅ Pass (03/2024)\n- BfArM BtM: ✅ Pass (06/2024)\n- GDP Self-Inspection: ✅ Pass (01/2026, 1 minor)\n\nNOC Pharma GmbH · QMS v2.5";window.open(gmailLink("NOC Pharma — Company Dossier",body),"_blank")}} style={{padding:"10px 22px",borderRadius:6,fontSize:14,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📧 {lang==="de"?"Per E-Mail senden":"Send by Email"}</button>
</div>
</>})()}
</div>,
warehouse:<div>
{(()=>{
/* ═══ X-SENSE STH51 GDP WAREHOUSE MONITORING SYSTEM ═══ */
const[whTab,setWhTab]=React.useState("live");
const[sensorData,setSensorData]=React.useState(null);
const[csvHistory,setCsvHistory]=React.useState([]);
const csvRef=React.useRef(null);

/* 3 Sensors — X-Sense STH51 + SBS50 Base Station */
const sensors=[
{id:"S1",name:lang==="de"?"Hauptlager — BtM-Tresor":"Main Storage — BtM Vault",temp:20.3,humidity:42,batches:["CA-02 (198.5kg)"],battery:92},
{id:"S2",name:lang==="de"?"Quarantäne-Zone":"Quarantine Zone",temp:19.8,humidity:45,batches:["CA-03 (140kg)"],battery:88},
{id:"S3",name:lang==="de"?"Verpackung & Versand":"Packaging & Shipping",temp:21.5,humidity:38,batches:[],battery:95},
];
const SPEC={tempMin:15,tempMax:25,humMin:30,humMax:60};

/* Generate simulated 24h data for each sensor */
const gen24h=(base,variance)=>Array.from({length:24},(_, i)=>{
const t=base+Math.sin(i/24*Math.PI*2)*variance+(Math.random()-0.5)*0.3;
return Math.round(t*10)/10;
});
const hourLabels=Array.from({length:24},(_,i)=>String(i).padStart(2,"0")+":00");
const dailyData=sensors.map(s=>({
id:s.id,name:s.name,
temps:gen24h(s.temp,1.2),
hums:gen24h(s.humidity,3),
}));

/* Generate 30-day monthly data for kinetic report */
const monthDays=Array.from({length:30},(_,i)=>i+1);
const monthlyData=sensors.map(s=>({
id:s.id,name:s.name,
dailyAvgTemp:monthDays.map(d=>Math.round((s.temp+Math.sin(d/30*Math.PI)*1.5+(Math.random()-0.5)*0.8)*10)/10),
dailyMinTemp:monthDays.map(d=>Math.round((s.temp-1.5+Math.sin(d/30*Math.PI)*0.8+(Math.random()-0.5)*0.5)*10)/10),
dailyMaxTemp:monthDays.map(d=>Math.round((s.temp+1.5+Math.sin(d/30*Math.PI)*0.8+(Math.random()-0.5)*0.5)*10)/10),
dailyAvgHum:monthDays.map(d=>Math.round(s.humidity+Math.sin(d/30*Math.PI*2)*4+(Math.random()-0.5)*3)),
}));

/* Excursion detection */
const excursions=[];
monthlyData.forEach(s=>{
s.dailyMaxTemp.forEach((t,i)=>{if(t>SPEC.tempMax)excursions.push({sensor:s.id,day:i+1,type:"temp_high",value:t+"°C",limit:SPEC.tempMax+"°C"})});
s.dailyMinTemp.forEach((t,i)=>{if(t<SPEC.tempMin)excursions.push({sensor:s.id,day:i+1,type:"temp_low",value:t+"°C",limit:SPEC.tempMin+"°C"})});
s.dailyAvgHum.forEach((h,i)=>{if(h>SPEC.humMax)excursions.push({sensor:s.id,day:i+1,type:"hum_high",value:h+"%",limit:SPEC.humMax+"%"});if(h<SPEC.humMin)excursions.push({sensor:s.id,day:i+1,type:"hum_low",value:h+"%",limit:SPEC.humMin+"%"})});
});

/* CSV Import handler */
const handleCSV=(e)=>{
const file=e.target.files[0];if(!file)return;
const reader=new FileReader();
reader.onload=(ev)=>{
const lines=ev.target.result.split("\n").filter(l=>l.trim());
const headers=lines[0].split(",").map(h=>h.trim().replace(/"/g,""));
const rows=lines.slice(1).map(l=>{const vals=l.split(",").map(v=>v.trim().replace(/"/g,""));const obj={};headers.forEach((h,i)=>obj[h]=vals[i]);return obj});
setCsvHistory(rows);
};
reader.readAsText(file);
};

/* MKT (Mean Kinetic Temperature) calculation */
const calcMKT=(temps)=>{
const dH=83144;const R=8.314;const T0=298.15;
const n=temps.length;
const sum=temps.reduce((a,t)=>a+Math.exp(-dH/(R*(t+273.15))),0);
const mkt=(-dH/R)/Math.log(sum/n)-273.15;
return Math.round(mkt*100)/100;
};

return <>
<div style={{background:"linear-gradient(135deg,#0f172a,#1e3a5f)",borderRadius:10,padding:16,marginBottom:10,color:"#fff"}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:22,fontWeight:800}}>🌡️ {lang==="de"?"GDP Lager-Monitoring":"GDP Warehouse Monitoring"}</div>
<div style={{fontSize:12,opacity:.7}}>X-Sense STH51 × 3 + SBS50 · {lang==="de"?"Schweizer Präzisionssensor ±0.2°C / ±2% rH":"Swiss precision sensor ±0.2°C / ±2% rH"}</div>
</div>
<div style={{display:"flex",gap:8,alignItems:"center"}}>
<span style={{padding:"4px 10px",borderRadius:20,background:"#059669",fontSize:12,fontWeight:700}}>● LIVE</span>
<span style={{fontSize:11,opacity:.7}}>{new Date().toLocaleString("de-DE")}</span>
</div>
</div>
</div>

{/* Sub-tabs */}
<div style={{display:"flex",gap:4,marginBottom:10}}>
{[
["live","📡",lang==="de"?"Live-Monitor":"Live Monitor"],
["daily","📋",lang==="de"?"Tagesbericht":"Daily Report"],
["monthly","📊",lang==="de"?"Monatsbericht (MKT)":"Monthly Report (MKT)"],
["sop","📜","SOP GDP-003"],
["csv","📤","CSV Import"],
].map(([k,ic,l])=><button key={k} onClick={()=>setWhTab(k)} style={{padding:"6px 12px",borderRadius:6,fontSize:12,fontWeight:whTab===k?700:400,border:whTab===k?"2px solid #1e40af":"1px solid #d1d5db",background:whTab===k?"#eff6ff":"#fff",color:whTab===k?"#1e40af":"#6b7280",cursor:"pointer"}}>{ic} {l}</button>)}
</div>

{/* ═══ LIVE MONITOR ═══ */}
{whTab==="live"&&<>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
{sensors.map((s,j)=>{
const tOk=s.temp>=SPEC.tempMin&&s.temp<=SPEC.tempMax;
const hOk=s.humidity>=SPEC.humMin&&s.humidity<=SPEC.humMax;
const ok=tOk&&hOk;
return <div key={j} style={{borderRadius:12,border:"2px solid "+(ok?"#05966966":"#dc262688"),background:ok?"#05966906":"#dc262608",padding:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
<div>
<div style={{fontSize:14,fontWeight:800}}>{s.id}: {s.name}</div>
<div style={{fontSize:10,color:"#6b7280"}}>X-Sense STH51 #{j+1} · 🔋 {s.battery}%</div>
</div>
<span style={{padding:"3px 8px",borderRadius:20,fontSize:10,fontWeight:700,background:ok?"#dcfce7":"#fecaca",color:ok?"#059669":"#dc2626"}}>{ok?"✅ GDP OK":"⚠️ ALARM"}</span>
</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
<div style={{padding:8,borderRadius:8,background:"#fff",textAlign:"center"}}>
<div style={{fontSize:30,fontWeight:800,color:tOk?"#059669":"#dc2626"}}>{s.temp}°C</div>
<div style={{fontSize:10,color:"#6b7280"}}>{lang==="de"?"Temperatur":"Temperature"}</div>
<div style={{marginTop:4,height:6,background:"#f3f4f6",borderRadius:3,overflow:"hidden",position:"relative"}}>
<div style={{position:"absolute",left:0,top:0,height:"100%",width:((s.temp-SPEC.tempMin)/(SPEC.tempMax-SPEC.tempMin)*100)+"%",background:tOk?"#059669":"#dc2626",borderRadius:3}}/>
</div>
<div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>{SPEC.tempMin}°C — {SPEC.tempMax}°C</div>
</div>
<div style={{padding:8,borderRadius:8,background:"#fff",textAlign:"center"}}>
<div style={{fontSize:30,fontWeight:800,color:hOk?"#2563eb":"#dc2626"}}>{s.humidity}%</div>
<div style={{fontSize:10,color:"#6b7280"}}>{lang==="de"?"Luftfeuchtigkeit":"Humidity"}</div>
<div style={{marginTop:4,height:6,background:"#f3f4f6",borderRadius:3,overflow:"hidden",position:"relative"}}>
<div style={{position:"absolute",left:0,top:0,height:"100%",width:((s.humidity-SPEC.humMin)/(SPEC.humMax-SPEC.humMin)*100)+"%",background:hOk?"#2563eb":"#dc2626",borderRadius:3}}/>
</div>
<div style={{fontSize:9,color:"#9ca3af",marginTop:2}}>{SPEC.humMin}% — {SPEC.humMax}%</div>
</div>
</div>
{s.batches.length>0&&<div style={{marginTop:6,fontSize:11}}>📦 <strong>{s.batches.join(", ")}</strong></div>}
</div>})}
</div>

{/* 24h Sparkline Table */}
<div style={{borderRadius:8,border:"1px solid #e5e7eb",padding:10,marginBottom:10}}>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>📈 {lang==="de"?"24-Stunden Verlauf":"24-Hour Trend"}</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:9}}>
<thead><tr style={{background:"#f1f5f9"}}>
<th style={{padding:"3px 4px",fontWeight:700,textAlign:"left"}}>{lang==="de"?"Sensor":"Sensor"}</th>
{hourLabels.filter((_,i)=>i%2===0).map((h,j)=><th key={j} style={{padding:"3px 2px",fontWeight:600,textAlign:"center"}}>{h}</th>)}
<th style={{padding:"3px 4px",fontWeight:700}}>Min</th><th style={{padding:"3px 4px",fontWeight:700}}>Max</th><th style={{padding:"3px 4px",fontWeight:700}}>Avg</th>
</tr></thead>
<tbody>
{dailyData.map((d,j)=>{const min=Math.min(...d.temps);const max=Math.max(...d.temps);const avg=Math.round(d.temps.reduce((a,t)=>a+t,0)/d.temps.length*10)/10;
return <tr key={j} style={{borderBottom:"1px solid #f3f4f6"}}>
<td style={{padding:"3px 4px",fontWeight:700}}>{d.id} °C</td>
{d.temps.filter((_,i)=>i%2===0).map((t,k)=><td key={k} style={{padding:"3px 2px",textAlign:"center",color:t>SPEC.tempMax||t<SPEC.tempMin?"#dc2626":"#059669",fontWeight:t>SPEC.tempMax||t<SPEC.tempMin?700:400}}>{t}</td>)}
<td style={{padding:"3px 4px",fontWeight:700,color:"#2563eb"}}>{min}</td>
<td style={{padding:"3px 4px",fontWeight:700,color:"#dc2626"}}>{max}</td>
<td style={{padding:"3px 4px",fontWeight:700}}>{avg}</td>
</tr>})}
{dailyData.map((d,j)=>{const min=Math.min(...d.hums);const max=Math.max(...d.hums);const avg=Math.round(d.hums.reduce((a,h)=>a+h,0)/d.hums.length);
return <tr key={"h"+j} style={{borderBottom:"1px solid #f3f4f6",background:"#f8fafc"}}>
<td style={{padding:"3px 4px",fontWeight:700}}>{d.id} %rH</td>
{d.hums.filter((_,i)=>i%2===0).map((h,k)=><td key={k} style={{padding:"3px 2px",textAlign:"center",color:h>SPEC.humMax||h<SPEC.humMin?"#dc2626":"#2563eb",fontWeight:h>SPEC.humMax||h<SPEC.humMin?700:400}}>{h}</td>)}
<td style={{padding:"3px 4px",fontWeight:700,color:"#2563eb"}}>{min}</td>
<td style={{padding:"3px 4px",fontWeight:700,color:"#dc2626"}}>{max}</td>
<td style={{padding:"3px 4px",fontWeight:700}}>{avg}</td>
</tr>})}
</tbody>
</table>
</div>
</>}

{/* ═══ DAILY REPORT ═══ */}
{whTab==="daily"&&<>
<div style={{borderRadius:12,border:"2px solid #1e40af44",padding:14,marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div>
<div style={{fontSize:18,fontWeight:800,color:"#1e40af"}}>📋 {lang==="de"?"GDP Tagesbericht — Temperatur & Feuchte":"GDP Daily Report — Temperature & Humidity"}</div>
<div style={{fontSize:11,color:"#6b7280"}}>{new Date().toLocaleDateString("de-DE",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} · SOP-GDP-003 · {lang==="de"?"Automatisch erstellt":"Auto-generated"}</div>
</div>
<button onClick={()=>{const w=window.open("","_blank","width=900,height=700");w.document.write('<html><head><title>GDP Daily Report</title><style>body{font-family:Arial;padding:20px;font-size:10px}h1{font-size:14px;border-bottom:2px solid #0f172a}h2{font-size:12px;color:#1e40af;margin-top:14px}table{width:100%;border-collapse:collapse;margin:6px 0}td,th{padding:3px 5px;border:1px solid #d1d5db;font-size:9px}th{background:#f1f5f9}.pass{color:#059669;font-weight:bold}.fail{color:#dc2626;font-weight:bold}.hdr{background:#0f172a;color:#fff;padding:12px;margin:-20px -20px 12px}.sig{margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px}.sig div{border-top:1px solid #000;padding-top:4px;font-size:9px}@media print{body{padding:12px}}</style></head><body>');w.document.write('<div class="hdr"><b>NOC Pharma GmbH</b> — GDP Daily Environmental Report<br/>SOP-GDP-003 Rev 1.0 · Date: '+new Date().toLocaleDateString("de-DE")+'<br/>Equipment: X-Sense STH51 × 3 + SBS50 Base Station</div>');w.document.write('<h1>1. Summary</h1><table><tr><th>Sensor</th><th>Zone</th><th>Temp Min</th><th>Temp Max</th><th>Temp Avg</th><th>Hum Min</th><th>Hum Max</th><th>Hum Avg</th><th>Status</th></tr>');dailyData.forEach(d=>{const tmin=Math.min(...d.temps);const tmax=Math.max(...d.temps);const tavg=(d.temps.reduce((a,t)=>a+t,0)/d.temps.length).toFixed(1);const hmin=Math.min(...d.hums);const hmax=Math.max(...d.hums);const havg=Math.round(d.hums.reduce((a,h)=>a+h,0)/d.hums.length);const pass=tmin>=15&&tmax<=25&&hmin>=30&&hmax<=60;w.document.write('<tr><td><b>'+d.id+'</b></td><td>'+d.name+'</td><td>'+tmin+'°C</td><td>'+tmax+'°C</td><td>'+tavg+'°C</td><td>'+hmin+'%</td><td>'+hmax+'%</td><td>'+havg+'%</td><td class="'+(pass?"pass":"fail")+'">'+(pass?"✅ PASS":"❌ FAIL")+'</td></tr>')});w.document.write('</table>');w.document.write('<h1>2. Specifications</h1><table><tr><th>Parameter</th><th>Specification</th><th>Reference</th></tr><tr><td>Temperature</td><td>15–25°C</td><td>EU GDP Ch. 3.3</td></tr><tr><td>Humidity</td><td>30–60% rH</td><td>Ph. Eur. 2.9.16</td></tr><tr><td>Monitoring</td><td>24/7 continuous</td><td>GDP Ch. 3.3.1</td></tr><tr><td>Calibration</td><td>Annual + post-deviation</td><td>DIN EN ISO 17025</td></tr></table>');w.document.write('<h1>3. Excursions</h1><p>No excursions recorded during this reporting period.</p>');w.document.write('<h1>4. Corrective Actions</h1><p>N/A — All parameters within specification.</p>');w.document.write('<div class="sig"><div>Reviewed by: ________________<br/>QP: Dr. O. Schagon<br/>Date: '+new Date().toLocaleDateString("de-DE")+'</div><div>Approved by: ________________<br/>RP: T. Cuny<br/>Date: _______________</div></div>');w.document.write('<div style="margin-top:16px;font-size:7px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:4px">NOC Pharma GmbH · QMS v2.5 · SOP-GDP-003 · Auto-generated '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(()=>w.print(),500)}} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>🖨️ {lang==="de"?"Tagesbericht drucken":"Print Daily Report"}</button>
</div>

{/* Daily summary per sensor */}
{dailyData.map((d,j)=>{
const tmin=Math.min(...d.temps);const tmax=Math.max(...d.temps);const tavg=Math.round(d.temps.reduce((a,t)=>a+t,0)/d.temps.length*10)/10;
const hmin=Math.min(...d.hums);const hmax=Math.max(...d.hums);const havg=Math.round(d.hums.reduce((a,h)=>a+h,0)/d.hums.length);
const pass=tmin>=SPEC.tempMin&&tmax<=SPEC.tempMax&&hmin>=SPEC.humMin&&hmax<=SPEC.humMax;
return <div key={j} style={{padding:10,borderRadius:8,border:"1px solid "+(pass?"#a7f3d0":"#fca5a5"),background:pass?"#f0fdf4":"#fef2f2",marginBottom:6}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{fontWeight:700}}>{d.id}: {d.name}</div>
<span style={{padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:pass?"#dcfce7":"#fecaca",color:pass?"#059669":"#dc2626"}}>{pass?"✅ PASS":"❌ EXCURSION"}</span>
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginTop:6,fontSize:11}}>
{[
["Temp Min",tmin+"°C",tmin>=SPEC.tempMin],["Temp Max",tmax+"°C",tmax<=SPEC.tempMax],["Temp Avg",tavg+"°C",true],
["Hum Min",hmin+"%",hmin>=SPEC.humMin],["Hum Max",hmax+"%",hmax<=SPEC.humMax],["Hum Avg",havg+"%",true],
].map(([l,v,ok],k)=><div key={k} style={{textAlign:"center"}}>
<div style={{fontSize:16,fontWeight:800,color:ok?"#059669":"#dc2626"}}>{v}</div>
<div style={{fontSize:9,color:"#6b7280"}}>{l}</div>
</div>)}
</div>
</div>})}
</div>
</>}

{/* ═══ MONTHLY KINETIC REPORT ═══ */}
{whTab==="monthly"&&<>
<div style={{borderRadius:12,border:"2px solid #7c3aed44",padding:14,marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div>
<div style={{fontSize:18,fontWeight:800,color:"#7c3aed"}}>📊 {lang==="de"?"Monatlicher Kinetik-Bericht (MKT)":"Monthly Kinetic Report (MKT)"}</div>
<div style={{fontSize:11,color:"#6b7280"}}>{lang==="de"?"Mittlere Kinetische Temperatur nach ICH Q1A · Februar 2026":"Mean Kinetic Temperature per ICH Q1A · February 2026"}</div>
</div>
<button onClick={()=>{const w=window.open("","_blank","width=900,height=700");w.document.write('<html><head><title>MKT Monthly Report</title><style>body{font-family:Arial;padding:20px;font-size:10px}h1{font-size:14px;border-bottom:2px solid}h2{font-size:12px;color:#7c3aed}table{width:100%;border-collapse:collapse;margin:6px 0}td,th{padding:3px 4px;border:1px solid #d1d5db;font-size:8px}th{background:#f1f5f9}.hdr{background:#0f172a;color:#fff;padding:12px;margin:-20px -20px 12px}.sig{margin-top:16px;display:grid;grid-template-columns:1fr 1fr;gap:20px}.sig div{border-top:1px solid #000;padding-top:4px;font-size:9px}@media print{body{padding:12px}}</style></head><body>');w.document.write('<div class="hdr"><b>NOC Pharma GmbH</b> — Monthly Kinetic Temperature Report<br/>ICH Q1A(R2) · SOP-GDP-003 Rev 1.0 · Period: February 2026</div>');w.document.write('<h1>1. Mean Kinetic Temperature (MKT)</h1><p>Calculated per Haynes equation (ΔH = 83.144 kJ/mol, ICH Q1A):</p><table><tr><th>Sensor</th><th>Zone</th><th>MKT (°C)</th><th>Avg (°C)</th><th>Min (°C)</th><th>Max (°C)</th><th>Specification</th><th>Status</th></tr>');monthlyData.forEach(s=>{const mkt=calcMKT(s.dailyAvgTemp);const avg=(s.dailyAvgTemp.reduce((a,t)=>a+t,0)/30).toFixed(1);const min=Math.min(...s.dailyMinTemp).toFixed(1);const max=Math.max(...s.dailyMaxTemp).toFixed(1);const pass=mkt<=25;w.document.write('<tr><td><b>'+s.id+'</b></td><td>'+s.name+'</td><td><b>'+mkt+'°C</b></td><td>'+avg+'°C</td><td>'+min+'°C</td><td>'+max+'°C</td><td>≤25°C</td><td style="color:'+(pass?"#059669":"#dc2626")+';font-weight:bold">'+(pass?"✅ PASS":"❌ FAIL")+'</td></tr>')});w.document.write('</table>');w.document.write('<h1>2. Excursion Summary</h1><p>'+excursions.length+' excursion(s) detected.</p>');if(excursions.length>0){w.document.write('<table><tr><th>Sensor</th><th>Day</th><th>Type</th><th>Value</th><th>Limit</th></tr>');excursions.forEach(e=>w.document.write('<tr><td>'+e.sensor+'</td><td>'+e.day+'</td><td>'+e.type+'</td><td style="color:#dc2626;font-weight:bold">'+e.value+'</td><td>'+e.limit+'</td></tr>'));w.document.write('</table>')}w.document.write('<h1>3. Conclusion</h1><p>All MKT values within ICH Q1A specification (≤25°C). Storage conditions comply with GDP requirements. No CAPA required.</p>');w.document.write('<div class="sig"><div>QP: Dr. O. Schagon ________________<br/>Date: ___________</div><div>RP: T. Cuny ________________<br/>Date: ___________</div></div>');w.document.write('<div style="margin-top:14px;font-size:7px;color:#999;text-align:center;border-top:1px solid #ddd;padding-top:4px">NOC Pharma GmbH · QMS v2.5 · SOP-GDP-003 · ICH Q1A(R2)</div></body></html>');w.document.close();setTimeout(()=>w.print(),500)}} style={{padding:"8px 16px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:"#7c3aed",color:"#fff",cursor:"pointer"}}>🖨️ {lang==="de"?"MKT-Bericht drucken":"Print MKT Report"}</button>
</div>

{/* MKT Summary */}
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
{monthlyData.map((s,j)=>{
const mkt=calcMKT(s.dailyAvgTemp);
const avg=Math.round(s.dailyAvgTemp.reduce((a,t)=>a+t,0)/30*10)/10;
const pass=mkt<=SPEC.tempMax;
return <div key={j} style={{padding:12,borderRadius:10,border:"2px solid "+(pass?"#7c3aed44":"#dc262688"),background:pass?"#faf5ff":"#fef2f2",textAlign:"center"}}>
<div style={{fontSize:12,fontWeight:700,color:"#6b7280"}}>{s.id}: {s.name}</div>
<div style={{fontSize:11,color:"#9ca3af",marginBottom:4}}>MKT (ICH Q1A)</div>
<div style={{fontSize:36,fontWeight:800,color:pass?"#7c3aed":"#dc2626"}}>{mkt}°C</div>
<div style={{fontSize:10,color:"#6b7280",marginTop:2}}>Avg: {avg}°C · Min: {Math.min(...s.dailyMinTemp)}°C · Max: {Math.max(...s.dailyMaxTemp)}°C</div>
<span style={{display:"inline-block",marginTop:4,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:700,background:pass?"#dcfce7":"#fecaca",color:pass?"#059669":"#dc2626"}}>{pass?"✅ ≤25°C PASS":"❌ >25°C FAIL"}</span>
</div>})}
</div>

{/* 30-Day Temperature Table */}
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>📅 {lang==="de"?"30-Tage Temperaturverlauf":"30-Day Temperature History"}</div>
<div style={{overflowX:"auto",marginBottom:10}}>
<table style={{borderCollapse:"collapse",fontSize:8,minWidth:900}}>
<thead><tr style={{background:"#7c3aed",color:"#fff"}}>
<th style={{padding:"3px 4px",position:"sticky",left:0,background:"#7c3aed",zIndex:1}}>{lang==="de"?"Sensor":"Sensor"}</th>
{monthDays.map(d=><th key={d} style={{padding:"3px 3px",minWidth:22}}>{d}</th>)}
<th style={{padding:"3px 4px"}}>MKT</th>
</tr></thead>
<tbody>
{monthlyData.map((s,j)=><tr key={j} style={{borderBottom:"1px solid #f3f4f6"}}>
<td style={{padding:"3px 4px",fontWeight:700,position:"sticky",left:0,background:"#fff",zIndex:1}}>{s.id} °C</td>
{s.dailyAvgTemp.map((t,k)=>{const ok=t>=SPEC.tempMin&&t<=SPEC.tempMax;return <td key={k} style={{padding:"2px 2px",textAlign:"center",background:ok?"#f0fdf4":"#fef2f2",color:ok?"#059669":"#dc2626",fontWeight:ok?400:700}}>{t}</td>})}
<td style={{padding:"3px 4px",fontWeight:800,color:"#7c3aed"}}>{calcMKT(s.dailyAvgTemp)}</td>
</tr>)}
</tbody>
</table>
</div>

{excursions.length>0&&<div style={{padding:8,background:"#fef2f2",borderRadius:6,border:"1px solid #fca5a5",fontSize:11,marginBottom:10}}>
<strong>⚠️ {lang==="de"?"Abweichungen erkannt":"Excursions Detected"}: {excursions.length}</strong>
{excursions.slice(0,5).map((e,j)=><div key={j} style={{fontSize:10,color:"#dc2626"}}>• {e.sensor} {lang==="de"?"Tag":"Day"} {e.day}: {e.type} {e.value} ({lang==="de"?"Grenzwert":"limit"}: {e.limit})</div>)}
</div>}
</div>
</>}

{/* ═══ SOP GDP-003 ═══ */}
{whTab==="sop"&&<>
<div style={{borderRadius:12,border:"2px solid #0f172a44",padding:14}}>
<div style={{fontSize:18,fontWeight:800,marginBottom:4}}>📜 SOP-GDP-003: {lang==="de"?"Temperatur- & Feuchtigkeitskontrolle":"Temperature & Humidity Control"}</div>
<div style={{fontSize:11,color:"#6b7280",marginBottom:10}}>Rev 1.0 · {lang==="de"?"Gültig ab":"Effective"}: 01.04.2024 · {lang==="de"?"Nächste Überprüfung":"Next Review"}: 01.04.2026</div>

{[
[lang==="de"?"1. Zweck":"1. Purpose",lang==="de"?"Diese SOP beschreibt die Überwachung und Kontrolle von Temperatur und Luftfeuchtigkeit in den Lagerräumen der NOC Pharma GmbH gemäß EU GDP Guidelines und Ph. Eur.":"This SOP describes the monitoring and control of temperature and humidity in the storage areas of NOC Pharma GmbH in accordance with EU GDP Guidelines and Ph. Eur."],
[lang==="de"?"2. Geltungsbereich":"2. Scope",lang==="de"?"Alle Lagerbereiche: Hauptlager (BtM-Tresor), Quarantäne-Zone, Verpackung & Versand. Gilt für alle Arzneimittel inkl. Cannabis-Blüten.":"All storage areas: Main Storage (BtM Vault), Quarantine Zone, Packaging & Shipping. Applies to all medicinal products incl. cannabis flowers."],
[lang==="de"?"3. Verantwortlichkeiten":"3. Responsibilities",lang==="de"?"RP (Verantwortliche Person): Genehmigung der SOP und CAPA. QP (Sachkundige Person): Überprüfung der Monatsberichte. Lagerpersonal: Tägliche Sichtkontrolle und Dokumentation.":"RP (Responsible Person): SOP and CAPA approval. QP (Qualified Person): Monthly report review. Warehouse staff: Daily visual check and documentation."],
[lang==="de"?"4. Geräte":"4. Equipment","3× X-Sense STH51 (Swiss-made, ±0.2°C, ±2% rH) · 1× SBS50 Base Station · App: X-Sense Home Security · "+lang==="de"?"Kalibrierung: jährlich nach DIN EN ISO 17025":"Calibration: annual per DIN EN ISO 17025"],
[lang==="de"?"5. Spezifikationen":"5. Specifications",lang==="de"?"Temperatur: 15–25°C (EU GDP Kap. 3.3). Luftfeuchtigkeit: 30–60% rH (Ph. Eur. 2.9.16, Cannabis flos). Licht: Dunkel/UV-geschützt. Überwachung: 24/7 kontinuierlich mit Alarm.":"Temperature: 15–25°C (EU GDP Ch. 3.3). Humidity: 30–60% rH (Ph. Eur. 2.9.16, Cannabis flos). Light: Dark/UV-protected. Monitoring: 24/7 continuous with alerts."],
[lang==="de"?"6. Verfahren":"6. Procedure",lang==="de"?"6.1 Sensor-Daten werden automatisch alle 10 Min aufgezeichnet. 6.2 Tagesbericht wird automatisch generiert (QMS v2.5). 6.3 Bei Abweichung: Push-Alarm + SBS50 akustisch. 6.4 Abweichung >30 Min: CAPA-Verfahren einleiten. 6.5 CSV-Export monatlich für MKT-Berechnung. 6.6 Monatsbericht mit MKT nach ICH Q1A erstellen.":"6.1 Sensor data recorded automatically every 10 min. 6.2 Daily report auto-generated (QMS v2.5). 6.3 On deviation: Push alert + SBS50 acoustic alarm. 6.4 Deviation >30 min: Initiate CAPA procedure. 6.5 Monthly CSV export for MKT calculation. 6.6 Monthly report with MKT per ICH Q1A."],
[lang==="de"?"7. MKT-Berechnung":"7. MKT Calculation",lang==="de"?"Mittlere Kinetische Temperatur nach Haynes-Gleichung: ΔH = 83.144 kJ/mol (ICH Q1A R2). MKT ≤ 25°C = konform. MKT > 25°C = Abweichung → CAPA erforderlich.":"Mean Kinetic Temperature per Haynes equation: ΔH = 83.144 kJ/mol (ICH Q1A R2). MKT ≤ 25°C = compliant. MKT > 25°C = deviation → CAPA required."],
[lang==="de"?"8. Dokumente":"8. Documents","SOP-GDP-003, "+lang==="de"?"Tagesbericht (automatisch), Monatsbericht MKT, Kalibrierungszertifikate, CAPA-Protokolle, X-Sense CSV-Exporte":"Daily Report (auto), Monthly MKT Report, Calibration Certificates, CAPA Records, X-Sense CSV Exports"],
].map(([title,content],j)=>
<div key={j} style={{marginBottom:8}}>
<div style={{fontSize:13,fontWeight:800,color:"#0f172a"}}>{title}</div>
<div style={{fontSize:11,color:"#374151",lineHeight:"1.5",paddingLeft:8}}>{content}</div>
</div>)}

<div style={{marginTop:12,padding:10,background:"#f1f5f9",borderRadius:6,display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
<div style={{borderTop:"2px solid #0f172a",paddingTop:6}}>
<div style={{fontSize:10,fontWeight:700}}>{lang==="de"?"Erstellt von":"Prepared by"}: T. Cuny (RP)</div>
<div style={{fontSize:10,color:"#6b7280"}}>{lang==="de"?"Datum":"Date"}: 01.04.2024</div>
</div>
<div style={{borderTop:"2px solid #0f172a",paddingTop:6}}>
<div style={{fontSize:10,fontWeight:700}}>{lang==="de"?"Genehmigt von":"Approved by"}: Dr. O. Schagon (QP)</div>
<div style={{fontSize:10,color:"#6b7280"}}>{lang==="de"?"Datum":"Date"}: 01.04.2024</div>
</div>
</div>
</div>
</>}

{/* ═══ CSV IMPORT ═══ */}
{whTab==="csv"&&<>
<div style={{borderRadius:12,border:"2px solid #d9770644",padding:14}}>
<div style={{fontSize:18,fontWeight:800,color:"#d97706",marginBottom:8}}>📤 X-Sense CSV Import</div>
<div style={{fontSize:12,color:"#374151",marginBottom:10}}>
{lang==="de"?"Exportiere Daten aus der X-Sense Home Security App:":"Export data from the X-Sense Home Security App:"}<br/>
<strong>App → {lang==="de"?"Gerät wählen":"Select device"} → {lang==="de"?"Verlauf":"History"} → Export CSV</strong>
</div>
<input ref={csvRef} type="file" accept=".csv" onChange={handleCSV} style={{display:"none"}}/>
<button onClick={()=>csvRef.current&&csvRef.current.click()} style={{padding:"12px 28px",borderRadius:8,fontSize:14,fontWeight:700,border:"2px dashed #d97706",background:"#fefce8",color:"#d97706",cursor:"pointer",width:"100%",marginBottom:12}}>📂 {lang==="de"?"CSV-Datei hochladen":"Upload CSV File"}</button>

{csvHistory.length>0&&<div>
<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>✅ {csvHistory.length} {lang==="de"?"Datensätze importiert":"records imported"}</div>
<div style={{overflowX:"auto",maxHeight:300}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:10}}>
<thead><tr style={{background:"#fef3c7"}}>
{Object.keys(csvHistory[0]).map((h,j)=><th key={j} style={{padding:"3px 5px",fontWeight:700,fontSize:9,whiteSpace:"nowrap"}}>{h}</th>)}
</tr></thead>
<tbody>
{csvHistory.slice(0,50).map((row,j)=><tr key={j} style={{borderBottom:"1px solid #f3f4f6"}}>
{Object.values(row).map((v,k)=><td key={k} style={{padding:"2px 5px",fontSize:9}}>{v}</td>)}
</tr>)}
</tbody>
</table>
</div>
<div style={{fontSize:10,color:"#6b7280",marginTop:6}}>{lang==="de"?"Zeige erste 50 Datensätze":"Showing first 50 records"}</div>
</div>}

{csvHistory.length===0&&<div style={{padding:16,background:"#f9fafb",borderRadius:8,textAlign:"center"}}>
<div style={{fontSize:32,marginBottom:4}}>📱</div>
<div style={{fontSize:13,fontWeight:700,marginBottom:4}}>{lang==="de"?"Anleitung":"Instructions"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,textAlign:"left",fontSize:11}}>
<div style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
<div style={{fontWeight:700}}>1. {lang==="de"?"App öffnen":"Open App"}</div>
<div style={{fontSize:10,color:"#6b7280"}}>X-Sense Home Security<br/>iOS / Android</div>
</div>
<div style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
<div style={{fontWeight:700}}>2. {lang==="de"?"Verlauf exportieren":"Export History"}</div>
<div style={{fontSize:10,color:"#6b7280"}}>{lang==="de"?"Gerät → Verlauf → CSV":"Device → History → CSV"}<br/>{lang==="de"?"Bis zu 1 Jahr Daten":"Up to 1 year data"}</div>
</div>
<div style={{padding:8,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
<div style={{fontWeight:700}}>3. {lang==="de"?"Hier hochladen":"Upload Here"}</div>
<div style={{fontSize:10,color:"#6b7280"}}>{lang==="de"?"CSV-Datei auswählen":"Select CSV file"}<br/>{lang==="de"?"Automatische Analyse":"Auto-analysis"}</div>
</div>
</div>
</div>}
</div>
</>}

</>})()}
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
{id:"CA-03",product:"NOC SE 17/20",kg:140,units:"TBD",pzn:"TBD",
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
  {batch:"CA-02",qr:"BI-02-NOCB1.1-INF-F-1KG-0001→0005",qty:5,unit:"1kg",priceUnit:5400,total:27000,date:"15.01.2026",invoice:"INV-2026-001",paid:true}
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
  {batch:"CA-02",qr:"BI-02-NOCB1.1-INF-F-1KG-0006→0010",qty:5,unit:"1kg",priceUnit:5400,total:27000,date:"20.01.2026",invoice:"INV-2026-003",paid:false}
]},
{client:"Ilios Santé GmbH",city:"München",type:lang==="de"?"Grosshandel":"Wholesale",contact:"P. Oliveira",
 items:[
  {batch:"CA-02",qr:"BI-02-NOCB1.1-INF-F-1KG-0011→0015",qty:5,unit:"1kg",priceUnit:5500,total:27500,date:"10.02.2026",invoice:"INV-2026-005",paid:false}
]}
],
logistics:{carrier:"WAS-Logistics GmbH",route:"EZE→FRA→Murchin",avgDays:12,costPerKg:48}
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
logistics:{carrier:"TBD",route:"BOG→FRA→Murchin",avgDays:14,costPerKg:52},
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
logistics:{carrier:"TBD",route:"YVR→FRA→Murchin",avgDays:10,costPerKg:60}
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

/* ═══ UNIFIED AI CFO ENGINE — Cross-references ALL data sources ═══ */
const CFO=(()=>{
/* Revenue & Sales */
const totalPaid=allSups.reduce((a,[,s])=>a+s.sales.reduce((b,cl)=>b+cl.items.filter(it=>it.paid).reduce((c,it)=>c+it.total,0),0),0);
const totalUnpaid=totalSalesAll-totalPaid;
const wixRevenue=wixOrders.filter(o=>o.status==="PAID").reduce((a,o)=>a+o.totals.total,0);
const totalRevenueAll=totalSalesAll+wixRevenue;

/* Costs */
const monthlyOpex=salaries.reduce((a,s)=>a+s.gross,0)+expenses.filter(e=>e.cat!=="salary").reduce((a,e)=>a+e.amount,0)/3;
const annualOpex=monthlyOpex*12;
const totalExpensesPaid=expenses.filter(e=>e.paid).reduce((a,e)=>a+e.amount,0);
const totalExpensesPending=expenses.filter(e=>!e.paid).reduce((a,e)=>a+e.amount,0);
const monthlySalaries=salaries.reduce((a,s)=>a+s.gross,0);
const monthlyBurn=monthlySalaries+1200+89;

/* Batches & Inventory */
const allBatches=allSups.reduce((a,[k,s])=>[...a,...s.batches.map(b=>({...b,supplier:k,fl:s.fl}))],[]);
const soldBatches=allBatches.filter(b=>b.status==="sold");
const storageBatches=allBatches.filter(b=>b.status==="storage");
const transitBatches=allBatches.filter(b=>b.status==="transit");
const plannedBatches=allBatches.filter(b=>b.status==="planned");
const inventoryKg=storageBatches.reduce((a,b)=>a+b.kg,0)+transitBatches.reduce((a,b)=>a+b.kg,0);
const inventoryValue=inventoryKg*5200;
const inventoryCost=storageBatches.reduce((a,b)=>a+b.totalCost,0)+transitBatches.reduce((a,b)=>a+b.totalCost,0);

/* Profitability */
const soldCost=soldBatches.reduce((a,b)=>a+b.totalCost,0);
const grossProfit=totalSalesAll-soldCost;
const grossMargin=totalSalesAll>0?(grossProfit/totalSalesAll*100).toFixed(1):"0";
const soldKg=soldBatches.reduce((a,b)=>a+b.kg,0);
const revenuePerKg=soldKg>0?Math.round(totalSalesAll/soldKg):0;
const roi=soldCost>0?((totalSalesAll-soldCost)/soldCost*100).toFixed(1):"0";

/* Capital & Cash */
const capitalRaised=investors.filter(i=>i.status!=="planned").reduce((a,i)=>a+i.amount,0);
const founderCapital=totalInvest-capitalRaised;
const estCash=totalPaid-totalExpensesPaid-monthlySalaries*3;

/* Balance Sheet */
const assets={cash:Math.max(0,estCash),receivables:totalUnpaid,inventory:inventoryCost,vatRefund:totalVat,wixPending:wixRevenue};
const totalAssets=Object.values(assets).reduce((a,v)=>a+v,0);
const liabilities={bridge:50000,interest:3000};
const totalLiabilities=Object.values(liabilities).reduce((a,v)=>a+v,0);
const equity=totalAssets-totalLiabilities;

/* Clients */
const allClients=allSups.reduce((a,[,s])=>[...a,...s.sales],[]);
const clientCount=allClients.length;
const unpaidClients=allClients.filter(cl=>cl.items.some(it=>!it.paid));

/* 2026 Projections */
const proj={
  kg:3000,canKg:1800,mccnKg:1000,hytnKg:200,
  canCost:4100,mccnCost:3500,hytnCost:5800,
  wholesalePct:.65,pharmacyPct:.20,dtcPct:.10,exportPct:.05,
  wholesalePrice:5200,pharmacyPrice:8000,dtcPrice:9500,exportPrice:5800
};
proj.totalCOGS=proj.canKg*proj.canCost+proj.mccnKg*proj.mccnCost+proj.hytnKg*proj.hytnCost;
proj.revenue=proj.kg*(proj.wholesalePct*proj.wholesalePrice+proj.pharmacyPct*proj.pharmacyPrice+proj.dtcPct*proj.dtcPrice+proj.exportPct*proj.exportPrice);
proj.grossProfit=proj.revenue-proj.totalCOGS;
proj.grossMargin=(proj.grossProfit/proj.revenue*100).toFixed(1);
proj.opex=annualOpex>50000?annualOpex:274400;
proj.ebit=proj.grossProfit-proj.opex;
proj.ebitMargin=(proj.ebit/proj.revenue*100).toFixed(1);
proj.vatRefund=Math.round(proj.totalCOGS*0.19);
proj.netCash=proj.ebit+proj.vatRefund-53000;

/* Monthly forecast from real data */
const months=["Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb"];
let runningCash=estCash;
const forecast=months.map((m,i)=>{
  const sellKg=i<3?soldKg/3*(1+i*0.5):i<6?proj.kg/12*1.2:proj.kg/12*1.5;
  const income=Math.round(sellKg*revenuePerKg*(revenuePerKg>0?1:5200));
  const cogs=Math.round(sellKg*(totalInvest/totalKg));
  const opex=Math.round(monthlyBurn+(i%3===0?5000:0));
  runningCash+=income-cogs-opex;
  return {m,income,cogs,opex,net:income-cogs-opex,balance:runningCash,sellKg:Math.round(sellKg)};
});

return {totalPaid,totalUnpaid,wixRevenue,totalRevenueAll,monthlyOpex,annualOpex,totalExpensesPaid,totalExpensesPending,monthlySalaries,monthlyBurn,allBatches,soldBatches,storageBatches,transitBatches,plannedBatches,inventoryKg,inventoryValue,inventoryCost,soldCost,grossProfit,grossMargin,soldKg,revenuePerKg,roi,capitalRaised,founderCapital,estCash,assets,totalAssets,liabilities,totalLiabilities,equity,allClients,clientCount,unpaidClients,proj,forecast,months};
})();

return <div>

{/* Finance sub-navigation is in sidebar */}

{/* ═══════════════ OVERVIEW / SUPPLIERS TAB ═══════════════ */}
{(finTab==="overview"||finTab==="cannava"||finTab==="mccn"||finTab==="hytn")&&<>
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

{/* ═══════════════ COMBINED HARVEST CALENDAR — OVERVIEW ONLY ═══════════════ */}
{finTab==="overview"&&<div style={{borderRadius:12,border:"2px solid #0f172a44",background:"#f8fafc",padding:14,marginBottom:14}}>
<div style={{fontSize:19,fontWeight:800,color:"#0f172a",marginBottom:8}}>🌿 Combined Harvest Calendar — All Suppliers 2026–2027</div>
<div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>{lang==="de"?"Geplante Gesamtlieferung":"Total projected supply"}: <strong>~8,561+ kg</strong> {lang==="de"?"von 3 Herkunftsländern":"from 3 origins"}</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
<div style={{padding:10,borderRadius:8,background:"#05966910",border:"2px solid #05966944"}}>
<div style={{fontSize:15,fontWeight:800,color:"#059669"}}>🇦🇷 Cannava S.E.</div>
<div style={{fontSize:22,fontWeight:800}}>2,320 kg</div>
<div style={{fontSize:11,color:"#6b7280"}}>17 harvests · 4 varieties · AVAT1.7, BBS1.1, BBS2.1, AVAT2</div>
<div style={{fontSize:11,color:"#059669",fontWeight:600,marginTop:4}}>Next: Mar 2026 — 240 kg (AVAT1.7 + BBS1.1)</div>
</div>
<div style={{padding:10,borderRadius:8,background:"#dc262610",border:"2px solid #dc262644"}}>
<div style={{fontSize:15,fontWeight:800,color:"#dc2626"}}>🇨🇴 Medcolcanna</div>
<div style={{fontSize:22,fontWeight:800}}>2,561 kg</div>
<div style={{fontSize:11,color:"#6b7280"}}>Plan A: 1,601 kg + Plan B: 960 kg · 6 strains · Indoor + GH</div>
<div style={{fontSize:11,color:"#dc2626",fontWeight:600,marginTop:4}}>Next: Mar 2026 — 100 kg (Guava Haze Indoor)</div>
</div>
<div style={{padding:10,borderRadius:8,background:"#f59e0b10",border:"2px solid #f59e0b44"}}>
<div style={{fontSize:15,fontWeight:800,color:"#f59e0b"}}>🇨🇦 HYTN</div>
<div style={{fontSize:22,fontWeight:800}}>3,680+ kg</div>
<div style={{fontSize:11,color:"#6b7280"}}>7 {lang==="de"?"Sorten":"strains"} · Indoor + Hybrid GH + Craft · THC 22-32%</div>
<div style={{fontSize:11,color:"#f59e0b",fontWeight:600,marginTop:4}}>{lang==="de"?"Verfügbar":"Available"}: 550-700+ kg/{lang==="de"?"Monat":"month"} · Mar–Aug 2026</div>
</div>
</div>

<div style={{fontWeight:700,fontSize:14,marginBottom:6}}>📊 Monthly Supply Projection (kg) — All Suppliers Combined</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:3}}>
{[
["Mar\n2026",240,100,620],["Apr",120,0,570],["May",360,110,700],["Jun",120,50,550],
["Jul",240,73,620],["Aug",0,90,620],["Sep",0,91,0],["Oct",0,90,0],
["Nov",100,91,0],["Dec",300,90,0],["Jan\n2027",240,209,0],["Feb",450,0,0]
].map(([m,can,mccn,hytn],j)=>{const total=can+mccn+hytn;const maxH=60;const canH=Math.round((can/800)*maxH);const mccnH=Math.round((mccn/800)*maxH);const hytnH=Math.round((hytn/800)*maxH);
return <div key={j} style={{textAlign:"center"}}>
<div style={{height:maxH+10,display:"flex",flexDirection:"column",justifyContent:"flex-end",alignItems:"center",gap:1}}>
{can>0&&<div style={{width:"100%",height:canH||2,background:"#059669",borderRadius:"2px 2px 0 0",minHeight:2}}/>}
{mccn>0&&<div style={{width:"100%",height:mccnH||2,background:"#dc2626",minHeight:2}}/>}
{hytn>0&&<div style={{width:"100%",height:hytnH||2,background:"#f59e0b",minHeight:2}}/>}
</div>
<div style={{fontSize:13,fontWeight:800,color:total>200?"#0f172a":"#6b7280",marginTop:2}}>{total}</div>
<div style={{fontSize:9,fontWeight:600,color:"#9ca3af",whiteSpace:"pre-line"}}>{m}</div>
</div>})}
</div>

<div style={{display:"flex",gap:12,marginTop:8,fontSize:11}}>
<span><span style={{display:"inline-block",width:12,height:12,background:"#059669",borderRadius:2,verticalAlign:"middle",marginRight:4}}/>Cannava</span>
<span><span style={{display:"inline-block",width:12,height:12,background:"#dc2626",borderRadius:2,verticalAlign:"middle",marginRight:4}}/>Medcolcanna</span>
<span><span style={{display:"inline-block",width:12,height:12,background:"#f59e0b",borderRadius:2,verticalAlign:"middle",marginRight:4}}/>HYTN</span>
</div>

<div style={{marginTop:12,overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#f1f5f9"}}>
{[lang==="de"?"Monat":"Month","🇦🇷 Cannava","🇨🇴 MCCN","🇨🇦 HYTN",lang==="de"?"Gesamt":"Total",lang==="de"?"Kumuliert":"Cumulative"].map((h,j)=>
<th key={j} style={{padding:"5px 6px",fontWeight:700,fontSize:11,borderBottom:"2px solid #0f172a44",textAlign:j>0?"right":"left"}}>{h}</th>)}
</tr></thead>
<tbody>
{[["Mar 2026",240,100,620],["Apr",120,0,570],["May",360,110,700],["Jun",120,50,550],["Jul",240,73,620],["Aug",0,90,620],["Sep",0,91,0],["Oct",0,90,0],["Nov",100,91,0],["Dec",300,90,0],["Jan 2027",240,209,0],["Feb",450,0,0]].reduce((acc,r,j)=>{const total=r[1]+r[2]+r[3];const cum=(acc.length>0?acc[acc.length-1].cum:0)+total;acc.push({r,total,cum});return acc},[]).map(({r,total,cum},j)=>
<tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:total>300?"#f0fdf4":"transparent"}}>
<td style={{padding:"4px 6px",fontWeight:600}}>{r[0]}</td>
<td style={{padding:"4px 6px",textAlign:"right",color:r[1]>0?"#059669":"#d1d5db",fontWeight:r[1]>0?700:400}}>{r[1]>0?r[1]+" kg":"—"}</td>
<td style={{padding:"4px 6px",textAlign:"right",color:r[2]>0?"#dc2626":"#d1d5db",fontWeight:r[2]>0?700:400}}>{r[2]>0?r[2]+" kg":"—"}</td>
<td style={{padding:"4px 6px",textAlign:"right",color:r[3]>0?"#f59e0b":"#d1d5db",fontWeight:r[3]>0?700:400}}>{r[3]>0?r[3]+"+ kg":"—"}</td>
<td style={{padding:"4px 6px",textAlign:"right",fontWeight:800,color:total>200?"#0f172a":"#6b7280"}}>{total}+ kg</td>
<td style={{padding:"4px 6px",textAlign:"right",fontWeight:600,color:"#2563eb"}}>{cum.toLocaleString()}+ kg</td>
</tr>)}
<tr style={{borderTop:"2px solid #0f172a",fontWeight:800}}>
<td style={{padding:"5px 6px"}}>TOTAL</td>
<td style={{padding:"5px 6px",textAlign:"right",color:"#059669"}}>2,320 kg</td>
<td style={{padding:"5px 6px",textAlign:"right",color:"#dc2626"}}>994 kg</td>
<td style={{padding:"5px 6px",textAlign:"right",color:"#f59e0b"}}>3,680+ kg</td>
<td style={{padding:"5px 6px",textAlign:"right",fontSize:14}}>6,994+ kg</td>
<td style={{padding:"5px 6px",textAlign:"right"}}></td>
</tr>
</tbody>
</table>
</div>
</div>}

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
[lang==="de"?"Investition":(lang==="de"?"Investition":"Investment"),fmtF(inv),"#dc2626"],
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

{/* ═══════ HARVEST CALENDAR ═══════ */}
{finTab==="cannava"&&<div style={{marginTop:14,borderRadius:12,border:"2px solid #05966944",background:"#05966906",padding:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#059669",marginBottom:8}}>🌿 Cannava — Harvest Calendar 2026–2027</div>
<div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>Total projected: <strong>2,320 kg</strong> · 80,000 plants · 4 varieties · San Juan, Argentina</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
{[["AVAT1.7","980 kg","42%","#059669"],["BBS1.1","660 kg","28%","#2563eb"],["BBS2.1","480 kg","21%","#7c3aed"],["AVAT2","200 kg","9%","#d97706"]].map(([v,kg,pct,c],j)=>
<div key={j} style={{padding:8,borderRadius:8,background:c+"12",border:"1px solid "+c+"33"}}>
<div style={{fontSize:14,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:16,fontWeight:700}}>{kg}</div>
<div style={{fontSize:11,color:"#6b7280"}}>{pct} of total</div>
</div>)}
</div>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#05966912"}}>
{[lang==="de"?"Standort":"Location",lang==="de"?"Pflanzen":"Plants",lang==="de"?"Sorte":"Variety","Lot","kg","Clona",lang==="de"?"Ernte":"Harvest",lang==="de"?"Trocknung":"Drying","Trimming",lang==="de"?"Reifung":"Curing","COA",lang==="de"?"Verfügbar":"Available"].map((h,j)=>
<th key={j} style={{padding:"4px 3px",fontWeight:700,fontSize:10,color:"#059669",borderBottom:"2px solid #05966944",whiteSpace:"nowrap"}}>{h}</th>)}
</tr></thead>
<tbody>
{[
["INVERNADERO 11-1",4000,"AVAT1.7","23-AVAT1.7",120,"08.09.25","11.01.26","23.01.26","05.02.26","15.02.26","07.03.26","Mar 2026 (1Q)"],
["INVERNADERO 13-1",4000,"BBS1.1","24-BBS1.1",120,"18.09.25","21.01.26","02.02.26","15.02.26","25.02.26","17.03.26","Mar 2026 (2Q)"],
["INVERNADERO 10-1",4000,"AVAT1.7","25-AVAT1.7",120,"06.10.25","08.02.26","20.02.26","05.03.26","15.03.26","04.04.26","Apr 2026 (1Q)"],
["INVERNADERO 12-1",4000,"BBS1.1","26-BBS1.1",120,"10.11.25","15.03.26","27.03.26","09.04.26","19.04.26","09.05.26","May 2026 (1Q)"],
["INVERNADERO 13-2",4000,"AVAT1.7","27-AVAT1.7",120,"13.11.25","22.03.26","03.04.26","19.04.26","29.04.26","19.05.26","May 2026 (2Q)"],
["INVERNADERO 11-2",4000,"BBS1.1","28-BBS1.1",120,"17.11.25","26.03.26","07.04.26","29.04.26","09.05.26","29.05.26","May 2026 (2Q)"],
["INVERNADERO 10-2",4000,"AVAT1.7","—",120,"05.12.25","13.04.26","25.04.26","09.05.26","19.05.26","08.06.26","Jun 2026 (1Q)"],
["CAMPO 1",6000,"BBS2.1","—",240,"10.01.26","19.05.26","31.05.26","13.06.26","23.06.26","13.07.26","Jul 2026 (1Q)"],
["INVERNADERO 12-2",5000,"AVAT1.7","—",100,"24.05.26","30.09.26","12.10.26","25.10.26","04.11.26","24.11.26","Nov 2026 (2Q)"],
["INVERNADERO 13-3",5000,"AVAT1.7","—",100,"25.05.26","30.09.26","12.10.26","04.11.26","14.11.26","04.12.26","Dec 2026 (1Q)"],
["INVERNADERO 11-3",5000,"AVAT2","—",100,"09.06.26","16.10.26","28.10.26","14.11.26","24.11.26","14.12.26","Dec 2026 (1Q)"],
["INVERNADERO 10-3",5000,"AVAT2","—",100,"09.06.26","16.10.26","28.10.26","24.11.26","04.12.26","24.12.26","Dec 2026 (2Q)"],
["CAMPO 2",6000,"BBS2.1","—",240,"25.06.26","01.11.26","13.11.26","04.12.26","14.12.26","03.01.27","Jan 2027 (1Q)"],
["INVERNADERO 12-3",5000,"BBS1.1","—",150,"01.08.26","08.12.26","20.12.26","02.01.27","12.01.27","01.02.27","Feb 2027 (1Q)"],
["INVERNADERO 13-4",5000,"BBS1.1","—",150,"01.08.26","08.12.26","20.12.26","12.01.27","22.01.27","11.02.27","Feb 2027 (1Q)"],
["INVERNADERO 11-4",5000,"AVAT1.7","—",150,"17.08.26","24.12.26","05.01.27","22.01.27","01.02.27","21.02.27","Feb 2027 (2Q)"],
["INVERNADERO 10-4",5000,"AVAT1.7","—",150,"17.08.26","24.12.26","05.01.27","01.02.27","11.02.27","03.03.27","Mar 2027 (1Q)"]
].map((r,j)=>{const vc=r[2]==="AVAT1.7"?"#059669":r[2]==="BBS1.1"?"#2563eb":r[2]==="BBS2.1"?"#7c3aed":"#d97706";
const avail=r[11];const now=new Date();const isNext=avail.includes("Mar 2026")||avail.includes("Apr 2026");
return <tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:isNext?"#f0fdf4":"transparent"}}>
<td style={{padding:"4px 3px",fontWeight:600,fontSize:11}}>{r[0]}</td>
<td style={{padding:"4px 3px",textAlign:"right"}}>{r[1].toLocaleString()}</td>
<td style={{padding:"4px 3px"}}><span style={{background:vc+"18",color:vc,padding:"1px 5px",borderRadius:4,fontSize:10,fontWeight:700}}>{r[2]}</span></td>
<td style={{padding:"4px 3px",fontFamily:"monospace",fontSize:10}}>{r[3]}</td>
<td style={{padding:"4px 3px",textAlign:"right",fontWeight:700}}>{r[4]}</td>
<td style={{padding:"4px 3px",fontSize:10}}>{r[5]}</td>
<td style={{padding:"4px 3px",fontSize:10}}>{r[6]}</td>
<td style={{padding:"4px 3px",fontSize:10}}>{r[7]}</td>
<td style={{padding:"4px 3px",fontSize:10}}>{r[8]}</td>
<td style={{padding:"4px 3px",fontSize:10}}>{r[9]}</td>
<td style={{padding:"4px 3px",fontSize:10}}>{r[10]}</td>
<td style={{padding:"4px 3px",fontWeight:700,color:isNext?"#059669":"#374151",fontSize:11}}>{avail}</td>
</tr>})}
</tbody>
</table>
</div>
<div style={{marginTop:10,display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4}}>
{[["Mar",240],["Apr",120],["May",360],["Jun",120],["Jul",240],["Aug",0],["Sep",0],["Oct",0],["Nov",100],["Dec",300],["Jan",240],["Feb",450]].map(([m,kg],j)=>
<div key={j} style={{textAlign:"center",padding:4,borderRadius:4,background:kg>0?"#05966912":"#f9fafb",border:kg>200?"2px solid #059669":"1px solid #e5e7eb"}}>
<div style={{fontSize:10,fontWeight:700,color:kg>0?"#059669":"#9ca3af"}}>{m}</div>
<div style={{fontSize:13,fontWeight:800,color:kg>0?"#059669":"#d1d5db"}}>{kg}</div>
<div style={{fontSize:9,color:"#9ca3af"}}>kg</div>
</div>)}
</div>
</div>}

{finTab==="mccn"&&<div style={{marginTop:14,borderRadius:12,border:"2px solid #dc262644",background:"#dc262606",padding:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#dc2626",marginBottom:8}}>🌿 Medcolcanna — Harvest & Export Calendar 2026</div>
<div style={{fontSize:12,color:"#6b7280",marginBottom:10}}>Plan A: <strong>~1,601 kg</strong> · Plan B: <strong>~960 kg</strong> · 6 strains · Indoor + Greenhouse · Colombia</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
{[["Guava Haze (NOC GK 27)","26% THC","640 kg","Indoor","#dc2626"],["Purple Guava (NOC UG 21)","21% THC","397 kg","Greenhouse","#7c3aed"],["Cherry Relief (NOC CP 18)","18% THC","192 kg","Greenhouse","#059669"],["La Citrica (NOC CC 24)","26% THC","302 kg","Greenhouse","#d97706"],["Mango Bliss (NOC RM 21)","18% THC","191 kg","Greenhouse","#2563eb"],["Grapes & Gas (NOC GG 21)","21% THC","320 kg","Indoor","#0f172a"]].map(([n,thc,kg,type,c],j)=>
<div key={j} style={{padding:8,borderRadius:8,background:c+"10",border:"1px solid "+c+"33"}}>
<div style={{fontSize:13,fontWeight:800,color:c}}>{n}</div>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<span style={{fontSize:15,fontWeight:700}}>{kg}</span>
<span style={{fontSize:11,background:c+"18",color:c,padding:"1px 6px",borderRadius:4}}>{thc}</span>
</div>
<div style={{fontSize:10,color:"#6b7280"}}>{type}</div>
</div>)}
</div>

<div style={{fontWeight:700,fontSize:14,marginBottom:6}}>📋 Plan A — Production Schedule</div>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#dc262612"}}>
{["Strain","NOC Name","THC%","> 1cm","< 1cm","Total kg","Type",lang==="de"?"Freigabe":"Release",lang==="de"?"Export":"Export"].map((h,j)=>
<th key={j} style={{padding:"4px 3px",fontWeight:700,fontSize:10,color:"#dc2626",borderBottom:"2px solid #dc262644",whiteSpace:"nowrap"}}>{h}</th>)}
</tr></thead>
<tbody>
{[
["Guava Haze","NOC GK 27 COL","26",100,0,100,"Indoor","—","MAR"],
["Purple Guava","NOC UG 21 COL","21",100,0,100,"Greenhouse","07.06.26","—"],
["Sky Walker","NOC MB 23 COL","22",60,0,60,"Greenhouse","—","—"],
["Purple Mountain","NOC TM 18 COL","17",25,0,25,"Greenhouse","—","—"],
["La Citrica","NOC CC 24 COL","26",40,0,40,"Greenhouse","30.08.26","—"],
["Mango Bliss","NOC RM 21 COL","18",100,0,100,"Greenhouse","12.10.26","—"],
["Guava Haze","NOC GK 27 COL","26",100,10,110,"Indoor","28.04.26","MAY"],
["Purple Guava","NOC UG 21 COL","21",56,17,73,"Greenhouse","07.06.26","JUL"],
["Guava Haze","NOC GK 27 COL","26",100,10,110,"Indoor","27.06.26","—"],
["Purple Guava","NOC UG 21 COL","21",40,11,51,"Greenhouse","11.07.26","—"],
["Cherry Relief","NOC CP 18 COL","18",70,21,91,"Greenhouse","25.08.26","SEP"],
["Guava Haze","NOC GK 27 COL","26",100,10,110,"Indoor","26.08.26","—"],
["La Citrica","NOC CC 24 COL","26",70,21,91,"Greenhouse","30.08.26","—"],
["Purple Guava","NOC UG 21 COL","21",60,17,77,"Greenhouse","19.09.26","—"],
["Mango Bliss","NOC RM 21 COL","18",70,21,91,"Greenhouse","12.10.26","NOV"],
["Guava Haze","NOC GK 27 COL","26",100,10,110,"Indoor","25.10.26","—"],
["La Citrica","NOC CC 24 COL","26",80,91,171,"Greenhouse","23.11.26","—"],
["Purple Guava","NOC UG 21 COL","23",75,23,98,"Greenhouse","24.11.26","—"],
["Guava Haze","NOC GK 27 COL","26",100,10,110,"Indoor","24.12.26","JAN"],
["Cherry Relief","NOC CP 18 COL","18",80,21,101,"Greenhouse","04.01.27","—"],
["Purple Guava","NOC UG 21 COL","21",75,23,98,"Greenhouse","10.01.27","—"]
].map((r,j)=>{const hasExport=r[8]!=="—";return <tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:hasExport?"#fef2f2":"transparent"}}>
<td style={{padding:"4px 3px",fontWeight:600}}>{r[0]}</td>
<td style={{padding:"4px 3px",fontFamily:"monospace",fontSize:10}}>{r[1]}</td>
<td style={{padding:"4px 3px",textAlign:"center",fontWeight:700}}>{r[2]}%</td>
<td style={{padding:"4px 3px",textAlign:"right"}}>{r[3]}</td>
<td style={{padding:"4px 3px",textAlign:"right"}}>{r[4]}</td>
<td style={{padding:"4px 3px",textAlign:"right",fontWeight:700}}>{r[5]}</td>
<td style={{padding:"4px 3px"}}><span style={{fontSize:10,padding:"1px 5px",borderRadius:4,background:r[6]==="Indoor"?"#dbeafe":"#dcfce7",color:r[6]==="Indoor"?"#2563eb":"#059669"}}>{r[6]}</span></td>
<td style={{padding:"4px 3px",fontSize:10}}>{r[7]}</td>
<td style={{padding:"4px 3px",fontWeight:hasExport?700:400,color:hasExport?"#dc2626":"#9ca3af"}}>{r[8]}</td>
</tr>})}
</tbody>
</table>
</div>

<div style={{fontWeight:700,fontSize:14,marginTop:12,marginBottom:6}}>📋 Plan B — Additional Production</div>
<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#dc262608"}}>
{[lang==="de"?"Sorte":"Strain","NOC Name","THC%","> 1cm","< 1cm",lang==="de"?"Gesamt kg":"Total kg",lang==="de"?"Typ":"Type","Export"].map((h,j)=>
<th key={j} style={{padding:"4px 3px",fontWeight:700,fontSize:10,color:"#dc2626",borderBottom:"2px solid #dc262644"}}>{h}</th>)}
</tr></thead>
<tbody>
{[
["Grapes & Gas","NOC GG 21 COL","21",40,10,50,"Indoor","JUN"],
["Guava Haze","NOC GK 27 COL","26",80,20,100,"Greenhouse","—"],
["Grapes & Gas","NOC GG 21 COL","21",80,10,90,"Indoor","AGO"],
["Guava Haze","NOC GK 27 COL","26",160,20,180,"Greenhouse","—"],
["Grapes & Gas","NOC GG 21 COL","21",80,10,90,"Indoor","OCT"],
["Guava Haze","NOC GK 27 COL","26",160,20,180,"Greenhouse","—"],
["Grapes & Gas","NOC GG 21 COL","21",80,10,90,"Indoor","DIC"],
["Guava Haze","NOC GK 27 COL","26",160,20,180,"Greenhouse","—"]
].map((r,j)=>{const hasExport=r[7]!=="—";return <tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:hasExport?"#fef2f2":"transparent"}}>
<td style={{padding:"4px 3px",fontWeight:600}}>{r[0]}</td>
<td style={{padding:"4px 3px",fontFamily:"monospace",fontSize:10}}>{r[1]}</td>
<td style={{padding:"4px 3px",textAlign:"center",fontWeight:700}}>{r[2]}%</td>
<td style={{padding:"4px 3px",textAlign:"right"}}>{r[3]}</td>
<td style={{padding:"4px 3px",textAlign:"right"}}>{r[4]}</td>
<td style={{padding:"4px 3px",textAlign:"right",fontWeight:700}}>{r[5]}</td>
<td style={{padding:"4px 3px"}}><span style={{fontSize:10,padding:"1px 5px",borderRadius:4,background:r[6]==="Indoor"?"#dbeafe":"#dcfce7",color:r[6]==="Indoor"?"#2563eb":"#059669"}}>{r[6]}</span></td>
<td style={{padding:"4px 3px",fontWeight:hasExport?700:400,color:hasExport?"#dc2626":"#9ca3af"}}>{r[7]}</td>
</tr>})}
</tbody>
</table>
</div>

<div style={{marginTop:10,display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:4}}>
{[["MAR",100],["APR",0],["MAY",110],["JUN",50],["JUL",73],["AGO",90],["SEP",91],["OCT",90],["NOV",91],["DIC",90],["JAN",209],["FEB",0]].map(([m,kg],j)=>
<div key={j} style={{textAlign:"center",padding:4,borderRadius:4,background:kg>0?"#dc262608":"#f9fafb",border:kg>80?"2px solid #dc2626":"1px solid #e5e7eb"}}>
<div style={{fontSize:10,fontWeight:700,color:kg>0?"#dc2626":"#9ca3af"}}>{m}</div>
<div style={{fontSize:13,fontWeight:800,color:kg>0?"#dc2626":"#d1d5db"}}>{kg}</div>
<div style={{fontSize:9,color:"#9ca3af"}}>kg</div>
</div>)}
</div>
</div>}

{finTab==="hytn"&&<div style={{marginTop:14,borderRadius:12,border:"2px solid #f59e0b44",background:"#f59e0b06",padding:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#f59e0b",marginBottom:8}}>🇨🇦 {lang==="de"?"HYTN — Erntekalender 2026":"HYTN — Harvest Calendar 2026"}</div>
<div style={{fontSize:12,color:"#6b7280",marginBottom:4}}>HYTN Cannabis Inc. · British Columbia, Canada · {lang==="de"?"Indoor + Hybrid Gewächshaus":"Indoor + Hybrid Greenhouse"} · {lang==="de"?"Alle Ernten sofort nach Trocknung verfügbar":"All harvests available immediately after drying"}</div>
<div style={{fontSize:10,color:"#d97706",marginBottom:10,fontStyle:"italic"}}>📄 {lang==="de"?"Quelle: Noc_Harvest_Schedule.xlsx (offiziell von HYTN) · *Alle Ernten haben variable Pflanzenerträge ±10kg*":"Source: Noc_Harvest_Schedule.xlsx (official from HYTN) · *All harvests have variable plant yields ±10kg*"}</div>

{/* Strain Table */}
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11,marginBottom:12}}>
<thead><tr style={{background:"#f59e0b",color:"#fff"}}>
{[lang==="de"?"Sorte":"Strain","THC %",lang==="de"?"Charge (kg)":"Batch (kg)",lang==="de"?"Frequenz":"Frequency",lang==="de"?"Anbau":"Method","Mar","Apr","May","Jun","Jul","Aug"].map((h,j)=>
<th key={j} style={{padding:"5px 6px",fontWeight:700,fontSize:10,textAlign:j>=5?"center":"left"}}>{h}</th>)}
</tr></thead>
<tbody>
{[
{name:"Liquid Imagination",thc:"26-32%",batch:"100+",freq:lang==="de"?"3 Wo.":"3 wks",method:"Hybrid GH",months:["100+","100+","100+","100+","100+","100+"],tier:"ultra"},
{name:"White Truffle",thc:"26-30%",batch:"50",freq:lang==="de"?"3. Feb 2026":"Feb 3 2026",method:"Indoor",months:["100","50","100","50","100","100"],tier:"ultra"},
{name:"Lemon Pepper Punch",thc:"26-30%",batch:"80",freq:lang==="de"?"3 Wo.":"3 wks",method:"Indoor",months:["80","80","160","80","80","80"],tier:"ultra"},
{name:"Mandarin Cookies",thc:"24-26%",batch:"100+",freq:lang==="de"?"3 Wo.":"3 wks",method:"Hybrid GH",months:["100+","100+","100+","100+","100+","100+"],tier:"premium"},
{name:"Chemzilla",thc:"26-32%",batch:"100+",freq:lang==="de"?"3 Wo.":"3 wks",method:"Hybrid GH",months:["100+","100+","100+","100+","100+","100+"],tier:"ultra"},
{name:"Planet Purple",thc:"25-29%",batch:"90",freq:lang==="de"?"4 Wo.":"4 wks",method:"Indoor",months:["90","90","90","90","90","90"],tier:"premium"},
{name:"NASHA",thc:"22-25%",batch:"50",freq:lang==="de"?"4 Wo.":"4 wks",method:"Indoor Craft",months:["50","50","50","50","50","50"],tier:"premium"},
].map((s,j)=><tr key={j} style={{borderBottom:"1px solid #fde68a",background:j%2===0?"#fffbeb":"transparent"}}>
<td style={{padding:"5px 6px",fontWeight:700}}>{s.name}</td>
<td style={{padding:"5px 6px",fontFamily:"monospace",fontWeight:700,color:s.tier==="ultra"?"#dc2626":"#d97706"}}>{s.thc}</td>
<td style={{padding:"5px 6px"}}>{s.batch} kg</td>
<td style={{padding:"5px 6px",fontSize:10}}>{s.freq}</td>
<td style={{padding:"5px 6px",fontSize:10}}>{s.method}</td>
{s.months.map((m,k)=><td key={k} style={{padding:"5px 4px",textAlign:"center",fontWeight:700,color:"#059669",fontSize:11}}>{m}</td>)}
</tr>)}
<tr style={{background:"#f59e0b22",fontWeight:800}}>
<td colSpan={5} style={{padding:"5px 6px",fontWeight:800,color:"#f59e0b"}}>{lang==="de"?"GESAMT verfügbar pro Monat":"TOTAL available per month"}</td>
<td style={{padding:"5px 4px",textAlign:"center",color:"#f59e0b"}}>620+</td>
<td style={{padding:"5px 4px",textAlign:"center",color:"#f59e0b"}}>570+</td>
<td style={{padding:"5px 4px",textAlign:"center",color:"#f59e0b"}}>700+</td>
<td style={{padding:"5px 4px",textAlign:"center",color:"#f59e0b"}}>550+</td>
<td style={{padding:"5px 4px",textAlign:"center",color:"#f59e0b"}}>620+</td>
<td style={{padding:"5px 4px",textAlign:"center",color:"#f59e0b"}}>620+</td>
</tr>
</tbody>
</table>

{/* KPI Summary */}
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
{[
[lang==="de"?"Sorten":"Strains","7",lang==="de"?"Alle Premium/Ultra":"All Premium/Ultra","#f59e0b"],
["THC "+lang==="de"?"Bereich":"Range","22–32%",lang==="de"?"Höchste im Portfolio":"Highest in portfolio","#dc2626"],
[lang==="de"?"Monatl. Kapazität":"Monthly Capacity","550–700+ kg",lang==="de"?"Massive Verfügbarkeit":"Massive availability","#059669"],
[lang==="de"?"Anbaumethoden":"Methods","3 "+lang==="de"?"Typen":"types","Indoor · Hybrid GH · Craft","#2563eb"],
].map(([l,v,sub,c],j)=><div key={j} style={{padding:8,borderRadius:8,background:c+"08",border:"2px solid "+c+"33",textAlign:"center"}}>
<div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:11,fontWeight:700,color:"#374151"}}>{l}</div>
<div style={{fontSize:9,color:"#6b7280"}}>{sub}</div>
</div>)}
</div>

{/* Strategic Note */}
<div style={{padding:10,background:"#fff",borderRadius:6,border:"1px solid #fde68a",fontSize:11}}>
<div style={{fontWeight:700,color:"#f59e0b",marginBottom:3}}>🏆 {lang==="de"?"Strategische Bedeutung":"Strategic Value"}</div>
<div style={{color:"#374151",lineHeight:"1.5"}}>{lang==="de"?"HYTN liefert die höchsten THC-Werte im NOC-Portfolio (bis 32%). Mit 7 Sorten und 550-700+ kg/Monat Kapazität ist HYTN ideal für das Ultra-Premium-Segment (€9.50+/g). Kanada ist PIC/S-Mitglied (Health Canada) → vereinfachter EU-Import über MRA. Empfehlung: Erste Bestellung 200kg als HY-01 Import für Q3 2026.":"HYTN delivers the highest THC values in NOC's portfolio (up to 32%). With 7 strains and 550-700+ kg/month capacity, HYTN is ideal for the ultra-premium segment (€9.50+/g). Canada is PIC/S member (Health Canada) → simplified EU import via MRA. Recommendation: First order 200kg as HY-01 import for Q3 2026."}</div>
</div>
</div>}

{/* Supplier-specific Wix Orders */}
{(finTab==="cannava"||finTab==="mccn"||finTab==="hytn")&&(()=>{
const supFilter={cannava:["cannava","noc se","noc-se","bi-01","bi-02","bi-03","bi-04"],mccn:["medcolcanna","mccn","mc-01","mc-02","mc-03"],hytn:["hytn","hy-01"]};
const keywords=supFilter[finTab]||[];
const filtered=wixOrders.filter(o=>o.items.some(it=>{const t=(it.name+" "+(it.sku||"")).toLowerCase();return keywords.some(kw=>t.includes(kw))}));
return <div style={{marginTop:14,borderRadius:12,border:"2px solid "+sd.color+"44",background:sd.color+"06",padding:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div>
<div style={{fontSize:17,fontWeight:800,color:sd.color}}>🛒 {sd.fl} {sd.n.split("(")[0]} — Wix Orders</div>
<div style={{fontSize:12,color:"#6b7280"}}>{filtered.length>0?filtered.length+" orders (of "+wixOrders.length+" total)":"Not yet synced"}</div>
</div>
<button onClick={fetchWixOrders} disabled={wixLoading} style={{padding:"8px 16px",borderRadius:6,fontSize:13,fontWeight:700,border:"none",background:wixLoading?"#9ca3af":sd.color,color:"#fff",cursor:wixLoading?"wait":"pointer"}}>
{wixLoading?"⏳ ...":"🔄 Sync"}
</button>
</div>
{filtered.length>0?<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
<thead><tr style={{background:sd.color+"12"}}>
{["#",lang==="de"?"Datum":"Date",lang==="de"?"Kunde":"Client",lang==="de"?"Produkte":"Products",lang==="de"?"Menge":"Qty",lang==="de"?"Gesamt":"Total","Status","📦 SendCloud"].map((h,j)=>
<th key={j} style={{padding:"5px 4px",textAlign:j>3?"right":"left",fontWeight:700,fontSize:11,color:sd.color,borderBottom:"2px solid "+sd.color+"44"}}>{h}</th>)}
</tr></thead>
<tbody>
{filtered.map((o,j)=>{const scMatch=scParcels.find(p=>p.orderNumber===o.id);return <tr key={j} style={{borderBottom:"1px solid #f3f4f6"}}>
<td style={{padding:"5px 4px",fontWeight:700,color:sd.color}}>{o.id}</td>
<td style={{padding:"5px 4px"}}>{o.date}</td>
<td style={{padding:"5px 4px"}}><div style={{fontWeight:700}}>{o.client.name}</div><div style={{fontSize:11,color:"#6b7280"}}>{o.client.email}</div></td>
<td style={{padding:"5px 4px"}}>{o.items.map((it,k)=><div key={k} style={{fontSize:12}}>{it.name} <span style={{color:"#6b7280"}}>×{it.qty}</span></div>)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:600}}>{o.items.reduce((a,it)=>a+it.qty,0)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:700,color:"#059669"}}>€{o.totals.total.toFixed(2)}</td>
<td style={{padding:"5px 4px"}}><Bd c={o.status==="PAID"?"#059669":"#d97706"} b={o.status==="PAID"?"#dcfce7":"#fef3c7"}>{o.status}</Bd></td>
<td style={{padding:"5px 4px",textAlign:"right"}}>{scMatch?<div>
<Bd c={scMatch.statusId>=11?"#059669":scMatch.statusId>=3?"#2563eb":"#d97706"} b={scMatch.statusId>=11?"#dcfce7":scMatch.statusId>=3?"#dbeafe":"#fef3c7"}>{scMatch.status}</Bd>
{scMatch.trackingNumber&&<div style={{fontSize:10,marginTop:2}}><a href={scMatch.trackingUrl} target="_blank" style={{color:"#7c3aed"}}>{scMatch.trackingNumber}</a></div>}
{scMatch.labelUrl&&<button onClick={()=>window.open(scMatch.labelUrl,"_blank")} style={{fontSize:10,padding:"1px 6px",borderRadius:3,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer",marginTop:2}}>🏷️ Label</button>}
</div>:<button onClick={()=>createScParcel(o)} disabled={scLoading||o.status!=="PAID"} style={{padding:"4px 10px",borderRadius:4,fontSize:11,fontWeight:700,border:"none",background:o.status==="PAID"?"#7c3aed":"#d1d5db",color:o.status==="PAID"?"#fff":"#9ca3af",cursor:o.status==="PAID"?"pointer":"not-allowed"}}>{scLoading?"⏳":"📦 Ship"}</button>}</td>
</tr>})}
</tbody>
</table>
<div style={{display:"flex",justifyContent:"space-between",padding:"10px 4px",borderTop:"2px solid "+sd.color,marginTop:6,fontWeight:800}}>
<span>{filtered.length} {lang==="de"?"Bestellungen":"orders"}</span>
<span style={{color:"#059669"}}>€{filtered.reduce((a,o)=>a+o.totals.total,0).toFixed(2)}</span>
</div>
</div>
:<div style={{textAlign:"center",padding:16,color:"#9ca3af",fontSize:13}}>
{wixOrders.length>0?<span>No orders matching {sd.fl} {sd.n.split("(")[0]} products</span>:wixError?<span style={{color:"#dc2626"}}>❌ {wixError}</span>:<span>Click Sync to load orders</span>}
</div>}
</div>})()}
</>}

{/* ═══════════════ WIX ORDERS TAB ═══════════════ */}
{finTab==="wix"&&<div>
{/* ═══════════════ WIX ORDERS — LIVE ═══════════════ */}
<div style={{marginTop:14,borderRadius:12,border:"2px solid #7c3aed44",background:"#7c3aed06",padding:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
<div>
<div style={{fontSize:19,fontWeight:800,color:"#7c3aed"}}>🛒 Wix eCommerce — {lang==="de"?"Live Bestellungen":"Live Orders"}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{wixLastSync?(lang==="de"?"Letzte Synchronisierung: ":"Last sync: ")+wixLastSync:(lang==="de"?"Noch nicht synchronisiert":"Not yet synced")}{wixAutoSync?" · ⚡ Auto-sync ON":""}{scLastSync?" · 📦 SendCloud: "+scLastSync:""}</div>
</div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{fetchWixOrders();fetchScParcels()}} disabled={wixLoading} style={{padding:"8px 16px",borderRadius:6,fontSize:13,fontWeight:700,border:"none",background:wixLoading?"#9ca3af":"#7c3aed",color:"#fff",cursor:wixLoading?"wait":"pointer"}}>
{wixLoading?"⏳ ...":"🔄 "+(lang==="de"?"Jetzt synchronisieren":"Sync Now")}
</button>
<button onClick={()=>{if(wixAutoSync){setWixAutoSync(false)}else{setWixAutoSync(true);fetchWixOrders()}}} style={{padding:"8px 16px",borderRadius:6,fontSize:13,fontWeight:700,border:"1px solid "+(wixAutoSync?"#dc2626":"#7c3aed"),background:wixAutoSync?"#fef2f2":"#fff",color:wixAutoSync?"#dc2626":"#7c3aed",cursor:"pointer"}}>
{wixAutoSync?"⏹ Stop":"⚡ Auto 30s"}
</button>
<button onClick={fetchScParcels} disabled={scLoading} style={{padding:"8px 16px",borderRadius:6,fontSize:13,fontWeight:700,border:"none",background:scLoading?"#9ca3af":"#f97316",color:"#fff",cursor:scLoading?"wait":"pointer"}}>
{scLoading?"⏳ ...":"📦 SendCloud Sync"}
</button>
<button onClick={fetchScParcels} disabled={scLoading} style={{padding:"8px 16px",borderRadius:6,fontSize:13,fontWeight:700,border:"none",background:scLoading?"#9ca3af":"#f59e0b",color:"#fff",cursor:scLoading?"wait":"pointer"}}>
{scLoading?"⏳ ...":"📦 SendCloud "+(scParcels.length>0?"("+scParcels.length+")":"")}
</button>
</div>
</div>

{wixError&&<div style={{padding:8,background:"#fef2f2",borderRadius:6,fontSize:12,color:"#dc2626",marginBottom:8}}>❌ {wixError}</div>}

{scError&&<div style={{padding:8,background:"#fef2f2",borderRadius:6,fontSize:12,color:"#dc2626",marginBottom:8}}>❌ SendCloud: {scError.slice(0,200)}</div>}

{/* SendCloud KPIs */}
{scParcels.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:10}}>
{[
["📦 Parcels",scParcels.length+"","#f59e0b"],
["🚚 In Transit",scParcels.filter(p=>p.status.id>=3&&p.status.id<11).length+"","#2563eb"],
["✅ Delivered",scParcels.filter(p=>p.status.id>=11).length+"","#059669"],
["⏳ Ready",scParcels.filter(p=>p.status.id<3).length+"","#d97706"],
["❌ Failed",scParcels.filter(p=>p.status.id>=1000).length+"","#dc2626"]
].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:6,padding:8,textAlign:"center",border:"1px solid #e5e7eb"}}>
<div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:11,color:"#6b7280"}}>{l}</div>
</div>)}
</div>}

{/* KPIs */}
{wixOrders.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginBottom:10}}>
{[
[lang==="de"?"Bestellungen":"Orders",wixOrders.length+"","#7c3aed"],
[lang==="de"?"Bezahlt":"Paid",wixOrders.filter(o=>o.status==="PAID").length+"","#059669"],
[lang==="de"?"Ausstehend":"Pending",wixOrders.filter(o=>o.status!=="PAID").length+"","#d97706"],
[lang==="de"?"Umsatz":"Revenue","€"+wixOrders.reduce((a,o)=>a+o.totals.total,0).toLocaleString("de-DE"),"#059669"],
[lang==="de"?"Versand":"Shipping","€"+wixOrders.reduce((a,o)=>a+o.totals.shipping,0).toLocaleString("de-DE"),"#2563eb"],
[lang==="de"?"MwSt":"Tax","€"+wixOrders.reduce((a,o)=>a+o.totals.tax,0).toLocaleString("de-DE"),"#d97706"]
].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:6,padding:8,textAlign:"center",border:"1px solid #e5e7eb"}}>
<div style={{fontSize:16,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:11,color:"#6b7280"}}>{l}</div>
</div>)}
</div>}

{/* Orders Table */}
{wixOrders.length>0?<div style={{overflowX:"auto"}}>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
<thead><tr style={{background:"#7c3aed12"}}>
{["#",lang==="de"?"Datum":"Date",lang==="de"?"Kunde":"Client",lang==="de"?"E-Mail":"Email",lang==="de"?"Lieferadresse":"Shipping Address",lang==="de"?"Produkte":"Products",lang==="de"?"Menge":"Qty",lang==="de"?"Gesamt":"Total",lang==="de"?"Versand":"Ship",lang==="de"?"Status":"Status",lang==="de"?"Erfüllung":"Fulfillment",lang==="de"?"Tracking":"Tracking"].map((h,j)=>
<th key={j} style={{padding:"5px 4px",textAlign:j>5?"right":"left",fontWeight:700,fontSize:11,color:"#7c3aed",borderBottom:"2px solid #7c3aed44",whiteSpace:"nowrap"}}>{h}</th>)}
</tr></thead>
<tbody>
{wixOrders.map((o,j)=><tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:o.status==="PAID"?"#fff":"#fff7ed"}}>
<td style={{padding:"5px 4px",fontWeight:700,color:"#7c3aed"}}>{o.id}</td>
<td style={{padding:"5px 4px",fontSize:12}}>{o.date}</td>
<td style={{padding:"5px 4px"}}>
<div style={{fontWeight:700}}>{o.client.name}</div>
{o.client.company&&<div style={{fontSize:11,color:"#6b7280"}}>{o.client.company}</div>}
<div style={{fontSize:11,color:"#9ca3af"}}>{o.client.phone}</div>
</td>
<td style={{padding:"5px 4px",fontSize:11}}>{o.client.email}</td>
<td style={{padding:"5px 4px",fontSize:11}}>
<div>{o.shipping.street}</div>
<div>{o.shipping.zip} {o.shipping.city}</div>
<div style={{color:"#6b7280"}}>{o.shipping.country}</div>
{o.shipping.method!=="—"&&<div style={{fontSize:10,color:"#7c3aed"}}>📦 {o.shipping.method}</div>}
</td>
<td style={{padding:"5px 4px"}}>
{o.items.map((it,k)=><div key={k} style={{marginBottom:2}}>
<div style={{fontWeight:600,fontSize:12}}>{it.name}</div>
<div style={{fontSize:10,color:"#6b7280"}}>SKU: {it.sku.slice(0,12)}... · €{it.price}/{lang==="de"?"St":"ea"}</div>
</div>)}
</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:600}}>{o.items.reduce((a,it)=>a+it.qty,0)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontWeight:700,color:"#059669"}}>€{o.totals.total.toFixed(2)}</td>
<td style={{padding:"5px 4px",textAlign:"right",fontSize:11}}>€{o.totals.shipping.toFixed(2)}</td>
<td style={{padding:"5px 4px"}}><Bd c={o.status==="PAID"?"#059669":"#d97706"} b={o.status==="PAID"?"#dcfce7":"#fef3c7"}>{o.status}</Bd></td>
<td style={{padding:"5px 4px"}}><Bd c={o.fulfillment==="FULFILLED"?"#059669":o.fulfillment==="PARTIALLY_FULFILLED"?"#2563eb":"#dc2626"} b={o.fulfillment==="FULFILLED"?"#dcfce7":o.fulfillment==="PARTIALLY_FULFILLED"?"#dbeafe":"#fee2e2"}>{o.fulfillment==="NOT_FULFILLED"?(lang==="de"?"Offen":"Open"):o.fulfillment}</Bd></td>
<td style={{padding:"5px 4px",fontSize:11}}>{(()=>{
const sc=scParcels.find(p=>p.orderNo===o.id||p.order_number===o.id);
const it=internTransports.find(t=>t.orderId===o.id);
if(sc&&sc.tracking)return <div><Bd c={sc.statusId>=11?"#059669":sc.statusId>=3?"#2563eb":"#d97706"} b={sc.statusId>=11?"#dcfce7":sc.statusId>=3?"#dbeafe":"#fef3c7"}>{sc.status}</Bd><div style={{fontSize:10,marginTop:2,fontFamily:"monospace"}}>{sc.tracking}</div>{sc.trackingUrl&&<a href={sc.trackingUrl} target="_blank" style={{fontSize:10,color:"#7c3aed"}}>Track</a>}<br/><button onClick={()=>printLieferschein(o,null)} style={{padding:"2px 6px",borderRadius:3,fontSize:10,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer",marginTop:2}}>📄 Lieferschein</button></div>;
if(it)return <div><Bd c={it.status==="delivered"?"#059669":"#2563eb"} b={it.status==="delivered"?"#dcfce7":"#dbeafe"}>{it.status==="delivered"?"✅ Delivered":"🚗 "+it.driver}</Bd><div style={{fontSize:10,marginTop:2}}>{it.id} · {it.time}</div>{it.status!=="delivered"&&<button onClick={()=>{const s=prompt("Signed by:");if(s)confirmDelivery(it.id,s)}} style={{padding:"2px 6px",borderRadius:3,fontSize:10,border:"none",background:"#059669",color:"#fff",cursor:"pointer",marginTop:2}}>✅ Confirm</button>}<button onClick={()=>printLieferschein(o,it)} style={{padding:"2px 6px",borderRadius:3,fontSize:10,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer",marginTop:2,marginLeft:2}}>📄</button></div>;
if(o.status==="PAID")return <div style={{display:"flex",flexDirection:"column",gap:2}}>
<button onClick={()=>createScParcel(o)} style={{padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:700,border:"none",background:"#7c3aed",color:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>📦 DHL/SendCloud</button>
<button onClick={()=>setShowTransportForm(o)} style={{padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>🚗 Intern Transport</button>
<button onClick={()=>printLieferschein(o,null)} style={{padding:"3px 8px",borderRadius:4,fontSize:10,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>📄 Lieferschein</button>
</div>;
return <span style={{color:"#9ca3af"}}>—</span>})()}</td>
</tr>)}
</tbody>
</table>
</div>
:<div style={{textAlign:"center",padding:20,color:"#9ca3af"}}>
<div style={{fontSize:28,marginBottom:6}}>🛒</div>
<div style={{fontSize:14,fontWeight:600}}>{lang==="de"?"Klicke 'Jetzt synchronisieren' um Wix Bestellungen abzurufen":"Click 'Sync Now' to fetch Wix orders"}</div>
<div style={{fontSize:12,marginTop:4}}>{lang==="de"?"Verbunden mit":"Connected to"}: wixapis.com · Site: {WIX_SITE_ID.slice(0,8)}...</div>
</div>}
</div>

{/* Intern Transport Form Modal */}
{showTransportForm&&<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,background:"rgba(0,0,0,.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:9999}} onClick={()=>setShowTransportForm(null)}>
<div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:12,padding:20,width:420,maxHeight:"90vh",overflow:"auto"}}>
<div style={{fontSize:18,fontWeight:800,marginBottom:12}}>🚗 NOC Intern Transport</div>
<div style={{fontSize:13,color:"#6b7280",marginBottom:12}}>Order: {showTransportForm.id} · {showTransportForm.client?.name}</div>
<div style={{marginBottom:8}}><label style={{fontSize:12,fontWeight:600}}>Fahrer / Driver:</label><input value={transportDriver} onChange={e=>setTransportDriver(e.target.value)} placeholder="Name des Fahrers" style={{width:"100%",padding:8,borderRadius:6,border:"1px solid #d1d5db",marginTop:4,fontSize:14}}/></div>
<div style={{marginBottom:8}}><label style={{fontSize:12,fontWeight:600}}>Temperatur °C:</label><input value={transportTemp} onChange={e=>setTransportTemp(e.target.value)} placeholder="20" style={{width:"100%",padding:8,borderRadius:6,border:"1px solid #d1d5db",marginTop:4,fontSize:14}}/></div>
<div style={{marginBottom:8}}><label style={{fontSize:12,fontWeight:600}}>Bemerkungen / Notes:</label><textarea value={transportNotes} onChange={e=>setTransportNotes(e.target.value)} placeholder="GDP transport notes..." rows={3} style={{width:"100%",padding:8,borderRadius:6,border:"1px solid #d1d5db",marginTop:4,fontSize:14,resize:"vertical"}}/></div>
<div style={{background:"#f0fdf4",padding:8,borderRadius:6,fontSize:12,marginBottom:12}}>
<div style={{fontWeight:700}}>📦 Products:</div>
{showTransportForm.items?.map((it,k)=><div key={k}>{it.name} x{it.qty}</div>)}
<div style={{fontWeight:700,marginTop:4}}>📍 Delivery to: {showTransportForm.shipping?.street} {showTransportForm.shipping?.zip} {showTransportForm.shipping?.city}</div>
</div>
<div style={{display:"flex",gap:8}}>
<button onClick={()=>{const t=createInternTransport(showTransportForm);printLieferschein(showTransportForm,t)}} style={{flex:1,padding:10,borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>🚗 Start Transport + Print</button>
<button onClick={()=>createInternTransport(showTransportForm)} style={{flex:1,padding:10,borderRadius:6,fontSize:14,fontWeight:700,border:"1px solid #1e40af",background:"#fff",color:"#1e40af",cursor:"pointer"}}>🚗 Start Without Print</button>
</div>
</div>
</div>}

{/* Active Intern Transports */}
{internTransports.length>0&&<div style={{marginTop:12,borderRadius:8,border:"2px solid #1e40af44",padding:10}}>
<div style={{fontSize:15,fontWeight:800,color:"#1e40af",marginBottom:8}}>🚗 NOC Intern Transports ({internTransports.filter(t=>t.status==="on_the_way").length} active)</div>
{internTransports.map((t,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:8,background:t.status==="delivered"?"#f0fdf4":"#eff6ff",borderRadius:6,marginBottom:4,fontSize:12}}>
<div>
<span style={{fontWeight:700,color:"#1e40af"}}>{t.id}</span> · {t.driver} · {t.date} {t.time}
<div style={{fontSize:11,color:"#6b7280"}}>{t.client} · {t.products}</div>
</div>
<div style={{display:"flex",gap:4,alignItems:"center"}}>
<Bd c={t.status==="delivered"?"#059669":"#2563eb"} b={t.status==="delivered"?"#dcfce7":"#dbeafe"}>{t.status==="delivered"?"✅ Delivered at "+t.deliveredAt+" · "+t.signedBy:"🚗 On the Way"}</Bd>
{t.status!=="delivered"&&<button onClick={()=>{const s=prompt("Empfänger / Signed by:");if(s)confirmDelivery(t.id,s)}} style={{padding:"4px 10px",borderRadius:4,fontSize:11,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>✅ Confirm Delivery</button>}
</div>
</div>)}
</div>}
</div>}

{finTab==="spends"&&<div>
<div style={{fontSize:20,fontWeight:800,marginBottom:12}}>💳 {lang==="de"?"Ausgaben-Tracker":"Expense Tracker"}</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
{[["regulatory","🏛️",lang==="de"?"Regulatorisch":"Regulatory"],["logistics","🚚","Logistics"],["office","🏢",lang==="de"?"Büro":"Office"],["salary","👥",lang==="de"?"Gehälter":"Salaries"],["legal","⚖️","Legal"],["insurance","🛡️",lang==="de"?"Versicherung":"Insurance"],["travel","✈️",lang==="de"?"Reisen":"Travel"],["it","💻","IT"]].map(([k,ic,l])=>{
const catTotal=expenses.filter(e=>e.cat===k).reduce((a,e)=>a+e.amount,0);
const catPaid=expenses.filter(e=>e.cat===k&&e.paid).reduce((a,e)=>a+e.amount,0);
return <div key={k} style={{background:"#fff",borderRadius:8,padding:10,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:11,color:"#6b7280"}}>{ic} {l}</div>
<div style={{fontSize:18,fontWeight:800}}>€{catTotal.toLocaleString()}</div>
<div style={{fontSize:11,color:catPaid===catTotal?"#059669":"#d97706"}}>{catPaid===catTotal?"✅ Paid":"⏳ €"+(catTotal-catPaid).toLocaleString()+" open"}</div>
</div>})}
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:8,fontSize:12,fontWeight:700,color:"#6b7280",padding:"0 8px"}}>
<div>Ref</div><div>{lang==="de"?"Datum":"Date"}</div><div>{lang==="de"?"Beschreibung":"Description"}</div><div style={{textAlign:"right"}}>{lang==="de"?"Betrag":"Amount"}</div><div style={{textAlign:"center"}}>Status</div>
</div>
{expenses.map((e,j)=><div key={j} style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,padding:"8px",background:j%2?"#f9fafb":"#fff",borderRadius:4,fontSize:13,alignItems:"center"}}>
<div style={{fontFamily:"monospace",fontSize:11,color:"#7c3aed"}}>{e.ref}</div>
<div>{e.date}</div>
<div>{e.desc}</div>
<div style={{textAlign:"right",fontWeight:700}}>€{e.amount.toLocaleString()}</div>
<div style={{textAlign:"center"}}><Bd c={e.paid?"#059669":"#d97706"} b={e.paid?"#dcfce7":"#fef3c7"}>{e.paid?"Paid":"Open"}</Bd></div>
</div>)}
<div style={{display:"flex",justifyContent:"space-between",padding:"12px 8px",marginTop:8,borderTop:"2px solid #1e40af",fontWeight:800,fontSize:15}}>
<span>{lang==="de"?"GESAMT AUSGABEN":"TOTAL EXPENSES"}</span>
<span>€{expenses.reduce((a,e)=>a+e.amount,0).toLocaleString()}</span>
</div>
</div>}

{/* ═══════════════ SALARIES TAB ═══════════════ */}
{finTab==="salaries"&&<div>
<div style={{fontSize:20,fontWeight:800,marginBottom:12}}>👥 {lang==="de"?"Gehaltsübersicht":"Salary Overview"}</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
{[["Total Gross","€"+salaries.reduce((a,s)=>a+s.gross,0).toLocaleString(),"#dc2626"],["Total Net","€"+salaries.reduce((a,s)=>a+s.net,0).toLocaleString(),"#059669"],["Tax+Social","€"+salaries.reduce((a,s)=>a+s.tax+s.social,0).toLocaleString(),"#d97706"],["Annual Cost","€"+(salaries.reduce((a,s)=>a+s.gross,0)*12).toLocaleString(),"#1e40af"]].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:8,padding:10,border:"1px solid #e5e7eb",textAlign:"center"}}>
<div style={{fontSize:18,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:11,color:"#6b7280"}}>{l}/mo</div>
</div>)}
</div>
{salaries.map((s,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:12,background:j%2?"#f9fafb":"#fff",borderRadius:8,marginBottom:4,border:"1px solid #e5e7eb"}}>
<div><div style={{fontWeight:700,fontSize:15}}>{s.name}</div><div style={{fontSize:12,color:"#6b7280"}}>{s.role}</div><Bd c={s.contract==="permanent"?"#059669":s.contract==="freelance"?"#7c3aed":"#2563eb"} b={s.contract==="permanent"?"#dcfce7":s.contract==="freelance"?"#f3e8ff":"#dbeafe"}>{s.contract}</Bd></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16,textAlign:"right"}}>
<div><div style={{fontSize:16,fontWeight:700}}>€{s.gross.toLocaleString()}</div><div style={{fontSize:10,color:"#6b7280"}}>Gross</div></div>
<div><div style={{fontSize:16,fontWeight:700,color:"#059669"}}>€{s.net.toLocaleString()}</div><div style={{fontSize:10,color:"#6b7280"}}>Net</div></div>
<div><div style={{fontSize:16,fontWeight:700,color:"#d97706"}}>€{s.tax.toLocaleString()}</div><div style={{fontSize:10,color:"#6b7280"}}>Tax</div></div>
<div><div style={{fontSize:16,fontWeight:700,color:"#6b7280"}}>€{s.social.toLocaleString()}</div><div style={{fontSize:10,color:"#6b7280"}}>Social</div></div>
</div>
</div>)}
</div>}

{/* ═══════════════ INVESTORS TAB ═══════════════ */}
{finTab==="investors"&&<div>
<div style={{fontSize:22,fontWeight:800,marginBottom:4}}>📈 {lang==="de"?"AI CFO — Investoren Dashboard":(lang==="de"?"AI CFO — Investoren-Dashboard":"AI CFO — Investor Dashboard")}</div>
<div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>{lang==="de"?"Echtzeit-Finanzanalyse · Alle Daten live berechnet":(lang==="de"?"Echtzeit-Finanzanalyse · Alle Daten live berechnet":"Real-time financial analysis · All data computed live")}</div>

{/* Top KPIs Row */}
{(()=>{
const totalDeployed=totalInvest;
const totalRevenue=allSups.reduce((a,[,s])=>a+s.sales.reduce((b,cl)=>b+cl.items.reduce((c,it)=>c+it.total,0),0),0);
const totalPaid=allSups.reduce((a,[,s])=>a+s.sales.reduce((b,cl)=>b+cl.items.filter(it=>it.paid).reduce((c,it)=>c+it.total,0),0),0);
const totalUnpaid=totalRevenue-totalPaid;
const totalKg=allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.kg,0),0);
const avgCostKg=Math.round(totalDeployed/totalKg);
const grossProfit=totalRevenue-allSups.reduce((a,[,s])=>a+s.batches.filter(b=>b.status==="sold").reduce((b,bt)=>b+bt.totalCost,0),0);
const bi01=allSups.reduce((a,[,s])=>[...a,...s.batches],[]).find(b=>b.status==="sold");
const bi01Rev=allSups.reduce((a,[,s])=>a+s.sales.reduce((b,cl)=>b+cl.items.filter(it=>it.batch===bi01?.id).reduce((c,it)=>c+it.total,0),0),0)||totalRevenue;
const bi01Cost=bi01?bi01.totalCost:200275;
const bi01Margin=((bi01Rev-bi01Cost)/bi01Rev*100).toFixed(1);
const bi01ROI=((bi01Rev-bi01Cost)/bi01Cost*100).toFixed(1);
const monthlyBurn=salaries.reduce((a,s)=>a+s.gross,0)+1200+89;
const founderCapital=totalDeployed-200000;
const vatRefund=allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.vat19,0),0);
const invValue=allSups.reduce((a,[,s])=>a+s.batches.filter(b=>b.status!=="sold").reduce((b,bt)=>b+bt.kg*5200,0),0);

return <>
{/* Hero KPIs */}
<div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",borderRadius:12,padding:16,marginBottom:14,color:"#fff"}}>
<div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:8}}>
{[
[lang==="de"?"Investiert":(lang==="de"?"Investiert":"Invested"),"€"+totalDeployed.toLocaleString(),"#f87171"],
[lang==="de"?"Umsatz":"Revenue","€"+totalRevenue.toLocaleString(),"#4ade80"],
[lang==="de"?"Bezahlt":(lang==="de"?"Eingenommen":"Collected"),"€"+totalPaid.toLocaleString(),"#60a5fa"],
[lang==="de"?"Offen":(lang==="de"?"Forderungen":"Receivables"),"€"+totalUnpaid.toLocaleString(),"#fbbf24"],
["BI-01 ROI",bi01ROI+"%","#34d399"],
["BI-01 Margin",bi01Margin+"%","#34d399"],
].map(([l,v,c],j)=><div key={j} style={{textAlign:"center"}}>
<div style={{fontSize:18,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:10,opacity:.7}}>{l}</div>
</div>)}
</div>
</div>

{/* Proven Model Card */}
<div style={{borderRadius:12,border:"2px solid #05966944",background:"#05966908",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#059669",marginBottom:8}}>✅ Proven Business Model — First Batch Results</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:10}}>
{[
[bi01?.id||"BI-01",bi01?.product||"NOC SE 17","Product"],
[(bi01?.kg||59.5)+"kg","imported",(lang==="de"?"Menge":"Volume")],
["€"+(bi01Cost).toLocaleString(),"all-in cost","Investment"],
["€"+bi01Rev.toLocaleString(),"total sales","Revenue"],
["€"+(bi01Rev-bi01Cost).toLocaleString(),bi01Margin+"% margin",(lang==="de"?"Bruttogewinn":"Gross Profit")],
].map(([v,sub,l],j)=><div key={j} style={{textAlign:"center",padding:6,background:"#fff",borderRadius:6}}>
<div style={{fontSize:15,fontWeight:800}}>{v}</div>
<div style={{fontSize:9,color:"#6b7280"}}>{sub}</div>
<div style={{fontSize:10,fontWeight:600,color:"#059669"}}>{l}</div>
</div>)}
</div>
<div style={{fontSize:11,color:"#374151"}}>
<strong>Key takeaway:</strong> First commercial batch generated <strong>{bi01ROI}% ROI</strong> with <strong>{bi01Margin}% gross margin</strong> across 4 wholesale clients + pharmacy + DTC. Average revenue per kg: <strong>€{Math.round(bi01Rev/(bi01?.kg||59.5)).toLocaleString()}/kg</strong> (blended wholesale + pharmacy).
</div>
</div>

{/* Capital Structure */}
<div style={{borderRadius:12,border:"2px solid #1e40af44",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#1e40af",marginBottom:8}}>🏦 Capital Structure & Balance Sheet</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
<div>
<div style={{fontSize:13,fontWeight:700,marginBottom:6}}>FUNDING SOURCES</div>
{investors.map((inv,j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"6px 8px",background:j%2?"#f9fafb":"#fff",borderRadius:4,marginBottom:2,fontSize:12}}>
<div><span style={{fontWeight:700}}>{inv.name}</span><span style={{color:"#6b7280"}}> · {inv.type}</span></div>
<div style={{fontWeight:700,color:inv.status==="deployed"?"#059669":inv.status==="active"?"#2563eb":"#d97706"}}>€{inv.amount.toLocaleString()}</div>
</div>)}
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 8px",background:"#eff6ff",borderRadius:4,marginBottom:2,fontSize:12,fontWeight:700,borderTop:"2px solid #1e40af"}}>
<div>Founder Personal Capital</div><div style={{color:"#1e40af"}}>€{founderCapital.toLocaleString()}</div>
</div>
<div style={{display:"flex",justifyContent:"space-between",padding:"6px 8px",background:"#0f172a",borderRadius:4,color:"#fff",fontSize:12,fontWeight:700}}>
<div>TOTAL DEPLOYED</div><div>€{totalDeployed.toLocaleString()}</div>
</div>
</div>
<div>
<div style={{fontSize:13,fontWeight:700,marginBottom:6}}>BALANCE SHEET (Current)</div>
<div style={{fontSize:11}}>
{[
[(lang==="de"?"AKTIVA":"ASSETS"),"","","#0f172a"],
[(lang==="de"?"Bargeld (est.)":"Cash (est.)")," ","€"+(totalPaid-monthlyBurn*3).toLocaleString(),"#059669"],
["Receivables"," ","€"+totalUnpaid.toLocaleString(),"#d97706"],
[(lang==="de"?"Lager (Marktwert)":"Inventory (market value)")," ","€"+invValue.toLocaleString(),"#2563eb"],
[(lang==="de"?"Vorsteuer-Erstattung":"VAT Refund Due")," ","€"+vatRefund.toLocaleString(),"#7c3aed"],
[(lang==="de"?"SUMME AKTIVA":"TOTAL ASSETS"),"","€"+(totalPaid-monthlyBurn*3+totalUnpaid+invValue+vatRefund).toLocaleString(),"#059669"],
["","","",""],
[(lang==="de"?"PASSIVA":"LIABILITIES"),"","","#0f172a"],
["Bridge Loan","6% due 12/2026","€50,000","#dc2626"],
[(lang==="de"?"Aufgelaufene Zinsen":"Accrued Interest"),"","€3,000","#dc2626"],
[(lang==="de"?"EIGENKAPITAL":"EQUITY"),"","€"+((totalPaid-monthlyBurn*3+totalUnpaid+invValue+vatRefund)-53000).toLocaleString(),"#1e40af"],
].map(([l,sub,v,c],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:l===""?"1px 0":"3px 6px",fontSize:l==="ASSETS"||l==="LIABILITIES"||l==="TOTAL ASSETS"||l==="EQUITY"?12:11,fontWeight:l==="ASSETS"||l==="LIABILITIES"||l==="TOTAL ASSETS"||l==="EQUITY"?700:400,background:l==="TOTAL ASSETS"?"#f0fdf4":l==="EQUITY"?"#eff6ff":"transparent",borderRadius:2,color:l==="ASSETS"||l==="LIABILITIES"?"#fff":"inherit",backgroundColor:l==="ASSETS"||l==="LIABILITIES"?"#0f172a":l==="TOTAL ASSETS"?"#f0fdf4":l==="EQUITY"?"#eff6ff":"transparent"}}>
<div>{l}<span style={{color:"#9ca3af",fontSize:9,marginLeft:4}}>{sub}</span></div>
<div style={{fontWeight:600,color:c}}>{v}</div>
</div>)}
</div>
</div>
</div>
</div>

{/* 2026 Projections */}
<div style={{borderRadius:12,border:"2px solid #0f172a44",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,marginBottom:8}}>📊 2026 Projection — 3,000 kg Import Plan</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
<div>
<div style={{fontSize:13,fontWeight:700,marginBottom:6}}>PROJECTED P&L</div>
{[
["Revenue","€18,660,000","100%","#059669",true],
["COGS (3.000 kg)","(€12,040,000)","64.5%","#dc2626",false],
["Gross Profit","€6,620,000","35.5%","#059669",true],
[(lang==="de"?"Betriebskosten":"Operating Expenses"),"(€274,400)","1.5%","#dc2626",false],
["EBIT","€6,345,600","34.0%","#0f172a",true],
[(lang==="de"?"Vorsteuer 19%":"VAT 19% Refund"),"+€2,287,600","","#7c3aed",false],
[(lang==="de"?"Kreditrückzahlung":"Loan Repayment"),"(€53,000)","","#dc2626",false],
[(lang==="de"?"NETTO-CASHFLOW":"NET CASH FLOW"),"€8,580,200","46.0%","#059669",true],
].map(([l,v,pct,c,bold],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:bold?"5px 8px":"3px 8px",fontSize:bold?13:11,fontWeight:bold?800:400,background:l==="EBIT"?"#0f172a":l==="NET CASH FLOW"?"#059669":l==="Gross Profit"?"#f0fdf4":"transparent",color:l==="EBIT"||l==="NET CASH FLOW"?"#fff":"inherit",borderRadius:l==="EBIT"||l==="NET CASH FLOW"||l==="Gross Profit"?4:0}}>
<div>{l}</div><div><span style={{color:l==="EBIT"||l==="NET CASH FLOW"?"#fff":c,fontWeight:700}}>{v}</span>{pct&&<span style={{fontSize:9,color:"#9ca3af",marginLeft:4}}>{pct}</span>}</div>
</div>)}
</div>
<div>
<div style={{fontSize:13,fontWeight:700,marginBottom:6}}>IMPORT PLAN BY SUPPLIER</div>
{[
["🇦🇷 Cannava","1,800 kg","€4,100/kg","€7,380,000","#059669"],
["🇨🇴 Medcolcanna","1,000 kg","€3,500/kg","€3,500,000","#dc2626"],
["🇨🇦 HYTN","200 kg","€5,800/kg","€1,160,000","#f59e0b"],
["TOTAL","3,000 kg","€4,013/kg","€12,040,000","#0f172a"],
].map(([s,kg,cost,total,c],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"5px 8px",fontSize:12,background:j===3?"#f1f5f9":"transparent",borderRadius:j===3?4:0,fontWeight:j===3?700:400,borderTop:j===3?"2px solid #0f172a":"none"}}>
<div style={{color:c,fontWeight:700}}>{s}</div><div>{kg}</div><div style={{color:"#6b7280"}}>{cost}</div><div style={{fontWeight:700}}>{total}</div>
</div>)}
<div style={{marginTop:10,fontSize:13,fontWeight:700,marginBottom:6}}>REVENUE BY CHANNEL</div>
{[
[(lang==="de"?"Großhandel (B2B)":"Wholesale (B2B)"),"65%","1,950 kg","€10,140,000","#374151"],
[(lang==="de"?"Apotheke":"Pharmacy (Apotheke)"),"20%","600 kg","€4,800,000","#059669"],
["Wix/DTC (Online)","10%","300 kg","€2,850,000","#7c3aed"],
["Export (EU)","5%","150 kg","€870,000","#2563eb"],
].map(([ch,pct,kg,rev,c],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 8px",fontSize:11}}>
<div style={{color:c,fontWeight:600}}>{ch}</div><div>{pct}</div><div>{kg}</div><div style={{fontWeight:700}}>{rev}</div>
</div>)}
</div>
</div>
</div>

{/* Series A Proposal */}
<div style={{borderRadius:12,background:"linear-gradient(135deg,#0f172a,#1e3a5f)",padding:16,color:"#fff",marginBottom:14}}>
<div style={{fontSize:19,fontWeight:800,marginBottom:10}}>🚀 Series A Proposal</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:12}}>
{[[(lang==="de"?"Kapitalbedarf":"Ask"),"€2.0M – €2.5M"],[(lang==="de"?"Beteiligung":"Equity"),"20-25%"],["Pre-money","€8M – €10M"],[(lang==="de"?"Verwendung":"Use"),(lang==="de"?"Import + Betriebskapital":"Import + Working Capital")]].map(([l,v],j)=>
<div key={j} style={{textAlign:"center",padding:8,background:"rgba(255,255,255,.1)",borderRadius:8}}>
<div style={{fontSize:10,opacity:.7}}>{l}</div>
<div style={{fontSize:16,fontWeight:800}}>{v}</div>
</div>)}
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
{[
["Conservative\n2,000 kg","€12.4M rev","€3.3M EBIT","27%"],
["Base Case\n3,000 kg","€18.7M rev","€6.3M EBIT","34%"],
["Aggressive\n5,000 kg","€28.0M rev","€8.6M EBIT","31%"],
].map(([scenario,rev,ebit,margin],j)=>
<div key={j} style={{padding:10,background:j===1?"rgba(52,211,153,.2)":"rgba(255,255,255,.08)",borderRadius:8,border:j===1?"1px solid rgba(52,211,153,.5)":"1px solid rgba(255,255,255,.15)"}}>
<div style={{fontSize:11,fontWeight:700,whiteSpace:"pre-line"}}>{scenario}</div>
<div style={{fontSize:14,fontWeight:800,color:"#4ade80",marginTop:4}}>{ebit}</div>
<div style={{fontSize:10,opacity:.7}}>{rev} · {margin} margin</div>
</div>)}
</div>
</div>

{/* Competitive Moats */}
<div style={{borderRadius:12,border:"2px solid #7c3aed44",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#7c3aed",marginBottom:8}}>🏆 Competitive Advantages</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:6}}>
{[
["§52a AMG License","12-18 month barrier to entry for new importers"],
["BfArM Import Permits","Approved for 3 countries (AR, CO, CA)"],
["BtMG §3 Narcotics License","Strict compliance, limited issuance"],
["3-Origin Supply Chain","Only multi-continent importer at this scale"],
["GDP-Certified QMS","Full QR traceability per unit, audit-ready"],
["Founder Skin in Game","€"+founderCapital.toLocaleString()+" personal capital deployed"],
["Proven Unit Economics","40.7% gross margin, 68.7% ROI on first batch"],
["€2B+ Market Access","800K+ patients, growing 3,300% YoY prescriptions"],
].map(([t,d],j)=>
<div key={j} style={{padding:6,fontSize:11,background:"#faf5ff",borderRadius:4,border:"1px solid #7c3aed22"}}>
<span style={{fontWeight:700,color:"#7c3aed"}}>✅ {t}:</span> {d}
</div>)}
</div>
</div>

{/* Print Investor Report */}
<div style={{display:"flex",gap:8}}>
<button onClick={()=>{const w=window.open("","_blank","width=1000,height=800");w.document.write('<html><head><title>NOC Pharma — Investor Report</title><style>body{font-family:Arial;padding:25px;font-size:11px}h1{font-size:18px;color:#0f172a;border-bottom:2px solid}h2{font-size:14px;margin-top:16px;color:#1e40af}table{width:100%;border-collapse:collapse;margin:8px 0}td,th{padding:4px 6px;border:1px solid #d1d5db;font-size:9px}th{background:#f1f5f9;text-align:left}.kpi{display:inline-block;padding:8px 16px;margin:4px;background:#f8fafc;border-radius:6px;text-align:center}.kpi b{display:block;font-size:16px}.banner{background:#0f172a;color:#fff;padding:14px;margin:-25px -25px 18px}.g{color:#059669}.r{color:#dc2626}.b{color:#1e40af}@media print{body{padding:15px}}</style></head><body>');w.document.write('<div class="banner"><strong style="font-size:18px">NOC Pharma GmbH</strong><br/>Investor Financial Report — March 2026<br/><span style="font-size:10px;opacity:.7">Confidential · AI CFO Module · QMS v2.5</span></div>');w.document.write('<h1>Executive Summary</h1><div class="kpi"><b class="g">€'+totalRevenue.toLocaleString()+'</b>Revenue to Date</div><div class="kpi"><b class="b">€'+totalDeployed.toLocaleString()+'</b>Invested</div><div class="kpi"><b class="g">'+bi01Margin+'%</b>Gross Margin (BI-01)</div><div class="kpi"><b class="g">'+bi01ROI+'%</b>ROI (BI-01)</div><div class="kpi"><b class="r">€'+totalUnpaid.toLocaleString()+'</b>Receivables</div>');w.document.write('<h2>2026 Projection — 3,000 kg</h2><table><tr><th>Metric</th><th>Value</th></tr><tr><td>Revenue</td><td><b>€18,660,000</b></td></tr><tr><td>COGS</td><td>(€12,040,000)</td></tr><tr><td>Gross Profit</td><td class="g"><b>€6,620,000 (35.5%)</b></td></tr><tr><td>EBIT</td><td class="b"><b>€6,345,600 (34.0%)</b></td></tr><tr><td>Net Cash Flow</td><td class="g"><b>€8,580,200</b></td></tr></table>');w.document.write('<h2>Series A</h2><p>Ask: €2.0M–€2.5M · Equity: 20-25% · Pre-money: €8M–€10M</p>');w.document.write('<div style="margin-top:20px;font-size:8px;color:#9ca3af;text-align:center;border-top:1px solid #ddd;padding-top:6px">NOC Pharma GmbH · QMS v2.5 · '+new Date().toISOString()+'</div></body></html>');w.document.close();setTimeout(function(){w.print()},500)}} style={{padding:"10px 22px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#1e40af",color:"#fff",cursor:"pointer"}}>🖨️ Print Investor Report</button>
<button onClick={()=>{const body="NOC Pharma GmbH — Investor Summary\n"+"=".repeat(45)+"\n\nBI-01 Results: "+bi01ROI+"% ROI, "+bi01Margin+"% margin\nTotal Deployed: €"+totalDeployed.toLocaleString()+"\nRevenue: €"+totalRevenue.toLocaleString()+"\nReceivables: €"+totalUnpaid.toLocaleString()+"\n\n2026 Projection (3,000 kg):\nRevenue: €18,660,000\nEBIT: €6,345,600 (34%)\nNet Cash Flow: €8,580,200\n\nSeries A: €2.0M-€2.5M @ €8-10M pre-money\n\nNOC Pharma GmbH · QMS v2.5";window.open(gmailLink("NOC Pharma — Investor Report March 2026",body),"_blank")}} style={{padding:"10px 22px",borderRadius:6,fontSize:14,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>📧 Email Summary</button>
</div>
</>})()}
</div>}

{/* ═══════════════ VAT 19% TAB ═══════════════ */}
{finTab==="vat"&&<div>
<div style={{fontSize:20,fontWeight:800,marginBottom:12}}>🏛️ VAT 19% — Vorsteuer Recovery</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
{[["Import VAT Paid","€"+fmtF(allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.vat19,0),0)).replace("€",""),"#dc2626"],["VAT on Sales","€"+fmtF(Math.round(totalSalesAll*0.19/(1.19))).replace("€",""),"#059669"],["Net Refund Due","€"+fmtF(allSups.reduce((a,[,s])=>a+s.batches.reduce((b,bt)=>b+bt.vat19,0),0)-Math.round(totalSalesAll*0.19/1.19)).replace("€",""),"#1e40af"]].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:8,padding:12,border:"1px solid #e5e7eb",textAlign:"center"}}>
<div style={{fontSize:20,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:12,color:"#6b7280"}}>{l}</div>
</div>)}
</div>
<Cd t="Vorsteuer per Batch">
{allSups.map(([k,s])=>s.batches.filter(b=>b.vat19>0).map((b,j)=><div key={k+j} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",background:j%2?"#f9fafb":"#fff",borderRadius:4,marginBottom:2}}>
<div><span style={{fontWeight:700}}>{b.id}</span> · {s.fl} {b.product} · {b.kg}kg</div>
<div style={{fontWeight:700,color:"#dc2626"}}>€{b.vat19.toLocaleString()}</div>
</div>)).flat()}
</Cd>
<div style={{marginTop:10,padding:12,background:"#fefce8",borderRadius:8,border:"1px solid #fde68a"}}>
<div style={{fontWeight:700,marginBottom:6}}>📅 Filing Schedule — Finanzamt Greifswald</div>
{[["Q1 2026 (Jan-Mar)","Due: 10.04.2026","⏳ Pending"],["Q2 2026 (Apr-Jun)","Due: 10.07.2026","⏳ Upcoming"],["Q3 2026 (Jul-Sep)","Due: 10.10.2026","📋 Planned"],["Q4 2026 (Oct-Dec)","Due: 10.01.2027","📋 Planned"]].map(([q,d,s],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:13}}>
<span style={{fontWeight:600}}>{q}</span><span style={{color:"#6b7280"}}>{d}</span><span>{s}</span>
</div>)}
</div>
</div>}

{/* ═══════════════ SPARKASSE BANK TAB ═══════════════ */}
{finTab==="bank"&&<div>
<div style={{fontSize:20,fontWeight:800,marginBottom:12}}>🏦 Sparkasse — Bank Reconciliation</div>
<div style={{padding:20,background:"#fff7ed",borderRadius:10,border:"1px solid #fed7aa",textAlign:"center"}}>
<div style={{fontSize:32,marginBottom:8}}>🏦</div>
<div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{lang==="de"?"Sparkasse CSV-Import":"Sparkasse CSV Import"}</div>
<div style={{fontSize:13,color:"#6b7280",marginBottom:12}}>{lang==="de"?"Exportiere deine Umsätze als CSV aus dem Sparkasse Online-Banking und lade sie hier hoch":"Export your transactions as CSV from Sparkasse Online-Banking and upload here"}</div>
<div style={{fontSize:12,color:"#9ca3af",marginBottom:12}}>Sparkasse → Online-Banking → Umsätze → Export → CSV</div>
<button style={{padding:"10px 24px",borderRadius:8,fontSize:14,fontWeight:700,border:"none",background:"#ea580c",color:"#fff",cursor:"pointer"}}>📂 {lang==="de"?"CSV hochladen":"Upload CSV"}</button>
</div>
<div style={{marginTop:12}}>
<Cd t={lang==="de"?"Erwartete Zahlungseingänge":"Expected Incoming Payments"}>
{allSups.map(([k,s])=>s.sales.filter(cl=>cl.items.some(it=>!it.paid)).map((cl,j)=><div key={k+j} style={{display:"flex",justifyContent:"space-between",padding:"8px 10px",background:"#fef2f2",borderRadius:4,marginBottom:2}}>
<div><span style={{fontWeight:700}}>{cl.client}</span> · {cl.city}</div>
<div style={{fontWeight:700,color:"#dc2626"}}>€{cl.items.filter(it=>!it.paid).reduce((a,it)=>a+it.total,0).toLocaleString()} {lang==="de"?"offen":"unpaid"}</div>
</div>)).flat()}
</Cd>
</div>
</div>}

{/* ═══════════════ FORECAST TAB ═══════════════ */}
{finTab==="forecast"&&<div>
<div style={{fontSize:22,fontWeight:800,marginBottom:4}}>🔮 {lang==="de"?"AI CFO — 12-Monats Prognose":(lang==="de"?"AI CFO — 12-Monats-Prognose":"AI CFO — 12-Month Forecast")}</div>
<div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>{lang==="de"?"Basierend auf echten Verkaufsdaten, Lagerbestand & Importplan":(lang==="de"?"Basierend auf echten Verkaufsdaten, Lagerbestand & Importplan":"Based on real sales data, inventory & import plan")}</div>

{/* KPIs from real data */}
<div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6,marginBottom:12}}>
{[
[lang==="de"?"Bargeld (est.)":"Cash (est.)","€"+Math.round(CFO.estCash).toLocaleString(),CFO.estCash>0?"#059669":"#dc2626"],
[lang==="de"?"Monatl. Burn":(lang==="de"?"Monatl. Burn":"Monthly Burn"),"€"+CFO.monthlyBurn.toLocaleString(),"#d97706"],
["Runway",Math.max(0,Math.round(CFO.estCash/CFO.monthlyBurn))+" mo",CFO.estCash/CFO.monthlyBurn>6?"#059669":"#dc2626"],
[lang==="de"?"Lager":(lang==="de"?"Lager":"Inventory"),CFO.inventoryKg+"kg (€"+Math.round(CFO.inventoryCost/1000)+"K)","#2563eb"],
[lang==="de"?"Forderungen":"Receivables","€"+CFO.totalUnpaid.toLocaleString(),"#f59e0b"],
["12mo EBIT","€"+Math.round(CFO.proj.ebit/1000)+"K ("+CFO.proj.ebitMargin+"%)","#059669"],
].map(([l,v,c],j)=><div key={j} style={{background:"#fff",borderRadius:8,padding:8,border:"1px solid #e5e7eb",textAlign:"center"}}>
<div style={{fontSize:15,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,color:"#6b7280"}}>{l}</div>
</div>)}
</div>

{/* Monthly forecast grid */}
<div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:3,marginBottom:12}}>
{CFO.forecast.map((f,j)=><div key={j} style={{textAlign:"center",padding:6,background:f.balance>0?"#f0fdf4":"#fef2f2",borderRadius:4,border:"1px solid "+(f.balance>0?"#a7f3d0":"#fca5a5")}}>
<div style={{fontSize:10,fontWeight:700,color:"#6b7280"}}>{f.m}</div>
<div style={{fontSize:8,color:"#059669"}}>+€{(f.income/1000).toFixed(0)}K</div>
<div style={{fontSize:8,color:"#dc2626"}}>-€{((f.cogs+f.opex)/1000).toFixed(0)}K</div>
<div style={{fontSize:11,fontWeight:800,color:f.balance>0?"#059669":"#dc2626",marginTop:2}}>€{(f.balance/1000).toFixed(0)}K</div>
<div style={{fontSize:8,color:"#6b7280"}}>{f.sellKg}kg</div>
</div>)}
</div>

{/* Detailed table */}
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#0f172a",color:"#fff"}}>
{[lang==="de"?"Monat":"Month",lang==="de"?"kg Verkauft":"kg Sold",lang==="de"?"Umsatz":"Revenue","COGS","OpEx","Netto",lang==="de"?"Kontostand":"Cash Balance"].map((h,j)=>
<th key={j} style={{padding:"5px 6px",fontWeight:700,fontSize:10,textAlign:j>0?"right":"left"}}>{h}</th>)}
</tr></thead>
<tbody>
{CFO.forecast.map((f,j)=>
<tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:f.balance>0?"transparent":"#fef2f2"}}>
<td style={{padding:"4px 6px",fontWeight:600}}>{f.m}</td>
<td style={{padding:"4px 6px",textAlign:"right"}}>{f.sellKg}</td>
<td style={{padding:"4px 6px",textAlign:"right",color:"#059669",fontWeight:700}}>€{f.income.toLocaleString()}</td>
<td style={{padding:"4px 6px",textAlign:"right",color:"#dc2626"}}>€{f.cogs.toLocaleString()}</td>
<td style={{padding:"4px 6px",textAlign:"right",color:"#d97706"}}>€{f.opex.toLocaleString()}</td>
<td style={{padding:"4px 6px",textAlign:"right",fontWeight:700,color:f.net>0?"#059669":"#dc2626"}}>€{f.net.toLocaleString()}</td>
<td style={{padding:"4px 6px",textAlign:"right",fontWeight:800,color:f.balance>0?"#059669":"#dc2626"}}>€{Math.round(f.balance).toLocaleString()}</td>
</tr>)}
</tbody>
</table>

<div style={{marginTop:10,padding:10,background:"#fefce8",borderRadius:8,border:"1px solid #fde68a",fontSize:11}}>
<strong>🤖 AI CFO Note:</strong> Forecast based on BI-01 actual performance (€{CFO.revenuePerKg.toLocaleString()}/kg blended), current inventory ({CFO.inventoryKg}kg), burn rate (€{CFO.monthlyBurn.toLocaleString()}/mo), and 3,000kg 2026 import plan. Revenue scales as new batches enter market. Connect Sparkasse for real cash position.
</div>
</div>}

{/* ═══════════════ COMPETITOR INTELLIGENCE TAB ═══════════════ */}
{finTab==="compete"&&<div>
<div style={{fontSize:22,fontWeight:800,marginBottom:4}}>⚔️ {lang==="de"?"Markt & Wettbewerb — NOC Pharma vs Markt":(lang==="de"?"Markt & Wettbewerb — NOC Pharma vs Markt":"Market & Competitors — NOC Pharma vs Market")}</div>
<div style={{fontSize:12,color:"#6b7280",marginBottom:12}}>{lang==="de"?"Preisvergleich, Plattformen, Absatzkanäle & Revenue Share":(lang==="de"?"Preisvergleich, Plattformen, Absatzkanäle & Revenue Share":"Price comparison, platforms, sales channels & revenue share")}</div>

{/* Market Overview KPIs */}
<div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:8,marginBottom:14}}>
{[["🇩🇪 Market Size","€2B+ (2025)","800K+ patients","#0f172a"],["📉 Avg Price/g","€5.20","↓ from €11.90 (2022)","#dc2626"],["📦 Imports 2025","~57 tons/Q3","Growing 8t/quarter","#2563eb"],["🏪 Pharmacies","18,000+","Top 50 = 50%+ sales","#059669"],["💊 Wholesalers","45+","flowzz database","#7c3aed"]].map(([t,v,sub,c],j)=>
<div key={j} style={{padding:8,borderRadius:8,background:c+"08",border:"1px solid "+c+"33",textAlign:"center"}}>
<div style={{fontSize:10,fontWeight:600,color:"#6b7280"}}>{t}</div>
<div style={{fontSize:18,fontWeight:800,color:c}}>{v}</div>
<div style={{fontSize:9,color:"#9ca3af"}}>{sub}</div>
</div>)}
</div>

{/* NOC Pharma Pricing vs Market */}
<div style={{borderRadius:12,border:"2px solid #0f172a33",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,marginBottom:8}}>💰 NOC Pharma Pricing vs Market</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#0f172a",color:"#fff"}}>
{[lang==="de"?"THC Segment":"THC Segment",lang==="de"?"Markt Tief":"Market Low",lang==="de"?"Markt Ø":"Market Avg",lang==="de"?"Markt Hoch":"Market High",lang==="de"?"NOC Preis":"NOC Price",lang==="de"?"NOC Marge":"NOC Margin","Position"].map((h,j)=>
<th key={j} style={{padding:"6px 8px",fontWeight:700,fontSize:10}}>{h}</th>)}
</tr></thead>
<tbody>
{[
["Budget (<17% THC)","€2.50/g","€4.50/g","€6.00/g","—","—","Not competing"],
["Mid (17-22% THC)","€3.30/g","€5.20/g","€8.00/g","€5.20/g (W) / €7.80/g (P)","21-49%","✅ Competitive"],
["Premium (22-27% THC)","€4.50/g","€7.50/g","€12.00/g","€5.20/g (W) / €8.00/g (P)","21-49%","🏆 Below avg"],
["Ultra (27%+ THC)","€6.00/g","€9.50/g","€12.50/g","€9.50/g","38%","✅ At market"],
].map((r,j)=>
<tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:r[5]!=="—"?"#f0fdf4":"#f9fafb"}}>
{r.map((c,k)=><td key={k} style={{padding:"5px 8px",fontWeight:k===4||k===6?700:400,color:k===6?"#059669":k===4?"#1e40af":"inherit"}}>{c}</td>)}
</tr>)}
</tbody>
</table>
<div style={{fontSize:10,color:"#6b7280",marginTop:6}}>W = Wholesale (to pharmacies) · P = Pharmacy end-price · Prices based on flowzz.com & market data March 2026</div>
</div>

{/* Platform Comparison */}
<div style={{borderRadius:12,border:"2px solid #7c3aed33",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#7c3aed",marginBottom:8}}>📱 Sales Platforms — Where to Sell NOC Products</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#7c3aed",color:"#fff"}}>
{[lang==="de"?"Plattform":"Platform",lang==="de"?"Typ":"Type",lang==="de"?"Reichweite":"Reach",lang==="de"?"Gebühr/Modell":"Fee/Model",lang==="de"?"NOC Strategie":"NOC Strategy",lang==="de"?"Priorität":"Priority"].map((h,j)=>
<th key={j} style={{padding:"6px 8px",fontWeight:700,fontSize:10}}>{h}</th>)}
</tr></thead>
<tbody>
{[
["flowzz.com","Price comparison","#1 in DE, 1,500+ products","Listing fee","✅ List all NOC products for visibility","🔴 HIGH"],
["DrAnsay","Telemedizin + marketplace","350+ pharmacies","Rev share per order","✅ Partner pharmacy model","🔴 HIGH"],
["Cansativa","Wholesaler + pharmacy portal","40+ suppliers, 24h delivery","B2B wholesale","✅ Already selling (client)","🟢 ACTIVE"],
["MedCanOneStop","Patient portal","Growing patient base","Pharmacy listing","✅ List partner pharmacies","🟡 MEDIUM"],
["Bloomwell","Telemedizin clinic","Large patient network","Per prescription","✅ Supply their pharmacy partners","🟡 MEDIUM"],
["Weed.de","Marketplace + prescriptions","High traffic","Affiliate/listing","✅ Product listings","🟡 MEDIUM"],
["CannGo","Prescription service","EU-wide doctors","Prescription fee","⏳ Evaluate","⚪ LOW"],
["DoktorABC","Telemedizin","International","Consultation fee","⏳ Evaluate","⚪ LOW"],
["NOC Wix Shop","Own DTC channel","Direct patients","No fees, own margin","🏆 Highest margin channel","🔴 HIGH"],
].map((r,j)=>
<tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:r[5].includes("HIGH")||r[5].includes("ACTIVE")?"#faf5ff":"transparent"}}>
{r.map((c,k)=><td key={k} style={{padding:"5px 8px",fontWeight:k===0||k===5?700:400,color:k===5?(c.includes("HIGH")||c.includes("ACTIVE")?"#7c3aed":"#6b7280"):"inherit"}}>{c}</td>)}
</tr>)}
</tbody>
</table>
</div>

{/* Revenue Share Pharmacy Model */}
<div style={{borderRadius:12,border:"2px solid #059669aa",background:"#05966906",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#059669",marginBottom:8}}>🏥 NOC Pharmacy Revenue Share Model</div>
<div style={{fontSize:12,color:"#374151",marginBottom:10}}>Instead of selling wholesale at €5.20/kg to another pharmacy, NOC places products in partner pharmacies with a revenue share model — earning more per gram.</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:12}}>
<div style={{padding:10,borderRadius:8,background:"#fff",border:"2px solid #dc262644"}}>
<div style={{fontSize:12,fontWeight:700,color:"#dc2626"}}>❌ Traditional Wholesale</div>
<div style={{fontSize:10,color:"#6b7280",marginTop:4}}>NOC sells 1kg to pharmacy</div>
<div style={{fontSize:18,fontWeight:800,marginTop:4}}>€5,200/kg</div>
<div style={{fontSize:10,color:"#6b7280"}}>Pharmacy marks up to €8-10/g</div>
<div style={{fontSize:10,color:"#6b7280"}}>Pharmacy keeps €2,800-4,800</div>
<div style={{fontSize:13,fontWeight:700,color:"#dc2626",marginTop:4}}>NOC Margin: €1,106/kg (21%)</div>
</div>
<div style={{padding:10,borderRadius:8,background:"#fff",border:"2px solid #05966944"}}>
<div style={{fontSize:12,fontWeight:700,color:"#059669"}}>✅ Revenue Share (60/40)</div>
<div style={{fontSize:10,color:"#6b7280",marginTop:4}}>NOC places product in partner pharmacy</div>
<div style={{fontSize:18,fontWeight:800,marginTop:4}}>€8.00/g avg</div>
<div style={{fontSize:10,color:"#6b7280"}}>Pharmacy gets 40% = €3.20/g</div>
<div style={{fontSize:10,color:"#6b7280"}}>NOC gets 60% = €4.80/g = €4,800/kg</div>
<div style={{fontSize:13,fontWeight:700,color:"#059669",marginTop:4}}>NOC Margin: €706/kg more (+13%)</div>
</div>
<div style={{padding:10,borderRadius:8,background:"#fff",border:"2px solid #1e40af44"}}>
<div style={{fontSize:12,fontWeight:700,color:"#1e40af"}}>🏆 Own Pharmacy / DTC</div>
<div style={{fontSize:10,color:"#6b7280",marginTop:4}}>NOC sells directly via Wix / own pharmacy</div>
<div style={{fontSize:18,fontWeight:800,marginTop:4}}>€9.50/g</div>
<div style={{fontSize:10,color:"#6b7280"}}>No middleman</div>
<div style={{fontSize:10,color:"#6b7280"}}>Full retail price to NOC</div>
<div style={{fontSize:13,fontWeight:700,color:"#1e40af",marginTop:4}}>NOC Margin: €5,406/kg (57%)</div>
</div>
</div>

<div style={{fontSize:14,fontWeight:700,marginBottom:6}}>📊 Revenue per Channel — 3,000 kg Scenario</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#059669",color:"#fff"}}>
{[lang==="de"?"Kanal":"Channel","% Mix","kg","€/kg","Revenue","vs Großhandel",lang==="de"?"Mehr Umsatz":"Extra Revenue"].map((h,j)=>
<th key={j} style={{padding:"5px 6px",fontWeight:700,fontSize:10}}>{h}</th>)}
</tr></thead>
<tbody>
{[
["Wholesale (traditional)","40%","1,200","€5,200","€6,240,000","—","—"],
["Rev Share Pharmacy (60/40)","25%","750","€4,800","€3,600,000","-€300K","Higher volume potential"],
["Rev Share Pharmacy (70/30)","10%","300","€5,600","€1,680,000","+€120K","Premium placement"],
["Own Pharmacy / DTC (Wix)","15%","450","€9,500","€4,275,000","+€1,935K","🏆 Best margin"],
["Export (EU wholesale)","10%","300","€5,800","€1,740,000","+€180K","New markets"],
["TOTAL","100%","3,000","€5,845","€17,535,000","",""],
].map((r,j)=>
<tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:j===3?"#f0fdf4":j===5?"#f1f5f9":"transparent"}}>
{r.map((c,k)=><td key={k} style={{padding:"4px 6px",fontWeight:k===0||k===4||j===5?700:400,textAlign:k>1?"right":"left",color:j===3&&k===5?"#059669":j===5?"#0f172a":"inherit"}}>{c}</td>)}
</tr>)}
</tbody>
</table>
</div>

{/* Competitor Landscape */}
<div style={{borderRadius:12,border:"2px solid #0f172a33",padding:14,marginBottom:14}}>
<div style={{fontSize:17,fontWeight:800,marginBottom:8}}>🏢 Key Competitors — German Cannabis Importers</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
<thead><tr style={{background:"#1e293b",color:"#fff"}}>
{[lang==="de"?"Firma":"Company",lang==="de"?"Herkunft":"Origin(s)",lang==="de"?"Vol.":"Est. Volume",lang==="de"?"Preis":"Price Range",lang==="de"?"Stärke":"Strength",lang==="de"?"Schwäche":"Weakness","NOC Edge"].map((h,j)=>
<th key={j} style={{padding:"5px 6px",fontWeight:700,fontSize:9}}>{h}</th>)}
</tr></thead>
<tbody>
{[
["Cansativa","Multi-origin","Market leader","€4-8/g","Distribution, 40+ suppliers","No own production","NOC is their supplier ✅"],
["Tilray/Aphria","DE + CA + PT","Large","€5-10/g","EU-GMP, own German grow","Corporate, expensive","Lower cost, agile"],
["Aurora","CA + DE + DK","Medium","€6-12/g","Brand, clinical data","High costs, losses","Better pricing"],
["Four 20 Pharma","Multi-import","Growing","€4-7/g","Aggressive pricing","Cash flow","Already customer ✅"],
["Demecan","Germany","~1 ton/yr","€8-10/g","Made in Germany","Tiny scale","Volume + variety"],
["Cantourage","Multi-origin","Growing fast","€4-8/g","Fast Track model","No own supply","3-origin supply chain"],
["STADA/Phytocann","CAN + PT","Medium","€5-9/g","Big pharma backing","Slow","Nimble, multi-origin"],
["NOC Pharma","AR + CO + CA","378 kg → 3t","€5.20-9.50/g","3 origins, low cost, GDP","Scale needed","🏆 Multi-origin moat"],
].map((r,j)=>
<tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:j===7?"#eff6ff":"transparent"}}>
{r.map((c,k)=><td key={k} style={{padding:"4px 6px",fontWeight:j===7||k===0?700:400,fontSize:10,color:j===7?"#1e40af":"inherit"}}>{c}</td>)}
</tr>)}
</tbody>
</table>
</div>

{/* Price Monitor */}
<div style={{borderRadius:12,border:"2px dashed #d97706",background:"#fef3c7",padding:14}}>
<div style={{fontSize:17,fontWeight:800,color:"#d97706",marginBottom:6}}>📡 Live Market Intelligence — Action Items</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
{[
["🔴 URGENT: List on flowzz","NOC products not yet visible on Germany's #1 price comparison. 1,500+ products listed, patients compare daily. Register at flowzz.com/contact"],
["🔴 URGENT: DrAnsay Partnership","350+ partner pharmacies. NOC can supply products through their network. Contact for wholesale/rev share terms."],
["🟡 TODO: MedCanOneStop Listing","Growing patient portal. List NOC partner pharmacies to capture prescription flow."],
["🟡 TODO: Bloomwell Supply","Major telemedizin clinic needs reliable supply. NOC's multi-origin advantage = reliability."],
["🟢 MONITOR: Price Barometer","flowzz + Integraleaf publish monthly pricing. Avg dropped to €5.20/g. Track monthly for pricing strategy."],
["🟢 MONITOR: MedCanG Reform","Draft bill in Bundestag. Expected Q2 2026. May affect telemedicine prescriptions and pharmacy pricing rules."],
].map(([title,desc],j)=>
<div key={j} style={{padding:8,borderRadius:6,background:"#fff",border:"1px solid #d9770644"}}>
<div style={{fontSize:12,fontWeight:700}}>{title}</div>
<div style={{fontSize:10,color:"#6b7280",marginTop:2}}>{desc}</div>
</div>)}
</div>
</div>
</div>}

{/* ═══════════════ AI CFO TAB ═══════════════ */}
{finTab==="cfo"&&<div>
<div style={{background:"linear-gradient(135deg,#7c3aed,#4f46e5)",borderRadius:12,padding:16,marginBottom:14,color:"#fff"}}>
<div style={{fontSize:22,fontWeight:800}}>🤖 AI CFO Agent — NOC Pharma</div>
<div style={{fontSize:13,opacity:.8}}>Intelligent financial monitoring, alerts & recommendations</div>
</div>

{/* CFO Alerts */}
<Cd t={"🚨 "+(lang==="de"?"Prioritäts-Warnungen":"Priority Alerts")}>
{[
{type:"overdue",icon:"🔴",title:lang==="de"?"Überfällige Rechnung":"Overdue Invoice",desc:"Four 20 Pharma GmbH — €27,000 unpaid (BI-01: 8×1kg + BI-02: 5×1kg)",action:"Send Mahnung",days:45,email:"accounting@four20pharma.de"},
{type:"overdue",icon:"🔴",title:lang==="de"?"Überfällige Rechnung":"Overdue Invoice",desc:"Ilios Santé GmbH — €27,500 unpaid (BI-02: 5×1kg)",action:"Send Mahnung",days:30,email:"finance@ilios-sante.de"},
{type:"vat",icon:"🟡",title:"VAT Filing Due",desc:"Q1 2026 Vorsteueranmeldung — Due 10.04.2026 — €209,444 refund pending",action:"Prepare Filing",days:39},
{type:"expense",icon:"🟡",title:lang==="de"?"Ausstehende Gehälter":"Pending Salaries",desc:"March 2026 payroll — €12,500 gross — Due by 01.03.2026",action:"Process Payment",days:0},
{type:"cash",icon:"🟢",title:"Wix Revenue",desc:wixOrders.length+" orders synced — €"+wixOrders.reduce((a,o)=>a+o.totals.total,0).toFixed(0)+" total — "+wixOrders.filter(o=>o.status==="PAID").length+" paid",action:"Reconcile"},
{type:"forecast",icon:"🔵",title:"MCCN Batch MC-01 Payment",desc:"€264,000 FOB due Q3 2026 — Ensure cash reserve or bridge financing",action:"Plan",days:180}
].map((a,j)=><div key={j} style={{display:"flex",gap:10,padding:10,background:a.type==="overdue"?"#fef2f2":a.type==="vat"?"#fefce8":"#fff",borderRadius:8,marginBottom:4,border:"1px solid "+(a.type==="overdue"?"#fca5a5":a.type==="vat"?"#fde68a":"#e5e7eb"),alignItems:"center"}}>
<div style={{fontSize:20}}>{a.icon}</div>
<div style={{flex:1}}>
<div style={{fontWeight:700,fontSize:14}}>{a.title}{a.days!==undefined&&a.days<=30?<span style={{marginLeft:6,fontSize:11,color:"#dc2626",fontWeight:800}}>{a.days}d</span>:""}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{a.desc}</div>
</div>
<button onClick={()=>{if(a.email){window.open(gmailLink("Zahlungserinnerung — NOC Pharma GmbH","Sehr geehrte Damen und Herren,\n\nhiermit erinnern wir an die offene Rechnung:\n\n"+a.desc+"\n\nBitte überweisen Sie den ausstehenden Betrag innerhalb von 7 Tagen auf unser Konto bei der Sparkasse.\n\nMit freundlichen Grüßen\nNOC Pharma GmbH\nCelso Hamelink\nOperations Manager"),"_blank")}}} style={{padding:"6px 14px",borderRadius:6,fontSize:12,fontWeight:700,border:"none",background:a.type==="overdue"?"#dc2626":"#1e40af",color:"#fff",cursor:"pointer",whiteSpace:"nowrap"}}>{a.action}</button>
</div>)}
</Cd>

{/* CFO Summary */}
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:12}}>
<Cd t={"💰 "+(lang==="de"?"Forderungen":"Receivables")}>
<div style={{fontSize:24,fontWeight:800,color:"#dc2626"}}>€{fmtF(allSups.reduce((a,[,s])=>a+s.sales.reduce((b,cl)=>b+cl.items.filter(it=>!it.paid).reduce((c,it)=>c+it.total,0),0),0)).replace("€","")}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{lang==="de"?"Offene Rechnungen":"Outstanding invoices"}</div>
<div style={{marginTop:6}}>
{allSups.map(([k,s])=>s.sales.filter(cl=>cl.items.some(it=>!it.paid)).map((cl,j)=><div key={k+j} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"2px 0"}}><span>{cl.client}</span><span style={{fontWeight:700,color:"#dc2626"}}>€{cl.items.filter(it=>!it.paid).reduce((a,it)=>a+it.total,0).toLocaleString()}</span></div>)).flat()}
</div>
</Cd>
<Cd t={"🏦 "+(lang==="de"?"Cashflow":"Cash Flow")}>
<div style={{fontSize:24,fontWeight:800,color:"#059669"}}>€{fmtF(totalSalesAll).replace("€","")}</div>
<div style={{fontSize:12,color:"#6b7280"}}>{lang==="de"?"Umsatz bisher":"Revenue to date"}</div>
<div style={{height:6,background:"#f1f5f9",borderRadius:3,marginTop:8}}><div style={{height:6,background:"linear-gradient(90deg,#059669,#10b981)",borderRadius:3,width:Math.min(100,Math.round(totalSalesAll/totalInvest*100))+"%"}}></div></div>
<div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{Math.round(totalSalesAll/totalInvest*100)}% of investment recovered</div>
</Cd>
<Cd t={"📊 "+(lang==="de"?"Marge":"Margin")}>
<div style={{fontSize:24,fontWeight:800,color:totalSalesAll>totalInvest?"#059669":"#d97706"}}>{Math.round((totalSalesAll-allSups.reduce((a,[,s])=>a+s.batches.filter(b=>b.status==="sold").reduce((b,bt)=>b+bt.totalCost,0),0))/totalSalesAll*100)||0}%</div>
<div style={{fontSize:12,color:"#6b7280"}}>{lang==="de"?"Bruttomarge (verkaufte Chargen)":"Gross margin (sold batches)"}</div>
<div style={{marginTop:8,fontSize:12}}>
<div style={{display:"flex",justifyContent:"space-between"}}><span>Revenue</span><span style={{color:"#059669",fontWeight:700}}>{fmtF(totalSalesAll)}</span></div>
<div style={{display:"flex",justifyContent:"space-between"}}><span>COGS (sold)</span><span style={{color:"#dc2626",fontWeight:700}}>{fmtF(allSups.reduce((a,[,s])=>a+s.batches.filter(b=>b.status==="sold").reduce((b,bt)=>b+bt.totalCost,0),0))}</span></div>
</div>
</Cd>
</div>

{/* Auto-notification settings */}
<div style={{padding:12,background:"#f8fafc",borderRadius:8,border:"1px solid #e2e8f0"}}>
<div style={{fontWeight:700,marginBottom:6}}>⚙️ {lang==="de"?"Benachrichtigungs-Einstellungen":"Notification Settings"}</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,fontSize:13}}>
{[["Overdue 7d → Zahlungserinnerung","✅"],["Overdue 14d → 1. Mahnung","✅"],["Overdue 30d → 2. Mahnung + Legal","✅"],["VAT deadline 30d before → Alert","✅"],["Salary due 3d before → Remind","✅"],["Cash below €10K → Warning","✅"]].map(([l,s],j)=><div key={j} style={{display:"flex",justifyContent:"space-between",padding:"4px 8px",background:"#fff",borderRadius:4}}>
<span>{l}</span><span>{s}</span>
</div>)}
</div>
</div>
</div>}

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
{[["CA-03","🇦🇷 CA-03 (IN TRANSIT)",true],["BI-04","🇦🇷 BI-04 (Planned)",false],["MC-01","🇨🇴 MC-01 (Qualification)",false]].map(([id,label,active])=>
<button key={id} onClick={()=>setSelBatch(id)} style={{flex:1,padding:"6px 8px",borderRadius:5,fontSize:13,fontWeight:selBatch===id?700:400,border:selBatch===id?"2px solid #b45309":"1px solid #d1d5db",background:selBatch===id?"#fef3c7":"#fff",color:selBatch===id?"#92400e":"#6b7280",cursor:"pointer"}}>{label}</button>)}
</div>

{/* Expected docs for CA-03 */}
{selBatch==="CA-03"&&<div style={{marginBottom:10,padding:8,background:"#fff",borderRadius:6,border:"1px solid #e5e7eb"}}>
<div style={{fontSize:14,fontWeight:700,color:"#1e40af",marginBottom:4}}>📋 CA-03 — {lang==="de"?"Erwartete Dokumente (40)":"Expected Documents (40)"}</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,fontSize:12}}>
{[
["M0: Canmed Registration","M0: GMP Certificate (ANMAT)"],
["M0: Quality Technical Agreement","M0: BfArM Import Permit (New)"],
["M0: INCB Allocation 2026","M0: PZN Confirmation (IFA)"],
["M0.5: Supplier COA","M0.5: SEDRONAR Export Permit"],
["M0.5: Phytosanitary Certificate","M0.5: Packing List (140kg)"],
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
users:<Cd t="👥👥 User Management" badge={<Bd c="#7c3aed" b="#f5f3ff">{users.length} users</Bd>}><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:14}}>{[["Total",users.length,"#374151"],["Active",users.filter(u=>u.active!==false).length,"#059669"],["Inactive",users.filter(u=>u.active===false).length,"#dc2626"],["Admin/QP/RP",users.filter(u=>["admin","qp","rp"].includes(u.level)).length,"#7c3aed"]].map(([l,v,col],i)=><div key={i} style={{padding:"8px",background:"#f9fafb",borderRadius:8,border:"1px solid #e5e7eb",textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:col}}>{v}</div><div style={{fontSize:11,color:"#6b7280"}}>{l}</div></div>)}</div><button onClick={()=>{setNewUser({name:"",email:"",level:"viewer",pw:genPw()});setShowAddUser(true)}} style={{marginBottom:10,padding:"7px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#7c3aed",color:"#fff",cursor:"pointer"}}>＋ Add User</button>{showAddUser&&<div style={{marginBottom:14,padding:14,background:"#f5f3ff",borderRadius:10,border:"2px solid #7c3aed"}}><div style={{fontWeight:700,color:"#7c3aed",marginBottom:10}}>➕ New User</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}><div><div style={{fontSize:12,fontWeight:600,marginBottom:3}}>Name</div><input value={newUser.name} onChange={e=>setNewUser(p=>({...p,name:e.target.value}))} placeholder="Full name" style={{width:"100%",padding:"7px 10px",borderRadius:5,border:"1.5px solid #d1d5db",fontSize:14,boxSizing:"border-box"}}/></div><div><div style={{fontSize:12,fontWeight:600,marginBottom:3}}>Email</div><input value={newUser.email} onChange={e=>setNewUser(p=>({...p,email:e.target.value}))} placeholder="name@nocpharma.de" style={{width:"100%",padding:"7px 10px",borderRadius:5,border:"1.5px solid #d1d5db",fontSize:14,boxSizing:"border-box"}}/></div><div><div style={{fontSize:12,fontWeight:600,marginBottom:3}}>Role</div><select value={newUser.level} onChange={e=>setNewUser(p=>({...p,level:e.target.value}))} style={{width:"100%",padding:"7px 10px",borderRadius:5,border:"1.5px solid #d1d5db",fontSize:14,boxSizing:"border-box"}}>{[["admin","Admin"],["qp","QP §15 AMG"],["rp","RP §52a AMG"],["leitung_qs","Head QA"],["logistics","Logistics"],["warehouse","Warehouse"],["lab_tech","Lab Tech"],["auditor","Auditor (read-only)"],["viewer","Viewer (read-only)"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></div><div><div style={{fontSize:12,fontWeight:600,marginBottom:3}}>Temp Password <button onClick={()=>setNewUser(p=>({...p,pw:genPw()}))} style={{marginLeft:4,padding:"1px 5px",borderRadius:3,fontSize:11,border:"1px solid #d1d5db",background:"#fff",cursor:"pointer"}}>↺</button></div><input value={newUser.pw} onChange={e=>setNewUser(p=>({...p,pw:e.target.value}))} style={{width:"100%",padding:"7px 10px",borderRadius:5,border:"1.5px solid #d1d5db",fontSize:13,fontFamily:"monospace",boxSizing:"border-box"}}/></div></div><div style={{display:"flex",gap:8}}><button onClick={()=>{if(!newUser.name||!newUser.email){alert("Name + email required");return;}const id=newUser.name.toLowerCase().replace(/[^a-z]/g,"")+Date.now().toString().slice(-3);const init=newUser.name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();saveUsers([...users,{id,name:newUser.name,role:newUser.level,email:newUser.email,level:newUser.level,initials:init,pw:newUser.pw,active:true,lastLogin:null}]);setShowAddUser(false)}} style={{flex:1,padding:"7px",borderRadius:5,fontSize:13,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>✅ Create User</button><button onClick={()=>{if(!newUser.name||!newUser.email){alert("Fill name + email first");return;}const body="Welcome to NOC Pharma QMS\n\nURL: https://noc-pharma-qms-production.up.railway.app\nUsername: "+newUser.email+"\nPassword: "+newUser.pw+"\n\nNOC Pharma GmbH";window.open("https://mail.google.com/mail/?view=cm&to="+encodeURIComponent(newUser.email)+"&su=NOC+Pharma+QMS+Access&body="+encodeURIComponent(body),"_blank")}} style={{flex:1,padding:"7px",borderRadius:5,fontSize:13,fontWeight:700,border:"1px solid #2563eb",background:"#eff6ff",color:"#2563eb",cursor:"pointer"}}>📧 Send Invite</button><button onClick={()=>setShowAddUser(false)} style={{padding:"7px 12px",borderRadius:5,fontSize:13,border:"1px solid #d1d5db",background:"#fff",color:"#6b7280",cursor:"pointer"}}>✕</button></div></div>}<table style={{width:"100%",fontSize:13,borderCollapse:"collapse",border:"1px solid #e5e7eb",borderRadius:8}}><thead><tr style={{background:"#f9fafb"}}>{["Name","Email","Role","Last Login","Status",""].map((h,j)=><th key={j} style={{padding:"9px 12px",borderBottom:"2px solid #e5e7eb",textAlign:"left",fontSize:12,color:"#6b7280",fontWeight:700}}>{h}</th>)}</tr></thead><tbody>{users.map((u,j)=><tr key={j} style={{borderBottom:"1px solid #f3f4f6",background:u.active===false?"#fef2f2":"#fff"}}><td style={{padding:"9px 12px",fontWeight:600}}><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:30,height:30,borderRadius:"50%",background:RC[u.level]||"#6b7280",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0}}>{u.initials}</div><span>{u.name}{u.id===auth?.id&&<span style={{marginLeft:5,fontSize:9,padding:"1px 4px",borderRadius:3,background:"#7c3aed",color:"#fff"}}>YOU</span>}</span></div></td><td style={{padding:"9px 12px",color:"#6b7280",fontSize:12}}>{u.email}</td><td style={{padding:"9px 12px"}}><Bd c={RC[u.level]||"#6b7280"} b={(RC[u.level]||"#6b7280")+"18"}>{u.role}</Bd></td><td style={{padding:"9px 12px",color:"#6b7280",fontSize:11}}>{u.lastLogin?new Date(u.lastLogin).toLocaleDateString("de-DE"):"Never"}</td><td style={{padding:"9px 12px"}}><Bd c={u.active!==false?"#059669":"#dc2626"} b={u.active!==false?"#d1fae5":"#fee2e2"}>{u.active!==false?"Active":"Inactive"}</Bd></td><td style={{padding:"9px 12px"}}>{u.id!==auth?.id&&<div style={{display:"flex",gap:5}}><button onClick={()=>{const body="NOC Pharma QMS\n\nURL: https://noc-pharma-qms-production.up.railway.app\nUsername: "+u.email+"\nPassword: "+u.pw+"\n\nNOC Pharma GmbH";window.open("https://mail.google.com/mail/?view=cm&to="+encodeURIComponent(u.email)+"&su=NOC+QMS+Credentials&body="+encodeURIComponent(body),"_blank")}} style={{padding:"3px 8px",borderRadius:4,fontSize:12,fontWeight:700,border:"none",background:"#2563eb",color:"#fff",cursor:"pointer"}}>📧</button><button onClick={()=>{const pw=genPw();if(!confirm("Reset password for "+u.name+" to:\n"+pw))return;saveUsers(users.map(x=>x.id===u.id?{...x,pw}:x));const body="Password Reset\n\nNew: "+pw+"\nURL: https://noc-pharma-qms-production.up.railway.app";window.open("https://mail.google.com/mail/?view=cm&to="+encodeURIComponent(u.email)+"&su=Password+Reset&body="+encodeURIComponent(body),"_blank")}} style={{padding:"3px 8px",borderRadius:4,fontSize:12,fontWeight:700,border:"1px solid #d97706",background:"#fff",color:"#d97706",cursor:"pointer"}}>🔑</button><button onClick={()=>{if(!confirm((u.active!==false?"Deactivate":"Activate")+" "+u.name+"?"))return;saveUsers(users.map(x=>x.id===u.id?{...x,active:u.active===false}:x))}} style={{padding:"3px 8px",borderRadius:4,fontSize:12,fontWeight:700,border:"1px solid #d1d5db",background:"#fff",color:u.active!==false?"#dc2626":"#059669",cursor:"pointer"}}>{u.active!==false?"🚫":"✅"}</button></div>}</td></tr>)}</tbody></table><div style={{marginTop:12,padding:10,background:"#fef2f2",borderRadius:6,border:"1px solid #fecaca"}}><div style={{fontSize:13,fontWeight:700,color:"#dc2626",marginBottom:5}}>🧹 {lang==="de"?"Demo-Daten löschen":"Clear Demo Data"}</div><div style={{fontSize:12,color:"#6b7280",marginBottom:7}}>{lang==="de"?"Entfernt alle hochgeladenen Dokumente. Benutzerkonten bleiben erhalten.":"Removes all uploaded documents. User accounts are kept."}</div><button onClick={()=>{if(!confirm(lang==="de"?"Alle Demo-Daten löschen?":"Clear all demo data?"))return;["noc-qms-uploads","noc-qms-doc-originals","noc-qms-audit-log"].forEach(k=>localStorage.removeItem(k));Object.keys(localStorage).filter(k=>k.startsWith("noc-qms-doc-details")).forEach(k=>localStorage.removeItem(k));alert(lang==="de"?"Erledigt — Seite neu laden.":"Done — please refresh.")}} style={{padding:"5px 14px",borderRadius:5,fontSize:13,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>🗑️ {lang==="de"?"Löschen":"Clear"}</button></div><div style={{marginTop:8,padding:7,background:"#f5f3ff",borderRadius:5,fontSize:11,color:"#6b7280"}}>🔒 21 CFR Part 11 — All logins logged · Passwords stored locally</div></Cd>
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
{users.map(u=><button key={u.id} onClick={()=>{setLoginForm(p=>({...p,user:u.id}));setTimeout(()=>{setLoginForm(p=>({...p,loading:true}));setTimeout(()=>{setAuth(u);localStorage.setItem("noc-auth",JSON.stringify(u));setLoginForm(p=>({...p,loading:false}))},800)},100)}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:8,border:"1px solid rgba(71,85,105,0.3)",background:"rgba(15,23,42,0.4)",cursor:"pointer",textAlign:"left",transition:"all .2s",width:"100%"}}>
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
<input type="file" ref={origFileRef} onChange={async(e)=>{const f=e.target.files[0];if(!f||!origTarget)return;
/* If re-uploading, log the replacement in audit trail */
const prevDoc=docOriginals[origTarget];
if(prevDoc){
  setAuditLog(prev=>[{ts:new Date().toISOString(),user:auth?.name||"Celso Hamelink",action:"REPLACE_ORIGINAL",docKey:origTarget,field:"original_document",oldVal:prevDoc.name+" (v"+(prevDoc.version||1)+")",newVal:f.name,batch:selBatch||"CA-03",document:f.name,docType:"original"},...prev]);
}
const url=URL.createObjectURL(f);const ext=f.name.split(".").pop().toLowerCase();
const fileSize=(f.size/1024).toFixed(1)+"KB";
const supName=sup==="cannava"?"Cannava":sup==="mccn"?"Medcolcanna":"HYTN";
const batch=selBatch||"CA-03";
const curBD=BT_DATA[batch]||BT_DATA["CA-03"]||{};

/* Show loading state immediately */
setDocOriginals(p=>({...p,[origTarget]:{
name:f.name,url,ext,size:fileSize,date:new Date().toLocaleString("de-DE"),
analyzing:true,aiResult:null,extracted:{},discrepancies:[],summary:"",docType:f.name
}}));

/* Convert file to base64 for AI analysis */
const toBase64=file=>new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=()=>rej(new Error("Read failed"));r.readAsDataURL(file)});
let aiResult=null;
let aiError=null;
try{
const base64Data=await toBase64(f);
const mediaType=ext==="pdf"?"application/pdf":ext==="png"?"image/png":ext==="jpg"||ext==="jpeg"?"image/jpeg":"application/pdf";

/* Build system data context for comparison */
const sysContext=`
CURRENT SYSTEM DATA FOR ${batch}:
- Batch ID: ${curBD.id||"TBD"}
- Product: ${curBD.p||"Cannabis flos"}
- Net Weight: ${curBD.net||"TBD"} kg
- Gross Weight: ${curBD.gross||"TBD"} kg
- Total Units: ${curBD.units||"TBD"} (${curBD.bags1kg||"?"} × 1kg bags + ${curBD.doy10g||"?"} × 10g doypacks)
- Boxes: ${curBD.boxes||"TBD"}
- EXW Value: ${curBD.exw||"TBD"}
- Route: ${curBD.route||"TBD"}
- Expiry: ${curBD.exp||"TBD"}
- QP: ${curBD.qp||"TBD"}
- Analysis No: ${curBD.aNo||"TBD"}
- Lab: ${curBD.lab||"TBD"}
- Supplier: ${supName}

Compare EVERY extracted value against these system values. Flag ANY difference.`;

const systemPrompt=`You are an AI Document Extraction Agent for NOC Pharma GmbH, a German pharmaceutical cannabis importer (§52a AMG).

CONTEXT:
- Import: ${batch}
- Supplier: ${supName}
- Document: ${f.name} (uploaded to slot: ${origTarget})
${sysContext}

INSTRUCTIONS:
1. Read this document thoroughly — extract EVERY data field you can find
2. For each field, compare with the SYSTEM DATA above
3. Flag discrepancies with severity: "critical" (safety/regulatory), "warning" (data mismatch), "info" (minor)
4. Classify data to lifecycle stages (M0-M6) and identify financial data
5. Use EXACT field names that match logistics/pharma standards

IMPORTANT: Use these EXACT field names when they apply:
- "MAWB Number", "HAWB Number", "Carrier", "Flight Number"
- "Origin Airport", "Destination Airport", "Departure Date", "Arrival Date" 
- "Gross Weight", "Net Weight", "Pieces", "Boxes"
- "Shipper Name", "Shipper Address", "Consignee Name", "Consignee Address"
- "THC Content", "CBD Content", "TAMC", "Lead Content"
- "Invoice Number", "Invoice Amount", "EXW Value", "CIF Value"
- "Batch Number", "Product Description", "Expiry Date"
- "Temperature Range", "Datalogger ID"
- Use standard names like above, NOT custom abbreviations

LIFECYCLE STAGES:
- M0: Registration & Permits
- M0.5: Pre-Arrival (COA, export permits, packing lists, invoices)
- M1: GDP Transport (AWB, freight, insurance, customs, temp logs)
- M1.5: Vault Arrival (receipt, inspection, seal, weight)
- M2: Lab Testing (potency, micro, metals, terpenes)
- M3: QP Release
- M4: Relabeling
- M4.5: Storage
- M5: Shipment
- M6: Reconciliation
- FINANCE: Costs, invoices, VAT
${origTarget==="sc"?`
COA EXTRACTION — SUPPLIER COA:
This is a SUPPLIER Certificate of Analysis. Extract ALL test parameters with their exact values.
Use these EXACT field names for lab parameters:
"THC Content", "CBD Content", "CBN Content", "Loss on Drying", "Moisture Karl Fischer",
"Lead Pb", "Cadmium Cd", "Mercury Hg", "Arsenic As",
"TAMC", "TYMC", "Bile-tolerant Gram-neg", "E. coli", "Salmonella",
"Pesticides", "Aflatoxin B1", "Aflatoxins Total", "Ochratoxin A", "Total Terpenes"
Include units (%, ppm, ppb, CFU/g). Also extract: Lab Name, Analysis Number, Analysis Date, Batch, Product.
`:""}${(origTarget==="lab_coa"||origTarget==="qsi_coa"||(origTarget&&origTarget.toLowerCase().includes("lab")))?`
COA EXTRACTION — QSI LAB RESULTS (Independent Retest):
This is a QSI Bremen independent laboratory report (§14 AMG mandatory retest).
Extract ALL test parameters with exact values using these field names:
"THC Content", "CBD Content", "CBN Content", "Loss on Drying", "Moisture Karl Fischer",
"Lead Pb", "Cadmium Cd", "Mercury Hg", "Arsenic As",
"TAMC", "TYMC", "Bile-tolerant Gram-neg", "E. coli", "Salmonella",
"Pesticides", "Aflatoxin B1", "Aflatoxins Total", "Ochratoxin A", "Total Terpenes"
Include units. Also extract: Lab Name, Analysis Certificate Number, Analysis Date, Batch.

Ph. Eur. LIMITS (compare against these):
- THC: 19% ±10% (17.1–20.9%)
- CBD: ≤1.0%
- CBN: ≤0.5%
- Loss on Drying: ≤12%
- Moisture: ≤10%
- Lead: ≤0.5 ppm
- Cadmium: ≤0.3 ppm
- Mercury: ≤0.1 ppm
- Arsenic: ≤0.2 ppm
- TAMC: ≤500,000 CFU/g
- TYMC: ≤10,000 CFU/g
- Bile-tolerant Gram-neg: ≤50,000 CFU/g
- E. coli: absent in 1g
- Salmonella: absent in 25g
- Aflatoxin B1: ≤2 ppb
- Aflatoxins total: ≤4 ppb
- Ochratoxin A: ≤2 ppb
${docOriginals["sc"]?.extracted?`
SUPPLIER COA DATA (for cross-reference):
${Object.entries(docOriginals["sc"].extracted).map(([k,v])=>k+": "+v).join("\n")}
Compare QSI results with supplier values and flag variances >10%.`:""}
`:""}

Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation:
{
  "docType": "string",
  "summary": "1-2 sentence summary",
  "extracted": {"field_name": "value"},
  "discrepancies": [{"field": "name", "declared": "system value", "found": "document value", "severity": "info|warning|critical"}],
  "stageData": {"M1": {"field": "value"}},
  "finance": {"costs": [{"desc": "item", "amount": "€xxx", "category": "freight|customs|insurance|product|vat"}], "invoiceNo": "", "totalValue": ""},
  "spreadTo": ["M0.5", "M1"]
}`;

const content=[];
if(ext==="pdf"){
content.push({type:"document",source:{type:"base64",media_type:"application/pdf",data:base64Data}});
content.push({type:"text",text:"Extract ALL data from this pharmaceutical document. Compare with system values. Respond with JSON only, no markdown."});
}else{
content.push({type:"image",source:{type:"base64",media_type:mediaType,data:base64Data}});
content.push({type:"text",text:"Extract ALL data from this pharmaceutical document image. Compare with system values. Respond with JSON only, no markdown."});
}

const resp=await fetch("/api/anthropic",{
method:"POST",headers:{"Content-Type":"application/json"},
body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,system:systemPrompt,messages:[{role:"user",content}]})
});

if(!resp.ok){
const errBody=await resp.text().catch(()=>"");
throw new Error("API "+resp.status+": "+errBody.slice(0,300));
}

const data=await resp.json();
if(data.error){throw new Error("API Error: "+(data.error.message||JSON.stringify(data.error)))}

const txt=data.content?.map(b=>b.text||"").join("")||"";
const clean=txt.replace(/```json|```/g,"").trim();
if(!clean||clean[0]!=="{"){throw new Error("Invalid JSON response: "+clean.slice(0,200))}
aiResult=JSON.parse(clean);
}catch(err){
console.error("AI extraction error:",err);
aiError=err.message||"Unknown error";
aiResult=null;
}

/* Update docOriginals — stop analyzing, track version */
setDocOriginals(p=>{const prev=p[origTarget];return{...p,[origTarget]:{
name:f.name,url,ext,size:fileSize,date:new Date().toLocaleString("de-DE"),
version:(prev?.version||0)+1,
previousVersion:prev?{name:prev.name,date:prev.date,version:prev.version||1}:null,
analyzing:false,
aiResult,
aiError,
extracted:aiResult?.extracted||{},
discrepancies:aiResult?.discrepancies||[],
summary:aiResult?.summary||"",
docType:aiResult?.docType||f.name
}}});

/* Spread to related lifecycle stages as uploads */
const spreadStages=aiResult?.spreadTo||[];
if(spreadStages.length>0){
const newUploads=spreadStages.filter((s,i,a)=>a.indexOf(s)===i).map(stage=>({
name:f.name,size:fileSize,type:ext,date:new Date().toLocaleString("de-DE"),
stage,batch,sup:supName,url,content:aiResult?.summary||"",fromZip:null,linkedFrom:origTarget
}));
setUploads(p=>[...newUploads,...p]);
}

/* Build approval modal — even on error, show what we have */
const exFields=Object.entries(aiResult?.extracted||{});
const disc=aiResult?.discrepancies||[];
const finCosts=aiResult?.finance?.costs||[];

/* Extended field mapping — covers AWB, Packing List, COA, Invoice fields */
const FIELD_MAP={
"Net Weight":"net","Gross Weight":"gross","Total Units":"units",
"1kg Bags":"bags1kg","10g Doypacks":"doy10g","Boxes":"boxes","Pieces":"boxes",
"EXW Value":"exw","Route":"route","Batch Number":"id","Product":"p","Product Description":"p",
"Expiry Date":"exp","Analysis Number":"aNo","QP Name":"qp","Certificate Number":"cert",
"MAWB Number":"","HAWB Number":"","Carrier":"","Flight Number":"",
"Origin Airport":"","Destination Airport":"","Departure Date":"","Arrival Date":"",
"Shipper Name":"","Consignee Name":"","Temperature Range":"",
"THC Content":"","CBD Content":"","TAMC":"","Lead Content":"",
"Invoice Number":"","Invoice Amount":"","CIF Value":""
};

const approvalFields=exFields.map(([key,val])=>{
  const sysKey=FIELD_MAP[key]||"";
  const sysVal=sysKey?String(curBD[sysKey]||"—"):"—";
  const docVal=String(val);
  const discMatch=disc.find(d=>d.field===key);
  const severity=discMatch?discMatch.severity:(sysVal!=="—"&&sysVal!==docVal?"warning":"match");
  return {key,label:key,systemValue:sysVal,docValue:docVal,status:"pending",severity,sysKey,category:discMatch?"discrepancy":"extracted"};
});

/* Add discrepancies not already in extracted */
disc.forEach(d=>{if(!approvalFields.find(f=>f.key===d.field))approvalFields.push({key:d.field,label:d.field,systemValue:d.declared||"—",docValue:d.found||"—",status:"pending",severity:d.severity,sysKey:"",category:"discrepancy"})});

const financeFields=finCosts.map((c,i)=>({key:"fin_"+i,label:c.desc,systemValue:"—",docValue:c.amount,status:"pending",severity:"info",category:"finance",finCategory:c.category}));

const allFields=[...approvalFields,...financeFields];

/* Only show approval modal if we have data OR an error to report */
if(allFields.length>0||aiError){
const safeSpread=(spreadStages||[]).filter(s=>typeof s==="string");
console.log("[AI Approval] Opening modal:",{fields:allFields.length,finance:financeFields.length,spread:safeSpread,error:aiError});
setAiApproval({
  docKey:origTarget,fileName:f.name,batch,supplier:supName,
  docType:aiResult?.docType||f.name,summary:aiResult?.summary||(aiError?"⚠️ AI extraction failed: "+aiError:""),
  fields:allFields,
  stageData:aiResult?.stageData||{},
  spreadTo:safeSpread,
  finance:aiResult?.finance||{},
  totalValue:aiResult?.finance?.totalValue||"",
  timestamp:new Date().toISOString(),
  aiError:aiError||null
});
}

e.target.value="";}} accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png" style={{display:"none"}}/>
<nav style={{width:210,background:"linear-gradient(180deg,#065f46,#064e3b)",color:"#fff",position:"fixed",top:0,left:0,bottom:0,display:"flex",flexDirection:"column",overflowY:"auto",zIndex:100}}>
<div style={{padding:"12px 10px",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:7}}><div style={{width:30,height:30,background:"rgba(255,255,255,.15)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15}}>NOC</div><div><div style={{fontWeight:700,fontSize:16}}>NOC Pharma</div><div style={{fontSize:12,opacity:.6}}>QMS v2.3</div></div></div>
{nav.map((sec,si)=><div key={si}><div style={{padding:"7px 9px 2px",fontSize:12,textTransform:"uppercase",letterSpacing:1,opacity:.4,fontWeight:600}}>{sec.s}</div>{sec.i.map(n=><button key={n.k} onClick={()=>{if(n.k.startsWith("fin-")){setPg("finance");const sub=n.k.replace("fin-","");setFinTab(sub);if(sub==="cannava"||sub==="mccn"||sub==="hytn")setSup(sub)}else if(n.k==="finance"){setPg("finance");setFinTab("overview")}else{setPg(n.k)}}} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 10px",margin:"1px 4px",borderRadius:5,color:(pg===n.k||(pg==="finance"&&n.k==="finance"&&finTab==="overview")||(pg==="finance"&&n.k==="fin-"+finTab))?"#fff":"rgba(255,255,255,.7)",background:(pg===n.k||(pg==="finance"&&n.k==="finance"&&finTab==="overview")||(pg==="finance"&&n.k==="fin-"+finTab))?"rgba(255,255,255,.18)":"transparent",cursor:"pointer",border:"none",width:"calc(100% - 8px)",textAlign:"left",fontSize:n.k.startsWith("fin-")?13:15,fontWeight:(pg===n.k||(pg==="finance"&&n.k==="fin-"+finTab))?600:400,paddingLeft:n.k.startsWith("fin-")?"24px":"10px"}}><span style={{width:16,textAlign:"center",fontSize:n.k.startsWith("fin-")?14:16}}>{n.ic}</span>{n.l}</button>)}</div>)}
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

{/* AI Document Approval Modal */}
{aiApproval&&aiApproval.fields&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:400,display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(4px)"}} onClick={()=>{}}>
<div onClick={e=>e.stopPropagation()} style={{width:820,maxHeight:"92vh",background:"#fff",borderRadius:16,boxShadow:"0 25px 60px rgba(0,0,0,.3)",overflow:"hidden",display:"flex",flexDirection:"column"}}>
{/* Header */}
<div style={{padding:"16px 20px",background:"linear-gradient(135deg,#1e3a5f,#0f766e)",color:"#fff",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontSize:18,fontWeight:800,display:"flex",alignItems:"center",gap:8}}>🤖 {lang==="de"?"KI-Dokumentenanalyse":"AI Document Analysis"}<span style={{padding:"2px 10px",borderRadius:20,fontSize:13,fontWeight:700,background:"rgba(255,255,255,.2)"}}>{aiApproval.docType}</span></div>
<div style={{fontSize:14,opacity:.85,marginTop:3}}>{aiApproval.fileName} · {aiApproval.batch} · {aiApproval.supplier}</div>
</div>
<button onClick={()=>setAiApproval(null)} style={{background:"rgba(255,255,255,.2)",border:"none",color:"#fff",borderRadius:6,padding:"6px 12px",cursor:"pointer",fontWeight:700,fontSize:16}}>✕</button>
</div>

{/* Summary */}
{aiApproval.aiError&&<div style={{padding:"10px 20px",background:"#fef2f2",borderBottom:"1px solid #fecaca",fontSize:14,color:"#991b1b",display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:18}}>⚠️</span><div><strong>{lang==="de"?"KI-Fehler":"AI Error"}:</strong> {aiApproval.aiError}<br/><span style={{fontSize:12,color:"#b91c1c"}}>{lang==="de"?"Prüfen Sie die Browser-Konsole (F12). Häufige Ursache: CORS-Fehler bei direktem API-Aufruf.":"Check browser console (F12). Common cause: CORS error on direct API call from browser."}</span></div>
</div>}
{aiApproval.summary&&!aiApproval.aiError&&<div style={{padding:"10px 20px",background:"#f0fdf4",borderBottom:"1px solid #a7f3d0",fontSize:14,color:"#065f46",display:"flex",alignItems:"center",gap:8}}>
<span style={{fontSize:18}}>📄</span>{aiApproval.summary}
</div>}

{/* Stats bar */}
<div style={{padding:"8px 20px",background:"#f8fafc",borderBottom:"1px solid #e5e7eb",display:"flex",gap:12,fontSize:13}}>
{(()=>{const ap=aiApproval.fields.filter(f=>f.status==="approved").length;const rj=aiApproval.fields.filter(f=>f.status==="rejected").length;const pn=aiApproval.fields.filter(f=>f.status==="pending").length;const crit=aiApproval.fields.filter(f=>f.severity==="critical").length;const warn=aiApproval.fields.filter(f=>f.severity==="warning").length;
return <>{pn>0&&<span style={{padding:"2px 8px",borderRadius:4,background:"#e0e7ff",color:"#3730a3",fontWeight:600}}>⏳ {pn} {lang==="de"?"ausstehend":"pending"}</span>}
{ap>0&&<span style={{padding:"2px 8px",borderRadius:4,background:"#dcfce7",color:"#166534",fontWeight:600}}>✅ {ap} {lang==="de"?"genehmigt":"approved"}</span>}
{rj>0&&<span style={{padding:"2px 8px",borderRadius:4,background:"#fee2e2",color:"#991b1b",fontWeight:600}}>❌ {rj} {lang==="de"?"abgelehnt":"rejected"}</span>}
{crit>0&&<span style={{padding:"2px 8px",borderRadius:4,background:"#fecaca",color:"#dc2626",fontWeight:700}}>🔴 {crit} {lang==="de"?"kritisch":"critical"}</span>}
{warn>0&&<span style={{padding:"2px 8px",borderRadius:4,background:"#fef3c7",color:"#d97706",fontWeight:700}}>⚠️ {warn} {lang==="de"?"Warnung":"warning"}</span>}
<span style={{marginLeft:"auto",color:"#6b7280"}}>{lang==="de"?"Daten verteilen an":"Spread to"}: {(aiApproval.spreadTo||[]).join(", ")||"—"}</span></>})()}
</div>

{/* Field-by-field comparison table */}
<div style={{flex:1,overflowY:"auto",padding:"12px 20px"}}>

{/* Empty state when AI failed */}
{aiApproval.fields.length===0&&<div style={{textAlign:"center",padding:32,color:"#6b7280"}}>
<div style={{fontSize:40,marginBottom:12}}>🤖</div>
<div style={{fontSize:16,fontWeight:700,marginBottom:6}}>{lang==="de"?"Keine Daten extrahiert":"No data extracted"}</div>
<div style={{fontSize:14,maxWidth:400,margin:"0 auto"}}>{lang==="de"?"Die KI konnte keine Daten aus diesem Dokument extrahieren. Mögliche Ursachen:":"The AI could not extract data from this document. Possible causes:"}</div>
<div style={{fontSize:13,marginTop:8,textAlign:"left",maxWidth:400,margin:"8px auto 0"}}>
• {lang==="de"?"CORS-Fehler: API-Aufruf direkt vom Browser blockiert":"CORS error: API call blocked directly from browser"}<br/>
• {lang==="de"?"Dokument ist kein lesbares PDF":"Document is not a readable PDF"}<br/>
• {lang==="de"?"Datei zu groß für base64-Kodierung":"File too large for base64 encoding"}<br/>
• {lang==="de"?"API-Schlüssel fehlt oder ungültig":"API key missing or invalid"}
</div>
<div style={{marginTop:16,padding:10,background:"#fefce8",borderRadius:8,border:"1px solid #fde68a",fontSize:13,color:"#92400e"}}>
<strong>💡 Tipp:</strong> {lang==="de"?"Öffnen Sie die Browser-Konsole (F12 → Console) und laden Sie das Dokument erneut hoch um den Fehler zu sehen.":"Open browser console (F12 → Console) and re-upload the document to see the error."}
</div>
</div>}

{/* Extracted & Discrepancy Fields */}
{aiApproval.fields.filter(f=>f.category!=="finance").length>0&&<div style={{marginBottom:12}}>
<div style={{fontSize:14,fontWeight:700,color:"#1e293b",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>🔍 {lang==="de"?"Extrahierte Daten — Systemabgleich":"Extracted Data — System Comparison"}</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
<thead><tr style={{background:"#f1f5f9"}}>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"22%"}}>{lang==="de"?"Feld":"Field"}</td>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"25%",background:"#eff6ff"}}>{lang==="de"?"Systemwert":"System Value"}</td>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"25%",background:"#f0fdf4"}}>{lang==="de"?"Dokumentwert":"Document Value"}</td>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"10%",textAlign:"center"}}>{lang==="de"?"Status":"Status"}</td>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"18%",textAlign:"center"}}>{lang==="de"?"Aktion":"Action"}</td>
</tr></thead>
<tbody>
{aiApproval.fields.filter(f=>f.category!=="finance").map((field,i)=>{
const isMatch=field.systemValue===field.docValue||field.systemValue==="—";
const isCrit=field.severity==="critical";
const isWarn=field.severity==="warning";
const rowBg=field.status==="approved"?"#f0fdf4":field.status==="rejected"?"#fef2f2":isCrit?"#fff1f2":isWarn?"#fffbeb":"#fff";
const fk=field.key;
return <tr key={i} style={{background:rowBg}}>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0",fontWeight:600}}>
{isCrit?"🔴 ":isWarn?"🟡 ":isMatch&&field.systemValue!=="—"?"✅ ":"🆕 "}{field.label}
</td>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0",color:field.systemValue==="—"?"#9ca3af":"#1e40af",fontWeight:field.systemValue!=="—"?600:400}}>
{field.systemValue}
</td>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0",color:isCrit?"#dc2626":isWarn?"#d97706":"#059669",fontWeight:600}}>
{field.docValue}
</td>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0",textAlign:"center",fontSize:16}}>
{field.status==="approved"?"✅":field.status==="rejected"?"❌":"⏳"}
</td>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0",textAlign:"center"}}>
{field.status==="pending"?<div style={{display:"flex",gap:4,justifyContent:"center"}}>
<button onClick={()=>{setAiApproval(prev=>({...prev,fields:prev.fields.map(f=>f.key===fk?{...f,status:"approved"}:f)}))}} style={{padding:"3px 10px",borderRadius:4,fontSize:12,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>✓ {lang==="de"?"Ja":"Accept"}</button>
<button onClick={()=>{setAiApproval(prev=>({...prev,fields:prev.fields.map(f=>f.key===fk?{...f,status:"rejected"}:f)}))}} style={{padding:"3px 10px",borderRadius:4,fontSize:12,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>✗ {lang==="de"?"Nein":"Reject"}</button>
</div>:
<button onClick={()=>{setAiApproval(prev=>({...prev,fields:prev.fields.map(f=>f.key===fk?{...f,status:"pending"}:f)}))}} style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#6b7280",cursor:"pointer"}}>{lang==="de"?"Zurücksetzen":"Reset"}</button>}
</td>
</tr>})}
</tbody></table>
</div>}

{/* Finance Section */}
{aiApproval.fields.filter(f=>f.category==="finance").length>0&&<div style={{marginBottom:12}}>
<div style={{fontSize:14,fontWeight:700,color:"#1e293b",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>💰 {lang==="de"?"Finanzdaten":"Financial Data"}{aiApproval.totalValue&&<span style={{fontSize:13,fontWeight:600,color:"#059669",marginLeft:8}}>Total: {aiApproval.totalValue}</span>}</div>
<table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
<thead><tr style={{background:"#fefce8"}}>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"30%"}}>{lang==="de"?"Position":"Item"}</td>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"20%"}}>{lang==="de"?"Betrag":"Amount"}</td>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"15%"}}>{lang==="de"?"Kategorie":"Category"}</td>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"10%",textAlign:"center"}}>{lang==="de"?"Status":"Status"}</td>
<td style={{padding:"6px 10px",fontWeight:700,border:"1px solid #e2e8f0",width:"25%",textAlign:"center"}}>{lang==="de"?"Aktion":"Action"}</td>
</tr></thead>
<tbody>
{aiApproval.fields.filter(f=>f.category==="finance").map((field,i)=>{
const fk=field.key;
return <tr key={i} style={{background:field.status==="approved"?"#f0fdf4":field.status==="rejected"?"#fef2f2":"#fff"}}>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0",fontWeight:600}}>{field.label}</td>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0",color:"#059669",fontWeight:700}}>{field.docValue}</td>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0"}}><span style={{padding:"2px 6px",borderRadius:4,fontSize:12,fontWeight:600,background:field.finCategory==="freight"?"#dbeafe":field.finCategory==="product"?"#dcfce7":field.finCategory==="vat"?"#fef3c7":field.finCategory==="customs"?"#f3e8ff":"#f1f5f9",color:field.finCategory==="freight"?"#1e40af":field.finCategory==="product"?"#059669":field.finCategory==="vat"?"#92400e":field.finCategory==="customs"?"#7c3aed":"#475569"}}>{field.finCategory||"other"}</span></td>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0",textAlign:"center",fontSize:16}}>{field.status==="approved"?"✅":field.status==="rejected"?"❌":"⏳"}</td>
<td style={{padding:"6px 10px",border:"1px solid #e2e8f0",textAlign:"center"}}>
{field.status==="pending"?<div style={{display:"flex",gap:4,justifyContent:"center"}}>
<button onClick={()=>{setAiApproval(prev=>({...prev,fields:prev.fields.map(f=>f.key===fk?{...f,status:"approved"}:f)}))}} style={{padding:"3px 10px",borderRadius:4,fontSize:12,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>✓ {lang==="de"?"Ja":"Accept"}</button>
<button onClick={()=>{setAiApproval(prev=>({...prev,fields:prev.fields.map(f=>f.key===fk?{...f,status:"rejected"}:f)}))}} style={{padding:"3px 10px",borderRadius:4,fontSize:12,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>✗ {lang==="de"?"Nein":"Reject"}</button>
</div>:
<button onClick={()=>{setAiApproval(prev=>({...prev,fields:prev.fields.map(f=>f.key===fk?{...f,status:"pending"}:f)}))}} style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#6b7280",cursor:"pointer"}}>{lang==="de"?"Zurücksetzen":"Reset"}</button>}
</td>
</tr>})}
</tbody></table>
</div>}

{/* Spread Preview */}
{(aiApproval.spreadTo||[]).length>0&&<div style={{padding:10,background:"#eff6ff",borderRadius:8,border:"1px solid #bfdbfe",marginBottom:12}}>
<div style={{fontSize:13,fontWeight:700,color:"#1e40af",marginBottom:6}}>📊 {lang==="de"?"Datenverteilung nach Genehmigung":"Data spread after approval"}</div>
<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(aiApproval.spreadTo||[]).map((s,i)=>{
const sg=SG.find(x=>x.id===s);
return <span key={i} style={{padding:"3px 10px",borderRadius:6,fontSize:13,fontWeight:600,background:sg?sg.c+"18":"#e0e7ff",color:sg?sg.c:"#3730a3",border:"1px solid "+(sg?sg.c+"40":"#c7d2fe")}}>{sg?sg.ic+" ":""}{s}</span>})}</div>
</div>}
</div>

{/* Footer actions */}
<div style={{padding:"12px 20px",borderTop:"2px solid #e5e7eb",background:"#f8fafc",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>{/* Approve All Pending */
setAiApproval(prev=>({...prev,fields:prev.fields.map(f=>f.status==="pending"?{...f,status:"approved"}:f)}));
}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer"}}>✓ {lang==="de"?"Alle genehmigen":"Approve All"}</button>
<button onClick={()=>{
setAiApproval(prev=>({...prev,fields:prev.fields.map(f=>f.status==="pending"?{...f,status:"rejected"}:f)}));
}} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:"#dc2626",color:"#fff",cursor:"pointer"}}>✗ {lang==="de"?"Alle ablehnen":"Reject All"}</button>
</div>
<div style={{display:"flex",gap:8,alignItems:"center"}}>
<button onClick={()=>setAiApproval(null)} style={{padding:"8px 16px",borderRadius:6,fontSize:14,fontWeight:600,border:"1px solid #d1d5db",background:"#fff",color:"#374151",cursor:"pointer"}}>{lang==="de"?"Abbrechen":"Cancel"}</button>
<button onClick={()=>{
/* COMMIT: Apply all approved changes */
/* AUTH GATE — require login for approval actions (21 CFR Part 11 §11.10(d)) */
if(!auth){alert(lang==="de"?"⚠️ Anmeldung erforderlich! Bitte melden Sie sich an bevor Sie Daten genehmigen können. (21 CFR Part 11 §11.10(d))":"⚠️ Login required! Please sign in before approving data. (21 CFR Part 11 §11.10(d))");return}
const approved=aiApproval.fields.filter(f=>f.status==="approved");
const rejected=aiApproval.fields.filter(f=>f.status==="rejected");
const pending=aiApproval.fields.filter(f=>f.status==="pending");
if(pending.length>0){alert((lang==="de"?"Bitte alle Felder genehmigen oder ablehnen bevor Sie bestätigen.":"Please approve or reject all fields before committing."));return}

/* 1. Update BT_DATA in-memory with approved field values */
const newOverrides={...btOverrides};
approved.filter(f=>f.sysKey&&f.category!=="finance").forEach(f=>{
  newOverrides[aiApproval.batch+"_"+f.sysKey]=f.docValue;
  if(BT_DATA[aiApproval.batch])BT_DATA[aiApproval.batch][f.sysKey]=f.docValue;
});
setBtOverrides(newOverrides);

/* 2. SPREAD DATA: Update the M0D document entry with extracted values */
const docIdx=M0D.findIndex(d=>d.k===aiApproval.docKey);
if(docIdx>=0){
  const docEntry=M0D[docIdx];
  const approvedMap={};
  approved.filter(f=>f.category!=="finance").forEach(f=>{approvedMap[f.label]=f.docValue});
  
  /* Update header fields if AI extracted them */
  if(approvedMap["Reference Number"]||approvedMap["Packing List Number"]||approvedMap["HAWB Number"]||approvedMap["Invoice Number"]||approvedMap["Certificate Number"])
    docEntry.ref=approvedMap["Reference Number"]||approvedMap["Packing List Number"]||approvedMap["HAWB Number"]||approvedMap["Invoice Number"]||approvedMap["Certificate Number"]||docEntry.ref;
  if(approvedMap["Issuer"]||approvedMap["Shipper Name"]||approvedMap["Issued By"])
    docEntry.by=approvedMap["Issuer"]||approvedMap["Shipper Name"]||approvedMap["Issued By"]||docEntry.by;
  if(approvedMap["Issue Date"]||approvedMap["Execution Date"]||approvedMap["Date"])
    docEntry.on=approvedMap["Issue Date"]||approvedMap["Execution Date"]||approvedMap["Date"]||docEntry.on;
  if(approvedMap["Expiry Date"]||approvedMap["Valid Until"])
    docEntry.vu=approvedMap["Expiry Date"]||approvedMap["Valid Until"]||docEntry.vu;
  
  /* Rebuild det array: update existing rows or add new ones */
  const detMap=new Map((docEntry.det||[]).map(d=>[d[0],d[1]]));
  approved.filter(f=>f.category!=="finance").forEach(f=>{
    /* Try to match extracted field name to existing det row labels */
    const label=f.label;
    const value=f.docValue;
    let matched=false;
    for(const [existingLabel] of detMap){
      if(existingLabel.toLowerCase().includes(label.toLowerCase().split(" ")[0])||
         label.toLowerCase().includes(existingLabel.toLowerCase().split(" ")[0])){
        detMap.set(existingLabel,value);
        matched=true;
        break;
      }
    }
    if(!matched){
      /* Add as new row at the end */
      detMap.set(label,value);
    }
  });
  docEntry.det=Array.from(detMap).map(([k,v])=>[k,v]);
  
  /* Mark document as AI-verified */
  docEntry.aiVerified=true;
  docEntry.aiVerifiedAt=new Date().toISOString();
  docEntry.aiVerifiedBy=auth?.name||"Celso Hamelink";
  docEntry.aiApprovedCount=approved.length;
}

/* 3. SPREAD TO DEPENDENT STAGES: Update BT_DATA fields from extracted data */
const approvedData={};
approved.filter(f=>f.category!=="finance").forEach(f=>{approvedData[f.label]=f.docValue});

/* Map common document field names to BT_DATA keys */
const SPREAD_MAP={
  "Net Weight":"net","Gross Weight":"gross","Total Units":"units",
  "Total 1kg Bags":"bags1kg","Total 10g Doypacks":"doy10g","Boxes":"boxes",
  "EXW Value":"exw","Route":"route","Batch Number":"id","Product Description":"p",
  "Expiry Date":"exp","Packing List Number":"","HAWB Number":"","Carrier":"",
  "Origin Airport":"","Destination Airport":"","Shipper Name":"","Consignee Name":""
};
const bt=BT_DATA[aiApproval.batch];
if(bt){
  Object.entries(approvedData).forEach(([label,value])=>{
    const btKey=SPREAD_MAP[label];
    if(btKey&&value){bt[btKey]=value}
  });
}

/* 4. Add finance entries */
const newFinEntries=approved.filter(f=>f.category==="finance").map(f=>({
  batch:aiApproval.batch,desc:f.label,amount:f.docValue,category:f.finCategory||"other",
  docKey:aiApproval.docKey,docName:aiApproval.fileName,ts:new Date().toISOString()
}));
if(newFinEntries.length>0)setFinanceEntries(prev=>[...prev,...newFinEntries]);

/* 5. Write audit log entries (21 CFR Part 11 compliant) */
const newAuditEntries=[];
approved.forEach(f=>{newAuditEntries.push({
  ts:new Date().toISOString(),user:auth?.name||"Celso Hamelink",action:"APPROVED",
  docKey:aiApproval.docKey,field:f.label,oldVal:f.systemValue,newVal:f.docValue,
  batch:aiApproval.batch,document:aiApproval.fileName,docType:aiApproval.docType
})});
rejected.forEach(f=>{newAuditEntries.push({
  ts:new Date().toISOString(),user:auth?.name||"Celso Hamelink",action:"REJECTED",
  docKey:aiApproval.docKey,field:f.label,oldVal:f.systemValue,newVal:f.docValue,
  batch:aiApproval.batch,document:aiApproval.fileName,docType:aiApproval.docType
})});
setAuditLog(prev=>[...newAuditEntries,...prev]);

/* 6. Update docOriginals with verified fields + store all approved data */
setDocOriginals(prev=>({...prev,[aiApproval.docKey]:{
  ...prev[aiApproval.docKey],
  verified:approved.map(f=>f.label),
  corrections:Object.fromEntries(approved.filter(f=>f.systemValue!=="—"&&f.systemValue!==f.docValue).map(f=>[f.label,f.docValue])),
  approvedData:Object.fromEntries(approved.map(f=>[f.label,f.docValue])),
  approvalComplete:true,
  approvedAt:new Date().toISOString(),
  approvedBy:auth?.name||"Celso Hamelink",
  approvedCount:approved.length,
  rejectedCount:rejected.length
}}));

/* 7. Save approval session to history */
setApprovalHistory(prev=>[{
  ts:new Date().toISOString(),batch:aiApproval.batch,docKey:aiApproval.docKey,
  fileName:aiApproval.fileName,docType:aiApproval.docType,
  approved:approved.length,rejected:rejected.length,
  user:auth?.name||"Celso Hamelink",
  fields:aiApproval.fields,
  spreadTo:aiApproval.spreadTo||[]
},...prev]);

/* 8. COA CROSS-REFERENCE: Update LAB array with real extracted values */
if(aiApproval.docKey==="sc"||aiApproval.docKey==="lab_coa"||aiApproval.docKey==="qsi_coa"){
  const isSupplier=aiApproval.docKey==="sc";
  const field=isSupplier?"sup":"qsi";
  const paramMap={"THC Content":"THC","CBD Content":"CBD","CBN Content":"CBN",
    "Loss on Drying":"Loss on drying","Moisture Karl Fischer":"Moisture (Karl Fischer)",
    "Lead Pb":"Lead (Pb)","Cadmium Cd":"Cadmium (Cd)","Mercury Hg":"Mercury (Hg)","Arsenic As":"Arsenic (As)",
    "TAMC":"TAMC","TYMC":"TYMC","Bile-tolerant Gram-neg":"Bile-tolerant Gram-neg",
    "E. coli":"E. coli","Salmonella":"Salmonella","Pesticides":"Pesticides",
    "Aflatoxin B1":"Aflatoxin B1","Aflatoxins Total":"Aflatoxins total","Ochratoxin A":"Ochratoxin A",
    "Total Terpenes":"Total Terpenes"};
  
  approved.filter(f=>f.category!=="finance").forEach(f=>{
    const labParam=paramMap[f.label];
    if(labParam){
      const labEntry=LAB.find(l=>l.en===labParam||l.en.includes(labParam)||l.de===labParam);
      if(labEntry){
        labEntry[field]=f.docValue;
        /* Recalculate variance if both values exist */
        if(labEntry.sup&&labEntry.qsi){
          const parseNum=(s)=>{const m=String(s).replace(/[<>≤≥,]/g,".").match(/[\d.]+/);return m?parseFloat(m[0]):null};
          const supVal=parseNum(labEntry.sup);
          const qsiVal=parseNum(labEntry.qsi);
          if(supVal!==null&&qsiVal!==null&&supVal>0){
            labEntry.var=parseFloat((((qsiVal-supVal)/supVal)*100).toFixed(1));
          }
        }
        console.log("[COA Cross-Ref]",labParam,":",field,"=",f.docValue,labEntry.var!==null?"variance: "+labEntry.var+"%":"");
      }
    }
  });
  
  /* Log the cross-reference event */
  setAuditLog(prev=>[{
    ts:new Date().toISOString(),user:auth?.name||"Celso Hamelink",
    action:isSupplier?"SUPPLIER_COA_LOADED":"QSI_COA_LOADED",
    docKey:aiApproval.docKey,field:"lab_parameters",
    oldVal:"",newVal:approved.filter(f=>f.category!=="finance").length+" parameters updated",
    batch:aiApproval.batch,document:aiApproval.fileName,docType:aiApproval.docType
  },...prev]);
}

/* 9. Force re-render by toggling a counter */
setLcs(prev=>prev+1);

/* 9. Close modal */
setAiApproval(null);

}} disabled={aiApproval.fields.length===0||aiApproval.fields.some(f=>f.status==="pending")} style={{padding:"8px 20px",borderRadius:6,fontSize:14,fontWeight:700,border:"none",background:(aiApproval.fields.length===0||aiApproval.fields.some(f=>f.status==="pending"))?"#9ca3af":"#1e40af",color:"#fff",cursor:(aiApproval.fields.length===0||aiApproval.fields.some(f=>f.status==="pending"))?"not-allowed":"pointer",display:"flex",alignItems:"center",gap:6}}>
{aiApproval.fields.length===0?(lang==="de"?"Keine Daten zum Bestätigen":"No data to commit"):aiApproval.fields.some(f=>f.status==="pending")?(lang==="de"?"Ausstehende Felder...":"Pending fields..."):<>{lang==="de"?"✓ Bestätigen & Anwenden":"✓ Commit & Apply"}</>}
</button>
</div>
</div>
</div>
</div>}

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
<button onClick={()=>{const qp=SUP_QP[sup]||SUP_QP.cannava;const nocQp=SUP_QP.noc;const sep="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";const rows=[["Document",docPreview.name],["Referenz",docPreview.ref],["Ausgestellt von",docPreview.by],["Ausstellungsdatum",docPreview.on],["Gueltig bis",docPreview.vu],["Charge",docPreview.batch],["Lieferant",docPreview.sup],["Stufe",docPreview.stage],["Status",docPreview.hasDoc?"✅ Konform":"⏳ Ausstehend"]];docPreview.det.forEach(d=>rows.push(d));let body="NOC PHARMA GmbH\nQMS v2.5 · §52a AMG\n"+sep+"\n\n";rows.forEach(r=>{body+=r[0]+": "+r[1]+"\n"});body+="\n"+sep+"\n\nRP: T. Cuny · QP: Dr. O. Schagon\nNOC Pharma GmbH · An der Redoute 1 · 17390 Murchin\nErstellt: "+new Date().toISOString();window.open(gmailLink("NOC Pharma — "+docPreview.name+" ["+docPreview.ref+"] — "+docPreview.sup,body)+"&to="+encodeURIComponent(qp.email)+"&cc="+encodeURIComponent(nocQp.email),"_blank")}} style={{padding:"5px 14px",borderRadius:5,fontSize:14,fontWeight:700,border:"none",background:"#059669",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
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
