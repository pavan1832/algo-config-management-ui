/**
 * tests/validation.test.js
 * Unit tests for client-side form validation logic.
 * Commit: "test: add unit tests for config form validation utility"
 */

import { validateConfigForm, getInitialFormValues, configToFormValues } from "../utils/validation";

const validValues = {
  name: "NIFTY Momentum v2",
  instrument: "NIFTY",
  timeframe: "5m",
  entryThreshold: "0.25",
  exitThreshold: "-0.1",
  maxLossPercent: "2.5",
  maxTradesPerDay: "10",
  enabled: true,
  stopLossEnabled: false,
  notes: "",
};

describe("validateConfigForm", () => {
  it("should return isValid=true for valid input", () => {
    const { isValid, errors } = validateConfigForm(validValues);
    expect(isValid).toBe(true);
    expect(errors).toEqual({});
  });

  it("should fail if name is too short", () => {
    const { errors } = validateConfigForm({ ...validValues, name: "X" });
    expect(errors.name).toBeDefined();
  });

  it("should fail if name is empty", () => {
    const { errors } = validateConfigForm({ ...validValues, name: "" });
    expect(errors.name).toBeDefined();
  });

  it("should fail if instrument is not in allowed list", () => {
    const { errors } = validateConfigForm({ ...validValues, instrument: "DOGECOIN" });
    expect(errors.instrument).toBeDefined();
  });

  it("should fail if timeframe is invalid", () => {
    const { errors } = validateConfigForm({ ...validValues, timeframe: "3h" });
    expect(errors.timeframe).toBeDefined();
  });

  it("should fail if entryThreshold is non-numeric", () => {
    const { errors } = validateConfigForm({ ...validValues, entryThreshold: "abc" });
    expect(errors.entryThreshold).toBeDefined();
  });

  it("should fail if maxLossPercent exceeds 100", () => {
    const { errors } = validateConfigForm({ ...validValues, maxLossPercent: "150" });
    expect(errors.maxLossPercent).toBeDefined();
  });

  it("should fail if maxLossPercent is 0", () => {
    const { errors } = validateConfigForm({ ...validValues, maxLossPercent: "0" });
    expect(errors.maxLossPercent).toBeDefined();
  });

  it("should fail if maxTradesPerDay is fractional", () => {
    const { errors } = validateConfigForm({ ...validValues, maxTradesPerDay: "2.5" });
    expect(errors.maxTradesPerDay).toBeDefined();
  });

  it("should fail if maxTradesPerDay is 0", () => {
    const { errors } = validateConfigForm({ ...validValues, maxTradesPerDay: "0" });
    expect(errors.maxTradesPerDay).toBeDefined();
  });

  it("should accumulate multiple errors", () => {
    const { errors, isValid } = validateConfigForm({
      ...validValues,
      name: "",
      instrument: "",
      timeframe: "",
    });
    expect(isValid).toBe(false);
    expect(Object.keys(errors).length).toBeGreaterThanOrEqual(3);
  });
});

describe("getInitialFormValues", () => {
  it("should return blank form with enabled=true and stopLossEnabled=false", () => {
    const vals = getInitialFormValues();
    expect(vals.name).toBe("");
    expect(vals.enabled).toBe(true);
    expect(vals.stopLossEnabled).toBe(false);
    expect(vals.instrument).toBe("");
  });
});

describe("configToFormValues", () => {
  it("should convert numeric config fields to strings", () => {
    const config = {
      name: "Test",
      instrument: "SP500",
      timeframe: "1h",
      entryThreshold: 0.5,
      exitThreshold: -0.2,
      maxLossPercent: 3,
      maxTradesPerDay: 5,
      enabled: true,
      stopLossEnabled: true,
      notes: "Notes here",
    };
    const vals = configToFormValues(config);
    expect(vals.entryThreshold).toBe("0.5");
    expect(vals.maxTradesPerDay).toBe("5");
    expect(vals.enabled).toBe(true);
  });
});
