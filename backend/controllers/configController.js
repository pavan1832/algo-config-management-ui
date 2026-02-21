/**
 * Config Controller
 * Handles CRUD logic for algorithm configurations.
 * Uses in-memory store with JSON file sync for persistence.
 */
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/configs.json');

// Load from file or start empty
let configs = [];
try {
  if (fs.existsSync(DATA_FILE)) {
    configs = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  }
} catch (err) {
  console.warn('Could not load configs.json, starting fresh.');
}

function persist() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(configs, null, 2));
  } catch (err) {
    console.error('Failed to persist configs:', err.message);
  }
}

// Validation rules
function validateConfig(body) {
  const errors = {};
  const VALID_INSTRUMENTS = ['NIFTY', 'BANKNIFTY', 'SP500', 'NASDAQ', 'EURUSD'];
  const VALID_TIMEFRAMES = ['1m', '5m', '15m', '1h'];

  if (!body.name || body.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters.';
  }
  if (!VALID_INSTRUMENTS.includes(body.instrument)) {
    errors.instrument = `Instrument must be one of: ${VALID_INSTRUMENTS.join(', ')}.`;
  }
  if (!VALID_TIMEFRAMES.includes(body.timeframe)) {
    errors.timeframe = `Timeframe must be one of: ${VALID_TIMEFRAMES.join(', ')}.`;
  }
  if (typeof body.entryThreshold !== 'number' || body.entryThreshold <= 0) {
    errors.entryThreshold = 'Entry threshold must be a positive number.';
  }
  if (typeof body.exitThreshold !== 'number' || body.exitThreshold <= 0) {
    errors.exitThreshold = 'Exit threshold must be a positive number.';
  }
  if (typeof body.maxLossPct !== 'number' || body.maxLossPct <= 0 || body.maxLossPct > 100) {
    errors.maxLossPct = 'Max loss % must be between 0 and 100.';
  }
  if (!Number.isInteger(body.maxTradesPerDay) || body.maxTradesPerDay < 1) {
    errors.maxTradesPerDay = 'Max trades per day must be a positive integer.';
  }

  return errors;
}

// GET /configs
exports.listConfigs = (req, res) => {
  res.json({ data: configs, count: configs.length });
};

// GET /configs/:id
exports.getConfig = (req, res) => {
  const config = configs.find(c => c.id === req.params.id);
  if (!config) return res.status(404).json({ error: 'Config not found.' });
  res.json({ data: config });
};

// POST /configs
exports.createConfig = (req, res) => {
  const errors = validateConfig(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  const config = {
    id: uuidv4(),
    name: req.body.name.trim(),
    instrument: req.body.instrument,
    timeframe: req.body.timeframe,
    entryThreshold: req.body.entryThreshold,
    exitThreshold: req.body.exitThreshold,
    maxLossPct: req.body.maxLossPct,
    maxTradesPerDay: req.body.maxTradesPerDay,
    enabled: req.body.enabled ?? true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  configs.push(config);
  persist();
  res.status(201).json({ data: config });
};

// PUT /configs/:id
exports.updateConfig = (req, res) => {
  const idx = configs.findIndex(c => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Config not found.' });

  const errors = validateConfig(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(422).json({ errors });
  }

  configs[idx] = {
    ...configs[idx],
    name: req.body.name.trim(),
    instrument: req.body.instrument,
    timeframe: req.body.timeframe,
    entryThreshold: req.body.entryThreshold,
    exitThreshold: req.body.exitThreshold,
    maxLossPct: req.body.maxLossPct,
    maxTradesPerDay: req.body.maxTradesPerDay,
    enabled: req.body.enabled ?? configs[idx].enabled,
    updatedAt: new Date().toISOString(),
  };

  persist();
  res.json({ data: configs[idx] });
};
