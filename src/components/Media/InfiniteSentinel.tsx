import React, { useEffect, useRef } from 'react';

export default function InfiniteSentinel({ onLoadMore }: { onLoadMore: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onLoadMore();
      }
    }, { rootMargin: '400px' });
    
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [onLoadMore]);

  return <div ref={ref} style={{ height: '20px', width: '100%', gridColumn: '1 / -1', pointerEvents: 'none' }} />;
}
