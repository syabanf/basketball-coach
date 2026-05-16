// Derived team / roster metrics. Pure functions over the players array — no
// store coupling so they're easy to test and reuse anywhere.

import { attributeKeys } from '../data/players.js';

export const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

/** Count of each position in the roster. */
export const positionBreakdown = (players) =>
  POSITIONS.reduce((acc, pos) => {
    acc[pos] = players.filter((p) => p.position === pos).length;
    return acc;
  }, {});

/** Count of starters / rotation / bench. */
export const statusBreakdown = (players) => ({
  starter:  players.filter((p) => p.status === 'starter').length,
  rotation: players.filter((p) => p.status === 'rotation').length,
  bench:    players.filter((p) => p.status === 'bench').length
});

/** Roster-averaged attributes, returned as the same `{key, label, value}` shape. */
export const teamAverages = (players) => {
  if (!players.length) return attributeKeys.map((a) => ({ ...a, value: 0 }));
  return attributeKeys.map((a) => ({
    ...a,
    value: Math.round(players.reduce((sum, p) => sum + (p.attributes?.[a.key] || 0), 0) / players.length)
  }));
};

/** Top N players sorted by a single attribute key (e.g. 'shooting'). */
export const topByAttribute = (players, key, n = 1) =>
  [...players]
    .sort((a, b) => (b.attributes?.[key] || 0) - (a.attributes?.[key] || 0))
    .slice(0, n);

/** Top by composite role: { name, attribute }. */
export const ROLE_AWARDS = [
  { key: 'shooting',     title: 'Top Scorer',   icon: 'scorer'   },
  { key: 'defense',      title: 'Top Defender', icon: 'shield'   },
  { key: 'passing',      title: 'Top Creator',  icon: 'creator'  },
  { key: 'basketballIQ', title: 'Floor General', icon: 'iq'      }
];

/** Generic avg across an array. */
export const avg = (arr, accessor = (x) => x) =>
  arr.length ? Math.round(arr.reduce((s, x) => s + (accessor(x) || 0), 0) / arr.length) : 0;

/**
 * Synergy score (0–100) for a chosen lineup map { PG, SG, SF, PF, C }.
 * Combines:
 *   - balance: variance of attribute averages (low variance = balanced)
 *   - position fit: bonus when player.position matches the slot
 *   - depth: avg OVR
 *
 * Returns { score, breakdown: { balance, fit, depth }, fitWarnings: [{slot, player}] }
 */
export const lineupSynergy = (lineupByPosition, players) => {
  const ids = Object.values(lineupByPosition).filter(Boolean);
  const filled = ids.map((id) => players.find((p) => p.id === id)).filter(Boolean);
  if (filled.length === 0) return { score: 0, breakdown: { balance: 0, fit: 0, depth: 0 }, fitWarnings: [] };

  // Depth = average OVR scaled to 100
  const depth = Math.round(filled.reduce((s, p) => s + p.overall, 0) / filled.length);

  // Balance — average across each attribute, then 100 - std-dev * factor
  const perAttr = attributeKeys.map((a) =>
    filled.reduce((s, p) => s + (p.attributes?.[a.key] || 0), 0) / filled.length
  );
  const mean = perAttr.reduce((s, v) => s + v, 0) / perAttr.length;
  const variance = perAttr.reduce((s, v) => s + (v - mean) ** 2, 0) / perAttr.length;
  const stdDev = Math.sqrt(variance);
  const balance = Math.max(0, Math.min(100, Math.round(100 - stdDev * 2.5)));

  // Position fit
  const slots = Object.keys(lineupByPosition);
  const matches = slots.filter((slot) => {
    const id = lineupByPosition[slot];
    if (!id) return false;
    return players.find((p) => p.id === id)?.position === slot;
  }).length;
  const fit = Math.round((matches / 5) * 100);

  const fitWarnings = slots
    .map((slot) => {
      const id = lineupByPosition[slot];
      if (!id) return null;
      const p = players.find((x) => x.id === id);
      if (!p) return null;
      return p.position === slot ? null : { slot, player: p };
    })
    .filter(Boolean);

  // Final score = weighted blend
  const score = Math.round(depth * 0.45 + balance * 0.30 + fit * 0.25);

  return {
    score,
    breakdown: { depth, balance, fit },
    fitWarnings
  };
};

/**
 * Workload summary for a given list of events.
 * Returns counts + total training hours (assumes 1.5h per training, 2h per match).
 */
export const workloadSummary = (events) => {
  const counts = { training: 0, match: 0, rest: 0, meeting: 0 };
  for (const e of events) {
    counts[e.type] = (counts[e.type] || 0) + 1;
  }
  const trainingHours = counts.training * 1.5 + counts.match * 2;
  const intensity =
    trainingHours >= 9 ? { label: 'Heavy',  tone: 'danger',  color: 'bg-red-500' }
    : trainingHours >= 6 ? { label: 'Normal', tone: 'brand', color: 'bg-brand-500' }
    : { label: 'Light',  tone: 'success', color: 'bg-emerald-500' };
  return { counts, trainingHours, intensity, total: events.length };
};
