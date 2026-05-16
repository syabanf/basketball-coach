import { COURT } from '../../lib/board-geometry.js';
import { arrowPath, zigzagPath } from '../../lib/board-geometry.js';

/**
 * MiniPlayPreview — small SVG abstraction of a play used in card thumbnails.
 * Just dots + lines, no court detail.
 */
export function MiniPlayPreview({ scene, color = '#242424', size = 44 }) {
  if (!scene) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${COURT.width} ${COURT.height}`}
      aria-hidden="true"
    >
      {scene.drawings.map((d) => {
        const [p1, p2] = d.points;
        const path =
          d.type === 'dribble' ? zigzagPath(p1, p2, 6, 18) : arrowPath(p1, p2, 0.15);
        return (
          <path
            key={d.id}
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeOpacity="0.55"
            strokeLinecap="round"
            strokeDasharray={d.type === 'pass-line' ? '32 28' : undefined}
          />
        );
      })}
      {scene.players.map((p) => (
        <circle key={p.id} cx={p.x} cy={p.y} r="36" fill={color} />
      ))}
    </svg>
  );
}
