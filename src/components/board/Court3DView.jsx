import { useEffect, useRef, useState } from 'react';
import { COURT } from '../../lib/board-geometry.js';
import { CourtBackground } from './CourtBackground.jsx';
import { Drawing } from './Drawing.jsx';
import { Icon } from '../ui/Icon.jsx';
import { Range } from '../ui/Form.jsx';
import { TOOLS, useBoardStore } from '../../stores/board.store.js';
import { uid } from '../../lib/format.js';
import { cn } from '../../lib/cn.js';

const PERSPECTIVE = 1600;
const PERSPECTIVE_ORIGIN_Y = 0.28; // matches CSS perspective-origin: 50% 28%
const TRANSFORM_ORIGIN_Y   = 0.60; // matches CSS transform-origin: 50% 60%

/**
 * Court3DView — 3D-tilted court that supports the same drawing tools as 2D.
 *
 * Visual layer: an SVG with CourtBackground + drawings + draft, wrapped in a
 * CSS-3D-rotated container.
 * Player layer: HTML divs absolutely positioned over the container and
 * counter-rotated so they stand upright.
 * Pointer-capture layer: a transparent overlay shown only when a drawing tool
 * is active. It catches pointer events and maps them back to flat-floor
 * coordinates via inverse perspective + rotation math.
 *
 * SELECT / ERASER do not show the overlay — events fall through to the SVG
 * drawings (selectable / erasable) and HTML player tokens (selectable).
 */
