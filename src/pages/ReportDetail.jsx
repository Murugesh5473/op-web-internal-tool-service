import { useTheme } from '../contexts/ThemeContext';
import { useSuiteDetail } from '../hooks/automation/useSuiteDetail';
import Report from './Report';

export function ReportDetail({ testRunId, run, suite: initialSuite, returnSpecId }) {
  const { COLORS } = useTheme();
  const { data: suiteDetail, loading, error } = useSuiteDetail({ testRunId, run, initialSuite });

  if (loading) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: COLORS.textHint, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>⟳</div>
        Loading report details...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: COLORS.red, fontFamily: "'DM Sans', sans-serif" }}>
        {error}
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 32px', animation: 'fadeIn 0.2s ease' }}>
      <Report suite={suiteDetail} returnSpecId={returnSpecId} />
    </div>
  );
}
