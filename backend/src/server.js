const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

// Import DB to trigger connection check on startup
require('./config/db');

// Import routes
const authRoutes = require('./routes/auth.routes');
const leadRoutes = require('./routes/lead.routes');
const propertyRoutes = require('./routes/property.routes');
const clientRoutes = require('./routes/client.routes');
const dealRoutes = require('./routes/deal.routes');
const agentRoutes = require('./routes/agent.routes');

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // logs every request in the terminal

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/deals', dealRoutes);
app.use('/api/agents', agentRoutes);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Real Estate CRM API is running' });
});

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong', details: err.message });
});

// ─── Start server ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
