export function getMediaUrl(item: any): string {
  return `nammil://media/${encodeURIComponent(item.filePath)}`;
}

export function getThumbUrl(item: any): string {
  return `nammil://thumb/${encodeURIComponent(item.filePath)}`;
}

export function getFileExtension(fileName: string): string {
  return fileName.toLowerCase().split('.').pop() || '';
}

export function isImageFile(fileName: string): boolean {
  return !!fileName.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/);
}

export function isPdfFile(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.pdf');
}

export function isOfficeFile(fileName: string): boolean {
  return !!fileName.toLowerCase().match(/\.(pptx|docx)$/);
}

export function getFileTypeColor(fileName: string, isDark: boolean): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.pdf')) return '#ff3b30';
  if (lower.match(/\.pptx?$/)) return '#ff9500';
  if (lower.match(/\.docx?$/)) return '#007aff';
  return isDark ? '#333' : '#ccc';
}

export function handleOpenSystem(filePath: string): void {
  if ((window as any).electronAPI) {
    (window as any).electronAPI.openMedia(filePath);
  }
}
