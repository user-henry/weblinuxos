import { useState } from 'react';
import { Map, Search, Navigation, MapPin, Layers, Compass } from 'lucide-react';

interface MapsProps { windowId: string }

export default function Maps({ windowId: _windowId }: MapsProps) {
  const [query, setQuery] = useState('San Francisco');
  const [view, setView] = useState<'map'|'satellite'>('map');

  const mapSrc = view === 'map'
    ? `https://www.openstreetmap.org/export/embed.html?bbox=-122.5,37.7,-122.3,37.85&layer=mapnik`
    : `https://www.openstreetmap.org/export/embed.html?bbox=-122.5,37.7,-122.3,37.85&layer=hot`;

  const handleSearch = () => { /* Mock search */ };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Search bar */}
      <div className="flex items-center gap-2 p-2" style={{ background: 'var(--bg-window)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--bg-input)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <Search size={14} style={{ color: 'var(--text-muted)' }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 text-xs bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} placeholder="Search location..." />
        </div>
        <button onClick={() => setView(v => v === 'map' ? 'satellite' : 'map')}
          className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title={view === 'map' ? 'Switch to satellite' : 'Switch to map'}>
          <Layers size={16} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 relative" style={{ background: '#e8e4df' }}>
        <iframe src={mapSrc} className="w-full h-full" style={{ border: 'none' }} title="Map" />
        {/* Overlay info */}
        <div className="absolute top-3 left-3 px-3 py-2 rounded-lg text-xs font-medium" style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div className="flex items-center gap-1.5">
            <MapPin size={14} style={{ color: '#E74C3C' }} />
            <span style={{ color: 'var(--text-primary)' }}>San Francisco, CA</span>
          </div>
        </div>
        {/* Coordinates */}
        <div className="absolute bottom-3 right-3 px-2 py-1 rounded text-[10px]" style={{ background: 'rgba(0,0,0,0.5)', color: 'white' }}>
          37.7749° N, 122.4194° W
        </div>
        {/* Controls */}
        <div className="absolute right-3 top-3 flex flex-col gap-1">
          <button className="w-8 h-8 rounded flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Compass size={16} style={{ color: 'var(--text-primary)' }} />
          </button>
        </div>
      </div>

      {/* Bottom info */}
      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>{view === 'map' ? 'Map' : 'Satellite'} View</span>
        <span>OpenStreetMap</span>
      </div>
    </div>
  );
}
