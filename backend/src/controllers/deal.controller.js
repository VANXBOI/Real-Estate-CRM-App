const pool = require('../config/db');

// GET /api/deals  — grouped by stage for Kanban view
const getAllDeals = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*,
        c.name  AS client_name,
        p.title AS property_title,
        u.name  AS agent_name
      FROM deals d
      LEFT JOIN clients    c ON d.client_id    = c.id
      LEFT JOIN properties p ON d.property_id  = p.id
      LEFT JOIN users      u ON d.agent_id     = u.id
      ORDER BY d.created_at DESC
    `);

    // Group by stage for easy Kanban rendering on the frontend
    const kanban = {
      Negotiation: [],
      Agreement:   [],
      Closed:      [],
      Cancelled:   []
    };
    result.rows.forEach(deal => {
      if (kanban[deal.stage]) kanban[deal.stage].push(deal);
    });

    res.json({ list: result.rows, kanban });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deals', details: err.message });
  }
};

// GET /api/deals/:id
const getDealById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT d.*, c.name AS client_name, p.title AS property_title, u.name AS agent_name
       FROM deals d
       LEFT JOIN clients c    ON d.client_id   = c.id
       LEFT JOIN properties p ON d.property_id = p.id
       LEFT JOIN users u      ON d.agent_id    = u.id
       WHERE d.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Deal not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch deal', details: err.message });
  }
};

// POST /api/deals
const createDeal = async (req, res) => {
  const { title, client_id, property_id, deal_value, commission_pct, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO deals (title, client_id, property_id, agent_id, deal_value, commission_pct, notes)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [title, client_id, property_id, req.user.id, deal_value, commission_pct || 2.0, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create deal', details: err.message });
  }
};

// PUT /api/deals/:id/stage  — move deal through Kanban stages
const updateDealStage = async (req, res) => {
  const { stage } = req.body;
  const validStages = ['Negotiation', 'Agreement', 'Closed', 'Cancelled'];
  if (!validStages.includes(stage)) {
    return res.status(400).json({ error: `Stage must be one of: ${validStages.join(', ')}` });
  }

  try {
    const closed_at = stage === 'Closed' ? 'NOW()' : 'NULL';
    const result = await pool.query(
      `UPDATE deals SET stage=$1, closed_at=${closed_at}, updated_at=NOW()
       WHERE id=$2 RETURNING *`,
      [stage, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Deal not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update deal stage', details: err.message });
  }
};

// GET /api/deals/reports/summary  — for the reports module
const getDealSummary = async (req, res) => {
  try {
    const summary = await pool.query(`
      SELECT
        COUNT(*)                                          AS total_deals,
        COUNT(*) FILTER (WHERE stage = 'Closed')         AS closed_deals,
        SUM(deal_value) FILTER (WHERE stage = 'Closed')  AS total_revenue,
        SUM(commission_amt) FILTER (WHERE stage='Closed') AS total_commission,
        ROUND(
          COUNT(*) FILTER (WHERE stage='Closed') * 100.0 / NULLIF(COUNT(*),0), 1
        )                                                AS close_rate_pct
      FROM deals
    `);
    res.json(summary.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary', details: err.message });
  }
};

module.exports = { getAllDeals, getDealById, createDeal, updateDealStage, getDealSummary };
