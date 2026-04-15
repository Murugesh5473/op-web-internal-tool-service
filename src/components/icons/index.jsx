export const GridIcon = ({ color = 'currentColor', size = 16 }) => (
  <svg width={size} height={size} viewBox='0 0 16 16' fill='none'>
    <rect x='1' y='1' width='6' height='6' rx='1.5' fill={color} opacity='0.9' />
    <rect x='9' y='1' width='6' height='6' rx='1.5' fill={color} opacity='0.5' />
    <rect x='1' y='9' width='6' height='6' rx='1.5' fill={color} opacity='0.5' />
    <rect x='9' y='9' width='6' height='6' rx='1.5' fill={color} opacity='0.9' />
  </svg>
);

export const TestIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox='0 0 16 16' fill='none'>
    <rect x='1' y='1' width='6' height='6' rx='1.2' fill='currentColor' opacity='0.8' />
    <rect x='9' y='1' width='6' height='6' rx='1.2' fill='currentColor' opacity='0.4' />
    <rect x='1' y='9' width='6' height='6' rx='1.2' fill='currentColor' opacity='0.4' />
    <path d='M10 12l2 2 3.5-3.5' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

export const FlagIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox='0 0 16 16' fill='none'>
    <path d='M3 3v10' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
    <path
      d='M3 4.5h8l-2 3 2 3H3'
      fill='currentColor'
      opacity='0.3'
      stroke='currentColor'
      strokeWidth='1.2'
      strokeLinejoin='round'
    />
  </svg>
);
