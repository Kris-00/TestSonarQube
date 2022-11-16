import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const admin = await prisma.account.upsert({
    where: { email: 'admin@fakelazada.com' },
    update: {},
    create: {
      email: 'admin@fakelazada.com',
      role: 4, // Admin
      is_loggedin: false,
      last_loggedin_ip: "1.1.1.1",
      password_hash: '$2a$15$i29va5igRbAGf6Cd4iVvwOHf41LnZcv0Jd/3WuRO4H9/BQ.qolp8y',
      admin: {
        create: {
            first_name: "Systerm",
            last_name: "Administrator"
        }
      }
    },
  })
  
  console.log("[Prisma] Successfully seeded data")
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })