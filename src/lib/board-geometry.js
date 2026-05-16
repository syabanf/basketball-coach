// Logical court dimensions for the SVG tactical board.
// Half-court oriented portrait (good for both mobile + desktop).
export const COURT = {
  width: 1000,
  height: 940,
  paint: { x: 350, y: 0, width: 300, height: 380 },
  rimCenter: { x: 500, y: 80 },
  rimRadius: 28,
  threeArc: { cx: 500, cy: 80, r: 380 },
  freeThrowCircleR: 110,
  midCircleY: 940 - 60
};

// Clamp a coordinate to the court bounds
export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// Convert pointer client coords to SVG-local coords using viewBox transform.
export const clientToSvg = (svgEl, clientX, clientY) => {
  if (!svgEl) return { x: 0, y: 0 };
  const pt = svgEl.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const ctm = svgEl.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const transformed = pt.matrixTransform(ctm.inverse());
  return { x: transformed.x, y: transformed.y };
};

// Build an SVG path for a smooth arrow between two points.
export const arrowPath = (p1, p2, curvature = 0) => {
  if (!curvature) return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`;
  const mx = (p1.x + p2.x) / 2;
  const my = (p1.y + p2.y) / 2;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const ox = -dy * curvature;
  const oy = dx * curvature;
  return `M ${p1.x} ${p1.y} Q ${mx + ox} ${my + oy} ${p2.x} ${p2.y}`;
};

// Build a zig-zag (dribble) path along the segment p1 → p2.
export const zigzagPath = (p1, p2, segments = 8, amplitude = 14) => {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const nx = -uy;
  const ny = ux;
  let d = `M ${p1.x} ${p1.y}`;
  for (let i = 1; i <= segments; i++) {
    const t = i / segments;
    const cx = p1.x + dx * t;
    const cy = p1.y + dy * t;
    const side = i % 2 === 0 ? 1 : -1;
    d += ` L ${cx + nx * amplitude * side} ${cy + ny * amplitude * side}`;
  }
  d += ` L ${p2.x} ${p2.y}`;
  return d;
};
