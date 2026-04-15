import { useState, useEffect, useRef } from 'react';
import { Badge } from './Badge';
import { Card } from './Card';
import { fmtDateTime, fmt } from '../utils/helpers';
import { fetchReportDetail } from '../services/automation';
import { TagBadge } from './TagBadge';
import { ActionItem } from './ActionItem';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

export function TestCaseDetail({ tc, spec, report, suite, allTcs, currentIdx, onBack }) {
  const { COLORS } = useTheme();
  const [reportData, setReportData] = useState(report);
  const [loadingReport, setLoadingReport] = useState(!report);
  const [reportError, setReportError] = useState(null);
  const [activeTab, setActiveTab] = useState('stack');
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const fetchKeyRef = useRef(null);
  const { warning: toastWarning } = useToast();

  useEffect(() => {
    if (report) {
      setReportData(report);
      setLoadingReport(false);
      return;
    }

    const currentKey = `${suite?.testRunId}-${suite?.suiteId}-${spec?.specId}-${tc.testCaseId}`;
    if (fetchKeyRef.current === currentKey) return;

    fetchKeyRef.current = currentKey;

    const loadReport = async () => {
      try {
        setLoadingReport(true);
        setReportError(null);
        const data = await fetchReportDetail(suite?.testRunId, suite?.suiteId, spec?.specId, tc.testCaseId);
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
  }, [suite?.testRunId, suite?.suiteId, spec?.specId, tc.testCaseId, report]);

  useEffect(() => {
    if (!reportData?.attachments?.length) return;
    const hasMissingPath = reportData.attachments.some((a) => !a.path);
    if (hasMissingPath) {
      toastWarning('Some attachments could not be loaded — file path is unavailable.');
    }
  }, [reportData, toastWarning]);


  // Remove leading whitespace from each line
  const removeLeadingSpaces = (text) => {
    if (!text) return text;
    return text
      .split('\n')
      .map((line) => line.trimStart())
      .join('\n');
  };

  const stack = reportData?.errorStackTrace || null;
  const infoLogs = reportData?.infoLogs || [];
  const errorLogs = reportData?.errorLogs || [];
  const warnings = reportData?.warnings || [];
  const softAsserts = reportData?.softAssertErrors || [];
  const testActions = reportData?.testActions || [];
  const attachments = reportData?.attachments || [];

  const tabs = [
    { id: 'stack', label: 'Stack Trace' },
    { id: 'softAsserts', label: `Soft Asserts (${softAsserts.length})` },
    { id: 'warnings', label: `Warnings (${warnings.length})` },
    { id: 'infoLogs', label: `Info Logs (${infoLogs.length})` },
    { id: 'errorLogs', label: `Error Logs (${errorLogs.length})` },
    { id: 'actions', label: `Actions (${testActions.length})` },
    { id: 'attachments', label: `Attachments (${attachments.length})` }
  ];

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 28px' }}>
      {/* Back / Prev / Next */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => onBack(null)}
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
            cursor: 'pointer'
          }}>
          ← Back to Report
        </button>

        {allTcs && allTcs.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => onBack(allTcs[currentIdx - 1])}
              disabled={currentIdx <= 0}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 6,
                border: `1px solid ${COLORS.border}`,
                background: currentIdx <= 0 ? COLORS.bg : COLORS.surface,
                color: currentIdx <= 0 ? COLORS.borderMid : COLORS.text,
                cursor: currentIdx <= 0 ? 'not-allowed' : 'pointer'
              }}>
              ← Prev
            </button>
            <span style={{ fontSize: 12, color: COLORS.textHint, fontWeight: 500, minWidth: 60, textAlign: 'center' }}>
              {currentIdx + 1} / {allTcs.length}
            </span>
            <button
              onClick={() => onBack(allTcs[currentIdx + 1])}
              disabled={currentIdx >= allTcs.length - 1}
              style={{
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 6,
                border: `1px solid ${COLORS.border}`,
                background: currentIdx >= allTcs.length - 1 ? COLORS.bg : COLORS.surface,
                color: currentIdx >= allTcs.length - 1 ? COLORS.borderMid : COLORS.text,
                cursor: currentIdx >= allTcs.length - 1 ? 'not-allowed' : 'pointer'
              }}>
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Test case header with tags */}
      <Card style={{ padding: '20px 24px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
          <Badge status={tc.status} size='md' />
          {tc.priority && (
            <span
              style={{
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 4,
                backgroundColor: COLORS.redBg,
                color: COLORS.red,
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace"
              }}>
              {tc.priority}
            </span>
          )}
          {tc.tags?.map((tag, idx) => (
            <TagBadge key={idx} tag={tag} i={idx} />
          ))}
        </div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: COLORS.text,
            margin: '0 0 12px 0',
            fontFamily: "'DM Serif Display', serif",
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            textAlign: 'left'
          }}>
          {removeLeadingSpaces(tc.testCaseName || tc.title)}
        </h1>
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, fontSize: 12, color: COLORS.textSub }}>
          <div>
            <div
              style={{ fontSize: 10, fontWeight: 700, color: COLORS.textHint, textTransform: 'uppercase', marginBottom: 4 }}>
              SPEC FILE
            </div>
            <div style={{ fontWeight: 600 }}>{spec?.specName}</div>
          </div>
          <div>
            <div
              style={{ fontSize: 10, fontWeight: 700, color: COLORS.textHint, textTransform: 'uppercase', marginBottom: 4 }}>
              ENVIRONMENT
            </div>
            <div style={{ fontWeight: 600 }}>{suite?.environment || 'N/A'}</div>
          </div>
          <div>
            <div
              style={{ fontSize: 10, fontWeight: 700, color: COLORS.textHint, textTransform: 'uppercase', marginBottom: 4 }}>
              TRIGGERED BY
            </div>
            <div style={{ fontWeight: 600 }}>{suite?.triggeredBy || 'N/A'}</div>
          </div>
          <div>
            <div
              style={{ fontSize: 10, fontWeight: 700, color: COLORS.textHint, textTransform: 'uppercase', marginBottom: 4 }}>
              RUN AT
            </div>
            <div style={{ fontWeight: 600 }}>{fmtDateTime(suite?.createdAt)}</div>
          </div>
          <div>
            <div
              style={{ fontSize: 10, fontWeight: 700, color: COLORS.textHint, textTransform: 'uppercase', marginBottom: 4 }}>
              DURATION
            </div>
            <div style={{ fontWeight: 600 }}>{tc.durationMs != null ? fmt(tc.durationMs) : 'N/A'}</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, marginBottom: 20, display: 'flex', gap: 0 }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              fontSize: 13,
              padding: '12px 16px',
              border: 'none',
              background: 'none',
              color: activeTab === tab.id ? COLORS.blue : COLORS.textHint,
              borderBottom: activeTab === tab.id ? `2px solid ${COLORS.blue}` : 'none',
              cursor: 'pointer',
              fontWeight: activeTab === tab.id ? 600 : 500,
              transition: 'all 0.2s'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loadingReport && (
        <Card style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: COLORS.textHint }}>Loading report details...</div>
        </Card>
      )}

      {/* Error state */}
      {reportError && (
        <Card style={{ padding: '20px', backgroundColor: COLORS.redBg, borderLeft: `4px solid ${COLORS.red}` }}>
          <div style={{ fontSize: 14, color: COLORS.red, fontWeight: 600 }}>Error loading report: {reportError}</div>
        </Card>
      )}

      {/* Tab content */}
      {!loadingReport && !reportError && (
        <>
          {/* Stack Trace Tab */}
          {activeTab === 'stack' &&
            (stack ? (
              <div
                style={{
                  backgroundColor: COLORS.codeBg,
                  color: COLORS.codeText,
                  padding: '20px',
                  borderRadius: 8,
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  lineHeight: 1.6,
                  overflow: 'auto',
                  maxHeight: 600
                }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{stack}</pre>
              </div>
            ) : (
              <Card style={{ padding: '20px', textAlign: 'center', color: COLORS.textHint }}>No stack trace available</Card>
            ))}

          {/* Soft Asserts Tab */}
          {activeTab === 'softAsserts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {softAsserts.length === 0 ? (
                <Card style={{ padding: '20px', textAlign: 'center', color: COLORS.textHint }}>
                  No soft asserts available
                </Card>
              ) : (
                softAsserts.map((assertion, idx) => (
                  <Card
                    key={idx}
                    style={{ padding: '14px 16px', backgroundColor: COLORS.amberBg, borderLeft: `4px solid ${COLORS.amber}` }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: COLORS.amber,
                        fontFamily: "'DM Mono', monospace",
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: 1.5
                      }}>
                      {assertion}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Warnings Tab */}
          {activeTab === 'warnings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {warnings.length === 0 ? (
                <Card style={{ padding: '20px', textAlign: 'center', color: COLORS.textHint }}>No warnings available</Card>
              ) : (
                warnings.map((warning, idx) => (
                  <Card
                    key={idx}
                    style={{ padding: '14px 16px', backgroundColor: COLORS.amberBg, borderLeft: `4px solid ${COLORS.amber}` }}>
                    <div
                      style={{
                        fontSize: 12,
                        color: COLORS.amber,
                        fontFamily: "'DM Mono', monospace",
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        lineHeight: 1.5
                      }}>
                      {warning}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Info Logs Tab */}
          {activeTab === 'infoLogs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {infoLogs.length === 0 ? (
                <Card style={{ padding: '20px', textAlign: 'center', color: COLORS.textHint }}>No info logs available</Card>
              ) : (
                infoLogs.map((log, idx) => {
                  const message = log && typeof log === 'object' ? log.message : log;
                  const timestamp = log && typeof log === 'object' ? log.timestamp : null;
                  return (
                    <Card
                      key={idx}
                      style={{ padding: '14px 16px', backgroundColor: COLORS.greenBg, borderLeft: `4px solid ${COLORS.green}` }}>
                      {timestamp && (
                        <div style={{ fontSize: 11, color: COLORS.textSub, marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
                          {timestamp}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 12,
                          color: COLORS.text,
                          fontFamily: "'DM Mono', monospace",
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          lineHeight: 1.5
                        }}>
                        {message}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* Error Logs Tab */}
          {activeTab === 'errorLogs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {errorLogs.length === 0 ? (
                <Card style={{ padding: '20px', textAlign: 'center', color: COLORS.textHint }}>No error logs available</Card>
              ) : (
                errorLogs.map((log, idx) => {
                  const message = log && typeof log === 'object' ? log.message : log;
                  const timestamp = log && typeof log === 'object' ? log.timestamp : null;
                  return (
                    <Card
                      key={idx}
                      style={{ padding: '14px 16px', backgroundColor: COLORS.redBg, borderLeft: `4px solid ${COLORS.red}` }}>
                      {timestamp && (
                        <div style={{ fontSize: 11, color: COLORS.textHint, marginBottom: 4, fontFamily: "'DM Mono', monospace" }}>
                          {timestamp}
                        </div>
                      )}
                      <div
                        style={{
                          fontSize: 12,
                          color: COLORS.red,
                          fontFamily: "'DM Mono', monospace",
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          lineHeight: 1.5
                        }}>
                        {message}
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {testActions.length === 0 ? (
                <Card style={{ padding: '20px', textAlign: 'center', color: COLORS.textHint }}>No actions available</Card>
              ) : (
                testActions.map((action, idx) => <ActionItem key={idx} action={action} depth={0} />)
              )}
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 'attachments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {attachments.length === 0 ? (
                <Card style={{ padding: '20px', textAlign: 'center', color: COLORS.textHint }}>No attachments available</Card>
              ) : (
                attachments.map((attachment, idx) => {
                  const isImage = attachment.contentType?.startsWith('image/');
                  const isText =
                    attachment.contentType?.includes('text') || attachment.contentType?.includes('markdown');
                  const isTrace = attachment.name === 'trace';
                  const displayName = attachment.name
                    ? attachment.name.charAt(0).toUpperCase() + attachment.name.slice(1)
                    : attachment.name;

                  return (
                    <Card key={idx} style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>
                        {displayName}
                      </div>
                      {isImage && attachment.path && (
                        <img
                          src={attachment.path}
                          style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 6, cursor: 'zoom-in' }}
                          alt={attachment.name}
                          onClick={() => setFullscreenImage(attachment.path)}
                        />
                      )}
                      {isTrace && attachment.path && (
                        <a
                          href={`https://trace.playwright.dev/?trace=${encodeURIComponent(attachment.path)}`}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                            fontSize: 12,
                            fontWeight: 600,
                            color: COLORS.blue,
                            padding: '8px 14px',
                            borderRadius: 6,
                            border: `1px solid ${COLORS.blueBorder}`,
                            background: COLORS.blueBg,
                            textDecoration: 'none'
                          }}>
                          Open Trace Viewer
                        </a>
                      )}
                      {isText && (
                        <pre
                          style={{
                            backgroundColor: COLORS.bg,
                            padding: 12,
                            borderRadius: 6,
                            fontSize: 12,
                            color: COLORS.text,
                            fontFamily: "'DM Mono', monospace",
                            overflow: 'auto',
                            maxHeight: 400
                          }}>
                          {attachment.path}
                        </pre>
                      )}
                      {!isImage && !isTrace && !isText && (
                        <div style={{ fontSize: 12, color: COLORS.textHint }}>File: {attachment.path}</div>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {/* Fullscreen image modal */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <button
            onClick={() => setFullscreenImage(null)}
            style={{
              position: 'absolute',
              top: 16,
              right: 20,
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              fontSize: 20,
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1
            }}>
            ✕
          </button>
          <img
            src={fullscreenImage}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 8, objectFit: 'contain' }}
            alt="fullscreen preview"
          />
        </div>
      )}
    </div>
  );
}
