export const TYPE_BADGE = {
  training: { tone: 'brand',    label: 'Training', dot: 'bg-brand-500'     },
  match:    { tone: 'starter',  label: 'Match',    dot: 'bg-emerald-500'   },
  rest:     { tone: 'neutral',  label: 'Rest',     dot: 'bg-ink-subtle'    },
  meeting:  { tone: 'rotation', label: 'Meeting',  dot: 'bg-amber-500'     }
};

export const eventsForDate = (events, isoDate) =>
  events
    .filter((e) => e.date === isoDate)
    .sort((a, b) => a.time.localeCompare(b.time));
