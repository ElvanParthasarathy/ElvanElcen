import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import { useI18n } from '../i18n/I18nContext';
import { getTheme } from '../theme';
import NammilLogo from '../assets/nammil_outline.webp';

// Brand name in each script
const BRAND_NAMES: Record<string, string> = {
  ta: 'எல்வன் நம்மில்',
  en: 'Elvan Nammil',
  ml: 'എൽവൻ നമ്മിൽ',
};

// Cycle order per language setting — primary script first, then others. No looping.
const LANG_ORDER: Record<string, string[]> = {
  ta:      ['ta', 'en', 'ml'],
  ta_latn: ['en', 'ta', 'ml'],
  ta_ml:   ['ml', 'ta', 'en'],
  en:      ['en', 'ta', 'ml'],
  ml:      ['ml', 'en', 'ta'],
  ml_latn: ['en', 'ml', 'ta'],
  ml_tam:  ['ta', 'ml', 'en'],
  system:  ['en', 'ta', 'ml'],
};

export default function SplashScreen({ userTheme }: { userTheme: string }) {
  const { lang } = useI18n();
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const actualMode = userTheme === 'system' ? (prefersDarkMode ? 'dark' : 'light') : userTheme;
  const theme = getTheme(actualMode);

  const contentColor = actualMode === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)';

  const order = LANG_ORDER[lang] || LANG_ORDER['en'];

  const [nameIndex, setNameIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;

    // Smooth cycle: 400ms visible + 250ms fade = 650ms per name
    const timer = setTimeout(() => {
      if (nameIndex < order.length - 1) {
        setVisible(false);
        setTimeout(() => {
          setNameIndex(prev => prev + 1);
          setVisible(true);
        }, 250);
      } else {
        // Reached the last language — stop cycling
        doneRef.current = true;
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [nameIndex, order.length]);

  const currentName = BRAND_NAMES[order[nameIndex]] || BRAND_NAMES['en'];

  return (
    <Box 
      sx={{ 
        width: '100vw', 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
        bgcolor: actualMode === 'dark' ? '#1d1f1f' : '#F7F5F3',
        color: actualMode === 'dark' ? '#FFFFFF' : theme.palette.text.primary,
        WebkitAppRegion: 'drag',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      {/* Logo — always visible */}
      <Box 
        sx={{ 
          width: 75,
          height: 75,
          mr: 0,
          flexShrink: 0,
          transform: 'translateZ(0)',
          willChange: 'transform',
          bgcolor: contentColor,
          WebkitMaskImage: `url(${NammilLogo})`,
          WebkitMaskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskImage: `url(${NammilLogo})`,
          maskSize: 'contain',
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
        }} 
      />

      {/* App name — fast cycle through languages, stops on last */}
      <Box 
        sx={{ 
          width: currentName.includes('നമ്മിൽ') ? '320px' : currentName.includes('நம்மில்') ? '290px' : '260px', 
          display: 'flex', 
          justifyContent: 'flex-start',
          transition: 'width 0.25s ease-in-out'
        }}
      >
        <Typography 
          fontWeight="bold" 
          sx={{ 
            fontSize: '40px',
            letterSpacing: 0,
            fontFamily: "'Elvan Sans', sans-serif",
            color: contentColor,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.25s ease-in-out',
            whiteSpace: 'nowrap',
          }}
        >
          {currentName}
        </Typography>
      </Box>
    </Box>
  );
}
