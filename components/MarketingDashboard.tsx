'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Tag, 
  Megaphone, 
  Mail, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  MousePointer,
  BarChart3,
  Calendar,
  Target,
  DollarSign
} from 'lucide-react';

interface Coupon {
  _id: string;
  code: string;
  name: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  usageCount: number;
  usageLimit?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  discountAmount?: number;
}

interface PromotionalBanner {
  _id: string;
  title: string;
  type: 'hero' | 'top_bar' | 'banner' | 'popup';
  position: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  tracking: {
    impressions: number;
    clicks: number;
    conversions: number;
  };
}

interface EmailCampaign {
  _id: string;
  name: string;
  type: string;
  status: 'draft' | 'scheduled' | 'sent';
  tracking: {
    sent: number;
    opened: number;
    clicked: number;
    revenue?: number;
  };
}

type TabType = 'coupons' | 'banners' | 'email' | 'analytics';

export default function MarketingDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('coupons');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [emailCampaigns, setEmailCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [showBannerForm, setShowBannerForm] = useState(false);

  // Fetch data
  useEffect(() => {
    fetchMarketingData();
  }, []);

  const fetchMarketingData = async () => {
    try {
      setLoading(true);
      const [couponsRes, bannersRes, emailRes] = await Promise.all([
        fetch('/api/coupons'),
        fetch('/api/promotional-banners'),
        fetch('/api/email-campaigns')
      ]);

      if (couponsRes.ok) {
        const couponsData = await couponsRes.json();
        setCoupons(couponsData.coupons || []);
      }

      if (bannersRes.ok) {
        const bannersData = await bannersRes.json();
        setBanners(bannersData.banners || []);
      }

      if (emailRes.ok) {
        const emailData = await emailRes.json();
        setEmailCampaigns(emailData.campaigns || []);
      }
    } catch (error) {
      console.error('Error fetching marketing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCouponStatus = (coupon: Coupon) => {
    const now = new Date();
    const startDate = new Date(coupon.validFrom);
    const endDate = new Date(coupon.validUntil);

    if (!coupon.isActive) return 'Inactive';
    if (now < startDate) return 'Scheduled';
    if (now > endDate) return 'Expired';
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return 'Limit Reached';
    return 'Active';
  };

  const getCouponStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      case 'Limit Reached': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBannerStatus = (banner: PromotionalBanner) => {
    const now = new Date();
    const startDate = new Date(banner.startDate);
    const endDate = new Date(banner.endDate);

    if (!banner.isActive) return 'Inactive';
    if (now < startDate) return 'Scheduled';
    if (now > endDate) return 'Expired';
    return 'Active';
  };

  const getBannerStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'Expired': return 'text-red-600 bg-red-100';
      case 'Inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getEmailStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="font-heading text-4xl font-light text-black mb-4 tracking-wide">
            Marketing Dashboard
          </h1>
          <p className="font-body text-lg text-gray-600">
            Manage promotional campaigns, coupons, and marketing analytics
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-gray-600">Active Coupons</p>
                <p className="font-heading text-2xl font-medium text-black">
                  {coupons.filter(c => getCouponStatus(c) === 'Active').length}
                </p>
              </div>
              <Tag className="w-8 h-8 text-amber-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-gray-600">Active Banners</p>
                <p className="font-heading text-2xl font-medium text-black">
                  {banners.filter(b => getBannerStatus(b) === 'Active').length}
                </p>
              </div>
              <Megaphone className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-gray-600">Email Campaigns</p>
                <p className="font-heading text-2xl font-medium text-black">
                  {emailCampaigns.length}
                </p>
              </div>
              <Mail className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-sm text-gray-600">Total Revenue</p>
                <p className="font-heading text-2xl font-medium text-black">
                  ${emailCampaigns.reduce((sum, c) => sum + (c.tracking.revenue || 0), 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm mb-8"
        >
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'coupons', label: 'Coupons', icon: Tag },
                { id: 'banners', label: 'Banners', icon: Megaphone },
                { id: 'email', label: 'Email Campaigns', icon: Mail },
                { id: 'analytics', label: 'Analytics', icon: BarChart3 }
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as TabType)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-body font-medium transition-colors ${
                    activeTab === id
                      ? 'border-amber-400 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Coupons Tab */}
            {activeTab === 'coupons' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-medium text-black">Coupon Management</h2>
                  <button
                    onClick={() => setShowCouponForm(true)}
                    className="flex items-center space-x-2 bg-amber-400 text-black px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Create Coupon</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Code</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Value</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Usage</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {coupons.map((coupon) => {
                        const status = getCouponStatus(coupon);
                        return (
                          <tr key={coupon._id} className="border-b border-gray-100">
                            <td className="py-3 px-4 font-body font-medium text-black">{coupon.code}</td>
                            <td className="py-3 px-4 font-body text-gray-700">{coupon.name}</td>
                            <td className="py-3 px-4 font-body text-gray-700 capitalize">{coupon.type}</td>
                            <td className="py-3 px-4 font-body text-gray-700">
                              {coupon.type === 'percentage' ? `${coupon.value}%` : `$${(coupon.value / 100).toFixed(2)}`}
                            </td>
                            <td className="py-3 px-4 font-body text-gray-700">
                              {coupon.usageCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ''}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCouponStatusColor(status)}`}>
                                {status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-2">
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Eye size={16} />
                                </button>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Edit size={16} />
                                </button>
                                <button className="text-gray-400 hover:text-red-600">
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Banners Tab */}
            {activeTab === 'banners' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-medium text-black">Promotional Banners</h2>
                  <button
                    onClick={() => setShowBannerForm(true)}
                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus size={20} />
                    <span>Create Banner</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((banner) => {
                    const status = getBannerStatus(banner);
                    return (
                      <div key={banner._id} className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-heading text-lg font-medium text-black">{banner.title}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getBannerStatusColor(status)}`}>
                            {status}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><span className="font-medium">Type:</span> {banner.type}</p>
                          <p><span className="font-medium">Position:</span> {banner.position}</p>
                          <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <Eye size={14} />
                                <span>{banner.tracking.impressions}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MousePointer size={14} />
                                <span>{banner.tracking.clicks}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-400 hover:text-gray-600">
                                <Edit size={16} />
                              </button>
                              <button className="text-gray-400 hover:text-red-600">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Email Campaigns Tab */}
            {activeTab === 'email' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-medium text-black">Email Campaigns</h2>
                  <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                    <Plus size={20} />
                    <span>Create Campaign</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Name</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Type</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Status</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Sent</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Open Rate</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Click Rate</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Revenue</th>
                        <th className="text-left py-3 px-4 font-body font-medium text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailCampaigns.map((campaign) => (
                        <tr key={campaign._id} className="border-b border-gray-100">
                          <td className="py-3 px-4 font-body font-medium text-black">{campaign.name}</td>
                          <td className="py-3 px-4 font-body text-gray-700 capitalize">{campaign.type}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEmailStatusColor(campaign.status)}`}>
                              {campaign.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-body text-gray-700">{campaign.tracking.sent}</td>
                          <td className="py-3 px-4 font-body text-gray-700">
                            {campaign.tracking.sent > 0 
                              ? `${((campaign.tracking.opened / campaign.tracking.sent) * 100).toFixed(1)}%`
                              : '0%'
                            }
                          </td>
                          <td className="py-3 px-4 font-body text-gray-700">
                            {campaign.tracking.sent > 0 
                              ? `${((campaign.tracking.clicked / campaign.tracking.sent) * 100).toFixed(1)}%`
                              : '0%'
                            }
                          </td>
                          <td className="py-3 px-4 font-body text-gray-700">
                            ${(campaign.tracking.revenue || 0).toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button className="text-gray-400 hover:text-gray-600">
                                <Eye size={16} />
                              </button>
                              <button className="text-gray-400 hover:text-gray-600">
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="font-heading text-2xl font-medium text-black mb-6">Marketing Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-heading text-lg font-medium text-black mb-4">Coupon Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-body text-gray-600">Total Coupons Created</span>
                        <span className="font-body font-medium">{coupons.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-body text-gray-600">Active Coupons</span>
                        <span className="font-body font-medium">{coupons.filter(c => getCouponStatus(c) === 'Active').length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-body text-gray-600">Total Usage</span>
                        <span className="font-body font-medium">{coupons.reduce((sum, c) => sum + c.usageCount, 0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-heading text-lg font-medium text-black mb-4">Banner Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-body text-gray-600">Total Banners</span>
                        <span className="font-body font-medium">{banners.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-body text-gray-600">Total Impressions</span>
                        <span className="font-body font-medium">{banners.reduce((sum, b) => sum + b.tracking.impressions, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-body text-gray-600">Total Clicks</span>
                        <span className="font-body font-medium">{banners.reduce((sum, b) => sum + b.tracking.clicks, 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

