import { useState, useEffect } from 'react';
import { Badge } from './Badge';
import { ProgressBar } from './ProgressBar';
import { ReportModal } from './ReportModal';
import { getProgress, fmt, getSuiteDuration } from '../utils/helpers';
import { fetchSuiteDetail } from '../services/automation';
import { useTheme } from '../contexts/ThemeContext';

export function SpecReportModal({ isOpen, onClose, run }) {
  const { COLORS } = useTheme();
  const [specs, setSpecs] = useState([]);
  const [suiteDetail, setSuiteDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSpecId, setExpandedSpecId] = useState(null);
  const [selectedTestCase, setSelectedTestCase] = useState(null);

  useEffect(() => {
    if (!isOpen || !run) {
      setSpecs([]);
      setError(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSuiteDetail(run.testRunId, run.suiteId);
        setSpecs(data.specs || []);
        setSuiteDetail(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch suite details');
        console.error('Error loading suite details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, run]);

  if (!isOpen || !run) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
      onClick={onClose}>
      <div
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 12,
          padding: 32,
          maxWidth: 900,
          maxHeight: '80vh',
          width: '90%',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}
        onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24
          }}>
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: COLORS.text,
                margin: '0 0 8px 0'
              }}>
              {run.project} / {run.suiteName}
            </h2>
            {suiteDetail && (
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  marginTop: 8,
                  fontSize: 12,
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                {suiteDetail.branchName && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: COLORS.textSub
                    }}>
                    <span style={{ fontSize: 14 }}></span>
                    {suiteDetail.branchName}
                  </span>
                )}
                {suiteDetail.environment && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: COLORS.textSub
                    }}>
                    <span style={{ fontSize: 14 }}></span>
                    {suiteDetail.environment}
                  </span>
                )}
                {suiteDetail.triggeredBy && (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: COLORS.textSub
                    }}>
                    <span style={{ fontSize: 14 }}></span>
                    {suiteDetail.triggeredBy}
                  </span>
                )}
                {suiteDetail.durationMs || (suiteDetail.createdAt && suiteDetail.updatedAt) ? (
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      color: COLORS.textSub
                    }}>
                    <span style={{ fontSize: 14 }}></span>
                    {suiteDetail.durationMs
                      ? fmt(suiteDetail.durationMs)
                      : getSuiteDuration(suiteDetail.status, suiteDetail.createdAt, suiteDetail.updatedAt)}
                  </span>
                ) : null}
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: 24,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: COLORS.textSub,
              padding: 0
            }}>
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: COLORS.textHint }}>Loading specs...</div>
        ) : error ? (
          <div style={{ padding: '24px', textAlign: 'center', color: COLORS.red }}>{error}</div>
        ) : specs && specs.length > 0 ? (
          <div
            style={{
              borderRadius: 8,
              overflow: 'hidden',
              border: `1px solid ${COLORS.border}`
            }}>
            {specs.map((spec, idx) => {
              const progress = getProgress(spec.testCases);
              const isSpecExpanded = expandedSpecId === spec.specId;

              return (
                <div
                  key={spec.specId}
                  style={{
                    borderBottom: idx < specs.length - 1 ? `1px solid ${COLORS.border}` : 'none',
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
                    onClick={() => setExpandedSpecId(isSpecExpanded ? null : spec.specId)}>
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
                        <ProgressBar testCases={spec.testCases} />
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
                              color: COLORS.green
                            }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: COLORS.green
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
                              color: COLORS.red
                            }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: COLORS.red
                              }}
                            />
                            <span>{progress.failed}</span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              color: COLORS.amber
                            }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: COLORS.amber
                              }}
                            />
                            <span>{progress.inProgress}</span>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: 12,
                              fontWeight: 600,
                              color: COLORS.textHint
                            }}>
                            <div
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: COLORS.textHint
                              }}
                            />
                            <span>{progress.total - progress.done - progress.inProgress}</span>
                          </div>
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

                      {spec.testCases && spec.testCases.length > 0 ? (
                        spec.testCases.map((tc, tcIdx) => (
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
                              {tc.durationMs ? fmt(tc.durationMs) : '—'}
                            </span>
                            <button
                              onClick={() =>
                                setSelectedTestCase({
                                  tc,
                                  testRunId: run.testRunId,
                                  suiteId: run.suiteId,
                                  specId: spec.specId
                                })
                              }
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
                        ))
                      ) : (
                        <div
                          style={{
                            padding: '12px 20px',
                            textAlign: 'center',
                            color: COLORS.textHint,
                            fontSize: 12
                          }}>
                          No test cases
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: COLORS.textHint,
              fontSize: 13
            }}>
            No specs found for this suite.
          </div>
        )}

        <div
          style={{
            marginTop: 24,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 12
          }}>
          <button
            onClick={onClose}
            style={{
              fontSize: 13,
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: 6,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.bg,
              cursor: 'pointer',
              color: COLORS.text
            }}>
            Close
          </button>
        </div>
      </div>

      {selectedTestCase && (
        <ReportModal
          testCase={selectedTestCase.tc}
          testRunId={selectedTestCase.testRunId}
          suiteId={selectedTestCase.suiteId}
          specId={selectedTestCase.specId}
          onClose={() => setSelectedTestCase(null)}
        />
      )}
    </div>
  );
}
