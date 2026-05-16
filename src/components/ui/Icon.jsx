// Minimal inline icon set — single-color, currentColor strokes.
// Names mirror the toolbar/spec vocabulary so usage stays readable.

const Base = ({ children, size = 18, ...rest }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    {children}
  </svg>
);

export const Icon = {
  Board: (p) => (
    <Base {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 12h18M12 3v18" />
    </Base>
  ),
  Plays: (p) => (
    <Base {...p}>
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="18" r="2" />
      <circle cx="18" cy="6" r="2" />
      <path d="M8 7l8 0M8 7l8 10" />
    </Base>
  ),
  Players: (p) => (
    <Base {...p}>
      <circle cx="9" cy="8" r="3" />
      <path d="M2 20c0-3 3-5 7-5s7 2 7 5" />
      <circle cx="17" cy="7" r="2.5" />
      <path d="M22 18c0-2-2-3.5-5-3.5" />
    </Base>
  ),
  Team: (p) => (
    <Base {...p}>
      <circle cx="12" cy="8" r="3.2" />
      <circle cx="5" cy="11" r="2.2" />
      <circle cx="19" cy="11" r="2.2" />
      <path d="M3 20c0-2.5 2-4 5-4M21 20c0-2.5-2-4-5-4M6 20c0-3 3-5 6-5s6 2 6 5" />
    </Base>
  ),
  Analytics: (p) => (
    <Base {...p}>
      <path d="M4 19V5M4 19h16" />
      <path d="M8 15v-4M12 15V8M16 15v-2" />
    </Base>
  ),
  Schedule: (p) => (
    <Base {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </Base>
  ),
  Library: (p) => (
    <Base {...p}>
      <path d="M4 4h6v16H4zM10 4h4v16h-4zM14 4l5 1 2 15-5 1z" />
    </Base>
  ),
  Settings: (p) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </Base>
  ),
  Bell: (p) => (
    <Base {...p}>
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9z" />
      <path d="M10.5 21a1.5 1.5 0 0 0 3 0" />
    </Base>
  ),
  Search: (p) => (
    <Base {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </Base>
  ),
  Plus: (p) => (
    <Base {...p}>
      <path d="M12 5v14M5 12h14" />
    </Base>
  ),
  ChevronDown: (p) => (
    <Base {...p}>
      <path d="m6 9 6 6 6-6" />
    </Base>
  ),
  More: (p) => (
    <Base {...p}>
      <circle cx="5"  cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="19" cy="12" r="1.5" />
    </Base>
  ),
  Cursor: (p) => (
    <Base {...p}>
      <path d="M4 3l16 7-7 2-2 7L4 3z" />
    </Base>
  ),
  Pencil: (p) => (
    <Base {...p}>
      <path d="M3 21l3-1L18 8l-2-2L4 18l-1 3z" />
      <path d="M14 4l6 6" />
    </Base>
  ),
  Circle: (p) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
    </Base>
  ),
  Rect: (p) => (
    <Base {...p}>
      <rect x="4" y="6" width="16" height="12" rx="1.5" />
    </Base>
  ),
  Arrow: (p) => (
    <Base {...p}>
      <path d="M5 19L19 5" />
      <path d="M14 5h5v5" />
    </Base>
  ),
  Text: (p) => (
    <Base {...p}>
      <path d="M4 5h16M12 5v14" />
    </Base>
  ),
  Eraser: (p) => (
    <Base {...p}>
      <path d="m4 18 6-12 10 6-6 12H8z" />
      <path d="M3 21h18" />
    </Base>
  ),
  Undo: (p) => (
    <Base {...p}>
      <path d="M9 14l-4-4 4-4" />
      <path d="M5 10h10a5 5 0 0 1 0 10h-3" />
    </Base>
  ),
  Redo: (p) => (
    <Base {...p}>
      <path d="m15 14 4-4-4-4" />
      <path d="M19 10H9a5 5 0 0 0 0 10h3" />
    </Base>
  ),
  Trash: (p) => (
    <Base {...p}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
    </Base>
  ),
  Share: (p) => (
    <Base {...p}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="18" cy="19" r="2.5" />
      <path d="m8 11 8-5M8 13l8 5" />
    </Base>
  ),
  Save: (p) => (
    <Base {...p}>
      <path d="M5 4h12l3 3v13H5z" />
      <path d="M7 4v6h9V4M8 14h8v6H8z" />
    </Base>
  ),
  Maximize: (p) => (
    <Base {...p}>
      <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
    </Base>
  ),
  Flask: (p) => (
    <Base {...p}>
      <path d="M9 3h6M10 3v6L4 19c-1 1.5 0 3 2 3h12c2 0 3-1.5 2-3l-6-10V3" />
      <circle cx="12" cy="15" r="1.5" />
    </Base>
  ),
  Help: (p) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.9.4-1 1-1 1.7M12 17h.01" />
    </Base>
  ),
  Logout: (p) => (
    <Base {...p}>
      <path d="M15 4h4v16h-4" />
      <path d="M10 8l-4 4 4 4M6 12h12" />
    </Base>
  )
};
