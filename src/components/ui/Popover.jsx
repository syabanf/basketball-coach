import { useEffect, useRef, useState, cloneElement } from 'react';
import { cn } from '../../lib/cn.js';

/**
 * Popover — anchors a floating panel to its trigger.
 * Usage:
 *   <Popover content={(close) => <Menu onAction={close} />}>
 *     <button>Open</button>
 *   </Popover>
 */
export function Popover({ children, content, align = 'end', className }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (
        !popRef.current?.contains(e.target) &&
        !triggerRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('pointerdown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  const trigger = cloneElement(children, {
    ref: triggerRef,
    onClick: (e) => {
      children.props.onClick?.(e);
      setOpen((v) => !v);
    },
    'aria-expanded': open
  });

  return (
    <div className="relative inline-block">
      {trigger}
      {open && (
        <div
          ref={popRef}
          className={cn(
            'absolute z-50 mt-2 min-w-[220px] bg-white border border-line rounded-xl shadow-pop overflow-hidden',
            align === 'end' ? 'right-0' : 'left-0',
            className
          )}
          role="menu"
        >
          {typeof content === 'function' ? content(() => setOpen(false)) : content}
        </div>
      )}
    </div>
  );
}

export function MenuItem({ icon: I, children, onClick, danger, disabled }) {
  return (
    <button
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors',
        danger ? 'text-red-600 hover:bg-red-50' : 'text-ink hover:bg-surface-soft',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent'
      )}
    >
      {I && <I size={16} />}
      <span className="flex-1">{children}</span>
    </button>
  );
}

export function MenuDivider() {
  return <div className="h-px bg-line my-1" />;
}
