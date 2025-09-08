import express from "express";
import pool from "../db.js";

const router = express.Router();

// Get comments 
router.get('/', async (req, res) => {
  try {
    const { studentIds } = req.query; 
    if (!studentIds) return res.json([]);

    const ids = studentIds.split(',').map(Number);
    const comments = await pool.query(
      'SELECT * FROM comparisons WHERE student_ids && $1::int[] ORDER BY created_at DESC',
      [ids]
    );
    res.json(comments.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new comment for students
router.post('/', async (req, res) => {
  try {
    const { student_ids, comment } = req.body; 
    const result = await pool.query(
      'INSERT INTO comparisons (student_ids, comment) VALUES ($1, $2) RETURNING *',
      [student_ids, comment]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
