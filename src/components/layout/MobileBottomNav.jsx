import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Icon } from '../ui/Icon.jsx';
import { MoreSheet } from './MoreSheet.jsx';
import { cn } from '../../lib/cn.js';

const TABS = [
  { to: '/board',   label: 'Board',   icon: Icon.Board },
  { to: '/plays',   label: 'Plays',   icon: Icon.Plays },
  { to: '/players', label: 'Players', icon: Icon.Players },
  { to: '/team',    label: 'Team',    icon: Icon.Team }
];

// Pages that "live" under the More menu — used to highlight the More tab
// when the user is on one of them.
const MORE_ROUTES = ['/lineup', '/analytics', '/schedule', '/library', '/settings', '/more'];

export function MobileBottomNav() {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const moreActive = MORE_ROUTES.some((r) => location.pathname.startsWith(r)) || moreOpen;

  return (
    <>
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
          <li>
            <button
              onClick={() => setMoreOpen((v) => !v)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className={cn(
                'w-full flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                moreActive ? 'text-brand-600' : 'text-ink-muted'
              )}
            >
              <span className={cn(
                'h-9 w-12 grid place-items-center rounded-xl transition-colors',
                moreActive && 'bg-brand-50'
              )}>
                <Icon.More size={20} />
              </span>
              <span>More</span>
            </button>
          </li>
        </ul>
      </nav>

      <MoreSheet open={moreOpen} onClose={() => setMoreOpen(false)} />
    </>
  );
}
