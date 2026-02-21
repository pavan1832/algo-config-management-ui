/**
 * components/ConfigForm.jsx
 * Algorithm configuration form with client-side validation.
 * Used for both create and edit modes.
 * Commit: "feat: implement ConfigForm with full validation and Redux dispatch"
 */

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createConfig, updateConfig, clearErrors } from "../redux/algoConfigSlice";
import { setActivePanel, showNotification } from "../redux/uiSlice";
import {
  validateConfigForm,
  getInitialFormValues,
  configToFormValues,
  INSTRUMENTS,
  TIMEFRAMES,
} from "../utils/validation";
import FormField from "./FormField";
import Toggle from "./Toggle";

const ConfigForm = ({ mode }) => {
  const dispatch = useDispatch();
  const { selected, submitting, submitError } = useSelector((s) => s.algoConfig);
  const isEdit = mode === "edit";

  const [values, setValues] = useState(
    isEdit && selected ? configToFormValues(selected) : getInitialFormValues()
  );
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isEdit && selected) {
      setValues(configToFormValues(selected));
      setErrors({});
      setTouched({});
    }
  }, [isEdit, selected]);

  // Live validation on touched fields
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const { errors: newErrors } = validateConfigForm(values);
      // Only show errors for touched fields
      const filteredErrors = {};
      Object.keys(newErrors).forEach((key) => {
        if (touched[key]) filteredErrors[key] = newErrors[key];
      });
      setErrors(filteredErrors);
    }
  }, [values, touched]);

  const handleChange = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const { isValid } = validateConfigForm(values);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Touch all fields to reveal all errors
    const allTouched = Object.fromEntries(Object.keys(values).map((k) => [k, true]));
    setTouched(allTouched);

    const { errors: allErrors, isValid: formValid } = validateConfigForm(values);
    setErrors(allErrors);
    if (!formValid) return;

    const payload = {
      ...values,
      entryThreshold: Number(values.entryThreshold),
      exitThreshold: Number(values.exitThreshold),
      maxLossPercent: Number(values.maxLossPercent),
      maxTradesPerDay: Number(values.maxTradesPerDay),
    };

    if (isEdit && selected) {
      const result = await dispatch(updateConfig({ id: selected.id, data: payload }));
      if (!result.error) {
        dispatch(showNotification({ type: "success", message: "Configuration updated successfully." }));
        dispatch(setActivePanel("view"));
      } else {
        dispatch(showNotification({ type: "error", message: "Failed to update configuration." }));
      }
    } else {
      const result = await dispatch(createConfig(payload));
      if (!result.error) {
        dispatch(showNotification({ type: "success", message: "Configuration created successfully." }));
        dispatch(setActivePanel("list"));
      } else {
        dispatch(showNotification({ type: "error", message: "Failed to create configuration." }));
      }
    }
  };

  const handleCancel = () => {
    dispatch(clearErrors());
    dispatch(setActivePanel(isEdit ? "view" : "list"));
  };

  // Backend field-level errors
  const apiErrors = submitError?.errors || {};

  return (
    <form onSubmit={handleSubmit} noValidate style={styles.form}>
      <div style={styles.header}>
        <div>
          <div style={styles.breadcrumb}>
            CONFIGS / {isEdit ? "EDIT" : "NEW"}
          </div>
          <h1 style={styles.title}>
            {isEdit ? "Edit Configuration" : "New Algorithm Configuration"}
          </h1>
        </div>
      </div>

      {/* Section: Identity */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>IDENTITY</div>
        <div style={styles.grid2}>
          <FormField label="Configuration Name" error={errors.name || apiErrors.name} required>
            <input
              type="text"
              value={values.name}
              onChange={(e) => handleChange("name", e.target.value)}
              onBlur={() => handleBlur("name")}
              placeholder="e.g. NIFTY Momentum Strategy v1"
              maxLength={60}
            />
          </FormField>

          <FormField label="Instrument" error={errors.instrument || apiErrors.instrument} required>
            <select
              value={values.instrument}
              onChange={(e) => handleChange("instrument", e.target.value)}
              onBlur={() => handleBlur("instrument")}
            >
              <option value="">Select instrument…</option>
              {INSTRUMENTS.map((inst) => (
                <option key={inst} value={inst}>{inst}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Timeframe" error={errors.timeframe || apiErrors.timeframe} required>
            <select
              value={values.timeframe}
              onChange={(e) => handleChange("timeframe", e.target.value)}
              onBlur={() => handleBlur("timeframe")}
            >
              <option value="">Select timeframe…</option>
              {TIMEFRAMES.map((tf) => (
                <option key={tf} value={tf}>{tf}</option>
              ))}
            </select>
          </FormField>
        </div>
      </section>

      {/* Section: Thresholds */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>ENTRY & EXIT THRESHOLDS</div>
        <div style={styles.grid2}>
          <FormField
            label="Entry Threshold"
            error={errors.entryThreshold || apiErrors.entryThreshold}
            hint="Signal trigger value"
            required
          >
            <input
              type="number"
              step="0.01"
              value={values.entryThreshold}
              onChange={(e) => handleChange("entryThreshold", e.target.value)}
              onBlur={() => handleBlur("entryThreshold")}
              placeholder="e.g. 0.25"
            />
          </FormField>

          <FormField
            label="Exit Threshold"
            error={errors.exitThreshold || apiErrors.exitThreshold}
            hint="Position close value"
            required
          >
            <input
              type="number"
              step="0.01"
              value={values.exitThreshold}
              onChange={(e) => handleChange("exitThreshold", e.target.value)}
              onBlur={() => handleBlur("exitThreshold")}
              placeholder="e.g. -0.1"
            />
          </FormField>
        </div>
      </section>

      {/* Section: Risk Limits */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>RISK LIMITS</div>
        <div style={styles.grid2}>
          <FormField
            label="Max Loss %"
            error={errors.maxLossPercent || apiErrors.maxLossPercent}
            hint="Portfolio drawdown cap (0.01–100)"
            required
          >
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="100"
              value={values.maxLossPercent}
              onChange={(e) => handleChange("maxLossPercent", e.target.value)}
              onBlur={() => handleBlur("maxLossPercent")}
              placeholder="e.g. 2.5"
            />
          </FormField>

          <FormField
            label="Max Trades / Day"
            error={errors.maxTradesPerDay || apiErrors.maxTradesPerDay}
            hint="Hard cap on daily executions"
            required
          >
            <input
              type="number"
              step="1"
              min="1"
              value={values.maxTradesPerDay}
              onChange={(e) => handleChange("maxTradesPerDay", e.target.value)}
              onBlur={() => handleBlur("maxTradesPerDay")}
              placeholder="e.g. 10"
            />
          </FormField>
        </div>
      </section>

      {/* Section: Controls */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>CONTROLS</div>
        <div style={styles.toggleGrid}>
          <Toggle
            id="enabled"
            label="Algorithm Enabled"
            checked={values.enabled}
            onChange={(v) => handleChange("enabled", v)}
          />
          <Toggle
            id="stopLossEnabled"
            label="Stop-Loss Protection"
            checked={values.stopLossEnabled}
            onChange={(v) => handleChange("stopLossEnabled", v)}
          />
        </div>
      </section>

      {/* Section: Notes */}
      <section style={styles.section}>
        <div style={styles.sectionLabel}>NOTES (OPTIONAL)</div>
        <FormField label="Additional Notes">
          <textarea
            rows={3}
            value={values.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Describe strategy rationale, conditions, or version notes…"
            style={{ resize: "vertical", minHeight: "72px" }}
          />
        </FormField>
      </section>

      {/* Actions */}
      <div style={styles.actions}>
        <button type="button" style={styles.cancelBtn} onClick={handleCancel}>
          CANCEL
        </button>
        <button
          type="submit"
          style={{
            ...styles.submitBtn,
            opacity: (!isValid || submitting) ? 0.5 : 1,
            cursor: (!isValid || submitting) ? "not-allowed" : "pointer",
          }}
          disabled={submitting}
        >
          {submitting
            ? "SAVING…"
            : isEdit
            ? "SAVE CHANGES"
            : "CREATE CONFIG"}
        </button>
      </div>

      {!isValid && Object.keys(touched).length > 0 && (
        <div style={styles.formHint}>
          ⚠ Fix the highlighted errors before submitting.
        </div>
      )}
    </form>
  );
};

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
    maxWidth: "760px",
    animation: "fadeIn 0.25s ease",
  },
  header: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  breadcrumb: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--text-muted)",
    letterSpacing: "1px",
    marginBottom: "6px",
  },
  title: {
    fontFamily: "var(--font-sans)",
    fontSize: "22px",
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "-0.3px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    padding: "20px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
  },
  sectionLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--accent)",
    letterSpacing: "2px",
    paddingBottom: "8px",
    borderBottom: "1px solid var(--border-subtle)",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  toggleGrid: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    paddingTop: "8px",
  },
  cancelBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    letterSpacing: "1px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    padding: "10px 20px",
    borderRadius: "var(--radius)",
    cursor: "pointer",
  },
  submitBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    letterSpacing: "1px",
    fontWeight: 700,
    color: "#000",
    background: "var(--accent)",
    border: "none",
    padding: "10px 24px",
    borderRadius: "var(--radius)",
    transition: "opacity 0.15s",
  },
  formHint: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--accent)",
    textAlign: "right",
    marginTop: "-14px",
    letterSpacing: "0.3px",
  },
};

export default ConfigForm;
