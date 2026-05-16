// Lightweight date helpers — no dependencies. Works in local timezone.

export const DAY_LABELS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Format a Date (or yyyy-mm-dd string) → 'YYYY-MM-DD'. */
export const toISODate = (d) => {
  const date = d instanceof Date ? d : new Date(d);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

/** ISO YYYY-MM-DD → Date at midnight local. */
export const fromISODate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};

/** Add/subtract days, returns a new Date. */
export const addDays = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

/** Add months, returns a new Date. Clamps day if target month is shorter. */
export const addMonths = (date, n) => {
  const d = new Date(date);
  const targetMonth = d.getMonth() + n;
  d.setDate(1);
  d.setMonth(targetMonth);
  return d;
};

/** Monday of the week containing `date`. */
export const startOfWeek = (date) => {
  const d = new Date(date);
  const dow = (d.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  d.setDate(d.getDate() - dow);
  d.setHours(0, 0, 0, 0);
  return d;
};

/** First Monday on or before the first day of the month. */
export const startOfMonthGrid = (date) => {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  return startOfWeek(first);
};

/** 42-cell month grid starting from the first visible Monday. */
export const monthGrid = (date) => {
  const start = startOfMonthGrid(date);
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

/** 7-cell week grid starting Monday. */
export const weekGrid = (date) => {
  const start = startOfWeek(date);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
};

export const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isSameMonth = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

/** 'May 2024' or 'May 13 – May 19, 2024' for a range. */
export const formatMonthYear = (date) =>
  date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export const formatWeekRange = (start, end) => {
  const sameMonth = start.getMonth() === end.getMonth();
  const sameYear = start.getFullYear() === end.getFullYear();
  const fmt = { month: 'short', day: 'numeric' };
  if (sameMonth) {
    return `${start.toLocaleDateString('en-US', fmt)} – ${end.getDate()}, ${end.getFullYear()}`;
  }
  return `${start.toLocaleDateString('en-US', fmt)} – ${end.toLocaleDateString('en-US', fmt)}${sameYear ? `, ${end.getFullYear()}` : ''}`;
};

export const formatDateLong = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

export const formatDateShort = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
