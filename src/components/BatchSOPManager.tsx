"use client";
import { useState, useRef, useCallback } from "react";

interface SOPItem {
  id: string;
  file: File;
  name: string;
  size: number;
  previewUrl?: string;
  status: "ready" | "analysing" | "done" | "error" | "filed";
  analysis?: string;
  extractedText?: string;
  needsUpdate?: boolean;
  urgent?: boolean;
  newVersion?: string;
  comparisonReport?: string;
  approved?: boolean;
  showOriginal?: boolean;
  showAnalysis?: boolean;
  showComparison?: boolean;
  fromZip?: string;
}

const CSS = `
* { box-sizing: border-box; }
.bm { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; min-height: 100vh; }
.bm-header { background: linear-gradient(135deg, #0d47a1, #0288d1); color: white; padding: 20px 28px; display: flex; align-items: center; gap: 16px; }
.bm-header h1 { margin: 0; font-size: 18px; font-weight: 800; }
.bm-header p { margin: 4px 0 0; font-size: 12px; opacity: 0.8; }
.bm-body { padding: 20px 28px; max-width: 1100px; margin: 0 auto; }
.drop-zone { border: 2px dashed #cbd5e1; border-radius: 16px; padding: 40px; text-align: center; background: white; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
.drop-zone.over { border-color: #0d47a1; background: #eff6ff; transform: scale(1.01); }
.drop-zone h2 { margin: 12px 0 6px; font-size: 17px; color: #1e293b; }
.drop-zone p { margin: 0; color: #64748b; font-size: 12px; }
.dz-icon { font-size: 40px; }
.toolbar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
.btn { padding: 9px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 12px; font-weight: 700; transition: all 0.15s; white-space: nowrap; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-blue { background: #0d47a1; color: white; }
.btn-blue:hover:not(:disabled) { background: #1565c0; }
.btn-green { background: #16a34a; color: white; }
.btn-amber { background: #d97706; color: white; }
.btn-ghost { background: white; color: #374151; border: 1px solid #d1d5db; }
.btn-ghost:hover:not(:disabled) { background: #f9fafb; }
.btn-sm { padding: 5px 10px; font-size: 11px; }
.spin { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: sp 0.7s linear infinite; margin-right: 6px; vertical-align: middle; }
@keyframes sp { to { transform: rotate(360deg); } }
.stats { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.stat { background: white; border-radius: 10px; padding: 14px 18px; border: 1px solid #e2e8f0; flex: 1; min-width: 90px; text-align: center; }
.stat-n { font-size: 26px; font-weight: 900; }
.stat-l { font-size: 11px; color: #64748b; margin-top: 2px; }
.sop-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 12px; overflow: hidden; }
.sop-card.urgent { border-left: 4px solid #ef4444; }
.sop-card.warning { border-left: 4px solid #f59e0b; }
.sop-card.ok { border-left: 4px solid #22c55e; }
.sop-card.filed { border-left: 4px solid #3b82f6; opacity: 0.75; }
.sop-card.analysing { border-left: 4px solid #8b5cf6; }
.sop-top { display: flex; align-items: center; gap: 12px; padding: 14px 18px; }
.sop-icon { font-size: 22px; flex-shrink: 0; }
.sop-info { flex: 1; min-width: 0; }
.sop-name { font-size: 14px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sop-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
.sop-badges { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
.badge { padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 800; }
.badge-red { background: #fee2e2; color: #dc2626; }
.badge-amber { background: #fef3c7; color: #d97706; }
.badge-green { background: #dcfce7; color: #16a34a; }
.badge-blue { background: #dbeafe; color: #1d4ed8; }
.badge-purple { background: #ede9fe; color: #7c3aed; }
.badge-gray { background: #f1f5f9; color: #64748b; }
.sop-actions { display: flex; gap: 6px; flex-wrap: wrap; padding: 8px 18px 12px; }
.panel { padding: 18px; border-top: 1px solid #f1f5f9; }
.panel-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 12px; }
.original-viewer { background: #0f172a; border-radius: 8px; padding: 16px; max-height: 400px; overflow-y: auto; }
.original-viewer pre { color: #e2e8f0; font-size: 11px; font-family: monospace; white-space: pre-wrap; margin: 0; line-height: 1.6; }
.pdf-frame { width: 100%; height: 600px; border: none; border-radius: 8px; }
.analysis-viewer { font-size: 13px; line-height: 1.8; color: #374151; white-space: pre-wrap; max-height: 600px; overflow-y: auto; }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
.compare-panel { background: #1e293b; border-radius: 8px; padding: 14px; }
.compare-panel h4 { color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px; }
.compare-panel textarea { width: 100%; background: #0f172a; border: 1px solid #334155; color: #e2e8f0; border-radius: 6px; padding: 10px; font-size: 11px; font-family: monospace; resize: vertical; min-height: 200px; }
.compare-report { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 13px; line-height: 1.7; white-space: pre-wrap; max-height: 500px; overflow-y: auto; margin-top: 14px; }
.accept-bar { display: flex; align-items: center; gap: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin-top: 12px; }
.accept-bar p { flex: 1; margin: 0; font-size: 13px; font-weight: 700; color: #15803d; }
.progress-wrap { margin-bottom: 18px; background: white; border-radius: 10px; padding: 16px; border: 1px solid #e2e8f0; }
.progress-bar { background: #e2e8f0; border-radius: 99px; height: 8px; overflow: hidden; }
.progress-fill { background: linear-gradient(90deg, #0d47a1, #0288d1); height: 100%; border-radius: 99px; transition: width 0.3s; }
.progress-label { font-size: 12px; color: #374151; font-weight: 600; margin-bottom: 8px; }
.empty { text-align: center; padding: 60px 20px; color: #94a3b8; }
.empty-icon { font-size: 48px; margin-bottom: 12px; }
.msg { font-size: 12px; color: #64748b; padding: 8px 0; align-self: center; }
.zip-tag { font-size: 10px; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; margin-left: 6px; }
@media (max-width: 640px) { .compare-grid { grid-template-columns: 1fr; } .bm-body { padding: 12px; } }
`;

