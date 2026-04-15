import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../components/Badge';
import { FilterSelect, FilterInput } from '../components/FilterComponents';
import { ActionDropdown } from '../components/ActionDropdown';
import { fetchFilteredHistoricalRuns, fetchSuiteDetail } from '../services/automation';
import { FILTER_OPTIONS } from '../constants';
import { fmt, getSuiteDuration, getPrimaryButtonStyle } from '../utils/helpers';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

export function ReportList() {
  const { COLORS } = useTheme();
  const primaryButtonStyle = getPrimaryButtonStyle(COLORS);
  const navigate = useNavigate();
  const { error: showError, success: showSuccess } = useToast();

  const getDefaultDateFrom = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  };
  const getDefaultDateTo = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [filters, setFilters] = useState({
    project: '',
    suiteName: '',
    originatorName: '',
    environment: '',
    dateFrom: getDefaultDateFrom(),
    dateTo: getDefaultDateTo(),
    status: '',
    runType: ''
  });
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState(null);

  const setFilter = (k, v) => setFilters((p) => ({ ...p, [k]: v }));

  const transformRunData = (run) => ({
    ...run,
    specName: run.suiteName,
    dateOfRun: new Date(run.createdAt).toISOString().split('T')[0]
  });

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[ReportList] Calling fetchFilteredHistoricalRuns');
        const data = await fetchFilteredHistoricalRuns(filters);
        const transformedData = Array.isArray(data)
          ? data
              .map(transformRunData)
              .filter((r) => !filters.runType || (r.runType || '').toLowerCase() === filters.runType.toLowerCase())
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          : [];
        setReports(transformedData);
      } catch (err) {
        const errorMsg = err.message || 'Failed to fetch reports';
        setError(errorMsg);
        showError(errorMsg);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [filters, showError]);

  const allProjects = FILTER_OPTIONS.PROJECTS;
  const allEnvs = FILTER_OPTIONS.ENVIRONMENTS;
  const allStatuses = FILTER_OPTIONS.REPORT_STATUSES;
  const allOriginators = FILTER_OPTIONS.ORIGINATORS;

  const handleExportToExcel = async (run) => {
    try {
      const suiteDetail = await fetchSuiteDetail(run.testRunId, run.suiteId || run.testRunId);

      const data = [];

      const dateFrom = run.dateOfRun;
      data.push(['Date & Scope:', `${dateFrom} -`]);
      data.push([]);

      data.push(['Module', 'Total Tests', 'Passed', 'Comments']);

      let totalTestCases = 0;
      let totalPassed = 0;

      if (suiteDetail?.specs && Array.isArray(suiteDetail.specs)) {
        suiteDetail.specs.forEach((spec) => {
          const specTestCases = spec.testCases || [];
          const specTotal = specTestCases.length;
          const specPassed = specTestCases.filter((tc) => tc.status?.toLowerCase() === 'passed').length;

          data.push([
            (spec.specName || '').trim().replace(/\.spec\.js$/, ''),
            specTotal,
            specPassed === 0 ? '' : specPassed,
            spec.comments || ''
          ]);

          totalTestCases += specTotal;
          totalPassed += specPassed;
        });
      }

      const passPercentage = totalTestCases > 0 ? ((totalPassed / totalTestCases) * 100).toFixed(2) + '%' : '0%';
      data.push(['Total', totalTestCases, totalPassed, '']);
      data.push(['Pass %', passPercentage, '', '']);

      const htmlTable = `<table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <td style="font-weight: bold;">${data[0][0]}</td>
          <td style="font-weight: bold;">${data[0][1]}</td>
          <td style="font-weight: bold;"></td>
          <td style="font-weight: bold;"></td>
        </tr>
        ${data
          .slice(2)
          .map((row, idx) => {
            const dataSliced = data.slice(2);
            const totalRowIdx = dataSliced.length - 2;
            const passRowIdx = dataSliced.length - 1;
            const isBold = idx === 0 || idx === totalRowIdx || idx === passRowIdx ? 'font-weight: bold;' : '';

            return `
            <tr>
              ${row.map((cell) => `<td style="${isBold}">${cell}</td>`).join('')}
            </tr>
          `;
          })
          .join('')}
      </table>`;

      const htmlBlob = new Blob([htmlTable], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': htmlBlob });
      await navigator.clipboard.write([clipboardItem]);
      showSuccess('Copied to Clipboard');
    } catch (err) {
      showError('Unable to export');
    }
  };

  const handleViewReport = (run) => {
    navigate('/automation/report', { state: { testRunId: run.testRunId, run } });
  };

  return (
    <div>
      <div
        style={{
          background: COLORS.surface,
          borderRadius: 14,
          border: `1px solid ${COLORS.border}`,
          padding: '20px 24px',
          marginBottom: 24
        }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: COLORS.textSub,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}>
            Filters
          </div>
          {(filters.project ||
            filters.environment ||
            filters.status ||
            filters.suiteName ||
            filters.originatorName ||
            filters.dateFrom ||
            filters.dateTo ||
            filters.runType) && (
            <button
              onClick={() =>
                setFilters({
                  project: '',
                  suiteName: '',
                  originatorName: '',
                  environment: '',
                  dateFrom: '',
                  dateTo: '',
                  status: '',
                  runType: ''
                })
              }
              style={{
                fontSize: 12,
                color: COLORS.red,
                background: COLORS.redBg,
                border: `1px solid ${COLORS.red}`,
                borderRadius: 6,
                cursor: 'pointer',
                padding: '4px 10px',
                fontWeight: 600
              }}>
              × Clear all filters
            </button>
          )}
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 12,
            alignItems: 'flex-end'
          }}>
          <FilterSelect
            label='Project'
            value={filters.project}
            options={allProjects}
            onChange={(v) => setFilter('project', v)}
          />
          <FilterSelect
            label='Originator Name'
            value={filters.originatorName}
            options={allOriginators}
            onChange={(v) => setFilter('originatorName', v)}
          />
          <FilterSelect
            label='Environment'
            value={filters.environment}
            options={allEnvs}
            onChange={(v) => setFilter('environment', v)}
          />
          <FilterSelect
            label='Run Type'
            value={filters.runType}
            options={FILTER_OPTIONS.RUN_TYPES}
            onChange={(v) => setFilter('runType', v)}
          />
          <FilterSelect
            label='Status'
            value={filters.status}
            options={allStatuses}
            onChange={(v) => setFilter('status', v)}
          />
          <FilterInput
            label='Date From'
            type='date'
            value={filters.dateFrom}
            onChange={(v) => setFilter('dateFrom', v)}
          />
          <FilterInput label='Date To' type='date' value={filters.dateTo} onChange={(v) => setFilter('dateTo', v)} />
        </div>
      </div>

      <div
        style={{
          fontSize: 12,
          color: COLORS.textSub,
          marginBottom: 12,
          fontFamily: "'DM Sans', sans-serif"
        }}>
        {loading ? 'Loading...' : `${reports.length} run${reports.length !== 1 ? 's' : ''} found`}
      </div>

      <div
        style={{
          background: COLORS.surface,
          borderRadius: 14,
          border: `1px solid ${COLORS.border}`,
          overflow: 'hidden'
        }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.75fr repeat(10, 1fr)',
            gap: '0 12px',
            padding: '10px 20px',
            background: COLORS.bg,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.textHint,
            textTransform: 'uppercase',
            letterSpacing: 0.8,
            textAlign: 'center'
          }}>
          <span style={{ textAlign: 'center' }}>Project / Originator</span>
          <span style={{ textAlign: 'center' }}>Environment</span>
          <span style={{ textAlign: 'center' }}>Run Type</span>
          <span style={{ textAlign: 'center' }}>Date</span>
          <span style={{ textAlign: 'center' }}>Pass %</span>
          <span style={{ textAlign: 'center' }}>Total</span>
          <span style={{ textAlign: 'center', color: COLORS.green }}>Pass</span>
          <span style={{ textAlign: 'center', color: COLORS.red }}>Fail</span>
          <span style={{ textAlign: 'center' }}>Status</span>
          <span style={{ textAlign: 'center' }}>Duration</span>
          <span style={{ textAlign: 'center' }}>Actions</span>
        </div>

        {loading ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: COLORS.textHint
            }}>
            <div
              style={{ fontSize: 28, marginBottom: 8, animation: 'spin 1s linear infinite', display: 'inline-block' }}>
              ⟳
            </div>
            <div style={{ fontSize: 13, marginTop: 4 }}>Loading reports...</div>
          </div>
        ) : reports.length === 0 ? (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: COLORS.textHint
            }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>○</div>
            <div style={{ fontSize: 13, marginTop: 4 }}>No runs match your filters.</div>
          </div>
        ) : (
          reports.map((run, i) => (
            <div
              key={run.testRunId}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.blueBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? COLORS.surface : COLORS.bg)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.75fr repeat(10, 1fr)',
                gap: '0 12px',
                padding: '14px 20px',
                borderTop: `1px solid ${COLORS.border}`,
                alignItems: 'center',
                textAlign: 'center',
                background: i % 2 === 0 ? COLORS.surface : COLORS.bg,
                transition: 'background 0.1s',
                cursor: 'pointer'
              }}>
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: COLORS.text,
                    fontFamily: "'DM Serif Display', serif"
                  }}>
                  {run.project}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: COLORS.textSub,
                    fontFamily: "'DM Sans', sans-serif"
                  }}>
                  {run.originatorName}
                </div>
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: COLORS.textSub,
                  fontFamily: "'DM Sans', sans-serif",
                  textAlign: 'center'
                }}>
                {run.environment}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: COLORS.textSub,
                  fontFamily: "'DM Sans', sans-serif",
                  textAlign: 'center'
                }}>
                {run.runType || '-'}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: COLORS.textSub,
                  fontFamily: "'DM Sans', sans-serif",
                  textAlign: 'center'
                }}>
                {run.dateOfRun}
              </span>
              <span
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.text,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                {run.total > 0 ? Math.round((run.passed / run.total) * 100) : 0}%
              </span>
              <span
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.text,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                {run.total}
              </span>
              <span
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.green,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                {run.passed}
              </span>
              <span
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  color: COLORS.red,
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                {run.failed}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
                <Badge status={run.status} />
              </div>
              <span
                style={{
                  fontSize: 12,
                  color: COLORS.textSub,
                  fontFamily: "'DM Sans', sans-serif",
                  textAlign: 'center'
                }}>
                {run.durationMs ? fmt(run.durationMs) : getSuiteDuration(run.status, run.createdAt, run.updatedAt)}
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  textAlign: 'center'
                }}>
                <button onClick={() => handleViewReport(run)} style={primaryButtonStyle}>
                  View
                </button>
                <ActionDropdown onExport={() => handleExportToExcel(run)} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
