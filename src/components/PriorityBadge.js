import { useTheme } from '../contexts/ThemeContext';
import { LIGHT_PRIORITY_COLORS, DARK_PRIORITY_COLORS } from '../constants/theme';

export function PriorityBadge({ priority }) {
  const { isDark } = useTheme();
  const PC = isDark ? DARK_PRIORITY_COLORS : LIGHT_PRIORITY_COLORS;
  const config = PC[priority] || PC['N/A'];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2px 7px',
        borderRadius: 20,
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
        fontSize: 10,
        fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: 0.4,
        whiteSpace: 'nowrap'
      }}>
      {priority}
    </span>
  );
}
