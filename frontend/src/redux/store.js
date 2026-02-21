import { configureStore } from '@reduxjs/toolkit';
import algoConfigReducer from './algoConfigSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    algoConfig: algoConfigReducer,
    ui: uiReducer,
  },
});
