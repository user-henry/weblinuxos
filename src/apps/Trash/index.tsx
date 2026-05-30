import { useState } from 'react';
import { Trash2, RotateCcw, File, Folder, Clock, AlertTriangle } from 'lucide-react';

interface TrashProps { windowId: string }

interface TrashItem { id: number; name: string; type: 'file'|'folder'; originalPath: string; deletedDate: string; size: string; }

const deletedItems: TrashItem[] = [
  { id: 1, name: 'old-document.txt', type: 'file', originalPath: '/home/Documents/', deletedDate: '2024-12-15 10:30', size: '2.4 KB' },
  { id: 2, name: 'temp-screenshot.png', type: 'file', originalPath: '/home/Pictures/', deletedDate: '2024-12-14 16:45', size: '1.8 MB' },
  { id: 3, name: 'draft-notes', type: 'folder', originalPath: '/home/Documents/', deletedDate: '2024-12-13 09:15', size: '—' },
  { id: 4, name: 'config.old', type: 'file', originalPath: '/etc/', deletedDate: '2024-12-12 14:00', size: '256 B' },
];

export default function Trash({ windowId: _windowId }: TrashProps) {
  const [items, setItems] = useState(deletedItems);
  const [selected, setSelected] = useState<number[]>([]);

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const restoreSelected = () => {
    setItems(items.filter(i => !selected.includes(i.id)));
    setSelected([]);
  };

  const deleteForever = () => {
    setItems(items.filter(i => !selected.includes(i.id)));
    setSelected([]);
  };

  const selectAll = () => {
    if (selected.length === items.length) setSelected([]);
    else setSelected(items.map(i => i.id));
  };

  const emptyTrash = () => { setItems([]); setSelected([]); };

  const totalSize = items.reduce((a, i) => a + (i.size === '—' ? 0 : parseFloat(i.size) || 0), 0);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #95A5A6, #7D8B96)' }}>
          <Trash2 size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Trash</h3>
          <p className="text-[11px] text-[var(--text-muted)]">{items.length} items</p>
        </div>
        <div className="flex-1" />
        {items.length > 0 && (
          <button onClick={emptyTrash}
            className="px-3 py-1.5 rounded text-xs font-medium text-white flex items-center gap-1" style={{ background: '#E74C3C' }}>
            <Trash2 size={12} />Empty Trash
          </button>
        )}
      </div>

      {/* Actions bar */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
          <span className="text-xs text-[var(--text-muted)]">{selected.length} selected</span>
          <button onClick={restoreSelected} className="px-3 py-1 rounded text-xs font-medium flex items-center gap-1" style={{ background: 'var(--accent-silver)', color: 'white' }}>
            <RotateCcw size={12} />Restore
          </button>
          <button onClick={deleteForever} className="px-3 py-1 rounded text-xs font-medium text-white flex items-center gap-1" style={{ background: '#E74C3C' }}>
            <Trash2 size={12} />Delete Forever
          </button>
        </div>
      )}

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
            <Trash2 size={48} className="mb-3 opacity-30" />
            <p className="text-sm">Trash is empty</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} onClick={() => toggleSelect(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${selected.includes(item.id) ? 'ring-1' : 'hover:bg-[var(--bg-hover)]'}`}
              style={{ background: 'var(--bg-window)', outlineColor: 'var(--accent-silver)' }}>
              <input type="checkbox" checked={selected.includes(item.id)} onChange={() => {}} className="accent-[var(--accent-silver)]" />
              {item.type === 'folder' ? <Folder size={16} style={{ color: '#F39C12' }} /> : <File size={16} style={{ color: 'var(--accent-silver)' }} />}
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--text-primary)] truncate">{item.name}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{item.originalPath} · Deleted {item.deletedDate}</div>
              </div>
              <span className="text-[10px] text-[var(--text-muted)]">{item.size}</span>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-2 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{items.length} items</span>
        <span>{totalSize.toFixed(1)} KB total</span>
      </div>
    </div>
  );
}
