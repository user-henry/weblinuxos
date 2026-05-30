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

// Development apps
import CodeEditor from '@/apps/CodeEditor';
import GitClient from '@/apps/GitClient';
import ApiClient from '@/apps/ApiClient';
import Database from '@/apps/Database';
import RegexBuddy from '@/apps/RegexBuddy';
import JsonViewer from '@/apps/JsonViewer';
import ColorPicker from '@/apps/ColorPicker';
import DiffViewer from '@/apps/DiffViewer';

// Internet apps
import Email from '@/apps/Email';
import Chat from '@/apps/Chat';
import Weather from '@/apps/Weather';
import Maps from '@/apps/Maps';
import News from '@/apps/News';

// Office apps
import Writer from '@/apps/Writer';
import Spreadsheet from '@/apps/Spreadsheet';
import Presentation from '@/apps/Presentation';
import PdfViewer from '@/apps/PdfViewer';
import Notepad from '@/apps/Notepad';

// Multimedia apps
import MusicPlayer from '@/apps/MusicPlayer';
import VideoPlayer from '@/apps/VideoPlayer';
import ImageViewer from '@/apps/ImageViewer';
import Camera from '@/apps/Camera';
import Voice from '@/apps/Voice';

// Graphics apps
import Paint from '@/apps/Paint';
import ImageEditor from '@/apps/ImageEditor';
import SvgViewer from '@/apps/SvgViewer';
import IconMaker from '@/apps/IconMaker';

// System utilities
import Screenshot from '@/apps/Screenshot';
import DiskUsage from '@/apps/DiskUsage';
import Backup from '@/apps/Backup';
import FileSearch from '@/apps/FileSearch';
import Network from '@/apps/Network';
import Encrypter from '@/apps/Encrypter';
import Archive from '@/apps/Archive';

// Accessories
import Help from '@/apps/Help';
import Trash from '@/apps/Trash';
import Dictionary from '@/apps/Dictionary';
import Translator from '@/apps/Translator';
import Stopwatch from '@/apps/Stopwatch';

// Map app IDs to their component implementations
const appComponents: Record<string, ComponentType<{ windowId: string }>> = {
  // System
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

  // Accessories
  password: PasswordGenerator,
  qrcode: QRCodeGenerator,
  converter: UnitConverter,
  stickynotes: StickyNotes,
  fonts: FontViewer,
  archiver: ArchiveManager,

  // Development
  codeeditor: CodeEditor,
  gitclient: GitClient,
  apiclient: ApiClient,
  database: Database,
  regexbuddy: RegexBuddy,
  jsonviewer: JsonViewer,
  colorpicker: ColorPicker,
  diffviewer: DiffViewer,

  // Internet
  email: Email,
  chat: Chat,
  weather: Weather,
  maps: Maps,
  news: News,

  // Office
  writer: Writer,
  spreadsheet: Spreadsheet,
  presentation: Presentation,
  pdfviewer: PdfViewer,
  notepad: Notepad,

  // Multimedia
  musicplayer: MusicPlayer,
  videoplayer: VideoPlayer,
  imageviewer: ImageViewer,
  camera: Camera,
  voice: Voice,

  // Graphics
  paint: Paint,
  imageeditor: ImageEditor,
  svgviewer: SvgViewer,
  iconmaker: IconMaker,

  // System utilities
  screenshot: Screenshot,
  diskusage: DiskUsage,
  backup: Backup,
  filesearch: FileSearch,
  network: Network,
  encrypter: Encrypter,
  archive: Archive,

  // More accessories
  help: Help,
  trash: Trash,
  dictionary: Dictionary,
  translator: Translator,
  stopwatch: Stopwatch,
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
