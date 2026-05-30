import { useState } from 'react';
import { Wifi, WifiOff, Globe, Server, Terminal, Activity, Shield, Radio } from 'lucide-react';

interface NetworkProps { windowId: string }

export default function NetworkTools({ windowId: _windowId }: NetworkProps) {
  const [activeTab, setActiveTab] = useState<'info'|'ping'|'scan'>('info');
  const [pingHost, setPingHost] = useState('google.com');
  const [pingResult, setPingResult] = useState<string[]>([]);
  const [isPinging, setIsPinging] = useState(false);

  const runPing = () => {
    setIsPinging(true);
    setPingResult([]);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const t = 20 + Math.random() * 40;
      setPingResult(prev => [...prev, `64 bytes from ${pingHost}: icmp_seq=${count} ttl=64 time=${t.toFixed(1)} ms`]);
      if (count >= 4) { clearInterval(interval); setIsPinging(false); }
    }, 500);
  };

  const interfaces = [
    { name: 'eth0', ip: '192.168.1.42', mac: 'AA:BB:CC:DD:EE:01', status: 'UP', speed: '1000 Mbps' },
    { name: 'wlan0', ip: '192.168.1.42', mac: 'AA:BB:CC:DD:EE:02', status: 'UP', speed: '866 Mbps' },
    { name: 'lo', ip: '127.0.0.1', mac: '00:00:00:00:00:00', status: 'UP', speed: '—' },
  ];

  const connections = [
    { proto: 'TCP', local: '192.168.1.42:443', remote: '142.250.80.46:443', state: 'ESTABLISHED' },
    { proto: 'TCP', local: '192.168.1.42:5228', remote: '216.58.211.238:443', state: 'ESTABLISHED' },
    { proto: 'TCP', local: '192.168.1.42:8080', remote: '0.0.0.0:*', state: 'LISTEN' },
    { proto: 'UDP', local: '0.0.0.0:5353', remote: '*:*', state: '—' },
  ];

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Tabs */}
      <div className="flex border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        {(['info','ping','scan'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === tab ? 'border-b-2' : ''}`}
            style={{ color: activeTab === tab ? 'var(--accent-silver)' : 'var(--text-muted)', borderColor: activeTab === tab ? 'var(--accent-silver)' : 'transparent' }}>
            {tab === 'info' ? 'Network Info' : tab === 'ping' ? 'Ping' : 'Port Scan'}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'info' && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-window)' }}>
                <div className="text-[10px] text-[var(--text-muted)]">IP Address</div>
                <div className="text-sm font-mono font-medium text-[var(--text-primary)]">192.168.1.42</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-window)' }}>
                <div className="text-[10px] text-[var(--text-muted)]">Gateway</div>
                <div className="text-sm font-mono font-medium text-[var(--text-primary)]">192.168.1.1</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-window)' }}>
                <div className="text-[10px] text-[var(--text-muted)]">DNS</div>
                <div className="text-sm font-mono font-medium text-[var(--text-primary)]">8.8.8.8</div>
              </div>
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-window)' }}>
                <div className="text-[10px] text-[var(--text-muted)]">Status</div>
                <div className="text-sm font-medium" style={{ color: '#2ECC71' }}>Connected</div>
              </div>
            </div>

            {/* Interfaces */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Network Interfaces</h4>
              {interfaces.map(iface => (
                <div key={iface.name} className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1" style={{ background: 'var(--bg-window)' }}>
                  <Wifi size={14} style={{ color: '#2ECC71' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-mono font-medium text-[var(--text-primary)]">{iface.name}</div>
                    <div className="text-[10px] text-[var(--text-muted)]">{iface.ip} | {iface.mac} | {iface.speed}</div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded text-white" style={{ background: '#2ECC71' }}>{iface.status}</span>
                </div>
              ))}
            </div>

            {/* Connections */}
            <div>
              <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-2">Active Connections</h4>
              {connections.map((c, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono rounded-lg mb-1" style={{ background: 'var(--bg-window)' }}>
                  <span style={{ color: 'var(--accent-silver)' }}>{c.proto}</span>
                  <span className="text-[var(--text-primary)]">{c.local}</span>
                  <span style={{ color: 'var(--text-muted)' }}>→</span>
                  <span className="text-[var(--text-primary)]">{c.remote}</span>
                  <span className="flex-1 text-right" style={{ color: '#2ECC71' }}>{c.state}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ping' && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Globe size={14} style={{ color: 'var(--accent-silver)' }} />
              <input value={pingHost} onChange={(e) => setPingHost(e.target.value)}
                className="flex-1 h-8 px-3 rounded text-xs outline-none font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }} />
              <button onClick={runPing} disabled={isPinging}
                className="px-4 h-8 rounded text-xs font-medium text-white disabled:opacity-50" style={{ background: 'var(--accent-dark-gray)' }}>
                {isPinging ? 'Pinging...' : 'Ping'}
              </button>
            </div>
            <div className="rounded-lg p-3 font-mono text-xs" style={{ background: '#1e1e1e' }}>
              <div className="text-[#888] mb-1">PING {pingHost} ({pingHost}): 56 data bytes</div>
              {pingResult.map((line, i) => (
                <div key={i} className="text-[#4ECDC4]">{line}</div>
              ))}
              {pingResult.length === 4 && <div className="text-[#888] mt-1">--- {pingHost} ping statistics ---<br/>4 packets transmitted, 4 received, 0% packet loss</div>}
              {!isPinging && pingResult.length === 0 && <div className="text-[#888]">Press Ping to start...</div>}
            </div>
          </div>
        )}

        {activeTab === 'scan' && (
          <div>
            <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-3">Open Ports</h4>
            <div className="space-y-1.5">
              {[22, 80, 443, 3000, 3306, 5432, 6379, 8080].map(port => (
                <div key={port} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-window)' }}>
                  <div className={`w-2 h-2 rounded-full ${[22, 80, 443, 3000, 8080].includes(port) ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-xs font-mono text-[var(--text-primary)]">{port}</span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {port === 22 ? 'SSH' : port === 80 ? 'HTTP' : port === 443 ? 'HTTPS' : port === 3000 ? 'WebOS Dev' : port === 3306 ? 'MySQL' : port === 5432 ? 'PostgreSQL' : port === 6379 ? 'Redis' : port === 8080 ? 'WebOS API' : 'Unknown'}
                  </span>
                  <span className="flex-1 text-right text-[10px]" style={{ color: [22, 80, 443, 3000, 8080].includes(port) ? '#2ECC71' : '#E74C3C' }}>
                    {[22, 80, 443, 3000, 8080].includes(port) ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>Network Tools</span>
        <span>eth0: 192.168.1.42</span>
      </div>
    </div>
  );
}
