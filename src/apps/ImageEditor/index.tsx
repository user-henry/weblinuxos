import { useState, useRef } from 'react';
import { ImagePlus, Sun, Contrast, Crop, RotateCw, FlipHorizontal, FlipVertical, Download, Undo, Redo } from 'lucide-react';

interface ImageEditorProps { windowId: string }

const FILTERS = ['none', 'grayscale', 'sepia', 'invert', 'blur', 'brightness', 'contrast', 'saturate'];

export default function ImageEditor({ windowId: _windowId }: ImageEditorProps) {
  const [filter, setFilter] = useState('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const filterStyle: React.CSSProperties = {
    filter: `${filter !== 'none' && filter !== 'brightness' && filter !== 'contrast' && filter !== 'saturate' ? `${filter}(100%)` : ''}${brightness !== 100 ? ` brightness(${brightness}%)` : ''}${contrast !== 100 ? ` contrast(${contrast}%)` : ''}${saturate !== 100 ? ` saturate(${saturate}%)` : ''}`,
    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
    maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
  };

  const reset = () => { setFilter('none'); setBrightness(100); setContrast(100); setSaturate(100); setRotation(0); setFlipH(false); setFlipV(false); };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b flex-wrap" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Open"><ImagePlus size={14} /></button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <button onClick={() => setRotation(r => r + 90)} className="p-1.5 rounded hover:bg-[var(--bg-hover)]"><RotateCw size={14} /></button>
        <button onClick={() => setFlipH(h => !h)} className={`p-1.5 rounded hover:bg-[var(--bg-hover)] ${flipH ? 'text-[var(--accent-silver)]' : ''}`}><FlipHorizontal size={14} /></button>
        <button onClick={() => setFlipV(v => !v)} className={`p-1.5 rounded hover:bg-[var(--bg-hover)] ${flipV ? 'text-[var(--accent-silver)]' : ''}`}><FlipVertical size={14} /></button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <button onClick={reset} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Reset">Reset</button>
        <div className="flex-1" />
      </div>

      {/* Filters */}
      <div className="flex gap-1 px-3 py-1.5 border-b overflow-x-auto" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors ${filter === f ? 'text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            style={filter === f ? { background: 'var(--accent-dark-gray)' } : {}}>{f}</button>
        ))}
      </div>

      {/* Sliders */}
      <div className="flex gap-4 px-4 py-2 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 flex-1">
          <Sun size={14} style={{ color: 'var(--text-muted)' }} />
          <input type="range" min={0} max={200} value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="flex-1 h-1 accent-[var(--accent-silver)]" />
          <span className="text-[10px] text-[var(--text-muted)] w-8">{brightness}%</span>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <Contrast size={14} style={{ color: 'var(--text-muted)' }} />
          <input type="range" min={0} max={200} value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="flex-1 h-1 accent-[var(--accent-silver)]" />
          <span className="text-[10px] text-[var(--text-muted)] w-8">{contrast}%</span>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-[10px] text-[var(--text-muted)]">Sat</span>
          <input type="range" min={0} max={200} value={saturate} onChange={(e) => setSaturate(Number(e.target.value))} className="flex-1 h-1 accent-[var(--accent-silver)]" />
          <span className="text-[10px] text-[var(--text-muted)] w-8">{saturate}%</span>
        </div>
      </div>

      {/* Preview */}
      <div className="flex-1 flex items-center justify-center overflow-auto p-4" style={{ background: '#E0E0E0' }}>
        {image ? (
          <img src={image} style={filterStyle} alt="Preview" className="shadow-lg" />
        ) : (
          <div className="text-center">
            <ImagePlus size={48} className="text-[var(--text-muted)] mx-auto mb-3" />
            <p className="text-sm text-[var(--text-muted)] mb-2">Open an image to edit</p>
            <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded text-sm text-white" style={{ background: 'var(--accent-dark-gray)' }}>
              Open Image
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>Filter: {filter}</span>
        <span>{image ? 'Image loaded' : 'No image'}</span>
      </div>
    </div>
  );
}
