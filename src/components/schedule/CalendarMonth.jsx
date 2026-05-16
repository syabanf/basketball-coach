import { monthGrid, DAY_LABELS_SHORT, isSameDay, isSameMonth, toISODate } from '../../lib/calendar.js';
import { TYPE_BADGE, eventsForDate } from './calendar-shared.js';
import { cn } from '../../lib/cn.js';

const MAX_VISIBLE = 3;

export function CalendarMonth({ events, cursor, onCellClick, onEventClick }) {
  const cells = monthGrid(cursor);
  const today = new Date();

  return (
    <div className="rounded-2xl overflow-hidden border border-line">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 bg-surface-alt">
        {DAY_LABELS_SHORT.map((d) => (
          <div key={d} className="px-3 py-2 text-[11px] uppercase tracking-wider font-bold text-ink-muted text-center border-r border-line last:border-r-0">
            {d}
          </div>
        ))}
      </div>

      {/* 6-week grid */}
      <div className="grid grid-cols-7 grid-rows-6 bg-white">
        {cells.map((d, i) => {
          const iso = toISODate(d);
          const dayEvents = eventsForDate(events, iso);
          const inMonth = isSameMonth(d, cursor);
          const isToday = isSameDay(d, today);
          const visible = dayEvents.slice(0, MAX_VISIBLE);
          const overflow = dayEvents.length - visible.length;

          return (
            <button
              key={iso}
              onClick={() => onCellClick?.(iso)}
              className={cn(
                'group relative min-h-[110px] sm:min-h-[120px] border-r border-b border-line p-1.5 sm:p-2 text-left transition-colors',
                inMonth ? 'bg-white hover:bg-brand-50/40' : 'bg-surface-alt/60 hover:bg-surface-alt',
                i % 7 === 6 && 'border-r-0',
                i >= 35 && 'border-b-0'
              )}
            >
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    'inline-grid place-items-center h-6 min-w-6 px-1 rounded-md text-xs font-bold tabular-nums',
                    isToday ? 'bg-brand-500 text-white'
                    : inMonth ? 'text-ink' : 'text-ink-subtle'
                  )}
                >
                  {d.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] text-ink-muted font-medium">{dayEvents.length}</span>
                )}
              </div>

              <ul className="mt-1 space-y-0.5">
                {visible.map((e) => {
                  const badge = TYPE_BADGE[e.type] || TYPE_BADGE.training;
                  return (
                    <li key={e.id}>
                      <span
                        onClick={(ev) => { ev.stopPropagation(); onEventClick?.(e); }}
                        className="flex items-center gap-1 px-1 py-0.5 rounded text-[10px] sm:text-[11px] font-medium text-ink hover:bg-brand-50 cursor-pointer"
                      >
                        <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', badge.dot)} />
                        <span className="truncate flex-1">{e.title}</span>
                      </span>
                    </li>
                  );
                })}
                {overflow > 0 && (
                  <li className="text-[10px] text-ink-muted font-semibold pl-1">+{overflow} more</li>
                )}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
