import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Fallback users — works even without database
const USERS: Record<string, { name: string; role: string; password: string }> = {
  "celso@nocpharma.de":   { name: "Celso Hamelink Chmielewski", role: "RP",         password: "admin" },
  "torsten@nocpharma.de": { name: "Torsten Cuny",               role: "QP",         password: "admin" },
  "olaf@nocpharma.de":    { name: "Dr. Olaf Schagon",           role: "QA_MANAGER", password: "admin" },
  "it@nocpharma.de":      { name: "IT Admin",                   role: "IT_ADMIN",   password: "admin" },
  "auditor@bfarm.de":     { name: "BfArM Inspector",            role: "AUDITOR",    password: "admin" },
  "staff@nocpharma.de":   { name: "Mitarbeiter",                role: "VIEWER",     password: "admin" },
};

// Simple in-memory sessions (fallback when DB is down)
const sessions: Record<string, { email: string; name: string; role: string; expires: number }> = {};

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false, error: "Email and password required" }, { status: 400 });
    }

    // Try database first, fall back to hardcoded users
    let user: { name: string; role: string } | null = null;

    try {
      const { PrismaClient } = await import("@prisma/client");
      const bcrypt = await import("bcryptjs");
      const prisma = new PrismaClient();
      const dbUser = await prisma.user.findUnique({ where: { email } });
      if (dbUser && dbUser.active) {
        const valid = await bcrypt.compare(password, dbUser.passwordHash);
        if (valid) {
          user = { name: dbUser.name, role: dbUser.role };
          // Log to DB
          await prisma.auditLog.create({ data: { action: "LOGIN_OK", target: email, userId: dbUser.id } }).catch(() => {});
        }
      }
      await prisma.$disconnect();
    } catch (dbErr) {
      console.log("DB unavailable, using fallback auth");
    }

    // Fallback to hardcoded users
    if (!user && USERS[email] && USERS[email].password === password) {
      user = { name: USERS[email].name, role: USERS[email].role };
    }

    if (!user) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    // Create session
    const token = crypto.randomUUID();
    const expires = Date.now() + 30 * 60 * 1000;
    sessions[token] = { email, name: user.name, role: user.role, expires };

    // Try DB session too
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      const dbUser = await prisma.user.findUnique({ where: { email } });
      if (dbUser) {
        await prisma.session.create({ data: { sessionToken: token, userId: dbUser.id, expires: new Date(expires) } });
        await prisma.user.update({ where: { id: dbUser.id }, data: { lastLogin: new Date() } });
      }
      await prisma.$disconnect();
    } catch {}

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: new Date(expires),
      path: "/",
    });

    return NextResponse.json({ ok: true, user: { id: email, email, name: user.name, role: user.role } });
  } catch (e: any) {
    console.error("Auth error:", e);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    // Check in-memory sessions first
    const memSession = sessions[token];
    if (memSession && memSession.expires > Date.now()) {
      return NextResponse.json({ ok: true, user: { id: memSession.email, email: memSession.email, name: memSession.name, role: memSession.role } });
    }

    // Try database
    try {
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();
      const session = await prisma.session.findUnique({ where: { sessionToken: token }, include: { user: true } });
      await prisma.$disconnect();
      if (session && session.expires > new Date()) {
        return NextResponse.json({ ok: true, user: { id: session.user.id, email: session.user.email, name: session.user.name, role: session.user.role } });
      }
    } catch {}

    return NextResponse.json({ ok: false }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
