import React, { useState } from 'react';
import { Avatar, Box, Collapse, IconButton, Paper, Stack, Typography } from '@mui/material';
import { CaretDown, CaretUp, ChatCircle, X } from '@phosphor-icons/react';
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
  onClearSingle?: (id: string) => void;
  onClearGroup?: (key: string) => void;
  removingIds?: Set<string>;
}

export default function NotificationGroup({
  blockKey,
  items,
  isExpanded,
  onToggleExpand,
  isDark,
  formatTime,
  onSelectNotification,
  onClearSingle,
  onClearGroup,
  removingIds,
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
            position: 'relative',
            '& .header-action-btn': { opacity: 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' },
            '&:hover .header-action-btn': { opacity: 1, pointerEvents: 'auto' },
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
        key={latest.id}
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
          transform: removingIds?.has(latest.id) ? 'translateX(-100%)' : 'none',
          opacity: removingIds?.has(latest.id) ? 0 : 1,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s ease',
          position: 'relative',
          zIndex: 2,
          '& .action-btn': { opacity: 0, transition: 'opacity 0.2s ease', pointerEvents: 'none' },
          '&:hover': {
            bgcolor: isDark ? '#323334' : '#eaeaea',
          },
          '&:hover .action-btn': { opacity: 1, pointerEvents: 'auto' },
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

            {(onClearGroup || onClearSingle) && (
              <IconButton
                size="small"
                className="action-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isExpanded && onClearSingle) {
                    onClearSingle(latest.id);
                  } else if (onClearGroup) {
                    onClearGroup(blockKey);
                  }
                }}
                sx={{
                  color: isDark ? '#888' : '#aaa',
                  p: 0.5,
                  '&:hover': { color: isDark ? '#fff' : '#111', bgcolor: 'transparent' },
                }}
              >
                <X size={16} weight="bold" />
              </IconButton>
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
          transform: removingIds?.has(latest.id) ? 'translateX(-100%)' : 'none',
          opacity: removingIds?.has(latest.id) ? 0 : 1,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
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
                onClearSingle={onClearSingle}
                isRemoving={removingIds?.has(item.id)}
              />
            ))}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
