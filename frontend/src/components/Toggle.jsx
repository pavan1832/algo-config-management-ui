/**
 * components/Toggle.jsx
 * Accessible enable/disable toggle switch.
 * Commit: "feat: build reusable Toggle component for config switches"
 */

import React from "react";

const Toggle = ({ checked, onChange, label, id }) => {
  return (
    <label htmlFor={id} style={styles.wrapper}>
      <span style={styles.label}>{label}</span>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={styles.input}
        />
        <div
          style={{
            ...styles.track,
            background: checked ? "var(--accent)" : "var(--border)",
          }}
        >
          <div
            style={{
              ...styles.thumb,
              transform: checked ? "translateX(16px)" : "translateX(2px)",
              background: checked ? "#000" : "var(--text-muted)",
            }}
          />
        </div>
        <span
          style={{
            ...styles.stateLabel,
            color: checked ? "var(--accent)" : "var(--text-muted)",
          }}
        >
          {checked ? "ON" : "OFF"}
        </span>
      </div>
    </label>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    gap: "12px",
    padding: "10px 14px",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
  },
  label: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--text-secondary)",
    letterSpacing: "0.5px",
  },
  input: {
    position: "absolute",
    opacity: 0,
    width: 0,
    height: 0,
  },
  track: {
    width: "36px",
    height: "20px",
    borderRadius: "10px",
    position: "relative",
    transition: "background 0.2s",
    cursor: "pointer",
  },
  thumb: {
    position: "absolute",
    top: "2px",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    transition: "transform 0.2s, background 0.2s",
  },
  stateLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    fontWeight: 600,
    letterSpacing: "1px",
    marginLeft: "8px",
    width: "22px",
  },
};

export default Toggle;
