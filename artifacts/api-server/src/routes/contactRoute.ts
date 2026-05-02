import { Router } from "express";

const router = Router();

async function sendContactEmail(data: Record<string, string>, to: string, subject: string) {
  try {
    const { createTransport } = await import("nodemailer");
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      console.log("SMTP not configured — contact inquiry received:", data.email, data.subject);
      return;
    }

    const transporter = createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    const rows = Object.entries(data)
      .map(([k, v]) => `<tr><td style="color:rgba(255,255,255,0.4);font-size:11px;text-transform:uppercase;letter-spacing:0.12em;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;padding-right:24px;">${k}</td><td style="color:#fff;font-size:14px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05);">${v}</td></tr>`)
      .join("");

    await transporter.sendMail({
      from: `"Chris Potter Website" <${process.env.SMTP_FROM_EMAIL ?? "noreply@chrispotterofficial.site"}>`,
      to,
      replyTo: data.email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;">
          <div style="max-width:640px;margin:0 auto;padding:48px 32px;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:24px;">Chris Potter Official — New Inquiry</p>
            <h2 style="font-size:28px;font-weight:900;text-transform:uppercase;margin:0 0 32px;">${subject}</h2>
            <table style="width:100%;border-collapse:collapse;">${rows}</table>
            <div style="border-top:1px solid rgba(255,255,255,0.08);margin-top:40px;padding-top:24px;">
              <p style="font-size:11px;color:rgba(255,255,255,0.2);">Received: ${new Date().toUTCString()}</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    console.error("Contact email error:", err);
  }
}

router.post("/management", async (req, res) => {
  const b = req.body as Record<string, string>;
  const required = ["firstName", "lastName", "email", "reason"];
  const missing = required.filter((f) => !b[f]);
  if (missing.length) {
    return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(", ")}` });
  }

  const mgmtEmail = process.env.MANAGEMENT_EMAIL ?? "management@chrispotterofficial.site";
  await sendContactEmail(
    {
      "First Name": b.firstName,
      "Last Name": b.lastName,
      Email: b.email,
      Phone: b.phone || "—",
      Company: b.company || "—",
      Title: b.jobTitle || "—",
      Address: [b.address, b.city, b.country].filter(Boolean).join(", ") || "—",
      Reason: b.reason,
      "Project Details": b.projectDetails || "—",
      Timeline: b.timeline || "—",
      "How They Heard": b.howHeard || "—",
      "Preferred Contact": b.preferredContact || "—",
      Message: b.message || "—",
    },
    mgmtEmail,
    `New Management Inquiry — ${b.reason} — ${b.firstName} ${b.lastName}`
  );

  return res.json({ success: true, message: "Inquiry received. Our management team will be in touch within 3–5 business days." });
});

router.post("/fanbase", async (req, res) => {
  const b = req.body as Record<string, string>;
  const required = ["firstName", "lastName", "email", "badgeTier"];
  const missing = required.filter((f) => !b[f]);
  if (missing.length) {
    return res.status(400).json({ success: false, message: `Missing fields: ${missing.join(", ")}` });
  }

  const fanEmail = process.env.FANDOM_EMAIL ?? "fandom@chrispotterofficial.site";
  await sendContactEmail(
    {
      "First Name": b.firstName,
      "Last Name": b.lastName,
      Email: b.email,
      Phone: b.phone || "—",
      Country: b.country || "—",
      "Badge Tier": b.badgeTier,
      "Why Join": b.whyJoin || "—",
      Message: b.message || "—",
    },
    fanEmail,
    `Fan Badge Inquiry — ${b.badgeTier} — ${b.firstName} ${b.lastName}`
  );

  return res.json({ success: true, message: "Thank you for your interest! Our fan team will reach out within 48 hours." });
});

export default router;
