/**
 * utils/validation.js
 * Client-side validation for the algorithm configuration form.
 * Commit: "feat: add client-side form validation with clear error messages"
 */

export const INSTRUMENTS = ["NIFTY", "BANKNIFTY", "SP500", "NASDAQ", "CRUDE"];
export const TIMEFRAMES = ["1m", "5m", "15m", "1h"];

/**
 * Validates the config form fields.
 * @param {object} values - Form field values
 * @returns {{ errors: object, isValid: boolean }}
 */
export function validateConfigForm(values) {
  const errors = {};

  if (!values.name || values.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (values.name.trim().length > 60) {
    errors.name = "Name must not exceed 60 characters.";
  }

  if (!INSTRUMENTS.includes(values.instrument)) {
    errors.instrument = "Please select a valid instrument.";
  }

  if (!TIMEFRAMES.includes(values.timeframe)) {
    errors.timeframe = "Please select a valid timeframe.";
  }

  const entryThreshold = Number(values.entryThreshold);
  if (values.entryThreshold === "" || values.entryThreshold === undefined || isNaN(entryThreshold)) {
    errors.entryThreshold = "Entry threshold must be a valid number.";
  }

  const exitThreshold = Number(values.exitThreshold);
  if (values.exitThreshold === "" || values.exitThreshold === undefined || isNaN(exitThreshold)) {
    errors.exitThreshold = "Exit threshold must be a valid number.";
  }

  const maxLoss = Number(values.maxLossPercent);
  if (isNaN(maxLoss) || maxLoss <= 0 || maxLoss > 100) {
    errors.maxLossPercent = "Max loss % must be between 0.01 and 100.";
  }

  const maxTrades = Number(values.maxTradesPerDay);
  if (isNaN(maxTrades) || maxTrades < 1 || !Number.isInteger(maxTrades)) {
    errors.maxTradesPerDay = "Max trades per day must be a positive whole number.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
}

/**
 * Returns initial blank form state.
 */
export function getInitialFormValues() {
  return {
    name: "",
    instrument: "",
    timeframe: "",
    entryThreshold: "",
    exitThreshold: "",
    maxLossPercent: "",
    maxTradesPerDay: "",
    enabled: true,
    stopLossEnabled: false,
    notes: "",
  };
}

/**
 * Maps a saved config to form values for editing.
 */
export function configToFormValues(config) {
  return {
    name: config.name,
    instrument: config.instrument,
    timeframe: config.timeframe,
    entryThreshold: String(config.entryThreshold),
    exitThreshold: String(config.exitThreshold),
    maxLossPercent: String(config.maxLossPercent),
    maxTradesPerDay: String(config.maxTradesPerDay),
    enabled: config.enabled,
    stopLossEnabled: config.stopLossEnabled,
    notes: config.notes || "",
  };
}
