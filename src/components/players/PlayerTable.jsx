import { Avatar } from '../ui/Avatar.jsx';
import { StatusBadge } from '../ui/Badge.jsx';
import { Card, CardHeader } from '../ui/Card.jsx';
import { Icon } from '../ui/Icon.jsx';
import { Popover, MenuItem, MenuDivider } from '../ui/Popover.jsx';
import { cn } from '../../lib/cn.js';

export function PlayerTable({ players, selectedId, onSelect, onAdd, onEdit, onDelete, onViewAll }) {
  return (
    <Card padded={false}>
      <CardHeader
        className="px-5 sm:px-6 pt-5 sm:pt-6"
        title="Player List"
        action={
          <button
            onClick={onAdd}
            className="inline-flex items-center gap-1 text-brand-600 text-sm font-semibold hover:text-brand-700"
          >
            <Icon.Plus size={14} /> Add Player
          </button>
        }
      />

      {/* Desktop table */}
      <div className="hidden sm:block">
        <table className="w-full">
          <thead>
            <tr className="text-[11px] uppercase tracking-wider text-ink-muted">
              <th className="px-5 py-2 text-left font-semibold w-10">#</th>
              <th className="px-3 py-2 text-left font-semibold">Player</th>
              <th className="px-3 py-2 text-left font-semibold">Position</th>
              <th className="px-3 py-2 text-left font-semibold">Height</th>
              <th className="px-3 py-2 text-left font-semibold">OVR</th>
              <th className="px-5 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-right font-semibold w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {players.map((p) => {
              const active = p.id === selectedId;
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect?.(p.id)}
                  className={cn(
                    'cursor-pointer transition-colors',
                    active ? 'bg-brand-50/60' : 'hover:bg-surface-soft'
                  )}
                >
                  <td className="px-5 py-3">
                    <div className={cn(
                      'h-7 w-7 rounded-lg grid place-items-center text-xs font-bold',
                      active ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-700'
                    )}>{p.jersey}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={p.name} size="sm" />
                      <span className="font-semibold text-sm text-ink">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-sm text-ink-muted">{p.position}</td>
                  <td className="px-3 py-3 text-sm text-ink-muted">{p.height} cm</td>
                  <td className="px-3 py-3">
                    <span className="text-brand-600 font-bold text-sm">{p.overall}</span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <Popover content={(close) => (
                      <div>
                        <MenuItem icon={Icon.Pencil} onClick={() => { onEdit?.(p); close(); }}>Edit player</MenuItem>
                        <MenuDivider />
                        <MenuItem icon={Icon.Trash} danger onClick={() => { onDelete?.(p); close(); }}>Remove</MenuItem>
                      </div>
                    )}>
                      <button className="h-8 w-8 grid place-items-center rounded-lg text-ink-muted hover:bg-white">
                        <Icon.More size={16} />
                      </button>
                    </Popover>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile compact list */}
      <ul className="sm:hidden divide-y divide-line">
        {players.map((p) => (
          <li
            key={p.id}
            onClick={() => onSelect?.(p.id)}
            className={cn(
              'flex items-center gap-3 px-4 py-3 active:bg-surface-soft cursor-pointer',
              p.id === selectedId && 'bg-brand-50/60'
            )}
          >
            <div className="h-7 w-7 rounded-lg bg-brand-100 text-brand-700 grid place-items-center text-xs font-bold">
              {p.jersey}
            </div>
            <Avatar name={p.name} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-ink truncate">{p.name}</div>
              <div className="text-xs text-ink-muted">{p.position} · {p.height} cm</div>
            </div>
            <span className="text-brand-600 font-bold text-sm">{p.overall}</span>
            <StatusBadge status={p.status} />
          </li>
        ))}
      </ul>

      <div className="px-5 py-3 border-t border-line text-center">
        <button
          onClick={onViewAll}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          View All Players →
        </button>
      </div>
    </Card>
  );
}
