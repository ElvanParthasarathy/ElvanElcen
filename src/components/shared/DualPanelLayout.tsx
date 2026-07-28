import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import '../../styles/settings.css';

interface DualPanelLayoutProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
  title: string;
}

export default function DualPanelLayout({ sidebar, content, title }: DualPanelLayoutProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isSmallScreen = useMediaQuery('(max-width: 900px)');

  const cssVars = {
    '--mac-card-bg': isDark ? '#282929' : '#FFFFFF', 
    '--mac-selection-hover': isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
    '--mac-text': isDark ? '#ffffff' : '#000000',
    '--mac-text-secondary': isDark ? '#aaaaaa' : '#666666',
    '--mac-divider': isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    backgroundColor: isDark ? '#161717' : '#F6F5F4', 
    color: isDark ? '#ffffff' : '#000000',
    height: '100%',
    width: '100%'
  } as React.CSSProperties;

  return (
    <div className="s2-page-view" style={cssVars}>
      <div className="s2-content-grid" style={{ gridTemplateColumns: isSmallScreen ? '64px 1fr' : '380px 1fr' }}>
        {/* LEFT HUB */}
        <Box 
          className="s2-col-left" 
          sx={{ 
            paddingRight: isSmallScreen ? '8px' : '24px', 
            paddingLeft: isSmallScreen ? '8px' : '24px', 
            borderRight: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.08)',
            scrollbarGutter: isSmallScreen ? 'auto' : 'stable',
            '&::-webkit-scrollbar': isSmallScreen ? { display: 'none' } : undefined,
            msOverflowStyle: isSmallScreen ? 'none' : 'auto',
            scrollbarWidth: isSmallScreen ? 'none' : 'auto',
          }}
        >
          {!isSmallScreen && (
            <div className="s2-sub-header" style={{ marginBottom: '32px', paddingLeft: '20px' }}>
              <Typography sx={{ fontSize: '22px', fontWeight: 600 }}>{title}</Typography>
            </div>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            {sidebar}
          </Box>
        </Box>

        {/* RIGHT DETAIL VIEW */}
        <Box className="s2-col-right" sx={{ paddingLeft: '24px', display: 'flex', flexDirection: 'column' }}>
          {content}
        </Box>
      </div>
    </div>
  );
}
