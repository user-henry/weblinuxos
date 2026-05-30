import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, Download, Zap } from 'lucide-react';

interface CameraAppProps { windowId: string }

export default function CameraApp({ windowId: _windowId }: CameraAppProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      setError(null);
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 }, audio: false });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e: any) {
      setError('Camera access denied or not available. This is a simulation environment.');
    }
  };

  const stopCamera = () => {
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth || 320;
    canvas.height = videoRef.current.videoHeight || 240;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    setCaptured(canvas.toDataURL('image/png'));
  };

  const download = () => {
    if (!captured) return;
    const a = document.createElement('a');
    a.href = captured; a.download = `webos-capture-${Date.now()}.png`;
    a.click();
  };

  useEffect(() => { return () => stopCamera(); }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#000' }}>
      {/* Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center" style={{ background: '#111' }}>
        {stream ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : captured ? (
          <img src={captured} className="max-w-full max-h-full object-contain" alt="Captured" />
        ) : error ? (
          <div className="text-center p-6">
            <CameraOff size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-sm text-white/50">{error}</p>
            <button onClick={startCamera} className="mt-4 px-4 py-2 rounded text-sm text-white" style={{ background: 'var(--accent-dark-gray)' }}>
              <RefreshCw size={14} className="inline mr-1" />Try Again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Camera size={64} className="text-white/20 mx-auto mb-4" />
            <p className="text-sm text-white/50 mb-4">Camera not started</p>
            <button onClick={startCamera} className="px-4 py-2 rounded text-sm text-white" style={{ background: 'var(--accent-dark-gray)' }}>
              Start Camera
            </button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 py-3 px-4" style={{ background: '#1a1a1a' }}>
        {stream ? (
          <>
            <button onClick={stopCamera} className="p-2 rounded-full hover:bg-white/10"><CameraOff size={20} className="text-white/60" /></button>
            <button onClick={capture} className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center hover:scale-110 transition-transform">
              <div className="w-11 h-11 rounded-full bg-white" />
            </button>
            <button onClick={() => { setCaptured(null); }} className="p-2 rounded-full hover:bg-white/10"><RefreshCw size={20} className="text-white/60" /></button>
          </>
        ) : captured ? (
          <>
            <button onClick={() => { setCaptured(null); startCamera(); }} className="p-2 rounded-full hover:bg-white/10"><RefreshCw size={20} className="text-white/60" /></button>
            <button onClick={download} className="px-4 py-2 rounded text-sm text-white" style={{ background: 'var(--accent-dark-gray)' }}>
              <Download size={14} className="inline mr-1" />Save
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
}
