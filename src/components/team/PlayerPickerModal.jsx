import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Avatar } from '../ui/Avatar.jsx';
import { Input } from '../ui/Input.jsx';
import { Badge } from '../ui/Badge.jsx';
import { Icon } from '../ui/Icon.jsx';
import { cn } from '../../lib/cn.js';

/**
 * PlayerPickerModal — pick one player from the roster (optionally filtered by position).
 * Props:
 *   open, onClose
 *   players        — full roster
 *   excludedIds    — already-assigned ids to disable
 *   preferredPosition — soft filter: matching players sort to top, all others remain pickable
 *   onSelect(id)   — called with chosen player id
 *   onClear        — optional: empties the slot
 *   slotLabel      — e.g. 'PG'
 */
export function PlayerPickerModal({
  open,
  onClose,
  players = [],
  excludedIds = [],
  preferredPosition,
  onSelect,
  onClear,
  slotLabel
}) {
  const [query, setQuery] = useState('');
  useEffect(() => { if (open) setQuery(''); }, [open]);

  const excluded = new Set(excludedIds);
  const q = query.trim().toLowerCase();

  const ranked = players
    .filter((p) =>
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q) ||
      String(p.jersey).includes(q)
    )
    .sort((a, b) => {
      const aMatch = a.position === preferredPosition ? 0 : 1;
      const bMatch = b.position === preferredPosition ? 0 : 1;
      if (aMatch !== bMatch) return aMatch - bMatch;
      return (b.overall || 0) - (a.overall || 0);
    });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Select player${slotLabel ? ` — ${slotLabel}` : ''}`}
      description={preferredPosition ? `${preferredPosition} preferred · all positions selectable` : null}
      size="md"
      footer={
        onClear ? (
          <button
            onClick={() => { onClear(); onClose?.(); }}
            className="text-sm font-semibold text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 mr-auto"
          >
            Clear slot
          </button>
        ) : null
      }
    >
      <div className="mb-3">
        <Input
          placeholder="Search by name, position, or number…"
          leftIcon={<Icon.Search size={16} />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      <ul className="max-h-[50dvh] overflow-y-auto -mx-1 px-1">
        {ranked.length === 0 && (
          <li className="text-center py-10 text-ink-muted text-sm">No players match.</li>
        )}
        {ranked.map((p) => {
          const disabled = excluded.has(p.id);
          return (
            <li key={p.id}>
              <button
                disabled={disabled}
                onClick={() => { onSelect?.(p.id); onClose?.(); }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl text-left transition-colors',
                  disabled ? 'opacity-50 cursor-not-allowed bg-surface-soft' : 'hover:bg-surface-soft'
                )}
              >
                <div className="h-7 w-7 rounded-lg bg-brand-100 text-brand-700 grid place-items-center text-xs font-bold shrink-0">
                  {p.jersey}
                </div>
                <Avatar name={p.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-ink text-sm truncate">
                    {p.name}
                    {disabled && <span className="ml-2 text-[11px] text-ink-subtle font-normal">already in lineup</span>}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {p.position} · {p.height} cm · OVR <span className="text-brand-600 font-semibold">{p.overall}</span>
                  </div>
                </div>
                {p.position === preferredPosition && !disabled && (
                  <Badge tone="brand">Match</Badge>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
