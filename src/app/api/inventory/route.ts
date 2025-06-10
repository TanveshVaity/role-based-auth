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

export async function POST(req: Request) {
  try {
    const { productId, available, sold } = await req.json();
    
    // Validate input
    if (!productId || isNaN(available) || isNaN(sold)) {
      return NextResponse.json(
        { error: 'Invalid input data' },
        { status: 400 }
      );
    }

    const newItem = await prisma.inventory.create({
      data: {
        productId,
        available: parseInt(available),
        sold: parseInt(sold),
      },
      include: { product: true },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error('POST inventory error', err);
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    );
  }
}