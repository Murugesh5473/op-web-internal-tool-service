import { Badge } from '../components/Badge';
import { ReportModal } from '../components/ReportModal';
import { fmt, getSuiteDuration } from '../utils/helpers';
import { STATUS_LEVELS } from '../constants/statusLevels';
import { useTheme } from '../contexts/ThemeContext';

export function RunDetailView({ run, onBack, selectedTestCase, setSelectedTestCase }) {
  const { COLORS } = useTheme();
  const mockTestCases = run?.specs?.[0]?.testCases || [];

  const handleDownload = () => {
    const lines = [
      `Report: ${run.project} / ${run.suiteName} (${run.specName})`,
      `Date: ${run.dateOfRun}`,
      `Status: ${run.status}`,
      ``,
      `Test Cases:`,
      ...mockTestCases.map(
        (tc) => `  [${tc.status}] ${tc.testCaseName}${tc.errorMessage ? ` - ${tc.errorMessage}` : ''}`
      )
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${run.testRunId}-detail.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            fontSize: 13,
            color: COLORS.blue,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginBottom: 14
          }}>
          ← Back to Reports
        </button>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 6
              }}>
              <h1
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: COLORS.text,
                  margin: 0,
                  fontFamily: "'DM Serif Display', serif"
                }}>
                {run.project} / {run.suiteName}
              </h1>
              <Badge status={run.status} size='md' />
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              {[
                { icon: '', label: run.specName },
                { icon: '', label: run.environment },
                { icon: '', label: run.dateOfRun },
                {
                  icon: '',
                  label: run.durationMs
                    ? fmt(run.durationMs)
                    : getSuiteDuration(run.status, run.createdAt, run.updatedAt)
                }
              ].map((m) => (
                <span
                  key={m.label}
                  style={{
                    fontSize: 13,
                    color: COLORS.textSub,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                  {m.icon} {m.label}
                </span>
              ))}
            </div>
          </div>
          <button
            onClick={handleDownload}
            style={{
              fontSize: 13,
              color: '#fff',
              background: COLORS.blue,
              border: 'none',
              borderRadius: 8,
              padding: '10px 18px',
              cursor: 'pointer',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
            ↓ Download Report
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: 12,
          marginBottom: 24
        }}>
        {[
          { label: 'Total', value: run.total, color: COLORS.text, bg: COLORS.bg },
          {
            label: 'Passed',
            value: run.passed,
            color: COLORS.green,
            bg: COLORS.greenBg
          },
          {
            label: 'Failed',
            value: run.failed,
            color: COLORS.red,
            bg: COLORS.redBg
          },
          {
            label: 'Skipped',
            value: run.skipped,
            color: COLORS.purple,
            bg: COLORS.purpleBg
          },
          {
            label: 'Pass Rate',
            value: `${Math.round((run.passed / run.total) * 100)}%`,
            color: run.passed === run.total ? COLORS.green : COLORS.amber,
            bg: COLORS.amberBg
          }
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: s.bg,
              borderRadius: 10,
              padding: '14px 18px',
              border: `1px solid ${COLORS.border}`,
              textAlign: 'center'
            }}>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: s.color,
                fontFamily: "'DM Serif Display', serif"
              }}>
              {s.value}
            </div>
            <div
              style={{
                fontSize: 12,
                color: COLORS.textHint
              }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: COLORS.surface,
          borderRadius: 14,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }}>
        <div
          style={{
            padding: '14px 20px',
            background: COLORS.bg,
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.textHint,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            display: 'grid',
            gridTemplateColumns: '1fr auto auto auto',
            gap: '0 16px'
          }}>
          <span>Test Case</span>
          <span>Status</span>
          <span>Duration</span>
          <span>Report</span>
        </div>
        {mockTestCases.map((tc, i) => {
          const clickable =
            tc.status?.toLowerCase() === STATUS_LEVELS.TEST_CASE.PASSED.toLowerCase() ||
            tc.status?.toLowerCase() === STATUS_LEVELS.TEST_CASE.FAILED.toLowerCase() ||
            tc.status?.toLowerCase() === STATUS_LEVELS.TEST_CASE.SKIPPED.toLowerCase() ||
            tc.status?.toLowerCase() === STATUS_LEVELS.TEST_CASE.INTERRUPTED.toLowerCase();
          return (
            <div
              key={tc.testCaseId}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: '0 16px',
                padding: '13px 20px',
                alignItems: 'center',
                borderTop: `1px solid ${COLORS.border}`,
                background: i % 2 === 0 ? COLORS.surface : COLORS.bg
              }}>
              <div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    color: COLORS.text,
                    marginBottom: tc.errorMessage ? 4 : 0,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                  {tc.testCaseName
                    .split('\n')
                    .map((line) => line.trim())
                    .join('\n')}
                </div>
                {tc.errorMessage && (
                  <div
                    style={{
                      fontSize: 12,
                      color: COLORS.red
                    }}>
                    {tc.errorMessage}
                  </div>
                )}
              </div>
              <Badge status={tc.status} />
              <span
                style={{
                  fontSize: 12,
                  color: COLORS.textHint
                }}>
                {fmt(tc.durationMs)}
              </span>
              {clickable ? (
                <button
                  onClick={() => setSelectedTestCase(tc)}
                  style={{
                    fontSize: 12,
                    color: COLORS.blue,
                    fontWeight: 600,
                    padding: '5px 10px',
                    borderRadius: 6,
                    border: `1px solid ${COLORS.blueBorder}`,
                    background: COLORS.blueBg,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}>
                  View Report
                </button>
              ) : (
                <span
                  style={{
                    fontSize: 12,
                    color: COLORS.borderMid
                  }}>
                  —
                </span>
              )}
            </div>
          );
        })}
      </div>

      {selectedTestCase && <ReportModal testCase={selectedTestCase} onClose={() => setSelectedTestCase(null)} />}
    </div>
  );
}
