import { useEffect, useMemo, useState } from 'react';
import { Card, CardHeader } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Icon } from '../ui/Icon.jsx';
import { PlayerPickerModal } from './PlayerPickerModal.jsx';
import { COURT } from '../../lib/board-geometry.js';
import { CourtBackground } from '../board/CourtBackground.jsx';
import { cn } from '../../lib/cn.js';

// Five-on-the-court positions on the half-court canvas (1000 × 940 viewBox).
const SLOTS = [
  { key: 'PG', label: 'PG', x: 500, y: 760 },
  { key: 'SG', label: 'SG', x: 820, y: 540 },
  { key: 'SF', label: 'SF', x: 180, y: 540 },
  { key: 'PF', label: 'PF', x: 380, y: 360 },
  { key: 'C',  label: 'C',  x: 620, y: 360 }
];

/**
 * Initial lineup = currently-marked starters mapped onto slots by their position
 * (PG → PG, SG → SG, …). Players sharing a position fall back to the next open slot.
 */
function buildInitialLineup(players) {
  const out = { PG: null, SG: null, SF: null, PF: null, C: null };
  const starters = players.filter((p) => p.status === 'starter');
  for (const p of starters) {
    if (out[p.position] == null) {
      out[p.position] = p.id;
    } else {
      // Drop into the first empty slot (best-effort placement)
      const empty = Object.keys(out).find((k) => out[k] == null);
      if (empty) out[empty] = p.id;
    }
  }
  return out;
}

export function StartingLineup({ players, onSave }) {
  const initial = useMemo(() => buildInitialLineup(players), [players]);
  const [lineup, setLineup] = useState(initial);
  const [picker, setPicker] = useState(null); // slot key being edited
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => { setLineup(initial); }, [initial]);

  const dirty = JSON.stringify(lineup) !== JSON.stringify(initial);
  const filledCount = Object.values(lineup).filter(Boolean).length;
  const playerById = (id) => players.find((p) => p.id === id);

  const handlePick = (slotKey, playerId) => {
    setLineup((l) => {
      const next = { ...l };
      // If this player was already in another slot, vacate that slot.
      for (const k of Object.keys(next)) if (next[k] === playerId) next[k] = null;
      next[slotKey] = playerId;
      return next;
    });
  };

  const handleClear = (slotKey) =>
    setLineup((l) => ({ ...l, [slotKey]: null }));

  const handleSave = () => {
    onSave?.(lineup);
    setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleReset = () => setLineup(initial);

  // Auto-fill: highest OVR per position
  const handleAutoFill = () => {
    const next = { PG: null, SG: null, SF: null, PF: null, C: null };
    const used = new Set();
    for (const slot of SLOTS) {
      const best = players
        .filter((p) => p.position === slot.key && !used.has(p.id))
        .sort((a, b) => b.overall - a.overall)[0];
      if (best) { next[slot.key] = best.id; used.add(best.id); }
    }
    // Fill any remaining empty slots with best remaining overall
    for (const slot of SLOTS) {
      if (next[slot.key]) continue;
      const best = players
        .filter((p) => !used.has(p.id))
        .sort((a, b) => b.overall - a.overall)[0];
      if (best) { next[slot.key] = best.id; used.add(best.id); }
    }
    setLineup(next);
  };

  return (
    <Card>
      <CardHeader
        title="Starting Lineup"
        subtitle={`${filledCount}/5 positions filled${savedAt ? ` · saved ${savedAt}` : ''}`}
        action={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleAutoFill}>Auto-fill</Button>
            <Button variant="secondary" size="sm" onClick={handleReset} disabled={!dirty}>Reset</Button>
            <Button size="sm" onClick={handleSave} disabled={!dirty || filledCount < 5}>
              Save Lineup
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-6">
        {/* Court visual */}
        <div className="rounded-2xl overflow-hidden bg-navy-900/95 ring-1 ring-line">
          <svg viewBox={`0 0 ${COURT.width} ${COURT.height}`} className="w-full h-auto block">
            <CourtBackground />
            {SLOTS.map((slot) => {
              const id = lineup[slot.key];
              const p = id ? playerById(id) : null;
              return (
                <g
                  key={slot.key}
                  transform={`translate(${slot.x}, ${slot.y})`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPicker(slot.key)}
                >
                  {/* Slot shadow */}
                  <ellipse cx="0" cy="42" rx="42" ry="8" fill="rgba(0,0,0,0.18)" />
                  {p ? (
                    <>
                      <circle r="42" fill="#EE3C3B" stroke="#FFFFFF" strokeWidth="4" />
                      <text textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="28" fontWeight="800" fontFamily="Inter, sans-serif">
                        {p.jersey}
                      </text>
                      <g transform="translate(0, 64)">
                        <rect x="-50" y="-12" width="100" height="26" rx="13" fill="#FFFFFF" stroke="#E2E1E1" />
                        <text textAnchor="middle" dominantBaseline="central" fill="#242424" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">
                          {slot.label} · {p.name.split(' ')[0]}
                        </text>
                      </g>
                    </>
                  ) : (
                    <>
                      <circle r="42" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeDasharray="8 6" opacity="0.85" />
                      <text textAnchor="middle" dominantBaseline="central" fill="#FFFFFF" fontSize="24" fontWeight="800" fontFamily="Inter, sans-serif" opacity="0.9">
                        {slot.label}
                      </text>
                      <text x="0" y="76" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="600" opacity="0.7">Tap to add</text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Slot list */}
        <ul className="space-y-2">
          {SLOTS.map((slot) => {
            const id = lineup[slot.key];
            const p = id ? playerById(id) : null;
            return (
              <li key={slot.key}>
                <button
                  onClick={() => setPicker(slot.key)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-2xl border text-left transition-colors',
                    p ? 'border-line bg-white hover:bg-surface-soft' : 'border-dashed border-brand-300 bg-brand-50/40 hover:bg-brand-50'
                  )}
                >
                  <div className="h-10 w-10 rounded-xl grid place-items-center font-bold text-sm bg-navy-700 text-white shrink-0">
                    {slot.label}
                  </div>
                  {p ? (
                    <>
                      <Avatar name={p.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-ink text-sm truncate">{p.name}</div>
                        <div className="text-xs text-ink-muted">
                          #{p.jersey} · {p.position} · {p.height} cm
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-ink-muted">OVR</div>
                        <div className="text-lg font-extrabold text-brand-600 leading-none">{p.overall}</div>
                      </div>
                      {p.position !== slot.key && (
                        <Badge tone="rotation">Off-position</Badge>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-brand-700 text-sm">Empty slot</div>
                        <div className="text-xs text-ink-muted">Tap to assign a {slot.label}</div>
                      </div>
                      <Icon.Plus size={18} className="text-brand-600" />
                    </>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Picker modal */}
      <PlayerPickerModal
        open={Boolean(picker)}
        onClose={() => setPicker(null)}
        players={players}
        excludedIds={Object.values(lineup).filter((id) => id && id !== lineup[picker])}
        preferredPosition={picker}
        slotLabel={picker}
        onSelect={(playerId) => handlePick(picker, playerId)}
        onClear={lineup[picker] ? () => handleClear(picker) : undefined}
      />
    </Card>
  );
}
