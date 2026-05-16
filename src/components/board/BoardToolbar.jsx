import { Icon } from '../ui/Icon.jsx';
import { TOOLS, useBoardStore } from '../../stores/board.store.js';
import { cn } from '../../lib/cn.js';

const TOOL_ITEMS = [
  { id: TOOLS.SELECT, label: 'Select',    icon: Icon.Cursor },
  { id: TOOLS.DRAW,   label: 'Draw',      icon: Icon.Pencil },
  { id: TOOLS.CIRCLE, label: 'Circle',    icon: Icon.Circle },
  { id: TOOLS.RECT,   label: 'Rectangle', icon: Icon.Rect },
  { id: TOOLS.ARROW,  label: 'Arrow',     icon: Icon.Arrow },
  { id: TOOLS.TEXT,   label: 'Text',      icon: Icon.Text },
  { id: TOOLS.ERASER, label: 'Eraser',    icon: Icon.Eraser }
];

export function BoardToolbar({ onUndo, onRedo, onClear }) {
  const tool = useBoardStore((s) => s.tool);
  const setTool = useBoardStore((s) => s.setTool);

  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-line">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {TOOL_ITEMS.map(({ id, label, icon: I }) => {
          const active = tool === id;
          return (
            <button
              key={id}
              onClick={() => setTool(id)}
              className={cn(
                'inline-flex items-center gap-2 px-3 h-9 rounded-xl text-sm font-semibold transition-colors whitespace-nowrap',
                active
                  ? 'bg-brand-500 text-white shadow-card'
                  : 'text-ink hover:bg-surface-soft'
              )}
            >
              <I size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>

      <div className="hidden md:flex items-center gap-1.5">
        <ToolbarBtn onClick={onUndo} icon={Icon.Undo}  label="Undo" />
        <ToolbarBtn onClick={onRedo} icon={Icon.Redo}  label="Redo" />
        <ToolbarBtn onClick={onClear} icon={Icon.Trash} label="Clear" tone="danger" />
      </div>
    </div>
  );
}

function ToolbarBtn({ icon: I, label, onClick, tone }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-3 h-9 rounded-xl text-sm font-semibold transition-colors',
        tone === 'danger'
          ? 'text-red-600 hover:bg-red-50'
          : 'text-ink-muted hover:bg-surface-soft hover:text-ink'
      )}
    >
      <I size={16} /> <span className="hidden lg:inline">{label}</span>
    </button>
  );
}
