import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "..", "..", "data");

function ensureDir() { if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true }); }
function readJSON<T>(file: string, fallback: T): T {
  ensureDir();
  const p = path.join(DATA, file);
  if (!fs.existsSync(p)) return fallback;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fallback; }
}
function writeJSON(file: string, data: unknown) {
  ensureDir();
  fs.writeFileSync(path.join(DATA, file), JSON.stringify(data, null, 2));
}

function getSecret() { return process.env.ADMIN_SECRET ?? "cp-admin-secret-2025"; }
function signToken(payload: object): string {
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const s = crypto.createHmac("sha256", getSecret()).update(p).digest("base64url");
  return `${p}.${s}`;
}
function verifyToken(token: string): { role: string; exp: number } | null {
  try {
    const [p, s] = token.split(".");
    const expected = crypto.createHmac("sha256", getSecret()).update(p).digest("base64url");
    if (s !== expected) return null;
    const data = JSON.parse(Buffer.from(p, "base64url").toString());
    if (Date.now() > data.exp) return null;
    return data;
  } catch { return null; }
}
function auth(req: any, res: any, next: any) {
  const h = req.headers["authorization"] ?? "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  if (!verifyToken(token)) return res.status(401).json({ success: false, message: "Unauthorized" });
  next();
}

function nanoid() { return crypto.randomBytes(8).toString("hex"); }

// ── POST /api/admin/login ──
router.post("/login", (req, res) => {
  const { password } = req.body as { password?: string };
  const adminPw = process.env.ADMIN_PASSWORD;
  if (!adminPw) return res.status(503).json({ success: false, message: "Admin not configured. Set ADMIN_PASSWORD env var." });
  if (password !== adminPw) return res.status(401).json({ success: false, message: "Invalid password." });
  const token = signToken({ role: "admin", exp: Date.now() + 12 * 60 * 60 * 1000 });
  return res.json({ success: true, token });
});

// ── GET /api/admin/stats ──
router.get("/stats", auth, (_req, res) => {
  const subs = readJSON<any[]>("subscribers.json", []);
  const contacts = readJSON<any[]>("contacts.json", []);
  const vip = readJSON<any[]>("vip.json", []);
  const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
  res.json({
    subscribers: subs.length,
    newThisWeek: subs.filter((s: any) => new Date(s.subscribedAt).getTime() > week).length,
    totalContacts: contacts.length,
    pendingContacts: contacts.filter((c: any) => c.status === "pending").length,
    vipRequests: vip.length,
    pendingVip: vip.filter((v: any) => v.status === "pending").length,
    managementInquiries: contacts.filter((c: any) => c.type === "management").length,
    badgeApplications: contacts.filter((c: any) => c.type === "fanbase").length,
  });
});

// ── GET /api/admin/subscribers ──
router.get("/subscribers", auth, (req, res) => {
  let subs = readJSON<any[]>("subscribers.json", []);
  const { search, tag } = req.query as Record<string, string>;
  if (search) subs = subs.filter(s => JSON.stringify(s).toLowerCase().includes(search.toLowerCase()));
  if (tag) subs = subs.filter(s => (s.tags ?? []).includes(tag));
  res.json({ success: true, data: subs.reverse() });
});

// ── PATCH /api/admin/subscribers ──
router.patch("/subscribers", auth, (req, res) => {
  const { email, tags, preferences, notes } = req.body as any;
  const subs = readJSON<any[]>("subscribers.json", []);
  const idx = subs.findIndex(s => s.email.toLowerCase() === email?.toLowerCase());
  if (idx === -1) return res.status(404).json({ success: false, message: "Subscriber not found" });
  subs[idx] = { ...subs[idx], tags: tags ?? subs[idx].tags ?? [], preferences: preferences ?? subs[idx].preferences ?? {}, notes: notes ?? subs[idx].notes ?? "" };
  writeJSON("subscribers.json", subs);
  return res.json({ success: true, data: subs[idx] });
});

// ── DELETE /api/admin/subscribers ──
router.delete("/subscribers", auth, (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ success: false, message: "Email required" });
  const subs = readJSON<any[]>("subscribers.json", []).filter(s => s.email.toLowerCase() !== email.toLowerCase());
  writeJSON("subscribers.json", subs);
  return res.json({ success: true, message: "Subscriber removed" });
});

// ── GET /api/admin/contacts ──
router.get("/contacts", auth, (req, res) => {
  let contacts = readJSON<any[]>("contacts.json", []);
  const { type, status, search } = req.query as Record<string, string>;
  if (type) contacts = contacts.filter(c => c.type === type);
  if (status) contacts = contacts.filter(c => c.status === status);
  if (search) contacts = contacts.filter(c => JSON.stringify(c).toLowerCase().includes(search.toLowerCase()));
  res.json({ success: true, data: contacts.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()) });
});

