import { PrismaClient } from "@/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  // ... you will write your Prisma Client queries here
    const allUsers = await prisma.user.create({
        data: {
            clerkId: "2e1rf",
            username: "tan",
            email: "tan@gmail.com",
            role: "admin",
            password: "tan",
        }
    });
    console.log(allUsers)
}

main()
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })