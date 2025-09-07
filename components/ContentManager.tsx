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
  Move, 
  Video, 
  Image as ImageIcon,
  Save,
  X,
  Upload
} from 'lucide-react';

interface ContentItem {
  _id: string;
  type: 'hero' | 'product-showcase' | 'product-section' | 'video-showcase' | 'testimonial-grid' | 'feature-highlight' | 'gallery-showcase';
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
  layout?: string;
  settings?: {
    overlayOpacity?: number;
    textColor?: string;
    backgroundColor?: string;
    animation?: string;
    layout?: string;
    textAlignment?: string;
    buttonStyle?: string;
    cardStyle?: string;
    showPrices?: boolean;
    showCategories?: boolean;
    showAvatars?: boolean;
    showRatings?: boolean;
    showIcons?: boolean;
    showOverlays?: boolean;
    videoStyle?: string;
    showControls?: boolean;
    autoplay?: boolean;
    loop?: boolean;
    iconStyle?: string;
    imageStyle?: string;
    hoverEffect?: string;
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
  createdAt: string;
  updatedAt: string;
}

interface ContentFormData {
  type: 'hero' | 'product-showcase' | 'product-section' | 'video-showcase' | 'testimonial-grid' | 'feature-highlight' | 'gallery-showcase';
  title: string;
  subtitle: string;
  description: string;
  media: {
    type: 'video' | 'image';
    url: string;
    alt: string;
    poster: string;
  };
  buttonText: string;
  buttonLink: string;
  productSelection: {
    productIds: string[];
    category: string;
    limit: number;
    sortBy: string;
    sortOrder: string;
    showOutOfStock: boolean;
    featuredOnly: boolean;
  };
  layout?: string;
  settings: {
    overlayOpacity: number;
    textColor: string;
    backgroundColor: string;
    animation: string;
    layout: string;
    textAlignment: string;
    buttonStyle: string;
    cardStyle: string;
    showPrices: boolean;
    showCategories: boolean;
    showAvatars: boolean;
    showRatings: boolean;
    showIcons: boolean;
    showOverlays: boolean;
    videoStyle: string;
    showControls: boolean;
    autoplay: boolean;
    loop: boolean;
    iconStyle: string;
    imageStyle: string;
    hoverEffect: string;
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

export default function ContentManager() {
  const { data: session, status } = useSession();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ContentFormData>({
    type: 'hero',
    title: '',
    subtitle: '',
    description: '',
    media: {
      type: 'image',
      url: '',
      alt: '',
      poster: ''
    },
    buttonText: '',
    buttonLink: '',
    productSelection: {
      productIds: [],
      category: '',
      limit: 6,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      showOutOfStock: false,
      featuredOnly: false
    },
    layout: 'default',
    settings: {
      overlayOpacity: 0.4,
      textColor: '#ffffff',
      backgroundColor: '',
      animation: 'fade',
      layout: 'default',
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
      iconStyle: 'default',
      imageStyle: 'default',
      hoverEffect: 'none'
    }
  });

  // Fetch content on component mount
  useEffect(() => {
    fetchContent();
    fetchProducts();
  }, []);

  const fetchContent = async () => {
    try {
      setLoading(true);
      console.log('Fetching content...');
      const response = await fetch('/api/content');
      console.log('Content response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Content data:', data);
        
        // Validate and clean the data
        const validContent = data.filter((item: any) => 
          item && item._id && item.type && item.title
        );
        
        console.log('Valid content items:', validContent.length);
        setContent(validContent);
      } else {
        console.error('Failed to fetch content:', response.status, response.statusText);
        setContent([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      setContent([]); // Set empty array on error
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
      } else {
        console.error('Failed to fetch products');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingId 
        ? `/api/content/${editingId}`
        : '/api/content';
      
      const method = editingId ? 'PUT' : 'POST';
      
      console.log('Submitting content:', { method, url, formData });
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        const result = await response.json();
        console.log('Content saved successfully:', result);
        await fetchContent();
        resetForm();
        setShowForm(false);
      } else {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          
          if (errorData.error) {
            errorMessage = errorData.error;
            if (errorData.details) {
              errorMessage += ` - ${Array.isArray(errorData.details) ? errorData.details.join(', ') : errorData.details}`;
            }
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (Object.keys(errorData).length > 0) {
            errorMessage = JSON.stringify(errorData);
          }
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          // Try to get text response
          try {
            const textError = await response.text();
            if (textError) {
              errorMessage = textError;
            }
          } catch (textError) {
            console.error('Failed to get text response:', textError);
          }
        }
        
        console.error('Failed to save content:', errorMessage);
        alert(`Failed to save content: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Network error saving content:', error);
      alert(`Network error saving content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleEdit = (item: ContentItem) => {
    setEditingId(item._id);
    setFormData({
      type: item.type,
      title: item.title,
      subtitle: item.subtitle || '',
      description: item.description || '',
      media: {
        type: item.media?.type || 'image',
        url: item.media?.url || '',
        alt: item.media?.alt || '',
        poster: item.media?.poster || ''
      },
      buttonText: item.buttonText || '',
      buttonLink: item.buttonLink || '',
      productSelection: {
        productIds: item.productSelection?.productIds || [],
        category: item.productSelection?.category || '',
        limit: item.productSelection?.limit || 6,
        sortBy: item.productSelection?.sortBy || 'createdAt',
        sortOrder: item.productSelection?.sortOrder || 'desc',
        showOutOfStock: item.productSelection?.showOutOfStock || false,
        featuredOnly: item.productSelection?.featuredOnly || false
      },
      layout: item.layout || 'default',
      settings: {
        overlayOpacity: item.settings?.overlayOpacity || 0.4,
        textColor: item.settings?.textColor || '#ffffff',
        backgroundColor: item.settings?.backgroundColor || '',
        animation: item.settings?.animation || 'fade',
        layout: item.settings?.layout || 'default',
        textAlignment: item.settings?.textAlignment || 'left',
        buttonStyle: item.settings?.buttonStyle || 'primary',
        cardStyle: item.settings?.cardStyle || 'default',
        showPrices: item.settings?.showPrices ?? true,
        showCategories: item.settings?.showCategories ?? true,
        showAvatars: item.settings?.showAvatars ?? true,
        showRatings: item.settings?.showRatings ?? true,
        showIcons: item.settings?.showIcons ?? true,
        showOverlays: item.settings?.showOverlays ?? true,
        videoStyle: item.settings?.videoStyle || 'default',
        showControls: item.settings?.showControls ?? true,
        autoplay: item.settings?.autoplay ?? false,
        loop: item.settings?.loop ?? true,
        iconStyle: item.settings?.iconStyle || 'default',
        imageStyle: item.settings?.imageStyle || 'default',
        hoverEffect: item.settings?.hoverEffect || 'none'
      }
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return;
    
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/content/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
      
      if (response.ok) {
        await fetchContent();
      }
    } catch (error) {
      console.error('Error toggling content status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'hero',
      title: '',
      subtitle: '',
      description: '',
      media: {
        type: 'image',
        url: '',
        alt: '',
        poster: ''
      },
      buttonText: '',
      buttonLink: '',
      productSelection: {
        productIds: [],
        category: '',
        limit: 6,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        showOutOfStock: false,
        featuredOnly: false
      },
      layout: 'default',
      settings: {
        overlayOpacity: 0.4,
        textColor: '#ffffff',
        backgroundColor: '',
        animation: 'fade',
        layout: 'default',
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
        iconStyle: 'default',
        imageStyle: 'default',
        hoverEffect: 'none'
      }
    });
    setEditingId(null);
  };

  const handleFileUpload = async (file: File, type: 'media' | 'poster') => {
    try {
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert(`File too large! Maximum size is 50MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
        return;
      }

      // Show upload progress
      const uploadButton = document.querySelector(`#${type === 'media' ? 'media-upload' : 'poster-upload'}`)?.nextElementSibling;
      if (uploadButton) {
        uploadButton.textContent = 'Uploading...';
        uploadButton.classList.add('opacity-50');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'content');
      
      console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
      
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch('/api/uploads', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      console.log('Upload response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Upload success:', data);
        
        if (type === 'media') {
          setFormData(prev => ({
            ...prev,
            media: { ...prev.media, url: data.url }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            media: { ...prev.media, poster: data.url }
          }));
        }
        
        // Show success message
        alert(`File uploaded successfully! Size: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      } else if (response.status === 401) {
        alert('Upload failed: You must be logged in as an admin to upload files. Please sign in first.');
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        alert('Upload failed: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Upload failed: Request timed out. Please try again.');
      } else {
        alert('Upload failed. Please try again. Error: ' + (error instanceof Error ? error.message : 'Unknown error'));
      }
    } finally {
      // Reset upload button
      const uploadButton = document.querySelector(`#${type === 'media' ? 'media-upload' : 'poster-upload'}`)?.nextElementSibling;
      if (uploadButton) {
        uploadButton.innerHTML = '<Upload size={16} />Upload';
        uploadButton.classList.remove('opacity-50');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Debug: Log content state
  console.log('ContentManager: Current content:', content);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">Content Management</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Add Content
        </button>
      </div>

      {/* Authentication Notice */}
      {status === 'loading' ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">Checking authentication...</p>
        </div>
      ) : !session || session.user?.role !== 'admin' ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Admin Access Required</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>You need to be logged in as an admin to manage content and upload files.</p>
                <p className="mt-1">
                  <strong>To fix this:</strong>
                </p>
                <ul className="mt-1 list-disc list-inside space-y-1">
                  <li>Click "SIGN OUT" in the top right if you're logged in</li>
                  <li>Go to <a href="/auth/signin" className="underline font-medium">Sign In</a></li>
                  <li>Sign in with admin credentials (email: admin@example.com, password: admin123)</li>
                  <li>Or create a new admin account in the Users tab</li>
                </ul>
                <p className="mt-2 text-xs">
                  <strong>Current status:</strong> {session ? `Logged in as ${session.user?.email} (${session.user?.role})` : 'Not logged in'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-800">
              <strong>Admin Access Granted</strong> - You can now manage content and upload files.
            </p>
          </div>
        </div>
      )}

      {/* Content Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingId ? 'Edit Content' : 'Add New Content'}
              </h3>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="hero">Hero Banner</option>
                    <option value="product-showcase">Product Showcase Section</option>
                    <option value="product-section">Product Section (Select Products)</option>
                    <option value="video-showcase">Video Showcase Section</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Media Type
                  </label>
                  <select
                    value={formData.media.type}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      media: { ...prev.media, type: e.target.value as 'video' | 'image' }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Media URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.media.url}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        media: { ...prev.media, url: e.target.value }
                      }))}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Enter URL or upload file"
                    />
                    <input
                      type="file"
                      accept={formData.media.type === 'video' ? 'video/*' : 'image/*'}
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'media')}
                      className="hidden"
                      id="media-upload"
                    />
                    <label
                      htmlFor="media-upload"
                      className="bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Upload
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alt Text
                  </label>
                  <input
                    type="text"
                    value={formData.media.alt}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      media: { ...prev.media, alt: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Description for accessibility"
                  />
                </div>
              </div>

              {formData.media.type === 'video' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Poster Image (for video)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.media.poster}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        media: { ...prev.media, poster: e.target.value }
                      }))}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                      placeholder="Enter poster URL or upload file"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'poster')}
                      className="hidden"
                      id="poster-upload"
                    />
                    <label
                      htmlFor="poster-upload"
                      className="bg-gray-100 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-200 flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Upload
                    </label>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., Shop Now, Learn More"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Link
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g., /shop, /about"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Overlay Opacity: {formData.settings.overlayOpacity}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={formData.settings.overlayOpacity}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, overlayOpacity: parseFloat(e.target.value) }
                    }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={formData.settings.textColor}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, textColor: e.target.value }
                    }))}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={formData.settings.backgroundColor}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, backgroundColor: e.target.value }
                    }))}
                    className="w-full h-10 border border-gray-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Animation
                  </label>
                  <select
                    value={formData.settings.animation}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      settings: { ...prev.settings, animation: e.target.value }
                    }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="fade">Fade</option>
                    <option value="slide">Slide</option>
                    <option value="zoom">Zoom</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              {/* Product Selection Interface */}
              {formData.type === 'product-section' && (
                <div className="border-t pt-6 mt-6">
                  <h4 className="text-lg font-semibold mb-4">Product Selection</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category Filter
                      </label>
                      <select
                        value={formData.productSelection.category}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          productSelection: { ...prev.productSelection, category: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="">All Categories</option>
                        <option value="Bags">Bags</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Home">Home</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Decor">Decor</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Maximum Products
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={formData.productSelection.limit}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          productSelection: { ...prev.productSelection, limit: parseInt(e.target.value) }
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                      </label>
                      <select
                        value={formData.productSelection.sortBy}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          productSelection: { ...prev.productSelection, sortBy: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="createdAt">Date Created</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="category">Category</option>
                        <option value="popularity">Popularity</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort Order
                      </label>
                      <select
                        value={formData.productSelection.sortOrder}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          productSelection: { ...prev.productSelection, sortOrder: e.target.value }
                        }))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.productSelection.showOutOfStock}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          productSelection: { ...prev.productSelection, showOutOfStock: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Show Out of Stock Products</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.productSelection.featuredOnly}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          productSelection: { ...prev.productSelection, featuredOnly: e.target.checked }
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">Featured Products Only</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Specific Products (Optional)
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                      {products.map((product) => (
                        <label key={product._id} className="flex items-center py-1">
                          <input
                            type="checkbox"
                            checked={formData.productSelection.productIds.includes(product._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  productSelection: {
                                    ...prev.productSelection,
                                    productIds: [...prev.productSelection.productIds, product._id]
                                  }
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  productSelection: {
                                    ...prev.productSelection,
                                    productIds: prev.productSelection.productIds.filter(id => id !== product._id)
                                  }
                                }));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            {product.name} - ${product.price} ({product.category})
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      If specific products are selected, they will override category and filter settings.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center gap-2"
                >
                  <Save size={16} />
                  {editingId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Current Content</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!content || content.length === 0 ? (
            <div className="col-span-full p-6 text-center text-gray-500">
              No content found. Create your first content item above.
            </div>
          ) : (
            content.map((item) => {
              // Safety check for item data
              if (!item || !item._id || !item.type) {
                console.warn('Invalid content item:', item);
                return null;
              }
              
              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className="group"
                >
                  {/* Content Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    {/* Media Preview Container */}
                    <div className="relative bg-gray-100 aspect-[3/4] overflow-hidden">
                      {item.media?.url ? (
                        item.media.type === 'video' ? (
                          <video
                            src={item.media.url}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                          />
                        ) : (
                          <img
                            src={item.media.url}
                            alt={item.title || 'Content media'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {item.media?.type === 'video' ? (
                            <Video size={48} className="text-gray-400" />
                          ) : (
                            <ImageIcon size={48} className="text-gray-400" />
                          )}
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.isActive 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Type Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-2 py-1 text-xs bg-gray-800 text-white rounded-full">
                          {item.type}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} className="text-blue-600" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Content Info */}
                    <div className="p-4 text-center">
                      <p className="font-body text-sm text-gray-500 uppercase tracking-wider mb-2">
                        {item.type}
                      </p>
                      <h3 className="font-heading text-lg font-medium text-black mb-1 group-hover:text-gray-700 transition-colors">
                        {item.title || 'Untitled'}
                      </h3>
                      {item.subtitle && (
                        <p className="font-body text-sm text-gray-600 mb-2">
                          {item.subtitle}
                        </p>
                      )}
                      <p className="font-body text-xs text-gray-400">
                        ID: {item._id.slice(-8)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            }).filter(Boolean) // Remove any null items
          )}
        </div>
      </div>
    </div>
  );
}