export function Court3DView({ scene, onChange, selectedObjectId, onSelect }) {
  const [tilt, setTilt] = useState(55);
  const [spin, setSpin] = useState(0);
  const [auto, setAuto] = useState(false);
  const [draft, setDraft] = useState(null);
  const rafRef = useRef(null);
  const containerRef = useRef(null);

  const tool = useBoardStore((s) => s.tool);
  const setTool = useBoardStore((s) => s.setTool);

  // Camera auto-sway
  useEffect(() => {
    if (!auto) return;
    let t = 0;
    const tick = () => {
      t += 0.5;
      setSpin(Math.sin(t / 90) * 18);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [auto]);

  const reset = () => { setTilt(55); setSpin(0); setAuto(false); };

  /**
   * Inverse projection: screen pixel → flat-floor SVG coordinates.
   *
   * Forward: floor (x_f, y_f) is translated to put transformOrigin at the
   * pivot, then rotated by `tilt` around X and `spin` around Z, then projected
   * to screen by CSS perspective from perspectiveOrigin. We compute the
   * inverse of this chain so a click on the visually-tilted floor maps back
   * to where it would be on the un-rotated 1000×940 court.
   */
  const screenToFloor = (clientX, clientY) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const rect = el.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    const P = PERSPECTIVE;

    // Pointer in container pixels
    const sx = clientX - rect.left;
    const sy = clientY - rect.top;

    // Inverse rotateZ around transformOrigin (50%, 60% H)
    const beta = -spin * Math.PI / 180;
    const cb = Math.cos(beta);
    const sb = Math.sin(beta);
    const dx0 = sx - 0.5 * W;
    const dy0 = sy - TRANSFORM_ORIGIN_Y * H;
    const sx_z = dx0 * cb - dy0 * sb + 0.5 * W;
    const sy_z = dx0 * sb + dy0 * cb + TRANSFORM_ORIGIN_Y * H;

    // Inverse rotateX + perspective
    //   y_f = 0.6H + P * (sy_z - 0.6H) / (cos α P - (sy_z - 0.28H) sin α)
    const alpha = tilt * Math.PI / 180;
    const ca = Math.cos(alpha);
    const sa = Math.sin(alpha);

    const denom = ca * P - (sy_z - PERSPECTIVE_ORIGIN_Y * H) * sa;
    const safeDenom = Math.abs(denom) < 1 ? Math.sign(denom || 1) : denom;
    const u = (P * (sy_z - TRANSFORM_ORIGIN_Y * H)) / safeDenom;
    const y_f = TRANSFORM_ORIGIN_Y * H + u;

    // Solve x from the same perspective factor k = P + u sinα
    const k = P + u * sa;
    const x_f = 0.5 * W + (sx_z - 0.5 * W) * (k / P);

    // Map container px → SVG viewBox
    return {
      x: (x_f / W) * COURT.width,
      y: (y_f / H) * COURT.height
    };
  };

  // ── Pointer handlers (overlay) ─────────────────────────────────────────
  const startDraft = (x, y) => {
    if (tool === TOOLS.ARROW)  return { id: uid('d'), type: 'arrow',    points: [{ x, y }, { x, y }] };
    if (tool === TOOLS.CIRCLE) return { id: uid('d'), type: 'circle',   points: [{ x, y }, { x, y }] };
    if (tool === TOOLS.RECT)   return { id: uid('d'), type: 'rect',     points: [{ x, y }, { x, y }] };
    if (tool === TOOLS.DRAW)   return { id: uid('d'), type: 'freehand', points: [{ x, y }] };
    return null;
  };

  const handleOverlayDown = (e) => {
    const { x, y } = screenToFloor(e.clientX, e.clientY);

    if (tool === TOOLS.TEXT) {
      const label = window.prompt('Label text:', '');
      if (label) {
        onChange?.({
          ...scene,
          drawings: [...scene.drawings, { id: uid('d'), type: 'text', text: label, points: [{ x, y }] }]
        });
      }
      return;
    }

    const next = startDraft(x, y);
    if (!next) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setDraft(next);
  };

  const handleOverlayMove = (e) => {
    if (!draft) return;
    const { x, y } = screenToFloor(e.clientX, e.clientY);
    if (draft.type === 'freehand') {
      setDraft({ ...draft, points: [...draft.points, { x, y }] });
    } else {
      setDraft({ ...draft, points: [draft.points[0], { x, y }] });
    }
  };

  const handleOverlayUp = (e) => {
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (!draft) return;
    const valid =
      draft.type === 'freehand'
        ? draft.points.length > 2
        : (() => {
            const [a, b] = draft.points;
            return Math.hypot(b.x - a.x, b.y - a.y) > 6;
          })();
    if (valid) {
      onChange?.({ ...scene, drawings: [...scene.drawings, draft] });
      onSelect?.(draft.id);
      setTool(TOOLS.SELECT);
    }
    setDraft(null);
  };

  // ── Drawing click in SELECT / ERASER mode ─────────────────────────────
  const handleDrawingPointerDown = (e, obj) => {
    e.stopPropagation();
    if (tool === TOOLS.ERASER) {
      onChange?.({ ...scene, drawings: scene.drawings.filter((d) => d.id !== obj.id) });
      return;
    }
    if (tool === TOOLS.SELECT) onSelect?.(obj.id);
  };

  // ── Render ────────────────────────────────────────────────────────────
  const showOverlay = [TOOLS.DRAW, TOOLS.CIRCLE, TOOLS.RECT, TOOLS.ARROW, TOOLS.TEXT].includes(tool);
  const cursor =
    tool === TOOLS.TEXT ? 'text'
    : showOverlay ? 'crosshair'
    : 'default';

  return (
    <div className="space-y-3">
      <div
        ref={containerRef}
        className="relative w-full bg-gradient-to-b from-navy-900 to-[#050810] rounded-2xl overflow-hidden ring-1 ring-line shadow-card"
      >
        <div
          className="relative w-full"
          style={{
            aspectRatio: `${COURT.width} / ${COURT.height}`,
            perspective: `${PERSPECTIVE}px`,
            perspectiveOrigin: `50% ${PERSPECTIVE_ORIGIN_Y * 100}%`
          }}
        >
          <div
            className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(238,60,59,0.16), transparent 60%)'
            }}
          />

          {/* Floor (court + drawings) — 3D rotated */}
          <div
            className="absolute inset-0"
            style={{
              transform: `rotateX(${tilt}deg) rotateZ(${spin}deg)`,
              transformStyle: 'preserve-3d',
              transformOrigin: `50% ${TRANSFORM_ORIGIN_Y * 100}%`,
              transition: auto ? 'none' : 'transform 220ms ease-out'
            }}
          >
            <svg
              viewBox={`0 0 ${COURT.width} ${COURT.height}`}
              className="absolute inset-0 w-full h-full block"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <CourtBackground />
              {scene.drawings.map((d) => (
                <Drawing
                  key={d.id}
                  obj={d}
                  selected={d.id === selectedObjectId}
                  onPointerDown={handleDrawingPointerDown}
                />
              ))}
              {draft && <Drawing obj={draft} draft />}
            </svg>
          </div>

          {/* Players — upright HTML over the floor */}
          {scene.players.map((p) => (
            <Player3DToken
              key={p.id}
              token={p}
              tilt={tilt}
              selected={p.id === selectedObjectId}
              onClick={() => onSelect?.(p.id)}
            />
          ))}

          {/* Pointer-capture overlay — active for drawing tools only */}
          {showOverlay && (
            <div
              className="absolute inset-0 z-20"
              style={{ cursor, touchAction: 'none' }}
              onPointerDown={handleOverlayDown}
              onPointerMove={handleOverlayMove}
              onPointerUp={handleOverlayUp}
              onPointerLeave={handleOverlayUp}
              onPointerCancel={handleOverlayUp}
            />
          )}
        </div>

        {/* Camera controls */}
        <div className="absolute left-3 right-3 sm:left-4 sm:right-4 bottom-3 sm:bottom-4 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur border border-line rounded-xl px-3 py-2 shadow-card z-30">
          <CameraSlider label="Tilt"  value={tilt} min={5}   max={80}  onChange={setTilt} disabled={auto} />
          <CameraSlider label="Spin"  value={spin} min={-45} max={45}  onChange={setSpin} disabled={auto} />
          <button
            onClick={() => setAuto((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold transition-colors',
              auto ? 'bg-brand-500 text-white' : 'bg-surface-soft text-ink hover:bg-surface-alt'
            )}
          >
            <Icon.Plays size={14} /> {auto ? 'Auto · on' : 'Auto'}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-semibold bg-surface-soft text-ink hover:bg-surface-alt"
          >
            <Icon.Maximize size={14} /> Reset
          </button>
        </div>
      </div>

      <p className="text-xs text-ink-muted px-1">
        Drawing tools work in 3D — pointer position is reprojected onto the tilted floor. Player drag is only available in Court Board mode.
      </p>
    </div>
  );
}

