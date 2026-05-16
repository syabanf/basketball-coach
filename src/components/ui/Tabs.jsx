import { cn } from '../../lib/cn.js';

export function Tabs({ value, onChange, items, className }) {
  return (
    <div className={cn('flex items-center gap-6 border-b border-line', className)} role="tablist">
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(it.value)}
            className={cn(
              'relative py-3 text-sm font-semibold tracking-wide uppercase transition-colors',
              active ? 'text-brand-600' : 'text-ink-muted hover:text-ink'
            )}
          >
            {it.label}
            <span
              className={cn(
                'absolute left-0 right-0 -bottom-px h-0.5 rounded-full',
                active ? 'bg-brand-500' : 'bg-transparent'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
