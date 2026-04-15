import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function ToolCard({ tool, onClick }) {
  const { COLORS } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => onClick && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: tool.active ? COLORS.surface : COLORS.bg,
        borderRadius: 12,
        border: `1px solid ${hov ? COLORS.borderMid : COLORS.border}`,
        padding: '18px 18px 16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s',
        opacity: tool.active ? 1 : 0.55,
        boxShadow: hov ? '0 2px 10px rgba(0,0,0,0.07)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 9,
            background: tool.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: tool.iconColor
          }}>
          {tool.icon}
        </div>
        {!tool.active && (
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 20,
              background: COLORS.bg,
              color: COLORS.textHint,
              border: `1px solid ${COLORS.border}`
            }}>
            Coming soon
          </span>
        )}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>{tool.label}</div>
        <div style={{ fontSize: 12, color: COLORS.textSub, lineHeight: 1.5 }}>{tool.desc}</div>
      </div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {tool.tags.map((t) => (
          <span
            key={t}
            style={{
              fontSize: 10,
              fontWeight: 500,
              padding: '2px 7px',
              borderRadius: 20,
              background: COLORS.bg,
              color: COLORS.textSub,
              border: `1px solid ${COLORS.border}`
            }}>
            {t}
          </span>
        ))}
      </div>
      {tool.stat && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 'auto', paddingTop: 2 }}>
          {tool.stat}
        </div>
      )}
    </div>
  );
}
