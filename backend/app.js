/**
 * AlgoConfig UI – Express Backend
 * Simple REST API with JSON file persistence.
 */

const express = require('express');
const cors = require('cors');
const configRoutes = require('./routes/configs');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Config routes
app.use('/configs', configRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server (ONLY ONCE)
app.listen(PORT, () => {
  console.log(`AlgoConfig API running on port ${PORT}`);
});

module.exports = app;
