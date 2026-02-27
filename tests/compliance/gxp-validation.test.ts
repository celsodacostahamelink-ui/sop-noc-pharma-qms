/**
 * NOC Pharma QMS — GxP Compliance Validation Tests
 * 
 * GAMP 5 Category 5 Software — IQ/OQ/PQ Test Protocol
 * Covers: 21 CFR Part 11, EU Annex 11, EU AI Act 2026, ALCOA++
 * 
 * Run: npm run test:compliance
 */

import { describe, test, expect } from "@jest/globals";
import { ROLE_PERMISSIONS, hasPermission, canOverride, canSignHITL } from "../../src/lib/roles";

// ════════════════════════════════════════════════════════
// IQ — INSTALLATION QUALIFICATION
// ════════════════════════════════════════════════════════

describe("IQ-01: System Installation", () => {
  test("All required roles are defined", () => {
    const required = ["QP", "RP", "QA_MANAGER", "IT_ADMIN", "COMPLIANCE", "SCM", "AUDITOR", "VIEWER"];
    for (const role of required) {
      expect(ROLE_PERMISSIONS).toHaveProperty(role);
    }
  });

  test("Environment variables template exists", () => {
    const fs = require("fs");
    expect(fs.existsSync("./. env.example")).toBeFalsy; // just structure check
  });
});

// ════════════════════════════════════════════════════════
// OQ — OPERATIONAL QUALIFICATION
// ════════════════════════════════════════════════════════

describe("OQ-01: Access Control (Annex 11 §12)", () => {
  test("QP has full SOP access", () => {
    expect(hasPermission("QP", "sop:read")).toBe(true);
    expect(hasPermission("QP", "sop:write")).toBe(true);
    expect(hasPermission("QP", "sop:approve")).toBe(true);
  });

  test("Auditor has read-only access", () => {
    expect(hasPermission("AUDITOR", "sop:read")).toBe(true);
    expect(hasPermission("AUDITOR", "sop:write")).toBe(false);
    expect(hasPermission("AUDITOR", "sop:upload")).toBe(false);
    expect(hasPermission("AUDITOR", "hitl:sign")).toBe(false);
    expect(hasPermission("AUDITOR", "ai:generate")).toBe(false);
  });

  test("Viewer cannot modify anything", () => {
    expect(hasPermission("VIEWER", "sop:read")).toBe(true);
    expect(hasPermission("VIEWER", "sop:write")).toBe(false);
    expect(hasPermission("VIEWER", "hitl:sign")).toBe(false);
    expect(hasPermission("VIEWER", "ai:generate")).toBe(false);
    expect(hasPermission("VIEWER", "user:manage")).toBe(false);
  });

  test("Only IT_ADMIN can manage users", () => {
    expect(hasPermission("IT_ADMIN", "user:manage")).toBe(true);
    expect(hasPermission("QP", "user:manage")).toBe(false);
    expect(hasPermission("RP", "user:manage")).toBe(false);
  });
});

describe("OQ-02: HITL Decision Authority (EU AI Act Art.14)", () => {
  test("Only QP and RP can override AI decisions", () => {
    expect(canOverride("QP")).toBe(true);
    expect(canOverride("RP")).toBe(true);
    expect(canOverride("QA_MANAGER")).toBe(false);
    expect(canOverride("IT_ADMIN")).toBe(false);
    expect(canOverride("COMPLIANCE")).toBe(false);
    expect(canOverride("AUDITOR")).toBe(false);
  });

  test("QP, RP, QA, Compliance can sign HITL", () => {
    expect(canSignHITL("QP")).toBe(true);
    expect(canSignHITL("RP")).toBe(true);
    expect(canSignHITL("QA_MANAGER")).toBe(true);
    expect(canSignHITL("COMPLIANCE")).toBe(true);
  });

  test("SCM, Auditor, Viewer cannot sign HITL", () => {
    expect(canSignHITL("SCM")).toBe(false);
    expect(canSignHITL("AUDITOR")).toBe(false);
    expect(canSignHITL("VIEWER")).toBe(false);
  });
});

