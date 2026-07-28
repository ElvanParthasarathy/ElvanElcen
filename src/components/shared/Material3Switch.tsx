import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Switch, { SwitchProps } from '@mui/material/Switch';

const Material3SwitchBase = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 52,
  height: 32,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 0,
    top: -4,
    left: -4,
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transitionDuration: '300ms',
    '@media (hover: hover)': { '&:hover': {
      backgroundColor: 'transparent',
    } },
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: '#fff',
      '@media (hover: hover)': { '&:hover': {
        backgroundColor: 'transparent',
      } },
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
        opacity: 1,
        border: 0,
      },
      '& .MuiSwitch-thumb': {
        width: 24,
        height: 24,
        backgroundColor: theme.palette.mode === 'dark' ? '#1c1c1e' : '#ffffff',
        '&::before': {
          content: "''",
          position: 'absolute',
          width: '100%',
          height: '100%',
          left: 0,
          top: 0,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
            theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
          )}" d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>')`,
        },
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 16,
    height: 16,
    backgroundColor: theme.palette.mode === 'dark' ? '#938f99' : '#79747e',
    transform: 'none',
    boxShadow: 'none',
    transition: theme.transitions.create(['width', 'height', 'background-color'], {
      duration: 300,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 32 / 2,
    backgroundColor: theme.palette.mode === 'dark' ? '#322f35' : '#e6e0e9',
    opacity: 1,
    border: `2px solid ${theme.palette.mode === 'dark' ? '#938f99' : '#79747e'}`,
    boxSizing: 'border-box',
    transition: theme.transitions.create(['background-color', 'border'], {
      duration: 300,
    }),
  },
}));

// Wrapper that disables transition on initial mount to prevent ghost animation
export const Material3Switch = React.forwardRef<HTMLButtonElement, SwitchProps>((props, ref) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);
  return (
    <Material3SwitchBase
      {...props}
      ref={ref}
      sx={{
        ...(!mounted && {
          '& .MuiSwitch-switchBase': { transitionDuration: '0ms !important' },
          '& .MuiSwitch-thumb': { transition: 'none !important' },
          '& .MuiSwitch-track': { transition: 'none !important' },
        }),
        ...(props.sx || {}),
      }}
    />
  );
});
