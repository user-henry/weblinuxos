import { useState, useRef, useEffect } from 'react';
import { Palette, Copy } from 'lucide-react';

interface ColorPickerProps { windowId: string }

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => { const k = (n + h / 30) % 12; return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1); };
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

function hexToHsl(hex: string): [number, number, number] {
  let r = 0, g = 0, b = 0;
  if (hex.length === 7) {
    r = parseInt(hex.slice(1, 3), 16) / 255;
    g = parseInt(hex.slice(3, 5), 16) / 255;
    b = parseInt(hex.slice(5, 7), 16) / 255;
  }
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
      case g: h = ((b - r) / d + 2) * 60; break;
      case b: h = ((r - g) / d + 4) * 60; break;
    }
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

export default function ColorPicker({ windowId: _windowId }: ColorPickerProps) {
  const [hex, setHex] = useState('#7D8B96');
  const [hsl, setHsl] = useState<[number, number, number]>([205, 8, 54]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueRef = useRef<HTMLCanvasElement>(null);
  const [savedColors, setSavedColors] = useState<string[]>(['#7D8B96','#4A90D9','#E74C3C','#2ECC71','#F39C12','#9B59B6','#1ABC9C']);

  const updateFromHex = (val: string) => {
    setHex(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) setHsl(hexToHsl(val));
  };

  const drawSaturationCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const s = (x / w) * 100;
        const l = 100 - (y / h) * 100;
        ctx.fillStyle = `hsl(${hsl[0]}, ${s}%, ${l}%)`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
    // Cursor
    const cx = (hsl[1] / 100) * w;
    const cy = ((100 - hsl[2]) / 100) * h;
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.stroke();
  };

  const drawHueCanvas = () => {
    const canvas = hueRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    for (let y = 0; y < h; y++) {
      const hue = (y / h) * 360;
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(0, y, w, 1);
    }
    const cy = (hsl[0] / 360) * h;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, cy - 4, w, 8);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, cy - 4, w, 8);
  };

  useEffect(() => { drawSaturationCanvas(); drawHueCanvas(); }, [hsl]);

  const handleSaturationClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const s = Math.round((x / canvas.width) * 100);
    const l = Math.round(100 - (y / canvas.height) * 100);
    const newHsl: [number, number, number] = [hsl[0], s, l];
    setHsl(newHsl);
    setHex(hslToHex(newHsl[0], newHsl[1], newHsl[2]));
  };

  const handleHueClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = hueRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const h = Math.round((y / canvas.height) * 360);
    const newHsl: [number, number, number] = [h, hsl[1], hsl[2]];
    setHsl(newHsl);
    setHex(hslToHex(newHsl[0], newHsl[1], newHsl[2]));
  };

  const rgb = [parseInt(hex.slice(1,3),16), parseInt(hex.slice(3,5),16), parseInt(hex.slice(5,7),16)];

  return (
    <div className="w-full h-full flex flex-col p-4" style={{ background: 'var(--bg-workspace)' }}>
      <div className="flex gap-4 flex-1">
        {/* Saturation/Lightness */}
        <canvas ref={canvasRef} width={240} height={200} onClick={handleSaturationClick}
          className="rounded-lg cursor-crosshair" style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
        {/* Hue */}
        <canvas ref={hueRef} width={24} height={200} onClick={handleHueClick}
          className="rounded-lg cursor-pointer" style={{ border: '1px solid rgba(0,0,0,0.08)' }} />
        {/* Preview & Info */}
        <div className="flex-1 flex flex-col gap-3">
          <div className="w-full h-16 rounded-lg" style={{ border: '1px solid rgba(0,0,0,0.08)', background: hex }} />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs w-8 text-[var(--text-muted)]">HEX</span>
              <input value={hex} onChange={(e) => updateFromHex(e.target.value)}
                className="flex-1 h-7 px-2 rounded text-xs font-mono outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-8 text-[var(--text-muted)]">RGB</span>
              <input value={`rgb(${rgb.join(', ')})`} readOnly
                className="flex-1 h-7 px-2 rounded text-xs font-mono outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs w-8 text-[var(--text-muted)]">HSL</span>
              <input value={`hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`} readOnly
                className="flex-1 h-7 px-2 rounded text-xs font-mono outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Saved colors */}
      <div className="mt-3">
        <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-2">Saved Colors</div>
        <div className="flex gap-2 flex-wrap">
          {savedColors.map((c, i) => (
            <button key={i} onClick={() => updateFromHex(c)}
              className="w-8 h-8 rounded-lg transition-transform hover:scale-110" style={{ background: c, border: c === hex ? '2px solid var(--accent-silver)' : '1px solid rgba(0,0,0,0.12)' }} />
          ))}
          <button onClick={() => { if (!savedColors.includes(hex)) setSavedColors([hex, ...savedColors]); }}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs" style={{ border: '1px dashed rgba(0,0,0,0.2)', color: 'var(--text-muted)' }}>+</button>
        </div>
      </div>
    </div>
  );
}
