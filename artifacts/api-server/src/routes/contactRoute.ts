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
function nanoid() { return crypto.randomBytes(8).toString("hex"); }

async function sendContactEmail(data: Record<string, string>, to: string, subject: string, replyTo?: string) {
  try {
    const { createTransport } = await import("nodemailer");
    const host = process.env.SMTP_HOST, user = process.env.SMTP_USER, pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) { console.log("SMTP not configured — contact inquiry received:", data["Email"] ?? "", subject); return; }
    const transporter = createTransport({ host, port: Number(process.env.SMTP_PORT ?? 587), secure: process.env.SMTP_SECURE === "true", auth: { user, pass } });
    const rows = Object.entries(data).map(([k, v]) => `<tr><td style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.12em;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;padding-right:24px;">${k}</td><td style="color:#fff;font-size:14px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${v}</td></tr>`).join("");
    await transporter.sendMail({
      from: `"Chris Potter Website" <${process.env.SMTP_FROM_EMAIL ?? "noreply@chrispotterofficial.site"}>`,
      to, replyTo: replyTo ?? data["Email"], subject,
      html: `<!DOCTYPE html><html><body style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;"><div style="max-width:640px;margin:0 auto;padding:48px 32px;"><p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:24px;">Chris Potter Official</p><h2 style="font-size:28px;font-weight:900;text-transform:uppercase;margin:0 0 32px;">${subject}</h2><table style="width:100%;border-collapse:collapse;">${rows}</table><p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">Received: ${new Date().toUTCString()}</p></div></body></html>`,
    });
  } catch (err) { console.error("Contact email error:", err); }
}

async function sendAutoReply(to: string, firstName: string, subject: string, body: string) {
  try {
    const { createTransport } = await import("nodemailer");
    const host = process.env.SMTP_HOST, user = process.env.SMTP_USER, pass = process.env.SMTP_PASS;
    if (!host || !user || !pass) return;
    const transporter = createTransport({ host, port: Number(process.env.SMTP_PORT ?? 587), secure: process.env.SMTP_SECURE === "true", auth: { user, pass } });
    await transporter.sendMail({
      from: `"Chris Potter Official" <${process.env.SMTP_FROM_EMAIL ?? "noreply@chrispotterofficial.site"}>`,
      to, subject,
      html: `<!DOCTYPE html><html><body style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;"><div style="max-width:580px;margin:0 auto;padding:48px 32px;"><p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:24px;">Chris Potter Official</p><h1 style="font-size:36px;font-weight:900;text-transform:uppercase;margin:0 0 20px;line-height:1;">Thank You, ${firstName}.</h1><div style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:32px;">${body}</div><a href="https://chrispotterofficial.site/fan-portal" style="display:inline-block;background:#fff;color:#07090F;font-weight:900;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:14px 28px;border-radius:8px;">Access Fan Portal</a><div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:40px;padding-top:24px;"><p style="font-size:11px;color:rgba(255,255,255,0.2);">&copy; ${new Date().getFullYear()} Chris Potter Official</p></div></div></body></html>`,
    });
  } catch (err) { console.error("Auto-reply error:", err); }
}

async function sendSMS(body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER, to = process.env.ADMIN_SMS_NUMBER;
  if (!sid || !token || !from || !to) return;
  try {
    const creds = Buffer.from(`${sid}:${token}`).toString("base64");
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST", headers: { "Authorization": `Basic ${creds}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
    });
  } catch (err) { console.error("SMS error:", err); }
}

router.post("/management", async (req, res) => {
  const b = req.body as Record<string, string>;
  const required = ["firstName", "lastName", "email", "reason"];
  const missing = required.filter(f => !b[f]);
  if (missing.length) return res.status(400).json({ success: false, message: `Missing: ${missing.join(", ")}` });

  const contacts = readJSON<any[]>("contacts.json", []);
  contacts.push({ id: nanoid(), type: "management", status: "pending", firstName: b.firstName, lastName: b.lastName, email: b.email, receivedAt: new Date().toISOString(), notes: "", data: b });
  writeJSON("contacts.json", contacts);

  const mgmt = process.env.MANAGEMENT_EMAIL ?? "management@chrispotterofficial.site";
  await Promise.all([
    sendContactEmail({ "First Name": b.firstName, "Last Name": b.lastName, Email: b.email, Phone: b.phone || "—", Company: b.company || "—", Title: b.jobTitle || "—", Reason: b.reason, "Project Details": b.projectDetails || "—", Timeline: b.timeline || "—", Message: b.message || "—" }, mgmt, `Management Inquiry — ${b.reason} — ${b.firstName} ${b.lastName}`),
    sendAutoReply(b.email, b.firstName, "We received your inquiry — Chris Potter Official", "Thank you for reaching out to our management team. We have received your inquiry and will respond within <strong>3–5 business days</strong>."),
    sendSMS(`[INQUIRY] Management: ${b.reason} from ${b.firstName} ${b.lastName} (${b.email})`),
  ]);
  return res.json({ success: true, message: "Inquiry received. Our management team will respond within 3–5 business days." });
});