function CameraSlider({ label, value, min, max, onChange, disabled }) {
  return (
    <label className={cn('flex-1 min-w-[120px] flex items-center gap-2', disabled && 'opacity-50')}>
      <span className="text-[11px] uppercase font-bold text-ink-muted tracking-wider w-8 shrink-0">{label}</span>
      <Range
        min={min}
        max={max}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="flex-1"
      />
      <span className="text-xs font-bold text-ink w-9 text-right tabular-nums">{Math.round(value)}°</span>
    </label>
  );
}

function Player3DToken({ token, tilt, selected, onClick }) {
  const xPct = (token.x / COURT.width) * 100;
  const yPct = (token.y / COURT.height) * 100;

  return (
    <div
      onClick={onClick}
      className="absolute cursor-pointer z-10"
      style={{
        left: `${xPct}%`,
        top:  `${yPct}%`,
        transform: `translate(-50%, -50%) rotateX(${-tilt}deg) translateY(-22%)`,
        transformOrigin: 'center bottom',
        transformStyle: 'preserve-3d',
        zIndex: Math.round(yPct)
      }}
    >
      <div
        className={cn(
          'relative grid place-items-center rounded-full font-extrabold text-white shadow-pop border-[3px] border-white',
          'h-12 w-12 sm:h-14 sm:w-14 text-lg sm:text-xl',
          selected ? 'bg-brand-500 ring-4 ring-brand-300/60' : 'bg-navy-700'
        )}
        style={{
          boxShadow: selected
            ? '0 14px 24px rgba(238,60,59,0.45)'
            : '0 12px 22px rgba(0,0,0,0.45)'
        }}
      >
        {token.label}

        {token.hasBall && (
          <div
            className="absolute -right-2 -bottom-2 h-6 w-6 rounded-full bg-brand-500 border-2 border-white grid place-items-center"
            aria-label="has ball"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3v18M5 5l14 14M5 19L19 5" />
            </svg>
          </div>
        )}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur text-[10px] font-bold text-ink shadow-card whitespace-nowrap">
        P{token.label}{token.hasBall ? ' · BALL' : ''}
      </div>
    </div>
  );
}
