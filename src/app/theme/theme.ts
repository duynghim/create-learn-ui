import { createTheme } from '@mantine/core';

export const theme = createTheme({
  primaryColor: 'fresh-orange',
  fontFamily:
    'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
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
    // Primary Orange - Vibrant, energetic education theme
    'fresh-orange': [
      '#fff3e0', // 0 - lightest (50)
      '#ffe0b2', // 1 (100)
      '#ffcc80', // 2 (200)
      '#ffb74d', // 3 (300)
      '#ffa726', // 4 (400) - light
      '#fb8c00', // 5 (500) - main
      '#f57c00', // 6 (600)
      '#ef6c00', // 7 (700) - dark
      '#e65100', // 8 (800)
      '#bf360c', // 9 (900) - darkest
    ],
    // Secondary Cyan - Professional, trust-building
    'fresh-cyan': [
      '#e1f5fe', // 0 - lightest (50)
      '#b3e5fc', // 1 (100)
      '#81d4fa', // 2 (200)
      '#4fc3f7', // 3 (300)
      '#29b6f6', // 4 (400)
      '#03a9f4', // 5 (500)
      '#039be5', // 6 (600)
      '#0288d1', // 7 (700)
      '#0277bd', // 8 (800)
      '#01579b', // 9 (900) - darkest
    ],
    // Accent Cyan Bright - For highlights and CTAs
    'fresh-blue': [
      '#e1f5fe', // 0
      '#b3e5fc', // 1
      '#81d4fa', // 2
      '#4fc3f7', // 3
      '#40c4ff', // 4 - light
      '#00b0ff', // 5 - main (A400)
      '#0091ea', // 6 - dark (A700)
      '#0288d1', // 7
      '#0277bd', // 8
      '#01579b', // 9
    ],
    // Success Green - Achievements, progress
    'fresh-green': [
      '#e8f5e9', // 0
      '#c8e6c9', // 1
      '#a5d6a7', // 2
      '#81c784', // 3
      '#66bb6a', // 4
      '#4caf50', // 5 - main
      '#43a047', // 6
      '#388e3c', // 7
      '#2e7d32', // 8
      '#1b5e20', // 9
    ],
    // Error/Warning colors matching Material Design
    'error-red': [
      '#ffebee', // 0
      '#ffcdd2', // 1
      '#ef9a9a', // 2
      '#e57373', // 3
      '#ef5350', // 4 - light
      '#d32f2f', // 5 - main
      '#c62828', // 6 - dark
      '#b71c1c', // 7
      '#8e0000', // 8
      '#6d0000', // 9
    ],
    'warning-orange': [
      '#fff3e0', // 0
      '#ffe0b2', // 1
      '#ffcc80', // 2
      '#ffb74d', // 3
      '#ff9800', // 4 - light
      '#ed6c02', // 5 - main
      '#e65100', // 6 - dark
      '#d84315', // 7
      '#bf360c', // 8
      '#a02f0b', // 9
    ],
  },
  defaultGradient: {
    from: '#fb8c00', // fresh-orange.5
    to: '#00b0ff', // fresh-blue.5
    deg: 45,
  },
  shadows: {
    xs: '0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 2px 0px rgba(0, 0, 0, 0.12)',
    sm: '0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12)',
    md: '0px 3px 3px -2px rgba(0, 0, 0, 0.2), 0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12)',
    lg: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
    xl: '0px 7px 8px -4px rgba(0, 0, 0, 0.2), 0px 12px 17px 2px rgba(0, 0, 0, 0.14), 0px 5px 22px 4px rgba(0, 0, 0, 0.12)',
  },
  radius: {
    xs: '2px',
    sm: '4px',
    md: '4px',
    lg: '6px',
    xl: '8px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
  },
  headings: {
    fontFamily:
      'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    sizes: {
      h1: { fontSize: '6rem', lineHeight: '1.167', fontWeight: '700' },
      h2: { fontSize: '3.75rem', lineHeight: '1.2', fontWeight: '700' },
      h3: { fontSize: '3rem', lineHeight: '1.167', fontWeight: '500' },
      h4: { fontSize: '2.125rem', lineHeight: '1.235', fontWeight: '500' },
      h5: { fontSize: '1.5rem', lineHeight: '1.334', fontWeight: '500' },
      h6: { fontSize: '1.25rem', lineHeight: '1.6', fontWeight: '500' },
    },
  },
  components: {
    Button: {
      defaultProps: {
        radius: 'sm',
      },
      styles: {
        root: {
          fontWeight: 500,
          fontSize: '0.875rem',
          lineHeight: '1.75',
          textTransform: 'none',
          transition:
            'background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
    Card: {
      defaultProps: {
        radius: 'sm',
        shadow: 'sm',
      },
      styles: {
        root: {
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },
    Input: {
      styles: {
        input: {
          borderColor: 'rgba(0, 0, 0, 0.23)',
          transition: 'border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          '&:focus': {
            borderColor: '#fb8c00',
          },
        },
      },
    },
    Paper: {
      defaultProps: {
        shadow: 'md',
        radius: 'sm',
      },
    },
  },
  other: {
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    transitions: {
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      },
      duration: {
        shortest: 150,
        shorter: 200,
        short: 250,
        standard: 300,
        complex: 375,
        enteringScreen: 225,
        leavingScreen: 195,
      },
    },
  },
});
