import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        categories: {
          select: {
            category: { select: { id: true, name: true } },
          },
        },
        inventory: true,
      },
    });
    return NextResponse.json(products);
  } catch (err) {
    console.error('GET products error', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
