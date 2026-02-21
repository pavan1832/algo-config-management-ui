/**
 * components/FormField.jsx
 * Reusable form field wrapper with label, input, and error message.
 * Commit: "feat: build reusable FormField component with error state"
 */

import React from "react";

const FormField = ({ label, error, hint, required, children }) => {
  return (
    <div style={styles.field}>
      <div style={styles.labelRow}>
        <label style={styles.label}>
          {label}
          {required && <span style={styles.required}>*</span>}
        </label>
        {hint && <span style={styles.hint}>{hint}</span>}
      </div>
      {children}
      {error && (
        <div style={styles.error} className="slide-in">
          <span style={styles.errorIcon}>!</span>
          {error}
        </div>
      )}
    </div>
  );
};

const styles = {
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  labelRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    fontWeight: 500,
    color: "var(--text-secondary)",
    letterSpacing: "0.8px",
    textTransform: "uppercase",
  },
  required: {
    color: "var(--accent)",
    marginLeft: "3px",
  },
  hint: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--text-muted)",
    letterSpacing: "0.3px",
  },
  error: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--red)",
    marginTop: "2px",
  },
  errorIcon: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "14px",
    height: "14px",
    borderRadius: "50%",
    background: "var(--red-bg)",
    color: "var(--red)",
    fontSize: "10px",
    fontWeight: 700,
    flexShrink: 0,
  },
};

export default FormField;
