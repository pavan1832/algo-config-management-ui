/**
 * components/ConfigDetail.jsx
 * Read-only view of a single algorithm configuration.
 * Commit: "feat: build ConfigDetail view with all config fields and edit CTA"
 */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActivePanel } from "../redux/uiSlice";
import { clearSelected } from "../redux/algoConfigSlice";

const Row = ({ label, value, valueStyle }) => (
  <div style={styles.row}>
    <span style={styles.rowLabel}>{label}</span>
    <span style={{ ...styles.rowValue, ...valueStyle }}>{value}</span>
  </div>
);

const ConfigDetail = () => {
  const dispatch = useDispatch();
  const { selected } = useSelector((s) => s.algoConfig);

  if (!selected) return null;

  const handleEdit = () => dispatch(setActivePanel("edit"));
  const handleBack = () => {
    dispatch(clearSelected());
    dispatch(setActivePanel("list"));
  };

  const createdDate = new Date(selected.createdAt).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });
  const updatedDate = new Date(selected.updatedAt).toLocaleString("en-IN", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <div style={styles.container} className="fade-in">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <button style={styles.backBtn} onClick={handleBack}>
            ← BACK TO LIST
          </button>
          <div style={styles.name}>{selected.name}</div>
          <div style={styles.meta}>
            <span style={styles.metaTag}>{selected.instrument}</span>
            <span style={styles.metaTag}>{selected.timeframe}</span>
            <span style={{
              ...styles.statusTag,
              color: selected.enabled ? "var(--green)" : "var(--text-muted)",
              background: selected.enabled ? "var(--green-bg)" : "transparent",
              borderColor: selected.enabled ? "var(--green)44" : "var(--border)",
            }}>
              {selected.enabled ? "● ENABLED" : "○ DISABLED"}
            </span>
          </div>
        </div>
        <button style={styles.editBtn} onClick={handleEdit}>
          EDIT CONFIG
        </button>
      </div>

      <div style={styles.grid}>
        {/* Thresholds */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>THRESHOLDS</div>
          <Row label="Entry Threshold" value={selected.entryThreshold} />
          <Row label="Exit Threshold" value={selected.exitThreshold} />
        </div>

        {/* Risk Limits */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>RISK LIMITS</div>
          <Row
            label="Max Loss %"
            value={`${selected.maxLossPercent}%`}
            valueStyle={{ color: "var(--red)" }}
          />
          <Row label="Max Trades / Day" value={selected.maxTradesPerDay} />
        </div>

        {/* Controls */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>CONTROLS</div>
          <Row
            label="Algorithm Status"
            value={selected.enabled ? "ENABLED" : "DISABLED"}
            valueStyle={{ color: selected.enabled ? "var(--green)" : "var(--text-muted)" }}
          />
          <Row
            label="Stop-Loss"
            value={selected.stopLossEnabled ? "ACTIVE" : "INACTIVE"}
            valueStyle={{ color: selected.stopLossEnabled ? "var(--blue)" : "var(--text-muted)" }}
          />
        </div>

        {/* Timestamps */}
        <div style={styles.card}>
          <div style={styles.cardLabel}>TIMESTAMPS</div>
          <Row label="Created At" value={createdDate} />
          <Row label="Last Updated" value={updatedDate} />
        </div>
      </div>

      {/* Notes */}
      {selected.notes && (
        <div style={styles.notesCard}>
          <div style={styles.cardLabel}>NOTES</div>
          <p style={styles.notes}>{selected.notes}</p>
        </div>
      )}

      {/* ID */}
      <div style={styles.idRow}>
        <span style={styles.idLabel}>CONFIG ID</span>
        <span style={styles.id}>{selected.id}</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    maxWidth: "820px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  backBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "1px",
    color: "var(--text-muted)",
    background: "none",
    border: "none",
    padding: "0 0 10px 0",
    cursor: "pointer",
    display: "block",
    transition: "color 0.15s",
  },
  name: {
    fontFamily: "var(--font-sans)",
    fontSize: "24px",
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "-0.3px",
    marginBottom: "10px",
  },
  meta: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  metaTag: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--text-secondary)",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    padding: "3px 10px",
    borderRadius: "var(--radius)",
    letterSpacing: "0.5px",
  },
  statusTag: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    padding: "3px 10px",
    borderRadius: "var(--radius)",
    border: "1px solid",
    letterSpacing: "0.5px",
  },
  editBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "1px",
    fontWeight: 600,
    color: "#000",
    background: "var(--accent)",
    border: "none",
    padding: "8px 18px",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    flexShrink: 0,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  cardLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    fontWeight: 600,
    color: "var(--accent)",
    letterSpacing: "2px",
    paddingBottom: "8px",
    borderBottom: "1px solid var(--border-subtle)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--text-muted)",
    letterSpacing: "0.3px",
  },
  rowValue: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    fontWeight: 500,
    color: "var(--text-primary)",
  },
  notesCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  notes: {
    fontFamily: "var(--font-sans)",
    fontSize: "13px",
    color: "var(--text-secondary)",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
  },
  idRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  idLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--text-muted)",
    letterSpacing: "1px",
  },
  id: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    color: "var(--text-muted)",
    opacity: 0.7,
  },
};

export default ConfigDetail;
