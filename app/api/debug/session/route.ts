import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user ? {
        email: session.user.email,
        role: session.user.role,
        name: session.user.name
      } : null,
      isAdmin: session?.user?.role === 'admin'
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      hasSession: false
    });
  }
}
