import type { IncomingMessage, ServerResponse } from "http";

async function readBody(req: IncomingMessage): Promise<Record<string, string>> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => { data += chunk; });
    req.on("end", () => {
      try { resolve(JSON.parse(data)); }
      catch { resolve({}); }
    });
    req.on("error", reject);
  });
}

async function sendEmail(to: string, subject: string, html: string) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    console.log("SMTP not configured — email skipped. To:", to, "Subject:", subject);
    return;
  }
  const { createTransport } = await import("nodemailer");
  const transporter = createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass },
  });
  await transporter.sendMail({
    from: `"Chris Potter Official" <${process.env.SMTP_FROM_EMAIL ?? "noreply@chrispotterofficial.site"}>`,
    to,
    subject,
    html,
  });
}

async function sendAutoReply(to: string, name: string, subject: string, message: string) {
  const html = `<!DOCTYPE html>
<html><body style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;">
<div style="max-width:580px;margin:0 auto;padding:48px 32px;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:24px;">Chris Potter Official</p>
  <h1 style="font-size:36px;font-weight:900;text-transform:uppercase;margin:0 0 20px;line-height:1;">Thank You, ${name}.</h1>
  <p style="font-size:15px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:16px;">${message}</p>
  <p style="font-size:13px;color:rgba(255,255,255,0.35);line-height:1.7;">This is an automated confirmation. Please do not reply directly to this email.</p>
  <div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:40px;padding-top:24px;">
    <p style="font-size:11px;color:rgba(255,255,255,0.2);">&copy; ${new Date().getFullYear()} Chris Potter Official &middot; chrispotterofficial.site</p>
  </div>
</div>
</body></html>`;
  await sendEmail(to, subject, html);
}

async function sendSMS(to: string, body: string) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const adminSms = process.env.ADMIN_SMS_NUMBER;
  const recipient = to || adminSms;
  if (!sid || !token || !from || !recipient) return;
  try {
    const creds = Buffer.from(`${sid}:${token}`).toString("base64");
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ To: recipient, From: from, Body: body }).toString(),
    });
  } catch (err) {
    console.error("SMS error:", err);
  }
}

function emailTable(data: Record<string, string>): string {
  const rows = Object.entries(data)
    .map(([k, v]) => `<tr>
      <td style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.12em;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;padding-right:24px;white-space:nowrap;">${k}</td>
      <td style="color:#fff;font-size:14px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${v}</td>
    </tr>`)
    .join("");
  return `<table style="width:100%;border-collapse:collapse;">${rows}</table>`;
}

