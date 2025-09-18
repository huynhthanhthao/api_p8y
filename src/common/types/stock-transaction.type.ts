import { USER_INCLUDE_FIELDS } from '@common/constants'
import { Prisma } from '@prisma/client'

export const stockTransactionSelect = Prisma.validator<Prisma.StockTransactionFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  },
  include: {
    creator: {
      ...USER_INCLUDE_FIELDS
    },
    items: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    },
    supplier: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    }
  }
})

export type StockTransaction = Prisma.StockTransactionGetPayload<typeof stockTransactionSelect>
