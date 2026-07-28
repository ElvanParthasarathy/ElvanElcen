import React from 'react';
import { Box } from '@mui/material';
import { Check } from '@phosphor-icons/react';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import { SettingsSection, SettingsRow } from '../shared/ElvanSettingsSection';

export default function LanguageTab() {
  const { t, lang, setLang } = useI18n();

  const handleLangChange = (newLang: string) => {
    setLang(newLang);
    if ((window as any).electronAPI) {
      (window as any).electronAPI.saveSetting('language', newLang);
    }
  };

  const langOptions = [
    { value: 'system', label: t(k.LANG_SYSTEM) },
    { value: 'ta', label: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD', sub: t(k.LANG_TA) },
    { value: 'ta_latn', label: 'Thamizh', sub: t(k.LANG_TA_LATN) },
    { value: 'ta_ml', label: '\u0D24\u0D2E\u0D3F\u0D34\u0D4D', sub: t(k.LANG_TA_ML) },
    { value: 'ml', label: '\u0D2E\u0D32\u0D2F\u0D3E\u0D33\u0D02', sub: t(k.LANG_ML) },
    { value: 'ml_latn', label: 'Malayalam', sub: t(k.LANG_ML_LATN) },
    { value: 'ml_tam', label: '\u0BAE\u0BB2\u0BAF\u0BBE\u0BB3\u0BAE\u0BCD', sub: t(k.LANG_ML_TAM) },
    { value: 'en', label: 'English', sub: t(k.LANG_EN) },
  ];

  return (
    <Box>
      <SettingsSection>
        {langOptions.map((option) => (
          <SettingsRow
            key={option.value}
            title={option.label}
            description={option.sub}
            onClick={() => handleLangChange(option.value)}
            control={
              lang === option.value ? (
                <Check size={20} weight="bold" color="var(--mac-text)" />
              ) : null
            }
          />
        ))}
      </SettingsSection>
    </Box>
  );
}
