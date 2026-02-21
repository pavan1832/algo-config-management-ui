import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchConfigs } from '../redux/algoConfigSlice';
import { openCreateModal } from '../redux/uiSlice';
import StatsBar from '../components/StatsBar';
import ConfigTable from '../components/ConfigTable';

export default function HomePage() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector(s => s.algoConfig);

  useEffect(() => {
    dispatch(fetchConfigs());
  }, [dispatch]);

  return (
    <div className="animate-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Algorithm Configurations</h1>
          <div className="page-subtitle">
            Pre-trade rule definitions consumed by downstream execution systems
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => dispatch(openCreateModal())}>
          + New Config
        </button>
      </div>

      <StatsBar />

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Config Registry</div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => dispatch(fetchConfigs())}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? <span className="spinner" /> : '↻'} Refresh
          </button>
        </div>

        {status === 'failed' && (
          <div style={{
            background: 'var(--red-dim)', border: '1px solid rgba(255,69,96,0.2)',
            borderRadius: 6, padding: '12px 16px', marginBottom: 16,
            fontSize: 14, color: 'var(--red)', fontFamily: 'var(--mono)'
          }}>
            ⚠ {typeof error === 'string' ? error : 'Could not connect to backend API.'}
          </div>
        )}

        <ConfigTable configs={list} />
      </div>
    </div>
  );
}
