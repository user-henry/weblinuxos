import { useState } from 'react';
import { Presentation, Plus, Trash2, Play, ChevronLeft, ChevronRight, Save, FilePlus, Type, Image, Layout } from 'lucide-react';

interface PresentationProps { windowId: string }

interface Slide { id: number; title: string; content: string; layout: 'title' | 'content' | 'twoColumn'; }

const initialSlides: Slide[] = [
  { id: 1, title: 'Welcome to Presentations', content: 'Create beautiful slideshows\n\n• Click + to add slides\n• Use layouts for structure\n• Click Play to present', layout: 'title' },
  { id: 2, title: 'Key Features', content: 'Features:\n• Multiple slide layouts\n• Text formatting\n• Slide navigation\n• Full-screen presentation mode\n• Export capabilities', layout: 'content' },
  { id: 3, title: 'Getting Started', content: 'Left column content\n\n• Item one\n• Item two', layout: 'twoColumn' },
];

export default function PresentationApp({ windowId: _windowId }: PresentationProps) {
  const [slides, setSlides] = useState<Slide[]>(initialSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);

  const slide = slides[currentSlide];
  if (!slide) return null;

  const addSlide = () => {
    const newSlide: Slide = { id: Date.now(), title: 'New Slide', content: '', layout: 'content' };
    const newSlides = [...slides];
    newSlides.splice(currentSlide + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlide(currentSlide + 1);
  };

  const deleteSlide = () => {
    if (slides.length <= 1) return;
    const newSlides = slides.filter((_, i) => i !== currentSlide);
    setSlides(newSlides);
    setCurrentSlide(Math.min(currentSlide, newSlides.length - 1));
  };

  const updateSlide = (field: 'title' | 'content', value: string) => {
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...newSlides[currentSlide], [field]: value };
    setSlides(newSlides);
  };

  const changeLayout = (layout: 'title' | 'content' | 'twoColumn') => {
    const newSlides = [...slides];
    newSlides[currentSlide] = { ...newSlides[currentSlide], layout };
    setSlides(newSlides);
  };

  if (isPlaying) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center" style={{ background: 'var(--bg-workspace)' }}>
        <div className="flex-1 flex flex-col items-center justify-center w-full p-12">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-8">{slide.title}</h1>
          <div className="text-xl whitespace-pre-line text-[var(--text-secondary)]">{slide.content.split('\n\n').slice(0, 8).join('\n\n')}</div>
        </div>
        <div className="flex items-center gap-4 px-6 py-3" style={{ background: 'var(--bg-window)' }}>
          <span className="text-xs text-[var(--text-muted)]">{currentSlide + 1} / {slides.length}</span>
          <button onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))} className="p-2 rounded hover:bg-[var(--bg-hover)]"><ChevronLeft size={20} /></button>
          <button onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))} className="p-2 rounded hover:bg-[var(--bg-hover)]"><ChevronRight size={20} /></button>
          <button onClick={() => setIsPlaying(false)} className="px-4 py-1.5 rounded text-sm text-white" style={{ background: 'var(--accent-dark-gray)' }}>Exit</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex" style={{ background: 'var(--bg-workspace)' }}>
      {/* Slide thumbnails */}
      <div className="w-40 border-r overflow-y-auto" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="space-y-1 p-2">
          {slides.map((s, i) => (
            <button key={s.id} onClick={() => setCurrentSlide(i)}
              className={`w-full text-left p-2 rounded text-xs transition-colors ${i === currentSlide ? 'ring-2' : 'hover:bg-[var(--bg-hover)]'}`}
              style={{ outlineColor: i === currentSlide ? 'var(--accent-silver)' : 'transparent', background: i === currentSlide ? 'var(--bg-input)' : 'transparent', color: 'var(--text-primary)' }}>
              <div className="font-medium truncate">{s.title}</div>
              <div className="text-[10px] text-[var(--text-muted)] truncate">{s.layout}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1 px-2 py-1 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
          <button onClick={addSlide} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Add Slide"><Plus size={14} /></button>
          <button onClick={deleteSlide} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Delete Slide" disabled={slides.length <= 1}><Trash2 size={14} /></button>
          <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
          <button onClick={() => changeLayout('title')} className={`p-1.5 rounded hover:bg-[var(--bg-hover)] ${slide.layout === 'title' ? 'text-[var(--accent-silver)]' : ''}`} title="Title"><Type size={14} /></button>
          <button onClick={() => changeLayout('content')} className={`p-1.5 rounded hover:bg-[var(--bg-hover)] ${slide.layout === 'content' ? 'text-[var(--accent-silver)]' : ''}`} title="Content"><Layout size={14} /></button>
          <button onClick={() => changeLayout('twoColumn')} className={`p-1.5 rounded hover:bg-[var(--bg-hover)] ${slide.layout === 'twoColumn' ? 'text-[var(--accent-silver)]' : ''}`} title="Two Column"><Layout size={14} /></button>
          <div className="flex-1" />
          <button onClick={() => setIsPlaying(true)} className="flex items-center gap-1 px-3 py-1 rounded text-xs font-medium text-white" style={{ background: 'var(--accent-dark-gray)' }}>
            <Play size={12} />Present
          </button>
        </div>
        <div className="flex-1 flex flex-col p-6 items-center">
          <div className="w-full max-w-3xl flex-1 flex flex-col">
            <div className="mb-4">
              <input value={slide.title} onChange={(e) => updateSlide('title', e.target.value)}
                className="w-full text-2xl font-bold bg-transparent outline-none" style={{ color: 'var(--text-primary)' }}
                placeholder="Slide Title" />
            </div>
            <div className="flex-1">
              {slide.layout === 'twoColumn' ? (
                <div className="flex gap-4 h-full">
                  <textarea value={slide.content.split('\n\n')[0] || ''} onChange={(e) => { const parts = slide.content.split('\n\n'); parts[0] = e.target.value; updateSlide('content', parts.join('\n\n')); }}
                    className="flex-1 p-3 rounded resize-none outline-none text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }}
                    placeholder="Left column" />
                  <textarea value={slide.content.split('\n\n')[1] || ''} onChange={(e) => { const parts = slide.content.split('\n\n'); parts[1] = e.target.value; if (parts.length < 2) parts.push(''); updateSlide('content', parts.join('\n\n')); }}
                    className="flex-1 p-3 rounded resize-none outline-none text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }}
                    placeholder="Right column" />
                </div>
              ) : (
                <textarea value={slide.content} onChange={(e) => updateSlide('content', e.target.value)}
                  className="w-full flex-1 p-3 rounded resize-none outline-none text-sm" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }}
                  placeholder="Slide content..." />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
          <span>Slide {currentSlide + 1} of {slides.length}</span>
          <span>Layout: {slide.layout}</span>
        </div>
      </div>
    </div>
  );
}
