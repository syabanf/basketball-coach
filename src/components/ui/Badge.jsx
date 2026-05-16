import { cn } from '../../lib/cn.js';

const TONES = {
  brand:   'bg-brand-50 text-brand-700',
  navy:    'bg-navy-50 text-navy-700',
  neutral: 'bg-surface-soft text-ink-muted',
  starter: 'bg-status-starterBg text-status-starterText',
  bench:   'bg-status-benchBg text-status-benchText',
  rotation:'bg-status-rotationBg text-status-rotationText',
  outline: 'bg-white text-ink border border-line'
};

export function Badge({ tone = 'neutral', className, children }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = { starter: 'Starter', bench: 'Bench', rotation: 'Rotation' };
  const tone = status === 'starter' ? 'starter' : status === 'bench' ? 'bench' : 'rotation';
  return <Badge tone={tone}>{map[status] || status}</Badge>;
}
