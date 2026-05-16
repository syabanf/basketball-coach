import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Tabs } from '../../components/ui/Tabs.jsx';
import { Popover, MenuItem, MenuDivider } from '../../components/ui/Popover.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { PlayFormModal } from '../../components/plays/PlayFormModal.jsx';
import { MiniPlayPreview } from '../../components/board/MiniPlayPreview.jsx';
import { usePlayStore } from '../../stores/play.store.js';
import { toast } from '../../stores/toast.store.js';
import { formatDate } from '../../lib/format.js';

const FILTERS = [
  { value: 'all',     label: 'All' },
  { value: 'Offense', label: 'Offensive' },
  { value: 'Defense', label: 'Defensive' },
  { value: 'tagged',  label: 'Tagged' }
];

const DEFAULT_SCENE = () => ({
  players: [
    { id: 't1', label: '1', x: 500, y: 760, hasBall: true },
    { id: 't2', label: '2', x: 820, y: 540 },
    { id: 't3', label: '3', x: 180, y: 540 },
    { id: 't4', label: '4', x: 380, y: 360 },
    { id: 't5', label: '5', x: 620, y: 360 }
  ],
  drawings: []
});

export function PlaysPage() {
  const navigate = useNavigate();
  const plays = usePlayStore((s) => s.plays);
  const setActivePlay = usePlayStore((s) => s.setActivePlay);
  const upsertPlay = usePlayStore((s) => s.upsertPlay);
  const deletePlay = usePlayStore((s) => s.deletePlay);

  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ open: false, play: null });
  const [confirming, setConfirming] = useState(null);

  const filtered = plays.filter((p) => {
    const matchesQ = p.title.toLowerCase().includes(query.toLowerCase());
    const matchesF = filter === 'all' || filter === 'tagged' || p.category === filter;
    return matchesQ && matchesF;
  });

  const handleOpenInBoard = (id) => { setActivePlay(id); navigate('/board'); };
  const openNew  = () => setForm({ open: true, play: null });
  const openEdit = (p) => setForm({ open: true, play: p });

  const submitForm = (payload) => {
    if (form.play) {
      upsertPlay({ ...form.play, ...payload });
    } else {
      const id = `play_${Math.random().toString(36).slice(2, 8)}`;
      upsertPlay({ id, ...payload, scene: DEFAULT_SCENE() });
      setActivePlay(id);
    }
    setForm({ open: false, play: null });
  };

  const handleShare = async (p) => {
    const link = `${window.location.origin}/board?play=${p.id}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Share link copied');
    } catch {
      toast.info(link);
    }
  };

  const handleDuplicate = (p) => {
    upsertPlay({ ...p, id: `play_${Math.random().toString(36).slice(2, 8)}`, title: `${p.title} (Copy)` });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Plays</h1>
          <p className="text-sm text-ink-muted mt-1">All saved offensive and defensive plays.</p>
        </div>
        <Button leftIcon={<Icon.Plus size={16} />} onClick={openNew}>New Play</Button>
      </div>

      <Card padded={false}>
        <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between border-b border-line">
          <div className="w-full sm:max-w-md">
            <Input
              placeholder="Search plays…"
              leftIcon={<Icon.Search size={16} />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Tabs value={filter} onChange={setFilter} items={FILTERS} className="!border-b-0" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="rounded-2xl border border-line hover:border-brand-300 hover:shadow-card transition-all p-4"
            >
              <div
                onClick={() => handleOpenInBoard(p.id)}
                className="aspect-video rounded-lg bg-surface-alt grid place-items-center mb-3 overflow-hidden cursor-pointer"
              >
                <MiniPlayPreview scene={p.scene} size={120} />
              </div>
              <div className="flex items-start justify-between gap-2">
                <button onClick={() => handleOpenInBoard(p.id)} className="min-w-0 text-left">
                  <div className="font-semibold text-ink truncate hover:text-brand-600">{p.title}</div>
                  <div className="text-xs text-ink-muted mt-0.5">Updated {formatDate(p.updatedAt)}</div>
                </button>
                <Popover content={(close) => (
                  <div>
                    <MenuItem icon={Icon.Board}  onClick={() => { handleOpenInBoard(p.id); close(); }}>Open in Board</MenuItem>
                    <MenuItem icon={Icon.Pencil} onClick={() => { openEdit(p); close(); }}>Edit</MenuItem>
                    <MenuItem icon={Icon.Share}  onClick={() => { handleShare(p); close(); }}>Share link</MenuItem>
                    <MenuItem icon={Icon.Save}   onClick={() => { handleDuplicate(p); close(); }}>Duplicate</MenuItem>
                    <MenuDivider />
                    <MenuItem icon={Icon.Trash} danger onClick={() => { setConfirming(p); close(); }}>Delete</MenuItem>
                  </div>
                )}>
                  <button className="text-ink-muted h-8 w-8 grid place-items-center rounded-lg hover:bg-surface-soft">
                    <Icon.More size={16} />
                  </button>
                </Popover>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => <Badge key={t} tone="brand">{t}</Badge>)}
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-ink-muted">No plays match your filter.</div>
        )}
      </Card>

      <PlayFormModal
        open={form.open}
        onClose={() => setForm({ open: false, play: null })}
        play={form.play}
        onSubmit={submitForm}
      />
      <ConfirmDialog
        open={Boolean(confirming)}
        onClose={() => setConfirming(null)}
        title="Delete play?"
        description={confirming ? `"${confirming.title}" will be removed permanently.` : ''}
        confirmLabel="Delete"
        tone="danger"
        onConfirm={() => deletePlay(confirming.id)}
      />
    </div>
  );
}
