import { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, Download, FlipHorizontal } from 'lucide-react';

interface CameraAppProps { windowId: string }

export default function CameraApp({ windowId: _windowId }: CameraAppProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [captured, setCaptured] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [photos, setPhotos] = useState<string[]>([]);

  const startCamera = async (faceMode?: 'user' | 'environment') => {
    const mode = faceMode || facingMode;
    setError(null);
    stopCamera();
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: mode },
        audio: false,
      });
      streamRef.current = s;
      setStream(s);
      setFacingMode(mode);
    } catch (e: any) {
      setError('Camera not available. Please allow camera access in browser settings.');
    }
  };

  const stopCamera = () => {
    const s = streamRef.current;
    if (s) {
      s.getTracks().forEach(t => t.stop());
      streamRef.current = null;
      setStream(null);
    }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Flip if front camera
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    setCaptured(dataUrl);
    setPhotos(prev => [...prev, dataUrl]);
  };

  const downloadPhoto = (dataUrl: string, index: number) => {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `webos-photo-${Date.now()}-${index}.png`;
    a.click();
  };

  const switchCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    startCamera(newMode);
  };

  // Bind stream to video element after render
  useEffect(() => {
    const video = videoRef.current;
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch(() => {});
    }
  }, [stream]);

  useEffect(() => { return () => { streamRef.current?.getTracks().forEach(t => t.stop()); }; }, []);

  return (
    <div className="w-full h-full flex flex-col" style={{ background: '#000' }}>
      {/* Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden" style={{ background: '#111' }}>
        {stream ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted
              className="w-full h-full"
              style={{ objectFit: 'cover', transform: facingMode === 'user' ? 'scaleX(-1)' : 'none' }} />
            {captured && (
              <div className="absolute top-3 right-3 w-16 h-12 rounded border-2 border-white/60 overflow-hidden shadow-lg">
                <img src={captured} className="w-full h-full object-cover" alt="Last capture" />
              </div>
            )}
          </>
        ) : captured ? (
          <img src={captured} className="max-w-full max-h-full object-contain" alt="Captured" />
        ) : error ? (
          <div className="text-center p-6">
            <CameraOff size={48} className="text-white/20 mx-auto mb-4" />
            <p className="text-sm text-white/50">{error}</p>
            <button onClick={() => startCamera()}
              className="mt-4 px-4 py-2 rounded text-sm text-white flex items-center gap-2 mx-auto"
              style={{ background: 'var(--accent-dark-gray)' }}>
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Camera size={64} className="text-white/20 mx-auto mb-4" />
            <p className="text-sm text-white/50 mb-4">Click to start camera</p>
            <button onClick={() => startCamera()}
              className="px-4 py-2 rounded text-sm text-white"
              style={{ background: 'var(--accent-dark-gray)' }}>
              Start Camera
            </button>
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 py-3 px-4" style={{ background: '#1a1a1a' }}>
        {stream ? (
          <>
            <button onClick={stopCamera} className="p-2 rounded-full hover:bg-white/10">
              <CameraOff size={20} className="text-white/60" />
            </button>
            <button onClick={capture}
              className="w-14 h-14 rounded-full border-[3px] border-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform">
              <div className="w-11 h-11 rounded-full bg-white" />
            </button>
            <button onClick={switchCamera} className="p-2 rounded-full hover:bg-white/10">
              <FlipHorizontal size={20} className="text-white/60" />
            </button>
          </>
        ) : captured ? (
          <>
            <button onClick={() => { setCaptured(null); setError(null); }}
              className="p-2 rounded-full hover:bg-white/10">
              <RefreshCw size={20} className="text-white/60" />
            </button>
            <button onClick={() => startCamera()} className="px-4 py-2 rounded text-sm text-white"
              style={{ background: 'var(--accent-dark-gray)' }}>
              Take Another
            </button>
            <button onClick={() => downloadPhoto(captured, 0)}
              className="px-4 py-2 rounded text-sm text-white flex items-center gap-1"
              style={{ background: 'var(--accent-silver)' }}>
              <Download size={14} /> Save
            </button>
          </>
        ) : null}
      </div>

      {/* Photo strip */}
      {photos.length > 0 && (
        <div className="flex gap-2 px-3 py-2 overflow-x-auto" style={{ background: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {photos.map((p, i) => (
            <div key={i} className="flex-shrink-0 relative group">
              <img src={p} className="h-12 w-16 object-cover rounded" alt={`Photo ${i + 1}`} />
              <button onClick={() => downloadPhoto(p, i)}
                className="absolute bottom-0 right-0 p-0.5 rounded bg-black/60 hidden group-hover:block">
                <Download size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
