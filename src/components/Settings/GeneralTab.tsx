import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import { SettingsSection, SettingsRow } from '../shared/ElvanSettingsSection';
import { Material3Switch } from '../shared/Material3Switch';
import { useIsDark } from '../shared/hooks';

export default function GeneralTab() {
  const { t } = useI18n();
  const isDark = useIsDark();

  const [autoStart, setAutoStart] = useState(false);
  const [startMinimized, setStartMinimized] = useState(false);
  const [closeToTray, setCloseToTray] = useState(true);
  const [lowMemoryMode, setLowMemoryMode] = useState(false);
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [hwAccelChanged, setHwAccelChanged] = useState(false);

  useEffect(() => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.getSettings().then((settings: any) => {
        if (settings.startMinimized !== undefined) setStartMinimized(settings.startMinimized);
        if (settings.closeToTray !== undefined) setCloseToTray(settings.closeToTray);
        if (settings.lowMemoryMode !== undefined) setLowMemoryMode(settings.lowMemoryMode);
        if (settings.hardwareAcceleration !== undefined) setHardwareAcceleration(settings.hardwareAcceleration);
      });
      if ((window as any).electronAPI.getAutoStart) {
        (window as any).electronAPI.getAutoStart().then(setAutoStart);
      }
    }
  }, []);

  const handleSaveSetting = (key: string, value: any, setter: any) => {
    setter(value);
    if ((window as any).electronAPI) {
      (window as any).electronAPI.saveSetting(key, value);
    }
  };

  const handleAutoStartChange = (enabled: boolean) => {
    setAutoStart(enabled);
    if ((window as any).electronAPI && (window as any).electronAPI.setAutoStart) {
      (window as any).electronAPI.setAutoStart(enabled);
    }
  };

  const handleHwAccelChange = (enabled: boolean) => {
    setHardwareAcceleration(enabled);
    setHwAccelChanged(true);
    if ((window as any).electronAPI && (window as any).electronAPI.setHardwareAcceleration) {
      (window as any).electronAPI.setHardwareAcceleration(enabled);
    }
  };

  const handleRestart = () => {
    if ((window as any).electronAPI && (window as any).electronAPI.restartApp) {
      (window as any).electronAPI.restartApp();
    }
  };

  return (
    <Box sx={{ pr: '24px', pb: '24px' }}>
      <SettingsSection title={t(k.GENERAL_TITLE)}>
        <SettingsRow
          title={t(k.GENERAL_STARTUP)}
          description={t(k.GENERAL_STARTUP_DESC)}
          control={
            <Material3Switch
              checked={autoStart}
              onChange={(e) => handleAutoStartChange(e.target.checked)}
            />
          }
        />
        <SettingsRow
          title={t(k.GENERAL_START_MINIMIZED)}
          sx={{ opacity: autoStart ? 1 : 0.5 }}
          control={
            <Material3Switch
              checked={startMinimized}
              disabled={!autoStart}
              onChange={(e) => handleSaveSetting('startMinimized', e.target.checked, setStartMinimized)}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title={t(k.GENERAL_TRAY)}>
        <SettingsRow
          title={t(k.GENERAL_TRAY)}
          description={t(k.GENERAL_TRAY_DESC)}
          control={
            <Material3Switch
              checked={closeToTray}
              onChange={(e) => handleSaveSetting('closeToTray', e.target.checked, setCloseToTray)}
            />
          }
        />
        <SettingsRow
          title={t(k.GENERAL_LOW_MEMORY)}
          description={t(k.GENERAL_LOW_MEMORY_DESC)}
          sx={{ opacity: closeToTray ? 1 : 0.5 }}
          control={
            <Material3Switch
              checked={lowMemoryMode}
              disabled={!closeToTray}
              onChange={(e) => handleSaveSetting('lowMemoryMode', e.target.checked, setLowMemoryMode)}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title={t(k.GENERAL_PERFORMANCE)}>
        <SettingsRow
          title={t(k.GENERAL_HW_ACCEL)}
          description={hwAccelChanged ? t(k.GENERAL_RESTART_REQUIRED) : t(k.GENERAL_HW_ACCEL_DESC)}
          control={
            <Material3Switch
              checked={hardwareAcceleration}
              onChange={(e) => handleHwAccelChange(e.target.checked)}
            />
          }
        />
        {hwAccelChanged && (
          <Box sx={{ px: '20px', pb: '16px', display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              disableElevation
              onClick={handleRestart}
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
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                  boxShadow: 'none'
                }
              }}
            >
              {t(k.GENERAL_RESTART_NOW)}
            </Button>
          </Box>
        )}
      </SettingsSection>
    </Box>
  );
}
