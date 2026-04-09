"use client";
import { useState, useRef, useCallback } from "react";

interface AnalysisResult {
  fileName: string;
  sopName: string;
  analysis: string;
  needsUpdate: boolean;
  urgent: boolean;
  error?: boolean;
  processedAt?: string;
  approved?: boolean;
  rejected?: boolean;
  newVersion?: string;
  comparisonReport?: string;
}

const CSS = `
  .batch-container { font-family: 'Segoe UI', system-ui, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f8fafc; min-height: 100vh; }
  .batch-header { background: linear-gradient(135deg, #0d47a1 0%, #1565c0 100%); color: white; padding: 24px 32px; border-radius: 12px; margin-bottom: 24px; }
  .batch-header h1 { margin: 0 0 8px 0; font-size: 22px; font-weight: 700; }
  .batch-header p { margin: 0; font-size: 13px; opacity: 0.85; }
  .drop-zone { border: 2px dashed #94a3b8; border-radius: 12px; padding: 48px 32px; text-align: center; background: white; cursor: pointer; transition: all 0.2s; margin-bottom: 20px; }
  .drop-zone:hover, .drop-zone.drag-over { border-color: #0d47a1; background: #eff6ff; }
  .drop-zone h2 { margin: 0 0 8px 0; font-size: 18px; color: #1e293b; }
  .drop-zone p { margin: 0; color: #64748b; font-size: 13px; }
  .drop-icon { font-size: 48px; margin-bottom: 16px; }
  .file-list { background: white; border-radius: 12px; padding: 16px; margin-bottom: 20px; border: 1px solid #e2e8f0; }
  .file-item { display: flex; align-items: center; gap: 12px; padding: 10px; border-radius: 8px; margin-bottom: 8px; background: #f8fafc; }
  .file-item:last-child { margin-bottom: 0; }
  .file-icon { font-size: 20px; }
  .file-name { flex: 1; font-size: 13px; font-weight: 600; color: #1e293b; }
  .file-size { font-size: 11px; color: #94a3b8; }
  .file-remove { background: none; border: none; cursor: pointer; color: #ef4444; font-size: 16px; padding: 4px; }
  .action-bar { display: flex; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
  .btn { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.2s; }
  .btn-primary { background: #0d47a1; color: white; }
  .btn-primary:hover { background: #1565c0; }
  .btn-primary:disabled { background: #94a3b8; cursor: not-allowed; }
  .btn-secondary { background: white; color: #0d47a1; border: 1px solid #0d47a1; }
  .btn-danger { background: #dc2626; color: white; }
  .btn-success { background: #16a34a; color: white; }
  .btn-warn { background: #d97706; color: white; }
  .progress-bar { background: #e2e8f0; border-radius: 99px; height: 8px; margin-bottom: 20px; overflow: hidden; }
  .progress-fill { background: linear-gradient(90deg, #0d47a1, #2196f3); height: 100%; border-radius: 99px; transition: width 0.3s; }
  .results-grid { display: flex; flex-direction: column; gap: 16px; }
  .result-card { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
  .result-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
  .result-status { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .status-urgent { background: #ef4444; }
  .status-warning { background: #f59e0b; }
  .status-ok { background: #22c55e; }
  .result-title { flex: 1; font-size: 14px; font-weight: 700; color: #1e293b; }
  .result-badge { padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; }
  .badge-urgent { background: #fee2e2; color: #dc2626; }
  .badge-update { background: #fef3c7; color: #d97706; }
  .badge-ok { background: #dcfce7; color: #16a34a; }
  .result-body { padding: 20px; }
  .analysis-text { font-size: 13px; line-height: 1.7; color: #374151; white-space: pre-wrap; font-family: 'Segoe UI', sans-serif; }
  .analysis-text h2, .analysis-text h3 { color: #1e293b; margin: 16px 0 8px 0; }
  .result-actions { display: flex; gap: 8px; padding: 16px 20px; border-top: 1px solid #f1f5f9; background: #f8fafc; flex-wrap: wrap; }
  .compare-section { background: #1e293b; border-radius: 12px; padding: 20px; margin-top: 16px; }
  .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .compare-panel { background: #0f172a; border-radius: 8px; padding: 16px; }
  .compare-panel h4 { color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0; }
  .compare-panel textarea { width: 100%; background: transparent; border: 1px solid #334155; color: #e2e8f0; border-radius: 6px; padding: 10px; font-size: 12px; font-family: monospace; resize: vertical; min-height: 200px; box-sizing: border-box; }
  .compare-report { background: white; border-radius: 8px; padding: 16px; margin-top: 16px; font-size: 13px; line-height: 1.7; white-space: pre-wrap; }
  .approve-bar { display: flex; gap: 12px; margin-top: 16px; padding: 16px; background: #f0fdf4; border-radius: 8px; border: 1px solid #bbf7d0; align-items: center; }
  .approve-bar p { flex: 1; margin: 0; font-size: 13px; color: #166534; font-weight: 600; }
  .stats-bar { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
  .stat-card { background: white; border-radius: 10px; padding: 16px 20px; border: 1px solid #e2e8f0; flex: 1; min-width: 120px; text-align: center; }
  .stat-num { font-size: 28px; font-weight: 800; color: #0d47a1; }
  .stat-label { font-size: 11px; color: #64748b; margin-top: 4px; }
  .loading-spinner { display: inline-block; width: 16px; height: 16px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; margin-right: 8px; vertical-align: middle; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .filed-badge { background: #dbeafe; color: #1d4ed8; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; }
  .empty-state { text-align: center; padding: 48px; color: #94a3b8; }
  .empty-state .icon { font-size: 48px; margin-bottom: 16px; }
`;

