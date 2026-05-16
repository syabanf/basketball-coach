import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { Badge, StatusBadge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Popover, MenuItem, MenuDivider } from '../../components/ui/Popover.jsx';
import { KPI, DistributionBar } from '../../components/ui/InsightWidgets.jsx';
import { staff, team } from '../../data/team.js';
import { usePlayerStore } from '../../stores/player.store.js';
import {
  positionBreakdown, statusBreakdown, teamAverages, POSITIONS, avg
} from '../../lib/team-insights.js';

export function TeamPage() {
  const navigate = useNavigate();
  const players = usePlayerStore((s) => s.players);
  const starters = players.filter((p) => p.status === 'starter');
  const others = players.filter((p) => p.status !== 'starter');

  // Derived metrics
  const positions = positionBreakdown(players);
  const status = statusBreakdown(players);
  const strengths = teamAverages(players).sort((a, b) => b.value - a.value);
  const avgHeight = avg(players, (p) => p.height);
  const avgAge    = avg(players, (p) => p.age);
  const avgOvr    = avg(players, (p) => p.overall);
  const tallest   = [...players].sort((a, b) => b.height - a.height)[0];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">{team.name}</h1>
          <p className="text-sm text-ink-muted mt-1">Season {team.season} · {team.city}</p>
        </div>
        <Button leftIcon={<Icon.Settings size={16} />} variant="secondary" onClick={() => navigate('/settings')}>
          Team Settings
        </Button>
      </div>

      {/* Roster insights */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Roster Size"  value={players.length} hint={`${status.starter} · ${status.rotation} · ${status.bench}`} tone="navy" icon={<Icon.Players size={18} />} />
        <KPI label="Avg OVR"      value={avgOvr}         hint={`Top strength: ${strengths[0]?.label}`} tone="brand" icon={<Icon.Analytics size={18} />} />
        <KPI label="Avg Height"   value={`${avgHeight} cm`} hint={tallest ? `Tallest: ${tallest.name} (${tallest.height} cm)` : ''} tone="navy" icon={<Icon.Team size={18} />} />
        <KPI label="Avg Age"      value={`${avgAge} yr`}   hint="across roster" tone="navy" icon={<Icon.Schedule size={18} />} />
      </div>

      {/* Composition + strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Roster Composition" subtitle="Positions and rotation status" />
          <div className="space-y-5">
            <DistributionBar
              title="By Position"
              segments={POSITIONS.map((pos) => ({ label: pos, value: positions[pos] }))}
            />
            <DistributionBar
              title="By Rotation Status"
              segments={[
                { label: 'Starter',  value: status.starter,  color: '#15803D' },
                { label: 'Rotation', value: status.rotation, color: '#B45309' },
                { label: 'Bench',    value: status.bench,    color: '#94A3B8' }
              ]}
            />
          </div>
        </Card>

        <Card>
          <CardHeader title="Team Strengths" subtitle="Averaged attributes across the roster" />
          <ul className="space-y-2.5">
            {strengths.map((a) => (
              <li key={a.key} className="flex items-center gap-3">
                <span className="text-sm text-ink-muted w-28 shrink-0">{a.label}</span>
                <div className="flex-1 h-2 rounded-full bg-surface-soft overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${a.value}%` }} />
                </div>
                <span className="w-9 text-right text-sm font-bold text-ink tabular-nums">{a.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
              <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-700">Strongest area</div>
              <div className="font-semibold text-ink mt-0.5">{strengths[0]?.label}</div>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <div className="text-[10px] uppercase tracking-wider font-bold text-amber-700">Develop next</div>
              <div className="font-semibold text-ink mt-0.5">{strengths[strengths.length - 1]?.label}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Starting lineup summary — full editor lives at /lineup */}
      <Card>
        <CardHeader
          title="Starting Five"
          subtitle={`${starters.length}/5 positions filled · Avg OVR ${starters.length ? Math.round(starters.reduce((a, p) => a + p.overall, 0) / starters.length) : 0}`}
          action={
            <Button size="sm" leftIcon={<Icon.Lineup size={14} />} onClick={() => navigate('/lineup')}>
              Edit Lineup
            </Button>
          }
        />
        {starters.length === 0 ? (
          <div className="text-center py-8 text-sm text-ink-muted">
            No starters assigned yet.
            <button onClick={() => navigate('/lineup')} className="ml-1 text-brand-600 font-semibold hover:underline">
              Set the starting five →
            </button>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {starters.slice(0, 5).map((p) => (
              <li key={p.id} className="text-center p-3 rounded-2xl border border-line bg-surface-alt">
                <Avatar name={p.name} size="lg" className="mx-auto" />
                <div className="mt-2 text-sm font-semibold text-ink truncate">{p.name}</div>
                <div className="text-xs text-brand-600 font-medium">{p.position}</div>
                <div className="text-xs text-ink-muted mt-1">OVR {p.overall}</div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <Card>
          <CardHeader title="Roster" subtitle={`${players.length} players`} action={<Badge tone="brand">{starters.length} Starters</Badge>} />
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">Bench / Rotation</div>
            <ul className="divide-y divide-line">
              {others.length === 0 && (
                <li className="py-6 text-center text-sm text-ink-muted">All players are in the starting lineup.</li>
              )}
              {others.map((p) => (
                <li key={p.id} className="py-3 flex items-center gap-3">
                  <Avatar name={p.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">{p.name}</div>
                    <div className="text-xs text-ink-muted">{p.positionLong} · {p.height} cm</div>
                  </div>
                  <span className="text-brand-600 font-bold text-sm">{p.overall}</span>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <Button variant="secondary" onClick={() => navigate('/players')}>
                Manage roster →
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Coaching Staff"
            action={
              <Button size="sm" leftIcon={<Icon.Plus size={14} />} variant="secondary"
                      onClick={() => navigate('/settings')}>
                Add
              </Button>
            }
          />
          <ul className="space-y-3">
            {staff.map((s) => (
              <li key={s.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-soft">
                <Avatar name={s.name} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink text-sm truncate">{s.name}</div>
                  <div className="text-xs text-ink-muted">{s.role}</div>
                </div>
                <Popover content={(close) => (
                  <div>
                    <MenuItem icon={Icon.Players} onClick={close}>View profile</MenuItem>
                    <MenuItem icon={Icon.Pencil}  onClick={close}>Edit role</MenuItem>
                    <MenuDivider />
                    <MenuItem icon={Icon.Trash} danger onClick={close}>Remove</MenuItem>
                  </div>
                )}>
                  <button className="text-ink-muted h-8 w-8 grid place-items-center rounded-lg hover:bg-white">
                    <Icon.More size={16} />
                  </button>
                </Popover>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
