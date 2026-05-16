import { create } from 'zustand';

let counter = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  push: (msg, opts = {}) => {
    const id = `t_${++counter}`;
    const toast = {
      id,
      message: typeof msg === 'string' ? msg : msg.message,
      tone: opts.tone || 'default',          // default | success | danger | info
      duration: opts.duration ?? 2800
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    if (toast.duration > 0) {
      setTimeout(() => get().dismiss(id), toast.duration);
    }
    return id;
  },

  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
}));

// Sugar — `toast.success("Saved")`, `toast.error(...)`, etc.
export const toast = {
  show:    (msg, opts) => useToastStore.getState().push(msg, opts),
  success: (msg)       => useToastStore.getState().push(msg, { tone: 'success' }),
  error:   (msg)       => useToastStore.getState().push(msg, { tone: 'danger' }),
  info:    (msg)       => useToastStore.getState().push(msg, { tone: 'info' })
};