export default async function handler(req: IncomingMessage & { query?: Record<string, string> }, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ success: false, message: "Method not allowed" }));
    return;
  }

  const url = req.url ?? "";
  const body = await readBody(req);

  // ── /api/contact/management ──
  if (url.includes("/management")) {
    const required = ["firstName", "lastName", "email", "reason"];
    const missing = required.filter(f => !body[f]);
    if (missing.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, message: `Missing: ${missing.join(", ")}` }));
      return;
    }

    const mgmt = process.env.MANAGEMENT_EMAIL ?? "management@chrispotterofficial.site";
    const subject = `New Management Inquiry — ${body.reason} — ${body.firstName} ${body.lastName}`;
    const tableData: Record<string, string> = {
      "First Name": body.firstName, "Last Name": body.lastName,
      Email: body.email, Phone: body.phone || "—",
      Company: body.company || "—", Title: body.jobTitle || "—",
      Address: [body.address, body.city, body.country].filter(Boolean).join(", ") || "—",
      Reason: body.reason, "Project Details": body.projectDetails || "—",
      Timeline: body.timeline || "—", "How Heard": body.howHeard || "—",
      "Preferred Contact": body.preferredContact || "—", Message: body.message || "—",
    };

    const notifHtml = `<!DOCTYPE html><html><body style="background:#07090F;color:#fff;font-family:Arial,sans-serif;margin:0;padding:0;">
<div style="max-width:640px;margin:0 auto;padding:48px 32px;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:24px;">Chris Potter Official — Management Inquiry</p>
  <h2 style="font-size:28px;font-weight:900;text-transform:uppercase;margin:0 0 32px;">${subject}</h2>
  ${emailTable(tableData)}
  <p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">Received: ${new Date().toUTCString()}</p>
</div></body></html>`;

    await Promise.all([
      sendEmail(mgmt, subject, notifHtml),
      sendAutoReply(body.email, body.firstName, "We received your inquiry — Chris Potter Official",
        "Thank you for reaching out to Chris Potter's management team. We have received your inquiry and will respond within 3–5 business days."),
      sendSMS("", `[INQUIRY] Management: ${body.reason} from ${body.firstName} ${body.lastName} (${body.email})`),
    ]);

    res.end(JSON.stringify({ success: true, message: "Inquiry received. Our management team will respond within 3–5 business days." }));
    return;
  }

  // ── /api/contact/fanbase ──
  if (url.includes("/fanbase")) {
    const required = ["firstName", "lastName", "email", "badgeTier"];
    const missing = required.filter(f => !body[f]);
    if (missing.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, message: `Missing: ${missing.join(", ")}` }));
      return;
    }

    const fanEmail = process.env.FANDOM_EMAIL ?? "fandom@chrispotterofficial.site";
    const subject = `Fan Badge Inquiry — ${body.badgeTier} — ${body.firstName} ${body.lastName}`;
    const tableData: Record<string, string> = {
      "First Name": body.firstName, "Last Name": body.lastName,
      Email: body.email, Phone: body.phone || "—",
      Country: body.country || "—", "Badge Tier": body.badgeTier,
      "Why Join": body.whyJoin || "—", Message: body.message || "—",
    };

    const notifHtml = `<!DOCTYPE html><html><body style="background:#07090F;color:#fff;font-family:Arial,sans-serif;margin:0;padding:0;">
<div style="max-width:640px;margin:0 auto;padding:48px 32px;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:24px;">Chris Potter Official — Fan Badge Inquiry</p>
  <h2 style="font-size:28px;font-weight:900;text-transform:uppercase;margin:0 0 32px;">${subject}</h2>
  ${emailTable(tableData)}
  <p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">Received: ${new Date().toUTCString()}</p>
</div></body></html>`;

    await Promise.all([
      sendEmail(fanEmail, subject, notifHtml),
      sendAutoReply(body.email, body.firstName, `Your ${body.badgeTier} Application — Chris Potter Official`,
        `Thank you for applying for the <strong>${body.badgeTier}</strong>! We're thrilled by your support. Our fan team will review your application and reach out within 48 hours to discuss next steps.`),
      sendSMS("", `[BADGE] ${body.badgeTier} from ${body.firstName} ${body.lastName} (${body.email})`),
    ]);

    res.end(JSON.stringify({ success: true, message: "Thank you for your interest! Our fan team will reach out within 48 hours." }));
    return;
  }

  // ── /api/contact/charity ──
  if (url.includes("/charity")) {
    const required = ["firstName", "lastName", "email", "message"];
    const missing = required.filter(f => !body[f]);
    if (missing.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, message: `Missing: ${missing.join(", ")}` }));
      return;
    }

    const supportEmail = process.env.SUPPORT_EMAIL ?? "support@chrispotterofficial.site";
    const subject = `Foundation Support — ${body.supportType || "Inquiry"} — ${body.firstName} ${body.lastName}`;
    const tableData: Record<string, string> = {
      "First Name": body.firstName, "Last Name": body.lastName,
      Email: body.email, "Support Type": body.supportType || "—",
      Amount: body.amount || "—", Message: body.message,
    };

    const notifHtml = `<!DOCTYPE html><html><body style="background:#07090F;color:#fff;font-family:Arial,sans-serif;margin:0;padding:0;">
<div style="max-width:640px;margin:0 auto;padding:48px 32px;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:24px;">Heartland Legacy Fund — Foundation Support</p>
  <h2 style="font-size:28px;font-weight:900;text-transform:uppercase;margin:0 0 32px;">${subject}</h2>
  ${emailTable(tableData)}
  <p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">Received: ${new Date().toUTCString()}</p>
</div></body></html>`;

    await Promise.all([
      sendEmail(supportEmail, subject, notifHtml),
      sendAutoReply(body.email, body.firstName, "Your Message to the Heartland Legacy Fund — Received",
        "Thank you for reaching out to the Heartland Legacy Fund. We have received your message and our support team will respond within 48 hours. Your generosity and interest in the Fund means the world to us — and to the horses and youth we serve."),
      sendSMS("", `[FOUNDATION] ${body.supportType || "General"} from ${body.firstName} ${body.lastName} (${body.email})`),
    ]);

    res.end(JSON.stringify({ success: true, message: "Thank you for your message. Our support team will get back to you within 48 hours." }));
    return;
  }

  // ── /api/contact/event-registration ──
  if (url.includes("/event-registration")) {
    const required = ["firstName", "lastName", "email", "eventName"];
    const missing = required.filter(f => !body[f]);
    if (missing.length) {
      res.statusCode = 400;
      res.end(JSON.stringify({ success: false, message: `Missing: ${missing.join(", ")}` }));
      return;
    }

    const supportEmail = process.env.SUPPORT_EMAIL ?? "support@chrispotterofficial.site";
    const subject = `Event Registration — ${body.eventName} — ${body.firstName} ${body.lastName}`;
    const tableData: Record<string, string> = {
      "First Name": body.firstName, "Last Name": body.lastName, Email: body.email,
      Phone: body.phone || "—", Event: body.eventName, "Event Date": body.eventDate || "—",
      "Party Size": body.partySize || "1", Message: body.message || "—",
    };

    const notifHtml = `<!DOCTYPE html><html><body style="background:#07090F;color:#fff;font-family:Arial,sans-serif;margin:0;padding:0;">
<div style="max-width:640px;margin:0 auto;padding:48px 32px;">
  <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:24px;">Heartland Legacy Fund — Event Registration</p>
  <h2 style="font-size:28px;font-weight:900;text-transform:uppercase;margin:0 0 32px;">${subject}</h2>
  ${emailTable(tableData)}
  <p style="font-size:11px;color:rgba(255,255,255,0.2);margin-top:40px;">Received: ${new Date().toUTCString()}</p>
</div></body></html>`;

    await Promise.all([
      sendEmail(supportEmail, subject, notifHtml),
      sendAutoReply(body.email, body.firstName, `Registration Confirmed — ${body.eventName}`,
        `Thank you for registering your interest in <strong>${body.eventName}</strong>. We have received your registration and our events team will follow up with full details — including ticketing and logistics — as the event date approaches. We look forward to seeing you there.`),
      sendSMS("", `[EVENT] ${body.eventName} — ${body.firstName} ${body.lastName} (party: ${body.partySize || "1"}) — ${body.email}`),
    ]);

    res.end(JSON.stringify({ success: true, message: "Registration received. We will follow up with full event details closer to the date." }));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({ success: false, message: "Not found" }));
}
