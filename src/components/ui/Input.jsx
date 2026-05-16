import { cn } from '../../lib/cn.js';

export function Input({ className, leftIcon, rightIcon, ...rest }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 h-10 px-3 rounded-xl bg-white border border-line focus-within:border-brand-400 focus-within:shadow-focus transition-shadow',
        className
      )}
    >
      {leftIcon && <span className="text-ink-muted shrink-0">{leftIcon}</span>}
      <input
        className="flex-1 bg-transparent outline-none text-sm placeholder:text-ink-subtle"
        {...rest}
      />
      {rightIcon && <span className="text-ink-muted shrink-0">{rightIcon}</span>}
    </div>
  );
}
