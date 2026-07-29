import React from 'react';
import { AppBar, Toolbar, Tabs, Tab, Box, Typography, Badge, useMediaQuery } from '@mui/material';
import { ChatCircle, Folder, Gear, Bell } from '@phosphor-icons/react';
import { useI18n } from '../i18n/I18nContext';
import { k } from '../i18n/k';
import NammilLogo from '../assets/nammil_outline.webp';

interface TopBarProps {
  activeTab: string;
  setActiveTab: (val: string) => void;
  accounts: any[];
  unreadNotificationCount: number;
  notifications?: any[];
}

export default function TopBar({
  activeTab,
  setActiveTab,
  accounts,
  unreadNotificationCount,
  notifications = [],
}: TopBarProps) {
  const { t } = useI18n();
  const isSmallScreen = useMediaQuery('(max-width: 700px)');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        bgcolor: 'background.paper',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        WebkitAppRegion: 'drag',
        userSelect: 'none',
        position: 'relative',
        zIndex: 1000,
      }}
    >
      <Toolbar disableGutters variant="dense" sx={{ minHeight: 48, height: 48, pl: 1.5, pr: 2.5, display: 'flex', alignItems: 'center' }}>
        {/* Left: Brand Name */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <Box 
            sx={{ 
              width: 22,
              height: 22,
              mr: 0.5, // Reduced spacing between logo and text
              bgcolor: 'text.primary',
              WebkitMaskImage: `url(${NammilLogo})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskImage: `url(${NammilLogo})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }} 
          />
          <Typography sx={{ fontSize: '14px', fontWeight: 500, letterSpacing: 0.5, mt: '2px', color: 'text.primary' }}>
            {t(k.BRAND_NAME)}
          </Typography>
        </Box>

        {/* Center: WhatsApp Account Tabs (ChatCircle icons) */}
        <Box 
          sx={{ 
            position: isSmallScreen ? 'static' : 'absolute', 
            left: isSmallScreen ? 'auto' : '50%', 
            transform: isSmallScreen ? 'none' : 'translateX(-50%)', 
            display: 'flex', 
            justifyContent: isSmallScreen ? 'center' : 'flex-start',
            flexGrow: isSmallScreen ? 1 : 0,
            maxWidth: '50vw',
            mx: isSmallScreen ? 2 : 0,
          }}
        >
          <Tabs
            value={activeTab.startsWith('wa-') ? activeTab : false}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              minHeight: 40, 
              height: 40, 
              alignItems: 'center',
              WebkitAppRegion: 'no-drag',
              '& .MuiTab-root': {
                '&.Mui-selected:not(:hover)': {
                  backgroundColor: 'transparent !important',
                }
              }
            }}
          >
            {accounts.map((acc: any) => {
              const val = `wa-${acc.id}`;
              const isSelected = activeTab === val;
              const accountUnreadCount = notifications.filter((n: any) => !n.read && n.accountId === acc.id).length;

              return (
                <Tab 
                  key={acc.id} 
                  value={val}
                  sx={{ overflow: 'visible' }}
                  icon={
                    <Box component="span" sx={{ display: 'flex' }} title={`${t(k.TAB_WHATSAPP)} - ${acc.name}`}>
                      <Badge 
                        badgeContent={accountUnreadCount} 
                        max={99}
                        sx={{
                          '& .MuiBadge-badge': {
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#21BE62' : '#1DA860',
                            color: (theme) => theme.palette.mode === 'dark' ? '#111' : '#fff',
                            fontWeight: 'bold',
                            minWidth: '14px',
                            height: '14px',
                            fontSize: '9px',
                            padding: '0 2px',
                            lineHeight: '14px',
                          },
                          '& .MuiBadge-badge:not(.MuiBadge-invisible)': {
                            transform: 'scale(1) translate(25%, -25%)',
                          }
                        }}
                      >
                        <ChatCircle size={20} weight={isSelected ? "fill" : "regular"} />
                      </Badge>
                    </Box>
                  } 
                />
              );
            })}
          </Tabs>
        </Box>

        {/* Right: Notifications, Media, Settings (with margin for Windows Controls) */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', mr: '110px' }}>
          <Tabs
            value={['notifications', 'media', 'settings'].includes(activeTab) ? activeTab : false}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="standard"
            sx={{ 
              minHeight: 40, 
              height: 40, 
              alignItems: 'center',
              WebkitAppRegion: 'no-drag',
              '& .MuiTab-root': {
                '&.Mui-selected:not(:hover)': {
                  backgroundColor: 'transparent !important',
                }
              }
            }}
          >
            <Tab 
              value="notifications"
              sx={{ overflow: 'visible' }}
              icon={
                <Box component="span" sx={{ display: 'flex' }} title="Notifications">
                  <Badge 
                    badgeContent={unreadNotificationCount} 
                    max={99}
                    sx={{
                      '& .MuiBadge-badge': {
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#21BE62' : '#1DA860',
                        color: (theme) => theme.palette.mode === 'dark' ? '#111' : '#fff',
                        fontWeight: 'bold',
                        minWidth: '14px',
                        height: '14px',
                        fontSize: '9px',
                        padding: '0 2px',
                        lineHeight: '14px',
                      },
                      '& .MuiBadge-badge:not(.MuiBadge-invisible)': {
                        transform: 'scale(1) translate(25%, -25%)',
                      }
                    }}
                  >
                    <Bell size={20} weight={activeTab === 'notifications' ? "fill" : "regular"} />
                  </Badge>
                </Box>
              }
            />
            <Tab 
              value="media"
              icon={
                <Box component="span" sx={{ display: 'flex' }} title={t(k.TAB_MEDIA)}>
                  <Folder size={20} weight={activeTab === 'media' ? "fill" : "regular"} />
                </Box>
              }
            />
            <Tab 
              value="settings"
              icon={
                <Box component="span" sx={{ display: 'flex' }} title={t(k.TAB_SETTINGS)}>
                  <Gear size={20} weight={activeTab === 'settings' ? "fill" : "regular"} />
                </Box>
              }
            />
          </Tabs>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
