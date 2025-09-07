"use client";

import { useRef, useState } from "react";

type ParsedRow = Record<string, string>;

export default function AdvancedProductManager({ onImport }: { onImport?: (rows: ParsedRow[]) => Promise<void> | void }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [preview, setPreview] = useState<ParsedRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const templateHeaders = [
    "name",
    "description",
    "price",
    "category",
    "images", // comma-separated URLs
    "colors", // comma-separated
    "sizes", // comma-separated
    "stock",
    "inStock", // true/false
  ];

  function downloadTemplate() {
    const csv = templateHeaders.join(",") + "\n";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleExport() {
    try {
      setIsExporting(true);
      setError(null);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products for export");
      const products = await res.json();
      const rows = products.map((p: any) => ({
        name: p.name ?? "",
        description: p.description ?? "",
        price: String(p.price ?? ""),
        category: p.category ?? "",
        images: Array.isArray(p.images) ? p.images.join("|") : "",
        colors: Array.isArray(p.colors) ? p.colors.join("|") : "",
        sizes: Array.isArray(p.sizes) ? p.sizes.join("|") : "",
        stock: String(p.stock ?? ""),
        inStock: String(p.inStock ?? ""),
      }));
      const header = templateHeaders.join(",");
      const lines = rows.map((r: ParsedRow) => templateHeaders.map(h => csvEscape(r[h] ?? "")).join(","));
      const csv = [header, ...lines].join("\n");
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "products-export.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError(e?.message ?? "Export failed");
    } finally {
      setIsExporting(false);
    }
  }

  function csvEscape(value: string) {
    const needsQuotes = /[",\n]/.test(value);
    const escaped = value.replace(/"/g, '""');
    return needsQuotes ? `"${escaped}"` : escaped;
  }

  function parseCsv(text: string): ParsedRow[] {
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return [];
    const headers = lines[0].split(",").map(h => h.trim());
    return lines.slice(1).map(line => {
      const cols = smartSplitCsv(line);
      const row: ParsedRow = {};
      headers.forEach((h, i) => {
        row[h] = (cols[i] ?? "").trim();
      });
      return row;
    });
  }

  function smartSplitCsv(line: string): string[] {
    const out: string[] = [];
    let cur = ""; let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        out.push(cur); cur = "";
      } else cur += ch;
    }
    out.push(cur);
    return out;
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please select a .csv file");
      return;
    }
    const text = await file.text();
    const rows = parseCsv(text);
    setPreview(rows.slice(0, 10));
  }

  async function confirmImport() {
    if (preview.length === 0) return;
    setIsImporting(true);
    setError(null);
    try {
      if (onImport) {
        await onImport(preview);
      } else {
        // default import behavior - call backend per row
        for (const row of preview) {
          const body = {
            name: row.name ?? "",
            description: row.description ?? "",
            price: Number(row.price ?? 0),
            category: row.category ?? "General",
            images: (row.images ?? "").split("|").filter(Boolean),
            colors: (row.colors ?? "").split("|").filter(Boolean),
            sizes: (row.sizes ?? "").split("|").filter(Boolean),
            stock: Number(row.stock ?? 0),
            inStock: (row.inStock ?? "true").toString().toLowerCase() === "true",
          };
          const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          if (!res.ok) {
            const msg = await res.text();
            throw new Error(`Failed to import product: ${body.name} - ${msg}`);
          }
        }
      }
      setPreview([]);
      alert("Import completed successfully");
    } catch (e: any) {
      setError(e?.message ?? "Import failed");
    } finally {
      setIsImporting(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Advanced Product Manager</h3>
        <div className="flex items-center gap-2">
          <button onClick={downloadTemplate} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded">Download CSV Template</button>
          <button onClick={handleExport} disabled={isExporting} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:opacity-60">{isExporting ? "Exporting..." : "Export Products"}</button>
          <label className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded cursor-pointer">
            Import CSV
            <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
          </label>
        </div>
      </div>

      {error && (
        <div className="mb-3 p-3 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</div>
      )}

      {preview.length > 0 && (
        <div className="rounded border border-gray-200 overflow-hidden">
          <div className="px-3 py-2 bg-gray-50 border-b text-sm text-gray-700 flex items-center justify-between">
            <span>Preview first {preview.length} rows</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setPreview([])} className="px-2 py-1 text-gray-700 hover:text-black">Clear</button>
              <button onClick={confirmImport} disabled={isImporting} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded disabled:opacity-60">{isImporting ? "Importing..." : "Confirm Import"}</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-white">
                <tr>
                  {templateHeaders.map(h => (
                    <th key={h} className="px-3 py-2 text-left font-medium text-gray-700 border-b">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx} className="odd:bg-white even:bg-gray-50">
                    {templateHeaders.map(h => (
                      <td key={h} className="px-3 py-2 text-gray-900 border-b align-top">{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {preview.length === 0 && (
        <p className="text-sm text-gray-600">Upload a CSV to preview and import products. Use "|" to separate multiple values in a cell (e.g., multiple image URLs).</p>
      )}
    </div>
  );
}
















