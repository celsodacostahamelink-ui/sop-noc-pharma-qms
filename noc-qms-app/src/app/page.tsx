"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("celso@nocpharma.de");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (e) {
      setError("Connection error");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#060a12,#0a1628,#132d4f)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
      <div style={{ background: "#0d1b2a", borderRadius: 12, padding: 36, maxWidth: 420, width: "90%", border: "1px solid #1e3a5f", boxShadow: "0 8px 40px rgba(0,0,0,.5)" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🏛️</div>
          <h1 style={{ margin: "0 0 4px", fontSize: 22, color: "#fff", fontWeight: 800 }}>NOC Pharma GmbH</h1>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>Qualitätsmanagementsystem</div>
          <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>EU GMP · EU GDP · PIC/S PE 009-17 · MedCanG · AMG</div>
        </div>

        {error && (
          <div style={{ padding: "8px 12px", background: "#1a0808", border: "1px solid #7f1d1d", borderRadius: 6, color: "#fca5a5", fontSize: 12, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4, fontWeight: 600 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "10px 12px", background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 6, color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 11, color: "#94a3b8", display: "block", marginBottom: 4, fontWeight: 600 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ width: "100%", padding: "10px 12px", background: "#0a1628", border: "1px solid #1e3a5f", borderRadius: 6, color: "#e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <button
          onClick={login}
          disabled={loading || !email || !password}
          style={{ width: "100%", padding: 12, borderRadius: 6, border: "none", background: loading ? "#1e3a5f" : "linear-gradient(90deg,#059669,#0d9488)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: loading ? "wait" : "pointer", letterSpacing: ".3px" }}
        >
          {loading ? "Authenticating..." : "Sign In"}
        </button>

        <div style={{ marginTop: 16, padding: "10px 12px", background: "#0a1628", borderRadius: 6, border: "1px solid #1e3a5f" }}>
          <div style={{ fontSize: 9, color: "#475569", marginBottom: 3 }}>👤 RP: celso@nocpharma.de · QP: torsten@nocpharma.de · QA: olaf@nocpharma.de</div>
          <div style={{ fontSize: 9, color: "#475569", marginBottom: 3 }}>🔒 Audit: All login attempts are logged (Annex 11 §9)</div>
          <div style={{ fontSize: 9, color: "#475569" }}>⏱ Session: 30min timeout (21 CFR Part 11 §11.300)</div>
        </div>

        <div style={{ textAlign: "center", marginTop: 12, fontSize: 9, color: "#334155" }}>
          Murchin, MV · BfArM · LAGuS MV · LB Thüringen
        </div>
      </div>
    </div>
  );
}
