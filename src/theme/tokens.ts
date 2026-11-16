/**
 * Design tokens from the H5 style bible ("trail chalk and beer amber").
 * Colour pairs were checked to WCAG AA in the plan; change them there first.
 */

export const palette = {
  light: {
    background: '#FFF8EE',
    surface: '#FFFFFF',
    surfaceTint: '#FCEBD2',
    textPrimary: '#1F1A17',
    textSecondary: '#5E554C',
    accent: '#A84E00',
    onAccent: '#FFFFFF',
    onOn: '#2E6B3F',
    checkBack: '#B3261E',
    divider: '#E8DCCB',
    sizeS: '#2E6B3F',
    sizeM: '#1F5F99',
    sizeL: '#A84E00',
    sizeXL: '#B3261E',
  },
  dark: {
    background: '#16130F',
    surface: '#221E19',
    surfaceTint: '#3A2A14',
    textPrimary: '#F4EDE4',
    textSecondary: '#B8AEA3',
    accent: '#FFB547',
    onAccent: '#16130F',
    onOn: '#7BC98F',
    checkBack: '#FF8A80',
    divider: '#3A332B',
    sizeS: '#7BC98F',
    sizeM: '#8FC1F2',
    sizeL: '#FFB547',
    sizeXL: '#FF8A80',
  },
} as const;

export type ColorScheme = keyof typeof palette;
export type Colors = { [K in keyof (typeof palette)['light']]: string };

export const fonts = {
  display: 'BricolageGrotesque_700Bold',
  body: 'AtkinsonHyperlegible_400Regular',
  bodyBold: 'AtkinsonHyperlegible_700Bold',
} as const;

/** Sizes in points. Lyrics sizes are multiplied by the user's lyric scale and the system font scale. */
export const type = {
  display: { fontFamily: fonts.display, fontSize: 30, lineHeight: 36 },
  title: { fontFamily: fonts.display, fontSize: 22, lineHeight: 28 },
  body: { fontFamily: fonts.body, fontSize: 17, lineHeight: 24 },
  bodyBold: { fontFamily: fonts.bodyBold, fontSize: 17, lineHeight: 24 },
  secondary: { fontFamily: fonts.body, fontSize: 15, lineHeight: 20 },
  label: { fontFamily: fonts.bodyBold, fontSize: 13, lineHeight: 16, letterSpacing: 0.5 },
  lyric: { fontFamily: fonts.body, fontSize: 22, lineHeight: 33 },
  lyricCircle: { fontFamily: fonts.body, fontSize: 34, lineHeight: 46 },
} as const;

/** 8 pt grid. */
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = { card: 12, chip: 999 } as const;

/** Minimum tap target from the accessibility checklist. */
export const TAP = 48;
