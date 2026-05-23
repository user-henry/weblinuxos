import { useState, useCallback, useRef } from 'react';
import { Globe, ChevronLeft, ChevronRight, RefreshCw, Home, ExternalLink, Shield } from 'lucide-react';

interface BrowserProps { windowId: string }

const DEFAULT_HOME = 'https://en.wikipedia.org/wiki/Web_operating_system';
const SEARCH_ENGINE = 'https://www.google.com/search?igu=1&q=';

export default function Browser({ windowId: _windowId }: BrowserProps) {
  const [url, setUrl] = useState(DEFAULT_HOME);
  const [inputUrl, setInputUrl] = useState(DEFAULT_HOME);
  const [history, setHistory] = useState<string[]>([DEFAULT_HOME]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isValidUrl = (str: string): string => {
    if (/^https?:\/\//i.test(str)) return str;
    if (/^[\w-]+\.[\w-]+/.test(str)) return `https://${str}`;
    return `${SEARCH_ENGINE}${encodeURIComponent(str)}`;
  };

  const navigate = useCallback((targetUrl: string) => {
    const validUrl = isValidUrl(targetUrl);
    const cleanInput = targetUrl.startsWith('http') ? targetUrl : targetUrl;
    setLoading(true);
    setError(null);
    setUrl(validUrl);
    setInputUrl(cleanInput);
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      return [...newHistory, validUrl];
    });
    setHistoryIndex(prev => {
      const newIndex = prev + 1;
      return newIndex;
    });
    setTimeout(() => setLoading(false), 800);
  }, [historyIndex]);

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setLoading(true);
      setError(null);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setHistoryIndex(newIndex);
      setTimeout(() => setLoading(false), 400);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setLoading(true);
      setError(null);
      setUrl(history[newIndex]);
      setInputUrl(history[newIndex]);
      setHistoryIndex(newIndex);
      setTimeout(() => setLoading(false), 400);
    }
  };

  const refresh = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.src = iframeRef.current.src;
      }
      setLoading(false);
    }, 300);
  };

  const goHome = () => {
    navigate(DEFAULT_HOME);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      navigate(inputUrl);
    }
  };

  const handleIframeError = () => {
    setError('This page cannot be displayed due to cross-origin restrictions. Most external sites block embedding in iframes.');
    setLoading(false);
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Navigation bar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button
          onClick={goBack}
          disabled={historyIndex <= 0}
          className="p-1.5 rounded transition-colors disabled:opacity-30 hover:bg-[var(--bg-hover)]"
          title="Back"
        >
          <ChevronLeft size={16} style={{ color: 'var(--text-primary)' }} />
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex >= history.length - 1}
          className="p-1.5 rounded transition-colors disabled:opacity-30 hover:bg-[var(--bg-hover)]"
          title="Forward"
        >
          <ChevronRight size={16} style={{ color: 'var(--text-primary)' }} />
        </button>
        <button onClick={refresh} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Refresh">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} style={{ color: 'var(--text-primary)' }} />
        </button>
        <button onClick={goHome} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Home">
          <Home size={14} style={{ color: 'var(--text-primary)' }} />
        </button>

        {/* URL bar */}
        <div className="flex-1 flex items-center gap-2 px-3 py-1 rounded-lg mx-1" style={{ background: 'var(--bg-input)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Globe size={14} style={{ color: 'var(--accent-silver)' }} />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm bg-transparent outline-none"
            style={{ color: 'var(--text-primary)' }}
            placeholder="Search or enter URL..."
          />
          {inputUrl && (
            <button onClick={() => { setInputUrl(''); }} className="text-xs" style={{ color: 'var(--text-muted)' }}>
              ✕
            </button>
          )}
        </div>

        <button
          onClick={() => window.open(url, '_blank')}
          className="p-1.5 rounded hover:bg-[var(--bg-hover)]"
          title="Open in new tab"
        >
          <ExternalLink size={14} style={{ color: 'var(--text-primary)' }} />
        </button>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="h-0.5 w-full relative overflow-hidden">
          <div className="absolute inset-y-0 animate-pulse" style={{ background: 'var(--accent-silver)', width: '60%' }} />
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 relative" style={{ background: '#FFFFFF' }}>
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6" style={{ background: 'var(--bg-workspace)' }}>
            <Shield size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Cannot Display Page</h3>
            <p className="text-xs text-center max-w-md mb-4" style={{ color: 'var(--text-muted)' }}>
              {error}
            </p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
              Try: <button onClick={goHome} className="hover:underline" style={{ color: 'var(--accent-silver)' }}>Go to Home</button>
              {' '}|{' '}
              <button onClick={() => window.open(url, '_blank')} className="hover:underline" style={{ color: 'var(--accent-silver)' }}>Open in External Browser</button>
            </p>
            <button
              onClick={() => { setError(null); setLoading(true); setTimeout(() => setLoading(false), 200); }}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white"
              style={{ background: 'var(--accent-dark-gray)' }}
            >
              Try Again
            </button>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={url}
            className="w-full h-full"
            style={{ border: 'none' }}
            title="Web Browser"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onError={handleIframeError}
            onLoad={() => setLoading(false)}
          />
        )}
      </div>

      {/* Status bar */}
      <div className="flex items-center gap-4 px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span className="flex items-center gap-1"><Globe size={10} />{loading ? 'Loading...' : 'Ready'}</span>
        <span className="truncate flex-1">{url}</span>
      </div>
    </div>
  );
}
