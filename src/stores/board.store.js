import { create } from 'zustand';

export const TOOLS = {
  SELECT: 'select',
  DRAW:   'draw',
  CIRCLE: 'circle',
  RECT:   'rect',
  ARROW:  'arrow',
  TEXT:   'text',
  ERASER: 'eraser'
};

export const useBoardStore = create((set, get) => ({
  tool: TOOLS.SELECT,
  view: 'court', // 'court' | '3d'
  selectedObjectId: null,
  history: [], // snapshots of scenes (for undo)
  future: [],

  setTool: (tool) => set({ tool }),
  setView: (view) => set({ view }),
  selectObject: (id) => set({ selectedObjectId: id }),
  clearSelection: () => set({ selectedObjectId: null }),

  pushHistory: (snapshot) =>
    set((state) => ({
      history: [...state.history.slice(-49), snapshot],
      future: []
    })),

  undo: (currentScene, apply) => {
    const { history } = get();
    if (!history.length) return;
    const prev = history[history.length - 1];
    set((state) => ({
      history: state.history.slice(0, -1),
      future: [...state.future, currentScene]
    }));
    apply(prev);
  },

  redo: (currentScene, apply) => {
    const { future } = get();
    if (!future.length) return;
    const next = future[future.length - 1];
    set((state) => ({
      future: state.future.slice(0, -1),
      history: [...state.history, currentScene]
    }));
    apply(next);
  },

  resetHistory: () => set({ history: [], future: [] })
}));
