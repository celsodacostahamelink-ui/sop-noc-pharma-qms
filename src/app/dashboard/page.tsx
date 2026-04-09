"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const QMSApp = dynamic(() => import("@/components/QMSApp.jsx"), { ssr: false });
const BatchSOPManager = dynamic(() => import("@/components/BatchSOPManager"), { ssr: false });

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"qms" | "batch">("qms");

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setUser(data.user);
        else window.location.href = "/";
        setLoading(false);
      })
      .catch(() => { window.location.href = "/"; setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🏛️</div>
        <div style={{ color: "#555", fontSize: 12 }}>Loading NOC Pharma QMS...</div>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div>
      {/* Top bar */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "4px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "system-ui" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 9, color: "#555" }}>
            Signed in as <strong style={{ color: "#aaa" }}>{user.name}</strong> ({user.role}) — {user.email}
          </div>
          {/* Tab switcher */}
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => setActiveTab("qms")}
              style={{
                padding: "3px 10px", borderRadius: 4, border: "none", fontSize: 10, cursor: "pointer", fontWeight: 600,
                background: activeTab === "qms" ? "#0d47a1" : "transparent",
                color: activeTab === "qms" ? "white" : "#666",
              }}
            >
              🏛️ QMS
            </button>
            <button
              onClick={() => setActiveTab("batch")}
              style={{
                padding: "3px 10px", borderRadius: 4, border: "none", fontSize: 10, cursor: "pointer", fontWeight: 600,
                background: activeTab === "batch" ? "#0d47a1" : "transparent",
                color: activeTab === "batch" ? "white" : "#666",
              }}
            >
              📁 Batch SOP Upload
            </button>
          </div>
        </div>
        <button
          onClick={() => { document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; window.location.href = "/"; }}
          style={{ padding: "2px 8px", borderRadius: 3, border: "1px solid #222", background: "transparent", color: "#666", fontSize: 9, cursor: "pointer" }}
        >
          Sign Out
        </button>
      </div>

      {/* Content */}
      {activeTab === "qms" && <QMSApp />}
      {activeTab === "batch" && <BatchSOPManager />}
    </div>
  );
}
