// Deterministic mock analytics — every play gets stable, plausible numbers
// derived from its id. Real implementations would replace this with the API.

const hashStr = (s) => {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const rng = (seed) => {
  let s = seed || 1;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0xFFFFFFFF;
  };
};

const round = (n, d = 0) => {
  const m = Math.pow(10, d);
  return Math.round(n * m) / m;
};

// Phrase pools per play category. Stable selection via rng.
const INSIGHT_POOLS = {
  Offense: [
    'Defenders overcommit to the strong-side screen — the slip is open in {pct}% of reps.',
    'Best results when PG attacks downhill vs drop coverage; pull-up + lob both reading green.',
    'Weak-side corner is uncontested {pct}% of the time on early swing passes.',
    'When the screener pops instead of rolling, the elbow jumper converts at {pct}%.',
    'Backside cut behind the help defender is open against switch coverage.',
    'Trail action 3 is open in {pct}% of reps when the corner shooter is a credible threat.'
  ],
  Defense: [
    'Top-of-key catches lead to drives {pct}% of the time — close out short.',
    'Opponent shoots {pct}% from the right wing against this look — overload that side.',
    'Roll defender hedges late; communicate switch on screens above the break.',
    'Force baseline; help-side rotation should set early at the elbow.',
    'When this set is run, opponents post up {pct}% of possessions — front the post.'
  ],
  Sets: [
    'Counter to {pct}% of opponent ICE coverage; flip side and re-screen.',
    'Pin-in to corner shooter generates the highest EFG in the playbook.',
    'When defender goes under, splash {pct}% from above the break.'
  ],
  ATO: [
    'Best ATO success rate in the playbook ({pct}%); save for late-clock possessions.',
    'Opponents leak under the screen — keep the snug coverage as a key.'
  ]
};

const DEFENSES_OFF = ['Drop coverage', 'Hedge', 'Switch', 'ICE / weak', 'Trap'];
const DEFENSES_DEF = ['Spread offense', 'Pick & Roll', 'Iso ball-handler', 'Post-up', 'Off-ball action'];

/**
 * Build analytics for a single play.
 * @param {{ id: string, title: string, category: string, tags: string[] }} play
 * @param {Array} players  — full roster
 */
export function playStats(play, players) {
  if (!play) return null;
  const seed = hashStr(play.id);
  const r = rng(seed);

  const isOffense = (play.category || '').toLowerCase().startsWith('off');
  const isDefense = (play.category || '').toLowerCase().startsWith('def');

  // KPI tiles
  const timesRun = Math.round(8 + r() * 92);                // 8 – 100
  const usagePct = round(6 + r() * 28, 1);                  // 6.0 – 34.0
  const ppp = round(0.82 + r() * 0.55, 2);                  // 0.82 – 1.37 (points per possession)
  const successPct = round(38 + r() * 50, 1);               // 38 – 88
  const efgPct = round(40 + r() * 25, 1);                   // 40 – 65
  const turnoverPct = round(4 + r() * 14, 1);               // 4 – 18
  const possessionSec = round(6 + r() * 11, 1);             // 6 – 17 sec

  // Shooting heatmap — 9 (cols) × 6 (rows) intensities 0..1
  const cols = 9, rows = 6;
  const heatmap = Array.from({ length: cols * rows }, (_, i) => {
    // bias hot zones near the rim (top row) and around the wings
    const col = i % cols;
    const row = Math.floor(i / cols);
    const rimBias = Math.max(0, 1 - row / rows) * 0.6;
    const wingBias = (col === 1 || col === 7) ? 0.15 : 0;
    return Math.min(1, rimBias + wingBias + r() * 0.6);
  });

  // Top players for this play
  const sorted = [...players].sort(() => r() - 0.5);
  const topPlayers = sorted.slice(0, Math.min(5, players.length)).map((p) => ({
    id: p.id,
    name: p.name,
    jersey: p.jersey,
    position: p.position,
    effectiveness: round(55 + r() * 40, 1)
  })).sort((a, b) => b.effectiveness - a.effectiveness);

  // Opponent coverage / response distribution
  const pool = isDefense ? DEFENSES_DEF : DEFENSES_OFF;
  const raw = pool.map((name) => ({ name, raw: r() }));
  const total = raw.reduce((a, x) => a + x.raw, 0);
  const coverage = raw
    .map((x) => ({ name: x.name, pct: round((x.raw / total) * 100, 1) }))
    .sort((a, b) => b.pct - a.pct);

  // Recent trend (last 6 games) — small array of usage counts
  const trend = Array.from({ length: 6 }, () => Math.round(r() * 14));

  // AI-style insights (1–3 lines, templated)
  const pool2 = isDefense ? INSIGHT_POOLS.Defense : (INSIGHT_POOLS[play.category] || INSIGHT_POOLS.Offense);
  const picked = [];
  const seen = new Set();
  while (picked.length < 3 && picked.length < pool2.length) {
    const idx = Math.floor(r() * pool2.length);
    if (seen.has(idx)) continue;
    seen.add(idx);
    picked.push(pool2[idx].replace('{pct}', String(Math.round(35 + r() * 50))));
  }

  // Suggestions: "good vs" / "watch out for"
  const goodVs = coverage[coverage.length - 1]?.name || 'mixed defenses';
  const watchOut = coverage[0]?.name || 'standard coverage';

  return {
    timesRun, usagePct, ppp, successPct, efgPct, turnoverPct, possessionSec,
    heatmap, heatmapCols: cols, heatmapRows: rows,
    topPlayers, coverage, trend, insights: picked,
    summary: {
      goodVs:   isOffense ? `Best vs ${goodVs}`    : `Forces opponent into ${goodVs}`,
      watchOut: isOffense ? `Watch for ${watchOut}` : `Most common counter: ${watchOut}`
    }
  };
}
