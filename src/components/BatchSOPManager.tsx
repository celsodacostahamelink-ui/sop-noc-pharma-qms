"use client";
import { useState, useRef, useCallback } from "react";

interface UploadedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  extractedText?: string;
  status: "ready" | "analysing" | "done" | "error" | "filed";
  analysis?: string;
  needsUpdate?: boolean;
  urgent?: boolean;
  newVersion?: string;
  comparisonReport?: string;
  approved?: boolean;
  showOriginal?: boolean;
  showAnalysis?: boolean;
  showComparison?: boolean;
}

const CSS = `
  * { box-sizing: border-box; }
  .bm { font-family: 'Segoe UI', system-ui, sans-serif; background: #f1f5f9; min-height: 100vh; padding: 0; }
  .bm-header { background: linear-gradient(135deg, #0d47a1 0%, #1565c0 50%, #0288d1 100%); color: white; padding: 20px 28px; display: flex; align-items: center; gap: 16px; }
  .bm-header h1 { margin: 0; font-size: 18px; font-weight: 800; letter-spacing: -0.5px; }
  .bm-header p { margin: 4px 0 0; font-size: 12px; opacity: 0.8; }
  .bm-body { padding: 20px 28px; }
  .drop-zone { border: 2px dashed #cbd5e1; border-radius: 16px; padding: 40px; text-align: center; background: white; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
  .drop-zone.over { border-color: #0d47a1; background: #eff6ff; transform: scale(1.01); }
  .drop-zone h2 { margin: 12px 0 8px; font-size: 17px; color: #1e293b; }
  .drop-zone p { margin: 0; color: #64748b; font-size: 12px; }
  .dz-icon { font-size: 40px; }
  .toolbar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; align-items: center; }
  .btn { padding: 9px 18px; border-radius: 8px; border: none; cursor: pointer; font-size: 12px; font-weight: 700; transition: all 0.15s; white-space: nowrap; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-blue { background: #0d47a1; color: white; }
  .btn-blue:hover:not(:disabled) { background: #1565c0; }
  .btn-green { background: #16a34a; color: white; }
  .btn-green:hover:not(:disabled) { background: #15803d; }
  .btn-amber { background: #d97706; color: white; }
  .btn-amber:hover:not(:disabled) { background: #b45309; }
  .btn-ghost { background: white; color: #374151; border: 1px solid #d1d5db; }
  .btn-ghost:hover:not(:disabled) { background: #f9fafb; }
  .btn-red { background: #dc2626; color: white; }
  .spin { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: sp 0.7s linear infinite; margin-right: 6px; vertical-align: middle; }
  @keyframes sp { to { transform: rotate(360deg); } }
  .stats { display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  .stat { background: white; border-radius: 10px; padding: 14px 18px; border: 1px solid #e2e8f0; flex: 1; min-width: 100px; text-align: center; }
  .stat-n { font-size: 26px; font-weight: 900; }
  .stat-l { font-size: 11px; color: #64748b; margin-top: 2px; }
  .sop-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 14px; overflow: hidden; transition: box-shadow 0.2s; }
  .sop-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); }
  .sop-card.urgent { border-left: 4px solid #ef4444; }
  .sop-card.warning { border-left: 4px solid #f59e0b; }
  .sop-card.ok { border-left: 4px solid #22c55e; }
  .sop-card.filed { border-left: 4px solid #3b82f6; opacity: 0.7; }
  .sop-top { display: flex; align-items: center; gap: 12px; padding: 14px 18px; }
  .sop-icon { font-size: 22px; flex-shrink: 0; }
  .sop-info { flex: 1; min-width: 0; }
  .sop-name { font-size: 14px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sop-meta { font-size: 11px; color: #94a3b8; margin-top: 2px; }
  .sop-badges { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
  .badge { padding: 2px 8px; border-radius: 99px; font-size: 10px; font-weight: 800; }
  .badge-red { background: #fee2e2; color: #dc2626; }
  .badge-amber { background: #fef3c7; color: #d97706; }
  .badge-green { background: #dcfce7; color: #16a34a; }
  .badge-blue { background: #dbeafe; color: #1d4ed8; }
  .badge-gray { background: #f1f5f9; color: #64748b; }
  .sop-actions { display: flex; gap: 6px; flex-wrap: wrap; padding: 10px 18px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
  .panel { padding: 18px; border-top: 1px solid #f1f5f9; }
  .panel-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-bottom: 12px; }
  .original-viewer { background: #0f172a; border-radius: 8px; padding: 16px; max-height: 300px; overflow-y: auto; }
  .original-viewer pre { color: #e2e8f0; font-size: 11px; font-family: 'Consolas', monospace; white-space: pre-wrap; margin: 0; line-height: 1.6; }
  .analysis-viewer { font-size: 13px; line-height: 1.75; color: #374151; white-space: pre-wrap; max-height: 500px; overflow-y: auto; padding-right: 8px; }
  .analysis-viewer strong { color: #1e293b; }
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
  .compare-panel { background: #1e293b; border-radius: 8px; padding: 14px; }
  .compare-panel h4 { color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px; }
  .compare-panel textarea { width: 100%; background: #0f172a; border: 1px solid #334155; color: #e2e8f0; border-radius: 6px; padding: 10px; font-size: 11px; font-family: monospace; resize: vertical; min-height: 180px; }
  .compare-report { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; font-size: 13px; line-height: 1.7; white-space: pre-wrap; max-height: 400px; overflow-y: auto; }
  .accept-bar { display: flex; align-items: center; gap: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 18px; margin-top: 12px; }
  .accept-bar p { flex: 1; margin: 0; font-size: 13px; font-weight: 700; color: #15803d; }
  .progress-wrap { margin-bottom: 18px; }
  .progress-bar { background: #e2e8f0; border-radius: 99px; height: 6px; overflow: hidden; }
  .progress-fill { background: linear-gradient(90deg, #0d47a1, #0288d1); height: 100%; border-radius: 99px; transition: width 0.4s; }
  .progress-label { font-size: 11px; color: #64748b; margin-bottom: 6px; }
  .empty { text-align: center; padding: 60px 20px; color: #94a3b8; }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .msg { font-size: 12px; color: #64748b; padding: 8px 0; align-self: center; }
  @media (max-width: 640px) { .compare-grid { grid-template-columns: 1fr; } }
`;

