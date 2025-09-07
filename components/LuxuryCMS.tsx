'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Save,
  X,
  Upload,
  Layout,
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  Star,
  Crown,
  Gem,
  Sparkles,
  Zap
} from 'lucide-react';

interface ContentSection {
  id: string;
  type: 'hero' | 'product-section' | 'video-showcase';
  title: string;
  subtitle?: string;
  description?: string;
  media?: {
    type: 'video' | 'image';
    url: string;
    alt?: string;
    poster?: string;
  };
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  order: number;
  layout: 'default' | 'luxury' | 'minimal' | 'heroic';
  settings: {
    backgroundColor: string;
    textColor: string;
    overlayOpacity: number;
    animation: 'fade' | 'slide' | 'zoom' | 'luxury';
    buttonStyle: 'primary' | 'luxury' | 'minimal';
    cardStyle: 'default' | 'luxury' | 'glass';
  };
}

export default function LuxuryCMS() {
  const { data: session, status } = useSession();
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'builder' | 'preview'>('builder');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  // Luxury Templates
  const templates = [
    {
      id: 'luxury-hero',
      name: 'Luxury Hero Banner',
      description: 'Elegant full-screen hero with cinematic video',
      sections: [{
        id: 'hero-1',
        type: 'hero',
        title: 'STYLE AT HOME',
        subtitle: 'Discover timeless elegance',
        description: 'Experience luxury living',
        media: {
          type: 'video',
          url: '/lv-hero.mp4',
          alt: 'Luxury Hero Video',
          poster: '/lv-trainer-front.avif'
        },
        buttonText: 'Explore Collection',
        buttonLink: '/shop',
        isActive: true,
        order: 1,
        layout: 'luxury',
        settings: {
          backgroundColor: '#000000',
          textColor: '#ffffff',
          overlayOpacity: 0.3,
          animation: 'luxury',
          buttonStyle: 'luxury',
          cardStyle: 'luxury'
        }
      }]
    },
    {
      id: 'product-showcase',
      name: 'Premium Product Grid',
      description: 'Sophisticated product grid with luxury effects',
      sections: [{
        id: 'products-1',
        type: 'product-section',
        title: 'Featured Collection',
        subtitle: 'Discover our latest luxury pieces',
        description: 'Curated selection of premium products',
        media: {
          type: 'image',
          url: '/lv-trainer-front.avif',
          alt: 'Featured Collection'
        },
        buttonText: 'View All Products',
        buttonLink: '/shop',
        isActive: true,
        order: 1,
        layout: 'luxury',
        settings: {
          backgroundColor: '#f8f9fa',
          textColor: '#000000',
          overlayOpacity: 0.4,
          animation: 'fade',
          buttonStyle: 'luxury',
          cardStyle: 'luxury'
        }
      }]
    }
  ];

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/content');
      if (response.ok) {
        const data = await response.json();
        const validSections = data.filter((item: any) => 
          item && item._id && item.type && item.title
        );
        setSections(validSections);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSections = async () => {
    try {
      for (const section of sections) {
        await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(section)
        });
      }
    } catch (error) {
      console.error('Error saving sections:', error);
    }
  };

  const applyTemplate = (template: any) => {
    setSections(template.sections);
    setShowTemplates(false);
  };

  const addSection = (type: ContentSection['type']) => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type,
      title: `New ${type.replace('-', ' ')}`,
      isActive: true,
      order: sections.length + 1,
      layout: 'luxury',
      settings: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        overlayOpacity: 0.4,
        animation: 'luxury',
        buttonStyle: 'luxury',
        cardStyle: 'luxury'
      }
    };
    
    setSections([...sections, newSection]);
    setSelectedSection(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<ContentSection>) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    ));
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
    if (selectedSection === id) {
      setSelectedSection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading Luxury CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-amber-50 to-white">
      {/* Luxury Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-amber-200/50 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Crown className="text-amber-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Luxury Content Manager</h1>
                <p className="text-sm text-gray-500">Professional CMS for Premium Brands</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Gem size={14} />
                Premium Features
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setViewMode('builder')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'builder' 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layout size={16} className="inline mr-2" />
                Builder
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'preview' 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye size={16} className="inline mr-2" />
                Preview
              </button>
            </div>

            {/* Device Mode Toggle */}
            <div className="flex bg-gray-100/80 backdrop-blur-sm rounded-xl p-1">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  deviceMode === 'desktop' 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop"
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  deviceMode === 'tablet' 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tablet"
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-3 py-2 rounded-lg text-sm transition-all ${
                  deviceMode === 'mobile' 
                    ? 'bg-white text-gray-900 shadow-lg' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobile"
              >
                <Smartphone size={16} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={saveSections}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <Zap size={14} />
              Auto-save: ON
            </span>
            <span className="flex items-center gap-2">
              <Sparkles size={14} />
              {sections.length} sections
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowTemplates(true)}
              className="text-amber-600 hover:text-amber-700 font-medium flex items-center gap-2"
            >
              <Star size={14} />
              Premium Templates
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Section Library */}
        <div className="w-96 bg-white/80 backdrop-blur-sm border-r border-amber-200/50 flex flex-col">
          <div className="p-6 border-b border-amber-200/50">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">Section Library</h3>
            
            {/* Quick Add Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => addSection('hero')}
                className="p-4 border-2 border-amber-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="text-sm font-semibold">Hero</span>
                </div>
                <p className="text-xs text-gray-500">Full-screen banner</p>
              </button>
              
              <button
                onClick={() => addSection('product-section')}
                className="p-4 border-2 border-amber-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="text-sm font-semibold">Products</span>
                </div>
                <p className="text-xs text-gray-500">Product grid</p>
              </button>
              
              <button
                onClick={() => addSection('video-showcase')}
                className="p-4 border-2 border-amber-200 rounded-xl hover:border-amber-400 hover:bg-amber-50 transition-all text-left group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full group-hover:scale-125 transition-transform"></div>
                  <span className="text-sm font-semibold">Video</span>
                </div>
                <p className="text-xs text-gray-500">Video showcase</p>
              </button>
            </div>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto p-6">
            <h4 className="font-bold text-gray-900 mb-4">Page Sections</h4>
            
            {sections.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Layout size={64} className="mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No sections yet</p>
                <p className="text-sm">Add your first section above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedSection === section.id
                        ? 'border-amber-500 bg-amber-50 shadow-lg'
                        : 'border-amber-200 hover:border-amber-300 hover:bg-amber-25'
                    }`}
                    onClick={() => setSelectedSection(section.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {section.title}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {section.type.replace('-', ' ')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateSection(section.id, { isActive: !section.isActive });
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            section.isActive 
                              ? 'text-green-600 hover:text-green-700 bg-green-50' 
                              : 'text-gray-400 hover:text-gray-600 bg-gray-50'
                          }`}
                        >
                          {section.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSection(section.id);
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center - Visual Builder */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-y-auto">
            <div className={`mx-auto transition-all duration-500 ${
              deviceMode === 'mobile' ? 'max-w-sm' :
              deviceMode === 'tablet' ? 'max-w-2xl' :
              'max-w-5xl'
            }`}>
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-amber-200/50">
                {sections.length === 0 ? (
                  <div className="text-center py-20">
                    <Crown size={80} className="mx-auto mb-6 text-amber-300" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Start Building Your Luxury Page
                    </h3>
                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                      Add premium sections from the library to create your sophisticated content
                    </p>
                    <button
                      onClick={() => setShowTemplates(true)}
                      className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
                    >
                      <Star size={20} />
                      Choose Premium Template
                    </button>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {sections.map((section) => (
                      <div
                        key={section.id}
                        className={`relative ${
                          selectedSection === section.id ? 'ring-4 ring-amber-500 ring-opacity-50' : ''
                        }`}
                        onClick={() => setSelectedSection(section.id)}
                      >
                        {/* Section Preview */}
                        <div 
                          className="min-h-[250px] flex items-center justify-center relative overflow-hidden"
                          style={{ backgroundColor: section.settings.backgroundColor }}
                        >
                          <div className="text-center z-10">
                            <h4 className="text-2xl font-bold mb-3" style={{ color: section.settings.textColor }}>
                              {section.title}
                            </h4>
                            <p className="text-lg opacity-75 mb-2" style={{ color: section.settings.textColor }}>
                              {section.type.replace('-', ' ')} • {section.layout}
                            </p>
                            {!section.isActive && (
                              <div className="mt-3 px-4 py-2 bg-gray-200 text-gray-600 text-sm rounded-full inline-block">
                                Inactive
                              </div>
                            )}
                          </div>
                          
                          {/* Luxury Background Pattern */}
                          <div className="absolute inset-0 opacity-5">
                            <div className="absolute inset-0" style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                            }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Section Properties */}
        {selectedSection && (
          <div className="w-96 bg-white/80 backdrop-blur-sm border-l border-amber-200/50 overflow-y-auto">
            <div className="p-6 border-b border-amber-200/50">
              <h3 className="font-bold text-gray-900 text-lg">Section Properties</h3>
            </div>
            
            <div className="p-6 space-y-8">
              {/* Basic Properties */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Basic Settings</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={sections.find(s => s.id === selectedSection)?.title || ''}
                      onChange={(e) => updateSection(selectedSection, { title: e.target.value })}
                      className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Layout
                    </label>
                    <select
                      value={sections.find(s => s.id === selectedSection)?.layout || 'default'}
                      onChange={(e) => updateSection(selectedSection, { layout: e.target.value as any })}
                      className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 text-sm focus:border-amber-500 focus:outline-none transition-colors"
                    >
                      <option value="default">Default</option>
                      <option value="luxury">Luxury</option>
                      <option value="minimal">Minimal</option>
                      <option value="heroic">Heroic</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Styling */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Styling</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={sections.find(s => s.id === selectedSection)?.settings.backgroundColor || '#ffffff'}
                      onChange={(e) => updateSection(selectedSection, { 
                        settings: { 
                          ...sections.find(s => s.id === selectedSection)?.settings,
                          backgroundColor: e.target.value 
                        }
                      })}
                      className="w-full h-12 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={sections.find(s => s.id === selectedSection)?.settings.textColor || '#000000'}
                      onChange={(e) => updateSection(selectedSection, { 
                        settings: { 
                          ...sections.find(s => s.id === selectedSection)?.settings,
                          textColor: e.target.value 
                        }
                      })}
                      className="w-full h-12 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Advanced</h4>
                <div className="space-y-4">
                  <label className="flex items-center p-3 border-2 border-amber-200 rounded-xl hover:border-amber-300 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sections.find(s => s.id === selectedSection)?.isActive || false}
                      onChange={(e) => updateSection(selectedSection, { isActive: e.target.checked })}
                      className="mr-3 w-4 h-4 text-amber-600 border-amber-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Section</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Templates Modal */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-8 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8 border-b border-amber-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Crown className="text-amber-600" size={32} />
                    <h2 className="text-2xl font-bold text-gray-900">Premium Templates</h2>
                  </div>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border-2 border-amber-200 rounded-2xl overflow-hidden hover:border-amber-400 transition-all cursor-pointer group hover:shadow-xl"
                      onClick={() => applyTemplate(template)}
                    >
                      <div className="h-48 bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center relative overflow-hidden">
                        <div className="text-center">
                          <Crown size={48} className="mx-auto mb-3 text-amber-400 group-hover:scale-110 transition-transform" />
                          <p className="text-lg font-semibold text-gray-700">{template.name}</p>
                        </div>
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold rounded-full">
                            PREMIUM
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">{template.name}</h3>
                        <p className="text-gray-500 mb-4">{template.description}</p>
                        <button className="text-amber-600 hover:text-amber-700 font-bold text-sm flex items-center gap-2">
                          <Star size={14} />
                          Use Template
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}



