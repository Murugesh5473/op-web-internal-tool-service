import { useTheme } from '../contexts/ThemeContext';

export function Card({ children, style, onClick, onMouseEnter, onMouseLeave, ...props }) {
  const { COLORS } = useTheme();
  return (
    <div
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        background: COLORS.surface,
        borderRadius: 12,
        border: `1px solid ${COLORS.border}`,
        ...style
      }}
      {...props}>
      {children}
    </div>
  );
}
