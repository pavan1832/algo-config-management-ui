/**
 * components/ConfigCard.jsx
 * Card displaying summary of a saved algorithm configuration.
 * Commit: "feat: build ConfigCard component with status badge and actions"
 */

import React from "react";
import { useDispatch } from "react-redux";
import { setSelected, fetchConfigById } from "../redux/algoConfigSlice";
import { setActivePanel } from "../redux/uiSlice";

const INSTRUMENT_COLORS = {
  NIFTY: "#60a5fa",
  BANKNIFTY: "#a78bfa",
  SP500: "#34d399",
  NASDAQ: "#f59e0b",
  CRUDE: "#f87171",
};

const ConfigCard = ({ config }) => {
  const dispatch = useDispatch();

  const handleView = () => {
    dispatch(setSelected(config));
    dispatch(setActivePanel("view"));
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    dispatch(setSelected(config));
    dispatch(setActivePanel("edit"));
  };

  const instrumentColor = INSTRUMENT_COLORS[config.instrument] || "var(--accent)";
  const createdDate = new Date(config.createdAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const updatedDate = new Date(config.updatedAt).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const wasUpdated = config.updatedAt !== config.createdAt;

  return (
    <div style={styles.card} onClick={handleView} className="fade-in">
      {/* Top row */}
      <div style={styles.topRow}>
        <div style={styles.titleGroup}>
          <span style={{ ...styles.instrumentTag, color: instrumentColor, borderColor: instrumentColor + "44", background: instrumentColor + "0f" }}>
            {config.instrument}
          </span>
          <span style={styles.timeframeTag}>{config.timeframe}</span>
        </div>
        <div style={styles.statusBadge}>
          <span style={{ ...styles.statusDot, background: config.enabled ? "var(--green)" : "var(--text-muted)" }} />
          <span style={{ color: config.enabled ? "var(--green)" : "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "1px" }}>
            {config.enabled ? "ENABLED" : "DISABLED"}
          </span>
        </div>
      </div>

      {/* Config name */}
      <div style={styles.name}>{config.name}</div>

      {/* Metrics row */}
      <div style={styles.metrics}>
        <div style={styles.metric}>
          <span style={styles.metricLabel}>ENTRY</span>
          <span style={styles.metricValue}>{config.entryThreshold}</span>
        </div>
        <div style={styles.metricDivider} />
        <div style={styles.metric}>
          <span style={styles.metricLabel}>EXIT</span>
          <span style={styles.metricValue}>{config.exitThreshold}</span>
        </div>
        <div style={styles.metricDivider} />
        <div style={styles.metric}>
          <span style={styles.metricLabel}>MAX LOSS</span>
          <span style={{ ...styles.metricValue, color: "var(--red)" }}>{config.maxLossPercent}%</span>
        </div>
        <div style={styles.metricDivider} />
        <div style={styles.metric}>
          <span style={styles.metricLabel}>MAX TRADES</span>
          <span style={styles.metricValue}>{config.maxTradesPerDay}/day</span>
        </div>
      </div>

      {/* Bottom row */}
      <div style={styles.bottomRow}>
        <div style={styles.timestamps}>
          <span style={styles.timestamp}>
            Created {createdDate}
          </span>
          {wasUpdated && (
            <span style={styles.timestamp}>· Updated {updatedDate}</span>
          )}
        </div>
        <div style={styles.actions}>
          {config.stopLossEnabled && (
            <span style={styles.slBadge}>SL ON</span>
          )}
          <button style={styles.editBtn} onClick={handleEdit}>
            EDIT
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "16px 20px",
    cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleGroup: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  instrumentTag: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "1px",
    padding: "2px 8px",
    border: "1px solid",
    borderRadius: "var(--radius)",
  },
  timeframeTag: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--text-muted)",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border)",
    padding: "2px 7px",
    borderRadius: "var(--radius)",
  },
  statusBadge: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  statusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    flexShrink: 0,
  },
  name: {
    fontFamily: "var(--font-sans)",
    fontSize: "15px",
    fontWeight: 500,
    color: "var(--text-primary)",
    lineHeight: 1.3,
  },
  metrics: {
    display: "flex",
    gap: "0",
    background: "var(--bg-secondary)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    border: "1px solid var(--border-subtle)",
  },
  metric: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "8px 12px",
  },
  metricLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    color: "var(--text-muted)",
    letterSpacing: "1px",
  },
  metricValue: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-primary)",
  },
  metricDivider: {
    width: "1px",
    background: "var(--border)",
    alignSelf: "stretch",
  },
  bottomRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timestamps: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },
  timestamp: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--text-muted)",
  },
  actions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  slBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    letterSpacing: "1px",
    color: "var(--blue)",
    background: "var(--blue-bg)",
    border: "1px solid var(--blue)44",
    padding: "2px 6px",
    borderRadius: "var(--radius)",
  },
  editBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "1px",
    fontWeight: 600,
    color: "var(--text-secondary)",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    padding: "4px 10px",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    transition: "all 0.15s",
  },
};

export default ConfigCard;
