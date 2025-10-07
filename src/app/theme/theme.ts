import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'fresh-blue',
  fontFamily: 'Roboto, sans-serif',
  black: 'rgba(0, 0, 0, 0.87)',
  breakpoints: {
    xs: '30em', // 480px
    xssm: '35rem', // 560px
    sm: '48em', // 768px
    smmd: '70em', // 1120px
    md: '64em', // 1024px
    lg: '74em', // 1184px
    xl: '90em', // 1440px
    xxl: '123.75rem', //1980px
    xxxl: '152.5rem',
  },
  colors: {
    'fresh-green': [
      '#e8f5e8', // 0 - lightest
      '#c3e6c3', // 1
      '#9dd89d', // 2
      '#77c977', // 3
      '#51bb51', // 4
      '#37b24d', // 5
      '#2f9e44', // 6
      '#2b8a3e', // 7
      '#267038', // 8
      '#1c5630', // 9 - darkest
    ],
    'fresh-blue': [
      '#e7f5ff',
      '#d0ebff',
      '#a5d8ff',
      '#74c0fc',
      '#339af0',
      '#228be6',
      '#1c7ed6',
      '#1971c2',
      '#1864ab',
      '#0c4b7a',
    ],
  },
  defaultGradient: {
    from: 'orange',
    to: 'red',
    deg: 45,
  },
  other: {
    fontWeights: {
      normal: 500,
    },
  },
});
