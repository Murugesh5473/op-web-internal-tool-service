import { useTheme } from '../contexts/ThemeContext';

export function FlagsModal({ flags, onClose }) {
  const { COLORS } = useTheme();

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}>
      <div
        style={{
          background: COLORS.surface,
          borderRadius: 14,
          maxWidth: 500,
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
          padding: '24px'
        }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.text,
              fontFamily: "'DM Serif Display', serif"
            }}>
            Feature Flags
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: 'pointer',
              color: COLORS.textHint
            }}>
            ×
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(flags || {}).map(([name, value]) => {
            const isEnabled = Boolean(value);
            return (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: COLORS.bg,
                  borderRadius: 8,
                  border: `1px solid ${isEnabled ? COLORS.green : COLORS.border}`
                }}>
                <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 500 }}>
                  {name}
                </span>
                <span
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    background: isEnabled ? COLORS.greenBg : COLORS.redBg,
                    border: `1px solid ${isEnabled ? COLORS.green : COLORS.red}`,
                    color: isEnabled ? COLORS.green : COLORS.red,
                    fontSize: 12,
                    fontWeight: 600
                  }}>
                  {typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
