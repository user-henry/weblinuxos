import { useState } from 'react';
import { Shapes, Download, Copy, Grid3x3, RefreshCw } from 'lucide-react';

interface IconMakerProps { windowId: string }

const SHAPES = ['circle','square','rounded','diamond','hexagon'];

const COLORS = ['#E74C3C','#2ECC71','#3498DB','#F39C12','#9B59B6','#1ABC9C','#E67E22','#34495E','#7D8B96',
  '#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#7D8B96','#FFFFFF','#000000'];

export default function IconMaker({ windowId: _windowId }: IconMakerProps) {
  const [shape, setShape] = useState('rounded');
  const [bgColor, setBgColor] = useState('#7D8B96');
  const [fgColor, setFgColor] = useState('#FFFFFF');
  const [iconText, setIconText] = useState('A');
  const [size, setSize] = useState(128);
  const [borderRadius, setBorderRadius] = useState(24);
  const [shadow, setShadow] = useState(true);

  const canvasRef = (el: HTMLCanvasElement | null) => {
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    el.width = size; el.height = size;
    ctx.clearRect(0, 0, size, size);

    // Background
    ctx.fillStyle = bgColor;
    ctx.beginPath();
    const pad = 4;
    switch (shape) {
      case 'circle': ctx.arc(size/2, size/2, size/2-pad, 0, Math.PI*2); break;
      case 'square': ctx.roundRect(pad, pad, size-pad*2, size-pad*2, 0); break;
      case 'rounded': ctx.roundRect(pad, pad, size-pad*2, size-pad*2, borderRadius); break;
      case 'diamond':
        ctx.moveTo(size/2, pad); ctx.lineTo(size-pad, size/2);
        ctx.lineTo(size/2, size-pad); ctx.lineTo(pad, size/2); ctx.closePath(); break;
      case 'hexagon':
        for (let i = 0; i < 6; i++) {
          const angle = Math.PI/6 + (Math.PI/3)*i;
          const r = size/2 - pad;
          const x = size/2 + r*Math.cos(angle);
          const y = size/2 + r*Math.sin(angle);
          if (i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
        } ctx.closePath(); break;
    }
    ctx.fill();

    // Shadow
    if (shadow) { ctx.shadowColor = 'rgba(0,0,0,0.15)'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; }

    // Text/Icon
    ctx.fillStyle = fgColor;
    ctx.font = `bold ${size*0.45}px Inter, system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(iconText, size/2, size/2);
  };

  const exportIcon = () => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.download = `icon-${size}.png`;
    a.href = canvas.toDataURL();
    a.click();
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      <div className="flex items-center gap-1 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Shapes size={14} style={{ color: 'var(--accent-silver)' }} />
        <span className="text-xs font-semibold text-[var(--text-primary)]">Icon Maker</span>
        <div className="flex-1" />
        <button onClick={exportIcon} className="p-1.5 rounded hover:bg-[var(--bg-hover)]"><Download size={14} /></button>
        <button onClick={() => { setIconText(String.fromCharCode(65+Math.floor(Math.random()*26))); setBgColor(COLORS[Math.floor(Math.random()*COLORS.length)]); }}
          className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Random"><RefreshCw size={14} /></button>
      </div>

      <div className="flex-1 flex">
        {/* Preview */}
        <div className="flex-1 flex items-center justify-center" style={{ background: 'repeating-conic-gradient(#E0E0E0 0% 25%, white 0% 50%) 50% / 20px 20px' }}>
          <canvas ref={canvasRef} className="shadow-lg rounded-lg" />
        </div>

        {/* Controls */}
        <div className="w-56 border-l p-3 overflow-y-auto space-y-3" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
          {/* Shape */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5">Shape</div>
            <div className="flex gap-1 flex-wrap">
              {SHAPES.map(s => (
                <button key={s} onClick={() => setShape(s)}
                  className={`px-2 py-1 rounded text-[10px] capitalize ${shape === s ? 'text-white' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'}`}
                  style={shape === s ? { background: 'var(--accent-dark-gray)' } : {}}>{s}</button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5">Background</div>
            <div className="flex gap-1 flex-wrap">
              {COLORS.map(c => (
                <button key={c} onClick={() => setBgColor(c)} className="w-6 h-6 rounded transition-transform hover:scale-110"
                  style={{ background: c, border: bgColor === c ? '2px solid var(--accent-silver)' : '1px solid rgba(0,0,0,0.12)' }} />
              ))}
            </div>
          </div>

          {/* Foreground */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5">Foreground</div>
            <div className="flex gap-1 flex-wrap">
              {COLORS.slice(0, 12).map(c => (
                <button key={c} onClick={() => setFgColor(c)} className="w-6 h-6 rounded transition-transform hover:scale-110"
                  style={{ background: c, border: fgColor === c ? '2px solid var(--accent-silver)' : '1px solid rgba(0,0,0,0.12)' }} />
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5">Text</div>
            <input value={iconText} onChange={(e) => setIconText(e.target.value.slice(0, 2))} maxLength={2}
              className="w-full h-8 px-3 rounded text-sm font-bold text-center outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }} />
          </div>

          {/* Size */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5">Size: {size}px</div>
            <input type="range" min={32} max={512} step={32} value={size} onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-1 accent-[var(--accent-silver)]" />
          </div>

          {/* Border Radius */}
          <div>
            <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1.5">Radius: {borderRadius}px</div>
            <input type="range" min={0} max={size/2} value={borderRadius} onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full h-1 accent-[var(--accent-silver)]" />
          </div>

          {/* Shadow toggle */}
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={shadow} onChange={(e) => setShadow(e.target.checked)} className="accent-[var(--accent-silver)]" />
            <span className="text-[11px] text-[var(--text-muted)]">Shadow</span>
          </div>
        </div>
      </div>

      <div className="px-3 py-1 text-[10px] text-center border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        {size} × {size}px icon
      </div>
    </div>
  );
}
