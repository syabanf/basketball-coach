import { Avatar } from '../ui/Avatar.jsx';

export function PlayerEffectivenessList({ players }) {
  if (!players?.length) return <div className="text-sm text-ink-muted">No data.</div>;
  const max = Math.max(...players.map((p) => p.effectiveness));
  return (
    <ul className="space-y-2.5">
      {players.map((p, i) => {
        const widthPct = (p.effectiveness / Math.max(max, 1)) * 100;
        return (
          <li key={p.id} className="flex items-center gap-3">
            <div className="w-5 text-xs font-bold text-ink-subtle text-right">{i + 1}</div>
            <Avatar name={p.name} size="sm" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="text-sm font-semibold text-ink truncate">
                  {p.name}
                  <span className="ml-2 text-[11px] text-ink-muted font-normal">#{p.jersey} · {p.position}</span>
                </div>
                <div className="text-sm font-bold text-brand-600 tabular-nums">{p.effectiveness}</div>
              </div>
              <div className="h-2 rounded-full bg-surface-soft overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
