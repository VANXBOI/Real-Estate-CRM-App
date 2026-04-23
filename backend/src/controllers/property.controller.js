const pool = require('../config/db');

// GET /api/properties
const getAllProperties = async (req, res) => {
  try {
    const { status, type, min_price, max_price } = req.query;

    let query = `
      SELECT p.*, u.name AS listed_by_name
      FROM properties p
      LEFT JOIN users u ON p.listed_by = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) { params.push(status); query += ` AND p.status = $${params.length}`; }
    if (type)   { params.push(type);   query += ` AND p.type = $${params.length}`; }
    if (min_price) { params.push(min_price); query += ` AND p.price >= $${params.length}`; }
    if (max_price) { params.push(max_price); query += ` AND p.price <= $${params.length}`; }

    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch properties', details: err.message });
  }
};

// GET /api/properties/:id
const getPropertyById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS listed_by_name
       FROM properties p
       LEFT JOIN users u ON p.listed_by = u.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property', details: err.message });
  }
};

// POST /api/properties
const createProperty = async (req, res) => {
  const { title, type, location, price, size_sqft, bedrooms, bathrooms, amenities, images } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO properties
         (title, type, location, price, size_sqft, bedrooms, bathrooms, amenities, images, listed_by, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'Available')
       RETURNING *`,
      [title, type, location, price, size_sqft, bedrooms, bathrooms, amenities, images || [], req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create property', details: err.message });
  }
};

// PUT /api/properties/:id
const updateProperty = async (req, res) => {
  const { title, type, location, price, size_sqft, bedrooms, bathrooms, amenities, status, images } = req.body;
  try {
    const result = await pool.query(
      `UPDATE properties
       SET title=$1, type=$2, location=$3, price=$4, size_sqft=$5,
           bedrooms=$6, bathrooms=$7, amenities=$8, status=$9, images=$10, updated_at=NOW()
       WHERE id=$11
       RETURNING *`,
      [title, type, location, price, size_sqft, bedrooms, bathrooms, amenities, status, images, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update property', details: err.message });
  }
};

// DELETE /api/properties/:id
const deleteProperty = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM properties WHERE id=$1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Property not found' });
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete property', details: err.message });
  }
};

module.exports = { getAllProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
