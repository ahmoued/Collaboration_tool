import { Router } from "express";
import pool from "../db.js";
import { authenticate } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

/**
 * GET /users/me
 * Returns the logged-in user's profile
 */
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE id=$1",
      [userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /users
 * Returns all users (useful for sharing documents)
 */
router.get("/", authenticate, async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email FROM users ORDER BY email ASC"
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /users/search?username=query
 * Search users by username for collaboration invites
 */
router.get("/search", authenticate, async (req: AuthRequest, res) => {
  const { username } = req.query;

  if (!username || typeof username !== "string") {
    return res.status(400).json({ error: "Username query is required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, username, email FROM users WHERE username ILIKE $1 AND id != $2 ORDER BY username ASC LIMIT 10",
      [`%${username}%`, req.user.id] // Exclude current user from search
    );

    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
