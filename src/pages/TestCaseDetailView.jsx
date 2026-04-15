import { useTheme } from '../contexts/ThemeContext';
import { useTestCaseDetail } from '../hooks/automation/useTestCaseDetail';
import { TestCaseDetail } from '../components/TestCaseDetail';

export function TestCaseDetailView({ testRunId, testCaseId, tc: initialTc, spec: initialSpec, suite: initialSuite, allTcs: initialAllTcs, onBack }) {
  const { COLORS } = useTheme();
  const { data, loading } = useTestCaseDetail({
    testRunId,
    testCaseId,
    initialTc,
    initialSpec,
    initialSuite,
    initialAllTcs
  });

  if (loading || !data) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: COLORS.textHint, fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>⟳</div>
        Loading test case...
      </div>
    );
  }

  const { tc, spec, suite, allTcs } = data;
  const listTcs = allTcs || spec.testCases || [];
  const idx = listTcs.findIndex((t) => t.testCaseId === tc.testCaseId);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 28px', animation: 'fadeIn 0.2s ease' }}>
      <TestCaseDetail
        tc={tc}
        spec={spec}
        report={null}
        suite={suite}
        allTcs={listTcs}
        currentIdx={idx}
        onBack={(next) => {
          if (next?.testCaseId) {
            onBack({ view: 'test-case', testRunId, testCaseId: next.testCaseId, tc: next, spec, suite, allTcs: listTcs });
          } else {
            onBack({ view: 'report-detail', testRunId, suite });
          }
        }}
      />
    </div>
  );
}
