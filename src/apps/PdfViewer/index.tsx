import { useState } from 'react';
import { File, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, Search } from 'lucide-react';

interface PdfViewerProps { windowId: string }

export default function PdfViewer({ windowId: _windowId }: PdfViewerProps) {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const totalPages = 5;

  const zoomIn = () => setZoom(Math.min(200, zoom + 25));
  const zoomOut = () => setZoom(Math.max(50, zoom - 25));

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <File size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-medium text-[var(--text-primary)]">document.pdf</span>
        <div className="flex-1" />
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(Math.max(1, page - 1))} className="p-1 rounded hover:bg-[var(--bg-hover)]" disabled={page <= 1}><ChevronLeft size={16} /></button>
          <span className="text-xs min-w-[60px] text-center" style={{ color: 'var(--text-primary)' }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} className="p-1 rounded hover:bg-[var(--bg-hover)]" disabled={page >= totalPages}><ChevronRight size={16} /></button>
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button onClick={zoomOut} className="p-1 rounded hover:bg-[var(--bg-hover)]"><ZoomOut size={14} /></button>
          <span className="text-xs min-w-[40px] text-center text-[var(--text-muted)]">{zoom}%</span>
          <button onClick={zoomIn} className="p-1 rounded hover:bg-[var(--bg-hover)]"><ZoomIn size={14} /></button>
        </div>
        <button className="p-1 rounded hover:bg-[var(--bg-hover)]" title="Download"><Download size={14} /></button>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex justify-center p-6" style={{ background: '#525659' }}>
        <div className="bg-white shadow-2xl" style={{ width: `${595 * zoom / 100}px`, minHeight: `${842 * zoom / 100}px`, padding: `${40 * zoom / 100}px` }}>
          <div style={{ fontFamily: 'Georgia, serif', color: '#333' }}>
            {page === 1 && (
              <>
                <h1 className="text-2xl font-bold mb-6">WebOS Documentation</h1>
                <h2 className="text-lg font-semibold mb-3">Introduction</h2>
                <p className="mb-3 text-sm leading-relaxed">WebOS is a web-based operating system that runs entirely in your browser. It provides a familiar desktop environment with applications, file management, and system utilities.</p>
                <h2 className="text-lg font-semibold mb-3 mt-6">System Requirements</h2>
                <ul className="list-disc pl-6 mb-3 text-sm space-y-1">
                  <li>Modern web browser (Chrome 90+, Firefox 90+, Safari 15+)</li>
                  <li>JavaScript enabled</li>
                  <li>Minimum screen resolution: 1024x768</li>
                </ul>
                <h2 className="text-lg font-semibold mb-3 mt-6">Getting Started</h2>
                <p className="mb-3 text-sm leading-relaxed">After the boot sequence, log in using your credentials or select Guest mode. The desktop will load with a top panel, application menu, and taskbar.</p>
              </>
            )}
            {page === 2 && (
              <>
                <h2 className="text-lg font-semibold mb-3">Applications</h2>
                <p className="mb-3 text-sm leading-relaxed">WebOS includes a wide range of applications across multiple categories including System, Development, Internet, Office, Multimedia, and Graphics.</p>
                <h2 className="text-lg font-semibold mb-3 mt-6">Core System Apps</h2>
                <ul className="list-disc pl-6 mb-3 text-sm space-y-1">
                  <li>Terminal - Command-line interface</li>
                  <li>File Manager - Browse and manage files</li>
                  <li>Settings - System configuration</li>
                  <li>Task Manager - Monitor processes</li>
                </ul>
                <h2 className="text-lg font-semibold mb-3 mt-6">Productivity Apps</h2>
                <ul className="list-disc pl-6 mb-3 text-sm space-y-1">
                  <li>Writer - Word processing</li>
                  <li>Spreadsheet - Data analysis</li>
                  <li>Presentation - Slideshows</li>
                  <li>PDF Viewer - Document viewing</li>
                </ul>
              </>
            )}
            {(page >= 3) && (
              <>
                <h2 className="text-lg font-semibold mb-3">Settings & Configuration</h2>
                <p className="mb-3 text-sm leading-relaxed">Customize WebOS to your preferences through the Settings application.</p>
                <h3 className="text-base font-semibold mb-2 mt-4">Appearance</h3>
                <ul className="list-disc pl-6 mb-3 text-sm space-y-1">
                  <li>Theme: Dark / Light mode</li>
                  <li>Accent Color: Customize system accent</li>
                  <li>Wallpaper: Choose from available wallpapers</li>
                </ul>
                <h3 className="text-base font-semibold mb-2 mt-4">Region & Language</h3>
                <ul className="list-disc pl-6 mb-3 text-sm space-y-1">
                  <li>Language: System display language</li>
                  <li>Time Format: 12-hour or 24-hour</li>
                  <li>Region: Locale settings</li>
                </ul>
                <p className="mt-6 text-sm text-gray-500">This is page {page} of {totalPages}.</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>document.pdf</span>
        <span>{totalPages} pages | {zoom}%</span>
      </div>
    </div>
  );
}
