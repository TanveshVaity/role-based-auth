import { NextRequest, NextResponse } from 'next/server';
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
    console.error('get products error', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req : NextRequest){
  try {
    const { name, description, price, stock, categories } = await req.json();

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        inventory: {
          create: {
            available: stock,
            sold: 0,
          },
        },
        categories: {
          create: categories.map((catId: string) => ({
            category: {
              connect: { id: catId },
            },
          })),
        },
      },
      include: {
        inventory: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    // Map categories for easier use on frontend
    const productWithCats = {
      ...product,
      categories: product.categories.map((pc) => pc.category),
    };

    return NextResponse.json(productWithCats);
  } catch (err) {
    console.error('add products error', err);
    return NextResponse.json({ error: 'Failed to add products' }, { status: 500 });
  }
}