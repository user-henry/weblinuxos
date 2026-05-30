import { useState } from 'react';
import { GitBranch, GitCommit, GitPullRequest, Plus, RefreshCw, History, GitMerge } from 'lucide-react';

interface GitClientProps { windowId: string }

interface Commit { hash: string; message: string; author: string; date: string; }

const mockCommits: Commit[] = [
  { hash: 'a1b2c3d', message: 'feat: Add user authentication module', author: 'Henry', date: '2024-12-15 14:30' },
  { hash: 'e4f5g6h', message: 'fix: Resolve login redirect issue', author: 'Henry', date: '2024-12-14 10:15' },
  { hash: 'i7j8k9l', message: 'refactor: Clean up component structure', author: 'Henry', date: '2024-12-13 16:45' },
  { hash: 'm0n1o2p', message: 'docs: Update README with setup instructions', author: 'Admin', date: '2024-12-12 09:00' },
  { hash: 'q3r4s5t', message: 'feat: Add file manager component', author: 'Henry', date: '2024-12-11 11:30' },
  { hash: 'u6v7w8x', message: 'test: Add unit tests for utils', author: 'Admin', date: '2024-12-10 15:00' },
];

const branches = ['main', 'develop', 'feature/auth', 'feature/filemanager', 'bugfix/login'];

export default function GitClient({ windowId: _windowId }: GitClientProps) {
  const [activeBranch, setActiveBranch] = useState('main');
  const [activeTab, setActiveTab] = useState<'log' | 'branches' | 'stats'>('log');
  const [message, setMessage] = useState('');

  const handleCommit = () => {
    if (!message.trim()) return;
    setMessage('');
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <GitBranch size={16} style={{ color: 'var(--accent-silver)' }} />
        <select value={activeBranch} onChange={(e) => setActiveBranch(e.target.value)}
          className="h-7 px-2 text-xs rounded outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}>
          {branches.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <button onClick={() => {}} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Pull"><GitPullRequest size={14} /></button>
        <button onClick={() => {}} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Refresh"><RefreshCw size={14} /></button>
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        {(['log','branches','stats'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === tab ? 'border-b-2' : ''}`}
            style={{ color: activeTab === tab ? 'var(--accent-silver)' : 'var(--text-muted)', borderColor: activeTab === tab ? 'var(--accent-silver)' : 'transparent' }}>
            {tab === 'log' ? 'Log' : tab === 'branches' ? 'Branches' : 'Stats'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'log' && (
          <div className="space-y-2">
            {mockCommits.map((c, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--bg-window)' }}>
                <GitCommit size={16} style={{ color: 'var(--accent-silver)', marginTop: 2 }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-primary)]">{c.message}</div>
                  <div className="flex gap-3 mt-1 text-[11px] text-[var(--text-muted)]">
                    <span className="font-mono text-[var(--accent-silver)]">{c.hash}</span>
                    <span>{c.author}</span>
                    <span>{c.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'branches' && (
          <div className="space-y-1">
            {branches.map(b => (
              <div key={b} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: b === activeBranch ? 'var(--bg-hover)' : 'var(--bg-window)' }}>
                <GitBranch size={16} style={{ color: b === activeBranch ? 'var(--accent-silver)' : 'var(--text-muted)' }} />
                <span className="text-sm text-[var(--text-primary)]">{b}</span>
                {b === 'main' && <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white" style={{ background: 'var(--accent-dark-gray)', fontSize: '10px' }}>default</span>}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
                <div className="text-2xl font-bold text-[var(--accent-silver)]">6</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Commits</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>5</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Branches</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>2</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Authors</div>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
                <div className="text-2xl font-bold" style={{ color: 'var(--info)' }}>48</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Files</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Commit area */}
      <div className="flex items-center gap-2 px-3 py-2 border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Commit message..."
          className="flex-1 h-8 px-3 rounded text-xs outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }} />
        <button onClick={handleCommit} className="px-4 h-8 rounded text-xs font-medium text-white" style={{ background: 'var(--accent-dark-gray)' }}>
          Commit
        </button>
      </div>

      <div className="flex items-center px-3 py-0.5 border-t text-[10px]" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>Repository: webos-desktop | Branch: {activeBranch} | Clean</span>
      </div>
    </div>
  );
}
