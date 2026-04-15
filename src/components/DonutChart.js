import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { statusConfig } from '../constants/statusLevels';

export function DonutChart({ total, passed, failed, interrupted = 0, skipped }) {
  const { COLORS } = useTheme();
  const [hoveredStatus, setHoveredStatus] = useState(null);

  const minRate = 0.001;

  const passRate = total > 0 ? (passed / total) * 100 : 0;
  const failureRate = total > 0 ? (failed / total) * 100 : 0;
  const interruptedRate = total > 0 ? (interrupted / total) * 100 : 0;
  const skippedRate = total > 0 ? (skipped / total) * 100 : 0;

  const rates = [
    passed > 0 ? passRate : minRate,
    failed > 0 ? failureRate : minRate,
    interrupted > 0 ? interruptedRate : minRate,
    skipped > 0 ? skippedRate : minRate
  ];

  const totalRate = rates.reduce((sum, r) => sum + r, 0);
  const normalizedRates = rates.map((r) => (r / totalRate) * 100);

  const statuses = [
    { name: 'Passed', color: statusConfig.Passed.dot, count: passed, rate: normalizedRates[0] },
    { name: 'Failed', color: statusConfig.Failed.dot, count: failed, rate: normalizedRates[1] },
    { name: 'Interrupted', color: statusConfig.Interrupted.dot, count: interrupted, rate: normalizedRates[2] },
    { name: 'Skipped', color: statusConfig.Skipped.dot, count: skipped, rate: normalizedRates[3] }
  ];

  const radius = 80;
  const innerRadius = 52;
  const cx = 100;
  const cy = 100;

  let currentAngleDegrees = -90;
  const segments = statuses.map((status) => {
    const sliceAngle = (status.rate / 100) * 360;
    const startAngle = currentAngleDegrees;
    const endAngle = currentAngleDegrees + sliceAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = cx + radius * Math.cos(startRad);
    const y1 = cy + radius * Math.sin(startRad);
    const x2 = cx + radius * Math.cos(endRad);
    const y2 = cy + radius * Math.sin(endRad);

    const x3 = cx + innerRadius * Math.cos(endRad);
    const y3 = cy + innerRadius * Math.sin(endRad);
    const x4 = cx + innerRadius * Math.cos(startRad);
    const y4 = cy + innerRadius * Math.sin(startRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;

    currentAngleDegrees = endAngle;
    return { ...status, path };
  });

  const hovered = statuses.find((s) => s.name === hoveredStatus);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, width: '100%', justifyContent: 'center' }}>
      {/* Donut */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <svg width='200' height='200' viewBox='0 0 200 200'>
          {/* Drop shadow filter */}
          <defs>
            <filter id='seg-shadow' x='-20%' y='-20%' width='140%' height='140%'>
              <feDropShadow dx='0' dy='1' stdDeviation='2' floodOpacity='0.10' />
            </filter>
          </defs>
          {segments.map((segment) => (
            <path
              key={segment.name}
              d={segment.path}
              fill={segment.color}
              filter='url(#seg-shadow)'
              style={{
                transition: 'opacity 0.2s, transform 0.2s',
                opacity: hoveredStatus === null || hoveredStatus === segment.name ? 1 : 0.35,
                cursor: 'pointer',
                transformOrigin: `${cx}px ${cy}px`,
                transform: hoveredStatus === segment.name ? 'scale(1.04)' : 'scale(1)'
              }}
              onMouseEnter={() => setHoveredStatus(segment.name)}
              onMouseLeave={() => setHoveredStatus(null)}
            />
          ))}
          {/* Center */}
          <text x='100' y='97' textAnchor='middle' fontSize='26' fontWeight='700' fill={COLORS.text} fontFamily="'DM Serif Display', serif">
            {hovered ? hovered.count : total}
          </text>
          <text x='100' y='114' textAnchor='middle' fontSize='11' fill={COLORS.textHint} fontFamily="'DM Sans', sans-serif">
            {hovered ? hovered.name : 'total'}
          </text>
        </svg>
      </div>

      {/* Stat legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 140 }}>
        {statuses.map((s) => (
          <div
            key={s.name}
            onMouseEnter={() => setHoveredStatus(s.name)}
            onMouseLeave={() => setHoveredStatus(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '6px 10px',
              borderRadius: 8,
              background: hoveredStatus === s.name ? COLORS.bg : 'transparent',
              border: `1px solid ${hoveredStatus === s.name ? COLORS.border : 'transparent'}`,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: COLORS.textSub, flex: 1 }}>{s.name}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, minWidth: 24, textAlign: 'right' }}>{s.count}</span>
            {total > 0 && (
              <span style={{ fontSize: 11, color: COLORS.textHint, minWidth: 36, textAlign: 'right' }}>
                {((s.count / total) * 100).toFixed(0)}%
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
