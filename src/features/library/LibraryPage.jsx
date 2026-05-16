import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Tabs } from '../../components/ui/Tabs.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Popover, MenuItem, MenuDivider } from '../../components/ui/Popover.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { LibraryFormModal } from '../../components/library/LibraryFormModal.jsx';
import { useLibraryStore } from '../../stores/library.store.js';
import { LIBRARY_TYPES } from '../../data/library.js';
import { formatDate } from '../../lib/format.js';
import { toast } from '../../stores/toast.store.js';
import { cn } from '../../lib/cn.js';

const TYPE_FILTERS = [
  { value: 'all',      label: 'All' },
  { value: 'report',   label: 'Reports' },
  { value: 'template', label: 'Templates' },
  { value: 'document', label: 'Documents' },
  { value: 'video',    label: 'Videos' }
];

export function LibraryPage() {
  const navigate = useNavigate();
  const items = useLibraryStore((s) => s.items);
  const addItem = useLibraryStore((s) => s.addItem);
  const updateItem = useLibraryStore((s) => s.updateItem);
  const removeItem = useLibraryStore((s) => s.removeItem);

  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ open: false, item: null });
  const [confirming, setConfirming] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const matchesQ = !q
        || i.title.toLowerCase().includes(q)
        || (i.description || '').toLowerCase().includes(q)
        || (i.tags || []).some((t) => t.toLowerCase().includes(q));
      const matchesT = filter === 'all' || i.type === filter;
      return matchesQ && matchesT;
    });
  }, [items, query, filter]);

  const openNew  = () => setForm({ open: true, item: null });
  const openEdit = (item) => setForm({ open: true, item });

  const submit = (payload) => {
    if (form.item) {
      updateItem(form.item.id, payload);
    } else {
      const created = addItem(payload);
      navigate(`/library/${created.id}`);
    }
    setForm({ open: false, item: null });
  };

  const handleShare = async (item) => {
    const url = `${window.location.origin}/library/${item.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied');
    } catch {
      toast.info(url);
    }
  };

  const handleDuplicate = (item) => {
    addItem({
      title: `${item.title} (Copy)`,
      type: item.type,
      description: item.description,
      tags: item.tags,
      body: item.body
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Library</h1>
          <p className="text-sm text-ink-muted mt-1">Scouting reports, videos, and tactical templates.</p>
        </div>
        <Button leftIcon={<Icon.Plus size={16} />} onClick={openNew}>Upload</Button>
      </div>

      <Card padded={false}>
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-line">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search title, tags, or description…"
              leftIcon={<Icon.Search size={16} />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Tabs value={filter} onChange={setFilter} items={TYPE_FILTERS} className="!border-b-0" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5">
          {filtered.map((item) => {
            const meta = LIBRARY_TYPES[item.type] || LIBRARY_TYPES.document;
            return (
              <article
                key={item.id}
                className={cn(
                  'group rounded-2xl border border-line hover:border-brand-300 hover:shadow-card transition-all bg-white'
                )}
              >
                <button
                  onClick={() => navigate(`/library/${item.id}`)}
                  className="w-full text-left p-4 flex items-start gap-3"
                >
                  <div className="h-12 w-12 grid place-items-center rounded-xl bg-brand-50 text-brand-600 shrink-0">
                    {item.type === 'video' ? <Icon.Plays size={22} /> : <Icon.Library size={22} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-ink truncate group-hover:text-brand-600">{item.title}</div>
                    <div className="text-xs text-ink-muted mt-0.5">Updated {formatDate(item.updated)}</div>
                    <p className="text-xs text-ink-muted mt-1.5 line-clamp-2">{item.description}</p>
                    <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                      {item.duration && <Badge tone="neutral">{item.duration}</Badge>}
                    </div>
                  </div>
                </button>
                <div className="px-4 pb-3 flex items-center justify-between">
                  <span className="text-[11px] text-ink-subtle">by {item.createdBy}</span>
                  <Popover content={(close) => (
                    <div>
                      <MenuItem icon={Icon.Library} onClick={() => { navigate(`/library/${item.id}`); close(); }}>Open</MenuItem>
                      <MenuItem icon={Icon.Pencil}  onClick={() => { openEdit(item); close(); }}>Edit</MenuItem>
                      <MenuItem icon={Icon.Share}   onClick={() => { handleShare(item); close(); }}>Share link</MenuItem>
                      <MenuItem icon={Icon.Save}    onClick={() => { handleDuplicate(item); close(); }}>Duplicate</MenuItem>
                      <MenuDivider />
                      <MenuItem icon={Icon.Trash} danger onClick={() => { setConfirming(item); close(); }}>Delete</MenuItem>
                    </div>
                  )}>
                    <button className="h-8 w-8 grid place-items-center rounded-lg text-ink-muted hover:bg-surface-soft">
                      <Icon.More size={16} />
                    </button>
                  </Popover>
                </div>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-16 text-center text-ink-muted">
            <Icon.Library size={36} className="mx-auto text-ink-subtle mb-2" />
            <div className="font-semibold">Nothing matches your filter.</div>
            <div className="text-sm">Try clearing the search or switching tabs.</div>
          </div>
        )}
      </Card>

      <LibraryFormModal
        open={form.open}
        onClose={() => setForm({ open: false, item: null })}
        item={form.item}
        onSubmit={submit}
      />
      <ConfirmDialog
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title="Delete library item?"
        description={confirming ? `"${confirming.title}" will be permanently removed.` : ''}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => removeItem(confirming.id)}
      />
    </div>
  );
}
