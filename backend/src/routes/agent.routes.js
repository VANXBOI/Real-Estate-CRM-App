const express = require('express');
const router = express.Router();
const { protect, restrict } = require('../middleware/auth.middleware');
const pool = require('../config/db');

router.use(protect);

// GET /api/agents  — list all agents (admin/manager only)
router.get('/', restrict('admin', 'manager'), async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, u.role,
         COUNT(l.id) AS total_leads,
         COUNT(d.id) FILTER (WHERE d.stage = 'Closed') AS closed_deals
       FROM users u
       LEFT JOIN leads l ON l.assigned_to = u.id
       LEFT JOIN deals d ON d.agent_id    = u.id
       WHERE u.role = 'agent'
       GROUP BY u.id
       ORDER BY closed_deals DESC`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch agents', details: err.message });
  }
});

module.exports = router;
