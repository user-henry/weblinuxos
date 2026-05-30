import { useState } from 'react';
import { HelpCircle, BookOpen, Search, ChevronRight, ExternalLink, Terminal, Settings, FileText, Globe } from 'lucide-react';

interface HelpProps { windowId: string }

const sections = [
  {
    title: 'Getting Started',
    icon: BookOpen,
    items: [
      { q: 'What is WebOS?', a: 'WebOS is a web-based operating system that runs entirely in your browser. It provides a complete desktop environment with applications, file management, and system utilities.' },
      { q: 'How to log in?', a: 'After the boot sequence completes, you can log in as an existing user using a password, or select "Guest" mode from the Switch User menu for instant access without a password.' },
      { q: 'How to open applications?', a: 'Click the Activities button in the top panel, press the Super (Meta) key, or use the application menu at the bottom. You can also use the dock to launch pinned apps.' },
    ]
  },
  {
    title: 'System Features',
    icon: Settings,
    items: [
      { q: 'Workspace Management', a: 'WebOS supports 3 virtual workspaces. Use the workspace switcher in the top panel to move between them. You can set different wallpapers for each workspace in Settings.' },
      { q: 'Theme Customization', a: 'Switch between Dark and Light themes in Settings > Appearance. You can also customize the accent color and choose from multiple wallpapers.' },
      { q: 'Notifications', a: 'Click the bell icon in the top panel to view notifications. The system will notify you of important events and application updates.' },
    ]
  },
  {
    title: 'Applications',
    icon: Terminal,
    items: [
      { q: 'Terminal Usage', a: 'The Terminal app emulates a Linux terminal. Use commands like ls, cd, pwd, cat, echo, clear, date, and help to interact with the virtual file system.' },
      { q: 'File Manager', a: 'Browse, create, rename, and delete files and folders. Supports drag-and-drop, search, and multiple view modes (grid/list). Right-click for context menu options.' },
      { q: 'Web Browser', a: 'The built-in browser supports iframe-compatible websites. Use the search/URL bar to navigate. External sites can be opened in a new tab using the external link button.' },
    ]
  },
  {
    title: 'Development Tools',
    icon: FileText,
    items: [
      { q: 'Code Editor', a: 'Supports syntax highlighting for JavaScript, TypeScript, Python, HTML, CSS, JSON, SQL, C++, and Markdown. Features line numbers and language selection.' },
      { q: 'Markdown Editor', a: 'Write and preview Markdown documents with live rendering. Supports headings, bold/italic, code blocks, lists, links, and images. Save to the virtual file system.' },
      { q: 'Git Client', a: 'View commit history, switch branches, and manage repositories. Displays commit details including author, date, and commit messages.' },
    ]
  },
  {
    title: 'Troubleshooting',
    icon: ExternalLink,
    items: [
      { q: 'App not responding?', a: 'You can close individual windows using the X button on any window frame. If needed, restart the system using the Restart option on the login screen.' },
      { q: 'File system issues?', a: 'The virtual file system resets on page reload. Save important data externally using download features provided in applications.' },
      { q: 'Performance tips', a: 'Close unused applications to free up resources. The Task Manager can be used to monitor system performance. Use Guest mode for lighter sessions.' },
    ]
  },
];

export default function Help({ windowId: _windowId }: HelpProps) {
  const [search, setSearch] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Getting Started']));
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleSection = (title: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(title)) next.delete(title); else next.add(title);
      return next;
    });
  };

  const toggleItem = (q: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(q)) next.delete(q); else next.add(q);
      return next;
    });
  };

  const filteredSections = sections.map(s => ({
    ...s,
    items: s.items.filter(i => !search || i.q.toLowerCase().includes(search.toLowerCase()) || i.a.toLowerCase().includes(search.toLowerCase())),
  })).filter(s => s.items.length > 0);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <HelpCircle size={22} style={{ color: 'var(--accent-silver)' }} />
        <div>
          <h3 className="text-base font-semibold text-[var(--text-primary)]">WebOS Help</h3>
          <p className="text-xs text-[var(--text-muted)]">Documentation & Support</p>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-input)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-40 bg-transparent text-xs outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Search help..." />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSections.map(section => (
          <div key={section.title} className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-window)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <button onClick={() => toggleSection(section.title)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors">
              <section.icon size={18} style={{ color: 'var(--accent-silver)' }} />
              <span className="text-sm font-semibold text-[var(--text-primary)] flex-1 text-left">{section.title}</span>
              <ChevronRight size={16} className={`transition-transform text-[var(--text-muted)] ${expandedSections.has(section.title) ? 'rotate-90' : ''}`} />
            </button>
            {expandedSections.has(section.title) && (
              <div className="border-t" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                {section.items.map(item => (
                  <div key={item.q} className="border-b last:border-b-0" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    <button onClick={() => toggleItem(item.q)}
                      className="w-full flex items-center gap-2 px-6 py-2.5 text-left hover:bg-[var(--bg-hover)] transition-colors">
                      <span className="text-xs font-medium text-[var(--text-primary)] flex-1">{item.q}</span>
                      <ChevronRight size={12} className={`transition-transform text-[var(--text-muted)] ${expandedItems.has(item.q) ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedItems.has(item.q) && (
                      <div className="px-6 pb-3 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {filteredSections.length === 0 && (
          <div className="text-center py-12 text-sm text-[var(--text-muted)]">No help topics match your search.</div>
        )}
      </div>

      <div className="px-4 py-2 text-center text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        WebOS 6.5 Documentation | Press Super key for app menu
      </div>
    </div>
  );
}
