import React from 'react';
import { Box, Chip, useMediaQuery, Tooltip, IconButton, Avatar, Typography, Divider } from '@mui/material';
import { FolderOpen, Image, VideoCamera, FileText, Headphones } from '@phosphor-icons/react';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import { useIsDark } from '../shared/hooks';
import { SidebarItem } from '../shared/ElvanSettingsSection';

interface MediaSidebarProps {
  accounts: any[];
  activeAccount: string;
  setActiveAccount: (val: string) => void;
  activeFilter: string;
  setActiveFilter: (val: string) => void;
}

export default function MediaSidebar({ accounts, activeAccount, setActiveAccount, activeFilter, setActiveFilter }: MediaSidebarProps) {
  const isDark = useIsDark();
  const { t } = useI18n();
  const isSmallScreen = useMediaQuery('(max-width: 900px)');

  return (
    <>
      <Box 
        sx={{ 
          px: isSmallScreen ? 0 : '20px', 
          mb: 3, 
          display: 'flex', 
          gap: 1, 
          flexDirection: isSmallScreen ? 'column' : 'row',
          alignItems: isSmallScreen ? 'center' : 'flex-start',
          flexWrap: isSmallScreen ? 'nowrap' : 'nowrap', 
          overflowX: isSmallScreen ? 'visible' : 'auto',
          pb: 1, // for scrollbar
          '&::-webkit-scrollbar': { height: '4px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', borderRadius: '4px' }
        }}
      >
        <Tooltip title={isSmallScreen ? t(k.MEDIA_ALL) : ''} placement="right" disableHoverListener={!isSmallScreen}>
          {isSmallScreen ? (
            <IconButton 
              onClick={() => setActiveAccount('All')}
              sx={{
                bgcolor: activeAccount === 'All' ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent',
                color: isDark ? '#fff' : '#000',
                width: 36, height: 36,
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>{t(k.MEDIA_ALL).charAt(0).toUpperCase()}</Typography>
            </IconButton>
          ) : (
            <Chip
              label={t(k.MEDIA_ALL)}
              onClick={() => setActiveAccount('All')}
              sx={{
                fontWeight: 600,
                flexShrink: 0,
                bgcolor: activeAccount === 'All' ? (isDark ? '#fff' : '#111b21') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                color: activeAccount === 'All' ? (isDark ? '#000' : '#fff') : 'var(--mac-text)',
                '&:hover': { bgcolor: activeAccount === 'All' ? undefined : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }
              }}
            />
          )}
        </Tooltip>
        
        {accounts.map((a: any) => (
          <Tooltip key={a.id} title={isSmallScreen ? a.name : ''} placement="right" disableHoverListener={!isSmallScreen}>
            {isSmallScreen ? (
              <IconButton 
                onClick={() => setActiveAccount(a.name)}
                sx={{
                  bgcolor: activeAccount === a.name ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)') : 'transparent',
                  color: isDark ? '#fff' : '#000',
                  width: 36, height: 36,
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: '15px' }}>{a.name.charAt(0).toUpperCase()}</Typography>
              </IconButton>
            ) : (
              <Chip
                label={a.name}
                onClick={() => setActiveAccount(a.name)}
                sx={{
                  fontWeight: 600,
                  flexShrink: 0,
                  bgcolor: activeAccount === a.name ? (isDark ? '#fff' : '#111b21') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                  color: activeAccount === a.name ? (isDark ? '#000' : '#fff') : 'var(--mac-text)',
                  '&:hover': { bgcolor: activeAccount === a.name ? undefined : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') }
                }}
              />
            )}
          </Tooltip>
        ))}
      </Box>

      {isSmallScreen && (
        <Divider sx={{ my: 1, mx: 2, borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' }} />
      )}

      <SidebarItem
        icon={<FolderOpen size={20} weight="fill" />} iconColor="monochrome"
        title={t(k.MEDIA_SIDEBAR_ALL)} description={t(k.MEDIA_DESC_ALL)}
        isActive={activeFilter === 'All'} onClick={() => setActiveFilter('All')}
      />
      <SidebarItem
        icon={<Image size={20} weight="fill" />} iconColor="monochrome"
        title={t(k.MEDIA_IMAGES)} description={t(k.MEDIA_DESC_IMAGES)}
        isActive={activeFilter === 'Images'} onClick={() => setActiveFilter('Images')}
      />
      <SidebarItem
        icon={<VideoCamera size={20} weight="fill" />} iconColor="monochrome"
        title={t(k.MEDIA_VIDEOS)} description={t(k.MEDIA_DESC_VIDEOS)}
        isActive={activeFilter === 'Videos'} onClick={() => setActiveFilter('Videos')}
      />
      <SidebarItem
        icon={<FileText size={20} weight="fill" />} iconColor="monochrome"
        title={t(k.MEDIA_DOCUMENTS)} description={t(k.MEDIA_DESC_DOCUMENTS)}
        isActive={activeFilter === 'Documents'} onClick={() => setActiveFilter('Documents')}
      />
      <SidebarItem
        icon={<Headphones size={20} weight="fill" />} iconColor="monochrome"
        title={t(k.MEDIA_AUDIO)} description={t(k.MEDIA_DESC_AUDIO)}
        isActive={activeFilter === 'Audio'} onClick={() => setActiveFilter('Audio')}
      />
    </>
  );
}
