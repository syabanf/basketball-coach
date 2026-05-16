import { useState } from 'react';
import { Card } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Tabs } from '../../components/ui/Tabs.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { EventFormModal } from '../../components/schedule/EventFormModal.jsx';
import { CalendarWeek } from '../../components/schedule/CalendarWeek.jsx';
import { CalendarMonth } from '../../components/schedule/CalendarMonth.jsx';
import { CalendarAgenda } from '../../components/schedule/CalendarAgenda.jsx';
import { useScheduleStore } from '../../stores/schedule.store.js';
import {
  addDays, addMonths, weekGrid, formatMonthYear, formatWeekRange, toISODate
} from '../../lib/calendar.js';

const VIEWS = [
  { value: 'week',  label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'agenda', label: 'Agenda' }
];

export function SchedulePage() {
  const events = useScheduleStore((s) => s.events);
  const addEvent = useScheduleStore((s) => s.addEvent);
  const updateEvent = useScheduleStore((s) => s.updateEvent);
  const removeEvent = useScheduleStore((s) => s.removeEvent);

  // Default cursor: start of week containing the seed data (mid-May 2024)
  const [cursor, setCursor] = useState(new Date('2024-05-13T00:00:00'));
  const [view, setView] = useState('week');
  const [form, setForm] = useState({ open: false, event: null });
  const [confirming, setConfirming] = useState(null);

  const submit = (payload) => {
    if (form.event && form.event.id) updateEvent(form.event.id, payload);
    else                              addEvent(payload);
    setForm({ open: false, event: null });
  };

  const openNew = (date) =>
    setForm({ open: true, event: { date: date || toISODate(cursor), time: '18:00', type: 'training' } });

  const openEdit = (e) => setForm({ open: true, event: e });

  // Navigation
  const navPrev = () => setCursor((c) =>
    view === 'month' ? addMonths(c, -1)
    : view === 'week' ? addDays(c, -7)
    : addDays(c, -7)
  );
  const navNext = () => setCursor((c) =>
    view === 'month' ? addMonths(c, 1)
    : view === 'week' ? addDays(c, 7)
    : addDays(c, 7)
  );
  const navToday = () => setCursor(new Date());

  // Header range label
  let rangeLabel;
  if (view === 'month') {
    rangeLabel = formatMonthYear(cursor);
  } else if (view === 'week') {
    const week = weekGrid(cursor);
    rangeLabel = formatWeekRange(week[0], week[6]);
  } else {
    rangeLabel = 'Next 60 days';
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Schedule</h1>
          <p className="text-sm text-ink-muted mt-1">Training plan and match calendar.</p>
        </div>
        <Button leftIcon={<Icon.Plus size={16} />} onClick={() => openNew()}>
          Add Event
        </Button>
      </div>

      <Card padded={false}>
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 pt-4 pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <button
              onClick={navPrev}
              className="h-9 w-9 grid place-items-center rounded-lg border border-line text-ink-muted hover:bg-surface-soft"
              aria-label="Previous"
            >
              <Icon.ChevronDown size={16} className="rotate-90" />
            </button>
            <button
              onClick={navNext}
              className="h-9 w-9 grid place-items-center rounded-lg border border-line text-ink-muted hover:bg-surface-soft"
              aria-label="Next"
            >
              <Icon.ChevronDown size={16} className="-rotate-90" />
            </button>
            <button
              onClick={navToday}
              className="h-9 px-3 rounded-lg border border-line text-sm font-semibold text-ink hover:bg-surface-soft"
            >
              Today
            </button>
            <div className="ml-2 text-base font-bold text-ink">{rangeLabel}</div>
          </div>
          <Tabs value={view} onChange={setView} items={VIEWS} className="!border-b-0" />
        </div>

        <div className="p-4 sm:p-5">
          {view === 'week' && (
            <CalendarWeek
              events={events}
              cursor={cursor}
              onCellClick={openNew}
              onEventClick={openEdit}
            />
          )}
          {view === 'month' && (
            <CalendarMonth
              events={events}
              cursor={cursor}
              onCellClick={openNew}
              onEventClick={openEdit}
            />
          )}
          {view === 'agenda' && (
            <CalendarAgenda
              events={events}
              cursor={cursor}
              onEventClick={openEdit}
            />
          )}
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
