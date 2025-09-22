import { Prisma } from '@prisma/client'

export const STOCK_CARD_SELECT_FIELDS = {
  select: {
    id: true,
    type: true,
    invoice: {
      select: {
        id: true,
        code: true,
        invoiceItems: {
          select: {
            id: true,
            productLotId: true,
            quantity: true,
            productId: true,
            productLot: {
              select: {
                id: true,
                name: true,
                stockQuantity: true,
                productId: true,
                expiryAt: true
              }
            }
          }
        }
      }
    },
    transaction: {
      select: {
        id: true,
        code: true,
        type: true,
        stockItems: {
          select: {
            id: true,
            productLotId: true,
            quantity: true,
            previousStock: true,
            productId: true,
            productLot: {
              select: {
                id: true,
                name: true,
                stockQuantity: true,
                productId: true,
                expiryAt: true
              }
            }
          }
        }
      }
    },
    createdAt: true
  }
} as const satisfies Partial<Prisma.StockCardFindUniqueArgs>
