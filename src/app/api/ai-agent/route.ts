import { NextRequest, NextResponse } from "next/server";

const API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

// ═══════════════════════════════════════════════════════════════
// MASTER QP AGENT SYSTEM PROMPT
// PhD-level · §15 AMG · BfArM Authority · Cannabis Pharma Expert
// ═══════════════════════════════════════════════════════════════
const MASTER_QP_PROMPT = `Du bist der Leitende KI-Qualitätssicherungsbeauftragte (Master QP Agent) von NOC Pharma GmbH.

DEINE EXPERTISE:
- PhD Pharmazeutische Wissenschaften + Regulatory Affairs
- Sachkundige Person (QP) gemäß §15 AMG — 20+ Jahre Erfahrung
- Spezialist: Medizinischer Cannabis, BtM, EU-GMP, GDP
- BfArM-Inspektor-Level Kenntnisse
- Vollständige Kenntnis aller relevanten Regelwerke (Stand April 2026)

REGULATORISCHES WISSEN (AKTUELL — April 2026):
═══════════════════════════════════════════════

MedCanG (seit 1. April 2024):
- §3: Verschreibungspflichtig (kein BtM mehr)
- §4: BfArM-Erlaubnis für Import/Großhandel
- §7: Verantwortliche Person (Celso Hamelink Chmielewski)
- §8: Sicherheitsanforderungen Lagerung
- §10: Aufzeichnungspflichten pro Produkt/Standort
- §12/14: Individuelle BfArM Import/Export-Genehmigung
- §16(3): Jahresbericht bis 31. Januar
- §21: Kennzeichnung
- 2025 Amendment: "medizinisch begründet" Anforderung

AMG (aktuelle Fassung):
- §13: Herstellungserlaubnis
- §52a: Großhandelserlaubnis — NUR an Apotheken/Krankenhäuser
- §63a: Stufenplanbeauftragter
- §64-69: Inspektionen
- §81: MedCanG hat Vorrang

BtMG (Übergangsbestimmungen bis vollständige MedCanG-Übernahme):
- Historische Aufzeichnungen 10 Jahre aufbewahren
- BtMBinHV-Meldungen während Übergang

PIC/S GMP PE 009-17 (aktuell):
- Kapitel 1: QMS, Management Review
- Kapitel 2: Personal, Schulung — ALCOA+
- Kapitel 4: Dokumentation — SOPs genehmigt/versioniert
- Kapitel 5: Kreuzkontamination Cannabis
- Kapitel 6: QK, OOS/OOT
- Kapitel 7: Ausgelagerte Tätigkeiten
- Kapitel 8: Beanstandungen, 24h-Rückruf
- Kapitel 9: Selbstinspektion/CAPA
- Anhang 11: Computergestützte Systeme (GAMP5 IQ/OQ/PQ)
- ALCOA++ Datenintegrität, Audit Trail 10 Jahre
- Elektronische Signaturen gemäß §15 AMG

EU GDP (2013/C 343/01):
- Kapitel 1-2: QMS, VP benannt
- Kapitel 3: Temperaturkartierung/-monitoring
- Kapitel 5: Lieferantenqualifizierung, FIFO/FEFO
- Kapitel 6: Beanstandungen, Retouren Quarantäne
- Kapitel 9: Qualifizierter Transport

EU AI Act (2024/1689, in Kraft ab August 2026):
- Art.6 + Anhang III: Gesundheits-KI = HOCHRISIKO
- Art.9: Risikomanagement
- Art.10: Datenverwaltung
- Art.12: Auto-Protokollierung 10 Jahre
- Art.13: Transparenz
- Art.14: HITL-Override PFLICHT
- Art.25: CE-Kennzeichnung
- Art.52: KI-Inhaltsoffenlegung

21 CFR Part 11:
- §11.10: Systemkontrollen
- §11.50: Signaturen
- §11.200: Eindeutige ID
- §11.300: Passwörter/Sperrung

DIN EN ISO 14644: Reinraumklassifizierung
DAB Cannabis flos: Analytik-Standards
Ph. Eur.: Europäisches Arzneibuch

NOC PHARMA GMBH:
- Standort Hauptsitz: Murchin, Mecklenburg-Vorpommern
- Standort 2: Kahla, Thüringen
- Tätigkeit: Import, Lagerung, Großhandel Cannabis (Blüten, Extrakte)
- Erlaubnisse: §52a AMG + §4 MedCanG
- Aufsichtsbehörden: BfArM (Bundesebene), LAGuS MV, Landesbehörde Thüringen

SCHLÜSSELPERSONEN (in SOPs nur nach Rolle, nicht Namen):
- Verantwortliche Person (RP): Celso Hamelink Chmielewski (§52a AMG / §7 MedCanG)
- Sachkundige Person (QP): Torsten Cuny (§15 AMG)
- Leiter Qualitätssicherung: Dr. Olaf Schagon
- Geschäftsführer: [nicht öffentlich]

SOP-FORMAT (PFLICHT — 8 Abschnitte):
1. Zweck und Anwendungsbereich
2. Geltungsbereich
3. Abkürzungen und Definitionen
4. Verantwortlichkeiten (mit Rollen + Namen)
5. Verfahren (schrittweise, nummeriert, RACI)
6. Dokumentation (ALCOA+ konform)
7. Referenzen (spezifische Artikel zitieren)
8. Änderungshistorie

SCHREIBREGELN:
- Formales Deutsch (Amtssprache)
- "Es ist sicherzustellen, dass..." (nie "sollte")
- Spezifische Artikel: "gemäß §52a Abs.2 AMG", "nach PIC/S GMP Kapitel 8.6"
- Neue/geänderte Inhalte: [NEU 2026] oder [GEÄNDERT 2026]
- Ende: ENGLISCHES EXECUTIVE SUMMARY (10 Sätze) für RP-Prüfung`;

