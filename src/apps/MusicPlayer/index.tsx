import { useState, useRef, useEffect, useCallback } from 'react';
import { Music, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2, Heart, Upload } from 'lucide-react';

interface MusicPlayerProps { windowId: string }

interface Track { id: number; title: string; artist: string; album: string; duration: number; }

const BUILTIN_TRACKS: Track[] = [
  { id: 1, title: 'Ambient Waves', artist: 'WebOS Sound', album: 'Nature Collection', duration: 12 },
  { id: 2, title: 'Digital Sunset', artist: 'Synth Dreams', album: 'Electronic Vibes', duration: 10 },
  { id: 3, title: 'Mountain Path', artist: 'Acoustic Soul', album: 'Travel Tunes', duration: 8 },
  { id: 4, title: 'City Lights', artist: 'Night Owl', album: 'Urban Beats', duration: 11 },
  { id: 5, title: 'Ocean Breeze', artist: 'WebOS Sound', album: 'Nature Collection', duration: 14 },
  { id: 6, title: 'Starlight', artist: 'Synth Dreams', album: 'Electronic Vibes', duration: 9 },
  { id: 7, title: 'Morning Coffee', artist: 'Acoustic Soul', album: 'Travel Tunes', duration: 7 },
];

function generateToneBlob(freq: number, durationSec: number, waveType: OscillatorType): Promise<Blob> {
  const sampleRate = 44100;
  const length = sampleRate * durationSec;
  const ctx = new OfflineAudioContext(1, length, sampleRate);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = waveType;
  osc.frequency.setValueAtTime(freq, 0);
  gain.gain.setValueAtTime(0.3, 0);
  gain.gain.exponentialRampToValueAtTime(0.01, durationSec);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(0);
  osc.stop(durationSec);
  return ctx.startRendering().then((buffer) => {
    const wav = audioBufferToWav(buffer);
    return new Blob([wav], { type: 'audio/wav' });
  });
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitsPerSample = 16;
  const data = buffer.getChannelData(0);
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const dataSize = data.length * blockAlign;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  }

  writeString(0, 'RIFF');
  view.setUint32(4, totalSize - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
    offset += 2;
  }
  return arrayBuffer;
}

const NOTE_FREQS = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88];
const WAVE_TYPES: OscillatorType[] = ['sine', 'triangle', 'sawtooth', 'square'];

