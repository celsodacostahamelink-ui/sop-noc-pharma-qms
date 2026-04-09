import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

const QP_SYSTEM = `You are Dr. QP — a PhD-level Qualified Person (§15 AMG) and regulatory expert with 20+ years in pharmaceutical cannabis. You have deep expertise in:
- EU-GMP (PIC/S PE 009-17), EU GDP (2013/C 343/01)
- AMG, MedCanG, BtMG, BtMVV
- ICH Q10, Q9, Q8
- EU AI Act (2024/1689)
- 21 CFR Part 11, Annex 11
- BfArM inspection requirements
- NOC Pharma GmbH operations (Murchin + Kahla sites)
- Cannabis pharma import/wholesale/distribution

You review SOPs with the critical eye of a BfArM auditor. You identify gaps, outdated references, missing ALCOA+ requirements, and non-compliant language. You write in formal German (Amtssprache) with English summaries.

NOC Pharma context:
- RP: Celso Hamelink Chmielewski (§52a AMG / §7 MedCanG)
- QP: Torsten Cuny (§15 AMG)  
- QA: Dr. Olaf Schagon
- Authorities: BfArM, LAGuS MV, Landesbehörde Thüringen
- MedCanG in force since 1 April 2024 — cannabis removed from BtMG`;

async function callAI(prompt: string, apiKey: string): Promise<string> {
  const resp = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4000,
      system: QP_SYSTEM,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.error?.message || "API error");
  return (data.content || []).map((c: any) => c.text || "").join("\n");
}

async function extractTextFromFile(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  // For DOCX files use mammoth-style extraction (read as text with encoding fallback)
  if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
    try {
      // Extract readable text from docx (basic XML extraction)
      const str = buffer.toString("utf-8");
      // Pull text from XML word content
      const matches = str.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) || [];
      const text = matches
        .map(m => m.replace(/<[^>]+>/g, ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      return text.length > 100 ? text : buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ").replace(/\s+/g, " ").trim();
    } catch {
      return buffer.toString("latin1").replace(/[^\x20-\x7E\n\r\t]/g, " ").substring(0, 5000);
    }
  }
  
  // For PDF and others — extract readable ASCII
  const text = buffer.toString("latin1")
    .replace(/[^\x20-\x7E\n\r\t]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.substring(0, 8000);
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const action = formData.get("action") as string || "analyse";

    if (!files.length) return NextResponse.json({ error: "No files uploaded" }, { status: 400 });

    const results = [];

    for (const file of files) {
      try {
        const text = await extractTextFromFile(file);
        const sopName = file.name.replace(/\.[^.]+$/, "");

        let prompt = "";

        if (action === "analyse") {
          prompt = `Analysiere diese SOP für NOC Pharma GmbH als BfArM-Auditor:

SOP-DATEINAME: ${sopName}
INHALT (Auszug):
${text.substring(0, 4000)}

Erstelle einen strukturierten Analysebericht:

## 📋 SOP-ANALYSE: ${sopName}

### 1. IDENTIFIKATION
- SOP-Nummer und Titel
- Version und Datum (falls erkennbar)
- Geltungsbereich

### 2. COMPLIANCE-STATUS
Rate: ✅ Konform | ⚠️ Teilkonform | 🔴 Nicht konform

### 3. GEFUNDENE MÄNGEL
Liste alle Mängel mit Schweregrad:
- 🔴 KRITISCH: [Beschreibung + Regulierungsbezug]
- 🟡 WICHTIG: [Beschreibung]
- 🟢 HINWEIS: [Beschreibung]

### 4. VERALTETE REFERENZEN
- Welche Verweise auf BtMG müssen zu MedCanG aktualisiert werden?
- Welche EU-GMP Kapitel fehlen?

### 5. AKTUALISIERUNGSBEDARF
Bewertung: DRINGEND | EMPFOHLEN | OPTIONAL
Geschätzter Aufwand: [gering/mittel/hoch]

### 6. EMPFEHLUNGEN
Top 3 prioritäre Maßnahmen für BfArM-Audit-Readiness

### 7. ENGLISH SUMMARY
[5-sentence audit-ready summary for QP review]`;

        } else if (action === "generate-update") {
          prompt = `Basierend auf dieser bestehenden SOP, erstelle eine vollständig aktualisierte Version für NOC Pharma GmbH:

BESTEHENDE SOP: ${sopName}
INHALT:
${text.substring(0, 3000)}

Erstelle die aktualisierte SOP mit allen 8 Pflichtabschnitten:
1. Zweck und Anwendungsbereich
2. Geltungsbereich  
3. Abkürzungen und Definitionen
4. Verantwortlichkeiten (mit Namen: Celso Hamelink, Torsten Cuny, Dr. Olaf Schagon)
5. Verfahren (detailliert)
6. Dokumentation (ALCOA+ konform)
7. Referenzen (aktuelle MedCanG, AMG, EU-GMP Angaben)
8. Änderungshistorie

Markiere alle neuen/geänderten Inhalte mit [NEU 2026] oder [GEÄNDERT 2026].
Ende mit ENGLISH EXECUTIVE SUMMARY (10 Sätze).`;
        }

        const analysis = await callAI(prompt, apiKey);

        // Determine update urgency
        const urgent = analysis.includes("KRITISCH") || analysis.includes("DRINGEND") || analysis.includes("🔴");
        const needsUpdate = analysis.includes("⚠️") || analysis.includes("WICHTIG") || urgent;

        results.push({
          fileName: file.name,
          sopName,
          analysis,
          needsUpdate,
          urgent,
          size: file.size,
          processedAt: new Date().toISOString(),
        });

      } catch (fileError: any) {
        results.push({
          fileName: file.name,
          sopName: file.name,
          analysis: `Fehler bei der Analyse: ${fileError.message}`,
          needsUpdate: false,
          urgent: false,
          error: true,
        });
      }
    }

    return NextResponse.json({ ok: true, results, total: results.length });

  } catch (e: any) {
    console.error("Batch upload error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
