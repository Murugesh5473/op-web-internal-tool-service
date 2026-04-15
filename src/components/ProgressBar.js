import { useTheme } from '../contexts/ThemeContext';
import { getProgress, statusConfig } from '../utils/helpers';

export function ProgressBar({ testCases, isActive = true }) {
  const { COLORS } = useTheme();
  const { total, passed, failed, inProgress, skipped, interrupted } = getProgress(testCases);
  if (total === 0) return null;
  const notStarted = total - (passed + failed + inProgress + skipped + interrupted);
  return (
    <div
      style={{
        width: '100%',
        height: 6,
        borderRadius: 4,
        background: COLORS.border,
        display: 'flex',
        overflow: 'hidden',
        gap: 1
      }}>
      <div
        style={{
          width: `${(passed / total) * 100}%`,
          background: statusConfig.Passed.dot,
          transition: 'width 0.5s ease'
        }}
      />
      <div
        style={{
          width: `${(failed / total) * 100}%`,
          background: statusConfig.Failed.dot,
          transition: 'width 0.5s ease'
        }}
      />
      <div
        style={{
          width: `${(inProgress / total) * 100}%`,
          background: statusConfig.InProgress.dot,
          animation: 'pulse 1.4s ease-in-out infinite'
        }}
      />
      <div style={{ width: `${(skipped / total) * 100}%`, background: statusConfig.Skipped.dot }} />
      <div style={{ width: `${(interrupted / total) * 100}%`, background: statusConfig.Interrupted.dot }} />
      {isActive && <div style={{ width: `${(notStarted / total) * 100}%`, background: statusConfig.NotStarted.dot }} />}
    </div>
  );
}
