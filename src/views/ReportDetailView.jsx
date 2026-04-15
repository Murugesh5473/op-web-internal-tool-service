import { useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { ReportDetail } from '../pages/ReportDetail';

const SESSION_KEY = 'reportDetailState';

export default function ReportDetailView() {
  const { state } = useLocation();

  const resolved = state?.testRunId ? state : (() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (state?.testRunId) {
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
      } catch {}
    }
  }, [state]);

  if (!resolved?.testRunId) return <Navigate to='/automation' replace />;

  return <ReportDetail testRunId={resolved.testRunId} run={resolved.run} suite={resolved.suite} returnSpecId={state?.returnSpecId} />;
}