// ═══════════════════════════════════════════════════════════════
// SUB-AGENT: REGULATORY WATCH
// Daily monitoring of laws, BfArM notices, EU regulations
// ═══════════════════════════════════════════════════════════════
const REGULATORY_WATCH_PROMPT = `Du bist der Regulatorische Überwachungs-Agent (Regulatory Watch Agent) für NOC Pharma GmbH.

Deine Aufgabe: Analysiere ob diese SOP mit dem AKTUELLEN Stand der Gesetzgebung (April 2026) konform ist.

Prüfe systematisch:
1. MedCanG-Konformität (Cannabis aus BtMG entfernt seit April 2024)
2. Veraltete BtMG-Verweise die zu MedCanG aktualisiert werden müssen
3. EU AI Act Anforderungen (ab August 2026 zwingend)
4. Aktuelle PIC/S PE 009-17 Anforderungen
5. BfArM-spezifische Anforderungen für Cannabis-Großhandel
6. Annex 11 / 21 CFR Part 11 für elektronische Systeme
7. ALCOA++ Datenintegrität
8. GDP 2013/C 343/01 für Transport/Lagerung

Ausgabe als strukturierter Compliance-Bericht mit Schweregrad-Einstufung.`;

// ═══════════════════════════════════════════════════════════════
// SUB-AGENT: DOCUMENT ANALYST
// Reads and extracts structured information from existing SOPs
// ═══════════════════════════════════════════════════════════════
const DOCUMENT_ANALYST_PROMPT = `Du bist der Dokumentenanalyse-Agent für NOC Pharma GmbH.

Analysiere das vorgelegte Dokument und extrahiere:
1. SOP-Nummer, Titel, Version, Datum
2. Geltungsbereich
3. Hauptverfahren (Zusammenfassung)
4. Alle zitierten Regelwerke und Artikel
5. Verantwortlichkeiten (Rollen)
6. Schwachstellen und Lücken
7. Update-Dringlichkeit (SOFORT / DRINGEND / EMPFOHLEN / OPTIONAL)

Sei präzise und vollständig. Dies ist Grundlage für die KI-Aktualisierung.`;

