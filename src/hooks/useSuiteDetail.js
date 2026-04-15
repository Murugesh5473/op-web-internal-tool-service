import { useState, useEffect } from 'react';
import { fetchSuiteDetail } from '../services/api';

const transformSpecs = (specs = []) =>
  specs.map((spec) => ({
    ...spec,
    testCases: (spec.testCases || []).map((tc) => ({ ...tc, title: tc.title || tc.testCaseName }))
  }));

export const useSuiteDetail = ({ testRunId, suiteId, run, initialSuite } = {}) => {
  const [data, setData] = useState(initialSuite || null);
  const [loading, setLoading] = useState(!initialSuite);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialSuite || !testRunId) return;

    const id = suiteId || run?.suiteId || testRunId;

    fetchSuiteDetail(testRunId, id)
      .then((fullSuite) => {
        setData({
          ...fullSuite,
          specs: transformSpecs(fullSuite?.specs),
          testRunId,
          project: run?.project || fullSuite?.project,
          suiteName: run?.suiteName || fullSuite?.suiteName,
          environment: run?.environment || fullSuite?.environment,
          status: run?.status || fullSuite?.status,
          createdAt: run?.createdAt || fullSuite?.createdAt,
          updatedAt: run?.updatedAt || fullSuite?.updatedAt,
          triggeredBy: run?.triggeredBy || fullSuite?.triggeredBy,
          numberOfWorkers: run?.numberOfWorkers || fullSuite?.numberOfWorkers,
          originatorName: run?.originatorName || fullSuite?.originatorName,
          featureFlags: fullSuite?.featureFlags || {}
        });
      })
      .catch((err) => setError(err.message || 'Failed to load report'))
      .finally(() => setLoading(false));
  }, [testRunId, suiteId, initialSuite, run]);

  return { data, loading, error };
};
