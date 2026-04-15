import { useTheme } from '../contexts/ThemeContext';
import { TestIcon, FlagIcon } from '../components/icons';
import { ToolCard } from '../components/ToolCard';

export function Home({ onNav }) {
  const { COLORS } = useTheme();

  const TOOLS = [
    {
      id: 'automation',
      label: 'Automation Report',
      desc: 'Live tracker, reports, and suite history for all automation runs.',
      icon: <TestIcon size={20} />,
      iconBg: COLORS.blueBg,
      iconColor: COLORS.blue,
      tags: ['Live Tracker', 'Reports'],
      stat: (
        <>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: COLORS.red,
              display: 'inline-block',
              animation: 'pulse 1.4s ease-in-out infinite'
            }}
          />
          <span style={{ fontSize: 11, color: COLORS.textHint }}>Real-time monitoring</span>
        </>
      ),
      active: true
    },
    {
      id: 'trigger',
      label: 'Trigger Automation Run',
      desc: 'Manually trigger automation suites and monitor execution in real time.',
      icon: (
        <svg width={20} height={20} viewBox='0 0 20 20' fill='none'>
          <rect x='2' y='7' width='16' height='6' rx='3' fill='currentColor' opacity='0.2' stroke='currentColor' strokeWidth='1.3' />
          <circle cx='14' cy='10' r='2.5' fill='currentColor' opacity='0.9' />
        </svg>
      ),
      iconBg: COLORS.greenBg,
      iconColor: COLORS.green,
      tags: ['Manual Trigger', 'Execution'],
      stat: <span style={{ fontSize: 11, color: COLORS.textHint }}>Coming soon</span>,
      active: false
    },
    {
      id: 'ai-analyser',
      label: 'AI Report Analyser',
      desc: 'Analyse test run reports with AI to surface failure patterns and root causes.',
      icon: (
        <svg width={20} height={20} viewBox='0 0 20 20' fill='none'>
          <circle cx='10' cy='10' r='7' stroke='currentColor' strokeWidth='1.4' opacity='0.4' />
          <path d='M7 10h6M10 7v6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
          <circle cx='10' cy='10' r='2.5' fill='currentColor' opacity='0.8' />
        </svg>
      ),
      iconBg: COLORS.purpleBg,
      iconColor: COLORS.purple,
      tags: ['AI', 'Analysis'],
      stat: <span style={{ fontSize: 11, color: COLORS.textHint }}>Coming soon</span>,
      active: false
    },
    {
      id: 'feature-flags',
      label: 'Feature Flags',
      desc: 'Toggle and manage feature flags across environments and projects.',
      icon: <FlagIcon size={20} />,
      iconBg: COLORS.amberBg,
      iconColor: COLORS.amber,
      tags: ['Flags', 'Environments'],
      stat: <span style={{ fontSize: 11, color: COLORS.textHint }}>Coming soon</span>,
      active: false
    }
  ];

  return (
    <div style={{ padding: '28px 32px', animation: 'fadeIn 0.2s ease' }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: COLORS.textHint,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 12
        }}>
        Tools
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {TOOLS.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onClick={tool.active ? () => onNav(tool.id) : null} />
        ))}
      </div>
    </div>
  );
}
