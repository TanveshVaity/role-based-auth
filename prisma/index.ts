import { PrismaClient } from "@/generated/prisma";
const prisma = new PrismaClient();

async function main() {
  const now = new Date();

  const category = await prisma.category.create({
    data: {
      name: "Sample Category",
      description: "A test category",
      createdAt: now,
      updatedAt: now,
    },
  });

  const product = await prisma.product.create({
    data: {
      name: "Sample Product",
      description: "A test product",
      price: 100,
      stock: 10,
      createdAt: now,
      updatedAt: now,
      categories: {
        create: {
          category: {
            connect: { id: category.id },
          },
        },
      },
    },
  });

  const inventory = await prisma.inventory.create({
    data: {
      available: 50,
      sold: 0,
      product: {
        connect: { id: product.id },
      },
      createdAt: now,
      updatedAt: now,
    },
  });

  console.log({category, product, inventory });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
