
const cors = require('cors')
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const app = express()
const prisma = new PrismaClient()

app.use(cors())

app.get('/transactions', async (req, res) => {
  let page = 1
  const limit = 25
  if (Number.isInteger(+req.query.page) && req.query.page > 0) {
    page = Number(req.query.page)
  }

  const offset = (page - 1) * limit

  let query = {}
  if (req.query.date_from && req.query.date_to) {
    query = {
      ...query,
      where: {
        transactionDate: {
          gte: new Date(req.query.date_from),
          lt:  new Date(req.query.date_to)
        },
      },
    }
  }

  const items = await prisma.transaction.findMany({
    ...query,
    take: limit,
    skip: offset,
    orderBy: {
      transactionDate: 'desc'
    }
  })

  const total = await prisma.transaction.count({
    ...query,
  })

  res.json({
    items,
    total,
  })
})

app.get('/transactions/:id', async (req, res) => {
  const transaction = await prisma.transaction.findFirst({
    where: {
      id: req.params.id,
    }
  })

  if (transaction) {
    res.json({
      transaction,
    })
  } else {
    res.status(404).json({
      message: 'The requested transaction is not exist',
    })
  }
})

app.listen(process.env.APP_PORT)
