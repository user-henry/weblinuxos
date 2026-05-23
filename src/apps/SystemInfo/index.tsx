import { useMemo } from 'react';
import { Monitor, Cpu, HardDrive, Wifi, MemoryStick, Clock, Terminal, Info } from 'lucide-react';
import { useSystemStore } from '@/stores/useSystemStore';

interface SystemInfoProps { windowId: string }

interface InfoCard {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}

export default function SystemInfo({ windowId: _windowId }: SystemInfoProps) {
  const user = useSystemStore((s) => s.user);
  const currentTime = useSystemStore((s) => s.currentTime);

  // Simulated system info
  const systemCards: InfoCard[] = useMemo(() => [
    { icon: Monitor, label: 'Operating System', value: 'WebOS 6.5 (Generic)' },
    { icon: Cpu, label: 'Processor', value: 'Intel® Core™ i9-14900K (Virtual) @ 5.8GHz' },
    { icon: MemoryStick, label: 'Memory', value: '16,384 MB (4,096 MB GPU Reserved)' },
    { icon: HardDrive, label: 'Storage', value: 'Samsung 990 PRO 2TB NVMe (Virtual)' },
    { icon: Info, label: 'Kernel Version', value: '6.5.0-webos-generic' },
    { icon: Terminal, label: 'Architecture', value: 'x86_64 (AMD64)' },
  ], []);

  const displayCards: InfoCard[] = useMemo(() => [
    { icon: Monitor, label: 'Resolution', value: '1920 × 1080 @ 144Hz' },
    { icon: Monitor, label: 'GPU Engine', value: 'WebGL 2.0 (Chromium Graphics)' },
    { icon: Monitor, label: 'Display Server', value: 'WebOS Compositor v2.1' },
  ], []);

  const networkCards: InfoCard[] = useMemo(() => [
    { icon: Wifi, label: 'Network Interfaces', value: 'lo, eth0, wlan0' },
    { icon: Wifi, label: 'Protocol Stack', value: 'IPv4, IPv6, WebSocket, WebRTC' },
    { icon: Clock, label: 'Uptime', value: `${Math.floor((Date.now() - new Date().setHours(0,0,0,0)) / 3600000)}h ${Math.floor((Date.now() - new Date().setHours(0,0,0,0)) % 3600000 / 60000)}m` },
  ], []);

  const renderSection = (title: string, cards: InfoCard[]) => (
    <div className="mb-4">
      <h4 className="text-xs font-bold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--text-muted)' }}>{title}</h4>
      <div className="space-y-1.5">
        {cards.map((card, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-lg" style={{ background: 'var(--bg-window)' }}>
            <card.icon size={16} className="text-[var(--accent-silver)]" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{card.label}</div>
              <div className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{card.value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5A6670, #7D8B96)' }}>
          <Monitor size={28} className="text-white" />
        </div>
        <div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>WebOS System Information</h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Logged in as <strong>{user.username}</strong> on {currentTime.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--accent-silver)' }}>6.5</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Kernel Version</div>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>48</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Applications</div>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--warning)' }}>x86_64</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Architecture</div>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-window)' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--info)' }}>React 19</div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Runtime Engine</div>
          </div>
        </div>

        {renderSection('System', systemCards)}
        {renderSection('Display', displayCards)}
        {renderSection('Network', networkCards)}

        <div className="text-center text-[10px] mt-2 pb-2" style={{ color: 'var(--text-muted)' }}>
          WebOS © 2024 | Build 2024.12.15 | All systems operational
        </div>
      </div>
    </div>
  );
}
