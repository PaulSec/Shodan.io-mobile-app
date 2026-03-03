import { TextStyle } from 'react-native';
export const FontFamily = {
  mono: 'JetBrainsMono_400Regular',
  monoBold: 'JetBrainsMono_700Bold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;
export const TextStyles = {
  displayLg: { fontFamily: FontFamily.monoBold, fontSize: 28, lineHeight: 36, letterSpacing: -0.5 } as TextStyle,
  headingLg: { fontFamily: FontFamily.sansSemiBold, fontSize: 22, lineHeight: 30, letterSpacing: -0.3 } as TextStyle,
  headingMd: { fontFamily: FontFamily.sansSemiBold, fontSize: 18, lineHeight: 26, letterSpacing: -0.2 } as TextStyle,
  body: { fontFamily: FontFamily.sans, fontSize: 15, lineHeight: 22 } as TextStyle,
  bodySmall: { fontFamily: FontFamily.sans, fontSize: 13, lineHeight: 18 } as TextStyle,
  mono: { fontFamily: FontFamily.mono, fontSize: 13, lineHeight: 18 } as TextStyle,
  caption: { fontFamily: FontFamily.sansMedium, fontSize: 11, lineHeight: 16, letterSpacing: 0.2 } as TextStyle,
} as const;
export type TextStyleToken = keyof typeof TextStyles;
