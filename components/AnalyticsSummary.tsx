'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Target,
  BarChart3
} from 'lucide-react';

interface AnalyticsSummaryProps {
  data: any;
  period: string;
}

export default function AnalyticsSummary({ data, period }: AnalyticsSummaryProps) {
  if (!data) return null;

  const { overview, customers, performance } = data;

  const getGrowthIndicator = (current: number, previous: number) => {
    if (!previous) return { trend: 'neutral', percentage: 0, color: 'text-gray-600' };
    
    const percentage = ((current - previous) / previous) * 100;
    const trend = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'neutral';
    const color = percentage > 0 ? 'text-green-600' : percentage < 0 ? 'text-red-600' : 'text-gray-600';
    
    return { trend, percentage: Math.abs(percentage), color };
  };

  const revenueGrowth = getGrowthIndicator(overview?.totalRevenue || 0, 0);
  const ordersGrowth = getGrowthIndicator(overview?.totalOrders || 0, 0);
  const customersGrowth = getGrowthIndicator(customers?.total || 0, 0);

  return (
    <div className="space-y-6">
      {/* Period Selector and Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Analytics Summary</h3>
          <p className="text-sm text-gray-600">Last {period} days performance overview</p>
        </div>
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">Real-time data</span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className={`flex items-center space-x-1 ${revenueGrowth.color}`}>
              {revenueGrowth.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : revenueGrowth.trend === 'down' ? (
                <TrendingDown className="h-4 w-4" />
              ) : null}
              <span className="text-sm font-medium">
                {revenueGrowth.trend !== 'neutral' ? `${revenueGrowth.percentage.toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${overview?.totalRevenue?.toLocaleString() || '0'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              ${overview?.averageOrderValue?.toFixed(2) || '0'} avg order
            </p>
          </div>
        </motion.div>

        {/* Orders */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div className={`flex items-center space-x-1 ${ordersGrowth.color}`}>
              {ordersGrowth.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : ordersGrowth.trend === 'down' ? (
                <TrendingDown className="h-4 w-4" />
              ) : null}
              <span className="text-sm font-medium">
                {ordersGrowth.trend !== 'neutral' ? `${ordersGrowth.percentage.toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {overview?.totalOrders || '0'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {performance?.orderCompletionRate?.toFixed(1) || '0'}% completion rate
            </p>
          </div>
        </motion.div>

        {/* Customers */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className={`flex items-center space-x-1 ${customersGrowth.color}`}>
              {customersGrowth.trend === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : customersGrowth.trend === 'down' ? (
                <TrendingDown className="h-4 w-4" />
              ) : null}
              <span className="text-sm font-medium">
                {customersGrowth.trend !== 'neutral' ? `${customersGrowth.percentage.toFixed(1)}%` : '0%'}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">
              {customers?.total || '0'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {customers?.repeatRate?.toFixed(1) || '0'}% repeat rate
            </p>
          </div>
        </motion.div>

        {/* Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Package className="h-6 w-6 text-amber-600" />
            </div>
            <div className="p-2 bg-gray-100 rounded-lg">
              <Target className="h-4 w-4 text-gray-600" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Products</p>
            <p className="text-2xl font-bold text-gray-900">
              {overview?.totalProducts || '0'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data?.products?.lowStock?.length || '0'} low stock alerts
            </p>
          </div>
        </motion.div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Conversion Performance</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversion Rate</span>
              <span className="text-lg font-bold text-blue-600">
                {performance?.conversionRate?.toFixed(2) || '0'}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue per User</span>
              <span className="text-lg font-bold text-green-600">
                ${performance?.revenuePerUser?.toFixed(2) || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Order Completion</span>
              <span className="text-lg font-bold text-purple-600">
                {performance?.orderCompletionRate?.toFixed(2) || '0'}%
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Customer Insights</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Value</span>
              <span className="text-lg font-bold text-green-600">
                ${customers?.averageValue?.toFixed(2) || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Repeat Customers</span>
              <span className="text-lg font-bold text-purple-600">
                {customers?.repeatRate?.toFixed(1) || '0'}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New vs Returning</span>
              <span className="text-sm text-gray-500">
                {customers?.total ? Math.round((customers.total - (customers.total * customers.repeatRate / 100)) / customers.total * 100) : 0}% new
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h4>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
              View Detailed Reports
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm">
              Export Data
            </button>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors text-sm">
              Set Alerts
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

