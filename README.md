# 4TheLab — Basketball Strategy System

A frontend-only React PWA for designing basketball plays, managing players, and centralizing tactical knowledge. Built from the [4TheLab UI / Engineering Spec](https://github.com/syabanf/basketball-coach).

> Single-page app · Vite + React 18 · Tailwind (WIT.ID palette) · Zustand · React Router · vite-plugin-pwa

---

## Highlights

- **Court Board** — pure-SVG tactical canvas with draggable player tokens, arrows, dribble paths, freehand draw, circle / rectangle highlight zones, text labels, and per-object selection / eraser.
- **Plays** — library sidebar, horizontal scroller on mobile, metadata strip with tags, rename / share / duplicate / delete actions, dummy seed of 6 plays.
- **Players** — table on desktop, compact rows on mobile, OVR, status chips, player detail card with radar chart and attribute bars.
- **Other pages** — Dashboard, Plays, Players, Team, Analytics (heatmap + AI insights), Schedule, Library, Settings, More.
- **App shell** — sticky desktop header (search + notifications popover + profile menu), gradient mobile header, dark sidebar, mobile bottom nav.
- **PWA** — installable, offline-cached via Workbox, brand `theme-color`, safe-area-aware on iOS.
- **Toasts + Popovers** — every button has feedback; navigation, prompts, or toasts depending on action shape.

---

## Stack

| Concern | Choice |
|---|---|
| Build | Vite 5 |
| UI | React 18 (JSX) |
| Styling | Tailwind CSS 3 with custom WIT.ID design tokens |
| State | Zustand (board · play · player · toast stores) |
| Routing | React Router 6 |
| PWA | `vite-plugin-pwa` (Workbox + manifest) |
| Icons | Inline SVG (no icon-pack dependency) |
| Charts | Pure-SVG radar + heatmap (no chart lib) |

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle to dist/
npm run preview  # serve dist/ for PWA testing
```

---

## Project layout

```
src/
├── app/             # App entry + routes
├── components/
│   ├── ui/          # Button, Card, Badge, Tabs, Avatar, Input,
│   │                # Icon, Popover, Toaster
│   ├── layout/      # AppShell, Header, Sidebar, MobileBottomNav
│   ├── board/       # CourtBackground, TacticalCanvas,
│   │                # PlayerToken, Drawing, MiniPlayPreview,
│   │                # BoardToolbar
│   ├── plays/       # PlayLibrary, PlayMetadata
│   └── players/     # PlayerTable, PlayerDetailCard,
│                    # PlayerRadarChart
│
├── features/        # one folder per route
│   ├── board/       # Court Board (centerpiece)
│   ├── dashboard/
│   ├── plays/
│   ├── players/
│   ├── team/
│   ├── analytics/
│   ├── schedule/
│   ├── library/
│   └── settings/
│
├── stores/          # Zustand slices
│   ├── board.store.js
│   ├── play.store.js
│   ├── player.store.js
│   └── toast.store.js
│
├── lib/             # board-geometry, cn, format
├── data/            # dummy seed data: plays, players, team
└── styles/          # Tailwind entry + design tokens
```

---

## WIT.ID color palette

All hexes are centralized in `tailwind.config.js`. Sampled from `wit.id`:

| Token | Hex | Usage |
|---|---|---|
| `brand-500` | `#EE3C3B` | Primary WIT red — CTAs, active nav |
| `brand-600` | `#D62524` | Hover / pressed |
| `brand-700` | `#B01C1B` | Pressed-deeper |
| `navy-900` | `#111111` | Sidebar surface |
| `navy-700` | `#242424` | Player tokens, court border, headers |
| `surface-alt` | `#F4F4F4` | App background |

To change brand values, edit `tailwind.config.js` once and the entire UI follows.

---

## Tactical board

The canvas lives in [src/components/board/TacticalCanvas.jsx](src/components/board/TacticalCanvas.jsx). Each tool is wired to a clean pointer state machine:

| Tool | Behavior |
|---|---|
| Select | Drag tokens; click drawings to select; click empty canvas to clear |
| Draw | Press + drag freehand polyline |
| Circle | Drag center → edge for a highlight ring |
| Rectangle | Drag opposite corners for a zone |
| Arrow | Drag start → end for a movement arrow |
| Text | Click + prompt for a label chip |
| Eraser | Click a drawing to delete it |

Scene shape:

```jsonc
{
  "players":  [ { "id", "label", "x", "y", "hasBall" } ],
  "drawings": [ { "id", "type", "points": [ {"x","y"} ], "text?" } ]
}
```

Supported drawing types: `arrow`, `pass-line`, `dribble`, `circle`, `rect`, `freehand`, `text`.

---

## Scope / roadmap

**MVP (this repo)**
- App shell + responsive layout
- Court Board + all drawing tools
- Plays / Players / Team / Analytics / Schedule / Library / Settings / Dashboard pages
- PWA install + offline cache
- Dummy data, no backend

**Next**
- Real PNG icons (manifest references PNGs not shipped yet)
- Pinch / wheel zoom + pan for the canvas
- localStorage persistence
- Real auth + backend (per spec: NestJS + PostgreSQL)
- Realtime collaboration via WebSocket
- AI tactical assistant

---

## License

UNLICENSED — internal prototype.
