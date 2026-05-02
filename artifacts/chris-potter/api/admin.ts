import type { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA = process.env.VERCEL ? "/tmp/cp-data" : path.join(process.cwd(), "data");

function ensureDir() { if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true }); }
function readJSON<T>(file: string, fallback: T): T {
  ensureDir();
  const p = path.join(DATA, file);
  if (!fs.existsSync(p)) return fallback;
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fallback; }
}
function writeJSON(file: string, data: unknown) {
  ensureDir(); fs.writeFileSync(path.join(DATA, file), JSON.stringify(data, null, 2));
}
function nanoid() { return crypto.randomBytes(8).toString("hex"); }
function getSecret() { return process.env.ADMIN_SECRET ?? "cp-admin-secret-2025"; }
function signToken(payload: object): string {
  const p = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${p}.${crypto.createHmac("sha256", getSecret()).update(p).digest("base64url")}`;
}
function verifyToken(token: string): boolean {
  try {
    const [p, s] = token.split(".");
    const expected = crypto.createHmac("sha256", getSecret()).update(p).digest("base64url");
    if (s !== expected) return false;
    const data = JSON.parse(Buffer.from(p, "base64url").toString());
    return Date.now() <= data.exp;
  } catch { return false; }
}

async function readBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let d = ""; req.on("data", c => { d += c; });
    req.on("end", () => { try { resolve(JSON.parse(d)); } catch { resolve({}); } });
    req.on("error", reject);
  });
}

async function sendEmail(to: string | string[], subject: string, html: string) {
  const host = process.env.SMTP_HOST, user = process.env.SMTP_USER, pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return { sent: 0, failed: Array.isArray(to) ? to.length : 1 };
  const { createTransport } = await import("nodemailer");
  const t = createTransport({ host, port: Number(process.env.SMTP_PORT ?? "587"), secure: process.env.SMTP_SECURE === "true", auth: { user, pass } });
  const recipients = Array.isArray(to) ? to : [to];
  let sent = 0, failed = 0;
  for (const email of recipients) {
    try { await t.sendMail({ from: `"Chris Potter Official" <${process.env.SMTP_FROM_EMAIL ?? "newsletter@chrispotterofficial.site"}>`, to: email, subject, html: html.replace(/\{\{email\}\}/g, email) }); sent++; }
    catch { failed++; }
  }
  return { sent, failed };
}

export default async function handler(req: IncomingMessage & { url?: string; headers: any }, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");
  if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }

  const url = req.url ?? "";
  const h = (req.headers["authorization"] as string) ?? "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : "";
  const isAuthed = verifyToken(token);

  const requireAuth = () => { if (!isAuthed) { res.statusCode = 401; res.end(JSON.stringify({ success: false, message: "Unauthorized" })); return false; } return true; };

  // POST /api/admin/login
  if (url.includes("/login") && req.method === "POST") {
    const body = await readBody(req);
    const pw = process.env.ADMIN_PASSWORD;
    if (!pw) { res.statusCode = 503; res.end(JSON.stringify({ success: false, message: "Admin not configured. Set ADMIN_PASSWORD env var." })); return; }
    if (body.password !== pw) { res.statusCode = 401; res.end(JSON.stringify({ success: false, message: "Invalid password." })); return; }
    const t = signToken({ role: "admin", exp: Date.now() + 12 * 60 * 60 * 1000 });
    res.end(JSON.stringify({ success: true, token: t })); return;
  }

  // POST /api/admin/vip — public (fan portal)
  if (url.includes("/vip") && req.method === "POST" && !url.includes("/vip/")) {
    const body = await readBody(req);
    if (!body.email || !body.sessionType) { res.statusCode = 400; res.end(JSON.stringify({ success: false, message: "Email and session type required" })); return; }
    const vip = readJSON<any[]>("vip.json", []);
    vip.push({ id: nanoid(), email: body.email, name: body.name || "", sessionType: body.sessionType, message: body.message || "", availability: body.availability || "", requestedAt: new Date().toISOString(), status: "pending", scheduledDate: null, notes: "" });
    writeJSON("vip.json", vip);
    res.end(JSON.stringify({ success: true, message: "VIP request received. We'll be in touch within 48 hours." })); return;
  }

  if (!requireAuth()) return;

  // GET /api/admin/stats
  if (url.includes("/stats")) {
    const subs = readJSON<any[]>("subscribers.json", []);
    const contacts = readJSON<any[]>("contacts.json", []);
    const vip = readJSON<any[]>("vip.json", []);
    const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
    res.end(JSON.stringify({ success: true, data: { subscribers: subs.length, newThisWeek: subs.filter((s: any) => new Date(s.subscribedAt).getTime() > week).length, totalContacts: contacts.length, pendingContacts: contacts.filter((c: any) => c.status === "pending").length, vipRequests: vip.length, pendingVip: vip.filter((v: any) => v.status === "pending").length, managementInquiries: contacts.filter((c: any) => c.type === "management").length, badgeApplications: contacts.filter((c: any) => c.type === "fanbase").length } })); return;
  }

  // GET/PATCH/DELETE /api/admin/subscribers
  if (url.includes("/subscribers")) {
    if (req.method === "GET") {
      let subs = readJSON<any[]>("subscribers.json", []);
      res.end(JSON.stringify({ success: true, data: subs.reverse() })); return;
    }
    if (req.method === "PATCH") {
      const body = await readBody(req);
      const subs = readJSON<any[]>("subscribers.json", []);
      const idx = subs.findIndex(s => s.email.toLowerCase() === (body.email ?? "").toLowerCase());
      if (idx === -1) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Not found" })); return; }
      subs[idx] = { ...subs[idx], ...body };
      writeJSON("subscribers.json", subs);
      res.end(JSON.stringify({ success: true, data: subs[idx] })); return;
    }
    if (req.method === "DELETE") {
      const body = await readBody(req);
      const subs = readJSON<any[]>("subscribers.json", []).filter(s => s.email.toLowerCase() !== (body.email ?? "").toLowerCase());
      writeJSON("subscribers.json", subs);
      res.end(JSON.stringify({ success: true })); return;
    }
  }

  // GET/PATCH /api/admin/contacts
  if (url.includes("/contacts")) {
    if (req.method === "GET") {
      let contacts = readJSON<any[]>("contacts.json", []);
      res.end(JSON.stringify({ success: true, data: contacts.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()) })); return;
    }
    if (req.method === "PATCH") {
      const body = await readBody(req);
      const contacts = readJSON<any[]>("contacts.json", []);
      const idx = contacts.findIndex(c => c.id === body.id);
      if (idx === -1) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Not found" })); return; }
      contacts[idx] = { ...contacts[idx], ...body };
      writeJSON("contacts.json", contacts);
      res.end(JSON.stringify({ success: true, data: contacts[idx] })); return;
    }
  }

  // GET/PATCH /api/admin/vip
  if (url.includes("/vip")) {
    if (req.method === "GET") {
      const vip = readJSON<any[]>("vip.json", []);
      res.end(JSON.stringify({ success: true, data: vip.sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()) })); return;
    }
    if (req.method === "PATCH") {
      const body = await readBody(req);
      const vip = readJSON<any[]>("vip.json", []);
      const idx = vip.findIndex(v => v.id === body.id);
      if (idx === -1) { res.statusCode = 404; res.end(JSON.stringify({ success: false, message: "Not found" })); return; }
      vip[idx] = { ...vip[idx], ...body };
      writeJSON("vip.json", vip);
      res.end(JSON.stringify({ success: true, data: vip[idx] })); return;
    }
  }

  // POST /api/admin/compose
  if (url.includes("/compose") && req.method === "POST") {
    const body = await readBody(req);
    const { to, subject, html } = body;
    if (!subject || !html) { res.statusCode = 400; res.end(JSON.stringify({ success: false, message: "Subject and body required" })); return; }
    let recipients: string[] = [];
    if (to === "all") recipients = readJSON<any[]>("subscribers.json", []).map(s => s.email);
    else if (to === "badge") recipients = readJSON<any[]>("contacts.json", []).filter(c => c.type === "fanbase").map(c => c.email);
    else if (to === "management") recipients = readJSON<any[]>("contacts.json", []).filter(c => c.type === "management").map(c => c.email);
    else if (to === "vip") recipients = readJSON<any[]>("vip.json", []).map(v => v.email);
    else if (typeof to === "string" && to.includes("@")) recipients = [to];
    else if (Array.isArray(to)) recipients = to;
    if (!recipients.length) { res.end(JSON.stringify({ success: false, message: "No recipients found." })); return; }
    const result = await sendEmail(recipients, subject, html);
    res.end(JSON.stringify({ success: true, message: `Sent to ${result.sent} recipient${result.sent !== 1 ? "s" : ""}.`, ...result })); return;
  }

  // GET /api/admin/export
  if (url.includes("/export")) {
    const isContacts = url.includes("contacts");
    if (isContacts) {
      const data = readJSON<any[]>("contacts.json", []);
      const rows = [["ID","Type","First","Last","Email","Status","Received"].join(","), ...data.map(c => [c.id,c.type,c.firstName,c.lastName,c.email,c.status,c.receivedAt].join(","))];
      res.setHeader("Content-Type", "text/csv");
      res.end(rows.join("\n")); return;
    }
    const data = readJSON<any[]>("subscribers.json", []);
    const rows = [["Email","Name","Phone","Subscribed","Tags"].join(","), ...data.map(s => [s.email,s.name??"",s.phone??"",s.subscribedAt,(s.tags??[]).join("|")].join(","))];
    res.setHeader("Content-Type", "text/csv");
    res.end(rows.join("\n")); return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ success: false, message: "Not found." }));
}
