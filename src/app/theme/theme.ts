import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Roboto, sans-serif',
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
      'rgba(55, 178, 77, 1)',
      'rgba(55, 178, 77, 1)',
      'rgba(55, 178, 77, 1)',
      'rgba(55, 178, 77, 1)',
      'rgba(55, 178, 77, 1)',
      'rgba(55, 178, 77, 1)',
      'rgba(55, 178, 77, 1)',
      'rgba(55, 178, 77, 1)',
      'rgba(55, 178, 77, 1)',
      'rgba(55, 178, 77, 1)',
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
