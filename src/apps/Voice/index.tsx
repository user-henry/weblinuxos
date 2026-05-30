import { useState, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Square, Download, Waves } from 'lucide-react';

interface VoiceRecorderProps { windowId: string }

export default function VoiceRecorder({ windowId: _windowId }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordings, setRecordings] = useState<{ id: number; name: string; duration: string; date: string; }[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const intervalRef = useRef<number>(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const mins = Math.floor(duration / 60);
        const secs = duration % 60;
        setRecordings(prev => [...prev, {
          id: Date.now(),
          name: `Recording ${prev.length + 1}`,
          duration: `${mins}:${String(secs).padStart(2, '0')}`,
          date: new Date().toLocaleDateString(),
        }]);
      };
      recorder.start();
      setIsRecording(true);
      setDuration(0);
      intervalRef.current = window.setInterval(() => setDuration(d => d + 1), 1000);
    } catch (e) {
      // Mock recording mode
      setIsRecording(true);
      setDuration(0);
      intervalRef.current = window.setInterval(() => setDuration(d => d + 1), 1000);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    setIsRecording(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); audioRef.current.onended = () => setIsPlaying(false); }
  };

  const formatDuration = (d: number) => `${Math.floor(d / 60)}:${String(d % 60).padStart(2, '0')}`;

  const getWaveHeights = () => Array.from({ length: 20 }, () => isRecording ? 8 + Math.random() * 24 : 8);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6" style={{ background: isRecording ? 'rgba(231,76,60,0.1)' : 'var(--bg-input)', border: `2px solid ${isRecording ? '#E74C3C' : 'rgba(0,0,0,0.08)'}` }}>
          <Mic size={36} style={{ color: isRecording ? '#E74C3C' : 'var(--accent-silver)' }} />
        </div>

        {/* Wave visualization */}
        <div className="flex items-end gap-0.5 h-12 mb-4">
          {getWaveHeights().map((h, i) => (
            <div key={i} className="w-1.5 rounded-full transition-all" style={{ height: h, background: isRecording ? '#E74C3C' : 'var(--accent-silver)', opacity: isRecording ? 1 : 0.3 }} />
          ))}
        </div>

        <div className="text-3xl font-mono font-light text-[var(--text-primary)] mb-6">{formatDuration(duration)}</div>

        <div className="flex items-center gap-3">
          {!isRecording ? (
            <button onClick={startRecording} className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:opacity-90" style={{ background: '#E74C3C' }}>
              <Mic size={20} />
            </button>
          ) : (
            <button onClick={stopRecording} className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:opacity-90" style={{ background: '#E74C3C' }}>
              <Square size={18} />
            </button>
          )}
        </div>
        <p className="mt-4 text-xs text-[var(--text-muted)]">{isRecording ? 'Recording...' : 'Press to record'}</p>
      </div>

      {/* Recordings list */}
      {recordings.length > 0 && (
        <div className="border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', maxHeight: 160, overflowY: 'auto' }}>
          <div className="px-4 py-2 text-[11px] font-semibold text-[var(--text-muted)]">Recordings</div>
          {recordings.map((rec, i) => (
            <div key={rec.id} className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--bg-hover)] transition-colors">
              <button onClick={togglePlayback} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--accent-silver)' }}>
                {isPlaying ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--text-primary)] truncate">{rec.name}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{rec.date}</div>
              </div>
              <span className="text-xs text-[var(--text-muted)]">{rec.duration}</span>
              <button className="p-1 rounded hover:bg-[var(--bg-hover)]"><Download size={12} /></button>
            </div>
          ))}
          <audio ref={audioRef} src={audioUrl || ''} className="hidden" />
        </div>
      )}

      <div className="px-3 py-1 text-[10px] text-center border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        {recordings.length} recordings | Voice Recorder
      </div>
    </div>
  );
}
