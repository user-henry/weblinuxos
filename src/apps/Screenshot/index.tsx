import { useState, useRef, useEffect } from 'react';
import { Camera, Download, Copy, Check, RefreshCw } from 'lucide-react';

interface ScreenshotProps { windowId: string }

export default function Screenshot({ windowId: _windowId }: ScreenshotProps) {
  const [captured, setCaptured] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const captureScreenshot = () => {
    // Create a mock screenshot canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 1920, 1080);

    // Top bar
    ctx.fillStyle = '#16213e';
    ctx.fillRect(0, 0, 1920, 36);
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '14px Inter';
    ctx.fillText('Activities', 20, 26);
    ctx.fillText('Sat 15:42', 1820, 26);

    // Desktop
    ctx.fillStyle = '#0f3460';
    ctx.fillRect(0, 36, 1920, 1008);

    // Dock
    ctx.fillStyle = '#16213e';
    ctx.fillRect(660, 950, 600, 56);
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 2;
    ctx.strokeRect(660, 950, 600, 56);

    // Window mockups
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(100, 100, 600, 400);
    ctx.strokeStyle = '#e94560';
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 100, 600, 400);
    ctx.fillStyle = '#e0e0e0';
    ctx.font = '16px Inter';
    ctx.fillText('Terminal', 120, 130);

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(750, 150, 500, 350);
    ctx.strokeStyle = '#533483';
    ctx.lineWidth = 1;
    ctx.strokeRect(750, 150, 500, 350);
    ctx.fillStyle = '#e0e0e0';
    ctx.fillText('File Manager', 770, 180);

    // Watermark
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.font = 'bold 48px Inter';
    ctx.fillText('WebOS Screenshot', 600, 540);

    const dataUrl = canvas.toDataURL('image/png');
    setCaptured(dataUrl);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    if (!captured) return;
    try { await navigator.clipboard.writeText(captured); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const download = () => {
    if (!captured) return;
    const a = document.createElement('a');
    a.href = captured;
    a.download = `webos-screenshot-${Date.now()}.png`;
    a.click();
  };

  useEffect(() => { captureScreenshot(); }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Camera size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-semibold text-[var(--text-primary)]">Screenshot</span>
        <div className="flex-1" />
        <button onClick={captureScreenshot} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="New Screenshot"><RefreshCw size={14} /></button>
        <button onClick={download} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Download"><Download size={14} /></button>
        <button onClick={copyToClipboard} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Copy">{copied ? <Check size={14} style={{ color: '#2ECC71' }} /> : <Copy size={14} />}</button>
      </div>

      {/* Preview */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4" style={{ background: '#333' }}>
        {captured && (
          <img src={captured} className="max-w-full shadow-2xl rounded" alt="Screenshot" style={{ maxHeight: '100%', objectFit: 'contain' }} />
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>1920 × 1080</span>
        <span>PNG</span>
        <span>{copied ? 'Copied!' : 'Ready'}</span>
      </div>
    </div>
  );
}
