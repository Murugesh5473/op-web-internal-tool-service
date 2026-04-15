import { useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import React from 'react';
import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { DonutChart } from '../components/DonutChart';
import { PriorityStatusChart } from '../components/PriorityStatusChart';
import { FlagsModal } from '../components/FlagsModal';
import { PriorityBadge } from '../components/PriorityBadge';
import { TagBadge } from '../components/TagBadge';
import { SC, getPriority, fmtDateTime, fmt, getPrimaryButtonStyle } from '../utils/helpers';
import { TEST_CASE_STATUSES, SPEC_STATUSES, STATUS_LEVELS } from '../constants/statusLevels';
import { useTheme } from '../contexts/ThemeContext';

const SL = ({ children }) => {
  const { COLORS } = useTheme();
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: COLORS.textSub,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 14
      }}>
      {children}
    </div>
  );
};

const Report = ({ suite, returnSpecId }) => {
  const { COLORS } = useTheme();
  const primaryButtonStyle = getPrimaryButtonStyle(COLORS);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSpecId = searchParams.get('spec');

  React.useEffect(() => {
    if (returnSpecId && !searchParams.get('spec')) {
      setSearchParams((prev) => {
        const n = new URLSearchParams(prev);
        n.set('spec', returnSpecId);
        return n;
      }, { replace: true, state: location.state });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const safeSpecsEarly = suite?.specs || [];
  const selectedSpec = safeSpecsEarly.find((s) => s.specId === selectedSpecId) || null;
  const [specFilter, setSpecFilter] = useState('all');
  const [specSearch, setSpecSearch] = useState('');
  const [specTcFilter, setSpecTcFilter] = useState('all');
  const [specTcSearch, setSpecTcSearch] = useState('');
  const [showFlags, setShowFlags] = useState(false);

  const safeSpecs = safeSpecsEarly;
  const allTcs = safeSpecs.flatMap((sp) => (sp?.testCases || []).map((tc) => ({ ...tc, spec: sp })));
  const stats = allTcs.reduce(
    (a, tc) => {
      const s = (tc.status || '').toLowerCase();
      if (s === 'passed') a.passed++;
      else if (s === 'failed' || s === 'timedout') a.failed++;
      else if (s === 'interrupted') a.interrupted++;
      else a.skipped++;
      a.total++;
      return a;
    },
    { passed: 0, failed: 0, interrupted: 0, skipped: 0, total: 0 }
  );
  const passRateNum = stats.total > 0 ? (stats.passed / stats.total) * 100 : 0;
  const passPercentage = stats.total > 0 ? passRateNum.toFixed(2) + '%' : '0%';
  const passRateColor = passRateNum >= 80 ? { bg: COLORS.greenBg, border: COLORS.green, text: COLORS.green }
    : passRateNum >= 50 ? { bg: COLORS.amberBg, border: COLORS.amber, text: COLORS.amber }
    : { bg: COLORS.redBg, border: COLORS.red, text: COLORS.red };

  const filterSpecs = (specs) =>
    specs.filter((spec) => {
      const s = (spec.status || '').toLowerCase();
      if (specFilter !== 'all' && s !== specFilter) return false;
      if (specSearch && !(spec.specName || '').toLowerCase().includes(specSearch.toLowerCase())) return false;
      return true;
    });

  const filterSpecTestCases = (tcs) =>
    tcs.filter((tc) => {
      const s = (tc.status || '').toLowerCase();
      if (specTcFilter !== 'all' && s !== specTcFilter) return false;
      if (specTcSearch && !(tc.title || tc.testCaseName || '').toLowerCase().includes(specTcSearch.toLowerCase()))
        return false;
      return true;
    });

  const handleTcClick = (tc) => {
    navigate('/automation/test-case', {
      state: {
        testRunId: suite.testRunId,
        testCaseId: tc.testCaseId,
        tc,
        spec: tc.spec,
        suite,
        allTcs: tc.spec.testCases,
        returnSpecId: selectedSpecId
      }
    });
  };

  const specToShow = selectedSpec || null;
  const displayTcs = specToShow ? (specToShow?.testCases || []).map((tc) => ({ ...tc, spec: specToShow })) : allTcs;

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 28px', animation: 'fadeIn 0.2s ease' }}>
      <button
        onClick={() => navigate('/automation?tab=reports')}
        style={{
          fontSize: 13,
          color: COLORS.blue,
          background: 'none',
          border: 'none',
          padding: 0,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          marginBottom: 20
        }}>
        ← Back to Reports
      </button>

      {/* Run header */}
      <Card style={{ padding: '20px 24px', marginBottom: 18 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap'
          }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontSize: 19,
                  fontWeight: 600,
                  color: COLORS.text,
                  fontFamily: "'DM Serif Display', serif",
                  margin: 0
                }}>
                {suite?.project && suite?.originatorName
                  ? `${suite.project} / ${suite.originatorName}`
                  : suite?.project || suite?.testRunId?.slice(0, 8)}
              </h1>
              <Badge status={suite?.status} />
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '2px 10px',
                  borderRadius: 20,
                  background: passRateColor.bg,
                  border: `1px solid ${passRateColor.border}`
                }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: passRateColor.text }}>Pass Rate: {passPercentage}</span>
              </div>
              {suite?.isTableFunding && (
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '2px 8px',
                    borderRadius: 20,
                    background: COLORS.blueBg
                  }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.blue }}>TableFunding</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
              {[
                { label: 'Environment', v: suite?.environment },
                { label: 'Triggered By', v: suite?.triggeredBy || '-' },
                { label: 'Workers', v: `${suite?.numberOfWorkers || 0}` },
                { label: 'Originator', v: suite?.originatorName || '-' },
                ...(suite?.branchName ? [{ label: 'Branch', v: suite.branchName }] : []),
                { label: 'Date', v: fmtDateTime(suite?.createdAt) }
              ].map((m) => (
                <span key={m.label} style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: COLORS.textHint, fontWeight: 500 }}>{m.label}:</span>
                  <span style={{ color: COLORS.text, fontWeight: 500 }}>{m.v}</span>
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => suite?.jenkinsUrl && window.open(suite.jenkinsUrl, '_blank')}
              disabled={!suite?.jenkinsUrl}
              style={{
                ...primaryButtonStyle,
                color: suite?.jenkinsUrl ? primaryButtonStyle.color : COLORS.textHint,
                border: suite?.jenkinsUrl ? primaryButtonStyle.border : `1px solid ${COLORS.border}`,
                background: suite?.jenkinsUrl ? primaryButtonStyle.background : COLORS.bg,
                cursor: suite?.jenkinsUrl ? primaryButtonStyle.cursor : 'not-allowed'
              }}>
              Jenkins Build
            </button>
            <button
              onClick={() => setShowFlags(true)}
              style={{
                fontSize: 12,
                color: COLORS.text,
                padding: '7px 14px',
                borderRadius: 7,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.bg,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6
              }}>
              Feature Flags{' '}
              <span
                style={{ fontSize: 11, background: COLORS.green, color: '#fff', borderRadius: 20, padding: '1px 6px' }}>
                {Object.values(suite?.featureFlags || {}).filter(Boolean).length}
              </span>
            </button>
          </div>
        </div>
      </Card>

      {/* Cluster Details, HTTP Metrics, Pod Restarts */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 22 }}>
        <Card
          style={{ padding: '16px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.textSub,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
            Cluster Details
          </span>
          <button
            onClick={() => suite?.grafanaClusterDetailsUrl && window.open(suite.grafanaClusterDetailsUrl, '_blank')}
            disabled={!suite?.grafanaClusterDetailsUrl}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '5px 10px',
              borderRadius: 6,
              border: suite?.grafanaClusterDetailsUrl ? `1px solid ${COLORS.blueBorder}` : `1px solid ${COLORS.border}`,
              background: suite?.grafanaClusterDetailsUrl ? COLORS.blueBg : COLORS.bg,
              color: suite?.grafanaClusterDetailsUrl ? COLORS.blue : COLORS.textHint,
              cursor: suite?.grafanaClusterDetailsUrl ? 'pointer' : 'not-allowed'
            }}>
            Open
          </button>
        </Card>
        <Card
          style={{ padding: '16px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.textSub,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
            HTTP Metrics
          </span>
          <button
            onClick={() => suite?.grafanaHttpMetricsUrl && window.open(suite.grafanaHttpMetricsUrl, '_blank')}
            disabled={!suite?.grafanaHttpMetricsUrl}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '5px 10px',
              borderRadius: 6,
              border: suite?.grafanaHttpMetricsUrl ? `1px solid ${COLORS.blueBorder}` : `1px solid ${COLORS.border}`,
              background: suite?.grafanaHttpMetricsUrl ? COLORS.blueBg : COLORS.bg,
              color: suite?.grafanaHttpMetricsUrl ? COLORS.blue : COLORS.textHint,
              cursor: suite?.grafanaHttpMetricsUrl ? 'pointer' : 'not-allowed'
            }}>
            Open
          </button>
        </Card>
        <Card
          style={{ padding: '16px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.textSub,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
            Pod Restarts
          </span>
          <button
            onClick={() => suite?.grafanaPodRestartsUrl && window.open(suite.grafanaPodRestartsUrl, '_blank')}
            disabled={!suite?.grafanaPodRestartsUrl}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '5px 10px',
              borderRadius: 6,
              border: suite?.grafanaPodRestartsUrl ? `1px solid ${COLORS.blueBorder}` : `1px solid ${COLORS.border}`,
              background: suite?.grafanaPodRestartsUrl ? COLORS.blueBg : COLORS.bg,
              color: suite?.grafanaPodRestartsUrl ? COLORS.blue : COLORS.textHint,
              cursor: suite?.grafanaPodRestartsUrl ? 'pointer' : 'not-allowed'
            }}>
            Open
          </button>
        </Card>
      </div>

      {/* Stats + donut */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <Card
            style={{
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flex: 1
            }}>
            <SL style={{ marginBottom: 12, alignSelf: 'flex-start' }}>Overall Status</SL>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
              <DonutChart {...stats} />
            </div>
          </Card>
          <Card
            style={{
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              flex: 1
            }}>
            <SL style={{ marginBottom: 12, alignSelf: 'flex-start' }}>Status by Priority</SL>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, width: '100%' }}>
              <PriorityStatusChart allTestCases={allTcs} />
            </div>
          </Card>
        </div>
      </div>

      {/* Specs accordion */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
        <SL>Specs ({filterSpecs(safeSpecs).length})</SL>
        <div style={{ flex: 1 }} />
        <div style={{ position: 'relative' }}>
          <svg
            style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
            width='12'
            height='12'
            viewBox='0 0 12 12'
            fill='none'>
            <circle cx='5' cy='5' r='3.5' stroke='currentColor' strokeWidth='1.2' />
            <path d='M8 8l2 2' stroke='currentColor' strokeWidth='1.2' strokeLinecap='round' />
          </svg>
          <input
            value={specSearch}
            onChange={(e) => setSpecSearch(e.target.value)}
            placeholder='Search specs…'
            style={{
              padding: '6px 10px 6px 26px',
              borderRadius: 6,
              border: `1px solid ${COLORS.border}`,
              fontSize: 12,
              color: COLORS.text,
              outline: 'none',
              width: 180,
              background: COLORS.surface
            }}
          />
        </div>
        {(() => {
          const searchFiltered = specSearch
            ? safeSpecs.filter((sp) => (sp.specName || '').toLowerCase().includes(specSearch.toLowerCase()))
            : safeSpecs;
          const counts = { all: searchFiltered.length };
          SPEC_STATUSES.forEach((status) => {
            const s = status.toLowerCase();
            counts[s] = searchFiltered.filter((sp) => (sp.status || '').toLowerCase() === s).length;
          });

          return ['all']
            .concat(SPEC_STATUSES.map((s) => s.toLowerCase()).filter((s) => s !== 'notstarted' && s !== 'inprogress'))
            .map((f) => (
              <button
                key={f}
                onClick={() => setSpecFilter(f)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: specFilter === f ? 600 : 400,
                  color: specFilter === f ? '#fff' : COLORS.textSub,
                  background: specFilter === f ? COLORS.blue : COLORS.surface,
                  border: `1px solid ${specFilter === f ? COLORS.blue : COLORS.border}`
                }}>
                {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
              </button>
            ));
        })()}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {filterSpecs(safeSpecs).map((spec) => {
          const passedStatus = STATUS_LEVELS.TEST_CASE.PASSED.toLowerCase();
          const failedStatus = STATUS_LEVELS.TEST_CASE.FAILED.toLowerCase();
          const interruptedStatus = STATUS_LEVELS.TEST_CASE.INTERRUPTED.toLowerCase();
          const passed = (spec?.testCases || []).filter((t) => (t.status || '').toLowerCase() === passedStatus).length;
          const failed = (spec?.testCases || []).filter((t) => (t.status || '').toLowerCase() === failedStatus).length;
          const interrupted = (spec?.testCases || []).filter(
            (t) => (t.status || '').toLowerCase() === interruptedStatus
          ).length;
          const sc = SC[spec.status?.toLowerCase()] || SC.notstarted;
          const isOpen = selectedSpec?.specId === spec.specId;
          return (
            <Card key={spec.specId} style={{ overflow: 'hidden', borderLeft: `4px solid ${sc.dot}` }}>
              <div
                style={{ padding: '13px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer' }}
                onClick={() => {
                  if (isOpen) {
                    setSpecTcFilter('all');
                    setSpecTcSearch('');
                    setSearchParams(
                      (prev) => {
                        const n = new URLSearchParams(prev);
                        n.delete('spec');
                        return n;
                      },
                      { state: location.state }
                    );
                  } else {
                    setSearchParams(
                      (prev) => {
                        const n = new URLSearchParams(prev);
                        n.set('spec', spec.specId);
                        return n;
                      },
                      { state: location.state }
                    );
                  }
                }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span
                      style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: COLORS.text }}>
                      {spec.specName}
                    </span>
                    <Badge status={spec.status} />
                  </div>
                  <span style={{ fontSize: 12, color: COLORS.textSub }}>{(spec?.testCases || []).length} test cases</span>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: COLORS.green,
                        display: 'inline-block'
                      }}></span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.green }}>{passed}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: COLORS.red,
                        display: 'inline-block'
                      }}></span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.red }}>{failed}</span>
                  </div>
                  {interrupted > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: SC.interrupted.dot,
                          display: 'inline-block'
                        }}></span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: SC.interrupted.text }}>{interrupted}</span>
                    </div>
                  )}
                  {spec.duration ? (
                    <span style={{ fontSize: 12, color: COLORS.textSub, fontWeight: 500 }}>{fmt(spec.duration)}</span>
                  ) : null}
                  <span style={{ fontSize: 12, color: COLORS.borderMid }}>{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>
              {isOpen && (
                <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <div
                    style={{
                      padding: '12px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      flexWrap: 'wrap',
                      background: COLORS.bg,
                      borderBottom: `1px solid ${COLORS.border}`
                    }}>
                    <div style={{ position: 'relative', flex: 1, minWidth: 150 }}>
                      <svg
                        style={{
                          position: 'absolute',
                          left: 8,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          opacity: 0.4
                        }}
                        width='12'
                        height='12'
                        viewBox='0 0 12 12'
                        fill='none'>
                        <circle cx='5' cy='5' r='3.5' stroke='currentColor' strokeWidth='1.2' />
                        <path d='M8 8l2 2' stroke='currentColor' strokeWidth='1.2' strokeLinecap='round' />
                      </svg>
                      <input
                        value={specTcSearch}
                        onChange={(e) => setSpecTcSearch(e.target.value)}
                        placeholder='Search test cases…'
                        style={{
                          padding: '6px 10px 6px 26px',
                          borderRadius: 6,
                          border: `1px solid ${COLORS.border}`,
                          fontSize: 12,
                          color: COLORS.text,
                          outline: 'none',
                          width: '100%',
                          background: COLORS.surface
                        }}
                      />
                    </div>
                    {(() => {
                      const specTcs = (spec?.testCases || []).map((tc) => ({ ...tc, spec: spec }));
                      const tcCounts = (() => {
                        const cnts = { all: specTcs.length };
                        TEST_CASE_STATUSES.forEach((status) => {
                          const s = status.toLowerCase();
                          const filtered = specTcs.filter((t) => (t.status || '').toLowerCase() === s);
                          cnts[s] = filtered.length;
                        });
                        return cnts;
                      })();

                      return ['all']
                        .concat(
                          TEST_CASE_STATUSES.map((s) => s.toLowerCase()).filter(
                            (s) => s !== 'notstarted' && s !== 'inprogress'
                          )
                        )
                        .map((f) => (
                          <button
                            key={f}
                            onClick={() => setSpecTcFilter(f)}
                            style={{
                              padding: '5px 12px',
                              borderRadius: 20,
                              fontSize: 12,
                              fontWeight: specTcFilter === f ? 600 : 400,
                              color: specTcFilter === f ? '#fff' : COLORS.textSub,
                              background: specTcFilter === f ? COLORS.blue : COLORS.surface,
                              border: `1px solid ${specTcFilter === f ? COLORS.blue : COLORS.border}`
                            }}>
                            {f.charAt(0).toUpperCase() + f.slice(1)} ({tcCounts[f]})
                          </button>
                        ));
                    })()}
                  </div>
                  {filterSpecTestCases(displayTcs.filter((tc) => tc.spec?.specId === spec.specId)).map((tc, i) => {
                    const priority = getPriority(tc.title || tc.testCaseName);
                    const sc2 = SC[(tc.status || '').toLowerCase()] || SC.notstarted;
                    return (
                      <div
                        key={tc.testCaseId}
                        onClick={() => handleTcClick(tc)}
                        style={{
                          padding: '13px 18px',
                          borderTop: `1px solid ${COLORS.bg}`,
                          background: i % 2 === 0 ? COLORS.surface : COLORS.bg,
                          cursor: 'pointer',
                          borderLeft: `3px solid ${sc2.dot}`,
                          transition: 'background 0.1s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.blueBg)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? COLORS.surface : COLORS.bg)}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: 12
                          }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                marginBottom: 5,
                                flexWrap: 'wrap'
                              }}>
                              <PriorityBadge priority={priority} />
                              {(tc.tags || []).map((tag, ti) => (
                                <TagBadge key={tag} tag={tag} i={ti} />
                              ))}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 500, color: COLORS.text, lineHeight: 1.5 }}>
                              {tc.title || tc.testCaseName}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            <Badge status={tc.status} />
                            <span style={{ fontSize: 12, color: COLORS.textSub }}>{fmt(tc.durationMs)}</span>
                            <span style={{ fontSize: 12, color: COLORS.blue, fontWeight: 500 }}>View →</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filterSpecTestCases(displayTcs.filter((tc) => tc.spec?.specId === spec.specId)).length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: COLORS.textHint, fontSize: 13 }}>
                      No test cases match.
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {showFlags && <FlagsModal flags={suite.featureFlags} onClose={() => setShowFlags(false)} />}
    </div>
  );
};

export default Report;
