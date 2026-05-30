import { useState, useRef } from 'react';
import { PenTool, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Undo, Redo, Save, FilePlus, Type } from 'lucide-react';

interface WriterProps { windowId: string }

export default function Writer({ windowId: _windowId }: WriterProps) {
  const [title, setTitle] = useState('Untitled Document');
  const [content, setContent] = useState(`Welcome to Writer - the word processor for WebOS.

This is a sample document demonstrating the Writer application. You can use this space to draft documents, letters, reports, and more.

Key Features:
• Rich text editing capabilities
• Multiple formatting options
• Clean, modern interface
• Auto-save functionality

Start typing or editing to begin your document...`);
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Inter');
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const insertFormat = (tag: string) => {
    const ta = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    const before = content.slice(0, s), selected = content.slice(s, e) || 'text', after = content.slice(e);
    setContent(before + tag.replace('$1', selected) + after);
  };

  const words = content.split(/\s+/).filter(Boolean).length;
  const chars = content.length;

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b flex-wrap" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button onClick={() => { setTitle('Untitled Document'); setContent(''); }} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="New"><FilePlus size={14} /></button>
        <button onClick={handleSave} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Save"><Save size={14} /></button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <button onClick={() => insertFormat('**$1**')} className="p-1.5 rounded hover:bg-[var(--bg-hover)] font-bold" title="Bold"><Bold size={14} /></button>
        <button onClick={() => insertFormat('*$1*')} className="p-1.5 rounded hover:bg-[var(--bg-hover)] italic" title="Italic"><Italic size={14} /></button>
        <button onClick={() => insertFormat('__$1__')} className="p-1.5 rounded hover:bg-[var(--bg-hover)] underline" title="Underline"><Underline size={14} /></button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <button onClick={() => insertFormat('- $1')} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Bullet List"><List size={14} /></button>
        <button onClick={() => insertFormat('1. $1')} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Numbered List"><ListOrdered size={14} /></button>
        <div className="flex-1" />
        <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}
          className="h-7 px-2 text-xs rounded outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }}>
          {['Inter','Times New Roman','Georgia','Courier New','Verdana'].map(f => <option key={f}>{f}</option>)}
        </select>
        <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))}
          className="h-7 w-16 px-1 text-xs rounded outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }}>
          {[10,11,12,14,16,18,20,24,28,36].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Title */}
      <div className="px-4 pt-4 pb-2" style={{ background: 'var(--bg-workspace)' }}>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
          className="w-full text-xl font-bold bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} />
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            className="absolute inset-0 p-4 text-sm outline-none resize-none leading-relaxed" style={{ background: 'var(--bg-workspace)', color: 'var(--text-primary)', fontFamily, fontSize: `${fontSize}px` }}
            spellCheck={false} placeholder="Start writing..." />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between px-4 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{words} words | {chars} chars</span>
        <span>{saved ? '✓ Saved' : 'Modified'}</span>
      </div>
    </div>
  );
}
