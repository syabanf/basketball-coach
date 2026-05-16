import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Tabs } from '../../components/ui/Tabs.jsx';
import { Select } from '../../components/ui/Form.jsx';
import { Popover, MenuItem, MenuDivider } from '../../components/ui/Popover.jsx';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog.jsx';
import { PlayFormModal } from '../../components/plays/PlayFormModal.jsx';
import { MiniPlayPreview } from '../../components/board/MiniPlayPreview.jsx';
import { KPI } from '../../components/ui/InsightWidgets.jsx';
import { usePlayStore } from '../../stores/play.store.js';
import { usePlayerStore } from '../../stores/player.store.js';
import { toast } from '../../stores/toast.store.js';
import { formatDate } from '../../lib/format.js';
import { playStats } from '../../lib/analytics-mock.js';
import { cn } from '../../lib/cn.js';

const FILTERS = [
  { value: 'all',     label: 'All' },
  { value: 'Offense', label: 'Offensive' },
  { value: 'Defense', label: 'Defensive' },
  { value: 'tagged',  label: 'Tagged' }
];

const SORTS = [
  { value: 'recent',   label: 'Recently updated' },
  { value: 'title',    label: 'Title (A → Z)' },
  { value: 'ppp',      label: 'Highest PPP' },
  { value: 'efg',      label: 'Highest EFG%' },
  { value: 'success',  label: 'Highest success %' },
  { value: 'usage',    label: 'Most used' },
  { value: 'least',    label: 'Least used' }
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
  const players = usePlayerStore((s) => s.players);

  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('recent');
  const [query, setQuery] = useState('');
  const [form, setForm] = useState({ open: false, play: null });
  const [confirming, setConfirming] = useState(null);

  // Build insights once per play
  const playInsights = useMemo(
    () => plays.map((p) => ({ play: p, stats: playStats(p, players) })),
    [plays, players]
  );

  // Summary metrics
  const offCount = plays.filter((p) => p.category === 'Offense').length;
  const defCount = plays.filter((p) => p.category === 'Defense').length;
  const avgPpp = playInsights.length
    ? (playInsights.reduce((s, x) => s + x.stats.ppp, 0) / playInsights.length).toFixed(2)
    : '—';
  const best = [...playInsights].sort((a, b) => b.stats.ppp - a.stats.ppp)[0];

  // Filter + sort
  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = playInsights.filter(({ play: p }) => {
      const matchesQ = !q || p.title.toLowerCase().includes(q);
      const matchesF = filter === 'all' || filter === 'tagged' || p.category === filter;
      return matchesQ && matchesF;
    });
    const cmp = (a, b) => {
      if (sort === 'title')   return a.play.title.localeCompare(b.play.title);
      if (sort === 'ppp')     return b.stats.ppp - a.stats.ppp;
      if (sort === 'efg')     return b.stats.efgPct - a.stats.efgPct;
      if (sort === 'success') return b.stats.successPct - a.stats.successPct;
      if (sort === 'usage')   return b.stats.usagePct - a.stats.usagePct;
      if (sort === 'least')   return a.stats.usagePct - b.stats.usagePct;
      return (b.play.updatedAt || '').localeCompare(a.play.updatedAt || '');
    };
    return [...list].sort(cmp);
  }, [playInsights, query, filter, sort]);

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
    try { await navigator.clipboard.writeText(link); toast.success('Share link copied'); }
    catch { toast.info(link); }
  };

  const handleDuplicate = (p) => {
    upsertPlay({ ...p, id: `play_${Math.random().toString(36).slice(2, 8)}`, title: `${p.title} (Copy)` });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Plays</h1>
          <p className="text-sm text-ink-muted mt-1">Tactical playbook with usage and efficiency insights.</p>
        </div>
        <Button leftIcon={<Icon.Plus size={16} />} onClick={openNew}>New Play</Button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Total Plays" value={plays.length}                hint={`${offCount} offense · ${defCount} defense`} tone="navy"    icon={<Icon.Plays size={18} />} />
        <KPI label="Avg PPP"     value={avgPpp}                       hint="across playbook" tone="success" icon={<Icon.Analytics size={18} />} />
        <KPI label="Top Play"    value={best?.stats.ppp ?? '—'}       hint={best ? best.play.title : ''} tone="brand"   icon={<Icon.Board size={18} />} />
        <KPI label="Categories"  value={new Set(plays.map(p => p.category)).size} hint="distinct categories" tone="warning" icon={<Icon.Library size={18} />} />
      </div>

      <Card padded={false}>
        <div className="p-4 sm:p-5 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between border-b border-line">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:flex-1 min-w-0">
            <div className="w-full sm:max-w-sm">
              <Input
                placeholder="Search plays…"
                leftIcon={<Icon.Search size={16} />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-56">
              <Select value={sort} onChange={(e) => setSort(e.target.value)}>
                {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </Select>
            </div>
          </div>
          <Tabs value={filter} onChange={setFilter} items={FILTERS} className="!border-b-0" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-5">
          {filteredSorted.map(({ play: p, stats }) => (
            <article
              key={p.id}
              className="rounded-2xl border border-line hover:border-brand-300 hover:shadow-card transition-all p-4 bg-white"
            >
              <div
                onClick={() => handleOpenInBoard(p.id)}
                className="relative aspect-video rounded-lg bg-surface-alt grid place-items-center mb-3 overflow-hidden cursor-pointer"
              >
                <MiniPlayPreview scene={p.scene} size={120} />
                {/* PPP bubble */}
                <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-white/95 backdrop-blur shadow-card border border-line">
                  <div className="text-[9px] uppercase font-bold text-ink-muted leading-none">PPP</div>
                  <div className="text-sm font-extrabold text-emerald-600 tabular-nums leading-tight">{stats.ppp}</div>
                </div>
                {/* Usage bubble */}
                <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-white/95 backdrop-blur shadow-card border border-line">
                  <div className="text-[9px] uppercase font-bold text-ink-muted leading-none">Usage</div>
                  <div className="text-sm font-extrabold text-brand-600 tabular-nums leading-tight">{stats.usagePct}%</div>
                </div>
              </div>

              <div className="flex items-start justify-between gap-2">
                <button onClick={() => handleOpenInBoard(p.id)} className="min-w-0 text-left">
                  <div className="font-semibold text-ink truncate hover:text-brand-600">{p.title}</div>
                  <div className="text-xs text-ink-muted mt-0.5">Updated {formatDate(p.updatedAt)}</div>
                </button>
                <Popover content={(close) => (
                  <div>
                    <MenuItem icon={Icon.Board}     onClick={() => { handleOpenInBoard(p.id); close(); }}>Open in Board</MenuItem>
                    <MenuItem icon={Icon.Analytics} onClick={() => { navigate('/analytics'); close(); }}>View analytics</MenuItem>
                    <MenuItem icon={Icon.Pencil}    onClick={() => { openEdit(p); close(); }}>Edit</MenuItem>
                    <MenuItem icon={Icon.Share}     onClick={() => { handleShare(p); close(); }}>Share link</MenuItem>
                    <MenuItem icon={Icon.Save}      onClick={() => { handleDuplicate(p); close(); }}>Duplicate</MenuItem>
                    <MenuDivider />
                    <MenuItem icon={Icon.Trash} danger onClick={() => { setConfirming(p); close(); }}>Delete</MenuItem>
                  </div>
                )}>
                  <button className="text-ink-muted h-8 w-8 grid place-items-center rounded-lg hover:bg-surface-soft">
                    <Icon.More size={16} />
                  </button>
                </Popover>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-md bg-surface-alt p-1.5">
                  <div className="text-[9px] uppercase font-bold text-ink-muted">EFG</div>
                  <div className="text-xs font-bold text-ink tabular-nums">{stats.efgPct}%</div>
                </div>
                <div className="rounded-md bg-surface-alt p-1.5">
                  <div className="text-[9px] uppercase font-bold text-ink-muted">Success</div>
                  <div className="text-xs font-bold text-brand-600 tabular-nums">{stats.successPct}%</div>
                </div>
                <div className="rounded-md bg-surface-alt p-1.5">
                  <div className="text-[9px] uppercase font-bold text-ink-muted">Run</div>
                  <div className="text-xs font-bold text-navy-700 tabular-nums">{stats.timesRun}</div>
                </div>
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => <Badge key={t} tone="brand">{t}</Badge>)}
              </div>
            </article>
          ))}
        </div>

        {filteredSorted.length === 0 && (
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
