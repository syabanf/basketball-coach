import { cn } from '../../lib/cn.js';
import { Icon } from '../ui/Icon.jsx';
import { Popover, MenuItem, MenuDivider } from '../ui/Popover.jsx';
import { MiniPlayPreview } from '../board/MiniPlayPreview.jsx';

function PlayActions({ play, onAction, close }) {
  return (
    <div>
      <MenuItem icon={Icon.Pencil} onClick={() => { onAction?.('rename', play); close(); }}>Rename</MenuItem>
      <MenuItem icon={Icon.Share}  onClick={() => { onAction?.('share', play);  close(); }}>Share link</MenuItem>
      <MenuItem icon={Icon.Save}   onClick={() => { onAction?.('duplicate', play); close(); }}>Duplicate</MenuItem>
      <MenuDivider />
      <MenuItem icon={Icon.Trash} danger onClick={() => { onAction?.('delete', play); close(); }}>Delete</MenuItem>
    </div>
  );
}

export function PlayLibrary({ plays, activeId, onSelect, onNew, onViewAll, onPlayAction }) {
  return (
    <aside className="bg-white border border-line rounded-2xl shadow-card flex flex-col w-full">
      <div className="flex items-center justify-between px-4 pt-4 pb-3">
        <h3 className="font-semibold text-ink">My Plays</h3>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-1 text-brand-600 text-sm font-semibold hover:text-brand-700"
        >
          <Icon.Plus size={14} /> New Play
        </button>
      </div>
      <ul className="px-2 pb-2 overflow-y-auto max-h-[460px]">
        {plays.map((p) => {
          const active = p.id === activeId;
          return (
            <li key={p.id}>
              <button
                onClick={() => onSelect?.(p.id)}
                className={cn(
                  'group w-full flex items-center gap-3 p-2 my-0.5 rounded-xl text-left transition-colors',
                  active ? 'bg-brand-500 text-white shadow-card' : 'hover:bg-surface-soft'
                )}
              >
                <div
                  className={cn(
                    'h-10 w-10 shrink-0 rounded-lg grid place-items-center',
                    active ? 'bg-white/15' : 'bg-surface-soft'
                  )}
                >
                  <MiniPlayPreview
                    scene={p.scene}
                    color={active ? '#FFFFFF' : '#242424'}
                    size={34}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn('font-semibold text-sm truncate', active ? 'text-white' : 'text-ink')}>
                    {p.title}
                  </div>
                  <div className={cn('text-xs truncate', active ? 'text-white/80' : 'text-ink-muted')}>
                    {p.category}
                  </div>
                </div>
                <span
                  onClick={(e) => e.stopPropagation()}
                  className={cn(
                    'h-7 w-7 grid place-items-center rounded-lg',
                    active ? 'text-white/80 hover:bg-white/10' : 'text-ink-muted hover:bg-white'
                  )}
                >
                  <Popover content={(close) => <PlayActions play={p} onAction={onPlayAction} close={close} />}>
                    <span className="h-7 w-7 grid place-items-center"><Icon.More size={16} /></span>
                  </Popover>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="px-4 py-3 border-t border-line">
        <button
          onClick={onViewAll}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
        >
          View All Plays →
        </button>
      </div>
    </aside>
  );
}

export function PlayLibraryHorizontal({ plays, activeId, onSelect, onNew }) {
  return (
    <div className="bg-white border border-line rounded-2xl shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-ink">My Plays</h3>
        <button
          onClick={onNew}
          className="inline-flex items-center gap-1 text-brand-600 text-sm font-semibold"
        >
          <Icon.Plus size={14} /> New Play
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
        {plays.map((p) => {
          const active = p.id === activeId;
          return (
            <button
              key={p.id}
              onClick={() => onSelect?.(p.id)}
              className={cn(
                'shrink-0 w-40 p-3 rounded-2xl border transition-colors text-left',
                active
                  ? 'bg-brand-500 border-brand-500 text-white shadow-card'
                  : 'bg-white border-line hover:bg-surface-soft'
              )}
            >
              <div className={cn(
                'h-12 w-12 grid place-items-center rounded-lg mb-2',
                active ? 'bg-white/15' : 'bg-surface-soft'
              )}>
                <MiniPlayPreview scene={p.scene} color={active ? '#FFFFFF' : '#242424'} size={40} />
              </div>
              <div className={cn('font-semibold text-sm leading-tight', active ? 'text-white' : 'text-ink')}>
                {p.title}
              </div>
              <div className={cn('text-xs mt-0.5', active ? 'text-white/80' : 'text-ink-muted')}>
                {p.category}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
