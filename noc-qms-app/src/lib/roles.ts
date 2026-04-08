// NOC Pharma QMS — Role-Based Access Control
// Per EU GMP Annex 11 §12: Restricted access by authorization level

export type Permission =
  | "sop:read"
  | "sop:write"
  | "sop:approve"
  | "sop:upload"
  | "hitl:sign"
  | "hitl:override"
  | "ai:generate"
  | "ai:approve"
  | "audit:read"
  | "audit:export"
  | "checklist:edit"
  | "user:manage"
  | "system:admin";

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  QP: [
    "sop:read", "sop:write", "sop:approve", "sop:upload",
    "hitl:sign", "hitl:override",
    "ai:generate", "ai:approve",
    "audit:read", "audit:export",
    "checklist:edit",
  ],
  RP: [
    "sop:read", "sop:write", "sop:approve", "sop:upload",
    "hitl:sign", "hitl:override",
    "ai:generate", "ai:approve",
    "audit:read", "audit:export",
    "checklist:edit",
  ],
  QA_MANAGER: [
    "sop:read", "sop:write", "sop:upload",
    "hitl:sign",
    "ai:generate",
    "audit:read", "audit:export",
    "checklist:edit",
  ],
  IT_ADMIN: [
    "sop:read", "sop:upload",
    "ai:generate",
    "audit:read", "audit:export",
    "user:manage", "system:admin",
  ],
  COMPLIANCE: [
    "sop:read", "sop:write", "sop:upload",
    "hitl:sign",
    "ai:generate",
    "audit:read", "audit:export",
    "checklist:edit",
  ],
  SCM: [
    "sop:read", "sop:upload",
    "ai:generate",
    "audit:read",
  ],
  AUDITOR: [
    "sop:read",
    "audit:read", "audit:export",
  ],
  VIEWER: [
    "sop:read",
    "audit:read",
  ],
};

export function hasPermission(role: string, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canSignHITL(role: string): boolean {
  return hasPermission(role, "hitl:sign");
}

export function canApproveAI(role: string): boolean {
  return hasPermission(role, "ai:approve");
}

// GxP: QP and RP are the only roles that can approve AI-generated content
// and override HITL decisions. This is mandated by EU AI Act Art.14.
export function canOverride(role: string): boolean {
  return ["QP", "RP"].includes(role);
}

// Role display names (German)
export const ROLE_LABELS: Record<string, string> = {
  QP: "Sachkundige Person (QP)",
  RP: "Verantwortliche Person §52a (RP)",
  QA_MANAGER: "Leiter Qualitätssicherung",
  IT_ADMIN: "IT Compliance / Admin",
  COMPLIANCE: "Compliance / Recht",
  SCM: "Supply Chain Manager",
  AUDITOR: "Auditor (BfArM/Extern)",
  VIEWER: "Mitarbeiter (Lesen)",
};
