import { cn } from '../../lib/cn.js';

/**
 * FormField — labeled wrapper for any input.
 *   <FormField label="Name" hint="Full name" error={errors.name}>
 *     <Input ... />
 *   </FormField>
 */
export function FormField({ label, hint, error, htmlFor, children, className }) {
  return (
    <label htmlFor={htmlFor} className={cn('block', className)}>
      {label && (
        <div className="text-xs font-semibold text-ink-muted mb-1">{label}</div>
      )}
      {children}
      {error
        ? <div className="text-xs text-red-600 mt-1">{error}</div>
        : hint
          ? <div className="text-xs text-ink-subtle mt-1">{hint}</div>
          : null
      }
    </label>
  );
}

/**
 * Select — minimal styled native <select> to match Input.
 */
export function Select({ className, children, ...rest }) {
  return (
    <div
      className={cn(
        'relative flex items-center h-10 px-3 rounded-xl bg-white border border-line focus-within:border-brand-400 focus-within:shadow-focus transition-shadow',
        className
      )}
    >
      <select
        className="flex-1 bg-transparent outline-none text-sm appearance-none pr-6 cursor-pointer"
        {...rest}
      >
        {children}
      </select>
      <svg
        aria-hidden="true"
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-muted"
        width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

/**
 * Textarea — multi-line input matching Input style.
 */
export function Textarea({ className, rows = 4, ...rest }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'block w-full px-3 py-2 rounded-xl bg-white border border-line outline-none text-sm placeholder:text-ink-subtle resize-y',
        'focus:border-brand-400 focus:shadow-focus transition-shadow',
        className
      )}
      {...rest}
    />
  );
}

/**
 * Range slider styled with brand color (used for attribute editing).
 */
export function Range({ className, ...rest }) {
  return (
    <input
      type="range"
      min={0}
      max={100}
      className={cn(
        'w-full h-2 rounded-full appearance-none bg-surface-soft cursor-pointer accent-brand-500',
        className
      )}
      {...rest}
    />
  );
}
