import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export function NavItem({ label, icon, active, onClick }) {
  const { COLORS, isDark } = useTheme();
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 9,
        padding: '8px 10px',
        borderRadius: 7,
        cursor: 'pointer',
        transition: 'background 0.12s',
        background: active ? COLORS.blueBg : hov ? (isDark ? COLORS.surface : COLORS.bg) : 'transparent',
        color: active ? COLORS.blueText : hov ? COLORS.text : COLORS.textSub
      }}>
      <span style={{ color: active ? COLORS.blue : 'currentColor', display: 'flex' }}>{icon}</span>
      <span style={{ fontSize: 13, fontWeight: active ? 600 : 400 }}>{label}</span>
    </div>
  );
}
