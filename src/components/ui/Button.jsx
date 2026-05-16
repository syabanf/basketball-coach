import { cn } from '../../lib/cn.js';

const VARIANTS = {
  primary:
    'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-card disabled:bg-brand-200 disabled:cursor-not-allowed',
  secondary:
    'bg-white text-ink border border-line hover:bg-surface-soft active:bg-surface-soft',
  ghost:
    'bg-transparent text-ink hover:bg-surface-soft',
  navy:
    'bg-navy-700 text-white hover:bg-navy-600',
  danger:
    'bg-red-500 text-white hover:bg-red-600'
};

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-5 text-base gap-2 rounded-xl'
};

export function Button({
  as: Comp = 'button',
  variant = 'primary',
  size = 'md',
  className,
  leftIcon,
  rightIcon,
  children,
  ...rest
}) {
  return (
    <Comp
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-colors select-none whitespace-nowrap',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...rest}
    >
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      <span className="truncate">{children}</span>
      {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </Comp>
  );
}

export function IconButton({ className, children, size = 'md', variant = 'secondary', ...rest }) {
  const sizeMap = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-colors',
        VARIANTS[variant],
        sizeMap[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
