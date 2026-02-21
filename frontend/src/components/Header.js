import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Header() {
  const status = useSelector(s => s.algoConfig.status);
  const [apiOnline, setApiOnline] = useState(null);

  useEffect(() => {
    // Lightweight health check
    const check = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/health`);
        setApiOnline(res.ok);
      } catch {
        setApiOnline(false);
      }
    };
    check();
  }, []);

  return (
    <header className="header">
      <div className="header-brand">
        <div className="header-logo">AC</div>
        <div>
          <div className="header-title">AlgoConfig UI</div>
          <div className="header-subtitle">Algorithm Configuration &amp; Rule Builder</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        {status === 'loading' && <span className="spinner" />}
        <div className="header-status">
          <span className={`status-dot ${apiOnline === false ? 'offline' : ''}`} />
          {apiOnline === false ? 'API Offline' : apiOnline ? 'API Connected' : 'Checking...'}
        </div>
      </div>
    </header>
  );
}
