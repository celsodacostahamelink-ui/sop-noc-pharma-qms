"use client";
import { useState, useRef, useCallback, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════
// NOC PHARMA — SOP INTELLIGENCE PANEL
// 5-Agent System: Master QP · Document · Regulatory · Audit · Training
// ═══════════════════════════════════════════════════════════════

interface SOPEntry {
  id: string;
  title: string;
  series: string;
}

interface UploadedSOP {
  sopId: string;
  sopTitle: string;
  fileName: string;
  size: number;
  uploadedAt: string;
  blobUrl?: string;
  extractedText?: string;
  // AI results
  analysis?: any;
  newVersion?: string;
  comparison?: any;
  approved?: boolean;
  filed?: boolean;
  // Audit trail
  auditTrail?: AuditEntry[];
  // State
  status: "uploaded" | "analysing" | "analysed" | "generating" | "generated" | "comparing" | "compared" | "approved" | "filed";
}

interface AuditEntry {
  timestamp: string;
  action: string;
  user: string;
  role: string;
  details: string;
  hash: string;
}

// ALL 305 SOP IDs for matching
const ALL_SOP_IDS: SOPEntry[] = [
  {id:"SOP",title:"Umgang mit Qualitaetsproblemen Cannabis API",series:"legacy"},
  {id:"B.1",title:"Organigramm",series:"legacy"},
  {id:"SOP-RRM",title:"Verwaltung Rueckstell-/Referenzmuster Cannabis",series:"legacy"},
  {id:"SOP-100_A6",title:"Ablaufdiagramm Q-Prozesse Dokumente",series:"legacy"},
  {id:"SOP-101-02",title:"Ueberpruefung Chargendokumentation",series:"legacy"},
  {id:"SOP-605",title:"Vernichtung Ausgangsstoffe AM",series:"legacy"},
  {id:"SOP-605_A1",title:"Anhang zu SOP-605",series:"legacy"},
  {id:"SOP-605_A2",title:"Anhang zu SOP-605",series:"legacy"},
  {id:"SOP-605_A3",title:"Anhang zu SOP-605",series:"legacy"},
  {id:"SOP-605_A4",title:"Anhang zu SOP-605",series:"legacy"},
  {id:"SOP-100_01",title:"Qualitaetsmanagement",series:"legacy"},
  {id:"SOP-100_A1",title:"Aenderungshistorie",series:"legacy"},
  {id:"SOP-100_A2-01",title:"Verteiler/Schulungsnachweis",series:"legacy"},
  {id:"SOP-101_A1-02",title:"Anhang SOP-101",series:"legacy"},
  {id:"SOP-101_A2-02",title:"Anhang SOP-101",series:"legacy"},
  {id:"SOP-101_A3",title:"Anhang SOP-101",series:"legacy"},
  {id:"SOP-102_01",title:"Lieferantenqualifizierung",series:"legacy"},
  {id:"SOP-103_01",title:"Qualitaetsrisikomanagement",series:"legacy"},
  {id:"SOP-104_01",title:"Abweichungen",series:"legacy"},
  {id:"SOP-105_01",title:"CAPA",series:"legacy"},
  {id:"SOP-106_01",title:"Audits",series:"legacy"},
  {id:"SOP-109_01",title:"Beanstandungen",series:"legacy"},
  {id:"SOP-110_01",title:"Produktrueckruf",series:"legacy"},
  {id:"SOP-130",title:"Umgang mit Faelschungen",series:"legacy"},
  {id:"SOP-604-02",title:"BtM-Dokumentation",series:"legacy"},
  {id:"SOP-640_01",title:"BtM-Sicherheit",series:"legacy"},
  {id:"SOP-700",title:"Transport",series:"legacy"},
  {id:"SOP-702",title:"Transport Qualifizierung",series:"legacy"},
  {id:"SOP-703",title:"Temperaturmonitoring",series:"legacy"},
  {id:"SOP-706",title:"Kundenverifikation",series:"legacy"},
  {id:"SOP-710_01",title:"GDP Grosshandel",series:"legacy"},
  {id:"SOP-770",title:"Retouren",series:"legacy"},
  {id:"SOP-780",title:"Faelschungsschutz",series:"legacy"},
  // QMS Series
  {id:"SOP-QMS-001",title:"Pharmazeutisches Qualitaetssystem",series:"QMS"},
  {id:"SOP-QMS-002",title:"Dokumentenlenkung",series:"QMS"},
  {id:"SOP-QMS-003",title:"Abweichungsmanagement",series:"QMS"},
  {id:"SOP-QMS-004",title:"CAPA-Verfahren",series:"QMS"},
  {id:"SOP-QMS-005",title:"Aenderungskontrolle",series:"QMS"},
  {id:"SOP-QMS-006",title:"Interne Audits",series:"QMS"},
  {id:"SOP-QMS-007",title:"Management Review",series:"QMS"},
  {id:"SOP-QMS-008",title:"Reklamationsbearbeitung",series:"QMS"},
  {id:"SOP-QMS-009",title:"Rueckrufverfahren",series:"QMS"},
  {id:"SOP-QMS-010",title:"Lieferantenqualifizierung",series:"QMS"},
  {id:"SOP-QMS-011",title:"Vertragsherstellung",series:"QMS"},
  {id:"SOP-QMS-012",title:"Risikomanagement",series:"QMS"},
  // PER Series
  {id:"SOP-PER-001",title:"Personalqualifikation & Schulung",series:"PER"},
  {id:"SOP-PER-002",title:"Sachkundige Person (QP)",series:"PER"},
  {id:"SOP-PER-003",title:"Herstellungsleitung",series:"PER"},
  {id:"SOP-PER-004",title:"Kontrollleitung",series:"PER"},
  {id:"SOP-PER-005",title:"Hygiene Personal",series:"PER"},
  {id:"SOP-PER-006",title:"Gesundheitsuntersuchungen",series:"PER"},
  // MFG Series
  {id:"SOP-MFG-001",title:"Herstellungsanweisung Allgemein",series:"MFG"},
  {id:"SOP-MFG-002",title:"Wareneingang & Probenahme",series:"MFG"},
  {id:"SOP-MFG-003",title:"Primaerverpackung",series:"MFG"},
  {id:"SOP-MFG-004",title:"Sekundaerverpackung & Kennzeichnung",series:"MFG"},
  {id:"SOP-MFG-005",title:"Chargenfreigabe",series:"MFG"},
  {id:"SOP-MFG-006",title:"Einfuhrverfahren Arzneimittel",series:"MFG"},
  {id:"SOP-MFG-007",title:"Inprozesskontrollen",series:"MFG"},
  {id:"SOP-MFG-008",title:"Reinigungsvalidierung",series:"MFG"},
  {id:"SOP-MFG-009",title:"Prozessvalidierung",series:"MFG"},
  {id:"SOP-MFG-010",title:"Umgebungsmonitoring",series:"MFG"},
  // DOC Series
  {id:"SOP-DOC-001",title:"Chargendokumentation",series:"DOC"},
  {id:"SOP-DOC-002",title:"Archivierung & Aufbewahrung",series:"DOC"},
  {id:"SOP-DOC-003",title:"Elektronische Aufzeichnungen",series:"DOC"},
  {id:"SOP-DOC-004",title:"Elektronische Signaturen",series:"DOC"},
  {id:"SOP-DOC-005",title:"Site Master File Pflege",series:"DOC"},
  // GDP Series
  {id:"SOP-GDP-001",title:"Lagerhaltung & Lagerbedingungen",series:"GDP"},
  {id:"SOP-GDP-002",title:"Temperaturmonitoring",series:"GDP"},
  {id:"SOP-GDP-003",title:"Transport & Distribution",series:"GDP"},
  {id:"SOP-GDP-004",title:"Qualifizierung Transportwege",series:"GDP"},
  {id:"SOP-GDP-005",title:"Retouren & Faelschungsverdacht",series:"GDP"},
  // BTM Series
  {id:"SOP-BTM-001",title:"BtM-Verkehr & Dokumentation",series:"BTM"},
  {id:"SOP-BTM-002",title:"BtM-Einfuhr & Ausfuhr",series:"BTM"},
  {id:"SOP-BTM-003",title:"BtM-Bestandsfuehrung",series:"BTM"},
  {id:"SOP-BTM-004",title:"Vernichtung von Betaeubungsmitteln",series:"BTM"},
  {id:"SOP-BTM-005",title:"Sicherheitsmassnahmen BtM-Lager",series:"BTM"},
  {id:"SOP-BTM-006",title:"Cannabis-spezifische Herstellung",series:"BTM"},
  {id:"SOP-BTM-007",title:"Cannabisblueten Verarbeitung",series:"BTM"},
  {id:"SOP-BTM-008",title:"Cannabis Extrakt Herstellung",series:"BTM"},
  // CS Series
  {id:"SOP-CS-001",title:"Computerized Systems Validation",series:"CS"},
  {id:"SOP-CS-002",title:"Zugangssteuerung & Benutzer",series:"CS"},
  {id:"SOP-CS-003",title:"Datensicherung & Wiederherstellung",series:"CS"},
  {id:"SOP-CS-004",title:"Audit Trail Verfahren",series:"CS"},
  {id:"SOP-CS-005",title:"KI-System Risikobewertung",series:"CS"},
  {id:"SOP-CS-006",title:"KI-System Governance",series:"CS"},
  {id:"SOP-CS-007",title:"KI-Datenqualitaetsmanagement",series:"CS"},
  {id:"SOP-CS-008",title:"KI-Transparenz & Dokumentation",series:"CS"},
  {id:"SOP-CS-009",title:"KI-Menschliche Aufsicht",series:"CS"},
  // QC Series
  {id:"SOP-QC-001",title:"Pruefanweisungen Allgemein",series:"QC"},
  {id:"SOP-QC-002",title:"Stabilitaetspruefungen",series:"QC"},
  {id:"SOP-QC-003",title:"Referenzstandards & Rueckstellmuster",series:"QC"},
  {id:"SOP-QC-004",title:"OOS/OOT Untersuchungen",series:"QC"},
  {id:"SOP-QC-005",title:"Pruefmethodenvalidierung",series:"QC"},
  {id:"SOP-QC-006",title:"Cannabis Identitaets-Gehaltspruefung",series:"QC"},
  // EQ Series
  {id:"SOP-EQ-001",title:"Qualifizierung Raeume & Ausruestung",series:"EQ"},
  {id:"SOP-EQ-002",title:"Kalibrierung Messmittel",series:"EQ"},
  {id:"SOP-EQ-003",title:"Wartung & Instandhaltung",series:"EQ"},
  {id:"SOP-EQ-004",title:"Reinheitszonenkonzept",series:"EQ"},
  {id:"SOP-EQ-005",title:"Wasseraufbereitung pharma Qualitaet",series:"EQ"},
  // AI Series
  {id:"SOP-AI-01",title:"Automated QC & Human Override",series:"AI"},
  {id:"SOP-AI-02",title:"HITL Digital Signature",series:"AI"},
  {id:"SOP-AI-03",title:"AI Bias & Data Governance",series:"AI"},
  {id:"SOP-AI-04",title:"AI Transparency",series:"AI"},
  {id:"SOP-AI-05",title:"High-Risk AI Lifecycle",series:"AI"},
  {id:"SOP-AI-06",title:"Monthly Model Review",series:"AI"},
  {id:"SOP-AI-07",title:"Digital Recall",series:"AI"},
  {id:"SOP-AI-08",title:"CE Marking",series:"AI"},
  {id:"SOP-AI-09",title:"AI Inventory AnnexIII",series:"AI"},
  {id:"SOP-AI-10",title:"AI Log 10yr Retention",series:"AI"},
  {id:"SOP-AI-11",title:"COA Hallucination Check",series:"AI"},
];

const SERIES_COLORS: Record<string, string> = {
  legacy:"#6366f1", QMS:"#0d47a1", BTM:"#dc2626", AI:"#7c3aed",
  CS:"#0891b2", MFG:"#d97706", GDP:"#059669", QC:"#db2777",
  PER:"#2563eb", DOC:"#16a34a", EQ:"#9333ea",
};

const CSS = `
* { box-sizing: border-box; }
.sip { font-family: 'Segoe UI', system-ui, sans-serif; background: #0f172a; min-height: 100vh; color: #e2e8f0; }
.sip-header { background: linear-gradient(135deg, #0d47a1 0%, #1565c0 40%, #0891b2 100%); padding: 20px 28px; display: flex; align-items: center; gap: 16px; border-bottom: 1px solid #1e3a8a; }
.sip-header h1 { margin: 0; font-size: 18px; font-weight: 900; letter-spacing: -0.5px; }
.sip-header p { margin: 4px 0 0; font-size: 11px; opacity: 0.8; }
.sip-agents { display: flex; gap: 8px; padding: 12px 28px; background: #1e293b; border-bottom: 1px solid #334155; flex-wrap: wrap; }
.agent-pill { padding: 4px 12px; border-radius: 99px; font-size: 11px; font-weight: 700; border: 1px solid; }
.sip-body { display: grid; grid-template-columns: 340px 1fr; min-height: calc(100vh - 120px); }
.sip-left { background: #1e293b; border-right: 1px solid #334155; display: flex; flex-direction: column; }
.sip-left-header { padding: 16px; border-bottom: 1px solid #334155; }
.sip-left-header h2 { margin: 0 0 10px; font-size: 13px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
.drop-zone { border: 2px dashed #334155; border-radius: 10px; padding: 24px; text-align: center; cursor: pointer; transition: all 0.2s; background: #0f172a; }
.drop-zone:hover, .drop-zone.over { border-color: #3b82f6; background: #1e3a8a22; }
.drop-zone h3 { margin: 8px 0 4px; font-size: 14px; color: #e2e8f0; }
.drop-zone p { margin: 0; font-size: 11px; color: #64748b; }
.sip-stats { display: flex; gap: 8px; padding: 12px 16px; border-bottom: 1px solid #334155; flex-wrap: wrap; }
.stat { flex: 1; min-width: 60px; text-align: center; background: #0f172a; border-radius: 8px; padding: 8px; }
.stat-n { font-size: 20px; font-weight: 900; }
.stat-l { font-size: 10px; color: #64748b; margin-top: 2px; }
.sop-list { flex: 1; overflow-y: auto; }
.sop-row { padding: 10px 16px; border-bottom: 1px solid #1e293b; cursor: pointer; transition: background 0.15s; display: flex; align-items: center; gap: 8px; }
.sop-row:hover { background: #334155; }
.sop-row.selected { background: #1e3a8a; }
.sop-row.has-file { border-left: 3px solid #22c55e; }
.sop-row.urgent { border-left: 3px solid #ef4444; }
.sop-row.needs-update { border-left: 3px solid #f59e0b; }
.sop-row.approved { border-left: 3px solid #3b82f6; }
.sop-series { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.sop-row-name { flex: 1; min-width: 0; }
.sop-row-id { font-size: 10px; font-weight: 700; color: #94a3b8; }
.sop-row-title { font-size: 12px; color: #e2e8f0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sop-row-badge { font-size: 10px; flex-shrink: 0; }
.sip-right { display: flex; flex-direction: column; background: #0f172a; }
.sip-right-header { padding: 16px 20px; border-bottom: 1px solid #1e293b; display: flex; align-items: center; gap: 12px; }
.sip-right-header h2 { margin: 0; font-size: 15px; font-weight: 800; color: #e2e8f0; }
.sip-right-body { flex: 1; overflow-y: auto; padding: 20px; }
.btn { padding: 8px 16px; border-radius: 7px; border: none; cursor: pointer; font-size: 12px; font-weight: 700; transition: all 0.15s; white-space: nowrap; }
.btn:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-blue { background: #1d4ed8; color: white; }
.btn-blue:hover:not(:disabled) { background: #2563eb; }
.btn-green { background: #15803d; color: white; }
.btn-green:hover:not(:disabled) { background: #16a34a; }
.btn-amber { background: #b45309; color: white; }
.btn-amber:hover:not(:disabled) { background: #d97706; }
.btn-purple { background: #7c3aed; color: white; }
.btn-purple:hover:not(:disabled) { background: #8b5cf6; }
.btn-ghost { background: #1e293b; color: #94a3b8; border: 1px solid #334155; }
.btn-ghost:hover:not(:disabled) { background: #334155; color: #e2e8f0; }
.btn-red { background: #dc2626; color: white; }
.spin { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: sp 0.7s linear infinite; margin-right: 6px; vertical-align: middle; }
@keyframes sp { to { transform: rotate(360deg); } }
.section { background: #1e293b; border-radius: 10px; padding: 16px; margin-bottom: 14px; }
.section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
.file-info { display: flex; align-items: center; gap: 10px; background: #0f172a; border-radius: 8px; padding: 12px; margin-bottom: 12px; }
.file-icon { font-size: 24px; }
.file-details { flex: 1; }
.file-name { font-size: 13px; font-weight: 700; color: #e2e8f0; }
.file-meta { font-size: 11px; color: #64748b; margin-top: 2px; }
.analysis-box { background: #0f172a; border-radius: 8px; padding: 14px; font-size: 12px; line-height: 1.7; color: #94a3b8; white-space: pre-wrap; max-height: 350px; overflow-y: auto; }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.compare-panel { background: #0f172a; border-radius: 8px; padding: 12px; }
.compare-panel h4 { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 0 0 8px; }
.compare-text { font-size: 11px; font-family: monospace; white-space: pre-wrap; max-height: 200px; overflow-y: auto; line-height: 1.5; }
.old-text { color: #fca5a5; }
.new-text { color: #86efac; }
.comparison-report { background: #f8fafc; color: #374151; border-radius: 8px; padding: 14px; font-size: 12px; line-height: 1.7; white-space: pre-wrap; max-height: 400px; overflow-y: auto; margin-top: 12px; }
.approve-bar { display: flex; align-items: center; gap: 12px; background: #052e16; border: 1px solid #166534; border-radius: 8px; padding: 14px; margin-top: 12px; }
.approve-bar p { flex: 1; margin: 0; font-size: 12px; font-weight: 700; color: #4ade80; }
.audit-trail { background: #0f172a; border-radius: 8px; padding: 12px; margin-top: 12px; }
.audit-entry { font-size: 10px; font-family: monospace; color: #64748b; margin-bottom: 3px; line-height: 1.4; }
.action-bar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.status-badge { padding: 3px 10px; border-radius: 99px; font-size: 10px; font-weight: 800; }
.progress-bar { background: #1e293b; border-radius: 99px; height: 6px; overflow: hidden; margin-bottom: 4px; }
.progress-fill { background: linear-gradient(90deg, #1d4ed8, #0891b2); height: 100%; border-radius: 99px; transition: width 0.3s; }
.empty-state { text-align: center; padding: 60px 20px; color: #334155; }
.empty-state .icon { font-size: 48px; margin-bottom: 12px; }
.pdf-frame { width: 100%; height: 500px; border: none; border-radius: 8px; background: #1e293b; }
.new-version-box { background: #0f172a; border: 1px solid #166534; border-radius: 8px; padding: 14px; font-size: 11px; font-family: monospace; white-space: pre-wrap; max-height: 500px; overflow-y: auto; color: #86efac; line-height: 1.6; }
.tabs { display: flex; gap: 4px; margin-bottom: 16px; }
.tab { padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; border: none; }
.tab.active { background: #1d4ed8; color: white; }
.tab.inactive { background: #1e293b; color: #64748b; }
.zip-progress { background: #1e293b; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.zip-progress h3 { margin: 0 0 10px; font-size: 13px; color: #e2e8f0; }
.zip-file-row { display: flex; align-items: center; gap: 8px; padding: 4px 8px; border-radius: 4px; font-size: 11px; margin-bottom: 2px; }
.zip-matched { background: #052e16; color: #4ade80; }
.zip-unmatched { background: #2d1b1b; color: #f87171; }
@media (max-width: 768px) { .sip-body { grid-template-columns: 1fr; } .compare-grid { grid-template-columns: 1fr; } }
`;

function extractTextFromBytes(bytes: Uint8Array, filename: string): string {
  try {
    if (/\.pdf$/i.test(filename)) {
      const str = new TextDecoder("latin1").decode(bytes);
      const text = str.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
      return text.substring(0, 5000);
    }
    if (/\.docx?$/i.test(filename)) {
      const str = new TextDecoder("utf-8", { fatal: false }).decode(bytes);
      const matches = str.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
      const text = matches.map(m => m.replace(/<[^>]+>/g, "")).join(" ").replace(/\s+/g, " ").trim();
      return text.length > 100 ? text.substring(0, 5000) :
        str.replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim().substring(0, 5000);
    }
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes).substring(0, 5000);
  } catch { return ""; }
}

