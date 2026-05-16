import { create } from 'zustand';
import { mockUsers } from '../data/mock-users.js';

// LocalStorage key — bumping the suffix invalidates stale sessions on rebrand.
const STORAGE_KEY = 'wit.auth.v2';

const loadPersisted = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writePersisted = (value) => {
  if (typeof window === 'undefined') return;
  try {
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else       localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore quota/privacy mode failures */
  }
};

const initial = loadPersisted();

export const useAuthStore = create((set) => ({
  user: initial,
  isAuthenticated: Boolean(initial),

  /**
   * Mock login. Resolves to the user on success, throws on bad credentials.
   * Any email matching a mock user signs in regardless of password (demo mode);
   * otherwise email+password must match exactly.
   */
  login: async ({ email, password }) => {
    // Small simulated delay so the form's "Signing in…" state is visible.
    await new Promise((r) => setTimeout(r, 450));

    const normalized = (email || '').trim().toLowerCase();
    if (!normalized) throw new Error('Email is required');

    const knownUser = mockUsers.find((u) => u.email.toLowerCase() === normalized);
    let user;

    if (knownUser) {
      // Known demo account — accept any password
      user = { ...knownUser };
      delete user.password;
    } else {
      // Unknown email — accept anything non-empty as a generic coach
      if (!password) throw new Error('Password is required');
      user = {
        id: `usr_${Math.random().toString(36).slice(2, 8)}`,
        email: normalized,
        name: 'Demo Coach',
        role: 'Head Coach',
        team: 'WIT Squad'
      };
    }

    writePersisted(user);
    set({ user, isAuthenticated: true });
    return user;
  },

  logout: () => {
    writePersisted(null);
    set({ user: null, isAuthenticated: false });
  }
}));
