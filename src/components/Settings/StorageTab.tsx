import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { HardDrives, Warning } from '@phosphor-icons/react';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import { SettingsSection as ElvanSettingsSection, SettingsRow } from '../shared/ElvanSettingsSection';
import { useIsDark } from '../shared/hooks';

export default function StorageTab() {
  const { t } = useI18n();
  const isDark = useIsDark();
  const [currentPath, setCurrentPath] = useState('Loading...');
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState<any>(null);

  useEffect(() => {
    let unsubscribe: any;
    if ((window as any).electronAPI) {
      (window as any).electronAPI.getBaseMediaDir().then((dir: string) => {
        setCurrentPath(dir);
      });

      unsubscribe = (window as any).electronAPI.onMigrationProgress((data: any) => {
        setProgress(data);
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleChangeFolder = async () => {
    if (!(window as any).electronAPI) return;
    setIsMigrating(true);
    setProgress({ status: 'preparing' });
    
    try {
      const result = await (window as any).electronAPI.changeMediaFolder();
      if (!result) return;
      if (typeof result === 'string') {
        setCurrentPath(result);
      } else if (result.success) {
        setCurrentPath(result.newPath || result.path);
      } else if (result.reason !== 'canceled') {
        alert(result.error || result.reason || 'Failed to change folder');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsMigrating(false);
      setProgress(null);
    }
  };

  return (
    <Box sx={{ pr: '24px', pb: '24px' }}>
      <ElvanSettingsSection title={t(k.STORAGE_TITLE)}>
        <SettingsRow
          icon={<HardDrives size={20} weight="fill" />}
          title={t(k.STORAGE_MEDIA_FOLDER)}
          description={currentPath}
          control={
            <Button 
              variant="contained"
              disableElevation
              onClick={handleChangeFolder}
              disabled={isMigrating}
              sx={{ 
                borderRadius: '500px', 
                textTransform: 'none', 
                fontWeight: 600, 
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', 
                color: 'var(--mac-text)',
                border: 'none',
                boxShadow: 'none',
                px: 2.5,
                py: 0.8,
                minWidth: '135px',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                  boxShadow: 'none'
                }
              }}
            >
              {t(k.BTN_CHANGE_FOLDER)}
            </Button>
          }
        />
        <SettingsRow
          icon={<Warning size={20} weight="fill" />}
          iconColor="red"
          title={t(k.RESET_APP_TITLE) || "Reset App Data"}
          description={t(k.RESET_APP_DESC) || "Clear all sessions and return to first setup. Keeps media."}
          control={
            <Button 
              variant="contained"
              disableElevation
              onClick={async () => {
                if (window.confirm(t(k.RESET_APP_CONFIRM) || "Are you sure you want to reset all app data? This will log out all accounts but preserve your media folder.")) {
                  if ((window as any).electronAPI) {
                    await (window as any).electronAPI.resetApp();
                  }
                }
              }}
              sx={{ 
                borderRadius: '500px', 
                textTransform: 'none', 
                fontWeight: 600, 
                bgcolor: 'rgba(244, 67, 54, 0.1)', 
                color: '#F44336',
                border: 'none',
                boxShadow: 'none',
                px: 2.5,
                py: 0.8,
                minWidth: '135px',
                '&:hover': {
                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                  boxShadow: 'none'
                }
              }}
            >
              {t(k.RESET_APP_BTN) || "Reset App"}
            </Button>
          }
        />
      </ElvanSettingsSection>

      {isMigrating && progress && (
        <Box sx={{ mt: 3, p: 3, borderRadius: '16px', bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: '1px solid var(--mac-border)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CircularProgress size={20} sx={{ mr: 2, color: 'var(--mac-text)' }} />
            <Typography sx={{ fontWeight: 600 }}>
              {progress.status === 'counting' ? 'Analyzing files...' : 
               progress.status === 'copying' ? 'Copying files safely...' :
               progress.status === 'verifying' ? 'Verifying transfer integrity...' :
               progress.status === 'switching' ? 'Updating system paths...' :
               progress.status === 'cleaning' ? 'Cleaning up old files...' :
               'Preparing...'}
            </Typography>
          </Box>
          
          {progress.status === 'copying' && progress.total !== undefined && (
            <Box sx={{ pl: '36px' }}>
              <Typography variant="body2" sx={{ color: 'var(--mac-text-secondary)', mb: 0.5, fontWeight: 500 }}>
                Copied {progress.current} of {progress.total} files
              </Typography>
              <Typography variant="body2" noWrap sx={{ color: 'var(--mac-text-secondary)', opacity: 0.7, fontSize: '12px' }}>
                {progress.filename}
              </Typography>
              
              <Box sx={{ width: '100%', height: '4px', bgcolor: 'var(--mac-border)', borderRadius: '2px', mt: 1.5, overflow: 'hidden' }}>
                <Box sx={{ height: '100%', bgcolor: 'var(--mac-text)', width: `${(progress.current / progress.total) * 100}%`, transition: 'width 0.1s linear' }} />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
