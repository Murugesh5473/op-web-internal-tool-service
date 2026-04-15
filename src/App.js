import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { useRef, useEffect, useLayoutEffect } from 'react';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ToastContainer } from './components/ToastContainer';
import ErrorBoundary from './components/ErrorBoundary';
import { Sidebar } from './components/layout/Sidebar';
import AppRoutes from './routes/AppRoutes';

const NAV_ROUTES = {
  home: '/',
  automation: '/automation'
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AppShell />
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}


function AppShell() {
  const { error } = useToast();
  const { COLORS } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const activePage = location.pathname === '/' ? 'home' : 'automation';
  const mainRef = useRef(null);
  const scrollPositions = useRef({});
  const prevPathnameRef = useRef(location.pathname);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const handleScroll = () => {
      scrollPositions.current[location.pathname] = el.scrollTop;
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useLayoutEffect(() => {
    if (location.pathname !== prevPathnameRef.current) {
      if (mainRef.current) {
        mainRef.current.scrollTop = scrollPositions.current[location.pathname] ?? 0;
      }
      prevPathnameRef.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <ErrorBoundary onError={error}>
      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: COLORS.bg }}>
        <Sidebar active={activePage} onNav={(id) => navigate(NAV_ROUTES[id] ?? `/${id}`)} />
        <main ref={mainRef} style={{ flex: 1, overflowY: 'auto' }}>
          <AppRoutes />
        </main>
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}
