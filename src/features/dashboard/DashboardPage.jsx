import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { MiniPlayPreview } from '../../components/board/MiniPlayPreview.jsx';
import { usePlayStore } from '../../stores/play.store.js';
import { usePlayerStore } from '../../stores/player.store.js';
import { notifications, team } from '../../data/team.js';
import { toast } from '../../stores/toast.store.js';

const Stat = ({ label, value, hint, accent }) => (
  <Card>
    <div className="flex items-start justify-between">
      <div>
        <div className="text-xs uppercase font-semibold tracking-wider text-ink-muted">{label}</div>
        <div className="text-3xl font-extrabold text-ink mt-1">{value}</div>
      </div>
      <div className={`h-10 w-10 rounded-xl grid place-items-center ${accent}`}>
        <Icon.Analytics size={20} />
      </div>
    </div>
    {hint && <div className="text-xs text-ink-muted mt-2">{hint}</div>}
  </Card>
);

export function DashboardPage() {
  const navigate = useNavigate();
  const plays = usePlayStore((s) => s.plays);
  const setActivePlay = usePlayStore((s) => s.setActivePlay);
  const players = usePlayerStore((s) => s.players);

  const openPlay = (id) => { setActivePlay(id); navigate('/board'); };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Dashboard</h1>
        <p className="text-sm text-ink-muted mt-1">Overview of {team.name} · Season {team.season}.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Plays" value={plays.length}      hint="2 added this week" accent="bg-brand-50 text-brand-600" />
        <Stat label="Players" value={players.length}  hint={`${players.filter(p => p.status === 'starter').length} starters`} accent="bg-navy-50 text-navy-700" />
        <Stat label="Training" value="3"              hint="this week" accent="bg-status-rotationBg text-status-rotationText" />
        <Stat label="Avg OVR" value={Math.round(players.reduce((a, p) => a + p.overall, 0) / players.length)}
              hint="across roster" accent="bg-status-starterBg text-status-starterText" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button onClick={() => navigate('/board')}     className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white p-4 text-left shadow-card hover:shadow-pop transition-shadow">
          <Icon.Board size={22} />
          <div className="mt-2 font-bold">Design a play</div>
          <div className="text-xs text-white/80">Open the Court Board</div>
        </button>
        <button onClick={() => navigate('/lineup')}    className="rounded-2xl bg-white border border-line p-4 text-left shadow-card hover:shadow-pop transition-shadow">
          <Icon.Lineup size={22} className="text-brand-600" />
          <div className="mt-2 font-bold text-ink">Adjust lineup</div>
          <div className="text-xs text-ink-muted">Pick the starting five</div>
        </button>
        <button onClick={() => navigate('/analytics')} className="rounded-2xl bg-white border border-line p-4 text-left shadow-card hover:shadow-pop transition-shadow">
          <Icon.Analytics size={22} className="text-brand-600" />
          <div className="mt-2 font-bold text-ink">Tactic insights</div>
          <div className="text-xs text-ink-muted">Per-play analytics</div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink text-lg">Recent Plays</h3>
            <button
              onClick={() => navigate('/plays')}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              See all →
            </button>
          </div>
          <ul className="divide-y divide-line">
            {plays.slice(0, 5).map((p) => (
              <li
                key={p.id}
                onClick={() => openPlay(p.id)}
                className="py-3 flex items-center gap-3 cursor-pointer hover:bg-surface-soft -mx-2 px-2 rounded-lg"
              >
                <div className="h-11 w-11 rounded-lg bg-surface-soft grid place-items-center">
                  <MiniPlayPreview scene={p.scene} size={36} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink text-sm truncate">{p.title}</div>
                  <div className="text-xs text-ink-muted">{p.category}</div>
                </div>
                <Badge tone="brand">{p.tags[0]}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-ink text-lg">Notifications</h3>
            <button
              onClick={() => toast.success('Marked all as read')}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Mark all read
            </button>
          </div>
          <ul className="space-y-3">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start gap-3">
                <div className={`mt-1 h-2 w-2 rounded-full ${n.unread ? 'bg-brand-500' : 'bg-line'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink">{n.title}</div>
                  <div className="text-xs text-ink-muted">{n.body}</div>
                </div>
                <div className="text-[11px] text-ink-subtle">{n.time}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
