import { createContext, useContext, useState, useCallback, useRef, useMemo } from 'react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'error', duration = 5000) => {
    const id = `${Date.now()}-${++counterRef.current}`;
    const toast = {
      id,
      message,
      type
    };

    setToasts((prev) => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  // Memoize callback methods so they have stable references
  const error = useCallback((message, duration = 5000) => addToast(message, 'error', duration), [addToast]);
  const success = useCallback((message, duration = 5000) => addToast(message, 'success', duration), [addToast]);
  const warning = useCallback((message, duration = 5000) => addToast(message, 'warning', duration), [addToast]);
  const info = useCallback((message, duration = 5000) => addToast(message, 'info', duration), [addToast]);

  const value = useMemo(() => ({
    toasts,
    addToast,
    removeToast,
    error,
    success,
    warning,
    info
  }), [toasts, addToast, removeToast, error, success, warning, info]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};
