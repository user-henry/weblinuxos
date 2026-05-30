import { useState } from 'react';
import { Table, Plus, Trash2, Save, FilePlus, ArrowUp, ArrowDown, FunctionSquare } from 'lucide-react';

interface SpreadsheetProps { windowId: string }

const COLS = 'ABCDEFGHIJKLMNOP'.split('');
const ROWS = 20;
const COLS_COUNT = 12;

export default function Spreadsheet({ windowId: _windowId }: SpreadsheetProps) {
  const [data, setData] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [cellInput, setCellInput] = useState('');
  const [formulaBar, setFormulaBar] = useState('');

  const getCellId = (row: number, col: number) => `${COLS[col]}${row + 1}`;

  const handleCellClick = (row: number, col: number) => {
    const id = getCellId(row, col);
    setSelected(id);
    setCellInput(data[id] || '');
    setFormulaBar(data[id] || '');
  };

  const handleCellChange = (value: string) => {
    setCellInput(value);
    setFormulaBar(value);
    if (selected) {
      setData(prev => ({ ...prev, [selected]: value }));
    }
  };

  const evaluateFormula = (expr: string): string => {
    if (!expr.startsWith('=')) return expr;
    const formula = expr.slice(1).toUpperCase();
    // SUM
    if (formula.startsWith('SUM(')) {
      const range = formula.slice(4, -1);
      const [start, end] = range.split(':');
      const startCol = COLS.indexOf(start[0]);
      const startRow = parseInt(start.slice(1)) - 1;
      const endCol = COLS.indexOf(end[0]);
      const endRow = parseInt(end.slice(1)) - 1;
      let sum = 0;
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const val = parseFloat(data[getCellId(r, c)] || '0');
          if (!isNaN(val)) sum += val;
        }
      }
      return String(sum);
    }
    // AVG
    if (formula.startsWith('AVG(')) {
      const range = formula.slice(4, -1);
      const [start, end] = range.split(':');
      const startCol = COLS.indexOf(start[0]);
      const startRow = parseInt(start.slice(1)) - 1;
      const endCol = COLS.indexOf(end[0]);
      const endRow = parseInt(end.slice(1)) - 1;
      let sum = 0, count = 0;
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          const val = parseFloat(data[getCellId(r, c)] || '0');
          if (!isNaN(val)) { sum += val; count++; }
        }
      }
      return count > 0 ? String(Math.round(sum / count * 100) / 100) : '0';
    }
    // Cell reference
    if (/^[A-Z]\d+$/.test(formula)) {
      return data[formula] || '0';
    }
    return '#ERROR';
  };

  const handleCellBlur = () => {
    if (selected && cellInput.startsWith('=')) {
      const result = evaluateFormula(cellInput);
      setData(prev => ({ ...prev, [selected]: result }));
    }
    if (selected && !cellInput.startsWith('=')) {
      setData(prev => ({ ...prev, [selected]: cellInput }));
    }
  };

  // Sample data
  const initSample = () => {
    setData({
      A1:'Item',B1:'Q1',C1:'Q2',D1:'Q3',E1:'Q4',F1:'Total',
      A2:'Revenue',B2:'1000',C2:'1200',D2:'1400',E2:'1600',F2:'=SUM(B2:E2)',
      A3:'Expenses',B3:'600',C3:'700',D3:'800',E3:'900',F3:'=SUM(B3:E3)',
      A4:'Profit',F4:'=SUM(B2:E2)-SUM(B3:E3)',
    });
  };

  return (
    <div className="w-full h-full flex flex-col" style={{ background: 'var(--bg-workspace)' }}>
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <button onClick={initSample} className="p-1.5 rounded hover:bg-[var(--bg-hover)]" title="Load Sample"><FilePlus size={14} /></button>
        <div className="w-px h-5 mx-1" style={{ background: 'rgba(0,0,0,0.1)' }} />
        <div className="flex items-center gap-1">
          <FunctionSquare size={14} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded text-xs" style={{ background: 'var(--bg-input)', border: '1px solid rgba(0,0,0,0.08)' }}>
          <span className="text-[var(--accent-silver)] font-mono min-w-[60px]">{selected || ''}</span>
          <span className="text-[var(--text-muted)]">|</span>
        </div>
        <input value={formulaBar} onChange={(e) => { setFormulaBar(e.target.value); handleCellChange(e.target.value); }} onBlur={handleCellBlur} onKeyDown={(e) => e.key === 'Enter' && handleCellBlur()}
          className="flex-1 h-7 px-2 rounded text-xs outline-none font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }} />
        <span className="text-[10px] text-[var(--text-muted)]">fx</span>
      </div>

      {/* Spreadsheet */}
      <div className="flex-1 overflow-auto">
        <div className="inline-block min-w-full">
          <table className="border-collapse text-xs">
            <thead>
              <tr>
                <th className="w-10 h-7 border-r border-b font-medium" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.1)', color: 'var(--text-muted)' }}></th>
                {COLS.slice(0, COLS_COUNT).map(col => (
                  <th key={col} className="w-24 h-7 border-r border-b font-medium" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.1)', color: 'var(--text-muted)' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({length: ROWS}, (_, r) => (
                <tr key={r}>
                  <td className="h-7 border-r border-b text-center font-medium" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)', minWidth: 40 }}>{r + 1}</td>
                  {COLS.slice(0, COLS_COUNT).map((col, c) => {
                    const id = getCellId(r, c);
                    const isSelected = selected === id;
                    return (
                      <td key={col} onClick={() => handleCellClick(r, c)}
                        className={`h-7 border-r border-b px-1 cursor-cell truncate ${isSelected ? 'outline outline-2 z-10 relative' : ''}`}
                        style={{ borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-primary)', background: isSelected ? 'var(--bg-window)' : 'transparent', outlineColor: isSelected ? 'var(--accent-silver)' : 'transparent', maxWidth: 96, minWidth: 96 }}>
                        {isSelected ? <input value={cellInput} onChange={(e) => handleCellChange(e.target.value)} onBlur={handleCellBlur}
                          className="w-full h-full bg-transparent outline-none text-xs" style={{ color: 'var(--text-primary)' }} autoFocus onFocus={(e) => e.target.select()} /> : data[id] || ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
        <span>Sheet1</span>
        <span>{ROWS} rows x {COLS_COUNT} cols</span>
      </div>
    </div>
  );
}