let _id = 0;
const uid = () => `s${++_id}`;
const sz = (n: number) => n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.round(n / 1024) + " KB";

export default function BatchSOPManager() {
  const [items, setItems] = useState<SOPItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [msg, setMsg] = useState("");
  const [oldTexts, setOldTexts] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const upd = (id: string, patch: Partial<SOPItem>) =>
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));

  const addFiles = useCallback((fl: FileList | null) => {
    if (!fl) return;
    const arr = Array.from(fl).filter(f => /\.(docx?|pdf|txt|zip)$/i.test(f.name));
    setItems(prev => {
      const ex = new Set(prev.map(x => x.name));
      return [...prev, ...arr.filter(f => !ex.has(f.name)).map(f => ({
        id: uid(), file: f, name: f.name, size: f.size, status: "ready" as const,
        previewUrl: f.type === "application/pdf" ? URL.createObjectURL(f) : undefined,
      }))];
    });
  }, []);

  const analyseAll = async () => {
    const toGo = items.filter(i => i.status === "ready" || i.status === "error");
    if (!toGo.length) { setMsg("Keine Dateien zum Analysieren"); return; }
    setLoading(true); setProgress(5);
    setProgressLabel(`Sende ${toGo.length} Datei(en)...`);
    setItems(prev => prev.map(i => toGo.find(t => t.id === i.id) ? { ...i, status: "analysing" } : i));

    try {
      const fd = new FormData();
      toGo.forEach(i => fd.append("files", i.file));
      fd.append("action", "analyse");
      setProgress(20); setProgressLabel("KI-QP analysiert alle SOPs — bitte warten...");
      const resp = await fetch("/api/batch-upload", { method: "POST", body: fd });
      setProgress(85);
      const data = await resp.json();

      if (data.ok) {
        setProgress(100);
        setProgressLabel(`✅ ${data.total} SOPs analysiert (inkl. ZIP-Extraktion)`);
        setMsg(`✅ ${data.total} SOPs analysiert`);

        setItems(prev => {
          let next = [...prev];
          // Update existing + add extracted ZIP entries
          (data.results || []).forEach((r: any) => {
            const match = next.find(i => i.name === r.fileName);
            if (match) {
              next = next.map(i => i.id === match.id ? {
                ...i, status: "done" as const,
                analysis: r.analysis, extractedText: r.extractedText,
                needsUpdate: r.needsUpdate, urgent: r.urgent, showAnalysis: true,
              } : i);
            } else {
              // New item from ZIP extraction
              next.push({
                id: uid(), file: toGo[0]?.file, name: r.fileName, size: r.size || 0,
                status: "done", analysis: r.analysis, extractedText: r.extractedText,
                needsUpdate: r.needsUpdate, urgent: r.urgent, showAnalysis: true,
                fromZip: r.originalName,
              });
            }
          });
          // Mark any still-analysing as done
          return next.map(i => i.status === "analysing" ? { ...i, status: "done" as const } : i);
        });
      } else {
        setMsg("Fehler: " + (data.error || "Unbekannt"));
        setItems(prev => prev.map(i => i.status === "analysing" ? { ...i, status: "error" } : i));
      }
    } catch (e: any) {
      setMsg("Fehler: " + e.message);
      setItems(prev => prev.map(i => i.status === "analysing" ? { ...i, status: "error" } : i));
    }
    setLoading(false);
  };

  const generateUpdate = async (item: SOPItem) => {
    upd(item.id, { status: "analysing" });
    setMsg(`Generiere Update für ${item.name}...`);
    try {
      const fd = new FormData(); fd.append("files", item.file); fd.append("action", "generate-update");
      const resp = await fetch("/api/batch-upload", { method: "POST", body: fd });
      const data = await resp.json();
      if (data.ok && data.results?.[0]) {
        upd(item.id, { status: "done", newVersion: data.results[0].analysis, showComparison: true });
        setMsg("✅ Neue Version generiert");
      } else {
        upd(item.id, { status: "done" });
        setMsg("Fehler: " + (data.error || "Keine Antwort"));
      }
    } catch (e: any) { upd(item.id, { status: "done" }); setMsg("Fehler: " + e.message); }
  };

  const runCompare = async (item: SOPItem) => {
    if (!item.newVersion) { setMsg("Bitte zuerst Update generieren"); return; }
    setMsg("Vergleiche Versionen...");
    try {
      const resp = await fetch("/api/compare", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldText: oldTexts[item.id] || item.extractedText || "",
          newText: item.newVersion,
          sopName: item.name.replace(/\.[^.]+$/, ""),
        }),
      });
      const data = await resp.json();
      if (data.ok) { upd(item.id, { comparisonReport: data.comparison, approved: data.approved }); setMsg("✅ Vergleich abgeschlossen"); }
    } catch (e: any) { setMsg("Fehler: " + e.message); }
  };

  const archive = (id: string, name: string) => {
    upd(id, { status: "filed", needsUpdate: false, urgent: false });
    setMsg(`✅ ${name} archiviert`);
  };

  const urgent = items.filter(i => i.urgent && i.status !== "filed").length;
  const needsUpd = items.filter(i => i.needsUpdate && !i.urgent && i.status !== "filed").length;
  const ok = items.filter(i => i.status === "done" && !i.needsUpdate && !i.urgent).length;
  const filed = items.filter(i => i.status === "filed").length;
  const ready = items.filter(i => i.status === "ready").length;

  return (
    <>
      <style>{CSS}</style>
      <div className="bm">
        <div className="bm-header">
          <div style={{ fontSize: 32 }}>📁</div>
          <div>
            <h1>Batch SOP Manager — NOC Pharma GmbH</h1>
            <p>KI-QP-Analyse · ZIP-Extraktion · Versionsvergleich · BfArM-Audit-Readiness · QP-Freigabe</p>
          </div>
        </div>

        <div className="bm-body">
          <div
            className={`drop-zone${dragOver ? " over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            onClick={() => fileRef.current?.click()}
          >
            <div className="dz-icon">📂</div>
            <h2>SOPs hier ablegen oder klicken</h2>
            <p>ZIP · DOCX · PDF · TXT — ZIP wird automatisch entpackt und alle Dateien angezeigt</p>
            <input ref={fileRef} type="file" multiple accept=".docx,.doc,.pdf,.txt,.zip"
              style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
          </div>

          <div className="toolbar">
            <button className="btn btn-blue" disabled={!ready || loading} onClick={analyseAll}>
              {loading && <span className="spin" />}
              {loading ? "Analysiere..." : `🔍 ${ready} SOP${ready !== 1 ? "s" : ""} analysieren`}
            </button>
            {items.length > 0 && <button className="btn btn-ghost" onClick={() => setItems([])}>Alle entfernen</button>}
            {msg && <span className="msg">{msg}</span>}
          </div>

          {loading && (
            <div className="progress-wrap">
              <div className="progress-label">{progressLabel}</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          {items.length > 0 && (
            <div className="stats">
              <div className="stat"><div className="stat-n">{items.length}</div><div className="stat-l">Gesamt</div></div>
              <div className="stat"><div className="stat-n" style={{ color: "#7c3aed" }}>{ready}</div><div className="stat-l">⏳ Bereit</div></div>
              <div className="stat"><div className="stat-n" style={{ color: "#dc2626" }}>{urgent}</div><div className="stat-l">🔴 Dringend</div></div>
              <div className="stat"><div className="stat-n" style={{ color: "#d97706" }}>{needsUpd}</div><div className="stat-l">⚠️ Update</div></div>
              <div className="stat"><div className="stat-n" style={{ color: "#16a34a" }}>{ok}</div><div className="stat-l">✅ Konform</div></div>
              <div className="stat"><div className="stat-n" style={{ color: "#3b82f6" }}>{filed}</div><div className="stat-l">📁 Archiviert</div></div>
            </div>
          )}

          {items.length === 0 && (
            <div className="empty">
              <div className="empty-icon">🏛️</div>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#475569" }}>ZIP aus Google Drive ablegen — alle SOPs werden entpackt und angezeigt</p>
              <p style={{ fontSize: 12, marginTop: 8 }}>KI analysiert jede SOP auf BfArM-Audit-Readiness</p>
            </div>
          )}

          {items.map(item => {
            const cc = item.status === "filed" ? "filed" : item.status === "analysing" ? "analysing"
              : item.urgent ? "urgent" : item.needsUpdate ? "warning" : item.status === "done" ? "ok" : "";
            return (
              <div key={item.id} className={`sop-card ${cc}`}>
                <div className="sop-top">
                  <span className="sop-icon">
                    {item.status === "filed" ? "📁" : item.status === "analysing" ? "⏳"
                      : /\.pdf$/i.test(item.name) ? "📄" : /\.zip$/i.test(item.name) ? "📦" : "📝"}
                  </span>
                  <div className="sop-info">
                    <div className="sop-name">{item.name}</div>
                    <div className="sop-meta">
                      {sz(item.size)}
                      {item.fromZip && <span className="zip-tag">📦 aus ZIP</span>}
                      {item.status === "analysing" && " · Analysiere..."}
                      {item.status === "done" && " · Analysiert ✓"}
                      {item.status === "filed" && " · Archiviert ✓"}
                    </div>
                  </div>
                  <div className="sop-badges">
                    {item.status === "ready" && <span className="badge badge-purple">Bereit</span>}
                    {item.status === "analysing" && <span className="badge badge-purple"><span className="spin" style={{ borderTopColor: "#7c3aed" }} />Läuft</span>}
                    {item.status === "filed" && <span className="badge badge-blue">📁 Archiviert</span>}
                    {item.urgent && item.status !== "filed" && <span className="badge badge-red">🔴 DRINGEND</span>}
                    {item.needsUpdate && !item.urgent && item.status !== "filed" && <span className="badge badge-amber">⚠️ Update</span>}
                    {item.status === "done" && !item.needsUpdate && !item.urgent && <span className="badge badge-green">✅ Konform</span>}
                  </div>
                  <button className="btn btn-ghost btn-sm" onClick={() => setItems(prev => prev.filter(x => x.id !== item.id))}>✕</button>
                </div>

                {item.status !== "analysing" && item.status !== "ready" && (
                  <div className="sop-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => upd(item.id, { showOriginal: !item.showOriginal })}>
                      {item.showOriginal ? "▲ Ausblenden" : "📄 Original anzeigen"}
                    </button>
                    {item.analysis && (
                      <button className="btn btn-ghost btn-sm" onClick={() => upd(item.id, { showAnalysis: !item.showAnalysis })}>
                        {item.showAnalysis ? "▲ Analyse ausblenden" : "🔍 Analyse anzeigen"}
                      </button>
                    )}
                    {item.needsUpdate && !item.newVersion && (
                      <button className="btn btn-amber btn-sm" onClick={() => generateUpdate(item)}>🤖 Update generieren</button>
                    )}
                    {item.newVersion && (
                      <button className="btn btn-blue btn-sm" onClick={() => upd(item.id, { showComparison: !item.showComparison })}>
                        {item.showComparison ? "▲ Vergleich ausblenden" : "⇔ Alt vs Neu"}
                      </button>
                    )}
                    {item.status === "done" && (
                      <button className="btn btn-green btn-sm" onClick={() => archive(item.id, item.name)}>📁 Archivieren</button>
                    )}
                    {item.analysis && (
                      <button className="btn btn-ghost btn-sm" onClick={() => {
                        const b = new Blob([item.newVersion || item.analysis || ""], { type: "text/plain;charset=utf-8" });
                        const a = document.createElement("a"); a.href = URL.createObjectURL(b);
                        a.download = item.name.replace(/\.[^.]+$/, "") + "_analysiert.txt"; a.click();
                      }}>💾 Export</button>
                    )}
                    {item.previewUrl && (
                      <a href={item.previewUrl} target="_blank" rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm" style={{ textDecoration: "none" }}>👁 PDF öffnen</a>
                    )}
                  </div>
                )}

                {item.showOriginal && (
                  <div className="panel">
                    <div className="panel-title">📄 Originaldokument — {item.name}</div>
                    {item.previewUrl
                      ? <iframe src={item.previewUrl} className="pdf-frame" title="PDF" />
                      : <div className="original-viewer"><pre>{item.extractedText || "Kein Text extrahiert — analysieren Sie zuerst."}</pre></div>
                    }
                  </div>
                )}

                {item.showAnalysis && item.analysis && (
                  <div className="panel">
                    <div className="panel-title">🔍 KI-QP-Analyse (BfArM-Audit-Readiness)</div>
                    <div className="analysis-viewer">{item.analysis}</div>
                  </div>
                )}

                {item.showComparison && item.newVersion && (
                  <div className="panel" style={{ background: "#1e293b" }}>
                    <div className="panel-title" style={{ color: "#94a3b8" }}>⇔ Versionsvergleich — {item.name}</div>
                    <div className="compare-grid">
                      <div className="compare-panel">
                        <h4>ALTE VERSION</h4>
                        <textarea
                          value={oldTexts[item.id] || item.extractedText || ""}
                          onChange={e => setOldTexts(p => ({ ...p, [item.id]: e.target.value }))}
                          placeholder="Original SOP Text..."
                        />
                      </div>
                      <div className="compare-panel">
                        <h4>NEUE VERSION — KI-generiert</h4>
                        <textarea value={item.newVersion} readOnly />
                      </div>
                    </div>
                    <button className="btn btn-blue btn-sm" onClick={() => runCompare(item)}>🔍 Vergleich starten</button>
                    {item.comparisonReport && (
                      <>
                        <div className="compare-report">{item.comparisonReport}</div>
                        <div className="accept-bar">
                          <span style={{ fontSize: 24 }}>{item.approved ? "✅" : "⚠️"}</span>
                          <p>{item.approved ? "Freigabe empfohlen. QP-Unterschrift erforderlich." : "Überarbeitung empfohlen vor Freigabe."}</p>
                          <button className="btn btn-green btn-sm" onClick={() => archive(item.id, item.name)}>📁 Akzeptieren & Archivieren</button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
