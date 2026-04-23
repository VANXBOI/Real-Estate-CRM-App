const pool = require('../config/db');

// GET /api/clients
const getAllClients = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.*, l.name AS lead_name,
        COALESCE(json_agg(pv.property_id) FILTER (WHERE pv.property_id IS NOT NULL), '[]') AS visited_properties
      FROM clients c
      LEFT JOIN leads l ON c.lead_id = l.id
      LEFT JOIN property_visits pv ON pv.client_id = c.id
      GROUP BY c.id, l.name
      ORDER BY c.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch clients', details: err.message });
  }
};

// GET /api/clients/:id
const getClientById = async (req, res) => {
  try {
    const client = await pool.query('SELECT * FROM clients WHERE id=$1', [req.params.id]);
    if (client.rows.length === 0) return res.status(404).json({ error: 'Client not found' });

    // Also fetch their interactions
    const interactions = await pool.query(
      'SELECT * FROM interactions WHERE client_id=$1 ORDER BY created_at DESC',
      [req.params.id]
    );

    res.json({ ...client.rows[0], interactions: interactions.rows });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch client', details: err.message });
  }
};

// POST /api/clients
const createClient = async (req, res) => {
  const { name, phone, email, type, lead_id, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO clients (name, phone, email, type, lead_id, notes)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [name, phone, email, type, lead_id, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create client', details: err.message });
  }
};

// PUT /api/clients/:id
const updateClient = async (req, res) => {
  const { name, phone, email, type, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE clients SET name=$1, phone=$2, email=$3, type=$4, notes=$5, updated_at=NOW()
       WHERE id=$6 RETURNING *`,
      [name, phone, email, type, notes, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Client not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update client', details: err.message });
  }
};

// POST /api/clients/:id/interactions  — log a call/email/meeting
const logInteraction = async (req, res) => {
  const { type, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO interactions (client_id, agent_id, type, notes)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.params.id, req.user.id, type, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log interaction', details: err.message });
  }
};

module.exports = { getAllClients, getClientById, createClient, updateClient, logInteraction };
