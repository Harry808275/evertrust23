'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  Users, 
  ShoppingBag, 
  DollarSign, 
  BarChart3,
  Truck,
  CheckCircle,
  AlertTriangle,
  Eye,
  Search,
  Megaphone,
  Filter,
  ShoppingCart,
  TrendingUp,
  Shield
} from 'lucide-react';
import PerformanceMonitor from './PerformanceMonitor';
import CJImporter from './CJImporter';
import ABTesting from './ABTesting';
import AnalyticsSummary from './AnalyticsSummary';
import AdvancedProductManager from './AdvancedProductManager';
import ProfessionalOrdersTable from './ProfessionalOrdersTable';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  inStock: boolean;
  createdAt: string;
}

interface Order {
  _id: string;
  id?: string;
  userId: string;
  customerEmail?: string;
  customerPhone?: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    name: string;
    image: string;
  }>;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    firstName: string;
    lastName: string;
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    fullAddress: string;
  };
  itemsCount: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
}

type TabType = 'products' | 'orders' | 'users' | 'analytics' | 'content' | 'marketing' | 'integrations';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Load saved state from localStorage
  const getSavedState = () => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem('adminDashboardState');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading saved state:', error);
      return null;
    }
  };

  const savedState = getSavedState();
  
  const [activeTab, setActiveTab] = useState<TabType>(savedState?.activeTab || 'products');
  
  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // Server-side pagination states
  const [ordersPage, setOrdersPage] = useState(savedState?.ordersPage || 1);
  const [ordersTotalPages, setOrdersTotalPages] = useState(1);
  const [ordersPageSize, setOrdersPageSize] = useState(savedState?.ordersPageSize || 20);
  const [usersPage, setUsersPage] = useState(savedState?.usersPage || 1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersPageSize, setUsersPageSize] = useState(savedState?.usersPageSize || 20);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTab, setIsLoadingTab] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Error states
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState(savedState?.searchTerm || '');
  const [selectedCategory, setSelectedCategory] = useState(savedState?.selectedCategory || 'all');
  const [selectedStatus, setSelectedStatus] = useState(savedState?.selectedStatus || 'all');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Bags',
    stock: '',
    images: [''],
  });

  // File upload state
  const [isUploading, setIsUploading] = useState(false);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsPeriod, setAnalyticsPeriod] = useState(savedState?.analyticsPeriod || '30');
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  // Save state to localStorage
  const saveState = () => {
    if (typeof window === 'undefined') return;
    try {
      const stateToSave = {
        activeTab,
        ordersPage,
        ordersPageSize,
        usersPage,
        usersPageSize,
        searchTerm,
        selectedCategory,
        selectedStatus,
        analyticsPeriod,
        timestamp: Date.now()
      };
      localStorage.setItem('adminDashboardState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Error saving state:', error);
    }
  };

  // Save state whenever important values change
  useEffect(() => {
    saveState();
  }, [activeTab, ordersPage, ordersPageSize, usersPage, usersPageSize, searchTerm, selectedCategory, selectedStatus, analyticsPeriod]);

  // Prevent scroll jumping during tab changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Temporarily disable smooth scrolling during tab changes
    const originalScrollBehavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Re-enable smooth scrolling after a short delay
    const timer = setTimeout(() => {
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.documentElement.style.scrollBehavior = originalScrollBehavior;
    };
  }, [activeTab]);

  // Restore scroll position on component mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const savedScrollY = sessionStorage.getItem('adminDashboardScrollY');
    if (savedScrollY) {
      // Show a brief indicator that state is being restored
      const indicator = document.createElement('div');
      indicator.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg z-50 text-sm';
      indicator.textContent = 'Restoring previous state...';
      document.body.appendChild(indicator);
      
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScrollY));
        // Remove indicator after scroll
        setTimeout(() => {
          if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
          }
        }, 500);
      }, 100);
    }

    // Save scroll position before page unload
    const handleBeforeUnload = () => {
      sessionStorage.setItem('adminDashboardScrollY', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);


  // Check authentication and admin role
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.replace('/auth/signin');
      return;
    }
    
    if (session.user.role !== 'admin') {
      router.replace('/');
      return;
    }
    
    fetchData();
  }, [session, status, router]);

  // Fetch analytics when period changes
  useEffect(() => {
    if (activeTab === 'analytics' && analyticsPeriod) {
      fetchAnalytics();
    }
  }, [analyticsPeriod]);



  // Clear saved state function
  const clearSavedState = () => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('adminDashboardState');
      // Clear all scroll positions
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('adminScroll_')) {
          sessionStorage.removeItem(key);
        }
      });
      sessionStorage.removeItem('adminDashboardScrollY');
      
      // Show success message
      setSuccessMessage('Dashboard state has been reset successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error clearing saved state:', error);
      setError('Failed to reset dashboard state');
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load only products on initial mount; lazy-load others on tab switch
      await fetchProducts();
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=200&page=1');
      if (response.ok) {
        const data = await response.json();
        const items: Product[] = Array.isArray(data) ? data : (data?.items ?? []);
        setProducts(items);
      } else {
        throw new Error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const fetchOrders = async (page: number = 1, limit: number = ordersPageSize) => {
    try {
      const response = await fetch(`/api/admin/orders?page=${page}&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
        if (data.pagination) {
          setOrdersPage(data.pagination.currentPage || page);
          setOrdersTotalPages(data.pagination.totalPages || 1);
        }
      } else {
        throw new Error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  };

  const fetchUsers = async (page: number = 1, limit: number = usersPageSize) => {
    try {
      const response = await fetch(`/api/admin/users?page=${page}&limit=${limit}`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
        if (data.pagination) {
          setUsersPage(data.pagination.currentPage || page);
          setUsersTotalPages(data.pagination.totalPages || 1);
        }
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/admin/analytics?period=${analyticsPeriod}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAnalyticsData(data.data);
        } else {
          throw new Error('Failed to fetch analytics data');
        }
      } else {
        throw new Error('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data');
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const refreshAnalytics = () => {
    fetchAnalytics();
  };

  const handleTabChange = async (tab: TabType) => {
    // Save current scroll position for the active tab
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`adminScroll_${activeTab}`, window.scrollY.toString());
    }
    
    // Get the current scroll position before changing tabs
    const currentScrollY = typeof window !== 'undefined' ? window.scrollY : 0;
    
    // Lock scroll position during tab change
    if (typeof window !== 'undefined') {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentScrollY}px`;
      document.body.style.width = '100%';
    }
    
    setActiveTab(tab);
    setIsLoadingTab(true);
    setError(null);
    
    try {
      // Fetch data for the selected tab if not already loaded
      switch (tab) {
        case 'orders':
          if (orders.length === 0) await fetchOrders(ordersPage, ordersPageSize);
          break;
        case 'users':
          if (users.length === 0) await fetchUsers(usersPage, usersPageSize);
          break;
        case 'analytics':
          if (!analyticsData) await fetchAnalytics();
          break;
        case 'content':
          // No specific data fetch needed for ContentManager, it's a static component
          break;
        case 'marketing':
          // No specific data fetch needed for Marketing, it's a static component
          break;
      }
    } catch (err) {
      setError(`Failed to load ${tab} data`);
    } finally {
      setIsLoadingTab(false);
      
      // Unlock scroll and restore position after tab change
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          // Restore body styles
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          
          // Restore scroll position
          const savedScroll = sessionStorage.getItem(`adminScroll_${tab}`);
          if (savedScroll) {
            window.scrollTo(0, parseInt(savedScroll));
          } else {
            window.scrollTo(0, currentScrollY);
          }
        }
      }, 100);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: formData.images.filter(img => img.trim() !== ''),
      };

      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        setSuccessMessage(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        setShowForm(false);
        setEditingProduct(null);
        resetForm();
        await fetchProducts();
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save product');
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: (product.price ?? 0).toString(),
      category: product.category,
      stock: (product.stock ?? 0).toString(),
      images: Array.isArray(product.images) && product.images.length > 0 ? product.images : [''],
    });
    setShowForm(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSuccessMessage('Product deleted successfully!');
        await fetchProducts();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete product');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        setSuccessMessage('Order status updated successfully!');
        await fetchOrders();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update order status');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update order status');
      console.error('Error updating order status:', error);
    }
  };

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });
      
      if (response.ok) {
        setSuccessMessage('User role updated successfully!');
        await fetchUsers();
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user role');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update user role');
      console.error('Error updating user role:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Bags',
      stock: '',
      images: [''],
    });
    setError(null);
    setSuccessMessage(null);
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ''],
    }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImageField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img),
    }));
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        throw new Error(`File too large! Maximum size is 50MB. Your file is ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'products');
      
      const uploadRes = await fetch('/api/uploads', { 
        method: 'POST', 
        body: formData 
      });
      
      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.error || 'Upload failed');
      }
      
      const data = await uploadRes.json();
      return data.url as string;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const uploads = Array.from(files).map((f) => uploadImage(f));
      const urls = await Promise.all(uploads);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
      setSuccessMessage('Images uploaded successfully');
      setTimeout(() => setSuccessMessage(null), 2500);
    } catch (e) {
      setError('Some images failed to upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Filter functions
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'processing': return <Package size={16} className="text-blue-500" />;
      case 'shipped': return <Truck size={16} className="text-purple-500" />;
      case 'delivered': return <CheckCircle size={16} className="text-green-500" />;
      case 'cancelled': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Package size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-4xl md:text-5xl font-light text-black mb-4 tracking-wide">
                Admin Dashboard
              </h1>
              <p className="font-body text-lg text-gray-600">
                Manage your Style at Home collection with professional tools
              </p>
            </div>
            <button
              onClick={clearSavedState}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm"
              title="Reset dashboard state and scroll positions"
            >
              Reset Dashboard
            </button>
          </div>
        </motion.div>

        {/* Success/Error Messages */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <CheckCircle className="text-green-500 mr-3" size={20} />
              <p className="text-green-800 font-medium">{successMessage}</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <AlertTriangle className="text-red-500 mr-3" size={20} />
              <p className="text-red-800 font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-100 rounded-lg">
                <Package size={24} className="text-amber-600" />
              </div>
              <div>
                <p className="font-body text-sm text-gray-600">Total Products</p>
                <p className="font-heading text-2xl font-medium text-black">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="font-body text-sm text-gray-600">Total Orders</p>
                <p className="font-heading text-2xl font-medium text-black">{orders.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="font-body text-sm text-gray-600">Total Users</p>
                <p className="font-heading text-2xl font-medium text-black">{users.length}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'products', label: 'Products', icon: Package },
                { id: 'orders', label: 'Orders', icon: ShoppingBag },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                { id: 'marketing', label: 'Marketing', icon: Megaphone },
                { id: 'integrations', label: 'Integrations', icon: Shield }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as TabType)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-96"
          style={{ 
            minHeight: 'calc(100vh - 400px)', // Ensure consistent height
            scrollBehavior: 'auto' // Disable smooth scrolling during tab changes
          }}
        >
          {isLoadingTab ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
                <p className="text-gray-600 text-sm">Loading...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Products Tab */}
              {activeTab === 'products' && (
                <div>
                  {/* Header with Add Button and Search */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                      <div className="flex-1 max-w-md">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none"
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="px-4 py-2 border border-gray-200 rounded-lg focus:border-amber-400 focus:outline-none"
                        >
                          <option value="all">All Categories</option>
                          <option value="Bags">Bags</option>
                          <option value="Accessories">Accessories</option>
                          <option value="Home">Home</option>
                          <option value="Furniture">Furniture</option>
                          <option value="Decor">Decor</option>
                        </select>
                        
                        <button
                          onClick={() => {
                            setShowForm(true);
                            setEditingProduct(null);
                            resetForm();
                          }}
                          className="bg-black text-white px-6 py-2 font-body font-medium tracking-wider hover:bg-gray-800 transition-colors duration-300 uppercase rounded-lg flex items-center space-x-2"
                        >
                          <Plus size={20} />
                          <span>Add Product</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Advanced Product Manager (CSV Import/Export) */}
                  <div className="mb-8">
                    <AdvancedProductManager onImport={async () => { await fetchProducts(); }} />
                  </div>

                  {/* Product Form */}
                  {showForm && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-heading text-2xl font-medium text-black tracking-wide">
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h2>
                        <button
                          onClick={() => {
                            setShowForm(false);
                            setEditingProduct(null);
                            resetForm();
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                      
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="font-body font-medium text-black mb-2 block">
                              Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                              required
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                            />
                          </div>

                          <div>
                            <label className="font-body font-medium text-black mb-2 block">
                              Category <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.category}
                              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                              required
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                            >
                              <option value="Bags">Bags</option>
                              <option value="Accessories">Accessories</option>
                              <option value="Home">Home</option>
                              <option value="Furniture">Furniture</option>
                              <option value="Decor">Decor</option>
                            </select>
                          </div>

                          <div>
                            <label className="font-body font-medium text-black mb-2 block">
                              Price <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={formData.price}
                              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                              required
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                            />
                          </div>

                          <div>
                            <label className="font-body font-medium text-black mb-2 block">
                              Stock <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={formData.stock}
                              onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                              required
                              className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-body font-medium text-black mb-2 block">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors resize-none"
                          />
                        </div>

                        <div>
                          <label className="font-body font-medium text-black mb-2 block">
                            Images <span className="text-red-500">*</span>
                          </label>
                          <div className="space-y-3">
                            {formData.images.map((image, index) => (
                              <div key={index} className="flex space-x-3">
                                <input
                                  type="text"
                                  value={image}
                                  onChange={(e) => updateImageField(index, e.target.value)}
                                  placeholder="Image URL or local path"
                                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                                />
                                <label className="px-4 py-3 border border-gray-200 rounded-md bg-white cursor-pointer text-sm">
                                  {isUploading ? 'Uploading...' : 'Upload'}
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;
                                      try {
                                        const url = await uploadImage(file);
                                        updateImageField(index, url);
                                      } catch (err) {
                                        setError('Image upload failed');
                                      }
                                    }}
                                  />
                                </label>
                                {formData.images.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeImageField(index)}
                                    className="px-4 py-3 text-red-500 hover:text-red-700 transition-colors"
                                  >
                                    <Trash2 size={20} />
                                  </button>
                                )}
                              </div>
                            ))}
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={addImageField}
                                className="text-amber-600 hover:text-amber-700 font-body font-medium transition-colors"
                              >
                                + Add Another Image
                              </button>
                              <label className="px-4 py-2 border border-gray-200 rounded-md bg-white cursor-pointer text-sm">
                                {isUploading ? 'Uploading...' : 'Upload Multiple'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  className="hidden"
                                  onChange={async (e) => {
                                    const files = e.target.files;
                                    if (!files || files.length === 0) return;
                                    await uploadMultipleImages(files);
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-4 pt-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black text-white px-8 py-3 font-body font-medium tracking-wider hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 uppercase rounded-lg flex items-center space-x-2"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Saving...</span>
                              </>
                            ) : (
                              <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowForm(false);
                              setEditingProduct(null);
                              resetForm();
                            }}
                            className="border-2 border-black text-black px-8 py-3 font-body font-medium tracking-wider hover:bg-black hover:text-white transition-colors duration-300 uppercase rounded-lg"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  )}

                  {/* Advanced Product Manager */}
                  <AdvancedProductManager onImport={() => fetchProducts()} />

                  {/* Products List */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="font-heading text-xl font-medium text-black tracking-wide">
                        Products ({filteredProducts.length})
                      </h3>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                              Category
                            </th>
                            <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                              Stock
                            </th>
                            <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredProducts.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                {searchTerm || selectedCategory !== 'all' 
                                  ? 'No products match your search criteria' 
                                  : 'No products found. Add your first product to get started!'}
                              </td>
                            </tr>
                          ) : (
                            paginatedProducts.map((product) => (
                              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                      {product.images && product.images[0] ? (
                                        <img 
                                          src={product.images[0]} 
                                          alt={product.name}
                                          className="w-12 h-12 object-cover rounded-lg"
                                        />
                                      ) : (
                                        <Package size={20} className="text-gray-500" />
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-body font-medium text-black">{product.name}</p>
                                      <p className="font-body text-sm text-gray-500 truncate max-w-xs">
                                        {product.description}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                    {product.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-heading font-medium text-amber-600">
                                    ${product.price.toLocaleString()}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="font-body text-gray-700">{product.stock}</span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                    product.inStock 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleEdit(product)}
                                      className="text-amber-600 hover:text-amber-700 transition-colors p-2 hover:bg-amber-50 rounded"
                                      title="Edit product"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(product._id)}
                                      className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded"
                                      title="Delete product"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                        <p className="text-sm text-gray-600">Page {currentPage} of {totalPages}</p>
                        <div className="space-x-2">
                          <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-50"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div>
                  <ProfessionalOrdersTable 
                    orders={orders.map(order => ({
                      id: order.id || order._id,
                      userId: order.userId || '',
                      customerEmail: order.customerEmail || '',
                      customerPhone: order.customerPhone || '',
                      items: order.items.map(item => ({
                        productId: item.productId,
                        name: item.name || 'Unknown Product',
                        price: item.price || 0,
                        quantity: item.quantity || 1,
                        image: item.image || ''
                      })),
                      totalPrice: order.totalPrice || 0,
                      status: order.status || 'pending',
                      shippingAddress: {
                        firstName: order.shippingAddress?.firstName || 'Customer',
                        lastName: order.shippingAddress?.lastName || '',
                        fullName: order.shippingAddress?.fullName || '',
                        address: order.shippingAddress?.address || 'Address not provided',
                        city: order.shippingAddress?.city || 'City not provided',
                        state: order.shippingAddress?.state || 'State not provided',
                        zipCode: order.shippingAddress?.zipCode || 'ZIP not provided',
                        country: order.shippingAddress?.country || 'Country not provided',
                        fullAddress: order.shippingAddress?.fullAddress || ''
                      },
                      itemsCount: order.itemsCount || order.items?.length || 0,
                      createdAt: order.createdAt || new Date().toISOString(),
                      updatedAt: order.updatedAt || order.createdAt || new Date().toISOString()
                    }))}
                    onStatusUpdate={updateOrderStatus}
                  />
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h3 className="font-heading text-xl font-medium text-black tracking-wide">
                      Users ({users.length})
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-left font-body font-medium text-gray-600 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                              No users found yet.
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="font-body font-medium text-black">{user.name}</p>
                                  <p className="font-body text-sm text-gray-500">{user.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  user.role === 'admin' 
                                    ? 'bg-purple-100 text-purple-800' 
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <span className="font-body text-sm text-gray-500">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {user._id !== session.user.id && (
                                  <select
                                    value={user.role}
                                    onChange={(e) => updateUserRole(user._id, e.target.value)}
                                    className="px-3 py-1 text-sm border border-gray-200 rounded-md focus:border-amber-400 focus:outline-none"
                                  >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                  </select>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  {usersTotalPages > 0 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
                      <div className="flex items-center gap-3">
                        <p className="text-sm text-gray-600">Page {usersPage} of {usersTotalPages}</p>
                        <select
                          value={usersPageSize}
                          onChange={async (e) => { const size = parseInt(e.target.value); setUsersPageSize(size); await fetchUsers(1, size); }}
                          className="px-3 py-2 border border-gray-200 rounded-md text-sm"
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={async () => { const p = Math.max(1, usersPage - 1); await fetchUsers(p, usersPageSize); }}
                          disabled={usersPage === 1}
                          className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={async () => { const p = Math.min(usersTotalPages, usersPage + 1); await fetchUsers(p, usersPageSize); }}
                          disabled={usersPage === usersTotalPages}
                          className="px-4 py-2 border border-gray-200 rounded-md text-sm disabled:opacity-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Analytics Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
                    <div className="flex items-center space-x-4">
                      <select 
                        value={analyticsPeriod} 
                        onChange={(e) => setAnalyticsPeriod(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="7">Last 7 days</option>
                        <option value="30">Last 30 days</option>
                        <option value="90">Last 90 days</option>
                        <option value="365">Last year</option>
                      </select>
                      <button
                        onClick={refreshAnalytics}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Refresh
                      </button>
                    </div>
                  </div>

                  {/* Analytics Summary */}
                  <AnalyticsSummary data={analyticsData} period={analyticsPeriod} />

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${analyticsData?.overview?.totalRevenue?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Orders</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analyticsData?.overview?.totalOrders || '0'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Total Customers</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {analyticsData?.customers?.total || '0'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <div className="flex items-center">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <TrendingUp className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${analyticsData?.overview?.averageOrderValue?.toFixed(2) || '0'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Conversion Rate</h4>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">
                          {analyticsData?.performance?.conversionRate?.toFixed(2) || '0'}%
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Orders per customer
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Retention</h4>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">
                          {analyticsData?.customers?.repeatRate?.toFixed(2) || '0'}%
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Repeat customers
                        </p>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Completion</h4>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600">
                          {analyticsData?.performance?.orderCompletionRate?.toFixed(2) || '0'}%
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Successful orders
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h4>
                    <div className="h-64">
                      {analyticsData?.revenue?.dailyData?.length > 0 ? (
                        <div className="space-y-2">
                          {analyticsData.revenue.dailyData.slice(-7).map((day: { _id: { year: number; month: number; day: number }; dailyRevenue: number }, index: number) => (
                            <div key={index} className="flex items-center space-x-4">
                              <div className="w-20 text-sm text-gray-600">
                                {new Date(day._id.year, day._id.month - 1, day._id.day).toLocaleDateString()}
                              </div>
                              <div className="flex-1 bg-gray-200 rounded-full h-4">
                                <div 
                                  className="bg-green-500 h-4 rounded-full transition-all duration-300"
                                  style={{ 
                                    width: `${(day.dailyRevenue / Math.max(...analyticsData.revenue.dailyData.map((d: { dailyRevenue: number }) => d.dailyRevenue))) * 100}%` 
                                  }}
                                ></div>
                              </div>
                              <div className="w-24 text-right text-sm font-medium">
                                ${day.dailyRevenue.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No revenue data available
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top Products & Categories */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Performing Products */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h4>
                      <div className="space-y-3">
                        {analyticsData?.products?.topPerformers?.slice(0, 5).map((product: { name: string; totalSold: number; totalRevenue: number }, index: number) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-sm font-bold text-gray-600">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-600">
                                {product.totalSold} sold • ${product.totalRevenue.toFixed(2)} revenue
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Category Performance */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Category Performance</h4>
                      <div className="space-y-3">
                        {analyticsData?.categories?.slice(0, 5).map((category: { _id: string; totalRevenue: number; totalSold: number }, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900">{category._id}</span>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                ${category.totalRevenue.toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-600">{category.totalSold} sold</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Low Stock Alert */}
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alert</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analyticsData?.products?.lowStock?.map((product: { name: string; stock: number }, index: number) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-red-600">Only {product.stock} left</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Monitoring */}
                  <PerformanceMonitor />

                  {/* AB Testing */}
                  <ABTesting />
                </div>
              )}

              {/* Marketing Tab */}
              {activeTab === 'marketing' && (
                <div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                    <h2 className="font-heading text-2xl font-medium text-black mb-6 tracking-wide">
                      Marketing & Promotions
                    </h2>
                    <p className="font-body text-gray-600 mb-8">
                      Manage coupons, promotional banners, email campaigns, and referral programs to boost sales and customer engagement.
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-body text-sm text-amber-700">Active Coupons</p>
                            <p className="font-heading text-2xl font-medium text-amber-900">12</p>
                          </div>
                          <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center">
                            <Package size={16} className="text-amber-700" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-body text-sm text-blue-700">Active Banners</p>
                            <p className="font-heading text-2xl font-medium text-blue-900">5</p>
                          </div>
                          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                            <Megaphone size={16} className="text-blue-700" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-body text-sm text-green-700">Email Campaigns</p>
                            <p className="font-heading text-2xl font-medium text-green-900">8</p>
                          </div>
                          <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                            <Users size={16} className="text-green-700" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-body text-sm text-purple-700">Referrals</p>
                            <p className="font-heading text-2xl font-medium text-purple-900">24</p>
                          </div>
                          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                            <TrendingUp size={16} className="text-purple-700" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Marketing Tools */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Package size={20} className="text-amber-600" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-medium text-black">Coupons</h3>
                            <p className="font-body text-sm text-gray-600">Discount codes & promotions</p>
                          </div>
                        </div>
                        <p className="font-body text-gray-700 mb-4">
                          Create and manage discount codes, percentage offers, and promotional campaigns.
                        </p>
                        <button className="w-full bg-amber-400 text-black px-4 py-2 rounded-lg font-body font-medium hover:bg-amber-300 transition-colors">
                          Manage Coupons
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Megaphone size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-medium text-black">Banners</h3>
                            <p className="font-body text-sm text-gray-600">Promotional announcements</p>
                          </div>
                        </div>
                        <p className="font-body text-gray-700 mb-4">
                          Display promotional banners, notifications, and marketing messages across your site.
                        </p>
                        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-body font-medium hover:bg-blue-600 transition-colors">
                          Manage Banners
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Users size={20} className="text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-medium text-black">Email Marketing</h3>
                            <p className="font-body text-sm text-gray-600">Customer campaigns</p>
                          </div>
                        </div>
                        <p className="font-body text-gray-700 mb-4">
                          Send targeted email campaigns, newsletters, and automated marketing messages.
                        </p>
                        <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-body font-medium hover:bg-green-600 transition-colors">
                          Email Campaigns
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <TrendingUp size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-medium text-black">Referral Program</h3>
                            <p className="font-body text-sm text-gray-600">Customer referrals</p>
                          </div>
                        </div>
                        <p className="font-body text-gray-700 mb-4">
                          Reward customers for referring friends and family to increase customer acquisition.
                        </p>
                        <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg font-body font-medium hover:bg-purple-600 transition-colors">
                          Manage Referrals
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <BarChart3 size={20} className="text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-medium text-black">Analytics</h3>
                            <p className="font-body text-sm text-gray-600">Marketing insights</p>
                          </div>
                        </div>
                        <p className="font-body text-gray-700 mb-4">
                          Track marketing campaign performance, conversion rates, and ROI metrics.
                        </p>
                        <button className="w-full bg-indigo-500 text-white px-4 py-2 rounded-lg font-body font-medium hover:bg-indigo-600 transition-colors">
                          View Analytics
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <AlertTriangle size={20} className="text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-heading text-lg font-medium text-black">A/B Testing</h3>
                            <p className="font-body text-sm text-gray-600">Campaign optimization</p>
                          </div>
                        </div>
                        <p className="font-body text-gray-700 mb-4">
                          Test different marketing messages, designs, and strategies to optimize conversion.
                        </p>
                        <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-body font-medium hover:bg-red-600 transition-colors">
                          Create Tests
                        </button>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="mt-8">
                      <h3 className="font-heading text-xl font-medium text-black mb-4">Recent Marketing Activity</h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              <span className="font-body text-sm text-gray-700">Coupon "SAVE20" created</span>
                            </div>
                            <span className="font-body text-xs text-gray-500">2 hours ago</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="font-body text-sm text-gray-700">Banner "Summer Sale" activated</span>
                            </div>
                            <span className="font-body text-xs text-gray-500">1 day ago</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                              <span className="font-body text-sm text-gray-700">Email campaign "Newsletter #12" sent to 1,250 subscribers</span>
                            </div>
                            <span className="font-body text-xs text-gray-500">3 days ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations Tab */}
              {activeTab === 'integrations' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                  <h2 className="font-heading text-2xl font-medium text-black mb-6 tracking-wide">Integrations</h2>

                  {/* CJ Importer */}
                  <div className="max-w-2xl">
                    <h3 className="font-heading text-xl font-medium text-black mb-3">CJ Dropshipping Import</h3>
                    <p className="font-body text-gray-600 mb-4">Paste CJ product JSON or a list of products to import. We will map fields and create products.</p>

                    <CJImporter onImported={async () => { await fetchProducts(); setSuccessMessage('CJ products imported successfully'); setTimeout(()=>setSuccessMessage(null), 2500); }} />
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
