import React from 'react';
import { Box, Typography, Button, IconButton, Modal, Paper, TextField } from '@mui/material';
import { X } from '@phosphor-icons/react';
import { useIsDark } from '../shared/hooks';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';

interface WinUIAddDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountName: string;
  onAccountNameChange: (val: string) => void;
}

export default function WinUIAddDialog({ open, onClose, onConfirm, accountName, onAccountNameChange }: WinUIAddDialogProps) {
  const isDark = useIsDark();
  const { t } = useI18n();

  return (
    <Modal open={open} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        elevation={24}
        sx={{
          width: 500,
          borderRadius: '16px',
          bgcolor: isDark ? '#202020' : '#ffffff',
          overflow: 'hidden',
          outline: 'none',
          boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.2)',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, pb: 0 }}>
          <Typography sx={{ fontSize: '13px', color: isDark ? '#fff' : '#000', ml: 1 }}>
            {t(k.DIALOG_ADD_ACCOUNT_TITLE)}
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small" 
            sx={{ 
              color: 'var(--mac-text-secondary)', 
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: 'var(--mac-text)' } 
            }}
          >
            <X size={18} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4, pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            placeholder={t(k.DIALOG_ACCOUNT_NAME_LABEL)}
            value={accountName}
            onChange={(e) => onAccountNameChange(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && accountName.trim()) onConfirm(); }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: isDark ? '#fff' : '#000',
                bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                borderRadius: '100px',
                px: 2,
                '& fieldset': {
                  border: 'none',
                },
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.09)' : 'rgba(0,0,0,0.07)',
                },
                '&.Mui-focused': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                },
              },
            }}
          />
        </Box>

        {/* Footer */}
        <Box sx={{ bgcolor: isDark ? '#2B2B2B' : '#F3F3F3', p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              color: isDark ? '#fff' : '#000',
              bgcolor: isDark ? '#333' : '#e0e0e0',
              textTransform: 'none',
              boxShadow: 'none',
              px: 3, py: 0.5,
              borderRadius: '24px',
              minWidth: 80,
              '&:hover': {
                bgcolor: isDark ? '#3b3b3b' : '#d5d5d5',
                boxShadow: 'none',
              }
            }}
          >
            {t(k.BTN_CANCEL)}
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            disabled={!accountName.trim()}
            sx={{
              color: isDark ? '#000' : '#fff',
              bgcolor: isDark ? '#fff' : '#000',
              textTransform: 'none',
              boxShadow: 'none',
              px: 3, py: 0.5,
              borderRadius: '24px',
              minWidth: 80,
              '&:hover': {
                bgcolor: isDark ? '#e0e0e0' : '#333',
                boxShadow: 'none',
              },
              '&.Mui-disabled': {
                bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              }
            }}
          >
            {t(k.BTN_ADD)}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
}
