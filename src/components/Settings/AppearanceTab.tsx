import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { CheckCircle, Circle } from '@phosphor-icons/react';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import { useIsDark } from '../shared/hooks';
import { SettingsSection } from '../shared/ElvanSettingsSection';
import { Material3Switch } from '../shared/Material3Switch';

export default function AppearanceTab({ userTheme, setUserTheme }: any) {
  const isDark = useIsDark();
  const { t } = useI18n();

  const handleThemeChange = (newTheme: string) => {
    setUserTheme(newTheme);
    if ((window as any).electronAPI) {
      (window as any).electronAPI.saveSetting('theme', newTheme);
      (window as any).electronAPI.updateTheme(newTheme);
    }
  };

  return (
    <Box>
      <SettingsSection description={t(k.THEME_DESC)}>
        <Box sx={{ display: 'flex', justifyContent: 'space-evenly', p: 3 }}>
          {/* Light Mode Option */}
          <Box
            onClick={() => handleThemeChange('light')}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <Box sx={{
              width: 110, height: 85, borderRadius: '24px',
              bgcolor: '#f5f5f5', border: '1px solid', borderColor: userTheme === 'light' ? '#555' : 'var(--mac-divider)',
              display: 'flex', flexDirection: 'column', gap: 1.2, p: 2,
              transition: 'all 0.2s',
              transform: userTheme === 'light' ? 'scale(1.02)' : 'scale(1)'
            }}>
              <Box sx={{ width: 32, height: 8, borderRadius: 4, bgcolor: '#000', opacity: 0.7 }} />
              <Box sx={{ width: '100%', height: 6, borderRadius: 4, bgcolor: '#cfcfcf' }} />
              <Box sx={{ width: '60%', height: 6, borderRadius: 4, bgcolor: '#cfcfcf' }} />
            </Box>
            <Typography variant="body2" sx={{
              fontWeight: userTheme === 'light' ? 600 : 500,
              color: userTheme === 'light' ? 'var(--mac-text)' : 'var(--mac-text-secondary)',
              transition: 'color 0.2s', mt: 0.5
            }}>
              {t(k.THEME_LIGHT)}
            </Typography>
            <Box sx={{ mt: -1 }}>
              {userTheme === 'light' ? <CheckCircle weight="fill" size={24} color="var(--mac-text)" /> : <Circle weight="regular" size={24} color="var(--mac-text-secondary)" />}
            </Box>
          </Box>

          {/* Dark Mode Option */}
          <Box
            onClick={() => handleThemeChange('dark')}
            sx={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              cursor: 'pointer', userSelect: 'none'
            }}
          >
            <Box sx={{
              width: 110, height: 85, borderRadius: '24px',
              bgcolor: '#1e1e1e', border: '1px solid', borderColor: userTheme === 'dark' ? '#888' : 'var(--mac-divider)',
              display: 'flex', flexDirection: 'column', gap: 1.2, p: 2,
              transition: 'all 0.2s',
              transform: userTheme === 'dark' ? 'scale(1.02)' : 'scale(1)'
            }}>
              <Box sx={{ width: 32, height: 8, borderRadius: 4, bgcolor: '#fff', opacity: 0.8 }} />
              <Box sx={{ width: '100%', height: 6, borderRadius: 4, bgcolor: '#444' }} />
              <Box sx={{ width: '60%', height: 6, borderRadius: 4, bgcolor: '#444' }} />
            </Box>
            <Typography variant="body2" sx={{
              fontWeight: userTheme === 'dark' ? 600 : 500,
              color: userTheme === 'dark' ? 'var(--mac-text)' : 'var(--mac-text-secondary)',
              transition: 'color 0.2s', mt: 0.5
            }}>
              {t(k.THEME_DARK)}
            </Typography>
            <Box sx={{ mt: -1 }}>
              {userTheme === 'dark' ? <CheckCircle weight="fill" size={24} color="var(--mac-text)" /> : <Circle weight="regular" size={24} color="var(--mac-text-secondary)" />}
            </Box>
          </Box>
        </Box>

        <Box sx={{ p: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontWeight: 500, fontSize: '15px', color: 'var(--mac-text)' }}>
              {t(k.THEME_SYSTEM)}
            </Typography>
          </Box>
          <Material3Switch
            checked={!userTheme || userTheme === 'system'}
            onChange={(e) => handleThemeChange(e.target.checked ? 'system' : (isDark ? 'dark' : 'light'))}
          />
        </Box>
      </SettingsSection>
    </Box>
  );
}
