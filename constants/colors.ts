export const Colors = {
  bg: '#F9F5F0',
  primary: '#E8622A',
  secondary: '#2D6A4F',
  accent: '#F4A261',
  text: '#1A1A1A',
  muted: '#6B6B6B',
  card: '#FFFFFF',
  border: '#E5DDD4',
  white: '#FFFFFF',
  black: '#000000',

  cooking: {
    quick: '#E8622A',
    gourmet: '#2D6A4F',
    creative: '#9B59B6',
  },
} as const;

export type ColorKey = keyof typeof Colors;
