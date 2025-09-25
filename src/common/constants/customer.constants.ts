import { Prisma } from '@prisma/client'

export const CUSTOMER_INCLUDE_FIELDS = {
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  },
  include: {
    customerInvoiceInfo: true,
    customerGroup: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    },
    avatar: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    }
  }
} as const satisfies Partial<Prisma.CustomerFindUniqueArgs>
