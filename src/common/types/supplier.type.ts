import { Prisma } from '@prisma/client'

export const supplierSelect = Prisma.validator<Prisma.SupplierFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  },
  include: {
    supplierGroup: {
      omit: {
        deletedAt: true,
        deletedBy: true,
        createdBy: true,
        updatedBy: true
      }
    }
  }
})

export type Supplier = Prisma.SupplierGetPayload<typeof supplierSelect>
