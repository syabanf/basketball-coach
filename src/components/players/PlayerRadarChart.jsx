import { attributeKeys } from '../../data/players.js';

// Pure-SVG radar chart for player attributes (no chart lib).
export function PlayerRadarChart({ attributes, size = 220 }) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.42;
  const axes = attributeKeys;
  const n = axes.length;

  const point = (i, valuePct) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = radius * valuePct;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const polygonPoints = axes
    .map((a, i) => {
      const v = (attributes?.[a.key] ?? 0) / 100;
      const [x, y] = point(i, v);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#EE3C3B" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#EE3C3B" stopOpacity="0.18" />
        </radialGradient>
      </defs>

      {/* Grid hexagons */}
      {gridLevels.map((lv, idx) => (
        <polygon
          key={idx}
          points={axes
            .map((_, i) => {
              const [x, y] = point(i, lv);
              return `${x},${y}`;
            })
            .join(' ')}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={idx === gridLevels.length - 1 ? 1.4 : 1}
        />
      ))}

      {/* Axes */}
      {axes.map((_, i) => {
        const [x, y] = point(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E2E8F0" strokeWidth="1" />;
      })}

      {/* Filled polygon */}
      <polygon points={polygonPoints} fill="url(#radarFill)" stroke="#EE3C3B" strokeWidth="2" />

      {/* Vertex dots */}
      {axes.map((a, i) => {
        const v = (attributes?.[a.key] ?? 0) / 100;
        const [x, y] = point(i, v);
        return <circle key={i} cx={x} cy={y} r="3" fill="#EE3C3B" />;
      })}
    </svg>
  );
}
