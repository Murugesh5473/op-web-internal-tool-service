import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { statusConfig } from '../utils/helpers';
import { LiveTracker } from './LiveTracker';
import { ReportList } from './ReportList';

const TABS = [
  { id: 'live', label: 'Live Tracker' },
  { id: 'reports', label: 'Reports' }
];

export function Automation() {
  const { COLORS } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'live';
  const setCurrentTab = (id) => setSearchParams({ tab: id }, { replace: true });

  return (
    <div style={{ padding: '24px 32px', animation: 'fadeIn 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, marginBottom: 3 }}>Automation Report</div>
          <div style={{ fontSize: 13, color: COLORS.textSub }}>
            Monitor Live Run Executions and View Detailed Test Reports.
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 16,
            alignItems: 'center',
            padding: '8px 16px',
            background: COLORS.surface,
            borderRadius: 8,
            border: `1px solid ${COLORS.border}`,
            flexShrink: 0
          }}>
          {[
            { status: 'Passed', config: statusConfig.Passed },
            { status: 'Failed', config: statusConfig.Failed },
            { status: 'InProgress', config: statusConfig.InProgress },
            { status: 'Skipped', config: statusConfig.Skipped },
            { status: 'Interrupted', config: statusConfig.Interrupted },
            { status: 'NotStarted', config: statusConfig.NotStarted }
          ].map((item) => (
            <div
              key={item.status}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                fontWeight: 500,
                color: COLORS.textSub
              }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.config.dot }} />
              <span>{item.config.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 2, marginBottom: 22, borderBottom: `1px solid ${COLORS.border}` }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setCurrentTab(t.id)}
            style={{
              padding: '8px 16px',
              fontSize: 13,
              fontWeight: currentTab === t.id ? 600 : 400,
              color: currentTab === t.id ? COLORS.blue : COLORS.textSub,
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${currentTab === t.id ? COLORS.blue : 'transparent'}`,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
            {t.label}
          </button>
        ))}
      </div>
      {currentTab === 'live' && <LiveTracker />}
      {currentTab === 'reports' && <ReportList />}
    </div>
  );
}
