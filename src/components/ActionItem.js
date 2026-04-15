import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

function fmtActionDuration(ms) {
  if (ms == null) return null;
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`;
}

export function ActionItem({ action, depth }) {
  const { COLORS } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [showStack, setShowStack] = useState(false);

  if (!action || typeof action !== 'object') return null;

  const title = action.title || '(unknown)';
  const steps = Array.isArray(action.steps) ? action.steps : [];
  const hasSteps = steps.length > 0;
  const duration = fmtActionDuration(action.duration);
  const hasError = !!action.error;
  const borderColor = hasError ? COLORS.red : COLORS.blue;

  return (
    <div
      style={{
        marginLeft: depth > 0 ? 20 : 0,
        borderLeft: depth > 0 ? `1px solid ${COLORS.border}` : 'none',
        paddingLeft: depth > 0 ? 10 : 0,
        marginBottom: 2
      }}>
      {/* Row */}
      <div
        onClick={hasSteps ? () => setExpanded((e) => !e) : undefined}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: 6,
          overflow: 'hidden',
          border: `1px solid ${hasError ? COLORS.red : COLORS.border}`,
          background: hasError ? COLORS.redBg : COLORS.bg,
          cursor: hasSteps ? 'pointer' : 'default'
        }}>
        <div style={{ width: 3, flexShrink: 0, background: borderColor, borderRadius: '6px 0 0 6px' }} />
        <div style={{ flex: 1, padding: '7px 10px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {hasSteps && <span style={{ fontSize: 9, color: COLORS.textHint, flexShrink: 0 }}>{expanded ? '▼' : '▶'}</span>}
            <span
              style={{
                flex: 1,
                fontSize: 12,
                color: hasError ? COLORS.red : COLORS.text,
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                wordBreak: 'break-all',
                lineHeight: 1.4
              }}>
              {title}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {hasSteps && (
                <span
                  style={{
                    fontSize: 10,
                    color: COLORS.chipText,
                    background: COLORS.chipBg,
                    padding: '1px 6px',
                    borderRadius: 10,
                    fontFamily: "'DM Mono', monospace"
                  }}>
                  {steps.length}
                </span>
              )}
              {duration && (
                <span
                  style={{
                    fontSize: 10,
                    color: hasError ? COLORS.red : COLORS.blue,
                    background: hasError ? COLORS.redBg : COLORS.blueBg,
                    padding: '2px 7px',
                    borderRadius: 10,
                    fontFamily: "'DM Mono', monospace",
                    fontWeight: 600
                  }}>
                  {duration}
                </span>
              )}
            </div>
          </div>
          {action.location?.function && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, color: COLORS.blue, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
                {action.location.function}
              </span>
              {action.location.file && (
                <span
                  style={{
                    fontSize: 10,
                    color: COLORS.chipText,
                    fontFamily: "'DM Mono', monospace",
                    background: COLORS.chipBg,
                    padding: '1px 6px',
                    borderRadius: 4
                  }}>
                  {action.location.file}:{action.location.line}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error panel */}
      {hasError && (
        <div
          style={{
            border: `1px solid ${COLORS.red}`,
            borderTop: 'none',
            borderRadius: '0 0 6px 6px',
            overflow: 'hidden',
            marginBottom: 2
          }}>
          <div
            style={{
              padding: '8px 12px',
              fontSize: 11,
              color: COLORS.red,
              fontFamily: "'DM Mono', monospace",
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: 1.6,
              background: COLORS.redBg
            }}>
            {action.error.message}
          </div>
          {action.error.stack && (
            <>
              <button
                onClick={() => setShowStack((s) => !s)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '5px 12px',
                  fontSize: 10,
                  fontWeight: 700,
                  color: COLORS.textSub,
                  background: COLORS.redBg,
                  border: 'none',
                  borderTop: `1px solid ${COLORS.red}`,
                  cursor: 'pointer',
                  letterSpacing: 0.3
                }}>
                {showStack ? '▲ Hide stack trace' : '▼ Show full stack trace'}
              </button>
              {showStack && (
                <pre
                  style={{
                    margin: 0,
                    padding: '12px 14px',
                    fontSize: 10,
                    color: COLORS.codeText,
                    fontFamily: "'DM Mono', monospace",
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.7,
                    background: COLORS.codeBg,
                    borderTop: `1px solid ${COLORS.red}`
                  }}>
                  {action.error.stack.startsWith(action.error.message)
                    ? action.error.stack.slice(action.error.message.length).trimStart()
                    : action.error.stack}
                </pre>
              )}
            </>
          )}
        </div>
      )}

      {/* Nested steps */}
      {hasSteps && expanded && (
        <div style={{ marginTop: 4 }}>
          {steps.map((step, i) => (
            <ActionItem key={i} action={step} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
