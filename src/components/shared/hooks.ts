import { useTheme } from '@mui/material';

export function useIsDark(): boolean {
  const theme = useTheme();
  return theme.palette.mode === 'dark';
}
