'use client';
import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-roboto)',
    h3: {
      fontWeight: 700,
      },
    h6: {
        fontWeight: 600,
      },
  },
  palette: {
    mode: 'dark',
    primary: {
        main: '#90caf9',
    },
    background: {
        default: '#121212',
        paper: 'rgba(255, 255, 255, 0.09)',
    },
  },
});

export default darkTheme;

