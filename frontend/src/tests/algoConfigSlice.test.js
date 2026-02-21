/**
 * Tests for algoConfigSlice reducer logic.
 * Covers initial state, synchronous actions, and fulfilled/rejected async states.
 */
import reducer, {
  clearSelected,
  clearErrors,
  setSelected,
} from '../redux/algoConfigSlice';
import { createConfig, updateConfig, fetchConfigs } from '../redux/algoConfigSlice';

const initialState = {
  list: [],
  selectedConfig: null,
  status: 'idle',
  error: null,
  apiErrors: {},
  lastSaved: null,
};

const sampleConfig = {
  id: 'abc-123',
  name: 'NIFTY Test',
  instrument: 'NIFTY',
  timeframe: '5m',
  entryThreshold: 0.85,
  exitThreshold: 0.4,
  maxLossPct: 2.5,
  maxTradesPerDay: 10,
  enabled: true,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// ── Synchronous action tests ──────────────────────────────────────────────────

describe('algoConfigSlice – sync actions', () => {
  it('returns initial state by default', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('setSelected stores a config', () => {
    const state = reducer(initialState, setSelected(sampleConfig));
    expect(state.selectedConfig).toEqual(sampleConfig);
  });

  it('clearSelected sets selectedConfig to null', () => {
    const state = reducer({ ...initialState, selectedConfig: sampleConfig }, clearSelected());
    expect(state.selectedConfig).toBeNull();
  });

  it('clearErrors resets error and apiErrors', () => {
    const dirty = { ...initialState, error: 'some error', apiErrors: { name: 'bad' } };
    const state = reducer(dirty, clearErrors());
    expect(state.error).toBeNull();
    expect(state.apiErrors).toEqual({});
  });
});

// ── Async thunk state transition tests ───────────────────────────────────────

describe('algoConfigSlice – async thunk state transitions', () => {
  it('fetchConfigs.pending sets status to loading', () => {
    const action = { type: fetchConfigs.pending.type };
    const state = reducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('fetchConfigs.fulfilled sets list and status to succeeded', () => {
    const action = {
      type: fetchConfigs.fulfilled.type,
      payload: [sampleConfig],
    };
    const state = reducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.list).toHaveLength(1);
    expect(state.list[0].name).toBe('NIFTY Test');
  });

  it('fetchConfigs.rejected sets status to failed and stores error', () => {
    const action = { type: fetchConfigs.rejected.type, payload: 'Network error' };
    const state = reducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Network error');
  });

  it('createConfig.fulfilled prepends config to list', () => {
    const existing = { ...initialState, list: [sampleConfig] };
    const newConfig = { ...sampleConfig, id: 'xyz-789', name: 'BANKNIFTY v1' };
    const action = { type: createConfig.fulfilled.type, payload: newConfig };
    const state = reducer(existing, action);
    expect(state.list).toHaveLength(2);
    expect(state.list[0].id).toBe('xyz-789'); // prepended
    expect(state.lastSaved).toBe('xyz-789');
  });

  it('updateConfig.fulfilled replaces existing config in list', () => {
    const updated = { ...sampleConfig, name: 'Updated NIFTY', maxLossPct: 5 };
    const existing = { ...initialState, list: [sampleConfig] };
    const action = { type: updateConfig.fulfilled.type, payload: updated };
    const state = reducer(existing, action);
    expect(state.list[0].name).toBe('Updated NIFTY');
    expect(state.list[0].maxLossPct).toBe(5);
    expect(state.list).toHaveLength(1); // not duplicated
  });

  it('createConfig.rejected with apiErrors stores field errors', () => {
    const action = {
      type: createConfig.rejected.type,
      payload: { errors: { name: 'Too short', instrument: 'Invalid' } },
    };
    const state = reducer(initialState, action);
    expect(state.apiErrors.name).toBe('Too short');
    expect(state.apiErrors.instrument).toBe('Invalid');
  });
});
