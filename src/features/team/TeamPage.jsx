import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { Badge, StatusBadge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Popover, MenuItem, MenuDivider } from '../../components/ui/Popover.jsx';
import { staff, team } from '../../data/team.js';
import { usePlayerStore } from '../../stores/player.store.js';
import { toast } from '../../stores/toast.store.js';

export function TeamPage() {
  const navigate = useNavigate();
  const players = usePlayerStore((s) => s.players);
  const starters = players.filter((p) => p.status === 'starter');
  const bench = players.filter((p) => p.status !== 'starter');

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">{team.name}</h1>
          <p className="text-sm text-ink-muted mt-1">Season {team.season} · {team.city}</p>
        </div>
        <Button
          leftIcon={<Icon.Settings size={16} />}
          variant="secondary"
          onClick={() => navigate('/settings')}
        >
          Team Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <Card>
          <CardHeader title="Roster" subtitle={`${players.length} players`} action={<Badge tone="brand">{starters.length} Starters</Badge>} />
          <div>
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">Starting Five</div>
            <ul className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-5">
              {starters.slice(0, 5).map((p) => (
                <li key={p.id} className="text-center p-3 rounded-2xl border border-line bg-surface-alt">
                  <Avatar name={p.name} size="lg" className="mx-auto" />
                  <div className="mt-2 text-sm font-semibold text-ink truncate">{p.name}</div>
                  <div className="text-xs text-brand-600 font-medium">{p.position}</div>
                  <div className="text-xs text-ink-muted mt-1">OVR {p.overall}</div>
                </li>
              ))}
            </ul>
            <div className="text-xs uppercase tracking-wider text-ink-muted font-semibold mb-2">Bench / Rotation</div>
            <ul className="divide-y divide-line">
              {bench.map((p) => (
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
          </div>
        </Card>

        <Card>
          <CardHeader title="Coaching Staff" />
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
                    <MenuItem icon={Icon.Players} onClick={() => { toast.info(`Viewing ${s.name}`); close(); }}>View profile</MenuItem>
                    <MenuItem icon={Icon.Pencil}  onClick={() => { toast.info('Edit staff — coming soon'); close(); }}>Edit role</MenuItem>
                    <MenuDivider />
                    <MenuItem icon={Icon.Trash} danger onClick={() => { toast.show(`Removed ${s.name}`); close(); }}>Remove</MenuItem>
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
