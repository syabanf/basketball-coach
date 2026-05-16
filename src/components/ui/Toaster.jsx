import { useToastStore } from '../../stores/toast.store.js';
import { cn } from '../../lib/cn.js';

const TONE = {
  default: 'bg-navy-700 text-white',
  success: 'bg-emerald-600 text-white',
  danger:  'bg-brand-500 text-white',
  info:    'bg-white text-ink border border-line'
};

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const dismiss = useToastStore((s) => s.dismiss);
  return (
    <div
      role="region"
      aria-label="Notifications"
      className="fixed z-[100] top-4 right-4 flex flex-col gap-2 max-w-[calc(100vw-2rem)] pointer-events-none"
    >
      {toasts.map((t) => (
        <button
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={cn(
            'pointer-events-auto px-4 py-3 rounded-xl shadow-pop text-sm font-medium text-left animate-[fadeIn_200ms_ease-out]',
            TONE[t.tone] || TONE.default
          )}
          style={{
            animation: 'tFadeIn 180ms ease-out'
          }}
        >
          {t.message}
        </button>
      ))}
      <style>{`
        @keyframes tFadeIn {
          from { transform: translateY(-6px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
