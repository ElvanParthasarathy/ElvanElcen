import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: mode === 'dark' ? '#8696a0' : '#111b21',
    },
    background: {
      default: mode === 'dark' ? '#1d1f1f' : '#ffffff',
      paper: mode === 'dark' ? '#1d1f1f' : '#ffffff',
    },
    text: {
      primary: mode === 'dark' ? '#e9edef' : '#111b21',
      secondary: mode === 'dark' ? '#8696a0' : '#667781',
    }
  },
  typography: {
    fontFamily: '"Elvan Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'dark' ? '#1d1f1f' : '#F7F5F3',
          color: mode === 'dark' ? '#e9edef' : '#111b21',
          boxShadow: 'none',
          backgroundImage: 'none',
          borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'}`
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none'
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          display: 'none'
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minWidth: 36,
          width: 36,
          height: 36,
          minHeight: 36,
          borderRadius: '50%',
          padding: 0,
          margin: '0 4px',
          color: mode === 'dark' ? '#B5B5B5 !important' : '#5E5D5C !important',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: mode === 'dark' ? '#494A4A' : '#EAE6E4',
          },
          '&.Mui-selected': {
            backgroundColor: mode === 'dark' ? '#343636' : '#EFECEA',
            color: mode === 'dark' ? '#F9F9F9 !important' : '#0A0A0A !important',
            '&:hover': {
              backgroundColor: mode === 'dark' ? '#494A4A' : '#EAE6E4',
            }
          }
        }
      }
    }
  }
});
