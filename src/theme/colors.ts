export const DarkColors = {
  background: '#0A0E17',
  backgroundAlt: '#060A12',
  surface: '#111827',
  surfaceHover: '#1A2233',
  border: '#1E293B',
  primary: '#D72A2A',
  primaryMuted: '#7F1D1D',
  accent: '#00FF9D',
  accentAlt: '#06B6D4',
  text: '#E2E8F0',
  textMuted: '#64748B',
  textInverse: '#0A0E17',
  danger: '#EF4444',
  error: '#EF4444',
  warning: '#F59E0B',
  transparent: 'transparent',
  black: '#000000',
  white: '#FFFFFF',
} as const;

export const LightColors = {
  background: '#F8FAFC',
  backgroundAlt: '#EEF2F7',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  border: '#E2E8F0',
  primary: '#D72A2A',
  primaryMuted: '#FCA5A5',
  accent: '#059669',
  accentAlt: '#0891B2',
  text: '#0F172A',
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  danger: '#DC2626',
  error: '#DC2626',
  warning: '#D97706',
  transparent: 'transparent',
  black: '#000000',
  white: '#FFFFFF',
} as const;

export const Colors = DarkColors; // Default export for backwards compatibility

export const getColors = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? DarkColors : LightColors;
};

export type ColorToken = keyof typeof DarkColors;
