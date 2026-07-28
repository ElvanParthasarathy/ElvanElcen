import React from 'react';
import { Box, Typography, Button, IconButton, Modal, Paper } from '@mui/material';
import { X, Warning, ArrowRight } from '@phosphor-icons/react';
import { useIsDark } from '../shared/hooks';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';

interface WinUIDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  accountName: string;
}

export default function WinUIDeleteDialog({ open, onClose, onConfirm, accountName }: WinUIDeleteDialogProps) {
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
            {t(k.DIALOG_DELETE_TITLE)}
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small" 
            sx={{ 
              color: 'var(--mac-text-secondary)', 
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', color: 'var(--mac-text)' } 
            }}
          >
            <X size={16} />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ display: 'flex', p: 3, pt: 1, gap: 2 }}>
          {/* Warning Icon (Windows 11 Style) */}
          <Box sx={{ pt: 0.5 }}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Warning size={32} weight="fill" color="#FFCC00" />
              <Typography sx={{ position: 'absolute', color: '#000', fontSize: '18px', fontWeight: 700, mt: '2px' }}>!</Typography>
            </Box>
          </Box>
          
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '16px', color: isDark ? '#4CC2FF' : '#005FB8', mb: 1.5 }}>
              {t(k.DIALOG_DELETE_CONFIRM_PREFIX)}{accountName}{t(k.DIALOG_DELETE_CONFIRM_SUFFIX)}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: isDark ? '#fff' : '#000', mb: 3 }}>
              {t(k.DIALOG_DELETE_DESC)}
            </Typography>

            {/* Command Link */}
            <Box
              onClick={onConfirm}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: 1.5, ml: -1.5, borderRadius: '12px',
                cursor: 'pointer',
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }
              }}
            >
              <ArrowRight size={20} color={isDark ? '#4CC2FF' : '#005FB8'} />
              <Typography sx={{ fontSize: '15px', color: isDark ? '#4CC2FF' : '#005FB8' }}>
                {t(k.BTN_DELETE)}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box sx={{ bgcolor: isDark ? '#2B2B2B' : '#F3F3F3', p: 2, display: 'flex', justifyContent: 'flex-end' }}>
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
        </Box>
      </Paper>
    </Modal>
  );
}
