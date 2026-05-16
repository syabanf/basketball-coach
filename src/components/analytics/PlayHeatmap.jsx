/**
 * Half-court SVG with a colored heatmap grid overlay.
 * `cells` is a flat array of intensities (0..1), shaped `cols × rows`.
 */
export function PlayHeatmap({ cells, cols = 9, rows = 6 }) {
  const W = 540;
  const H = 360;
  const padX = 20;
  const padY = 20;
  const cellW = (W - padX * 2) / cols;
  const cellH = (H - padY * 2) / rows;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto block">
      <defs>
        <linearGradient id="heatLegend" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#FFE0E0" />
          <stop offset="50%"  stopColor="#FA8585" />
          <stop offset="100%" stopColor="#B01C1B" />
        </linearGradient>
      </defs>

      <rect width={W} height={H} rx="14" fill="#F8FAFC" />

      {/* Cells */}
      {cells.map((v, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <rect
            key={i}
            x={padX + col * cellW + 1}
            y={padY + row * cellH + 1}
            width={cellW - 2}
            height={cellH - 2}
            rx="4"
            fill="#EE3C3B"
            opacity={0.08 + v * 0.7}
          />
        );
      })}

      {/* Court overlays */}
      <rect x="10" y="10" width="520" height="340" rx="10" fill="none" stroke="#242424" strokeWidth="2" />
      <line x1="10" y1={H * 0.55} x2="530" y2={H * 0.55} stroke="#242424" strokeWidth="1.5" opacity="0.5" />
      <circle cx={W / 2} cy="40" r="22" fill="none" stroke="#242424" strokeWidth="2" />
      <path d={`M ${W / 2} 40 m -130 0 a 130 130 0 0 0 260 0`} fill="none" stroke="#242424" strokeWidth="2" />
      <rect x={W / 2 - 60} y="14" width="120" height="120" fill="none" stroke="#242424" strokeWidth="1.5" opacity="0.7" />

      {/* Legend */}
      <g transform={`translate(${W - 168}, ${H - 24})`}>
        <text x="0" y="-6" fontSize="9" fill="#6E6E6E" fontWeight="600">Low</text>
        <rect x="20" y="-12" width="100" height="10" rx="5" fill="url(#heatLegend)" />
        <text x="130" y="-6" fontSize="9" fill="#6E6E6E" fontWeight="600">High</text>
      </g>
    </svg>
  );
}
