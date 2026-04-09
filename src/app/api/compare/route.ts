import { NextRequest, NextResponse } from "next/server";

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "ANTHROPIC_API_KEY not set" }, { status: 500 });

    const { oldText, newText, sopName } = await req.json();
    if (!oldText || !newText) return NextResponse.json({ error: "Both old and new text required" }, { status: 400 });

    const prompt = `Du bist QP-Gutachter bei NOC Pharma GmbH. Vergleiche diese zwei SOP-Versionen und erstelle einen detaillierten Änderungsbericht.

SOP: ${sopName || "Unbekannt"}

=== ALTE VERSION ===
${oldText.substring(0, 3000)}

=== NEUE VERSION ===  
${newText.substring(0, 3000)}

Erstelle einen strukturierten Vergleichsbericht:

## 🔄 ÄNDERUNGSÜBERSICHT: ${sopName}

### HINZUGEFÜGT ✅
Liste alle neuen Inhalte (markiere mit [+]):
- [+] ...

### ENTFERNT ❌  
Liste alle gelöschten Inhalte (markiere mit [-]):
- [-] ...

### GEÄNDERT 🔄
Liste alle modifizierten Abschnitte:
- Abschnitt X: ALT: "..." → NEU: "..."

### REGULATORISCHE BEWERTUNG
- Verbessert die neue Version die Compliance? [Ja/Nein/Teilweise]
- Neue Regulierungsbezüge hinzugefügt: [Liste]
- Fehlende Anforderungen: [Liste]
- BfArM-Audit-Readiness: [Bewertung 1-10]

### QP-EMPFEHLUNG
☐ FREIGABE EMPFOHLEN — Änderungen sind regulatorisch korrekt
☐ FREIGABE MIT AUFLAGEN — Folgende Punkte müssen noch korrigiert werden:
☐ ABLEHNUNG — Wesentliche Mängel vorhanden:

### ENGLISH SUMMARY FOR QP SIGN-OFF
[5 sentences summarizing key changes and compliance impact]`;

    const resp = await fetch(ANTHROPIC_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 3000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error?.message || "API error");

    const comparison = (data.content || []).map((c: any) => c.text || "").join("\n");
    const approved = comparison.includes("FREIGABE EMPFOHLEN");
    const rejected = comparison.includes("ABLEHNUNG");

    return NextResponse.json({ ok: true, comparison, approved, rejected });

  } catch (e: any) {
    console.error("Compare error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
