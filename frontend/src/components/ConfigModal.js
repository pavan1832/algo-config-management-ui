import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../redux/uiSlice';
import ConfigForm from './ConfigForm';

export default function ConfigModal() {
  const dispatch = useDispatch();
  const { modalOpen, editingId } = useSelector(s => s.ui);
  const configs = useSelector(s => s.algoConfig.list);

  if (!modalOpen) return null;

  const editingConfig = editingId ? configs.find(c => c.id === editingId) : null;
  const title = editingId ? `Edit Config — ${editingConfig?.name || ''}` : 'New Algorithm Config';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && dispatch(closeModal())}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <div className="modal-title">{title}</div>
            {editingConfig && (
              <div className="text-xs text-dim mono" style={{ marginTop: 3 }}>ID: {editingConfig.id}</div>
            )}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={() => dispatch(closeModal())}>✕</button>
        </div>
        <ConfigForm initialData={editingConfig} />
      </div>
    </div>
  );
}
