import { useState } from 'react';
import { Globe, Send, Copy, Trash2, Plus } from 'lucide-react';

interface ApiClientProps { windowId: string }

interface Header { key: string; value: string; }

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export default function ApiClient({ windowId: _windowId }: ApiClientProps) {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://jsonplaceholder.typicode.com/posts/1');
  const [headers, setHeaders] = useState<Header[]>([{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addHeader = () => setHeaders([...headers, { key: '', value: '' }]);
  const removeHeader = (i: number) => setHeaders(headers.filter((_, idx) => idx !== i));
  const updateHeader = (i: number, field: 'key' | 'value', val: string) => {
    const newHeaders = [...headers];
    newHeaders[i][field] = val;
    setHeaders(newHeaders);
  };

  const handleSend = async () => {
    setLoading(true);
    setStatus(null);
    setResponse('');
    try {
      const headerObj: Record<string, string> = {};
      headers.filter(h => h.key.trim()).forEach(h => headerObj[h.key] = h.value);
      const opts: RequestInit = { method, headers: headerObj };
      if (['POST', 'PUT', 'PATCH'].includes(method) && body.trim()) {
        opts.body = body;
      }
      const res = await fetch(url, opts);
      setStatus(`${res.status} ${res.statusText}`);
      const text = await res.text();
      try { setResponse(JSON.stringify(JSON.parse(text), null, 2)); } catch { setResponse(text); }
    } catch (e: any) {
      setStatus('Error');
      setResponse(e.message || 'Network error');
    }
    setLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Request */}
      <div className="p-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="flex gap-2 mb-2">
          <select value={method} onChange={(e) => setMethod(e.target.value)}
            className="h-9 px-3 rounded text-xs font-bold outline-none" style={{ background: 'var(--bg-input)', color: 'var(--accent-silver)', border: '1px solid rgba(0,0,0,0.08)' }}>
            {METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter request URL..."
            className="flex-1 h-9 px-3 rounded text-xs outline-none font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }} />
          <button onClick={handleSend} disabled={loading} className="px-4 h-9 rounded text-xs font-medium text-white flex items-center gap-1.5" style={{ background: 'var(--accent-dark-gray)' }}>
            <Send size={14} />{loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {/* Headers */}
        <div className="space-y-1.5 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[var(--text-muted)]">Headers</span>
            <button onClick={addHeader} className="p-0.5 rounded hover:bg-[var(--bg-hover)]"><Plus size={12} /></button>
          </div>
          {headers.map((h, i) => (
            <div key={i} className="flex gap-1">
              <input value={h.key} onChange={(e) => updateHeader(i, 'key', e.target.value)} placeholder="Key"
                className="w-40 h-7 px-2 rounded text-xs outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }} />
              <input value={h.value} onChange={(e) => updateHeader(i, 'value', e.target.value)} placeholder="Value"
                className="flex-1 h-7 px-2 rounded text-xs outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }} />
              <button onClick={() => removeHeader(i)} className="p-1 rounded hover:bg-[var(--bg-hover)]"><Trash2 size={12} /></button>
            </div>
          ))}
        </div>

        {/* Body */}
        {['POST','PUT','PATCH'].includes(method) && (
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">Request Body</div>
            <textarea value={body} onChange={(e) => setBody(e.target.value)}
              className="w-full h-20 p-2 rounded text-xs outline-none resize-none font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }}
              placeholder='{"key": "value"}' />
          </div>
        )}
      </div>

      {/* Response */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)]">Response</span>
            {status && <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${status.startsWith('2') ? 'text-green-600' : status.startsWith('4') || status.startsWith('5') ? 'text-red-600' : ''}`} style={{ background: 'var(--bg-input)' }}>{status}</span>}
          </div>
          <button onClick={() => navigator.clipboard.writeText(response)} className="p-1 rounded hover:bg-[var(--bg-hover)]"><Copy size={14} /></button>
        </div>
        <pre className="flex-1 overflow-y-auto p-3 text-xs font-mono" style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{response || 'Send a request to see the response...'}</pre>
      </div>
    </div>
  );
}
