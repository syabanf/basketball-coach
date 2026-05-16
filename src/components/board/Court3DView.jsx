import { useEffect, useRef, useState } from 'react';
import { COURT } from '../../lib/board-geometry.js';
import { CourtBackground } from './CourtBackground.jsx';
import { Drawing } from './Drawing.jsx';
import { Icon } from '../ui/Icon.jsx';
import { Range } from '../ui/Form.jsx';
import { cn } from '../../lib/cn.js';

/**
 * Court3DView — read-only 3D presentation of the tactical scene.
 *
 * Implementation: CSS `perspective` + `rotateX` on the floor wrapper. The court
 * + drawings live inside an SVG that lies flat on the floor and tilts with it.
 * Players are positioned as absolute HTML elements over the floor and
 * counter-rotate (`rotateX(-tilt)`) so they stand upright facing the camera.
 *
 * Editing remains on the 2D Court Board tab — clicking a player here just
 * selects it for the rest of the page (player detail panel updates).
 */
export function Court3DView({ scene, selectedObjectId, onSelect }) {
  const [tilt, setTilt] = useState(55);
  const [spin, setSpin] = useState(0);
  const [auto, setAuto] = useState(false);
  const rafRef = useRef(null);

  // Auto-rotate camera (gentle sway)
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

  return (
    <div className="space-y-3">
      <div className="relative w-full bg-gradient-to-b from-navy-900 to-[#050810] rounded-2xl overflow-hidden ring-1 ring-line shadow-card">
        {/* 3D stage */}
        <div
          className="relative w-full"
          style={{
            aspectRatio: `${COURT.width} / ${COURT.height}`,
            perspective: '1600px',
            perspectiveOrigin: '50% 28%'
          }}
        >
          {/* Soft glow on the back wall to suggest stage lighting */}
          <div
            className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 0%, rgba(238,60,59,0.16), transparent 60%)'
            }}
          />

          {/* Floor wrapper (rotates) */}
          <div
            className="absolute inset-0"
            style={{
              transform: `rotateX(${tilt}deg) rotateZ(${spin}deg)`,
              transformStyle: 'preserve-3d',
              transformOrigin: '50% 60%',
              transition: auto ? 'none' : 'transform 220ms ease-out'
            }}
          >
            {/* Court + drawings — flat on floor */}
            <svg
              viewBox={`0 0 ${COURT.width} ${COURT.height}`}
              className="absolute inset-0 w-full h-full block"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <CourtBackground />
              {scene.drawings.map((d) => (
                <Drawing key={d.id} obj={d} selected={d.id === selectedObjectId} />
              ))}
            </svg>

            {/* Players — stood up via counter-rotation */}
            {scene.players.map((p) => (
              <Player3DToken
                key={p.id}
                token={p}
                tilt={tilt}
                selected={p.id === selectedObjectId}
                onClick={() => onSelect?.(p.id)}
              />
            ))}
          </div>
        </div>

        {/* Floating camera controls */}
        <div className="absolute left-3 right-3 sm:left-4 sm:right-4 bottom-3 sm:bottom-4 flex flex-wrap items-center gap-2 bg-white/95 backdrop-blur border border-line rounded-xl px-3 py-2 shadow-card">
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

/**
 * Player3DToken — absolute-positioned HTML element that counter-rotates so it
 * remains upright when the floor tilts.
 *
 * Position maps the SVG coordinate space (0..1000, 0..940) to a percentage of
 * the parent container, which has the same aspect ratio.
 */
function Player3DToken({ token, tilt, selected, onClick }) {
  const xPct = (token.x / COURT.width) * 100;
  const yPct = (token.y / COURT.height) * 100;

  return (
    <div
      onClick={onClick}
      className="absolute cursor-pointer"
      style={{
        left: `${xPct}%`,
        top:  `${yPct}%`,
        // Counter-rotate so the disc faces the camera, and lift the token
        // so its base appears glued to the floor while its body stands up.
        transform: `translate(-50%, -50%) rotateX(${-tilt}deg) translateY(-22%)`,
        transformOrigin: 'center bottom',
        transformStyle: 'preserve-3d',
        zIndex: Math.round(yPct) // closer to camera (larger y) renders above
      }}
    >
      {/* Player disc */}
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

      {/* Floor anchor: a thin red label chip beneath the disc */}
      <div className="absolute left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur text-[10px] font-bold text-ink shadow-card whitespace-nowrap">
        P{token.label}{token.hasBall ? ' · BALL' : ''}
      </div>
    </div>
  );
}
