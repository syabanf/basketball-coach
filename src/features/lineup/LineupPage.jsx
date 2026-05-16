import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { StartingLineup } from '../../components/team/StartingLineup.jsx';
import { team } from '../../data/team.js';
import { usePlayerStore } from '../../stores/player.store.js';

const Stat = ({ label, value, hint }) => (
  <div className="bg-surface-alt rounded-2xl p-4 border border-line">
    <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold">{label}</div>
    <div className="mt-1 text-2xl font-extrabold text-ink">{value}</div>
    {hint && <div className="text-xs text-ink-muted mt-0.5">{hint}</div>}
  </div>
);

export function LineupPage() {
  const navigate = useNavigate();
  const players = usePlayerStore((s) => s.players);
  const setStartingLineup = usePlayerStore((s) => s.setStartingLineup);
  const starters = players.filter((p) => p.status === 'starter');

  const avg = (arr, key) => arr.length ? Math.round(arr.reduce((a, p) => a + (p[key] || 0), 0) / arr.length) : 0;
  const avgOvr   = avg(starters, 'overall');
  const avgHeight = avg(starters, 'height');
  const avgAge    = avg(starters, 'age');

  // sum a sub-attribute across starters for "lineup strengths"
  const sumAttr = (key) =>
    starters.reduce((a, p) => a + (p.attributes?.[key] || 0), 0);

  const strengths = [
    { key: 'shooting',     label: 'Shooting' },
    { key: 'passing',      label: 'Passing' },
    { key: 'dribbling',    label: 'Dribbling' },
    { key: 'defense',      label: 'Defense' },
    { key: 'athleticism',  label: 'Athleticism' },
    { key: 'basketballIQ', label: 'Basketball IQ' }
  ].map((a) => ({
    ...a,
    value: starters.length ? Math.round(sumAttr(a.key) / starters.length) : 0
  })).sort((a, b) => b.value - a.value);

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
        <Stat label="Filled" value={`${starters.length} / 5`} hint="positions assigned" />
        <Stat label="Avg OVR" value={avgOvr} hint="across starting 5" />
        <Stat label="Avg Height" value={`${avgHeight} cm`} hint="lineup size" />
        <Stat label="Avg Age" value={avgAge} hint="years" />
      </div>

      {/* Main editor */}
      <StartingLineup players={players} onSave={setStartingLineup} />

      {/* Lineup strength bars */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-ink text-lg">Lineup Strengths</h3>
            <p className="text-xs text-ink-muted">Averaged attribute ratings across the starting five.</p>
          </div>
        </div>
        <ul className="space-y-2.5">
          {strengths.map((a) => (
            <li key={a.key} className="flex items-center gap-3">
              <span className="text-sm text-ink-muted w-28 shrink-0">{a.label}</span>
              <div className="flex-1 h-2.5 rounded-full bg-surface-soft overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                  style={{ width: `${a.value}%` }}
                />
              </div>
              <span className="text-sm font-bold text-ink w-10 text-right tabular-nums">{a.value}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
