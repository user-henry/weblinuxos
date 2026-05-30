import { useState, useMemo } from 'react';
import { Search, Copy, Flag } from 'lucide-react';

interface RegexBuddyProps { windowId: string }

const FLAGS = ['g', 'i', 'm', 's', 'u'];

export default function RegexBuddy({ windowId: _windowId }: RegexBuddyProps) {
  const [pattern, setPattern] = useState(String.raw`\b[A-Z][a-z]+\b`);
  const [testString, setTestString] = useState('Hello World! This is a Test string. Alice and Bob went to Paris.');
  const [replaceWith, setReplaceWith] = useState('###');
  const [activeFlags, setActiveFlags] = useState<string[]>(['g']);
  const [showReplace, setShowReplace] = useState(false);

  const flagsStr = activeFlags.join('');

  const { matches, replaced, error } = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flagsStr);
      const m = [...testString.matchAll(regex)];
      const r = testString.replace(regex, replaceWith);
      return { matches: m, replaced: r, error: null };
    } catch (e: any) {
      return { matches: [], replaced: testString, error: e.message };
    }
  }, [pattern, testString, flagsStr, replaceWith]);

  const highlightedText = useMemo(() => {
    if (error || !pattern) return testString;
    try {
      const regex = new RegExp(pattern, flagsStr.replace('g', '') + 'g');
      const parts = testString.split(regex);
      const ms = [...testString.matchAll(new RegExp(pattern, flagsStr))];
      let result = '';
      for (let i = 0; i < parts.length; i++) {
        result += parts[i].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        if (ms[i]) result += `<mark style="background:#FDE047;color:#000;border-radius:2px;padding:0 2px">${ms[i][0].replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}</mark>`;
      }
      return result;
    } catch { return testString; }
  }, [pattern, testString, flagsStr, error]);

  const toggleFlag = (f: string) => {
    setActiveFlags(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  };

  const groups = matches.flatMap(m => Array.from(m).slice(1)).filter(g => g !== undefined);

  const samplePatterns = [
    { label: 'Words', pattern: String.raw`\b\w+\b` },
    { label: 'Emails', pattern: String.raw`[\w.-]+@[\w.-]+\.\w+` },
    { label: 'URLs', pattern: String.raw`https?://[\w./-]+` },
    { label: 'Digits', pattern: String.raw`\d+` },
    { label: 'Hex Color', pattern: String.raw`#[0-9A-Fa-f]{6}` },
  ];

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Pattern input */}
      <div className="p-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">Regex</span>
          <span className="text-lg font-mono text-[var(--text-muted)]">/</span>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)}
            className="flex-1 h-8 px-2 rounded text-sm outline-none font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}
            placeholder="Enter regex pattern..." />
          <span className="text-lg font-mono text-[var(--text-muted)]">/</span>
          <div className="flex gap-1">
            {FLAGS.map(f => (
              <button key={f} onClick={() => toggleFlag(f)}
                className={`w-7 h-7 rounded text-xs font-mono font-bold ${activeFlags.includes(f) ? 'text-white' : ''}`}
                style={{ background: activeFlags.includes(f) ? 'var(--accent-silver)' : 'var(--bg-input)', color: activeFlags.includes(f) ? 'white' : 'var(--text-muted)' }}>{f}</button>
            ))}
          </div>
        </div>
        {error && <div className="text-xs text-red-500">{error}</div>}
        {!error && pattern && <div className="text-xs" style={{ color: 'var(--accent-silver)' }}>{matches.length} match{matches.length !== 1 ? 'es' : ''} found</div>}
      </div>

      {/* Test string */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 py-1.5 border-b flex items-center justify-between" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
          <span className="text-[11px] font-semibold text-[var(--text-muted)]">Test String</span>
          <div className="flex gap-1">
            <button onClick={() => setShowReplace(!showReplace)} className="text-[11px] px-2 py-1 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-secondary)' }}>Replace</button>
          </div>
        </div>
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="text-sm leading-relaxed font-mono whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}
            dangerouslySetInnerHTML={{ __html: highlightedText }} />
        </div>
      </div>

      {/* Replace */}
      {showReplace && (
        <div className="border-t p-3" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">Replace With</div>
          <div className="flex gap-2">
            <input value={replaceWith} onChange={(e) => setReplaceWith(e.target.value)}
              className="flex-1 h-8 px-3 rounded text-xs outline-none font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }} />
          </div>
          <div className="mt-2 p-2 rounded text-xs font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>{replaced}</div>
        </div>
      )}

      {/* Match details */}
      {matches.length > 0 && !error && (
        <div className="border-t overflow-y-auto" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', maxHeight: 120 }}>
          <div className="px-3 py-1.5 text-[11px] font-semibold text-[var(--text-muted)]">Matches</div>
          <div className="px-3 pb-2 space-y-1">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs font-mono">
                <span className="text-[var(--text-muted)]">[{i}]</span>
                <span className="text-[var(--accent-silver)]">{m[0]}</span>
                <span className="text-[var(--text-muted)]">(index: {m.index})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sample patterns */}
      <div className="flex gap-1 px-3 py-2 border-t flex-wrap" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <span className="text-[10px] text-[var(--text-muted)] mr-2">Samples:</span>
        {samplePatterns.map(s => (
          <button key={s.label} onClick={() => { setPattern(s.pattern); }}
            className="text-[10px] px-2 py-0.5 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-secondary)' }}>{s.label}</button>
        ))}
      </div>
    </div>
  );
}
