/**
 * Tests for uiSlice – modal state, toasts, and tab management.
 */
import reducer, {
  openCreateModal,
  openEditModal,
  closeModal,
  setActiveTab,
  addToast,
  removeToast,
} from '../redux/uiSlice';

const initialState = {
  modalOpen: false,
  editingId: null,
  activeTab: 'list',
  toasts: [],
};

describe('uiSlice – modal actions', () => {
  it('openCreateModal sets modalOpen=true and editingId=null', () => {
    const state = reducer(initialState, openCreateModal());
    expect(state.modalOpen).toBe(true);
    expect(state.editingId).toBeNull();
  });

  it('openEditModal sets modalOpen=true and stores the editingId', () => {
    const state = reducer(initialState, openEditModal('config-456'));
    expect(state.modalOpen).toBe(true);
    expect(state.editingId).toBe('config-456');
  });

  it('closeModal resets both modalOpen and editingId', () => {
    const open = { ...initialState, modalOpen: true, editingId: 'config-456' };
    const state = reducer(open, closeModal());
    expect(state.modalOpen).toBe(false);
    expect(state.editingId).toBeNull();
  });
});

describe('uiSlice – tab navigation', () => {
  it('setActiveTab updates activeTab', () => {
    const state = reducer(initialState, setActiveTab('new'));
    expect(state.activeTab).toBe('new');
  });
});

describe('uiSlice – toasts', () => {
  it('addToast appends a toast with message and type', () => {
    const state = reducer(initialState, addToast({ type: 'success', message: 'Saved!' }));
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].message).toBe('Saved!');
    expect(state.toasts[0].type).toBe('success');
    expect(state.toasts[0].id).toBeDefined();
  });

  it('removeToast removes by id', () => {
    let state = reducer(initialState, addToast({ type: 'error', message: 'Error!' }));
    const id = state.toasts[0].id;
    state = reducer(state, removeToast(id));
    expect(state.toasts).toHaveLength(0);
  });

  it('removeToast does not affect other toasts', () => {
    let state = reducer(initialState, addToast({ type: 'success', message: 'First' }));
    state = reducer(state, addToast({ type: 'error', message: 'Second' }));
    const firstId = state.toasts[0].id;
    state = reducer(state, removeToast(firstId));
    expect(state.toasts).toHaveLength(1);
    expect(state.toasts[0].message).toBe('Second');
  });
});
