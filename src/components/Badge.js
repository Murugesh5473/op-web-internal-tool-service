import React from 'react';
import { statusConfig } from '../utils/helpers';

export function Badge({ status, size = 'sm' }) {
  const normalizedStatus =
    Object.keys(statusConfig).find((key) => key.toLowerCase() === status?.toLowerCase()) || 'NotStarted';
  const c = statusConfig[normalizedStatus] || statusConfig.NotStarted;
  const padding = size === 'sm' ? '2px 8px' : '4px 12px';
  const fontSize = size === 'sm' ? 11 : 12;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        background: c.bg,
        color: c.text,
        borderRadius: 20,
        padding,
        fontSize,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        fontFamily: "'DM Sans', sans-serif"
      }}>
      <span
        style={{
          width: size === 'sm' ? 6 : 7,
          height: size === 'sm' ? 6 : 7,
          borderRadius: '50%',
          background: c.dot,
          ...(status?.toLowerCase() === 'inprogress' ? { animation: 'pulse 1.4s ease-in-out infinite' } : {})
        }}
      />
      {c.label}
    </span>
  );
}
