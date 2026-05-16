import { NavLink, useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Popover, MenuItem } from '../ui/Popover.jsx';
import { organization, team } from '../../data/team.js';
import { toast } from '../../stores/toast.store.js';
import { useAuthStore } from '../../stores/auth.store.js';
import { cn } from '../../lib/cn.js';

const NAV = [
  { to: '/board',     label: 'Board',     icon: Icon.Board },
  { to: '/plays',     label: 'Plays',     icon: Icon.Plays },
  { to: '/players',   label: 'Players',   icon: Icon.Players },
  { to: '/team',      label: 'Team',      icon: Icon.Team },
  { to: '/lineup',    label: 'Lineup',    icon: Icon.Lineup },
  { to: '/analytics', label: 'Analytics', icon: Icon.Analytics },
  { to: '/schedule',  label: 'Schedule',  icon: Icon.Schedule },
  { to: '/library',   label: 'Library',   icon: Icon.Library },
  { to: '/settings',  label: 'Settings',  icon: Icon.Settings }
];

export function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    const name = user?.name?.split(' ')[0] || 'Coach';
    logout();
    toast.show(`Signed out — see you next time, ${name}.`);
    navigate('/login', { replace: true });
  };

  return (
    <aside className="hidden lg:flex flex-col w-[260px] shrink-0 bg-navy-900 text-white sticky top-0 h-screen">
      <div className="px-5 pt-6 pb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 grid place-items-center shadow-card">
            <Icon.Flask size={22} />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-lg tracking-tight">{organization.name}</div>
            <div className="text-[11px] text-navy-200 uppercase tracking-wider">{organization.tagline}</div>
          </div>
        </div>
      </div>

      <nav className="px-3 flex-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: I }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl my-0.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-white text-brand-600 shadow-card'
                  : 'text-navy-100 hover:bg-white/5 hover:text-white'
              )
            }
          >
            <I size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 space-y-2 border-t border-white/10">
        <Popover
          align="start"
          className="!mt-0 !mb-2 bottom-full"
          content={(close) => (
            <div>
              <MenuItem
                onClick={() => { toast.info(`Switched to ${team.name}`); close(); }}
              >
                {team.name}
              </MenuItem>
              <MenuItem
                onClick={() => { toast.info('Create team — coming soon'); close(); }}
              >
                + Create team
              </MenuItem>
            </div>
          )}
        >
          <button className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
            <div className="h-8 w-8 rounded-lg bg-brand-500 grid place-items-center font-bold text-sm">4L</div>
            <div className="flex-1 leading-tight">
              <div className="text-xs text-navy-200">Team</div>
              <div className="text-sm font-semibold">{team.name}</div>
            </div>
            <Icon.ChevronDown size={16} className="text-navy-200" />
          </button>
        </Popover>
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5">
          <span className="text-xs text-navy-200">Season</span>
          <Badge tone="brand" className="bg-brand-500/15 text-brand-300">{team.season}</Badge>
        </div>
        <div className="pt-2 grid grid-cols-2 gap-1">
          <button
            onClick={() => toast.info('Help center coming soon')}
            className="flex items-center justify-center gap-2 text-xs text-navy-100 hover:text-white py-2 rounded-lg hover:bg-white/5"
          >
            <Icon.Help size={14} /> Help
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-xs text-navy-100 hover:text-white py-2 rounded-lg hover:bg-white/5"
          >
            <Icon.Logout size={14} /> Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
