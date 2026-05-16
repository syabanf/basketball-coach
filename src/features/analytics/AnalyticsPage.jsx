import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { Select, FormField } from '../../components/ui/Form.jsx';
import { MiniPlayPreview } from '../../components/board/MiniPlayPreview.jsx';
import { PlayHeatmap } from '../../components/analytics/PlayHeatmap.jsx';
import { PlayerEffectivenessList } from '../../components/analytics/PlayerEffectivenessList.jsx';
import { DefenseBreakdown, UsageTrend } from '../../components/analytics/DefenseBreakdown.jsx';
import { usePlayStore } from '../../stores/play.store.js';
import { usePlayerStore } from '../../stores/player.store.js';
import { playStats } from '../../lib/analytics-mock.js';
import { cn } from '../../lib/cn.js';

const Tile = ({ label, value, hint, accent = 'brand' }) => {
  const tones = {
    brand:   'text-brand-600',
    navy:    'text-navy-700',
    success: 'text-emerald-600',
    warning: 'text-amber-600'
  };
  return (
    <div className="bg-surface-alt rounded-2xl p-4 border border-line">
      <div className="text-[11px] uppercase tracking-wider text-ink-muted font-bold">{label}</div>
      <div className={cn('mt-1 text-2xl sm:text-3xl font-extrabold tabular-nums', tones[accent] || tones.brand)}>
        {value}
      </div>
      {hint && <div className="text-xs text-ink-muted mt-0.5">{hint}</div>}
    </div>
  );
};

export function AnalyticsPage() {
  const navigate = useNavigate();
  const plays = usePlayStore((s) => s.plays);
  const setActivePlay = usePlayStore((s) => s.setActivePlay);
  const players = usePlayerStore((s) => s.players);

  const [playId, setPlayId] = useState(plays[0]?.id);
  const play = useMemo(() => plays.find((p) => p.id === playId) || plays[0], [plays, playId]);
  const stats = useMemo(() => playStats(play, players), [play, players]);

  if (!play || !stats) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Analytics</h1>
        <Card>
          <div className="text-center py-10 text-ink-muted">No plays available yet.</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Tactic Analytics</h1>
        <p className="text-sm text-ink-muted mt-1">
          Per-play deep dive — usage, efficiency, opponent counters, and player effectiveness.
        </p>
      </div>

      {/* Play selector + summary */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          <div className="lg:w-[320px] shrink-0">
            <FormField label="Play">
              <Select value={playId} onChange={(e) => setPlayId(e.target.value)}>
                {plays.map((p) => (
                  <option key={p.id} value={p.id}>{p.title} — {p.category}</option>
                ))}
              </Select>
            </FormField>
          </div>

          <div className="flex-1 flex items-center gap-4 min-w-0">
            <div className="h-14 w-14 rounded-xl bg-surface-soft grid place-items-center shrink-0">
              <MiniPlayPreview scene={play.scene} size={44} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-ink truncate">{play.title}</h2>
                {play.tags.map((t) => <Badge key={t} tone="brand">{t}</Badge>)}
              </div>
              <p className="text-sm text-ink-muted line-clamp-2 mt-0.5">{play.description}</p>
            </div>
          </div>

          <Button
            variant="secondary"
            leftIcon={<Icon.Board size={16} />}
            onClick={() => { setActivePlay(play.id); navigate('/board'); }}
            className="shrink-0"
          >
            Open in Board
          </Button>
        </div>
      </Card>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Tile label="Times Run"  value={stats.timesRun}     hint="this season" accent="navy" />
        <Tile label="Usage"      value={`${stats.usagePct}%`} hint="of all offensive sets" accent="brand" />
        <Tile label="Points / Possession" value={stats.ppp} hint="(PPP)" accent="success" />
        <Tile label="Success Rate" value={`${stats.successPct}%`} hint="positive outcomes" accent="brand" />
        <Tile label="EFG%"       value={`${stats.efgPct}%`}  hint="effective field goal" accent="navy" />
        <Tile label="Turnover Rate" value={`${stats.turnoverPct}%`} hint="per possession" accent="warning" />
        <Tile label="Avg Length" value={`${stats.possessionSec}s`} hint="possession time" accent="navy" />
        <Tile label="Last 6 Games" value={
          <UsageTrend values={stats.trend} />
        } hint="possession count" accent="brand" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* Shot heatmap */}
        <Card>
          <CardHeader
            title="Shooting Hot Zones"
            subtitle={`Where shots originate when "${play.title}" is run`}
            action={<Badge tone="brand">{stats.timesRun} possessions</Badge>}
          />
          <PlayHeatmap cells={stats.heatmap} cols={stats.heatmapCols} rows={stats.heatmapRows} />
        </Card>

        {/* Player effectiveness */}
        <Card>
          <CardHeader
            title="Top Contributors"
            subtitle="Player effectiveness rating in this play"
          />
          <PlayerEffectivenessList players={stats.topPlayers} />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Defense breakdown */}
        <Card>
          <CardHeader title="Opponent Response" subtitle="Coverage distribution observed" />
          <DefenseBreakdown coverage={stats.coverage} />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">Strength</div>
              <div className="text-sm text-ink mt-0.5">{stats.summary.goodVs}</div>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Watch</div>
              <div className="text-sm text-ink mt-0.5">{stats.summary.watchOut}</div>
            </div>
          </div>
        </Card>

        {/* AI insights */}
        <Card>
          <CardHeader title="AI Tactical Insights" subtitle="Pattern observations from recent reps" />
          <ul className="space-y-3">
            {stats.insights.map((line, i) => (
              <li key={i} className="flex items-start gap-3 p-3 rounded-xl bg-surface-alt">
                <span className="h-7 w-7 grid place-items-center rounded-lg bg-brand-500 text-white text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="text-sm text-ink leading-relaxed">{line}</div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Cross-play summary table */}
      <Card padded={false}>
        <CardHeader
          className="px-5 sm:px-6 pt-5"
          title="All Plays at a Glance"
          subtitle="Quickly compare key metrics across the playbook"
        />
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-ink-muted">
                <th className="px-5 py-2 text-left font-semibold">Play</th>
                <th className="px-3 py-2 text-left font-semibold">Category</th>
                <th className="px-3 py-2 text-right font-semibold">Run</th>
                <th className="px-3 py-2 text-right font-semibold">PPP</th>
                <th className="px-3 py-2 text-right font-semibold">EFG%</th>
                <th className="px-3 py-2 text-right font-semibold">Success</th>
                <th className="px-5 py-2 text-right font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {plays.map((p) => {
                const s = playStats(p, players);
                const active = p.id === playId;
                return (
                  <tr
                    key={p.id}
                    onClick={() => setPlayId(p.id)}
                    className={cn(
                      'cursor-pointer transition-colors',
                      active ? 'bg-brand-50/60' : 'hover:bg-surface-soft'
                    )}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-md bg-surface-soft grid place-items-center">
                          <MiniPlayPreview scene={p.scene} size={26} />
                        </div>
                        <span className="font-semibold text-sm text-ink">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-ink-muted">{p.category}</td>
                    <td className="px-3 py-3 text-sm text-right tabular-nums">{s.timesRun}</td>
                    <td className="px-3 py-3 text-sm font-bold text-emerald-600 text-right tabular-nums">{s.ppp}</td>
                    <td className="px-3 py-3 text-sm text-right tabular-nums">{s.efgPct}%</td>
                    <td className="px-3 py-3 text-sm font-bold text-brand-600 text-right tabular-nums">{s.successPct}%</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPlayId(p.id); }}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                      >
                        View →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
