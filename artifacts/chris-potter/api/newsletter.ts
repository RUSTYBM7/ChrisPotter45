import type { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "data");
const FILE = path.join(DATA_DIR, "subscribers.json");

type Subscriber = { email: string; name?: string; phone?: string; subscribedAt: string };

function load(): Subscriber[] {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf8"));
  } catch { return []; }
}

function save(subs: Subscriber[]) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(subs, null, 2));
}

async function readBody(req: IncomingMessage): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", c => { data += c; });
    req.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
    req.on("error", reject);
  });
}

async function sendWelcomeEmail(to: string, name?: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.log("SMTP not configured — subscriber saved:", to);
    return;
  }
  const { createTransport } = await import("nodemailer");
  const transporter = createTransport({
    host, port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: `"Chris Potter Official" <${process.env.SMTP_FROM_EMAIL ?? "newsletter@chrispotterofficial.site"}>`,
    to,
    subject: "Welcome to the Chris Potter Newsletter",
    html: `<!DOCTYPE html><html><body style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;">
<div style="max-width:580px;margin:0 auto;padding:48px 32px;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:32px;">Chris Potter Official</p>
  <h1 style="font-size:42px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin:0 0 24px;line-height:1;">Welcome${name ? `, ${name}` : ""}.</h1>
  <p style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:20px;">
    You're now part of an exclusive community with first access to news, project announcements, and behind-the-scenes updates from Chris Potter.
  </p>
  <p style="font-size:14px;color:rgba(255,255,255,0.4);line-height:1.7;margin-bottom:40px;">
    Expect updates on Heartland seasons, new roles, directorial work, and personal messages — delivered directly to your inbox.
  </p>
  <a href="https://chrispotterofficial.site/fan-portal" style="display:inline-block;background:#fff;color:#07090F;font-weight:900;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:14px 32px;border-radius:8px;margin-bottom:40px;">Access Fan Portal</a>
  <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:24px;">
    <p style="font-size:11px;color:rgba(255,255,255,0.2);">&copy; ${new Date().getFullYear()} Chris Potter Official &middot; chrispotterofficial.site</p>
  </div>
</div></body></html>`,
  });
}

async function sendSMS(phone: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!sid || !token || !from || !phone) return;
  try {
    const creds = Buffer.from(`${sid}:${token}`).toString("base64");
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: { "Authorization": `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: phone, From: from, Body: body }).toString(),
    });
  } catch (err) { console.error("SMS error:", err); }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ success: false, message: "Method not allowed" }));
    return;
  }

  const body = await readBody(req);
  const { email, name, phone } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.statusCode = 400;
    res.end(JSON.stringify({ success: false, message: "A valid email address is required." }));
    return;
  }

  const subs = load();
  if (subs.some(s => s.email.toLowerCase() === email.toLowerCase())) {
    res.statusCode = 409;
    res.end(JSON.stringify({ success: false, message: "This email is already subscribed." }));
    return;
  }

  subs.push({ email, name, phone, subscribedAt: new Date().toISOString() });
  save(subs);

  await Promise.all([
    sendWelcomeEmail(email, name),
    phone ? sendSMS(phone, `Welcome to the Chris Potter newsletter, ${name || "friend"}! Check your email for details. Reply STOP to opt out.`) : Promise.resolve(),
  ]);

  res.end(JSON.stringify({ success: true, message: "Successfully subscribed. Welcome to the community." }));
}
