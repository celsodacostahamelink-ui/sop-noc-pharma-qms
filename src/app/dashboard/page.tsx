"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Load QMS app without SSR (it uses browser APIs)
const QMSApp = dynamic(() => import("@/components/QMSApp.jsx"), { ssr: false });

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth")
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.user);
        } else {
          window.location.href = "/";
        }
        setLoading(false);
      })
      .catch(() => {
        window.location.href = "/";
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#060606", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🏛️</div>
          <div style={{ color: "#555", fontSize: 12 }}>Loading NOC Pharma QMS...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div>
      {/* User bar */}
      <div style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1a1a", padding: "4px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "system-ui" }}>
        <div style={{ fontSize: 9, color: "#555" }}>
          Signed in as <strong style={{ color: "#aaa" }}>{user.name}</strong> ({user.role}) — {user.email}
        </div>
        <button
          onClick={async () => {
            document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            window.location.href = "/";
          }}
          style={{ padding: "2px 8px", borderRadius: 3, border: "1px solid #222", background: "transparent", color: "#666", fontSize: 9, cursor: "pointer" }}
        >
          Sign Out
        </button>
      </div>
      <QMSApp />
    </div>
  );
}
