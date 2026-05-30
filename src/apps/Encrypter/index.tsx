import { useState } from 'react';
import { Lock, Key, Eye, EyeOff, Copy, RefreshCw, Shield } from 'lucide-react';

interface EncrypterProps { windowId: string }

export default function Encrypter({ windowId: _windowId }: EncrypterProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [key, setKey] = useState('secret-key-123');
  const [method, setMethod] = useState<'aes'|'base64'|'rot13'|'md5'|'sha256'>('base64');
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const encrypt = () => {
    try {
      let result = '';
      switch (method) {
        case 'base64': result = btoa(unescape(encodeURIComponent(input))); break;
        case 'rot13': result = input.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0)+(c<='Z'?90:(c.charCodeAt(0)>=122?96:26)))); break;
        case 'md5': result = simpleHash(input + key, 'md5'); break;
        case 'sha256': result = simpleHash(input + key, 'sha256'); break;
        case 'aes': result = simpleAesEncrypt(input, key); break;
      }
      setOutput(result);
    } catch { setOutput('Error: Invalid input'); }
  };

  const decrypt = () => {
    try {
      let result = '';
      switch (method) {
        case 'base64': result = decodeURIComponent(escape(atob(input))); break;
        case 'rot13': result = input.replace(/[a-zA-Z]/g, c => String.fromCharCode(c.charCodeAt(0)+(c<='Z'?90:(c.charCodeAt(0)>=122?96:26)))); break;
        default: result = 'Decryption not supported for this method';
      }
      setOutput(result);
    } catch { setOutput('Error: Cannot decrypt'); }
  };

  const simpleHash = (str: string, type: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(type === 'sha256' ? 64 : 32, '0');
    return hex.slice(0, type === 'sha256' ? 64 : 32);
  };

  const simpleAesEncrypt = (text: string, k: string): string => {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ k.charCodeAt(i % k.length));
    }
    return btoa(unescape(encodeURIComponent(result)));
  };

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #9B59B6, #8E44AD)' }}>
          <Lock size={18} className="text-white" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Encrypter</h3>
          <p className="text-[11px] text-[var(--text-muted)]">Encrypt and decrypt text</p>
        </div>
        <div className="flex-1" />
        <select value={method} onChange={(e) => setMethod(e.target.value as any)}
          className="h-8 px-2 rounded text-xs outline-none" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <option value="base64">Base64</option>
          <option value="rot13">ROT13</option>
          <option value="aes">AES (sim)</option>
          <option value="md5">MD5 (sim)</option>
          <option value="sha256">SHA-256 (sim)</option>
        </select>
      </div>

      {/* Input */}
      <div className="p-4 space-y-3">
        {/* Key */}
        <div className="flex items-center gap-2">
          <Key size={14} style={{ color: 'var(--text-muted)' }} />
          <div className="flex-1 flex items-center">
            <input type={showKey ? 'text' : 'password'} value={key} onChange={(e) => setKey(e.target.value)}
              className="flex-1 h-8 px-3 rounded text-xs outline-none font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}
              placeholder="Encryption key" />
            <button onClick={() => setShowKey(!showKey)} className="p-1 ml-1 rounded hover:bg-[var(--bg-hover)]">
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
        </div>

        {/* Text */}
        <textarea value={input} onChange={(e) => setInput(e.target.value)}
          className="w-full h-24 p-3 rounded text-xs outline-none resize-none font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}
          placeholder="Enter text to encrypt/decrypt..." />

        {/* Buttons */}
        <div className="flex gap-2">
          <button onClick={encrypt} className="flex-1 py-2 rounded text-xs font-medium text-white" style={{ background: 'var(--accent-dark-gray)' }}>Encrypt</button>
          <button onClick={decrypt} className="flex-1 py-2 rounded text-xs font-medium" style={{ background: 'var(--bg-input)', color: 'var(--text-secondary)', border: '1px solid rgba(0,0,0,0.08)' }}>Decrypt</button>
        </div>

        {/* Output */}
        <div className="relative">
          <div className="text-[11px] font-semibold text-[var(--text-muted)] mb-1">Output</div>
          <div className="p-3 rounded text-xs font-mono break-all relative min-h-[60px]" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }}>
            {output || 'Result will appear here...'}
            {output && (
              <button onClick={copy} className="absolute top-2 right-2 p-1 rounded hover:bg-[var(--bg-hover)]">
                {copied ? <span className="text-[10px] text-green-500">Copied!</span> : <Copy size={14} />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 py-2 text-[10px] text-center border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        Method: {method.toUpperCase()} | {input.length} chars input
      </div>
    </div>
  );
}
