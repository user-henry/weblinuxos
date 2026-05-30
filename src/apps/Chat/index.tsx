import { MessageSquare } from 'lucide-react';

interface ChatProps { windowId: string }

export default function Chat({ windowId: _windowId }: ChatProps) {
  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b flex-shrink-0" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <MessageSquare size={20} className="text-[var(--accent-silver)]" />
        <span className="text-sm font-medium text-[var(--text-primary)]">Chat</span>
      </div>

      {/* Iframe - embeds user-henry/nflshcchat */}
      <iframe
        src="https://user-henry.github.io/nflshcchat/"
        className="flex-1 w-full border-0"
        title="Chat"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        allow="camera; microphone; fullscreen"
      />
    </div>
  );
}
