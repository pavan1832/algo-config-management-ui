/**
 * ConfigForm – Reusable form for creating/editing algorithm configurations.
 * Handles its own field state, client-side validation, and submits via Redux thunks.
 */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createConfig, updateConfig, clearErrors } from '../redux/algoConfigSlice';
import { closeModal, addToast } from '../redux/uiSlice';

const INSTRUMENTS = ['NIFTY', 'BANKNIFTY', 'SP500', 'NASDAQ', 'EURUSD'];
const TIMEFRAMES = ['1m', '5m', '15m', '1h'];

const EMPTY_FORM = {
  name: '',
  instrument: '',
  timeframe: '',
  entryThreshold: '',
  exitThreshold: '',
  maxLossPct: '',
  maxTradesPerDay: '',
  enabled: true,
};

function validate(fields) {
  const errors = {};
  if (!fields.name.trim() || fields.name.trim().length < 3)
    errors.name = 'Name must be at least 3 characters.';
  if (!fields.instrument)
    errors.instrument = 'Please select an instrument.';
  if (!fields.timeframe)
    errors.timeframe = 'Please select a timeframe.';
  if (!fields.entryThreshold || Number(fields.entryThreshold) <= 0)
    errors.entryThreshold = 'Entry threshold must be > 0.';
  if (!fields.exitThreshold || Number(fields.exitThreshold) <= 0)
    errors.exitThreshold = 'Exit threshold must be > 0.';
  if (!fields.maxLossPct || Number(fields.maxLossPct) <= 0 || Number(fields.maxLossPct) > 100)
    errors.maxLossPct = 'Max loss % must be 0–100.';
  if (!fields.maxTradesPerDay || !Number.isInteger(Number(fields.maxTradesPerDay)) || Number(fields.maxTradesPerDay) < 1)
    errors.maxTradesPerDay = 'Must be a positive whole number.';
  return errors;
}

