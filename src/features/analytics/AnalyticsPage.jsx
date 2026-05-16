import { Card, CardHeader } from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Badge.jsx';
import { PlayerRadarChart } from '../../components/players/PlayerRadarChart.jsx';
import { usePlayerStore } from '../../stores/player.store.js';

/** Simple SVG shot heatmap — coarse grid colored by frequency. */
function ShotHeatmap() {
  const cells = Array.from({ length: 9 * 6 }, (_, i) => Math.random());
  return (
    <svg viewBox="0 0 540 360" className="w-full h-auto">
      <rect width="540" height="360" rx="14" fill="#F8FAFC" />
      <rect x="10" y="10" width="520" height="340" rx="10" fill="none" stroke="#E2E8F0" />
      {cells.map((v, i) => {
        const col = i % 9;
        const row = Math.floor(i / 9);
        const opacity = 0.1 + v * 0.7;
        return (
          <rect
            key={i}
            x={20 + col * 56}
            y={20 + row * 54}
            width="50"
            height="48"
            rx="6"
            fill="#EE3C3B"
            opacity={opacity}
          />
        );
      })}
      <circle cx="270" cy="40" r="22" fill="none" stroke="#242424" strokeWidth="2" />
      <path d="M 270 40 m -110 0 a 110 110 0 0 0 220 0" fill="none" stroke="#242424" strokeWidth="2" />
    </svg>
  );
}

export function AnalyticsPage() {
  const players = usePlayerStore((s) => s.players);
  const featured = players[0];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">Analytics</h1>
        <p className="text-sm text-ink-muted mt-1">Team performance, player attributes, and AI-driven tactical insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardHeader title="Shooting Heatmap" subtitle="Last 10 games" action={<Badge tone="brand">Demo</Badge>} />
          <ShotHeatmap />
        </Card>

        <Card>
          <CardHeader title="Player Radar" subtitle={featured?.name} />
          <div className="grid place-items-center">
            <PlayerRadarChart attributes={featured?.attributes} size={280} />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="AI Tactical Insights" subtitle="Suggested adjustments based on recent data" />
        <ul className="space-y-3">
          {[
            { title: 'Increase pick-and-roll frequency', body: 'Your OFF rating climbs 11.4 points when running PnR via PG1.', tone: 'brand' },
            { title: 'Switch to drop coverage vs Garuda BC', body: 'Opponent shoots 31% vs drop, 41% vs hedge over last 5 matchups.', tone: 'starter' },
            { title: 'Watch backside cuts on Floppy', body: 'Defense overcommits to first option — backdoor opening 38% of reps.', tone: 'rotation' }
          ].map((i, idx) => (
            <li key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-soft">
              <div className="mt-0.5"><Badge tone={i.tone}>AI</Badge></div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-ink">{i.title}</div>
                <div className="text-sm text-ink-muted">{i.body}</div>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
