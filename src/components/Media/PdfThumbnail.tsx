import React, { useEffect, useRef, useState } from 'react';
import { Box, Skeleton } from '@mui/material';
import * as pdfjsLib from 'pdfjs-dist';
import { FilePdf } from '@phosphor-icons/react';
import { useIsDark } from '../shared/hooks';

// Configure pdfjs worker to run in Vite environments
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// In-memory cache to store generated thumbnails so they don't re-render on navigation
const thumbnailCache = new Map<string, string>();

export default function PdfThumbnail({ fileUrl, fileName, onLoad }: { fileUrl: string, fileName: string, onLoad?: () => void }) {
  const isDark = useIsDark();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(!thumbnailCache.has(fileUrl));
  const [error, setError] = useState(false);
  const [cachedImg, setCachedImg] = useState<string | null>(thumbnailCache.get(fileUrl) || null);

  useEffect(() => {
    if (cachedImg) {
      if (onLoad) onLoad();
      return; // Skip rendering if already cached
    }

    let renderTask: any;
    let isMounted = true;

    const renderPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url: fileUrl });
        const pdf = await loadingTask.promise;
        if (!isMounted) return;
        
        const page = await pdf.getPage(1);
        if (!isMounted) return;
        
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Render at a high resolution (scale 1.5) for crisp retina displays
        // The CSS objectFit: 'cover' will automatically scale it down beautifully
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        renderTask = page.render({
          canvasContext: ctx,
          viewport: viewport
        });
        
        await renderTask.promise;
        
        if (isMounted) {
          // Save the rendered canvas to cache as a JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          thumbnailCache.set(fileUrl, dataUrl);
          setCachedImg(dataUrl);
          setLoading(false);
          if (onLoad) onLoad();
        }
      } catch (e) {
        console.error('Failed to render PDF thumbnail', e);
        if (isMounted) {
          setError(true);
          if (onLoad) onLoad(); // Fire onLoad even on error to dismiss skeleton
        }
      }
    };

    renderPdf();

    return () => {
      isMounted = false;
      if (renderTask) renderTask.cancel();
    };
  }, [fileUrl, cachedImg]);

  if (error) {
    return (
      <Box sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', zIndex: 2, position: 'absolute', top: 0, left: 0 }}>
        <FilePdf size={48} weight="regular" color={isDark ? '#777' : '#aaa'} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', 
      bgcolor: (loading && !cachedImg) ? 'transparent' : '#fff', 
      position: 'relative', overflow: 'hidden' 
    }}>
      {cachedImg ? (
        <img src={cachedImg} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <canvas ref={canvasRef} style={{ display: loading ? 'none' : 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      
      {loading && !cachedImg && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ p: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
            <FilePdf size={48} weight="regular" color={isDark ? '#777' : '#aaa'} />
          </Box>
          <Skeleton 
            variant="rectangular" 
            width="100%" 
            height="100%" 
            animation="wave" 
            sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.5 }} 
          />
        </Box>
      )}
    </Box>
  );
}
