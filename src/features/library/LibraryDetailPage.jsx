import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { Popover, MenuItem, MenuDivider } from '../../components/ui/Popover.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { LibraryFormModal } from '../../components/library/LibraryFormModal.jsx';
import { useLibraryStore } from '../../stores/library.store.js';
import { toast } from '../../stores/toast.store.js';
import { LIBRARY_TYPES } from '../../data/library.js';
import { formatDate } from '../../lib/format.js';

export function LibraryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const items = useLibraryStore((s) => s.items);
  const updateItem = useLibraryStore((s) => s.updateItem);
  const removeItem = useLibraryStore((s) => s.removeItem);

  const item = items.find((i) => i.id === id);
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!item) {
    return (
      <div className="space-y-5">
        <Button variant="ghost" leftIcon={<Icon.ChevronDown size={16} className="rotate-90" />} onClick={() => navigate('/library')}>
          Back to Library
        </Button>
        <Card>
          <div className="text-center py-12">
            <h2 className="text-xl font-bold text-ink">Item not found</h2>
            <p className="text-sm text-ink-muted mt-1">This library item may have been removed.</p>
            <Button className="mt-4" onClick={() => navigate('/library')}>Go to Library</Button>
          </div>
        </Card>
      </div>
    );
  }

  const meta = LIBRARY_TYPES[item.type] || LIBRARY_TYPES.document;
  const related = items.filter((i) => i.id !== item.id && i.type === item.type).slice(0, 4);

  const handleShare = async () => {
    const url = `${window.location.origin}/library/${item.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Share link copied');
    } catch {
      toast.info(url);
    }
  };

  const handleDownload = () => toast.info('Download — coming soon');

  const handleDuplicate = () => {
    useLibraryStore.getState().addItem({
      title: `${item.title} (Copy)`,
      type: item.type,
      description: item.description,
      tags: item.tags,
      body: item.body
    });
    toast.success(`Duplicated "${item.title}"`);
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb / back */}
      <div className="flex items-center gap-2 text-sm">
        <Link to="/library" className="text-ink-muted hover:text-ink font-medium inline-flex items-center gap-1">
          <Icon.ChevronDown size={16} className="rotate-90" />
          Library
        </Link>
        <span className="text-ink-subtle">/</span>
        <span className="text-ink font-semibold truncate">{item.title}</span>
      </div>

      {/* Header card */}
      <Card>
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
          <div className="h-20 w-20 rounded-2xl bg-brand-50 text-brand-600 grid place-items-center shrink-0">
            {item.type === 'video' ? <Icon.Plays size={36} /> : <Icon.Library size={36} />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <Badge tone={meta.tone}>{meta.label}</Badge>
              {item.duration && <Badge tone="neutral">{item.duration}</Badge>}
              {(item.tags || []).map((t) => <Badge key={t} tone="brand">{t}</Badge>)}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight leading-tight">{item.title}</h1>
            <p className="text-sm text-ink-muted mt-2 max-w-2xl">{item.description}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
              <Avatar name={item.createdBy} size="xs" />
              <span>by <span className="text-ink font-semibold">{item.createdBy}</span></span>
              <span className="text-ink-subtle">·</span>
              <span>Updated {formatDate(item.updated)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" leftIcon={<Icon.Share size={16} />} onClick={handleShare}>Share</Button>
            <Button variant="secondary" leftIcon={<Icon.Save size={16} />} onClick={handleDownload}>Download</Button>
            <Button leftIcon={<Icon.Pencil size={16} />} onClick={() => setEditing(true)}>Edit</Button>
            <Popover content={(close) => (
              <div>
                <MenuItem icon={Icon.Save} onClick={() => { handleDuplicate(); close(); }}>Duplicate</MenuItem>
                <MenuDivider />
                <MenuItem icon={Icon.Trash} danger onClick={() => { setConfirming(true); close(); }}>Delete</MenuItem>
              </div>
            )}>
              <button className="h-10 w-10 grid place-items-center rounded-xl border border-line text-ink-muted hover:bg-surface-soft">
                <Icon.More size={18} />
              </button>
            </Popover>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        {/* Body */}
        <div className="space-y-4">
          {item.type === 'video' && (
            <Card padded={false} className="overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-navy-700 to-navy-900 grid place-items-center text-white">
                <div className="text-center">
                  <div className="h-16 w-16 rounded-full bg-white/10 grid place-items-center mx-auto mb-3 backdrop-blur">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="text-xs text-white/70 mt-1">{item.duration || ''} · Video player placeholder</div>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <ContentRenderer body={item.body} />
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-4">
          <Card>
            <CardHeader title="Details" />
            <dl className="space-y-2.5 text-sm">
              <Row label="Type" value={meta.label} />
              <Row label="Author" value={item.createdBy} />
              <Row label="Updated" value={formatDate(item.updated)} />
              {item.duration && <Row label="Duration" value={item.duration} />}
              <Row label="Sections" value={(item.body || []).length} />
            </dl>
          </Card>

          {related.length > 0 && (
            <Card>
              <CardHeader title="Related" subtitle={`Other ${meta.label.toLowerCase()}`} />
              <ul className="space-y-2 -mx-1">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      to={`/library/${r.id}`}
                      className="flex items-start gap-3 p-2 rounded-xl hover:bg-surface-soft transition-colors"
                    >
                      <span className="h-9 w-9 grid place-items-center rounded-lg bg-brand-50 text-brand-600 shrink-0">
                        <Icon.Library size={16} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-ink truncate">{r.title}</div>
                        <div className="text-xs text-ink-muted truncate">{r.description}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </aside>
      </div>

      {/* Modals */}
      <LibraryFormModal
        open={editing}
        onClose={() => setEditing(false)}
        item={item}
        onSubmit={(patch) => {
          updateItem(item.id, patch);
          setEditing(false);
        }}
      />
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title="Delete library item?"
        description={`"${item.title}" will be permanently removed.`}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => {
          removeItem(item.id);
          navigate('/library');
        }}
      />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-ink-muted text-xs uppercase font-semibold tracking-wider">{label}</dt>
      <dd className="text-ink font-semibold text-right">{value}</dd>
    </div>
  );
}

function ContentRenderer({ body = [] }) {
  if (body.length === 0) {
    return <p className="text-sm text-ink-muted">This item doesn't have body content yet.</p>;
  }
  return (
    <div className="space-y-4">
      {body.map((section, i) => {
        if (section.type === 'heading') {
          return <h3 key={i} className="text-base font-bold text-ink mt-2">{section.text}</h3>;
        }
        if (section.type === 'paragraph') {
          return <p key={i} className="text-sm text-ink leading-relaxed">{section.text}</p>;
        }
        if (section.type === 'bullets') {
          return (
            <ul key={i} className="space-y-1.5 list-none">
              {section.items.map((it, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-ink">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                  <span className="leading-relaxed">{it}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (section.type === 'table') {
          return (
            <div key={i} className="overflow-x-auto -mx-1 rounded-xl border border-line">
              <table className="w-full">
                <thead className="bg-surface-alt">
                  <tr>
                    {section.columns.map((c, k) => (
                      <th key={k} className="px-3 py-2 text-left text-[11px] uppercase tracking-wider font-bold text-ink-muted">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {section.rows.map((row, r) => (
                    <tr key={r} className="hover:bg-surface-soft transition-colors">
                      {row.map((cell, c) => (
                        <td key={c} className="px-3 py-2 text-sm text-ink">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}
