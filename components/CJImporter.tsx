'use client';

import { useState } from 'react';

interface Props {
  onImported?: () => void;
}

export default function CJImporter({ onImported }: Props) {
  const [jsonText, setJsonText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  const handleImport = async () => {
    setError(null);
    let payload: any;
    try {
      payload = JSON.parse(jsonText);
    } catch (e) {
      setError('Invalid JSON');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/cj/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        throw new Error(data.error || 'Import failed');
      }
      onImported?.();
      setJsonText('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Import failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    setError(null);
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/cj/search?q=${encodeURIComponent(query)}&page=1&pageSize=20`);
      if (!res.ok) {
        const data = await res.json().catch(()=>({}));
        throw new Error(data.error || 'Search failed');
      }
      const data = await res.json();
      const list = data?.data?.data || data?.data?.list || [];
      setResults(Array.isArray(list) ? list : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search CJ</label>
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="keyword"
                 className="w-full border border-gray-300 rounded-lg p-2" />
        </div>
        <button onClick={handleSearch} disabled={isLoading} className="px-3 py-2 bg-gray-900 text-white rounded-lg">Search</button>
      </div>
      {results.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-3 max-h-64 overflow-auto">
          <ul className="space-y-2">
            {results.map((r, idx) => (
              <li key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-800">{r?.productName || r?.name || 'Product'} — ${r?.sellPrice || r?.price || '-'}</span>
                <button
                  onClick={() => setJsonText(JSON.stringify([r], null, 2))}
                  className="text-sm px-2 py-1 border rounded">Prepare Import</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <textarea
        value={jsonText}
        onChange={(e)=>setJsonText(e.target.value)}
        placeholder="Paste CJ product JSON (array or { products: [...] })"
        className="w-full border border-gray-300 rounded-lg p-3 font-mono text-sm min-h-40"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        onClick={handleImport}
        disabled={isLoading}
        className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-50"
      >
        {isLoading ? 'Importing…' : 'Import Products'}
      </button>
    </div>
  );
}
