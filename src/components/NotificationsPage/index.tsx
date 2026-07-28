import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, Chip, Stack, Paper, Avatar, Collapse } from '@mui/material';
import { Bell, Trash, X, CheckCircle, ChatCircle, ArrowRight, CaretUp, CaretDown } from '@phosphor-icons/react';
import DualPanelLayout from '../shared/DualPanelLayout';
import NotificationsSidebar from './NotificationsSidebar';
import NotificationGroup from './NotificationGroup';
import NotificationSingle from './NotificationSingle';
import { useIsDark } from '../shared/hooks';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import { formatNeram } from '../../i18n/neram';
import '../../styles/settings.css';

export interface NotificationItem {
  id: string;
  accountId: string;
  accountName: string;
  title: string;
  body: string;
  icon?: string;
  timestamp: number;
}

interface NotificationsPageProps {
  accounts: any[];
  notifications: NotificationItem[];
  onClearAll: () => void;
  onClearAccount: (accountName: string) => void;
  onClearSingle: (id: string) => void;
  onSelectNotification: (item: NotificationItem) => void;
  onAddDevTestNotification?: () => void;
}

export default function NotificationsPage({
  accounts,
  notifications,
  onClearAll,
  onClearAccount,
  onClearSingle,
  onSelectNotification,
  onAddDevTestNotification,
}: NotificationsPageProps) {
  const isDark = useIsDark();
  const { lang, t } = useI18n();
  const [activeAccount, setActiveAccount] = useState<string>('All');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  // Compute grouped counts for sidebar
  const groupedCounts: Record<string, number> = {
    All: notifications.length,
  };
  notifications.forEach((n) => {
    const key = n.accountName || 'WhatsApp';
    groupedCounts[key] = (groupedCounts[key] || 0) + 1;
  });

  // Filter notifications by activeAccount
  const filteredNotifications = activeAccount === 'All'
    ? notifications
    : notifications.filter((n) => n.accountName === activeAccount);

  // Group notifications by sender title and account
  const groupedNotifications: Record<string, NotificationItem[]> = {};
  filteredNotifications.forEach(n => {
    const key = `${n.accountId}-${n.title}`;
    if (!groupedNotifications[key]) groupedNotifications[key] = [];
    groupedNotifications[key].push(n);
  });
  
  const renderBlocks: { isGroup: boolean, key: string, items: NotificationItem[] }[] = [];
  
  Object.entries(groupedNotifications).forEach(([key, items]) => {
    // Sort items by timestamp descending (newest first) inside the group
    items.sort((a, b) => b.timestamp - a.timestamp);
    
    if (items.length > 1) {
      renderBlocks.push({ isGroup: true, key, items });
    } else {
      renderBlocks.push({ isGroup: false, key, items });
    }
  });

  // Sort the final blocks by the newest message's timestamp
  renderBlocks.sort((a, b) => b.items[0].timestamp - a.items[0].timestamp);

  const formatTime = (ts: number) => {
    return formatNeram(ts, lang, t);
  };

  const handleClearCurrent = () => {
    if (activeAccount === 'All') {
      onClearAll();
    } else {
      onClearAccount(activeAccount);
    }
  };

  const sidebarContent = (
    <NotificationsSidebar
      accounts={accounts}
      activeAccount={activeAccount}
      setActiveAccount={setActiveAccount}
      groupedCounts={groupedCounts}
      onClearAll={onClearAll}
    />
  );

  const mainContent = (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
      }}
    >
      {/* Header bar with Controls */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2.5,
          px: 3,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ ml: 5.5 }}>
          <Typography sx={{ fontSize: '18px', fontWeight: 700, color: 'text.primary' }}>
            {activeAccount === 'All' ? t(k.NOTIF_PAGE_TITLE) : `${activeAccount} ${t(k.NOTIF_PAGE_TITLE)}`}
          </Typography>
        </Stack>

        {filteredNotifications.length > 0 && (
          <Button
            variant="text"
            startIcon={<Trash size={18} />}
            onClick={handleClearCurrent}
            sx={{
              borderRadius: '24px',
              textTransform: 'none',
              fontWeight: 600,
              color: 'text.secondary',
              px: 2,
              mr: 2.5,
              '&:hover': {
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                color: 'text.primary',
                transform: 'none',
                boxShadow: 'none'
              }
            }}
          >
            {activeAccount === 'All' ? t(k.BTN_CLEAR_ALL) : `${t(k.BTN_CLEAR)} ${activeAccount}`}
          </Button>
        )}
      </Box>

      {/* Notifications List Area */}
      <Box
        sx={{
          flex: 1,
          pb: 2
        }}
      >
        {filteredNotifications.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '60%',
              textAlign: 'center',
              color: 'text.secondary',
              py: 8,
            }}
          >
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <CheckCircle size={40} color={isDark ? '#888' : '#666'} weight="duotone" />
            </Box>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, mb: 1, color: 'text.primary' }}>
              {t(k.NOTIF_ALL_CAUGHT_UP)}
            </Typography>
            <Typography sx={{ fontSize: '14px', maxWidth: 320, color: 'text.secondary' }}>
              {activeAccount === 'All' 
                ? t(k.NOTIF_EMPTY_MSG_ALL) 
                : t(k.NOTIF_EMPTY_MSG_SINGLE).replace('{account}', activeAccount)}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pb: 4, px: 3, width: '100%' }}>
            {renderBlocks.map((block) => {
              const isExpanded = expandedGroups.has(block.key);
              
              if (block.isGroup) {
                return (
                  <NotificationGroup
                    key={block.key}
                    blockKey={block.key}
                    items={block.items}
                    isExpanded={isExpanded}
                    onToggleExpand={(key) => {
                      const newSet = new Set(expandedGroups);
                      if (newSet.has(key)) newSet.delete(key);
                      else newSet.add(key);
                      setExpandedGroups(newSet);
                    }}
                    isDark={isDark}
                    formatTime={formatTime}
                    onSelectNotification={onSelectNotification}
                  />
                );
              }

              // Single non-grouped item
              const item = block.items[0];
              return (
                <NotificationSingle
                  key={item.id}
                  item={item}
                  isDark={isDark}
                  formatTime={formatTime}
                  onSelectNotification={onSelectNotification}
                  onClearSingle={onClearSingle}
                />
              );
            })}
          </Box>
        )}
        {/* Bottom DEV Button */}
        {import.meta.env.DEV && onAddDevTestNotification && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={onAddDevTestNotification}
              sx={{
                borderRadius: '24px',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              Dev: Add Test Notifs
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <DualPanelLayout
      sidebar={sidebarContent}
      content={mainContent}
      title={t(k.NOTIF_PAGE_TITLE)}
    />
  );
}
