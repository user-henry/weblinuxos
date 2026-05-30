import { useState, useRef } from 'react';
import { Image, ZoomIn, ZoomOut, RotateCw, Download, ChevronLeft, ChevronRight, FolderOpen } from 'lucide-react';

interface ImageViewerProps { windowId: string }

export default function ImageViewer({ windowId: _windowId }: ImageViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [selectedColor, setSelectedColor] = useState('#7D8B96');

  // Generate a demo gradient canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const colors = ['#E74C3C','#2ECC71','#3498DB','#F39C12','#9B59B6','#1ABC9C','#E67E22','#34495E',
    '#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F'];

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Image size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-medium text-[var(--text-primary)]">Image Viewer</span>
        <div className="flex-1" />
        <button onClick={() => setZoom(Math.min(300, zoom + 25))} className="p-1.5 rounded hover:bg-[var(--bg-hover)]"><ZoomIn size={14} /></button>
        <span className="text-xs min-w-[40px] text-center text-[var(--text-muted)]">{zoom}%</span>
        <button onClick={() => setZoom(Math.max(25, zoom - 25))} className="p-1.5 rounded hover:bg-[var(--bg-hover)]"><ZoomOut size={14} /></button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <button onClick={() => setRotation(rotation + 90)} className="p-1.5 rounded hover:bg-[var(--bg-hover)]"><RotateCw size={14} /></button>
      </div>

      {/* Image area */}
      <div className="flex-1 flex items-center justify-center overflow-auto" style={{ background: '#2a2a2a' }}>
        <div style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, transition: 'transform 0.2s' }}>
          {/* Demo image: gradient with text */}
          <div className="rounded-lg overflow-hidden shadow-2xl" style={{ width: 320, height: 240 }}>
            <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: `linear-gradient(135deg, ${selectedColor}, ${selectedColor}88, ${selectedColor}44)` }}>
              <Image size={48} className="text-white/80 mb-4" />
              <p className="text-white/80 text-sm font-medium">Demo Image</p>
              <p className="text-white/50 text-xs mt-1">320 × 240</p>
            </div>
          </div>
        </div>
      </div>

      {/* Color palette / info */}
      <div className="border-t p-3" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="text-[10px] text-[var(--text-muted)] mb-2">Select accent:</div>
        <div className="flex gap-1.5 flex-wrap">
          {colors.map(c => (
            <button key={c} onClick={() => setSelectedColor(c)}
              className="w-6 h-6 rounded transition-transform hover:scale-110" style={{ background: c, border: selectedColor === c ? '2px solid var(--accent-silver)' : '1px solid rgba(0,0,0,0.12)' }} />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>320 × 240 px</span>
        <span>{zoom}%</span>
      </div>
    </div>
  );
}