function matchFileToSOP(filename: string): SOPEntry | null {
  const base = filename.replace(/\.[^.]+$/, "");
  // Try exact prefix match first
  for (const sop of ALL_SOP_IDS) {
    const idNorm = sop.id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    const fileNorm = base.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    if (fileNorm.startsWith(idNorm) && idNorm.length >= 3) return sop;
  }
  // Try contains match
  for (const sop of ALL_SOP_IDS) {
    const idNorm = sop.id.replace(/[_\-]/g, "").toUpperCase();
    const fileNorm = base.replace(/[_\-]/g, "").toUpperCase();
    if (fileNorm.includes(idNorm) && idNorm.length >= 4) return sop;
  }
  return null;
}

function extractZipEntries(bytes: Uint8Array): Array<{ name: string; data: Uint8Array }> {
  const entries: Array<{ name: string; data: Uint8Array }> = [];
  let i = 0;
  while (i < bytes.length - 4) {
    if (bytes[i] === 0x50 && bytes[i+1] === 0x4b && bytes[i+2] === 0x03 && bytes[i+3] === 0x04) {
      try {
        const compression = bytes[i+8] | (bytes[i+9] << 8);
        const compSize = bytes[i+18] | (bytes[i+19] << 8) | (bytes[i+20] << 16) | (bytes[i+21] << 24);
        const uncompSize = bytes[i+22] | (bytes[i+23] << 8) | (bytes[i+24] << 16) | (bytes[i+25] << 24);
        const fnLen = bytes[i+26] | (bytes[i+27] << 8);
        const exLen = bytes[i+28] | (bytes[i+29] << 8);
        const name = new TextDecoder("utf-8", { fatal: false }).decode(bytes.slice(i+30, i+30+fnLen));
        const dataStart = i + 30 + fnLen + exLen;
        if (!name.endsWith("/") && !name.startsWith("__MACOSX") && /\.(pdf|docx?|txt)$/i.test(name)) {
          const baseName = name.split("/").pop() || name;
          const data = bytes.slice(dataStart, dataStart + (compression === 0 ? uncompSize : compSize));
          entries.push({ name: baseName, data });
        }
        i = dataStart + compSize;
        if (i <= dataStart) i = dataStart + 1;
      } catch { i++; }
    } else { i++; }
  }
  return entries;
}

