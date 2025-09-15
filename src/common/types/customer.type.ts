import { Prisma } from '@prisma/client'

export const customerSelect = Prisma.validator<Prisma.CustomerFindFirstArgs>()({
  include: {
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
    },
    customerInvoiceInfo: true
  },
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  }
})

export type Customer = Prisma.CustomerGetPayload<typeof customerSelect>
