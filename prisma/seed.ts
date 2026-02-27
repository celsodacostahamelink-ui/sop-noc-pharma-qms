import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding NOC Pharma QMS database...\n");

  const users = [
    { email: "celso@nocpharma.de",     name: "Celso Hamelink Chmielewski", role: "RP",         password: "admin" },
    { email: "torsten@nocpharma.de",   name: "Torsten Cuny",               role: "QP",         password: "admin" },
    { email: "olaf@nocpharma.de",      name: "Dr. Olaf Schagon",           role: "QA_MANAGER", password: "admin" },
    { email: "it@nocpharma.de",        name: "IT Admin",                   role: "IT_ADMIN",   password: "admin" },
    { email: "auditor@bfarm.de",       name: "BfArM Inspector",            role: "AUDITOR",    password: "admin" },
    { email: "staff@nocpharma.de",     name: "Mitarbeiter",                role: "VIEWER",     password: "admin" },
  ];

  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 12);
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role as any, passwordHash: hash },
      create: { email: u.email, name: u.name, role: u.role as any, passwordHash: hash },
    });
    console.log("  ✅ " + u.role.padEnd(12) + " " + u.email.padEnd(30) + " (" + u.password + ")");
  }

  const checklist = [
    { question: "AI System Description for BfArM", category: "doc" },
    { question: "Annex III Risk Assessment", category: "doc" },
    { question: "Data Governance Log (training provenance)", category: "doc" },
    { question: "AI Inventory with risk levels", category: "sys" },
    { question: "Human Oversight roles documented", category: "sys" },
    { question: "GAMP 5 Validation Report", category: "doc" },
    { question: "Monthly Model Review scheduled", category: "sys" },
    { question: "BfArM 2026 digital export verified", category: "sys" },
    { question: "10yr log retention policy", category: "doc" },
    { question: "Pharmacy brick-and-mortar check active", category: "sys" },
    { question: "Batch lockdown <4h tested", category: "sys" },
    { question: "CE Marking completed", category: "doc" },
    { question: "Wholesale-only routing enforced", category: "sys" },
    { question: "COA hallucination check validated", category: "sys" },
    { question: "AI Transparency notices active", category: "sys" },
  ];

  for (const item of checklist) {
    await prisma.checklistItem.upsert({
      where: { id: item.question },
      update: {},
      create: { question: item.question, category: item.category },
    });
  }
  console.log("\n  ✅ " + checklist.length + " checklist items created");

  await prisma.auditLog.create({
    data: { action: "SYSTEM_INIT", target: "Database seeded", detail: users.length + " users, " + checklist.length + " checklist items" },
  });

  console.log("\n✅ Seed complete!\n");
  for (const u of users) {
    console.log("  " + u.role.padEnd(12) + " " + u.email.padEnd(30) + " " + u.password);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
