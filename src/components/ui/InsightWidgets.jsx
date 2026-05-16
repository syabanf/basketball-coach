import { cn } from '../../lib/cn.js';

/**
 * DistributionBar — horizontal stacked bar with key/legend.
 * `segments` = [{ label, value, color }]. Colors default to a red ramp.
 */
const DEFAULT_COLORS = ['#EE3C3B', '#F25C5B', '#FA8585', '#FFB8B8', '#FFE0E0'];

export function DistributionBar({ segments, title, total }) {
  const sum = total ?? segments.reduce((s, x) => s + (x.value || 0), 0);
  if (sum === 0) {
    return (
      <div>
        {title && <div className="text-sm font-semibold text-ink mb-2">{title}</div>}
        <div className="h-2.5 w-full rounded-full bg-surface-soft" />
      </div>
    );
  }
  return (
    <div>
      {title && <div className="text-sm font-semibold text-ink mb-2">{title}</div>}
      <div className="h-2.5 w-full rounded-full overflow-hidden flex bg-surface-soft">
        {segments.map((s, i) => (
          <div
            key={s.label + i}
            style={{
              width: `${(s.value / sum) * 100}%`,
              background: s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]
            }}
            title={`${s.label}: ${s.value}`}
          />
        ))}
      </div>
      <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
        {segments.map((s, i) => (
          <li key={s.label + i} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ background: s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length] }}
            />
            <span className="text-ink-muted truncate flex-1">{s.label}</span>
            <span className="font-bold text-ink tabular-nums">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Sparkline — tiny inline bar trend.
 */
export function Sparkline({ values, color = 'bg-brand-300', activeColor = 'bg-brand-500', height = 48 }) {
  if (!values?.length) return null;
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {values.map((v, i) => (
        <div
          key={i}
          className={cn(
            'flex-1 rounded-t-md min-w-[6px] transition-colors',
            i === values.length - 1 ? activeColor : color
          )}
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

/**
 * ComparisonBar — two stacked horizontal bars (e.g. player vs team avg).
 * `a` = primary value, `b` = baseline value, max defaults to 100.
 */
export function ComparisonBar({ label, a, b, max = 100, aLabel = 'Player', bLabel = 'Team Avg' }) {
  const aPct = Math.min(100, (a / max) * 100);
  const bPct = Math.min(100, (b / max) * 100);
  const diff = a - b;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-sm text-ink font-medium">{label}</span>
        <span className={cn('text-xs font-bold tabular-nums', diff >= 0 ? 'text-emerald-600' : 'text-red-600')}>
          {diff >= 0 ? '+' : ''}{diff}
        </span>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-brand-600 w-12 shrink-0">{aLabel}</span>
          <div className="flex-1 h-2 rounded-full bg-surface-soft overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${aPct}%` }} />
          </div>
          <span className="w-8 text-right text-xs font-bold text-ink tabular-nums">{a}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-bold text-ink-muted w-12 shrink-0">{bLabel}</span>
          <div className="flex-1 h-2 rounded-full bg-surface-soft overflow-hidden">
            <div className="h-full rounded-full bg-navy-300" style={{ width: `${bPct}%` }} />
          </div>
          <span className="w-8 text-right text-xs font-bold text-ink-muted tabular-nums">{b}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * KPI tile (compact). Used in dashboards/summary rows.
 */
export function KPI({ label, value, hint, tone = 'brand', icon }) {
  const colors = {
    brand:   'text-brand-600',
    navy:    'text-navy-700',
    success: 'text-emerald-600',
    warning: 'text-amber-600',
    danger:  'text-red-600'
  };
  const bg = {
    brand:   'bg-brand-50',
    navy:    'bg-navy-50',
    success: 'bg-emerald-50',
    warning: 'bg-amber-50',
    danger:  'bg-red-50'
  };
  return (
    <div className="bg-white rounded-2xl border border-line p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">{label}</div>
          <div className={cn('mt-1 text-2xl sm:text-3xl font-extrabold tabular-nums', colors[tone])}>{value}</div>
        </div>
        {icon && (
          <div className={cn('h-9 w-9 grid place-items-center rounded-xl', bg[tone], colors[tone])}>
            {icon}
          </div>
        )}
      </div>
      {hint && <div className="text-xs text-ink-muted mt-1.5">{hint}</div>}
    </div>
  );
}

/**
 * Pill — small status indicator with a colored dot.
 */
export function Pill({ tone = 'brand', className, children }) {
  const tones = {
    brand:   { bg: 'bg-brand-50', text: 'text-brand-700', dot: 'bg-brand-500' },
    success: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
    danger:  { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
    neutral: { bg: 'bg-surface-soft', text: 'text-ink', dot: 'bg-ink-subtle' }
  };
  const t = tones[tone] || tones.brand;
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold', t.bg, t.text, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', t.dot)} />
      {children}
    </span>
  );
}
