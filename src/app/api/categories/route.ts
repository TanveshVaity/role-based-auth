import { NextResponse, NextRequest } from 'next/server';
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

export async function POST(req: NextRequest) {
  const { name, description, products } = await req.json();
  try {
    const category = await prisma.category.create({
      data: {
        name,
        description,
        products: {
          create: products.map((pid: string) => ({ product: { connect: { id: pid } } })),
        },
      },
      include: { products: { select: { product: { select: { id: true, name: true } } } } },
    });
    return NextResponse.json({
      id: category.id,
      name: category.name,
      description: category.description,
      products: category.products.map((pc) => pc.product),
    });
  } catch (error) {
    return NextResponse.json({ error: "Error creating category" }, { status: 500 });
  }
}
