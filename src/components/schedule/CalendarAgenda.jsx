import { Badge } from '../ui/Badge.jsx';
import { fromISODate, formatDateLong, isSameDay } from '../../lib/calendar.js';
import { TYPE_BADGE } from './calendar-shared.js';

/**
 * Agenda: chronological list of upcoming events grouped by day.
 * Shows next 60 days from `cursor` (today by default).
 */
export function CalendarAgenda({ events, cursor, onEventClick }) {
  const today = new Date(cursor);
  today.setHours(0, 0, 0, 0);
  const horizon = new Date(today);
  horizon.setDate(horizon.getDate() + 60);

  const upcoming = events
    .filter((e) => {
      const d = fromISODate(e.date);
      return d >= today && d <= horizon;
    })
    .sort((a, b) =>
      a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
    );

  // Group by date
  const groups = upcoming.reduce((acc, e) => {
    (acc[e.date] ||= []).push(e);
    return acc;
  }, {});

  if (upcoming.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-10 text-center text-ink-muted">
        No events in the next 60 days. Use Add Event to schedule something.
      </div>
    );
  }

  return (
    <ul className="space-y-4">
      {Object.entries(groups).map(([iso, items]) => {
        const d = fromISODate(iso);
        const isToday = isSameDay(d, new Date());
        return (
          <li key={iso} className="rounded-2xl border border-line bg-white overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-line bg-surface-alt">
              <div className="flex items-center gap-3">
                <div className={`grid place-items-center h-12 w-12 rounded-xl ${isToday ? 'bg-brand-500 text-white' : 'bg-white text-ink border border-line'}`}>
                  <div className="text-[10px] font-bold uppercase leading-none">
                    {d.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-lg font-extrabold leading-none mt-0.5">{d.getDate()}</div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-ink">{formatDateLong(d)}</div>
                  <div className="text-xs text-ink-muted">{items.length} event{items.length === 1 ? '' : 's'}</div>
                </div>
              </div>
              {isToday && <Badge tone="brand">Today</Badge>}
            </div>
            <ul className="divide-y divide-line">
              {items.map((e) => {
                const badge = TYPE_BADGE[e.type] || TYPE_BADGE.training;
                return (
                  <li key={e.id}>
                    <button
                      onClick={() => onEventClick?.(e)}
                      className="w-full flex items-center gap-4 px-4 py-3 text-left hover:bg-surface-soft transition-colors"
                    >
                      <div className="text-sm font-bold text-ink-muted w-14 shrink-0 tabular-nums">{e.time}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-ink truncate">{e.title}</div>
                      </div>
                      <Badge tone={badge.tone}>{badge.label}</Badge>
                    </button>
                  </li>
                );
              })}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