function formatSize(n: number): string {
  return n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.round(n / 1024) + " KB";
}

function hashEntry(sopId: string, action: string, timestamp: string): string {
  return btoa(`${sopId}-${action}-${timestamp}`).substring(0, 16);
}

export default function SOPIntelligencePanel({ user }: { user?: any }) {
  const [sopMap, setSopMap] = useState<Record<string, UploadedSOP>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [zipProgress, setZipProgress] = useState<{ total: number; matched: number; unmatched: number; files: any[] } | null>(null);
  const [globalMsg, setGlobalMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"original" | "analysis" | "newversion" | "comparison" | "audit">("original");
  const [batchAnalysing, setBatchAnalysing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const canApprove = user?.role === "QP" || user?.role === "RP";

  const updateSOP = (sopId: string, patch: Partial<UploadedSOP>) =>
    setSopMap(p => ({ ...p, [sopId]: { ...p[sopId], ...patch } as UploadedSOP }));

  const addAudit = (sopId: string, action: string, details: string): AuditEntry => {
    const ts = new Date().toISOString();
    const entry: AuditEntry = {
      timestamp: ts,
      action,
      user: user?.name || "System",
      role: user?.role || "System",
      details,
      hash: hashEntry(sopId, action, ts),
    };
    setSopMap(p => ({
      ...p,
      [sopId]: {
        ...p[sopId],
        auditTrail: [...(p[sopId]?.auditTrail || []), entry],
      } as UploadedSOP,
    }));
    return entry;
  };

  const processFiles = useCallback(async (files: File[]) => {
    const allFiles: Array<{ name: string; data: Uint8Array; fromZip?: string }> = [];

    for (const file of files) {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      if (file.name.toLowerCase().endsWith(".zip")) {
        const entries = extractZipEntries(bytes);
        entries.forEach(e => allFiles.push({ name: e.name, data: e.data, fromZip: file.name }));
      } else {
        allFiles.push({ name: file.name, data: bytes });
      }
    }

    const matched: any[] = [];
    const unmatched: any[] = [];

    for (const f of allFiles) {
      const sop = matchFileToSOP(f.name);
      if (sop) {
        const blob = new Blob([f.data.buffer as ArrayBuffer], {
          type: f.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream"
        });
        const blobUrl = URL.createObjectURL(blob);
        const extractedText = extractTextFromBytes(f.data, f.name);
        const ts = new Date().toLocaleString("de-DE");
        const entry: UploadedSOP = {
          sopId: sop.id,
          sopTitle: sop.title,
          fileName: f.name,
          size: f.data.length,
          uploadedAt: ts,
          blobUrl,
          extractedText,
          auditTrail: [{
            timestamp: new Date().toISOString(),
            action: "UPLOADED",
            user: user?.name || "System",
            role: user?.role || "System",
            details: `Original hochgeladen: ${f.name} (${formatSize(f.data.length)})${f.fromZip ? " aus ZIP: " + f.fromZip : ""}`,
            hash: hashEntry(sop.id, "UPLOADED", new Date().toISOString()),
          }],
          status: "uploaded",
        };
        setSopMap(p => ({ ...p, [sop.id]: entry }));
        matched.push({ name: f.name, sopId: sop.id, sopTitle: sop.title });
        if (!selected) setSelected(sop.id);
      } else {
        unmatched.push({ name: f.name });
      }
    }

    setZipProgress({
      total: allFiles.length,
      matched: matched.length,
      unmatched: unmatched.length,
      files: [...matched.map(m => ({ ...m, matched: true })), ...unmatched.map(u => ({ ...u, matched: false }))],
    });

    setGlobalMsg(`✅ ${matched.length} SOPs zugeordnet · ${unmatched.length} nicht erkannt`);
  }, [user, selected]);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(Array.from(e.dataTransfer.files));
  };

  const callAgent = async (action: string, sopId: string, sopTitle: string, extra: any = {}) => {
    const sop = sopMap[sopId];
    const resp = await fetch("/api/ai-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        sopId,
        sopTitle,
        extractedText: sop?.extractedText || `SOP: ${sopTitle}`,
        ...extra,
      }),
    });
    return await resp.json();
  };

  const analyseOne = async (sopId: string) => {
    const sop = sopMap[sopId];
    if (!sop) return;
    updateSOP(sopId, { status: "analysing" });
    addAudit(sopId, "ANALYSE_START", "KI-Analyse gestartet (Document Agent + Regulatory Watch Agent)");
    try {
      const data = await callAgent("analyse", sopId, sop.sopTitle);
      if (data.ok) {
        updateSOP(sopId, {
          status: "analysed",
          analysis: data,
        });
        addAudit(sopId, "ANALYSE_DONE",
          data.urgent ? "🔴 KRITISCH — Sofortiger Update erforderlich" :
          data.needsUpdate ? "⚠️ Update empfohlen" : "✅ Konform mit aktueller Rechtslage");
        setActiveTab("analysis");
      }
    } catch (e: any) {
      updateSOP(sopId, { status: "uploaded" });
      addAudit(sopId, "ANALYSE_ERROR", e.message);
    }
  };

  const generateUpdate = async (sopId: string) => {
    const sop = sopMap[sopId];
    if (!sop) return;
    updateSOP(sopId, { status: "generating" });
    addAudit(sopId, "GENERATE_START", "Master QP Agent generiert neue Version");
    try {
      const data = await callAgent("generate", sopId, sop.sopTitle);
      if (data.ok) {
        updateSOP(sopId, { status: "generated", newVersion: data.updatedSOP });
        addAudit(sopId, "GENERATE_DONE", `Neue Version v2.0 generiert · Model: ${data.modelVersion} · Agent: ${data.agentLevel}`);
        setActiveTab("newversion");
      }
    } catch (e: any) {
      updateSOP(sopId, { status: "analysed" });
      addAudit(sopId, "GENERATE_ERROR", e.message);
    }
  };

  const compareVersions = async (sopId: string) => {
    const sop = sopMap[sopId];
    if (!sop?.newVersion) return;
    updateSOP(sopId, { status: "comparing" });
    addAudit(sopId, "COMPARE_START", "Versionsvergleich gestartet");
    try {
      const data = await callAgent("compare", sopId, sop.sopTitle, {
        oldText: sop.extractedText || "Original",
        newText: sop.newVersion,
      });
      if (data.ok) {
        updateSOP(sopId, { status: "compared", comparison: data });
        addAudit(sopId, "COMPARE_DONE",
          data.approved ? "KI-Empfehlung: Freigabe · Wartet auf QP-Signatur" : "KI: Ueberarbeitung empfohlen");
        setActiveTab("comparison");
      }
    } catch (e: any) {
      updateSOP(sopId, { status: "generated" });
      addAudit(sopId, "COMPARE_ERROR", e.message);
    }
  };

  const approveSOP = (sopId: string) => {
    if (!canApprove) { alert("Nur QP oder RP kann Dokumente freigeben."); return; }
    const sop = sopMap[sopId];
    if (!sop) return;
    updateSOP(sopId, { status: "approved", approved: true });
    addAudit(sopId, "QP_APPROVED",
      `✅ Elektronisch freigegeben durch ${user?.name} (${user?.role}) gemäß §15 AMG + Annex 11 §4 + ALCOA+ · Zeitstempel: ${new Date().toISOString()}`);
    setActiveTab("audit");
  };

  const fileDocument = (sopId: string) => {
    updateSOP(sopId, { status: "filed", filed: true });
    addAudit(sopId, "FILED", "Dokument archiviert · aus Update-Queue entfernt · unveraenderlich gespeichert");
  };

  const downloadVersion = (sopId: string, version: "original" | "new") => {
    const sop = sopMap[sopId];
    if (!sop) return;
    const text = version === "new" ? sop.newVersion : sop.extractedText;
    if (!text) return;
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${sopId}_${version === "new" ? "v2-KI-generiert" : "original"}.txt`;
    a.click();
  };

  const batchAnalyseAll = async () => {
    const toAnalyse = Object.values(sopMap).filter(s => s.status === "uploaded");
    if (!toAnalyse.length) { setGlobalMsg("Keine Dateien zum Analysieren"); return; }
    setBatchAnalysing(true);
    for (let i = 0; i < toAnalyse.length; i++) {
      setBatchProgress(Math.round((i / toAnalyse.length) * 100));
      setGlobalMsg(`Analysiere ${i + 1}/${toAnalyse.length}: ${toAnalyse[i].sopId}`);
      await analyseOne(toAnalyse[i].sopId);
    }
    setBatchProgress(100);
    setGlobalMsg(`✅ ${toAnalyse.length} SOPs analysiert`);
    setBatchAnalysing(false);
  };

  const selectedSOP = selected ? sopMap[selected] : null;
  const selectedEntry = selected ? ALL_SOP_IDS.find(s => s.id === selected) : null;

  const stats = {
    total: Object.keys(sopMap).length,
    urgent: Object.values(sopMap).filter(s => s.analysis?.urgent).length,
    needsUpdate: Object.values(sopMap).filter(s => s.analysis?.needsUpdate && !s.analysis?.urgent).length,
    approved: Object.values(sopMap).filter(s => s.approved).length,
    filed: Object.values(sopMap).filter(s => s.filed).length,
  };

  const isLoading = selectedSOP && ["analysing", "generating", "comparing"].includes(selectedSOP.status);

  return (
    <>
      <style>{CSS}</style>
      <div className="sip">
        {/* Header */}
        <div className="sip-header">
          <div style={{ fontSize: 32 }}>🏛️</div>
          <div style={{ flex: 1 }}>
            <h1>NOC Pharma — SOP Intelligence System</h1>
            <p>Master QP Agent · Document Agent · Regulatory Watch · Audit Trail · Training Agent</p>
          </div>
          {globalMsg && <div style={{ fontSize: 12, color: "#bfdbfe", maxWidth: 300 }}>{globalMsg}</div>}
        </div>

        {/* Agent pills */}
        <div className="sip-agents">
          {[
            { label: "🧠 Master QP Agent", color: "#1d4ed8" },
            { label: "📄 Document Agent", color: "#059669" },
            { label: "📡 Regulatory Watch", color: "#dc2626" },
            { label: "📋 Audit Trail ALCOA+", color: "#7c3aed" },
            { label: "🎓 Training Agent", color: "#d97706" },
          ].map(a => (
            <div key={a.label} className="agent-pill" style={{ background: a.color + "22", color: a.color, borderColor: a.color + "44" }}>
              {a.label}
            </div>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {Object.keys(sopMap).length > 0 && (
              <button className="btn btn-amber" disabled={batchAnalysing} onClick={batchAnalyseAll}>
                {batchAnalysing ? <><span className="spin" />Analysiere {batchProgress}%...</> : `🔍 Alle ${stats.total} SOPs analysieren`}
              </button>
            )}
          </div>
        </div>

        {batchAnalysing && (
          <div style={{ padding: "8px 28px", background: "#1e293b" }}>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${batchProgress}%` }} /></div>
          </div>
        )}

        <div className="sip-body">
          {/* Left panel - SOP list */}
          <div className="sip-left">
            <div className="sip-left-header">
              <h2>📁 SOP Bibliothek</h2>
              <div
                className={`drop-zone${dragOver ? " over" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                onClick={() => fileRef.current?.click()}
              >
                <div style={{ fontSize: 28 }}>📂</div>
                <h3>ZIP ablegen oder klicken</h3>
                <p>ZIP wird automatisch entpackt · alle SOPs werden zugeordnet</p>
                <input ref={fileRef} type="file" multiple accept=".zip,.pdf,.docx,.doc,.txt"
                  style={{ display: "none" }} onChange={e => processFiles(Array.from(e.target.files || []))} />
              </div>
            </div>

            {/* Stats */}
            {stats.total > 0 && (
              <div className="sip-stats">
                <div className="stat"><div className="stat-n">{stats.total}</div><div className="stat-l">Gesamt</div></div>
                <div className="stat"><div className="stat-n" style={{ color: "#ef4444" }}>{stats.urgent}</div><div className="stat-l">🔴</div></div>
                <div className="stat"><div className="stat-n" style={{ color: "#f59e0b" }}>{stats.needsUpdate}</div><div className="stat-l">⚠️</div></div>
                <div className="stat"><div className="stat-n" style={{ color: "#22c55e" }}>{stats.approved}</div><div className="stat-l">✅</div></div>
                <div className="stat"><div className="stat-n" style={{ color: "#3b82f6" }}>{stats.filed}</div><div className="stat-l">📁</div></div>
              </div>
            )}

            {/* ZIP result */}
            {zipProgress && (
              <div style={{ padding: "10px 14px", borderBottom: "1px solid #334155", fontSize: 11, color: "#64748b" }}>
                📦 {zipProgress.matched} zugeordnet · {zipProgress.unmatched} nicht erkannt von {zipProgress.total}
              </div>
            )}

            {/* SOP list */}
            <div className="sop-list">
              {stats.total === 0 ? (
                <div className="empty-state">
                  <div className="icon">📂</div>
                  <p>ZIP hochladen um SOPs zu laden</p>
                </div>
              ) : (
                // Sort: urgent first, then needs update, then uploaded, then ok
                Object.values(sopMap)
                  .sort((a, b) => {
                    const priority = (s: UploadedSOP) =>
                      s.analysis?.urgent ? 0 : s.analysis?.needsUpdate ? 1 : s.approved ? 3 : 2;
                    return priority(a) - priority(b);
                  })
                  .map(sop => {
                    const seriesColor = SERIES_COLORS[ALL_SOP_IDS.find(s => s.id === sop.sopId)?.series || "legacy"] || "#6366f1";
                    const rowClass = sop.approved ? "approved" : sop.analysis?.urgent ? "urgent" : sop.analysis?.needsUpdate ? "needs-update" : "has-file";
                    return (
                      <div key={sop.sopId}
                        className={`sop-row ${rowClass} ${selected === sop.sopId ? "selected" : ""}`}
                        onClick={() => { setSelected(sop.sopId); setActiveTab("original"); }}
                      >
                        <div className="sop-series" style={{ background: seriesColor }} />
                        <div className="sop-row-name">
                          <div className="sop-row-id">{sop.sopId}</div>
                          <div className="sop-row-title">{sop.sopTitle}</div>
                        </div>
                        <div className="sop-row-badge">
                          {sop.status === "analysing" || sop.status === "generating" || sop.status === "comparing" ? "⏳" :
                           sop.approved ? "✅" :
                           sop.analysis?.urgent ? "🔴" :
                           sop.analysis?.needsUpdate ? "⚠️" :
                           sop.analysis ? "🟢" : "📄"}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>

          {/* Right panel - SOP detail */}
          <div className="sip-right">
            {!selectedSOP ? (
              <div className="empty-state" style={{ padding: "100px 40px" }}>
                <div className="icon">🏛️</div>
                <p style={{ fontSize: 15, color: "#334155" }}>SOP aus der Liste auswählen</p>
                <p style={{ fontSize: 12, color: "#1e293b", marginTop: 8 }}>
                  Oder ZIP hochladen — alle SOPs werden automatisch zugeordnet
                </p>
              </div>
            ) : (
              <>
                {/* Right header */}
                <div className="sip-right-header">
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: SERIES_COLORS[selectedEntry?.series || "legacy"] || "#6366f1" }} />
                  <div style={{ flex: 1 }}>
                    <h2>{selectedSOP.sopId}</h2>
                    <div style={{ fontSize: 11, color: "#64748b" }}>{selectedSOP.sopTitle}</div>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    {selectedSOP.approved && <span className="status-badge" style={{ background: "#052e16", color: "#4ade80" }}>✅ Freigegeben</span>}
                    {selectedSOP.analysis?.urgent && !selectedSOP.approved && <span className="status-badge" style={{ background: "#2d1b1b", color: "#f87171" }}>🔴 DRINGEND</span>}
                    {selectedSOP.analysis?.needsUpdate && !selectedSOP.analysis?.urgent && !selectedSOP.approved && <span className="status-badge" style={{ background: "#2d2000", color: "#fbbf24" }}>⚠️ Update nötig</span>}
                    {selectedSOP.analysis && !selectedSOP.analysis?.needsUpdate && !selectedSOP.approved && <span className="status-badge" style={{ background: "#052e16", color: "#4ade80" }}>✅ Konform</span>}
                  </div>
                </div>

                <div className="sip-right-body">
                  {/* Action bar */}
                  <div className="action-bar">
                    {!selectedSOP.analysis && (
                      <button className="btn btn-blue" disabled={!!isLoading} onClick={() => analyseOne(selectedSOP.sopId)}>
                        {selectedSOP.status === "analysing" ? <><span className="spin" />Analysiere...</> : "🔍 KI analysieren"}
                      </button>
                    )}
                    {selectedSOP.analysis?.needsUpdate && !selectedSOP.newVersion && (
                      <button className="btn btn-amber" disabled={!!isLoading} onClick={() => generateUpdate(selectedSOP.sopId)}>
                        {selectedSOP.status === "generating" ? <><span className="spin" />Generiere...</> : "🤖 Update generieren"}
                      </button>
                    )}
                    {selectedSOP.newVersion && !selectedSOP.comparison && (
                      <button className="btn btn-purple" disabled={!!isLoading} onClick={() => compareVersions(selectedSOP.sopId)}>
                        {selectedSOP.status === "comparing" ? <><span className="spin" />Vergleiche...</> : "⇔ Alt vs Neu vergleichen"}
                      </button>
                    )}
                    {selectedSOP.comparison?.approved && !selectedSOP.approved && canApprove && (
                      <button className="btn btn-green" onClick={() => approveSOP(selectedSOP.sopId)}>
                        ✅ QP freigeben
                      </button>
                    )}
                    {selectedSOP.approved && !selectedSOP.filed && (
                      <button className="btn btn-ghost" onClick={() => fileDocument(selectedSOP.sopId)}>
                        📁 Archivieren
                      </button>
                    )}
                    {selectedSOP.extractedText && (
                      <button className="btn btn-ghost" onClick={() => downloadVersion(selectedSOP.sopId, "original")}>
                        💾 Original
                      </button>
                    )}
                    {selectedSOP.newVersion && (
                      <button className="btn btn-ghost" onClick={() => downloadVersion(selectedSOP.sopId, "new")}>
                        💾 Neue Version
                      </button>
                    )}
                  </div>

                  {/* Tabs */}
                  <div className="tabs">
                    {[
                      { key: "original", label: "📄 Original" },
                      { key: "analysis", label: "🔍 Analyse", show: !!selectedSOP.analysis },
                      { key: "newversion", label: "🤖 Neue Version", show: !!selectedSOP.newVersion },
                      { key: "comparison", label: "⇔ Vergleich", show: !!selectedSOP.comparison },
                      { key: "audit", label: "📋 Audit Trail" },
                    ].filter(t => t.show !== false).map(t => (
                      <button key={t.key} className={`tab ${activeTab === t.key ? "active" : "inactive"}`}
                        onClick={() => setActiveTab(t.key as any)}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab: Original */}
                  {activeTab === "original" && (
                    <div className="section">
                      <div className="section-title">📄 Originaldokument</div>
                      <div className="file-info">
                        <div className="file-icon">{/\.pdf$/i.test(selectedSOP.fileName) ? "📄" : "📝"}</div>
                        <div className="file-details">
                          <div className="file-name">{selectedSOP.fileName}</div>
                          <div className="file-meta">{formatSize(selectedSOP.size)} · Hochgeladen: {selectedSOP.uploadedAt}</div>
                        </div>
                        {selectedSOP.blobUrl && /\.pdf$/i.test(selectedSOP.fileName) && (
                          <a href={selectedSOP.blobUrl} target="_blank" rel="noopener noreferrer"
                            style={{ padding: "6px 12px", background: "#1d4ed8", color: "white", borderRadius: 6, textDecoration: "none", fontSize: 11, fontWeight: 700 }}>
                            👁 PDF öffnen
                          </a>
                        )}
                      </div>
                      {selectedSOP.blobUrl && /\.pdf$/i.test(selectedSOP.fileName) ? (
                        <iframe src={selectedSOP.blobUrl} className="pdf-frame" title="PDF Preview" />
                      ) : selectedSOP.extractedText ? (
                        <div className="analysis-box">{selectedSOP.extractedText}</div>
                      ) : (
                        <div style={{ color: "#64748b", fontSize: 12, padding: 14 }}>Kein Vorschau verfügbar</div>
                      )}
                    </div>
                  )}

                  {/* Tab: Analysis */}
                  {activeTab === "analysis" && selectedSOP.analysis && (
                    <div className="section">
                      <div className="section-title">
                        🔍 KI-QP-Analyse
                        <span style={{
                          padding: "2px 8px", borderRadius: 99, fontSize: 10,
                          background: selectedSOP.analysis.urgent ? "#2d1b1b" : selectedSOP.analysis.needsUpdate ? "#2d2000" : "#052e16",
                          color: selectedSOP.analysis.urgent ? "#f87171" : selectedSOP.analysis.needsUpdate ? "#fbbf24" : "#4ade80"
                        }}>
                          {selectedSOP.analysis.urgent ? "🔴 DRINGEND" : selectedSOP.analysis.needsUpdate ? "⚠️ UPDATE" : "✅ KONFORM"}
                        </span>
                      </div>
                      <div className="analysis-box">{selectedSOP.analysis.regCheck || selectedSOP.analysis.docAnalysis}</div>
                    </div>
                  )}

                  {/* Tab: New Version */}
                  {activeTab === "newversion" && selectedSOP.newVersion && (
                    <div className="section">
                      <div className="section-title">🤖 Neue Version — Master QP Agent generiert</div>
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        <button className="btn btn-purple" disabled={!!isLoading} onClick={() => compareVersions(selectedSOP.sopId)}>
                          {selectedSOP.status === "comparing" ? <><span className="spin" />Vergleiche...</> : "⇔ Vergleich starten"}
                        </button>
                        <button className="btn btn-ghost" onClick={() => downloadVersion(selectedSOP.sopId, "new")}>
                          💾 Download
                        </button>
                      </div>
                      <div className="new-version-box">{selectedSOP.newVersion}</div>
                    </div>
                  )}

                  {/* Tab: Comparison */}
                  {activeTab === "comparison" && selectedSOP.comparison && (
                    <div className="section">
                      <div className="section-title">⇔ Versionsvergleich</div>
                      <div className="compare-grid">
                        <div className="compare-panel">
                          <h4>ALTE VERSION — Original</h4>
                          <div className="compare-text old-text">
                            {(selectedSOP.extractedText || "").substring(0, 1500)}
                          </div>
                        </div>
                        <div className="compare-panel">
                          <h4>NEUE VERSION — KI-generiert</h4>
                          <div className="compare-text new-text">
                            {(selectedSOP.newVersion || "").substring(0, 1500)}
                          </div>
                        </div>
                      </div>
                      <div className="comparison-report">
                        {selectedSOP.comparison.comparison}
                      </div>
                      {selectedSOP.comparison.approved && !selectedSOP.approved && (
                        <div className="approve-bar">
                          <span style={{ fontSize: 24 }}>✅</span>
                          <p>KI-Empfehlung: Freigabe empfohlen. QP-Unterschrift gemäß §15 AMG + Annex 11 erforderlich.</p>
                          {canApprove ? (
                            <button className="btn btn-green" onClick={() => approveSOP(selectedSOP.sopId)}>
                              ✅ QP freigeben & archivieren
                            </button>
                          ) : (
                            <span style={{ fontSize: 11, color: "#4ade80" }}>QP/RP-Login erforderlich</span>
                          )}
                        </div>
                      )}
                      {selectedSOP.approved && (
                        <div className="approve-bar">
                          <span style={{ fontSize: 24 }}>🏆</span>
                          <p>✅ Freigegeben und archiviert · Audit Trail vollständig</p>
                          <button className="btn btn-ghost" onClick={() => fileDocument(selectedSOP.sopId)}>
                            📁 Endgültig archivieren
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab: Audit Trail */}
                  {activeTab === "audit" && (
                    <div className="section">
                      <div className="section-title">📋 Audit Trail — ALCOA+ Konform</div>
                      {!selectedSOP.auditTrail?.length ? (
                        <div style={{ color: "#64748b", fontSize: 12 }}>Noch keine Einträge</div>
                      ) : (
                        <div className="audit-trail">
                          {selectedSOP.auditTrail.map((entry, i) => (
                            <div key={i} className="audit-entry">
                              <span style={{ color: "#3b82f6" }}>{new Date(entry.timestamp).toLocaleString("de-DE")}</span>
                              {" · "}<span style={{ color: "#f59e0b" }}>{entry.user} ({entry.role})</span>
                              {" · "}<span style={{ color: "#e2e8f0", fontWeight: 700 }}>{entry.action}</span>
                              {" · "}<span>{entry.details}</span>
                              {" · "}<span style={{ color: "#334155" }}>#{entry.hash}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
