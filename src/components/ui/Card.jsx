import { cn } from '../../lib/cn.js';

export function Card({ className, children, padded = true, ...rest }) {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border border-line shadow-card',
        padded && 'p-5 sm:p-6',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, title, subtitle, action }) {
  return (
    <div className={cn('flex items-start justify-between gap-3 mb-4', className)}>
      <div className="min-w-0">
        {title && <h3 className="text-base sm:text-lg font-semibold text-ink truncate">{title}</h3>}
        {subtitle && <p className="text-sm text-ink-muted mt-0.5">{subtitle}</p>}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
