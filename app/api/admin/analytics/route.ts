import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    // Get query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Basic counts
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Revenue analytics
    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['completed', 'shipped', 'delivered'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          dailyRevenue: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Calculate total revenue and average order value
    const totalRevenue = revenueData.reduce((sum, day) => sum + day.dailyRevenue, 0);
    const totalOrderCount = revenueData.reduce((sum, day) => sum + day.orderCount, 0);
    const averageOrderValue = totalOrderCount > 0 ? totalRevenue / totalOrderCount : 0;

    // Top performing products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['completed', 'shipped', 'delivered'] }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $sort: { totalSold: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          totalRevenue: 1,
          image: { $arrayElemAt: ['$product.images', 0] }
        }
      }
    ]);

    // Customer analytics
    const customerAnalytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$userId',
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          averageCustomerValue: { $avg: '$totalSpent' },
          repeatCustomers: {
            $sum: {
              $cond: [{ $gte: ['$orderCount', 2] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Order status distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Low stock products
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
      inStock: true
    }).select('name stock price images').limit(10);

    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          newUsers: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Category performance
    const categoryPerformance = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: ['completed', 'shipped', 'delivered'] }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      {
        $unwind: '$product'
      },
      {
        $group: {
          _id: '$product.category',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]);

    // Performance metrics
    const performanceMetrics = {
      conversionRate: totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0,
      revenuePerUser: totalUsers > 0 ? totalRevenue / totalUsers : 0,
      orderCompletionRate: totalOrders > 0 ? 
        (orderStatusDistribution.find(s => s._id === 'completed')?.count || 0) / totalOrders * 100 : 0
    };

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalUsers,
          totalOrders,
          totalRevenue,
          averageOrderValue,
          period: `${period} days`
        },
        revenue: {
          dailyData: revenueData,
          totalRevenue,
          averageOrderValue
        },
        products: {
          topPerformers: topProducts,
          lowStock: lowStockProducts
        },
        customers: {
          total: customerAnalytics[0]?.totalCustomers || 0,
          averageValue: customerAnalytics[0]?.averageCustomerValue || 0,
          repeatRate: customerAnalytics[0]?.totalCustomers > 0 ? 
            (customerAnalytics[0]?.repeatCustomers / customerAnalytics[0]?.totalCustomers) * 100 : 0
        },
        orders: {
          statusDistribution: orderStatusDistribution,
          completionRate: performanceMetrics.orderCompletionRate
        },
        growth: {
          userGrowth,
          conversionRate: performanceMetrics.conversionRate,
          revenuePerUser: performanceMetrics.revenuePerUser
        },
        categories: categoryPerformance,
        performance: performanceMetrics
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}




