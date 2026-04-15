import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { ProgressBar } from '../components/ProgressBar';
import { TestCaseDetail } from '../components/TestCaseDetail';
import { getProgress, getSuiteOverallProgress, getSpecDuration, fmtDateTime, fmt, statusConfig, getSuiteDuration } from '../utils/helpers';
import { STATUS_LEVELS } from '../constants/statusLevels';
import { fetchLiveTestSuites } from '../services/automation';
import { useTheme } from '../contexts/ThemeContext';

export function LiveTracker() {
  const { COLORS } = useTheme();
  const [suites, setSuites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = () => {
      fetchLiveTestSuites()
        .then((res) => {
          setSuites(Array.isArray(res) ? res : []);
          setError(null);
        })
        .catch((err) => {
          setError(err.message);
        });
    };

    load();
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeSuites = suites
    .filter((s) => s.status?.toLowerCase() === STATUS_LEVELS.SUITE.IN_PROGRESS.toLowerCase())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const passedSuites = suites.filter((s) => s.status?.toLowerCase() === STATUS_LEVELS.SUITE.PASSED.toLowerCase());
  const failedSuites = suites.filter((s) => s.status?.toLowerCase() === STATUS_LEVELS.SUITE.FAILED.toLowerCase());
  const interruptedSuites = suites.filter(
    (s) => s.status?.toLowerCase() === STATUS_LEVELS.SUITE.INTERRUPTED.toLowerCase()
  );
  const completedSuites = [...passedSuites, ...failedSuites, ...interruptedSuites].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (error && suites.length === 0) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.textSub }}>{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
        <span
          style={{
            fontSize: 13,
            color: COLORS.textSub,
            background: COLORS.border,
            borderRadius: 20,
            padding: '2px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: activeSuites.length > 0 ? COLORS.green : COLORS.textHint,
              display: 'inline-block',
              animation: activeSuites.length > 0 ? 'pulse 1.4s ease-in-out infinite' : 'none'
            }}
          />
          {activeSuites.length} running
        </span>
      </div>

      {activeSuites.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.blue,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 12
            }}>
            Running Now ({activeSuites.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {activeSuites.map((suite) => (
              <SuiteCard key={suite.testRunId} suite={suite} />
            ))}
          </div>
        </div>
      )}

      {completedSuites.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.textHint,
              textTransform: 'uppercase',
              letterSpacing: 1.2,
              marginBottom: 12
            }}>
            Completed ({completedSuites.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {completedSuites.map((suite) => (
              <SuiteCard key={suite.testRunId} suite={suite} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SuiteCard({ suite }) {
  const { COLORS } = useTheme();
  const isActive = suite.status?.toLowerCase() === STATUS_LEVELS.SUITE.IN_PROGRESS.toLowerCase();
  const [searchParams, setSearchParams] = useSearchParams();

  const expanded = searchParams.get('suite') === suite.testRunId;
  const expandedSpecId = expanded ? searchParams.get('spec') : null;
  const selectedTcId = expanded ? searchParams.get('tc') : null;

  let selectedTestCase = null;
  if (selectedTcId && expanded) {
    for (const spec of suite.specs || []) {
      const tc = (spec.testCases || []).find((t) => t.testCaseId === selectedTcId);
      if (tc) {
        selectedTestCase = { tc, spec, suite, testRunId: suite.testRunId, suiteId: suite.suiteId, specId: spec.specId };
        break;
      }
    }
  }

  const toggleSuite = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (expanded) {
        next.delete('suite');
        next.delete('spec');
        next.delete('tc');
      } else {
        next.set('suite', suite.testRunId);
        next.delete('spec');
        next.delete('tc');
      }
      return next;
    });
  };

  const toggleSpec = (specId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (expandedSpecId === specId) {
        next.delete('spec');
        next.delete('tc');
      } else {
        next.set('spec', specId);
        next.delete('tc');
      }
      return next;
    });
  };

  const openTc = (tcId) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('tc', tcId);
      return next;
    });
  };

  const closeTc = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('tc');
      return next;
    });
  };

  return (
    <div
      style={{
        background: COLORS.surface,
        borderRadius: 12,
        border: `1px solid ${isActive ? COLORS.blueBorder : COLORS.border}`,
        boxShadow: isActive ? '0 0 0 3px rgba(59,130,246,0.07)' : 'none',
        transition: 'box-shadow 0.2s',
        overflow: 'hidden'
      }}>
      <div
        style={{
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 20,
          cursor: 'pointer',
          backgroundColor: COLORS.surface,
          userSelect: 'none'
        }}
        onClick={toggleSuite}>
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 8,
              flexWrap: 'wrap'
            }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: COLORS.text,
                fontFamily: "'DM Serif Display', serif"
              }}>
              {suite.project}
              {suite.originatorName ? ` / ${suite.originatorName}` : ''}
            </span>
            <Badge status={suite.status} />
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { prefix: 'Branch', label: suite.branchName },
              { prefix: 'Env', label: suite.environment },
              { prefix: 'Triggered By', label: suite.triggeredBy },
              {
                prefix: 'Started',
                label: fmtDateTime(suite.createdAt)
              },
              {
                prefix: 'Duration',
                label: suite.durationMs ? fmt(suite.durationMs) : getSuiteDuration(suite.status, suite.createdAt, suite.updatedAt)
              },
              { prefix: 'Workers', label: suite.numberOfWorkers != null ? suite.numberOfWorkers : null }
            ]
              .filter((m) => m.label)
              .map((m, i) => (
                <span
                  key={m.prefix || i}
                  style={{
                    fontSize: 12,
                    color: COLORS.textSub,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}>
                  <span style={{ color: COLORS.textHint, fontWeight: 500 }}>{m.prefix}:</span>
                  <span style={{ color: COLORS.text, fontWeight: 500 }}>{m.label}</span>
                </span>
              ))}
            {suite.jenkinsUrl && (
              <a
                href={suite.jenkinsUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: COLORS.blue,
                  padding: '2px 10px',
                  borderRadius: 6,
                  border: `1px solid ${COLORS.blueBorder}`,
                  background: COLORS.blueBg,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}>
                Jenkins ↗
              </a>
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            flexShrink: 0,
            minWidth: 'fit-content'
          }}>
          {(() => {
            const overallProgress = getSuiteOverallProgress(suite.specs);
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  alignItems: 'flex-end'
                }}>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    fontSize: 11,
                    fontWeight: 600
                  }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      color: statusConfig.Passed.dot
                    }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: statusConfig.Passed.dot
                      }}
                    />
                    {overallProgress.passed}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      color: statusConfig.Failed.dot
                    }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: statusConfig.Failed.dot
                      }}
                    />
                    {overallProgress.failed}
                  </div>
                  {isActive && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        color: statusConfig.InProgress.dot
                      }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: statusConfig.InProgress.dot
                        }}
                      />
                      {overallProgress.inProgress}
                    </div>
                  )}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      color: statusConfig.Interrupted.dot
                    }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: statusConfig.Interrupted.dot
                      }}
                    />
                    {overallProgress.interrupted}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 3,
                      color: statusConfig.Skipped.dot
                    }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: statusConfig.Skipped.dot
                      }}
                    />
                    {overallProgress.skipped}
                  </div>
                  {isActive && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 3,
                        color: statusConfig.NotStarted.dot
                      }}>
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: statusConfig.NotStarted.dot
                        }}
                      />
                      {overallProgress.total - overallProgress.done - overallProgress.inProgress}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    width: 160,
                    height: 6,
                    borderRadius: 3,
                    background: COLORS.border,
                    display: 'flex',
                    overflow: 'hidden',
                    gap: 1
                  }}>
                  <div
                    style={{
                      width: `${(overallProgress.passed / overallProgress.total) * 100}%`,
                      background: statusConfig.Passed.dot,
                      transition: 'width 0.5s ease'
                    }}
                  />
                  <div
                    style={{
                      width: `${(overallProgress.failed / overallProgress.total) * 100}%`,
                      background: statusConfig.Failed.dot,
                      transition: 'width 0.5s ease'
                    }}
                  />
                  {isActive && (
                    <div
                      style={{
                        width: `${(overallProgress.inProgress / overallProgress.total) * 100}%`,
                        background: statusConfig.InProgress.dot,
                        animation: 'pulse 1.4s ease-in-out infinite'
                      }}
                    />
                  )}
                  <div
                    style={{
                      width: `${(overallProgress.interrupted / overallProgress.total) * 100}%`,
                      background: statusConfig.Interrupted.dot,
                      transition: 'width 0.5s ease'
                    }}
                  />
                  <div
                    style={{
                      width: `${(overallProgress.skipped / overallProgress.total) * 100}%`,
                      background: statusConfig.Skipped.dot,
                      transition: 'width 0.5s ease'
                    }}
                  />
                  {isActive && (
                    <div
                      style={{
                        width: `${((overallProgress.total - overallProgress.done - overallProgress.inProgress) / overallProgress.total) * 100}%`,
                        background: statusConfig.NotStarted.dot
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    color: COLORS.textHint,
                    fontSize: 11
                  }}>
                  {overallProgress.done}/{overallProgress.total} complete
                </span>
              </div>
            );
          })()}
          <div
            style={{
              color: COLORS.textHint,
              fontSize: 18,
              flexShrink: 0,
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
              marginTop: 2
            }}>
            ▶
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: `1px solid ${COLORS.border}`, backgroundColor: COLORS.bg }}>
          {suite.specs.map((spec, idx) => {
            const progress = getProgress(spec.testCases);
            const isSpecExpanded = expandedSpecId === spec.specId;
            return (
              <div
                key={spec.specId}
                style={{
                  borderBottom: idx < suite.specs.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                  backgroundColor: idx % 2 === 0 ? COLORS.bg : COLORS.surface
                }}>
                <div
                  style={{
                    padding: '16px 20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => toggleSpec(spec.specId)}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 12
                      }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: COLORS.text,
                          fontFamily: "'DM Mono', monospace"
                        }}>
                        {spec.specName}
                      </span>
                      <Badge status={spec.status} size='sm' />
                    </div>

                    <div
                      style={{
                        marginBottom: 12,
                        maxWidth: 'calc(100% - 24px)'
                      }}>
                      <ProgressBar testCases={spec.testCases} isActive={isActive} />
                    </div>

                    <div style={{ marginTop: 12, maxWidth: 'calc(100% - 24px)' }}>
                      <div
                        style={{
                          display: 'flex',
                          gap: 16,
                          marginBottom: 8,
                          alignItems: 'center'
                        }}>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            color: statusConfig.Passed.dot
                          }}>
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: statusConfig.Passed.dot
                            }}
                          />
                          <span>{progress.passed}</span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            color: statusConfig.Failed.dot
                          }}>
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: statusConfig.Failed.dot
                            }}
                          />
                          <span>{progress.failed}</span>
                        </div>
                        {suite.status?.toLowerCase() === STATUS_LEVELS.SUITE.IN_PROGRESS.toLowerCase() && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              color: statusConfig.InProgress.dot
                            }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: statusConfig.InProgress.dot
                              }}
                            />
                            <span>{progress.inProgress}</span>
                          </div>
                        )}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            color: statusConfig.Interrupted.dot
                          }}>
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: statusConfig.Interrupted.dot
                            }}
                          />
                          <span>{progress.interrupted}</span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            color: statusConfig.Skipped.dot
                          }}>
                          <div
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: statusConfig.Skipped.dot
                            }}
                          />
                          <span>{progress.skipped}</span>
                        </div>
                        {suite.status?.toLowerCase() === STATUS_LEVELS.SUITE.IN_PROGRESS.toLowerCase() && (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              color: statusConfig.NotStarted.dot
                            }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: statusConfig.NotStarted.dot
                              }}
                            />
                            <span>{progress.total - progress.done - progress.inProgress}</span>
                          </div>
                        )}
                      </div>
                      <div
                          style={{
                            fontSize: 11,
                            color: COLORS.textHint
                          }}>
                          {progress.done}/{progress.total} complete
                        </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                    {getSpecDuration(spec) != null ? (
                      <div style={{ fontSize: 11, color: COLORS.textSub, fontWeight: 600 }}>
                        {fmt(getSpecDuration(spec))}
                      </div>
                    ) : null}
                  <div
                    style={{
                      color: COLORS.textHint,
                      fontSize: 14,
                      flexShrink: 0,
                      transform: isSpecExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s'
                    }}>
                    ▶
                  </div>
                  </div>
                </div>

                {isSpecExpanded && (
                  <div
                    style={{
                      borderTop: `1px solid ${COLORS.border}`,
                      backgroundColor: COLORS.surface
                    }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 120px 100px 120px',
                        gap: '0 12px',
                        padding: '12px 20px',
                        background: COLORS.bg,
                        fontSize: 11,
                        fontWeight: 700,
                        color: COLORS.textHint,
                        textTransform: 'uppercase',
                        letterSpacing: 0.8
                      }}>
                      <span>Test Case</span>
                      <span>Status</span>
                      <span>Duration</span>
                      <span>Action</span>
                    </div>

                    {spec.testCases.map((tc, tcIdx) => (
                      <div
                        key={tc.testCaseId}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 120px 100px 120px',
                          gap: '0 12px',
                          padding: '12px 20px',
                          alignItems: 'center',
                          borderTop: `1px solid ${COLORS.border}`,
                          background: tcIdx % 2 === 0 ? COLORS.surface : COLORS.bg
                        }}>
                        <div
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 13,
                            color: COLORS.text,
                            fontWeight: 500,
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                          }}>
                          {tc.title}
                        </div>
                        <Badge status={tc.status} size='sm' />
                        <span
                          style={{
                            fontSize: 12,
                            color: COLORS.textHint
                          }}>
                          {tc.durationMs != null ? fmt(tc.durationMs) : '—'}
                        </span>
                        <button
                          onClick={() => openTc(tc.testCaseId)}
                          style={{
                            fontSize: 11,
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
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {selectedTestCase && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,42,0.45)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            overflow: 'auto',
            padding: 24
          }}
          onClick={closeTc}>
          <div
            style={{
              background: COLORS.surface,
              borderRadius: 16,
              width: '100%',
              maxWidth: 1200,
              margin: '20px 0',
              boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
              overflow: 'hidden'
            }}
            onClick={(e) => e.stopPropagation()}>
            <TestCaseDetail
              tc={selectedTestCase.tc}
              spec={selectedTestCase.spec}
              suite={selectedTestCase.suite}
              allTcs={selectedTestCase.spec.testCases || []}
              currentIdx={(selectedTestCase.spec.testCases || []).findIndex(
                (t) => t.testCaseId === selectedTestCase.tc.testCaseId
              )}
              onBack={(next) => {
                if (next?.testCaseId) {
                  openTc(next.testCaseId);
                } else {
                  closeTc();
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
