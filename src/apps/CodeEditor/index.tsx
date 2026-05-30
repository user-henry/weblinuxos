import { useState, useRef, useEffect, useCallback } from 'react';
import { Code2, Copy, Download, FilePlus, FolderOpen, Play, Save } from 'lucide-react';

interface CodeEditorProps { windowId: string }

const LANGUAGE_SAMPLES: Record<string, string> = {
  javascript: `// JavaScript Example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55

const arr = [1, 2, 3, 4, 5];
const doubled = arr.map(x => x * 2);
console.log(doubled);`,
  typescript: `// TypeScript Example
interface User {
  id: number;
  name: string;
  email: string;
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`;
}

const user: User = { id: 1, name: "Alice", email: "alice@example.com" };
console.log(greet(user));`,
  python: `# Python Example
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))`,
  html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sample Page</title>
  <style>
    body { font-family: sans-serif; padding: 2rem; }
    h1 { color: #333; }
  </style>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is a sample HTML page.</p>
</body>
</html>`,
  css: `/* CSS Example */
:root {
  --primary: #7D8B96;
  --bg: #1e1e1e;
  --text: #d4d4d4;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
}

.button {
  padding: 12px 24px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.button:hover { opacity: 0.9; }`,
  json: `{
  "name": "WebOS",
  "version": "6.5",
  "applications": ["Terminal", "File Manager", "Settings", "Browser"],
  "status": "operational",
  "uptime": "12h 34m"
}`,
  sql: `-- SQL Example
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email) VALUES
  ('Alice', 'alice@example.com'),
  ('Bob', 'bob@example.com');

SELECT * FROM users WHERE name LIKE 'A%';`,
  markdown: `# Markdown Example

## Features
- **Bold text**
- *Italic text*
- \`inline code\`

### Code Block
\`\`\`javascript
console.log('Hello!');
\`\`\`

> Blockquote example`,
  cpp: `// C++ Example
#include <iostream>
#include <vector>
#include <algorithm>

int main() {
  std::vector<int> nums = {3, 1, 4, 1, 5, 9, 2, 6};
  std::sort(nums.begin(), nums.end());
  for (int n : nums) {
    std::cout << n << " ";
  }
  return 0;
}`,
};

const LANGUAGES = Object.keys(LANGUAGE_SAMPLES);

const KEYWORDS: Record<string, string[]> = {
  javascript: ['const','let','var','function','return','if','else','for','while','class','import','export','from','true','false','null','undefined','this','new','try','catch','throw','async','await','console','log','Error','Array','Object','String','Number','Boolean','Map','Set','Promise'],
  typescript: ['interface','type','string','number','boolean','void','any','never','readonly','extends','implements','as','enum','namespace','declare'],
  python: ['def','class','return','if','elif','else','for','while','import','from','as','try','except','finally','with','yield','lambda','True','False','None','and','or','not','in','is','print','len','range','int','str','list','dict','set','tuple','float','bool'],
  html: ['html','head','body','div','span','p','h1','h2','h3','script','style','link','meta','title','a','img','ul','li','table','tr','td','th','form','input','button','select','option'],
  css: ['color','background','margin','padding','border','font','display','flex','grid','position','width','height','top','left','right','bottom','opacity','transition','animation','transform','cursor','hover','active','focus'],
  sql: ['SELECT','FROM','WHERE','INSERT','INTO','VALUES','CREATE','TABLE','ALTER','DROP','INDEX','JOIN','LEFT','RIGHT','INNER','ON','GROUP','BY','ORDER','ASC','DESC','LIMIT','HAVING','UNION','PRIMARY','KEY','FOREIGN','REFERENCES','NOT','NULL','DEFAULT','AUTO_INCREMENT','CURRENT_TIMESTAMP','UNIQUE','INTEGER','VARCHAR','TEXT'],
  cpp: ['include','iostream','using','namespace','int','float','double','char','bool','void','class','struct','public','private','protected','virtual','const','static','return','if','else','for','while','switch','case','break','continue','new','delete','try','catch','throw','auto','template','typename','vector','string','map','set','algorithm'],
};

function highlightCode(code: string, lang: string): string {
  let html = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Comments
  if (['javascript','typescript','cpp'].includes(lang)) {
    html = html.replace(/(\/\/.*$)/gm, '<span style="color:#6A9955">$1</span>');
    html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#6A9955">$1</span>');
  }
  if (['python'].includes(lang)) {
    html = html.replace(/(#.*$)/gm, '<span style="color:#6A9955">$1</span>');
  }
  if (['sql'].includes(lang)) {
    html = html.replace(/(--.*$)/gm, '<span style="color:#6A9955">$1</span>');
  }
  // Strings
  html = html.replace(/(`[^`]*`)/g, '<span style="color:#CE9178">$1</span>');
  html = html.replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#CE9178">$1</span>');
  html = html.replace(/('(?:[^'\\]|\\.)*')/g, '<span style="color:#CE9178">$1</span>');
  // Numbers
  html = html.replace(/\b(\d+\.?\d*)\b/g, '<span style="color:#B5CEA8">$1</span>');
  // Keywords
  const kw = KEYWORDS[lang] || [];
  for (const word of kw) {
    const re = new RegExp(`\\b(${word})\\b`, 'g');
    html = html.replace(re, '<span style="color:#569CD6">$1</span>');
  }
  return html;
}

export default function CodeEditor({ windowId: _windowId }: CodeEditorProps) {
  const [code, setCode] = useState(LANGUAGE_SAMPLES.javascript);
  const [language, setLanguage] = useState('javascript');
  const [fileName, setFileName] = useState('untitled.js');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);

  const lines = code.split('\n').length;

  useEffect(() => {
    if (LANGUAGE_SAMPLES[language]) {
      setCode(LANGUAGE_SAMPLES[language]);
    }
  }, [language]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  }, []);

  const handleCopy = () => { navigator.clipboard.writeText(code); };
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = fileName;
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      <div className="flex items-center gap-1 px-3 py-1.5 border-b flex-wrap" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button onClick={() => { setCode(''); setFileName('untitled.js'); }} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="New"><FilePlus size={14} /></button>
        <button onClick={handleCopy} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Copy"><Copy size={14} /></button>
        <button onClick={handleDownload} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Download"><Download size={14} /></button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="h-7 px-2 text-xs rounded outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}>
          {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
        <div className="flex-1" />
        <span className="text-[10px] text-[var(--text-muted)]">{fileName}</span>
      </div>
      <div className="flex-1 flex overflow-hidden relative">
        <div className="w-10 py-2 text-right pr-2 select-none overflow-hidden text-xs" style={{ background: '#1e1e1e', color: '#858585', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.6' }}>
          {Array.from({ length: Math.max(lines, 1) }, (_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        <div className="flex-1 relative overflow-hidden" style={{ background: '#1e1e1e' }}>
          <pre ref={highlightRef} className="absolute inset-0 p-3 text-sm overflow-hidden pointer-events-none" style={{ fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.6', color: '#d4d4d4', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
            dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }} />
          <textarea ref={textareaRef} value={code} onChange={(e) => setCode(e.target.value)} onScroll={handleScroll}
            className="absolute inset-0 p-3 text-sm resize-none outline-none bg-transparent" style={{ fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.6', color: 'transparent', caretColor: '#d4d4d4', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
            spellCheck={false} />
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{language}</span>
        <span>{lines} lines | {code.length} chars</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
