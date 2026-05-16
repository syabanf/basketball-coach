import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { KPI, Pill } from '../../components/ui/InsightWidgets.jsx';
import { StartingLineup } from '../../components/team/StartingLineup.jsx';
import { team } from '../../data/team.js';
import { usePlayerStore } from '../../stores/player.store.js';
import { lineupSynergy, teamAverages, avg, POSITIONS } from '../../lib/team-insights.js';
import { attributeKeys } from '../../data/players.js';
import { cn } from '../../lib/cn.js';

function buildLineupMap(players) {
  const out = { PG: null, SG: null, SF: null, PF: null, C: null };
  const starters = players.filter((p) => p.status === 'starter');
  for (const p of starters) {
    if (out[p.position] == null) out[p.position] = p.id;
    else {
      const empty = Object.keys(out).find((k) => out[k] == null);
      if (empty) out[empty] = p.id;
    }
  }
  return out;
}

export function LineupPage() {
  const navigate = useNavigate();
  const players = usePlayerStore((s) => s.players);
  const setStartingLineup = usePlayerStore((s) => s.setStartingLineup);
  const starters = players.filter((p) => p.status === 'starter');

  // Current persisted lineup (read-only here — the editor maintains its own
  // draft state internally and emits onSave).
  const persistedLineup = useMemo(() => buildLineupMap(players), [players]);
  const synergy = useMemo(() => lineupSynergy(persistedLineup, players), [persistedLineup, players]);

  // Lineup-vs-team comparison
  const teamAvgs = useMemo(() => teamAverages(players), [players]);
  const teamAvgMap = useMemo(
    () => Object.fromEntries(teamAvgs.map((a) => [a.key, a.value])),
    [teamAvgs]
  );
  const lineupAttrAvgs = useMemo(() => {
    if (!starters.length) return {};
    return Object.fromEntries(
      attributeKeys.map((a) => [
        a.key,
        Math.round(starters.reduce((s, p) => s + (p.attributes?.[a.key] || 0), 0) / starters.length)
      ])
    );
  }, [starters]);

  const avgOvr   = avg(starters, (p) => p.overall);
  const avgHt    = avg(starters, (p) => p.height);
  const avgAge   = avg(starters, (p) => p.age);

  // Position coverage check
  const coverage = POSITIONS.map((pos) => ({
    pos,
    filled: starters.some((p) => p.position === pos),
    id: persistedLineup[pos]
  }));
  const coveredCount = coverage.filter((c) => c.filled).length;

  const synergyTone =
    synergy.score >= 85 ? 'success'
    : synergy.score >= 70 ? 'brand'
    : synergy.score >= 55 ? 'warning'
    : 'danger';

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Starting Lineup</h1>
          <p className="text-sm text-ink-muted mt-1">Pick the five for {team.name} · Season {team.season}.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" leftIcon={<Icon.Team size={16} />} onClick={() => navigate('/team')}>
            Roster
          </Button>
          <Button variant="secondary" leftIcon={<Icon.Players size={16} />} onClick={() => navigate('/players')}>
            All Players
          </Button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Positions Set" value={`${starters.length} / 5`} hint={`${coveredCount}/5 positions covered`} tone="brand"   icon={<Icon.Lineup size={18} />} />
        <KPI label="Avg OVR"       value={avgOvr}                   hint="starting five" tone="success"  icon={<Icon.Analytics size={18} />} />
        <KPI label="Avg Height"    value={`${avgHt} cm`}            hint="lineup size" tone="navy"     icon={<Icon.Team size={18} />} />
        <KPI label="Avg Age"       value={`${avgAge} yr`}           hint="years" tone="navy"     icon={<Icon.Schedule size={18} />} />
      </div>

      {/* Synergy score panel */}
      <Card>
        <CardHeader
          title="Lineup Synergy"
          subtitle="Weighted blend of depth, balance, and positional fit"
        />
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-6 items-center">
          <div className="text-center">
            <SynergyGauge score={synergy.score} tone={synergyTone} />
            <Pill tone={synergyTone} className="mt-2">
              {synergy.score >= 85 ? 'Elite' : synergy.score >= 70 ? 'Strong' : synergy.score >= 55 ? 'Workable' : 'Needs work'}
            </Pill>
          </div>

          <div className="space-y-3">
            <BreakdownBar label="Depth"   value={synergy.breakdown.depth}   hint="Avg OVR of the 5" />
            <BreakdownBar label="Balance" value={synergy.breakdown.balance} hint="Low variance across attributes" />
            <BreakdownBar label="Position Fit" value={synergy.breakdown.fit} hint="Players in their natural slot" />
            {synergy.fitWarnings.length > 0 && (
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 mt-1">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-1.5">Position mismatch</div>
                <ul className="space-y-1 text-sm">
                  {synergy.fitWarnings.map((w) => (
                    <li key={w.slot} className="flex items-center gap-2">
                      <Badge tone="rotation">{w.player.position} → {w.slot}</Badge>
                      <span className="text-ink-muted">{w.player.name} is a natural {w.player.position}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Position coverage */}
      <Card>
        <CardHeader
          title="Position Coverage"
          subtitle={`${coveredCount} of ${POSITIONS.length} natural positions filled`}
        />
        <ul className="grid grid-cols-5 gap-2">
          {coverage.map((c) => {
            const p = c.id ? players.find((x) => x.id === c.id) : null;
            return (
              <li
                key={c.pos}
                className={cn(
                  'rounded-2xl border p-3 text-center transition-colors',
                  c.filled ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50/60'
                )}
              >
                <div className={cn(
                  'mx-auto h-10 w-10 rounded-xl grid place-items-center font-extrabold text-white text-base',
                  c.filled ? 'bg-emerald-600' : 'bg-amber-500'
                )}>
                  {c.pos}
                </div>
                {p ? (
                  <>
                    <div className="text-xs font-semibold text-ink mt-2 truncate">{p.name}</div>
                    <div className="text-[10px] text-ink-muted">OVR {p.overall}</div>
                  </>
                ) : (
                  <div className="text-xs text-ink-muted mt-2">Open</div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Main editor */}
      <StartingLineup players={players} onSave={setStartingLineup} />

      {/* Lineup vs team avg comparison */}
      <Card>
        <CardHeader
          title="Lineup vs Roster Average"
          subtitle="How the starting five stacks up against the team baseline"
        />
        {starters.length === 0 ? (
          <div className="text-sm text-ink-muted py-4">Pick a lineup above to compare attributes.</div>
        ) : (
          <ul className="space-y-2.5">
            {attributeKeys.map((a) => {
              const lineupVal = lineupAttrAvgs[a.key] || 0;
              const teamVal = teamAvgMap[a.key] || 0;
              const diff = lineupVal - teamVal;
              return (
                <li key={a.key} className="flex items-center gap-3">
                  <span className="text-sm text-ink-muted w-28 shrink-0">{a.label}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-surface-soft relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 rounded-full bg-navy-200" style={{ width: `${teamVal}%` }} />
                    <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${lineupVal}%` }} />
                  </div>
                  <span className="w-10 text-right text-sm font-bold text-ink tabular-nums">{lineupVal}</span>
                  <span className={cn('w-12 text-right text-xs font-bold tabular-nums', diff >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                    {diff >= 0 ? '+' : ''}{diff}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-4 flex items-center gap-4 text-xs text-ink-muted">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-3 rounded-sm bg-gradient-to-r from-brand-400 to-brand-600" /> Lineup avg</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-3 rounded-sm bg-navy-200" /> Team avg</span>
        </div>
      </Card>
    </div>
  );
}

function BreakdownBar({ label, value, hint }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <div>
          <span className="text-sm font-semibold text-ink">{label}</span>
          {hint && <span className="text-xs text-ink-muted ml-2">{hint}</span>}
        </div>
        <span className="text-sm font-bold text-ink tabular-nums">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-surface-soft overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function SynergyGauge({ score, tone }) {
  const colorMap = {
    success: '#16A34A',
    brand:   '#EE3C3B',
    warning: '#D97706',
    danger:  '#DC2626'
  };
  const color = colorMap[tone] || colorMap.brand;
  const r = 60;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="relative inline-grid place-items-center">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} stroke="#F4F4F4" strokeWidth="14" fill="none" />
        <circle
          cx="80" cy="80" r={r}
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 80 80)"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 350ms ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="text-4xl font-extrabold text-ink leading-none tabular-nums">{score}</div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-ink-muted mt-1">Synergy</div>
        </div>
      </div>
    </div>
  );
}
