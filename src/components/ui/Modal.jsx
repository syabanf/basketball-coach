import { useEffect } from 'react';
import { cn } from '../../lib/cn.js';
import { Icon } from './Icon.jsx';

/**
 * Modal — generic centered dialog with backdrop.
 * Controlled by `open` + `onClose`. Optional `title`, `description`, `footer`.
 *
 * Size variants:
 *   sm 380px · md 520px · lg 720px · xl 960px
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  preventOutsideClose = false
}) {
  // ESC to close, lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = {
    sm: 'max-w-[380px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[720px]',
    xl: 'max-w-[960px]'
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : undefined}
      className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4"
    >
      {/* Backdrop */}
      <div
        onClick={preventOutsideClose ? undefined : onClose}
        className="absolute inset-0 bg-navy-900/60 backdrop-blur-[2px] animate-[mFade_140ms_ease-out]"
      />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-white shadow-pop rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[92dvh]',
          'animate-[mIn_180ms_ease-out]',
          sizes[size]
        )}
      >
        {(title || description) && (
          <header className="flex items-start gap-3 px-5 sm:px-6 pt-5 pb-3 border-b border-line">
            <div className="flex-1 min-w-0">
              {title && <h2 className="text-lg font-bold text-ink truncate">{title}</h2>}
              {description && <p className="text-sm text-ink-muted mt-0.5">{description}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="h-9 w-9 grid place-items-center rounded-xl text-ink-muted hover:bg-surface-soft"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </header>
        )}

        <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-4">
          {children}
        </div>

        {footer && (
          <footer className="px-5 sm:px-6 py-4 border-t border-line flex flex-wrap items-center justify-end gap-2 safe-pb">
            {footer}
          </footer>
        )}
      </div>

      <style>{`
        @keyframes mFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mIn   { from { transform: translateY(12px); opacity: 0.6; } to { transform: translateY(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