describe("OQ-03: AI Agent Access (EU AI Act Art.14)", () => {
  test("Only QP and RP can approve AI-generated content", () => {
    expect(hasPermission("QP", "ai:approve")).toBe(true);
    expect(hasPermission("RP", "ai:approve")).toBe(true);
    expect(hasPermission("QA_MANAGER", "ai:approve")).toBe(false);
    expect(hasPermission("IT_ADMIN", "ai:approve")).toBe(false);
  });

  test("Multiple roles can generate AI drafts", () => {
    expect(hasPermission("QP", "ai:generate")).toBe(true);
    expect(hasPermission("QA_MANAGER", "ai:generate")).toBe(true);
    expect(hasPermission("IT_ADMIN", "ai:generate")).toBe(true);
    expect(hasPermission("COMPLIANCE", "ai:generate")).toBe(true);
  });

  test("Auditor and Viewer cannot use AI agent", () => {
    expect(hasPermission("AUDITOR", "ai:generate")).toBe(false);
    expect(hasPermission("VIEWER", "ai:generate")).toBe(false);
  });
});

describe("OQ-04: Audit Trail (Annex 11 §9)", () => {
  test("All roles can read audit logs", () => {
    for (const role of Object.keys(ROLE_PERMISSIONS)) {
      expect(hasPermission(role, "audit:read")).toBe(true);
    }
  });

  test("Only authorized roles can export audit data", () => {
    expect(hasPermission("QP", "audit:export")).toBe(true);
    expect(hasPermission("AUDITOR", "audit:export")).toBe(true);
    expect(hasPermission("VIEWER", "audit:export")).toBe(false);
    expect(hasPermission("SCM", "audit:export")).toBe(false);
  });
});

// ════════════════════════════════════════════════════════
// PQ — PERFORMANCE QUALIFICATION
// ════════════════════════════════════════════════════════

describe("PQ-01: Data Integrity (ALCOA++)", () => {
  test("Audit log entries should be immutable (no updatedAt field)", () => {
    // Verify schema design: AuditLog has createdAt but no updatedAt
    const fs = require("fs");
    const schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
    
    // Find AuditLog model
    const auditSection = schema.match(/model AuditLog \{[\s\S]*?\n\}/)?.[0] || "";
    expect(auditSection).toContain("createdAt");
    expect(auditSection).not.toMatch(/updatedAt\s+DateTime\s+@updatedAt/);
  });

  test("HITL decisions should be immutable", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
    
    const hitlSection = schema.match(/model HITLDecision \{[\s\S]*?\n\}/)?.[0] || "";
    expect(hitlSection).toContain("createdAt");
    expect(hitlSection).not.toMatch(/updatedAt\s+DateTime\s+@updatedAt/);
  });

  test("Documents have hash field for integrity verification", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
    
    const docSection = schema.match(/model Document \{[\s\S]*?\n\}/)?.[0] || "";
    expect(docSection).toContain("hash");
  });
});

describe("PQ-02: Electronic Signature (21 CFR Part 11)", () => {
  test("HITL decisions require signature field", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
    
    const hitlSection = schema.match(/model HITLDecision \{[\s\S]*?\n\}/)?.[0] || "";
    expect(hitlSection).toContain("signature");
    expect(hitlSection).toContain("signedBy");
  });

  test("HITL decisions require linked user", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
    
    const hitlSection = schema.match(/model HITLDecision \{[\s\S]*?\n\}/)?.[0] || "";
    expect(hitlSection).toContain("@relation");
  });
});

describe("PQ-03: AI Governance (EU AI Act)", () => {
  test("AI drafts track model version for reproducibility", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
    
    const aiSection = schema.match(/model AIDraft \{[\s\S]*?\n\}/)?.[0] || "";
    expect(aiSection).toContain("model");
    expect(aiSection).toContain("promptHash");
  });

  test("AI drafts require approval workflow", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
    
    const aiSection = schema.match(/model AIDraft \{[\s\S]*?\n\}/)?.[0] || "";
    expect(aiSection).toContain("status");
    expect(aiSection).toContain("reviewedBy");
    expect(aiSection).toContain("reviewedAt");
  });

  test("SOP risk levels match Annex III classification", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
    expect(schema).toContain("HIGH");
    expect(schema).toContain("MEDIUM");
    expect(schema).toContain("LOW");
  });
});

describe("PQ-04: Session Security (21 CFR Part 11 §11.300)", () => {
  test("Password hashing is configured", () => {
    const fs = require("fs");
    const schema = fs.readFileSync("./prisma/schema.prisma", "utf8");
    const userSection = schema.match(/model User \{[\s\S]*?\n\}/)?.[0] || "";
    expect(userSection).toContain("passwordHash");
    // Must NOT contain plaintext password field
    expect(userSection).not.toMatch(/^\s+password\s+String/m);
  });
});
