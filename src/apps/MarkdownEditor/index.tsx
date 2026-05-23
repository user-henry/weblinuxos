import { useState, useRef, useEffect, useCallback } from 'react';
import { FilePlus, FolderOpen, Save, Eye, Code2, Bold, Italic, List, Link2, Image, Heading1 } from 'lucide-react';
import { useFileSystemStore } from '@/stores/useFileSystemStore';

// ============ Minimal Markdown → HTML Renderer ============
function renderMarkdown(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Code blocks (fenced)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, lang, code) =>
    `<pre class="markdown-pre"><code class="language-${lang || 'text'}">${code.trim()}</code></pre>`);
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="markdown-code">$1</code>');
  // Headers
  html = html.replace(/^#### (.+)$/gm, '<h4 class="markdown-h4">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 class="markdown-h3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="markdown-h2">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="markdown-h1">$1</h1>');
  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');
  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="markdown-img" />');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="markdown-link">$1</a>');
  // Horizontal rules
  html = html.replace(/^(---|\*\*\*|___)\s*$/gm, '<hr class="markdown-hr" />');
  // Blockquotes
  html = html.replace(/^&gt; (.+)$/gm, '<blockquote class="markdown-blockquote"><p>$1</p></blockquote>');
  // Unordered lists
  html = html.replace(/^[\*\-] (.+)$/gm, '<li class="markdown-li">$1</li>');
  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="markdown-ul">$1</ul>');
  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="markdown-li-ol">$1</li>');
  html = html.replace(/((?:<li class="markdown-li-ol"[^>]*>.*?<\/li>\s*)+)/g, '<ol class="markdown-ol">$1</ol>');
  // Paragraphs (wrap remaining non-tag lines)
  html = html.replace(/^(?!<(?:h[1-4]|pre|ul|ol|li|blockquote|hr|p|img|code|a|strong|em|del)\b)(.+)$/gm, '<p class="markdown-p">$1</p>');
  return html;
}

interface MarkdownEditorProps { windowId: string }

