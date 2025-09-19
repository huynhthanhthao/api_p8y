import { Prisma } from '@prisma/client'
import { USER_INCLUDE_FIELDS } from './user.constants'

export const STOCK_TRANSACTION_INCLUDE_FIELDS = {
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  },
  include: {
    stockItems: {
      include: {
        productLot: {
          omit: {
            deletedAt: true,
            deletedBy: true,
            createdBy: true,
            updatedBy: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            code: true,
            deletedAt: true,
            photos: {
              select: {
                id: true,
                filename: true,
                path: true
              },
              take: 1
            },
            barcode: true
          }
        }
      }
    },
    supplier: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    },
    creator: {
      ...USER_INCLUDE_FIELDS
    },
    reviewer: {
      ...USER_INCLUDE_FIELDS
    }
  }
} as const satisfies Partial<Prisma.StockTransactionFindUniqueArgs>
