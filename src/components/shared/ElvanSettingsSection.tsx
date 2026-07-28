import React from 'react';
import { Box, Typography, Divider, Paper, ButtonBase, Tooltip, useMediaQuery, IconButton } from '@mui/material';

export interface SettingsSectionProps {
  title?: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  sx?: any;
  paperSx?: any;
}

export function SettingsSection({ title, description, children, sx, paperSx }: SettingsSectionProps) {
  return (
    <Box sx={{ mb: 3, ...sx }}>
      {title && (
        <Typography variant="subtitle2" sx={{ ml: 2, mb: 1, fontWeight: 600, color: 'text.secondary', fontSize: '0.85rem' }}>
          {title}
        </Typography>
      )}
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: '24px', 
          overflow: 'hidden', 
          bgcolor: 'var(--mac-card-bg, #1c1c1e)',
          border: 'none',
          ...paperSx
        }}
      >
        {React.Children.toArray(children).filter(Boolean).map((child, index, array) => (
          <React.Fragment key={index}>
            {child}
            {index < array.length - 1 && <Divider sx={{ ml: '20px', mr: '20px', borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)' }} />}
          </React.Fragment>
        ))}
      </Paper>
      {description && (
        <Typography variant="caption" sx={{ ml: 2, mt: 1, display: 'block', color: 'text.secondary' }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

export function SidebarItem({ icon, iconColor, title, description, isActive, onClick }: any) {
  const isSmallScreen = useMediaQuery('(max-width: 900px)');

  const getIconBg = (color?: string) => {
    switch(color) {
      case 'blue': return '#2196F3';
      case 'purple': return '#9C27B0';
      case 'orange': return '#FF9800';
      case 'monochrome': return (theme: any) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
      default: return 'var(--mac-selection-hover, rgba(255, 255, 255, 0.1))';
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title={isSmallScreen ? title : ''} placement="right" disableHoverListener={!isSmallScreen}>
        {isSmallScreen ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 1, width: '100%', zIndex: isActive ? 2 : 1 }}>
            <IconButton 
              onClick={onClick}
              sx={{ 
                bgcolor: isActive ? (theme: any) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)' : 'transparent',
                color: (theme: any) => iconColor === 'monochrome' ? (theme.palette.mode === 'dark' ? '#fff' : '#444') : '#ffffff',
              }}
            >
              {icon}
            </IconButton>
          </Box>
        ) : (
          <ButtonBase 
            onClick={onClick}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              width: '100%',
              justifyContent: 'flex-start',
              textAlign: 'left',
              p: '16px 20px',
              borderRadius: '20px',
              bgcolor: isActive ? (theme: any) => theme.palette.mode === 'dark' ? '#282929' : '#FFFFFF' : 'transparent',
              transition: 'background-color 0.2s',
              zIndex: isActive ? 2 : 1,
            }}
          >
            {icon && (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', mr: 2, color: (theme: any) => iconColor === 'monochrome' ? (theme.palette.mode === 'dark' ? '#fff' : '#444') : '#ffffff', bgcolor: getIconBg(iconColor), flexShrink: 0 }}>
                {icon}
              </Box>
            )}
            <Box sx={{ flexGrow: 1, minWidth: 0, pr: 2 }}>
              <Typography sx={{ fontWeight: 500, fontSize: '16px', color: 'var(--mac-text, #ffffff)', lineHeight: 1.2 }}>
                {title}
              </Typography>
              {description && (
                <Typography sx={{ mt: '4px', display: 'block', fontSize: '13px', color: 'var(--mac-text-secondary, #aaaaaa)' }}>
                  {description}
                </Typography>
              )}
            </Box>
          </ButtonBase>
        )}
      </Tooltip>
      {!isActive && (
         <Box sx={{ 
           position: 'absolute', 
           bottom: 0, 
           left: isSmallScreen ? '24px' : '72px', 
           right: isSmallScreen ? '24px' : '20px', 
           height: '1px', 
           borderBottom: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
           pointerEvents: 'none',
           zIndex: 0
         }} />
      )}
    </Box>
  );
}

export function SettingsRow({ icon, iconColor, title, description, control, onClick, sx }: any) {
  const getIconBg = (color?: string) => {
    switch(color) {
      case 'blue': return '#2196F3';
      case 'purple': return '#9C27B0';
      case 'orange': return '#FF9800';
      case 'green': return '#25D366';
      case 'red': return '#F44336';
      case 'monochrome': return (theme: any) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)';
      default: return 'transparent';
    }
  };

  const ContentBox = onClick ? ButtonBase : Box;

  return (
    <ContentBox 
      onClick={onClick}
      sx={{ 
        position: 'relative',
        display: 'flex', 
        alignItems: 'center', 
        width: '100%',
        justifyContent: 'flex-start',
        textAlign: 'left',
        p: '16px 20px',
        cursor: onClick ? 'pointer' : 'default',
        '@media (hover: hover)': {
          '&:hover': onClick ? { bgcolor: (theme) => theme.palette.mode === 'dark' ? 'var(--mac-selection-hover, rgba(255, 255, 255, 0.05))' : 'action.hover' } : {},
        },
        transition: 'background-color 0.2s',
        ...sx
      }}
    >
      {icon && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', mr: 2, color: (theme: any) => iconColor === 'monochrome' ? (theme.palette.mode === 'dark' ? '#fff' : '#444') : (iconColor ? '#fff' : 'var(--mac-text)'), bgcolor: getIconBg(iconColor), flexShrink: 0 }}>
          {icon}
        </Box>
      )}
      <Box sx={{ flexGrow: 1, minWidth: 0, pr: 2 }}>
        <Typography sx={{ fontWeight: 500, fontSize: '15px', color: 'var(--mac-text, #ffffff)', lineHeight: 1.3 }}>
          {title}
        </Typography>
        {description && (
          <Typography sx={{ mt: '2px', display: 'block', fontSize: '12px', color: 'var(--mac-text-secondary, #aaaaaa)' }}>
            {description}
          </Typography>
        )}
      </Box>
      {control && (
        <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          {control}
        </Box>
      )}
    </ContentBox>
  );
}
