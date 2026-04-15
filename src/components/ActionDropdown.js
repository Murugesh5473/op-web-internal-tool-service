import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useTheme } from '../contexts/ThemeContext';

export function ActionDropdown({ onExport, isLoading }) {
  const { COLORS } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleButtonClick = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2 - 80
      });
    }
    setIsOpen(!isOpen);
  };

  const handleExport = () => {
    onExport();
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        disabled={isLoading}
        style={{
          fontSize: 18,
          color: isLoading ? COLORS.borderMid : COLORS.text,
          fontWeight: 700,
          padding: 0,
          borderRadius: 4,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.bg,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 32,
          width: 32,
          transition: 'all 0.2s'
        }}
        title='More actions'>
        ⋮
      </button>

      {isOpen &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: `${menuPosition.top}px`,
              left: `${menuPosition.left}px`,
              background: COLORS.surface,
              borderRadius: 8,
              border: `1px solid ${COLORS.border}`,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.12)',
              zIndex: 10000,
              width: 160
            }}>
            <button
              onClick={handleExport}
              disabled={isLoading}
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 16px',
                textAlign: 'center',
                fontSize: 13,
                color: isLoading ? COLORS.borderMid : COLORS.text,
                background: 'transparent',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontWeight: 500,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = COLORS.bg;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
              }}>
              Export to Excel
            </button>
          </div>,
          document.body
        )}
    </>
  );
}
