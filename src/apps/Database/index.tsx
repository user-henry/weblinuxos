import { useState, useMemo } from 'react';
import { Database, Table, Play, ChevronRight, ChevronDown } from 'lucide-react';

interface DatabaseProps { windowId: string }

interface TableSchema { name: string; columns: { name: string; type: string; }[]; rows: Record<string, any>[]; }

const mockTables: TableSchema[] = [
  { name: 'users', columns: [
    { name: 'id', type: 'INTEGER' }, { name: 'name', type: 'VARCHAR(100)' },
    { name: 'email', type: 'VARCHAR(255)' }, { name: 'created_at', type: 'TIMESTAMP' },
  ], rows: [
    { id: 1, name: 'Alice', email: 'alice@example.com', created_at: '2024-01-15 10:30' },
    { id: 2, name: 'Bob', email: 'bob@example.com', created_at: '2024-02-20 14:15' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', created_at: '2024-03-10 09:00' },
    { id: 4, name: 'Diana', email: 'diana@example.com', created_at: '2024-04-05 16:45' },
  ]},
  { name: 'products', columns: [
    { name: 'id', type: 'INTEGER' }, { name: 'name', type: 'VARCHAR(200)' },
    { name: 'price', type: 'DECIMAL(10,2)' }, { name: 'stock', type: 'INTEGER' },
  ], rows: [
    { id: 1, name: 'Laptop', price: 999.99, stock: 50 },
    { id: 2, name: 'Mouse', price: 24.99, stock: 200 },
    { id: 3, name: 'Keyboard', price: 79.99, stock: 150 },
  ]},
  { name: 'orders', columns: [
    { name: 'id', type: 'INTEGER' }, { name: 'user_id', type: 'INTEGER' },
    { name: 'total', type: 'DECIMAL(10,2)' }, { name: 'status', type: 'VARCHAR(50)' },
  ], rows: [
    { id: 1, user_id: 1, total: 1024.98, status: 'completed' },
    { id: 2, user_id: 2, total: 24.99, status: 'pending' },
    { id: 3, user_id: 3, total: 79.99, status: 'shipped' },
  ]},
];

export default function DatabaseExplorer({ windowId: _windowId }: DatabaseProps) {
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [query, setQuery] = useState('SELECT * FROM users;');
  const [queryResult, setQueryResult] = useState<Record<string, any>[] | null>(null);

  const activeTable = useMemo(() => mockTables.find(t => t.name === selectedTable), [selectedTable]);

  const runQuery = () => {
    const q = query.toLowerCase().trim();
    for (const table of mockTables) {
      if (q.includes(table.name)) {
        setQueryResult(table.rows);
        setSelectedTable(table.name);
        return;
      }
    }
    setQueryResult([]);
  };

  return (
    <div className="w-full h-full flex" style={{ background: 'var(--bg-workspace)' }}>
      {/* Sidebar */}
      <div className="w-56 border-r overflow-y-auto" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
        <div className="px-3 py-3 border-b" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)]">
            <Database size={14} /> webos.db
          </div>
        </div>
        {mockTables.map(table => (
          <button key={table.name} onClick={() => setSelectedTable(table.name)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors ${selectedTable === table.name ? 'font-medium' : ''}`}
            style={{ color: selectedTable === table.name ? 'var(--accent-silver)' : 'var(--text-primary)', background: selectedTable === table.name ? 'var(--bg-hover)' : 'transparent' }}>
            <Table size={14} />{table.name}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Query bar */}
        <div className="flex items-center gap-2 p-2 border-b" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)' }}>
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            className="flex-1 h-8 px-3 rounded text-xs outline-none font-mono" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.08)' }} />
          <button onClick={runQuery} className="px-4 h-8 rounded text-xs font-medium text-white flex items-center gap-1.5" style={{ background: 'var(--accent-dark-gray)' }}>
            <Play size={12} />Run
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-auto p-3">
          {activeTable && (
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{activeTable.name}</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr>
                      {activeTable.columns.map(col => (
                        <th key={col.name} className="text-left px-3 py-2 font-semibold border-b" style={{ color: 'var(--accent-silver)', borderColor: 'rgba(0,0,0,0.06)' }}>{col.name} <span className="font-normal text-[var(--text-muted)]">({col.type})</span></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(queryResult || activeTable.rows).map((row, i) => (
                      <tr key={i} className="border-b" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                        {activeTable.columns.map(col => (
                          <td key={col.name} className="px-3 py-2 text-[var(--text-primary)]">{String(row[col.name] ?? 'NULL')}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-3 py-1 text-[10px] border-t" style={{ background: 'var(--bg-window)', borderColor: 'rgba(0,0,0,0.06)', color: 'var(--text-muted)' }}>
          SQLite 3.45 | {mockTables.length} tables | Storage: 42.5 MB
        </div>
      </div>
    </div>
  );
}
