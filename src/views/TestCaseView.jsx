import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { TestCaseDetailView } from '../pages/TestCaseDetailView';

export default function TestCaseView() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state?.testRunId && !state?.tc) return <Navigate to='/automation' replace />;

  return (
    <TestCaseDetailView
      testRunId={state.testRunId}
      testCaseId={state.testCaseId}
      tc={state.tc}
      spec={state.spec}
      suite={state.suite}
      allTcs={state.allTcs}
      onBack={(next) => {
        if (next?.view === 'test-case') {
          navigate('/automation/test-case', { state: next });
        } else {
          navigate('/automation/report', { state: { testRunId: next?.testRunId, suite: next?.suite, returnSpecId: state.returnSpecId } });
        }
      }}
    />
  );
}
