import { useState, useRef, useEffect } from 'react';
import { File, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Upload } from 'lucide-react';

interface PdfViewerProps { windowId: string }

export default function PdfViewer({ windowId: _windowId }: PdfViewerProps) {
  const [srcUrl, setSrcUrl] = useState<string>('');
  const [fileName, setFileName] = useState('No document loaded');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file open from file manager
  useEffect(() => {
    const pending = (window as any).__pendingPdfFile;
    if (pending) {
      delete (window as any).__pendingPdfFile;
      setFileName(pending.fileName || 'Document');
      setSrcUrl('');
    }
  }, []);

  const handleFileOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    setFileName(file.name);
  };

  const download = () => {
    if (!srcUrl) return;
    const a = document.createElement('a');
    a.href = srcUrl;
    a.download = fileName || `document-${Date.now()}.pdf`;
    a.click();
  };

  // Fallback: show demo content when no PDF loaded
  const [page] = useState(1);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      <input ref={fileInputRef} type="file" accept=".pdf,application/pdf" onChange={handleFileOpen} className="hidden" />

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0"
        style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <File size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-medium text-[var(--text-primary)] truncate max-w-[300px]">{fileName}</span>
        <div className="flex-1" />
        <button onClick={() => fileInputRef.current?.click()} className="p-1 rounded hover:bg-[var(--bg-hover)]" title="Open PDF">
          <Upload size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button onClick={download} className="p-1 rounded hover:bg-[var(--bg-hover)]" title="Download"
          disabled={!srcUrl} style={{ opacity: srcUrl ? 1 : 0.3 }}>
          <Download size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Content area */}
      {srcUrl ? (
        // Native browser PDF viewer via iframe/embed
        <iframe
          src={srcUrl}
          className="flex-1 w-full border-0"
          title="PDF Viewer"
          style={{ background: '#525659' }}
        />
      ) : (
        // Demo content when no PDF loaded
        <div className="flex-1 overflow-auto flex justify-center p-6" style={{ background: '#525659' }}>
          <div className="bg-white shadow-2xl" style={{ width: '595px', minHeight: '750px', padding: '40px' }}>
            <div style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
              <h1 className="text-2xl font-bold mb-6">WebOS Documentation</h1>
              <h2 className="text-lg font-semibold mb-3">Getting Started</h2>
              <p className="mb-3 text-sm leading-relaxed">
                Click the <strong>Open PDF</strong> button in the toolbar to load a real PDF document. Your browser will render it natively.
              </p>
              <h2 className="text-lg font-semibold mb-3 mt-6">Features</h2>
              <ul className="list-disc pl-6 mb-3 text-sm space-y-1">
                <li>Native browser PDF rendering</li>
                <li>Zoom, scroll, and text search (built-in)</li>
                <li>Open any PDF file from your computer</li>
              </ul>
              <h2 className="text-lg font-semibold mb-3 mt-6">Applications</h2>
              <p className="mb-3 text-sm leading-relaxed">
                WebOS includes apps across Development, Internet, Office, Multimedia, Graphics, and System categories.
              </p>
              <ul className="list-disc pl-6 mb-3 text-sm space-y-1">
                <li>Terminal - Command-line interface</li>
                <li>File Manager - Browse and manage files</li>
                <li>Settings - System configuration</li>
                <li>Music/Video Player - Media playback</li>
              </ul>
              <p className="mt-8 text-sm text-gray-400 text-center">Open a PDF file to view it here</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t flex-shrink-0"
        style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{srcUrl ? fileName : 'Demo document'}</span>
        <span>{srcUrl ? 'PDF loaded' : 'Demo mode'}</span>
      </div>
    </div>
  );
}
