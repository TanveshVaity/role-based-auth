import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        products: {
          select: { category: { select: { id: true, name: true } } },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (err) {
    console.error('GET categories error', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
