/**
 * pages/ConfigListPage.jsx
 * Displays all saved algorithm configurations as cards.
 * Commit: "feat: implement ConfigListPage with fetch on mount and empty state"
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchConfigs } from "../redux/algoConfigSlice";
import { setActivePanel } from "../redux/uiSlice";
import { clearSelected } from "../redux/algoConfigSlice";
import ConfigCard from "../components/ConfigCard";

const ConfigListPage = () => {
  const dispatch = useDispatch();
  const { configs, loading, error } = useSelector((s) => s.algoConfig);

  useEffect(() => {
    dispatch(fetchConfigs());
  }, [dispatch]);

  const handleNew = () => {
    dispatch(clearSelected());
    dispatch(setActivePanel("create"));
  };

  if (loading && configs.length === 0) {
    return (
      <div style={styles.center}>
        <div style={styles.loadingText}>LOADING CONFIGURATIONS…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.center}>
        <div style={styles.errorBox}>
          <div style={styles.errorTitle}>CONNECTION ERROR</div>
          <div style={styles.errorMsg}>{error}</div>
          <div style={styles.errorHint}>
            Ensure the backend is running on port 4000.
          </div>
          <button style={styles.retryBtn} onClick={() => dispatch(fetchConfigs())}>
            RETRY
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div>
          <div style={styles.breadcrumb}>ALGOCONFIG / CONFIGURATIONS</div>
          <h1 style={styles.title}>Algorithm Configurations</h1>
          <p style={styles.subtitle}>
            Manage pre-run algorithm settings consumed by downstream trading systems.
          </p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.count}>
            <span style={styles.countNum}>{configs.length}</span>
            <span style={styles.countLabel}>CONFIGS</span>
          </div>
          <button style={styles.newBtn} onClick={handleNew}>
            + NEW CONFIG
          </button>
        </div>
      </div>

      {/* Filters row */}
      {configs.length > 0 && (
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {configs.filter((c) => c.enabled).length}
            </span>
            <span style={styles.statLabel}>ENABLED</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {configs.filter((c) => !c.enabled).length}
            </span>
            <span style={styles.statLabel}>DISABLED</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {configs.filter((c) => c.stopLossEnabled).length}
            </span>
            <span style={styles.statLabel}>WITH STOP-LOSS</span>
          </div>
          <div style={styles.statDivider} />
          <div style={styles.stat}>
            <span style={styles.statNum}>
              {[...new Set(configs.map((c) => c.instrument))].length}
            </span>
            <span style={styles.statLabel}>INSTRUMENTS</span>
          </div>
        </div>
      )}

      {/* Config list */}
      {configs.length === 0 ? (
        <div style={styles.emptyState} className="fade-in">
          <div style={styles.emptyIcon}>▣</div>
          <div style={styles.emptyTitle}>No Configurations Found</div>
          <div style={styles.emptyMsg}>
            Create your first algorithm configuration to get started.
          </div>
          <button style={styles.emptyBtn} onClick={handleNew}>
            + CREATE FIRST CONFIG
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {configs.map((config) => (
            <ConfigCard key={config.id} config={config} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "40vh",
  },
  loadingText: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--text-muted)",
    letterSpacing: "2px",
    animation: "pulse 1.5s infinite",
  },
  errorBox: {
    background: "var(--red-bg)",
    border: "1px solid var(--red)44",
    borderRadius: "var(--radius-lg)",
    padding: "32px",
    maxWidth: "420px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
  },
  errorTitle: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    fontWeight: 700,
    color: "var(--red)",
    letterSpacing: "2px",
  },
  errorMsg: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--text-secondary)",
  },
  errorHint: {
    fontFamily: "var(--font-sans)",
    fontSize: "12px",
    color: "var(--text-muted)",
  },
  retryBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "1px",
    color: "var(--red)",
    background: "transparent",
    border: "1px solid var(--red)44",
    padding: "8px 16px",
    borderRadius: "var(--radius)",
    cursor: "pointer",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
  },
  breadcrumb: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--text-muted)",
    letterSpacing: "1px",
    marginBottom: "8px",
  },
  title: {
    fontFamily: "var(--font-sans)",
    fontSize: "26px",
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "-0.3px",
    marginBottom: "6px",
  },
  subtitle: {
    fontFamily: "var(--font-sans)",
    fontSize: "13px",
    color: "var(--text-muted)",
    maxWidth: "480px",
    lineHeight: 1.5,
  },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
    flexShrink: 0,
  },
  count: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  countNum: {
    fontFamily: "var(--font-mono)",
    fontSize: "28px",
    fontWeight: 600,
    color: "var(--accent)",
    lineHeight: 1,
  },
  countLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    color: "var(--text-muted)",
    letterSpacing: "1px",
  },
  newBtn: {
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
  },
  statsRow: {
    display: "flex",
    gap: "0",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
  },
  stat: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "14px 20px",
    alignItems: "center",
  },
  statNum: {
    fontFamily: "var(--font-mono)",
    fontSize: "22px",
    fontWeight: 500,
    color: "var(--text-primary)",
  },
  statLabel: {
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    color: "var(--text-muted)",
    letterSpacing: "1px",
  },
  statDivider: {
    width: "1px",
    background: "var(--border)",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "80px 40px",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: "48px",
    color: "var(--border)",
  },
  emptyTitle: {
    fontFamily: "var(--font-sans)",
    fontSize: "18px",
    fontWeight: 500,
    color: "var(--text-secondary)",
  },
  emptyMsg: {
    fontFamily: "var(--font-sans)",
    fontSize: "13px",
    color: "var(--text-muted)",
    maxWidth: "300px",
  },
  emptyBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "1px",
    fontWeight: 700,
    color: "#000",
    background: "var(--accent)",
    border: "none",
    padding: "10px 24px",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    marginTop: "8px",
  },
};

export default ConfigListPage;
