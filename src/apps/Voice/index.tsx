import { useState, useRef, useEffect } from 'react';
import { Mic, Play, Pause, Square, Download, Trash2 } from 'lucide-react';

interface VoiceRecorderProps { windowId: string }

interface Recording { id: number; name: string; blobUrl: string; duration: number; date: string; }

export default function VoiceRecorder({ windowId: _windowId }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const recordingsRef = useRef<Recording[]>([]);

  // Cleanup on unmount
  useEffect(() => {
    const ref = recordingsRef;
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      ref.current.forEach(r => URL.revokeObjectURL(r.blobUrl));
    };
  }, []);

  // Sync recordings to ref
  useEffect(() => {
    recordingsRef.current = recordings;
  }, [recordings]);

  const startRecording = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const mins = Math.floor(recordingTime / 60);
        const secs = recordingTime % 60;
        setRecordings(prev => [...prev, {
          id: Date.now(),
          name: `Recording ${prev.length + 1}`,
          blobUrl: url,
          duration: recordingTime,
          date: new Date().toLocaleDateString(),
        }]);
      };

      recorder.start(200); // Collect data every 200ms
    } catch (e: any) {
      setError('Microphone access denied. Please allow microphone permissions in your browser.');
      return;
    }
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = window.setInterval(() => setRecordingTime(t => t + 1), 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const togglePlayback = (rec: Recording) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playingId === rec.id) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    // Stop current playback
    audio.pause();

    audio.src = rec.blobUrl;
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
    audio.play().then(() => setPlayingId(rec.id)).catch(() => setPlayingId(null));
  };

  const deleteRecording = (id: number) => {
    setRecordings(prev => {
      const rec = prev.find(r => r.id === id);
      if (rec) URL.revokeObjectURL(rec.blobUrl);
      return prev.filter(r => r.id !== id);
    });
    if (playingId === id) setPlayingId(null);
  };

  const downloadRecording = (rec: Recording) => {
    const a = document.createElement('a');
    a.href = rec.blobUrl;
    a.download = `${rec.name.replace(/\s+/g, '_')}.webm`;
    a.click();
  };

  const formatDuration = (d: number) => {
    const m = Math.floor(d / 60);
    const s = d % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      <audio ref={audioRef} className="hidden" />

      {/* Recording area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors ${isRecording ? 'animate-pulse' : ''}`}
          style={{ background: isRecording ? 'rgba(231,76,60,0.1)' : 'var(--bg-input)', border: `2px solid ${isRecording ? '#E74C3C' : 'rgba(0,0,0,0.08)'}` }}>
          <Mic size={36} style={{ color: isRecording ? '#E74C3C' : 'var(--accent-silver)' }} />
        </div>

        <div className="text-3xl font-mono font-light text-[var(--text-primary)] mb-6">
          {formatDuration(recordingTime)}
        </div>

        {/* Record button */}
        {!isRecording ? (
          <button onClick={startRecording}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-transform"
            style={{ background: '#E74C3C' }}>
            <Mic size={20} />
          </button>
        ) : (
          <button onClick={stopRecording}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white hover:opacity-90"
            style={{ background: '#E74C3C' }}>
            <Square size={18} />
          </button>
        )}

        <p className="mt-4 text-xs text-[var(--text-muted)]">
          {isRecording ? 'Recording... click square to stop' : 'Press microphone to start recording'}
        </p>

        {error && (
          <p className="mt-2 text-xs" style={{ color: '#E74C3C' }}>{error}</p>
        )}
      </div>

      {/* Recordings list */}
      {recordings.length > 0 && (
        <div className="border-t overflow-y-auto" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', maxHeight: 200 }}>
          <div className="px-4 py-2 text-[11px] font-semibold text-[var(--text-muted)]">
            Recordings ({recordings.length})
          </div>
          {recordings.map(rec => (
            <div key={rec.id} className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--bg-hover)] transition-colors">
              <button onClick={() => togglePlayback(rec)}
                className="p-1.5 rounded hover:bg-[var(--bg-hover)]" style={{ color: 'var(--accent-silver)' }}>
                {playingId === rec.id ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-[var(--text-primary)] truncate">{rec.name}</div>
                <div className="text-[10px] text-[var(--text-muted)]">{rec.date} · {formatDuration(rec.duration)}</div>
              </div>
              <button onClick={() => downloadRecording(rec)} className="p-1 rounded hover:bg-[var(--bg-hover)]" title="Download">
                <Download size={12} style={{ color: 'var(--text-muted)' }} />
              </button>
              <button onClick={() => deleteRecording(rec.id)} className="p-1 rounded hover:bg-[var(--bg-hover)]" title="Delete">
                <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Status bar */}
      <div className="px-3 py-1 text-[10px] text-center border-t"
        style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        {recordings.length} recording{recordings.length !== 1 ? 's' : ''} · Voice Recorder
      </div>
    </div>
  );
}