export default function ConfigForm({ initialData }) {
  const dispatch = useDispatch();
  const { status, apiErrors } = useSelector(s => s.algoConfig);
  const isEditing = Boolean(initialData?.id);

  const [fields, setFields] = useState(EMPTY_FORM);
  const [touched, setTouched] = useState({});
  const [clientErrors, setClientErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFields({
        name: initialData.name ?? '',
        instrument: initialData.instrument ?? '',
        timeframe: initialData.timeframe ?? '',
        entryThreshold: initialData.entryThreshold ?? '',
        exitThreshold: initialData.exitThreshold ?? '',
        maxLossPct: initialData.maxLossPct ?? '',
        maxTradesPerDay: initialData.maxTradesPerDay ?? '',
        enabled: initialData.enabled ?? true,
      });
    }
    return () => dispatch(clearErrors());
  }, [initialData, dispatch]);

  // Combine client + api errors
  const errors = { ...clientErrors, ...apiErrors };

  function set(key, val) {
    setFields(prev => ({ ...prev, [key]: val }));
    setTouched(prev => ({ ...prev, [key]: true }));
    // Live re-validate touched fields
    const updated = { ...fields, [key]: val };
    const errs = validate(updated);
    setClientErrors(errs);
  }

  function blur(key) {
    setTouched(prev => ({ ...prev, [key]: true }));
    setClientErrors(validate(fields));
  }

  const isValid = Object.keys(validate(fields)).length === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    // Touch all fields to show errors
    const allTouched = Object.fromEntries(Object.keys(fields).map(k => [k, true]));
    setTouched(allTouched);
    const errs = validate(fields);
    setClientErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      name: fields.name.trim(),
      instrument: fields.instrument,
      timeframe: fields.timeframe,
      entryThreshold: Number(fields.entryThreshold),
      exitThreshold: Number(fields.exitThreshold),
      maxLossPct: Number(fields.maxLossPct),
      maxTradesPerDay: parseInt(fields.maxTradesPerDay, 10),
      enabled: fields.enabled,
    };

    const action = isEditing
      ? updateConfig({ id: initialData.id, payload })
      : createConfig(payload);

    const result = await dispatch(action);

    if (!result.error) {
      dispatch(addToast({ type: 'success', message: isEditing ? 'Configuration updated.' : 'Configuration created.' }));
      dispatch(closeModal());
    } else if (!apiErrors) {
      dispatch(addToast({ type: 'error', message: 'Failed to save. Check your inputs.' }));
    }
  }

  const isLoading = status === 'loading';

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="modal-body">
        {/* Name */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Basic Info</div>
          <div className="field">
            <label className="field-label">Config Name <span className="required">*</span></label>
            <input
              type="text"
              placeholder="e.g. NIFTY Momentum v2"
              value={fields.name}
              onChange={e => set('name', e.target.value)}
              onBlur={() => blur('name')}
              className={touched.name && errors.name ? 'error' : ''}
            />
            {touched.name && errors.name && <span className="field-error">{errors.name}</span>}
          </div>
        </div>

        {/* Instrument + Timeframe */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Instrument &amp; Timeframe</div>
          <div className="form-grid">
            <div className="field">
              <label className="field-label">Instrument <span className="required">*</span></label>
              <select
                value={fields.instrument}
                onChange={e => set('instrument', e.target.value)}
                onBlur={() => blur('instrument')}
                className={touched.instrument && errors.instrument ? 'error' : ''}
              >
                <option value="">Select instrument...</option>
                {INSTRUMENTS.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              {touched.instrument && errors.instrument && <span className="field-error">{errors.instrument}</span>}
            </div>
            <div className="field">
              <label className="field-label">Timeframe <span className="required">*</span></label>
              <select
                value={fields.timeframe}
                onChange={e => set('timeframe', e.target.value)}
                onBlur={() => blur('timeframe')}
                className={touched.timeframe && errors.timeframe ? 'error' : ''}
              >
                <option value="">Select timeframe...</option>
                {TIMEFRAMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {touched.timeframe && errors.timeframe && <span className="field-error">{errors.timeframe}</span>}
            </div>
          </div>
        </div>

        {/* Thresholds */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Threshold Values</div>
          <div className="form-grid">
            <div className="field">
              <label className="field-label">Entry Threshold <span className="required">*</span></label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 0.85"
                value={fields.entryThreshold}
                onChange={e => set('entryThreshold', e.target.value)}
                onBlur={() => blur('entryThreshold')}
                className={touched.entryThreshold && errors.entryThreshold ? 'error' : ''}
              />
              <span className="field-hint">Signal strength required to enter a position</span>
              {touched.entryThreshold && errors.entryThreshold && <span className="field-error">{errors.entryThreshold}</span>}
            </div>
            <div className="field">
              <label className="field-label">Exit Threshold <span className="required">*</span></label>
              <input
                type="number"
                step="0.01"
                placeholder="e.g. 0.40"
                value={fields.exitThreshold}
                onChange={e => set('exitThreshold', e.target.value)}
                onBlur={() => blur('exitThreshold')}
                className={touched.exitThreshold && errors.exitThreshold ? 'error' : ''}
              />
              <span className="field-hint">Signal level at which to close position</span>
              {touched.exitThreshold && errors.exitThreshold && <span className="field-error">{errors.exitThreshold}</span>}
            </div>
          </div>
        </div>

        {/* Risk limits */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Risk Limits</div>
          <div className="form-grid">
            <div className="field">
              <label className="field-label">Max Loss % <span className="required">*</span></label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="100"
                placeholder="e.g. 2.5"
                value={fields.maxLossPct}
                onChange={e => set('maxLossPct', e.target.value)}
                onBlur={() => blur('maxLossPct')}
                className={touched.maxLossPct && errors.maxLossPct ? 'error' : ''}
              />
              <span className="field-hint">Max drawdown before algo is suspended</span>
              {touched.maxLossPct && errors.maxLossPct && <span className="field-error">{errors.maxLossPct}</span>}
            </div>
            <div className="field">
              <label className="field-label">Max Trades / Day <span className="required">*</span></label>
              <input
                type="number"
                step="1"
                min="1"
                placeholder="e.g. 10"
                value={fields.maxTradesPerDay}
                onChange={e => set('maxTradesPerDay', e.target.value)}
                onBlur={() => blur('maxTradesPerDay')}
                className={touched.maxTradesPerDay && errors.maxTradesPerDay ? 'error' : ''}
              />
              <span className="field-hint">Hard cap on executions per session</span>
              {touched.maxTradesPerDay && errors.maxTradesPerDay && <span className="field-error">{errors.maxTradesPerDay}</span>}
            </div>
          </div>
        </div>

        {/* Toggle */}
        <div>
          <div className="section-label">Activation</div>
          <div className="toggle-field">
            <div className="toggle-info">
              <span className="toggle-label">Algorithm Enabled</span>
              <span className="toggle-desc">When disabled, downstream systems will skip this config</span>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={fields.enabled}
                onChange={e => set('enabled', e.target.checked)}
              />
              <span className="toggle-track" />
            </label>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-ghost" onClick={() => dispatch(closeModal())}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={!isValid || isLoading}>
          {isLoading && <span className="spinner" style={{ borderTopColor: '#000' }} />}
          {isEditing ? 'Save Changes' : 'Create Config'}
        </button>
      </div>
    </form>
  );
}
