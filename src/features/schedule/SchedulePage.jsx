import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { toast } from '../../stores/toast.store.js';

const week = [
  { day: 'Mon', date: '13', items: [{ title: 'Strength & Conditioning', time: '6:00 PM', tone: 'brand' }] },
  { day: 'Tue', date: '14', items: [{ title: 'Half-court Sets', time: '7:00 PM', tone: 'navy' }] },
  { day: 'Wed', date: '15', items: [{ title: 'Rest', time: '—', tone: 'neutral' }] },
  { day: 'Thu', date: '16', items: [{ title: 'Scrimmage', time: '7:00 PM', tone: 'brand' }] },
  { day: 'Fri', date: '17', items: [{ title: 'Walk-through', time: '5:30 PM', tone: 'navy' }] },
  { day: 'Sat', date: '18', items: [{ title: 'Match: vs Garuda BC', time: '7:30 PM', tone: 'starter' }] },
  { day: 'Sun', date: '19', items: [{ title: 'Recovery', time: '10:00 AM', tone: 'neutral' }] }
];

export function SchedulePage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Schedule</h1>
          <p className="text-sm text-ink-muted mt-1">Training plan and match calendar for this week.</p>
        </div>
        <button
          onClick={() => {
            const title = window.prompt('New event title:');
            if (!title || !title.trim()) return;
            toast.success(`Added "${title.trim()}" to this week`);
          }}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold"
        >
          <Icon.Plus size={16} /> Add Event
        </button>
      </div>

      <Card>
        <CardHeader title="This Week" subtitle="May 13 – May 19" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {week.map((d) => (
            <div key={d.day} className="rounded-2xl border border-line p-3 min-h-[120px]">
              <div className="flex items-baseline justify-between">
                <div className="text-xs uppercase font-semibold tracking-wider text-ink-muted">{d.day}</div>
                <div className="text-lg font-extrabold text-ink">{d.date}</div>
              </div>
              <ul className="mt-2 space-y-1.5">
                {d.items.map((it, i) => (
                  <li key={i} className="rounded-lg bg-surface-alt p-2">
                    <div className="text-xs font-semibold text-ink leading-tight">{it.title}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-ink-muted">{it.time}</span>
                      <Badge tone={it.tone}>{it.tone === 'starter' ? 'Match' : 'Training'}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