async function callAgent(systemPrompt: string, userMessage: string, apiKey: string): Promise<string> {
  const resp = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error?.message || "API error");
  return (data.content || []).map((c: any) => c.text || "").join("\n");
}

// ═══════════════════════════════════════════════════════════════
// MAIN API HANDLER
// ═══════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    const body = await req.json();
    const { action, sopId, sopTitle, extractedText, currentVersion, prompt } = body;

    // ── ACTION: Full SOP Analysis Pipeline ──────────────────────
    if (action === "analyse") {
      if (!extractedText) return NextResponse.json({ error: "No text to analyse" }, { status: 400 });

      // Step 1: Document Analyst extracts structure
      const docAnalysis = await callAgent(
        DOCUMENT_ANALYST_PROMPT,
        `Analysiere diese SOP:\n\nSOP-ID: ${sopId}\nTitel: ${sopTitle}\n\nINHALT:\n${extractedText.substring(0, 4000)}`,
        apiKey
      );

      // Step 2: Regulatory Watch checks compliance
      const regCheck = await callAgent(
        REGULATORY_WATCH_PROMPT,
        `Prüfe diese SOP auf regulatorische Konformität (Stand April 2026):\n\nSOP-ID: ${sopId}\nTitel: ${sopTitle}\n\nDOKUMENT-ANALYSE:\n${docAnalysis}\n\nORIGINAL-INHALT:\n${extractedText.substring(0, 2000)}`,
        apiKey
      );

      // Determine urgency
      const urgent = regCheck.includes("SOFORT") || regCheck.includes("KRITISCH") || regCheck.includes("🔴");
      const needsUpdate = urgent || regCheck.includes("DRINGEND") || regCheck.includes("⚠") || regCheck.includes("EMPFOHLEN");

      return NextResponse.json({
        ok: true,
        action: "analyse",
        sopId,
        docAnalysis,
        regCheck,
        needsUpdate,
        urgent,
        timestamp: new Date().toISOString(),
      });
    }

    // ── ACTION: Generate Updated SOP ────────────────────────────
    if (action === "generate") {
      if (!extractedText) return NextResponse.json({ error: "No original text" }, { status: 400 });

      const updatedSOP = await callAgent(
        MASTER_QP_PROMPT,
        `Erstelle eine vollständig aktualisierte Version dieser SOP für NOC Pharma GmbH.

SOP-ID: ${sopId}
TITEL: ${sopTitle}

BESTEHENDE VERSION:
${extractedText.substring(0, 3000)}

ANFORDERUNGEN:
1. Behalte alle 8 Pflichtabschnitte
2. Aktualisiere alle veralteten Regulatory-Referenzen (BtMG → MedCanG wo zutreffend)
3. Füge fehlende ALCOA+, Annex 11, EU AI Act Anforderungen hinzu
4. Markiere ALLE Änderungen mit [NEU 2026] oder [GEÄNDERT 2026]
5. Nenne konkrete Verantwortlichkeiten mit Rollen
6. Zitiere spezifische Gesetzesartikel
7. Ende mit ENGLISCHEM EXECUTIVE SUMMARY (10 Sätze)

WICHTIG: Generiere die vollständige SOP — alle 8 Abschnitte komplett ausgearbeitet.`,
        apiKey
      );

      return NextResponse.json({
        ok: true,
        action: "generate",
        sopId,
        updatedSOP,
        generatedAt: new Date().toISOString(),
        modelVersion: MODEL,
        agentLevel: "Master QP Agent",
      });
    }

    // ── ACTION: Compare Old vs New ───────────────────────────────
    if (action === "compare") {
      const { oldText, newText } = body;
      if (!oldText || !newText) return NextResponse.json({ error: "Need both old and new text" }, { status: 400 });

      const comparison = await callAgent(
        MASTER_QP_PROMPT,
        `Als QP-Gutachter: Erstelle einen detaillierten Änderungsbericht für diese SOP-Revision.

SOP: ${sopId} — ${sopTitle}

ALTE VERSION:
${oldText.substring(0, 2500)}

NEUE VERSION:
${newText.substring(0, 2500)}

BERICHT-FORMAT:
## 📋 ÄNDERUNGSÜBERSICHT: ${sopId}

### ✅ HINZUGEFÜGT (mit [+] markieren)
### ❌ ENTFERNT (mit [-] markieren)  
### 🔄 GEÄNDERT (ALT → NEU format)
### 📊 REGULATORISCHE BEWERTUNG
- Compliance verbessert: [Ja/Nein/Teilweise]
- Neue Regulatory-Referenzen: [Liste]
- BfArM-Audit-Readiness: [1-10]
### ⚖️ QP-EMPFEHLUNG
☐ FREIGABE EMPFOHLEN
☐ FREIGABE MIT AUFLAGEN
☐ ABLEHNUNG
### 🇬🇧 ENGLISH SUMMARY FOR QP SIGN-OFF (5 sentences)`,
        apiKey
      );

      const approved = comparison.includes("FREIGABE EMPFOHLEN") && !comparison.includes("ABLEHNUNG");

      return NextResponse.json({
        ok: true,
        action: "compare",
        sopId,
        comparison,
        approved,
        timestamp: new Date().toISOString(),
      });
    }

    // ── ACTION: Audit Trail Entry ────────────────────────────────
    if (action === "audit-entry") {
      const { auditAction, user, details } = body;
      // In production: save to database
      // For now: return structured audit log entry
      return NextResponse.json({
        ok: true,
        action: "audit-entry",
        entry: {
          id: `AUDIT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          sopId,
          action: auditAction,
          user,
          details,
          hash: btoa(`${sopId}-${auditAction}-${Date.now()}`), // Simple hash for integrity
          alcoa: {
            attributable: user,
            legible: true,
            contemporaneous: new Date().toISOString(),
            original: true,
            accurate: true,
          }
        }
      });
    }

    // ── ACTION: Regulatory Daily Check ──────────────────────────
    if (action === "regulatory-check") {
      const { sopList } = body;

      const check = await callAgent(
        MASTER_QP_PROMPT,
        `TÄGLICHE REGULATORISCHE ÜBERWACHUNG — ${new Date().toLocaleDateString("de-DE")}

Analysiere den aktuellen Stand dieser SOP-Kategorien für NOC Pharma GmbH:
${sopList?.join(", ") || "Alle SOPs"}

Prüfe auf:
1. Neue BfArM-Bekanntmachungen (Cannabis/MedCanG)
2. EU-GMP Guideline Updates
3. MedCanG Änderungen seit April 2024
4. EU AI Act Implementierungsfristen (August 2026)
5. Neue Ph. Eur. Monographien Cannabis flos
6. GDP-Updates Transport Cannabis

Erstelle einen strukturierten Tagesbericht mit:
- 🔴 SOFORTIGER HANDLUNGSBEDARF
- 🟡 INNERHALB 30 TAGE
- 🟢 ZUR KENNTNIS

Für jeden Punkt: betroffene SOP-IDs nennen.`,
        apiKey
      );

      return NextResponse.json({
        ok: true,
        action: "regulatory-check",
        report: check,
        date: new Date().toISOString(),
        nextCheck: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    }

    // ── ACTION: Chat / General QP Query ─────────────────────────
    if (action === "chat" || !action) {
      if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

      const response = await callAgent(MASTER_QP_PROMPT, prompt, apiKey);
      return NextResponse.json({ ok: true, text: response });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  } catch (e: any) {
    console.error("AI Agent error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
