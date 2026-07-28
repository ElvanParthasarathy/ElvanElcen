import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Select, MenuItem, IconButton } from '@mui/material';
import { SpeakerHigh } from '@phosphor-icons/react';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import { SettingsSection, SettingsRow } from '../shared/ElvanSettingsSection';
import { Material3Switch } from '../shared/Material3Switch';
import { useIsDark } from '../shared/hooks';

export default function NotificationsTab({ accounts }: any) {
  const { t } = useI18n();
  const isDark = useIsDark();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [flashTaskbar, setFlashTaskbar] = useState(true);
  const [notificationSound, setNotificationSound] = useState('kumizhi');
  const [customSoundPath, setCustomSoundPath] = useState('');
  const [mutedAccounts, setMutedAccounts] = useState<string[]>([]);
  const [accountSounds, setAccountSounds] = useState<Record<string, string>>({});

  useEffect(() => {
    if ((window as any).electronAPI) {
      (window as any).electronAPI.getSettings().then((settings: any) => {
        if (settings.notificationsEnabled !== undefined) setNotificationsEnabled(settings.notificationsEnabled);
        if (settings.flashTaskbar !== undefined) setFlashTaskbar(settings.flashTaskbar);
        if (settings.notificationSound && settings.notificationSound !== 'default') {
          setNotificationSound(settings.notificationSound);
        } else {
          setNotificationSound('kumizhi');
        }
        if (settings.customSoundPath !== undefined) setCustomSoundPath(settings.customSoundPath);
        if (settings.mutedAccounts !== undefined) setMutedAccounts(settings.mutedAccounts);
        if (settings.accountSounds !== undefined) setAccountSounds(settings.accountSounds);
      });
    }
  }, []);

  const handleToggle = (key: string, value: any, setter: any) => {
    setter(value);
    if ((window as any).electronAPI) {
      (window as any).electronAPI.saveSetting(key, value);
    }
  };

  const handleSoundChange = async (event: any) => {
    const value = event.target.value;
    if (value === 'custom') {
      if ((window as any).electronAPI) {
        const result = await (window as any).electronAPI.selectCustomSound();
        if (result && result.filePath) {
          handleToggle('customSoundPath', result.filePath, setCustomSoundPath);
          handleToggle('notificationSound', 'custom', setNotificationSound);
        }
      }
    } else {
      handleToggle('notificationSound', value, setNotificationSound);
    }
  };

  const handleAccountSoundChange = (accountId: string, sound: string) => {
    const updated = { ...accountSounds, [accountId]: sound };
    handleToggle('accountSounds', updated, setAccountSounds);
  };

  const previewSound = (soundToPlay = notificationSound) => {
    if (!soundToPlay || soundToPlay === 'silent') return;

    if (soundToPlay === 'custom' && customSoundPath) {
      const audio = new Audio(`nammil://media/${encodeURIComponent(customSoundPath)}`);
      audio.play().catch(e => {
        console.error('Instant custom sound play failed, fallback to IPC', e);
        if ((window as any).electronAPI) {
          (window as any).electronAPI.previewSound('custom', customSoundPath);
        }
      });
      return;
    }

    const ext = 'mp3';
    const audio = new Audio(`./sounds/${soundToPlay}.${ext}`);
    audio.play().catch(e => {
      console.error('Instant sound play failed, fallback to IPC', e);
      if ((window as any).electronAPI) {
        (window as any).electronAPI.previewSound(soundToPlay);
      }
    });
  };

  const toggleAccountMute = (accountId: string) => {
    const newMuted = mutedAccounts.includes(accountId)
      ? mutedAccounts.filter(id => id !== accountId)
      : [...mutedAccounts, accountId];
    handleToggle('mutedAccounts', newMuted, setMutedAccounts);
  };

  return (
    <Box sx={{ pr: '24px', pb: '24px' }}>
      <SettingsSection>
        <SettingsRow
          title={t(k.NOTIF_ENABLE)}
          description={t(k.NOTIF_ENABLE_DESC)}
          control={
            <Material3Switch
              checked={notificationsEnabled}
              onChange={(e) => handleToggle('notificationsEnabled', e.target.checked, setNotificationsEnabled)}
            />
          }
        />
        <SettingsRow
          title={t(k.NOTIF_FLASH)}
          description={t(k.NOTIF_FLASH_DESC)}
          control={
            <Material3Switch
              checked={flashTaskbar}
              onChange={(e) => handleToggle('flashTaskbar', e.target.checked, setFlashTaskbar)}
            />
          }
        />
      </SettingsSection>

      {accounts && accounts.length >= 1 && (
        <SettingsSection title={t(k.NOTIF_PER_ACCOUNT)}>
          {accounts.map((acc: any) => {
            const currentAccSound = accountSounds[acc.id] || notificationSound || 'kumizhi';
            const isMuted = mutedAccounts.includes(acc.id) || mutedAccounts.includes(acc.name);
            return (
              <SettingsRow
                key={acc.id}
                title={acc.name}
                control={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <IconButton
                      onClick={() => previewSound(currentAccSound)}
                      size="small"
                      sx={{ color: 'var(--mac-text)' }}
                      disabled={isMuted || currentAccSound === 'silent'}
                    >
                      <SpeakerHigh size={18} />
                    </IconButton>
                    <Select
                      value={currentAccSound}
                      onChange={(e) => handleAccountSoundChange(acc.id, e.target.value)}
                      size="small"
                      disabled={isMuted}
                      sx={{
                        minWidth: 110,
                        borderRadius: '12px',
                        color: 'var(--mac-text)',
                        '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mac-divider)' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mac-text-secondary)' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--mac-text)' }
                      }}
                    >
                      <MenuItem value="kumizhi">{t(k.NOTIF_SOUND_KUMIZHI)}</MenuItem>
                      <MenuItem value="thuli">{t(k.NOTIF_SOUND_THULI)}</MenuItem>
                      <MenuItem value="thullal">{t(k.NOTIF_SOUND_THULLAL)}</MenuItem>
                      <MenuItem value="thendral">{t(k.NOTIF_SOUND_THENDRAL)}</MenuItem>
                      <MenuItem value="minnal">{t(k.NOTIF_SOUND_MINNAL)}</MenuItem>
                      <MenuItem value="alai">{t(k.NOTIF_SOUND_ALAI)}</MenuItem>
                      <MenuItem value="silent">{t(k.NOTIF_SOUND_SILENT)}</MenuItem>
                    </Select>
                    <Material3Switch
                      checked={!isMuted}
                      onChange={() => toggleAccountMute(acc.id)}
                    />
                  </Box>
                }
              />
            );
          })}
        </SettingsSection>
      )}
    </Box>
  );
}
