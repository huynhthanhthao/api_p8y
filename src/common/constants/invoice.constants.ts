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
        invoiceItemLots: true
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
