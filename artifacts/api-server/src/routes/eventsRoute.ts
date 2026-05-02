import { Router } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA = path.join(__dirname, "..", "..", "data");

function ensureDir() { if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true }); }
function readCounts(): Record<string, number> {
  ensureDir();
  const p = path.join(DATA, "events-counts.json");
  if (!fs.existsSync(p)) return {};
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return {}; }
}

router.get("/", (_req, res) => {
  const counts = readCounts();
  res.set("Cache-Control", "no-store");
  res.json({ success: true, counts });
});

export default router;
