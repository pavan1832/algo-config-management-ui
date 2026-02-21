import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { openEditModal } from '../redux/uiSlice';

function StatusBadge({ enabled }) {
  return (
    <span className={`badge ${enabled ? 'badge-green' : 'badge-red'}`}>
      <span style={{ fontSize: 8, lineHeight: 1 }}>●</span>
      {enabled ? 'Enabled' : 'Disabled'}
    </span>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('en-IN', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function ConfigTable({ configs }) {
  const dispatch = useDispatch();
  const lastSaved = useSelector(s => s.algoConfig.lastSaved);

  if (!configs.length) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⚙️</div>
        <div className="empty-title">No configurations yet</div>
        <div className="empty-desc">Create your first algorithm config to get started.</div>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="config-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Instrument</th>
            <th>Timeframe</th>
            <th>Entry Θ</th>
            <th>Exit Θ</th>
            <th>Max Loss</th>
            <th>Max Trades</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {configs.map(cfg => (
            <tr key={cfg.id} style={cfg.id === lastSaved ? { background: 'var(--accent-dim)' } : {}}>
              <td>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{cfg.name}</div>
                <div className="text-xs text-dim mono">{cfg.id.slice(0, 8)}…</div>
              </td>
              <td><span className="badge badge-blue mono">{cfg.instrument}</span></td>
              <td><span className="badge badge-amber mono">{cfg.timeframe}</span></td>
              <td className="mono">{cfg.entryThreshold}</td>
              <td className="mono">{cfg.exitThreshold}</td>
              <td className="mono">{cfg.maxLossPct}%</td>
              <td className="mono">{cfg.maxTradesPerDay}/day</td>
              <td><StatusBadge enabled={cfg.enabled} /></td>
              <td className="text-xs mono text-dim" style={{ whiteSpace: 'nowrap' }}>
                {formatDate(cfg.updatedAt)}
              </td>
              <td>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => dispatch(openEditModal(cfg.id))}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
