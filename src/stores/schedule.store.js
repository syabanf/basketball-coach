import { create } from 'zustand';

// All events use ISO YYYY-MM-DD. UI derives day-of-week and label from the date.
const seed = [
  { id: 'e1', date: '2024-05-13', time: '18:00', title: 'Strength & Conditioning', type: 'training' },
  { id: 'e2', date: '2024-05-14', time: '19:00', title: 'Half-court Sets',        type: 'training' },
  { id: 'e3', date: '2024-05-16', time: '19:00', title: 'Scrimmage',              type: 'training' },
  { id: 'e4', date: '2024-05-17', time: '17:30', title: 'Walk-through',           type: 'training' },
  { id: 'e5', date: '2024-05-18', time: '19:30', title: 'Match: vs Garuda BC',    type: 'match'    },
  { id: 'e6', date: '2024-05-19', time: '10:00', title: 'Recovery',               type: 'rest'     },
  { id: 'e7', date: '2024-05-21', time: '18:00', title: 'Film: Garuda recap',     type: 'meeting'  },
  { id: 'e8', date: '2024-05-23', time: '19:00', title: 'PnR Coverage Drills',    type: 'training' },
  { id: 'e9', date: '2024-05-25', time: '19:30', title: 'Match: vs Java Storm',   type: 'match'    },
  { id: 'e10', date: '2024-05-08', time: '19:00', title: 'Conditioning',          type: 'training' },
  { id: 'e11', date: '2024-05-30', time: '18:00', title: 'Free Throw Tournament', type: 'training' }
];

export const useScheduleStore = create((set) => ({
  events: seed,

  addEvent: (event) => {
    const id = `e_${Math.random().toString(36).slice(2, 8)}`;
    set((state) => ({ events: [...state.events, { id, ...event }] }));
    return id;
  },

  updateEvent: (id, patch) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === id ? { ...e, ...patch } : e))
    })),

  removeEvent: (id) =>
    set((state) => ({ events: state.events.filter((e) => e.id !== id) }))
}));
