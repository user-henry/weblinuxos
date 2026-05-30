import { useState, useEffect } from 'react';
import { LogIn, Power, RefreshCw, Users, UserCircle, ArrowLeft } from 'lucide-react';
import { useSystemStore, type User } from '@/stores/useSystemStore';
import { useSettingsStore } from '@/stores/useSettingsStore';

const availableUsers: User[] = [
  { username: 'Henry', password: '15240254891', avatar: './user-avatar.png' },
  { username: 'Admin', password: 'admin', avatar: './user-avatar.png' },
  { username: 'Guest', password: '', avatar: '', isGuest: true },
];

export default function LoginScreen() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const login = useSystemStore((s) => s.login);
  const loginAsGuest = useSystemStore((s) => s.loginAsGuest);
  const switchUser = useSystemStore((s) => s.switchUser);
  const user = useSystemStore((s) => s.user);
  const wallpaper = useSettingsStore((s) => s.wallpaper);
  const timeFormat = useSettingsStore((s) => s.timeFormat);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = timeFormat === '24h'
    ? currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    : currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const dateStr = currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const handleLogin = () => {
    if (user.isGuest) {
      // Guest login - no password needed
      loginAsGuest();
      return;
    }
    if (!password.trim()) { setError('Password is required'); return; }
    setIsLoggingIn(true);
    setError('');
    setTimeout(() => {
      if (login(user.username, password)) {
        setIsLoggingIn(false);
      } else {
        setIsLoggingIn(false);
        setError('Incorrect password');
      }
    }, 600);
  };

  const handleSelectUser = (selectedUser: User) => {
    if (selectedUser.isGuest) {
      // Direct guest login
      loginAsGuest();
      return;
    }
    // Switch to selected user and go back to password screen
    useSystemStore.setState({ user: selectedUser });
    setShowUserPicker(false);
    setPassword('');
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  // User picker screen
  if (showUserPicker) {
    return (
      <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
        style={{
          backgroundImage: `url(${wallpaper})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}>
        <div className="absolute inset-0" style={{ background: '#E8E8E8' }} />
        <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
          <h2 className="text-2xl font-light text-[var(--text-primary)] mb-8">Select User</h2>
          <div className="w-full space-y-3">
            {availableUsers.map((u) => (
              <button
                key={u.username}
                onClick={() => handleSelectUser(u)}
                className="w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                {u.avatar ? (
                  <img src={u.avatar} alt={u.username} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-input)' }}>
                    <UserCircle size={28} style={{ color: 'var(--accent-silver)' }} />
                  </div>
                )}
                <div className="text-left">
                  <div className="text-base font-medium text-[var(--text-primary)]">{u.username}</div>
                  <div className="text-xs text-[var(--text-muted)]">{u.isGuest ? 'No password required' : 'Password required'}</div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowUserPicker(false)}
            className="mt-8 flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      {/* Solid overlay - hides desktop underneath */}
      <div className="absolute inset-0" style={{ background: '#E8E8E8' }} />

      {/* Login content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Clock */}
        <div className="mb-2" style={{ transitionDelay: '100ms' }}>
          <span className="text-5xl font-light text-[var(--text-primary)]" style={{ letterSpacing: '-0.02em' }}>
            {timeStr}
          </span>
        </div>

        {/* Date */}
        <div className="mb-8">
          <span className="text-base text-[var(--text-secondary)]">{dateStr}</span>
        </div>

        {/* Avatar */}
        <div className="mb-3">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="User"
              className="w-20 h-20 rounded-full object-cover"
              style={{ border: '2px solid rgba(125,139,150,0.3)', boxShadow: '0 0 20px rgba(125,139,150,0.1)' }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ border: '2px solid rgba(125,139,150,0.3)', boxShadow: '0 0 20px rgba(125,139,150,0.1)', background: 'var(--bg-input)' }}>
              <UserCircle size={40} style={{ color: 'var(--accent-silver)' }} />
            </div>
          )}
        </div>

        {/* Username */}
        <div className="mb-4">
          <span className="text-lg font-medium text-[var(--text-primary)]">{user.username}</span>
        </div>

        {/* Password - only show if not guest */}
        {!user.isGuest && (
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                onKeyDown={handleKeyDown}
                placeholder="Password"
                autoFocus
                className={`w-60 h-10 px-4 rounded text-sm text-[var(--text-primary)] outline-none transition-all ${
                  error ? 'border-red-500' : ''
                }`}
                style={{
                  background: 'var(--bg-input)',
                  border: error ? '1px solid var(--error)' : '1px solid rgba(0,0,0,0.12)',
                }}
              />
            </div>
            {error && <span className="text-xs text-[var(--error)]">{error}</span>}
          </div>
        )}

        {/* Sign In button */}
        <div className={user.isGuest ? 'mt-0' : 'mt-4'}>
          <button
            onClick={handleLogin}
            disabled={isLoggingIn}
            className="w-60 h-10 rounded text-sm font-medium text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-70"
            style={{ background: 'var(--accent-silver)' }}
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={16} />
                {user.isGuest ? 'Sign In as Guest' : 'Sign In'}
              </>
            )}
          </button>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center gap-6 mt-6">
          <button
            onClick={() => setShowUserPicker(true)}
            className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            <Users size={16} />
            Switch User
          </button>
          <button onClick={() => useSystemStore.getState().powerOff()}
            className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors">
            <Power size={16} />
            Power Off
          </button>
          <button onClick={() => useSystemStore.getState().restart()}
            className="flex items-center gap-1.5 text-[13px] text-[var(--text-secondary)] hover:text-[var(--warning)] transition-colors">
            <RefreshCw size={16} />
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
