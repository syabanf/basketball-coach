import { COURT } from '../../lib/board-geometry.js';

/**
 * Wood-tone basketball half court (portrait), rim at top.
 * Pure SVG — scales crisply at any size.
 */
export function CourtBackground() {
  const W = COURT.width;
  const H = COURT.height;

  return (
    <g aria-hidden="true">
      <defs>
        <linearGradient id="woodGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#F0CFA1" />
          <stop offset="100%" stopColor="#E3B57F" />
        </linearGradient>
        <linearGradient id="paintGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#3A3A3A" />
          <stop offset="100%" stopColor="#242424" />
        </linearGradient>
        <pattern id="woodGrain" width="36" height="36" patternUnits="userSpaceOnUse">
          <rect width="36" height="36" fill="url(#woodGrad)" />
          <path d="M0 18h36" stroke="rgba(120,75,30,0.10)" strokeWidth="1" />
          <path d="M0 6h36 M0 30h36" stroke="rgba(120,75,30,0.05)" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Floor */}
      <rect x="0" y="0" width={W} height={H} fill="url(#woodGrain)" />

      {/* Outer border */}
      <rect x="14" y="14" width={W - 28} height={H - 28} rx="18"
            fill="none" stroke="#242424" strokeWidth="10" />

      {/* Sidelines (inner) */}
      <rect x="30" y="30" width={W - 60} height={H - 60} rx="8"
            fill="none" stroke="#FFFFFF" strokeWidth="3" />

      {/* Half-court "mid" line (bottom of half court visual) */}
      <line x1="30" y1={H - 60} x2={W - 30} y2={H - 60} stroke="#FFFFFF" strokeWidth="3" />
      <circle cx={W / 2} cy={H - 60} r="80" fill="none" stroke="#FFFFFF" strokeWidth="3" />

      {/* Paint */}
      <rect
        x={COURT.paint.x} y={COURT.paint.y}
        width={COURT.paint.width} height={COURT.paint.height}
        fill="url(#paintGrad)" opacity="0.92"
      />
      <rect
        x={COURT.paint.x} y={COURT.paint.y}
        width={COURT.paint.width} height={COURT.paint.height}
        fill="none" stroke="#FFFFFF" strokeWidth="3"
      />

      {/* Free throw circle */}
      <circle cx={W / 2} cy={COURT.paint.height} r={COURT.freeThrowCircleR}
              fill="none" stroke="#FFFFFF" strokeWidth="3" />
      <path
        d={`M ${W / 2 - COURT.freeThrowCircleR} ${COURT.paint.height} a ${COURT.freeThrowCircleR} ${COURT.freeThrowCircleR} 0 0 1 ${COURT.freeThrowCircleR * 2} 0`}
        fill="rgba(255,255,255,0.07)" />

      {/* 3-point arc */}
      <path
        d={`M ${W / 2 - COURT.threeArc.r} ${COURT.threeArc.cy}
            A ${COURT.threeArc.r} ${COURT.threeArc.r} 0 0 0
            ${W / 2 + COURT.threeArc.r} ${COURT.threeArc.cy}`}
        fill="none" stroke="#FFFFFF" strokeWidth="3" />
      {/* Corner three lines */}
      <line x1={W / 2 - COURT.threeArc.r} y1={COURT.threeArc.cy}
            x2={W / 2 - COURT.threeArc.r} y2={20}
            stroke="#FFFFFF" strokeWidth="3" />
      <line x1={W / 2 + COURT.threeArc.r} y1={COURT.threeArc.cy}
            x2={W / 2 + COURT.threeArc.r} y2={20}
            stroke="#FFFFFF" strokeWidth="3" />

      {/* Backboard + rim */}
      <line x1={W / 2 - 60} y1="58" x2={W / 2 + 60} y2="58"
            stroke="#FFFFFF" strokeWidth="5" />
      <circle cx={COURT.rimCenter.x} cy={COURT.rimCenter.y} r={COURT.rimRadius}
              fill="none" stroke="#EF4444" strokeWidth="4" />

      {/* Center brand */}
      <g opacity="0.45">
        <text x={W / 2} y={H - 200} textAnchor="middle" fill="#242424"
              fontSize="42" fontWeight="800" fontFamily="Inter, sans-serif">4TheLab</text>
      </g>
    </g>
  );
}