router.post("/fanbase", async (req, res) => {
  const b = req.body as Record<string, string>;
  const required = ["firstName", "lastName", "email", "badgeTier"];
  const missing = required.filter(f => !b[f]);
  if (missing.length) return res.status(400).json({ success: false, message: `Missing: ${missing.join(", ")}` });

  const contacts = readJSON<any[]>("contacts.json", []);
  contacts.push({ id: nanoid(), type: "fanbase", status: "pending", firstName: b.firstName, lastName: b.lastName, email: b.email, badgeTier: b.badgeTier, receivedAt: new Date().toISOString(), notes: "", data: b });
  writeJSON("contacts.json", contacts);

  const fanEmail = process.env.FANDOM_EMAIL ?? "fandom@chrispotterofficial.site";
  await Promise.all([
    sendContactEmail({ "First Name": b.firstName, "Last Name": b.lastName, Email: b.email, Phone: b.phone || "—", Country: b.country || "—", "Badge Tier": b.badgeTier, "Why Join": b.whyJoin || "—", Message: b.message || "—" }, fanEmail, `Fan Badge — ${b.badgeTier} — ${b.firstName} ${b.lastName}`),
    sendAutoReply(b.email, b.firstName, `Your ${b.badgeTier} Application — Chris Potter Official`, `Thank you for applying for the <strong>${b.badgeTier}</strong>! We're thrilled by your enthusiasm. Our fan team will review and reach out within <strong>48 hours</strong> to discuss your membership and exclusive benefits.`),
    sendSMS(`[BADGE] ${b.badgeTier} from ${b.firstName} ${b.lastName} (${b.email})`),
  ]);
  return res.json({ success: true, message: "Thank you! Our fan team will reach out within 48 hours." });
});

router.post("/charity", async (req, res) => {
  const b = req.body as Record<string, string>;
  const required = ["firstName", "lastName", "email", "message"];
  const missing = required.filter(f => !b[f]);
  if (missing.length) return res.status(400).json({ success: false, message: `Missing: ${missing.join(", ")}` });

  const contacts = readJSON<any[]>("contacts.json", []);
  contacts.push({ id: nanoid(), type: "charity", status: "pending", firstName: b.firstName, lastName: b.lastName, email: b.email, receivedAt: new Date().toISOString(), notes: "", data: b });
  writeJSON("contacts.json", contacts);

  const supportEmail = process.env.SUPPORT_EMAIL ?? "support@chrispotterofficial.site";
  await Promise.all([
    sendContactEmail({ "First Name": b.firstName, "Last Name": b.lastName, Email: b.email, "Support Type": b.supportType || "—", Amount: b.amount || "—", Message: b.message }, supportEmail, `Foundation Support — ${b.supportType || "Inquiry"} — ${b.firstName} ${b.lastName}`),
    sendAutoReply(b.email, b.firstName, "Your Message to the Heartland Legacy Fund — Received", `Thank you for reaching out to the Heartland Legacy Fund. We have received your message and our support team will respond within <strong>48 hours</strong>. Your generosity and interest in the Fund means the world to us — and to the horses and youth we serve.`),
    sendSMS(`[FOUNDATION] ${b.supportType || "General"} from ${b.firstName} ${b.lastName} (${b.email})`),
  ]);
  return res.json({ success: true, message: "Thank you for your message. Our support team will get back to you within 48 hours." });
});

router.post("/event-registration", async (req, res) => {
  const b = req.body as Record<string, string>;
  const required = ["firstName", "lastName", "email", "eventName"];
  const missing = required.filter(f => !b[f]);
  if (missing.length) return res.status(400).json({ success: false, message: `Missing: ${missing.join(", ")}` });

  const contacts = readJSON<any[]>("contacts.json", []);
  contacts.push({ id: nanoid(), type: "event", status: "pending", firstName: b.firstName, lastName: b.lastName, email: b.email, eventName: b.eventName, receivedAt: new Date().toISOString(), notes: "", data: b });
  writeJSON("contacts.json", contacts);

  const supportEmail = process.env.SUPPORT_EMAIL ?? "support@chrispotterofficial.site";
  await Promise.all([
    sendContactEmail({ "First Name": b.firstName, "Last Name": b.lastName, Email: b.email, Phone: b.phone || "—", Event: b.eventName, "Event Date": b.eventDate || "—", "Party Size": b.partySize || "1", Message: b.message || "—" }, supportEmail, `Event Registration — ${b.eventName} — ${b.firstName} ${b.lastName}`),
    sendAutoReply(b.email, b.firstName, `Registration Confirmed — ${b.eventName}`, `Thank you for registering your interest in <strong>${b.eventName}</strong>. We have received your registration and our events team will follow up with full details, including ticketing and logistics, as the event date approaches. We look forward to seeing you there.`),
    sendSMS(`[EVENT] ${b.eventName} — ${b.firstName} ${b.lastName} (party: ${b.partySize || "1"}) — ${b.email}`),
  ]);
  return res.json({ success: true, message: "Registration received. We will follow up with full event details closer to the date." });
});

export default router;