// ── PATCH /api/admin/contacts/:id ──
router.patch("/contacts/:id", auth, (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body as { status?: string; notes?: string };
  const contacts = readJSON<any[]>("contacts.json", []);
  const idx = contacts.findIndex(c => c.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Contact not found" });
  if (status) contacts[idx].status = status;
  if (notes !== undefined) contacts[idx].notes = notes;
  writeJSON("contacts.json", contacts);
  return res.json({ success: true, data: contacts[idx] });
});

// ── GET /api/admin/vip ──
router.get("/vip", auth, (req, res) => {
  let vip = readJSON<any[]>("vip.json", []);
  const { status, type } = req.query as Record<string, string>;
  if (status) vip = vip.filter(v => v.status === status);
  if (type) vip = vip.filter(v => v.sessionType === type);
  res.json({ success: true, data: vip.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()) });
});

// ── POST /api/admin/vip ── (fan portal submits here)
router.post("/vip", (req, res) => {
  const b = req.body as any;
  if (!b.email || !b.sessionType) return res.status(400).json({ success: false, message: "Email and session type required" });
  const vip = readJSON<any[]>("vip.json", []);
  const entry = { id: nanoid(), email: b.email, name: b.name || "", sessionType: b.sessionType, message: b.message || "", availability: b.availability || "", requestedAt: new Date().toISOString(), status: "pending", scheduledDate: null, notes: "" };
  vip.push(entry);
  writeJSON("vip.json", vip);
  return res.json({ success: true, message: "VIP request received. We'll be in touch within 48 hours." });
});

// ── PATCH /api/admin/vip/:id ──
router.patch("/vip/:id", auth, (req, res) => {
  const { id } = req.params;
  const { status, notes, scheduledDate } = req.body as any;
  const vip = readJSON<any[]>("vip.json", []);
  const idx = vip.findIndex(v => v.id === id);
  if (idx === -1) return res.status(404).json({ success: false, message: "Request not found" });
  if (status) vip[idx].status = status;
  if (notes !== undefined) vip[idx].notes = notes;
  if (scheduledDate !== undefined) vip[idx].scheduledDate = scheduledDate;
  writeJSON("vip.json", vip);
  return res.json({ success: true, data: vip[idx] });
});

// ── POST /api/admin/compose ──
router.post("/compose", auth, async (req, res) => {
  const { to, subject, html, text } = req.body as any;
  const host = process.env.SMTP_HOST, user = process.env.SMTP_USER, pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return res.status(503).json({ success: false, message: "SMTP not configured" });
  if (!subject || !html) return res.status(400).json({ success: false, message: "Subject and body required" });

  let recipients: string[] = [];
  if (to === "all") {
    recipients = readJSON<any[]>("subscribers.json", []).map(s => s.email);
  } else if (to === "badge") {
    recipients = readJSON<any[]>("contacts.json", []).filter(c => c.type === "fanbase").map(c => c.email);
  } else if (to === "management") {
    recipients = readJSON<any[]>("contacts.json", []).filter(c => c.type === "management").map(c => c.email);
  } else if (to === "vip") {
    recipients = readJSON<any[]>("vip.json", []).map(v => v.email);
  } else if (typeof to === "string" && to.includes("@")) {
    recipients = [to];
  } else if (Array.isArray(to)) {
    recipients = to;
  }

  if (!recipients.length) return res.json({ success: false, message: "No recipients found." });

  const { createTransport } = await import("nodemailer");
  const transporter = createTransport({ host, port: Number(process.env.SMTP_PORT ?? "587"), secure: process.env.SMTP_SECURE === "true", auth: { user, pass } });

  let sent = 0, failed = 0;
  for (const email of recipients) {
    try {
      await transporter.sendMail({
        from: `"Chris Potter Official" <${process.env.SMTP_FROM_EMAIL ?? "newsletter@chrispotterofficial.site"}>`,
        to: email, subject,
        html: html.replace(/\{\{email\}\}/g, email),
        text: text ?? "",
      });
      sent++;
    } catch (err) { console.error("Compose send error:", email, err); failed++; }
  }

  return res.json({ success: true, message: `Sent to ${sent} recipient${sent !== 1 ? "s" : ""}${failed ? `, ${failed} failed` : ""}.`, sent, failed });
});

// ── GET /api/admin/export ──
router.get("/export", auth, (req, res) => {
  const { type } = req.query as { type?: string };
  if (type === "contacts") {
    const data = readJSON<any[]>("contacts.json", []);
    const rows = [["ID","Type","First Name","Last Name","Email","Status","Received"].join(","),
      ...data.map(c => [c.id, c.type, c.firstName, c.lastName, c.email, c.status, c.receivedAt].join(","))];
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="contacts.csv"');
    res.send(rows.join("\n"));
  } else {
    const data = readJSON<any[]>("subscribers.json", []);
    const rows = [["Email","Name","Phone","Subscribed","Tags"].join(","),
      ...data.map(s => [s.email, s.name ?? "", s.phone ?? "", s.subscribedAt, (s.tags ?? []).join("|")].join(","))];
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="subscribers.csv"');
    res.send(rows.join("\n"));
  }
});

export default router;
export { nanoid, readJSON, writeJSON };
