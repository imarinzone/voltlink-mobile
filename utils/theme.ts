export const COLORS = {
  darkBg: '#040C10',
  darkSecondary: '#152128',
  darkTertiary: '#1C2D36',
  darkPrimary: '#040C10',

  lightPrimary: '#f5f5f5',
  lightSecondary: '#ffffff',
  lightBg: '#f5f5f5',

  brandBlue: '#10a6de',
  primaryGreen: '#04eaaa',
  secondaryBlue: '#10a6de',
  ecoTeal: '#207071',
  gradientStart: '#04eaaa',
  gradientEnd: '#10a6de',

  successGreen: '#04eaaa',
  alertRed: '#ef4444',
  warningOrange: '#f59e0b',

  textPrimaryDark: '#F2F5F7',
  textSecondaryDark: '#CBD5DB',
  textMutedDark: '#A8B8C2',
  placeholderDark: '#7A8D9A',

  textPrimaryLight: '#1a1a1a',
  textSecondaryLight: 'rgba(17,17,17,0.7)',

  glassDark: 'rgba(255,255,255,0.08)',
  glassDarkBorder: 'rgba(255,255,255,0.15)',
  glassLight: 'rgba(255,255,255,0.95)',
  glassLightBorder: 'rgba(0,0,0,0.08)',

  cardBg: '#152128',
  cardBorder: '#243038',
  borderDefault: '#243038',
  borderHeavy: '#455661',
  hoverBg: '#344149',
  inputBg: '#1A2830',
  surfaceBg: '#152128',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

export const TYPOGRAPHY = {
  hero: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: 'System',
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: '600' as const,
    fontFamily: 'System',
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: 'System',
  },
  label: {
    fontSize: 12,
    fontWeight: '400' as const,
    fontFamily: 'System',
  },
};

export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    shadowColor: '#04eaaa',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
};
