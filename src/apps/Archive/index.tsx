import { useState } from 'react';
import { Package, FilePlus, Download, Trash2, FolderOpen, File } from 'lucide-react';

interface ArchiveProps { windowId: string }

interface ArchiveEntry { name: string; size: string; type: 'file'|'folder'; compressed: string; }

const mockArchive: ArchiveEntry[] = [
  { name: 'index.html', size: '2.4 KB', type: 'file', compressed: '1.1 KB' },
  { name: 'style.css', size: '8.7 KB', type: 'file', compressed: '3.2 KB' },
  { name: 'app.js', size: '45.2 KB', type: 'file', compressed: '12.8 KB' },
  { name: 'assets/', size: '—', type: 'folder', compressed: '—' },
  { name: 'assets/logo.png', size: '24.5 KB', type: 'file', compressed: '18.2 KB' },
  { name: 'assets/background.jpg', size: '156.3 KB', type: 'file', compressed: '142.1 KB' },
  { name: 'README.md', size: '1.2 KB', type: 'file', compressed: '0.6 KB' },
];

export default function Archive({ windowId: _windowId }: ArchiveProps) {
  const [files, setFiles] = useState(mockArchive);
  const totalOriginal = 238.3; // KB
  const totalCompressed = 178.0; // KB
  const ratio = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Package size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-semibold text-[var(--text-primary)]">Archive Manager</span>
        <span className="text-[11px] text-[var(--text-muted)]">— project.tar.gz</span>
        <div className="flex-1" />
        <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Extract All"><Download size={14} /></button>
        <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Add Files"><FilePlus size={14} /></button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
          <div className="text-lg font-bold text-[var(--accent-silver)]">{files.length}</div>
          <div className="text-[11px] text-[var(--text-muted)]">Entries</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
          <div className="text-lg font-bold" style={{ color: '#2ECC71' }}>{totalOriginal.toFixed(1)} KB</div>
          <div className="text-[11px] text-[var(--text-muted)]">Original</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
          <div className="text-lg font-bold text-[var(--text-primary)]">{ratio}%</div>
          <div className="text-[11px] text-[var(--text-muted)]">Saved</div>
        </div>
      </div>

      {/* Files */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-1">
          {files.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
              style={{ paddingLeft: entry.name.includes('/') ? '28px' : '12px', background: 'var(--bg-window)' }}>
              {entry.type === 'folder' ? <FolderOpen size={16} style={{ color: '#F39C12' }} /> : <File size={16} style={{ color: 'var(--accent-silver)' }} />}
              <span className="flex-1 text-xs text-[var(--text-primary)] truncate">{entry.name}</span>
              <span className="text-[10px] text-[var(--text-muted)] min-w-[50px] text-right">{entry.size}</span>
              <span className="text-[10px] text-[var(--text-muted)] min-w-[50px] text-right">{entry.compressed !== '—' ? entry.compressed : '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 py-2 border-t" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-[var(--text-muted)]">Compression ratio</span>
          <span style={{ color: '#2ECC71' }}>{ratio}% saved</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-input)' }}>
          <div className="h-1.5 rounded-full" style={{ background: '#2ECC71', width: `${ratio}%` }} />
        </div>
      </div>

      <div className="px-4 py-1 text-[10px] text-center border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        Format: tar.gz | Compression: gzip -9
      </div>
    </div>
  );
}
