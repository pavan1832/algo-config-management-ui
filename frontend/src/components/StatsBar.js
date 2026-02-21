import React from 'react';
import { useSelector } from 'react-redux';

export default function StatsBar() {
  const configs = useSelector(s => s.algoConfig.list);

  const total = configs.length;
  const enabled = configs.filter(c => c.enabled).length;
  const instruments = [...new Set(configs.map(c => c.instrument))].length;
  const avgLoss = total
    ? (configs.reduce((a, c) => a + c.maxLossPct, 0) / total).toFixed(1)
    : '—';

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Total Configs</div>
        <div className="stat-value accent">{total}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Enabled</div>
        <div className="stat-value green">{enabled}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Instruments</div>
        <div className="stat-value">{instruments}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Avg Max Loss %</div>
        <div className="stat-value">{avgLoss}{total ? '%' : ''}</div>
      </div>
    </div>
  );
}
