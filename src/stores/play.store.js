import { create } from 'zustand';
import { plays as seedPlays } from '../data/plays.js';

export const usePlayStore = create((set, get) => ({
  plays: seedPlays,
  activePlayId: seedPlays[0].id,

  setActivePlay: (id) => set({ activePlayId: id }),

  getActivePlay: () => {
    const { plays, activePlayId } = get();
    return plays.find((p) => p.id === activePlayId) || plays[0];
  },

  upsertPlay: (play) =>
    set((state) => {
      const exists = state.plays.some((p) => p.id === play.id);
      const next = exists
        ? state.plays.map((p) => (p.id === play.id ? { ...p, ...play, updatedAt: new Date().toISOString() } : p))
        : [{ ...play, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...state.plays];
      return { plays: next };
    }),

  deletePlay: (id) =>
    set((state) => ({
      plays: state.plays.filter((p) => p.id !== id),
      activePlayId: state.activePlayId === id ? state.plays[0]?.id : state.activePlayId
    }))
}));
