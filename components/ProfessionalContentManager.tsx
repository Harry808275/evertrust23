'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Move, 
  Video, 
  Image as ImageIcon,
  Save,
  X,
  Upload,
  Layout,
  Palette,
  Settings,
  Grid,
  List,
  Monitor,
  Smartphone,
  Tablet,
  Copy,
  RotateCcw,
  Zap,
  Star,
  Heart,
  ShoppingBag,
  Users,
  Award,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Type,
  Image,
  Play,
  Pause,
  Volume2,
  VolumeX
} from 'lucide-react';

interface ContentSection {
  id: string;
  type: 'hero' | 'product-showcase' | 'product-section' | 'video-showcase' | 'testimonial-grid' | 'feature-highlight' | 'gallery-showcase' | 'brand-story' | 'newsletter' | 'instagram-feed';
  title: string;
  subtitle?: string;
  description?: string;
  media?: {
    type: 'video' | 'image' | 'slideshow';
    url: string;
    alt?: string;
    poster?: string;
    slides?: string[];
  };
  buttonText?: string;
  buttonLink?: string;
  productSelection?: {
    productIds: string[];
    category?: string;
    limit: number;
    sortBy: string;
    sortOrder: string;
    showOutOfStock: boolean;
    featuredOnly: boolean;
  };
  isActive: boolean;
  order: number;
  layout: 'default' | 'full-width-video' | 'video-center' | 'grid-2-columns' | 'grid-3-columns' | 'grid-4-columns' | 'masonry-grid' | 'carousel' | 'hero-split' | 'card-stack' | 'timeline' | 'zigzag';
  settings: {
    backgroundColor: string;
    textColor: string;
    overlayOpacity: number;
    animation: 'fade' | 'slide' | 'zoom' | 'stagger-fade' | 'slide-up' | 'zoom-in' | 'none';
    textAlignment: 'left' | 'center' | 'right' | 'justify';
    buttonStyle: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'gradient';
    cardStyle: 'default' | 'elevated' | 'minimal' | 'bordered' | 'glass' | 'floating';
    showPrices: boolean;
    showCategories: boolean;
    showAvatars: boolean;
    showRatings: boolean;
    showIcons: boolean;
    showOverlays: boolean;
    videoStyle: 'default' | 'cinematic' | 'minimal' | 'heroic' | 'parallax';
    showControls: boolean;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    iconStyle: 'default' | 'outlined' | 'filled' | 'duotone' | 'gradient';
    imageStyle: 'default' | 'rounded' | 'circular' | 'squared' | 'polaroid' | 'tilted';
    hoverEffect: 'none' | 'zoom' | 'lift' | 'glow' | 'shimmer' | 'tilt' | 'slide';
    spacing: 'compact' | 'comfortable' | 'spacious';
    padding: 'none' | 'small' | 'medium' | 'large';
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
    shadow: 'none' | 'small' | 'medium' | 'large' | 'extra';
  };
  items?: Array<{
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    description?: string;
    image?: string;
    price?: number;
    category?: string;
    link?: string;
    name?: string;
    role?: string;
    company?: string;
    content?: string;
    rating?: number;
    avatar?: string;
    icon?: string;
    isActive: boolean;
    order: number;
  }>;
}

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  sections: ContentSection[];
  category: 'hero' | 'product' | 'video' | 'testimonial' | 'gallery' | 'newsletter';
}

