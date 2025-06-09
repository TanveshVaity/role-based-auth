import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.inventory.findMany({
      include: { product: true },  
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error('GET inventory error', err);
    return NextResponse.json({ error: 'Failed to fetch inventory' }, { status: 500 });
  }
}

