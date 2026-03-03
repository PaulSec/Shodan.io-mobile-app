import { Platform, ViewStyle } from 'react-native';
type ShadowPreset = Pick<ViewStyle, 'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'>;
const create = (y: number, r: number, o: number, e: number): ShadowPreset =>
  Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: y }, shadowOpacity: o, shadowRadius: r },
    android: { elevation: e },
    default: { shadowColor: '#000', shadowOffset: { width: 0, height: y }, shadowOpacity: o, shadowRadius: r, elevation: e },
  }) as ShadowPreset;
export const Shadows = {
  none: create(0, 0, 0, 0), sm: create(1, 2, 0.15, 2), md: create(2, 6, 0.2, 4),
  lg: create(4, 12, 0.25, 8), xl: create(8, 24, 0.3, 12),
  glow: { ...create(0, 12, 0.4, 6), shadowColor: '#D72A2A' } as ShadowPreset,
  accentGlow: { ...create(0, 12, 0.4, 6), shadowColor: '#00FF9D' } as ShadowPreset,
} as const;
export type ShadowToken = keyof typeof Shadows;
