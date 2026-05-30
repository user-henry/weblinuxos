import { useState, useMemo } from 'react';
import { SplitSquareHorizontal, Copy, ArrowLeftRight } from 'lucide-react';

interface DiffViewerProps { windowId: string }

const sampleLeft = `function greet(name) {
  return "Hello, " + name;
}

const users = ["Alice", "Bob", "Charlie"];

for (let i = 0; i < users.length; i++) {
  console.log(greet(users[i]));
}

// Old implementation
function add(a, b) {
  return a + b;
}`;

const sampleRight = `function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const users = ["Alice", "Bob", "Charlie", "Diana"];

for (const user of users) {
  console.log(greet(user));
}

// New implementation with type safety
function add(a: number, b: number): number {
  return a + b;
}

// NEW: multiply function
function multiply(a: number, b: number): number {
  return a * b;
}`;

function computeDiff(left: string, right: string): { type: 'same' | 'added' | 'removed' | 'modified'; leftLine?: string; rightLine?: string; leftNum?: number; rightNum?: number }[] {
  const leftLines = left.split('\n');
  const rightLines = right.split('\n');
  const result: any[] = [];
  let li = 0, ri = 0;
  while (li < leftLines.length || ri < rightLines.length) {
    if (li < leftLines.length && ri < rightLines.length) {
      if (leftLines[li] === rightLines[ri]) {
        result.push({ type: 'same', leftLine: leftLines[li], leftNum: li + 1, rightNum: ri + 1 });
        li++; ri++;
      } else if (ri + 1 < rightLines.length && leftLines[li] === rightLines[ri + 1]) {
        result.push({ type: 'added', rightLine: rightLines[ri], rightNum: ri + 1 });
        ri++;
      } else if (li + 1 < leftLines.length && leftLines[li + 1] === rightLines[ri]) {
        result.push({ type: 'removed', leftLine: leftLines[li], leftNum: li + 1 });
        li++;
      } else {
        result.push({ type: 'removed', leftLine: leftLines[li], leftNum: li + 1 });
        result.push({ type: 'added', rightLine: rightLines[ri], rightNum: ri + 1 });
        li++; ri++;
      }
    } else if (li < leftLines.length) {
      result.push({ type: 'removed', leftLine: leftLines[li], leftNum: li + 1 });
      li++;
    } else {
      result.push({ type: 'added', rightLine: rightLines[ri], rightNum: ri + 1 });
      ri++;
    }
  }
  return result;
}

export default function DiffViewer({ windowId: _windowId }: DiffViewerProps) {
  const [leftText, setLeftText] = useState(sampleLeft);
  const [rightText, setRightText] = useState(sampleRight);
  const [unified, setUnified] = useState(true);

  const diff = useMemo(() => computeDiff(leftText, rightText), [leftText, rightText]);

  const stats = useMemo(() => {
    let added = 0, removed = 0, same = 0;
    diff.forEach(d => { if (d.type === 'added') added++; else if (d.type === 'removed') removed++; else same++; });
    return { added, removed, same };
  }, [diff]);

  const escapeHtml = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <SplitSquareHorizontal size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-semibold text-[var(--text-muted)]">Diff Viewer</span>
        <div className="flex-1" />
        <span className="text-[10px] text-green-600">+{stats.added}</span>
        <span className="text-[10px] text-red-600">-{stats.removed}</span>
        <span className="text-[10px] text-[var(--text-muted)]">~{stats.same}</span>
        <button onClick={() => setUnified(!unified)} className="p-1 rounded hover:bg-[var(--bg-hover)]" title="Toggle unified view">
          <ArrowLeftRight size={14} />
        </button>
      </div>

      {/* Diff */}
      <div className="flex-1 overflow-auto">
        {unified ? (
          <div className="font-mono text-xs leading-5">
            {diff.map((d, i) => (
              <div key={i} className={`flex ${d.type === 'added' ? 'bg-green-50' : d.type === 'removed' ? 'bg-red-50' : ''}`}
                style={{ 
                  background: d.type === 'added' ? 'rgba(46,204,113,0.1)' : d.type === 'removed' ? 'rgba(231,76,60,0.1)' : 'transparent',
                  borderLeft: d.type === 'added' ? '3px solid rgba(46,204,113,0.5)' : d.type === 'removed' ? '3px solid rgba(231,76,60,0.5)' : '3px solid transparent',
                }}>
                <span className="w-10 text-right pr-2 select-none text-[10px]" style={{ color: 'var(--text-muted)', minWidth: 40 }}>{d.leftNum || d.rightNum || ''}</span>
                <span className="w-5 text-center select-none text-[10px]" style={{ color: d.type === 'added' ? 'green' : d.type === 'removed' ? 'red' : 'var(--text-muted)' }}>
                  {d.type === 'added' ? '+' : d.type === 'removed' ? '-' : ' '}
                </span>
                <span className="whitespace-pre" style={{ color: 'var(--text-primary)' }}>{escapeHtml(d.type === 'removed' ? d.leftLine! : d.rightLine || d.leftLine!)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex font-mono text-xs leading-5 h-full">
            {/* Left */}
            <div className="w-1/2 border-r overflow-y-auto" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
              {diff.map((d, i) => d.type !== 'added' ? (
                <div key={i} className={`flex ${d.type === 'removed' ? 'bg-red-50' : ''}`}
                  style={{ background: d.type === 'removed' ? 'rgba(231,76,60,0.1)' : 'transparent' }}>
                  <span className="w-8 text-right pr-2 select-none text-[10px]" style={{ color: 'var(--text-muted)' }}>{d.leftNum}</span>
                  <span className="whitespace-pre" style={{ color: 'var(--text-primary)' }}>{escapeHtml(d.leftLine || '')}</span>
                </div>
              ) : (
                <div key={i} className="flex" style={{ background: 'rgba(46,204,113,0.05)' }}>
                  <span className="w-8 text-right pr-2 select-none text-[10px]" style={{ color: 'var(--text-muted)' }}></span>
                  <span className="whitespace-pre">&nbsp;</span>
                </div>
              ))}
            </div>
            {/* Right */}
            <div className="w-1/2 overflow-y-auto">
              {diff.map((d, i) => d.type !== 'removed' ? (
                <div key={i} className={`flex ${d.type === 'added' ? 'bg-green-50' : ''}`}
                  style={{ background: d.type === 'added' ? 'rgba(46,204,113,0.1)' : 'transparent' }}>
                  <span className="w-8 text-right pr-2 select-none text-[10px]" style={{ color: 'var(--text-muted)' }}>{d.rightNum}</span>
                  <span className="whitespace-pre" style={{ color: 'var(--text-primary)' }}>{escapeHtml(d.rightLine || '')}</span>
                </div>
              ) : (
                <div key={i} className="flex" style={{ background: 'rgba(231,76,60,0.05)' }}>
                  <span className="w-8 text-right pr-2 select-none text-[10px]" style={{ color: 'var(--text-muted)' }}></span>
                  <span className="whitespace-pre">&nbsp;</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>Old Version</span>
        <span>+{stats.added} added | -{stats.removed} removed | {leftText.split('\n').length} lines</span>
        <span>New Version</span>
      </div>
    </div>
  );
}
