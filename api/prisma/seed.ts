
const { PrismaClient } = require('@prisma/client')
const transactions = require('./transactions.json')

const prisma = new PrismaClient()

async function seed() {
  await prisma.transaction.createMany({
    data: transactions.map(({ description, createdAt, updatedAt, transactionDate, ...transaction }: any) => ({
      ...transaction,
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
      description: String(description),
      transactionDate: new Date(transactionDate),
    })),
  })
}

seed()
  .then(() => {
    console.log('Seeder has been completed successfully!')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async() => {
    await prisma.$disconnect()
  })
