import { useTheme } from '../contexts/ThemeContext';
import { LIGHT_TAG_COLORS, DARK_TAG_COLORS } from '../constants/theme';

export function TagBadge({ tag, i }) {
  const { isDark } = useTheme();
  const TAG_COLORS = isDark ? DARK_TAG_COLORS : LIGHT_TAG_COLORS;
  const colorScheme = TAG_COLORS[i % TAG_COLORS.length];
  const cleanTag = tag.startsWith('@') ? tag.slice(1) : tag;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: '2px 8px',
        borderRadius: 20,
        background: colorScheme.bg,
        color: colorScheme.color,
        border: `1px solid ${colorScheme.border}`,
        fontSize: 10,
        fontWeight: 600,
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: 'nowrap',
        letterSpacing: 0.2
      }}>
      <span style={{ opacity: 0.6, fontSize: 9 }}>@</span>{cleanTag}
    </span>
  );
}
