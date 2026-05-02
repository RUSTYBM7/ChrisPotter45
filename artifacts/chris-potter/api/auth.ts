import type { IncomingMessage, ServerResponse } from "http";
import crypto from "crypto";

async function readBody(req: IncomingMessage): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", c => { data += c; });
    req.on("end", () => { try { resolve(JSON.parse(data)); } catch { resolve({}); } });
    req.on("error", reject);
  });
}

function getSecret(): string {
  return process.env.MAGIC_LINK_SECRET ?? "chris-potter-official-secret-2025";
}

function signToken(email: string, exp: number): string {
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString("base64url");
  const sig = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

function verifyToken(token: string): { email: string; exp: number } | null {
  try {
    const [payload, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", getSecret()).update(payload).digest("base64url");
    if (sig !== expected) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (Date.now() > data.exp) return null;
    return data;
  } catch { return null; }
}

async function sendMagicLink(to: string, token: string, baseUrl: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const link = `${baseUrl}/fan-portal?token=${token}`;

  if (!host || !user || !pass) {
    console.log("SMTP not configured — magic link:", link);
    return;
  }

  const { createTransport } = await import("nodemailer");
  const transporter = createTransport({
    host, port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Chris Potter Official" <${process.env.SMTP_FROM_EMAIL ?? "noreply@chrispotterofficial.site"}>`,
    to,
    subject: "Your Fan Portal Access Link — Chris Potter Official",
    html: `<!DOCTYPE html><html><body style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;">
<div style="max-width:520px;margin:0 auto;padding:48px 32px;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:32px;">Chris Potter Official — Fan Portal</p>
  <h1 style="font-size:36px;font-weight:900;text-transform:uppercase;margin:0 0 20px;line-height:1;">Your Access Link.</h1>
  <p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:32px;">
    Click the button below to access the Chris Potter Fan Portal. This link is valid for <strong>1 hour</strong> and can only be used once.
  </p>
  <a href="${link}" style="display:inline-block;background:#fff;color:#07090F;font-weight:900;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;text-decoration:none;padding:16px 36px;border-radius:8px;margin-bottom:32px;">Access Fan Portal</a>
  <p style="font-size:12px;color:rgba(255,255,255,0.3);word-break:break-all;">${link}</p>
  <div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:40px;padding-top:24px;">
    <p style="font-size:11px;color:rgba(255,255,255,0.2);">If you did not request this, you can safely ignore this email.</p>
  </div>
</div></body></html>`,
  });
}

export default async function handler(req: IncomingMessage & { url?: string; headers: Record<string, string | string[] | undefined> }, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  const url = req.url ?? "";

  // ── POST /api/auth/request — send magic link ──
  if (req.method === "POST" && url.includes("/request")) {
    const body = await readBody(req);
    const { email } = body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, message: "Valid email required." }));
      return;
    }
    const exp = Date.now() + 60 * 60 * 1000;
    const token = signToken(email, exp);
    const origin = (req.headers["origin"] as string) ?? (process.env.NEXT_PUBLIC_SITE_URL ?? "https://chrispotterofficial.site");
    await sendMagicLink(email, token, origin);
    res.end(JSON.stringify({ success: true, message: "Magic link sent! Check your email." }));
    return;
  }

  // ── POST /api/auth/verify — validate token ──
  if (req.method === "POST" && url.includes("/verify")) {
    const body = await readBody(req);
    const { token } = body;
    if (!token) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, message: "Token required." }));
      return;
    }
    const data = verifyToken(token);
    if (!data) {
      res.statusCode = 401;
      res.end(JSON.stringify({ success: false, message: "Invalid or expired link. Please request a new one." }));
      return;
    }
    const sessionToken = signToken(data.email, Date.now() + 24 * 60 * 60 * 1000);
    res.end(JSON.stringify({ success: true, email: data.email, sessionToken }));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ success: false, message: "Not found." }));
}