export default function MusicPlayer({ windowId: _windowId }: MusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [trackBlobs, setTrackBlobs] = useState<Record<number, string>>({});
  const [extFileUrl, setExtFileUrl] = useState<string | null>(null);
  const [extFileName, setExtFileName] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tracks = BUILTIN_TRACKS;

  // Generate blobs for built-in tracks on mount
  useEffect(() => {
    let cancelled = false;
    async function gen() {
      const blobs: Record<number, string> = {};
      for (let i = 0; i < tracks.length; i++) {
        if (cancelled) break;
        const blob = await generateToneBlob(
          NOTE_FREQS[i % NOTE_FREQS.length] * (1 + Math.floor(i / NOTE_FREQS.length) * 0.5),
          tracks[i].duration,
          WAVE_TYPES[i % WAVE_TYPES.length]
        );
        blobs[tracks[i].id] = URL.createObjectURL(blob);
      }
      if (!cancelled) setTrackBlobs(blobs);
    }
    gen();
    return () => { cancelled = true; };
  }, []);

  const getAudioSrc = useCallback((): string => {
    if (extFileUrl) return extFileUrl;
    return trackBlobs[tracks[currentTrack]?.id] || '';
  }, [extFileUrl, trackBlobs, currentTrack, tracks]);

  // Handle file open from file manager
  useEffect(() => {
    const pending = (window as any).__pendingMusicFile;
    if (pending) {
      delete (window as any).__pendingMusicFile;
      // For mock filesystem files, generate a tone
      const noteIdx = Math.abs(pending.fileName?.length || 0) % NOTE_FREQS.length;
      generateToneBlob(NOTE_FREQS[noteIdx], 15, 'triangle').then(blob => {
        const url = URL.createObjectURL(blob);
        setExtFileUrl(url);
        setExtFileName(pending.fileName || 'Unknown');
        setCurrentTime(0);
        setTimeout(() => {
          if (audioRef.current) audioRef.current.play().catch(() => {});
        }, 200);
      });
    }
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      if (repeatMode) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else if (extFileUrl) {
        setIsPlaying(false);
      } else {
        handleNext();
      }
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDuration);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDuration);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [repeatMode, extFileUrl, currentTrack]);

  // Set audio src
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const src = getAudioSrc();
    if (!src) return;
    const wasPlaying = !audio.paused;
    audio.src = src;
    if (wasPlaying) audio.play().catch(() => {});
  }, [getAudioSrc]);

  // Volume sync
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * duration;
  };

  const handlePrev = () => {
    setCurrentTime(0);
    if (shuffle) setCurrentTrack(Math.floor(Math.random() * tracks.length));
    else setCurrentTrack((currentTrack - 1 + tracks.length) % tracks.length);
  };

  const handleNext = () => {
    setCurrentTime(0);
    if (shuffle) setCurrentTrack(Math.floor(Math.random() * tracks.length));
    else setCurrentTrack((currentTrack + 1) % tracks.length);
  };

  const handleFileOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setExtFileUrl(url);
    setExtFileName(file.name);
    setCurrentTime(0);
    setTimeout(() => audioRef.current?.play().catch(() => {}), 100);
  };

  const clearExternalFile = () => {
    if (extFileUrl) URL.revokeObjectURL(extFileUrl);
    setExtFileUrl(null);
    setExtFileName('');
  };

  const toggleLike = (id: number) => {
    setLiked(prev => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };

  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const track = tracks[currentTrack];
  const displayTitle = extFileUrl ? extFileName : track?.title || '';
  const displayArtist = extFileUrl ? 'External File' : track?.artist || '';
  const displayDuration = extFileUrl ? (duration || 0) : track?.duration || 0;

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      <audio ref={audioRef} preload="auto" />
      <input ref={fileInputRef} type="file" accept="audio/*" onChange={handleFileOpen} className="hidden" />

      {/* Now Playing */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-40 h-40 rounded-2xl mb-6 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--accent-silver), var(--accent-dark-gray))', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <Music size={56} className="text-white/80" />
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] text-center truncate max-w-full px-2">{displayTitle}</h2>
        <p className="text-sm text-[var(--text-muted)] text-center mt-1">{displayArtist}</p>
      </div>

      {/* Progress */}
      <div className="px-6 mb-2">
        <div className="h-1 rounded-full relative cursor-pointer" style={{ background: 'var(--bg-input)' }} onClick={seek}>
          <div className="h-1 rounded-full" style={{ background: 'var(--accent-silver)', width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
        </div>
        <div className="flex justify-between text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          <span>{formatTime(currentTime)}</span>
          <span>{extFileUrl ? formatTime(duration) : formatTime(displayDuration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-6 pb-2">
        <button onClick={() => setShuffle(!shuffle)} style={{ color: shuffle ? 'var(--accent-silver)' : 'var(--text-muted)' }}>
          <Shuffle size={16} />
        </button>
        <button onClick={handlePrev} className="p-2 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-primary)' }}>
          <SkipBack size={20} />
        </button>
        <button onClick={togglePlay} className="w-12 h-12 rounded-full flex items-center justify-center text-white"
          style={{ background: 'var(--accent-dark-gray)' }}>
          {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
        </button>
        <button onClick={handleNext} className="p-2 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-primary)' }}>
          <SkipForward size={20} />
        </button>
        <button onClick={() => setRepeatMode(!repeatMode)} style={{ color: repeatMode ? 'var(--accent-silver)' : 'var(--text-muted)' }}>
          <Repeat size={16} />
        </button>
      </div>

      {/* Volume + File Open */}
      <div className="flex items-center gap-2 px-6 pb-2">
        <Volume2 size={14} style={{ color: 'var(--text-muted)' }} />
        <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))}
          className="flex-1 h-1 accent-[var(--accent-silver)]" />
        <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded hover:bg-[var(--bg-hover)]"
          title="Open audio file">
          <Upload size={14} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      {/* External file indicator */}
      {extFileUrl && (
        <div className="px-6 pb-1 text-center">
          <button onClick={clearExternalFile} className="text-[10px] underline" style={{ color: 'var(--accent-silver)' }}>
            Close external file — Back to playlist
          </button>
        </div>
      )}

      {/* Playlist */}
      <div className="border-t overflow-y-auto" style={{ borderColor: 'rgba(0,0,0,0.06)', maxHeight: 160 }}>
        {tracks.map((t, i) => (
          <button key={t.id}
            onClick={() => { setCurrentTrack(i); setCurrentTime(0); setExtFileUrl(null); setExtFileName(''); }}
            className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-[var(--bg-hover)] ${i === currentTrack && !extFileUrl ? 'font-medium' : ''}`}
            style={{ color: i === currentTrack && !extFileUrl ? 'var(--accent-silver)' : 'var(--text-primary)', background: i === currentTrack && !extFileUrl ? 'var(--bg-window)' : 'transparent' }}>
            <span className="w-6 text-center text-xs" style={{ color: 'var(--text-muted)' }}>
              {i === currentTrack && !extFileUrl && isPlaying ? '▶' : i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs truncate">{t.title}</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{t.artist}</div>
            </div>
            <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatTime(t.duration)}</span>
            <button onClick={(e) => { e.stopPropagation(); toggleLike(t.id); }} className="p-1">
              <Heart size={12} fill={liked.has(t.id) ? '#E74C3C' : 'none'} color={liked.has(t.id) ? '#E74C3C' : 'var(--text-muted)'} />
            </button>
          </button>
        ))}
      </div>

      <div className="px-4 py-1 text-[10px] border-t text-center" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        {tracks.length} tracks · {trackBlobs[track?.id] ? 'Ready' : 'Loading...'} · <button onClick={() => fileInputRef.current?.click()} className="underline">Open file</button>
      </div>
    </div>
  );
}
