import { Router } from "express";
import adminHandler from "../admin";

const router = Router();

/**
 * Adapter that forwards all /api/admin/* requests
 * to the existing Node-style admin handler.
 *
 * Express req/res are compatible with
 * IncomingMessage / ServerResponse.
 */
router.all("/*", async (req, res) => {
  return adminHandler(req, res);
});