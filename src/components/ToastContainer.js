import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

const getTypeStyles = (type, COLORS) => {
  switch (type) {
    case 'error':
      return {
        bg: COLORS.redBg,
        border: COLORS.red,
        text: COLORS.red,
        icon: '!'
      };
    case 'success':
      return {
        bg: COLORS.greenBg,
        border: COLORS.green,
        text: COLORS.green,
        icon: '✓'
      };
    case 'warning':
      return {
        bg: COLORS.amberBg,
        border: COLORS.amber,
        text: COLORS.amber,
        icon: '-'
      };
    case 'info':
    default:
      return {
        bg: COLORS.blueBg,
        border: COLORS.blueBorder,
        text: COLORS.blue,
        icon: 'i'
      };
  }
};

function Toast({ toast, onRemove }) {
  const { COLORS } = useTheme();
  const styles = getTypeStyles(toast.type, COLORS);

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: 8,
        padding: '12px 16px',
        marginBottom: 12,
        animation: 'slideIn 0.3s ease',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}
    >
      <span style={{ color: styles.text, fontSize: 16, fontWeight: 600, marginTop: 2, flexShrink: 0 }}>
        {styles.icon}
      </span>
      <div style={{ flex: 1 }}>
        <p
          style={{
            color: styles.text,
            fontSize: 13,
            fontWeight: 500,
            margin: 0,
            lineHeight: 1.4,
            wordBreak: 'break-word'
          }}
        >
          {toast.message}
        </p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          color: styles.text,
          cursor: 'pointer',
          fontSize: 18,
          padding: 0,
          marginTop: -2,
          opacity: 0.6,
          transition: 'opacity 0.2s',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        onMouseEnter={(e) => (e.target.style.opacity = '1')}
        onMouseLeave={(e) => (e.target.style.opacity = '0.6')}
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        zIndex: 9999,
        maxWidth: 400,
        pointerEvents: 'auto'
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              transform: translateX(400px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}
