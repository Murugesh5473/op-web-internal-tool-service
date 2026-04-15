import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function FilterSelect({ label, value, options, onChange }) {
  const { COLORS } = useTheme();
  const [focused, setFocused] = useState(false);

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: COLORS.textSub,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  };

  const baseInputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    fontSize: 13,
    color: COLORS.text,
    background: COLORS.surface,
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box'
  };

  const focusStyle = {
    borderColor: COLORS.blueBorder,
    boxShadow: '0 0 0 3px rgba(59,130,246,0.12)'
  };

  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...baseInputStyle,
          cursor: 'pointer',
          ...(focused ? focusStyle : {})
        }}>
        <option value=''>All {label === 'Status' ? 'Statuses' : label + 's'}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function FilterInput({ label, type, value, onChange }) {
  const { COLORS } = useTheme();
  const [focused, setFocused] = useState(false);

  const labelStyle = {
    fontSize: 11,
    fontWeight: 600,
    color: COLORS.textSub,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.4
  };

  const baseInputStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
    fontSize: 13,
    color: COLORS.text,
    background: COLORS.surface,
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
    boxSizing: 'border-box'
  };

  const focusStyle = {
    borderColor: COLORS.blueBorder,
    boxShadow: '0 0 0 3px rgba(59,130,246,0.12)'
  };

  return (
    <div>
      <div style={labelStyle}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...baseInputStyle,
          ...(focused ? focusStyle : {})
        }}
      />
    </div>
  );
}
