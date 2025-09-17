import { Prisma } from '@prisma/client'

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
    }
  }
} as const satisfies Partial<Prisma.InvoiceFindUniqueArgs>
