import React from 'react';
import { Box, OutlinedInput, InputAdornment, Chip } from '@mui/material';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import { useIsDark } from '../shared/hooks';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  activeFilter: string;
  docFormatFilter: string;
  setDocFormatFilter: (val: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery, activeFilter, docFormatFilter, setDocFormatFilter }: SearchBarProps) {
  const isDark = useIsDark();
  const { t } = useI18n();

  return (
    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <OutlinedInput
        fullWidth
        placeholder={t(k.MEDIA_SEARCH_PLACEHOLDER)}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="small"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlass size={20} color={isDark ? '#888' : '#aaa'} />
          </InputAdornment>
        }
        sx={{
          bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#ffffff',
          boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.03)',
          borderRadius: '500px',
          pl: 2,
          '& fieldset': { border: 'none' },
          '&:hover fieldset': { border: 'none' },
          '&.Mui-focused fieldset': { border: 'none' },
          '&.Mui-focused': { bgcolor: isDark ? 'rgba(255,255,255,0.1)' : '#ffffff', boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.06)' },
          '& input': { color: 'var(--mac-text)' }
        }}
      />

      {activeFilter === 'Documents' && (
        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', '&::-webkit-scrollbar': { display: 'none' } }}>
          {[
            { id: 'All', label: t(k.MEDIA_ALL) },
            { id: 'PDF', label: t(k.MEDIA_FORMAT_PDF) },
            { id: 'Word', label: t(k.MEDIA_FORMAT_WORD) },
            { id: 'PPT', label: t(k.MEDIA_FORMAT_PPT) },
            { id: 'Other', label: t(k.MEDIA_FORMAT_OTHER) }
          ].map(f => (
            <Chip
              key={f.id}
              label={f.label}
              onClick={() => setDocFormatFilter(f.id)}
              sx={{
                fontWeight: 600,
                bgcolor: docFormatFilter === f.id ? (isDark ? '#fff' : '#111b21') : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                color: docFormatFilter === f.id ? (isDark ? '#000' : '#fff') : 'var(--mac-text)',
                '&:hover': { bgcolor: docFormatFilter === f.id ? undefined : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') },
                border: 'none'
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
