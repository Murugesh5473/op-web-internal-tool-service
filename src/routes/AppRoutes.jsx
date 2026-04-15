import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

const HomeView = lazy(() => import('../views/HomeView'));
const AutomationView = lazy(() => import('../views/AutomationView'));
const ReportDetailView = lazy(() => import('../views/ReportDetailView'));
const TestCaseView = lazy(() => import('../views/TestCaseView'));

function AppRoutes() {
  const element = useRoutes([
    { path: '/', element: <HomeView /> },
    { path: '/automation', element: <AutomationView /> },
    { path: '/automation/report', element: <ReportDetailView /> },
    { path: '/automation/test-case', element: <TestCaseView /> },
    { path: '*', element: <Navigate to='/' replace /> }
  ]);
  return <Suspense fallback={null}>{element}</Suspense>;
}

export default AppRoutes;
