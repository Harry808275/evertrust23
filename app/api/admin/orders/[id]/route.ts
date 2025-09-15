import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getCjClient } from '@/lib/cjClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const { id } = await params;
    
    // Fetch order with all details
    const order = await Order.findById(id).lean();
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format order with complete information
    const formattedOrder = {
      id: order._id,
      userId: order.userId,
      items: order.items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        totalItemPrice: item.price * item.quantity
      })),
      totalPrice: order.totalPrice,
      status: order.status,
      shippingAddress: {
        firstName: order.shippingAddress.firstName,
        lastName: order.shippingAddress.lastName,
        fullName: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
        address: order.shippingAddress.address,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        zipCode: order.shippingAddress.zipCode,
        country: order.shippingAddress.country,
        fullAddress: `${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}, ${order.shippingAddress.country}`
      },
      itemsCount: order.items.length,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      specialInstructions: order.specialInstructions,
      privacyInstructions: order.privacyInstructions
    };
    
    return NextResponse.json({
      success: true,
      order: formattedOrder
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order details' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    const { id } = await params;
    const body = await request.json();
    const { status, action } = body || {};

    // Update order status
    let updatedOrder = await Order.findByIdAndUpdate(
      id,
      { ...(status ? { status } : {}) },
      { new: true }
    );
    
    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Push order to CJ if requested
    if (action === 'pushToCJ' && !updatedOrder.externalOrderId) {
      try {
        const cj = getCjClient();
        const payload = {
          customerName: `${updatedOrder.shippingAddress.firstName} ${updatedOrder.shippingAddress.lastName}`,
          address: updatedOrder.shippingAddress.address,
          city: updatedOrder.shippingAddress.city,
          state: updatedOrder.shippingAddress.state,
          zip: updatedOrder.shippingAddress.zipCode,
          country: updatedOrder.shippingAddress.country,
          phone: updatedOrder.customerPhone || '',
          email: updatedOrder.customerEmail || '',
          items: updatedOrder.items.map((it) => ({ name: it.name, quantity: it.quantity, price: it.price })),
        };
        // Example endpoint; replace with official CJ order API when available
        await fetch(`${process.env.CJ_BASE_URL || 'https://developers.cjdropshipping.com'}/api/order/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then(res => res.json()).then(async (data) => {
          const externalId = data?.orderId || data?.id || data?.data?.orderId;
          if (externalId) {
            updatedOrder!.externalOrderId = externalId;
            await updatedOrder!.save();
          }
        }).catch(() => {});
      } catch (e) {
        console.error('Push to CJ failed:', e);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}






          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }).then(res => res.json()).then(async (data) => {
          const externalId = data?.orderId || data?.id || data?.data?.orderId;
          if (externalId) {
            updatedOrder!.externalOrderId = externalId;
            await updatedOrder!.save();
          }
        }).catch(() => {});
      } catch (e) {
        console.error('Push to CJ failed:', e);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      order: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}





