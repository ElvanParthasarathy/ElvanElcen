import React from 'react';
import { Box, Typography } from '@mui/material';
import { FileDashed } from '@phosphor-icons/react';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import MediaCard from './MediaCard';
import InfiniteSentinel from './InfiniteSentinel';

interface MediaGridProps {
  groupedMedia: Record<string, any[]>;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export default function MediaGrid({ groupedMedia, hasMore, onLoadMore }: MediaGridProps) {
  const { t } = useI18n();

  if (Object.keys(groupedMedia).length === 0) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', pt: 10, color: 'var(--mac-text-secondary)' }}>
        <FileDashed size={80} weight="duotone" style={{ marginBottom: '16px', opacity: 0.7 }} />
        <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>{t(k.MEDIA_EMPTY)}</Typography>
      </Box>
    );
  }

  return (
    <>
      {Object.keys(groupedMedia).map((date) => (
        <Box key={date} sx={{ mb: 4 }}>
          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: 'var(--mac-text-secondary)', mb: 2, pl: 1.5 }}>{date}</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
            {groupedMedia[date].map((item: any, i: number) => (
              <MediaCard 
                key={i} 
                item={item} 
              />
            ))}
          </Box>
        </Box>
      ))}
      
      {hasMore && onLoadMore && (
        <InfiniteSentinel onLoadMore={onLoadMore} />
      )}
    </>
  );
}
