export function PlayerToken({ token, selected, onPointerDown }) {
  return (
    <g
      transform={`translate(${token.x}, ${token.y})`}
      style={{ cursor: 'grab' }}
      onPointerDown={(e) => onPointerDown?.(e, token)}
    >
      {/* Shadow */}
      <ellipse cx="0" cy="34" rx="32" ry="6" fill="rgba(0,0,0,0.18)" />
      {/* Outer ring (selected highlight) */}
      {selected && <circle r="40" fill="none" stroke="#EE3C3B" strokeWidth="3" />}
      {/* Token body */}
      <circle r="30" fill="#242424" stroke="#FFFFFF" strokeWidth="3.5" />
      {/* Number */}
      <text
        textAnchor="middle"
        dominantBaseline="central"
        fill="#FFFFFF"
        fontSize="26"
        fontWeight="800"
        fontFamily="Inter, sans-serif"
      >
        {token.label}
      </text>
      {/* Ball indicator */}
      {token.hasBall && (
        <g transform="translate(34, 20)">
          <circle r="13" fill="#EE3C3B" stroke="#FFFFFF" strokeWidth="2" />
          <path
            d="M -13 0 a 13 13 0 0 0 26 0 M 0 -13 a 13 13 0 0 0 0 26 M -9 -9 l 18 18 M -9 9 l 18 -18"
            stroke="#FFFFFF" strokeWidth="1.4" fill="none" strokeLinecap="round"
          />
        </g>
      )}
    </g>
  );
}
