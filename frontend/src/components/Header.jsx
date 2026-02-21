/**
 * components/Header.jsx
 * Top navigation bar with system status and branding.
 * Commit: "feat: build Header component with system status indicator"
 */

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setActivePanel } from "../redux/uiSlice";
import { clearSelected } from "../redux/algoConfigSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { activePanel } = useSelector((s) => s.ui);

  const handleNewConfig = () => {
    dispatch(clearSelected());
    dispatch(setActivePanel("create"));
  };

  const handleLogoClick = () => {
    dispatch(clearSelected());
    dispatch(setActivePanel("list"));
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <button style={styles.logo} onClick={handleLogoClick}>
          <span style={styles.logoMark}>▣</span>
          <span style={styles.logoText}>ALGOCONFIG</span>
          <span style={styles.logoBadge}>UI</span>
        </button>
        <nav style={styles.nav}>
          <button
            style={{
              ...styles.navBtn,
              ...(["list"].includes(activePanel) ? styles.navBtnActive : {}),
            }}
            onClick={handleLogoClick}
          >
            CONFIGURATIONS
          </button>
        </nav>
      </div>

      <div style={styles.right}>
        <div style={styles.statusDot}>
          <span style={styles.dot} />
          <span style={styles.statusText}>SYSTEM READY</span>
        </div>
        <button style={styles.newBtn} onClick={handleNewConfig}>
          + NEW CONFIG
        </button>
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    height: "52px",
    background: "var(--bg-card)",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: "16px",
  },
  left: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  logoMark: {
    fontSize: "18px",
    color: "var(--accent)",
  },
  logoText: {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    fontWeight: 600,
    color: "var(--text-primary)",
    letterSpacing: "2px",
  },
  logoBadge: {
    fontFamily: "var(--font-mono)",
    fontSize: "9px",
    background: "var(--accent)",
    color: "#000",
    padding: "1px 5px",
    borderRadius: "2px",
    fontWeight: 700,
    letterSpacing: "1px",
  },
  nav: {
    display: "flex",
    gap: "4px",
  },
  navBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "1px",
    fontWeight: 500,
    color: "var(--text-muted)",
    background: "none",
    border: "none",
    padding: "4px 10px",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  navBtnActive: {
    color: "var(--accent)",
    background: "var(--accent-bg)",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  statusDot: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  dot: {
    display: "inline-block",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "var(--green)",
    boxShadow: "0 0 6px var(--green)",
    animation: "pulse 2.5s infinite",
  },
  statusText: {
    fontFamily: "var(--font-mono)",
    fontSize: "10px",
    letterSpacing: "1px",
    color: "var(--text-muted)",
  },
  newBtn: {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "1px",
    fontWeight: 600,
    color: "#000",
    background: "var(--accent)",
    border: "none",
    padding: "6px 14px",
    borderRadius: "var(--radius)",
    cursor: "pointer",
    transition: "opacity 0.15s",
  },
};

export default Header;
