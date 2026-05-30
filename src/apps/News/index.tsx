import { useState } from 'react';
import { Newspaper, ExternalLink, Clock, Globe, RefreshCw } from 'lucide-react';

interface NewsProps { windowId: string }

interface Article { id: number; title: string; source: string; category: string; summary: string; time: string; url: string; }

const mockArticles: Article[] = [
  { id: 1, title: 'WebOS 6.5 Released with Major Performance Improvements', source: 'TechCrunch', category: 'Technology', summary: 'The latest version of WebOS brings significant performance enhancements, including a 40% faster boot time and improved memory management across all applications.', time: '2 hours ago', url: '#' },
  { id: 2, title: 'Electric Vehicle Sales Surge Past 10 Million Units Globally', source: 'Reuters', category: 'Business', summary: 'Global electric vehicle sales have surpassed the 10 million milestone, marking a significant shift in the automotive industry toward sustainable transportation.', time: '4 hours ago', url: '#' },
  { id: 3, title: 'New AI Model Achieves Breakthrough in Natural Language Understanding', source: 'Nature', category: 'Science', summary: 'Researchers have developed a new AI architecture that demonstrates unprecedented accuracy in understanding complex natural language queries.', time: '6 hours ago', url: '#' },
  { id: 4, title: 'Olympic Committee Announces 2028 Venue Changes', source: 'BBC Sports', category: 'Sports', summary: 'The International Olympic Committee has announced several venue changes for the 2028 Los Angeles Olympics, aiming to improve sustainability.', time: '8 hours ago', url: '#' },
  { id: 5, title: 'Global Climate Summit Reaches Historic Agreement', source: 'Associated Press', category: 'World', summary: 'World leaders have reached a landmark agreement at the Global Climate Summit, pledging to reduce carbon emissions by 50% by 2035.', time: '12 hours ago', url: '#' },
  { id: 6, title: 'Quantum Computing Milestone: 1000-Qubit Processor Demonstrated', source: 'Wired', category: 'Technology', summary: 'A team of physicists has successfully demonstrated a 1000-qubit quantum processor, bringing practical quantum computing one step closer to reality.', time: '1 day ago', url: '#' },
];

const categories = ['All', 'Technology', 'Business', 'Science', 'Sports', 'World'];

export default function News({ windowId: _windowId }: NewsProps) {
  const [activeCat, setActiveCat] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles] = useState(mockArticles);

  const filtered = activeCat === 'All' ? articles : articles.filter(a => a.category === activeCat);

  if (selectedArticle) {
    return (
      <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
        <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={() => setSelectedArticle(null)} className="text-xs text-[var(--accent-silver)] hover:underline">&larr; Back</button>
          <div className="flex-1" />
          <a href={selectedArticle.url} target="_blank" className="text-xs flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" rel="noreferrer">
            <ExternalLink size={12} />Open Source
          </a>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mb-3">
            <span className="px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--accent-silver)', fontSize: '10px' }}>{selectedArticle.category}</span>
            <span>{selectedArticle.source}</span>
            <Clock size={12} />
            <span>{selectedArticle.time}</span>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-primary)] mb-4">{selectedArticle.title}</h1>
          <div className="text-sm leading-relaxed text-[var(--text-primary)]">
            <p>{selectedArticle.summary}</p>
            <p className="mt-4 text-[var(--text-muted)]">This is a simulated news article for demonstration purposes.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Newspaper size={20} style={{ color: 'var(--accent-silver)' }} />
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">News Reader</h2>
        <div className="flex-1" />
        <button className="p-1.5 rounded hover:bg-[var(--bg-hover)]"><RefreshCw size={14} /></button>
      </div>

      {/* Categories */}
      <div className="flex gap-1 px-4 py-2 border-b overflow-x-auto" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCat(cat)}
            className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-colors ${activeCat === cat ? 'text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
            style={activeCat === cat ? { background: 'var(--accent-dark-gray)' } : {}}>{cat}</button>
        ))}
      </div>

      {/* Articles */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filtered.map(article => (
          <button key={article.id} onClick={() => setSelectedArticle(article)}
            className="w-full text-left p-4 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]" style={{ background: 'var(--bg-window)', border: '1px solid rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full text-white" style={{ background: 'var(--accent-silver)' }}>{article.category}</span>
              <span className="text-[11px] text-[var(--text-muted)]">{article.source}</span>
              <div className="flex-1" />
              <span className="text-[10px] text-[var(--text-muted)]"><Clock size={10} className="inline mr-0.5" />{article.time}</span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{article.title}</h3>
            <p className="text-xs text-[var(--text-muted)] line-clamp-2">{article.summary}</p>
          </button>
        ))}
      </div>

      <div className="px-3 py-1 text-[10px] border-t text-center" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        {filtered.length} articles | Updated: Just now
      </div>
    </div>
  );
}
