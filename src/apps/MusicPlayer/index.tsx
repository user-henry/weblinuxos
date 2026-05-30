import { useState, useRef, useEffect } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, ListMusic, Heart } from 'lucide-react';

interface MusicPlayerProps { windowId: string }

interface Track { id: number; title: string; artist: string; album: string; duration: string; cover: string; }

const tracks: Track[] = [
  { id: 1, title: 'Ambient Waves', artist: 'WebOS Sound', album: 'Nature Collection', duration: '3:42', cover: '' },
  { id: 2, title: 'Digital Sunset', artist: 'Synth Dreams', album: 'Electronic Vibes', duration: '4:15', cover: '' },
  { id: 3, title: 'Mountain Path', artist: 'Acoustic Soul', album: 'Travel Tunes', duration: '3:28', cover: '' },
  { id: 4, title: 'City Lights', artist: 'Night Owl', album: 'Urban Beats', duration: '4:02', cover: '' },
  { id: 5, title: 'Ocean Breeze', artist: 'WebOS Sound', album: 'Nature Collection', duration: '5:10', cover: '' },
  { id: 6, title: 'Starlight', artist: 'Synth Dreams', album: 'Electronic Vibes', duration: '3:55', cover: '' },
  { id: 7, title: 'Morning Coffee', artist: 'Acoustic Soul', album: 'Travel Tunes', duration: '2:48', cover: '' },
];

export default function MusicPlayer({ windowId: _windowId }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [progress, setProgress] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const intervalRef = useRef<number>(0);

  const track = tracks[currentTrack];

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            handleNext();
            return 0;
          }
          return p + 0.5;
        });
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, currentTrack]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handlePrev = () => {
    setProgress(0);
    if (shuffle) setCurrentTrack(Math.floor(Math.random() * tracks.length));
    else setCurrentTrack((currentTrack - 1 + tracks.length) % tracks.length);
  };

  const handleNext = () => {
    setProgress(0);
    if (shuffle) setCurrentTrack(Math.floor(Math.random() * tracks.length));
    else if (repeat) setCurrentTrack(currentTrack);
    else setCurrentTrack((currentTrack + 1) % tracks.length);
  };

  const toggleLike = (id: number) => {
    setLiked(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const formatProgress = (p: number) => {
    const totalSec = parseFloat(track.duration.split(':')[0]) * 60 + parseFloat(track.duration.split(':')[1]);
    const currentSec = Math.floor((p / 100) * totalSec);
    return `${Math.floor(currentSec / 60)}:${String(currentSec % 60).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Now Playing */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-40 h-40 rounded-2xl mb-6 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--accent-silver), var(--accent-dark-gray))', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <Music size={56} className="text-white/80" />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] text-center">{track.title}</h2>
        <p className="text-sm text-[var(--text-muted)] text-center mt-1">{track.artist}</p>
        <p className="text-xs text-[var(--text-muted)]">{track.album}</p>
      </div>

      {/* Progress */}
      <div className="px-6 mb-2">
        <div className="h-1 rounded-full relative cursor-pointer" style={{ background: 'var(--bg-input)' }} onClick={(e) => {
          const rect = (e.target as HTMLElement).getBoundingClientRect();
          setProgress(((e.clientX - rect.left) / rect.width) * 100);
        }}>
          <div className="h-1 rounded-full" style={{ background: 'var(--accent-silver)', width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          <span>{formatProgress(progress)}</span>
          <span>{track.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-6 pb-2">
        <button onClick={() => setShuffle(!shuffle)} className={`p-1.5 rounded ${shuffle ? 'text-[var(--accent-silver)]' : ''}`} style={{ color: shuffle ? 'var(--accent-silver)' : 'var(--text-muted)' }}><Shuffle size={16} /></button>
        <button onClick={handlePrev} className="p-2 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-primary)' }}><SkipBack size={20} /></button>
        <button onClick={togglePlay} className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ background: 'var(--accent-dark-gray)' }}>
          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
        </button>
        <button onClick={handleNext} className="p-2 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-primary)' }}><SkipForward size={20} /></button>
        <button onClick={() => setRepeat(!repeat)} className={`p-1.5 rounded ${repeat ? 'text-[var(--accent-silver)]' : ''}`} style={{ color: repeat ? 'var(--accent-silver)' : 'var(--text-muted)' }}><Repeat size={16} /></button>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 px-6 pb-2">
        <Volume2 size={14} style={{ color: 'var(--text-muted)' }} />
        <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1 accent-[var(--accent-silver)]" />
      </div>

      {/* Playlist */}
      <div className="border-t overflow-y-auto" style={{ borderColor: 'rgba(0,0,0,0.06)', maxHeight: 180 }}>
        {tracks.map((t, i) => (
          <button key={t.id} onClick={() => { setCurrentTrack(i); setProgress(0); setIsPlaying(true); }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-[var(--bg-hover)] ${i === currentTrack ? 'font-medium' : ''}`}
            style={{ color: i === currentTrack ? 'var(--accent-silver)' : 'var(--text-primary)', background: i === currentTrack ? 'var(--bg-window)' : 'transparent' }}>
            <span className="w-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>{i === currentTrack && isPlaying ? '▶' : i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs truncate">{t.title}</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{t.artist}</div>
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{t.duration}</span>
            <button onClick={(e) => { e.stopPropagation(); toggleLike(t.id); }} className="p-1">
              <Heart size={12} fill={liked.has(t.id) ? '#E74C3C' : 'none'} color={liked.has(t.id) ? '#E74C3C' : 'var(--text-muted)'} />
            </button>
          </button>
        ))}
      </div>

      <div className="px-4 py-1 text-[10px] border-t text-center" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        {tracks.length} tracks | WebOS Music Player
      </div>
    </div>
  );
}
