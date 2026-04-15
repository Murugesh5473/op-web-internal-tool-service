import { STATUS_LEVELS, statusConfig } from '../constants/statusLevels';

export { statusConfig };

export const getProgress = (testCases) => {
  const total = testCases.length;
  const passed = testCases.filter(
    (t) => t.status?.toLowerCase() === STATUS_LEVELS.TEST_CASE.PASSED.toLowerCase()
  ).length;
  const failed = testCases.filter(
    (t) => t.status?.toLowerCase() === STATUS_LEVELS.TEST_CASE.FAILED.toLowerCase()
  ).length;
  const inProgress = testCases.filter(
    (t) => t.status?.toLowerCase() === STATUS_LEVELS.TEST_CASE.IN_PROGRESS.toLowerCase()
  ).length;
  const skipped = testCases.filter(
    (t) => t.status?.toLowerCase() === STATUS_LEVELS.TEST_CASE.SKIPPED.toLowerCase()
  ).length;
  const interrupted = testCases.filter(
    (t) => t.status?.toLowerCase() === STATUS_LEVELS.TEST_CASE.INTERRUPTED.toLowerCase()
  ).length;
  const done = passed + failed + skipped + interrupted;
  return {
    total,
    passed,
    failed,
    inProgress,
    skipped,
    interrupted,
    done,
    pct: total > 0 ? Math.round((done / total) * 100) : 0
  };
};

export const getSuiteOverallProgress = (specs) => {
  let totalCases = 0;
  let passedCases = 0;
  let failedCases = 0;
  let inProgressCases = 0;
  let skippedCases = 0;
  let interruptedCases = 0;

  specs.forEach((spec) => {
    const progress = getProgress(spec.testCases);
    totalCases += progress.total;
    passedCases += progress.passed;
    failedCases += progress.failed;
    inProgressCases += progress.inProgress;
    skippedCases += progress.skipped;
    interruptedCases += progress.interrupted;
  });

  const done = passedCases + failedCases + skippedCases + interruptedCases;
  return {
    total: totalCases,
    passed: passedCases,
    failed: failedCases,
    inProgress: inProgressCases,
    skipped: skippedCases,
    interrupted: interruptedCases,
    done,
    pct: totalCases > 0 ? Math.round((done / totalCases) * 100) : 0
  };
};

export const elapsed = (isoStr) => {
  const ms = Date.now() - new Date(isoStr).getTime();
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s ago`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s ago`;
  } else {
    return `${seconds}s ago`;
  }
};

export const getSuiteDuration = (status, createdAt, updatedAt) => {
  let startTime, endTime;
  const normalizedStatus = status?.toLowerCase();

  if (
    normalizedStatus === STATUS_LEVELS.SUITE.PASSED.toLowerCase() ||
    normalizedStatus === STATUS_LEVELS.SUITE.FAILED.toLowerCase()
  ) {
    startTime = new Date(createdAt).getTime();
    endTime = new Date(updatedAt).getTime();
  } else {
    startTime = new Date(createdAt).getTime();
    endTime = Date.now();
  }
  const ms = endTime - startTime;
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

export const fmt = (ms) => {
  if (typeof ms === 'string' && isNaN(Number(ms))) return ms;
  const num = Number(ms);
  if (ms == null || !isFinite(num) || isNaN(num)) return '—';

  const totalSeconds = Math.floor(num / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const milliseconds = Math.floor(num % 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else if (seconds > 0) {
    return `${seconds}s`;
  } else {
    return `${milliseconds}ms`;
  }
};

export const fmtDate = (isoStr) => {
  if (!isoStr) return '—';
  const date = new Date(isoStr);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const fmtDateTime = (isoStr) => {
  if (!isoStr) return '—';
  const date = new Date(isoStr);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const rawHours = date.getHours();
  const ampm = rawHours >= 12 ? 'PM' : 'AM';
  const hours = rawHours % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} ${hours}:${minutes} ${ampm}`;
};

export const getSpecDuration = (spec) => {
  if (spec.durationMs != null) return spec.durationMs;
  if (spec.duration != null) return spec.duration;
  if (spec.totalDuration != null) return spec.totalDuration;
  const sum = (spec.testCases || []).reduce((acc, tc) => acc + (tc.durationMs ?? 0), 0);
  return sum > 0 ? sum : null;
};

export const SC = {
  passed: statusConfig.Passed,
  failed: statusConfig.Failed,
  inprogress: statusConfig.InProgress,
  notstarted: statusConfig.NotStarted,
  skipped: statusConfig.Skipped,
  interrupted: statusConfig.Interrupted,
  ...statusConfig
};

export { LIGHT_PRIORITY_COLORS as PC } from '../constants/theme';

export const getPriority = (title) => {
  if (!title) return 'N/A';
  const match = title.match(/^(P[0-3]):/);
  return match ? match[1] : 'N/A';
};

export const removeLeadingSpaces = (text) => {
  if (!text) return text;
  return text
    .split('\n')
    .map((line) => line.trimStart())
    .join('\n');
};

export const stripAnsi = (text) => {
  if (text == null) return text;
  const str = typeof text === 'object' ? (text.message ?? JSON.stringify(text)) : String(text);
  return str.replace(new RegExp(String.fromCharCode(27) + '\\[[0-9;]*[mGKHF]', 'g'), '');
};

export const getPrimaryButtonStyle = (COLORS) => ({
  fontSize: 11,
  fontWeight: 600,
  padding: '5px 10px',
  borderRadius: 6,
  border: `1px solid ${COLORS.blueBorder}`,
  background: COLORS.blueBg,
  color: COLORS.blue,
  cursor: 'pointer',
  fontFamily: "'DM Sans', sans-serif",
  whiteSpace: 'nowrap',
  textDecoration: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: 6
});
