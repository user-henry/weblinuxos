import { useState } from 'react';
import { Search, File, Folder, Clock } from 'lucide-react';

interface FileSearchProps { windowId: string }

interface SearchResult { id: number; name: string; path: string; type: 'file'|'folder'; size: string; modified: string; }

const mockFiles: SearchResult[] = [
  { id: 1, name: 'project-report.docx', path: '/home/Documents/', type: 'file', size: '2.4 MB', modified: '2024-12-15' },
  { id: 2, name: 'screenshot-2024.png', path: '/home/Pictures/', type: 'file', size: '1.8 MB', modified: '2024-12-14' },
  { id: 3, name: 'config.json', path: '/etc/webos/', type: 'file', size: '4.2 KB', modified: '2024-12-13' },
  { id: 4, name: 'backup-archive.tar.gz', path: '/home/Downloads/', type: 'file', size: '45.6 MB', modified: '2024-12-10' },
  { id: 5, name: 'presentation.pptx', path: '/home/Documents/', type: 'file', size: '5.1 MB', modified: '2024-12-08' },
  { id: 6, name: 'index.tsx', path: '/src/apps/', type: 'file', size: '12.3 KB', modified: '2024-12-15' },
  { id: 7, name: 'Images', path: '/home/', type: 'folder', size: '—', modified: '2024-12-12' },
  { id: 8, name: 'node_modules', path: '/app/', type: 'folder', size: '—', modified: '2024-12-15' },
];

export default function FileSearch({ windowId: _windowId }: FileSearchProps) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all'|'file'|'folder'>('all');

  const results = mockFiles.filter(f => {
    const matchesQuery = !query || f.name.toLowerCase().includes(query.toLowerCase()) || f.path.toLowerCase().includes(query.toLowerCase());
    const matchesType = typeFilter === 'all' || f.type === typeFilter;
    return matchesQuery && matchesType;
  });

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Search bar */}
      <div className="p-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-input)', border: '1px solid rgba(0,0,0,0.08)' }}>
            <Search size={14} style={{ color: 'var(--text-muted)' }} />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search files..."
              className="flex-1 text-xs bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} autoFocus />
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          {(['all','file','folder'] as const).map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 rounded-full text-[10px] ${typeFilter === t ? 'text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
              style={typeFilter === t ? { background: 'var(--accent-dark-gray)' } : {}}>{t === 'all' ? 'All' : t === 'file' ? 'Files' : 'Folders'}</button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-2">
        {results.length === 0 && query ? (
          <div className="flex items-center justify-center h-full text-xs text-[var(--text-muted)]">
            No results found for "{query}"
          </div>
        ) : (
          <div className="space-y-1">
            {results.map(f => (
              <div key={f.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--bg-hover)] transition-colors cursor-pointer"
                style={{ background: 'var(--bg-window)' }}>
                {f.type === 'folder' ? <Folder size={16} style={{ color: '#F39C12' }} /> : <File size={16} style={{ color: 'var(--accent-silver)' }} />}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-[var(--text-primary)] truncate">{f.name}</div>
                  <div className="text-[10px] text-[var(--text-muted)]">{f.path}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-[10px] text-[var(--text-muted)]">{f.size}</div>
                  <div className="text-[10px] text-[var(--text-muted)]"><Clock size={10} className="inline mr-0.5" />{f.modified}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{results.length} results</span>
        <span>Search entire system</span>
      </div>
    </div>
  );
}
