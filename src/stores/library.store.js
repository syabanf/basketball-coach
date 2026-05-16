import { create } from 'zustand';
import { libraryItems as seed } from '../data/library.js';

export const useLibraryStore = create((set, get) => ({
  items: seed,

  getById: (id) => get().items.find((i) => i.id === id),

  addItem: (payload) => {
    const id = `lib_${Math.random().toString(36).slice(2, 8)}`;
    const item = {
      id,
      updated: new Date().toISOString().slice(0, 10),
      createdBy: 'Coach Kevin',
      tags: [],
      body: [],
      ...payload
    };
    set((state) => ({ items: [item, ...state.items] }));
    return item;
  },

  updateItem: (id, patch) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === id ? { ...i, ...patch, updated: new Date().toISOString().slice(0, 10) } : i
      )
    })),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) }))
}));
