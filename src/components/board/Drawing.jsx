import { arrowPath, zigzagPath } from '../../lib/board-geometry.js';

// Stroke presets per drawing type.
// All shapes share `points: [{x,y}, ...]` so the canvas can manipulate them uniformly.
const STROKE = {
  arrow:       { stroke: '#FFFFFF', width: 5,   dash: undefined },
  'pass-line': { stroke: '#FFFFFF', width: 4,   dash: '12 10' },
  dribble:     { stroke: '#242424', width: 4.5, dash: undefined },
  cut:         { stroke: '#EE3C3B', width: 5,   dash: undefined },
  circle:      { stroke: '#EE3C3B', width: 4,   dash: undefined, fill: 'rgba(238,60,59,0.10)' },
  rect:        { stroke: '#EE3C3B', width: 4,   dash: '10 8',     fill: 'rgba(238,60,59,0.08)' },
  freehand:    { stroke: '#EE3C3B', width: 4,   dash: undefined },
  text:        { fill: '#FFFFFF', stroke: '#242424' }
};

export function Drawing({ obj, selected, onPointerDown, draft = false }) {
  const cfg = STROKE[obj.type] || STROKE.arrow;
  const handler = (e) => onPointerDown?.(e, obj);

  // Selection halo (skipped while drafting to avoid double-stroke flicker)
  const halo = selected && !draft;

  switch (obj.type) {
    case 'circle': {
      const [c, edge] = obj.points;
      const r = Math.hypot(edge.x - c.x, edge.y - c.y);
      return (
        <g onPointerDown={handler} style={{ cursor: 'pointer' }}>
          {halo && <circle cx={c.x} cy={c.y} r={r + 6} fill="none" stroke="#EE3C3B" strokeWidth={cfg.width + 4} opacity="0.35" />}
          <circle cx={c.x} cy={c.y} r={r} fill={cfg.fill} stroke={cfg.stroke} strokeWidth={cfg.width} />
        </g>
      );
    }

    case 'rect': {
      const [p1, p2] = obj.points;
      const x = Math.min(p1.x, p2.x);
      const y = Math.min(p1.y, p2.y);
      const w = Math.abs(p2.x - p1.x);
      const h = Math.abs(p2.y - p1.y);
      return (
        <g onPointerDown={handler} style={{ cursor: 'pointer' }}>
          {halo && <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx="6" fill="none" stroke="#EE3C3B" strokeWidth={cfg.width + 4} opacity="0.35" />}
          <rect x={x} y={y} width={w} height={h} rx="6" fill={cfg.fill} stroke={cfg.stroke} strokeWidth={cfg.width} strokeDasharray={cfg.dash} />
        </g>
      );
    }

    case 'freehand': {
      if (obj.points.length < 2) return null;
      const d = 'M ' + obj.points.map((p) => `${p.x} ${p.y}`).join(' L ');
      return (
        <g onPointerDown={handler} style={{ cursor: 'pointer' }}>
          {halo && <path d={d} fill="none" stroke="#EE3C3B" strokeWidth={cfg.width + 6} opacity="0.35" strokeLinecap="round" strokeLinejoin="round" />}
          <path d={d} fill="none" stroke={cfg.stroke} strokeWidth={cfg.width} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      );
    }

    case 'text': {
      const [p] = obj.points;
      const label = obj.text || '';
      const width = Math.max(label.length * 11 + 20, 40);
      return (
        <g onPointerDown={handler} style={{ cursor: 'pointer' }} transform={`translate(${p.x}, ${p.y})`}>
          {halo && <rect x={-width / 2 - 4} y={-22} width={width + 8} height={36} rx="10" fill="none" stroke="#EE3C3B" strokeWidth="3" opacity="0.5" />}
          <rect x={-width / 2} y={-18} width={width} height={28} rx="8" fill={cfg.fill} stroke={cfg.stroke} strokeWidth="2" />
          <text x="0" y="0" textAnchor="middle" dominantBaseline="central"
                fill="#242424" fontSize="16" fontWeight="700"
                fontFamily="Inter, sans-serif">
            {label}
          </text>
        </g>
      );
    }

    // arrow / pass-line / dribble / cut
    default: {
      const [p1, p2] = obj.points;
      let d;
      if (obj.type === 'dribble') {
        d = zigzagPath(p1, p2, 8, 12);
      } else if (obj.type === 'pass-line') {
        d = arrowPath(p1, p2, 0);
      } else {
        d = arrowPath(p1, p2, obj.curvature ?? 0);
      }
      const markerId = `arrowhead-${obj.id || obj.type}`;
      return (
        <g onPointerDown={handler} style={{ cursor: 'pointer' }}>
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 12 12"
              refX="10" refY="6"
              markerWidth="6" markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 12 6 L 0 12 z" fill={cfg.stroke} />
            </marker>
          </defs>
          {halo && (
            <path d={d} fill="none" stroke="#EE3C3B" strokeWidth={cfg.width + 6} opacity="0.35" strokeLinecap="round" />
          )}
          <path
            d={d}
            fill="none"
            stroke={cfg.stroke}
            strokeWidth={cfg.width}
            strokeDasharray={cfg.dash}
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd={obj.type === 'pass-line' ? undefined : `url(#${markerId})`}
          />
        </g>
      );
    }
  }
}
