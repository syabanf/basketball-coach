/**
 * Stacked horizontal bar showing percentage distribution + a key.
 * `coverage` = [{ name, pct }]
 */
export function DefenseBreakdown({ coverage, title = 'Defensive coverage' }) {
  const palette = ['#EE3C3B', '#F25C5B', '#FA8585', '#FFB8B8', '#FFE0E0'];

  return (
    <div>
      <div className="text-sm font-semibold text-ink mb-2">{title}</div>
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-surface-soft">
        {coverage.map((c, i) => (
          <div
            key={c.name}
            style={{ width: `${c.pct}%`, background: palette[i % palette.length] }}
            title={`${c.name}: ${c.pct}%`}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {coverage.map((c, i) => (
          <li key={c.name} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-sm shrink-0" style={{ background: palette[i % palette.length] }} />
            <span className="text-ink truncate flex-1">{c.name}</span>
            <span className="font-bold text-ink tabular-nums">{c.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Small bar chart for last-6-games usage trend.
 */
export function UsageTrend({ values }) {
  if (!values?.length) return null;
  const max = Math.max(...values, 1);
  return (
    <div>
      <div className="flex items-end gap-1 h-16">
        {values.map((v, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-brand-200 hover:bg-brand-300 transition-colors min-w-[8px]"
            style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
            title={`Game ${i + 1}: ${v} possessions`}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-ink-muted font-semibold mt-1.5">
        <span>Last 6 games</span>
        <span>{values[values.length - 1]} this game</span>
      </div>
    </div>
  );
}
