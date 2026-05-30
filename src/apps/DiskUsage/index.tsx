import { useState } from 'react';
import { HardDrive, Folder, File, Music, Video, Image, Archive, Database } from 'lucide-react';

interface DiskUsageProps { windowId: string }

interface FolderUsage { name: string; icon: React.ComponentType<{size?:number}>; size: number; color: string; files: number; }

const folders: FolderUsage[] = [
  { name: 'Documents', icon: File, size: 15.2, color: '#3498DB', files: 342 },
  { name: 'Pictures', icon: Image, size: 8.7, color: '#2ECC71', files: 1256 },
  { name: 'Music', icon: Music, size: 5.4, color: '#9B59B6', files: 423 },
  { name: 'Videos', icon: Video, size: 22.1, color: '#E74C3C', files: 89 },
  { name: 'Downloads', icon: Archive, size: 3.8, color: '#F39C12', files: 67 },
  { name: 'System', icon: Database, size: 12.6, color: '#95A5A6', files: 5432 },
  { name: 'Other', icon: Folder, size: 2.5, color: '#7D8B96', files: 321 },
];

const totalSize = folders.reduce((a, f) => a + f.size, 0);
const totalUsed = 70.3;
const totalCapacity = 256;

export default function DiskUsage({ windowId: _windowId }: DiskUsageProps) {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5A6670, #7D8B96)' }}>
          <HardDrive size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Disk Usage Analyzer</h3>
          <p className="text-xs text-[var(--text-muted)]">Samsung 990 PRO 2TB</p>
        </div>
      </div>

      {/* Usage bar */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-[var(--text-muted)]">Used: {totalUsed} GB</span>
          <span className="text-[var(--text-muted)]">Free: {(totalCapacity - totalUsed).toFixed(1)} GB</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden flex" style={{ background: 'var(--bg-input)' }}>
          {folders.map(f => (
            <div key={f.name} style={{ background: f.color, width: `${(f.size / totalUsed) * 100}%` }}
              className="h-full border-r border-white/20 first:rounded-l-full last:rounded-r-full" title={`${f.name}: ${f.size} GB`} />
          ))}
        </div>
        <div className="text-xs mt-1.5 text-center text-[var(--text-muted)]">{totalCapacity} GB total | {((totalUsed / totalCapacity) * 100).toFixed(0)}% used</div>
      </div>

      {/* Folders list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {folders.map(f => (
          <div key={f.name} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-[var(--bg-hover)]" style={{ background: 'var(--bg-window)' }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${f.color}15` }}>
              <span style={{ color: f.color }}><f.icon size={20} /></span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-[var(--text-primary)]">{f.name}</div>
              <div className="text-[11px] text-[var(--text-muted)]">{f.files.toLocaleString()} files</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-[var(--text-primary)]">{f.size} GB</div>
              <div className="flex-1 mx-4">
                <div className="h-1.5 w-32 rounded-full" style={{ background: 'var(--bg-input)' }}>
                  <div className="h-1.5 rounded-full" style={{ background: f.color, width: `${(f.size / totalUsed) * 100}%` }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 p-3 border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-input)' }}>
          <div className="text-sm font-bold text-[var(--text-primary)]">{totalUsed} GB</div>
          <div className="text-[10px] text-[var(--text-muted)]">Used</div>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-input)' }}>
          <div className="text-sm font-bold text-[var(--text-primary)]">{folders.length}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Folders</div>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ background: 'var(--bg-input)' }}>
          <div className="text-sm font-bold text-[var(--text-primary)]">{(folders.reduce((a,f) => a + f.files, 0)).toLocaleString()}</div>
          <div className="text-[10px] text-[var(--text-muted)]">Files</div>
        </div>
      </div>
    </div>
  );
}
