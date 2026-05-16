import { create } from 'zustand';
import { players as seedPlayers } from '../data/players.js';

const blankAttrs = {
  shooting: 60, passing: 60, dribbling: 60,
  defense: 60, athleticism: 65, basketballIQ: 60
};

export const usePlayerStore = create((set, get) => ({
  players: seedPlayers,
  selectedPlayerId: seedPlayers[0].id,

  setSelectedPlayer: (id) => set({ selectedPlayerId: id }),

  updatePlayer: (id, patch) =>
    set((state) => ({
      players: state.players.map((p) => (p.id === id ? { ...p, ...patch } : p))
    })),

  addPlayer: ({ name, position = 'PG' }) => {
    const id = `pl_${Math.random().toString(36).slice(2, 8)}`;
    const jersey = (get().players.reduce((a, p) => Math.max(a, p.jersey), 0) || 0) + 1;
    const player = {
      id,
      jersey,
      name,
      position,
      positionLong: { PG: 'Point Guard', SG: 'Shooting Guard', SF: 'Small Forward', PF: 'Power Forward', C: 'Center' }[position] || position,
      height: 180,
      weight: 78,
      age: 22,
      overall: 70,
      status: 'bench',
      attributes: blankAttrs,
      notes: 'Newly added to roster.'
    };
    set((state) => ({ players: [...state.players, player], selectedPlayerId: id }));
    return player;
  },

  removePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
      selectedPlayerId: state.selectedPlayerId === id ? state.players[0]?.id : state.selectedPlayerId
    }))
}));
