import { NextRequest, NextResponse } from "next/server";

const REG_KNOWLEDGE = `
=== NOC PHARMA GMBH — REGULATORY COMPLIANCE FRAMEWORK ===

COMPANY:
- Name: NOC Pharma GmbH
- Address: Murchin, Mecklenburg-Vorpommern, Germany
- Activity: Import, storage and wholesale distribution of cannabis for medical purposes (Cannabisblüten)
- Licenses: Großhandelserlaubnis (§52a AMG) + Erlaubnis (§4 MedCanG)
- Supervisory authorities: BfArM (federal), LAGuS Mecklenburg-Vorpommern, Landesbehörde Thüringen

KEY PERSONNEL:
- Celso Hamelink Chmielewski — Verantwortliche Person (RP) gemäß §52a AMG / §7 MedCanG
- Torsten Cuny — Sachkundige Person (QP) gemäß §15 AMG
- Dr. Olaf Schagon — Leiter Qualitätssicherung / Head of Quality Assurance

AUDITORS: BfArM inspectors from Pomerania and Thuringia

--- MedCanG (effective 1 April 2024) ---
§3: Prescription-only (not BtM). §4: BfArM Erlaubnis for import/wholesale.
§7: Verantwortliche Person (Celso Hamelink) required. §8: Security. §10: Records per product/site.
§12/14: Individual BfArM import/export Genehmigung. §16(3): Annual report by Jan 31.
§21: Labeling. §25: Penalties. Cannabis removed from BtMG April 2024.
2025 Amendment: medizinisch begründet requirement.

--- AMG ---
§13: Herstellungserlaubnis. §52a: Großhandelserlaubnis, ONLY to pharmacies/hospitals.
§63a: Stufenplanbeauftragter. §64-69: Inspections. §81: MedCanG precedence.

--- PIC/S GMP PE 009-17 ---
Ch1: QMS, management review. Ch2: Personnel, training. Ch4: ALCOA+, SOPs approved/versioned.
Ch5: Cross-contamination. Ch6: QC, OOS. Ch7: Outsourced contracts. Ch8: Complaints, 24h recall.
Ch9: Self-inspection/CAPA.
Annex 11: Risk-based validation (GAMP5 IQ/OQ/PQ), ALCOA++ data integrity, audit trail 10yr,
access controls, e-signatures linked to record+datetime, change control, periodic review.

--- EU GDP (2013/C 343/01) ---
Ch1-2: QMS, VP named. Ch3: Temp mapping/monitoring. Ch5: Supplier qual, FIFO/FEFO.
Ch6: Complaints, returns quarantine, falsified→notify. Ch9: Qualified transport.

--- EU AI Act (2024/1689, Aug 2026) ---
Art.6+AnnexIII: Healthcare AI=HIGH-RISK. Art.9: Risk mgmt. Art.10: Data governance.
Art.12: Auto-logging 10yr. Art.13: Transparency. Art.14: HITL override mandatory.
Art.25: CE marking. Art.52: AI content disclosure.

--- 21 CFR Part 11 ---
§11.10: System controls. §11.50: Signatures. §11.200: Unique ID. §11.300: Passwords/lockout.

--- BtMG (transitional) ---
Historical records 10yr. BtMBinHV reporting during transition.

DOCUMENT FORMAT REQUIREMENTS:
- All SOPs in formal German (Amtssprache)
- Section structure: 1. Zweck, 2. Geltungsbereich, 3. Abkürzungen/Definitionen, 4. Verantwortlichkeiten, 5. Verfahren, 6. Dokumentation, 7. Referenzen, 8. Änderungshistorie
- Reference NOC Pharma personnel by name and role
- Cite specific regulation articles in [brackets]
- Mark changes with [NEU 2026]
- Include English Executive Summary at end
`;

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) return NextResponse.json({ error: "No prompt" }, { status: 400 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    const enrichedPrompt = `You are a senior pharmaceutical regulatory compliance expert writing SOPs for NOC Pharma GmbH.

${REG_KNOWLEDGE}

TASK:
${prompt}

CRITICAL FORMATTING RULES:
- Write SOPs in formal German (Amtssprache) suitable for BfArM audit review
- Use these exact section numbers: 1. Zweck, 2. Geltungsbereich, 3. Abkürzungen und Definitionen, 4. Verantwortlichkeiten, 5. Verfahren, 6. Dokumentation, 7. Referenzen, 8. Änderungshistorie
- In Verantwortlichkeiten, name the actual people:
  * Celso Hamelink Chmielewski as RP (Verantwortliche Person §52a AMG / §7 MedCanG)
  * Torsten Cuny as QP (Sachkundige Person §15 AMG)
  * Dr. Olaf Schagon as QA-Leiter (Leiter Qualitätssicherung)
- Cite specific regulation articles: "gemäß §52a Abs.2 AMG", "nach PIC/S GMP Kapitel 8.6", "MedCanG §4 Abs.1"
- Mark new/changed content with [NEU 2026]
- Reference that NOC Pharma is audited by Landesbehörden from Mecklenburg-Vorpommern and Thüringen
- End with ENGLISH EXECUTIVE SUMMARY (10-15 sentences) for RP review`;

    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: enrichedPrompt }],
      }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      console.error("API error:", data);
      return NextResponse.json({ error: data.error?.message || "API error" }, { status: resp.status });
    }

    const text = (data.content || []).map((c: any) => c.text || "").join("\n") || "No response";
    return NextResponse.json({ ok: true, text });
  } catch (e: any) {
    console.error("AI error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
