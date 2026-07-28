import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Slide } from '@mui/material';
import { useI18n } from '../../i18n/I18nContext';
import { k } from '../../i18n/k';
import DualPanelLayout from '../shared/DualPanelLayout';
import MediaSidebar from './MediaSidebar';
import SearchBar from './SearchBar';
import MediaGrid from './MediaGrid';
import { getFileExtension } from './mediaUtils';
import { useIsDark } from '../shared/hooks';
import '../../styles/settings.css';

export default function MediaLibrary({ accounts }: any) {
  const { t } = useI18n();
  const isDark = useIsDark();

  const [activeAccount, setActiveAccount] = useState('All');
  const [activeFilter, setActiveFilter] = useState('All');
  const [docFormatFilter, setDocFormatFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [mediaItems, setMediaItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(50);

  const fetchMedia = async () => {
    if ((window as any).electronAPI) {
      const items = await (window as any).electronAPI.getMediaFiles(activeFilter, activeAccount);
      setMediaItems(items || []);
      setVisibleCount(50); // Reset pagination on filter change
    }
  };

  useEffect(() => {
    fetchMedia();
  }, [activeAccount, activeFilter]);

  const filteredMedia = mediaItems.filter((item: any) => {
    if (searchQuery && !item.fileName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (activeFilter === 'Documents' && docFormatFilter !== 'All') {
      const ext = getFileExtension(item.fileName);
      if (docFormatFilter === 'PDF' && ext !== 'pdf') return false;
      if (docFormatFilter === 'Word' && !ext.match(/^(doc|docx)$/)) return false;
      if (docFormatFilter === 'PPT' && !ext.match(/^(ppt|pptx)$/)) return false;
      if (docFormatFilter === 'Other' && ext.match(/^(pdf|doc|docx|ppt|pptx)$/)) return false;
    }
    return true;
  }).sort((a: any, b: any) => new Date(b.date || b.downloadedAt || b.createdAt || Date.now()).getTime() - new Date(a.date || a.downloadedAt || a.createdAt || Date.now()).getTime());

  const paginatedMedia = filteredMedia.slice(0, visibleCount);

  const groupedMedia = paginatedMedia.reduce((acc: any, item: any) => {
    const d = new Date(item.date || item.downloadedAt || item.createdAt || Date.now());
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey = '';
    if (d.toDateString() === today.toDateString()) {
      dateKey = t(k.DATE_TODAY) || 'Today';
    } else if (d.toDateString() === yesterday.toDateString()) {
      dateKey = t(k.DATE_YESTERDAY) || 'Yesterday';
    } else {
      dateKey = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(item);
    return acc;
  }, {});

  const sidebar = (
    <MediaSidebar
      accounts={accounts}
      activeAccount={activeAccount}
      setActiveAccount={setActiveAccount}
      activeFilter={activeFilter}
      setActiveFilter={setActiveFilter}
    />
  );

  const content = (
    <Box sx={{ pr: 3, pb: 4, pt: 1 }}>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        docFormatFilter={docFormatFilter}
        setDocFormatFilter={setDocFormatFilter}
      />
      <MediaGrid 
        groupedMedia={groupedMedia} 
        hasMore={visibleCount < filteredMedia.length}
        onLoadMore={() => setVisibleCount(prev => prev + 50)}
      />
    </Box>
  );

  return (
    <DualPanelLayout
      title={t(k.TAB_MEDIA)}
      sidebar={sidebar}
      content={content}
    />
  );
}
