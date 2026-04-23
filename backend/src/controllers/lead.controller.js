const pool = require('../config/db');

// GET /api/leads
const getAllLeads = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT l.*, u.name AS assigned_agent
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      ORDER BY l.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leads', details: err.message });
  }
};

// GET /api/leads/:id
const getLeadById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch lead', details: err.message });
  }
};

// POST /api/leads
const createLead = async (req, res) => {
  const { name, phone, email, budget, source, preferences, assigned_to } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO leads (name, phone, email, budget, source, preferences, assigned_to, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'New')
       RETURNING *`,
      [name, phone, email, budget, source, preferences, assigned_to]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create lead', details: err.message });
  }
};

// PUT /api/leads/:id
const updateLead = async (req, res) => {
  const { name, phone, email, budget, source, preferences, status, assigned_to } = req.body;
  try {
    const result = await pool.query(
      `UPDATE leads
       SET name=$1, phone=$2, email=$3, budget=$4, source=$5,
           preferences=$6, status=$7, assigned_to=$8, updated_at=NOW()
       WHERE id=$9
       RETURNING *`,
      [name, phone, email, budget, source, preferences, status, assigned_to, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update lead', details: err.message });
  }
};

// DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM leads WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json({ message: 'Lead deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete lead', details: err.message });
  }
};

module.exports = { getAllLeads, getLeadById, createLead, updateLead, deleteLead };
