import { Router } from "express";
import pool from "../db.js";
import { authenticate} from "../middleware/auth.js";
import type {AuthRequest } from "../middleware/auth.js";


const router = Router();

// Create a new block
router.post("/", authenticate, async (req: AuthRequest, res) => {
  const { documentId, type, content, position } = req.body;
  const userId = req.user.id;

  try {
    // Only owner can add blocks
    const ownerCheck = await pool.query(
      "SELECT owner_id FROM documents WHERE id=$1",
      [documentId]
    );
    if (!ownerCheck.rows.length || ownerCheck.rows[0].owner_id !== userId)
      return res.status(403).json({ error: "No permission" });

    const result = await pool.query(
      "INSERT INTO blocks (document_id, type, content, position) VALUES ($1,$2,$3,$4) RETURNING *",
      [documentId, type, content, position]
    );

    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get all blocks of a document
router.get("/:documentId", authenticate, async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const documentId = req.params.documentId;

  try {
    const accessCheck = await pool.query(
      "SELECT * FROM documents WHERE id=$1 AND (owner_id=$2 OR EXISTS (SELECT 1 FROM document_users WHERE doc_id=$1 AND user_id=$2))",
      [documentId, userId]
    );
    if (!accessCheck.rows.length) return res.status(403).json({ error: "No access" });

    const result = await pool.query(
      "SELECT * FROM blocks WHERE document_id=$1 ORDER BY position ASC",
      [documentId]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Update a block
router.put("/:blockId", authenticate, async (req: AuthRequest, res) => {
  const { type, content, position } = req.body;
  const blockId = req.params.blockId;
  const userId = req.user.id;

  try {
    // Check block ownership via document
    const check = await pool.query(
      `SELECT b.id, d.owner_id FROM blocks b 
       JOIN documents d ON b.document_id = d.id
       WHERE b.id=$1`,
      [blockId]
    );

    if (!check.rows.length) return res.status(404).json({ error: "Block not found" });
    if (check.rows[0].owner_id !== userId) return res.status(403).json({ error: "No permission" });

    const result = await pool.query(
      "UPDATE blocks SET type=$1, content=$2, position=$3, updated_at=NOW() WHERE id=$4 RETURNING *",
      [type, content, position, blockId]
    );

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a block
router.delete("/:blockId", authenticate, async (req: AuthRequest, res) => {
  const blockId = req.params.blockId;
  const userId = req.user.id;

  try {
    const check = await pool.query(
      `SELECT b.id, d.owner_id FROM blocks b 
       JOIN documents d ON b.document_id = d.id
       WHERE b.id=$1`,
      [blockId]
    );

    if (!check.rows.length) return res.status(404).json({ error: "Block not found" });
    if (check.rows[0].owner_id !== userId) return res.status(403).json({ error: "No permission" });

    await pool.query("DELETE FROM blocks WHERE id=$1", [blockId]);
    res.json({ message: "Block deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
