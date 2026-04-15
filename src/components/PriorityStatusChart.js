import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { statusConfig } from '../constants/statusLevels';

export function PriorityStatusChart({ allTestCases }) {
  const { COLORS } = useTheme();
  const [hoveredBar, setHoveredBar] = useState(null);

  const priorityGroups = { P0: [], P1: [], P2: [], P3: [], 'N/A': [] };
  allTestCases.forEach((tc) => {
    const title = tc.title || tc.testCaseName || '';
    const match = title.match(/^(P[0-3]):/);
    const priority = match ? match[1] : 'N/A';
    priorityGroups[priority].push(tc);
  });

  const priorityStats = Object.entries(priorityGroups).map(([priority, tcs]) => {
    const passed = tcs.filter((t) => (t.status || '').toLowerCase() === 'passed').length;
    const failed = tcs.filter((t) => ['failed', 'timedout'].includes((t.status || '').toLowerCase())).length;
    const interrupted = tcs.filter((t) => (t.status || '').toLowerCase() === 'interrupted').length;
    const skipped = tcs.filter((t) => (t.status || '').toLowerCase() === 'skipped').length;
    const total = tcs.length;
    return { priority, passed, failed, interrupted, skipped, total };
  });

  const allEmpty = priorityStats.every((s) => s.total === 0);
  if (allEmpty) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: COLORS.textHint, fontSize: 13 }}>
        No test cases available
      </div>
    );
  }

  const chartH = 160;
  const barW = 44;
  const barGap = 28;
  const paddingLeft = 32;
  const paddingTop = 20;
  const paddingBottom = 32;
  const svgW = paddingLeft + priorityStats.length * (barW + barGap) + 10;
  const svgH = chartH + paddingTop + paddingBottom;
  const maxTotal = Math.max(...priorityStats.map((s) => s.total), 1);

  const gridLines = [0.25, 0.5, 0.75, 1];

  const STACKS = [
    { key: 'skipped', config: statusConfig.Skipped },
    { key: 'interrupted', config: statusConfig.Interrupted },
    { key: 'failed', config: statusConfig.Failed },
    { key: 'passed', config: statusConfig.Passed }
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width='100%' viewBox={`0 0 ${svgW} ${svgH}`} style={{ overflow: 'visible' }}>
        <defs>
          <filter id='bar-shadow' x='-10%' y='-10%' width='130%' height='130%'>
            <feDropShadow dx='0' dy='2' stdDeviation='2' floodOpacity='0.08' />
          </filter>
        </defs>

        {/* Y-axis gridlines + labels */}
        {gridLines.map((frac) => {
          const y = paddingTop + chartH - frac * chartH;
          const val = Math.round(frac * maxTotal);
          return (
            <g key={frac}>
              <line x1={paddingLeft} y1={y} x2={svgW - 4} y2={y} stroke={COLORS.border} strokeWidth='1' strokeDasharray='4 3' />
              <text x={paddingLeft - 6} y={y + 4} textAnchor='end' fontSize='9' fill={COLORS.borderMid} fontFamily="'DM Sans', sans-serif">{val}</text>
            </g>
          );
        })}

        {/* Baseline */}
        <line x1={paddingLeft} y1={paddingTop + chartH} x2={svgW - 4} y2={paddingTop + chartH} stroke={COLORS.border} strokeWidth='1' />

        {/* Bars */}
        {priorityStats.map((stat, idx) => {
          const x = paddingLeft + idx * (barW + barGap);
          const baseY = paddingTop + chartH;
          const isHovered = hoveredBar === idx;

          let offsetY = 0;
          const segments = [];
          for (const { key, config } of STACKS) {
            const count = stat[key];
            if (count <= 0) continue;
            const h = (count / maxTotal) * chartH;
            segments.push({ key, config, count, h, y: baseY - offsetY - h });
            offsetY += h;
          }

          const totalH = offsetY;

          return (
            <g
              key={stat.priority}
              onMouseEnter={() => setHoveredBar(idx)}
              onMouseLeave={() => setHoveredBar(null)}
              style={{ cursor: 'pointer' }}>
              {/* Background hover rect */}
              <rect
                x={x - 4}
                y={paddingTop}
                width={barW + 8}
                height={chartH + 4}
                fill={isHovered ? COLORS.bg : 'transparent'}
                rx='6'
              />

              {/* Stacked bar segments */}
              {segments.map((seg, si) => {
                const isTop = si === segments.length - 1;
                return (
                  <rect
                    key={seg.key}
                    x={x}
                    y={seg.y}
                    width={barW}
                    height={seg.h}
                    fill={seg.config.dot}
                    rx={isTop ? 4 : 0}
                    ry={isTop ? 4 : 0}
                    filter='url(#bar-shadow)'
                    style={{
                      opacity: isHovered ? 1 : 0.88,
                      transition: 'opacity 0.15s'
                    }}
                  />
                );
              })}

              {/* Total count above bar */}
              {stat.total > 0 && (
                <text
                  x={x + barW / 2}
                  y={baseY - totalH - 6}
                  textAnchor='middle'
                  fontSize='11'
                  fontWeight='700'
                  fill={isHovered ? COLORS.text : COLORS.textSub}
                  fontFamily="'DM Sans', sans-serif">
                  {stat.total}
                </text>
              )}

              {/* X-axis label */}
              <text
                x={x + barW / 2}
                y={baseY + 18}
                textAnchor='middle'
                fontSize='11'
                fontWeight='600'
                fill={isHovered ? COLORS.blue : COLORS.textSub}
                fontFamily="'DM Sans', sans-serif">
                {stat.priority}
              </text>

              {/* Hover tooltip */}
              {isHovered && stat.total > 0 && (
                <g>
                  <rect
                    x={x + barW / 2 - 46}
                    y={paddingTop - 52}
                    width={92}
                    height={44}
                    rx='6'
                    fill={COLORS.text}
                    opacity='0.92'
                  />
                  <text x={x + barW / 2} y={paddingTop - 36} textAnchor='middle' fontSize='10' fontWeight='700' fill='#fff' fontFamily="'DM Sans', sans-serif">
                    {stat.priority}: {stat.total} tests
                  </text>
                  <text x={x + barW / 2} y={paddingTop - 22} textAnchor='middle' fontSize='9' fill={COLORS.textHint} fontFamily="'DM Sans', sans-serif">
                    {stat.passed}P · {stat.failed}F · {stat.interrupted}I · {stat.skipped}S
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend row */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[statusConfig.Passed, statusConfig.Failed, statusConfig.Interrupted, statusConfig.Skipped].map((cfg) => (
          <div key={cfg.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: COLORS.textSub }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: cfg.dot }} />
            {cfg.label}
          </div>
        ))}
      </div>
    </div>
  );
}
