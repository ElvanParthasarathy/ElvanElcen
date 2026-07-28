import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Bell, ChatCircle, Trash } from '@phosphor-icons/react';
import { SidebarItem } from '../shared/ElvanSettingsSection';
import { useIsDark } from '../shared/hooks';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';

interface NotificationsSidebarProps {
  accounts: any[];
  activeAccount: string;
  setActiveAccount: (name: string) => void;
  groupedCounts: Record<string, number>;
  onClearAll: () => void;
}

export default function NotificationsSidebar({
  accounts,
  activeAccount,
  setActiveAccount,
  groupedCounts,
  onClearAll,
}: NotificationsSidebarProps) {
  const isDark = useIsDark();
  const { t } = useI18n();
  const totalCount = groupedCounts['All'] || 0;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1 }}>
        <SidebarItem
          icon={<Bell size={20} weight="fill" />}
          iconColor="monochrome"
          title={t(k.NOTIF_SIDEBAR_ALL)}
          description={`${totalCount} ${t(k.NOTIF_PLURAL)}`}
          isActive={activeAccount === 'All'}
          onClick={() => setActiveAccount('All')}
        />

        {accounts.map((acc: any) => {
          const count = groupedCounts[acc.name] || 0;
          return (
            <SidebarItem
              key={acc.id}
              icon={<ChatCircle size={20} weight="fill" />}
              iconColor="monochrome"
              title={acc.name}
              description={`${count} ${t(k.NOTIF_PLURAL)}`}
              isActive={activeAccount === acc.name}
              onClick={() => setActiveAccount(acc.name)}
            />
          );
        })}
      </Box>
    </Box>
  );
}
