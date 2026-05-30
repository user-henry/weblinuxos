import { useState, useRef } from 'react';
import { Play, PlayCircle, Pause, Volume2, Maximize, SkipBack, SkipForward } from 'lucide-react';

interface VideoPlayerProps { windowId: string }

export default function VideoPlayer({ windowId: _windowId }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [duration, setDuration] = useState('3:45');
  const intervalRef = useRef<number>(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setProgress(p => { if (p >= 100) { setIsPlaying(false); return 100; } return p + 0.15; });
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const formatProgress = (p: number) => {
    const totalSec = 225; // 3:45
    const currentSec = Math.floor((p / 100) * totalSec);
    return `${Math.floor(currentSec / 60)}:${String(currentSec % 60).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#000' }}>
      {/* Video area */}
      <div className="flex-1 flex items-center justify-center relative" style={{ background: '#111' }}>
        <div className="text-center">
          <PlayCircle size={64} className="text-white/30 mx-auto mb-4" />
          <p className="text-sm text-white/50">Video playback simulation</p>
          <p className="text-xs text-white/30 mt-2">Drag & drop a video file to play</p>
        </div>
        {/* Progress bar (absolute) */}
        <div className="absolute bottom-0 left-0 right-0 h-1 cursor-pointer" style={{ background: 'rgba(255,255,255,0.1)' }}
          onClick={(e) => { const rect = (e.target as HTMLElement).getBoundingClientRect(); setProgress(((e.clientX - rect.left) / rect.width) * 100); }}>
          <div className="h-1" style={{ background: 'var(--accent-silver)', width: `${progress}%` }} />
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-2" style={{ background: '#1a1a1a' }}>
        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-white/80 hover:text-white">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <div className="flex items-center gap-2 flex-1">
            <span className="text-[11px] text-white/60 font-mono min-w-[36px]">{formatProgress(progress)}</span>
            <div className="flex-1 h-1 rounded-full cursor-pointer relative" style={{ background: 'rgba(255,255,255,0.15)' }}
              onClick={(e) => { const rect = (e.currentTarget).getBoundingClientRect(); setProgress(((e.clientX - rect.left) / rect.width) * 100); }}>
              <div className="h-1 rounded-full" style={{ background: 'var(--accent-silver)', width: `${progress}%` }} />
            </div>
            <span className="text-[11px] text-white/60 font-mono">{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Volume2 size={16} className="text-white/60" />
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 h-1 accent-[var(--accent-silver)]" />
          </div>
          <button className="text-white/60 hover:text-white"><Maximize size={16} /></button>
        </div>
      </div>
    </div>
  );
}
