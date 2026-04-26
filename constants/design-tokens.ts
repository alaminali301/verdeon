// ============================================================
// VERDEON DESIGN TOKENS
// Source of truth for all colors, typography, spacing, shadows
// Import this into your theme / tailwind config / StyleSheet
// ============================================================

export const colors = {
  // Brand greens
  green: {
    950: '#071a10',
    900: '#0e3320',
    800: '#1a5c38',
    700: '#237848',
    600: '#2d9459',
    500: '#3aad6b',
    400: '#5ec48a',
    300: '#8fd9a8',
    200: '#bfedcf',
    100: '#e4f8eb',
    50:  '#f2fdf5',
  },
  // Warm neutrals
  sand: {
    300: '#d4c7b0',
    200: '#e8dfce',
    100: '#f5f0e8',
  },
  // UI
  charcoal: '#1c1c1e',
  muted:    '#6b7a72',
  white:    '#ffffff',
  // Semantic
  danger:   '#ef4444',
  warning:  '#f59e0b',
  success:  '#22c55e',
} as const;

export const typography = {
  fontDisplay: 'Playfair Display',  // serif — headings, numbers, brand
  fontBody:    'Instrument Sans',   // sans — body, UI, labels
  // Scale (rem)
  sizes: {
    xs:   '0.72rem',
    sm:   '0.82rem',
    base: '0.92rem',
    md:   '1rem',
    lg:   '1.1rem',
    xl:   '1.4rem',
    '2xl':'1.9rem',
    '3xl':'2.4rem',
    '4xl':'3rem',
    hero: 'clamp(2.6rem, 4.5vw, 3.8rem)',
  },
  weights: { light: '300', regular: '400', medium: '500', semibold: '600', bold: '700' },
  leading: { tight: '1.12', snug: '1.3', normal: '1.6', relaxed: '1.75' },
  tracking: { tight: '-0.03em', normal: '0', wide: '0.06em', wider: '0.1em' },
} as const;

export const spacing = {
  // Use 4-point grid
  1:  '4px',
  2:  '8px',
  3:  '12px',
  4:  '16px',
  5:  '20px',
  6:  '24px',
  8:  '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
} as const;

export const radii = {
  sm: '8px',
  md: '14px',
  lg: '24px',
  xl: '40px',
  full: '9999px',
} as const;

export const shadows = {
  card: '0 2px 20px rgba(14,51,32,.08), 0 1px 4px rgba(14,51,32,.05)',
  lift: '0 8px 40px rgba(14,51,32,.14), 0 2px 8px rgba(14,51,32,.07)',
  glow: '0 8px 30px rgba(58,173,107,.35)',
} as const;

// Sector color palette (used consistently for charts/maps)
export const sectorColors: Record<string, string> = {
  'Power Plants':  colors.green[900],
  'Chemicals':     colors.green[600],
  'Petroleum & Gas': colors.green[500],
  'Minerals':      colors.green[400],
  'Waste':         colors.green[300],
  'Metals':        colors.green[200],
  'Refineries':    colors.green[700],
  'Other':         colors.green[800],
};

// Expo / React Native specific
export const expoTheme = {
  dark: false,
  colors: {
    primary:    colors.green[700],
    background: colors.green[50],
    card:       colors.white,
    text:       colors.charcoal,
    border:     colors.green[100],
    notification: colors.green[500],
  },
};
