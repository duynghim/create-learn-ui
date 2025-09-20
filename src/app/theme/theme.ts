import { createTheme } from '@mantine/core';

export const theme = createTheme({
  breakpoints: {
    xs: '30em',
    sm: '48em',
    smmd: '70em',
    md: '64em',
    lg: '74em',
    xl: '90em',
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
  other: {
    fontWeights: {
      normal: 500,
    },
  },
});
