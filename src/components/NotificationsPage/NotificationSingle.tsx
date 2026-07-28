import React from 'react';
import { Avatar, Box, IconButton, Paper, Stack, Typography } from '@mui/material';
import { ChatCircle, Trash } from '@phosphor-icons/react';
import { NotificationItem } from './index';

interface NotificationSingleProps {
  item: NotificationItem;
  isDark: boolean;
  formatTime: (ts: number) => string;
  onSelectNotification: (item: NotificationItem) => void;
  onClearSingle?: (id: string) => void;
}

export default function NotificationSingle({
  item,
  isDark,
  formatTime,
  onSelectNotification,
  onClearSingle,
}: NotificationSingleProps) {
  return (
    <Paper
      elevation={0}
      onClick={() => onSelectNotification(item)}
      sx={{
        p: 1.5,
        pr: 2.5,
        pl: 1.5,
        borderRadius: '48px',
        bgcolor: isDark ? '#2a2b2c' : '#FFFFFF',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        '&:hover': {
          bgcolor: isDark ? '#323334' : '#f5f5f5',
        },
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Box sx={{ position: 'relative', mt: 0.25 }}>
          <Avatar 
            src={item.icon || undefined} 
            sx={{ width: 44, height: 44, flexShrink: 0, bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', color: 'text.primary' }}
          >
            {!item.icon && item.title.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
        
        <Stack sx={{ flex: 1, minWidth: 0, justifyContent: 'flex-start', pt: 0.5 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.25 }}>
            <Typography sx={{ 
              fontSize: '15px', fontWeight: 600, color: 'text.primary',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1 
            }}>
              {item.title}
            </Typography>
            
            <Typography sx={{ 
              fontSize: '12px', color: 'text.secondary', fontWeight: 500, flexShrink: 0, 
              lineHeight: 1, display: 'flex', alignItems: 'center'
            }}>
              {formatTime(item.timestamp)}
            </Typography>
          </Stack>

          <Box
            sx={{
              maxHeight: '20px',
              overflow: 'hidden',
            }}
          >
            <Typography
              sx={{
                fontSize: '14px',
                color: 'text.secondary',
                lineHeight: '20px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {item.body || 'New message received'}
            </Typography>
          </Box>
        </Stack>
        
        {/* Right side icons (Trash, if any) */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ pl: 1, pt: 1 }}>
          
          {/* Trash button (only if standalone card) */}
          {onClearSingle && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onClearSingle(item.id);
              }}
              sx={{
                color: 'text.secondary',
                p: 0.5,
                '&:hover': { color: 'error.main', bgcolor: 'error.lighter' },
              }}
            >
              <Trash size={16} />
            </IconButton>
          )}
        </Stack>
      </Stack>
    </Paper>
  );
}
