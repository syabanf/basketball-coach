import { useState } from 'react';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { EventFormModal } from '../../components/schedule/EventFormModal.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { useScheduleStore } from '../../stores/schedule.store.js';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DAY_DATES = { Mon: '13', Tue: '14', Wed: '15', Thu: '16', Fri: '17', Sat: '18', Sun: '19' };

const TYPE_BADGE = {
  training: { tone: 'brand',    label: 'Training' },
  match:    { tone: 'starter',  label: 'Match' },
  rest:     { tone: 'neutral',  label: 'Rest' },
  meeting:  { tone: 'rotation', label: 'Meeting' }
};

export function SchedulePage() {
  const events = useScheduleStore((s) => s.events);
  const addEvent = useScheduleStore((s) => s.addEvent);
  const updateEvent = useScheduleStore((s) => s.updateEvent);
  const removeEvent = useScheduleStore((s) => s.removeEvent);

  const [form, setForm] = useState({ open: false, event: null });
  const [confirming, setConfirming] = useState(null);

  const byDay = DAYS.reduce((acc, d) => {
    acc[d] = events.filter((e) => e.day === d).sort((a, b) => a.time.localeCompare(b.time));
    return acc;
  }, {});

  const submit = (payload) => {
    if (form.event) updateEvent(form.event.id, payload);
    else            addEvent(payload);
    setForm({ open: false, event: null });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Schedule</h1>
          <p className="text-sm text-ink-muted mt-1">Training plan and match calendar for this week.</p>
        </div>
        <Button leftIcon={<Icon.Plus size={16} />} onClick={() => setForm({ open: true, event: null })}>
          Add Event
        </Button>
      </div>

      <Card>
        <CardHeader title="This Week" subtitle="May 13 – May 19" />
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {DAYS.map((d) => (
            <div key={d} className="rounded-2xl border border-line p-3 min-h-[140px] flex flex-col">
              <div className="flex items-baseline justify-between">
                <div className="text-xs uppercase font-semibold tracking-wider text-ink-muted">{d}</div>
                <div className="text-lg font-extrabold text-ink">{DAY_DATES[d]}</div>
              </div>
              <ul className="mt-2 space-y-1.5 flex-1">
                {byDay[d].length === 0 && (
                  <li>
                    <button
                      onClick={() => setForm({ open: true, event: { day: d, date: DAY_DATES[d], time: '18:00', type: 'training' } })}
                      className="w-full h-full min-h-[60px] rounded-lg border border-dashed border-line text-ink-subtle text-xs hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50/40 transition-colors"
                    >
                      + Add
                    </button>
                  </li>
                )}
                {byDay[d].map((e) => {
                  const badge = TYPE_BADGE[e.type] || TYPE_BADGE.training;
                  return (
                    <li key={e.id} className="group">
                      <button
                        onClick={() => setForm({ open: true, event: e })}
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
          ))}
        </div>
      </Card>

      <EventFormModal
        open={form.open}
        onClose={() => setForm({ open: false, event: null })}
        event={form.event}
        onSubmit={submit}
        onDelete={form.event && form.event.id ? () => setConfirming(form.event) : undefined}
      />
      <ConfirmDialog
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title="Delete event?"
        description={confirming ? `"${confirming.title}" will be removed from the schedule.` : ''}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => removeEvent(confirming.id)}
      />
    </div>
  );
}