function sizeStr(n: number) {
  return n > 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + " MB" : Math.round(n / 1024) + " KB";
}

export default function BatchSOPManager() {
  const [items, setItems] = useState<UploadedFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [msg, setMsg] = useState("");
  const [oldTexts, setOldTexts] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const updateItem = (name: string, patch: Partial<UploadedFile>) =>
    setItems(prev => prev.map(i => i.name === name ? { ...i, ...patch } : i));

  const addFiles = useCallback((fl: FileList | null) => {
    if (!fl) return;
    const arr = Array.from(fl).filter(f => /\.(docx?|pdf|txt)$/i.test(f.name));
    setItems(prev => {
      const existing = new Set(prev.map(x => x.name));
      const newItems: UploadedFile[] = arr
        .filter(f => !existing.has(f.name))
        .map(f => ({
          file: f,
          name: f.name,
          size: f.size,
          type: f.type,
          status: "ready",
          previewUrl: f.type === "application/pdf" ? URL.createObjectURL(f) : undefined,
        }));
      return [...prev, ...newItems];
    });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const analyseAll = async () => {
    const ready = items.filter(i => i.status === "ready" || i.status === "done");
    if (!ready.length) { setMsg("Keine Dateien zum Analysieren"); return; }
    setGlobalLoading(true);
    setProgress(0);

    for (let idx = 0; idx < ready.length; idx++) {
      const item = ready[idx];
      setProgressLabel(`Analysiere ${idx + 1}/${ready.length}: ${item.name}`);
      setProgress(Math.round((idx / ready.length) * 100));
      updateItem(item.name, { status: "analysing" });

      try {
        const fd = new FormData();
        fd.append("files", item.file);
        fd.append("action", "analyse");
        const resp = await fetch("/api/batch-upload", { method: "POST", body: fd });
        const data = await resp.json();
        if (data.ok && data.results[0]) {
          const r = data.results[0];
          updateItem(item.name, {
            status: "done",
            analysis: r.analysis,
            needsUpdate: r.needsUpdate,
            urgent: r.urgent,
            showAnalysis: true,
          });
        } else {
          updateItem(item.name, { status: "error", analysis: data.error || "Fehler bei der Analyse" });
        }
      } catch (e: any) {
        updateItem(item.name, { status: "error", analysis: e.message });
      }
    }

    setProgress(100);
    setProgressLabel("Analyse abgeschlossen");
    setGlobalLoading(false);
    setMsg(`✅ ${ready.length} SOPs analysiert`);
  };

  const generateUpdate = async (item: UploadedFile) => {
    updateItem(item.name, { status: "analysing" });
    setMsg(`Generiere Update für ${item.name}...`);
    try {
      const fd = new FormData();
      fd.append("files", item.file);
      fd.append("action", "generate-update");
      const resp = await fetch("/api/batch-upload", { method: "POST", body: fd });
      const data = await resp.json();
      if (data.ok && data.results[0]) {
        updateItem(item.name, {
          status: "done",
          newVersion: data.results[0].analysis,
          showComparison: true,
        });
        setMsg("✅ Neue Version generiert");
      }
    } catch (e: any) {
      updateItem(item.name, { status: "done" });
      setMsg("Fehler: " + e.message);
    }
  };

  const runCompare = async (item: UploadedFile) => {
    if (!item.newVersion) { setMsg("Bitte zuerst Update generieren"); return; }
    setMsg("Vergleiche Versionen...");
    try {
      const resp = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldText: oldTexts[item.name] || item.analysis || "",
          newText: item.newVersion,
          sopName: item.name.replace(/\.[^.]+$/, ""),
        }),
      });
      const data = await resp.json();
      if (data.ok) {
        updateItem(item.name, {
          comparisonReport: data.comparison,
          approved: data.approved,
        });
        setMsg("✅ Vergleich abgeschlossen");
      }
    } catch (e: any) {
      setMsg("Fehler: " + e.message);
    }
  };

  const fileAndArchive = (name: string) => {
    updateItem(name, { status: "filed", needsUpdate: false, urgent: false });
    setMsg(`✅ ${name} archiviert`);
  };

  const urgent = items.filter(i => i.urgent).length;
  const needsUpd = items.filter(i => i.needsUpdate && !i.urgent).length;
  const ok = items.filter(i => i.status === "done" && !i.needsUpdate && !i.urgent).length;
  const filed = items.filter(i => i.status === "filed").length;

  return (
    <>
      <style>{CSS}</style>
      <div className="bm">
        <div className="bm-header">
          <div>
            <div style={{ fontSize: 28 }}>📁</div>
          </div>
          <div>
            <h1>Batch SOP Manager — NOC Pharma GmbH</h1>
            <p>KI-QP-Analyse · Versionsvergleich · BfArM-Audit-Readiness · QP-Freigabe</p>
          </div>
        </div>

        <div className="bm-body">
          {/* Drop zone */}
          <div
            className={`drop-zone${dragOver ? " over" : ""}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <div className="dz-icon">📂</div>
            <h2>SOPs hier ablegen oder klicken</h2>
            <p>DOCX · PDF · TXT — mehrere Dateien gleichzeitig</p>
            <input ref={fileRef} type="file" multiple accept=".docx,.doc,.pdf,.txt" style={{ display: "none" }} onChange={e => addFiles(e.target.files)} />
          </div>

          {/* Toolbar */}
          <div className="toolbar">
            <button className="btn btn-blue" disabled={!items.length || globalLoading} onClick={analyseAll}>
              {globalLoading && <span className="spin" />}
              {globalLoading ? "Analysiere..." : `🔍 Alle ${items.length} SOPs analysieren`}
            </button>
            {items.length > 0 && <button className="btn btn-ghost" onClick={() => setItems([])}>Alle entfernen</button>}
            {msg && <span className="msg">{msg}</span>}
          </div>

          {/* Progress */}
          {globalLoading && (
            <div className="progress-wrap">
              <div className="progress-label">{progressLabel}</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}

          {/* Stats */}
          {items.length > 0 && (
            <div className="stats">
              <div className="stat"><div className="stat-n">{items.length}</div><div className="stat-l">Gesamt</div></div>
              <div className="stat"><div className="stat-n" style={{ color: "#dc2626" }}>{urgent}</div><div className="stat-l">🔴 Dringend</div></div>
              <div className="stat"><div className="stat-n" style={{ color: "#d97706" }}>{needsUpd}</div><div className="stat-l">⚠️ Update nötig</div></div>
              <div className="stat"><div className="stat-n" style={{ color: "#16a34a" }}>{ok}</div><div className="stat-l">✅ Konform</div></div>
              <div className="stat"><div className="stat-n" style={{ color: "#3b82f6" }}>{filed}</div><div className="stat-l">📁 Archiviert</div></div>
            </div>
          )}

          {/* Empty state */}
          {items.length === 0 && (
            <div className="empty">
              <div className="empty-icon">🏛️</div>
              <p>Laden Sie Ihre SOPs hoch — die KI analysiert alle auf BfArM-Audit-Readiness</p>
            </div>
          )}

          {/* SOP Cards */}
          {items.map(item => {
            const cardClass = item.status === "filed" ? "filed" : item.urgent ? "urgent" : item.needsUpdate ? "warning" : item.status === "done" ? "ok" : "";

            return (
              <div key={item.name} className={`sop-card ${cardClass}`}>
                {/* Top row */}
                <div className="sop-top">
                  <span className="sop-icon">
                    {item.status === "filed" ? "📁" : item.status === "analysing" ? "⏳" : item.name.endsWith(".pdf") ? "📄" : "📝"}
                  </span>
                  <div className="sop-info">
                    <div className="sop-name">{item.name}</div>
                    <div className="sop-meta">{sizeStr(item.size)} · {item.status === "analysing" ? "Wird analysiert..." : item.status === "done" ? "Analysiert" : item.status === "filed" ? "Archiviert" : "Bereit"}</div>
                  </div>
                  <div className="sop-badges">
                    {item.status === "filed" && <span className="badge badge-blue">📁 Archiviert</span>}
                    {item.urgent && <span className="badge badge-red">🔴 DRINGEND</span>}
                    {item.needsUpdate && !item.urgent && <span className="badge badge-amber">⚠️ Update nötig</span>}
                    {item.status === "done" && !item.needsUpdate && !item.urgent && <span className="badge badge-green">✅ Konform</span>}
                    {item.status === "ready" && <span className="badge badge-gray">Bereit</span>}
                    {item.status === "analysing" && <span className="badge badge-gray"><span className="spin" style={{ borderTopColor: "#374151" }} />Analysiere...</span>}
                  </div>
                  <button
                    className="btn btn-ghost"
                    style={{ padding: "4px 10px", fontSize: 11 }}
                    onClick={() => setItems(prev => prev.filter(x => x.name !== item.name))}
                  >✕</button>
                </div>

                {/* Action buttons */}
                {item.status !== "analysing" && (
                  <div className="sop-actions">
                    {/* Show original */}
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 11, padding: "6px 12px" }}
                      onClick={() => updateItem(item.name, { showOriginal: !item.showOriginal })}
                    >
                      {item.showOriginal ? "▲ Original ausblenden" : "📄 Original anzeigen"}
                    </button>

                    {/* Show analysis */}
                    {item.analysis && (
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 11, padding: "6px 12px" }}
                        onClick={() => updateItem(item.name, { showAnalysis: !item.showAnalysis })}
                      >
                        {item.showAnalysis ? "▲ Analyse ausblenden" : "🔍 Analyse anzeigen"}
                      </button>
                    )}

                    {/* Generate update */}
                    {item.needsUpdate && item.status === "done" && !item.newVersion && (
                      <button className="btn btn-amber" style={{ fontSize: 11, padding: "6px 12px" }} onClick={() => generateUpdate(item)}>
                        🤖 Update generieren
                      </button>
                    )}

                    {/* Compare */}
                    {item.newVersion && (
                      <button
                        className="btn btn-blue"
                        style={{ fontSize: 11, padding: "6px 12px" }}
                        onClick={() => updateItem(item.name, { showComparison: !item.showComparison })}
                      >
                        {item.showComparison ? "▲ Vergleich ausblenden" : "⇔ Alt vs Neu vergleichen"}
                      </button>
                    )}

                    {/* Accept & file */}
                    {item.status === "done" && item.status !== "filed" && (
                      <button className="btn btn-green" style={{ fontSize: 11, padding: "6px 12px" }} onClick={() => fileAndArchive(item.name)}>
                        📁 Akzeptieren & archivieren
                      </button>
                    )}

                    {/* Download */}
                    {item.analysis && (
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 11, padding: "6px 12px" }}
                        onClick={() => {
                          const blob = new Blob([item.newVersion || item.analysis || ""], { type: "text/plain;charset=utf-8" });
                          const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
                          a.download = item.name.replace(/\.[^.]+$/, "") + "_analysiert.txt"; a.click();
                        }}
                      >💾 Export</button>
                    )}

                    {/* PDF viewer link */}
                    {item.previewUrl && (
                      <a href={item.previewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" style={{ fontSize: 11, padding: "6px 12px", textDecoration: "none" }}>
                        👁 PDF öffnen
                      </a>
                    )}
                  </div>
                )}

                {/* Original content panel */}
                {item.showOriginal && (
                  <div className="panel">
                    <div className="panel-title">📄 Originaldokument — {item.name}</div>
                    {item.previewUrl ? (
                      <iframe src={item.previewUrl} style={{ width: "100%", height: 500, border: "none", borderRadius: 8 }} title="PDF Preview" />
                    ) : (
                      <div className="original-viewer">
                        <pre>{item.extractedText || "Text wird geladen — analysieren Sie zuerst die Datei um den Inhalt zu extrahieren."}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Analysis panel */}
                {item.showAnalysis && item.analysis && (
                  <div className="panel">
                    <div className="panel-title">🔍 KI-QP-Analyse</div>
                    <div className="analysis-viewer">{item.analysis}</div>
                  </div>
                )}

                {/* Comparison panel */}
                {item.showComparison && item.newVersion && (
                  <div className="panel" style={{ background: "#1e293b" }}>
                    <div className="panel-title" style={{ color: "#94a3b8" }}>⇔ Versionsvergleich</div>
                    <div className="compare-grid">
                      <div className="compare-panel">
                        <h4>ALTE VERSION — fügen Sie hier den Original-SOP-Text ein</h4>
                        <textarea
                          value={oldTexts[item.name] || ""}
                          onChange={e => setOldTexts(prev => ({ ...prev, [item.name]: e.target.value }))}
                          placeholder="Original SOP Text hier einfügen..."
                        />
                      </div>
                      <div className="compare-panel">
                        <h4>NEUE VERSION — KI-generiert</h4>
                        <textarea value={item.newVersion} readOnly />
                      </div>
                    </div>
                    <button className="btn btn-blue" onClick={() => runCompare(item)}>
                      🔍 Vergleich starten
                    </button>

                    {item.comparisonReport && (
                      <>
                        <div className="compare-report" style={{ marginTop: 14 }}>{item.comparisonReport}</div>
                        {item.approved && (
                          <div className="accept-bar">
                            <span style={{ fontSize: 24 }}>✅</span>
                            <p>KI-Empfehlung: Freigabe empfohlen. QP-Unterschrift erforderlich.</p>
                            <button className="btn btn-green" onClick={() => fileAndArchive(item.name)}>
                              📁 Akzeptieren & Archivieren
                            </button>
                          </div>
                        )}
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
