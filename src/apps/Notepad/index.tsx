import { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, Save, FilePlus } from 'lucide-react';

interface NotepadProps { windowId: string }

interface Note { id: string; title: string; content: string; color: string; timestamp: number; }

const COLORS = ['#FFFDE7','#FFF3E0','#F3E5F5','#E8F5E9','#E3F2FD','#FCE4EC'];

const loadNotes = (): Note[] => {
  try {
    const saved = localStorage.getItem('webos-notepad-notes');
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveNotes = (notes: Note[]) => {
  localStorage.setItem('webos-notepad-notes', JSON.stringify(notes));
};

export default function Notepad({ windowId: _windowId }: NotepadProps) {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState(false);

  useEffect(() => { saveNotes(notes); }, [notes]);

  const note = notes.find(n => n.id === selectedNote);

  const addNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'New Note',
      content: '',
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      timestamp: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote.id);
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(n => n.id !== id));
    if (selectedNote === id) setSelectedNote(null);
  };

  const updateNote = (field: 'title' | 'content', value: string) => {
    setNotes(notes.map(n => n.id === selectedNote ? { ...n, [field]: value, timestamp: Date.now() } : n));
  };

  const changeColor = (color: string) => {
    setNotes(notes.map(n => n.id === selectedNote ? { ...n, color } : n));
  };

  return (
    <div className="w-full h-full flex" style={{ background: 'var(--bg-workspace)' }}>
      {/* Sidebar */}
      <div className="w-44 border-r flex flex-col" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button onClick={addNote}
          className="mx-3 mt-3 mb-2 py-2 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-1" style={{ background: 'var(--accent-dark-gray)' }}>
          <Plus size={14} />New Note
        </button>
        <div className="flex-1 overflow-y-auto">
          {notes.map(n => (
            <button key={n.id} onClick={() => setSelectedNote(n.id)}
              className={`w-full text-left px-3 py-2 border-b transition-colors ${selectedNote === n.id ? 'font-medium' : ''}`}
              style={{ borderColor: 'rgba(0,0,0,0.04)', color: selectedNote === n.id ? 'var(--accent-silver)' : 'var(--text-primary)', background: selectedNote === n.id ? 'var(--bg-hover)' : 'transparent' }}>
              <div className="text-xs truncate">{n.title || 'Untitled'}</div>
              <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{n.content.slice(0, 40) || 'Empty note'}</div>
              <div className="text-[10px] text-[var(--text-muted)] mt-1">{new Date(n.timestamp).toLocaleDateString()}</div>
            </button>
          ))}
          {notes.length === 0 && (
            <div className="p-4 text-xs text-center text-[var(--text-muted)]">No notes yet.<br />Click + to create one.</div>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {note ? (
          <>
            <div className="flex items-center gap-1 px-3 py-1.5 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
              <input value={note.title} onChange={(e) => updateNote('title', e.target.value)}
                className="flex-1 text-sm font-semibold bg-transparent outline-none" style={{ color: 'var(--text-primary)' }}
                placeholder="Note title" />
              <div className="flex gap-1 ml-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => changeColor(c)}
                    className="w-5 h-5 rounded-full border-2 transition-transform hover:scale-110"
                    style={{ background: c, borderColor: note.color === c ? 'var(--accent-silver)' : 'transparent' }} />
                ))}
              </div>
              <button onClick={() => deleteNote(note.id)} className="p-1.5 rounded hover:bg-[var(--bg-hover)] ml-2"><Trash2 size={14} /></button>
            </div>
            <textarea value={note.content} onChange={(e) => updateNote('content', e.target.value)}
              className="flex-1 p-4 text-sm outline-none resize-none leading-relaxed" style={{ background: note.color, color: '#333' }}
              placeholder="Start writing..." />
            <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: note.color, borderColor: 'rgba(0,0,0,0.06)', color: 'rgba(0,0,0,0.4)' }}>
              <span>{note.content.length} chars</span>
              <span>{new Date(note.timestamp).toLocaleString()}</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)]">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
}
