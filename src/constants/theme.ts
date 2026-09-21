// Botanical Living - Design System Tokens
// Derived from stitch_plants_e_commerce_app/botanical_living/DESIGN.md

export const Colors = {
  // Brand Greens
  primary: '#012d1d',          // Dominant editorial forest green
  primaryContainer: '#1b4332', // Container deep forest green
  primaryHover: '#2d6a4f',     // Interactive pressed states
  onPrimary: '#ffffff',
  onPrimaryContainer: '#86af99',
  inversePrimary: '#a5d0b9',

  // Sages & Accents
  secondary: '#0e6c4a',
  secondaryLight: '#74c69d',
  secondaryContainer: '#a0f4c8',
  secondaryTender: '#d8f3dc',  // Light badge fills
  onSecondary: '#ffffff',
  onSecondaryContainer: '#19724f',

  // Terracotta & Earth Accents
  tertiary: '#1f2a0e',
  tertiaryContainer: '#344022',
  tertiaryFixed: '#dae8be',
  onTertiary: '#ffffff',
  amber: '#b45309',
  amberLight: '#fef3c7',

  // Surface Canvas (Warm Linen)
  surface: '#fbf9f5',          // Natural warm linen base
  surfaceBright: '#fbf9f5',
  surfaceDim: '#dbdad6',
  surfaceContainerLow: '#f5f3ef',
  surfaceContainer: '#efeeea',
  surfaceContainerHigh: '#eae8e4',
  surfaceContainerHighest: '#e4e2de',
  surfaceContainerLowest: '#ffffff', // Pure white for raised cards

  // Text & Icons
  onSurface: '#1b1c1a',
  onSurfaceVariant: '#414844',
  inverseSurface: '#30312e',
  inverseOnSurface: '#f2f0ed',

  // Outlines & Dividers
  outline: '#717973',
  outlineVariant: '#c1c8c2',
  surfaceTint: '#3f6653',

  // Status
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
};

export const Radii = {
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  gutterMobile: 12,
  marginMobile: 16,
  gutterDesktop: 24,
  marginDesktop: 32,
};

export const Shadows = {
  sm: {
    shadowColor: '#1b4332',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#1b4332',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1b4332',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.11,
    shadowRadius: 24,
    elevation: 8,
  },
  modal: {
    shadowColor: '#012d1d',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 36,
    elevation: 16,
  },
};
