import { STOCK_TRANSACTION_INCLUDE_FIELDS } from '@common/constants/'
import { Prisma } from '@prisma/client'

export const stockTransactionSelect = Prisma.validator<Prisma.StockTransactionFindFirstArgs>()({
  ...STOCK_TRANSACTION_INCLUDE_FIELDS
})

export type StockTransaction = Prisma.StockTransactionGetPayload<typeof stockTransactionSelect>
