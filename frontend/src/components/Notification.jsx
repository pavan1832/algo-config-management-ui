/**
 * components/Notification.jsx
 * Auto-dismissing notification toast for success/error feedback.
 * Commit: "feat: build Notification toast component with auto-dismiss"
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from "../redux/uiSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { notification } = useSelector((s) => s.ui);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => dispatch(clearNotification()), 3500);
    return () => clearTimeout(timer);
  }, [notification, dispatch]);

  if (!notification) return null;

  const isSuccess = notification.type === "success";

  return (
    <div
      style={{
        ...styles.toast,
        borderColor: isSuccess ? "var(--green)" : "var(--red)",
        background: isSuccess ? "var(--green-bg)" : "var(--red-bg)",
      }}
      className="fade-in"
    >
      <span style={{ color: isSuccess ? "var(--green)" : "var(--red)", fontSize: "15px" }}>
        {isSuccess ? "✓" : "✕"}
      </span>
      <span style={styles.message}>{notification.message}</span>
      <button
        style={styles.close}
        onClick={() => dispatch(clearNotification())}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
};

const styles = {
  toast: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 16px",
    border: "1px solid",
    borderRadius: "var(--radius)",
    boxShadow: "var(--shadow)",
    zIndex: 1000,
    maxWidth: "380px",
  },
  message: {
    fontFamily: "var(--font-mono)",
    fontSize: "12px",
    color: "var(--text-primary)",
    flex: 1,
  },
  close: {
    background: "none",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "18px",
    lineHeight: 1,
    cursor: "pointer",
    padding: "0 2px",
  },
};

export default Notification;
