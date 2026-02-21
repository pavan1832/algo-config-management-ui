import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeToast } from '../redux/uiSlice';

function ToastItem({ toast }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), 3500);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  const icon = toast.type === 'success' ? '✓' : '✕';

  return (
    <div className={`toast ${toast.type}`} onClick={() => dispatch(removeToast(toast.id))}>
      <span style={{ color: toast.type === 'success' ? 'var(--green)' : 'var(--red)', fontWeight: 700 }}>
        {icon}
      </span>
      <span>{toast.message}</span>
    </div>
  );
}

export default function Toast() {
  const toasts = useSelector(s => s.ui.toasts);
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
}
