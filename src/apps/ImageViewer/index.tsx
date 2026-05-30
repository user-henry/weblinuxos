import { useState, useRef, useEffect } from 'react';
import { Image, ZoomIn, ZoomOut, RotateCw, Download, Upload, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageViewerProps { windowId: string }

export default function ImageViewer({ windowId: _windowId }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [srcUrl, setSrcUrl] = useState<string>('');
  const [fileName, setFileName] = useState('No image loaded');
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle file open from file manager
  useEffect(() => {
    const pending = (window as any).__pendingImageFile;
    if (pending) {
      delete (window as any).__pendingImageFile;
      setFileName(pending.fileName || 'Image file');
      setSrcUrl('');
      setZoom(100);
      setRotation(0);
    }
  }, []);

  const handleFileOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    setFileName(file.name);
    setZoom(100);
    setRotation(0);
    setDragOffset({ x: 0, y: 0 });
    // Get image dimensions
    const img = new window.Image();
    img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  };

  const download = () => {
    if (!srcUrl) return;
    const a = document.createElement('a');
    a.href = srcUrl;
    a.download = fileName || `image-${Date.now()}.png`;
    a.click();
  };

  const fitToScreen = () => {
    setZoom(100);
    setRotation(0);
    setDragOffset({ x: 0, y: 0 });
  };

  // Mouse drag to pan image
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 100) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileOpen} className="hidden" />

      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b flex-shrink-0"
        style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Image size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-medium text-[var(--text-primary)] truncate max-w-[200px]">{fileName}</span>
        <div className="flex-1" />
        <button onClick={() => setZoom(Math.min(400, zoom + 25))} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Zoom In">
          <ZoomIn size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <span className="text-xs min-w-[40px] text-center text-[var(--text-muted)]">{zoom}%</span>
        <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Zoom Out">
          <ZoomOut size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <button onClick={() => setRotation(rotation + 90)} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Rotate">
          <RotateCw size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button onClick={fitToScreen} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Fit to Screen">
          <Maximize2 size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button onClick={download} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Download"
          disabled={!srcUrl} style={{ opacity: srcUrl ? 1 : 0.3 }}>
          <Download size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Open Image">
          <Upload size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden"
        style={{ background: '#1a1a1a', cursor: zoom > 100 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}>
        {srcUrl ? (
          <img
            ref={imgRef}
            src={srcUrl}
            alt={fileName}
            className="select-none"
            draggable={false}
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.2s',
              maxWidth: 'none',
              maxHeight: 'none',
            }}
          />
        ) : (
          <div className="text-center" onClick={() => fileInputRef.current?.click()}>
            <Image size={64} className="text-white/20 mx-auto mb-4" />
            <p className="text-sm text-white/50">No image loaded</p>
            <p className="text-xs text-white/30 mt-2">Click here or use "Open Image" to browse</p>
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t flex-shrink-0"
        style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{srcUrl ? `${imgSize.w} × ${imgSize.h} px` : 'No image'}</span>
        <span>{zoom}% {rotation !== 0 ? ` | ${rotation}°` : ''}</span>
      </div>
    </div>
  );
}
