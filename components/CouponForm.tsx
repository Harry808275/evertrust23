'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Save, Calendar, Tag, DollarSign, Percent } from 'lucide-react';

interface CouponFormProps {
  onClose: () => void;
  onSave: (coupon: any) => void;
  editingCoupon?: any;
}

export default function CouponForm({ onClose, onSave, editingCoupon }: CouponFormProps) {
  const [formData, setFormData] = useState({
    code: editingCoupon?.code || '',
    name: editingCoupon?.name || '',
    description: editingCoupon?.description || '',
    type: editingCoupon?.type || 'percentage',
    value: editingCoupon?.value || 0,
    minimumAmount: editingCoupon?.minimumAmount || '',
    maximumDiscount: editingCoupon?.maximumDiscount || '',
    usageLimit: editingCoupon?.usageLimit || '',
    userLimit: editingCoupon?.userLimit || '',
    validFrom: editingCoupon?.validFrom ? new Date(editingCoupon.validFrom).toISOString().split('T')[0] : '',
    validUntil: editingCoupon?.validUntil ? new Date(editingCoupon.validUntil).toISOString().split('T')[0] : '',
    isActive: editingCoupon?.isActive ?? true,
    applicableProducts: editingCoupon?.applicableProducts || [],
    applicableCategories: editingCoupon?.applicableCategories || [],
    excludedProducts: editingCoupon?.excludedProducts || [],
    excludedCategories: editingCoupon?.excludedCategories || [],
    customerSegments: editingCoupon?.customerSegments || ['all'],
    conditions: {
      firstTimeOnly: editingCoupon?.conditions?.firstTimeOnly || false,
      minimumQuantity: editingCoupon?.conditions?.minimumQuantity || '',
      maximumQuantity: editingCoupon?.conditions?.maximumQuantity || '',
    },
    metadata: {
      campaign: editingCoupon?.metadata?.campaign || '',
      notes: editingCoupon?.metadata?.notes || ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    if (name.startsWith('conditions.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        conditions: {
          ...prev.conditions,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('metadata.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Prepare data for API
      const submitData = {
        ...formData,
        value: parseFloat(formData.value.toString()),
        minimumAmount: formData.minimumAmount ? parseFloat(formData.minimumAmount.toString()) * 100 : undefined,
        maximumDiscount: formData.maximumDiscount ? parseFloat(formData.maximumDiscount.toString()) * 100 : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit.toString()) : undefined,
        userLimit: formData.userLimit ? parseInt(formData.userLimit.toString()) : undefined,
        validFrom: formData.validFrom ? new Date(formData.validFrom) : new Date(),
        validUntil: new Date(formData.validUntil),
        conditions: {
          ...formData.conditions,
          minimumQuantity: formData.conditions.minimumQuantity ? parseInt(formData.conditions.minimumQuantity.toString()) : undefined,
          maximumQuantity: formData.conditions.maximumQuantity ? parseInt(formData.conditions.maximumQuantity.toString()) : undefined,
        }
      };

      const url = editingCoupon ? `/api/coupons/${editingCoupon._id}` : '/api/coupons';
      const method = editingCoupon ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save coupon');
      }

      const savedCoupon = await response.json();
      onSave(savedCoupon);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save coupon');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-medium text-black">
              {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600 font-body">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Coupon Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  placeholder="SAVE20"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Coupon Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="20% Off Sale"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="font-body font-medium text-black mb-2 block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Get 20% off your entire order"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Discount Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Discount Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>

              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  {formData.type === 'percentage' ? 'Percentage' : 'Amount'} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="value"
                    value={formData.value}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max={formData.type === 'percentage' ? 100 : undefined}
                    step={formData.type === 'percentage' ? 0.01 : 0.01}
                    placeholder={formData.type === 'percentage' ? '20' : '10.00'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {formData.type === 'percentage' ? <Percent size={20} /> : <DollarSign size={20} />}
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Limits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Minimum Order Amount ($)
                </label>
                <input
                  type="number"
                  name="minimumAmount"
                  value={formData.minimumAmount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="50.00"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Maximum Discount ($)
                </label>
                <input
                  type="number"
                  name="maximumDiscount"
                  value={formData.maximumDiscount}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  placeholder="100.00"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Usage Limit
                </label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Per User Limit
                </label>
                <input
                  type="number"
                  name="userLimit"
                  value={formData.userLimit}
                  onChange={handleInputChange}
                  min="1"
                  placeholder="1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Validity Period */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Valid From <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Valid Until <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="validUntil"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Customer Segments */}
            <div>
              <label className="font-body font-medium text-black mb-2 block">
                Customer Segments
              </label>
              <select
                name="customerSegments"
                value={formData.customerSegments[0] || 'all'}
                onChange={(e) => setFormData(prev => ({ ...prev, customerSegments: [e.target.value] }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
              >
                <option value="all">All Customers</option>
                <option value="new">New Customers Only</option>
                <option value="returning">Returning Customers</option>
                <option value="vip">VIP Customers</option>
              </select>
            </div>

            {/* Conditions */}
            <div className="space-y-4">
              <h3 className="font-heading text-lg font-medium text-black">Conditions</h3>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="conditions.firstTimeOnly"
                  checked={formData.conditions.firstTimeOnly}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-400"
                />
                <span className="font-body text-gray-700">First-time customers only</span>
              </label>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Campaign
                </label>
                <input
                  type="text"
                  name="metadata.campaign"
                  value={formData.metadata.campaign}
                  onChange={handleInputChange}
                  placeholder="Summer Sale 2024"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="font-body font-medium text-black mb-2 block">
                  Status
                </label>
                <select
                  name="isActive"
                  value={formData.isActive.toString()}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'true' }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-body font-medium text-black mb-2 block">
                Notes
              </label>
              <textarea
                name="metadata.notes"
                value={formData.metadata.notes}
                onChange={handleInputChange}
                rows={3}
                placeholder="Internal notes about this coupon"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-body text-gray-700 focus:border-amber-400 focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 font-body font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-6 py-3 font-body font-medium tracking-wider transition-colors duration-300 uppercase rounded-lg ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-amber-400 text-black hover:bg-amber-300'
                }`}
              >
                <Save size={20} />
                <span>{isSubmitting ? 'Saving...' : 'Save Coupon'}</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

