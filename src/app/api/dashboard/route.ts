import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request): Promise<Response> {
  try {
    const [totalProducts, totalCategories, inventoryAgg] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.inventory.aggregate({ _sum: { available: true } }).then(r => r._sum.available ?? 0),
    ]);

    const data = {
      totalProducts,
      totalCategories,
      totalInventory: inventoryAgg,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Dashboard stats error', err);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
