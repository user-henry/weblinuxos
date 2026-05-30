import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Upload } from 'lucide-react';

interface VideoPlayerProps { windowId: string }

export default function VideoPlayer({ windowId: _windowId }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [srcUrl, setSrcUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [error, setError] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hideTimerRef = useRef<number>(0);

  // Handle file open from file manager
  useEffect(() => {
    const pending = (window as any).__pendingVideoFile;
    if (pending) {
      delete (window as any).__pendingVideoFile;
      setSrcUrl('');
      setFileName(pending.fileName || 'Video file');
      setCurrentTime(0);
      setError('This video file is stored in the virtual filesystem. Use "Open File" to play a real video.');
    }
  }, []);

  // Audio event listeners
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => setCurrentTime(video.currentTime);
    const onDur = () => setDuration(video.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onErr = () => setError('Unable to play this video file.');
    video.addEventListener('timeupdate', onTime);
    video.addEventListener('durationchange', onDur);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onErr);
    return () => {
      video.removeEventListener('timeupdate', onTime);
      video.removeEventListener('durationchange', onDur);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onErr);
    };
  }, [srcUrl]);

  // Volume sync
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (isPlaying) {
      hideTimerRef.current = window.setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    video.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const handleFileOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (srcUrl) URL.revokeObjectURL(srcUrl);
    const url = URL.createObjectURL(file);
    setSrcUrl(url);
    setFileName(file.name);
    setCurrentTime(0);
    setError('');
    setTimeout(() => videoRef.current?.play().catch(() => {}), 100);
  };

  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00';
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col relative" style={{ background: '#000' }}
      onMouseMove={resetHideTimer}
      onClick={() => !srcUrl && fileInputRef.current?.click()}>
      <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileOpen} className="hidden" />

      {/* Video area */}
      <div className="flex-1 flex items-center justify-center relative" style={{ background: '#111' }}>
        {srcUrl ? (
          <video ref={videoRef} src={srcUrl} className="max-w-full max-h-full" style={{ objectFit: 'contain' }}
            onClick={(e) => { e.stopPropagation(); togglePlay(); }} />
        ) : error ? (
          <div className="text-center p-6">
            <Play size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-sm text-white/60">{error}</p>
            <button onClick={() => fileInputRef.current?.click()}
              className="mt-4 px-4 py-2 rounded text-sm text-white" style={{ background: 'var(--accent-dark-gray)' }}>
              Open a video file
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Play size={64} className="text-white/20 mx-auto mb-4" />
            <p className="text-sm text-white/50">No video loaded</p>
            <p className="text-xs text-white/30 mt-2">Click anywhere or use "Open File" below</p>
          </div>
        )}
      </div>

      {/* File name bar */}
      {fileName && (
        <div className="px-3 py-1 text-xs text-white/60 text-center" style={{ background: '#1a1a1a' }}>
          {fileName}
        </div>
      )}

      {/* Controls */}
      <div className={`px-4 py-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: '#1a1a1a' }}>
        {/* Progress */}
        <div className="h-1 rounded-full cursor-pointer mb-2" style={{ background: 'rgba(255,255,255,0.15)' }} onClick={seek}>
          <div className="h-1 rounded-full" style={{ background: 'var(--accent-silver)', width: `${duration ? (currentTime / duration) * 100 : 0}%` }} />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={togglePlay} className="text-white/80 hover:text-white">
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <div className="flex items-center gap-2 flex-1">
            <span className="text-[11px] text-white/60 font-mono min-w-[36px]">{formatTime(currentTime)}</span>
            <div className="flex-1" />
            <span className="text-[11px] text-white/60 font-mono">{formatTime(duration)}</span>
          </div>

          {/* Volume */}
          <button onClick={() => setIsMuted(!isMuted)} className="text-white/60 hover:text-white">
            {isMuted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input type="range" min="0" max="100" value={isMuted ? 0 : volume}
            onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false); }}
            className="w-16 h-1 accent-[var(--accent-silver)]" />

          {/* Open file button */}
          <button onClick={() => fileInputRef.current?.click()} className="text-white/60 hover:text-white"
            title="Open video file">
            <Upload size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
