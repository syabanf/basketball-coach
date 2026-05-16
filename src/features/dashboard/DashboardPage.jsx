import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { Avatar } from '../../components/ui/Avatar.jsx';
import { Button } from '../../components/ui/Button.jsx';
import { Icon } from '../../components/ui/Icon.jsx';
import { KPI, Sparkline, Pill } from '../../components/ui/InsightWidgets.jsx';
import { MiniPlayPreview } from '../../components/board/MiniPlayPreview.jsx';
import { usePlayStore } from '../../stores/play.store.js';
import { usePlayerStore } from '../../stores/player.store.js';
import { useScheduleStore } from '../../stores/schedule.store.js';
import { notifications, team, coach } from '../../data/team.js';
import { playStats } from '../../lib/analytics-mock.js';
import { workloadSummary, teamAverages, statusBreakdown } from '../../lib/team-insights.js';
import { fromISODate, formatDateLong, formatDateShort } from '../../lib/calendar.js';
import { cn } from '../../lib/cn.js';

const TYPE_TONE = { training: 'brand', match: 'success', rest: 'neutral', meeting: 'warning' };

export function DashboardPage() {
  const navigate = useNavigate();
  const plays = usePlayStore((s) => s.plays);
  const setActivePlay = usePlayStore((s) => s.setActivePlay);
  const players = usePlayerStore((s) => s.players);
  const events = useScheduleStore((s) => s.events);

  const openPlay = (id) => { setActivePlay(id); navigate('/board'); };

  // Derived insights ─────────────────────────────────────────────────────
  const status = statusBreakdown(players);
  const avgOvr = players.length ? Math.round(players.reduce((a, p) => a + p.overall, 0) / players.length) : 0;
  const strengthAvgs = teamAverages(players).sort((a, b) => b.value - a.value);
  const topStrengths = strengthAvgs.slice(0, 3);

  // Per-play stats — sort by PPP to surface top performers
  const playInsights = useMemo(
    () => plays.map((p) => ({ play: p, stats: playStats(p, players) }))
              .sort((a, b) => b.stats.ppp - a.stats.ppp),
    [plays, players]
  );
  const topPlays = playInsights.slice(0, 3);
  const underused = [...playInsights].sort((a, b) => a.stats.usagePct - b.stats.usagePct)[0];

  // Schedule reference: use the seed window so cards stay populated
  const refDate = new Date('2024-05-16T00:00:00');
  const weekStart = new Date(refDate); weekStart.setDate(refDate.getDate() - ((refDate.getDay() + 6) % 7));
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);
  const weekEvents = events.filter((e) => {
    const d = fromISODate(e.date);
    return d >= weekStart && d <= weekEnd;
  });
  const workload = workloadSummary(weekEvents);

  // Next 3 upcoming events from refDate
  const upcoming = [...events]
    .filter((e) => fromISODate(e.date) >= refDate)
    .sort((a, b) => a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date))
    .slice(0, 3);

  const nextMatch = events
    .filter((e) => e.type === 'match' && fromISODate(e.date) >= refDate)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  // Mock weekly trend (plays added per week — last 6)
  const playsTrend = [2, 3, 1, 4, 2, 5];

  // Recent activity feed (mocked)
  const activity = [
    { who: 'Coach Kevin',  what: 'updated the starting lineup',                when: '2h',  icon: Icon.Lineup },
    { who: 'Rian Saputra', what: 'added "Floppy variations" to the library',  when: '5h',  icon: Icon.Library },
    { who: 'Coach Kevin',  what: 'edited "High Pick and Roll"',                when: '1d',  icon: Icon.Pencil },
    { who: 'Hendro Lim',   what: 'uploaded Q3 highlight cuts',                 when: '2d',  icon: Icon.Plays },
    { who: 'Coach Kevin',  what: 'scheduled "Scrimmage" on Thu',               when: '3d',  icon: Icon.Schedule }
  ];

  return (
    <div className="space-y-5">
      {/* Hero greeting */}
      <Card className="bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 !p-6 sm:!p-7 border-0 text-white shadow-pop">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs uppercase font-bold tracking-wider text-white/80">{formatDateLong(refDate)}</div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
              Welcome back, {coach.name.replace('Coach ', '')}.
            </h1>
            <p className="text-sm text-white/85 mt-1.5 max-w-2xl">
              {nextMatch
                ? <>Next match — <span className="font-semibold">{nextMatch.title}</span> on {formatDateShort(fromISODate(nextMatch.date))} at {nextMatch.time}.</>
                : 'No matches scheduled this week — focus on training and film.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" leftIcon={<Icon.Board size={16} />} onClick={() => navigate('/board')}>Open Board</Button>
            <Button variant="navy" leftIcon={<Icon.Lineup size={16} />} onClick={() => navigate('/lineup')}>Set Lineup</Button>
          </div>
        </div>
      </Card>

      {/* KPI grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Plays" value={plays.length} hint={`${plays.filter(p => p.category === 'Offense').length} offense · ${plays.filter(p => p.category === 'Defense').length} defense`} tone="brand" icon={<Icon.Plays size={18} />} />
        <KPI label="Roster" value={players.length} hint={`${status.starter} starters · ${status.rotation} rotation · ${status.bench} bench`} tone="navy" icon={<Icon.Players size={18} />} />
        <KPI label="Avg OVR" value={avgOvr} hint={`Top strength: ${topStrengths[0]?.label || '—'}`} tone="success" icon={<Icon.Analytics size={18} />} />
        <KPI label="This Week" value={`${workload.trainingHours}h`} hint={`${workload.counts.training} training · ${workload.counts.match} match`} tone="warning" icon={<Icon.Schedule size={18} />} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <QuickAction onClick={() => navigate('/board')} accent="brand" icon={<Icon.Board size={22} />}
          title="Design a play" subtitle="Open the Court Board" />
        <QuickAction onClick={() => navigate('/lineup')} icon={<Icon.Lineup size={22} className="text-brand-600" />}
          title="Adjust lineup" subtitle={`${status.starter}/5 starters set`} />
        <QuickAction onClick={() => navigate('/analytics')} icon={<Icon.Analytics size={22} className="text-brand-600" />}
          title="Tactic insights" subtitle="Per-play analytics" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
        {/* Top performing plays */}
        <Card>
          <CardHeader
            title="Top Performing Plays"
            subtitle="Ranked by points per possession"
            action={
              <button onClick={() => navigate('/analytics')} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                Open analytics →
              </button>
            }
          />
          <ul className="space-y-2.5">
            {topPlays.map(({ play, stats }, i) => (
              <li key={play.id}>
                <button
                  onClick={() => openPlay(play.id)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-soft transition-colors text-left"
                >
                  <div className={cn(
                    'h-7 w-7 rounded-lg grid place-items-center font-bold text-xs shrink-0',
                    i === 0 ? 'bg-brand-500 text-white' : 'bg-surface-soft text-ink-muted'
                  )}>{i + 1}</div>
                  <div className="h-10 w-10 rounded-lg bg-surface-soft grid place-items-center shrink-0">
                    <MiniPlayPreview scene={play.scene} size={34} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-ink truncate">{play.title}</div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-muted">
                      <span>{play.category}</span>
                      <span>·</span>
                      <span>{stats.timesRun} runs</span>
                      <span>·</span>
                      <span>EFG {stats.efgPct}%</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase font-bold text-ink-muted">PPP</div>
                    <div className="text-xl font-extrabold text-emerald-600 tabular-nums leading-none">{stats.ppp}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
          {underused && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <span className="h-7 w-7 grid place-items-center rounded-lg bg-amber-500 text-white text-xs font-bold shrink-0">!</span>
              <div className="flex-1 text-sm">
                <span className="font-semibold text-ink">Underused: </span>
                <span className="text-ink">{underused.play.title}</span>
                <span className="text-ink-muted"> — only {underused.stats.usagePct}% of possessions. Consider revisiting.</span>
              </div>
            </div>
          )}
        </Card>

        {/* Team pulse */}
        <Card>
          <CardHeader title="Team Pulse" subtitle="Roster strengths at a glance" />
          <ul className="space-y-2.5">
            {strengthAvgs.map((s) => (
              <li key={s.key} className="flex items-center gap-3">
                <span className="text-sm text-ink-muted w-24 shrink-0">{s.label}</span>
                <div className="flex-1 h-2 rounded-full bg-surface-soft overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${s.value}%` }} />
                </div>
                <span className="w-8 text-right text-sm font-bold text-ink tabular-nums">{s.value}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
              <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-700">Strongest</div>
              <div className="font-semibold text-ink mt-0.5">{topStrengths[0]?.label}</div>
              <div className="text-emerald-700 text-xs font-bold">{topStrengths[0]?.value} avg</div>
            </div>
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <div className="text-[10px] uppercase tracking-wider font-bold text-amber-700">Develop</div>
              <div className="font-semibold text-ink mt-0.5">{strengthAvgs[strengthAvgs.length - 1]?.label}</div>
              <div className="text-amber-700 text-xs font-bold">{strengthAvgs[strengthAvgs.length - 1]?.value} avg</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5">
        {/* Next up */}
        <Card>
          <CardHeader
            title="Coming Up"
            subtitle="Next 3 scheduled events"
            action={
              <button onClick={() => navigate('/schedule')} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                Schedule →
              </button>
            }
          />
          {upcoming.length === 0 ? (
            <div className="text-sm text-ink-muted py-3">No upcoming events.</div>
          ) : (
            <ul className="space-y-2">
              {upcoming.map((e) => {
                const d = fromISODate(e.date);
                return (
                  <li key={e.id}>
                    <button onClick={() => navigate('/schedule')} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-surface-soft text-left">
                      <div className="h-12 w-12 rounded-xl bg-surface-alt grid place-items-center shrink-0 border border-line">
                        <div className="text-[10px] font-bold uppercase leading-none text-ink-muted">
                          {d.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-base font-extrabold leading-none mt-0.5 text-ink">{d.getDate()}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm text-ink truncate">{e.title}</div>
                        <div className="text-xs text-ink-muted">{d.toLocaleDateString('en-US', { weekday: 'short' })} · {e.time}</div>
                      </div>
                      <Pill tone={TYPE_TONE[e.type] || 'brand'}>{e.type}</Pill>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-4 p-3 rounded-xl bg-surface-alt flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-ink-muted">This week load</div>
              <div className="text-sm font-semibold text-ink">{workload.trainingHours}h · {workload.total} events</div>
            </div>
            <Pill tone={workload.intensity.tone}>{workload.intensity.label}</Pill>
          </div>
        </Card>

        {/* Recent activity */}
        <Card>
          <CardHeader
            title="Recent Activity"
            subtitle="What's changed across the team"
            action={
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-ink-muted">Plays/wk</span>
                <div className="w-16 h-8"><Sparkline values={playsTrend} /></div>
              </div>
            }
          />
          <ol className="relative pl-5 border-l-2 border-line space-y-3">
            {activity.map((a, i) => {
              const I = a.icon;
              return (
                <li key={i} className="relative">
                  <span className="absolute -left-[27px] top-0.5 h-5 w-5 grid place-items-center rounded-full bg-brand-500 text-white">
                    <I size={11} />
                  </span>
                  <div className="text-sm text-ink leading-tight">
                    <span className="font-semibold">{a.who}</span> {a.what}
                  </div>
                  <div className="text-[11px] text-ink-muted mt-0.5">{a.when} ago</div>
                </li>
              );
            })}
          </ol>
        </Card>
      </div>

      {/* Bottom row: notifications + plays/players cross-link */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
        <Card>
          <CardHeader title="Notifications" action={<button onClick={() => {}} className="text-sm font-semibold text-brand-600 hover:text-brand-700">Mark all read</button>} />
          <ul className="space-y-2.5">
            {notifications.map((n) => (
              <li key={n.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-surface-soft">
                <div className={`mt-1 h-2 w-2 rounded-full ${n.unread ? 'bg-brand-500' : 'bg-line'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink">{n.title}</div>
                  <div className="text-xs text-ink-muted">{n.body}</div>
                </div>
                <div className="text-[11px] text-ink-subtle">{n.time}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Roster spotlight"
            subtitle="Highest-rated player on the team"
          />
          {(() => {
            const top = [...players].sort((a, b) => b.overall - a.overall)[0];
            if (!top) return null;
            return (
              <button onClick={() => navigate('/players')} className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-surface-soft text-left">
                <div className="relative">
                  <Avatar name={top.name} size="xl" ring />
                  <div className="absolute -bottom-1 -left-1 h-7 min-w-7 px-1.5 grid place-items-center bg-brand-500 text-white font-bold text-xs rounded-lg shadow-card">
                    {top.jersey}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-bold text-ink truncate">{top.name}</div>
                  <div className="text-sm text-brand-600 font-medium">{top.positionLong}</div>
                  <div className="text-xs text-ink-muted mt-1">{top.height} cm · {top.weight} kg · Age {top.age}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {Object.entries(top.attributes).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, v]) => (
                      <Badge key={k} tone="brand">{k.replace(/([A-Z])/g, ' $1').replace(/^\w/, (s) => s.toUpperCase())} {v}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-bold text-ink-muted">OVR</div>
                  <div className="text-4xl font-extrabold text-brand-600 tabular-nums leading-none">{top.overall}</div>
                </div>
              </button>
            );
          })()}
          <div className="mt-3 text-right">
            <button onClick={() => navigate('/players')} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              View all players →
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({ onClick, icon, title, subtitle, accent }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-2xl p-4 text-left shadow-card hover:shadow-pop transition-shadow',
        accent === 'brand'
          ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white'
          : 'bg-white border border-line text-ink'
      )}
    >
      <div className={cn('h-9 w-9 grid place-items-center rounded-xl', accent === 'brand' ? 'bg-white/15 text-white' : 'bg-brand-50 text-brand-600')}>
        {icon}
      </div>
      <div className="mt-2 font-bold">{title}</div>
      <div className={cn('text-xs mt-0.5', accent === 'brand' ? 'text-white/85' : 'text-ink-muted')}>{subtitle}</div>
    </button>
  );
}
