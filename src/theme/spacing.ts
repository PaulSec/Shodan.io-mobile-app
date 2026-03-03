export const Spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 20, xl: 24, '2xl': 32, '3xl': 48, '4xl': 64 } as const;
export const Radius = { sm: 6, md: 10, lg: 16, full: 9999 } as const;
export type SpacingToken = keyof typeof Spacing;
export type RadiusToken = keyof typeof Radius;
