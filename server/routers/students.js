import express from "express";
import pool from "../db.js";

const router = express.Router();



// Get student
router.get('/:classNum', async (req, res) => {
    try {
        const classNum = parseInt(req.params.classNum);
        const filter = req.query.filter; 

        let query = 'SELECT * FROM students WHERE class = $1';
        const values = [classNum];

        if (filter === 'fail') {
            query += ' AND (physics < 50 OR chemistry < 50 OR english < 50 OR tamil < 50)';
        } else if (filter === 'above50') {
            query += ' AND (physics >= 50 AND chemistry >= 50 AND english >= 50 AND tamil >= 50)';
        } else if (filter === 'above90') {
            query += ' AND (physics > 90 AND chemistry > 90 AND english > 90 AND tamil > 90)';
        }

        const students = await pool.query(query, values);
        res.json(students.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single student by ID
router.get('/student/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const student = await pool.query('SELECT * FROM students WHERE id = $1', [id]);
        if (student.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.json(student.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
