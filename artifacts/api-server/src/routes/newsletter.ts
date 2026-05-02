import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "..", "..", "data");
const SUBSCRIBERS_FILE = path.join(DATA_DIR, "subscribers.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function loadSubscribers(): { email: string; name?: string; subscribedAt: string }[] {
  ensureDataDir();
  if (!fs.existsSync(SUBSCRIBERS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveSubscribers(subs: { email: string; name?: string; subscribedAt: string }[]) {
  ensureDataDir();
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subs, null, 2));
}

async function sendWelcomeEmail(to: string, name?: string) {
  try {
    const { createTransport } = await import("nodemailer");
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const fromName = process.env.SMTP_FROM_NAME ?? "Chris Potter Official";
    const fromEmail = process.env.SMTP_FROM_EMAIL ?? "newsletter@chrispotterofficial.site";

    if (!host || !user || !pass) {
      console.log("SMTP not configured — skipping email send. Subscriber saved:", to);
      return;
    }

    const transporter = createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject: "Welcome to the Chris Potter Newsletter",
      html: `
        <!DOCTYPE html>
        <html>
        <body style="background:#07090F;color:#fff;font-family:'Helvetica Neue',Arial,sans-serif;margin:0;padding:0;">
          <div style="max-width:580px;margin:0 auto;padding:48px 32px;">
            <p style="font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:32px;">Chris Potter Official</p>
            <h1 style="font-size:42px;font-weight:900;text-transform:uppercase;letter-spacing:-0.02em;margin:0 0 24px;line-height:1;">Welcome${name ? `, ${name}` : ""}.</h1>
            <p style="font-size:16px;color:rgba(255,255,255,0.6);line-height:1.7;margin-bottom:24px;">
              Thank you for joining the Chris Potter newsletter. You're now part of an exclusive community that gets first access to news, project announcements, and behind-the-scenes updates.
            </p>
            <p style="font-size:14px;color:rgba(255,255,255,0.4);line-height:1.7;margin-bottom:40px;">
              Expect updates on new projects, Heartland seasons, directorial work, and personal thoughts from Chris himself — delivered directly to your inbox.
            </p>
            <div style="border-top:1px solid rgba(255,255,255,0.08);padding-top:32px;">
              <p style="font-size:11px;color:rgba(255,255,255,0.2);letter-spacing:0.1em;text-transform:uppercase;">
                © ${new Date().getFullYear()} Chris Potter Official · <a href="#" style="color:rgba(255,255,255,0.2);">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (err) {
    console.error("Email send error:", err);
  }
}

router.post("/subscribe", async (req, res) => {
  const { email, name } = req.body as { email?: string; name?: string };

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: "Valid email address required." });
  }

  const subscribers = loadSubscribers();
  const exists = subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase());

  if (exists) {
    return res.status(409).json({ success: false, message: "This email is already subscribed." });
  }

  subscribers.push({ email, name, subscribedAt: new Date().toISOString() });
  saveSubscribers(subscribers);

  await sendWelcomeEmail(email, name);

  return res.json({ success: true, message: "Successfully subscribed. Welcome to the community." });
});

router.post("/unsubscribe", (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ success: false, message: "Email required." });

  const subscribers = loadSubscribers().filter(
    (s) => s.email.toLowerCase() !== email.toLowerCase()
  );
  saveSubscribers(subscribers);

  return res.json({ success: true, message: "You have been unsubscribed." });
});

export default router;
