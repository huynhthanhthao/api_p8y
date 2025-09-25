import { Prisma } from '@prisma/client'

export const supplierGroupSelect = Prisma.validator<Prisma.SupplierGroupFindFirstArgs>()({
  omit: {
    deletedAt: true,
    deletedBy: true,
    createdBy: true,
    updatedBy: true
  }
})

export type SupplierGroup = Prisma.SupplierGroupGetPayload<typeof supplierGroupSelect>
