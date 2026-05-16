import { NavLink } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import { cn } from '../../lib/cn.js';

const TABS = [
  { to: '/board',   label: 'Board',   icon: Icon.Board },
  { to: '/plays',   label: 'Plays',   icon: Icon.Plays },
  { to: '/players', label: 'Players', icon: Icon.Players },
  { to: '/team',    label: 'Team',    icon: Icon.Team },
  { to: '/more',    label: 'More',    icon: Icon.More }
];

export function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-line safe-pb">
      <ul className="grid grid-cols-5">
        {TABS.map(({ to, label, icon: I }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                  isActive ? 'text-brand-600' : 'text-ink-muted'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn(
                    'h-9 w-12 grid place-items-center rounded-xl',
                    isActive && 'bg-brand-50'
                  )}>
                    <I size={20} />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
