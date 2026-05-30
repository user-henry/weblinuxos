import { useState } from 'react';
import { BookOpen, Search, Volume2, ExternalLink } from 'lucide-react';

interface DictionaryProps { windowId: string }

interface WordEntry { word: string; phonetic: string; meaning: string; example: string; synonyms: string[]; }

const dictionary: WordEntry[] = [
  { word: 'algorithm', phonetic: '/ˈælɡəˌrɪðəm/', meaning: 'A process or set of rules to be followed in calculations or other problem-solving operations, especially by a computer.', example: 'The sorting algorithm efficiently organized the data.', synonyms: ['procedure', 'method', 'formula', 'process'] },
  { word: 'innovation', phonetic: '/ˌɪnəˈveɪʃən/', meaning: 'The action or process of innovating; a new method, idea, product, etc.', example: 'The company is known for its commitment to innovation in technology.', synonyms: ['invention', 'creativity', 'breakthrough', 'advancement'] },
  { word: 'sustainable', phonetic: '/səˈsteɪnəbəl/', meaning: 'Able to be maintained at a certain rate or level; conserving an ecological balance.', example: 'We need to develop sustainable energy sources for the future.', synonyms: ['eco-friendly', 'renewable', 'green', 'viable'] },
  { word: 'architecture', phonetic: '/ˈɑːrkɪˌtektʃər/', meaning: 'The art or practice of designing and constructing buildings; the complex structure of something.', example: 'The software architecture was designed for scalability.', synonyms: ['design', 'structure', 'framework', 'construction'] },
  { word: 'paradigm', phonetic: '/ˈpærəˌdaɪm/', meaning: 'A typical example or pattern of something; a model or worldview.', example: 'This discovery represents a paradigm shift in our understanding.', synonyms: ['model', 'pattern', 'example', 'standard'] },
  { word: 'eloquent', phonetic: '/ˈeləkwənt/', meaning: 'Fluent or persuasive in speaking or writing; clearly expressing feeling or meaning.', example: 'She gave an eloquent speech at the conference.', synonyms: ['articulate', 'fluent', 'expressive', 'persuasive'] },
  { word: 'resilient', phonetic: '/rɪˈzɪliənt/', meaning: 'Able to withstand or recover quickly from difficult conditions.', example: 'The system proved resilient against cyber attacks.', synonyms: ['tough', 'durable', 'robust', 'adaptable'] },
  { word: 'ubiquitous', phonetic: '/juːˈbɪkwɪtəs/', meaning: 'Present, appearing, or found everywhere.', example: 'Smartphones have become ubiquitous in modern society.', synonyms: ['everywhere', 'omnipresent', 'universal', 'pervasive'] },
];

export default function Dictionary({ windowId: _windowId }: DictionaryProps) {
  const [search, setSearch] = useState('');
  const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);

  const filtered = dictionary.filter(w =>
    !search || w.word.toLowerCase().includes(search.toLowerCase()) || w.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Search */}
      <div className="p-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-input)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setSelectedWord(null); }}
            className="flex-1 text-xs bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Search dictionary..." autoFocus />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedWord ? (
          <div className="p-4">
            <button onClick={() => setSelectedWord(null)} className="text-xs text-[var(--accent-silver)] mb-4 hover:underline">&larr; Back to results</button>
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-[var(--text-primary)]">{selectedWord.word}</h2>
                <button className="p-1 rounded hover:bg-[var(--bg-hover)]"><Volume2 size={16} style={{ color: 'var(--accent-silver)' }} /></button>
              </div>
              <span className="text-sm text-[var(--accent-silver)]">{selectedWord.phonetic}</span>
            </div>
            <div className="mb-4">
              <h4 className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">Definition</h4>
              <p className="text-sm leading-relaxed text-[var(--text-primary)]">{selectedWord.meaning}</p>
            </div>
            <div className="mb-4">
              <h4 className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">Example</h4>
              <p className="text-sm italic text-[var(--text-secondary)]">"{selectedWord.example}"</p>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold text-[var(--text-muted)] mb-2">Synonyms</h4>
              <div className="flex flex-wrap gap-1">
                {selectedWord.synonyms.map(s => (
                  <span key={s} className="px-2 py-1 rounded-full text-[10px]" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)' }}>{s}</span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-1">
            {filtered.map(w => (
              <button key={w.word} onClick={() => setSelectedWord(w)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-[var(--bg-hover)] transition-colors"
                style={{ background: 'var(--bg-window)' }}>
                <BookOpen size={16} style={{ color: 'var(--accent-silver)' }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-primary)]">{w.word}</div>
                  <div className="text-[11px] text-[var(--text-muted)] truncate">{w.meaning}</div>
                </div>
                <span className="text-[10px] text-[var(--text-muted)]">{w.phonetic}</span>
              </button>
            ))}
            {filtered.length === 0 && search && (
              <div className="text-center py-12 text-sm text-[var(--text-muted)]">No words found for "{search}"</div>
            )}
          </div>
        )}
      </div>

      <div className="px-4 py-2 text-[10px] text-center border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        {dictionary.length} words | English Dictionary
      </div>
    </div>
  );
}
