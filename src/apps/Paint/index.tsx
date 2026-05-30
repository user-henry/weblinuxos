import { useState, useRef, useEffect, useCallback } from 'react';
import { Paintbrush, Eraser, Undo, Redo, Download, Trash2, Circle, Square, Minus, Pipette } from 'lucide-react';

interface PaintProps { windowId: string }

const COLORS = ['#000000','#FFFFFF','#E74C3C','#2ECC71','#3498DB','#F39C12','#9B59B6','#1ABC9C','#E67E22','#95A5A6',
  '#34495E','#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#7D8B96'];
const BRUSH_SIZES = [2, 4, 8, 12, 20];

export default function Paint({ windowId: _windowId }: PaintProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<'brush'|'eraser'|'rect'|'circle'|'line'>('brush');
  const [undoStack, setUndoStack] = useState<ImageData[]>([]);
  const [undoIndex, setUndoIndex] = useState(-1);

  const getCtx = () => canvasRef.current?.getContext('2d');

  const saveState = useCallback(() => {
    const ctx = getCtx();
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setUndoStack(prev => [...prev.slice(0, undoIndex + 1), imageData]);
    setUndoIndex(prev => prev + 1);
  }, [undoIndex]);

  const undo = () => {
    if (undoIndex < 0) return;
    const ctx = getCtx();
    if (!ctx) return;
    ctx.putImageData(undoStack[undoIndex - 1] || new ImageData(800, 600), 0, 0);
    setUndoIndex(prev => prev - 1);
  };

  const redo = () => {
    if (undoIndex >= undoStack.length - 2) return;
    const ctx = getCtx();
    if (!ctx) return;
    ctx.putImageData(undoStack[undoIndex + 2], 0, 0);
    setUndoIndex(prev => prev + 1);
  };

  const clear = () => {
    const ctx = getCtx();
    if (!ctx) return;
    saveState();
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
  };

  const exportImage = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = 'painting.png';
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const startDraw = (e: React.MouseEvent) => {
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = tool === 'eraser' ? '#FFFFFF' : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const ctx = getCtx();
    if (!ctx || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    if (isDrawing) saveState();
    setIsDrawing(false);
  };

  useEffect(() => {
    const ctx = getCtx();
    if (ctx) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 800, 600); saveState(); }
  }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b flex-wrap" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button onClick={() => setTool('brush')} className={`p-1.5 rounded ${tool === 'brush' ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'}`} title="Brush"><Paintbrush size={14} /></button>
        <button onClick={() => setTool('eraser')} className={`p-1.5 rounded ${tool === 'eraser' ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'}`} title="Eraser"><Eraser size={14} /></button>
        <button onClick={() => setTool('rect')} className={`p-1.5 rounded ${tool === 'rect' ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'}`} title="Rectangle"><Square size={14} /></button>
        <button onClick={() => setTool('circle')} className={`p-1.5 rounded ${tool === 'circle' ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'}`} title="Circle"><Circle size={14} /></button>
        <button onClick={() => setTool('line')} className={`p-1.5 rounded ${tool === 'line' ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'}`} title="Line"><Minus size={14} /></button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <button onClick={undo} disabled={undoIndex < 0} className="p-1.5 rounded hover:bg-[var(--bg-hover)] disabled:opacity-30"><Undo size={14} /></button>
        <button onClick={redo} disabled={undoIndex >= undoStack.length - 2} className="p-1.5 rounded hover:bg-[var(--bg-hover)] disabled:opacity-30"><Redo size={14} /></button>
        <button onClick={clear} className="p-1.5 rounded hover:bg-[var(--bg-hover)]"><Trash2 size={14} /></button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <div className="flex gap-1">
          {BRUSH_SIZES.map(s => (
            <button key={s} onClick={() => setBrushSize(s)} className={`w-6 h-6 rounded flex items-center justify-center ${brushSize === s ? 'ring-1' : ''}`}
              style={{ outlineColor: 'var(--accent-silver)' }}><div className="rounded-full" style={{ width: Math.min(s, 12), height: Math.min(s, 12), background: 'var(--text-primary)' }} /></button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex gap-1">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)} className="w-5 h-5 rounded transition-transform hover:scale-110"
              style={{ background: c, border: color === c ? '2px solid var(--accent-silver)' : '1px solid rgba(0,0,0,0.15)' }} />
          ))}
        </div>
        <button onClick={exportImage} className="ml-2 p-1.5 rounded hover:bg-[var(--bg-hover)]"><Download size={14} /></button>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4" style={{ background: '#E0E0E0' }}>
        <canvas ref={canvasRef} width={800} height={600}
          className="shadow-lg cursor-crosshair" style={{ background: '#FFFFFF' }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} />
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>Tool: {tool} | Size: {brushSize}px</span>
        <span>800 × 600</span>
      </div>
    </div>
  );
}