export default function MarkdownEditor({ windowId: _windowId }: MarkdownEditorProps) {
  const [content, setContent] = useState(`# Welcome to Markdown Editor

## Features
- **Bold**, *Italic*, ~~Strikethrough~~
- \`Inline code\`
- [Links](https://example.com)
- Lists and headings

### Code Example
\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> A blockquote example

Start writing your markdown...`);
  const [fileName, setFileName] = useState('document.md');
  const [preview, setPreview] = useState(false);
  const [currentFileId, setCurrentFileId] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const readFile = useFileSystemStore((s) => s.readFile);
  const writeFile = useFileSystemStore((s) => s.writeFile);
  const createFile = useFileSystemStore((s) => s.createFile);
  const currentDirectory = useFileSystemStore((s) => s.currentDirectory);
  const getChildren = useFileSystemStore((s) => s.getChildren);
  const nodes = useFileSystemStore((s) => s.nodes);

  useEffect(() => {
    const pending = (window as any).__pendingFileOpen;
    if (pending && pending.appId === 'markdownviewer') {
      const node = nodes.find((n: any) => n.id === pending.fileId);
      if (node && node.type === 'file') {
        const data = readFile(pending.fileId);
        setContent(data || '');
        setFileName(pending.fileName || node.name);
        setCurrentFileId(pending.fileId);
      }
      (window as any).__pendingFileOpen = null;
    }
  }, [nodes, readFile]);

  const htmlContent = renderMarkdown(content);
  const lines = content.split('\n').length;

  const insertMarkdown = useCallback((syntax: string, placeholder: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = content.slice(0, start);
    const selected = content.slice(start, end) || placeholder;
    const after = content.slice(end);
    const newContent = before + syntax.replace('$1', selected) + after;
    setContent(newContent);
    requestAnimationFrame(() => {
      ta.focus();
      ta.selectionStart = start + syntax.indexOf('$1');
      ta.selectionEnd = ta.selectionStart + selected.length;
    });
  }, [content]);

  const handleSave = () => {
    if (currentFileId) {
      writeFile(currentFileId, content);
    } else {
      setSaveName(fileName);
      setShowSaveDialog(true);
    }
  };

  const handleSaveAs = () => {
    if (!saveName.trim()) return;
    createFile(saveName, currentDirectory, content);
    setFileName(saveName);
    setCurrentFileId(null);
    setShowSaveDialog(false);
  };

  const handleNew = () => { setContent(''); setFileName('document.md'); setCurrentFileId(null); };

  return (
    <div className="w-full h-full flex flex-col text-sm" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b flex-wrap" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button onClick={handleNew} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="New"><FilePlus size={14} /></button>
        <button onClick={handleSave} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Save"><Save size={14} /></button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <button onClick={() => insertMarkdown('# $1', 'Heading')} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Heading"><Heading1 size={14} /></button>
        <button onClick={() => insertMarkdown('**$1**', 'bold')} className="p-1.5 rounded hover:bg-[var(--bg-hover)] font-bold" title="Bold"><Bold size={14} /></button>
        <button onClick={() => insertMarkdown('*$1*', 'italic')} className="p-1.5 rounded hover:bg-[var(--bg-hover)] italic" title="Italic"><Italic size={14} /></button>
        <button onClick={() => insertMarkdown('- $1', 'list item')} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="List"><List size={14} /></button>
        <button onClick={() => insertMarkdown('[$1](url)', 'link text')} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Link"><Link2 size={14} /></button>
        <button onClick={() => insertMarkdown('![$1](url)', 'alt text')} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Image"><Image size={14} /></button>
        <button onClick={() => insertMarkdown('`$1`', 'code')} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Inline Code"><Code2 size={14} /></button>
        <div className="flex-1" />
        <span className="text-[10px] text-[var(--text-muted)]">{fileName}</span>
        <button
          onClick={() => setPreview(!preview)}
          className={`p-1.5 rounded transition-colors ${preview ? 'text-[var(--accent-silver)]' : 'hover:bg-[var(--bg-hover)]'}`}
          title={preview ? 'Edit' : 'Preview'}
        >
          {preview ? <Code2 size={14} /> : <Eye size={14} />}
        </button>
      </div>

      {/* Editor / Preview */}
      <div className="flex-1 flex overflow-hidden">
        {!preview ? (
          <div className="flex-1 flex overflow-hidden">
            {/* Line numbers */}
            <div className="w-10 py-2 text-right pr-2 select-none overflow-hidden text-xs" style={{ background: 'var(--bg-window)', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.6' }}>
              {Array.from({ length: Math.max(lines, 1) }, (_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 p-3 outline-none resize-none font-mono text-sm leading-relaxed"
              style={{ background: 'var(--bg-workspace)', color: 'var(--text-primary)', fontFamily: "'JetBrains Mono', monospace", lineHeight: '1.6' }}
              spellCheck={false}
              placeholder="Write your markdown here..."
            />
          </div>
        ) : (
          <div
            className="flex-1 overflow-y-auto p-6 markdown-body"
            style={{ background: 'var(--bg-workspace)', color: 'var(--text-primary)' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between px-3 py-1 text-xs border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{lines} lines</span>
        <span>{content.length} chars</span>
        <span>{preview ? 'Preview' : 'Edit'}</span>
        <span>Markdown</span>
      </div>

      {/* Save As dialog */}
      {showSaveDialog && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-80 rounded-xl p-4" style={{ background: 'var(--bg-panel)', boxShadow: 'var(--shadow-lg)' }}>
            <h3 className="text-sm font-semibold mb-3">Save Markdown File</h3>
            <input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="filename.md" autoFocus className="w-full h-9 px-3 rounded text-sm outline-none mb-3" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }} />
            <div className="flex gap-2">
              <button onClick={() => setShowSaveDialog(false)} className="flex-1 py-2 rounded text-sm hover:bg-[var(--bg-hover)]" style={{ background: 'var(--bg-input)' }}>Cancel</button>
              <button onClick={handleSaveAs} className="flex-1 py-2 rounded text-sm text-white" style={{ background: 'var(--accent-dark-gray)' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
