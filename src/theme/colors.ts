export const Colors = {
  light: {
    text: '#000000',
    background: '#FFFFFF',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
    primary: '#208AEF',
    primaryForeground: '#FFFFFF',
    danger: '#E53E3E',
    success: '#38A169',
    warning: '#D69E2E',
    border: '#E2E8F0',
    card: '#FFFFFF',
  },
  dark: {
    text: '#FFFFFF',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    primary: '#208AEF',
    primaryForeground: '#FFFFFF',
    danger: '#FC8181',
    success: '#68D391',
    warning: '#F6E05E',
    border: '#2D3748',
    card: '#1A202C',
  },
} as const;

export type ColorScheme = keyof typeof Colors;
export type ThemeColor = keyof typeof Colors.light;