export default function ProfessionalContentManager() {
  const { data: session, status } = useSession();
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'builder' | 'preview' | 'code'>('builder');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [history, setHistory] = useState<ContentSection[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Professional Templates
  const templates: Template[] = [
    {
      id: 'luxury-hero',
      name: 'Luxury Hero Banner',
      description: 'Elegant full-screen hero with video background',
      thumbnail: '/templates/luxury-hero.jpg',
      category: 'hero',
      sections: [{
        id: 'hero-1',
        type: 'hero',
        title: 'STYLE AT HOME',
        subtitle: 'Discover timeless elegance and sophisticated design',
        description: 'Experience luxury living with our curated collection',
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
        layout: 'hero-split',
        settings: {
          backgroundColor: '#000000',
          textColor: '#ffffff',
          overlayOpacity: 0.3,
          animation: 'fade',
          textAlignment: 'center',
          buttonStyle: 'gradient',
          cardStyle: 'glass',
          showPrices: true,
          showCategories: true,
          showAvatars: true,
          showRatings: true,
          showIcons: true,
          showOverlays: true,
          videoStyle: 'cinematic',
          showControls: false,
          autoplay: true,
          loop: true,
          muted: true,
          iconStyle: 'gradient',
          imageStyle: 'rounded',
          hoverEffect: 'lift',
          spacing: 'spacious',
          padding: 'large',
          borderRadius: 'medium',
          shadow: 'large'
        }
      }]
    },
    {
      id: 'product-showcase',
      name: 'Product Showcase Grid',
      description: 'Professional product grid with hover effects',
      thumbnail: '/templates/product-showcase.jpg',
      category: 'product',
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
        layout: 'grid-4-columns',
        productSelection: {
          productIds: [],
          category: '',
          limit: 8,
          sortBy: 'createdAt',
          sortOrder: 'desc',
          showOutOfStock: false,
          featuredOnly: false
        },
        settings: {
          backgroundColor: '#f8f9fa',
          textColor: '#000000',
          overlayOpacity: 0.4,
          animation: 'stagger-fade',
          textAlignment: 'center',
          buttonStyle: 'primary',
          cardStyle: 'elevated',
          showPrices: true,
          showCategories: true,
          showAvatars: true,
          showRatings: true,
          showIcons: true,
          showOverlays: true,
          videoStyle: 'default',
          showControls: true,
          autoplay: false,
          loop: true,
          muted: true,
          iconStyle: 'outlined',
          imageStyle: 'rounded',
          hoverEffect: 'zoom',
          spacing: 'comfortable',
          padding: 'medium',
          borderRadius: 'medium',
          shadow: 'medium'
        }
      }]
    },
    {
      id: 'video-showcase',
      name: 'Video Showcase',
      description: 'Immersive video section with overlay text',
      thumbnail: '/templates/video-showcase.jpg',
      category: 'video',
      sections: [{
        id: 'video-1',
        type: 'video-showcase',
        title: 'Luxury Living Experience',
        subtitle: 'See our products in action',
        description: 'Watch how our premium products transform your space',
        media: {
          type: 'video',
          url: '/lv-hero.mp4',
          alt: 'Luxury Living Video',
          poster: '/lv-trainer-front.avif'
        },
        buttonText: 'Learn More',
        buttonLink: '/about',
        isActive: true,
        order: 1,
        layout: 'full-width-video',
        settings: {
          backgroundColor: '#1a1a1a',
          textColor: '#ffffff',
          overlayOpacity: 0.4,
          animation: 'slide-up',
          textAlignment: 'center',
          buttonStyle: 'outline',
          cardStyle: 'glass',
          showPrices: true,
          showCategories: true,
          showAvatars: true,
          showRatings: true,
          showIcons: true,
          showOverlays: true,
          videoStyle: 'heroic',
          showControls: true,
          autoplay: false,
          loop: true,
          muted: true,
          iconStyle: 'filled',
          imageStyle: 'default',
          hoverEffect: 'glow',
          spacing: 'spacious',
          padding: 'large',
          borderRadius: 'none',
          shadow: 'extra'
        }
      }]
    }
  ];

  // Fetch data on component mount
  useEffect(() => {
    fetchSections();
    fetchProducts();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (autoSave && sections.length > 0) {
      const timeoutId = setTimeout(() => {
        saveSections();
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [sections, autoSave]);

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
        addToHistory(validSections);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToHistory = (newSections: ContentSection[]) => {
    const newHistory = [...history.slice(0, historyIndex + 1), newSections];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setSections(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setSections(history[historyIndex + 1]);
    }
  };

  const saveSections = async () => {
    try {
      // Save each section
      for (const section of sections) {
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(section)
        });
        if (!response.ok) {
          throw new Error(`Failed to save section: ${section.title}`);
        }
      }
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error saving sections:', error);
    }
  };

  const applyTemplate = (template: Template) => {
    setSections(template.sections);
    addToHistory(template.sections);
    setShowTemplates(false);
  };

  const addSection = (type: ContentSection['type']) => {
    const newSection: ContentSection = {
      id: `section-${Date.now()}`,
      type,
      title: `New ${type.replace('-', ' ')}`,
      isActive: true,
      order: sections.length + 1,
      layout: 'default',
      settings: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        overlayOpacity: 0.4,
        animation: 'fade',
        textAlignment: 'left',
        buttonStyle: 'primary',
        cardStyle: 'default',
        showPrices: true,
        showCategories: true,
        showAvatars: true,
        showRatings: true,
        showIcons: true,
        showOverlays: true,
        videoStyle: 'default',
        showControls: true,
        autoplay: false,
        loop: true,
        muted: true,
        iconStyle: 'default',
        imageStyle: 'default',
        hoverEffect: 'none',
        spacing: 'comfortable',
        padding: 'medium',
        borderRadius: 'small',
        shadow: 'small'
      }
    };
    
    const newSections = [...sections, newSection];
    setSections(newSections);
    addToHistory(newSections);
    setSelectedSection(newSection.id);
  };

  const updateSection = (id: string, updates: Partial<ContentSection>) => {
    const newSections = sections.map(section => 
      section.id === id ? { ...section, ...updates } : section
    );
    setSections(newSections);
    addToHistory(newSections);
  };

  const deleteSection = (id: string) => {
    const newSections = sections.filter(section => section.id !== id);
    setSections(newSections);
    addToHistory(newSections);
    if (selectedSection === id) {
      setSelectedSection(null);
    }
  };

  const duplicateSection = (id: string) => {
    const section = sections.find(s => s.id === id);
    if (section) {
      const duplicated = {
        ...section,
        id: `section-${Date.now()}`,
        title: `${section.title} (Copy)`,
        order: sections.length + 1
      };
      const newSections = [...sections, duplicated];
      setSections(newSections);
      addToHistory(newSections);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Professional Content Manager...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Professional Content Builder</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>•</span>
              <span>Luxury Brand CMS</span>
              <span>•</span>
              <span>Visual Editor</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('builder')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'builder' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Layout size={16} className="inline mr-1" />
                Builder
              </button>
              <button
                onClick={() => setViewMode('preview')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'preview' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Eye size={16} className="inline mr-1" />
                Preview
              </button>
            </div>

            {/* Device Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setDeviceMode('desktop')}
                className={`px-2 py-1 rounded-md text-sm transition-colors ${
                  deviceMode === 'desktop' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Desktop"
              >
                <Monitor size={16} />
              </button>
              <button
                onClick={() => setDeviceMode('tablet')}
                className={`px-2 py-1 rounded-md text-sm transition-colors ${
                  deviceMode === 'tablet' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tablet"
              >
                <Tablet size={16} />
              </button>
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`px-2 py-1 rounded-md text-sm transition-colors ${
                  deviceMode === 'mobile' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Mobile"
              >
                <Smartphone size={16} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                title="Undo"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                title="Redo"
              >
                <RotateCcw size={16} className="rotate-180" />
              </button>
              <button
                onClick={saveSections}
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2"
              >
                <Save size={16} />
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span>Auto-save: {autoSave ? 'ON' : 'OFF'}</span>
            {lastSaved && (
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
            )}
            <span>{sections.length} sections</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowTemplates(true)}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              <Star size={14} className="inline mr-1" />
              Templates
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Settings size={14} className="inline mr-1" />
              Settings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Section Library */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Section Library</h3>
            
            {/* Quick Add Buttons */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => addSection('hero')}
                className="p-3 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Hero</span>
                </div>
                <p className="text-xs text-gray-500">Full-screen banner</p>
              </button>
              
              <button
                onClick={() => addSection('product-section')}
                className="p-3 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium">Products</span>
                </div>
                <p className="text-xs text-gray-500">Product grid</p>
              </button>
              
              <button
                onClick={() => addSection('video-showcase')}
                className="p-3 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">Video</span>
                </div>
                <p className="text-xs text-gray-500">Video showcase</p>
              </button>
              
              <button
                onClick={() => addSection('testimonial-grid')}
                className="p-3 border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm font-medium">Reviews</span>
                </div>
                <p className="text-xs text-gray-500">Customer testimonials</p>
              </button>
            </div>

            {/* More Section Types */}
            <div className="space-y-2">
              {[
                { type: 'brand-story', name: 'Brand Story', icon: Heart },
                { type: 'newsletter', name: 'Newsletter', icon: Users },
                { type: 'instagram-feed', name: 'Instagram', icon: TrendingUp },
                { type: 'feature-highlight', name: 'Features', icon: Award }
              ].map(({ type, name, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => addSection(type as any)}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-gray-400" />
                    <span className="text-sm font-medium">{name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Section List */}
          <div className="flex-1 overflow-y-auto p-4">
            <h4 className="font-medium text-gray-900 mb-3">Page Sections</h4>
            
            {sections.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Layout size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No sections yet</p>
                <p className="text-xs">Add your first section above</p>
              </div>
            ) : (
              <Reorder.Group
                axis="y"
                values={sections}
                onReorder={setSections}
                className="space-y-2"
              >
                {sections.map((section) => (
                  <Reorder.Item
                    key={section.id}
                    value={section}
                    className="relative"
                  >
                    <div
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedSection === section.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedSection(section.id)}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-gray-400 cursor-grab" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
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
                            className={`p-1 rounded ${
                              section.isActive 
                                ? 'text-green-600 hover:text-green-700' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          >
                            {section.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateSection(section.id);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSection(section.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            )}
          </div>
        </div>

        {/* Center - Visual Builder */}
        <div className="flex-1 flex flex-col">
          {viewMode === 'builder' ? (
            <>
              {/* Canvas */}
              <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                <div className={`mx-auto transition-all duration-300 ${
                  deviceMode === 'mobile' ? 'max-w-sm' :
                  deviceMode === 'tablet' ? 'max-w-2xl' :
                  'max-w-4xl'
                }`}>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {sections.length === 0 ? (
                      <div className="text-center py-16">
                        <Layout size={64} className="mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          Start Building Your Page
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Add sections from the library to create your content
                        </p>
                        <button
                          onClick={() => setShowTemplates(true)}
                          className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700"
                        >
                          <Star size={16} className="inline mr-2" />
                          Choose Template
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-0">
                        {sections.map((section, index) => (
                          <div
                            key={section.id}
                            className={`relative ${
                              selectedSection === section.id ? 'ring-2 ring-amber-500' : ''
                            }`}
                            onClick={() => setSelectedSection(section.id)}
                          >
                            {/* Section Preview */}
                            <div 
                              className="min-h-[200px] flex items-center justify-center"
                              style={{ backgroundColor: section.settings.backgroundColor }}
                            >
                              <div className="text-center">
                                <h4 className="text-lg font-medium mb-2" style={{ color: section.settings.textColor }}>
                                  {section.title}
                                </h4>
                                <p className="text-sm opacity-75" style={{ color: section.settings.textColor }}>
                                  {section.type.replace('-', ' ')} • {section.layout}
                                </p>
                                {!section.isActive && (
                                  <div className="mt-2 px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">
                                    Inactive
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Section Controls */}
                            {selectedSection === section.id && (
                              <div className="absolute top-2 right-2 flex gap-1">
                                <button className="p-1 bg-white/90 rounded shadow-sm">
                                  <Move size={12} />
                                </button>
                                <button className="p-1 bg-white/90 rounded shadow-sm">
                                  <Settings size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Preview Mode */
            <div className="flex-1 bg-white">
              <div className={`mx-auto transition-all duration-300 ${
                deviceMode === 'mobile' ? 'max-w-sm' :
                deviceMode === 'tablet' ? 'max-w-2xl' :
                'max-w-4xl'
              }`}>
                {/* Preview content would go here */}
                <div className="p-8 text-center text-gray-500">
                  <Monitor size={48} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">Live Preview</h3>
                  <p>Preview your page as it will appear to visitors</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Section Properties */}
        {selectedSection && (
          <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Section Properties</h3>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Basic Properties */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Basic Settings</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={sections.find(s => s.id === selectedSection)?.title || ''}
                      onChange={(e) => updateSection(selectedSection, { title: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Layout
                    </label>
                    <select
                      value={sections.find(s => s.id === selectedSection)?.layout || 'default'}
                      onChange={(e) => updateSection(selectedSection, { layout: e.target.value as any })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="default">Default</option>
                      <option value="full-width-video">Full Width Video</option>
                      <option value="grid-2-columns">2 Column Grid</option>
                      <option value="grid-3-columns">3 Column Grid</option>
                      <option value="grid-4-columns">4 Column Grid</option>
                      <option value="carousel">Carousel</option>
                      <option value="hero-split">Hero Split</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Styling */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Styling</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                      className="w-full h-10 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Animation
                    </label>
                    <select
                      value={sections.find(s => s.id === selectedSection)?.settings.animation || 'fade'}
                      onChange={(e) => updateSection(selectedSection, { 
                        settings: { 
                          ...sections.find(s => s.id === selectedSection)?.settings,
                          animation: e.target.value as any 
                        }
                      })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="fade">Fade</option>
                      <option value="slide">Slide</option>
                      <option value="zoom">Zoom</option>
                      <option value="stagger-fade">Stagger Fade</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Advanced Settings */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Advanced</h4>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={sections.find(s => s.id === selectedSection)?.isActive || false}
                      onChange={(e) => updateSection(selectedSection, { isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Active Section</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={autoSave}
                      onChange={(e) => setAutoSave(e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Auto-save</span>
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowTemplates(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Professional Templates</h2>
                  <button
                    onClick={() => setShowTemplates(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:border-amber-300 transition-colors cursor-pointer"
                      onClick={() => applyTemplate(template)}
                    >
                      <div className="h-48 bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <Layout size={48} className="mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">{template.name}</p>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400 capitalize">{template.category}</span>
                          <button className="text-amber-600 hover:text-amber-700 text-sm font-medium">
                            Use Template
                          </button>
                        </div>
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



















