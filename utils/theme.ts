export const COLORS = {
  background: '#040C10',
  card: '#0A1419',
  popover: '#0F1C23',
  accent: '#152128',
  muted: '#1C2B34',

  border: '#152128',
  borderSubtle: 'rgba(242, 245, 247, 0.08)',
  divider: '#243038',

  foreground: '#F2F5F7',
  textPrimary: '#F2F5F7',
  textSecondary: '#A8B8C2',
  textMuted: '#7A8D9A',
  textDisabled: '#455661',
  placeholder: '#5A6D7A',

  ecoGreen: '#04eaaa',
  ecoGreenHover: '#1affc8',
  ecoGreenPressed: '#03bb88',
  ecoGreenLight: '#b3ffec',
  ecoBlue: '#10a6de',
  ecoBlueHover: '#1abaf1',
  ecoBluePressed: '#0d85b2',
  ecoTeal: '#207071',

  success: '#04eaaa',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#10a6de',

  chartEmerald: '#04eaaa',
  chartCyan: '#10a6de',
  chartTeal: '#207071',
  chartAmber: '#f59e0b',
  chartSlate: '#5A6D7A',

  darkBg: '#040C10',
  darkSecondary: '#152128',
  darkTertiary: '#1C2B34',
  darkPrimary: '#040C10',

  lightPrimary: '#f5f5f5',
  lightSecondary: '#ffffff',
  lightBg: '#f5f5f5',

  brandBlue: '#10a6de',
  primaryGreen: '#04eaaa',
  secondaryBlue: '#10a6de',
  gradientStart: '#04eaaa',
  gradientEnd: '#10a6de',

  successGreen: '#04eaaa',
  alertRed: '#ef4444',
  warningOrange: '#f59e0b',

  textPrimaryDark: '#F2F5F7',
  textSecondaryDark: '#A8B8C2',
  textMutedDark: '#7A8D9A',
  placeholderDark: '#5A6D7A',

  textPrimaryLight: '#1a1a1a',
  textSecondaryLight: 'rgba(17,17,17,0.7)',

  glassDark: 'rgba(4, 12, 16, 0.70)',
  glassDarkBorder: 'rgba(242, 245, 247, 0.08)',
  glassLight: 'rgba(255,255,255,0.95)',
  glassLightBorder: 'rgba(0,0,0,0.08)',

  cardBg: '#0A1419',
  cardBorder: '#152128',
  borderDefault: '#152128',
  borderHeavy: '#243038',
  hoverBg: '#152128',
  inputBg: '#0F1C23',
  surfaceBg: '#0A1419',
};

export const statusBadge = (color: string) => ({
  background: color + '1A',
  border: color + '40',
  text: color,
});

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 12,
  xl: 12,
  '2xl': 12,
  base: 12,
  full: 9999,
};

export const TYPOGRAPHY = {
  hero: {
    fontSize: 28,
    fontWeight: '700' as const,
    fontFamily: 'System',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600' as const,
    fontFamily: 'System',
  },
  body: {
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: 'System',
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    fontFamily: 'System',
  },
  micro: {
    fontSize: 10,
    fontWeight: '600' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    fontFamily: 'System',
  },
};

export const SHADOWS = {
  card: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  button: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  subtle: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

export const gradients = {
  brand: ['#04eaaa', '#10a6de'] as const,
  brandHorizontal: ['#04eaaa', '#10a6de'] as const,
};

export const glassmorphism = {
  background: 'rgba(4, 12, 16, 0.70)',
  blur: 20,
  border: 'rgba(242, 245, 247, 0.08)',
};
