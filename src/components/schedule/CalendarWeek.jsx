import { Badge } from '../ui/Badge.jsx';
import { weekGrid, DAY_LABELS_SHORT, isSameDay, toISODate } from '../../lib/calendar.js';
import { TYPE_BADGE, eventsForDate } from './calendar-shared.js';

export function CalendarWeek({ events, cursor, onCellClick, onEventClick }) {
  const week = weekGrid(cursor);
  const today = new Date();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {week.map((d, i) => {
        const iso = toISODate(d);
        const dayEvents = eventsForDate(events, iso);
        const isToday = isSameDay(d, today);
        return (
          <div key={iso} className="rounded-2xl border border-line bg-white p-3 min-h-[160px] flex flex-col">
            <div className="flex items-baseline justify-between">
              <div className="text-xs uppercase font-semibold tracking-wider text-ink-muted">{DAY_LABELS_SHORT[i]}</div>
              <div className={`text-lg font-extrabold ${isToday ? 'text-brand-600' : 'text-ink'}`}>{d.getDate()}</div>
            </div>
            <ul className="mt-2 space-y-1.5 flex-1">
              {dayEvents.length === 0 && (
                <li>
                  <button
                    onClick={() => onCellClick?.(iso)}
                    className="w-full h-full min-h-[60px] rounded-lg border border-dashed border-line text-ink-subtle text-xs hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/40 transition-colors"
                  >
                    + Add
                  </button>
                </li>
              )}
              {dayEvents.map((e) => {
                const badge = TYPE_BADGE[e.type] || TYPE_BADGE.training;
                return (
                  <li key={e.id}>
                    <button
                      onClick={() => onEventClick?.(e)}
                      className="w-full text-left rounded-lg bg-surface-alt hover:bg-brand-50/50 p-2 transition-colors"
                    >
                      <div className="text-xs font-semibold text-ink leading-tight">{e.title}</div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] text-ink-muted">{e.time}</span>
                        <Badge tone={badge.tone}>{badge.label}</Badge>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
