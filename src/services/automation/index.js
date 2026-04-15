import { get, post } from '../api';

export const fetchLiveTestSuites = () => get('/api/v1/auto/test-suites');

export const fetchSuiteDetail = (testRunId, suiteId) =>
  get(`/api/v1/auto/test-suites/${testRunId}/suites/${suiteId}`);

export const fetchReportDetail = (testRunId, suiteId, specId, testCaseId) =>
  get(`/api/v1/auto/test-reports/${testRunId}/suites/${suiteId}/specs/${specId}/tests/${testCaseId}`);

export const fetchFilteredHistoricalRuns = (filters) => {
  const filterBody = Object.fromEntries(
    Object.entries({
      project: filters.project,
      suiteName: filters.suiteName,
      originatorName: filters.originatorName,
      status: filters.status,
      environment: filters.environment,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo
    }).filter(([, v]) => v !== undefined && v !== '')
  );

  return post('/api/v1/auto/test-suites/filter', filterBody);
};
