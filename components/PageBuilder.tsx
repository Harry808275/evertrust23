'use client';

import { useMemo, useRef, useState } from 'react';
import { Plus, GripVertical, Copy, Trash2, Save, Smartphone, Tablet, MonitorSmartphone } from 'lucide-react';

export type BuilderDevice = 'desktop' | 'tablet' | 'mobile';
export type GridCols = 1 | 2 | 3 | 4;

export interface BuilderSection {
  id: string;
  type: 'hero' | 'text' | 'image' | 'product-grid' | 'video' | 'custom';
  title?: string;
  subtitle?: string;
  content?: string;
  mediaUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  gridCols?: GridCols;
  background?: string;
  textColor?: string;
  paddingY?: number; // px
  customCss?: string; // Scoped raw CSS
  responsive?: {
    mobile?: Partial<Pick<BuilderSection, 'gridCols' | 'paddingY'>>;
    tablet?: Partial<Pick<BuilderSection, 'gridCols' | 'paddingY'>>;
  };
}

const sectionTemplates: Array<{ label: string; value: Omit<BuilderSection, 'id'> }> = [
  {
    label: 'Hero (Video/Image + CTA)',
    value: {
      type: 'hero',
      title: 'STYLE AT HOME',
      subtitle: 'Discover timeless elegance',
      mediaUrl: '/lv-hero.mp4',
      buttonText: 'Shop Now',
      buttonLink: '/shop',
      background: '#000000',
      textColor: '#f59e0b',
      paddingY: 96,
    },
  },
  {
    label: 'Text Section',
    value: {
      type: 'text',
      title: 'Refined Craftsmanship',
      content: 'Curated pieces that define luxury living.',
      background: '#ffffff',
      textColor: '#111827',
      paddingY: 64,
    },
  },
  {
    label: 'Image Banner',
    value: {
      type: 'image',
      mediaUrl: '/lv-trainer-front.avif',
      background: '#ffffff',
      textColor: '#111827',
      paddingY: 48,
    },
  },
  {
    label: 'Product Grid (3 cols)',
    value: {
      type: 'product-grid',
      title: 'Featured',
      gridCols: 3,
      background: '#f8f9fa',
      textColor: '#111827',
      paddingY: 80,
    },
  },
  {
    label: 'Video Showcase',
    value: {
      type: 'video',
      mediaUrl: '/lv-hero.mp4',
      background: '#111111',
      textColor: '#ffffff',
      paddingY: 64,
    },
  },
];

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function PageBuilder() {
  const [sections, setSections] = useState<BuilderSection[]>([]);
  const [device, setDevice] = useState<BuilderDevice>('desktop');
  const dragIndex = useRef<number | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = useMemo(() => sections.find(s => s.id === selectedId), [sections, selectedId]);

  function addTemplate(t: Omit<BuilderSection, 'id'>) {
    setSections(prev => [...prev, { id: uid(), ...t }]);
  }

  function duplicate(id: string) {
    setSections(prev => {
      const i = prev.findIndex(s => s.id === id);
      if (i === -1) return prev;
      const copy = { ...prev[i], id: uid() };
      const out = [...prev];
      out.splice(i + 1, 0, copy);
      return out;
    });
  }

  function remove(id: string) {
    setSections(prev => prev.filter(s => s.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function startDrag(i: number) { dragIndex.current = i; }
  function onDrop(i: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from == null || from === i) return;
    setSections(prev => {
      const out = [...prev];
      const [moved] = out.splice(from, 1);
      out.splice(i, 0, moved);
      return out;
    });
  }

  function update<K extends keyof BuilderSection>(id: string, key: K, value: BuilderSection[K]) {
    setSections(prev => prev.map(s => (s.id === id ? { ...s, [key]: value } : s)));
  }

  function updateResponsive(id: string, bp: 'mobile' | 'tablet', key: 'gridCols' | 'paddingY', value: any) {
    setSections(prev => prev.map(s => {
      if (s.id !== id) return s;
      const r = { ...(s.responsive ?? {}) } as BuilderSection['responsive'];
      r[bp] = { ...(r[bp] ?? {}), [key]: value } as any;
      return { ...s, responsive: r };
    }));
  }

  // Simple preview style helpers
  function getCols(s: BuilderSection): GridCols {
    const override = device === 'mobile' ? s.responsive?.mobile?.gridCols : device === 'tablet' ? s.responsive?.tablet?.gridCols : undefined;
    return (override ?? s.gridCols ?? 3) as GridCols;
  }

  function getPadding(s: BuilderSection) {
    const override = device === 'mobile' ? s.responsive?.mobile?.paddingY : device === 'tablet' ? s.responsive?.tablet?.paddingY : undefined;
    return (override ?? s.paddingY ?? 64);
  }

  function ScopedCss({ css, scope }: { css?: string; scope: string }) {
    if (!css) return null;
    // prefix every selector with [data-scope="{scope}"]
    const scoped = css
      .split('}')
      .map(bl => bl.trim())
      .filter(Boolean)
      .map(bl => {
        const [sel, body] = bl.split('{');
        if (!sel || !body) return '';
        return `[data-scope="${scope}"] ${sel.trim()} {${body}}`;
      })
      .join('}\n');
    return <style dangerouslySetInnerHTML={{ __html: scoped }} />;
  }

  function Toolbar() {
    return (
      <div className="flex items-center justify-between bg-white border rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2">
          {sectionTemplates.map(t => (
            <button key={t.label} onClick={() => addTemplate(t.value)} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded">
              + {t.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setDevice('mobile')} className={`p-2 rounded ${device==='mobile'?'bg-black text-white':'bg-gray-100'}`} title="Mobile"><Smartphone size={16} /></button>
          <button onClick={() => setDevice('tablet')} className={`p-2 rounded ${device==='tablet'?'bg-black text-white':'bg-gray-100'}`} title="Tablet"><Tablet size={16} /></button>
          <button onClick={() => setDevice('desktop')} className={`p-2 rounded ${device==='desktop'?'bg-black text-white':'bg-gray-100'}`} title="Desktop"><MonitorSmartphone size={16} /></button>
          <button onClick={() => alert('Save hook—wire to API later')} className="ml-2 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded flex items-center gap-1"><Save size={16}/>Save</button>
        </div>
      </div>
    );
  }

  function SectionCard({ s, i }: { s: BuilderSection; i: number }) {
    const scope = `sec-${s.id}`;
    return (
      <div
        draggable
        onDragStart={() => startDrag(i)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => onDrop(i)}
        onClick={() => setSelectedId(s.id)}
        className={`relative border rounded-lg bg-white overflow-hidden ${selectedId===s.id?'ring-2 ring-amber-500':''}`}
      >
        <ScopedCss css={s.customCss} scope={scope} />
        <div className="absolute left-2 top-2 text-gray-400"><GripVertical size={16}/></div>
        <div className="absolute right-2 top-2 flex gap-1">
          <button onClick={() => duplicate(s.id)} className="p-1 bg-white/70 rounded" title="Duplicate"><Copy size={14}/></button>
          <button onClick={() => remove(s.id)} className="p-1 bg-white/70 rounded text-red-600" title="Delete"><Trash2 size={14}/></button>
        </div>
        <div data-scope={scope} style={{ background: s.background, color: s.textColor, paddingTop: getPadding(s), paddingBottom: getPadding(s) }}>
          {/* Preview */}
          {s.type === 'hero' && (
            <div className="text-center px-6">
              <h2 className="text-4xl md:text-6xl font-light mb-4">{s.title}</h2>
              {s.subtitle && <p className="text-lg opacity-80 mb-6">{s.subtitle}</p>}
              {s.buttonText && <a href={s.buttonLink || '#'} className="inline-block bg-amber-500 text-black px-6 py-3">{s.buttonText}</a>}
            </div>
          )}
          {s.type === 'text' && (
            <div className="max-w-3xl mx-auto px-6">
              {s.title && <h3 className="text-3xl font-light mb-3">{s.title}</h3>}
              {s.content && <p className="text-gray-700">{s.content}</p>}
            </div>
          )}
          {s.type === 'image' && (
            <div className="max-w-5xl mx-auto px-6"><img src={s.mediaUrl || ''} alt={s.title || 'image'} className="w-full rounded"/></div>
          )}
          {s.type === 'video' && (
            <div className="max-w-5xl mx-auto px-6"><video src={s.mediaUrl || ''} className="w-full rounded" autoPlay muted loop playsInline /></div>
          )}
          {s.type === 'product-grid' && (
            <div className="max-w-7xl mx-auto px-6">
              <h4 className="text-2xl font-light mb-6">{s.title || 'Products'}</h4>
              <div className={`grid gap-6`} style={{ gridTemplateColumns: `repeat(${getCols(s)}, minmax(0, 1fr))` }}>
                {[...Array(getCols(s))].map((_, idx) => (
                  <div key={idx} className="aspect-[3/4] bg-gray-100 rounded"/>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="border-t bg-white p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Title</label>
            <input value={s.title || ''} onChange={e=>update(s.id,'title', e.target.value)} className="w-full px-3 py-2 border rounded"/>
            <label className="text-sm text-gray-700">Subtitle / Content</label>
            <textarea value={s.subtitle ?? s.content ?? ''} onChange={e=>update(s.id, s.type==='text'?'content':'subtitle', e.target.value)} className="w-full px-3 py-2 border rounded" rows={2}/>
            {(s.type==='image' || s.type==='video' || s.type==='hero') && (
              <>
                <label className="text-sm text-gray-700">Media URL</label>
                <input value={s.mediaUrl || ''} onChange={e=>update(s.id,'mediaUrl', e.target.value)} className="w-full px-3 py-2 border rounded"/>
              </>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm text-gray-700">Button Text</label>
                <input value={s.buttonText || ''} onChange={e=>update(s.id,'buttonText', e.target.value)} className="w-full px-3 py-2 border rounded"/>
              </div>
              <div>
                <label className="text-sm text-gray-700">Button Link</label>
                <input value={s.buttonLink || ''} onChange={e=>update(s.id,'buttonLink', e.target.value)} className="w-full px-3 py-2 border rounded"/>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-gray-700">Background</label>
            <input type="color" value={s.background || '#ffffff'} onChange={e=>update(s.id,'background', e.target.value)} className="w-20 h-10 p-0 border rounded"/>
            <label className="text-sm text-gray-700">Text Color</label>
            <input type="color" value={s.textColor || '#111827'} onChange={e=>update(s.id,'textColor', e.target.value)} className="w-20 h-10 p-0 border rounded"/>
            <label className="text-sm text-gray-700">Padding Y (px)</label>
            <input type="number" value={getPadding(s)} onChange={e=>update(s.id,'paddingY', parseInt(e.target.value||'0',10))} className="w-full px-3 py-2 border rounded"/>
            {s.type==='product-grid' && (
              <>
                <label className="text-sm text-gray-700">Grid Columns (desktop)</label>
                <select value={s.gridCols ?? 3} onChange={e=>update(s.id,'gridCols', Number(e.target.value) as GridCols)} className="w-full px-3 py-2 border rounded">
                  {[1,2,3,4].map(n=> <option key={n} value={n}>{n}</option>)}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-700">Tablet cols</label>
                    <select value={s.responsive?.tablet?.gridCols ?? ''} onChange={e=>updateResponsive(s.id,'tablet','gridCols', e.target.value?Number(e.target.value):undefined)} className="w-full px-3 py-2 border rounded">
                      <option value="">Default</option>
                      {[1,2,3,4].map(n=> <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Mobile cols</label>
                    <select value={s.responsive?.mobile?.gridCols ?? ''} onChange={e=>updateResponsive(s.id,'mobile','gridCols', e.target.value?Number(e.target.value):undefined)} className="w-full px-3 py-2 border rounded">
                      <option value="">Default</option>
                      {[1,2,3,4].map(n=> <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}
            <label className="text-sm text-gray-700">Custom CSS (scoped)</label>
            <textarea value={s.customCss || ''} onChange={e=>update(s.id,'customCss', e.target.value)} className="w-full px-3 py-2 border rounded" rows={4} placeholder={'.btn{border-radius:0}'} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Page Builder (Professional)</h3>
      </div>
      <Toolbar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {sections.length === 0 && (
            <div className="p-8 text-center bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
              Click a template above to add your first section.
            </div>
          )}
          {sections.map((s, i) => (
            <SectionCard key={s.id} s={s} i={i} />
          ))}
        </div>
        <div className="space-y-3">
          <div className="bg-white border rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-2">Add section</p>
            <div className="grid grid-cols-1 gap-2">
              {sectionTemplates.map(t => (
                <button key={t.label} onClick={() => addTemplate(t.value)} className="flex items-center justify-between px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 rounded">
                  <span>{t.label}</span>
                  <Plus size={16}/>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white border rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-2">Selected section</p>
            {selected ? (
              <div className="text-sm text-gray-800 space-y-1">
                <div><strong>Type:</strong> {selected.type}</div>
                <div><strong>BG:</strong> {selected.background || '#fff'}</div>
                <div><strong>Cols:</strong> {selected.gridCols ?? '-'}</div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No selection</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
















