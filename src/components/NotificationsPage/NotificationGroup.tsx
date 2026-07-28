import React, { useState } from 'react';
import { Avatar, Box, Collapse, IconButton, Paper, Stack, Typography } from '@mui/material';
import { CaretDown, CaretUp, ChatCircle } from '@phosphor-icons/react';
import { NotificationItem } from './index';
import NotificationSingle from './NotificationSingle';

interface NotificationGroupProps {
  blockKey: string;
  items: NotificationItem[];
  isExpanded: boolean;
  onToggleExpand: (key: string) => void;
  isDark: boolean;
  formatTime: (ts: number) => string;
  onSelectNotification: (item: NotificationItem) => void;
}

export default function NotificationGroup({
  blockKey,
  items,
  isExpanded,
  onToggleExpand,
  isDark,
  formatTime,
  onSelectNotification,
}: NotificationGroupProps) {
  const latest = items[0];
  const [isTopCardExpanded, setIsTopCardExpanded] = useState(false);
  const isLatestLongMessage = (latest.body || '').length > 60;

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header row: only visible when expanded */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Stack 
          direction="row" 
          justifyContent="space-between" 
          alignItems="center" 
          onClick={() => onToggleExpand(blockKey)}
          sx={{ 
            width: '100%',
            mt: 1,
            mb: 1, 
            pt: 0.5,
            pb: 0.5,
            pl: 4, 
            pr: 4,
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'text.secondary', lineHeight: 1, display: 'flex', alignItems: 'center', flex: 1 }}>
            {latest.title}
          </Typography>
          <Box sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <CaretUp size={16} weight="bold" />
          </Box>
        </Stack>
      </Collapse>

      {/* Main Top Card (Always visible) */}
      <Paper
        elevation={0}
        onClick={() => {
          if (!isExpanded) {
            onToggleExpand(blockKey);
          } else {
            onSelectNotification(latest);
          }
        }}
        sx={{
          p: 1.5,
          pr: 2.5,
          pl: 1.5,
          borderRadius: '48px',
          bgcolor: isDark ? '#2a2b2c' : '#FFFFFF',
          border: 'none',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease',
          position: 'relative',
          zIndex: 2,
          '&:hover': {
            bgcolor: isDark ? '#323334' : '#f5f5f5',
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={latest.icon || undefined} 
              sx={{ width: 48, height: 48, flexShrink: 0, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: 'text.primary' }}
            >
              {!latest.icon && latest.title.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
          
          <Stack sx={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
              <Typography sx={{ fontSize: '15px', fontWeight: 600, color: 'text.primary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1 }}>
                {latest.title}
              </Typography>
              <Typography sx={{ fontSize: '12px', color: 'text.secondary', fontWeight: 500, flexShrink: 0, lineHeight: 1, display: 'flex', alignItems: 'center' }}>
                {formatTime(latest.timestamp)}
              </Typography>
            </Stack>

            <Typography
              sx={{
                fontSize: '14px',
                color: 'text.secondary',
                lineHeight: 1.4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {latest.body || 'New message received'}
            </Typography>
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pl: 1, minWidth: isExpanded ? 0 : 60, transition: 'min-width 0.2s ease' }}>
            {!isExpanded && (
              <>
                <Typography sx={{ fontSize: '16px', fontWeight: 500, color: 'text.secondary' }}>
                  {items.length}
                </Typography>
                <CaretDown size={18} color={isDark ? '#888' : '#666'} />
              </>
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Stack indicator bar below the card (Only when collapsed) */}
      <Collapse in={!isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{
          height: 16,
          mx: 4.5,
          mt: -1.25,
          borderRadius: '0 0 24px 24px',
          bgcolor: isDark ? '#1f2021' : '#e0e0e0',
          position: 'relative',
          zIndex: 1,
        }} />
      </Collapse>

      {/* The rest of the messages in the group (Only when expanded) */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <Box sx={{ pt: 1.5 }}>
          <Stack spacing={1.5}>
            {items.slice(1).map((item) => (
              <NotificationSingle
                key={item.id}
                item={item}
                isDark={isDark}
                formatTime={formatTime}
                onSelectNotification={onSelectNotification}
              />
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
