import { useState } from 'react';
import { Archive, Upload, Download, Shield, Clock, HardDrive, RefreshCw } from 'lucide-react';

interface BackupProps { windowId: string }

interface BackupRecord { id: number; name: string; date: string; size: string; status: 'completed'|'in_progress'|'failed'; }

const mockBackups: BackupRecord[] = [
  { id: 1, name: 'Full System Backup', date: '2024-12-15 02:00', size: '28.5 GB', status: 'completed' },
  { id: 2, name: 'Documents Backup', date: '2024-12-14 06:00', size: '12.1 GB', status: 'completed' },
  { id: 3, name: 'Weekly Snapshot', date: '2024-12-10 00:00', size: '35.2 GB', status: 'completed' },
  { id: 4, name: 'Pre-update Backup', date: '2024-12-08 10:30', size: '15.8 GB', status: 'completed' },
];

export default function Backup({ windowId: _windowId }: BackupProps) {
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedBackup, setSelectedBackup] = useState<number | null>(null);

  const startBackup = () => {
    setIsBackingUp(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setIsBackingUp(false); return 100; }
        return p + 2;
      });
    }, 100);
  };

  const statusIcon = (status: string) => {
    if (status === 'completed') return <CheckCircle size={14} style={{ color: '#2ECC71' }} />;
    if (status === 'in_progress') return <RefreshCw size={14} className="animate-spin" style={{ color: '#3498DB' }} />;
    return <XCircle size={14} style={{ color: '#E74C3C' }} />;
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2ECC71, #27AE60)' }}>
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Backup & Restore</h3>
          <p className="text-[11px] text-[var(--text-muted)]">Protect your data</p>
        </div>
        <div className="flex-1" />
        <button onClick={startBackup} disabled={isBackingUp}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50" style={{ background: 'var(--accent-dark-gray)' }}>
          <Download size={14} className="inline mr-1" />Backup Now
        </button>
      </div>

      {/* Progress */}
      {isBackingUp && (
        <div className="p-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[var(--text-primary)]">Backing up...</span>
            <span className="text-[var(--accent-silver)]">{progress}%</span>
          </div>
          <div className="h-2 rounded-full" style={{ background: 'var(--bg-input)' }}>
            <div className="h-2 rounded-full transition-all duration-300" style={{ background: 'linear-gradient(90deg, var(--accent-silver), #2ECC71)', width: `${progress}%` }} />
          </div>
          <div className="text-[10px] text-[var(--text-muted)] mt-1">Estimated time remaining: {((100-progress)*0.5).toFixed(0)}s</div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
          <div className="text-lg font-bold text-[var(--accent-silver)]">4</div>
          <div className="text-[11px] text-[var(--text-muted)]">Backups</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
          <div className="text-lg font-bold" style={{ color: '#2ECC71' }}>91.6 GB</div>
          <div className="text-[11px] text-[var(--text-muted)]">Total Size</div>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
          <div className="text-lg font-bold text-[var(--text-primary)]">7d</div>
          <div className="text-[11px] text-[var(--text-muted)]">Retention</div>
        </div>
      </div>

      {/* Backup list */}
      <div className="flex-1 overflow-y-auto px-4">
        <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Recent Backups</h4>
        <div className="space-y-1.5">
          {mockBackups.map(b => (
            <div key={b.id} onClick={() => setSelectedBackup(b.id)}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors cursor-pointer ${selectedBackup === b.id ? '' : 'hover:bg-[var(--bg-hover)]'}`}
              style={{ background: selectedBackup === b.id ? 'var(--bg-window)' : 'transparent' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: b.status === 'completed' ? 'rgba(46,204,113,0.1)' : 'rgba(52,152,219,0.1)' }}>
                {statusIcon(b.status)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-[var(--text-primary)]">{b.name}</div>
                <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)]">
                  <Clock size={10} />{b.date}
                  <HardDrive size={10} />{b.size}
                </div>
              </div>
              <button className="px-3 py-1 rounded text-[10px] font-medium text-white" style={{ background: 'var(--accent-dark-gray)' }}>Restore</button>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-2 text-[10px] text-center border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        Next scheduled backup: Daily at 2:00 AM
      </div>
    </div>
  );
}

function CheckCircle({ size, style }: { size: number; style?: React.CSSProperties }) {
  return <div style={{ ...style, width: size, height: size, borderRadius: '50%', background: '#2ECC71', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size*0.6} height={size*0.6} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
  </div>;
}

function XCircle({ size, style }: { size: number; style?: React.CSSProperties }) {
  return <div style={{ ...style, width: size, height: size, borderRadius: '50%', background: '#E74C3C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <svg width={size*0.5} height={size*0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </div>;
}
