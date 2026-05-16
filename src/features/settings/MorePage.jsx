import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { coach, team } from '../../data/team.js';
import { toast } from '../../stores/toast.store.js';

const LINKS = [
  { to: '/dashboard', label: 'Dashboard', icon: Icon.Analytics },
  { to: '/analytics', label: 'Analytics', icon: Icon.Analytics },
  { to: '/schedule',  label: 'Schedule',  icon: Icon.Schedule },
  { to: '/library',   label: 'Library',   icon: Icon.Library },
  { to: '/settings',  label: 'Settings',  icon: Icon.Settings }
];

export function MorePage() {
  return (
    <div className="space-y-5">
      <Card>
        <div className="flex items-center gap-3">
          <Avatar name={coach.name} size="lg" />
          <div className="flex-1">
            <div className="font-bold text-ink">{coach.name}</div>
            <div className="text-sm text-ink-muted">{coach.role} · {team.name}</div>
          </div>
        </div>
      </Card>

      <Card padded={false}>
        <ul className="divide-y divide-line">
          {LINKS.map(({ to, label, icon: I }) => (
            <li key={to}>
              <Link to={to} className="flex items-center gap-3 px-4 py-3 active:bg-surface-soft">
                <span className="h-9 w-9 grid place-items-center rounded-xl bg-brand-50 text-brand-600">
                  <I size={18} />
                </span>
                <span className="flex-1 font-semibold text-ink">{label}</span>
                <Icon.ChevronDown size={16} className="-rotate-90 text-ink-subtle" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Card padded={false}>
        <ul className="divide-y divide-line">
          <li>
            <button
              onClick={() => toast.info('Help center coming soon')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left active:bg-surface-soft"
            >
              <span className="h-9 w-9 grid place-items-center rounded-xl bg-surface-soft text-ink-muted">
                <Icon.Help size={18} />
              </span>
              <span className="flex-1 font-semibold text-ink">Help Center</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => toast.show('Logged out')}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 active:bg-surface-soft"
            >
              <span className="h-9 w-9 grid place-items-center rounded-xl bg-red-50">
                <Icon.Logout size={18} />
              </span>
              <span className="flex-1 font-semibold">Logout</span>
            </button>
          </li>
        </ul>
      </Card>
    </div>
  );
}
