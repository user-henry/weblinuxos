import { useState, useRef } from 'react';
import { PenTool, Code2, Copy, Download, Eye, Maximize } from 'lucide-react';

interface SvgViewerProps { windowId: string }

const SAMPLE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" width="400" height="300">
  <!-- Background -->
  <rect width="400" height="300" fill="#f0f4f8" rx="12" />
  
  <!-- Sun -->
  <circle cx="320" cy="60" r="40" fill="#F39C12" opacity="0.9" />
  <circle cx="320" cy="60" r="50" fill="#F39C12" opacity="0.2" />
  
  <!-- Mountains -->
  <polygon points="0,250 100,100 200,250" fill="#7D8B96" />
  <polygon points="150,250 280,120 400,250" fill="#5A6670" />
  
  <!-- Trees -->
  <circle cx="80" cy="200" r="25" fill="#2ECC71" />
  <circle cx="120" cy="210" r="30" fill="#27AE60" />
  <circle cx="160" cy="195" r="22" fill="#2ECC71" />
  <rect x="78" y="218" width="8" height="30" fill="#8B4513" rx="2" />
  <rect x="115" y="225" width="10" height="30" fill="#8B4513" rx="2" />
  <rect x="155" y="215" width="8" height="30" fill="#8B4513" rx="2" />
  
  <!-- House -->
  <rect x="260" y="200" width="70" height="50" fill="#E74C3C" rx="3" />
  <polygon points="255,200 295,170 335,200" fill="#C0392B" />
  <rect x="285" y="220" width="20" height="30" fill="#2C3E50" rx="2" />
  <rect x="270" y="210" width="12" height="12" fill="#ECF0F1" rx="2" />
  <rect x="310" y="210" width="12" height="12" fill="#ECF0F1" rx="2" />
  
  <!-- Ground -->
  <rect x="0" y="250" width="400" height="50" fill="#27AE60" rx="0" />
  <rect x="0" y="250" width="400" height="5" fill="#2ECC71" rx="0" />
  
  <!-- Text -->
  <text x="200" y="285" text-anchor="middle" font-family="Arial" font-size="14" fill="white" font-weight="bold">WebOS SVG Viewer</text>
</svg>`;

export default function SvgViewer({ windowId: _windowId }: SvgViewerProps) {
  const [svgCode, setSvgCode] = useState(SAMPLE_SVG);
  const [viewMode, setViewMode] = useState<'preview'|'code'>('preview');
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = (code: string) => {
    setSvgCode(code);
    setError(null);
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(code, 'image/svg+xml');
      const errNode = doc.querySelector('parsererror');
      if (errNode) setError('Invalid SVG');
    } catch { setError('Invalid SVG'); }
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <PenTool size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-semibold text-[var(--text-primary)]">SVG Viewer</span>
        <div className="flex-1" />
        <button onClick={() => setViewMode('preview')} className={`px-2 py-1 rounded text-xs ${viewMode === 'preview' ? 'text-white' : 'text-[var(--text-secondary)]'}`} style={{ background: viewMode === 'preview' ? 'var(--accent-dark-gray)' : 'transparent' }}><Eye size={12} className="inline mr-1" />Preview</button>
        <button onClick={() => setViewMode('code')} className={`px-2 py-1 rounded text-xs ${viewMode === 'code' ? 'text-white' : 'text-[var(--text-secondary)]'}`} style={{ background: viewMode === 'code' ? 'var(--accent-dark-gray)' : 'transparent' }}><Code2 size={12} className="inline mr-1" />Code</button>
        <button onClick={() => navigator.clipboard.writeText(svgCode)} className="p-1.5 rounded hover:bg-[var(--bg-hover)]"><Copy size={14} /></button>
        <button onClick={() => { const b = new Blob([svgCode],{type:'image/svg+xml'}); const u = URL.createObjectURL(b); const a = document.createElement('a'); a.href=u; a.download='image.svg'; a.click(); }} className="p-1.5 rounded hover:bg-[var(--bg-hover)]"><Download size={14} /></button>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {viewMode === 'preview' ? (
          <div className="flex-1 flex items-center justify-center p-6 overflow-auto" style={{ background: '#E0E0E0' }}>
            <div className="shadow-lg rounded-lg overflow-hidden bg-white">
              <div dangerouslySetInnerHTML={{ __html: svgCode }} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex">
            <textarea value={svgCode} onChange={(e) => handleCodeChange(e.target.value)}
              className="flex-1 p-4 text-xs font-mono outline-none resize-none" style={{ background: '#1e1e1e', color: '#d4d4d4' }} spellCheck={false} />
          </div>
        )}
      </div>

      {error && <div className="px-3 py-1 text-xs text-red-500" style={{ background: 'var(--bg-window)' }}>{error}</div>}

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{viewMode === 'preview' ? 'Preview' : 'Code'}</span>
        <span>{svgCode.length} chars</span>
      </div>
    </div>
  );
}
