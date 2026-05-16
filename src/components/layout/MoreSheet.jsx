import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { toast } from '../../stores/toast.store.js';
import { useAuthStore } from '../../stores/auth.store.js';
import { coach } from '../../data/team.js';
import { cn } from '../../lib/cn.js';

const ITEMS = [
  { to: '/lineup',    label: 'Lineup',    icon: Icon.Lineup,    tone: 'brand' },
  { to: '/analytics', label: 'Analytics', icon: Icon.Analytics, tone: 'navy'  },
  { to: '/schedule',  label: 'Schedule',  icon: Icon.Schedule,  tone: 'brand' },
  { to: '/library',   label: 'Library',   icon: Icon.Library,   tone: 'navy'  },
  { to: '/settings',  label: 'Settings',  icon: Icon.Settings,  tone: 'brand' },
  { to: 'help',       label: 'Help',      icon: Icon.Help,      tone: 'navy'  }
];

const TONES = {
  brand: 'bg-brand-50 text-brand-600',
  navy:  'bg-navy-50 text-navy-700'
};

/**
 * MoreSheet — mobile bottom-sheet menu triggered from the More tab.
 * Slides up from below, dims the page, and shows a 3×2 grid of additional
 * pages. Closes on backdrop tap, ESC, or item selection.
 */
export function MoreSheet({ open, onClose }) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user) || coach;
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleNav = (item) => {
    onClose?.();
    if (item.to === 'help') {
      toast.info('Help center coming soon');
      return;
    }
    navigate(item.to);
  };

  const handleLogout = () => {
    onClose?.();
    const name = user?.name?.split(' ')[0] || 'Coach';
    logout();
    toast.show(`Signed out — see you next time, ${name}.`);
    navigate('/login', { replace: true });
  };

  return (
    <div
      className="lg:hidden fixed inset-0 z-[60] flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="More menu"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-navy-900/60 backdrop-blur-[2px] animate-[fade_180ms_ease-out]"
      />

      {/* Sheet */}
      <div
        className="relative bg-navy-900 text-white rounded-t-3xl shadow-pop pb-[calc(env(safe-area-inset-bottom)+5.5rem)] pt-3 animate-[slideUp_240ms_ease-out]"
      >
        {/* Drag handle */}
        <div className="mx-auto mb-3 h-1 w-12 rounded-full bg-white/25" />

        {/* Profile mini-header */}
        <div className="px-5 pb-3 flex items-center gap-3">
          <Avatar name={user.name} size="md" ring />
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate">{user.name}</div>
            <div className="text-xs text-white/70 truncate">{user.email || user.role}</div>
          </div>
          <button
            onClick={handleLogout}
            className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <Icon.Logout size={14} /> Sign out
          </button>
        </div>

        {/* Grid */}
        <div className="px-4 py-3 grid grid-cols-3 gap-3">
          {ITEMS.map((item) => {
            const I = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item)}
                className="group flex flex-col items-center gap-2 px-2 py-4 rounded-2xl bg-white/5 hover:bg-white/10 active:bg-white/15 transition-colors"
              >
                <span className={cn('h-11 w-11 grid place-items-center rounded-2xl', TONES[item.tone])}>
                  <I size={20} />
                </span>
                <span className="text-xs font-semibold text-white">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fade   { from { opacity: 0; }                 to { opacity: 1; } }
      `}</style>
    </div>
  );
}
