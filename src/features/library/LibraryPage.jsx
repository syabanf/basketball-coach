import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { toast } from '../../stores/toast.store.js';

const items = [
  { title: 'Garuda BC — scouting',  type: 'Report', updated: 'May 14, 2024', tone: 'brand' },
  { title: 'Floppy variations',     type: 'Templates', updated: 'May 12, 2024', tone: 'navy' },
  { title: 'Pre-game speech notes', type: 'Document', updated: 'May 11, 2024', tone: 'starter' },
  { title: 'Q3 highlight cuts',     type: 'Video',  updated: 'May 09, 2024', tone: 'rotation' },
  { title: '2-3 vs PnR principles', type: 'Templates', updated: 'May 06, 2024', tone: 'navy' },
  { title: 'Combine measurements',  type: 'Document', updated: 'May 02, 2024', tone: 'starter' }
];

export function LibraryPage() {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Library</h1>
          <p className="text-sm text-ink-muted mt-1">Scouting reports, videos, and tactical templates.</p>
        </div>
        <button
          onClick={() => toast.info('File upload — coming soon')}
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-semibold"
        >
          <Icon.Plus size={16} /> Upload
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((it, i) => (
          <Card
            key={i}
            onClick={() => toast.info(`Opening "${it.title}"`)}
            className="hover:shadow-pop transition-shadow cursor-pointer"
          >
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 grid place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon.Library size={22} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink truncate">{it.title}</div>
                <div className="text-xs text-ink-muted mt-0.5">Updated {it.updated}</div>
                <div className="mt-2"><Badge tone={it.tone}>{it.type}</Badge></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
