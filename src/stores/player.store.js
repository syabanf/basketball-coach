import { create } from 'zustand';
import { players as seedPlayers } from '../data/players.js';

const blankAttrs = {
  shooting: 60, passing: 60, dribbling: 60,
  defense: 60, athleticism: 65, basketballIQ: 60
};

const POSITION_LONG = {
  PG: 'Point Guard', SG: 'Shooting Guard', SF: 'Small Forward', PF: 'Power Forward', C: 'Center'
};

export const usePlayerStore = create((set, get) => ({
  players: seedPlayers,
  selectedPlayerId: seedPlayers[0].id,

  // Selection ────────────────────────────────────────────────
  setSelectedPlayer: (id) => set({ selectedPlayerId: id }),

  // CRUD ─────────────────────────────────────────────────────
  addPlayer: (payload) => {
    const id = `pl_${Math.random().toString(36).slice(2, 8)}`;
    const jersey = payload.jersey ??
      ((get().players.reduce((a, p) => Math.max(a, p.jersey || 0), 0) || 0) + 1);
    const player = {
      id,
      jersey,
      name: payload.name || 'Player',
      position: payload.position || 'PG',
      positionLong: payload.positionLong || POSITION_LONG[payload.position] || 'Point Guard',
      height: payload.height ?? 180,
      weight: payload.weight ?? 78,
      age: payload.age ?? 22,
      overall: payload.overall ?? 70,
      status: payload.status || 'bench',
      attributes: payload.attributes || blankAttrs,
      notes: payload.notes || ''
    };
    set((state) => ({ players: [...state.players, player], selectedPlayerId: id }));
    return player;
  },

  editPlayer: (id, patch) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === id ? { ...p, ...patch } : p))
    })),

  removePlayer: (id) =>
    set((state) => {
      const next = state.players.filter((p) => p.id !== id);
      return {
        players: next,
        selectedPlayerId: state.selectedPlayerId === id ? next[0]?.id : state.selectedPlayerId
      };
    }),

  // Starting lineup ──────────────────────────────────────────
  /**
   * setStartingLineup(idsByPosition)
   *   { PG: 'pl_01', SG: 'pl_02', SF: 'pl_03', PF: 'pl_04', C: 'pl_05' }
   *
   *   Selected 5 are marked status='starter'. Others stay as 'bench' or 'rotation'
   *   depending on their existing status — bench stays bench, rotation stays rotation,
   *   any previous starter not in the new five drops to 'rotation'.
   */
  setStartingLineup: (idsByPosition) => {
    const starterIds = new Set(Object.values(idsByPosition).filter(Boolean));
    set((state) => ({
      players: state.players.map((p) => {
        if (starterIds.has(p.id)) return { ...p, status: 'starter' };
        if (p.status === 'starter') return { ...p, status: 'rotation' };
        return p;
      })
    }));
  }
}));
