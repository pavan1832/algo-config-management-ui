/**
 * algoConfigSlice – manages the list of algorithm configurations.
 * Async thunks handle all API interactions via the configService.
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../services/configService';

// ── Async Thunks ─────────────────────────────────────────────────────────────

export const fetchConfigs = createAsyncThunk(
  'algoConfig/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.getConfigs();
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to load configs.');
    }
  }
);

export const fetchConfigById = createAsyncThunk(
  'algoConfig/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.getConfigById(id);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Config not found.');
    }
  }
);

export const createConfig = createAsyncThunk(
  'algoConfig/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.postConfig(payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create config.');
    }
  }
);

export const updateConfig = createAsyncThunk(
  'algoConfig/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await api.putConfig(id, payload);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update config.');
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────────────────

const algoConfigSlice = createSlice({
  name: 'algoConfig',
  initialState: {
    list: [],
    selectedConfig: null,
    status: 'idle',       // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    apiErrors: {},        // field-level validation errors from backend
    lastSaved: null,
  },
  reducers: {
    clearSelected(state) { state.selectedConfig = null; },
    clearErrors(state) { state.error = null; state.apiErrors = {}; },
    setSelected(state, action) { state.selectedConfig = action.payload; },
  },
  extraReducers: (builder) => {
    // fetchConfigs
    builder
      .addCase(fetchConfigs.pending, (state) => { state.status = 'loading'; state.error = null; })
      .addCase(fetchConfigs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchConfigs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });

    // createConfig
    builder
      .addCase(createConfig.pending, (state) => { state.status = 'loading'; state.apiErrors = {}; })
      .addCase(createConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list.unshift(action.payload);
        state.lastSaved = action.payload.id;
      })
      .addCase(createConfig.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload?.errors) state.apiErrors = action.payload.errors;
        else state.error = action.payload;
      });

    // updateConfig
    builder
      .addCase(updateConfig.pending, (state) => { state.status = 'loading'; state.apiErrors = {}; })
      .addCase(updateConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const idx = state.list.findIndex(c => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        state.lastSaved = action.payload.id;
      })
      .addCase(updateConfig.rejected, (state, action) => {
        state.status = 'failed';
        if (action.payload?.errors) state.apiErrors = action.payload.errors;
        else state.error = action.payload;
      });
  },
});

export const { clearSelected, clearErrors, setSelected } = algoConfigSlice.actions;
export default algoConfigSlice.reducer;