export default function BatchSOPManager() {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comparing, setComparing] = useState<{ [k: string]: boolean }>({});
  const [oldTexts, setOldTexts] = useState<{ [k: string]: string }>({});
  const [dragOver, setDragOver] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const arr = Array.from(newFiles).filter(f =>
      f.name.match(/\.(docx?|pdf|txt)$/i)
    );
    setFiles(prev => {
      const existing = new Set(prev.map(f => f.name));
      return [...prev, ...arr.filter(f => !existing.has(f.name))];
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }, [addFiles]);

  const analyseBatch = async () => {
    if (!files.length) return;
    setLoading(true);
    setProgress(0);
    setResults([]);
    setStatusMsg("Analysiere SOPs...");

    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    formData.append("action", "analyse");

    try {
      setProgress(30);
      const resp = await fetch("/api/batch-upload", { method: "POST", body: formData });
      setProgress(80);
      const data = await resp.json();
      if (data.ok) {
        setResults(data.results);
        setProgress(100);
        setStatusMsg(`${data.results.length} SOPs analysiert`);
      } else {
        setStatusMsg("Fehler: " + data.error);
      }
    } catch (e: any) {
      setStatusMsg("Fehler: " + e.message);
    }
    setLoading(false);
  };

  const generateUpdate = async (result: AnalysisResult) => {
    setStatusMsg(`Generiere Update für ${result.sopName}...`);
    const formData = new FormData();
    const file = files.find(f => f.name === result.fileName);
    if (file) formData.append("files", file);
    formData.append("action", "generate-update");

    try {
      const resp = await fetch("/api/batch-upload", { method: "POST", body: formData });
      const data = await resp.json();
      if (data.ok && data.results[0]) {
        setResults(prev => prev.map(r =>
          r.fileName === result.fileName
            ? { ...r, newVersion: data.results[0].analysis }
            : r
        ));
        setComparing(prev => ({ ...prev, [result.fileName]: true }));
        setStatusMsg("Neue Version generiert — Vergleich aktiviert");
      }
    } catch (e: any) {
      setStatusMsg("Fehler: " + e.message);
    }
  };

  const runComparison = async (result: AnalysisResult) => {
    const oldText = oldTexts[result.fileName] || result.analysis;
    const newText = result.newVersion || "";
    if (!newText) { setStatusMsg("Bitte zuerst Update generieren"); return; }

    setStatusMsg("Vergleiche Versionen...");
    try {
      const resp = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldText, newText, sopName: result.sopName }),
      });
      const data = await resp.json();
      if (data.ok) {
        setResults(prev => prev.map(r =>
          r.fileName === result.fileName
            ? { ...r, comparisonReport: data.comparison, approved: data.approved }
            : r
        ));
        setStatusMsg("Vergleich abgeschlossen");
      }
    } catch (e: any) {
      setStatusMsg("Fehler: " + e.message);
    }
  };

  const acceptAndFile = (fileName: string) => {
    setResults(prev => prev.map(r =>
      r.fileName === fileName
        ? { ...r, needsUpdate: false, urgent: false, approved: true, filed: true } as any
        : r
    ));
    setStatusMsg("SOP akzeptiert und archiviert ✅");
  };

  const urgent = results.filter(r => r.urgent).length;
  const needsUpdate = results.filter(r => r.needsUpdate && !r.urgent).length;
  const ok = results.filter(r => !r.needsUpdate && !r.urgent).length;

  return (
    <>
      <style>{CSS}</style>
      <div className="batch-container">
        <div className="batch-header">
          <h1>📁 Batch SOP Manager — NOC Pharma GmbH</h1>
          <p>KI-gestützte Massenanalyse · Versionsvergleich · BfArM-Audit-Readiness · QP-Freigabe-Workflow</p>
        </div>

        {/* Drop Zone */}
        <div
          className={`drop-zone${dragOver ? " drag-over" : ""}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-icon">📂</div>
          <h2>SOPs hier ablegen oder klicken zum Auswählen</h2>
          <p>DOCX, PDF, TXT · Mehrere Dateien gleichzeitig möglich</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".docx,.doc,.pdf,.txt"
            style={{ display: "none" }}
            onChange={e => addFiles(e.target.files)}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="file-list">
            {files.map(f => (
              <div key={f.name} className="file-item">
                <span className="file-icon">{f.name.endsWith(".pdf") ? "📄" : "📝"}</span>
                <span className="file-name">{f.name}</span>
                <span className="file-size">{(f.size / 1024).toFixed(0)} KB</span>
                <button className="file-remove" onClick={() => setFiles(prev => prev.filter(x => x.name !== f.name))}>✕</button>
              </div>
            ))}
          </div>
        )}

        {/* Action Bar */}
        <div className="action-bar">
          <button
            className="btn btn-primary"
            disabled={!files.length || loading}
            onClick={analyseBatch}
          >
            {loading && <span className="loading-spinner" />}
            {loading ? "Analysiere..." : `🔍 Alle ${files.length} SOPs analysieren`}
          </button>
          {files.length > 0 && (
            <button className="btn btn-secondary" onClick={() => setFiles([])}>
              Alle entfernen
            </button>
          )}
          {statusMsg && <span style={{ fontSize: 13, color: "#64748b", padding: "10px 0", alignSelf: "center" }}>{statusMsg}</span>}
        </div>

        {/* Progress */}
        {loading && (
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Stats */}
        {results.length > 0 && (
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-num">{results.length}</div>
              <div className="stat-label">SOPs analysiert</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: "#dc2626" }}>{urgent}</div>
              <div className="stat-label">🔴 Dringend</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: "#d97706" }}>{needsUpdate}</div>
              <div className="stat-label">⚠️ Update nötig</div>
            </div>
            <div className="stat-card">
              <div className="stat-num" style={{ color: "#16a34a" }}>{ok}</div>
              <div className="stat-label">✅ Konform</div>
            </div>
          </div>
        )}

        {/* Results */}
        {results.length === 0 && !loading && (
          <div className="empty-state">
            <div className="icon">🏛️</div>
            <p>Laden Sie SOPs hoch und starten Sie die KI-Analyse</p>
          </div>
        )}

        <div className="results-grid">
          {results.map(result => {
            const isExpanded = expandedId === result.fileName;
            const isComparing = comparing[result.fileName];

            return (
              <div key={result.fileName} className="result-card">
                <div className="result-header" onClick={() => setExpandedId(isExpanded ? null : result.fileName)}>
                  <div className={`result-status ${result.urgent ? "status-urgent" : result.needsUpdate ? "status-warning" : "status-ok"}`} />
                  <span className="result-title">{result.sopName}</span>
                  {(result as any).filed && <span className="filed-badge">📁 Archiviert</span>}
                  {result.urgent && <span className="result-badge badge-urgent">🔴 DRINGEND</span>}
                  {result.needsUpdate && !result.urgent && <span className="result-badge badge-update">⚠️ Update</span>}
                  {!result.needsUpdate && !result.urgent && <span className="result-badge badge-ok">✅ Konform</span>}
                  <span style={{ color: "#94a3b8", fontSize: 18 }}>{isExpanded ? "▲" : "▼"}</span>
                </div>

                {isExpanded && (
                  <>
                    <div className="result-body">
                      <div className="analysis-text">{result.analysis}</div>

                      {/* Comparison Section */}
                      {isComparing && result.newVersion && (
                        <div className="compare-section">
                          <h3 style={{ color: "white", margin: "0 0 16px 0", fontSize: 14 }}>⇔ Versionsvergleich</h3>
                          <div className="compare-grid">
                            <div className="compare-panel">
                              <h4>ALTE VERSION</h4>
                              <textarea
                                value={oldTexts[result.fileName] || ""}
                                onChange={e => setOldTexts(prev => ({ ...prev, [result.fileName]: e.target.value }))}
                                placeholder="Fügen Sie den alten SOP-Text hier ein..."
                              />
                            </div>
                            <div className="compare-panel">
                              <h4>NEUE VERSION (KI-generiert)</h4>
                              <textarea
                                value={result.newVersion}
                                readOnly
                                style={{ opacity: 0.9 }}
                              />
                            </div>
                          </div>
                          <button
                            className="btn btn-secondary"
                            style={{ marginTop: 12, background: "#334155", color: "white", border: "none" }}
                            onClick={() => runComparison(result)}
                          >
                            🔍 Vergleich starten
                          </button>

                          {result.comparisonReport && (
                            <div className="compare-report">
                              <div className="analysis-text">{result.comparisonReport}</div>
                            </div>
                          )}

                          {result.approved && (
                            <div className="approve-bar">
                              <span style={{ fontSize: 24 }}>✅</span>
                              <p>KI-Empfehlung: Freigabe empfohlen. QP-Unterschrift erforderlich.</p>
                              <button className="btn btn-success" onClick={() => acceptAndFile(result.fileName)}>
                                📁 Akzeptieren & Archivieren
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="result-actions">
                      {result.needsUpdate && !isComparing && (
                        <button className="btn btn-warn" onClick={() => generateUpdate(result)}>
                          🤖 Update generieren
                        </button>
                      )}
                      {isComparing && !result.comparisonReport && (
                        <button className="btn btn-primary" onClick={() => runComparison(result)}>
                          ⇔ Vergleich starten
                        </button>
                      )}
                      {result.comparisonReport && !result.approved && (
                        <button className="btn btn-success" onClick={() => acceptAndFile(result.fileName)}>
                          ✅ Akzeptieren & Archivieren
                        </button>
                      )}
                      <button className="btn btn-secondary" onClick={() => {
                        const blob = new Blob([result.newVersion || result.analysis], { type: "text/plain" });
                        const a = document.createElement("a");
                        a.href = URL.createObjectURL(blob);
                        a.download = `${result.sopName}_analysiert.txt`;
                        a.click();
                      }}>
                        💾 Export
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
