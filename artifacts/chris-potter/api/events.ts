import type { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";

const DATA = process.env.VERCEL ? "/tmp/cp-data" : path.join(process.cwd(), "data");

function ensureDir() { if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true }); }
function readCounts(): Record<string, number> {
  ensureDir();
  const p = path.join(DATA, "events-counts.json");
  if (!fs.existsSync(p)) return {};
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return {}; }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "GET") {
    const counts = readCounts();
    res.end(JSON.stringify({ success: true, counts }));
    return;
  }

  res.statusCode = 405;
  res.end(JSON.stringify({ success: false, message: "Method not allowed" }));
}
