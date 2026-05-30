import { useState } from 'react';
import { Mail, Send, Inbox, Star, Archive, Trash2, Paperclip } from 'lucide-react';

interface EmailClientProps { windowId: string }

interface Email { id: number; from: string; subject: string; preview: string; time: string; read: boolean; starred: boolean; }

const mockEmails: Email[] = [
  { id: 1, from: 'GitHub Notifications', subject: '[WebOS] New release v6.5 published', preview: 'A new version of WebOS has been released with exciting features...', time: '10:30 AM', read: false, starred: true },
  { id: 2, from: 'Alice Johnson', subject: 'Meeting notes from yesterday', preview: 'Hi, here are the notes from our design review meeting...', time: '9:15 AM', read: false, starred: false },
  { id: 3, from: 'System Admin', subject: 'Security update available', preview: 'Please update your system to the latest security patch...', time: 'Yesterday', read: true, starred: false },
  { id: 4, from: 'Bob Williams', subject: 'Project timeline update', preview: 'I have updated the project timeline as we discussed...', time: 'Yesterday', read: true, starred: false },
  { id: 5, from: 'npm Registry', subject: 'Package webos-components@2.1.0 published', preview: 'Your package has been successfully published to npm...', time: 'Dec 14', read: true, starred: false },
  { id: 6, from: 'Diana Chen', subject: 'Lunch tomorrow?', preview: 'Hey! Are you free for lunch tomorrow? There is a new place...', time: 'Dec 14', read: true, starred: true },
];

export default function EmailClient({ windowId: _windowId }: EmailClientProps) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [view, setView] = useState<'inbox' | 'compose'>('inbox');
  const [emails, setEmails] = useState(mockEmails);
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');

  const toggleStar = (id: number) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, starred: !e.starred } : e));
  };

  const selectEmail = (email: Email) => {
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
    setSelectedEmail(email);
  };

  const handleSend = () => {
    if (!composeTo.trim()) return;
    setEmails(prev => [{
      id: Date.now(), from: 'You', subject: composeSubject || '(no subject)',
      preview: composeBody.slice(0, 80), time: 'Just now', read: true, starred: false,
    }, ...prev]);
    setComposeTo(''); setComposeSubject(''); setComposeBody('');
    setView('inbox');
  };

  const unreadCount = emails.filter(e => !e.read).length;

  return (
    <div className="w-full h-full flex" style={{ background: 'var(--bg-workspace)' }}>
      {/* Sidebar */}
      <div className="w-48 border-r flex flex-col" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button onClick={() => { setView('compose'); setSelectedEmail(null); }}
          className="mx-3 mt-3 mb-4 py-2 rounded-lg text-sm font-medium text-white" style={{ background: 'var(--accent-dark-gray)' }}>
          + Compose
        </button>
        <nav className="flex-1 px-2 space-y-1">
          {[
            { icon: Inbox, label: 'Inbox', count: unreadCount, view: 'inbox' as const },
            { icon: Star, label: 'Starred', count: emails.filter(e => e.starred).length, view: 'inbox' as const },
            { icon: Archive, label: 'Archive', count: 0, view: 'inbox' as const },
            { icon: Trash2, label: 'Trash', count: 0, view: 'inbox' as const },
          ].map(item => (
            <button key={item.label} onClick={() => { setView(item.view); setSelectedEmail(null); }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-[var(--bg-hover)] transition-colors"
              style={{ color: 'var(--text-primary)' }}>
              <item.icon size={16} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full text-white" style={{ background: 'var(--accent-silver)' }}>{item.count}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main */}
      {view === 'compose' ? (
        <div className="flex-1 flex flex-col p-4" style={{ background: 'var(--bg-workspace)' }}>
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">New Message</h3>
          <input value={composeTo} onChange={(e) => setComposeTo(e.target.value)}
            className="h-9 px-3 rounded text-sm outline-none mb-2" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}
            placeholder="To:" />
          <input value={composeSubject} onChange={(e) => setComposeSubject(e.target.value)}
            className="h-9 px-3 rounded text-sm outline-none mb-2" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}
            placeholder="Subject:" />
          <textarea value={composeBody} onChange={(e) => setComposeBody(e.target.value)}
            className="flex-1 p-3 rounded text-sm outline-none resize-none mb-3" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}
            placeholder="Write your message..." />
          <div className="flex gap-2">
            <button onClick={handleSend} className="px-6 py-2 rounded text-sm font-medium text-white flex items-center gap-2" style={{ background: 'var(--accent-dark-gray)' }}>
              <Send size={14} />Send
            </button>
            <button onClick={() => setView('inbox')} className="px-4 py-2 rounded text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>Cancel</button>
            <button className="p-2 rounded hover:bg-[var(--bg-hover)]"><Paperclip size={16} /></button>
          </div>
        </div>
      ) : selectedEmail ? (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto" style={{ background: 'var(--bg-workspace)' }}>
          <button onClick={() => setSelectedEmail(null)} className="text-xs text-[var(--accent-silver)] mb-3 hover:underline">&larr; Back to Inbox</button>
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{selectedEmail.subject}</h2>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--accent-silver)' }}>
              {selectedEmail.from.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--text-primary)]">{selectedEmail.from}</div>
              <div className="text-[11px] text-[var(--text-muted)]">{selectedEmail.time}</div>
            </div>
          </div>
          <div className="flex-1 text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
            <p>{selectedEmail.preview}</p>
            <p className="mt-4 text-[var(--text-muted)]">--- End of message ---</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b text-xs font-semibold flex items-center justify-between" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-primary)' }}>
            <span>Inbox ({unreadCount} unread)</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {emails.map(email => (
              <button key={email.id} onClick={() => selectEmail(email)}
                className="w-full flex items-start gap-3 px-4 py-3 border-b text-left hover:bg-[var(--bg-hover)] transition-colors"
                style={{ borderColor: 'rgba(0,0,0,0.04)', background: !email.read ? 'var(--bg-window)' : 'var(--bg-workspace)' }}>
                <button onClick={(e) => { e.stopPropagation(); toggleStar(email.id); }} className="mt-0.5">
                  <Star size={14} fill={email.starred ? '#F39C12' : 'none'} color={email.starred ? '#F39C12' : 'var(--text-muted)'} />
                </button>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'var(--accent-silver)' }}>
                  {email.from.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm truncate ${!email.read ? 'font-bold' : ''}`} style={{ color: 'var(--text-primary)' }}>{email.from}</span>
                    {!email.read && <span className="w-2 h-2 rounded-full bg-[var(--accent-silver)] flex-shrink-0" />}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-primary)' }}>{email.subject}</div>
                  <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{email.preview}</div>
                </div>
                <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{email.time}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        Connected to mail.webos.local | IMAP
      </div>
    </div>
  );
}
