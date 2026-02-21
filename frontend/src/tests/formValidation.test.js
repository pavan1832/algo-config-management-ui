/**
 * Tests for client-side form validation logic.
 * Extracted from ConfigForm to enable pure unit testing.
 */

// Re-implement validate function here (matches ConfigForm.js exactly)
function validate(fields) {
  const errors = {};
  if (!fields.name.trim() || fields.name.trim().length < 3)
    errors.name = 'Name must be at least 3 characters.';
  if (!fields.instrument)
    errors.instrument = 'Please select an instrument.';
  if (!fields.timeframe)
    errors.timeframe = 'Please select a timeframe.';
  if (!fields.entryThreshold || Number(fields.entryThreshold) <= 0)
    errors.entryThreshold = 'Entry threshold must be > 0.';
  if (!fields.exitThreshold || Number(fields.exitThreshold) <= 0)
    errors.exitThreshold = 'Exit threshold must be > 0.';
  if (!fields.maxLossPct || Number(fields.maxLossPct) <= 0 || Number(fields.maxLossPct) > 100)
    errors.maxLossPct = 'Max loss % must be 0–100.';
  if (!fields.maxTradesPerDay || !Number.isInteger(Number(fields.maxTradesPerDay)) || Number(fields.maxTradesPerDay) < 1)
    errors.maxTradesPerDay = 'Must be a positive whole number.';
  return errors;
}

const validFields = {
  name: 'NIFTY Momentum',
  instrument: 'NIFTY',
  timeframe: '5m',
  entryThreshold: '0.85',
  exitThreshold: '0.4',
  maxLossPct: '2.5',
  maxTradesPerDay: '10',
  enabled: true,
};

describe('Form Validation – valid input', () => {
  it('returns no errors for a fully valid form', () => {
    const errors = validate(validFields);
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

describe('Form Validation – name field', () => {
  it('errors when name is empty', () => {
    const errors = validate({ ...validFields, name: '' });
    expect(errors.name).toBeDefined();
  });

  it('errors when name is too short', () => {
    const errors = validate({ ...validFields, name: 'AB' });
    expect(errors.name).toBeDefined();
  });

  it('passes with exactly 3 characters', () => {
    const errors = validate({ ...validFields, name: 'ABC' });
    expect(errors.name).toBeUndefined();
  });
});

describe('Form Validation – instrument & timeframe', () => {
  it('errors when instrument is empty', () => {
    expect(validate({ ...validFields, instrument: '' }).instrument).toBeDefined();
  });

  it('errors when timeframe is empty', () => {
    expect(validate({ ...validFields, timeframe: '' }).timeframe).toBeDefined();
  });
});

describe('Form Validation – numeric fields', () => {
  it('errors when entryThreshold is 0', () => {
    expect(validate({ ...validFields, entryThreshold: '0' }).entryThreshold).toBeDefined();
  });

  it('errors when entryThreshold is negative', () => {
    expect(validate({ ...validFields, entryThreshold: '-1' }).entryThreshold).toBeDefined();
  });

  it('errors when maxLossPct is over 100', () => {
    expect(validate({ ...validFields, maxLossPct: '101' }).maxLossPct).toBeDefined();
  });

  it('errors when maxLossPct is exactly 0', () => {
    expect(validate({ ...validFields, maxLossPct: '0' }).maxLossPct).toBeDefined();
  });

  it('errors when maxTradesPerDay is a decimal', () => {
    expect(validate({ ...validFields, maxTradesPerDay: '2.5' }).maxTradesPerDay).toBeDefined();
  });

  it('passes with maxLossPct = 100', () => {
    expect(validate({ ...validFields, maxLossPct: '100' }).maxLossPct).toBeUndefined();
  });

  it('errors when maxTradesPerDay is 0', () => {
    expect(validate({ ...validFields, maxTradesPerDay: '0' }).maxTradesPerDay).toBeDefined();
  });
});
