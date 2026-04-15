export const STATUS_LEVELS = {
  SUITE: {
    IN_PROGRESS: 'InProgress',
    PASSED: 'Passed',
    FAILED: 'Failed',
    INTERRUPTED: 'Interrupted'
  },
  SPEC: {
    NOT_STARTED: 'NotStarted',
    IN_PROGRESS: 'InProgress',
    PASSED: 'Passed',
    FAILED: 'Failed',
    INTERRUPTED: 'Interrupted'
  },
  TEST_CASE: {
    NOT_STARTED: 'NotStarted',
    IN_PROGRESS: 'InProgress',
    PASSED: 'Passed',
    FAILED: 'Failed',
    INTERRUPTED: 'Interrupted',
    SKIPPED: 'Skipped'
  }
};

export const SUITE_STATUSES = Object.values(STATUS_LEVELS.SUITE);
export const SPEC_STATUSES = Object.values(STATUS_LEVELS.SPEC);
export const TEST_CASE_STATUSES = Object.values(STATUS_LEVELS.TEST_CASE);

export const statusConfig = {
  Passed: {
    bg: '#e8f5e9',
    text: '#2e7d32',
    dot: '#43a047',
    label: 'Passed'
  },
  Failed: {
    bg: '#fde8e8',
    text: '#c62828',
    dot: '#e53935',
    label: 'Failed'
  },
  InProgress: {
    bg: '#fff8e1',
    text: '#f57f17',
    dot: '#ffb300',
    label: 'In Progress'
  },
  NotStarted: {
    bg: '#f5f5f5',
    text: '#757575',
    dot: '#bfbaba',
    label: 'Not Started'
  },
  Skipped: {
    bg: '#e8eaf6',
    text: '#283593',
    dot: '#5c6bc0',
    label: 'Skipped'
  },
  Interrupted: {
    bg: '#fce4ec',
    text: '#880e4f',
    dot: '#cf1aab',
    label: 'Interrupted'
  }
};

export const FILTER_OPTIONS = {
  PROJECTS: ['MMTC', 'TF'],
  ENVIRONMENTS: ['DEV', 'QA', 'UAT', 'PREPROD', 'PROD'],
  REPORT_STATUSES: ['Passed', 'Failed', 'Interrupted'],
  ORIGINATORS: ['LOS', 'CREAM', 'COOKIE'],
  RUN_TYPES: ['Module', 'Regression', 'Sanity']
};
