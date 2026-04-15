import { useState, useEffect, useRef, useMemo } from 'react';
import { Badge } from './Badge';
import { LogLine } from './LogLine';
import { ActionItem } from './ActionItem';
import { fmt } from '../utils/helpers';
import { fetchReportDetail } from '../services/automation';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

export function ReportModal({ testCase, testRunId, suiteId, specId, onClose }) {
  const { COLORS, isDark } = useTheme();
  const [reportData, setReportData] = useState(null);
  const [loadingReport, setLoadingReport] = useState(true);
  const [reportError, setReportError] = useState(null);
  const fetchKeyRef = useRef(null);
  const { warning: toastWarning } = useToast();

  useEffect(() => {
    const currentKey = `${testRunId}-${suiteId}-${specId}-${testCase.testCaseId}`;

    if (fetchKeyRef.current === currentKey) return;

    fetchKeyRef.current = currentKey;

    const loadReport = async () => {
      try {
        setLoadingReport(true);
        setReportError(null);
        const data = await fetchReportDetail(testRunId, suiteId, specId, testCase.testCaseId);
        setReportData(data);
      } catch (err) {
        console.error('Failed to load report detail:', err);
        setReportError(err.message || 'Failed to load report');
        setReportData(null);
      } finally {
        setLoadingReport(false);
      }
    };

    loadReport();
  }, [testRunId, suiteId, specId, testCase.testCaseId]);

  useEffect(() => {
    if (!reportData?.attachments?.length) return;
    const hasMissingPath = reportData.attachments.some((a) => !a.path);
    if (hasMissingPath) {
      toastWarning('Some attachments could not be loaded — file path is unavailable.');
    }
  }, [reportData, toastWarning]);

  const report = reportData || {
    errorStackTrace: null,
    warnings: [],
    softAssertErrors: [],
    errorLogs: [],
    infoLogs: ['[INFO] Test completed'],
    testActions: [],
    attachments: []
  };
  const [activeTab, setActiveTab] = useState('stack');

  const tabs = useMemo(
    () => [
      { id: 'stack', label: 'Stack Trace' },
      { id: 'softAsserts', label: `Soft Asserts (${reportData?.softAssertErrors?.length ?? 0})` },
      { id: 'warnings', label: `Warnings (${reportData?.warnings?.length ?? 0})` },
      { id: 'infoLogs', label: `Info Logs (${reportData?.infoLogs?.length ?? 0})` },
      { id: 'errorLogs', label: `Error Logs (${reportData?.errorLogs?.length ?? 0})` },
      { id: 'actions', label: `Actions (${reportData?.testActions?.length ?? 0})` },
      { id: 'attachments', label: `Attachments (${reportData?.attachments?.length ?? 0})` }
    ],
    [reportData]
  );

  useEffect(() => {
    if (tabs.length > 0 && !tabs.find((t) => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24
      }}
      onClick={onClose}>
      <div
        style={{
          background: COLORS.surface,
          borderRadius: 16,
          width: '100%',
          maxWidth: 1000,
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: '20px 24px 0', borderBottom: `1px solid ${COLORS.border}` }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 12
            }}>
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 4
                }}>
                <Badge status={testCase.status} size='md' />
                {testCase.durationMs && (
                  <span
                    style={{
                      fontSize: 12,
                      color: COLORS.textSub
                    }}>
                    {fmt(testCase.durationMs)}
                  </span>
                )}
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: COLORS.text,
                  fontFamily: "'DM Serif Display', serif",
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                {testCase.testCaseName
                  .split('\n')
                  .map((line) => line.trim())
                  .join('\n')}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: COLORS.textSub,
                  marginTop: 2
                }}>
                ID: {testCase.testCaseId}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.bg,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                color: COLORS.textSub,
                flexShrink: 0
              }}>
              ✕
            </button>
          </div>
          {testCase.errorMessage && (
            <div
              style={{
                background: COLORS.redBg,
                border: `1px solid ${COLORS.red}`,
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 12,
                fontSize: 13,
                color: COLORS.red,
                fontFamily: "'DM Mono', monospace"
              }}>
              {testCase.errorMessage}
            </div>
          )}
          <div style={{ display: 'flex', gap: 0 }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: 13,
                  fontWeight: activeTab === t.id ? 600 : 400,
                  color: activeTab === t.id ? COLORS.blue : COLORS.textSub,
                  background: 'none',
                  border: 'none',
                  borderBottom: activeTab === t.id ? `2px solid ${COLORS.blue}` : '2px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.15s'
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          {loadingReport ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                color: COLORS.textHint
              }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>⟳</div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: COLORS.textSub,
                  animation: 'pulse 1.4s ease-in-out infinite'
                }}>
                Loading report...
              </div>
            </div>
          ) : reportError ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                color: COLORS.textHint
              }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}></div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: COLORS.red,
                  marginBottom: 8
                }}>
                Error Loading Report
              </div>
              <div style={{ fontSize: 14, color: COLORS.textHint }}>{reportError}</div>
            </div>
          ) : !reportData ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 24px',
                color: COLORS.textHint
              }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}></div>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: COLORS.textSub,
                  marginBottom: 8
                }}>
                Report Not Available
              </div>
              <div style={{ fontSize: 14, color: COLORS.textHint }}>
                No detailed report data available for this test case.
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'infoLogs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {report.infoLogs.length > 0 ? (
                    report.infoLogs.map((l, i) => <LogLine key={i} text={l} type='info' />)
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        color: COLORS.textHint,
                        padding: '20px'
                      }}>
                      No info logs
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'errorLogs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {report.errorLogs.length > 0 ? (
                    report.errorLogs.map((l, i) => <LogLine key={i} text={l} type='error' />)
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        color: COLORS.textHint,
                        padding: '20px'
                      }}>
                      No error logs
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'warnings' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {report.warnings.length > 0 ? (
                    report.warnings.map((w, i) => <LogLine key={i} text={w} type='warn' />)
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        color: COLORS.textHint,
                        padding: '20px'
                      }}>
                      No warnings
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'softAsserts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {report.softAssertErrors.length > 0 ? (
                    report.softAssertErrors.map((e, i) => <LogLine key={i} text={e} type='error' />)
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        color: COLORS.textHint,
                        padding: '20px'
                      }}>
                      No soft assertion errors
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'actions' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {report.testActions.length > 0 ? (
                    report.testActions.map((a, i) => <ActionItem key={i} action={a} depth={0} />)
                  ) : (
                    <div style={{ textAlign: 'center', color: COLORS.textHint, padding: '20px' }}>No actions performed</div>
                  )}
                </div>
              )}

              {activeTab === 'stack' &&
                (report.errorStackTrace ? (
                  <pre
                    style={{
                      background: isDark ? '#0D1117' : '#1E1E2E',
                      color: '#f8f8f2',
                      padding: 20,
                      borderRadius: 10,
                      fontSize: 12,
                      lineHeight: 1.7,
                      overflowX: 'auto',
                      fontFamily: "'DM Mono', monospace",
                      margin: 0
                    }}>
                    {report.errorStackTrace}
                  </pre>
                ) : (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '40px 0',
                      color: COLORS.textHint,
                      fontSize: 14
                    }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}></div>
                    No stack trace available for this test case.
                  </div>
                ))}

              {activeTab === 'attachments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {(report.attachments || []).map((a, i) => {
                    const isImage = a?.contentType?.includes('image') || a?.type?.includes('image');
                    const imagePath = a?.path || a?.url || '';

                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 8,
                          padding: '12px 16px',
                          border: `1px solid ${COLORS.border}`,
                          borderRadius: 8,
                          background: COLORS.bg
                        }}>
                        {isImage && imagePath ? (
                          <>
                            <img
                              src={imagePath}
                              alt={a?.name || 'Attachment'}
                              style={{
                                maxWidth: '100%',
                                maxHeight: 400,
                                borderRadius: 6,
                                border: `1px solid ${COLORS.borderMid}`,
                                objectFit: 'contain'
                              }}
                              onError={() => {
                                console.error('Image failed to load from path:', imagePath);
                              }}
                            />
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'space-between',
                                gap: 12
                              }}>
                              <div>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: COLORS.text,
                                    marginBottom: 4
                                  }}>
                                  {a?.name || 'Unknown'}
                                </div>
                                <div style={{ fontSize: 12, color: COLORS.textHint }}>
                                  {a?.contentType || a?.type || 'Unknown type'}
                                </div>
                              </div>
                              <a
                                href={imagePath}
                                download={a?.name}
                                style={{
                                  fontSize: 12,
                                  color: COLORS.blue,
                                  textDecoration: 'none',
                                  fontWeight: 600,
                                  padding: '6px 12px',
                                  borderRadius: 6,
                                  border: `1px solid ${COLORS.blueBorder}`,
                                  background: COLORS.blueBg,
                                  whiteSpace: 'nowrap'
                                }}>
                                Download
                              </a>
                            </div>
                          </>
                        ) : (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 12,
                              justifyContent: 'space-between'
                            }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                flex: 1
                              }}>
                              <div style={{ fontSize: 22 }}></div>
                              <div style={{ flex: 1 }}>
                                <div
                                  style={{
                                    fontWeight: 600,
                                    fontSize: 14,
                                    color: COLORS.text,
                                    marginBottom: 4
                                  }}>
                                  {a?.name || 'Unknown'}
                                </div>
                                <div style={{ fontSize: 12, color: COLORS.textHint }}>
                                  {a?.contentType || a?.type || 'Unknown type'}
                                </div>
                              </div>
                            </div>
                            <a
                              href={imagePath || '#'}
                              download={a?.name}
                              style={{
                                fontSize: 12,
                                color: COLORS.blue,
                                textDecoration: 'none',
                                fontWeight: 600,
                                padding: '6px 12px',
                                borderRadius: 6,
                                border: `1px solid ${COLORS.blueBorder}`,
                                background: COLORS.blueBg,
                                whiteSpace: 'nowrap'
                              }}>
                              Download
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
