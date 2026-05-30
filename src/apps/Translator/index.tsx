import { useState } from 'react';
import { Languages, ArrowLeftRight, Copy, Volume2, Globe } from 'lucide-react';

interface TranslatorProps { windowId: string }

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'it', name: 'Italian' },
];

const mockTranslations: Record<string, Record<string, Record<string, string>>> = {
  'Hello, how are you?': {
    es: { text: 'Hola, ¿cómo estás?', romanization: '' },
    fr: { text: 'Bonjour, comment allez-vous?', romanization: '' },
    de: { text: 'Hallo, wie geht es Ihnen?', romanization: '' },
    zh: { text: '你好，你好吗？', romanization: 'Nǐ hǎo, nǐ hǎo ma?' },
    ja: { text: 'こんにちは、お元気ですか？', romanization: 'Konnichiwa, ogenki desu ka?' },
    ko: { text: '안녕하세요, 어떻게 지내세요?', romanization: 'Annyeonghaseyo, eotteoke jinaeseyo?' },
    pt: { text: 'Olá, como vai?', romanization: '' },
    ru: { text: 'Здравствуйте, как дела?', romanization: 'Zdravstvuyte, kak dela?' },
    ar: { text: 'مرحبا، كيف حالك؟', romanization: 'Marhaban, kayfa haluk?' },
    hi: { text: 'नमस्ते, आप कैसे हैं?', romanization: 'Namaste, aap kaise hain?' },
    it: { text: 'Ciao, come stai?', romanization: '' },
  },
  'Thank you very much': {
    es: { text: 'Muchas gracias', romanization: '' },
    fr: { text: 'Merci beaucoup', romanization: '' },
    de: { text: 'Vielen Dank', romanization: '' },
    zh: { text: '非常感谢', romanization: 'Fēicháng gǎnxiè' },
    ja: { text: 'どうもありがとうございます', romanization: 'Dōmo arigatō gozaimasu' },
    ko: { text: '대단히 감사합니다', romanization: 'Daedanhi gamsahamnida' },
  },
  'Good morning': {
    es: { text: 'Buenos días', romanization: '' },
    fr: { text: 'Bonjour', romanization: '' },
    de: { text: 'Guten Morgen', romanization: '' },
    zh: { text: '早上好', romanization: 'Zǎoshang hǎo' },
    ja: { text: 'おはようございます', romanization: 'Ohayō gozaimasu' },
  },
};

export default function Translator({ windowId: _windowId }: TranslatorProps) {
  const [sourceText, setSourceText] = useState('Hello, how are you?');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [romanization, setRomanization] = useState('');

  const detectAndTranslate = () => {
    // Check direct matches
    if (mockTranslations[sourceText]?.[targetLang]) {
      setTranslatedText(mockTranslations[sourceText][targetLang].text);
      setRomanization(mockTranslations[sourceText][targetLang].romanization);
      return;
    }
    // Fallback: simple mock
    setTranslatedText(`[${LANGUAGES.find(l => l.code === targetLang)?.name} translation of: "${sourceText}"]`);
    setRomanization('');
  };

  const swapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText || sourceText);
    setTranslatedText(sourceText);
    setRomanization('');
  };

  const copyOutput = () => { navigator.clipboard.writeText(translatedText); };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <Languages size={18} style={{ color: 'var(--accent-silver)' }} />
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">Translator</h3>
      </div>

      {/* Language selectors */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}
          className="flex-1 h-9 px-3 rounded text-xs outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}>
          {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <button onClick={swapLanguages} className="p-2 rounded-full hover:bg-[var(--bg-hover)]"><ArrowLeftRight size={18} style={{ color: 'var(--accent-silver)' }} /></button>
        <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}
          className="flex-1 h-9 px-3 rounded text-xs outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}>
          {LANGUAGES.filter(l => l.code !== sourceLang).map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>

      {/* Input/Output */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Source */}
        <div className="flex-1 p-4 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)}
            className="w-full h-full text-sm outline-none resize-none bg-transparent" style={{ color: 'var(--text-primary)' }}
            placeholder="Enter text to translate..." />
        </div>

        {/* Output */}
        <div className="flex-1 p-4" style={{ background: 'var(--bg-window)' }}>
          <div className="text-sm leading-relaxed text-[var(--text-primary)] mb-2">{translatedText || 'Translation will appear here...'}</div>
          {romanization && <div className="text-xs text-[var(--text-muted)] italic">{romanization}</div>}
          {translatedText && (
            <button onClick={copyOutput} className="mt-2 p-1.5 rounded hover:bg-[var(--bg-hover)]"><Copy size={14} /></button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button onClick={detectAndTranslate}
          className="px-4 py-2 rounded text-xs font-medium text-white" style={{ background: 'var(--accent-dark-gray)' }}>
          Translate
        </button>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-[var(--bg-hover)]"><Volume2 size={14} style={{ color: 'var(--text-muted)' }} /></button>
          <span className="text-[10px] text-[var(--text-muted)]">{LANGUAGES.find(l=>l.code===sourceLang)?.name} → {LANGUAGES.find(l=>l.code===targetLang)?.name}</span>
        </div>
      </div>
    </div>
  );
}
