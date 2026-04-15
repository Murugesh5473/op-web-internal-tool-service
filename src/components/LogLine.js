import { useTheme } from '../contexts/ThemeContext';
import { LIGHT_LOG_COLORS, DARK_LOG_COLORS } from '../constants/theme';

export function LogLine({ text, type }) {
  const { isDark } = useTheme();
  const LOG_COLORS = isDark ? DARK_LOG_COLORS : LIGHT_LOG_COLORS;
  const c = LOG_COLORS[type] || LOG_COLORS.info;

  const formatLogText = (logText) => {
    if (typeof logText === 'string') {
      try {
        const parsed = JSON.parse(logText);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return logText;
      }
    } else if (typeof logText === 'object' && logText !== null) {
      return JSON.stringify(logText, null, 2);
    }
    return String(logText);
  };

  return (
    <div
      style={{
        background: c.bg,
        color: c.color,
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        padding: '6px 12px',
        borderRadius: 6,
        lineHeight: 1.6,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflowX: 'auto'
      }}>
      {formatLogText(text)}
    </div>
  );
}
