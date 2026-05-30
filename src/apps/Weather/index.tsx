import { useState, useEffect } from 'react';
import { CloudSun, Search, Wind, Droplets, Thermometer, Sun, Cloud, CloudRain, CloudSnow, CloudLightning } from 'lucide-react';

interface WeatherProps { windowId: string }

interface WeatherData { city: string; temp: number; condition: string; humidity: number; wind: number; icon: string; }

const mockWeather: WeatherData[] = [
  { city: 'New York', temp: 22, condition: 'Partly Cloudy', humidity: 65, wind: 12, icon: 'Cloud' },
  { city: 'London', temp: 15, condition: 'Rainy', humidity: 80, wind: 18, icon: 'CloudRain' },
  { city: 'Tokyo', temp: 28, condition: 'Sunny', humidity: 50, wind: 8, icon: 'Sun' },
  { city: 'Sydney', temp: 30, condition: 'Clear', humidity: 45, wind: 15, icon: 'Sun' },
  { city: 'Paris', temp: 18, condition: 'Cloudy', humidity: 70, wind: 10, icon: 'Cloud' },
  { city: 'Dubai', temp: 38, condition: 'Hot', humidity: 30, wind: 5, icon: 'Sun' },
  { city: 'Moscow', temp: -5, condition: 'Snow', humidity: 85, wind: 20, icon: 'CloudSnow' },
  { city: 'Singapore', temp: 32, condition: 'Thunderstorm', humidity: 90, wind: 7, icon: 'CloudLightning' },
];

const icons: Record<string, React.ComponentType<{size?:number}>> = {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning,
};

const forecast = [
  { day: 'Mon', high: 24, low: 16, icon: 'Sun' },
  { day: 'Tue', high: 26, low: 17, icon: 'Cloud' },
  { day: 'Wed', high: 22, low: 15, icon: 'CloudRain' },
  { day: 'Thu', high: 20, low: 14, icon: 'CloudRain' },
  { day: 'Fri', high: 23, low: 16, icon: 'Sun' },
  { day: 'Sat', high: 25, low: 18, icon: 'Sun' },
  { day: 'Sun', high: 27, low: 19, icon: 'Cloud' },
];

export default function Weather({ windowId: _windowId }: WeatherProps) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(mockWeather[0]);
  const [unit, setUnit] = useState<'C'|'F'>('C');

  const filtered = mockWeather.filter(w => w.city.toLowerCase().includes(search.toLowerCase()));
  const display = filtered.length > 0 ? filtered[0] : mockWeather[0];
  const temp = unit === 'C' ? display.temp : Math.round(display.temp * 9/5 + 32);
  const high = unit === 'C' ? forecast[0].high : Math.round(forecast[0].high * 9/5 + 32);
  const low = unit === 'C' ? forecast[0].low : Math.round(forecast[0].low * 9/5 + 32);
  const IconComp = icons[display.icon] || CloudSun;

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'linear-gradient(180deg, #4A90D9 0%, #7DB9E8 50%, #B8D4E8 100%)' }}>
      {/* Search */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)' }}>
          <Search size={16} className="text-white/80" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search city..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/60" />
        </div>
      </div>

      {/* Current weather */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <span className="text-white mb-2"><IconComp size={64} /></span>
        <div className="text-6xl font-light text-white mb-1">{temp}°{unit}</div>
        <div className="text-lg text-white/80 mb-1">{display.condition}</div>
        <div className="text-sm text-white/60">{display.city}</div>
        <div className="flex gap-6 mt-4">
          <div className="flex items-center gap-1.5 text-white/80 text-sm"><Droplets size={14} />{display.humidity}%</div>
          <div className="flex items-center gap-1.5 text-white/80 text-sm"><Wind size={14} />{display.wind} km/h</div>
        </div>
      </div>

      {/* City list */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto">
          {mockWeather.map(w => (
            <button key={w.city} onClick={() => { setSearch(w.city); setSelected(w); }}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs text-white transition-all ${w.city === display.city ? 'bg-white/30' : 'bg-white/10 hover:bg-white/20'}`}>
              {w.city}
            </button>
          ))}
        </div>
      </div>

      {/* Forecast */}
      <div className="p-4" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}>
        <div className="flex justify-between">
          {forecast.map(f => {
            const FI = icons[f.icon] || Sun;
            const fl = unit === 'C' ? f.low : Math.round(f.low * 9/5 + 32);
            const fh = unit === 'C' ? f.high : Math.round(f.high * 9/5 + 32);
            return (
              <div key={f.day} className="flex flex-col items-center gap-1">
                <span className="text-[11px] text-white/60">{f.day}</span>
                <span className="text-white/80"><FI size={20} /></span>
                <span className="text-xs text-white">{fh}°</span>
                <span className="text-[10px] text-white/50">{fl}°</span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-3">
          <button onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            className="text-[11px] px-3 py-1 rounded-full text-white bg-white/20 hover:bg-white/30">°{unit} → °{unit === 'C' ? 'F' : 'C'}</button>
        </div>
      </div>
    </div>
  );
}
