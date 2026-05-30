import { useState, useRef, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Flag, Plus } from 'lucide-react';

interface StopwatchProps { windowId: string }

interface Lap { id: number; time: number; diff: number; }

export default function Stopwatch({ windowId: _windowId }: StopwatchProps) {
  const [time, setTime] = useState(0); // milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [mode, setMode] = useState<'stopwatch'|'timer'>('stopwatch');
  const [timerInput, setTimerInput] = useState({ m: 5, s: 0 });
  const [timerRemaining, setTimerRemaining] = useState(300); // seconds
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<number>(0);

  // Stopwatch
  useEffect(() => {
    if (isRunning) {
      const start = Date.now() - time;
      intervalRef.current = window.setInterval(() => setTime(Date.now() - start), 10);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  // Timer
  useEffect(() => {
    if (timerRunning && timerRemaining > 0) {
      const timer = window.setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) { setTimerRunning(false); return 0; }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timerRunning]);

  const formatTime = (ms: number): string => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const formatTimer = (sec: number): string => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleStopwatch = () => setIsRunning(!isRunning);

  const resetStopwatch = () => { setIsRunning(false); setTime(0); setLaps([]); };

  const addLap = () => {
    const lastLap = laps[laps.length - 1]?.time || 0;
    const diff = time - lastLap;
    setLaps([...laps, { id: laps.length + 1, time, diff }]);
  };

  const startTimer = () => {
    const totalSec = timerInput.m * 60 + timerInput.s;
    if (totalSec <= 0) return;
    setTimerRemaining(totalSec);
    setTimerRunning(true);
  };

  const resetTimer = () => { setTimerRunning(false); setTimerRemaining(timerInput.m * 60 + timerInput.s); };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Mode tabs */}
      <div className="flex border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        {(['stopwatch','timer'] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`px-4 py-2 text-xs font-medium capitalize transition-colors ${mode === m ? 'border-b-2' : ''}`}
            style={{ color: mode === m ? 'var(--accent-silver)' : 'var(--text-muted)', borderColor: mode === m ? 'var(--accent-silver)' : 'transparent' }}>
            <Timer size={14} className="inline mr-1" />{m}
          </button>
        ))}
      </div>

      {mode === 'stopwatch' ? (
        <>
          {/* Display */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <div className="text-5xl font-mono font-light mb-8" style={{ color: 'var(--text-primary)', letterSpacing: '0.05em' }}>{formatTime(time)}</div>
            <div className="flex items-center gap-4">
              <button onClick={resetStopwatch} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)]">
                <RotateCcw size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
              <button onClick={toggleStopwatch} className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105"
                style={{ background: isRunning ? '#E74C3C' : '#2ECC71' }}>
                {isRunning ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
              </button>
              <button onClick={addLap} disabled={!isRunning} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)] disabled:opacity-30">
                <Flag size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
          </div>

          {/* Laps */}
          {laps.length > 0 && (
            <div className="border-t overflow-y-auto" style={{ borderColor: 'rgba(0,0,0,0.06)', maxHeight: 160 }}>
              <div className="px-4 py-2 text-[11px] font-semibold text-[var(--text-muted)]">Laps</div>
              {laps.map(lap => (
                <div key={lap.id} className="flex items-center justify-between px-4 py-1.5 text-xs hover:bg-[var(--bg-hover)]">
                  <span className="text-[var(--text-muted)]">Lap {lap.id}</span>
                  <span className="font-mono text-[var(--text-primary)]">{formatTime(lap.time)}</span>
                  <span className="font-mono" style={{ color: '#2ECC71' }}>+{formatTime(lap.diff)}</span>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Timer */}
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            {!timerRunning && timerRemaining === (timerInput.m * 60 + timerInput.s) ? (
              <div className="flex items-center gap-2 mb-8">
                <input type="number" min="0" max="99" value={timerInput.m}
                  onChange={(e) => setTimerInput({ ...timerInput, m: Math.max(0, Math.min(99, parseInt(e.target.value) || 0)) })}
                  className="w-20 h-16 text-4xl font-mono text-center rounded-lg outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }} />
                <span className="text-4xl font-light text-[var(--text-muted)]">:</span>
                <input type="number" min="0" max="59" value={timerInput.s}
                  onChange={(e) => setTimerInput({ ...timerInput, s: Math.max(0, Math.min(59, parseInt(e.target.value) || 0)) })}
                  className="w-20 h-16 text-4xl font-mono text-center rounded-lg outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.06)' }} />
              </div>
            ) : (
              <div className={`text-5xl font-mono font-light mb-8 ${timerRemaining === 0 ? 'text-red-500' : ''}`} style={{ color: timerRemaining === 0 ? '#E74C3C' : 'var(--text-primary)', letterSpacing: '0.05em' }}>
                {formatTimer(timerRemaining)}
              </div>
            )}
            <div className="flex items-center gap-4">
              <button onClick={resetTimer} className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)]">
                <RotateCcw size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
              {!timerRunning ? (
                <button onClick={startTimer} className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105" style={{ background: '#2ECC71' }}>
                  <Play size={28} className="ml-1" />
                </button>
              ) : (
                <button onClick={() => setTimerRunning(false)} className="w-16 h-16 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105" style={{ background: '#E74C3C' }}>
                  <Pause size={28} />
                </button>
              )}
              <button onClick={() => { setTimerInput({ m: 5, s: 0 }); setTimerRemaining(300); setTimerRunning(false); }}
                className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-[var(--bg-hover)]">
                <Plus size={20} style={{ color: 'var(--text-muted)' }} />
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2 px-4 py-3 border-t flex-wrap justify-center" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
            {[1, 3, 5, 10, 15, 30].map(min => (
              <button key={min} onClick={() => { setTimerInput({ m: min, s: 0 }); setTimerRemaining(min * 60); setTimerRunning(false); }}
                className="px-3 py-1.5 rounded-full text-xs hover:bg-[var(--bg-hover)]" style={{ color: 'var(--text-secondary)', background: 'var(--bg-input)' }}>
                {min} min
              </button>
            ))}
          </div>
        </>
      )}

      <div className="px-4 py-1 text-[10px] text-center border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        {mode === 'stopwatch' ? 'Stopwatch' : 'Timer'} | {laps.length} laps
      </div>
    </div>
  );
}
