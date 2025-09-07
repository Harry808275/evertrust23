'use client';

import { useState } from 'react';

interface Props {
  onImported?: () => void;
}

export default function CJImporter({ onImported }: Props) {
  const [jsonText, setJsonText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-3">
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


