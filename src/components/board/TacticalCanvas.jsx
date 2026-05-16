import { useRef, useState } from 'react';
import { COURT, clamp, clientToSvg } from '../../lib/board-geometry.js';
import { CourtBackground } from './CourtBackground.jsx';
import { PlayerToken } from './PlayerToken.jsx';
import { Drawing } from './Drawing.jsx';
import { TOOLS, useBoardStore } from '../../stores/board.store.js';
import { uid } from '../../lib/format.js';

/**
 * TacticalCanvas
 * - Renders court, drawings, and player tokens.
 * - Pointer behavior is tool-aware:
 *   SELECT  → drag tokens, click drawings to select, background clears selection.
 *   ARROW   → drag on empty canvas to draw an arrow (auto-curved).
 *   CIRCLE  → drag from center to edge to size a highlight circle.
 *   RECT    → drag opposite corners to size a rectangle zone.
 *   DRAW    → freehand polyline while pointer is held.
 *   TEXT    → click to place a label (prompt for content).
 *   ERASER  → click a drawing to delete it.
 */
export function TacticalCanvas({
  scene,
  onChange,
  selectedObjectId,
  onSelect
}) {
  const svgRef = useRef(null);
  const tool = useBoardStore((s) => s.tool);
  const setTool = useBoardStore((s) => s.setTool);

  const [drag, setDrag] = useState(null);   // token drag: { tokenId, offsetX, offsetY }
  const [draft, setDraft] = useState(null); // in-progress drawing

  const toSvg = (e) => clientToSvg(svgRef.current, e.clientX, e.clientY);

  // ─── Token drag (always works in SELECT) ─────────────────────────────────
  const handleTokenPointerDown = (e, token) => {
    e.stopPropagation();
    if (tool !== TOOLS.SELECT) return;
    svgRef.current?.setPointerCapture?.(e.pointerId);
    const { x, y } = toSvg(e);
    setDrag({ tokenId: token.id, offsetX: x - token.x, offsetY: y - token.y });
    onSelect?.(token.id);
  };

  // ─── Click a drawing object ──────────────────────────────────────────────
  const handleDrawingPointerDown = (e, obj) => {
    e.stopPropagation();
    if (tool === TOOLS.ERASER) {
      onChange?.({ ...scene, drawings: scene.drawings.filter((d) => d.id !== obj.id) });
      return;
    }
    if (tool === TOOLS.SELECT) onSelect?.(obj.id);
  };

  // ─── Background pointer-down: maybe start drawing ───────────────────────
  const handleBackgroundDown = (e) => {
    const { x, y } = toSvg(e);

    if (tool === TOOLS.SELECT || tool === TOOLS.ERASER) {
      onSelect?.(null);
      return;
    }

    if (tool === TOOLS.TEXT) {
      const label = window.prompt('Label text:', '');
      if (label) {
        const text = { id: uid('d'), type: 'text', text: label, points: [{ x, y }] };
        onChange?.({ ...scene, drawings: [...scene.drawings, text] });
      }
      return;
    }

    // Drag-to-create shapes — store an in-progress draft
    svgRef.current?.setPointerCapture?.(e.pointerId);
    let nextDraft = null;
    if (tool === TOOLS.ARROW) {
      nextDraft = { id: uid('d'), type: 'arrow',    points: [{ x, y }, { x, y }] };
    } else if (tool === TOOLS.CIRCLE) {
      nextDraft = { id: uid('d'), type: 'circle',   points: [{ x, y }, { x, y }] };
    } else if (tool === TOOLS.RECT) {
      nextDraft = { id: uid('d'), type: 'rect',     points: [{ x, y }, { x, y }] };
    } else if (tool === TOOLS.DRAW) {
      nextDraft = { id: uid('d'), type: 'freehand', points: [{ x, y }] };
    }
    if (nextDraft) setDraft(nextDraft);
  };

  // ─── Pointer move: drag token, or update in-progress draft ──────────────
  const handlePointerMove = (e) => {
    if (drag) {
      const { x, y } = toSvg(e);
      const nx = clamp(x - drag.offsetX, 40, COURT.width - 40);
      const ny = clamp(y - drag.offsetY, 40, COURT.height - 40);
      onChange?.({
        ...scene,
        players: scene.players.map((p) =>
          p.id === drag.tokenId ? { ...p, x: nx, y: ny } : p
        )
      });
      return;
    }
    if (draft) {
      const { x, y } = toSvg(e);
      const cx = clamp(x, 0, COURT.width);
      const cy = clamp(y, 0, COURT.height);
      if (draft.type === 'freehand') {
        setDraft({ ...draft, points: [...draft.points, { x: cx, y: cy }] });
      } else {
        // arrow / circle / rect → second point follows the cursor
        setDraft({ ...draft, points: [draft.points[0], { x: cx, y: cy }] });
      }
    }
  };

  // ─── Pointer up: commit token drag or commit the draft ──────────────────
  const handlePointerUp = (e) => {
    svgRef.current?.releasePointerCapture?.(e.pointerId);
    if (drag) {
      setDrag(null);
      return;
    }
    if (draft) {
      // Reject degenerate (0-size) shapes
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
        // Swap back to Select so the user can immediately move/edit
        setTool(TOOLS.SELECT);
      }
      setDraft(null);
    }
  };

  const cursor =
    tool === TOOLS.SELECT ? 'default'
    : tool === TOOLS.ERASER ? 'not-allowed'
    : tool === TOOLS.TEXT ? 'text'
    : 'crosshair';

  return (
    <div className="relative w-full">
      <div className="relative w-full rounded-2xl overflow-hidden bg-navy-900/95 ring-1 ring-line shadow-card">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${COURT.width} ${COURT.height}`}
          className="board-svg w-full h-auto block"
          style={{ cursor }}
          onPointerDown={handleBackgroundDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <CourtBackground />

          {/* Committed drawings */}
          {scene.drawings.map((d) => (
            <Drawing
              key={d.id}
              obj={d}
              selected={d.id === selectedObjectId}
              onPointerDown={handleDrawingPointerDown}
            />
          ))}

          {/* In-progress draft (renders above existing drawings) */}
          {draft && <Drawing obj={draft} draft />}

          {/* Player tokens */}
          {scene.players.map((p) => (
            <PlayerToken
              key={p.id}
              token={p}
              selected={p.id === selectedObjectId}
              onPointerDown={handleTokenPointerDown}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}
