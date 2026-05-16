import { create } from 'zustand';

const seed = [
  { id: 'e1', day: 'Mon', date: '13', title: 'Strength & Conditioning', time: '18:00', type: 'training' },
  { id: 'e2', day: 'Tue', date: '14', title: 'Half-court Sets',        time: '19:00', type: 'training' },
  { id: 'e3', day: 'Thu', date: '16', title: 'Scrimmage',              time: '19:00', type: 'training' },
  { id: 'e4', day: 'Fri', date: '17', title: 'Walk-through',           time: '17:30', type: 'training' },
  { id: 'e5', day: 'Sat', date: '18', title: 'Match: vs Garuda BC',    time: '19:30', type: 'match'    },
  { id: 'e6', day: 'Sun', date: '19', title: 'Recovery',               time: '10:00', type: 'rest'     }
];

export const useScheduleStore = create((set, get) => ({
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
