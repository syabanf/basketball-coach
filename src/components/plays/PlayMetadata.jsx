import { Badge } from '../ui/Badge.jsx';
import { Card } from '../ui/Card.jsx';
import { Icon } from '../ui/Icon.jsx';
import { formatDate } from '../../lib/format.js';

export function PlayMetadata({ play, onRename }) {
  if (!play) return null;
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <h2 className="text-xl font-bold text-ink">{play.title}</h2>
        <button
          onClick={() => onRename?.(play)}
          className="text-ink-muted hover:text-ink p-1 rounded-md hover:bg-surface-soft"
          aria-label="Rename play"
        >
          <Icon.Pencil size={16} />
        </button>
        <div className="flex flex-wrap items-center gap-1.5 ml-auto">
          {play.tags.map((t) => (
            <Badge key={t} tone="brand">{t}</Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-1">
          <div className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-1">Description</div>
          <p className="text-sm text-ink leading-relaxed">{play.description}</p>
        </div>
        <div>
          <div className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-1">Created</div>
          <p className="text-sm text-ink">{formatDate(play.createdAt)}</p>
        </div>
        <div>
          <div className="text-xs text-ink-muted font-semibold uppercase tracking-wider mb-1">Last Modified</div>
          <p className="text-sm text-ink">{formatDate(play.updatedAt)}</p>
        </div>
      </div>
    </Card>
  );
}
