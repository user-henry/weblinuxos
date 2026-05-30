import { useState, useMemo } from 'react';
import { Braces, Copy, Download, Minus, Plus, Search } from 'lucide-react';

interface JsonViewerProps { windowId: string }

const SAMPLE_JSON = `{
  "name": "WebOS",
  "version": "6.5.0",
  "description": "A web-based operating system",
  "repository": {
    "type": "git",
    "url": "https://github.com/user-henry/weblinuxos"
  },
  "applications": [
    { "name": "Terminal", "category": "System", "version": "2.1.0" },
    { "name": "File Manager", "category": "System", "version": "3.0.1" },
    { "name": "Calculator", "category": "Accessories", "version": "1.5.0" }
  ],
  "settings": {
    "theme": "dark",
    "language": "en-US",
    "timeFormat": "24h",
    "features": {
      "wifi": true,
      "notifications": true,
      "autoSave": false
    }
  }
}`;

interface TreeNodeProps {
  keyName: string | number;
  value: any;
  depth: number;
  path: string;
}

function TreeNode({ keyName, value, depth, path }: TreeNodeProps) {
  const [collapsed, setCollapsed] = useState(depth >= 3);
  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);
  const entries = isObject ? (isArray ? value : Object.entries(value)) : null;
  const isEmpty = isObject && (entries as any[]).length === 0;

  const indent = depth * 16;

  if (!isObject) {
    const displayVal = value === null ? 'null' : typeof value === 'string' ? `"${value}"` : String(value);
    const colorVal = value === null ? '#888' : typeof value === 'string' ? '#CE9178' : typeof value === 'number' ? '#B5CEA8' : typeof value === 'boolean' ? '#569CD6' : '#d4d4d4';
    return (
      <div className="flex text-xs font-mono leading-relaxed" style={{ paddingLeft: indent + 16 }}>
        {typeof keyName === 'number' ? (
          <span style={{ color: '#888' }}>{keyName}: </span>
        ) : (
          <span><span style={{ color: '#9CDCFE' }}>"{keyName}"</span><span style={{ color: '#888' }}>: </span></span>
        )}
        <span style={{ color: colorVal }}>{displayVal}</span>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex text-xs font-mono leading-relaxed" style={{ paddingLeft: indent + 16 }}>
        {typeof keyName === 'number' ? null : <span><span style={{ color: '#9CDCFE' }}>"{keyName}"</span><span style={{ color: '#888' }}>: </span></span>}
        <span style={{ color: '#888' }}>{isArray ? '[]' : '{}'}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center text-xs font-mono leading-relaxed cursor-pointer hover:bg-white/5" style={{ paddingLeft: indent }} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? <Plus size={10} style={{ color: '#888', marginRight: 4 }} /> : <Minus size={10} style={{ color: '#888', marginRight: 4 }} />}
        {typeof keyName === 'number' ? null : <span><span style={{ color: '#9CDCFE' }}>"{keyName}"</span><span style={{ color: '#888' }}>: </span></span>}
        <span style={{ color: '#888' }}>{isArray ? `Array(${(entries as any[]).length}) [` : `Object(${(entries as any[]).length}) {`}</span>
        {collapsed && <span style={{ color: '#888' }}>{isArray ? ']' : '}'}</span>}
      </div>
      {!collapsed && (
        <div>
          {isArray
            ? (value as any[]).map((item, i) => <TreeNode key={i} keyName={i} value={item} depth={depth + 1} path={`${path}[${i}]`} />)
            : Object.entries(value).map(([k, v]) => <TreeNode key={k} keyName={k} value={v} depth={depth + 1} path={`${path}.${k}`} />)
          }
          <div className="flex text-xs font-mono leading-relaxed" style={{ paddingLeft: indent }}>
            <span style={{ color: '#888' }}>{isArray ? ']' : '}'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function JsonViewer({ windowId: _windowId }: JsonViewerProps) {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [search, setSearch] = useState('');

  const { parsed, error } = useMemo(() => {
    try { return { parsed: JSON.parse(input), error: null }; }
    catch (e: any) { return { parsed: null, error: e.message }; }
  }, [input]);

  const formatted = useMemo(() => {
    if (!parsed) return '';
    if (search) {
      const filtered = filterJson(parsed, search);
      return JSON.stringify(filtered, null, 2);
    }
    return JSON.stringify(parsed, null, 2);
  }, [parsed, search]);

  function filterJson(obj: any, term: string): any {
    if (obj === null || typeof obj !== 'object') return obj;
    const lower = term.toLowerCase();
    if (Array.isArray(obj)) {
      const result = obj.map(item => filterJson(item, term));
      return result;
    }
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.toLowerCase().includes(lower) || JSON.stringify(value).toLowerCase().includes(lower)) {
        result[key] = typeof value === 'object' ? filterJson(value, term) : value;
      }
    }
    return result;
  }

  const handleFormat = () => {
    if (!parsed) return;
    setInput(JSON.stringify(parsed, null, 2));
  };

  const handleMinify = () => {
    try { setInput(JSON.stringify(JSON.parse(input))); } catch {}
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      <div className="flex items-center gap-1 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Braces size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-semibold text-[var(--text-muted)]">JSON Viewer</span>
        <div className="flex-1" />
        <button onClick={handleFormat} className="text-[11px] px-2 py-1 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-secondary)' }}>Format</button>
        <button onClick={handleMinify} className="text-[11px] px-2 py-1 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-secondary)' }}>Minify</button>
        <button onClick={() => navigator.clipboard.writeText(input)} className="p-1 rounded hover:bg-[var(--bg-hover)]"><Copy size={14} /></button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Input */}
        <div className="w-1/2 border-r flex flex-col" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <textarea value={input} onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 text-xs font-mono outline-none resize-none" style={{ background: '#1e1e1e', color: '#d4d4d4' }} spellCheck={false} />
          {error && <div className="px-3 py-1 text-xs text-red-500" style={{ background: 'var(--bg-window)' }}>{error}</div>}
        </div>
        {/* Tree view */}
        <div className="w-1/2 flex flex-col overflow-auto" style={{ background: '#1e1e1e' }}>
          <div className="flex items-center gap-2 px-3 py-1.5 border-b" style={{ background: '#252526', borderColor: 'rgba(255,255,255,0.06)' }}>
            <Search size={12} style={{ color: '#888' }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Filter..."
              className="flex-1 text-xs bg-transparent outline-none" style={{ color: '#d4d4d4' }} />
          </div>
          <div className="flex-1 p-3 overflow-y-auto">
            {parsed && !error ? <TreeNode keyName="root" value={parsed} depth={-1} path="" /> : !error ? <span className="text-xs text-[#888]">Enter valid JSON</span> : null}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{parsed ? 'Valid JSON' : 'Invalid JSON'}</span>
        <span>{input.length} chars</span>
      </div>
    </div>
  );
}
