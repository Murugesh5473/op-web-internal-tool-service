import { useState, useEffect } from 'react';
import { fetchSuiteDetail } from '../services/api';

const transformSpecs = (specs = []) =>
  specs.map((spec) => ({
    ...spec,
    testCases: (spec.testCases || []).map((tc) => ({ ...tc, title: tc.title || tc.testCaseName }))
  }));

export const useTestCaseDetail = ({ testRunId, testCaseId, initialTc, initialSpec, initialSuite, initialAllTcs } = {}) => {
  const [data, setData] = useState(
    initialTc && initialSpec && initialSuite
      ? { tc: initialTc, spec: initialSpec, suite: initialSuite, allTcs: initialAllTcs }
      : null
  );
  const [loading, setLoading] = useState(!initialTc);

  useEffect(() => {
    if (initialTc || !testRunId) return;

    setLoading(true);
    fetchSuiteDetail(testRunId, testRunId)
      .then((fullSuite) => {
        const specs = transformSpecs(fullSuite?.specs);
        let foundTc = null;
        let foundSpec = null;
        for (const spec of specs) {
          const tc = (spec.testCases || []).find((t) => t.testCaseId === testCaseId);
          if (tc) { foundTc = tc; foundSpec = spec; break; }
        }
        if (foundTc) {
          setData({
            tc: foundTc,
            spec: foundSpec,
            suite: { ...fullSuite, specs, testRunId },
            allTcs: foundSpec.testCases
          });
        }
      })
      .finally(() => setLoading(false));
  }, [testRunId, testCaseId, initialTc]);

  return { data, loading };
};
