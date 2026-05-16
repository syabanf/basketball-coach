import { useNavigate } from 'react-router-dom';
import { Input } from '../ui/Input.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { Icon } from '../ui/Icon.jsx';
import { Popover, MenuItem, MenuDivider } from '../ui/Popover.jsx';
import { coach, organization, notifications } from '../../data/team.js';
import { toast } from '../../stores/toast.store.js';
import { useAuthStore } from '../../stores/auth.store.js';
import { cn } from '../../lib/cn.js';

function NotificationsPanel({ close }) {
  return (
    <div className="w-[320px]">
      <div className="px-4 pt-3 pb-2 flex items-center justify-between">
        <div className="font-semibold text-ink">Notifications</div>
        <button
          onClick={() => { toast.success('Marked all as read'); close(); }}
          className="text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          Mark all read
        </button>
      </div>
      <ul className="max-h-[360px] overflow-y-auto">
        {notifications.map((n) => (
          <li
            key={n.id}
            className="px-4 py-3 hover:bg-surface-soft cursor-pointer flex items-start gap-3 border-t border-line"
          >
            <div className={cn('mt-1 h-2 w-2 rounded-full shrink-0', n.unread ? 'bg-brand-500' : 'bg-line')} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-ink">{n.title}</div>
              <div className="text-xs text-ink-muted">{n.body}</div>
            </div>
            <div className="text-[11px] text-ink-subtle whitespace-nowrap">{n.time}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProfileMenu({ close }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user) || coach;
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    close();
    toast.show(`Signed out — see you next time, ${user.name.split(' ')[0]}.`);
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div className="px-3 py-3 flex items-center gap-3 border-b border-line">
        <Avatar name={user.name} ring />
        <div className="leading-tight min-w-0">
          <div className="font-semibold text-ink text-sm truncate">{user.name}</div>
          <div className="text-xs text-ink-muted truncate">{user.email || user.role}</div>
        </div>
      </div>
      <MenuItem icon={Icon.Settings} onClick={() => { navigate('/settings'); close(); }}>
        Settings
      </MenuItem>
      <MenuItem icon={Icon.Help} onClick={() => { toast.info('Help center coming soon'); close(); }}>
        Help Center
      </MenuItem>
      <MenuDivider />
      <MenuItem icon={Icon.Logout} danger onClick={handleLogout}>
        Sign out
      </MenuItem>
    </>
  );
}

export function Header() {
  const user = useAuthStore((s) => s.user) || coach;
  return (
    <header className="hidden lg:flex sticky top-0 z-30 items-center h-16 bg-white border-b border-line px-6">
      <div className="flex-1 max-w-[480px]">
        <Input
          placeholder="Search plays, players, or teams…"
          leftIcon={<Icon.Search size={16} />}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
              toast.info(`Searching for "${e.currentTarget.value.trim()}"`);
            }
          }}
        />
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-1">
        <Popover content={(close) => <NotificationsPanel close={close} />}>
          <button
            aria-label="Notifications"
            className="relative h-10 w-10 grid place-items-center rounded-xl hover:bg-surface-soft text-ink-muted transition-colors"
          >
            <Icon.Bell size={20} />
            <span className="absolute top-1 right-1 h-[18px] min-w-[18px] px-1 grid place-items-center bg-brand-500 text-white text-[10px] font-bold rounded-full ring-2 ring-white">
              3
            </span>
          </button>
        </Popover>

        <span aria-hidden="true" className="h-7 w-px bg-line mx-2" />

        <Popover content={(close) => <ProfileMenu close={close} />}>
          <button className="flex items-center gap-2.5 pl-1.5 pr-2.5 h-11 rounded-xl hover:bg-surface-soft transition-colors">
            <Avatar name={user.name} size="sm" ring />
            <div className="leading-tight text-left">
              <div className="text-sm font-semibold text-ink">{user.name}</div>
              <div className="text-[11px] text-ink-muted">{user.role}</div>
            </div>
            <Icon.ChevronDown size={14} className="text-ink-muted ml-0.5" />
          </button>
        </Popover>
      </div>
    </header>
  );
}

export function MobileHeader() {
  const user = useAuthStore((s) => s.user) || coach;
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-gradient-to-br from-brand-500 to-brand-600 text-white px-4 pt-3 safe-pt pb-4 shadow-card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 grid place-items-center rounded-xl bg-white/15 backdrop-blur">
            <Icon.Flask size={22} />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-lg tracking-tight">{organization.name}</div>
            <div className="text-[11px] text-white/85 uppercase tracking-wider">{organization.tagline}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Popover content={(close) => <NotificationsPanel close={close} />}>
            <button className="relative h-10 w-10 grid place-items-center rounded-xl bg-white/10 hover:bg-white/20">
              <Icon.Bell size={20} />
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 grid place-items-center bg-white text-brand-600 text-[10px] font-bold rounded-full">3</span>
            </button>
          </Popover>
          <Popover content={(close) => <ProfileMenu close={close} />}>
            <button className="rounded-full">
              <Avatar name={user.name} size="md" ring />
            </button>
          </Popover>
        </div>
      </div>
    </header>
  );
}
