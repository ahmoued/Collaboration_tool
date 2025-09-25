import pool from "../db.js";
import type { Response, Request } from "express";
import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import type { AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res) => {
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT d.*, 
              CASE WHEN d.owner_id=$1 THEN 'owner'
                   ELSE du.role END AS role
       FROM documents d
       LEFT JOIN document_users du ON du.doc_id=d.id AND du.user_id=$1
       WHERE d.owner_id=$1 OR du.user_id=$1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", authenticate, async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const docId = req.params.id;

  try {
    const result = await pool.query(
      `SELECT d.*, 
              CASE WHEN d.owner_id=$1 THEN 'owner'
                   ELSE du.role END AS role
       FROM documents d
       LEFT JOIN document_users du ON du.doc_id=d.id AND du.user_id=$1
       WHERE d.id=$2 AND (d.owner_id=$1 OR du.user_id=$1)`,
      [userId, docId]
    );

    if (!result.rows.length)
      return res.status(403).json({ error: "No access" });

    res.json(result.rows[0]);
    console.log("backend document: ", result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user.id;

  try {
    const result = await pool.query(
      "INSERT INTO documents (title, content, owner_id) VALUES ($1, $2, $3) RETURNING id, title, content, owner_id, created_at, updated_at",
      [title, content || {}, userId]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body;
  const userId = req.user.id;
  const docId = req.params.id;

  // Debug logging
  console.log("PUT /docs/:id - Request data:", {
    title,
    content: typeof content,
    contentValue: content,
    userId,
    docId,
  });

  try {
    const access = await pool.query(
      "select * from document_users where doc_id =$1 and user_id = $2",
      [docId, userId]
    );
    const isOwned = await pool.query("select * from documents where id = $1", [
      docId,
    ]);
    const role = access.rows[0]?.role;
    if (!isOwned.rows[0] && !role)
      return res.status(403).json({ error: "No permission to you" });
    if (isOwned.rows[0]?.owner_id !== userId && role !== "editor")
      return res.status(403).json({ error: "No permission brother" });
    const result = await pool.query(
      'UPDATE documents SET title = $1, "content" = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [title, content, docId]
    );
    res.json(result.rows[0]);
  } catch (err: any) {
    console.error("Error in PUT /docs/:id:", {
      message: err.message,
      code: err.code,
      detail: err.detail,
      position: err.position,
      query: err.query,
    });
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", authenticate, async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const docId = req.params.id;

  try {
    const result = await pool.query(
      "DELETE FROM documents WHERE id=$1 AND owner_id=$2 RETURNING *",
      [docId, userId]
    );

    if (!result.rows.length)
      return res.status(403).json({ error: "No permission" });

    res.json({ message: "Document deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/share", authenticate, async (req: AuthRequest, res) => {
  const userId = req.user.id;
  const docId = req.params.id;
  const { targetUserId, role } = req.body; // role = 'editor' or 'viewer'

  try {
    // Only owner can share
    const owner = await pool.query(
      "SELECT owner_id FROM documents WHERE id=$1",
      [docId]
    );
    console.log(owner.rows);
    if (!owner.rows.length || owner.rows[0].owner_id !== userId)
      return res.status(403).json({ error: "No permission" });

    const result = await pool.query(
      "INSERT INTO document_users (user_id, doc_id, role) VALUES ($1, $2, $3) ON CONFLICT (user_id, doc_id) DO UPDATE SET role=EXCLUDED.role RETURNING *",
      [targetUserId, docId, role]
    );

    res.json(result.rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
