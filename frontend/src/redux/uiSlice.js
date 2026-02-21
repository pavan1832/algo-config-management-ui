/**
 * uiSlice – manages transient UI state: modal visibility, toasts, active tab.
 */
import { createSlice } from '@reduxjs/toolkit';

let toastId = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    modalOpen: false,
    editingId: null,     // null = create mode, string = edit mode
    activeTab: 'list',   // 'list' | 'new'
    toasts: [],
  },
  reducers: {
    openCreateModal(state) {
      state.modalOpen = true;
      state.editingId = null;
    },
    openEditModal(state, action) {
      state.modalOpen = true;
      state.editingId = action.payload;
    },
    closeModal(state) {
      state.modalOpen = false;
      state.editingId = null;
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    addToast(state, action) {
      state.toasts.push({ id: ++toastId, ...action.payload });
    },
    removeToast(state, action) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload);
    },
  },
});

export const { openCreateModal, openEditModal, closeModal, setActiveTab, addToast, removeToast } = uiSlice.actions;
export default uiSlice.reducer;
