import { cn } from '../../lib/cn.js';
import { initials } from '../../lib/format.js';

const SIZES = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl'
};

export function Avatar({ name = '', size = 'md', src, className, ring = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-brand-100 text-brand-700 font-semibold overflow-hidden shrink-0',
        ring && 'ring-2 ring-white shadow-card',
        SIZES[size],
        className
      )}
      aria-label={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </span>
  );
}
