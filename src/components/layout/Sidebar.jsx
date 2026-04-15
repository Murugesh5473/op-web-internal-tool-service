import { useTheme } from '../../contexts/ThemeContext';
import { GridIcon, TestIcon } from '../icons';
import { NavItem } from './NavItem';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: <GridIcon /> },
  { id: 'automation', label: 'Automation Report', icon: <TestIcon /> }
];

function ThemeToggle() {
  const { isDark, toggle, COLORS } = useTheme();
  return (
    <button
      onClick={toggle}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        padding: '8px 10px',
        borderRadius: 7,
        border: `1px solid ${COLORS.border}`,
        background: COLORS.bg,
        color: COLORS.textSub,
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 500,
        fontFamily: "'DM Sans', sans-serif",
        transition: 'all 0.15s'
      }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>{isDark ? '☀️' : '🌙'}</span>
      <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  );
}

export function Sidebar({ active, onNav }) {
  const { COLORS } = useTheme();
  return (
    <div
      style={{
        width: 200,
        background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '0 12px',
        flexShrink: 0
      }}>
      <div
        style={{
          padding: '18px 8px 20px',
          borderBottom: `1px solid ${COLORS.border}`,
          marginBottom: 8
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: COLORS.blue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
            <GridIcon color='#fff' size={14} />
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, lineHeight: 1.2 }}>Internal Tool</div>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 4 }}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            label={item.label}
            icon={item.icon}
            active={active === item.id}
            onClick={() => onNav(item.id)}
          />
        ))}
      </div>
      <div style={{ padding: '12px 0 16px', borderTop: `1px solid ${COLORS.border}` }}>
        <ThemeToggle />
      </div>
    </div>
  );
}
