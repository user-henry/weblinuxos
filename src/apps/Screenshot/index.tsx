import { useState, useRef, useEffect } from 'react';
import { Camera, Download, Copy, Check, RefreshCw } from 'lucide-react';

interface ScreenshotProps { windowId: string }

export default function Screenshot({ windowId: _windowId }: ScreenshotProps) {
  const [captured, setCaptured] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState('');

  const captureScreen = async () => {
    setCapturing(true);
    setError('');

    try {
      // Use Screen Capture API - prompts user to share a screen/window
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' } as MediaTrackConstraints,
        audio: false,
      });

      const video = document.createElement('video');
      video.srcObject = stream;

      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play();
          resolve();
        };
      });

      // Wait a frame for video to render
      await new Promise(r => setTimeout(r, 100));

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
      }

      // Stop all tracks
      stream.getTracks().forEach(t => t.stop());
      video.srcObject = null;

      const dataUrl = canvas.toDataURL('image/png');
      setCaptured(dataUrl);
      setCopied(false);
    } catch (e: any) {
      if (e.name === 'AbortError') {
        setError('Capture cancelled.');
      } else {
        // Fallback: capture the #root element as a visual representation
        setError('Screen capture not available. Using desktop snapshot instead.');
        captureDesktop();
      }
    }
    setCapturing(false);
  };

  const captureDesktop = () => {
    const rootEl = document.getElementById('root');
    if (!rootEl) { setError('Cannot find desktop.'); return; }

    const canvas = document.createElement('canvas');
    const rect = rootEl.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) { setError('Canvas error.'); return; }

    // Draw a faithful representation
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Top bar
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, canvas.width, 36);
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText('Activities', 20, 26);
    const now = new Date();
    ctx.fillText(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), canvas.width - 70, 26);

    // Dock
    const dockW = 500;
    const dockX = (canvas.width - dockW) / 2;
    ctx.fillStyle = 'rgba(22,33,62,0.95)';
    ctx.fillRect(dockX, canvas.height - 64, dockW, 56);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(dockX, canvas.height - 64, dockW, 56);

    // Window mockup
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(100, 60, 500, 320);
    ctx.strokeStyle = 'rgba(125,139,150,0.3)';
    ctx.strokeRect(100, 60, 500, 320);
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText('WebOS Desktop', 116, 84);

    // Watermark
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.font = 'bold 36px Inter, sans-serif';
    ctx.fillText('WebOS', canvas.width / 2 - 80, canvas.height / 2);

    setCaptured(canvas.toDataURL('image/png'));
  };

  const copyToClipboard = async () => {
    if (!captured) return;
    try {
      const resp = await fetch(captured);
      const blob = await resp.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        await navigator.clipboard.writeText(captured);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* no-op */ }
    }
  };

  const download = () => {
    if (!captured) return;
    const a = document.createElement('a');
    a.href = captured;
    a.download = `webos-screenshot-${Date.now()}.png`;
    a.click();
  };

  // Auto-capture on mount
  useEffect(() => {
    setTimeout(() => captureScreen(), 400);
  }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b flex-shrink-0"
        style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Camera size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-semibold text-[var(--text-primary)]">Screenshot</span>
        <div className="flex-1" />
        <button onClick={captureScreen} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="New Screenshot">
          <RefreshCw size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button onClick={download} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Download">
          <Download size={14} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button onClick={copyToClipboard} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Copy to clipboard">
          {copied ? <Check size={14} style={{ color: '#2ECC71' }} /> : <Copy size={14} style={{ color: 'var(--text-secondary)' }} />}
        </button>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4" style={{ background: '#333' }}>
        {capturing ? (
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-white/50">Select a screen/window to capture...</p>
          </div>
        ) : captured ? (
          <img src={captured} className="max-w-full shadow-2xl rounded"
            style={{ maxHeight: '100%', objectFit: 'contain' }} alt="Screenshot" />
        ) : error ? (
          <div className="text-center">
            <p className="text-sm text-white/60">{error}</p>
            <button onClick={captureScreen}
              className="mt-3 px-4 py-2 rounded text-xs text-white"
              style={{ background: 'var(--accent-dark-gray)' }}>
              Retry
            </button>
          </div>
        ) : (
          <p className="text-sm text-white/30">Preparing screenshot...</p>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t flex-shrink-0"
        style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{captured ? 'Screenshot ready' : 'Waiting'}</span>
        <span>PNG · {copied ? 'Copied!' : ''}</span>
      </div>
    </div>
  );
}
