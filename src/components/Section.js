import React from 'react';

export function Section({ title, color, children }) {
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          color,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 8,
          fontFamily: "'DM Sans', sans-serif"
        }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{children}</div>
    </div>
  );
}
