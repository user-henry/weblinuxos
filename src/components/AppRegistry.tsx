import type { ComponentType } from 'react';
import type { ReactNode } from 'react';

// Direct imports for core system apps
import Terminal from '@/apps/Terminal';
import FileManager from '@/apps/FileManager';
import Settings from '@/apps/Settings';
import TaskManager from '@/apps/TaskManager';
import Calculator from '@/apps/Calculator';
import TextEditor from '@/apps/TextEditor';
import Calendar from '@/apps/Calendar';
import ClockApp from '@/apps/Clock';

// Productivity apps
import MarkdownEditor from '@/apps/MarkdownEditor';
import SystemInfo from '@/apps/SystemInfo';
import Browser from '@/apps/Browser';

// Accessory apps
import PasswordGenerator from '@/apps/PasswordGenerator';
import QRCodeGenerator from '@/apps/QRCodeGenerator';
import UnitConverter from '@/apps/UnitConverter';
import StickyNotes from '@/apps/StickyNotes';
import FontViewer from '@/apps/FontViewer';
import ArchiveManager from '@/apps/ArchiveManager';

// Map app IDs to their component implementations
const appComponents: Record<string, ComponentType<{ windowId: string }>> = {
  terminal: Terminal,
  filemanager: FileManager,
  settings: Settings,
  taskmanager: TaskManager,
  calculator: Calculator,
  texteditor: TextEditor,
  calendar: Calendar,
  clock: ClockApp,
  markdownviewer: MarkdownEditor,
  systeminfo: SystemInfo,
  browser: Browser,
  password: PasswordGenerator,
  qrcode: QRCodeGenerator,
  converter: UnitConverter,
  stickynotes: StickyNotes,
  fonts: FontViewer,
  archiver: ArchiveManager,
};

// Placeholder for apps not yet implemented
function AppPlaceholder({ appId, windowId: _windowId }: { appId: string; windowId: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-sm" style={{ background: 'var(--bg-workspace)' }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--bg-input)' }}>
        <span className="text-2xl text-[var(--accent-silver)]">?</span>
      </div>
      <h3 className="text-base font-medium text-[var(--text-primary)] mb-1">Coming Soon</h3>
      <p className="text-xs text-[var(--text-muted)]">This application will be available in a future update.</p>
      <p className="text-[10px] text-[var(--text-muted)] mt-2">App ID: {appId}</p>
    </div>
  );
}

export function getAppComponent(appId: string): ComponentType<{ windowId: string }> {
  return appComponents[appId] || ((props: { windowId: string }) => <AppPlaceholder appId={appId} windowId={props.windowId} />);
}

export function renderApp(appId: string, windowId: string): ReactNode {
  const Component = getAppComponent(appId);
  return <Component key={windowId} windowId={windowId} />;
}
