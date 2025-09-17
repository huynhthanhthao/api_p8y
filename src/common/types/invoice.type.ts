import { Prisma } from '@prisma/client'

export const select = Prisma.validator<Prisma.InvoiceFindFirstArgs>()({
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
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    }
  }
})

export type Invoice = Prisma.InvoiceGetPayload<typeof select>
