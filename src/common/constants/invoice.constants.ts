import { Prisma } from '@prisma/client'
import { USER_INCLUDE_FIELDS } from './user.constants'

export const INVOICE_INCLUDE_FIELDS = {
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  },
  include: {
    invoiceItems: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      },
      include: {
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
        },
        productLot: {
          omit: {
            deletedAt: true,
            deletedBy: true,
            createdBy: true,
            updatedBy: true
          }
        }
      }
    },
    customer: {
      select: {
        id: true,
        name: true,
        code: true,
        avatar: {
          select: {
            id: true,
            filename: true,
            path: true
          }
        },
        phone: true,
        email: true
      }
    },
    creator: {
      ...USER_INCLUDE_FIELDS
    }
  }
} as const satisfies Partial<Prisma.InvoiceFindUniqueArgs>
