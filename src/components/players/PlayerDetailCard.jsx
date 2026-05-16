import { Avatar } from '../ui/Avatar.jsx';
import { Card } from '../ui/Card.jsx';
import { PlayerRadarChart } from './PlayerRadarChart.jsx';
import { attributeKeys } from '../../data/players.js';

export function PlayerDetailCard({ player }) {
  if (!player) return null;
  return (
    <Card>
      <h3 className="text-lg font-semibold text-ink mb-4">Player Detail</h3>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative">
          <Avatar name={player.name} size="xl" />
          <div className="absolute -bottom-1 -left-1 h-7 min-w-7 px-1.5 grid place-items-center bg-brand-500 text-white font-bold text-xs rounded-lg shadow-card">
            {player.jersey}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold text-ink leading-tight truncate">{player.name}</div>
          <div className="text-sm text-brand-600 font-medium">{player.positionLong}</div>
          <div className="text-xs text-ink-muted mt-1">
            {player.height} cm · {player.weight} kg · Age {player.age}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase font-bold text-ink-muted">OVR</div>
          <div className="text-4xl font-extrabold text-brand-600 leading-none">{player.overall}</div>
        </div>
      </div>

      <div className="mb-3 font-semibold text-ink">Attributes</div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
        <div className="sm:col-span-2 grid place-items-center">
          <PlayerRadarChart attributes={player.attributes} size={220} />
        </div>
        <ul className="sm:col-span-3 space-y-2">
          {attributeKeys.map((a) => {
            const v = player.attributes[a.key];
            return (
              <li key={a.key} className="flex items-center gap-3">
                <span className="text-sm text-ink-muted w-28 shrink-0">{a.label}</span>
                <div className="flex-1 h-2 rounded-full bg-surface-soft overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                    style={{ width: `${v}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-ink w-8 text-right">{v}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-5">
        <div className="font-semibold text-ink mb-1.5">Notes</div>
        <p className="text-sm text-ink-muted leading-relaxed">{player.notes}</p>
      </div>
    </Card>
  );
}
